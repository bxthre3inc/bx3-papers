/**
 * Transport Abstraction Layer (gap #11)
 * 
 * Supports stdio, HTTP, WebSocket — any MCP peer can connect.
 * IDE-agnostic: Cursor, VS Code, JetBrains, Windsurf all work.
 */

import { spawn, ChildProcess } from "child_process";
import { PeerEndpoint, MeshMessage } from "../protocol/v2.js";
import { EventEmitter } from "events";
import WebSocket from "ws";

// ✅ Reconnection with exponential backoff (gap #2)
export interface ReconnectConfig {
  initialDelay: number;        // ms
  maxDelay: number;             // ms
  maxAttempts: number;
  jitter: number;              // 0-1, random multiplier
}

export const DEFAULT_RECONNECT: ReconnectConfig = {
  initialDelay: 1000,
  maxDelay: 30000,
  maxAttempts: 10,
  jitter: 0.3,
};

export interface TransportEvents {
  "message": (msg: MeshMessage) => void;
  "error": (err: Error) => void;
  "disconnect": (code?: number) => void;
  "connect": () => void;
  "reconnecting": (attempt: number, delay: number) => void;
}

export abstract class BaseTransport extends EventEmitter {
  protected peerId: string;
  protected reconnectConfig: ReconnectConfig;
  protected reconnectAttempts: number = 0;
  protected reconnectTimeout?: NodeJS.Timeout;
  protected destroyed: boolean = false;

  constructor(peerId: string, reconnect?: Partial<ReconnectConfig>) {
    super();
    this.peerId = peerId;
    this.reconnectConfig = { ...DEFAULT_RECONNECT, ...reconnect };
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): void;
  abstract send(msg: MeshMessage): boolean;
  abstract isConnected(): boolean;

  protected scheduleReconnect(): void {
    if (this.destroyed) return;
    if (this.reconnectAttempts >= this.reconnectConfig.maxAttempts) {
      this.emit("error", new Error(`Max reconnection attempts (${this.reconnectConfig.maxAttempts}) reached`));
      return;
    }

    this.reconnectAttempts++;
    const baseDelay = Math.min(
      this.reconnectConfig.initialDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.reconnectConfig.maxDelay
    );
    const jitter = 1 + (Math.random() * 2 - 1) * this.reconnectConfig.jitter;
    const delay = Math.floor(baseDelay * jitter);

    this.emit("reconnecting", this.reconnectAttempts, delay);
    this.reconnectTimeout = setTimeout(() => this.attemptReconnect(), delay);
  }

  protected async attemptReconnect(): Promise<void> {
    try {
      await this.connect();
      this.reconnectAttempts = 0;
      this.emit("connect");
    } catch {
      this.scheduleReconnect();
    }
  }

  destroy(): void {
    this.destroyed = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.disconnect();
  }
}

// ✅ Stdio Transport — for Claude Desktop, Cursor, local processes
export class StdioTransport extends BaseTransport {
  private process?: ChildProcess;
  private buffer: string = "";
  private pendingResolve?: () => void;
  private pendingReject?: (e: Error) => void;

  constructor(peerId: string, command: string, args: string[], env?: Record<string, string>, reconnect?: Partial<ReconnectConfig>) {
    super(peerId, reconnect);
    this.command = command;
    this.args = args;
    this.env = env;
  }

  private command: string;
  private args: string[];
  private env?: Record<string, string>;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pendingResolve = resolve;
      this.pendingReject = reject;

      this.process = spawn(this.command, this.args, {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, ...this.env },
      });

      this.process.on("error", (err) => {
        this.emit("error", err);
        if (this.pendingReject) {
          this.pendingReject(err);
          this.pendingReject = undefined;
        }
      });

      this.process.on("exit", (code) => {
        this.emit("disconnect", code);
        if (!this.destroyed) {
          this.scheduleReconnect();
        }
      });

      this.process.stdout?.on("data", (data) => this.handleData(data));
      this.process.stderr?.on("data", (data) => this.emit("error", new Error(data.toString())));

      // Give process time to start, then resolve
      setTimeout(() => {
        if (this.pendingResolve) {
          this.pendingResolve();
          this.pendingResolve = undefined;
        }
      }, 500);
    });
  }

  private handleData(data: Buffer): void {
    this.buffer += data.toString();
    const lines = this.buffer.split("\n");
    this.buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim()) {
        try {
          const msg: MeshMessage = JSON.parse(line);
          this.emit("message", msg);
        } catch {
          // Not JSON, might be debug output
        }
      }
    }
  }

  send(msg: MeshMessage): boolean {
    if (!this.process?.stdin) return false;
    try {
      this.process.stdin.write(JSON.stringify(msg) + "\n");
      return true;
    } catch {
      return false;
    }
  }

  disconnect(): void {
    this.process?.kill();
    this.process = undefined;
  }

  isConnected(): boolean {
    return !!this.process && !this.process.killed;
  }
}

// ✅ HTTP Transport — for remote peers, webhooks
export class HttpTransport extends BaseTransport {
  private url: string;
  private apiKey?: string;
  private http: any;
  private pollInterval?: NodeJS.Timeout;
  private messageQueue: MeshMessage[] = [];

  constructor(peerId: string, url: string, apiKey?: string, reconnect?: Partial<ReconnectConfig>) {
    super(peerId, reconnect);
    this.url = url;
    this.apiKey = apiKey;
  }

  async connect(): Promise<void> {
    this.http = await import("node:http");
    
    // Start long-poll for incoming messages
    this.startLongPoll();
    this.emit("connect");
  }

  private startLongPoll(): void {
    this.pollInterval = setInterval(async () => {
      if (!this.isConnected()) return;
      try {
        const messages = await this.poll();
        for (const msg of messages) {
          this.emit("message", msg);
        }
      } catch {
        // Poll continues
      }
    }, 1000);
  }

  private poll(): Promise<MeshMessage[]> {
    return new Promise((resolve) => {
      const req = this.http.request(
        `${this.url}/mesh/poll?peer=${this.peerId}`,
        { method: "GET", headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {} },
        (res: any) => {
          let body = "";
          res.on("data", (chunk: Buffer) => body += chunk);
          res.on("end", () => {
            try {
              resolve(JSON.parse(body || "[]"));
            } catch {
              resolve([]);
            }
          });
        }
      );
      req.on("error", () => resolve([]));
      req.end();
    });
  }

  send(msg: MeshMessage): boolean {
    if (!this.isConnected()) return false;
    
    const postData = JSON.stringify(msg);
    const req = this.http.request(
      `${this.url}/mesh/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
      },
      (res: any) => {
        res.on("data", () => {});
        res.on("end", () => {});
      }
    );
    req.write(postData);
    req.end();
    return true;
  }

  disconnect(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  isConnected(): boolean {
    return true; // HTTP is stateless
  }
}

// ✅ WebSocket Transport — for real-time bidirectional communication
export class WebSocketTransport extends BaseTransport {
  private url: string;
  private apiKey?: string;
  private ws?: WebSocket;
  private wsReconnectTimeout?: NodeJS.Timeout;

  constructor(peerId: string, url: string, apiKey?: string, reconnect?: Partial<ReconnectConfig>) {
    super(peerId, reconnect);
    this.url = url;
    this.apiKey = apiKey;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {},
      });

      this.ws.on("open", () => {
        this.emit("connect");
        resolve();
      });

      this.ws.on("message", (data) => {
        try {
          const msg: MeshMessage = JSON.parse(data.toString());
          this.emit("message", msg);
        } catch {}
      });

      this.ws.on("close", () => {
        this.emit("disconnect");
        if (!this.destroyed) this.scheduleReconnect();
      });

      this.ws.on("error", (err) => {
        this.emit("error", err);
        reject(err);
      });
    });
  }

  send(msg: MeshMessage): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) return false;
    try {
      this.ws.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }

  disconnect(): void {
    if (this.wsReconnectTimeout) clearTimeout(this.wsReconnectTimeout);
    this.ws?.close();
    this.ws = undefined;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// ✅ Factory
export function createTransport(peerId: string, endpoint: PeerEndpoint, reconnect?: Partial<ReconnectConfig>): BaseTransport {
  switch (endpoint.type) {
    case "stdio":
      return new StdioTransport(peerId, endpoint.command, endpoint.args, endpoint.env, reconnect);
    case "http":
      return new HttpTransport(peerId, endpoint.url, endpoint.apiKey, reconnect);
    case "websocket":
      return new WebSocketTransport(peerId, endpoint.url, endpoint.apiKey, reconnect);
    default:
      throw new Error(`Unknown endpoint type`);
  }
}
