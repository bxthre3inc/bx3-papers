/**
 * Peer Registry — Dynamic peer discovery (gap #6, #12)
 * 
 * No hardcoded peer list. Peers announce themselves.
 * Supports any number of peers dynamically.
 */

import { PeerInfo, PeerId, PeerEndpoint, PeerState, MESH_PROTOCOL_VERSION, isCompatible } from "../protocol/v2.js";
import { EventEmitter } from "events";

export interface RegistryConfig {
  self: PeerInfo;
  bootstrapPeers?: PeerInfo[];
  advertiseInterval?: number;    // ms between advertisements
  peerTimeout?: number;         // ms before marking peer stale
}

export class PeerRegistry extends EventEmitter {
  private self: PeerInfo;
  private peers: Map<PeerId, PeerState> = new Map();
  private advertisedPeers: Map<PeerId, PeerInfo> = new Map();
  private staleCheckInterval?: NodeJS.Timeout;
  private advertiseInterval?: NodeJS.Timeout;

  constructor(config: RegistryConfig) {
    super();
    this.self = config.self;

    // Register bootstrap peers
    for (const peer of config.bootstrapPeers || []) {
      this.advertisedPeers.set(peer.id, peer);
    }

    // Start stale peer cleanup
    this.staleCheckInterval = setInterval(() => this.cleanupStalePeers(), config.peerTimeout || 30000);

    // Start peer advertisement
    if (config.advertiseInterval) {
      this.advertiseInterval = setInterval(() => this.advertiseSelf(), config.advertiseInterval!);
    }
  }

  // ✅ Announce self to network (or manually trigger discovery)
  private advertiseSelf(): void {
    this.emit("advertise", this.self);
  }

  // ✅ Dynamic peer discovery
  discoverPeer(info: PeerInfo): void {
    if (info.id === this.self.id) return; // Ignore self

    // Check version compatibility
    if (!isCompatible({ major: parseInt(info.version.split(".")[0]), minor: 0, patch: 0 })) {
      this.emit("peer:incompatible", info);
      return;
    }

    const existing = this.advertisedPeers.get(info.id);
    if (!existing || existing.timestamp !== info.timestamp) {
      this.advertisedPeers.set(info.id, { ...info, timestamp: Date.now() });
      this.emit("peer:discovered", info);
    }
  }

  // ✅ Manual peer registration (for known peers)
  registerPeer(info: PeerInfo): void {
    if (info.id === this.self.id) return;
    
    if (!this.peers.has(info.id)) {
      this.peers.set(info.id, {
        info,
        connected: false,
        authed: false,
        since: 0,
        lastSeen: 0,
        circuitBreaker: {
          peer: info.id,
          state: "closed",
          failures: 0,
          lastFailure: 0,
          success: 0,
          threshold: 5,
          resetTimeout: 60000,
          halfOpenSuccesses: 0,
        },
        leases: new Map(),
        subscriptions: new Set(),
        pendingCalls: new Map(),
      });
      this.emit("peer:registered", info);
    }
  }

  // ✅ Connect to discovered peer
  async connectPeer(peerId: PeerId, factory: (endpoint: PeerEndpoint) => Promise<any>): Promise<void> {
    const info = this.advertisedPeers.get(peerId);
    const state = this.peers.get(peerId);
    
    if (!info || !state) {
      throw new Error(`Unknown peer: ${peerId}`);
    }

    if (state.connected) return; // Already connected

    try {
      await factory(info.endpoint);
      state.connected = true;
      state.since = Date.now();
      state.lastSeen = Date.now();
      this.emit("peer:connected", peerId, info);
    } catch (err) {
      this.emit("peer:connection-failed", peerId, err);
      throw err;
    }
  }

  // ✅ Remove stale or disconnected peer
  disconnectPeer(peerId: PeerId, reason?: string): void {
    const state = this.peers.get(peerId);
    if (state) {
      state.connected = false;
      state.authed = false;
      this.emit("peer:disconnected", peerId, reason);
    }
  }

  // ✅ Cleanup stale advertised peers
  private cleanupStalePeers(): void {
    const now = Date.now();
    const timeout = 60000; // 1 minute

    for (const [id, info] of this.advertisedPeers) {
      if (now - (info.timestamp || 0) > timeout) {
        this.advertisedPeers.delete(id);
        this.emit("peer:stale", id);
      }
    }
  }

  // ✅ Getters
  getPeer(peerId: PeerId): PeerState | undefined {
    return this.peers.get(peerId);
  }

  getAllPeers(): PeerState[] {
    return Array.from(this.peers.values());
  }

  getConnectedPeers(): PeerState[] {
    return this.getAllPeers().filter(p => p.connected && p.authed);
  }

  getDiscoveredPeers(): PeerInfo[] {
    return Array.from(this.advertisedPeers.values());
  }

  getSelf(): PeerInfo {
    return this.self;
  }

  // ✅ Shutdown
  destroy(): void {
    if (this.staleCheckInterval) clearInterval(this.staleCheckInterval);
    if (this.advertiseInterval) clearInterval(this.advertiseInterval);
  }
}

// Helper for version parsing (must match protocol)
function parseVersion(v: string): { major: number; minor: number; patch: number } {
  const parts = v.split(".").map(Number);
  return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
}
