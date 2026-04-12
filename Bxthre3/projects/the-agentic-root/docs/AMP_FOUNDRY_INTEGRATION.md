# AMP + Foundry Integration

**Two Protocols, One Purpose:** Agentic work that produces observable equity.

---

## The Dual-Protocol Model

| Layer | Protocol | Function | Output |
|-------|----------|----------|--------|
| **Execution** | AMP | Federated compute across nodes | Tasks |
| **Evidence** | Foundry | Capture → Refine → Vault | Equity Proof |

---

## Integration Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  USER (jeremy) — Master Controller                             │
└────────┬───────────────────────────────────────────────────────┘
         │
    ┌────┴─────────────────────────────────────────────────────┐
    ├──────────────────────────────────────────────────────────┤
    │      AGENTOS EXECUTION LAYER (AMP Protocol)             │
    │  ┌─────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
    │  │ FOXXD   │←│ Chromebook │←│   Server   │→│   Peers  │ │
    │  │ Android │→│   Linux    │→│  ZO.HOST   │←│   (n+1)  │ │
    │  └────┬────┘ └─────┬──────┘ └─────┬──────┘ └────┬─────┘ │
    └───────┼────────────┼──────────────┼─────────────┼────────┘
            │            │              │             │
            ▼            ▼              ▼             ▼
    ┌────┴─────────────────────────────────────────────────────┐
    │      AUTO-HARVEST LAYER (Foundry Protocol)              │
    │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
    │  │ Task Started│→ │ Task Complete│→ │Breadcrumb Saved│  │
    │  │  [Metadata] │  │  [Result]    │  │  [VAULT_PATH]  │  │
    │  └─────────────┘  └──────────────┘  └────────────────┘  │
    └───────────────────────────────────────────────────────────┘
         │
         ▼
    ┌───────────────────────────────────────────────────────┐
    │         FOUNDRY VAULT (Equity Evidence)               │
    │  Bxthre3/VAULT/                                       │
    │  ├── capabilities/agentic-federated-compute/        │
    │  ├── case-studies/v6-amp-architecture/                │
    │  ├── investor-milestones/server-coordination/       │
    │  └── metrics/aggregate-compute-hours/                 │
    └───────────────────────────────────────────────────────┘
```

---

## Auto-Harvest Integration Points

Every AMP task automatically triggers Foundry capture:

| AMP Event | Foundry Breadcrumb | Evidence Type |
|-----------|---------------------|---------------|
| `TASK_OFFER` received | Start timestamp, node capacity | Operational |
| `TASK_EXECUTE` | Assigned agent, resources used | Capability |
| `TASK_COMPLETE` | Result, duration, quality | Impact |
| `LEADER_ELECTED` | Topology shift, failover chain | Resilience |
| `PEER_DISCOVERED` | Node joined, capability map | Scale |
| `STATE_SYNC` | CRDT convergence time | Technical |
| `VOICE_INTERACTION` | Live mode usage, command types | Engagement |

---

## Core Mechanism: `TaskCompletedEvent → Breadcrumb`

```kotlin
// In AMP Manager (all platforms)
class TaskExecutor {
    suspend fun execute(task: AMPTask): TaskResult {
        val start = HybridLogicalClock.now()
        
        // Execute on best node
        val result = routeToCapableNode(task)
        
        val end = HybridLogicalClock.now()
        
        // AUTO-HARVEST: Foundry breadcrumb
        Foundry.capture(TaskBreadcrumb(
            timestamp = end,
            taskType = task.type,
            duration = end - start,
            node = myNode.id,
            result = result.status,
            value = calculateBusinessValue(task, result)
        ))
        
        return result
    }
}
```

---

## True Purpose Statement

> **AMP** makes Agentic capable of running 10,000 agents across a federated mesh.
> 
> **Foundry** makes every hour of that compute **provable equity** to anyone with a checkbook.

Without AMP: No distributed execution.
Without Foundry: No documented value.
Together: **Federated capability that compounds into documented equity.**

---

## Weekly Foundry Review (Agentic Edition)

Every Friday, AMP auto-generates:

1. **Compute Dashboard**: Hours by node, tasks by agent
2. **Resilience Report**: Failover events, leader elections, recovery times
3. **Capability Expansion**: New agents onboarded, features proven
4. **Investor-Ready Summary**: Plain-language value created

All auto-populate `Bxthre3/VAULT/` with timestamps from AMP's HLC.

---

## Documentation Index

| File | Contains |
|------|----------|
| `AMP_INTEGRATION.md` | Technical integration spec |
| `AMP_PROTOCOL.md` | Wire format, message types |
| `FOUNDRY_PROTOCOL.md` | Value capture methodology |
| `ARCHITECTURE.md` | Full system with dual-protocol |
| `CHANGELOG.md` | v6.0.0 dual-protocol release |

---

*"AMP runs the work. Foundry proves the worth."*