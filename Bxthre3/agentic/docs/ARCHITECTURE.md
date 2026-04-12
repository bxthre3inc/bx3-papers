# Agentic Architecture — CANONICAL SPEC v1.0
**Bxthre3 Inc | Version 1.0 | 2026-04-12**
**Classification:** BX3 Core IP — Internal Only

---

## 1. Is This The Best Possible Model?

Yes. Here is why:

| Requirement | How This Architecture Delivers It |
|------------|----------------------------------|
| Core works standalone, no frontend required | Headless binary, SQLite-first, CLI-first |
| Clients contribute compute when available | Event bus supports federated node connections via pub/sub |
| Multiple client types (web, mobile, CLI, SMS) | Thin HTTP API layer, clients are separate builds |
| Skills/tools server layer | `integrations/` module with `SkillsRegistry` |
| Federated compute nodes (non-clients) | Event bus + node registry supports pure compute-only nodes |
| Human layer | All P0/P1 → brodiblanco via INBOX.md + SMS per SOUL.md |
| Networking layer | Standard TCP/HTTP, upgradeable to mTLS between nodes |

The architecture is a **hub-and-spoke federated intelligence system** — the core is the authoritative hub, everything else is a spoke that can contribute compute or consume results.

---

## 2. Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Language | **Rust 1.92+** | Ownership = real work for concurrent agents; single static binary for vanilla Linux deployment |
| HTTP Server | **Axum 0.7** ( Tokio + Tower ) | Async, type-safe, minimal overhead |
| Database | **SQLite** (rusqlite, bundled) | Zero-config, portable, durable event store |
| Serialization | **Serde** | Zero-copy, compile-time verified |
| Error Handling | **Anyhow + Thiserror** | Ergonomic for API layer, specific for domain errors |
| Logging | **Tracing** (structured) | Production-grade, async-safe |

---

## 3. Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT LAYER                                                │
│  (Any device — CLI, Web, Android, iOS, SMS, Email)           │
│  Clients: consume API, may contribute compute                │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP (REST)
┌────────────────────────────▼────────────────────────────────┐
│  API LAYER               api/                               │
│  Thin HTTP handlers. Routes requests to core services.      │
│  No business logic here.                                      │
│  Routes: /api/agentic/{agents,tasks,org,status,             │
│          starting5,integrations,events,android}               │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  CORE SERVICES         core/                                  │
│  Pure business logic. No HTTP, no database calls.            │
│  ├── task_queue.rs   — SQLite-backed state machine            │
│  ├── agent_registry.rs — 19-agent roster, activate/deactivate│
│  ├── dap.rs           — 9-Plane Deterministic Assessment     │
│  └── event_bus.rs     — pub/sub for reactive cascades         │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  INTEGRATIONS LAYER   integrations/                           │
│  SkillsRegistry — dynamic skill loading for agents.           │
│  Tool definitions for agent capabilities.                     │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  DATABASE LAYER      db/                                      │
│  SQLite via rusqlite. Schema: agents, tasks, events,         │
│  reasoning_stream. Schema seeded on first run.                │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  DOMAIN TYPES         types/                                   │
│  Agent, Task, Event, EventVector, PlaneResult, Starting5,     │
│  Integration — all canonical data structures.                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
Bxthre3/agentic/
├── Cargo.toml               # Dependencies
├── README.md
├── src/
│   ├── lib.rs              # Module root
│   ├── bin/
│   │   └── agentic.rs      # Main binary entry point
│   ├── api/
│   │   ├── mod.rs          # Axum router + handlers
│   │   └── middleware.rs   # Logging middleware
│   ├── core/
│   │   ├── mod.rs          # Re-exports
│   │   ├── task_queue.rs   # Task state machine
│   │   ├── agent_registry.rs # 19-agent roster
│   │   ├── dap.rs          # 9-plane DAP engine
│   │   └── event_bus.rs    # Pub/sub event system
│   ├── db/
│   │   ├── mod.rs          # Database wrapper
│   │   └── schema.sql      # SQLite schema
│   ├── integrations/
│   │   └── mod.rs          # SkillsRegistry, Skill trait
│   └── types/
│       └── mod.rs          # All domain types
└── target/release/
    └── agentic-core        # 5.3MB static binary
```

---

## 5. Module Inventory

### `types/mod.rs` — Domain Types
| Type | Purpose |
|------|---------|
| `AgentStatus` | ACTIVE / IDLE / OFFLINE / ERROR |
| `TaskStatus` | PENDING → ASSIGNED → WORKING → REVIEW → DONE |
| `Task` | Primary work unit with priority, phase, blockers |
| `Agent` | Named AI worker with canonical roster |
| `EventVector` | 10-point reality vector (t, s_x, s_y, z_neg, z_pos, c, l, v_f, e, g) |
| `PlaneResult` | Single DAP plane result |
| `Starting5` | AI co-founder archetypes |
| `Integration` | Connected external services |

### `core/task_queue.rs` — Task State Machine
States: `PENDING → ASSIGNED → WORKING → REVIEW → DONE` / `BLOCKED ↔ SUSPENDED`

Operations: `assign(task_id, agent_id, agent_name)` / `complete(task_id)` / `block(task_id, reason)`

### `core/agent_registry.rs` — 19-Agent Roster
`canonical_roster()` — seeds 18 AI + 1 human (brodiblanco)
`activate(id)` / `deactivate(id)` — runtime state transitions

### `core/dap.rs` — 9-Plane DAP Engine
Planes 1-6 (SFD/PMT): Temporality, Spatiality, CompositionalLower, EconomicValue, Fidelity, ExecutionMatrix
Planes 7-9 (DHU): Evolutionary, Thermodynamic, Governance

DHU planes (7,8,9) gate human authorization. All 9 planes gate FTE (Full Trust Execution).

### `core/event_bus.rs` — Event Pub/Sub
Agents subscribe to glob patterns (`sfd.*`, `pmt.irrigation.*`)
Broadcast to subscribers on event publication
Supports federated node connections via shared stream

### `db/schema.sql` — SQLite Schema
Tables: `agents`, `tasks`, `events`, `reasoning_stream`, `agent_subscriptions`

---

## 6. Running the Binary

```bash
# Environment variables
AGENTIC_DB=/data/agentic/agentic.db   # Database path (default: /tmp/agentic.db)
AGENTIC_PORT=3001                      # HTTP port (default: 3001)

# Build
cargo build --release

# Run
AGENTIC_DB=/data/agentic/agentic.db AGENTIC_PORT=3001 ./target/release/agentic-core
```

Server starts on port 3001. Database created and seeded with canonical 19-agent roster on first run.

---

## 7. API Routes

| Method | Path | Handler |
|--------|------|---------|
| GET | `/api/agentic/status` | Dashboard metrics |
| GET | `/api/agentic/agents` | All 19 agents |
| GET | `/api/agentic/tasks` | All tasks |
| GET | `/api/agentic/org` | Org chart |
| GET | `/api/agentic/starting5` | AI co-founder archetypes |
| GET | `/api/agentic/integrations` | Connected integrations |
| POST | `/api/agentic/events/ingest` | Evaluate event against DAP |
| POST | `/api/agentic/android/agents/:id/:action` | activate / deactivate |

---

## 8. Key Design Decisions

**Why Rust ownership model matters for Agentic:**
- Agents run concurrently → data races caught at compile time
- Task state transitions are explicit → `assign()` returns `bool`, no hidden failures
- Event bus uses `Arc<Event>` → safe shared ownership across subscribers

**Why SQLite:**
- Portable single file (`/data/agentic/agentic.db`)
- WAL mode for concurrent reads during event cascades
- Zero operational overhead — runs on vanilla Linux

**Why no async in core:**
- Core is synchronous pure business logic — deterministic, testable
- Async only at API boundary (Axum handlers)
- Database access uses `tokio::sync::Mutex` wrapper for async contexts

---

## 9. DAP 9-Plane Reference

| Plane | Name | Threshold |
|-------|------|-----------|
| 1 | Temporality | `t > 0` |
| 2 | Spatiality | `s_x !== 0 OR s_y !== 0` |
| 3 | CompositionalLower | `z_negative < -0.20` |
| 4 | EconomicValue | `e > 100` |
| 5 | Fidelity | `c > 0.80` |
| 6 | ExecutionMatrix | `z_positive < 0.25` |
| 7 | Evolutionary | `v_f > 0.50` |
| 8 | Thermodynamic | always `true` |
| 9 | Governance | `g == "COMPLIANT" AND l == "APPROVED"` |

All 9 match → FTE (Full Trust Execution)
DHU planes (7,8,9) pass, others fail → requires human review
All fail → BLOCK

---

## 10. Federated Compute Model

```
┌─────────┐       HTTP/REST        ┌──────────────┐
│  CLI    │◄────────────────────►│              │
├─────────┤                       │   agentic-    │
│  Web    │                       │   core       │
├─────────┤   Event Bus pub/sub   │  (SQLite)    │
│  iOS    │◄─────────────────────►│              │
├─────────┤                       │              │
│ Android │   Federated nodes      │              │
├─────────┤◄─────────────────────►│              │
│  SMS    │   (compute only)     └──────────────┘
└─────────┘
```

Federated nodes connect via the event bus stream. Non-client compute nodes subscribe to the event stream and contribute processing without consuming the API.

---

*Canonical build — Bxthre3 Inc | 2026-04-12*
