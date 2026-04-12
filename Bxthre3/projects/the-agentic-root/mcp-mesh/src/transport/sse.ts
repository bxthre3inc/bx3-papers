/**
 * SSE Transport — Server-Sent Events for Android/Web Communication
 * 
 * Provides unidirectional event stream from server to clients.
 * Used for push notifications, real-time updates, event propagation.
 */

import { EventEmitter } from "events";
import { PeerId, MeshMessage } from "../protocol/v2.js";

export interface SSEConfig {
  peerId: PeerId;
  endpoint: string;
  apiKey?: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const SSE_CONFIG = {
  DEFAULT_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 10,
  PING_INTERVAL: 30000,
  EVENT_TYPES: ["message", "heartbeat", "state_sync", "event_publish"] as const,
};

type SSEEventType = typeof SSE_CONFIG.EVENT_TYPES[number];

interface SSEMessage {
  type: SSEEventType;
  data: string;
  id?: string;
  retry?: number;
}

export class SS_Transport extends EventEmitter {
  private config: Required<SSEConfig>;
  private eventSource?: EventSource;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private reconnectTimeout?: NodeJS.Timeout;
  private pingInterval?: NodeJS.Timeout;

  constructor(config: SSEConfig) {
    super();
    this.config = {
      reconnect: true,
      reconnectInterval: SSE_CONFIG.DEFAULT_RECONNECT_INTERVAL,
      maxReconnectAttempts: SSE_CONFIG.MAX_RECONNECT_ATTEMPTS,
      ...config,
    };
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(this.config.endpoint);
        url.searchParams.set("peer", this.config.peerId);
        if (this.config.apiKey) {
          url.searchParams.set("token", this.config.apiKey);
        }

        this.eventSource = new EventSource(url.toString(), {
          withCredentials: true,
        });

        this.eventSource.onopen = () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          this.emit("connect");
          this.startPing();
          resolve();
        };

        this.eventSource.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.eventSource.onerror = (error) => {
          this.emit("error", error);
          if (!this.connected) {
            reject(error);
          } else {
            this.handleDisconnect();
          }
        };

        // Register event listeners by type
        for (const eventType of SSE_CONFIG.EVENT_TYPES) {
          this.eventSource.addEventListener(eventType, (event: MessageEvent) => {
            this.emit(eventType, JSON.parse(event.data));
          });
        }

      } catch (err) {
        reject(err);
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data) as MeshMessage;
      if (this.isDuplicate(data.id)) {
        return;
      }
      this.emit("message", data);
    } catch {
      // Non-JSON message
      this.emit("raw_message", event.data);
    }
  }

  private seenMessageIds = new Set<string>();
  private isDuplicate(messageId?: string): boolean {
    if (!messageId) return false;
    if (this.seenMessageIds.has(messageId)) return true;
    this.seenMessageIds.add(messageId);
    if (this.seenMessageIds.size > 1000) {
      const first = this.seenMessageIds.values().next().value;
      if (first) this.seenMessageIds.delete(first);
    }
    return false;
  }

  private handleDisconnect(): void {
    this.connected = false;
    this.emit("disconnect");
    this.stopPing();

    if (this.config.reconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
      this.emit("reconnecting", this.reconnectAttempts, delay);
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      // SSE doesn't have native ping, just trust the connection
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        this.handleDisconnect();
      }
    }, SSE_CONFIG.PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }

  disconnect(): void {
    this.stopPing();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }
    this.eventSource?.close();
    this.eventSource = undefined;
    this.connected = false;
    this.emit("disconnect");
  }

  isConnected(): boolean {
    return this.connected && this.eventSource?.readyState === EventSource.OPEN;
  }

  getPeerId(): PeerId {
    return this.config.peerId;
  }

  // Send via HTTP POST (SSE is receive-only)
  send(msg: MeshMessage): boolean {
    // SSE is unidirectional (server -> client)
    // To send messages, use HTTP transport
    this.emit("send_required", msg);
    return false;
  }
}
