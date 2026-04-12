# AgentOS Product Specification
## Built on the BX3 Universal Architecture — v1.0

| Field | Value |
|-------|-------|
| **Spec ID** | AGENTOS-BX3-2026-V1.0 |
| **Framework** | BX3 Universal Architecture v6.0 |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |
| **Status** | Draft — Pending Engineering Review |
| **Supersedes** | All prior AgentOS specs |

---

## 1. Product Overview

**AgentOS** is an AI workforce orchestration platform built on the BX3 Universal Architecture. Where every other AI workforce tool is a collection of agents with no governance structure, AgentOS enforces the BX3 Loop at the architectural level — every agent, every task, every execution is a bounded BX3 Loop.

**Who it's for:** Businesses that need AI workforces they can trust with high-stakes operations. Regulated industries, critical infrastructure, financial operations, legal, healthcare.

**What it does:** Provides a complete workforce orchestration platform where every AI agent operates inside a Purpose → Bounds Engine → Fact Layer loop. No agent can propose and execute. No agent can act without a human accountability anchor. Every action is on the Ledger.

**Why it's different:** Every competitor in AI workforce orchestration has the same structural problem — their agents reason and act on the same plane. When something goes wrong, accountability disappears into the model. AgentOS is structurally different. The BX3 three-property separation is the runtime architecture, not a policy.

---

## 2. The BX3 Loop as Product Architecture

Every AgentOS agent is a BX3 Loop. This is not a policy — it is the runtime architecture.

```
┌─────────────────────────────────────────────────────────┐
│                    AGENTOS LOOP                         │
│                                                         │
│  PURPOSE ────► BOUNDS ENGINE ────► FACT LAYER         │
│   ("Why")         ("How")             ("Action")       │
│                                                         │
│  ┌─────────┐      ┌─────────────┐      ┌───────────┐  │
│  │ Human   │      │ Zo / AI     │      │ AgentOS   │  │
│  │ Anchor  │ ───► │ Reasoning   │ ───► │ Executor  │  │
│  │ (Owner) │      │ (Proposer)  │      │ (Hard     │  │
│  │         │      │             │      │  Gate)    │  │
│  └─────────┘      └─────────────┘      └───────────┘  │
│                                                         │
│  OWNER sets goals  →  AI proposes  →  Executor checks  │
│  and constraints       options           and acts      │
└─────────────────────────────────────────────────────────┘
```

### 2.1 Purpose Layer (Owner Interface)

**Actor:** Human owner or designated Human Accountability Anchor.

**What it does:**
- Sets strategic goals for the agent (what outcome is this agent responsible for)
- Defines authorization boundaries (what this agent is NOT permitted to do)
- Establishes escalation thresholds (when to throw to the Bailout Protocol)
- Reviews the Ledger for accountability

**In the product:** This is the **Owner Dashboard** — web + mobile. The human sees:
- What goals are set for each agent
- What the agent has proposed and executed (Ledger view)
- What exceptions have fired
- What authorization boundaries are active

**Key constraint:** The Purpose layer MUST remain Human-anchored. An agent cannot set its own Purpose. This is architecturally enforced in the Fact Layer.

### 2.2 Bounds Engine (Agent Reasoning)

**Actor:** Zo — the heuristic reasoning engine that powers AgentOS agents.

**What it does:**
- Performs all complex reasoning: task decomposition, planning, prioritization, risk assessment
- Models outcomes in the Sandbox before proposing
- Generates proposals — never executes
- Operates in a sandboxed cognitive environment with no physical execution permissions

**In the product:** This is the **Agent Reasoning Interface**. The human sees:
- What the agent is thinking (proposal explanations)
- What simulations were run in the Sandbox
- What confidence levels exist on each proposal
- What the bounds are (what it is NOT permitted to propose)

**Key constraint:** The Bounds Engine is LIMBLESS. It can propose state transitions and recommendations. It CANNOT directly commit acts to external systems, execute financial transactions, send messages, or modify records outside its sandbox without passing through the Fact Layer.

### 2.3 Fact Layer (AgentOS Executor)

**Actor:** The AgentOS execution engine — the deterministic gate between proposal and action.

**What it does:**
- Receives proposals from the Bounds Engine
- Validates each proposal against: (a) the owner's authorization boundaries, (b) hard-coded safety constraints, (c) regulatory rules
- Executes ONLY approved actions
- Logs every event to the Ledger with SHA-256 forensic sealing
- Triggers the Bailout Protocol if a condition falls outside provisioned bounds

**In the product:** This is the **Execution Firewall**. The human sees:
- What actions the agent has taken
- What was blocked and why
- The complete forensic audit trail

**Key constraint:** The Fact Layer is 100% deterministic. If a proposal violates a constraint, it is blocked. No override from the Bounds Engine is possible. The only override is from the Purpose Layer (human owner).

---

## 3. The Five Pillars as Product Features

### Pillar 1: Loop Isolation — Task Isolation Mode

**Feature name:** Task Isolation Mode

Every task an agent performs is a self-contained BX3 sub-loop. The agent's Bounds Engine works inside the task. The Fact Layer gates task outputs. The Purpose Layer provides task context.

**Product behavior:**
- Tasks cannot share state without going through the Fact Layer
- A compromised Bounds Engine in one task cannot bleed into another task's execution
- Task outputs are gated by the Fact Layer before being passed to the next task
- Agents that call other agents must route through the Fact Layer — no direct agent-to-agent execution

**User benefit:** Enterprise customers can prove to regulators that agent reasoning and agent execution are on separate planes. Audit the task, not the model.

---

### Pillar 2: Recursive Spawning — Child Agents

**Feature name:** Child Agent Spawning

A parent agent can birth a child agent by provisioning a Worksheet — a containerized, self-contained logic set tailored to a specific context.

**Product behavior:**
- Parent agent identifies a sub-task context
- Parent provisions a child agent Worksheet via OTA delivery
- Child agent has its own BX3 loop with hard-coded pointer to parent's Purpose
- Child agent operates independently during cloud disconnection (Local Survivability)
- Child agent's telemetry and execution logs route to parent's Ledger view

**Child Agent properties:**
- Inherits parent's Purpose boundaries (cannot expand beyond parent authorization)
- Has independent Bounds Engine and Fact Layer
- Can be revoked at any time by parent or human owner
- Cannot spawn its own children without explicit parent authorization

**User benefit:** A sales agent can spawn a research child agent for a specific account. The child agent operates within the parent's strategic context. Revoke when the deal closes.

---

### Pillar 3: Spatial Firewall — Tiered Data Access

**Feature name:** Data Tier Gates

AgentOS enforces data access through resolution tiers, analogous to the Spatial Firewall in irrigation. Different agent capability tiers get access to different data planes.

**Agent Capability Tiers:**

| Tier | Label | Data Access | Execution Permissions |
|------|-------|-------------|----------------------|
| Tier 1 | Observer | Aggregated summaries only | Read-only |
| Tier 2 | Analyst | Time-series data, reports | Generate insights, no external calls |
| Tier 3 | Operator | Full data plane, integrations | Execute within authorization boundaries |
| Tier 4 | Admin | All planes, all integrations | Execute with HITL approval for high-stakes |

**Product behavior:**
- Each agent is provisioned with a tier
- The Fact Layer checks tier before serving data or allowing execution
- A Tier 1 agent cannot retrieve raw customer PII even if the Bounds Engine proposes it
- Tier upgrade requires human owner approval via the Purpose Layer

**User benefit:** Enterprise RBAC is replaced by architecturally enforced data planes. A compromised agent at Tier 1 cannot exfiltrate data it was never provisioned to access.

---

### Pillar 4: Root Tunneling — Owner Override

**Feature name:** Owner Override (Root-Pipe)

The human owner can project their Purpose into any agent or task without disrupting the hierarchy. This is NOT a "login as agent" — it is a dedicated I/O pipe.

**Product behavior:**
- Owner selects any agent and enters Root-Pipe mode
- Owner's context becomes the ground truth for that agent's Bounds Engine
- All telemetry, proposals, and executions from that agent redirect to owner's dashboard
- Hierarchy remains intact — owner is tunneling, not taking over
- When Root-Pipe is closed, agent returns to normal operation with full context of the override

**Sandbox Gate (Pre-Execution Simulation):**
- Before any high-stakes execution, AgentOS runs a Sandbox simulation
- Owner reviews the projected outcome
- Owner must explicitly approve via HITL before the Fact Layer unlocks execution
- High-stakes threshold is configurable per owner (e.g., any external API call, any financial transaction, any data deletion)

**User benefit:** The CEO can project into any agent's context for a specific crisis without disrupting operations. See exactly what the agent sees, approve or block, then exit cleanly.

---

### Pillar 5: Bailout Protocol — Exception Escalation

**Feature name:** Exception Escalation

If an agent's Bounds Engine encounters a condition it cannot resolve, it fires a **Bailout Trigger** — an async signal that propagates up the agent hierarchy, bypassing all Machine actors, until it reaches a Human Accountability Anchor.

**Three Trigger Conditions:**
1. **Capability Boundary** — Task falls outside agent's provisioned capability
2. **Safety Envelope Violation** — Sandbox shows proposed action would violate safety constraints
3. **Authorization Gap** — Decision implications exceed agent's authorization authority

**Trigger Lifecycle (visible to owner):**
```
TRIGGER_FIRED → ESCALATING_TO_PARENT → PARENT_EVALUATING
    → [Parent can resolve] → RESOLVED → logged to Ledger
    → [Parent cannot resolve] → ESCALATING_TO_ROOT → HUMAN_REVIEWING
    → Human issues directive → DIRECTIVE_EXECUTING → CLOSED
```

**The Ledger (Forensic Audit):**
Every event is logged across three simultaneous planes:

| Plane | What it Records |
|-------|----------------|
| Purpose | What the owner authorized |
| Bounds Engine | What the AI proposed and why |
| Fact Layer | What actually executed and the physical outcome |

Logs are SHA-256 sealed per event. Cannot be altered retroactively.

**User benefit:** When regulators ask "what happened and who is responsible," the Ledger is the answer. Not a chat transcript — a forensic record with cryptographic integrity.

---

## 4. Competitive Landscape

The following table is grounded in documented GitHub issue discussions, PRs, and architectural releases from each framework as of April 2026. Claims without a source note are inference from documented behavior.

| Capability | AgentOS (BX3) | CrewAI | AutoGen (Microsoft) | n8n |
|---|---|---|---|---|
| **Governance architecture** | Three-layer BX3 Loop (Purpose/Bounds/Fact) as architectural primitive | AMP Suite control plane + proposal-level guardrails plugin (`crewai-guardrails`, Issue #4502) | No native governance layer; proposal for cryptographic Agent Passport System (Issue #7372) | Workflow-level execution nodes; no governance layer above the workflow graph |
| **Hard execution firewall** | ✅ Fact Layer blocks at architectural level — not RBAC | ❌ No architectural firewall; event hooks (`before_task_execute`) are软软的软 — bypassable | ❌ No deterministic enforcement; human-in-the-loop advisory only | ❌ Nodes execute within workflow context; no hardened external gate |
| **Bounded proposer** | ✅ Bounds Engine is limbless — proposes, cannot execute | ⚠️ Agents have tool permissions but can execute autonomously within those permissions | ⚠️ Agents can invoke tools; no architectural separation between reasoning and execution | ⚠️ Agent nodes can call external services directly |
| **Upstream accountability (Bailout Protocol)** | ✅ Exception flows upward bypassing all machine actors until Human Root | ❌ Governance event hooks exist but no cascade-to-human escalation path documented | ❌ No documented escalation path; maintenance mode (no new features) | ❌ No documented exception escalation beyond workflow error handling |
| **Deterministic Ledger** | ✅ SHA-256 forensic sealing across Purpose/Bounds/Fact planes | ⚠️ Merkle audit chains proposed (Issue #4559, Agent Passport) but not shipped | ❌ Self-reported logs only; no cryptographic event sealing | ❌ Execution logs are database records; no cryptographic integrity |
| **Spatial data tiers** | ✅ 4-tier resolution gate as architectural constraint | ❌ Not applicable | ❌ Not applicable | ❌ Not applicable |
| **Human-in-the-loop (root tunneling)** | ✅ Root-Pipe Protocol for non-collapsing authority projection | ⚠️ AMP has monitoring and approval flows; not architecturally isolated from agent execution | ⚠️ Human feedback supported as part of conversation; no dedicated pipe mechanism | ⚠️ HITL node (`sendAndWait`) exists but is one node in a workflow, not an architectural layer |
| **Recursive spawning / child agents** | ✅ Worksheet mechanism for OTA child agent provisioning | ⚠️ Hierarchical delegation (`allowed_agents` per PR #2068) but no containerized child agent spawning | ❌ No spawning mechanism; flat agent topology | ⚠️ Sub-agent as separate workflow (`Call n8n Workflow`) but no native child agent model |
| **Local survivability** | ✅ Hub executes last-known-good Worksheet when cloud disconnected | ❌ No edge/offline execution model documented | ❌ No edge execution model | ❌ Requires cloud connection; no edge autonomy |
| **9-plane accountability** | ✅ P1–P9 planes documented in Section 5 | ❌ Not documented | ❌ Not documented | ❌ Not documented |
| **Formal verification path** | ✅ ILT enables formal proof of decision routing | ⚠️ Capability-Based Agent Hierarchy proposed (Issue #3491) — closed stale, not implemented | ❌ No formal verification architecture | ❌ No formal verification path |
| **Deterministic loop breaking** | ✅ Topological state machine in Fact Layer | ❌ LLM-driven polarity; can enter infinite loops | ⚠️ Topological State Machine proposal (Issue #7409) — open, not implemented | ❌ Retry logic on errors; no topological loop detection |

**Sources:**
- CrewAI: Issues #4502 (guardrails plugin), #3491 (responsibility tracking), #4559 (Agent Passport System), PR #2068 (hierarchical delegation), v1.7.0 release notes, unified Memory system PR #4420
- AutoGen: Issues #7372 (cryptographic governance), #7528 (capability-scoped authorization), #7409 (deterministic loop-breaking TSM), PR #3600 (0.4 architecture preview), Discussion #7066 (AutoGen → MAF merger)
- n8n: PR #17423 (AI Workflow Builder multi-agent), PR #25692 (unified multi-agent chat), PR #20030 (Agent V3 tooling), Issue #26373 (MCP tools in sub-agents), multi-agent handoff templates, travel planner example

---

## 5. AgentOS vs. Competitors

| Dimension | AgentOS | CrewAI | AutoGen | n8n |
|-----------|---------|--------|---------|-----|
| **Governance model** | BX3 Loop (architectural) | Policy (optional) | Policy (optional) | Workflow (no governance) |
| **Reasoning ↔ Execution separation** | Hard architectural | Soft / configurable | Soft / configurable | None |
| **Human accountability anchor** | Required (Purpose Layer) | Optional | Optional | None |
| **Deterministic execution gate** | Fact Layer (enforced) | None | None | None |
| **Tiered data access** | Spatial Firewall (architectural) | RBAC (policy) | RBAC (policy) | RBAC (policy) |
| **Exception escalation** | Bailout Protocol (architectural) | Error handling | Error handling | Error handling |
| **Forensic audit trail** | SHA-256 Ledger (every event) | Chat logs | Chat logs | Run logs |
| **Child agent spawning** | Recursive Spawning (Worksheet) | None | None | Sub-workflows |
| **Owner override** | Root-Pipe (non-collapsing) | Impersonate | Impersonate | Manual takeover |
| **Licensable** | Yes — BX3 IP | Open source | Open source | Open source |

---

## 6. Pre-v1 Feature Checklist

Each item below traces directly to the BX3 Universal Architecture v6.0 source spec. Items not grounded in the source are removed. Engineering review required to confirm feasibility.

### Purpose Layer (Owner Interface)

| # | Feature | Source | Status |
|---|---------|--------|--------|
| P1 | Owner Dashboard — goal-setting, authorization boundaries, Ledger review | BX3 Spec §2 Purpose Layer | ⬜ |
| P2 | Human Accountability Anchor — required per agent, cannot be delegated | BX3 Spec §2 "Human Root Mandate" | ⬜ |
| P3 | Authorization boundary configuration per agent | BX3 Spec §2 Purpose Layer | ⬜ |
| P4 | Escalation threshold configuration (when Bailout fires) | BX3 Spec §5 "Bailout Protocol" | ⬜ |

### Bounds Engine (Agent Reasoning)

| # | Feature | Source | Status |
|---|---------|--------|--------|
| B1 | Sandbox simulation previews before any proposal is executed | BX3 Spec §4 "Sandbox Gate" | ⬜ |
| B2 | Confidence scoring (0.0–1.0) on all proposals | BX3 Spec Glossary "Confidence Score" | ⬜ |
| B3 | Bounds display — what the agent is NOT permitted to propose | BX3 Spec §2 Purpose Layer (authorization boundaries) | ⬜ |
| B4 | Limbless enforcement — Bounds Engine cannot execute directly | BX3 Spec §2 "Limbless — no physical execution permissions" | ⬜ |

### Fact Layer (Execution Firewall)

| # | Feature | Source | Status |
|---|---------|--------|--------|
| F1 | Architectural execution gate — not RBAC, no configurable bypass | BX3 Spec §2 "100% deterministic. Hard-blocks any violation" | ⬜ |
| F2 | SHA-256 forensic sealing on every event | BX3 Spec §5 "Ledger: Cryptographically sealed forensic log" | ⬜ |
| F3 | Hard block on proposals that violate safety, regulatory, or authorization constraints | BX3 Spec §2 "Executes only commands that satisfy pre-defined safety, regulatory, and physical constraints" | ⬜ |
| F4 | Tier gate enforcement (Tiers 1–4) | BX3 Spec §3 Pillar 3 "Spatial Resolution Tiers" | ⬜ |

### Pillar 1 — Loop Isolation

| # | Feature | Source | Status |
|---|---------|--------|--------|
| L1 | Task Isolation Mode — every task is a self-contained BX3 sub-loop | BX3 Spec §3 Pillar 1 "Each BX3 Loop is self-contained" | ⬜ |
| L2 | No agent-to-agent direct execution — must route through Fact Layer | BX3 Spec §3 Pillar 1 "Bounds Engine never shares a plane with Fact Layer" | ⬜ |
| L3 | Task state isolation — compromised Bounds Engine cannot bleed across tasks | BX3 Spec §3 Pillar 1 "strictly isolated into discrete planes" | ⬜ |

### Pillar 2 — Recursive Spawning

| # | Feature | Source | Status |
|---|---------|--------|--------|
| R1 | Worksheet mechanism — parent agents birth containerized child agents | BX3 Spec §3 Pillar 2 "Worksheet: containerized BX3 Child Loop" | ⬜ |
| R2 | Child agent inherits parent's Purpose boundaries | BX3 Spec §3 Pillar 2 "Hard-coded pointer to Parent's Purpose layer" | ⬜ |
| R3 | Child agent has independent Bounds Engine + Fact Layer | BX3 Spec §3 Pillar 2 "Contains complete Bounds Engine + Fact Layer logic" | ⬜ |
| R4 | Local Survivability — child executes last-known-good Worksheet during cloud disconnection | BX3 Spec §3 Pillar 2 "Local Survivability" | ⬜ |

### Pillar 3 — Spatial Firewall

| # | Feature | Source | Status |
|---|---------|--------|--------|
| S1 | 4-tier data access gates (Observer / Analyst / Operator / Admin) | BX3 Spec §3 Pillar 3 "Spatial Resolution Tiers" | ⬜ |
| S2 | 9-plane data model (P1–P9) | BX3 Spec §4 "9-Plane DAP" | ⬜ |

### Pillar 4 — Root Tunneling

| # | Feature | Source | Status |
|---|---------|--------|--------|
| T1 | Owner Root-Pipe override — project into any agent without collapsing hierarchy | BX3 Spec §3 Pillar 4 "Root-Pipe Protocol" | ⬜ |
| T2 | Non-collapsing authority projection | BX3 Spec §3 Pillar 4 "Hierarchy remains non-collapsing" | ⬜ |
| T3 | Sandbox Gate pre-execution simulation | BX3 Spec §3 Pillar 4 "Sandbox Gate" | ⬜ |
| T4 | Full telemetry redirect to owner during Root-Pipe | BX3 Spec §3 Pillar 4 "All telemetry... redirect to Root Dashboard" | ⬜ |

### Pillar 5 — Bailout Protocol

| # | Feature | Source | Status |
|---|---------|--------|--------|
| A1 | Exception escalation chain — bypasses all machine actors to Human Root | BX3 Spec §5 "Bailout Protocol" + "Machine Actor Exclusion" | ⬜ |
| A2 | Three trigger conditions (Capability Boundary / Safety Envelope / Authorization Gap) | BX3 Spec §5 "Three Trigger Conditions" | ⬜ |
| A3 | Ledger — SHA-256 sealed forensic record across Purpose/Bounds/Fact planes | BX3 Spec §5 "Ledger: Cryptographically sealed forensic log" | ⬜ |

### Governance & Interoperability

| # | Feature | Source | Status |
|---|---------|--------|--------|
| G1 | BX3 Interchangeability Framework — Human/Machine role swap without loss of deterministic integrity | BX3 Spec §2 "Interchangeability Framework" | ⬜ |

---

**Removed items (not sourced in BX3 Spec v6.0):**
- Child agent revocation — requires engineering decision (can parent revoke? is it immediate?)
- Resolution-gated data access for agents — BX3 tier model is for irrigation; AgentOS tier mapping requires product spec decision
- Tier upgrade requires owner approval — requires product spec decision
- HITL approval with configurable thresholds — "configurable" is a product decision, HITL itself is sourced
- Full escalation chain visibility to owner — escalation chain exists but visibility UX not specified in BX3
- Deterministic loop breaking via topological state machine — TSM appears in competitive research, not in BX3 source
- Agent-to-agent coordination via Fact Layer only — inferred, not explicit in BX3
- Ledger exportable for regulatory audit — export format not specified in BX3

**Note:** ⬜ = not started. Mark ✅ when complete.

---

## 7. Glossary (AgentOS-Specific)

| Term | Definition |
|------|-----------|
| **AgentOS Loop** | A self-contained BX3 Loop inside the AgentOS product — Purpose + Bounds Engine + Fact Layer for each agent |
| **Owner** | Human Accountability Anchor — the human responsible for a given agent's Purpose layer |
| **Task Loop** | A self-contained BX3 sub-loop for a specific task, isolated from other tasks per Pillar 1 |
| **Child Agent** | An agent spawned by a parent agent via Recursive Spawning, with its own BX3 Loop and Worksheet |
| **Worksheet** | Containerized logic set delivered to a Child Agent, containing Bounds Engine + Fact Layer configuration |
| **Tier Gate** | The Fact Layer enforcement point that checks agent capability tier before serving data or allowing execution |
| **Root-Pipe** | The Owner Override mechanism — human projects into agent context without collapsing hierarchy |
| **Bailout Trigger** | Exception event fired by Bounds Engine when a condition exceeds provisioned capability, safety envelope, or authorization |
| **Ledger** | SHA-256 sealed forensic log — records Purpose authorization, Bounds Engine proposal, and Fact Layer execution for every event |

---

## 8. Reference

This document is the product implementation of: `file 'Bxthre3/VAULT/BX3-UNIVERSAL-SPEC.md'` (BX3-GEN-2026-SPEC-V6.0)

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*