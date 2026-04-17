# Agentic — Zo-Space Prototype Specification
**Variant:** Zo-Native | **Status:** Production Deployed
**Canonical source:** `Bxthre3/projects/the-agentic-project/SPEC.md`

---

## 1. Identity

The Zo-space prototype is the **running proof-of-concept** for Agentic on Bxthre3's Zo Computer. It demonstrates all core orchestration concepts via live routes at `https://brodiblanco.zo.space/api/agentic/*`.

It is NOT a separate product. It is Agentic running on Zo infrastructure.

---

## 2. What Currently Exists

### Live API Routes (70+ on brodiblanco.zo.space)

```
GET  /api/agentic/status              — version, agents, metrics
GET  /api/agentic/agents             — all 19 roster entities
GET  /api/agentic/tasks              — all tasks with status
POST /api/agentic/tasks              — create task
GET  /api/agentic/org               — org chart
GET  /api/agentic/workforce/metrics  — workforce KPIs
GET  /api/agentic/depts             — departments
GET  /api/agentic/integrations      — connected services
GET  /api/agentic/escalations       — active escalations
GET  /api/agentic/starting5         — Starting 5 co-founders
GET  /api/agentic/projects          — BX3 project list
GET  /api/agentic/forensic/trace    — audit trail
GET  /api/agentic/events/stream     — SSE event stream
POST /api/agentic/events/ingest     — ingest external event
POST /api/agentic/agents/register   — register agent
POST /api/agentic/dap/evaluate      — 9-plane DAP evaluation
POST /api/agentic/truth-gate/check  — hallucination check
POST /api/agentic/shell/evaluate    — shell command evaluation
POST /api/agentic/sem               — SEM worksheet ops
POST /api/agentic/fte/synthesize    — FTE synthesis
GET  /api/agentic/bench             — benchmark
GET  /api/agentic/lifecycle         — lifecycle state
GET  /api/agentic/cascade           — cascade status
GET  /api/agentic/coherence         — coherence check
GET  /api/agentic/subscriptions     — agent subscriptions
POST /api/agentic/voice/stt         — speech to text
POST /api/agentic/voice/tts         — text to speech
POST /api/agentic/voice/command     — voice command
GET  /api/agentic/linkedin/connect  — LinkedIn OAuth init
GET  /api/agentic/linkedin/callback — LinkedIn OAuth callback
POST /api/agentic/linkedin/post     — post to LinkedIn
GET  /api/agentic/linkedin/status   — connection status
```

### Web Dashboard
**URL:** `https://brodiblanco.zo.space/agentic` (6 tabs: Status, Agents, Tasks, Org, Starting 5, Integrations)

### Data Stores (in-memory on Zo)
- Event store: `/dev/shm/agentic/event-store.json` (1500+ events)
- Agent store: `/dev/shm/agentic/agent-store.json` (19 agents)
- Thompson Q: `/dev/shm/agentic/thompson-q.json` (18 entries)
- Task store: `/dev/shm/agentic/task-store.json` (24 tasks)

---

## 3. Architecture (Zo Prototype)

```
Zo Computer (host)
  └── brodiblanco.zo.space
        ├── /agentic           — React SPA dashboard
        └── /api/agentic/*    — Hono API routes
              ├── core/         — Agent registry, task store, event bus
              ├── workforce/    — 19-agent roster, metrics
              ├── dap/          — 9-plane evaluation engine
              ├── truth-gate/   — RAG hallucination check
              ├── shell/        — command whitelist evaluator
              ├── sem/          — SEM worksheet ops
              ├── fte/          — FTE synthesis
              ├── bench/        — benchmark runner
              ├── lifecycle/    — agent lifecycle
              ├── cascade/      — cascade trigger engine
              ├── coherence/    — 3-layer coherence check
              ├── subscriptions/ — event subscriptions
              ├── voice/        — STT/TTS/command
              └── linkedin/    — OAuth + posting
```

---

## 4. Integrations (Zo Prototype — Already Connected)

| Integration | Status | What it gives Agentic |
|------------|--------|----------------------|
| Gmail | ✅ Live | Read/write email, send notifications |
| Google Calendar | ✅ Live | Schedule meetings, read events |
| Google Tasks | ✅ Live | Task management (4 lists created) |
| Google Drive | ✅ Live | File storage, document access |
| Linear | ✅ Live | Issue tracking, project management |
| Notion | ✅ Live | Wiki, docs, databases |
| Airtable | ✅ Live | Structured data (Irrig8 base) |
| Spotify | ✅ Live | Context/mood data |
| Dropbox | ✅ Live | File sync |
| GitHub | ✅ Webhook | PR merged → auto-close Linear issue |
| Stripe | ⚠️ Read-only | Payment visibility |
| SMS | ✅ Via Zo | Mobile notifications |

---

## 5. Missing Features (Zo Prototype — Priority Order)

### P0 — Must Have

| Feature | Description | Why Missing |
|---------|-------------|-------------|
| **Truth Gate enforcement** | RAG must block hallucinations before output | Route exists but enforcement is not wired into the inference path |
| **Deterministic Shell** | Command whitelist + safety interlocks | Designed but not implemented in routes |
| **Self-Modification Engine** | Darwin Gödel cycle for self-improvement | Concept in SOUL.md, not wired into runtime |

### P1 — Should Have

| Feature | Description |
|---------|-------------|
| **Thompson Q → IER migration** | Bandit-based routing not yet learning from outcomes |
| **IER Q-table persistence** | Learning gains lost on restart |
| **Rollback + Cascade Pause** | No state rollback if cascade fails |
| **CTC Engine wired to inference** | ETA injection not in the inference path |

### P2 — Nice to Have

| Feature | Description |
|---------|-------------|
| **MCP Server** | Expose 38 tools to external clients |
| **Feature Flags UI** | Dashboard toggle for system flags |
| **Chairman Queue UI** | `/agentic/chairman-queue` for T2 approvals |
| **LinkedIn full flow** | OAuth working but posting needs content generation |

---

## 6. Improvements for Zo Prototype

### 6.1 Wire Truth Gate into Every Inference Call
Currently: `/api/agentic/truth-gate/check` is a standalone route.
**Better:** Every route that generates output runs through truth-gate first.

```
Any agent output
  → Truth Gate RAG check
  → If fails: block + log to forensic/trace
  → If passes: return output + seal
```

### 6.2 Persistent IER Q-Table
Currently: Thompson Q resets on restart.
**Better:** Save Q-values to `/dev/shm/agentic/ier-qtable.json` on every routing decision. Load on startup.

### 6.3 Chairman Queue Dashboard Tab
Currently: T2 tools route but no UI to approve.
**Better:** Add 7th tab to `/agentic` dashboard: **Queue** — shows pending T2 requests with Approve/Deny.

### 6.4 LinkedIn Content Generation
Currently: OAuth connected, can post, but content is manual.
**Better:** Wire IER router to generate post content from agent task context. Auto-draft, human approves, then posts.

### 6.5 Cascade Failure Recovery
Currently: Cascade runs, if it fails the state is uncertain.
**Better:** Every cascade writes a checkpoint. On crash, replay from last checkpoint.

### 6.6 Peer Bridge to Standalone
Currently: Zo prototype and standalone are separate.
**Better:** Both register to same MCP mesh (Antigravity IDE + Zo as peers). Standalone becomes a compute node that Zo routes tasks to.

---

## 7. Zo Prototype → Standalone Migration Path

The Zo prototype is the **fast iteration environment**. When a feature is proven in Zo, it gets ported to the standalone Rust build.

```
Zo Prototype (prove it)
  → Rust port ( harden it)
    → Docker build (deploy it)
      → Register as mesh node (scale it)
```

---

## 8. Reference

- Live endpoints: `https://brodiblanco.zo.space/api/agentic/*`
- Dashboard: `https://brodiblanco.zo.space/agentic`
- Source: `Bxthre3/projects/the-agentic-project/`
- Standalone: `github.com/bxthre3inc/agentic`
- Full variant audit: `Bxthre3/INBOX/agentic-variant-audit.md`
