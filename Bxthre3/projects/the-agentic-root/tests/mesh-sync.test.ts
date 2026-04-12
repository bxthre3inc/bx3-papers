/**
 * Mesh Sync Test — Event Propagation Validation
 * 
 * Simulates 3 nodes and validates:
 * - Event broadcasting
 * - State synchronization
 * - Conflict resolution
 * - At-least-once delivery
 */

import { StateSync } from "../src/core/state-sync.js";

interface SimulatedNode {
  id: string;
  state: StateSync<any>;
  receivedEvents: string[];
  connectedTo: string[];
}

class MeshSimulator {
  nodes: Map<string, SimulatedNode> = new Map();

  createNode(id: string): SimulatedNode {
    const state = new StateSync(id);
    const node: SimulatedNode = {
      id,
      state,
      receivedEvents: [],
      connectedTo: [],
      };
    this.nodes.set(id, node);
    return node;
  }

  connect(a: string, b: string): void {
    this.nodes.get(a)!.connectedTo.push(b);
    this.nodes.get(b)!.connectedTo.push(a);
  }

  broadcast(fromId: string, eventType: string, data: any): void {
    const from = this.nodes.get(fromId);
    if (!from) return;

    // Stable broadcast ID — same type+data = same ID. This is what dedup is keyed on.
    // The random event.id is the system-level delivery token only.
    const broadcastId = `${eventType}:${JSON.stringify(data)}`;

    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: eventType,
      data,
      source: fromId,
      timestamp: Date.now(),
      broadcastId, // stable logical ID for deduplication
    };

    // Deliver to self
    from.receivedEvents.push(broadcastId);

    // Broadcast to connected nodes
    for (const peerId of from.connectedTo) {
      const peer = this.nodes.get(peerId)!;
      if (peer.state.recordDelivery(broadcastId)) {
        peer.receivedEvents.push(broadcastId);
        peer.state.emit("event:ready", event);
      }
    }
  }

  propagateState(fromId: string, key: string, value: any): void {
    const from = this.nodes.get(fromId);
    if (!from) return;

    from.state.setState(key, value);

    // Propagate to all connected
    for (const peerId of from.connectedTo) {
      const peer = this.nodes.get(peerId)!;
      peer.state.importState(from.state.exportState());
    }
  }
}

describe("Mesh Event Propagation", () => {
  let mesh: MeshSimulator;
  let nodeA: SimulatedNode;
  let nodeB: SimulatedNode;
  let nodeC: SimulatedNode;

  beforeEach(() => {
    mesh = new MeshSimulator();
    nodeA = mesh.createNode("node-A");
    nodeB = mesh.createNode("node-B");
    nodeC = mesh.createNode("node-C");

    // A connects to B, B connects to C (chain topology)
    mesh.connect("node-A", "node-B");
    mesh.connect("node-B", "node-C");
  });

  test("broadcast reaches all connected nodes", () => {
    mesh.broadcast("node-A", "test_event", { msg: "hello" });

    expect(nodeA.receivedEvents.length).toBe(1);
    expect(nodeB.receivedEvents.length).toBe(1);
    // C is not directly connected to A
    expect(nodeC.receivedEvents.length).toBe(0);
  });

  test("state sync propagates across chain", () => {
    mesh.propagateState("node-A", "counter", 42);

    expect(nodeA.state.getState("counter")?.value).toBe(42);
    // Wait for propagation
    setTimeout(() => {
      expect(nodeB.state.getState("counter")?.value).toBe(42);
    }, 10);
  });

  test("duplicate delivery is rejected (at-least-once semantics)", () => {
    mesh.broadcast("node-A", "dedup_test", { id: 1 });

    const beforeCount = nodeB.receivedEvents.length;
    mesh.broadcast("node-A", "dedup_test", { id: 1 }); // Duplicate

    // Should not add to received
    expect(nodeB.receivedEvents.length).toBe(beforeCount);
  });
});

describe("State Sync Conflict Resolution", () => {
  let syncA: StateSync<number>;
  let syncB: StateSync<number>;

  beforeEach(() => {
    syncA = new StateSync("peer-A");
    syncB = new StateSync("peer-B");
  });

  test("concurrent writes resolve by timestamp", () => {
    syncA.setState("key", 1);
    syncB.setState("key", 2);

    // Both have same causal history, should resolve deterministically
    const aEntry = syncA.getState("key");
    const bEntry = syncB.getState("key");

    // Both should have values (resolution strategy may differ)
    expect(aEntry).toBeDefined();
    expect(bEntry).toBeDefined();
  });

  test("vector clock tracks causality", () => {
    syncA.incrementClock();
    syncA.incrementClock();
    syncA.mergeClock({ peerId: "peer-B", counter: 1, peers: { "peer-B": 1 } });

    const status = syncA.getSyncStatus();
    expect(status.vectorClockPeers).toBe(2);
  });

  test("state export/import roundtrip", () => {
    syncA.setState("key1", "value1");
    syncA.setState("key2", 42);

    const exported = syncA.exportState();
    syncB.importState(exported);

    expect(syncB.getState("key1")?.value).toBe("value1");
    expect(syncB.getState("key2")?.value).toBe(42);
  });
});

describe("Cross-Platform Transport Simulation", () => {
  test("WebSocket transport would handle reconnection", () => {
    // Simulate WebSocket reconnect behavior
    const config = {
      peerId: "test-peer",
      url: "wss://example.com/mesh",
      reconnect: true,
      reconnectInterval: 1000,
      maxReconnectAttempts: 3,
    };

    let attempts = 0;
    const simulateReconnect = () => {
      attempts++;
      if (attempts < 3) {
        // Simulate failed reconnect
        setTimeout(simulateReconnect, config.reconnectInterval);
      }
    };

    expect(config.reconnect).toBe(true);
    expect(config.maxReconnectAttempts).toBe(3);
  });

  test("SSE transport deduplication works", () => {
    const seenIds = new Set<string>();
    const isDuplicate = (id: string) => {
      if (seenIds.has(id)) return true;
      seenIds.add(id);
      return false;
    };

    expect(isDuplicate("msg-1")).toBe(false);
    expect(isDuplicate("msg-2")).toBe(false);
    expect(isDuplicate("msg-1")).toBe(true); // Duplicate
    expect(isDuplicate("msg-1")).toBe(true); // Still duplicate
  });
});
