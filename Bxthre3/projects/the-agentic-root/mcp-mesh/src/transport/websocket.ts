/**
 * WebSocket Transport — Bidirectional Real-time Communication
 * 
 * Provides full-duplex WebSocket communication for cross-platform mesh.
 * Supports JSON message framing, automatic reconnection, and heartbeats.
 */

import { PeerId, MeshMessage } from "../protocol/v2.js";

export interface WSSConfig {
  peerId: PeerId;
  url: string;
  apiKey?: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  heartbeatTimeout?: number;
}

interface PendingCall {
  resolve: (msg: MeshMessage) => void;
  reject: (err: Error) => void;
  timestamp: number;
}

export class WSS_Transport {
  private config: Required<WSSConfig>;
  private ws?: WebSocket;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimeout?: NodeJS.Timeout;
  private heartbeatInterval?: NodeJS.Timeout;
  private pendingCalls: Map<string, PendingCall> = new Map();
  private messageQueue: MeshMessage[] = [];
  private onMessageCallback?: (msg: MeshMessage) => void;
  private onErrorCallback?: (err: Error) => void;
  private onDisconnectCallback?: () => void;
  private onConnectCallback?: () => void;

  constructor(config: WSSConfig) {
    const defaults: Required<WSSConfig> = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      heartbeatTimeout: 90000,
      ...config,
    };
    // Need to use Object.assign to avoid type issues
    this.config = Object.assign({}, defaults) as Required<WSSConfig>;
  }

  // Event handlers
  onMessage(cb: (msg: MeshMessage) => void): void {
    this.onMessageCallback = cb;
  }

  onError(cb: (err: Error) => void): void {
    this.onErrorCallback = cb;
  }

  onDisconnect(cb: () => void): void {
    this.onDisconnectCallback = cb;
  }

  onConnect(cb: () => void): void {
    this.onConnectCallback = cb;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const headers: Record<string, string> = {};
        if (this.config.apiKey) {
          headers["Authorization"] = `Bearer ${this.config.apiKey}`;
        }
        headers["X-Peer-ID"] = this.config.peerId;

        this.ws = new WebSocket(this.config.url, {
          headers,
        });

        this.ws.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushQueue();
          this.onConnectCallback?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data) as MeshMessage;
            
            // Check if this is a response to a pending call
            if (msg.replyTo && this.pendingCalls.has(msg.replyTo)) {
              const pending = this.pendingCalls.get(msg.replyTo)!;
              this.pendingCalls.delete(msg.replyTo);
              pending.resolve(msg);
              return;
            }

            // Handle pong
            if (msg.type === "pong") {
              return;
            }

            this.onMessageCallback?.(msg);
          } catch {
            // Non-JSON message
          }
        };

        this.ws.onclose = (event) => {
          this.connected = false;
          this.stopHeartbeat();
          this.onDisconnectCallback?.();
          this.handleDisconnect();
        };

        this.ws.onerror = (error) => {
          this.onErrorCallback?.(new Error(String(error)));
          if (!this.connected) {
            reject(error);
          }
        };

      } catch (err) {
        reject(err);
      }
    });
  }

  private handleDisconnect(): void {
    if (this.config.reconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    }
  }

  send(msg: MeshMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.messageQueue.push(msg);
      return false;
    }

    try {
      this.ws.send(JSON.stringify(msg));
      return true;
    } catch {
      this.messageQueue.push(msg);
      return false;
    }
  }

  // Send with response wait
  sendAndWait<R extends MeshMessage>(msg: MeshMessage, timeoutMs: number = 30000): Promise<R> {
    return new Promise((resolve, reject) => {
      if (!this.send(msg)) {
        reject(new Error("Not connected"));
        return;
      }

      this.pendingCalls.set(msg.id, {
        resolve: resolve as (msg: MeshMessage) => void,
        reject,
        timestamp: Date.now(),
      });

      setTimeout(() => {
        if (this.pendingCalls.has(msg.id)) {
          this.pendingCalls.delete(msg.id);
          reject(new Error("Request timeout"));
        }
      }, timeoutMs);
    });
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()!;
      this.send(msg);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.connected) {
        this.send({
          id: `ping-${Date.now()}`,
          type: "ping",
          from: this.config.peerId,
          to: "broadcast",
          payload: { timestamp: Date.now() },
          timestamp: Date.now(),
        });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }
    this.config.reconnect = false; // Prevent reconnect
    this.ws?.close();
    this.ws = undefined;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected && this.ws?.readyState === WebSocket.OPEN;
  }

  getPeerId(): PeerId {
    return this.config.peerId;
  }

  getQueueSize(): number {
    return this.messageQueue.length;
  }

  getPendingCallsCount(): number {
    return this.pendingCalls.size;
  }
}
