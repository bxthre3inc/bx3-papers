# Agentic 3.0 — Implementation Roadmap

Internal AI operating system for Bxthre3 Inc & Irrig8.
Derived from Arkad workforce architecture + Zoe living assistant patterns.

---

## Phase 1: Memory Foundation (From Zoe)

### 1.1 Supermemory Integration
**Files to create:**
- `core/memory/supermemory.ts` — Knowledge graph interface
- `core/memory/context.ts` — Short/long-term context windows
- `core/memory/profile.ts` — User preference storage

**Implementation:**
```typescript
// Persistent facts with relationships
interface Memory {
  id: string;
  content: string;
  timestamp: string;
  relationships: { type: "extends" | "updates" | "derives"; to: string }[];
  source: "conversation" | "action" | "inference";
}
```

**Test:** Can recall "ESTCP grant deadline is March 26" across sessions.

---

## Phase 2: Employee Hierarchy (From Arkad)

### 2.1 Department Structure
**Files to create:**
- `core/workforce/employee.ts` — Base employee class
- `core/workforce/manager.ts` — Manager with oversight capability
- `core/workforce/departments.ts` — Department definitions

**Structure:**
```
brodiblanco (CEO)
├── Taylor — VP Investor Relations
│   ├── Grant Scout
│   ├── Deck Writer
│   └── CRM Manager
├── Maya — VP Engineering
│   ├── Iris — IP Specialist
│   ├── Drew — Systems Architect
│   └── Theo — DevOps Engineer
└── Raj — VP Operations
    ├── CSU Pilot Lead
    └── Field Deployment
```

### 2.2 Escalation Clock
**Files to create:**
- `core/workforce/escalation.ts` — 24h timer with T-2h peer help

**Logic:**
- Blocker detected → Manager has 24h
- T-22h → Manager can request peer help
- T-24h → Auto-escalate to brodiblanco

---

## Phase 3: Communication Protocol (From Arkad + Zoe)

### 3.1 Machine Standup Format
**Files to create:**
- `core/protocols/standup.ts` — Structured status messages
- `core/protocols/inbox.ts` — Message routing system

**Format:**
```typescript
interface Standup {
  msg_type: "standup";
  employee_id: string;
  timestamp: string;
  accomplishments: Task[];
  blockers: Blocker[];
  requests: Request[];
  outbox: Message[];
}
```

### 3.2 UAO Gateway
**Files to create:**
- `core/uao/gateway.ts` — Single communication channel
- `core/uao/synthesizer.ts` — Aggregates 13 agents → digest

**Rule:** No employee talks directly to brodiblanco. All through UAO.

---

## Phase 4: Reporting Cycle (From Zoe)

### 4.1 12-Hour Reporting
**Files to create:**
- `core/reporting/scheduler.ts` — 5:30am/pm trigger
- `core/reporting/aggregator.ts` — Collects all standups
- `core/reporting/digest.ts` — Generates human-readable summary

**Schedule:**
- 5:30am/pm — All agents run
- 6:50am/pm — Aggregator compiles
- 7:00am/pm — UAO sends digest to brodiblanco

---

## Phase 5: Sprint Mode (From Arkad)

### 5.1 Deadline Detection & Resource Shift
**Files to create:**
- `core/sprints/detector.ts` — Identifies deadline-critical projects
- `core/sprints/allocator.ts` — Temporarily reassigns employees
- `core/sprints/governance.ts` — 4h peer objection window

**Trigger:** ESTCP deadline March 26 → Casey (Grant Writer) gets priority.

---

## Phase 6: Sub-Agent System (From Zoe)

### 6.1 Parallel Execution
**Files to create:**
- `core/agents/spawner.ts` — Creates task-specific sub-agents
- `core/agents/merger.ts` — Combines sub-agent results

**Example:**
- IP Portfolio Agent audits 50 patents
- Spawns 5 sub-agents (10 claims each)
- Merges findings → consolidated report

---

## Phase 7: Integration & Testing

### 7.1 Migration Checklist
- [ ] Port Arkad patent docs → `docs/patents/`
- [ ] Port Zoe architecture → `docs/architecture/`
- [ ] Test escalation: Blocker → Manager → brodiblanco
- [ ] Test reporting: 12h cycle with Irrig8 data
- [ ] Test sprint mode: CSU deadline priority

### 7.2 Arkad/Zoe Asset Inventory
| Asset | Location | Action |
|:---|:---|:---|
| Patent architecture | `the-arkad-project/investment/PATENT_ARCHITECTURE.md` | Copy to `docs/patents/` |
| Investor one-pager | `the-arkad-project/investment/INVESTOR_ONE_PAGER.md` | Copy to `docs/investor/` |
| Zoe architecture | `the-zoe-project/docs/ARCHITECTURE.md` | Copy to `docs/architecture/` |
| UAO pattern | `the-zoe-project/docs/ARCHITECTURE.md` | Implement in `core/uao/` |

---

## Dependencies

| Phase | Depends On | Est. Time |
|:---|:---|:---|
| 1 (Memory) | None | 2 days |
| 2 (Hierarchy) | Phase 1 | 2 days |
| 3 (Protocol) | Phase 2 | 1 day |
| 4 (Reporting) | Phase 3 | 1 day |
| 5 (Sprint) | Phase 2 | 1 day |
| 6 (Sub-agents) | Phase 1 | 2 days |
| 7 (Integration) | All above | 3 days |

**Total: ~12 days** (sequential, single dev)

---

## Success Criteria

1. **Memory:** Can ask "What did I decide about LRZ2 pricing last week?" and get answer.
2. **Escalation:** Create fake blocker → see it escalate Taylor → brodiblanco in 24h.
3. **Reporting:** 7am digest arrives with all agent statuses synthesized.
4. **Sprint:** Set fake deadline → see resource priority shift.

---

*Agentic 3.0 — Built for brodiblanco, not for sale.*
