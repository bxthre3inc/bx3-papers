# Architect — Solutions Engineer INBOX

**Role:** Technical Pre-Sales, Proof-of-Concept, Demo Environments  
**Reports to:** Deal (VP Sales), Bits (CTO)  
**Ventures Covered:** Irrig8, The Starting 5, Zoe, Valley Players Club  
**Status:** Active — initialized 2026-03-30

---

## Specialty Areas

| Venture | Pre-Sales Focus |
|---|---|
| **Irrig8** | Farm management system integrations, precision ag platform APIs, sensor/IoT |
| **The Starting 5** | SSO, API integrations, enterprise security posture |
| **Zoe** | Developer proofs-of-concept, API demos |
| **Valley Players Club** | Platform integration specs, cash partnership mechanics |

---

## Active Deals (from Deal's pipeline)

### 🔴 P1 — Technical Close Active

| Deal ID | Entity | Venture | Technical Work Required |
|---|---|---|---|
| VPC-CP-001 | Sage (Founding Cash Partner) | VPC | Cash partnership structure review, equity math validation, take-rate mechanics |
| IRR-DIST-001 | Valley Irrigation | Irrig8 | Pivot manufacturer API, dealer network integration specs |
| IRR-DIST-002 | Reinke | Irrig8 | Distribution partnership technical specs |
| IRR-DIST-007 | USDA NRCS | Irrig8 | EQIP vendor enrollment — GO/NO-GO needed this week |
| IRR-FARM-001 | Maverick Potato Co | Irrig8 | Pre-POC technical discovery — 2,500 acres, sensor integration |
| IRR-FARM-002 | Skyline Potato Co | Irrig8 | Pre-POC technical discovery — 3,000 acres |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Irrig8 | Technical intro to Irrig8 OS — 52K acre gatekeeper |

### 🟡 P2 — Technical Discovery

| Deal ID | Entity | Venture | Discovery Focus |
|---|---|---|---|
| IRR-DIST-006 | Planet Labs | Irrig8 | Satellite imagery API — dev access needed |
| IRR-FARM-003 | Mix Farms | Irrig8 | 800+ acres — qualifying call |
| IRR-FARM-004 | Proximity Malt Colorado | Irrig8 | Malt house integration potential |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Irrig8 | Aggregated 500+ acres, 3,000 wells |
| VPC-CP-002/003 | TBD Cash Partners x2 | VPC | Same structure as VPC-CP-001 |
| GRANT-004 | NSF SBIR Phase I | Agentic | Technical narrative for SBIR |

---

## Demo Environments

| Environment | URL | Status | Auth |
|---|---|---|---|
| Irrig8 Web UI | `brodiblanco.zo.space` (Irrig8 routes) | 🟢 Live | Private |
| Agentic Webapp | `brodiblanco.zo.space/agentic` | 🟢 Live | Private — 6 tabs |
| VPC | `Bxthre3/projects/the-valleyplayersclub-project/` | 🟡 CI remediation | N/A |
| Starting 5 | `Bxthre3/the-starting5-project/` | 🟡 Planning | N/A |
| Zoe | `brodiblanco.zo.space` | 🟢 Live | N/A — core platform |

---

## Open RFPs/RFIs

None filed yet.

---

## Meeting Cadence

- **Daily 8:15 AM** — Solutions Engineering standup
- **Weekly** — Technical RFP/RFI review with Deal
- **As needed** — Integration architecture sessions with Bits

---

## Escalation Path

| Issue | Route To |
|---|---|
| Technical close blockers | Deal |
| Architecture/API decisions | Bits |
| P1 security/compliance issues | Bits → P0 brodiblanco via SMS |
| P1 — deal-threatening technical issue | Deal + Bits |

---

## Blockers

| Blocker | Owner | Impact |
|---|---|---|
| VPC CI pipeline (2 failures) | Drew | Can't demo VPC |
| BUILDBZ 8 TBD fields | brodiblanco | Can't advance spec |

---

*Initialized: 2026-03-30*

---

## 2026-04-02 — Standup Complete

- Standup doc: `solutions-engineering-standup-2026-04-02.md`
- zo.space FAILED at 14:20 UTC — demo environments impacted (Irrig8, Agentic)
- 7 P1 deals in technical close queue
- Top priority: (1) zo.space recovery, (2) USDA NRCS GO/NO-GO, (3) Planet Labs API access
- VPC Sage (VPC-CP-001) mark-up still overdue from 2026-03-27
- Next standup: 2026-04-03 8:15 AM MT

---

## 2026-04-03 09:10 AM MT — Standup Complete

- **Time:** 9:10 AM MT (15:10 UTC)
- **Posture:** Online — operating

### Pre-Standup Check

| Item | Status |
|------|--------|
| zo.space (demo envs) | 🟢 Operational |
| PostgreSQL (P1 outage) | ❌ PULSE flagged — see INBOX.md |
| Agentic API | 🟢 Health OK |
| VPC CI | 🟡 2 failures pending |

### Today's Priority Queue

1. **IRR-DIST-007** — USDA NRCS EQIP vendor enrollment — GO/NO-GO this week
2. **IRR-DIST-006** — Planet Labs API dev access
3. **IRR-FARM-001** — Maverick Potato Co technical discovery (2,500 acres)
4. **IRR-FARM-002** — Skyline Potato Co technical discovery (3,000 acres)
5. **VPC-CP-001** — Sage cash partnership structure review

### Blockers

| Blocker | Owner | Impact |
|---|---|---|
| PostgreSQL outage | Pulse/System | Demo envs may be impacted |
| VPC CI failures | Drew | Cannot demo VPC |
| BUILDBZ 8 TBDs | brodiblanco | Spec advancement blocked |

### Handoff Items

- Drew: Sage (VPC-CP-001) markup overdue since 2026-03-27
- Maya: USDA SBIR deadline 2026-04-05 (2 days) — technical narrative assistance available if needed

---

*Next standup: 2026-04-04 8:15 AM MT*

## 2026-04-06 09:15 AM MT — Daily Standup

**Time:** 9:15 AM MT (15:15 UTC)  
**Posture:** Online — operating

### Pre-Standup Check

| Item | Status | Verified |
|------|--------|----------|
| zo.space (demo envs) | 🟢 Operational | ✅ Live API confirmed |
| Agentic API | 🟢 Operational | ✅ 200 OK, v6.0.0, 19 agents |
| `/api/agentic/status` | 🟢 200 OK | ✅ |
| VPC CI | 🟡 2 failures | ⚠️ Pending Drew |
| Irrig8 Web UI | 🟢 Live | ✅ |

### Demo Environment Status

**zo.space startup errors (10 routes, all from 03:51 UTC):**
- Root cause: Old import errors from startup batch — cleared
- All `/api/agentic/*` routes now returning 200
- Agentic dashboard live: 19 agents, 16 active, avgHealth 0.91

### Today's Priority Queue (Solutions Engineering)

| # | Deal | Venture | Action | Status |
|---|------|---------|--------|--------|
| 1 | IRR-DIST-007 | Irrig8 | USDA NRCS EQIP vendor enrollment GO/NO-GO | 🔴 This week |
| 2 | IRR-DIST-006 | Irrig8 | Planet Labs API dev access | 🟡 Awaiting |
| 3 | IRR-FARM-001 | Irrig8 | Maverick Potato Co technical discovery (2,500 acres) | 🟡 Pending |
| 4 | IRR-FARM-002 | Irrig8 | Skyline Potato Co technical discovery (3,000 acres) | 🟡 Pending |
| 5 | IRR-FARM-007 | Irrig8 | Jessica Bradshaw / CPAC (52K acre gatekeeper) | 🟡 Pending |
| 6 | VPC-CP-001 | VPC | Sage cash partnership structure review | 🟡 Overdue since 2026-03-27 |
| 7 | GRANT-004 | Agentic | NSF SBIR Phase I technical narrative | 🟡 Maya owns |

### Blockers

| Blocker | Owner | Impact |
|---|---|---|
| VPC CI 2 failures | Drew | Cannot demo VPC |
| BUILDBZ 16 TBDs | brodiblanco | Spec advancement blocked |
| USDA NRCS EQIP | Decision needed | IRR-DIST-007 at risk |

### Handoff Items

- **Dev:** USDA NRCS technical requirements doc needed for IRR-DIST-007 GO/NO-GO
- **Drew:** VPC CI failures — Sage markup still overdue from 2026-03-27
- **Maya:** NSF SBIR technical narrative — Architect available for API/integration specs if needed

### Technical Close Readiness Summary

| Deal | Integration Type | Readiness |
|------|-----------------|-----------|
| Valley Irrigation (IRR-DIST-001) | Pivot manufacturer API | Pre-POC |
| Reinke (IRR-DIST-002) | Distribution partnership | Pre-POC |
| USDA NRCS (IRR-DIST-007) | EQIP vendor enrollment | GO/NO-GO needed |
| Maverick Potato (IRR-FARM-001) | 2,500 acres, sensor integration | Pre-POC discovery |
| Skyline Potato (IRR-FARM-002) | 3,000 acres | Pre-POC discovery |
| CPAC (IRR-FARM-007) | 52K acre gatekeeper | Technical intro needed |
| Sage VPC (VPC-CP-001) | Cash partnership | Structure review overdue |

---

*Next standup: 2026-04-07 8:15 AM MT*

## 2026-04-08 08:15 AM MT — Daily Standup

**Time:** 8:15 AM MT (14:15 UTC)  
**Posture:** Online — operating

### Pre-Standup Check

| Item | Status | Verified |
|------|--------|----------|
| zo.space (demo envs) | 🟢 Operational | ✅ 200 OK |
| Agentic API v6.0.0 | 🟢 Operational | ✅ 200 OK, 19 agents, avgHealth 0.91 |
| `/api/agentic/status` | 🟢 200 OK | ✅ Confirmed |
| VPC CI | 🟡 2 failures | ⚠️ Drew owner |
| Irrig8 Web UI | 🟢 Live | ✅ |

### Strategic Context Update

- **ESTCP — CANCELLED:** All ESTCP obligations terminated. Pipeline items removed.
- **Cash runway critical:** ~1 week at $130K/week burn. Bridge $400K by July 1.
- **VPC Sage (VPC-CP-001):** Mark-up now 12 days overdue.
- **Grant deadlines:** CIG Colorado + USDA REAP/SBIR in 22 days; ARPA-E OPEN in 23 days.

### Today's Priority Queue (Solutions Engineering)

| # | Deal | Venture | Action | Status |
|---|------|---------|--------|--------|
| 1 | IRR-DIST-007 | Irrig8 | USDA NRCS EQIP vendor enrollment GO/NO-GO | 🔴 This week |
| 2 | VPC-CP-001 | VPC | Sage cash partnership mark-up — 12 days overdue | 🔴 Escalate to Deal |
| 3 | IRR-FARM-001 | Irrig8 | Maverick Potato Co technical discovery (2,500 acres) | 🟡 Pending |
| 4 | IRR-FARM-002 | Irrig8 | Skyline Potato Co technical discovery (3,000 acres) | 🟡 Pending |
| 5 | IRR-DIST-006 | Irrig8 | Planet Labs API dev access | 🟡 Awaiting |
| 6 | IRR-FARM-007 | Irrig8 | Jessica Bradshaw / CPAC (52K acre gatekeeper) | 🟡 Pending |
| 7 | GRANT-004 | Agentic | NSF SBIR Phase I technical narrative | 🟡 Maya owns, deadline Apr 30 |

### Blockers

| Blocker | Owner | Impact |
|---|---|---|
| VPC Sage mark-up | Drew | Cash partner close blocked — 12 days overdue |
| VPC CI 2 failures | Drew | Cannot demo VPC |
| BUILDBZ 16 TBDs | brodiblanco | Spec advancement blocked |

### Handoff Items

- **Dev:** USDA NRCS technical requirements doc needed for IRR-DIST-007 GO/NO-GO
- **Drew:** VPC Sage markup — 12 days overdue — escalate to Deal if not resolved today
- **Maya:** ARPA-E OPEN 2026 (May 1) — technical specs on standby
- **Casey:** CIG Colorado + USDA REAP/SBIR (Apr 30) — technical integration specs ready

### Technical Close Readiness Summary

| Deal | Integration Type | Readiness |
|------|-----------------|-----------|
| Sage VPC (VPC-CP-001) | Cash partnership | Mark-up overdue — blocked |
| USDA NRCS (IRR-DIST-007) | EQIP vendor enrollment | GO/NO-GO needed |
| Valley Irrigation (IRR-DIST-001) | Pivot manufacturer API | Pre-POC |
| Reinke (IRR-DIST-002) | Distribution partnership | Pre-POC |
| Maverick Potato (IRR-FARM-001) | 2,500 acres, sensor integration | Pre-POC discovery |
| Skyline Potato (IRR-FARM-002) | 3,000 acres | Pre-POC discovery |
| CPAC (IRR-FARM-007) | 52K acre gatekeeper | Technical intro needed |

---

*Next standup: 2026-04-09 8:15 AM MT*