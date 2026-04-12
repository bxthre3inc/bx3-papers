# Agentic Ecosystem — Full Feature Parity Matrix

**Generated:** 2026-04-08  
**Scope:** All Bxthre3 Inc agentic/orchestration projects across GitHub org and workspace  
**Purpose:** Single source of truth for feature tracking, deduplication, and canonical path forward

---

## 1. Repositories & Projects — Canonical Inventory

| # | Name | GitHub Repo | Type | Status | License | Notes |
|---|------|-------------|------|--------|---------|-------|
| 1 | **Agentic (canonical)** | `bxthre3inc/agentic` | GitHub repo | Active | UNLICENSED (private) | Lives at `Bxthre3/projects/agentic/` locally |
| 2 | **agentic v4 server** | `bxthre3inc/agentic` | GitHub repo | Active | UNLICENSED (private) | Lives at `Bxthre3/projects/agentic/` locally; shares `src/server.ts` w/ canonical but has `core/` extras |
| 3 | **AgenticBusinessEmpire** | `bxthre3inc/AgenticBusinessEmpire` | GitHub repo | Active | Proprietary | Lives at `ALTS-TBD/AgenticBusinessEmpire/` locally |
| 4 | **Helm** | `bxthre3inc/Helm-the-Business-Automation-Platform` | GitHub repo | Archived | MIT | Lives at `ALTS-TBD/Helm-the-Business-Automation-Platform/`; public demo code |
| 5 | **agentic-orchestration** | — (workspace only) | Zo Site | Stalled | Proprietary | Lives at `agentic-orchestration/`; Bun + React dashboard |
| 6 | **MCP Mesh** | `bxthre3inc/mcp-mesh` | GitHub repo | Active | Proprietary | Zo ↔ Antigravity ↔ Agentic 3-way symmetric peer mesh |
| 7 | **Distributed Execution System** | `bxthre3inc/Distributed-Execution-System` | GitHub repo | Dormant | MIT | Python + WASM3, DAG orchestration, Termux-compatible |
| 8 | **GhostCloud** | `bxthre3inc/GhostCloud` | GitHub repo | Incubation | Proprietary | 120+ free-tier SaaS mesh federation (not agentic per se) |
| 9 | **Instant AI Widget** | `bxthre3inc/instant-ai-widget` | GitHub repo | Active | MIT | VS Code extension + CLI; privacy-first code context AI |
| 10 | **zo-computer-android** | `bxthre3inc/zo-computer-android` | GitHub repo | Active | Proprietary | Native Android wrapper for Zo Computer |
| 11 | **zo-computer-linux** | `bxthre3inc/zo-computer-linux` | GitHub repo | Active | Proprietary | ncurses TUI dashboard with Agentic polling |
| 12 | **the-zoe-project** | — (workspace only) | Internal | Active | Proprietary | Zo Computer → Zoe rebranding project; `.agents/` workflow runner |

---

## 2. Feature Parity Matrix

| Feature | Agentic (canonical) | agentic (github) | AgenticBusinessEmpire | Helm | agentic-orchestration | MCP Mesh | Dist. Exec. | Instant AI Widget |
|---------|:------------------:|:----------------:|:-------------------:|:----:|:-------------------:|:--------:|:------------:|:----------------:|
| **CORE ENGINE** |||||||||
| Work queue (task queue) | ✅ WORK_QUEUE.jsonl | ✅ JSONL | ✅ kernel/tasks/pending | ❌ | ❌ | ❌ | ❌ | ❌ |
| Event-driven agents | ✅ GitHub + file webhooks | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Scheduled agents (no spam) | ✅ delivery_method:none | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Single INBOX thread | ✅ AGENT_INBOX.md | ❌ | ❌ (scattered) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Escalation (P0–P3) | ✅ INBOX routing | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Agent status tracking | ✅ agents/status/*.json | ❌ | ✅ registry + LED status | ❌ | ❌ | ❌ | ❌ | ❌ |
| Agent instruction files | ✅ agents/instructions/*.md | ❌ | ✅ Kernel handbook | ❌ | ❌ | ❌ | ❌ | ❌ |
| Human-in-the-loop | ✅ INBOX reply protocol | ❌ | ❌ | ✅ approval gating | ❌ | ❌ | ❌ | ❌ |
| **AGENTS** |||||||||
| Named agent roster | ✅ 8 agents (Erica, Sentinel, Pulse, Drew, Alex, Casey, Iris, Chronicler) | ❌ | ✅ 19 agents (18 AI + 1 human) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Starting 5 (co-founder personas) | ✅ v2 (Maya/Drew/Jordan/Alex) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| War Room (co-founder chat sim) | ✅ (src/orchestration) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Orchestration layer (ChatDev rebuild) | ✅ 5 modules (IER, DAG, Phase Gates, Coherence, Reasoning) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AI / INFERENCE** |||||||||
| Cloud LLM (Gemini/Claude/etc.) | ❌ | ❌ | ✅ inference_node.py | ✅ Gemini API + function calls | ❌ | ❌ | ❌ | ✅ OpenAI/Claude |
| Local/offline LLM | ❌ | ❌ | ❌ | ✅ HuggingFace (Xenova/LaMini) | ❌ | ❌ | ❌ | ✅ Ollama, llama.cpp |
| Multi-model routing | ❌ | ❌ | ✅ mesh + inference_node | ✅ Gemini vs local | ❌ | ❌ | ❌ | ✅ auto routing |
| AI function calling | ❌ | ❌ | ❌ | ✅ defined tools | ❌ | ❌ | ❌ | ❌ |
| **DASHBOARD / UI** |||||||||
| Web dashboard | ✅ zo.space `/agents` | ❌ | ✅ Web Dashboard (React) | ✅ React + Vite dashboard | ✅ React (Zo Site) | ❌ | ❌ | ❌ |
| Android client | ❌ (was separate) | ❌ | ❌ (Tauri + Kotlin archived) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zo Space routes | ✅ `/agents`, `/api/work-queue`, `/api/agent-inbox` | ❌ | ✅ `/agentic` + 9 tabs | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dark/glassmorphism UI | ✅ shadcn/ui dark | ❌ | ✅ premium dark glass | ✅ dark | ✅ shadcn | ❌ | ❌ | ❌ |
| **INTEGRATIONS** |||||||||
| Gmail | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Google Calendar | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Google Tasks | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Google Drive | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Notion | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Airtable | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Linear | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Stripe | ✅ (partial) | ❌ | ✅ Connected (read only) | ❌ | ❌ | ❌ | ❌ | ❌ |
| GitHub | ✅ webhooks + API | ❌ | ❌ (listed, not connected) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Spotify | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dropbox | ✅ | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| SMS / SignalWire | ✅ | ❌ | ✅ API routes exist | ❌ | ❌ | ❌ | ❌ | ❌ |
| Solana / crypto | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| IoT / Irrig8 sensors | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **DATA LAYER** |||||||||
| SQLite persistence | ✅ WORK_QUEUE.jsonl (file-based) | ❌ | ✅ master_ledger.db (AES-256) | ❌ | ❌ | ❌ | ✅ WASM task results | ❌ |
| Encrypted ledger | ❌ | ❌ | ✅ AES-256, sharded by CompanyID | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multi-tenant / subsidiaries | ❌ | ❌ | ✅ (5 valid tenants) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reasoning stream / audit trail | ✅ reasoning_stream.py | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| IER router (contextual bandits) | ✅ ier_router.py | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **NETWORK / MESH** |||||||||
| MCP (Model Context Protocol) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (3-way symmetric) | ❌ | ❌ |
| Peer-to-peer mesh | ❌ | ❌ | ✅ Sync Engine (3-way Zo↔Antigravity↔ABE) | ❌ | ❌ | ❌ | ✅ (WASM3 + TCP) | ❌ |
| Circuit breaker per peer | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| WebSocket transport | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Tailscale/WireGuard overlay | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (GhostCloud only) |
| **VOICE** |||||||||
| Voice command / TTS/STT | ❌ | ❌ | ❌ (stub exists) | ✅ Live API | ❌ | ❌ | ❌ | ❌ |
| **FINANCE / AUTONOMY** |||||||||
| Financial autonomy (invoicing) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Crypto invoice generation | ✅ `/api/crypto/invoice` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Role-based cost accounting | ❌ | ❌ | ❌ | ✅ WU-based (0.70/unit) | ❌ | ❌ | ❌ | ❌ |
| **MOBILE / EDGE** |||||||||
| Native Android wrapper | ❌ | ❌ | ❌ (Tauri archived) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Android native Agentic panel | ❌ | ❌ | ❌ (was spec only) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Linux TUI dashboard | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| OTA update mechanism | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Biometric auth | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| BLE / hardware sensors (Android) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **LIFECYCLE MGMT** |||||||||
| Business lifecycle (Discovery→Ascension) | ❌ | ❌ | ✅ Incubating→Autonomous→Spin-off | ✅ 5 stages | ❌ | ❌ | ❌ | ❌ |
| Ikigai Discovery Engine | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Living Documents (persistent workspace) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **ORCHESTRATION** |||||||||
| Phase gates (conditional workflow) | ✅ phase_gates.py | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DAG workflow templates | ✅ workflow_dag.py | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ YAML-defined DAGs | ❌ |
| Parallel execution (Coherence Engine) | ✅ coherence_engine.py | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Self-modification engine | ❌ | ❌ | ❌ (noted in SOUL.md) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Supermemory integration | ✅ Chronicler agent | ❌ | ✅ Connected | ❌ | ❌ | ❌ | ❌ | ❌ |
| **DEPLOYMENT** |||||||||
| Zo Site hosting | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Zo service (registered) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Docker | ❌ | ❌ | ✅ (python3 main.py) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kubernetes manifests | ✅ (irrig8 + farmsense, identical) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| CI/CD (GitHub Actions) | ✅ (lint + test + build + deploy) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Termux compatible | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **PHYSICAL / HARDWARE** |||||||||
| Robot simulation (manufacturing) | ❌ | ❌ | ❌ | ✅ (role type: Robot) | ❌ | ❌ | ❌ | ❌ |
| IoT sensor integration | ✅ Irrig8 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hardware telemetry (CPU/RAM/disk) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ (zo-computer-linux) |
| **DOCUMENTATION** |||||||||
| Public README | ❌ | ❌ | ✅ (v1.0 Genesis) | ✅ (MIT) | ❌ | ✅ | ✅ (MIT) | ✅ (MIT) |
| Architecture doc | ❌ | ❌ | ✅ system_manifest.json | ❌ | ❌ | ✅ | ❌ | ❌ |
| Spec/markdown docs | ✅ AGENTS.md, SOUL.md, ROADMAP | ❌ | ✅ feature analysis | ❌ | ❌ | ✅ | ✅ | ❌ |
| Contributing guide | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |

---

## 3. Architecture Diagrams (Per Project)

### Agentic (canonical) — v1.0


\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    EVENT SOURCES                         │
│  GitHub ─┬─► Agent Webhook ─┐                          │
│  Files   │   (/api/agent-webhook)                       │
│  Manual ─┘                     │                          │
│                                ▼                          │
│  Scheduled: ┌──────────────────┴──────────────────┐      │
│  - Erica (2×/day)                                │      │
│  - Sentinel (hourly)          WORK_QUEUE          │      │
│  - Pulse (hourly)             (jsonl)            │      │
│  - Casey (daily)                   │               │      │
│  - Iris (daily)                   ▼               │      │
│  - Chronicler (daily)        ┌────────┐           │      │
│                         ┌────│ AGENTS │◄────────┘      │
│                         │    └────────┘                    │
│                         │         │                      │
│                         ▼         ▼                      │
│                  ┌─────────────────┐                     │
│                  │  AGENT_INBOX    │◄── brodiblanco      │
│                  │    (.md)        │     checks here      │
│                  └─────────────────┘                     │
└─────────────────────────────────────────────────────────┘

Deployable stacks:
  - zo.space routes: /agents, /api/work-queue, /api/agent-inbox
  - MCP Mesh peer: registered as "agentic" peer
  - Cloud backend: agentic server.ts (Hono/Bun)
  - Orchestration: 5 Python modules in orchestration/
  - Starting 5: Maya/Drew/Jordan/Alex personas
\`\`\`

### AgenticBusinessEmpire — v6.0
\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│              AgenticBusinessEmpire (Kernel + Mesh)               │
│                                                                  │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────────┐    │
│  │ Web UI   │   │  Android App │   │   Tauri Cockpit     │    │
│  │ /agentic     │   │  (ARCHIVED)  │   │   (Admin Desktop)   │    │
│  └────┬─────┘   └──────┬───────┘   └──────────┬───────────┘    │
│       │                 │                      │                │
│       └────────────┬────┴──────────────────────┘                │
│                    ▼                                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    KERNEL (kernel_main.py)                  │ │
│  │  TaskContext TCO → inference_node → handler registry        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                    │                                             │
│         ┌──────────┼──────────┐                                │
│         ▼          ▼          ▼                                │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐                   │
│  │   DB     │ │ Inference │ │ Sync Engine /  │                   │
│  │ (SQLite) │ │  Node    │ │ MCP Mesh       │                   │
│  │ AES-256  │ │ (LLM)    │ │ (3-way peer)  │                   │
│  └──────────┘ └──────────┘ └────────────────┘                   │
│                                        │                        │
│                     ┌─────────────────┼─────────────────┐       │
│                     ▼                 ▼                 ▼       │
│              ┌───────────┐   ┌────────────┐   ┌──────────────┐  │
│              │    Zo     │   │ Antigravity│   │  Agentic     │  │
│              │  (Assistant)│  │  (IDE)     │   │  (Agent)     │  │
│              └───────────┘   └────────────┘   └──────────────┘  │
│                                                                  │
│  Integrations: Gmail, Calendar, Tasks, Drive, Notion, Airtable, │
│               Linear, Spotify, Dropbox, Supermemory, Stripe       │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Helm — MIT public demo
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                   Helm (Venture OS - Public Demo)              │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  React SPA + Vite + Tailwind                          │   │
│  │  BusinessConfig state (single large JSON object)       │   │
│  └──────────────────────────┬─────────────────────────────┘   │
│                             │                                  │
│              ┌──────────────┴───────────────┐                   │
│              ▼                              ▼                   │
│  ┌──────────────────────┐    ┌───────────────────────────┐    │
│  │  Executive AI Agent   │    │  Strategic Orchestrator   │    │
│  │  (Gemini 2.5 Flash)  │    │  (Gemini 2.5 Pro)        │    │
│  │  Task generation      │    │  Document creation/       │    │
│  │  + function calls     │    │  update + insights        │    │
│  └──────────────────────┘    └───────────────────────────┘    │
│                                                              │
│  AI Backend Options:                                         │
│    Cloud: Google Gemini API (@google/genai v1.28)            │
│    Local: Xenova/Transformers (LaMini-Flan-T5-248M)         │
│                                                              │
│  Key concept: "Living Documents" — persistent workspace        │
│  of markdown files updated by orchestrator AI                │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### MCP Mesh — v2.0
\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Mesh Protocol v2                          │
│                                                                  │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐    │
│   │     Zo      │◄────►│ Antigravity │◄────►│  Agentic    │    │
│   │ (Assistant) │      │   (IDE)     │      │  (Agent)    │    │
│   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘    │
│          │                    │                    │            │
│          └────────────────────┴────────────────────┘            │
│                          MCP Mesh (symmetric, all peers)         │
│                                                                  │
│  Features: Circuit breaker, heartbeat/keepalive, zlib            │
│  compression, WS reconnect, graceful degradation,                │
│  Prometheus metrics, per-peer API keys                          │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

### Distributed Execution System
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│        Bxthre3 Distributed Execution System                    │
│                                                              │
│  ┌──────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │ UI Node  │───►│  Controller +    │───►│  Host Nodes   │  │
│  │ (Python  │    │  Node Manager    │    │ (WASM3 exec) │  │
│  │  + ncurses│   │  (RAM-based     │    │               │  │
│  │   or GUI) │   │   auto-scaling) │    │               │  │
│  └──────────┘    └──────────────────┘    └───────────────┘  │
│                                                              │
│  WASM Modules: init, greet_1, greet_2, aggregate            │
│  DAG format: YAML with depends_on                            │
│  Platforms: Linux, cloud VMs, Android Termux                 │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### agentic-orchestration (workspace Zo Site)
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│         agentic-orchestration (Zo Site - stalled)             │
│                                                              │
│  Bun + Hono server + React + Vite SPA                       │
│  Dashboard: /orchestration-dashboard                         │
│  Backend: zo-api.ts (calls Zo API internally)               │
│  Stack: shadcn/ui, recharts, dnd-kit, marked                │
│                                                              │
│  Status: Last meaningful work ~2026-03-30                   │
│  NOT deployed to zo.space (local workspace only)             │
└──────────────────────────────────────────────────────────────┘
\`\`\`

### zo-computer-android (PIMPED Edition)
\`\`\`
┌──────────────────────────────────────────────────────────────┐
│            zo-computer-android (PIMPED Edition)               │
│                                                              │
│  Package: com.bxthre3.zocomputer | Min SDK 26 | Target 35   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Jetpack Compose + BX3 Design System v2              │   │
│  │  MVVM + Clean Architecture + Hilt DI                │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────┴───────────────────────────────┐    │
│  │  Agentic Panel (Native bottom sheet overlay)        │    │
│  │  19-agent roster, status, quick task creation       │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │  WebView     │  │  FCM Push   │  │  Hardware Access  │  │
│  │ (Zo web app) │  │  Notifs     │  │  Camera/Mic/BLE   │  │
│  └──────────────┘  └─────────────┘  │  NFC/Sensors      │  │
│                                      └───────────────────┘  │
│                                                              │
│  Agentic API: /api/agentic/status, /agents, /tasks, /org   │
└──────────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. The "Starting 5" — Two Parallel Implementations

| Attribute | Agentic (canonical) | AgenticBusinessEmpire |
|----------|--------------------|-----------------------|
| **Location** | `agentic/core/employees/starting5-v2.ts` + `core/warroom/starting5.ts` | Not present |
| **Personas** | Maya Chen (Builder), Drew Park (Operator), Jordan Okonkwo (Hunter), Alex Rivera (Architect) | Not present |
| **Count** | 4 named co-founders | 0 |
| **War Room chat sim** | ✅ Full simulation (tone, banter, crisis response) | Not present |
| **Decision logs** | ✅ realDecisions[] with consensus + visionaryOverride | Not present |
| **Lifecycle evolution** | ✅ getEvolvedTeam(seed→seriesA→seriesB→seriesC→public) | Not present |
| **AgenticBusinessEmpire equivalent** | — | 19 agents: CEO, CFO, COO, HR, Security, Ops, etc. |

---

## 5. Key Architectural Differences

### AI Model Strategy
| Project | Approach |
|---------|----------|
| **Helm** | Explicit dual-mode: Gemini cloud + Xenova/transformers local |
| **AgenticBusinessEmpire** | inference_node abstraction; actual model unspecified (pluggable) |
| **Agentic canonical** | Zo AI as backend; no direct LLM calls |
| **Instant AI Widget** | Ollama + OpenAI + Claude + HuggingFace + Groq |

### Persistence Strategy
| Project | Approach |
|---------|----------|
| **Agentic canonical** | JSONL flat files (WORK_QUEUE.jsonl, AGENT_INBOX.md) |
| **AgenticBusinessEmpire** | SQLite with AES-256 encryption, sharded by CompanyID |
| **Distributed Exec** | SQLite for task results, WASM module outputs |
| **Helm** | In-memory BusinessConfig object + localStorage |

### Agent Scheduling
| Project | Approach |
|---------|----------|
| **Agentic canonical** | Zo create_agent with rrules; delivery_method:none (silent) |
| **AgenticBusinessEmpire** | Kernel polling kernel/tasks/pending/*.json files |
| **Helm** | React useEffect + setInterval (client-side) |
| **MCP Mesh** | Event-driven via WebSocket |

---

## 6. Duplicate / Overlapping Features — Flagged for Deduplication

| Feature | Duplicated Across | Recommended Action |
|---------|-------------------|-------------------|
| Work queue | Agentic canonical + agentic-orchestration | Agentic canonical wins (zo.space deployed) |
| Agent roster display | Agentic (`/agents`) + AgenticBusinessEmpire (`/agentic`) + zo-computer-android (bottom sheet) | Consolidate on Agentic canonical + ABE kernel |
| Starting 5 personas | Agentic only | Keep; unique to Agentic |
| War Room simulation | Agentic only | Keep; unique to Agentic |
| ChatDev-style orchestration | Agentic (5 Python modules) only | Keep; unique |
| GCP integrations (Gmail/Cal/etc.) | Agentic canonical + AgenticBusinessEmpire | ABE has deeper integration; reconcile into single canonical |
| 19-agent roster | AgenticBusinessEmpire only | Keep in ABE |
| Local LLM support | Helm + Instant AI Widget | Different use cases (Venture OS vs code assistant) |
| MCP protocol | MCP Mesh only | Keep; distinct capability |
| IoT sensor telemetry | Agentic canonical (`/api/sensors`) + zo-computer-android (BLE) | Agentic wins for cloud; android BLE is hardware-specific |

---

## 7. Kubernetes Deployment (irrig8 / farmsense)

> **Note:** `Bxthre3/projects/irrig8/code/` and `Bxthre3/projects/farmsense-retired/farmsense-code/` are **byte-for-byte identical**. FarmSense was retired 2026-03-23 in favor of Irrig8 as the canonical product name. The K8s manifests and docker-compose are shared.

| Component | Config |
|-----------|--------|
| Backend | 3 replicas, farmsense/backend:latest, port 8000, liveness probe on /health |
| Database | StatefulSet postgres:15, 10Gi PVC, farmsense-secrets secret ref |
| Ingress | nginx.ingress.kubernetes.io/rewrite-target, api.farmsense.local + app.farmsense.local |
| API | Hono/Bun server |

---

## 8. Gaps & Missing Features Across Ecosystem

### P0 — Critical (missing everywhere)
- [ ] **GitHub integration** — Listed as connected in Agentic canonical but NOT wired (webhooks only, no OAuth)
- [ ] **Native Android Agentic panel** — Spec exists (SPEC.md PIMPED Edition) but Android app is plain WebView wrapper
- [ ] **Financial autonomy engine** — Invoicing exists (crypto invoice endpoint) but no autonomous payment collection
- [ ] **Voice integration** — Helm has Live API stubs; ABE has TTS/STT routes stubbed; nothing is live

### P1 — High (partially present, incomplete)
- [ ] **Supermemory deep integration** — Connected to ABE and Chronicler agent; but not used for agent learning
- [ ] **IER training loop** — ier_router.py exists but no scheduled retraining
- [ ] **Self-modification engine** — Defined in SOUL.md Principle #6; not yet implemented
- [ ] **Stripe full CRUD** — ABE has read-only; Agentic has invoice generation only
- [ ] **LinkedIn automation** — Skill exists but no agent integration

### P2 — Medium
- [ ] **Deterministic shell enforcement** — Phase gates exist in orchestration/ but not wired to agent execution
- [ ] **OTA update mechanism** — Defined in zo-computer-android SPEC.md; not implemented
- [ ] **Biometric auth for Agentic** — Spec'd in android PIMPED Edition; not wired
- [ ] **SignalWire IVR** — Routes exist but not integrated with any agent
- [ ] **Airtable CRUD automation** — Grants tracking in Airtable but no scheduled agent automation

---

## 9. Source File Origins

| File | Source | Notes |
|------|--------|-------|
| `Bxthre3/projects/agentic/` | GitHub `bxthre3inc/agentic` | Canonical workspace copy |
| `Bxthre3/projects/agentic/` | GitHub `bxthre3inc/agentic` | Shares server.ts src with agentic but has `core/` dir extras |
| `Bxthre3/ALTS-TBD/AgenticBusinessEmpire/` | GitHub `bxthre3inc/AgenticBusinessEmpire` | Full Python kernel + React UI |
| `Bxthre3/ALTS-TBD/Helm-the-Business-Automation-Platform/` | GitHub `bxthre3inc/Helm-the-Business-Automation-Platform` | Public MIT demo |
| `agentic-orchestration/` | workspace only | Zo Site; stalled |
| `Bxthre3/projects/irrig8/code/` | project code | Identical to farmsense-retired |
| `Bxthre3/projects/farmsense-retired/farmsense-code/` | retired project | Byte-identical to irrig8 |
| `Bxthre3/projects/the-zoe-project/.agents/` | workspace only | Zoe rebranding workflow runner |

---

*Matrix maintained as part of Bxthre3 Inc SOUL.md operational governance.*
*Update when any project gains or loses a feature.*
