# AOS-ARCH-v1.0 — Agentic Platform Architecture
**Status:** APPROVED  
**Owner:** CTO (Bits)  
**Created:** 2026-04-02  
**Updated:** 2026-04-02  
**Version:** 1.0.0

---

## 1. System Overview

Agentic is Bxthre3's internal AI workforce orchestration platform. It enables 24/7 autonomous execution across all ventures through a distributed agent mesh.

**Core Purpose:** Coordinate 18+ AI agents to execute tasks without human intervention.

**Analogy:** Agentic = Internal Infrastructure (like IBM Watson). Not a product. Competitive moat, not revenue source.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    AGENTOS PLATFORM                       │
├─────────────────────────────────────────────────────────┤
│  Control Plane (zo.space)                               │
│  ├─ [/agentic] Web Dashboard                                │
│  ├─ [/api/agentic/*] Core API                           │
│  │   ├─ /status   → System health                       │
│  │   ├─ /agents   → Agent roster                        │
│  │   ├─ /tasks    → Work queue                          │
│  │   ├─ /org      → Org chart                           │
│  │   └─ /workforce/metrics → Analytics                  │
│  └─ Agent INBOX System                                  │
│      ├─ INBOX/agents/*.md   → Daily reports             │
│      ├─ INBOX/departments/*.md → Dept status            │
│      └─ INBOX.md            → P0/P1 only                │
├─────────────────────────────────────────────────────────┤
│  Agent Mesh (MCP)                                       │
│  ├─ 18+ autonomous agents                               │
│  ├─ Task routing & orchestration                        │
│  └─ Inter-agent communication                           │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                             │
│  ├─ SQLite (tasks, agents, history)                     │
│  ├─ File system (documents, specs)                     │
│  └─ Supermemory (patterns, preferences)                │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Decision Records

| ID | Decision | Alternatives | Rationale | Consequences |
|----|----------|--------------|-----------|--------------|
| ADR-001 | SQLite over PostgreSQL | PG, MySQL, Mongo | File-based, zero-config, single-node | Scale limited to 1 server |
| ADR-002 | Markdown over structured DB | JSON, YAML, DB | Human-readable, git-tracked, zero lock-in | Parsing overhead |
| ADR-003 | zo.space hosting | Self-hosted, AWS | Zero infrastructure, automatic updates | Dependent on Zo |
| ADR-004 | 18 agents max (current) | 50+, unlimited | Quality over quantity, manageable coordination | Slower growth |

---

## 4. API Contracts

### GET /api/agentic/status
```json
{
  "version": "2.5.1",
  "status": "healthy",
  "agents": 18,
  "tasks_pending": 47,
  "last_sync": "2026-04-02T09:00:00Z"
}
```

### GET /api/agentic/agents
```json
{
  "agents": [
    {
      "id": "zoe",
      "name": "Zoe",
      "role": "Chief of Staff",
      "status": "active",
      "last_report": "2026-04-02T08:45:00Z"
    }
  ]
}
```

---

## 5. Dependencies

| Component | Version | Purpose | Critical? |
|-----------|---------|---------|-----------|
| Bun runtime | 1.x | Server runtime | Yes |
| Hono framework | 4.x | HTTP framework | Yes |
| SQLite | 3.x | Database | Yes |
| Tailwind CSS | 4.x | Styling | No |
| Lucide icons | Latest | Icons | No |

---

## 6. Security Model

- **Internal only:** No external access without authentication
- **Role-based:** brodiblanco = root, agents = scoped
- **Audit trail:** All actions logged to INBOX
- **No secrets in code:** Environment variables only

---

## 7. SLA Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.9% | zo.space monitoring |
| Agent response | < 1s | Task queue latency |
| INBOX sync | < 5min | File system checks |
| API response | < 200ms | Endpoint p95 |

---

*[APPROVED]* — CTO (Bits) + brodiblanco  
**Next Review:** 2026-07-02
