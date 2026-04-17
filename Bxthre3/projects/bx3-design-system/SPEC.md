# BX3 Federated Drop Architecture — Design System

**Version:** 0.1.0  
**Status:** Draft  
**Canonical Source:** `Bxthre3/design-system/`

---

## 1. Core Concept

The BX3 Design System is the **canonical source of truth** for all UI/UX primitives across the Bxthre3 ecosystem. Components are modeled as **atomic "drops"** — self-contained, framework-agnostic units that can be ported to any target language or framework (React, Vue, Swift, Kotlin, Go, Rust, Python).

**Symbiotic Rule:**  
All Bxthre3 projects **consume** from the Design System. All components built in downstream projects **flow back** to enrich the Design System. No component exists in isolation — it belongs to the drop registry.

---

## 2. Drop Tiers

| Tier | Definition | Examples |
|------|------------|----------|
| **Atomic Drops** | Raw tokens, primitives, base styles | `color-token`, `spacing-unit`, `typography-scale`, `shadowPreset`, `borderRadius` |
| **Molecular Drops** | Composed components built from atoms | `Button`, `Input`, `Badge`, `Card`, `Modal`, `Avatar` |
| **Agentic Drops** | Domain-specific drops for AgentOS/Irrig8 | `TaskCard`, `AgentStatus`, `MeshNode`, `EventTrigger` |
| **System Drops** | Curated collections forming functional subsystems | `AuthSystem`, `PaymentSystem`, `SensorSystem` — self-contained with internal dependency graph, version-locked independently |
| **Part Drops** | Biological metaphor for anatomical structuring | Category tags: `body`, `limbs`, `arm`, `leg`, `core`, `head`, `torso`, `hand`, `foot`, `spine`, etc. — enables clear ownership and discoverability |

---

## 3. Directory Structure

```
Bxthre3/design-system/
├── drops/                          # All drop definitions
│   ├── atomic/                     # Atomic drop registry
│   │   ├── tokens/
│   │   │   ├── color.json
│   │   │   ├── spacing.json
│   │   │   ├── typography.json
│   │   │   └── shadow.json
│   │   └── primitives/
│   │       ├── borderRadius.ts
│   │       ├── transition.ts
│   │       └── shadow.ts
│   ├── molecular/                  # Composed component drops
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Card/
│   │   └── Modal/
│   ├── agentic/                    # AgentOS/Irrig8 domain drops
│   │   ├── TaskCard/
│   │   ├── AgentStatus/
│   │   ├── MeshNode/
│   │   └── EventTrigger/
│   ├── system/                     # System drops — curated functional subsystems
│   │   ├── AuthSystem/             # AuthSystem ships with: atomic + molecular + agentic deps
│   │   ├── PaymentSystem/
│   │   └── SensorSystem/
│   └── _parts/                     # Category tags (biological metaphor)
│       ├── body/
│       ├── limbs/
│       ├── arm/
│       ├── leg/
│       ├── core/
│       ├── head/
│       ├── torso/
│       ├── hand/
│       ├── foot/
│       └── spine/
├── ports/                          # Framework-specific implementations
│   ├── react/                      # React/TypeScript port
│   ├── vue/                        # Vue 3 port
│   ├── swift/                      # iOS/macOS port
│   ├── kotlin/                     # Android port
│   ├── go/                         # Go port
│   ├── rust/                       # Rust port
│   └── python/                     # Python port
├── CONTRIBUTING.md                  # Contribution workflow
├── SPEC.md                         # This file
└── README.md
```

---

## 4. Symbiotic Flow

```
┌─────────────────────────────────────────────────────────┐
│                   DESIGN SYSTEM (Canonical)             │
│  drops/atomic  │  drops/molecular  │  drops/agentic   │
└────────┬────────────────┬─────────────────┬────────────┘
         │                │                 │
         ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                       PORTS                               │
│  react/  │  vue/  │  swift/  │  kotlin/  │  go/rust/py │
└─────────┬────────┴──────────┴───────────┴──────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│              CONSUMER PROJECTS                            │
│  AgentOS  │  Irrig8  │  zo.space  │  CREDsWallet  │ ... │
└──────────┴──────────┴────────────┴────────────────┴─────┘
          │
          │  contribute() — flow back upstream
          ▼
┌─────────────────────────────────────────────────────────┐
│              DESIGN SYSTEM ENRICHMENT                     │
│  New molecular drops or agentic drops enter registry    │
└─────────────────────────────────────────────────────────┘
```

**Rule:** When a project like `AgentOS` builds a component not in the Design System, that component is contributed back as a new drop.

---

## 5. Agentic-Specific Drops

These domain drops belong to `drops/agentic/` and are consumed exclusively by AgentOS and Irrig8.

| Drop | Purpose | Key Properties |
|------|---------|----------------|
| **TaskCard** | Displays a task with assignee, status, priority | `taskId`, `title`, `status`, `priority`, `assignee`, `dueDate`, `tags[]` |
| **AgentStatus** | Shows agent health/state indicator | `agentId`, `name`, `status` (active/idle/error/offline), `load`, `lastPulse` |
| **MeshNode** | Visualizes a node in the agent mesh | `nodeId`, `type`, `connections[]`, `health`, `latency` |
| **EventTrigger** | Trigger block for workflow events | `eventType`, `conditions[]`, `actions[]`, `enabled` |

---

## 6. Contribution Workflow

1. **Build** — Develop component in consumer project (e.g., AgentOS)
2. **Extract** — Isolate component into canonical drop format; tag with `entity`, `project`, and `task` metadata
3. **Contribute** — PR to `Bxthre3/design-system/drops/`
4. **Port** — Implement in target framework ports (`ports/react/`, etc.)
5. **Consume** — Update consumer projects to import from Design System

**Constraint:** Drops must be framework-agnostic in definition. Ports are generated from the canonical drop, not the reverse.

### 6.1 Flavor Filtering

Every drop carries metadata tags for filtering:

```json
{
  "name": "SensorDashboard",
  "tier": "molecular",
  "tags": {
    "entity": "bxthre3",
    "project": "irrig8",
    "task": "sensor-ui"
  }
}
```

**CLI usage:**
```bash
agentic-sdk list --flavor=project:irrig8
agentic-sdk list --flavor=entity:valleyplayersclub
agentic-sdk list --flavor=task:payment-flow
```

Enables per-customer theming and per-project component sets without forks.

---

## 7. Phased Roadmap

| Phase | Focus | Deliverables |
|-------|-------|--------------|
| **Phase 1** | Core atomic drops + React port | Color/spacing/typography tokens, atomic primitives, React component library |
| **Phase 2** | Molecular drops + Vue/Swift ports | Button, Input, Card, Badge, Modal; Vue 3 and Swift iOS ports |
| **Phase 3** | Agentic drops + Kotlin/Go ports | TaskCard, AgentStatus, MeshNode, EventTrigger; Android and Go ports |
| **Phase 4** | Rust/Python ports + full parity | Complete Rust and Python ports; all drops available in all frameworks |
| **Phase 5** | Automation tooling + CI | Drop scaffolder, port generator scripts, automated release pipeline |

---

## 8. Constraints

- Drops are **immutable once published** — breaking changes require major version bump
- All ports must pass **drop conformance tests** (visual + functional parity)
- Symbiotic flow is **mandatory** — no permanent component silos in consumer projects
- Agentic drops are **internal** until formally exported via public ports

---

## 9. Agentic SDK Drop

Self-onboarding SDK that drops into any codebase and federates it into the Agentic ecosystem as a mesh node.

### 9.1 Overview

The **Agentic SDK Drop** (`@bxthre3/agentic-sdk`) is the federated entry point for external codebases to join the Agentic mesh. It runs `agentic-sdk init` in any environment, introspects the codebase, presents an integration plan, and on approval — the codebase becomes a first-class node in the ecosystem with access to shared compute, memory, storage, integrations, and hardware controls.

### 9.2 Init Flow

```
┌─────────────────────────────────────────────────────────┐
│  developer@anywhere:~$ agentic-sdk init                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: INTROSPECTION                                 │
│  • Scans repo structure, language, framework, deps       │
│  • Maps API surfaces, data models, runtime environment  │
│  • Identifies compute surfaces, storage, hardware APIs   │
│  • Detects integration points (DB, queues, external svc) │
│  • Output: Architecture Context Report                   │
└─────────────────────┬───────────────────────────────────┘
                      │ (human approves)
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 2: INTEGRATION PLAN                              │
│  • Presents: what it found, what it can offer           │
│  • Shows resource contributions (compute/memory/storage) │
│  • Shows integration hooks (how it plugs into mesh)     │
│  • Shows federation tier (full/partial/observer)         │
│  • developer reviews + approves or revises              │
└─────────────────────┬───────────────────────────────────┘
                      │ (human approves)
                      ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 3: FEDERATION                                    │
│  • Registers node in mesh registry                      │
│  • Issues node certificate (node ID + mesh credentials)  │
│  • Configures self-optimization loop for workload       │
│  • Establishes mesh comms (gossip + resource broadcasts) │
│  • Output: Active mesh node                             │
└─────────────────────────────────────────────────────────┘
```

### 9.3 Federated Mesh Concept

```
                    ┌──────────────────────┐
                    │   AGENTIC MESH CORE   │
                    │  (orchestration hub)  │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
    ┌─────┴─────┐       ┌─────┴─────┐        ┌─────┴─────┐
    │ Mesh Node  │       │ Mesh Node │        │ Mesh Node │
    │  (Node.js  │       │  (Python  │        │  (Go +    │
    │  + React)  │       │  + Django)│        │  Hardware)│
    └─────┬─────┘       └─────┬─────┘        └─────┬─────┘
          │                    │                    │
    compute@5%            memory@60%            storage@2TB
    storage@200GB         compute@20%           integrations@3

          ▲                    ▲                    ▲
          │                    │                    │
    self-onboard          self-onboard          self-onboard
    via SDK               via SDK               via SDK
```

**Node Types:**
| Node Type | Description |
|-----------|-------------|
| **Full Node** | Contributes compute + memory + storage + integrations. Full mesh voting rights. |
| **Compute Node** | Contributes CPU/GPU cycles only. Read-only mesh access. |
| **Storage Node** | Contributes persistent storage. Read-only mesh access. |
| **Observer Node** | Read-only telemetry feed. No resource contribution. |

### 9.4 Resource Sharing Protocol

Nodes advertise resources via the **Mesh Gossip Protocol** (UDP broadcast on mesh port 7891):

```typescript
interface ResourceAdvertisement {
  nodeId: string;
  capabilities: {
    compute: { cores: number; ramMb: number; gpu?: boolean };
    memory: { capacityMb: number; latencyNs: number };
    storage: { availableGb: number; iops: number };
    integrations: string[];          // e.g. ["postgres", "redis", "hardware-gpio"]
    hardwareControls: string[];      // e.g. ["gpio", "uart", "i2c", "spi"]
  };
  load: number;                      // 0.0–1.0 current utilization
  federationTier: "full" | "compute" | "storage" | "observer";
  meshVersion: string;
  lastHeartbeat: number;             // unix ms
}
```

**Allocation Flow:**
1. Workload submits task to mesh core
2. Mesh core queries active resource advertisements
3. Best-fit node selected (load + capability match)
4. Task dispatched with encrypted payload
5. Result returned + node load updated

### 9.5 Self-Onboarding Phases

| Phase | Action | Output |
|-------|--------|--------|
| **Phase 0** | `agentic-sdk init` — CLI bootstrap | SDK installed, workspace ready |
| **Phase 1** | Introspection — full codebase scan | Architecture Context Report |
| **Phase 2** | Integration Plan — human-readable proposal | Approved plan JSON |
| **Phase 3** | Federation — mesh registration + cert issuance | Active node in registry |
| **Phase 4** | Self-configuration — adaptive workload optimization | Tuning loop active |
| **Phase 5** | Mesh active — participating in resource sharing | Load-balanced compute |

**Self-Configuration Detail (Phase 4):**
- Monitors workload patterns for 72h after federation
- Adjusts resource advertisement thresholds
- Learns which task types perform best on this node
- Adapts contribution profile to maximize mesh utility
- Reports anomalies to mesh core for load balancing

### 9.6 CLI Reference

```bash
# Initialize SDK in current codebase
agentic-sdk init

# Scan and generate integration plan (dry run)
agentic-sdk plan

# Federate node into mesh (requires approved plan)
agentic-sdk join --tier full

# Check node status
agentic-sdk status

# Update resource advertisement
agentic-sdk update --resources

# Leave mesh
agentic-sdk leave
```

### 9.7 Directory Structure (SDK Drop)

```
agentic-sdk/
├── src/
│   ├── cli/                    # Commander.js CLI entry
│   ├── introspect/             # Codebase analysis engine
│   ├── plan/                   # Integration plan generator
│   ├── federation/             # Mesh registration + certs
│   ├── config/                 # Self-configuration engine
│   └── mesh/                  # Gossip protocol + comms
├── drops/
│   └── agentic/                # Agentic SDK drop (this spec)
│       ├── MeshNode/           # Mesh node visualization drop
│       ├── ResourceCard/       # Resource advertisement drop
│       └── IntegrationPlan/    # Plan presentation drop
├── ports/
│   ├── react/                  # React bindings for SDK drops
│   ├── node/                   # Node.js runtime bindings
│   └── cli/                    # CLI UI drops
├── package.json
└── README.md
```

### 9.8 Constraints

- **Federation requires explicit human approval** — no silent joins
- Nodes advertise all resources honestly — falsified capability claims result in mesh ejection
- Observer nodes cannot initiate task execution — only consume results
- Hardware control APIs are gated by `hardwareControls` capability flag
- Mesh gossip is encrypted (Noise Protocol XK) on port 7891
- Node certificates rotate every 30 days via mesh CA