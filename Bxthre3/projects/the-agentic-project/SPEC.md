# AgentOS / Agentic — Product Specification
## Built on the BX3 Universal Architecture v6.1

| Field | Value |
|-------|-------|
| **Spec ID** | AGENTOS-BX3-2026-V1.2 |
| **Framework** | BX3 Universal Architecture v6.1 |
| **Date** | April 12, 2026 |
| **Author** | Jeremy Beebe, Bxthre3 Inc. |
| **Status** | ACTIVE — Production Deployed |
| **Supersedes** | All prior AgentOS specs |
| **Live Endpoints** | 70+ API routes on brodiblanco.zo.space/api/agentic/* |

---

## 1. Product Overview

**AgentOS** (also known as Agentic) is an AI workforce orchestration platform built on the BX3 Universal Architecture. Every agent, every task, every execution is a bounded BX3 Loop. No agent can propose and execute. No agent can act without a human accountability anchor. Every action is on the Ledger.

**Who it's for:** Businesses that need AI workforces they can trust with high-stakes operations. Regulated industries, critical infrastructure, financial operations, legal, healthcare.

**Why it's different:** Every competitor in AI workforce orchestration has agents that reason and act on the same plane. AgentOS enforces the BX3 three-property separation as the runtime architecture — not a policy.

**Current state:** 70+ production routes deployed across /api/agentic/* including workforce management, DAP evaluation, forensic tracing, FTE synthesis, voice command, LinkedIn integration, OTA updates, and Android task management.

---

## 2. The BX3 Loop as Runtime Architecture

```
PURPOSE ────► BOUNDS ENGINE ────► FACT LAYER
  ("Why")         ("How")             ("Action")
     ▲               ▲                   ▲
  Human          Limbless            Deterministic
  Anchor         Proposer            Physical Firewall
```

### Purpose Layer (Owner Interface)

**Actor:** Human owner or designated Human Accountability Anchor.

**What it does:**
- Sets strategic goals for the agent
- Defines authorization boundaries (what this agent is NOT permitted to do)
- Establishes escalation thresholds (when to throw to the Bailout Protocol)
- Reviews the Ledger for accountability

**Product feature:** Owner Dashboard (web + mobile) — goal-setting, Ledger view, exception monitoring, authorization boundary config.

**Constraint:** Purpose layer MUST remain Human-anchored. Architecturally enforced at the Fact Layer.

### Bounds Engine (Agent Reasoning)

**Actor:** Zo — the heuristic reasoning engine that powers AgentOS agents.

**What it does:**
- Task decomposition, planning, prioritization, risk assessment
- Models outcomes in Sandbox before proposing
- Generates proposals — never executes
- Operates in a sandboxed cognitive environment with no physical execution permissions

**Product feature:** Agent Reasoning Interface — proposal explanations, simulation results, confidence scores, bounds display.

**Constraint:** Limbless. Cannot directly commit acts to external systems without passing through the Fact Layer.

### Fact Layer (AgentOS Executor)

**Actor:** The AgentOS execution engine — deterministic gate between proposal and action.

**What it does:**
- Receives proposals from Bounds Engine
- Validates against: (a) owner's authorization boundaries, (b) hard-coded safety constraints, (c) regulatory rules
- Executes ONLY approved actions
- Logs every event to the Ledger with SHA-256 forensic sealing
- Triggers Bailout Protocol if condition falls outside provisioned bounds

**Product feature:** Execution Firewall — action log, blocked actions with reasons, complete forensic audit trail.

**Constraint:** 100% deterministic. If a proposal violates a constraint, it is blocked. Only override is from Purpose Layer (human owner).

---

## 3. The Five Pillars as Product Features

### Pillar 1: Loop Isolation — Task Isolation Mode

Every task an agent performs is a self-contained BX3 sub-loop. The agent's Bounds Engine works inside the task. The Fact Layer gates task outputs. The Purpose Layer provides task context.

**Product behavior:**
- Tasks cannot share state without going through the Fact Layer
- A compromised Bounds Engine in one task cannot bleed into another task's execution
- Task outputs are gated by the Fact Layer before being passed to the next task
- Agents that call other agents must route through the Fact Layer — no direct agent-to-agent execution

### Pillar 2: Recursive Spawning — Child Agents

A parent agent births a child agent by provisioning a **Worksheet** — a containerized, self-contained logic set tailored to a specific context.

**Product behavior:**
- Parent provisions a child agent Worksheet via OTA delivery
- Child has its own BX3 loop with hard-coded pointer to parent's Purpose
- Child operates independently during cloud disconnection (Local Survivability)
- Child's telemetry and execution logs route to parent's Ledger view

**Child Agent properties:**
- Inherits parent's Purpose boundaries
- Has independent Bounds Engine and Fact Layer
- Can be revoked at any time by parent or human owner

### Pillar 3: Spatial Firewall — Tiered Data Access

AgentOS enforces data access through capability tiers. Different tiers get access to different data planes.

| Tier | Label | Data Access | Execution Permissions |
|------|-------|-------------|----------------------|
| Tier 1 | Observer | Aggregated summaries only | Read-only |
| Tier 2 | Analyst | Time-series data, reports | Generate insights, no external calls |
| Tier 3 | Operator | Full data plane, integrations | Execute within authorization boundaries |
| Tier 4 | Admin | All planes, all integrations | Execute with HITL approval for high-stakes |

### Pillar 4: Root Tunneling — Owner Override

The human owner can project their Purpose into any agent or task without disrupting the hierarchy. This is NOT a "login" — it is a dedicated I/O pipe.

**Sandbox Gate (Pre-Execution Simulation):**
- Zo models projected outcome in digital twin environment
- Owner reviews the projected outcome
- Explicit HITL approval required before Fact Layer unlocks execution

### Pillar 5: Bailout Protocol — Exception Escalation

If an agent's Bounds Engine encounters a condition it cannot resolve, it fires a **Bailout Trigger** — an async signal that propagates up the agent hierarchy, bypassing all Machine actors, until it reaches a Human Accountability Anchor.

**Three Trigger Conditions:**
1. **Capability Boundary** — Task falls outside agent's provisioned capability
2. **Safety Envelope Violation** — Sandbox shows proposed action would violate safety constraints
3. **Authorization Gap** — Decision implications exceed agent's authorization authority

**Trigger Lifecycle:**
```
TRIGGER_FIRED → ESCALATING_TO_PARENT → PARENT_EVALUATING
    → [Parent can resolve] → RESOLVED → logged to Ledger
    → [Parent cannot resolve] → ESCALATING_TO_ROOT → HUMAN_REVIEWING
    → Human issues directive → DIRECTIVE_EXECUTING → CLOSED
```

**The Ledger:** Every event logged across three simultaneous planes:

| Plane | What it Records |
|-------|----------------|
| Purpose | What the owner authorized |
| Bounds Engine | What the AI proposed and why |
| Fact Layer | What actually executed and the physical outcome |

SHA-256 sealed per event. Cannot be altered retroactively.

---

## 4. The 9-Plane DAP as Operational State Model

AgentOS implements the 9-Plane Data Action Protocol as defined in the BX3 Universal Architecture. Every event is decomposed into 9 discrete, orthogonal planes.

```
              | Purpose       | Bounds Engine   | Fact
--------------|---------------|-----------------|--------------
Past          | P1: Mandate   | P4: Reason Log  | P7: Outcome Rec
Present       | P2: Intent    | P5: Decision    | P8: Execution
Future-Pred   | P3: Plan      | P6: Projection  | P9: Projection Conf
```

**Plane Isolation Rule:** No plane can write to any other plane. Architecturally enforced.

**Tamper-Evident Ledger:** All 9 planes linked through a cryptographically chained log. Any retrospective modification breaks the chain and is detectable in O(1) verification time.

---

## 5. Competitive Landscape

| Capability | AgentOS (BX3) | CrewAI | AutoGen (Microsoft) | n8n |
|---|---|---|---|---|
| **Governance architecture** | Three-layer BX3 Loop as architectural primitive | Policy (optional) | Policy (optional) | Workflow (no governance) |
| **Hard execution firewall** | Fact Layer blocks at architectural level — not RBAC | No architectural firewall | No deterministic enforcement | No hardened external gate |
| **Bounded proposer** | Bounds Engine is limbless — proposes, cannot execute | Agents execute autonomously within tool permissions | Agents invoke tools directly | Agent nodes call external services directly |
| **9-plane accountability** | P1-P9 planes from BX3 Universal Architecture | Not documented | Not documented | Not documented |
| **Upstream accountability** | Exception flows upward bypassing all machine actors to Human Root | No documented cascade-to-human path | No documented escalation path | No documented exception escalation |
| **Deterministic Ledger** | SHA-256 forensic sealing across Purpose/Bounds/Fact planes | Merkle audit chains proposed but not shipped | Self-reported logs only | Database records, no cryptographic integrity |
| **Spatial data tiers** | 4-tier resolution gate as architectural constraint | Not applicable | Not applicable | Not applicable |
| **Human-in-the-loop** | Root-Pipe Protocol for non-collapsing authority projection | AMP monitoring/approval flows | Human feedback as conversation part | HITL node exists but is one node in a workflow |
| **Recursive spawning** | Worksheet mechanism for OTA child agent provisioning | Hierarchical delegation, no containerized spawning | Flat agent topology | Sub-agent as separate workflow |
| **Local survivability** | Executes last-known-good Worksheet when cloud disconnected | No edge/offline execution model | No edge execution model | Requires cloud connection |
| **Formal verification path** | 9-Plane DAP enables formal proof of decision routing | Capability-Based Agent Hierarchy proposed | No formal verification architecture | No formal verification path |

---

## 6. Feature Checklist (Sourced from BX3 Universal Architecture v6.1)

### Purpose Layer

| # | Feature | Source | Status |
|---|---------|--------|--------|
| P1 | Owner Dashboard — goal-setting, authorization boundaries, Ledger review | BX3 Arch 2 "Purpose Layer" | - |
| P2 | Human Accountability Anchor — required per agent, cannot be delegated | BX3 Arch 2 "Human Root Mandate" | - |
| P3 | Authorization boundary configuration per agent | BX3 Arch 2 "Purpose Layer" | - |
| P4 | Escalation threshold configuration (when Bailout fires) | BX3 Arch 5 "Bailout Protocol" | - |

### Bounds Engine

| # | Feature | Source | Status |
|---|---------|--------|--------|
| B1 | Sandbox simulation previews before any proposal is executed | BX3 Arch 4 "Sandbox Gate" | - |
| B2 | Confidence scoring (0.0-1.0) on all proposals | BX3 Arch Glossary | - |
| B3 | Bounds display — what the agent is NOT permitted to propose | BX3 Arch 2 "Purpose Layer" | - |
| B4 | Limbless enforcement — Bounds Engine cannot execute directly | BX3 Arch 2 "Limbless" | - |

### Fact Layer

| # | Feature | Source | Status |
|---|---------|--------|--------|
| F1 | Architectural execution gate — not RBAC, no configurable bypass | BX3 Arch 2 "100% deterministic" | - |
| F2 | SHA-256 forensic sealing on every event | BX3 Arch 3 "Tamper-Evident Ledger" | - |
| F3 | Hard block on proposals violating safety, regulatory, or authorization constraints | BX3 Arch 2 "executes only commands that satisfy pre-defined constraints" | - |
| F4 | Tier gate enforcement (Tiers 1-4) | BX3 Arch 3 "Spatial Resolution Tiers" | - |

### Pillar 1 — Loop Isolation

| # | Feature | Source | Status |
|---|---------|--------|--------|
| L1 | Task Isolation Mode — every task is a self-contained BX3 sub-loop | BX3 Arch 3 Pillar 1 | - |
| L2 | No agent-to-agent direct execution — must route through Fact Layer | BX3 Arch 3 Pillar 1 | - |
| L3 | Task state isolation — compromised Bounds Engine cannot bleed across tasks | BX3 Arch 3 Pillar 1 | - |

### Pillar 2 — Recursive Spawning

| # | Feature | Source | Status |
|---|---------|--------|--------|
| R1 | Worksheet mechanism — parent agents birth containerized child agents | BX3 Arch 3 Pillar 2 "Worksheet" | - |
| R2 | Child agent inherits parent's Purpose boundaries | BX3 Arch 3 Pillar 2 "hard-coded pointer to Parent's Purpose" | - |
| R3 | Child agent has independent Bounds Engine + Fact Layer | BX3 Arch 3 Pillar 2 "complete Bounds Engine + Fact Layer logic" | - |
| R4 | Local Survivability — child executes last-known-good Worksheet during cloud disconnection | BX3 Arch 3 Pillar 2 "Local Survivability" | - |

### Pillar 3 — Spatial Firewall

| # | Feature | Source | Status |
|---|---------|--------|--------|
| S1 | 4-tier data access gates (Observer / Analyst / Operator / Admin) | BX3 Arch 3 Pillar 3 "Spatial Resolution Tiers" | - |
| S2 | Deterministic Funnel — request beyond tier triggers automated commercial upgrade | BX3 Arch 3 "Deterministic Funnel" | - |

### Pillar 4 — Root Tunneling

| # | Feature | Source | Status |
|---|---------|--------|--------|
| T1 | Owner Root-Pipe override — project into any agent without collapsing hierarchy | BX3 Arch 3 Pillar 4 "Root-Pipe Protocol" | - |
| T2 | Non-collapsing authority projection | BX3 Arch 3 Pillar 4 "hierarchy remains non-collapsing" | - |
| T3 | Sandbox Gate pre-execution simulation | BX3 Arch 3 Pillar 4 "Sandbox Gate" | - |
| T4 | HITL approval for high-stakes actions | BX3 Arch 3 Pillar 4 "Human-in-the-Loop approval" | - |

### Pillar 5 — Bailout Protocol

| # | Feature | Source | Status |
|---|---------|--------|--------|
| A1 | Exception escalation chain — bypasses all machine actors to Human Root | BX3 Arch 5 "Bailout Protocol" | - |
| A2 | Three trigger conditions (Capability Boundary / Safety Envelope / Authorization Gap) | BX3 Arch 5 "Three Trigger Conditions" | - |
| A3 | SHA-256 sealed forensic record across Purpose/Bounds/Fact planes | BX3 Arch 3 "Tamper-Evident Ledger" | - |

### 9-Plane DAP

| # | Feature | Source | Status |
|---|---------|--------|--------|
| D1 | 9 discrete planes (P1-P9) as operational state architecture | BX3 Arch 3 "9-Plane DAP" | - |
| D2 | Plane isolation — no cross-plane writes | BX3 Arch 3 "Plane Isolation Rule" | - |
| D3 | Tamper-evident cryptographic Ledger chain | BX3 Arch 3 "Tamper-Evident Ledger" | - |

---

## 7. Glossary

| Term | Definition |
|------|-----------|
| **AgentOS Loop** | A self-contained BX3 Loop inside AgentOS — Purpose + Bounds Engine + Fact Layer for each agent |
| **Owner** | Human Accountability Anchor — human responsible for an agent's Purpose layer |
| **Task Loop** | A self-contained BX3 sub-loop for a specific task, isolated per Pillar 1 |
| **Child Agent** | An agent spawned via Recursive Spawning, with its own BX3 Loop and Worksheet |
| **Worksheet** | Containerized logic set delivered to a Child Agent — Bounds Engine + Fact Layer configuration |
| **Tier Gate** | Fact Layer enforcement point checking agent capability tier before serving data or allowing execution |
| **Root-Pipe** | Owner Override mechanism — human projects into agent context without collapsing hierarchy |
| **Bailout Trigger** | Exception event fired when a condition exceeds capability, safety envelope, or authorization |
| **Ledger** | SHA-256 sealed forensic log — records Purpose authorization, Bounds Engine proposal, Fact Layer execution for every event |

---

## 8. Reference

This document is the product implementation of: `file 'Bxthre3/VAULT/BX3-UNIVERSAL-ARCHITECTURE.md'` (BX3-GEN-2026-V6.1)

*BX3 Inc. All rights reserved. Patent pending. Proprietary and Confidential.*
