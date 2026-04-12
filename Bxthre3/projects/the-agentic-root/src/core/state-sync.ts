/**
 * State Sync Implementation — Conflict Resolution & Eventual Consistency
 * 
 * Implements:
 * - Vector clocks for causality tracking
 * - CRDT-based conflict resolution
 * - At-least-once delivery semantics
 * - Event ordering guarantees
 */

import { randomUUID } from "crypto";
import { EventEmitter } from "events";

// Vector clock for causality
export interface VectorClock {
  peerId: string;
  counter: number;
  peers: Record<string, number>;
}

export interface StateEntry<T = unknown> {
  key: string;
  value: T;
  version: VectorClock;
  timestamp: number;
  leaseId?: string;
}

export interface ConflictResolution<T> {
  strategy: "last-write-wins" | "CRDT-merge" | "lease-wins" | "manual";
  resolved?: T;
  conflicts?: Array<{ peerId: string; value: T; version: VectorClock }>;
}

// At-least-once delivery tracking
export interface DeliveryRecord {
  messageId: string;
  deliveredAt: number;
  acknowledged: boolean;
  attempts: number;
}

// Event ordering queue
export interface OrderedEvent<T = unknown> {
  id: string;
  sequence: number;
  payload: T;
  source: string;
  timestamp: number;
  causalDeps: string[]; // Message IDs this depends on
}

export class StateSync<T = unknown> extends EventEmitter {
  private state: Map<string, StateEntry<T>> = new Map();
  private vectorClocks: Map<string, VectorClock> = new Map();
  private deliveryLog: Map<string, DeliveryRecord> = new Map();
  private pendingEvents: Map<string, OrderedEvent[]> = new Map(); // Sequence -> events
  private nextSequence: number = 0;
  private ownPeerId: string;
  private readonly DEDUP_WINDOW_MS = 60000; // 1 minute dedup window

  constructor(peerId: string) {
    super();
    this.ownPeerId = peerId;
    this.initVectorClock();
  }

  private initVectorClock(): void {
    this.vectorClocks.set(this.ownPeerId, {
      peerId: this.ownPeerId,
      counter: 0,
      peers: { [this.ownPeerId]: 0 },
    });
  }

  // Increment local clock
  incrementClock(): void {
    const clock = this.vectorClocks.get(this.ownPeerId)!;
    clock.counter++;
    clock.peers[this.ownPeerId] = clock.counter;
  }

  // Merge remote vector clock
  mergeClock(remote: VectorClock): void {
    for (const [peer, counter] of Object.entries(remote.peers)) {
      const local = this.vectorClocks.get(peer);
      if (!local) {
        this.vectorClocks.set(peer, {
          peerId: peer,
          counter,
          peers: { [peer]: counter },
        });
      } else {
        local.counter = Math.max(local.counter, counter);
        local.peers[peer] = local.counter;
      }
    }
  }

  // Compare clocks for causality
  compareClocks(a: VectorClock, b: VectorClock): "before" | "after" | "concurrent" {
    let aGreater = false;
    let bGreater = false;

    const allPeers = new Set([...Object.keys(a.peers), ...Object.keys(b.peers)]);

    for (const peer of allPeers) {
      const aVal = a.peers[peer] || 0;
      const bVal = b.peers[peer] || 0;

      if (aVal > bVal) aGreater = true;
      if (bVal > aVal) bGreater = true;
    }

    if (aGreater && !bGreater) return "after";
    if (bGreater && !aGreater) return "before";
    return "concurrent";
  }

  // Set state with automatic conflict detection
  setState(key: string, value: T, metadata?: { leaseId?: string }): StateEntry<T> {
    this.incrementClock();
    const clock = this.vectorClocks.get(this.ownPeerId)!;

    const entry: StateEntry<T> = {
      key,
      value,
      version: { ...clock },
      timestamp: Date.now(),
      leaseId: metadata?.leaseId,
    };

    const existing = this.state.get(key);
    if (existing) {
      const comparison = this.compareClocks(existing.version, entry.version);
      if (comparison === "before") {
        // Incoming is newer, replace
        this.state.set(key, entry);
      } else if (comparison === "concurrent") {
        // Concurrent edit - use conflict resolution
        const resolved = this.resolveConflict(key, existing, entry);
        this.state.set(key, resolved);
        return resolved;
      }
      // "after" means our entry is older, don't replace
      return existing;
    }

    this.state.set(key, entry);
    this.emit("state:update", entry);
    return entry;
  }

  // Resolve concurrent modifications
  private resolveConflict(key: string, a: StateEntry<T>, b: StateEntry<T>): StateEntry<T> {
    // Last-write-wins with vector clock tiebreaker
    if (a.timestamp === b.timestamp) {
      // Same timestamp - use peer ID as tiebreaker (deterministic)
      return a.version.peerId > b.version.peerId ? a : b;
    }
    return a.timestamp > b.timestamp ? a : b;
  }

  // Get current state
  getState(key: string): StateEntry<T> | undefined {
    return this.state.get(key);
  }

  // Get all state entries
  getAllState(): StateEntry<T>[] {
    return Array.from(this.state.values());
  }

  // Record delivery for at-least-once semantics
  recordDelivery(messageId: string): boolean {
    const existing = this.deliveryLog.get(messageId);
    if (existing) {
      existing.attempts++;
      return false; // Already delivered
    }

    this.deliveryLog.set(messageId, {
      messageId,
      deliveredAt: Date.now(),
      acknowledged: false,
      attempts: 1,
    });

    // Cleanup old records
    this.cleanupDeliveryLog();
    return true;
  }

  // Acknowledge delivery
  acknowledge(messageId: string): void {
    const record = this.deliveryLog.get(messageId);
    if (record) {
      record.acknowledged = true;
    }
  }

  // Check if already delivered
  isDelivered(messageId: string): boolean {
    return this.deliveryLog.has(messageId);
  }

  private cleanupDeliveryLog(): void {
    const cutoff = Date.now() - this.DEDUP_WINDOW_MS;
    for (const [id, record] of this.deliveryLog) {
      if (record.deliveredAt < cutoff && record.acknowledged) {
        this.deliveryLog.delete(id);
      }
    }
  }

  // Enqueue event for ordering
  enqueueEvent(payload: T, source: string, deps: string[] = []): OrderedEvent<T> {
    const event: OrderedEvent<T> = {
      id: randomUUID(),
      sequence: this.nextSequence++,
      payload,
      source,
      timestamp: Date.now(),
      causalDeps: deps,
    };

    // Check if dependencies are satisfied
    if (this.canDeliver(event)) {
      this.emit("event:ready", event);
    } else {
      // Store for later
      if (!this.pendingEvents.has(event.sequence)) {
        this.pendingEvents.set(event.sequence, []);
      }
      this.pendingEvents.get(event.sequence)!.push(event);
    }

    return event;
  }

  private canDeliver(event: OrderedEvent<T>): boolean {
    // Check all causal dependencies are satisfied
    for (const depId of event.causalDeps) {
      if (!this.isDelivered(depId)) {
        return false;
      }
    }
    return true;
  }

  // Deliver ordered events
  flushEvents(): OrderedEvent<T>[] {
    const ready: OrderedEvent<T>[] = [];

    for (const [seq, events] of this.pendingEvents) {
      const stillPending: OrderedEvent<T>[] = [];

      for (const event of events) {
        if (this.canDeliver(event)) {
          ready.push(event);
          this.emit("event:ready", event);
        } else {
          stillPending.push(event);
        }
      }

      if (stillPending.length === 0) {
        this.pendingEvents.delete(seq);
      } else {
        this.pendingEvents.set(seq, stillPending);
      }
    }

    return ready;
  }

  // Get sync status
  getSyncStatus(): {
    stateEntries: number;
    vectorClockPeers: number;
    pendingEvents: number;
    deliveryRecords: number;
  } {
    return {
      stateEntries: this.state.size,
      vectorClockPeers: this.vectorClocks.size,
      pendingEvents: Array.from(this.pendingEvents.values()).reduce((sum, e) => sum + e.length, 0),
      deliveryRecords: this.deliveryLog.size,
    };
  }

  // Export state for sync
  exportState(): Array<{ key: string; value: T; version: VectorClock; timestamp: number }> {
    return this.getAllState().map(e => ({
      key: e.key,
      value: e.value,
      version: e.version,
      timestamp: e.timestamp,
    }));
  }

  // Import remote state
  importState(remote: Array<{ key: string; value: T; version: VectorClock; timestamp: number }>): void {
    for (const entry of remote) {
      this.mergeClock(entry.version);
      this.setState(entry.key, entry.value);
    }
  }
}
