# Agentic v6 Architecture

**Date:** 2026-03-27  
**Status:** Active Development

---

## Dual-Protocol Design

Agentic operates on **two complementary protocols**:

### 1. AMP — Agentic Mesh Protocol *(Technical)*
- **Purpose**: Federated, sovereign compute across heterogeneous devices
- **Scope**: Node discovery, task routing, state synchronization
- **Audience**: Machines — nodes, agents, servers
- **Document**: `AMP_PROTOCOL.md`, `AMP_RFC.md`

### 2. Foundry — Breadcrumb Harvester *(Value)*
- **Purpose**: Convert Dark Matter (scattered work) into Observable Equity
- **Scope**: Capture, refine, vault proof-of-work
- **Audience**: Humans — investors, partners, acquirers
- **Document**: `../../../FOUNDRY_PROTOCOL.md`

```
┌─────────────────────────────────────────────────────────────┐
│                        FOUNDRY (Value Layer)                │
│  HARVEST → REFINE → VAULT                                   │
│     ↑         ↑        ↑                                    │
│     │         │        │                                    │
│  Breadcrumbs Metrics  Portfolio                             │
│     │         │        │                                    │
└─────┼─────────┼────────┼────────────────────────────────────┘
      │         │        │
┌─────┼─────────┼────────┼────────────────────────────────────┐
│     │         │        │   AMP (Compute Layer)              │
│  ┌──▼─────────▼────────▼──┐                                │
│  │     AGENTOS NODES      │                                │
│  │  ┌─────┐  ┌─────┐  ┌─────┐                             │
│  │  │FOXXD│──│CHRBO│──│SERVER│  Federated Mesh           │
│  │  │(Pri)│  │(Sec)│  │(Ter) │                             │
│  │  └──┬──┘  └──┬──┘  └──┬──┘                             │
│  │     └─────────┴────────┘                                │
│  │           Tasks Routed via AMP                         │
│  └────────────────────────────────                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Foundry Integration Points

### Automatic Harvest (Agentic → Breadcrumbs)

| Event | Harvested Data | Foundry Output |
|-------|---------------|----------------|
| Task completed | Metrics, duration, node used | Win sheet entry |
| Crisis resolved | P1 alert, resolution time | Case study |
| Architecture decision | Trade-offs, rationale | Technical narrative |
| Partnership deal | Terms, value created | Partnership log |
| Grant submitted | Amount, strategy, outcome | Investor milestone |
| Code deployed | LOC, tests, coverage | Engineering win |
| Agent created | Purpose, tools, autonomy | Capability map |

### Agentic-Specific Harvesting

```kotlin
// Automatic breadcrumb emission
class TaskExecutor {
    fun onTaskComplete(task: AMPMessage.Task) {
        foundry.capture(
            what = "Task ${task.id} executed on ${task.assignedNode}",
            impact = task.metrics.summary(),
            context = task.projectRef,
            artifacts = listOf(task.logPath, task.resultPath)
        )
    }
}
```

### Refine Triggers

Agentic automatically flags for refinement:
- **P0/P1 resolution** → Case study material
- **Multi-node task orchestration** → Technical narrative
- **New capability deployment** → Capability map update
- **Investor interaction outcome** → Milestone entry

---

## Weekly Ritual Integration

The Foundry Review (Friday 5 PM) now includes:

1. **Scan Agentic Activity Log** (auto-harvested)
2. **Pick top 3 AMP-orchestrated wins**
3. **Cross-reference to business impact**
4. **Publish to Vault with node topology proof**

Example output:
```markdown
## Week of 2026-03-27

**Technical Win**: AMP dual-node failover verified
- FOXXD (primary) → Chromebook (secondary) in 47ms
- Zero dropped tasks, full state continuity
- Demo video: `/vault/amp-failover-demo-2026-03-27.mp4`

**Business Impact**: Investor confidence in infra resilience
- Removes single-point-of-failure concern
- Supports narrative of "field-first, cloud-backup" strategy
```

---

## Vault Structure (Agentic-Aware)

```
Bxthre3/VAULT/
├── index.html                           # Live portfolio
├── case-studies/
│   ├── amp-federated-mesh/             # Architecture deep dive
│   ├── agentic-v6-rewrite/             # Pivot story
│   └── irrig8-water-court-evidence/    # Regulatory victory
├── technical-wins/
│   ├── AMP_PROTOCOL.md                 # Protocol specification
│   ├── AMP_RFC.md                      # IETF submission
│   └── foundry-integration.md          # This architecture
├── investor-milestones/
│   ├── series-seed-terms.md
│   ├── grant-wins.md
│   └── partnership-agreements/
├── partnerships/
│   ├── zo-hosting.md                   # Infrastructure partner
│   ├── sensor-vendors.md               # Irrig8 hardware
│   └── gaming-licensing.md              # VPC regulatory
└── metrics/
    ├── agentic-uptime.json             # AMP health metrics
    ├── task-throughput.json            # Performance proof
    └── node-utilization.json           # Efficiency metrics
```

---

## Success Metrics

### AMP Goals
- [ ] 3+ nodes active in mesh
- [ ] <100ms failover between PRIMARY → SECONDARY
- [ ] Zero dropped tasks during node failure
- [ ] RFC submitted to IETF

### Foundry Goals
- [ ] Every P0/P1 resolved → Case study within 48 hours
- [ ] Weekly Vault update with ≥3 proof points
- [ ] Investor can understand AMP value in <5 minutes
- [ ] All major architecture decisions documented

---

*"AMP proves we can build it. Foundry proves it's worth building."*
