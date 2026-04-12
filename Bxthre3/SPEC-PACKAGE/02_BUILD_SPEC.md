# AGENTIC V1 — FORMAL BUILD SPECIFICATION

**Classification:** BX3 Engineering Specification  
**Document Type:** BUILD_SPEC  
**Version:** 1.0.0-DRAFT  
**Date:** April 5, 2026  
**Status:** PROTOTYPE → PRODUCTION ENGINEERING  

---

## 1. EXECUTIVE SUMMARY

Agentic (formerly Agentic) is BX3's deterministic AI workforce orchestration platform. V1 delivers an event-driven, antifragile, causally-transparent system for managing autonomous agents across agricultural (Irrig8), gaming (VPC), and enterprise SaaS verticals.

**Key Innovation:** Zero-polling agent architecture with 9-Plane Deterministic Assessment Protocol (DAP) and forensic event lineage.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    REALITY LAYER (Tier 0)                     │
│  Sensors • Markets • Users • Financial • Regulatory          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ 10-Point Reality Vector
┌─────────────────────────────────────────────────────────────┐
│                 EVENT INGESTION LAYER                        │
│  POST /api/agentic/events/ingest                             │
│  • UUIDv7 event IDs                                          │
│  • SHA-256 forensic sealing                                  │
│  • Cascade depth tracking                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ DAP Evaluation
┌─────────────────────────────────────────────────────────────┐
│              DAP — 9-PLANE EVALUATION ENGINE                   │
│  Plane 1: Temporality      Plane 4: Economic Value          │
│  Plane 2: Spatiality       Plane 5: Fidelity Threshold       │
│  Plane 3: Compositional    Plane 6: Execution Matrix          │
│           (z_neg/z_pos)    (z_pos/z_neg/Cascade)            │
│  Plane 7: Evolutionary     Plane 8: Thermodynamic Bounds      │
│  Plane 9: Governance                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
    all_match: TRUE           all_match: FALSE
            │                         │
            ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│   CASCADE MODE   │      │   BLOCK MODE     │
│ Emit child events│      │ Log, alert, wait │
│ Trigger agents   │      │ for next event   │
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              AGENT SUBSCRIPTION REGISTRY                     │
│  Event-pattern → Agent mapping                               │
│  Reactive wake-only architecture                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Models

#### Event Schema (10-Point Reality Vector)
```typescript
interface RealityVector {
  t: number;        // Temporality: Unix timestamp (ms)
  s_x: number;      // Spatiality X: Longitude or 0D coordinate
  s_y: number;      // Spatiality Y: Latitude or 1D coordinate
  z_negative: number; // Compositional Lower: Moisture %, etc.
  z_positive: number; // Compositional Upper: Time since irrigation
  c: number;        // Fidelity: Confidence [0.0, 1.0]
  l: string;        // Legality: "COMPLIANT" | "REVIEW" | "BLOCK"
  v_f: number;      // Economic: Value fidelity score
  e: number;        // Execution: Economic value at stake ($)
  g: string;        // Governance: "APPROVED" | "PENDING" | "REJECTED"
}

interface AgenticEvent {
  event_id: string;        // UUIDv7
  event_type: string;      // Dot-notation taxonomy
  tier_source: 1 | 2 | 3;  // Reality | System | Agent
  vector: RealityVector;
  execution: {
    plane_triggered: number[];
    agent_bindings?: string[];
  };
  metadata: {
    correlation_id: string;
    ancestry_hash?: string;
    session_id?: string;
  };
  forensic: {
    created_at: number;
    hash_input: string;
    sealed: boolean;
  };
}
```

#### DAP Plane Definitions
```typescript
interface DAPPlane {
  id: number;
  name: string;
  threshold_fn: (vector: RealityVector) => boolean;
  weight: number;
}

const DAP_PLANES: DAPPlane[] = [
  { id: 1, name: "temporality", threshold_fn: v => v.t > 0, weight: 0.05 },
  { id: 2, name: "spatiality", threshold_fn: v => v.s_x !== 0 || v.s_y !== 0, weight: 0.10 },
  { id: 3, name: "compositional_lower", threshold_fn: v => v.z_negative < -0.20, weight: 0.15 },
  { id: 4, name: "economic_value", threshold_fn: v => v.e > 100, weight: 0.10 },
  { id: 5, name: "fidelity", threshold_fn: v => v.c > 0.80, weight: 0.20 },
  { id: 6, name: "execution_matrix", threshold_fn: v => v.z_positive < 0.25, weight: 0.15 },
  { id: 7, name: "evolutionary", threshold_fn: v => v.v_f > 0.5, weight: 0.10 },
  { id: 8, name: "thermodynamic", threshold_fn: v => true, weight: 0.05 },
  { id: 9, name: "governance", threshold_fn: v => v.g === "COMPLIANT" && v.l === "APPROVED", weight: 0.10 }
];
```

---

## 3. API SPECIFICATION

### 3.1 Event Ingestion

**Endpoint:** `POST /api/agentic/events/ingest`

**Request Body:**
```json
{
  "event_type": "sfd.irrig8.moisture.critical",
  "tier_source": 1,
  "vector": {
    "t": 1712332800000,
    "s_x": 37.1234,
    "s_y": -105.5678,
    "z_negative": -0.18,
    "z_positive": 0.15,
    "c": 0.98,
    "l": "COMPLIANT",
    "v_f": 0.85,
    "e": 2500,
    "g": "APPROVED"
  },
  "execution": {
    "plane_triggered": [1, 2, 5, 6, 7, 8, 9]
  },
  "metadata": {
    "correlation_id": "irrigation-001",
    "session_id": "slv-field-7"
  }
}
```

**Response:**
```json
{
  "event_id": "019d6091-0678-79be-9681-66f3e9d90550",
  "correlation_id": "irrigation-001",
  "cascade_depth": 2,
  "dap_evaluation": {
    "planes_evaluated": [1, 2, 5, 6, 7, 8, 9],
    "all_match": true,
    "planes7to9_pass": true,
    "final_state": "execute",
    "plane_results": {
      "1": { "matched": true, "threshold": "t > 0" },
      "2": { "matched": true, "threshold": "s_x || s_y !== 0" },
      "5": { "matched": true, "threshold": "c > 0.80" },
      "6": { "matched": true, "threshold": "z_positive < 0.25" },
      "7": { "matched": true, "threshold": "v_f > 0.5" },
      "8": { "matched": true, "threshold": "default true" },
      "9": { "matched": true, "threshold": "g === COMPLIANT" }
    }
  },
  "child_events": [
    {
      "event_id": "019d6091-0678-79be-9681-66f3e9d90551",
      "tier": 2,
      "type": "dhu.aggregate.demand"
    },
    {
      "event_id": "019d6091-0678-79be-9681-66f3e9d90552",
      "tier": 3,
      "type": "rss.market.signal"
    }
  ],
  "sealed": true,
  "hash_prefix": "a3f7b2...",
  "tier": 1
}
```

### 3.2 Agent Trigger Registry

**Endpoint:** `POST /api/agentic/agents/subscribe`

**Purpose:** Register agent event subscriptions (replaces polling)

**Request:**
```json
{
  "agent_id": "sentinel",
  "subscriptions": [
    "sys.security.anomaly.detected",
    "cha.failure.injected",
    "met.threat_level.critical"
  ],
  "callback_url": "https://brodiblanco.zo.space/api/agentic/agents/sentinel/webhook",
  "auth_token_hash": "sha256:..."
}
```

**Response:**
```json
{
  "subscription_id": "sub_sentinel_001",
  "status": "active",
  "patterns_registered": 3,
  "last_wake": null
}
```

### 3.3 Forensic Trace

**Endpoint:** `GET /api/agentic/forensic/trace?event_id={id}&depth={n}`

**Response:**
```json
{
  "root_event": {
    "event_id": "019d6091-...",
    "type": "sfd.irrig8.moisture.critical",
    "created_at": "2026-04-05T14:23:00Z"
  },
  "cascade_tree": [
    {
      "depth": 0,
      "event_id": "019d6091-...",
      "agent_triggers": [],
      "verification": "valid"
    },
    {
      "depth": 1,
      "event_id": "019d6091-...",
      "type": "dhu.aggregate.demand",
      "parent": "019d6091-...",
      "agent_triggers": ["demand-forecaster"],
      "verification": "valid"
    },
    {
      "depth": 2,
      "event_id": "019d6091-...",
      "type": "rss.market.signal",
      "parent": "019d6091-...",
      "agent_triggers": ["market-analyst", "pricing-engine"],
      "verification": "valid"
    }
  ],
  "cascade_depth": 2,
  "verification": {
    "hash_chain_valid": true,
    "tamper_detected": false,
    "missing_events": []
  }
}
```

---

## 4. AGENT ARCHITECTURE

### 4.1 Agent State Machine

```
┌─────────┐     Event Match      ┌─────────┐
│  SLEEP  │ ───────────────────► │  WAKE   │
└─────────┘                        └────┬────┘
      ▲                               │
      │                               │ Process
      │                               ▼
      │                          ┌─────────┐
      │                          │  REACT  │
      │                          └────┬────┘
      │                               │
      │                               ▼
      │                          ┌─────────┐
      │                          │  EMIT   │
      │                          └────┬────┘
      │                               │
      └───────────────────────────────┘
                   Return to SLEEP
```

### 4.2 Agent Contract

```typescript
interface AgenticAgent {
  id: string;
  name: string;
  department: string;
  subscriptions: EventPattern[];
  
  // Lifecycle hooks
  onWake(event: AgenticEvent): Promise<Reaction>;
  onReact(context: ReactionContext): Promise<Emission[]>;
  onEmit(emissions: Emission[]): Promise<void>;
  onSleep(): Promise<void>;
  
  // Metadata
  version: string;
  capabilities: string[];
  required_planes: number[]; // DAP planes this agent needs
}

interface Reaction {
  action: "process" | "delegate" | "escalate" | "ignore";
  confidence: number;
  estimated_duration_ms: number;
}

interface Emission {
  event_type: string;
  vector: Partial<RealityVector>;
  target_agents?: string[];
  priority: "P0" | "P1" | "P2" | "P3";
}
```

---

## 5. DATABASE SCHEMA

### 5.1 Event Store (DuckDB/SQLite)

```sql
-- Events table with forensic integrity
CREATE TABLE events (
  event_id UUID PRIMARY KEY,
  event_type VARCHAR(128) NOT NULL,
  tier_source TINYINT NOT NULL CHECK (tier_source IN (1, 2, 3)),
  
  -- Reality Vector (10-Point)
  v_t BIGINT NOT NULL,
  v_s_x DOUBLE,
  v_s_y DOUBLE,
  v_z_neg DOUBLE,
  v_z_pos DOUBLE,
  v_c DOUBLE CHECK (v_c BETWEEN 0.0 AND 1.0),
  v_l VARCHAR(32),
  v_v_f DOUBLE,
  v_e BIGINT,
  v_g VARCHAR(32),
  
  -- Execution metadata
  execution_planes JSON,
  agent_bindings JSON,
  
  -- Cascade lineage
  correlation_id VARCHAR(64) NOT NULL,
  parent_event_id UUID REFERENCES events(event_id),
  cascade_depth TINYINT DEFAULT 0,
  
  -- Forensic sealing
  hash_input TEXT NOT NULL,
  hash_full VARCHAR(64) NOT NULL,
  sealed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_type (event_type),
  INDEX idx_correlation (correlation_id),
  INDEX idx_tier (tier_source),
  INDEX idx_temporality (v_t)
);

-- Agent registry
CREATE TABLE agent_subscriptions (
  agent_id VARCHAR(64) PRIMARY KEY,
  event_patterns JSON NOT NULL, -- Array of glob patterns
  callback_url VARCHAR(256),
  auth_hash VARCHAR(64),
  status VARCHAR(16) DEFAULT 'sleeping',
  last_wake TIMESTAMP,
  wake_count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cascade log for debugging
CREATE TABLE cascade_log (
  log_id UUID PRIMARY KEY,
  root_event_id UUID NOT NULL,
  depth TINYINT NOT NULL,
  event_count INT NOT NULL,
  agents_triggered JSON,
  dap_result VARCHAR(16),
  completed_at TIMESTAMP
);
```

---

## 6. DEPLOYMENT SPECIFICATION

### 6.1 Infrastructure Requirements

| Component | Spec | Purpose |
|-----------|------|---------|
| Compute | 2 vCPU, 4GB RAM minimum | Event processing, DAP evaluation |
| Storage | 100GB SSD | Event store, forensic logs |
| Network | 100Mbps, <50ms latency | Real-time cascade latency |
| Database | DuckDB or SQLite | Embedded, zero-config |
| Queue | In-memory + persistence | Event buffering during spikes |

### 6.2 Service Topology

```
┌─────────────────────────────────────┐
│         LOAD BALANCER               │
│    (Zo Space Edge / Cloudflare)     │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐   ┌─────▼──────┐
│  API Node  │   │  API Node  │
│  (Primary) │   │  (Failover)│
└──────┬─────┘   └─────┬──────┘
       │               │
       └───────┬───────┘
               │
        ┌──────▼──────┐
        │  Event Bus  │
        │  (SQLite)   │
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌────▼───┐ ┌───▼──┐
│Agent  │ │Agent   │ │Agent │
│Pool A │ │Pool B  │ │Pool C│
└───────┘ └────────┘ └──────┘
```

### 6.3 Environment Configuration

```yaml
# agentic-v1.config.yaml
environment: production
version: 1.0.0

# DAP Configuration
dap:
  planes: 9
  threshold_strictness: strict  # strict | lenient | adaptive
  cascade_max_depth: 5
  cascade_timeout_ms: 30000

# Event Store
events:
  retention_days: 365
  forensic_enabled: true
  compression: zstd

# Agent Pool
agents:
  max_concurrent: 100
  default_ttl_seconds: 300
  wake_timeout_ms: 5000

# Security
security:
  hash_algorithm: sha3-256
  signature_required: true
  event_encryption: false  # Enable for PII/sensitive

# Observability
observability:
  cascade_tracing: true
  agent_metrics: true
  dap_plane_metrics: true
  sse_stream: true
```

---

## 7. TESTING STRATEGY

### 7.1 Unit Tests

```typescript
// DAP evaluation test
describe("DAP Plane Evaluation", () => {
  test("Plane 5 (Fidelity) rejects c < 0.80", () => {
    const vector = { ...defaultVector, c: 0.75 };
    expect(evaluatePlane(5, vector)).toBe(false);
  });
  
  test("All 9 planes match → execute state", () => {
    const event = createMockEvent({ allPlanes: true });
    const result = dap.evaluate(event);
    expect(result.final_state).toBe("execute");
    expect(result.all_match).toBe(true);
  });
});
```

### 7.2 Integration Tests

```typescript
// Cascade integration test
describe("Event Cascade", () => {
  test("Irrig8 moisture event triggers 2 child events", async () => {
    const event = mockIrrig8Event();
    const result = await ingestEvent(event);
    
    expect(result.cascade_depth).toBe(2);
    expect(result.child_events).toHaveLength(2);
    expect(result.child_events[0].tier).toBe(2);
    expect(result.child_events[1].tier).toBe(3);
  });
  
  test("Forensic trace verifies cascade integrity", async () => {
    const trace = await forensicTrace(rootEventId);
    expect(trace.verification.hash_chain_valid).toBe(true);
    expect(trace.verification.tamper_detected).toBe(false);
  });
});
```

### 7.3 Load Tests

```bash
# Target: 10,000 events/second sustained
echo "Testing event throughput..."
for i in {1..10000}; do
  curl -s -X POST https://brodiblanco.zo.space/api/agentic/events/ingest \
    -d "{\"event_type\":\"test.load.$i\",...}" &
done
wait
echo "Completed 10,000 concurrent events"
```

---
## 8. ACCEPTANCE CRITERIA

| ID | Criterion | Test | Status |
|----|-----------|------|--------|
| AC-001 | DAP evaluates 9 planes in <10ms | Benchmark | ⬜ |
| AC-002 | Cascade depth 5 completes in <100ms | Benchmark | ⬜ |
| AC-003 | 10,000 events/second sustained | Load test | ⬜ |
| AC-004 | Zero polling agents verified | Log analysis | ⬜ |
| AC-005 | Forensic trace 99.99% accurate | Tamper test | ⬜ |
| AC-006 | Agent wake latency <50ms | Latency test | ⬜ |
| AC-007 | Event store 365-day retention | Storage test | ⬜ |
| AC-008 | Cascade dashboard real-time <1s | UI test | ⬜ |

---

## 9. MILESTONES

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **P0: Foundation** | 2 weeks | Core event bus, DAP engine, SQLite persistence |
| **P1: Agent Runtime** | 2 weeks | Subscription registry, webhook triggers, agent SDK |
| **P2: Forensics** | 1 week | Hash chains, cascade tracing, verification API |
| **P3: Dashboard** | 1 week | Real-time SSE, cascade visualization, metrics |
| **P4: Scale** | 2 weeks | Load testing, optimization, failover |
| **P5: Harden** | 2 weeks | Security audit, chaos testing, docs |

**Total V1 Delivery:** 10 weeks (2.5 months)

---

## 10. NAMING MIGRATION

| Legacy | New | Migration Path |
|--------|-----|----------------|
| Agentic | Agentic | DNS, repos, docs (2-week transition) |
| `/agentic` routes | `/agentic` routes | 301 redirects + update clients |
| `agentic-*` packages | `agentic-*` packages | Deprecate old, publish new |
| Agent roster (19) | Keep | No change needed |
| Android package `com.agenticnative` | `com.agentic` | Update build.gradle |

---

## APPENDIX A: EVENT TAXONOMY

### Tier 1: Reality Events
- `sfd.{system}.{component}.{action}` — Sensor/Field Data
- `rss.{source}.{category}.{event}` — Market/Regulatory Signals  
- `usr.{product}.{action}.{result}` — User Actions
- `fin.{type}.{action}.{amount}` — Financial Events
- `inv.{stage}.{action}.{outcome}` — Investor Actions

### Tier 2: System Events
- `sys.{component}.{status}.{severity}` — Infrastructure
- `cha.{failure_type}.{impact}.{recovery}` — Chaos/Antifragility
- `met.{metric_name}.{threshold}.{direction}` — Metric Thresholds
- `dap.{evaluation_type}.{result}.{depth}` — DAP Evaluations

### Tier 3: Agent Events
- `agt.{agent_id}.{action}.{status}` — Agent Lifecycle
- `syn.{insight_type}.{confidence}.{action}` — Synthesis
- `pmt.{action_type}.{target}.{priority}` — Prompt/Action

---

**Document Control:**  
**Author:** Agentic Architecture Team  
**Reviewers:** brodiblanco, Engineering  
**Next Review:** April 12, 2026  
**Status:** DRAFT — Pending approval for P0 kickoff