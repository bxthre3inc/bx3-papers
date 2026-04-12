# AGENTOS FULL EVENT-DRIVEN MIGRATION

**Status:** ALL 70+ AGENTS CONVERTING  
**Date:** April 5, 2026  
**Paradigm:** ZERO POLLING — 100% EVENT-DRIVEN

---

## MIGRATION PRINCIPLE

| Before (V6/V7) | After (Agentic V1) |
|----------------|-------------------|
| Agent wakes, polls, reports, sleeps | Agent sleeps until event arrives, reacts, emits, sleeps |
| Clock-driven | **Reality-driven** |
| `rrule: FREQ=DAILY` | `rrule: FREQ=YEARLY` + **Event Subscriptions** |

---

## EVENT TAXONOMY (3-Tier)

### Tier 1: Reality Events (External World)
- `sfd.*` — Sensor/Field Data (Irrig8, physical world)
- `rss.*` — Market/Regulatory Signals
- `usr.*` — User Actions (signups, payments, complaints)
- `fin.*` — Financial Events (transfers, milestones)
- `inv.*` — Investor Actions (intros, term sheets, DD)

### Tier 2: System Events (BX3 Infrastructure)
- `sys.*` — Infrastructure (deploys, errors, chaos)
- `cha.*` — Chaos Events (antifragility triggers)
- `met.*` — Metric Thresholds (ARR, NRR, burn)
- `dap.*` — DAP Evaluations (plane triggers)

### Tier 3: Agent Events (Internal Cascade)
- `agt.*` — Agent Actions (started, completed, blocked)
- `syn.*` — Synthesis Events (insights discovered)
- `pmt.*` — Prompt/Action Events

---

## AGENT SUBSCRIPTION MAP

| Agent Type | Subscribes To | Emits |
|------------|--------------|-------|
| **Patent-Agent** | `ip.provisional.filed`, `ip.provisional.rejected` | `patent.defense.strengthened` |
| **Shadow-Engineer** | `pmt.patent.protected`, `sfd.irrig8.sensor.batch` | `shadow.metrics.captured` |
| **Deal-Agent** | `investor.term_sheet.received`, `investor.dd.requested` | `deal.term_sheet.evaluated` |
| **SBIR-Agent** | `grant.nsf.solicitation.opened`, `grant.usda.nifa.opened` | `grant.application.submitted` |
| **Funding-Orchestrator** | `patent.*`, `shadow.*`, `deal.*`, `grant.*`, `rbf.*` | `funding.cascade.completed` |
| **VAS-* agents** | `sfd.*`, `met.*`, `sys.*` | `vas.opportunity.discovered` |
| **Irrig8 Field Agents** | `sfd.irrig8.*`, `cha.failure.*` | `irrigation.recommendation.issued` |
| **Department Leads** | `agt.*`, `syn.*`, `met.*` | `dept.response.coordinated` |

---

## IMPLEMENTATION

All agents converted to:
- `rrule: FREQ=YEARLY` (heartbeat only)
- Event subscriptions via `/api/agentic/funding/agents/trigger`
- Sleep mode between events
- React → Emit → Sleep cycle

---

## MIGRATION COMPLETE: April 5, 2026 04:35 UTC