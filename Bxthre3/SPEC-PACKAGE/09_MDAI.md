# Multiplayer Decentralized Agentic Intelligence (M-DAI)
## Agentic Multiplayer Layer — Specification v1.0

**Date:** 2026-03-22  
**Status:** Draft  
**Author:** Zoe for brodiblanco @ Bxthre3 Inc

---

## 1. Overview

### 1.1 Problem
Agentic runs well for a single human + multiple agents. But what happens when:
- Multiple humans collaborate (founder + co-founder + advisors)
- Agents from different systems need to coordinate (Irrig8 agents + Starting5 agents)
- You want real-time multiplayer sessions like a shared document

### 1.2 Solution
Build a **Multiplayer Layer** on top of Agentic that enables:
1. **Multi-user presence** — Who's online, what are they working on
2. **Multi-agent collaboration** — Agents see each other, coordinate, delegate
3. **Real-time sync** — Shared workspace state via WebSocket
4. **Federated agent runtime** — Agents can run locally, via API, or both

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     MULTIPLAYER LAYER (M-DAI)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   BROADCAST  │  │   PRESENCE   │  │    STATE     │              │
│  │    CHANNEL    │  │   MANAGER    │  │   SYNC       │              │
│  │  (Agent ↔     │  │  (Who is     │  │  (Shared     │              │
│  │   Agent)      │  │   online)    │  │   workspace) │              │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘              │
│          │                  │                  │                      │
│          └──────────────────┼──────────────────┘                      │
│                             │                                         │
│                             ▼                                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    ORCHESTRATION BUS                            │  │
│  │            (WebSocket + Redis Pub/Sub + Event Bus)              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                             │                                         │
│          ┌──────────────────┼──────────────────┐                      │
│          ▼                  ▼                  ▼                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   LOCAL      │  │    API       │  │   FEDERATED  │              │
│  │   AGENTS     │  │   AGENTS     │  │   AGENTS     │              │
│  │  (Llama,     │  │  (OpenAI,    │  │  (Remote     │              │
│  │   Ollama)    │  │   Anthropic) │  │   Systems)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    AGENTOS CORE (existing)                      │  │
│  │  War Room • Risk Scorer • Departments • Starting 5 • Erica    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Components

### 3.1 Presence System

**What:** Real-time tracking of who/what is online.

```typescript
interface Presence {
  id: string;              // "user:brodiblanco" or "agent:taylor"
  type: "human" | "agent";
  name: string;
  status: "online" | "away" | "busy" | "offline";
  currentTask?: string;    // "Reviewing Irrig8 grant application"
  lastSeen: number;        // Unix timestamp
  location: string;         // "UAO" | "war-room" | "irrig8" | "starting5"
}
```

**Features:**
- Heartbeat every 10 seconds
- Auto-away after 5 minutes of inactivity
- Status broadcast on change
- Historical presence log (who was online when)

### 3.2 Broadcast Channel (Agent ↔ Agent)

**What:** Agents can directly message each other or broadcast to all.

```typescript
interface AgentMessage {
  id: string;
  from: string;            // Agent ID
  to: string | "all";     // Agent ID or broadcast
  type: "task" | "status" | "delegate" | "result" | "query";
  payload: unknown;
  timestamp: number;
  threadId?: string;       // For conversation threading
  references?: string[];   // Referenced message IDs
}
```

**Message Types:**
| Type | Purpose | Example |
|:---|:---|:---|
| `task` | Assign work | Taylor → Jordan: "Qualify this lead" |
| `status` | State update | Sentinel: "Scan complete, 0 threats" |
| `delegate` | Handoff | Riley → Morgan: "Take over sprint planning" |
| `result` | Work product | Jordan → Taylor: "Lead qualified, 8/10 score" |
| `query` | Ask for info | Erica → All: "Who has capacity for urgent task?" |

### 3.3 State Sync (Shared Workspace)

**What:** Multiple participants can work on shared state without conflicts.

```typescript
interface WorkspaceState {
  sessionId: string;
  participants: string[];   // Who's in this session
  focusedBy: Record<string, string>;  // { "file:x.md": "agent:taylor" }
  sharedContext: Record<string, unknown>;  // Shared variables
  locks: Record<string, { holder: string; expires: number }>;
}
```

**Conflict Resolution:**
- **Optimistic locking** — Last write wins with conflict detection
- **Intent broadcasting** — "I'm about to edit X" before editing
- **Handoff protocol** — Explicit transfer of edit authority

### 3.4 Federated Agent Registry

**What:** Central registry for all agents regardless of where they run.

```typescript
interface AgentRegistration {
  id: string;              // "taylor" | "remote:openai:gpt-4"
  name: string;
  runtime: "local" | "api" | "remote";
  endpoint?: string;       // URL or connection string
  capabilities: string[];  // ["code", "sales", "analysis"]
  status: "online" | "busy" | "offline";
  costPerRequest?: number; // For API agents
  latencyMs?: number;     // Rolling average
  owner: string;           // "agentic" | "external"
}
```

**Registry Operations:**
- `REGISTER` — Agent announces itself
- `HEARTBEAT` — Stay alive (every 30s)
- `DEREGISTER` — Clean shutdown
- `QUERY` — Find agents by capability

---

## 4. Multiplayer Session Types

### 4.1 War Room Session
Real-time collaborative decision making.

```
┌──────────────────────────────────────────────────────────┐
│ WAR ROOM: Irrig8 Pivot Decision                        │
├──────────────────────────────────────────────────────────┤
│ 👤 brodiblanco (you) — "Analyzing pivot options"         │
│ 🤖 Alex (Visionary) — "Recommend pivoting to water mgmt" │
│ 🤖 Taylor (Builder) — "Tech feasibility: 8/10"          │
│ 🤖 Jordan (Hunter) — "Market validation: strong"        │
│ 🤖 Riley (Architect) — "Building migration path ready"   │
├──────────────────────────────────────────────────────────┤
│ [Canvas showing decision tree, arguments, vote tally]    │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Shared canvas for arguments
- Live vote tally
- Consensus meter
- Recording + playback

### 4.2 Pair Programming Session
Human + agent working on code together.

```
┌──────────────────────────────────────────────────────────┐
│ PAIR: brodiblanco + Taylor coding Irrig8 API          │
├──────────────────────────────────────────────────────────┤
│ brodiblanco: "Add webhook support for weather alerts"    │
│ Taylor: *typing* "I'll add the endpoint and handlers"    │
│ [Both see cursor, both can type, voice optional]         │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Agent Delegation Chain
One agent hands off to another with full context.

```
Morgan (Operator) ──delegate──▶ Jordan (Hunter)
    │                                  │
    │ "Qualify these 50 leads          │
    │  Focus on Colorado farms         │
    │  Budget > $10k"                  │
    │                                  │
    ◀──result──                    [Working...]
        │                                  │
        "24 qualified, 8 high priority"    │
```

### 4.4 Distributed Standup
All agents + humans in same standup.

```
┌──────────────────────────────────────────────────────────┐
│ STANDUP — March 22, 2026                                  │
├──────────────────────────────────────────────────────────┤
│ 👤 brodiblanco: "Working on VPC legal docs"              │
│ 🤖 Alex: "Strategy deck v3 complete"                     │
│ 🤖 Taylor: "Irrig8 API v2 deployed"                   │
│ 🤖 Morgan: "Team health good, 1 blocker: AWS creds"     │
│ 🤖 Jordan: "3 demos scheduled, 1 close ready"           │
│ 🤖 Riley: "Sprint planning tomorrow"                     │
├──────────────────────────────────────────────────────────┤
│ BLOCKER: AWS credentials expiring — @brodiblanco fix?    │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Technical Implementation

### 5.1 Real-Time Transport

**Primary:** WebSocket for bidirectional, low-latency communication.

```
Client connects → WS://server/presence
              → WS://server/agents
              → WS://server/workspace/{sessionId}
```

**Secondary:** Redis Pub/Sub for server-to-server replication.

### 5.2 Session Management

```typescript
interface Session {
  id: string;
  name: string;
  type: "war-room" | "pair" | "standup" | "custom";
  participants: Participant[];
  state: WorkspaceState;
  history: AgentMessage[];  // Last 100 messages
  createdAt: number;
  createdBy: string;
}

// Participant in a session
interface Participant {
  id: string;
  type: "human" | "agent";
  canEdit: boolean;      // Edit permissions
  canInvite: boolean;    // Can bring others in
  role: "owner" | "editor" | "viewer";
}
```

### 5.3 Agent Runtime Interface (ARI)

Standard interface for any agent to join the mesh.

```typescript
interface AgentRuntime {
  // Identity
  id: string;
  name: string;
  
  // Lifecycle
  start(): Promise<void>;
  stop(): Promise<void>;
  
  // Messaging
  send(msg: AgentMessage): Promise<void>;
  onMessage(handler: (msg: AgentMessage) => void): void;
  
  // Capabilities
  query(prompt: string): Promise<string>;
  execute(tool: string, args: unknown): Promise<unknown>;
  
  // Health
  status(): "online" | "busy" | "offline";
  metrics(): { latencyMs: number; costPerRequest: number; };
}
```

### 5.4 Adapter Examples

**Local Ollama Agent:**
```typescript
class OllamaAdapter implements AgentRuntime {
  constructor(private model = "llama3") {}
  
  async query(prompt: string): Promise<string> {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({ model: this.model, prompt })
    });
    return (await res.json()).response;
  }
}
```

**Remote API Agent (OpenAI):**
```typescript
class OpenAIAdapter implements AgentRuntime {
  constructor(private apiKey: string, private model = "gpt-4") {}
  
  async query(prompt: string): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: this.model, messages: [{ role: "user", content: prompt }] })
    });
    return (await res.json()).choices[0].message.content;
  }
}
```

---

## 6. UI/UX

### 6.1 Multiplayer HUD

Overlay showing who's in the session:

```
┌─────────────────────────────────────────────────────────────┐
│ [👤 brodiblanco] [🤖 Alex] [🤖 Taylor] [🤖 Jordan] [+3]   │
│                                                             │
│  ● All online    ○ 2 active edits    ◐ Session: 45m        │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Agent Presence Indicators

| Indicator | Meaning |
|:---|:---|
| 🟢 Green dot | Online + available |
| 🟡 Yellow dot | Online + busy |
| 🔴 Red dot | Working on urgent task |
| ⚫ Gray dot | Offline |

### 6.3 Activity Feed

Real-time log of agent + human actions:

```
2:34pm Taylor delegated "Lead research" to Jordan
2:33pm Alex updated Strategy Deck v3
2:32pm brodiblanco commented on Irrig8 pivot
2:31pm Jordan qualified lead: Mountain View Farms (score: 9/10)
```

---

## 7. API Design

### 7.1 REST Endpoints

| Method | Path | Purpose |
|:---|:---|:---|
| `GET` | `/api/sessions` | List active sessions |
| `POST` | `/api/sessions` | Create new session |
| `GET` | `/api/sessions/:id` | Get session details |
| `POST` | `/api/sessions/:id/join` | Join a session |
| `DELETE` | `/api/sessions/:id/leave` | Leave a session |
| `GET` | `/api/agents` | List registered agents |
| `POST` | `/api/agents` | Register new agent |
| `GET` | `/api/agents/:id` | Get agent details |
| `POST` | `/api/agents/:id/message` | Send message to agent |

### 7.2 WebSocket Events

**Client → Server:**
- `join` — Join a session
- `leave` — Leave a session
- `message` — Send agent message
- `presence` — Update own presence
- `cursor` — Update cursor position (for collaborative editing)

**Server → Client:**
- `user-joined` — Someone joined
- `user-left` — Someone left
- `message` — New agent message
- `presence-update` — Someone's status changed
- `cursor-update` — Someone's cursor moved
- `state-change` — Shared state updated

---

## 8. Security

### 8.1 Authentication

- Human users: OAuth (Google, GitHub) or email/password
- Agents: API key + HMAC signature for message authentication

### 8.2 Authorization

```typescript
enum Permission {
  SESSION_VIEW = "session:view",
  SESSION_EDIT = "session:edit",
  SESSION_INVITE = "session:invite",
  AGENT_REGISTER = "agent:register",
  AGENT_CONTROL = "agent:control",
  WORKSPACE_READ = "workspace:read",
  WORKSPACE_WRITE = "workspace:write",
}

function checkPermission(user: string, permission: Permission, resource: string): boolean;
```

### 8.3 Agent-to-Agent Trust

- Agents sign messages with HMAC
- Receiver verifies signature before processing
- Rate limiting per agent (prevent spam/flooding)

---

## 9. Roadmap

| Phase | Feature | Priority |
|:---|:---|:---:|
| 1 | Presence system (who's online) | P0 |
| 2 | Agent broadcast channel | P0 |
| 3 | Shared workspace state | P1 |
| 4 | Agent registry + runtime adapters | P1 |
| 5 | War Room multiplayer UI | P1 |
| 6 | Pair programming session type | P2 |
| 7 | Federated agents (cross-system) | P2 |
| 8 | Voice integration (optional) | P3 |

---

## 10. Open Questions

1. **State storage** — Redis for real-time, PostgreSQL for persistence?
2. **Conflict resolution UI** — How to surface conflicts to humans?
3. **Agent permissions** — Can any agent delegate to any other?
4. **Billing** — How to track API agent usage by "team"?
5. **Offline support** — What happens when an agent disconnects mid-task?

---

*This spec defines the multiplayer layer for Agentic. Implementation begins when approved.*
