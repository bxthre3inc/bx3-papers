# Agentic Stack Architecture
**How Agent Launcher relates to Agentic — and why the distinction matters**

---

## The Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│              Bxthre3 Inc (Parent Entity)                 │
└────────────────────────┬────────────────────────────────┘
                         │
           ┌─────────────┴──────────────┐
           │                            │
    ┌──────▼───────┐           ┌────────▼────────┐
    │  Agentic     │           │  Microsaas Co.  │
    │ (Platform)   │           │  (Subsidiary)   │
    │ Sold to 3rd  │◄─────────►│  Products using │
    │ parties      │  shared   │  Agentic        │
    └──────────────┘  IP       └───────┬─────────┘
                                       │
                          ┌────────────┴───────────┐
                          │                        │
                   ┌──────▼──────┐         ┌────────▼────────┐
                   │Agent Launcher│        │ Other products  │
                   │(single-agent│        │ (PaintPro, etc) │
                   │ entry layer) │         └────────────────┘
                   └─────────────┘
```

---

## Agent Launcher = Agentic in Single-Agent Mode

**Key insight:** Agentic's agent architecture is the same whether running 1 agent or 50. Agent Launcher is literally the same software, configured for single-instance, self-serve, isolated deployment.

### Shared Components

| Component | Shared? | Notes |
|-----------|---------|-------|
| Agent core runtime | ✅ Yes | Same agent executor |
| Tool connector SDK | ✅ Yes | Same connector library |
| Knowledge base index | ✅ Yes | Same vector DB (Pinecone/Supabase) |
| Memory layer | ⚠️ Isolated | Per-customer isolated; not shared |
| Orchestration layer | ❌ No | Single agent = no orchestration needed |
| Escalation engine | ❌ No | No mesh = no escalation routing |
| Shared context bus | ❌ No | No cross-agent context to share |

### Agentic Features NOT in Agent Launcher
- Multi-agent coordination
- Cross-agent memory sharing
- Escalation chains
- Role-based permission trees (mesh)
- Complex workflow orchestration
- Agent-to-agent tool passing

### Agentic Features SHARED with Agent Launcher
- Same agent prompt architecture
- Same tool connector SDK (Gmail, Calendar, Stripe, etc.)
- Same knowledge base ingestion
- Same model (Claude/GPT-4/MiniMax via API)
- Same evaluation + monitoring hooks
- Same observability dashboard (simplified)

---

## Technical Diagram

```
┌─────────────────────────────────────────────────────┐
│                  Customer Browser                   │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Dashboard  │  │ Knowledge  │  │ Activity     │  │
│  │  (Zo Space) │  │  Editor    │  │  Log         │  │
│  └──────┬──────┘  └─────┬──────┘  └──────┬───────┘  │
└─────────┼───────────────┼────────────────┼──────────┘
          │               │                │
          ▼               ▼                ▼
┌─────────────────────────────────────────────────┐
│              Agent Launcher API                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Single-Agent Supervisor                   │  │
│  │  • Run loop (one agent at a time)         │  │
│  │  • Tool call routing                      │  │
│  │  • Rate limiting                          │  │
│  │  • Memory management (isolated per cust)  │  │
│  └──────────────────────────────────────────┘  │
│                      │                          │
│                      ▼                          │
│  ┌──────────────────────────────────────────┐  │
│  │  Agentic Agent Core (single-instance mode) │  │
│  │  • Prompt template                         │  │
│  │  • Tool executor                           │  │
│  │  • Knowledge retriever                     │  │
│  │  • Output parser                          │  │
│  └──────────────────────────────────────────┘  │
└────────────────────┬──────────────────────────────┘
                     │
     ┌───────────────┼────────────────────┐
     ▼               ▼                    ▼
┌─────────┐   ┌──────────────┐   ┌──────────────┐
│ Gmail   │   │ Google      │   │ Stripe /     │
│ API     │   │ Calendar API│   │ HubSpot API  │
└─────────┘   └──────────────┘   └──────────────┘
```

---

## Why This Design Is Intentional

### Product Ladder
Every Agent Launcher customer who outgrows it is a natural upsell to Agentic. They already know the UX, trust the agents, and have their tools connected. The upgrade path is frictionless.

### IP Leverage
Agentic's agent architecture is IP. Agent Launcher uses it under the Microsaas Co. subsidiary — same IP, different product surface. This is how Bxthre3 extracts more value from the same core investment.

### Operational Efficiency
Shared tool connectors = one SDK to maintain, one auth library, one observability pipeline. Agent Launcher pays its way by being both a product AND a test bed for Agentic features.

---

## Future: When Launcher Agents Coordinate

The moment a customer wants their Sales agent to talk to their CS agent — that's Agentic mesh territory. Agent Launcher has a natural upgrade path: "Want to connect your agents? Agentic is $X/mo."

Feature gate plan:
- Launcher: 1 agent, isolated memory
- Agentic Starter: 3 agents, shared context, escalation
- Agentic Pro: unlimited agents, full orchestration, API access

---

## Code Sharing Strategy

```
Agentic Core (monorepo)
├── agentic-core/          ← shared by all
│   ├── tool-connectors/
│   ├── agent-runtime/
│   ├── memory-layer/
│   └── knowledge-base/
├── agent-launcher/        ← single-agent config
│   ├── supervisor.ts
│   ├── isolated-memory.ts
│   └── dashboard/
└── agentic-platform/      ← multi-agent mesh
    ├── orchestrator/
    ├── escalation/
    └── shared-context/
```
