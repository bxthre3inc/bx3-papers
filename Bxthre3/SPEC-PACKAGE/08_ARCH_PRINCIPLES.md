# Agentic Architecture Principles

## Core Tenet

**Agentic must run completely independently of Zo.**

Zo is used for:
- Development (writing code, testing)
- Hosting (compute, networking, storage)

Agentic does NOT depend on:
- Zo AI (Kimi)
- Zo integrations (Gmail, Calendar, etc.)
- Zo file system abstractions
- Zo tool APIs

---

## Independence Layers

```
┌─────────────────────────────────────────┐
│  ZO HOSTING (compute, network, disk)   │  ← Infrastructure only
├─────────────────────────────────────────┤
│           AGENTOS 3.1                   │  ← Our system
│  ┌─────────────────────────────────────┐│
│  │  Core Runtime (20 employees)      ││
│  │  • Own LLM provider                 ││
│  │  • Direct API integrations          ││
│  │  • Local storage                    ││
│  │  • Self-scheduling                  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Zo Dev Tools (optional, dev only)  ││
│  │  • Used for coding, debugging      ││
│  │  • Never in production path        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Production Path

| Operation | Implementation | Zo Dependency |
|:---|:---|:---|
| LLM calls | Direct OpenAI/Anthropic API | None |
| Gmail | Direct Gmail API with service account | None |
| Calendar | Direct Google Calendar API | None |
| GitHub | Direct GitHub API | None |
| File storage | Local filesystem `/home/workspace/` | None (host provides disk) |
| Scheduling | `node-cron` or systemd | None |
| Memory | SQLite/PostgreSQL | None |

---

## Development vs Production

| Phase | Zo Usage | Agentic Mode |
|:---|:---|:---|
| **Development** | Full Zo tools, AI, file system | Can use Zo features for convenience |
| **Testing** | Zo hosting, but Agentic runs standalone | Fully independent |
| **Production** | Zo provides compute only | Fully independent |

---

## The Test

Agentic passes if it can:
1. Run 12-hour cycles without any Zo API calls
2. Process emails via direct Gmail API
3. Check calendar via direct Google API
4. File patents via direct USPTO/EFS-Web
5. Operate for 30 days without Zo intervention

---

## Configuration

```typescript
// Default = fully independent
Agentic.start()  // No Zo dependency

// Development only = with Zo helpers
Agentic.startWithZoHelpers()  // Extra convenience, dev only
```

---

*Agentic 3.1 — Fully independent. Zo is the chair, not the engine.*
