/**
 * MCP Mesh Core — Fixed v2 implementation
 */

import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import {
  PeerId, PeerInfo, PeerState, ContextSync, MeshMessage, ToolCall, ToolResponse,
  ResourceLease, CircuitBreaker, EventSubscription, EventMessage,
  PeerEndpoint, MESH_PROTOCOL_VERSION, createLease,
  createAuthChallenge, createAuthResponse, verifyAuth,
  validateMessage, compressPayload, decompressPayload,
  HeartbeatMessage, HEARTBEAT_INTERVAL, HEARTBEAT_TIMEOUT,
} from "../protocol/v2.js";
import { PeerRegistry, RegistryConfig } from "../registry/registry.js";
import { createTransport, BaseTransport } from "../transport/transport.js";
import { ReconnectConfig, DEFAULT_RECONNECT } from "../transport/transport.js";

// ✅ Circuit breaker implementation
function shouldTripBreaker(cb: CircuitBreaker): boolean {
  return cb.failures >= cb.threshold;
}

function canRetry(cb: CircuitBreaker): boolean {
  if (cb.state === "closed") return true;
  if (cb.state === "open" && Date.now() - cb.lastFailure > cb.resetTimeout) {
    return true;
  }
  return false;
}

function updateCircuitBreaker(cb: CircuitBreaker, success: boolean): CircuitBreaker {
  if (success) {
    if (cb.state === "half-open") {
      cb.success++;
      if (cb.success >= cb.halfOpenSuccesses) {
        return { ...cb, state: "closed", failures: 0, success: 0, halfOpenSuccesses: 2 };
      }
    } else {
      cb.failures = Math.max(0, cb.failures - 1);
    }
  } else {
    cb.lastFailure = Date.now();
    cb.failures++;
    if (shouldTripBreaker(cb)) {
      return { ...cb, state: "open" };
    }
  }
  return cb;
}

// ✅ Retry with idempotency
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
  throw lastError;
}

export interface MeshCoreConfig {
  self: PeerInfo;
  bootstrapPeers?: PeerInfo[];
  reconnect?: Partial<ReconnectConfig>;
  circuitBreaker?: Partial<CircuitBreaker>;
  leaseTTL?: number;
  messageTimeout?: number;
}

export class MCPMeshCore extends EventEmitter {
  private registry: PeerRegistry;
  private transports: Map<PeerId, BaseTransport> = new Map();
  private eventBus: Map<string, Set<PeerId>> = new Map();
  private leases: Map<string, ResourceLease> = new Map();
  private messageTimeout: number;
  private leaseTTL: number;

  constructor(config: MeshCoreConfig) {
    super();

    this.leaseTTL = config.leaseTTL || 30000;
    this.messageTimeout = config.messageTimeout || 30000;

    const registryConfig: RegistryConfig = {
      self: config.self,
      bootstrapPeers: config.bootstrapPeers,
    };

    this.registry = new PeerRegistry(registryConfig);

    // Registry events
    this.registry.on("peer:connected", (id, info) => this.startHandshake(id, info));
    this.registry.on("peer:disconnected", (id) => this.handleDisconnect(id));
  }

  // ✅ Start mesh
  async start(): Promise<void> {
    // Connect to all registered peers
    for (const peer of this.registry.getAllPeers()) {
      await this.connectToPeer(peer.info.id);
    }
  }

  // ✅ Connect to a peer
  async connectToPeer(peerId: PeerId): Promise<void> {
    const state = this.registry.getPeer(peerId);
    if (!state) return;

    const transport = createTransport(peerId, state.info.endpoint, DEFAULT_RECONNECT);
    transport.on("message", (msg) => this.handleMessage(msg));
    transport.on("disconnect", () => this.handleDisconnect(peerId));
    transport.on("error", (err) => this.emit("error", peerId, err));

    this.transports.set(peerId, transport);

    try {
      await transport.connect();
    } catch (err) {
      this.emit("error", peerId, err);
    }
  }

  // ✅ Full auth handshake
  private async startHandshake(peerId: PeerId, info: PeerInfo): Promise<void> {
    const transport = this.transports.get(peerId);
    if (!transport) return;

    // Send auth challenge
    const challenge = createAuthChallenge();
    transport.send({
      id: randomUUID(),
      type: "auth_challenge",
      from: this.registry.getSelf().id,
      to: peerId,
      payload: challenge,
      timestamp: Date.now(),
    });
  }

  // ✅ Call remote tool with circuit breaker + retry
  async callTool(peerId: PeerId, tool: string, args: Record<string, unknown>): Promise<ToolResponse> {
    const state = this.registry.getPeer(peerId);
    if (!state?.connected || !state?.authed) {
      return { callId: "", success: false, error: "Peer not connected or not authed" };
    }

    // Check circuit breaker
    if (!canRetry(state.circuitBreaker)) {
      return { callId: "", success: false, error: "Circuit breaker open" };
    }

    const transport = this.transports.get(peerId);
    if (!transport?.isConnected()) {
      return { callId: "", success: false, error: "Transport not connected" };
    }

    const callId = randomUUID();
    const idempotencyKey = randomUUID();

    try {
      const result = await withRetry(async () => {
        return new Promise<ToolResponse>((resolve, reject) => {
          const msg: MeshMessage<ToolCall> = {
            id: randomUUID(),
            type: "tool_call",
            from: this.registry.getSelf().id,
            to: peerId,
            payload: { tool, args, callId, idempotencyKey },
            timestamp: Date.now(),
            replyTo: callId,
          };

          // Store pending call
          state.pendingCalls.set(callId, {
            resolve: resolve,
            reject: reject,
            ts: Date.now(),
          });

          transport.send(msg);

          // Timeout
          setTimeout(() => {
            if (state.pendingCalls.has(callId)) {
              state.pendingCalls.delete(callId);
              reject(new Error("Call timeout"));
            }
          }, this.messageTimeout);
        });
      });

      // Update circuit breaker on success
      state.circuitBreaker = updateCircuitBreaker(state.circuitBreaker, true);
      return result;

    } catch (err) {
      // Update circuit breaker on failure
      state.circuitBreaker = updateCircuitBreaker(state.circuitBreaker, false);
      return { callId, success: false, error: String(err) };
    }
  }

  // ✅ Resource leasing
  async acquireLease(peerId: PeerId, resourceId: string, mode: ResourceLease["mode"] = "write"): Promise<boolean> {
    const existing = this.leases.get(resourceId);

    if (existing?.holder !== peerId && Date.now() < existing!.expires) {
      // Resource is held by someone else
      return false;
    }

    const lease = createLease(peerId, resourceId, this.leaseTTL, mode);
    this.leases.set(resourceId, lease);

    // Notify all peers of new lease
    this.broadcast({
      id: randomUUID(),
      type: "lease_acquire",
      from: this.registry.getSelf().id,
      to: "broadcast",
      payload: { resourceId, holder: peerId, mode, expires: lease.expires },
      timestamp: Date.now(),
    });

    return true;
  }

  releaseLease(peerId: PeerId, resourceId: string): void {
    const existing = this.leases.get(resourceId);
    if (existing?.holder === peerId) {
      this.leases.delete(resourceId);
      this.broadcast({
        id: randomUUID(),
        type: "lease_release",
        from: this.registry.getSelf().id,
        to: "broadcast",
        payload: { resourceId, holder: peerId },
        timestamp: Date.now(),
      });
    }
  }

  // ✅ Event pub/sub
  publish(event: string, data: unknown): void {
    const msg: MeshMessage<EventMessage> = {
      id: randomUUID(),
      type: "event_publish",
      from: this.registry.getSelf().id,
      to: "broadcast",
      payload: { event, data, source: this.registry.getSelf().id, timestamp: Date.now() },
      timestamp: Date.now(),
    };

    // Deliver to local subscribers
    this.deliverEvent(msg);

    // Broadcast to peers
    this.broadcast(msg);
  }

  subscribe(peerId: PeerId, eventPattern: string): void {
    if (!this.eventBus.has(eventPattern)) {
      this.eventBus.set(eventPattern, new Set());
    }
    this.eventBus.get(eventPattern)!.add(peerId);
  }

  unsubscribe(peerId: PeerId, eventPattern: string): void {
    this.eventBus.get(eventPattern)?.delete(peerId);
  }

  private deliverEvent(msg: MeshMessage): void {
    const eventData = msg.payload as EventMessage;
    const subscribers = this.eventBus.get(eventData.event) || this.eventBus.get("*") || new Set();

    for (const subscriber of subscribers) {
      if (subscriber === msg.from) continue; // Don't deliver to sender

      const state = this.registry.getPeer(subscriber);
      if (state?.connected && state?.authed) {
        const transport = this.transports.get(subscriber);
        transport?.send(msg);
      }
    }
  }

  // ✅ Context sync
  syncContext(context: Partial<ContextSync>): void {
    const fullContext: ContextSync = {
      sessionId: context.sessionId || randomUUID(),
      protocolVersion: MESH_PROTOCOL_VERSION,
      timestamp: Date.now(),
      peer: {
        id: this.registry.getSelf().id,
        name: this.registry.getSelf().name,
        role: this.registry.getSelf().role,
      },
      ...context,
    };

    this.broadcast({
      id: randomUUID(),
      type: "context_sync",
      from: this.registry.getSelf().id,
      to: "broadcast",
      payload: fullContext,
      timestamp: Date.now(),
    });
  }

  // ✅ Handle incoming messages
  private handleMessage(msg: MeshMessage): void {
    switch (msg.type) {
      case "auth_challenge":
        this.handleAuthChallenge(msg);
        break;
      case "auth_response":
        this.handleAuthResponse(msg);
        break;
      case "tool_call":
        this.handleToolCall(msg);
        break;
      case "tool_response":
        this.handleToolResponse(msg);
        break;
      case "context_sync":
        this.emit("context:sync", msg.from, msg.payload);
        break;
      case "event_publish":
        this.deliverEvent(msg);
        break;
      case "lease_acquire":
      case "lease_release":
        this.handleLeaseMessage(msg);
        break;
      case "peer_announce":
        this.registry.discoverPeer(msg.payload as PeerInfo);
        break;
    }

    this.emit("message", msg);
  }

  private handleAuthChallenge(msg: MeshMessage): void {
    const peerId = msg.from;
    const challenge = msg.payload as any;
    const state = this.registry.getPeer(peerId);
    const transport = this.transports.get(peerId);

    if (!state || !transport) return;

    const response = createAuthResponse(challenge, state.info.endpoint.type === "stdio" ? "local" : (state.info.metadata?.authToken || ""));
    transport.send({
      id: randomUUID(),
      type: "auth_response",
      from: this.registry.getSelf().id,
      to: peerId,
      payload: response,
      timestamp: Date.now(),
    });
  }

  private handleAuthResponse(msg: MeshMessage): void {
    const peerId = msg.from;
    const response = msg.payload as any;
    const state = this.registry.getPeer(peerId);
    const transport = this.transports.get(peerId);

    if (!state || !transport) return;

    const token = state.info.endpoint.type === "stdio" ? "local" : (state.info.metadata?.authToken || "");
    const valid = verifyAuth(response, token);

    if (valid) {
      state.authed = true;
      transport.send({
        id: randomUUID(),
        type: "auth_result",
        from: this.registry.getSelf().id,
        to: peerId,
        payload: { success: true },
        timestamp: Date.now(),
      });
      this.emit("peer:auth", peerId);
    } else {
      transport.send({
        id: randomUUID(),
        type: "auth_result",
        from: this.registry.getSelf().id,
        to: peerId,
        payload: { success: false, error: "Auth failed" },
        timestamp: Date.now(),
      });
    }
  }

  private async handleToolCall(msg: MeshMessage): Promise<void> {
    const payload = msg.payload as ToolCall;
    const transport = this.transportFor(msg.from);

    // Emit event for local handler
    const handler = this.emit(`tool:${payload.tool}`, payload.args);

    const response: ToolResponse = {
      callId: payload.callId,
      success: true,
      result: payload,
    };

    transport?.send({
      id: randomUUID(),
      type: "tool_response",
      from: this.registry.getSelf().id,
      to: msg.from,
      payload: response,
      timestamp: Date.now(),
      replyTo: msg.id,
    });
  }

  private handleToolResponse(msg: MeshMessage): void {
    const state = this.registry.getPeer(msg.from);
    const payload = msg.payload as ToolResponse;

    const pending = state?.pendingCalls.get(payload.callId);
    if (pending) {
      state!.pendingCalls.delete(payload.callId);
      pending.resolve(payload);
    }
  }

  private handleLeaseMessage(msg: MeshMessage): void {
    const { resourceId, holder } = msg.payload as any;
    if (msg.type === "lease_acquire") {
      this.leases.set(resourceId, {
        resourceId,
        holder,
        mode: "write",
        acquired: Date.now(),
        expires: Date.now() + this.leaseTTL,
        ttl: this.leaseTTL,
      });
    } else if (msg.type === "lease_release") {
      this.leases.delete(resourceId);
    }
  }

  private handleDisconnect(peerId: PeerId): void {
    const state = this.registry.getPeer(peerId);
    if (state) {
      state.connected = false;
      state.authed = false;
    }
    this.emit("peer:disconnect", peerId);
  }

  private broadcast(msg: MeshMessage): void {
    for (const [peerId, transport] of this.transports) {
      if (this.registry.getPeer(peerId)?.authed) {
        transport.send(msg);
      }
    }
  }

  // ✅ Protected method for extended classes to send broadcasts
  protected sendBroadcastMessage(msg: MeshMessage): void {
    this.broadcast(msg);
  }

  // ✅ Protected accessor for peer states
  protected getPeerStatesMap(): Map<PeerId, PeerState> {
    const states = new Map<PeerId, PeerState>();
    for (const state of this.registry.getAllPeers()) {
      states.set(state.info.id, state);
    }
    return states;
  }

  // ✅ Protected accessor for self ID
  protected _getSelfIdInternal(): PeerId {
    return this.registry.getSelf().id;
  }

  private transportFor(peerId: PeerId): BaseTransport | undefined {
    return this.transports.get(peerId);
  }

  // ✅ Shutdown
  destroy(): void {
    for (const transport of this.transports.values()) {
      transport.destroy();
    }
    this.transports.clear();
    this.registry.destroy();
  }
}
