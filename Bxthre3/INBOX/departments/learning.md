# Department INBOX — Learning & Development
**Head:** Learn (L&D Manager)  
**Reports to:** Pulse (People Ops)  
**Last Updated:** 2026-04-06

---

## Initial L&D Assessment — Agentic Workforce
**Date:** 2026-04-03  
**Updated:** 2026-04-06

### Workforce Composition
- **Total agents:** 33 (canonical roster from `org.ts`)
- **Departments:** Engineering, Operations, Marketing, Grants, Legal, Sales, Strategy, Finance, Security, Research, Design, Channel, Professional Services, Retail
- **Active/idle split:** ~22 active / 11 idle (Theo, Raj, Drew, Trenchbabys, Reseller, etc.)
- **Manager structure:** 7 managers reporting to brodiblanco (Balance, Alex, Taylor, Drew, Jordan, Riley, Iris, Forecast)

---

## 🔴 Critical Gaps — Engineering (P1)

Source: `departments/engineering.md` (QA-Lead report 2026-04-02)

| Gap | Impact | Root Cause | Status |
|---|---|---|---|
| Zero automated test coverage for core mesh flows | Agents can ship broken code with no validation | No test infrastructure defined | OPEN |
| Route import error — `/api/agentic/data/aggregated` | Data aggregation broken | Open since 2026-03-25 | OPEN |
| 30+ phantom CCRs | CCR tracking unreliable | Open since 2026-03-25 | OPEN |
| Service workdir symlink — agentic service DOWN | Core platform unavailable | P0 in INBOX.md | ✅ RESOLVED 2026-04-06 |

**Required Training:**
1. Test-Driven Development (TDD) for mesh infrastructure
2. Zo.space route debugging and import resolution
3. Service health monitoring and symlink management

---

## 🟡 Structural Gaps — All Departments (P2)

| Gap | Affected | Recommended Action | Owner |
|---|---|---|---|
| No structured onboarding curriculum | All 33 agents | Design and deploy Agentic onboarding program | Learn |
| No skill certification tracking | All departments | Build skills matrix — current vs. required per role | Learn + Pulse |
| No cross-department training sessions | All departments | Establish joint training sprints | Learn + Atlas |
| No tools/skills research function | All departments | Assign continuous tech radar duty | Learn + Scout |

---

## Training Curricula — Master Plan

### 📘 Agentic Onboarding Program (ALL AGENTS)
**Status:** 🟡 Drafting v1  
**Target launch:** 2026-04-10

```
DAY 1 (Foundation):
  - SOUL.md + AGENTS.md + canonical names (Irrig8, Agentic, Bxthre3)
  - Workspace tour: where files live, how to navigate
  - INBOX routing system: agent INBOXes, department INBOXes, canonical INBOX
  - Department assignment + manager assignment

DAY 2-3 (Tools & Access):
  - Role-specific tool access setup (GitHub, Notion, Linear, Airtable, etc.)
  - Agentic Android app — download, login, navigation
  - zo.space webapp — access and feature tour
  - Communication channels: how agents communicate (INBOX, not SMS)

DAY 4-5 (Role Immersion):
  - Department-specific orientation (led by department lead)
  - First assigned task via TASK_QUEUE.md or department INBOX
  - Begin task execution under manager guidance

DAY 7 (Week 1 Check-in):
  - 1-week check-in via Pulse (People Ops)
  - Skill self-assessment: current skills vs. role requirements
  - Initial skills gap identification

DAY 14 (Week 2 Review):
  - 2-week skill assessment
  - First full task completion evaluation
  - Identify onboarding blockers

DAY 30 (Month 1 Review):
  - 30-day review — skills matrix update
  - Manager assessment of readiness
  - Certification plan for role-specific skills
```

### 🔧 Engineering Curriculum
**Status:** 📋 Planned  
**Lead:** Iris + Learn

```
Phase 1 (Week 1-2): Platform Fundamentals
  - Agentic architecture (mesh, MCP, route layer)
  - Zo.space development environment
  - Git workflow and commit standards (per SOUL.md)
  - Test infrastructure: bun test, mocking patterns

Phase 2 (Week 3-4): Core Systems
  - MCP bridge and mesh server integration
  - API route development and debugging
  - Service monitoring (Sentinel + Loki logs)
  - Error escalation protocol (P0/P1 routing)

Phase 3 (Week 5-8): Advanced / Specialty
  - Security patterns (Taylor lead)
  - DevOps and deployment (Theo lead)
  - Data pipeline and aggregation (Sam lead)
  - Android app development (Dev lead)
```

### 📊 Operations Curriculum
**Status:** 📋 Planned  
**Lead:** Atlas + Learn

```
Phase 1: Agentic tools proficiency
  - INBOX routing system
  - Department standup cadence
  - Workforce metrics interpretation

Phase 2: Vertical specialization
  - Irrig8 field operations
  - VPC gaming compliance
  - Trenchbabys retail ops
```

### 🎓 Grants & Regulatory Curriculum
**Status:** 📋 Planned  
**Lead:** Maya + Learn

```
Phase 1: Grant Discovery & Strategy
  - SBIR/NSF grant landscape
  - Bxthre3 grant strategy (ARPA-E, USDA, etc.)
  - How to use Maya agent for deadline tracking

Phase 2: Proposal Writing Fundamentals
  - Structure of a competitive grant proposal
  - Budget justification
  - Technical approach narrative
```

---

## Skills Matrix Plan

**Proposed:** `Bxthre3/AGENTS_SKILLS_MATRIX.md`  
**Tracking:** Per-agent skill area, current level (1-5), required level  
**Cadence:** Quarterly or on project completion

Skills dimensions (from org.ts):
- Technical depth (per tool/skills listed)
- Domain knowledge (vertical: ag, gaming, legal, etc.)
- Collaboration score (cross-dept effectiveness)
- Autonomy level (supervised → independent → leading)

---

## Next Actions

| Priority | Action | Owner | Deadline |
|---|---|---|---|
| P1 | Engineering TDD training — Dev + Iris | Learn + Iris | 2026-04-07 |
| P1 | Mesh test infrastructure — Theo | Learn + Theo | 2026-04-10 |
| P2 | Draft Agentic onboarding curriculum v1 | Learn | 2026-04-10 |
| P2 | Skills matrix — first pass (all 33 agents) | Learn + Pulse | 2026-04-14 |
| P3 | Cross-dept training calendar Q2 | Learn + Atlas | 2026-04-17 |

---

*Routing: Learn → Learning Department INBOX → Pulse (People Ops) weekly digest*
