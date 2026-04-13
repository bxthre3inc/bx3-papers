# AgentOS Federated Mesh Architecture
> **Canonical:** `Bxthre3/agentic/ARCHITECTURE_FEDERATED_MESH.md`
> **Status:** ACTIVE
> **Last Updated:** 2026-04-13
> **Pattern:** Monolithic outside / Micro-specific inside / Federation-ready

---

## Design Principles

1. **Single deployable unit** — one container/VM, one `agentos start`, fully operational
2. **Internal mesh** — services communicate via internal pub/sub event bus, not direct imports
3. **Federation-ready** — every internal service has a peer protocol; multiple AgentOS instances can mesh
4. **API surface is singular** — external clients see one gateway; internally it's N specialized services
5. **Agent identity is portable** — DID-based, survives restarts, migrates between instances
6. **No single point of failure** — if one micro-service fails, others continue; event bus is the spine

---

## High-Level Topology

```
                           ┌─────────────────────────────────┐
                           │         EXTERNAL CLIENTS         │
                           │  (Zo Web, CLI, Mobile, Webhook)  │
                           └──────────────┬──────────────────┘
                                          │  HTTPS + Auth
                           ┌──────────────▼──────────────────┐
                           │       UNIFIED API GATEWAY        │
                           │  (Kong/Traefik or custom)        │
                           │  - Auth / Rate Limit / Routing   │
                           │  - Single base URL               │
                           └──────────────┬──────────────────┘
                                          │  Internal Event Bus (NATS / Redis)
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
          ┌──────────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
          │   AGENT GATEWAY   │  │ TOOL GATEWAY    │  │ TRAINING GATEWAY│
          │ - spawn/kill      │  │ - register      │  │ - job control   │
          │ - route intent    │  │ - invoke        │  │ - dataset mgmt   │
          │ - agent DID mgmt  │  │ - discover      │  │ - model registry │
          └──────────┬────────┘  └────────┬────────┘  └───────┬────────┘
                    │                     │                     │
          ┌──────────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
          │  AGENT RUNTIME    │  │  TOOL REGISTRY  │  │  TRAINING ENGINE │
          │  (LFM 2.5 / any  │  │  - signatures   │  │  - fine-tune    │
          │   model pool)     │  │  - tiers        │  │  - evaluate     │
          │  - session mgmt  │  │  - versions     │  │  - deploy       │
          │  - tool execution│  │  - quotas       │  │  - rollback     │
          └──────────┬────────┘  └────────┬────────┘  └───────┬────────┘
                    │                     │                     │
          ┌──────────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
          │   ENV MANAGER     │  │  PEER BRIDGE    │  │   EVALUATOR    │
          │  - ephemeral      │  │  - mesh discovery│ │  - benchmark   │
          │    sandboxes      │  │  - DID exchange │  │  - accuracy    │
          │  - resource caps  │  │  - tool relay   │  │  - drift detect│
          │  - isolation      │  │  - federation   │  │  - HITL queue  │
          └───────────────────┘  └─────────────────┘  └────────────────┘
          
          All services share: EVENT BUS (NATS/Redis) + STATE STORE (SQLite/Postgres)
```

---

## Internal Services

### 1. Agent Gateway (`agent-gateway`)
**Port:** `7401` | **Protocol:** REST + WS | **Peer Port:** `7501`

Core responsibilities:
- Spawn, kill, list, inspect agents
- Route intents (T0/T1/T2) to correct handler
- Manage agent DID registry
- Session lifecycle

**API Surface:**
```
POST   /agents              — spawn new agent
GET    /agents              — list all agents
GET    /agents/:id          — inspect agent
DELETE /agents/:id          — kill agent
POST   /agents/:id/intent   — submit T1/T2 intent
WS     /agents/:id/session  — streaming session
```

### 2. Tool Gateway (`tool-gateway`)
**Port:** `7402` | **Protocol:** REST | **Peer Port:** `7502`

Core responsibilities:
- Tool registry CRUD
- Tool invocation dispatch
- Tier enforcement (T0 free / T1 announce / T2 HITL)
- Tool versioning and deprecation
- Quota management

**API Surface:**
```
GET    /tools               — list all tools
POST   /tools               — register new tool
GET    /tools/:name         — get tool signature
POST   /tools/:name/invoke  — invoke tool
DELETE /tools/:name         — deregister tool
GET    /tools/tiers         — get tier assignments
```

### 3. Training Gateway (`training-gateway`)
**Port:** `7403` | **Protocol:** REST + WS | **Peer Port:** `7503`

Core responsibilities:
- Fine-tuning job lifecycle (create, monitor, cancel)
- Dataset management (upload, version, split)
- Model registry (register, deploy, rollback)
- Evaluation pipeline triggers
- HITL approval integration

**API Surface:**
```
GET    /training/jobs           — list jobs
POST   /training/jobs           — create fine-tune job
GET    /training/jobs/:id       — job status
POST   /training/datasets       — upload dataset
GET    /training/datasets       — list datasets
POST   /training/evaluate       — trigger evaluation
GET    /training/models         — model registry
POST   /training/models/deploy  — deploy model version
POST   /training/models/rollback— rollback to previous
```

### 4. Peer Bridge (`peer-bridge`)
**Port:** `7404` | **Protocol:** libp2p / WebSocket | **Peer Port:** `7504`

Core responsibilities:
- Discover other AgentOS instances on LAN / WAN
- Exchange DID and capability manifests
- Relay tool calls across instances
- Federated tool sharing (I call your tools, you call mine)
- Consensus / voting for multi-instance decisions

**API Surface:**
```
GET    /peers                  — list discovered peers
POST   /peers/connect          — connect to peer by DID
GET    /peers/:id/manifest     — get peer's tool/agent manifest
POST   /peers/:id/relay        — relay tool call to peer
WS     /peers/federation       — federation event stream
```

### 5. Agent Runtime (`agent-runtime`)
**Port:** `7405` | **Protocol:** Internal only (IPC) | **Peer Port:** `7505`

Core responsibilities:
- Execute model inference (LFM 2.5, OpenAI, Anthropic, etc.)
- Manage model pool (load balancing across models)
- Tool call parsing and enforcement
- Session state management
- KV cache optimization (LFM-native)

**Internal API (IPC only):**
```
POST   /runtime/infer          — run inference
POST   /runtime/tools/call     — execute tool
GET    /runtime/session/:id    — session state
POST   /runtime/session/:id    — create session
```

### 6. Environment Manager (`env-manager`)
**Port:** `7406` | **Protocol:** Internal only (IPC) | **Peer Port:** `7506`

Core responsibilities:
- Ephemeral sandbox management (containers, microVMs)
- Resource allocation per agent (CPU, RAM, disk)
- Filesystem isolation
- Network policy enforcement (agent can/cannot call what)
- Cleanup on session end

### 7. Evaluator (`evaluator`)
**Port:** `7407` | **Protocol:** REST + IPC | **Peer Port:** `7507`

Core responsibilities:
- Run benchmark suites against model versions
- Per-tool accuracy measurement
- Drift detection (accuracy degrades over time → trigger retrain)
- T2 confusion scoring (is model trying to call T2 tools autonomously?)
- Generate evaluation reports

### 8. Event Bus (shared spine)
**Implementation:** NATS or Redis Streams
**Ports:** `7400` (internal messaging), `7600` (cluster federation)

All services communicate via pub/sub channels:
```
agent.events       — agent lifecycle events
tool.events       — tool registration/invocation events
training.events   — job status, model deploy events
peer.events       — peer discovery, federation events
audit.events      — immutable audit log (all T2 actions)
```

---

## Agent DID System

Every agent has a **Decentralized Identifier** that is portable across instances:

```
did:agentos:<sha256(public_key)>
```

- Generated on first spawn
- Stored in agent state
- Signed with ed25519 private key
- Used for peer-to-peer authentication

```
Agent Manifest (stored in state):
{
  "did": "did:agentos:a3f8b2c1...",
  "name": "irrig8-scheduler",
  "version": "1.0",
  "gateway": "agent-gateway",
  "capabilities": ["scheduling", "sensor_read", "pivot_control"],
  "tools": ["satellite_fetch", "sensor_read", "pivot_schedule"],
  "tier_policy": "strict",  // never calls T2 without HITL
  "peers": []
}
```

---

## Federation Protocol

**Goal:** Multiple AgentOS instances form a mesh — each agent can call tools on remote instances as if they were local.

**Peer Discovery:**
1. On startup, each instance broadcasts a `DiscoveryAnnounce` on LAN (UDP multicast) + registers with known seed nodes
2. Peers exchange `CapabilityManifest` (what tools/agents they expose)
3. Peers establish persistent WebSocket connections for low-latency tool relay

**Federated Tool Call Flow:**
```
Local Agent → Local Tool Gateway → Peer Bridge → Remote Peer Bridge → Remote Tool Gateway → Remote Tool
                                                          ↓
                                              Response bubbles back up the chain
```

**Security:**
- Each instance has its own DID
- Tool relay requests are signed by caller's DID
- Remote tool calls are validated against remote tier policy
- T2 tools are NEVER relayed to remote instances (local HITL only)

---

## Tier Routing (Enforcement Points)

```
T0 (Autonomous)     → Agent Runtime executes directly, logs to audit bus
T1 (Intentional)    → Agent Gateway validates <|intent_start|> prefix, logs intent, executes
T2 (HITL-Gated)     → Chairman Queue, human approves, Agent Gateway executes on approval
```

**T2 never flows through peer bridge.** T2 is always local-only.

---

## Deployment Topology

### Single Instance (Monolithic)
```
agentos start
  → Starts NATS (port 7400)
  → Starts all services (7401-7407)
  → Starts unified gateway (443)
  → Agentic is fully operational
```

### Federated Cluster
```
agentos start --federate --seeds=seed1.agentos.io,seed2.agentos.io
  → Starts NATS cluster
  → Joins mesh
  → Discovers peers
  → Syncs tool/agent manifests
  → Ready for cross-instance tool calls
```

### Developer (local mesh)
```
agentos dev
  → Starts all services on localhost
  → Exposes all ports for debugging
  → No external networking
```

---

## Technology Choices

| Component | Choice | Rationale |
|---|---|---|
| API Gateway | Custom (Bun/Hono) | Already on zo.space stack, full control |
| Event Bus | NATS | Designed for this, federation built-in, 90% KV cache analogy applies |
| State Store | SQLite (single) / Postgres (cluster) | Agent state is relational; Postgres for federation |
| Agent Runtime | Python + LFM 2.5 (local) + OpenAI/Anthropic (cloud) | Hybrid model pool |
| Container Runtime | Docker (env-manager) | Ephemeral sandboxes, resource caps |
| DID / Crypto | ed25519 / did:key | No blockchain needed; self-contained |
| Service Mesh | Internal NATS + mTLS | No Istio overhead; NATS handles auth |

---

## Verification

This architecture is implemented as:
- `Bxthre3/agentic/kernel/service_mesh/` — service definitions
- `Bxthre3/agentic/kernel/gateway/` — unified gateway
- `Bxthre3/agentic/TOOL_MANIFEST.md` — tool tier registry
- `Bxthre3/agentic/TRAINING_LIFECYCLE.md` — training loop
