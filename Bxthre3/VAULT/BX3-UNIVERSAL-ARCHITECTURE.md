# BX3 Universal Architecture
## The Definitive Canonical Framework Document

| Field | Value |
|-------|-------|
| **Document ID** | BX3-GEN-2026-V6.1 |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |
| **Status** | Final — Tier-1 Infrastructure Specification |
| **Supersedes** | BX3-GEN-2026-V6.0 |

---

## Preamble

The BX3 Universal Architecture is a functional, actor-agnostic framework for the governance of high-stakes recursive systems. It decouples three functional properties — **Purpose**, **Bounded Reasoning**, and **Fact** — to create a "Universal Operating System" where Human and Machine actors are functionally interchangeable without loss of deterministic integrity.

The architecture solves the "Black Box" problem in AI by ensuring every computational state is grounded in a physical, deterministic constraint. Every node in the system — from the Human Root to the individual field sensor — is a self-contained BX3 loop. We are no longer managing people or AI; we are managing **Immutable Layered Loops**.

---

## Part I: The Core Architecture — The BX3 Loop

Traditional systems define roles by **who** performs a task. BX3 defines the **functional properties** required for the system to remain stable, regardless of which actor occupies a layer.

### The Three Layers

| Layer | Name | Actor | Role | Key Property |
|-------|------|-------|------|-------------|
| L1 | **Purpose** | Human Accountability Anchor | Sets SLOs, strategic goals, authorization boundaries | Must remain Human-anchored |
| L2 | **Bounds Engine** | Heuristic Engine (Zo) | Computes, proposes state transitions; never executes | Limbless — no physical execution permissions |
| L3 | **Fact Layer** | Oracle + Physical Substrate | Physical firewall. Executes only commands satisfying safety/regulatory/physical constraints | 100% deterministic. Hard-blocks any violation |

### The BX3 Loop

```
PURPOSE ────► BOUNDS ENGINE ────► FACT LAYER
  ("Why")         ("How")             ("Action")
    ▲               ▲                   ▲
 Human          Limbless            Deterministic
 Anchor         Proposer            Physical Brake
```

### The Interchangeability Framework

Purpose, Bounds Engine, and Fact are **functional properties**, not roles. Human and Machine actors can be swapped across these layers without loss of deterministic integrity — provided the functional property requirements are met. This is the basis for scalable human-machine teaming.

**Non-negotiable rule:** The Purpose layer must always remain Human-anchored. This is architecturally enforced at the Fact Layer.

---

## Part II: The Five Pillars

### Pillar 1: Loop Isolation

**Problem Solved:** Logic Collisions — reasoning and execution occupying the same functional plane, enabling un-vetted autonomous actions.

**Solution:** Purpose, Bounds Engine, and Fact Layer are strictly isolated into discrete planes. Each BX3 Loop is self-contained. Collisions are architecturally impossible because the Bounds Engine never shares a plane with the Fact Layer.

**Human Root Mandate:** A single human architect can govern an infinite tree of agents and machines with absolute precision.

---

### Pillar 2: Recursive Spawning

**Problem Solved:** Logic Rigidity — static firmware edge devices that cannot adapt to local conditions without a constant cloud heartbeat.

**Mechanism:** A Parent Node births a Child Loop by provisioning a **Worksheet** — a containerized, self-contained logic set delivered Over-the-Air (OTA) to the target node.

**Worksheet Properties:**
- Contains complete Bounds Engine + Fact Layer logic for the target environment
- Hard-coded pointer to Parent's Purpose layer — prevents autonomous drift
- Executable locally during cloud disconnection (**Local Survivability**)

**The Physical Telemetry Chain:**
1. **Passive Telemetry Nodes:** High-frequency raw data, no local processing
2. **Encrypted Aggregators:** Package, compress, encrypt at source
3. **Local Execution Hubs:** Apply Worksheet logic, transform signals into auditable actuations

---

### Pillar 3: Spatial Firewall

**Problem Solved:** Soft software permissions that can be bypassed.

**Solution:** Spatial resolution is treated as a **physical, hard-coded constraint** of the Fact Layer — not a software permission.

**Spatial Resolution Tiers:**

| Tier | Label | Resolution | Access Rule |
|------|-------|-----------|-------------|
| Tier 1 | Free | 50m | Public |
| Tier 2 | Basic | 20m | Gate checks node provisioning |
| Tier 3 | Pro | 10m | Gate checks provisioning + authorization |
| Tier 4 | Enterprise | 1m | Gate checks provisioning + authorization + contract |

**The Deterministic Funnel:** When a node requests resolution beyond its provisioned tier, the Fact Layer intercepts at the database level and triggers an automated commercial upgrade workflow. Growth is an inherent system rule — not a sales task.

---

### Pillar 4: Root Tunneling

**Problem Solved:** Abstraction Leakage — hierarchy collapse when a human logs into a sub-node, losing global context and breaking the recursive audit trail.

**Mechanism:** The **Root-Pipe Protocol** enables the Human Root to project authority into any node without collapsing the hierarchy.

**Properties:**
- Hierarchy remains **non-collapsing** — node structure is tunneled, not flattened
- All telemetry, task queues, and Worksheet logs redirect to Root Dashboard
- Human's Purpose becomes ground truth for that node's Bounds Engine
- Not a "login" — a dedicated I/O Pipe for authority projection

**The Sandbox Gate:**
1. Zo models projected outcome in digital twin environment
2. Human reviews simulation
3. Human-in-the-Loop (HITL) approval unlocks Fact Layer for physical execution

---

### Pillar 5: Bailout Protocol

**Problem Solved:** The "Black Box" problem — autonomous actions orphaned from human responsibility.

**Mechanism:** If a sub-node encounters a condition it cannot resolve, it propagates an exception asynchronously up the recursive tree, **bypassing all Machine actors**, until anchored by a Human Accountability Anchor.

**Three Trigger Conditions:**
1. **Capability Boundary** — Condition falls outside provisioned operational range
2. **Safety Envelope Violation** — Sandbox simulation shows proposed action would violate safety constraints
3. **Authorization Gap** — Decision implications exceed node's legal/ethical authority

**Trigger Lifecycle:**
```
TRIGGER_FIRED → DELIVERING_TO_PARENT → PARENT_EVALUATING
    → [Parent can resolve] → RESOLVED_LOCALLY → CLOSED
    → [Parent cannot resolve] → ESCALATING_TO_ROOT → HUMAN_ROOT_REVIEWING
    → Human issues directive → DIRECTIVE_EXECUTING → CLOSED
```

---

## Part III: The 9-Plane Data Action Protocol (DAP)

### The Problem: Confused Planes and Manufactured History

In conventional autonomous systems, telemetry logs, decision records, execution confirmations, and audit entries are written by the same software system to the same database. A compromised reasoning engine can modify its own audit trail, backdate decision logs, and present a false operational history. The system meant to provide accountability is itself unauditable.

### The Solution: 9 Discrete, Orthogonal Planes

The 9-Plane DAP decomposes every autonomous system event into 9 discrete planes organized as a 3×3 matrix:

- **Columns:** Purpose (Why) / Bounds Engine (How) / Fact (Action)
- **Rows:** Past / Present / Future-Predicted

```
              | Purpose       | Bounds Engine   | Fact
--------------|---------------|-----------------|--------------
Past          | P1: Mandate   | P4: Reason Log  | P7: Outcome Rec
Present       | P2: Intent    | P5: Decision    | P8: Execution
Future-Pred   | P3: Plan      | P6: Projection  | P9: Projection Conf
```

### Plane Definitions

| Plane | Name | Function | Who Writes |
|-------|------|----------|------------|
| P1 | Mandate | Historical Purpose directives that authorized current operational context | Human Root (append-only) |
| P2 | Intent | Active Purpose directive currently governing node operation | Human Root only |
| P3 | Plan | Bounds Engine's predicted future Purpose sequence (projection only — no execution authority) | Bounds Engine (read-only from execution) |
| P4 | Reason Log | Complete historical record of every reasoning step — hypotheses, data queries, simulations, rejections | Bounds Engine (append-only) |
| P5 | Decision | Current active decision proposal — bridge between reasoning and execution | Bounds Engine |
| P6 | Projection | Bounds Engine's simulation of probable futures; informs Sandbox Gate decisions | Bounds Engine (read-only from execution) |
| P7 | Outcome Record | Immutable record of every physical event — sensor readings, actuator states, environmental measurements | Fact Layer (append-only) |
| P8 | Execution | Active execution command being acted upon | Fact Layer |
| P9 | Projection Confirmation | Sandbox Gate's validation that projected execution will succeed within Safety Envelope parameters | Fact Layer |

### Plane Isolation Rule

**No plane can write to any other plane.** This is architecturally enforced.

- P5 (Decision) can trigger P8 (Execution) only through the Sandbox Gate
- P4 (Reason Log) is written exclusively by the Bounds Engine
- P7 (Outcome Record) is written exclusively by the Fact Layer
- P2 (Intent) can only be modified by Human Root action

### The Tamper-Evident Ledger

All 9 planes are linked through the **Ledger** — a cryptographically chained log that makes retrospective tampering structurally evident.

Each Ledger entry contains:
- SHA-256 hash of the previous entry (chain integrity)
- Timestamp from hardware secure module
- Plane identifier (P1–P9)
- Content hash of the plane record
- Sequential entry number

Any retrospective modification breaks the chain. The break is detectable in O(1) verification time.

---

## Part IV: Dimensional Context Profiling

### The Problem: Single-Point Readings Mask Real Conditions

Every system has "depth" — conditions that vary along a dimension where a single-point reading masks the real state. In irrigation: soil depth. In AI systems: task stack depth, memory tiers, context levels. In cloud infrastructure: multi-layer resource states. In all cases, decisions made from a single-point reading are systematically wrong because they cannot see stratification.

### The Solution: Continuous Multi-Depth Profiling

**Dimensional Context Profiling** is a method for creating a continuous, indexed profile along any operational dimension — using that indexed profile as a primary input for all allocation decisions.

**General Structure:**
- **Axis:** The operational dimension (depth, time, context level, stack layer)
- **Stratification Index:** A computed ratio comparing readings at one position along the axis to readings at another position, identifying anomalous stratification events
- **Update Frequency:** Defined per-axis; minimum 4x the system's decision cycle

**Generalized Stratification Index:**
```
SI = (Reading_A / Reading_B) * weighting_factor
SI > Upper_Threshold = stratification event type A (e.g., saturation, over-allocation, depth-anxiety)
SI < Lower_Threshold = stratification event type B (e.g., drought, under-allocation, context-starvation)
```

**Application Examples:**

| Domain | Axis | Reading A | Reading B | Weighting Factor | Event Type A |
|--------|------|-----------|-----------|------------------|--------------|
| Irrigation | Soil depth | Surface VWC | Root-zone VWC | Root density | Over-irrigation |
| AI Orchestration | Context depth | Surface context | Deep context | Cognitive load | Context starvation |
| Cloud Infra | Stack layer | Application layer | Infrastructure layer | Request density | Resource exhaustion |
| Finance | Account depth | Transaction level | Ledger level | Transaction weight | Reconciliation failure |

### Key Properties
- **Generalized principle** — applicable across all domains
- **Product implementations** define their own axis, thresholds, and weighting factors
- **Stratification Index** always computed as a ratio of readings at different positions on the axis

---

## Part V: Architectural Summary

### The BX3 Loop (Summary)
```
Purpose (Why) → Bounds Engine (How) → Fact (Action)
     ↑               ↑                   ↑
   Human          Limbless            Deterministic
   Anchor         Proposer            Physical Firewall
```

### The Recursive Tree
```
Level 0: Human Root
    ↓ Recursive Spawning (Worksheet OTA)
Level N: Execution Node (Local BX3 Loop)
    ↓ Telemetry Chain
Level N+1: Passive Sensors / Data Nodes
```

### Plane Isolation (9-Plane DAP)
```
P1/P2/P3 (Purpose) ←→ P4/P5/P6 (Bounds Engine) ←→ P7/P8/P9 (Fact)
     No cross-plane writes. Ledger is the only binding thread.
```

### Resolution Tiers
```
Tier 1 (50m) → Tier 2 (20m) → Tier 3 (10m) → Tier 4 (1m)
     ↓ Deterministic Funnel triggers commercial upgrade if over-tier
```

### Dimensional Context Profiling
```
Axis ← Stratification Index ← Multi-depth readings ← Domain-specific sensors/logs
     ↓
Product implementations define axis + thresholds + weighting
```

---

## Appendix: Key Definitions

| Term | Definition |
|------|-----------|
| **BX3 Loop** | Self-contained governance unit: Purpose + Bounds Engine + Fact Layer |
| **Purpose** | Layer 1 — Human accountability anchor; sets strategic goals and authorization boundaries |
| **Bounds Engine** | Layer 2 — Heuristic engine that proposes; limbless (no execution permissions) |
| **Fact Layer** | Layer 3 — Physical firewall; executes only commands satisfying hard-coded constraints |
| **Interchangeability Framework** | Property enabling Human/Machine actors to swap roles without loss of deterministic integrity |
| **Logic Collision** | Failure mode where reasoning and execution occupy the same functional plane |
| **Loop Isolation** | Architectural separation of Purpose, Bounds Engine, and Fact Layer into discrete planes |
| **Worksheet** | Containerized BX3 Child Loop — encapsulated logic set delivered OTA to a node |
| **Recursive Spawning** | Parent node births a Child Loop by provisioning a Worksheet |
| **Local Survivability** | Node's ability to execute last-known-good Worksheet during cloud disconnection |
| **Spatial Firewall** | Physical, hard-coded resolution gating at the Fact Layer |
| **Resolution Pop** | Discrete spatial resolution tier; access beyond triggers commercial funnel |
| **Deterministic Funnel** | Automated commercial upgrade triggered when a node requests resolution beyond its tier |
| **Root Tunneling** | Root-Pipe Protocol enabling Human Root to project authority into any node without collapsing hierarchy |
| **Sandbox Gate** | Pre-deployment validation sandbox — models outcome before physical actuators unlock |
| **Bailout Protocol** | Exception escalation path bypassing all Machine actors and routing to Human Root |
| **Cascading Trigger** | Self-propagating exception event when a node encounters an unresolvable condition |
| **Machine Actor Exclusion** | Property of exception propagation chain that excludes Machine Accountability Anchors from resolution path |
| **Ledger** | Cryptographically sealed forensic log across Purpose/Bounds Engine/Fact planes for every event |
| **Human Root Mandate** | Non-negotiable rule: Purpose layer must always remain Human-anchored |
| **9-Plane DAP** | Complete operational state architecture — 9 independent planes, each independently loggable and auditable |
| **Plane Isolation Rule** | No plane can write to any other plane — architecturally enforced |
| **Tamper-Evident Ledger** | Cryptographically chained log; any retrospective modification breaks the chain and is detectable in O(1) |
| **Dimensional Context Profiling** | Method for creating continuous indexed profiles along any operational dimension to detect stratification events |
| **Stratification Index** | Computed ratio comparing readings at different positions on an axis; identifies anomalous conditions |

---

*Canonical document synthesized from: BX3-GEN-2026-V4.0 Master Blueprint, BX3 White Papers (WP-01 through WP-07), 5 Pillar Deep-Dives. All sources April 12, 2026, author Jeremy Beebe, Bxthre3 Inc.*

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*