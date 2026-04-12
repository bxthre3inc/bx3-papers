# AGENTS.md — Bxthre3 Workspace Memory Index

> **Last Updated:** 2026-04-06  
> **Chronicler Snapshot:** `file '/home/.z/supermemory/2026-04-06/chronicler-snapshot.md'`  
> **Purpose:** Routing index — tells all agents where to find and store information.

---

## Standards & Principles

| Document | Purpose | Every Agent Must |
|----------|---------|------------------|
| `SOUL.md` | Behavioral identity, tone, principles | Read before acting |
| `DOCUMENT_STANDARDS.md` | Document types, templates, quality gates | Follow for all outputs |

**Key Principles:**
- Principle #5: **Verify or Die (Zero Hallucination)** — no fabrication, cite everything
- Document standards: 16 types defined with approved format
- Unsourced = unsent

---

## Memory System

| Store | Location | What It Holds |
|---|---|---|
| **Supermemory** | `/home/.z/supermemory/` | Patterns, observations, preferences |
| **Agent INBOXes** | `Bxthre3/INBOX/agents/` | One `.md` per agent — daily reports, escalations, hand-offs |
| **Department INBOXes** | `Bxthre3/INBOX/departments/` | Engineering, legal, grants, etc. |
| **Canonical INBOX** | `Bxthre3/INBOX.md` | **P1s only → brodiblanco** |

---

## Project Canonical Locations

| Project | Path | Description |
|---|---|---|
| **Irrig8** | `Bxthre3/projects/the-irrig8-project/` | Precision agriculture OS, IoT irrigation |
| **Valley Players Club** | `Bxthre3/projects/the-valleyplayersclub-project/` | Sweepstakes gaming, cash-in-person |
| **The Starting 5** | `Bxthre3/the-starting5-project/` | AI co-founders SaaS |
| **ARD / Oferta** | `Bxthre3/projects/the-ard-project/` | 802 Morton St real estate arbitrage |
| **The Rain Project** | `Bxthre3/projects/the-rain-project/` | Arbitrage intelligence + notifications |
| **Trenchbabys** | `Bxthre3/projects/the-trenchbabys-project/` | Urban lifestyle retail — clothing, grooming, jewelry, events, Valley Grown |
| **Agentic** | `Bxthre3/projects/the-agentic-project/` | AI workforce orchestration |
| **Agentic Android** | `Bxthre3/projects/the-agentic-native/Agentic-Native-Source/` | Native Android app (package: `com.agenticnative`) |

---

## Agentic — Single Source of Truth

> **⚠️ Roster Merger — 2026-03-25:** org.ts and live API were diverged (org.ts had 24 fictional employees, live API had 14). Both now sync to the same 15-entity roster. Orphaned INBOXes flagged for department review.

### Architecture

```
Canonical data: the-agentic-project/core/hierarchy/org.ts  (19 employees)
                 └─ used by: core/hierarchy/agentOSApi.ts  (serialization layer)
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
           zo.space /agentic            Agentic Android App        Future clients
     (https://brodiblanco.zo.space)  (BASE_URL: brodiblanco.zo.space/api/agentic/)
                    │
                    ▼
     /api/agentic/status      → version, agents, metrics, tasks, integrations
     /api/agentic/agents      → all 14 agents
     /api/agentic/tasks        → all 15 active tasks
     /api/agentic/org          → org chart (15 entries)
     /api/agentic/workforce/metrics → workforce metrics
```

### Android App

- **APK:** `Bxthre3/projects/the-agentic-native/Agentic-Native-Source/app/build/outputs/apk/debug/app-debug.apk`
- **Package:** `com.agenticnative`
- **API:** `https://brodiblanco.zo.space/api/agentic/` (all 5 endpoints)
- **Screens:** Dashboard, Agents, Tasks, Org Chart, Workforce, Inbox, Settings, Agent Detail

### Webapp

- **URL:** `https://brodiblanco.zo.space/agentic` (private, requires auth)
- **Source:** `Bxthre3/projects/the-agentic-project/` (zo.space routes)
- **6 Tabs:** Status, Agents, Tasks, Org Chart, Starting 5, Integrations

### Agent INBOXes

| Agent | INBOX Path | Last Updated |
|---|---|---|
| zoe | `Bxthre3/INBOX/agents/zoe.md` | 2026-03-24 |
| pulse | `Bxthre3/INBOX/agents/pulse.md` | 2026-03-24 |
| sentinel | `Bxthre3/INBOX/agents/sentinel.md` | 2026-03-23 |
| iris | `Bxthre3/INBOX/agents/iris.md` | 2026-03-24 |
| maya | `Bxthre3/INBOX/agents/maya.md` | 2026-03-24 |
| drew | `Bxthre3/INBOX/agents/drew.md` | 2026-03-24 |
| raj | `Bxthre3/INBOX/agents/raj.md` | 2026-03-24 |
| casey | `Bxthre3/INBOX/agents/casey.md` | 2026-03-24 |
| theo | `Bxthre3/INBOX/agents/theo.md` | 2026-03-24 |
| shield | `Bxthre3/INBOX/agents/shield.md` | 2026-04-03 |

---

## Architecture & Nesting Protocol

### Nesting Is Forbidden

No `Bxthre3/` inside any project submodule. Projects are peers, not children.

---

## INBOX Routing Rules

```
Any agent creates a report → Bxthre3/INBOX/agents/{agent-name}.md
Escalation P1             → Bxthre3/INBOX.md (→ brodiblanco via SMS)
Department report          → Bxthre3/INBOX/departments/{dept}.md
```

### Active Agents (18 AI + 1 Human = 19 total)

| ID | Name | Role | Department | Status |
|---|---|---|---|---|
| brodiblanco | brodiblanco | Founder & CEO | Executive | working |
| zoe | Zoe | Chief of Staff | Executive | active |
| atlas | Atlas | COO | Operations | active |
| vance | Vance | Founders Assistant | Executive | monitoring |
| pulse | Pulse | People Ops | Operations | active |
| sentinel | Sentinel | System Monitor | Operations | monitoring |
| iris | Iris | Engineering Lead | Engineering | active |
| dev | Dev | Backend Engineer | Engineering | active |
| sam | Sam | Data Analyst | Engineering | active |
| taylor | Taylor | Security Engineer | Engineering | active |
| theo | Theo | DevOps Engineer | Engineering | idle |
| casey | Casey | Marketing Lead | Marketing | active |
| maya | Maya | Grant Strategist | Grants | active |
| raj | Raj | Legal & Compliance | Legal | idle |
| drew | Drew | Sales Lead | Sales | idle |
| irrig8 | Irrig8 Field Agent | Field Operations | Operations | active |
| rain | RAIN | Regulatory Intelligence | Strategy | active |
| vpc | VPC Agent | Gaming Operations | Operations | active |
| trenchbabys | Trenchbabys Agent | Retail Operations | Sales | idle |

> **Roster Merger — 2026-03-25:** Canonical roster now 19 (18 AI + brodiblanco). Previously diverged across 3 environments: org.ts had 24 fictional Arkad employees, shared/agentic had 33 hardcoded agents, live zo.space API had 14. All 3 now unified at 19. 4 new vertical agents added: irrig8, rain, vpc, trenchbabys.  
> **2026-04-05:** Specialist agent `soil-variability-mapper` created (P1) for SLV 1m soil mapping — see `file 'Bxthre3/INBOX/agents/soil-variability-mapper.md'`

---


---

## Organizational Chart

**Version:** 3.0  
**Last Updated:** 2026-03-23  
**Timezone:** America/Denver (MT)

### Leadership

| Role | Agent | Department |
|------|-------|-----------|
| **CEO** | brodiblanco (Jeremy Beebe) | Executive |
| **COO** | Atlas | Executive |
| **CFO** | Balance | Finance |
| **CTO** | Bits | Engineering |

### Department Leads

| Department | Lead | Schedule |
|------------|------|----------|
| Engineering | Bits | Daily 8:15 AM |
| Electrical Engineering | Current | Weekly (MO-FR 9:30 AM) |
| Design | Palette | Weekly (MO-FR 8:30 AM) |
| Operations | Atlas | Daily 8:15 AM |
| Sales | Deal | Weekly (MO-FR 9:00 AM) |
| Marketing | Brand | Weekly (MO-FR 9:00 AM) |
| Customer Success | Grow | Weekly (MO-FR 9:00 AM) |
| Product | Roadmap | Weekly (MO-FR 9:00 AM) |
| Finance | Balance | Weekly (MO-FR 8:00 AM) |
| Legal | Counsel | Weekly (MO-FR 9:00 AM) |
| HR | Pulse | Weekly (MO-FR 9:00 AM) |
| Ventures | Navigate | Weekly (MO-FR 9:00 AM) |
| Platform | Stack | Weekly (MO-FR 9:00 AM) |
| RD | Scout | Weekly (MO-FR 9:00 AM) |
| Security | Vault | Weekly (MO-FR 9:00 AM) |
| Comms | Echo | Weekly (MO-FR 9:00 AM) |
| Field-Ops | Forge | Weekly (MO-FR 9:00 AM) |
| Warehouse | Shelf | Weekly (MO-FR 9:00 AM) |
| QA | Scout-QA | Weekly (MO-FR 9:00 AM) |
| Prof-Svc | Deliver | Weekly (MO-FR 9:00 AM) |
| Affiliate | Harvest | Weekly (MO-FR 9:00 AM) |
| SEO-SEM | Rank | Weekly (MO-FR 9:00 AM) |
| Comms-Corp | Press | Weekly (MO-FR 9:00 AM) |
| Reg | Gavel | Weekly (MO-FR 9:00 AM) |
| BL | Anchor | Weekly (MO-FR 9:00 AM) |

### Meeting Schedule

| Meeting | Time | Days | Attendees |
|---------|------|------|-----------|
| **Daily Department Standup** | 8:15 AM MT | Mon-Fri | All department leads |
| **Daily War Room** | 4:00 PM MT | Mon-Fri | All leads + brodiblanco |
| **Weekly Board** | 2:00 PM MT | Friday | Board advisors |
| **Monthly All-Hands** | 3:00 PM MT | 1st Monday | Everyone |
| **Quarterly QBR** | 2:00 PM MT | Mar/Jun/Sep/Dec 15th | Leadership |
| **Annual Summit** | 9:00 AM MT | Jan 15 | Everyone |

