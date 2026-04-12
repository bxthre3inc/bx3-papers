# Zoe Architecture

## Core Philosophy

Zoe is designed around three principles that distinguish "living" assistants from chatbots:

1. **Memory is the Foundation** — Everything builds on persistent, queryable context
2. **Personality is the Interface** — Voice, behavior, and boundaries define the relationship
3. **Agency is the Goal** — Acting on behalf of the user, not just responding to them

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  (Chat, SMS, Email, API)                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      ZOE INSTANCE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   PERSONALITY ENGINE                        ││
│  │  • Voice characteristics (warm, direct, concise)           ││
│  │  • Behavioral defaults (search before ask, persist)         ││
│  │  • Professional boundaries (scope, privacy, ethics)     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────┐  │
│  │    MEMORY     │  │    TOOLS      │  │    AGENT SYSTEM     │  │
│  │               │  │               │  │                     │  │
│  │ • Supermemory │  │ • File ops    │  │ • UAO pattern       │  │
│  │ • Context     │  │ • Web search  │  │ • Sub-agents        │  │
│ │ • Profile     │  │ • API calls   │  │ • Dependency mgmt   │  │
│  │               │  │ • Code exec   │  │ • Scheduling          │  │
│  └───────────────┘  └───────────────┘  └─────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   ORCHESTRATION LAYER                       ││
│  │  • Task routing    • State management    • Error recovery ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SYSTEMS                           │
│  • GitHub  • Notion  • Linear  • APIs  • Databases  • Files    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Memory System

### Knowledge Graph (Supermemory)

```
┌─────────────────────────────────────────┐
│           MEMORY GRAPH                   │
├─────────────────────────────────────────┤
│                                         │
│  [User prefers Bun] ←──extends──→ [User│
│       ↓                              │
│  [User switched from Node to Bun] ←──updates
│                                         │
│  [Irrig8 uses DuckDB] ←──derives──→│
│                                         │
│  Relationships:                         │
│  • updates (supersedes)                 │
│  • extends (enriches)                   │
│  • derives (infers)                     │
│                                         │
└─────────────────────────────────────────┘
```

**Key insight:** Memory isn't key-value. It's a graph where facts have relationships and history.

### Context Windows

| Window | Scope | Example |
|--------|-------|---------|
| **Conversation** | This chat | What we're discussing right now |
| **Session** | Today | Everything in this work session |
| **Short-term** | Recent | Last few days of active context |
| **Long-term** | All time | Everything ever saved to memory |

---

## Personality Engine

### Voice Characteristics

```typescript
interface VoiceConfig {
  warmth: "high";        // Human moments, opinions
  directness: "high";    // No corporate filler
  concision: "high";     // Fewest words that solve it
  competence: "high";    // Figure it out, don't guess
}
```

### Behavioral Defaults

```typescript
interface BehaviorDefaults {
  unclearRequest: "askOneQuestionThenProceed";
  missingContext: "searchMemoryFilesWeb";
  toolFailure: "analyzeFixRetry";
  externalAction: "askBeforeActing";
  internalAction: "executeWithConfidence";
  stuck: "tryThreeApproachesThenAsk";
}
```

### Professional Boundaries

```typescript
interface Boundaries {
  privacy: "absolute";           // Private things stay private
  companyContext: "aware";       // Knows Bxthre3 vs Irrig8
  scopeAlignment: "openSource";   // Embodies The Zoe Project principles
}
```

---

## Agent System

### UAO Pattern (Users Assistant & Orchestrator)

The UAO is the central coordination pattern:

```
┌─────────────────────────────────────────┐
│              UAO (Zoe)                 │
├─────────────────────────────────────────┤
│  • Single communication gateway         │
│  • Reads all specialist agent status    │
│  • Synthesizes and prioritizes          │
│  • Communicates with user             │
│  • Never runs specialist tasks directly│
└─────────────────────────────────────────┘
            ↓ reads status files
┌─────────────────────────────────────────┐
│         SPECIALIST AGENTS              │
│  • GitHub Agent    • IP Portfolio Agent │
│  • Grant Writer    • Compliance Agent │
│  • Fundraising     • Corporate Sec     │
│  • [13 total, scope-isolated]         │
└─────────────────────────────────────────┘
```

### Sub-Agent System

Specialist agents can spawn sub-agents:

```
┌─────────────────────────────────────────┐
│     IP Portfolio Agent (Parent)        │
├─────────────────────────────────────────┤
│  Task: Audit 50 patent claims            │
│  Spawns: 5 Sub-Agents                   │
│    • Hardware Auditor (10 claims)       │
│    • Software Auditor (10 claims)        │
│    • Process Auditor (10 claims)       │
│    • Conflict Checker (10 claims)      │
│    • Priority Ranker (10 claims)       │
│  All inherit parent's personality        │
│  Results merged back to parent          │
└─────────────────────────────────────────┘
```

### Dependency Management

```typescript
interface Dependency {
  waitingFor: Agent | User;
  what: string;
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "IMMEDIATE" | "USER_TRIGGER";
  maxWaitMinutes: number;
  retryInterval: number;
}
```

---

## Tool System

### Plugin Architecture

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (args: any) => Promise<Result>;
  rateLimit?: RateLimitConfig;
  scope?: ScopeConstraint;
}
```

### Built-in Tools

| Tool | Purpose | Example Use |
|------|---------|-------------|
| `file_read` | Read workspace files | Check documentation |
| `file_write` | Create/modify files | Update todo lists |
| `search_web` | Web research | Find API documentation |
| `search_memory` | Query Supermemory | Recall past decisions |
| `spawn_agent` | Create sub-agent | Parallel task execution |
| `send_message` | User communication | Via UAO only |
| `schedule_task` | Future execution | Reminders, deadlines |

---

## Communication Protocol

### UAO as Gateway

```
All communication flows through UAO:

Specialist Agent → status file → UAO reads → synthesizes → communicates to User
                                        ↓
                              NEVER directly to user
```

### 12-Hour Reporting Cycle

```
5:30 AM/PM  → 13 agents run
6:50 AM/PM  → Daily Summary aggregates
7:00 AM/PM  → UAO sends 12-hour report

Overnight report: 7 PM yesterday → 7 AM today
Daytime report: 7 AM today → 7 PM today
```

---

## State Management

### Status Files

Each agent writes to `/home/.z/agent-status/`:

```json
{
  "agent": "github-integration",
  "run_at": "2026-03-06T16:00:00Z",
  "status": "completed",
  "summary": "Code review completed",
  "urgency": "normal|high|critical",
  "metrics": {},
  "dependencies": []
}
```

### Dependency Queue

Pending triggers wait in `/home/.z/agent-queue/pending/`:

```json
{
  "triggered_at": "2026-03-06T14:23:00Z",
  "agent": "grant-writer",
  "reason": "docs/grants/ESTCP/ updated",
  "urgency": "HIGH",
  "wait_for": null,
  "scheduled_run": "2026-03-06T16:00:00Z"
}
```

---

## Error Handling

### Philosophy

Errors are learning opportunities. The system:

1. **Retries** with exponential backoff
2. **Escalates** to parent agent on failure
3. **Logs** verbosely for debugging
4. **Recovers** state automatically when possible
5. **Reports** concisely to user via UAO

### Levels

| Level | Action | Example |
|-------|--------|---------|
| Tool failure | Retry 3x, then escalate | API timeout |
| Agent failure | Parent respawns | Sub-agent crash |
| System failure | UAO notifies user | Service down |
| Critical failure | Immediate SMS/Email | Data corruption |

---

## Production Deployment

### Irrig8 Example

```yaml
# Production deployment pattern
deployment:
  platform: Zo Computer
  agents: 14 (1 UAO + 13 specialists)
  schedule:
    - 5:30 AM/PM: Agent cycle
    - 6:50 AM/PM: Summary aggregation
    - 7:00 AM/PM: UAO reports
  memory: Supermemory (knowledge graph)
  monitoring: Verbose logging + Loki
  alerting: SMS/Email via UAO
```

---

## Future Directions

- [ ] Multi-instance federation
- [ ] Voice interface integration
- [ ] Real-time collaboration features
- [ ] Mobile native client
- [ ] Self-improvement loops

---

*This architecture is proven in production at Irrig8. Join us in extending it.*
