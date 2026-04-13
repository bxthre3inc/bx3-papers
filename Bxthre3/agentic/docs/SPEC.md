# FINAL AGENTIC V1 SPEC — MERGED
**Bxthre3 Inc | Merged from OLD + NEW sources | 2026-04-12**
**Sources: OLD Agentic TS (~16,400 lines, 50+ modules) + NEW BX3 Universal Architecture**

---

## WHAT THE OLD AGENTIC (TS) HAS — AND HOW IT MAPS

### Core Systems (ALL 8 Phases Complete)

| Module | File | What It Does | Rust Equivalent |
|--------|------|-------------|----------------|
| **Supermemory** | `core/memory/store.ts` | Graph memory (nodes+edges), profile, disk persistence | `memory/` |
| **Employee Hierarchy** | `core/hierarchy/org.ts` | 19-agent roster, org chart, reporting chains | `agent_registry.rs` |
| **Standup Protocol** | `core/protocol/messaging.ts` | Daily standup router, inbox/outbox, message envelope | Built-in |
| **Escalation Clock** | `core/escalation/clock.ts` | 24h blockers, human escalation, P0-P3 severity | Built-in |
| **12-Hour Reporting** | `core/reporting/synthesizer.ts` | UAO daily digest, agent summaries | Built-in |
| **Sprint Mode** | `core/sprint/mode.ts` | Deadline reallocation, 4h objection window, peer voting | Built-in |
| **Sub-Agent Spawner** | `core/subagent/spawner.ts` | Parallel execution, merged results | Built-in |

### Architecture Components (The Starting 5)

| Component | File | What It Does |
|-----------|------|-------------|
| **War Room** | `core/warroom/consensus.ts` | 4/5 manager consensus voting |
| **Monitors** | `core/monitors/index.ts` | Real-time: sentiment, tone, Discord, email |
| **Risk Scorer** | `core/risk/scorer.ts` | Sub-second: financial/legal/technical/reputational |
| **Department Router** | `core/departments/router.ts` | 9 departments, auto-route |
| **Erica** | `core/bxthre3/executive-briefing.ts` | 2× daily executive briefings |
| **Vance** | `core/employees/vance.ts` | Founder's second brain, pattern learning, comms ingestion |

### Gap Fixes (Architecture Gaps Fixed in OLD)

| Gap | File | Status |
|----|------|--------|
| **Event Bus** | `core/events/bus.ts` | ✅ Pub/sub with `BXTHRE3_EVENTS` constants |
| **State Snapshots** | `core/snapshot/manager.ts` | ✅ Backup/rollback |
| **Conflict Resolution** | `core/conflict/resolver.ts` | ✅ Mediation |
| **Knowledge Transfer** | `core/transfer/manager.ts` | ✅ Context preservation on offboarding |

### Bxthre3-Specific Modules (Unique to OLD)

| Module | File | Purpose |
|--------|------|---------|
| **Grant Lifecycle Manager** | `core/grants/manager.ts` | Pipeline: ESTCP, NSF, USDA, DOE, ARPA-E |
| **IP Portfolio Manager** | `core/ip/portfolio.ts` | Patents: provisional/full/granted/licensed tracking |
| **Overwatch v2** | `core/mentor/overwatch-v2.ts` | Aggressive comms scanning, proactive escalation |
| **Project Manager** | `core/projects/manager.ts` | Multi-project tracking, resource conflicts |
| **Subsidiary Manager** | `core/subsidiary/manager.ts` | Entity isolation (Irrig8 LLC, VPC LLC, RAIN LLC, etc.) |
| **Hiring Recruiter** | `core/hiring/recruiter.ts` | Agent hiring pipeline |
| **Performance Tracker** | `core/performance/tracker.ts` | Per-agent metrics |
| **Capacity Intelligence** | `core/projects/detector.ts` | Resource conflict detection |
| **Board Report** | `core/bxthre3/board-report.ts` | Investor-facing metrics |
| **Fundraising Manager** | `core/bxthre3/fundraising.ts` | Deal stage tracking |
| **Voice Interface** | `core/voice/interface.ts` | STT/TTS integration |
| **Analytics (Predictive)** | `core/analytics/predictive.ts` | Forecasting |
| **A/B Testing** | `core/analytics/ab-testing.ts` | Experiment framework |
| **Cost Dashboard** | `core/analytics/cost-dashboard.ts` | WU pricing tracking |
| **Budget Tracker** | `core/budget/tracker.ts` | Burn rate monitoring |
| **Compliance Logger** | `core/compliance/logger.ts` | Audit trail |
| **Onboarding System** | `core/onboarding/system.ts` | Agent onboarding |
| **Strategy (Goals)** | `core/goals/strategy.ts` | Long-term objectives |
| **Drift Guardian** | `core/drift/guardian.ts` | Watchdog for plan drift |
| **Secret Rotation** | `core/security/rotation.ts` | API key rotation |
| **Rate Limiter** | `core/security/rate-limiter.ts` | API rate limiting |
| **Backup Manager** | `core/snapshot/backup.ts` | Automated backups |
| **Notifications** | `core/notifications/manager.ts` | Human-readable alerts |
| **Emergency Override** | `core/emergency/override.ts` | Sovereign override |
| **Training** | `core/training/onboard.ts` | Agent training |
| **Collaboration Chat** | `core/collaboration/chat.ts` | Inter-agent chat |

### Infrastructure Layer (Decoupled)

| Module | File | Purpose |
|--------|------|---------|
| **LLM Provider** | `infrastructure/llm/provider.ts` | Pluggable LLM (OpenAI/Anthropic/local) |
| **Storage Manager** | `infrastructure/storage/manager.ts` | Abstracted persistence |
| **Secrets** | `infrastructure/config/secrets.ts` | API key management |
| **Decoupled Runtime** | `infrastructure/runtime/decoupled.ts` | Standalone mode |
| **Gmail Integration** | `integrations/gmail.ts` | Email |
| **Calendar Integration** | `integrations/calendar.ts` | Google Calendar |
| **GitHub Integration** | `integrations/github.ts` | Repository access |

### Hybrid Architecture

| Module | File | Purpose |
|--------|------|---------|
| **Zo Bridge** | `core/hybrid/zobridge.ts` | Zo ↔ Agentic communication |
| **Engine** | `core/hybrid/engine.ts` | Hybrid orchestration |
| **Local Intelligence** | `core/hybrid/local-intelligence.ts` | Local model fallback |

---

## WHAT THE NEW BX3 ADDS (What's Missing from OLD)

| Pillar | OLD Has | NEW Adds | Merge Decision |
|--------|--------|---------|---------------|
| **P0: Purpose** | ❌ None | Determinism enforced via Truth Gate | **ADD** — `truth_gate.rs` |
| **P1: Bounds** | ❌ None | Command whitelist, sandbox, rate limits | **ADD** — `shell.rs` |
| **P2: Fact** | ❌ None | No-Fetch-No-Think, SHA3-256 forensic sealing | **ADD** — `truth_gate.rs`, forensic module |
| **P3: Root** | ❌ None | Federated mesh (4 nodes: Nexus/Forge/Boost/Field), mTLS | **ADD** — `mesh/` |
| **P4: Tunnel** | ❌ None | Remote Runtime Protocol, Deterministic Gatekeeping | **ADD** — `mesh/protocol.rs` |

### Federated Mesh Architecture (NEW — NOT in OLD)

```
Zo (Nexus) ← mTLS → Kali (Forge) ← mTLS → Render (Boost) ← mTLS → Android (Field)
     ↓                ↓                  ↓                  ↓
Master Ledger    GPU/Security       Elastic Workers      SMS Layer
Truth Gate      Isolation          Batch Tasks          Mobile Edge
```

**OLD had no federated mesh.** This is the biggest structural gap.

### Self-Modification Engine (NEW — NOT in OLD)

| Phase | OLD Has | NEW Adds |
|-------|--------|---------|
| Observe | Pattern learning (Vance) | Execution trace analysis |
| Hypothesize | None | Skill proposal generation |
| Test | None | Sandboxed skill validation |
| Commit | None | Version-controlled skill push |

**OLD has NO self-modification.** Pure reactive system.

---

## MERGED DECISIONS — WHAT GOES INTO FINAL V1 SPEC

### Architecture: Hybrid (OLD + NEW)

| Layer | Source | Component |
|-------|--------|-----------|
| **Clients** | OLD | CLI, SMS, Email, Webapp, Android, iOS |
| **Skills Server** | NEW (add) | Skill registry, dynamic tool loading |
| **Federated Nodes** | NEW (add) | Nexus/Forge/Boost/Field mesh |
| **Core Engine** | OLD + NEW | Event bus + DAP + Federated routing |
| **Runtime** | OLD | Task queue, phase gates, IER, coherence |
| **Domain Modules** | OLD | Grants, IP, Projects, Subsidiaries, etc. |
| **Protected Kernel** | NEW (add) | Truth Gate, Shell, Self-Mod |
| **Hardware** | NEW (add) | 4-node compute mesh |

### What to KEEP from OLD (Best-in-Class)

- `core/grants/manager.ts` — Production-grade grant pipeline
- `core/ip/portfolio.ts` — Patent lifecycle with provisional tracking
- `core/sprint/mode.ts` — 4h objection window is **genuinely good**
- `core/employees/vance.ts` — Pattern learning is mature
- `core/mentor/overwatch-v2.ts` — Aggressive escalation logic
- `core/memory/store.ts` — Graph memory with edges
- `core/events/bus.ts` — `BXTHRE3_EVENTS` constants are solid
- Infrastructure layer (decoupled architecture)

### What to ADD from NEW

- Truth Gate (`truth_gate.rs`) — No-Fetch-No-Think enforcement
- Deterministic Shell (`shell.rs`) — Command whitelist
- Federated Mesh (`mesh/`) — 4-node gossip protocol
- Remote Runtime Protocol — Cross-node communication
- Self-Modification Engine — Darwin Gödel cycle
- Forensic Sealing — SHA3-256 hash chains

### What to REPLACE in OLD

| OLD Component | Replacement | Reason |
|--------------|-------------|--------|
| Event bus (file-based) | In-memory + SQLite pub/sub | Performance |
| `AgentRuntime` stubs | Full async runtime | Real execution |
| File-based config | Type-safe config | Safety |
| Sync-only agents | Async + streaming | Real-time |

### What to DESIGN FRESH (Neither OLD nor NEW)

- **DAP (9-Plane Evaluation)** — Not in OLD, referenced but not implemented in NEW spec
- **IER Router** — `orchestration/IER_ROUTER.py` exists but no training loop
- **Federated consensus** — NEW mentions gossip, no concrete protocol
- **Client SMS layer** — NEW mentions SMS, no protocol spec

---

## FINAL V1 SPEC — STRUCTURE

```
agentic/
├── src/
│   ├── lib.rs                      # Exports
│   ├── bin/agentic.rs              # CLI entry
│   ├── api/
│   │   ├── mod.rs                  # Axum handlers
│   │   └── middleware.rs           # Auth, rate limit
│   ├── core/
│   │   ├── mod.rs
│   │   ├── agent_registry.rs       # KEEP: OLD org.ts logic
│   │   ├── task_queue.rs           # KEEP: Phase gate logic
│   │   ├── event_bus.rs            # KEEP: OLD events/bus.ts
│   │   ├── dap.rs                  # NEW: 9-Plane Evaluation
│   │   └── reasoning.rs             # NEW: Reasoning stream
│   ├── kernel/                     # NEW (P0 — not in OLD)
│   │   ├── mod.rs
│   │   ├── truth_gate.rs           # No-Fetch-No-Think
│   │   ├── shell.rs                 # Command whitelist
│   │   └── self_mod.rs              # Self-Modification Engine
│   ├── mesh/                       # NEW (P0 — not in OLD)
│   │   ├── mod.rs
│   │   ├── node.rs                  # Mesh node
│   │   ├── protocol.rs              # Remote Runtime Protocol
│   │   └── gossip.rs                # Gossip protocol
│   ├── skills/                     # NEW (P0 — not in OLD)
│   │   ├── mod.rs
│   │   ├── registry.rs             # Skill loader
│   │   └── tools.rs                 # Tool definitions
│   ├── db/
│   │   ├── mod.rs                  # SQLite
│   │   └── schema.sql              # Schema
│   ├── integrations/               # KEEP from OLD
│   │   ├── grants.rs               # Grant lifecycle
│   │   ├── ip.rs                   # Patent portfolio
│   │   ├── projects.rs             # Project manager
│   │   └── subsidiaries.rs          # Entity isolation
│   ├── types/
│   │   └── mod.rs
│   └── docs/
│       └── SPEC.md                 # This file
```

---

## LANGUAGE DECISION

**Rust.** Confirmed.

Rationale:
- OLD: TypeScript — great for prototyping, memory unsafe
- NEW: Rust — ownership = correctness for kernel layer
- Merged: Rust core + OLD TypeScript modules exposed via FFI or rewritten

**Execution:** Rewrite core modules in Rust. Domain modules (Grants, IP, etc.) can remain TypeScript initially, migrated progressively.

---

## LANGUAGE INTEROPERABILITY

```
Agentic (Rust Core)
  ├── API Layer (Axum HTTP) ← zo.space routes call this
  ├── Kernel (Truth Gate + Shell)
  ├── Mesh (Federated nodes)
  └── Domain (port to Rust or keep TS via wasm-bindgen)
       ├── Grants
       ├── IP Portfolio
       └── Projects
```

---

## KEY GAPS TO FILL IN V1

| Priority | Gap | Source | Owner |
|----------|-----|--------|-------|
| P0 | Truth Gate | NEW spec | Dev |
| P0 | Deterministic Shell | NEW spec | Iris |
| P0 | Federated Mesh | NEW spec | Theo |
| P1 | DAP (9-Plane Engine) | Neither | Dev |
| P1 | Self-Modification Engine | NEW spec | Iris |
| P1 | Grant Lifecycle (Rust port) | OLD → Rust | Casey |
| P1 | IP Portfolio (Rust port) | OLD → Rust | Iris |
| P2 | IER Router + training loop | OLD has file, no loop | Dev |
| P2 | Client SMS layer protocol | NEW, no spec | Iris |
| P3 | Voice Interface | OLD exists, stub | Iris |

---

## WHAT MAKES THIS BETTER THAN BOTH

| Problem | OLD Solution | NEW Solution | MERGED Solution |
|---------|------------|------------|----------------|
| No determinism | Reactive only | Truth Gate spec | Truth Gate + OLD domain modules |
| No self-improvement | Pattern learning (Vance) | Self-Mod spec | Darwin Gödel + Vance patterns |
| No federated compute | Single-node only | 4-node mesh spec | Mesh + existing integrations |
| Reactive only | Event subscriptions | Event-driven spec | DAP-gated events + OLD events |
| Domain logic gap | Grants/IP/Projects mature | No domain logic | Keep mature domain + NEW kernel |
| No forensic audit | Memory store | SHA3-256 spec | Forensic chain on all events |
| No sandbox | Direct execution | Shell whitelist | Shell + OLD tool registry |

**Result:** Kernel-level correctness (NEW) + Mature domain logic (OLD) + Federated scale (NEW) + Client interfaces (OLD) = Better than either alone.

---

*Document ID: BX3-AGENTIC-V1-MERGED-2026-04-12*
