# BLUE OCEAN — EVENT-DRIVEN TASK SYSTEM
**Architecture Document**  
**Date:** 2026-03-23  
**Status:** PLANNING — Build after approval

---

## PROBLEM STATEMENT

Agents currently only wake on schedule. When Blueprint completes a task at 8am, Grader doesn't wake until its scheduled time (potentially 10+ hours later). This creates task bottleneck.

**Goal:** Event-driven task chain where completing Task A immediately triggers Task B.

---

## EXISTING INFRASTRUCTURE

| Component | Location | Status |
|---|---|---|
| Event Bus | `the-agentic-project/core/events/bus.ts` | Write-only stub (publish works, getEvents returns []) |
| INBOX Routing | `INBOX/agents/INBOX_ROUTING.py` | Works for agent inbox writes |
| Scheduled Agents | Zo agent scheduler | Time-based only, no event triggers |
| Blue Ocean Agents | Blueprint + Grader | Run on daily schedule |

---

## PROPOSED ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    EVENT-DRIVEN TASK LAYER                  │
│              (Blue Ocean Department Only)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [BLUEPRINT]                                               │
│  Completes   →  writes EVENT  →  EVENT LOG                 │
│  Task A       →  to queue      →  blue-ocean/events/        │
│                                                             │
│                           ↓                                 │
│                           │                                 │
│  [DISPATCHER]  ←  reads EVENTS  ←  Every 60 seconds        │
│  (pulse.ts     checks DEPENDENCY  via cron/loop             │
│   enhanced)     GRAPH                                    │
│                           ↓                                 │
│                           │ dependency resolved?            │
│                           │                                 │
│                    [YES] ─────────────────────              │
│                     │                                      │
│                     ↓                                      │
│  [GRADER]  ←  triggered via API                           │
│  wakes up   (Zo Ask → child session)                       │
│                     │                                      │
│                     ↓                                      │
│  Grader writes EVENT → Event Log                           │
│                           ↓                                 │
│  [BLUEPRINT]  ←  triggered via API                        │
│  woken again             (if more tasks)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## COMPONENTS TO BUILD

### 1. Event Log
**File:** `blue-ocean/events/EVENT_LOG.jsonl`  
**Format:** One JSON event per line (append-only)  
**Schema:**
```json
{
  "id": "evt-1742774400000",
  "type": "TASK_COMPLETED | TASK_STARTED | TASK_BLOCKED | HANDOFF_FIRED",
  "source": "blueprint | grader | pulse",
  "timestamp": "2026-03-23T20:00:00Z",
  "task_id": "BO-001",
  "payload": { "grade": "A", "score": 4.2 },
  "processed": false
}
```

### 2. Dependency Graph
**File:** `blue-ocean/task-queue/DEPENDENCY_GRAPH.md`  
Maps: `Task A completes → triggers Task B`  
```
BO-001 (Blueprint scan)     → completes → fires → BO-002 (Grader grade)
BO-002 (Grader grades)      → completes → fires → BO-003 (Blueprint build spec)  
BO-003 (Blueprint spec)     → completes → fires → BO-004 (Human review)
```
For B-grade opportunities: stops at human review. For A-grade: auto-builds.

### 3. Dispatcher Service (pulse.ts enhancement)
**File:** `the-agentic-project/core/employees/pulse.ts` (add Blue Ocean dispatcher)  
**Behavior:**
- Runs every 60 seconds (short interval, not hourly)
- Reads unprocessed events from EVENT_LOG.jsonl
- For each `TASK_COMPLETED` event:
  1. Look up dependency graph → find dependent task
  2. If task is `BLOCKED` and dependency now resolved → fire handoff
  3. Trigger dependent agent via Zo Ask API
  4. Mark event as processed

### 4. API Trigger Script
**File:** `blue-ocean/dispatcher/trigger_agent.py`  
**Behavior:**
```python
# Trigger a Blue Ocean agent immediately via Zo Ask API
def trigger_agent(agent_name: str, prompt: str, context: dict):
    response = requests.post(
        "https://api.zo.computer/zo/ask",
        headers={"Authorization": f"Bearer {ZO_API_KEY}"},
        json={
            "input": f"AGENT: {agent_name}\n\n{prompt}\n\nContext: {context}",
            "model_name": "vercel:minimax/minimax-m2.7"
        }
    )
    return response.json()
```

### 5. Task Queue (updated)
**File:** `blue-ocean/task-queue/TASK_QUEUE.md` (already built)  
**New states per task:**
- `AVAILABLE` → can be picked up
- `IN_PROGRESS` → being worked
- `BLOCKED` → waiting on dependency
- `WAITING_DISPATCH` → dependency resolved, dispatcher is triggering agent
- `DONE` → completed

### 6. Handoff Log
**File:** `blue-ocean/dispatcher/HANDOFF_LOG.jsonl`  
Every time dispatcher fires a handoff, log it for audit trail.

---

## DISPATCHER DECISION TREE

```
On each run (every 60s):
├── Read EVENT_LOG.jsonl for unprocessed events
├── For each unprocessed event:
│   ├── If event.type == "TASK_COMPLETED":
│   │   ├── Look up task_id in DEPENDENCY_GRAPH
│   │   ├── Find dependent task (next in chain)
│   │   ├── If dependent task exists AND status == "BLOCKED":
│   │   │   ├── Update TASK_QUEUE: dependent → WAITING_DISPATCH
│   │   │   ├── Call trigger_agent() for dependent agent
│   │   │   ├── Log to HANDOFF_LOG
│   │   │   └── Mark event as processed
│   │   └── If status != BLOCKED → just mark processed
│   └── If event.type == "AGENT_UNAVAILABLE":
│       ├── Re-queue task as AVAILABLE
│       └── Try next available agent or park
└── Sleep 60s
```

---

## PULSE AS ORCHESTRATOR

Pulse already has:
- ✅ Event bus integration (`eventBus.publish`)
- ✅ Service health monitoring
- ✅ Escalation clock

**Pulse gets new Blue Ocean dispatcher role:**
- Checks Blue Ocean event log every 60s
- Triggers Grader when Blueprint completes scan
- Triggers Blueprint when Grader completes grading
- Escalates if agent repeatedly unavailable

---

## WAKE MECHANISM — HOW AGENTS ACTUALLY GET TRIGGERED

**Problem:** Scheduled agents can't be woken mid-cycle by other agents.

**Solution — Two-tier approach:**

| Tier | Mechanism | Latency |
|---|---|---|
| **Immediate** | Dispatcher calls Zo Ask API → spawns child session | ~30 seconds |
| **Scheduled catchup** | Agent checks EVENT_LOG on next scheduled run | ~minutes to hours |

**Tier 1 (Primary):** Use `trigger_agent.py` to call Zo Ask API. Spawns a fresh child session for the target agent with full context. Child session processes the task independently.

**Tier 2 (Fallback):** Agent's next scheduled run reads the event log and picks up where it left off.

---

## EXAMPLE TASK CHAIN

```
Blueprint completes daily scan (8:00am)
  → writes TASK_COMPLETED:BO-001 to EVENT_LOG
  → Dispatcher fires within 60s (8:01am)
  → Grader woken via API, processes grading
  → Grader completes (8:05am)
  → writes TASK_COMPLETED:BO-002 to EVENT_LOG
  → Dispatcher fires within 60s (8:06am)
  → If grade == A: Blueprint woken via API to start build
  → If grade == B: Human review task queued (requires you)
  → If grade == C: Task parked in Deferred pile
```

**Result:** Grader processes within 1 minute of Blueprint completing (not 10 hours)

---

## FILE STRUCTURE

```
Bxthre3/
├── INBOX/
│   └── departments/
│       └── blue-ocean/
│           ├── DEPARTMENT.md
│           ├── TASK_QUEUE.md
│           ├── DEPENDENCY_GRAPH.md       ← NEW
│           ├── grading-deck-YYYY-MM-DD.md
│           └── events/                    ← NEW
│               ├── EVENT_LOG.jsonl        (append-only)
│               └── HANDOFF_LOG.jsonl      (append-only)
│
└── projects/the-agentic-project/
    └── core/
        └── employees/
            └── pulse.ts                   (enhanced with dispatcher)
```

---

## OPEN QUESTIONS / DECISIONS NEEDED

| Question | Options | Recommendation |
|---|---|---|
| Child session cost | Zo Ask API spawns new session per trigger | Accept — only fires on task completions, not frequent |
| Dispatcher interval | 30s vs 60s vs 5min | 60s — balances reactivity vs. cost |
| If agent unavailable | Retry N times then park | Retry 3x over 3 minutes then park + alert |
| Manual override | Can you manually trigger a task chain? | Yes — write to EVENT_LOG directly |
| Persistence | What happens if dispatcher crashes? | Stateless — reads from EVENT_LOG, idempotent |

---

## BUILD ORDER

1. ✅ TASK_QUEUE.md — already exists
2. 📋 DEPENDENCY_GRAPH.md — create
3. 📋 events/EVENT_LOG.jsonl — create
4. 📋 trigger_agent.py — create (API caller)
5. 📋 pulse.ts — add Blue Ocean dispatcher module
6. 📋 HANDOFF_LOG.jsonl — create
7. 📋 Test full chain Blueprint → Grader → (you)
8. 📋 Wire in Starting5 self-serve build chain

---

*Architecture approved: ____________  Date: ____________*
