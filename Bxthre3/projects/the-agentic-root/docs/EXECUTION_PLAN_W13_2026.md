# EXECUTION PLAN — Week of March 30, 2026

**Strategy:** Option D (Hybrid) — Ship MVP + Build Real Automation + Document Wins  
**Deadline:** Friday, April 4, 2026  
**Success Criteria:** Working AMP heartbeat + 1 automated agent + 1 Foundry harvest

---

## MONDAY — Minimum AMP

**Goal:** Working UDP heartbeat between FOXXD ↔ Server

### Tasks
| Time | Task | Deliverable | Owner |
|------|------|-------------|-------|
| 08:00-10:00 | Fix mobile build.gradle.kts deps | `.gradle` syncs | iris |
| 10:00-12:00 | Implement AMPDiscovery.kt heartbeat | UDP beacon emits | iris |
| 13:00-15:00 | Implement server heartbeat listener | Server logs peers | dev |
| 15:00-17:00 | Wire up AMPManager to Application | Heartbeat runs on boot | iris |

**Success:** Server sees FOXXD heartbeats in logs

---

## TUESDAY — AMP Task Routing

**Goal:** Server can route 1 task to FOXXD, FOXXD can accept/reject

### Tasks
| Time | Task | Deliverable | Owner |
|------|------|-------------|-------|
| 08:00-10:00 | AMP_TASK_OFFER message spec | JSON schema defined | dev |
| 10:00-12:00 | Task routing logic in MeshServer | Route to healthiest node | dev |
| 13:00-15:00 | Task acceptance UI in Android | Accept/Reject buttons | sam |
| 15:00-17:00 | End-to-end test: Server → FOXXD → Complete | Video demo | iris |

**Success:** Complete task cycle in under 5 seconds

---

## WEDNESDAY — First Real Agent (Maya → SBIR)

**Goal:** Maya automates SBIR deadline tracking using existing connectors

### Tasks
| Time | Task | Deliverable | Owner |
|------|------|-------------|-------|
| 08:00-10:00 | Maya agent: Pull SBIR deadlines from Notion | List of 5 deadlines | maya |
| 10:00-12:00 | Maya agent: Sync to Google Calendar | Events created | maya |
| 13:00-15:00 | Maya agent: Email reminder 3 days before | Template + send logic | casey |
| 15:00-17:00 | Test end-to-end: Notion → Calendar → Email | Full automation demo | zoe |

**Success:** Zero manual SBIR tracking for you

---

## THURSDAY — Foundry Harvest

**Goal:** Maya's work auto-harvests to Foundry, creates win sheet

### Tasks
| Time | Task | Deliverable | Owner |
|------|------|-------------|-------|
| 08:00-10:00 | Foundry capture: Maya task completion → breadcrumb | JSONL write | dev |
| 10:00-12:00 | Foundry refine: Format into win sheet | Markdown output | pulse |
| 13:00-15:00 | Foundry vault: Push to VAULT/index | HTML update | pulse |
| 15:00-17:00 | Review: You see automated work in portfolio | Screenshot | zoe |

**Success:** 1 automated win visible in public VAULT

---

## FRIDAY — Replan + Ship Review

**Goal:** Validate week, lock next phase plan

### Tasks
| Time | Task | Deliverable | Owner |
|------|------|-------------|-------|
| 08:00-10:00 | Demo to yourself: FOXXD, Server, Maya automation | You approve | zoe |
| 10:00-12:00 | Document: What worked, what didn't | Retrospective | pulse |
| 13:00-15:00 | Draft: Q2 Replan based on this week | New roadmap | zoe |
| 15:00-17:00 | Executive decision: Next phase scope | Locked plan | YOU |

**Success:** Clear yes/no on continuing this path

---

## Replanned Q2 Roadmap (Draft — Pending Friday Decision)

### If Week Succeeds (Recommended Path)

**April 7-11:** Scale automation
- 3 more agents automated (Casey → outreach, Drew → CRM, Irrig8 → field alerts)
- AMP mesh: Add Chromebook as Node #2
- Foundry: Weekly auto-harvest

**April 14-18:** FOXXD polish
- Offline mode for field work
- Voice commands (basic)
- GPS-tagged task completion

**April 21-25:** Investor readiness
- VAULT fully populated
- Demo day prep
- Term sheet conversations

**May 1-30:** Scale
- 10 automated agents
- 100+ tasks/week automated
- AMP v1.0 protocol freeze

### If Week Fails (Contingency)

- Drop AMP complexity
- Use existing Zo API only
- Focus: Survival-first (grants + filings only)
- Agentic becomes documentation-only

---

## Escalation Criteria

| Trigger | Action |
|---------|--------|
| AMP heartbeat not working by Tue 12:00 | Cut to Option C (survival) |
| Maya automation not working by Thu 12:00 | Drop to 1 agent, manual Foundry |
| No VAULT win by Fri 12:00 | Extend to next week or pivot |

---

## Resource Allocation

| Resource | This Week | Q2 (If Success) |
|----------|-----------|-----------------|
| Your time | 2 hrs/day review | 1 hr/day review |
| Agent dev | 3 agents (iris, dev, sam) | 10 agents |
| Infra | Server + FOXXD | + Chromebook + backup |
| Risk tolerance | High (build fast) | Medium (stabilize) |

---

*Locked in: Monday 08:00 MST. First commit: AMPDiscovery heartbeat.*
