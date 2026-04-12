# AGENTIC V1 — Pure Event-Driven Architecture

**Classification:** BX3 Core Infrastructure  
**Date:** April 5, 2026  
**Paradigm Shift:** ZERO scheduled polling. 100% reactive cascade.

---

## I. ARCHITECTURAL PRINCIPLE

**No more `rrule`. No more "every 6 hours". No more "daily at 8:15".**

Agentic V1 operates on **Reality Events → Cascade Evaluation → Agent Trigger**.

```
Reality emits event → DAP 12-Plane Evaluation → Cascade Decision → Agents React
```

---

## II. 4-TIER CASCADE SYSTEM

### Tier 1: SFD (Sensed Field Data)
**Event Sources:**
- `sfd.moisture.reading` (Irrig8 soil sensors)
- `sfd.pivot.position` (center-pivot telemetry)
- `sfd.satellite.image` (Planet Labs downlink)
- `sfd.weather.alert` (NOAA/NWS API)
- `sfd.vpc.wager.placed` (Valley Players Club)
- `sfd.agent.task.completed` (Agentic workforce)

**Trigger Condition:** SFD planes [1,2,5,7,8,9] → `PROCEED` or `BLOCK`

### Tier 2: PMT (Probabilistic Model Trigger)
**Generated Events:**
- `pmt.irrigation.recommended` (moisture + weather + economic)
- `pmt.market.opportunity` (demand aggregation)
- `pmt.risk.flagged` (anomaly detection)

**Trigger Condition:** PMT planes [3,4,6] → confidence threshold met

### Tier 3: DHU (Deterministic Human Unlock)
**Generated Events:**
- `dhu.worksheet.issued` (Irrig8 water court compliance)
- `dhu.approval.requested` (human-in-the-loop)
- `dhu.automated.execution` (FTE bypass)

**Trigger Condition:** DHU planes [7,8,9] → legal + economic + fidelity

### Tier 4: RSS (Resilient System State)
**Generated Events:**
- `rss.execution.confirmed` (deterministic action logged)
- `rss.market.signal` (external system broadcast)
- `rss.anomaly.captured` (antifragile learning)

---

## III. AGENT REACTOR PATTERN

### Legacy (V6/V7)
```
rrule: "FREQ=DAILY;BYHOUR=8;BYMINUTE=15" → wake up → scan → report → sleep
```

### Agentic V1 (Event-Driven)
```
subscription: "pmt.irrigation.recommended" → react → execute → emit completion → sleep
```

### Agent Registration API
```typescript
// POST /api/agentic/agents/register
{
  "agent_id": "zoe",
  "subscriptions": [
    "sfd.*",           // All sensed field data
    "pmt.market.*",    // Market opportunities
    "dhu.approval.*"   // Human unlock requests
  ],
  "dap_planes": [1,2,7,8,9],  // Planes this agent evaluates
  "cascade_priority": 1,       // Tier 1 responder
  "execution_mode": "deterministic" // vs "probabilistic"
}
```

---

## IV. EVENT SCHEMA (10-Point Reality Vector)

Every event carries:

| Field | Description | Example |
|-------|-------------|---------|
| `t` | Timestamp (ms since epoch) | `1712332800000` |
| `s_x` | Spatial X (lat/long or abstract) | `37.1234` |
| `s_y` | Spatial Y | `-105.5678` |
| `z_negative` | Risk/concern metric | `-50` (drought stress) |
| `z_positive` | Value/opportunity metric | `0.15` (moisture %) |
| `c` | Confidence [0.0-1.0] | `0.98` |
| `l` | Lifecycle state | `ACTIVE`, `PENDING`, `COMPLETE` |
| `v_f` | Fidelity (ground truth) | `1.0` |
| `e` | Economic value ($) | `250` |
| `g` | Governance status | `COMPLIANT`, `FLAGGED` |

---

## V. DAP 12-PLANE EVALUATION

Each event cascades through 12 deterministic planes:

### SFD Planes (1-6)
| Plane | Threshold | Description |
|-------|-----------|-------------|
| 1 | `z_positive < 0.20` | Moisture critical |
| 2 | `time > 24h` | Irrigation overdue |
| 3 | `c > 0.90` | High confidence |
| 4 | `v_f > 0.95` | Ground truth validated |
| 5 | `percolation > 0.50` | Soil absorption active |
| 6 | `spatial_coverage > 0.80` | Sufficient field coverage |

### DHU Planes (7-9)
| Plane | Threshold | Description |
|-------|-----------|-------------|
| 7 | `e > 0` | Positive ROI |
| 8 | `v_f > 0.95` | Human-verified fidelity |
| 9 | `g == COMPLIANT` | Legal/governance clear |

### PMT Planes (10-12)
| Plane | Threshold | Description |
|-------|-----------|-------------|
| 10 | `model_confidence > 0.85` | ML prediction trust |
| 11 | `anomaly_score < 0.10` | No outliers detected |
| 12 | `temporal_consistency` | Matches historical |

**Cascade Rule:** `planes 7-9` (DHU) must ALL match for FTE (Full Trust Execution)

---

## VI. AGENT TRIGGER MATRIX

| Agent | Subscriptions | DAP Planes | Cascade Action |
|-------|--------------|------------|----------------|
| **zoe** | `sfd.*`, `pmt.*`, `rss.anomaly.*` | [7,8,9] | Chief of Staff coordination |
| **pulse** | `sfd.agent.*`, `rss.execution.*` | [1,2] | Workforce state management |
| **iris** | `pmt.*`, `dhu.*` | [3,4,10,11,12] | Engineering sprint triggers |
| **atlas** | `sfd.*`, `rss.*` | [5,6,7,8] | Operations orchestration |
| **maya** | `pmt.market.*`, `rss.funding.*` | [7,9] | Grant opportunity capture |
| **sentinel** | `sfd.*`, `rss.anomaly.*` | [1,2,3,4] | System monitor / alerts |
| **vas-orchestrator** | `pmt.*`, `dhu.*` | [7,8,9] | Value-add service identification |

---

## VII. CASCADE LIFECYCLE

```
1. REALITY EMITS
   └─ Soil sensor → sfd.moisture.reading {z_positive: 0.15, e: 250}

2. SFD INGEST
   └─ DAP Planes 1-6 evaluated
   └─ Planes 1,2,5,6 triggered → PROCEED

3. CASCADE TO PMT
   └─ pmt.irrigation.recommended generated
   └─ DAP Planes 10-12 evaluated
   └─ Model predicts optimal window → HIGH CONFIDENCE

4. CASCADE TO DHU
   └─ dhu.worksheet.issued generated
   └─ DAP Planes 7-9 evaluated
   └─ ROI positive, fidelity high, compliant → FTE ISSUED

5. CASCADE TO RSS
   └─ rss.execution.confirmed generated
   └─ System state updated
   └─ Antifragile learning capture

6. AGENTS REACT
   └─ zoe: Receives rss.execution.confirmed → update dashboard
   └─ pulse: Receives dhu.worksheet.issued → log task completion
   └─ sentinel: Monitors sfd.moisture.reading → watch for next cycle
```

---

## VIII. IMPLEMENTATION STATUS

| Component | Status | Endpoint |
|-----------|--------|----------|
| Event Ingest | ✅ Live | `POST /api/agentic/events/ingest` |
| DAP Evaluation | ✅ Live | `POST /api/agentic/dap/evaluate` |
| Cascade Stream | ✅ Live | `GET /api/agentic/events/stream` |
| Agent Reactor | 🔄 In Progress | `POST /api/agentic/agents/register` |
| Forensic Trace | ✅ Live | `GET /api/agentic/forensic/trace` |
| Antifragile Mutation | 🔄 Planned | `POST /api/agentic/chaos/ingest` |
| Reality Consensus | 🔄 Planned | `POST /api/agentic/consensus/vote` |

---

## IX. ZERO POLLING COMMITMENT

**What we're eliminating:**
- ❌ `rrule` schedules
- ❌ Daily/hourly wake-ups
- ❌ "Check for updates" loops
- ❌ Polling APIs

**What we're embracing:**
- ✅ Event subscriptions
- ✅ Reactive cascades
- ✅ Push-based notifications
- ✅ DAP-gated execution

---

## X. FUNDING CASCADE INTEGRATION

The Funding Departments (Patent, Deal, SBIR, RBF) are **Tier 2+ agents** in this architecture:

| Funding Event | Tier | Triggered By | Emits |
|--------------|------|--------------|-------|
| `ip.provisional.filed` | PMT (Tier 2) | Patent attorney completion | `pmt.patent.protected` |
| `investor.term_sheet.received` | DHU (Tier 3) | DAP planes 7-9 match | `dhu.raise.initiated` |
| `grant.nsf.submitted` | RSS (Tier 4) | SBIR agent completion | `rss.nondilutive.secured` |

---

*Agentic V1: Events cascade. Agents react. Reality propagates.*
