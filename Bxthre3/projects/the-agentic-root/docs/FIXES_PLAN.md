# MCP Mesh v2.0 — Pre-Submodule Fixes Plan

## 12 Important Fixes (Sequential Execution)

### Phase 1: Core Infrastructure (Fixes 1-4)

| # | Fix | Status | Blocked By |
|---|-----|--------|------------|
| 1 | **Real Adapter Integration** — Wrap actual AgentOSServer + AntigravityServer classes | PENDING | - |
| 2 | **Heartbeat/Keepalive** — Periodic ping/pong every 30s | PENDING | Fix 1 |
| 3 | **Schema Validation** — JSON Schema for incoming messages | PENDING | - |
| 4 | **Graceful Cleanup** — SIGTERM/SIGINT handling + destroy() | PENDING | Fix 2 |

### Phase 2: Security & Reliability (Fixes 5-8)

| # | Fix | Status | Blocked By |
|---|-----|--------|------------|
| 5 | **Message Compression** — zlib for large payloads | PENDING | Fix 3 |
| 6 | **WebSocket Reconnect** — Full reconnection logic | PENDING | Fix 2 |
| 7 | **Circuit Breaker UI** — Expose breaker state via /mesh/status | PENDING | Fix 4 |
| 8 | **Graceful Degradation** — Degraded mode messaging | PENDING | Fix 7 |

### Phase 3: Observability & Polish (Fixes 9-12)

| # | Fix | Status | Blocked By |
|---|-----|--------|------------|
| 9 | **Metrics Endpoint** — Prometheus-style /mesh/metrics | PENDING | Fix 8 |
| 10 | **CLI Enhancement** — --peer-only, --monitor, status commands | PENDING | - |
| 11 | **Test Suite** — Jest integration tests | PENDING | Fix 3 |
| 12 | **Documentation** — ARCHITECTURE.md + API.md | PENDING | Fix 11 |

---

## Questions 13-15 Assessment (Sequential Thinking)

### Q13: Single Zo API Key for All Peers?

**Sequential Analysis:**

**Step 1 — Current State:**
- Each peer has its own `metadata.apiKey` field in `PeerInfo`
- But in practice, only Zo adapter uses it
- Agentic and Antigravity use stdio (no API key needed)

**Step 2 — Options:**

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **A: Single shared key** | All peers use same `ZO_API_KEY` | Simple, works for demo | Security risk, no per-peer audit |
| **B: Per-peer identity keys** | Each peer gets own API key | Full audit trail, isolated auth | More complex key management |
| **C: Peer-specific tokens** | Agentic uses Agentic token, Antigravity uses its own | Logical separation | Need token generation system |

**Step 3 — Recommendation:**

**DO: Per-peer identity keys** (Option B)

**Rationale:**
1. Security: If one peer is compromised, others aren't affected
2. Audit: Can track which peer made which API call
3. Zo Computer supports multiple access tokens via [Settings > Access Tokens](/?t=settings&s=advanced)
4. Each peer (Agentic, Antigravity) should have its own identity

**Implementation:**
```typescript
interface PeerCredentials {
  peerId: PeerId;
  apiKey: string;      // Zo API key for this peer
  permissions: string[];  // What this peer can access
}
```

---

### Q14: Context Sync Frequency?

**Sequential Analysis:**

**Step 1 — Current State:**
- Manual sync via `mesh.syncContext()`
- No automatic periodic sync
- Each peer decides when to sync

**Step 2 — Options:**

| Option | Frequency | Pros | Cons |
|--------|-----------|------|------|
| **A: Real-time** | On every operation | Freshest state | Bandwidth heavy, potential thrash |
| **B: Periodic (5s)** | Every 5 seconds | Balance of freshness/size | May miss rapid changes |
| **C: Periodic (30s)** | Every 30 seconds | Lightweight | Stale data between syncs |
| **D: Event-driven** | On significant events only | Most efficient | May miss indirect dependencies |
| **E: Hybrid** | Event-driven + periodic heartbeat | Best of both | Most complex |

**Step 3 — Decision Framework:**

Context types and appropriate sync frequency:

| Context Type | Example | Recommended Sync |
|-------------|---------|-----------------|
| `activeFile` | Currently open file | Real-time (event) |
| `openFiles` | All open tabs | On open/close (event) |
| `activeTask` | Current work item | On task change (event) |
| `conversation` | Chat thread | On message (event) |
| `peer` | Peer state | Periodic (30s) |
| `sharedMemory` | Cross-peer memory | On store (event) |

**Step 4 — Recommendation:**

**Hybrid (Option E): Event-driven primary + periodic heartbeat**

```typescript
const CONTEXT_SYNC_CONFIG = {
  // Event-driven syncs (immediate)
  onFileOpen: true,
  onFileClose: true,
  onTaskChange: true,
  onMessage: true,
  onMemoryStore: true,
  
  // Periodic heartbeat (30s)
  heartbeatInterval: 30000,
  
  // Batch multiple changes
  batchWindow: 100,  // ms
};
```

---

### Q15: Message Ordering?

**Sequential Analysis:**

**Step 1 — Current State:**
- No guaranteed ordering
- Messages can arrive out of sequence
- `replyTo` field exists but isn't used for ordering

**Step 2 — Requirements Analysis:**

| Use Case | Needs Ordering? | Consequence of Disorder |
|----------|---------------|----------------------|
| Tool calls/responses | **Yes** | Wrong response to wrong caller |
| Auth handshake | **Yes** | Security vulnerability |
| Context sync | **No** (last-write-wins) | Minor staleness acceptable |
| Event pub/sub | **No** (fire-and-forget) | Missing event acceptable |
| Resource leases | **Yes** | Race conditions possible |

**Step 3 — Options:**

| Option | Approach | Pros | Cons |
|--------|----------|------|------|
| **A: No guarantees** | Current state | Simplest, eventual consistency | Can cause rare bugs |
| **B: Per-conversation sequence** | Sequence numbers per tool call | Solves ordering for calls | Still no global order |
| **C: Total ordering** | Lamport clocks/vector clocks | Full consistency | Complex, performance cost |
| **D: Causal ordering** | Only order causally-related | Practical middle ground | Implementation complexity |

**Step 4 — Recommendation:**

**Per-conversation sequence numbers (Option B) for tool calls/responses only**

**Rationale:**
1. Tool calls ARE ordered — you expect response to your call, not someone else's
2. Other message types (events, context) don't need strict ordering
3. Vector clocks add significant complexity for marginal benefit
4. MCP protocol already has `callId` which can serve as sequence anchor

**Implementation:**
```typescript
interface OrderedMessage extends MeshMessage {
  sequence: number;        // Per-sender sequence
  conversationId?: string;  // Groups related calls
}

// Response must match:
// - conversationId (if present)
// - sequence + 1
// - callId
```

**DON'T DO:** Total ordering. The complexity/cost isn't justified for this use case. Eventual consistency is acceptable for non-critical messages.

---

## Summary Decisions

| Question | Decision |
|----------|----------|
| Q13: Per-peer API keys? | **DO** — Per-peer identity keys |
| Q14: Context sync frequency? | **Hybrid** — Event-driven + 30s heartbeat |
| Q15: Message ordering? | **Per-conversation** — Only for tool calls |
