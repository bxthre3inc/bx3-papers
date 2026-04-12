# Solutions Engineering — Department INBOX

**Role:** Technical Pre-Sales, POC Management, Demo Environments  
**Head:** Architect (Solutions Engineer)  
**Reports to:** Deal (VP Sales), Bits (CTO)  
**Ventures Covered:** Irrig8, The Starting 5, Zoe, Valley Players Club

---

## 2026-03-30 — Standup (8:15 AM MT)

### Pre-Sales Pipeline (from Deal's deal-pipeline.csv)

#### 🔴 P1 — Active Technical Close

| Deal ID | Entity | Stage | Technical Focus | Next Step |
|---|---|---|---|---|
| VPC-CP-001 | Sage (Founding Cash Partner) | Term Sheet | Cash partnership structure, equity math, take-rate mechanics | Sage delivers mark-up — 2026-03-27 (OVERDUE) |
| IRR-DIST-001 | Valley Irrigation | Researched | Pivot manufacturer integration, dealer network API | Intro call with dealer network |
| IRR-DIST-002 | Reinke | Researched | Distribution partnership specs | Intro call with dealer network |
| IRR-DIST-007 | USDA NRCS | Active | EQIP vendor enrollment — GO/NO-GO needed this week | Grant pathway + credibility |
| IRR-FARM-001 | Maverick Potato Co | Targeted | Pilot — 2,500+ acres organic, tech adopter | Intro outreach |
| IRR-FARM-002 | Skyline Potato Co | Targeted | Pilot — 3,000+ acres, 3 facilities | Intro outreach |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Contacted | Gatekeeper to SLV potato community (52K acres) | Verify email + intro call |

#### 🟡 P2 — Technical Discovery Needed

| Deal ID | Entity | Technical Focus |
|---|---|---|
| IRR-DIST-006 | Planet Labs | Satellite data feed — dev API access needed |
| IRR-FARM-003 | Mix Farms | Qualifying call — 800+ acres |
| IRR-FARM-004 | Proximity Malt Colorado | Partnership explore — malt house integration |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Aggregated 500+ acres, 3,000+ wells |
| VPC-CP-002/003 | TBD Cash Partners x2 | Same structure as VPC-CP-001 |

### Demo Environment Status

| Environment | Status | URL/Location | Notes |
|---|---|---|---|
| Irrig8 | 🟢 Live | `brodiblanco.zo.space` (Irrig8 routes) | Web UI operational |
| Agentic | 🟢 Live | `brodiblanco.zo.space/agentic` | 6 tabs, private auth |
| VPC | 🟡 CI remediation | VPC project dir | 2 failing checks — due today |
| Starting 5 | 🟡 Planning | Architecture spike blocked | Primitives definition needed |
| Zoe | 🟢 Live | `brodiblanco.zo.space` | Zo Computer core |

### Integration Architecture Reviews Needed

| Deal | Integration Type | Status |
|---|---|---|
| Valley Irrigation / Reinke | Farm management system API | Awaiting first contact |
| Planet Labs | Satellite data feed | Dev API access request needed |
| USDA NRCS | EQIP enrollment system | GO/NO-GO pending from brodiblanco |
| Maverick/Skyline pilots | Sensor/IoT integration | Pre-POC technical discovery |
| VPC Sage | Cash partnership docs | Legal mark-up overdue |

### Open RFPs/RFIs

*TBD — none filed yet*

### Blockers

| Blocker | Owner | Resolution |
|---|---|---|
| VPC CI pipeline (2 failures) | Drew | Due today 2026-03-30 |
| mcp-mesh-control-plane 502 | Dev | Investigation needed |
| zo.space node_modules corruption | Theo | `restart_space_server` |
| BUILDBZ 8 TBD fields | brodiblanco | Say "promote to spec" or complete fields |

### Today's Actions

1. **IRR-DIST-007 (USDA NRCS):** EQIP vendor enrollment — GO/NO-GO decision needed this week
2. **IRR-DIST-006 (Planet Labs):** Request dev API access for Irrig8 satellite imagery
3. **VPC-CP-001 (Sage):** Confirm doc mark-up status — was due 2026-03-27
4. **IRR-FARM-007 (CPAC):** Verify Jessica Bradshaw email + schedule intro call

---

## 2026-04-02 — Standup (8:15 AM MT)

### Key Updates
- Standup file created: `solutions-engineering-standup-2026-04-02.md`
- **zo.space DOWN** — demo environments impacted (Irrig8, Agentic web UI)
- VPC Sage (VPC-CP-001) mark-up still overdue from 2026-03-27
- USDA NRCS EQIP — GO/NO-GO still needed this week

### Today's Actions (2026-04-02)
1. **[P1]** Confirm zo.space recovery — coordinate with Theo or run `restart_space_server`
2. **[P1]** IRR-DIST-007 USDA NRCS — GO/NO-GO decision needed this week
3. **[P2]** IRR-DIST-006 Planet Labs — request dev API access
4. **[P2]** IRR-FARM-007 CPAC — verify Jessica Bradshaw email, schedule intro call
5. **[P2]** VPC Sage (VPC-CP-001) — confirm mark-up status

### Blockers Updated
| Blocker | Owner | Impact | Resolution |
|---|---|---|---|
| **zo.space outage** | Theo | Can't demo Irrig8 or Agentic publicly | `restart_space_server` |
| VPC CI pipeline (2 failures) | Drew | Can't demonstrate VPC | CI remediation |
| BUILDBZ 8 TBD fields | brodiblanco | Can't advance spec | Promote or complete fields |

---

## Pipeline Summary (by Venture)

| Venture | P1 Deals | P2 Deals | Key Technical Gate |
|---|---|---|---|
| Irrig8 | 5 | 4 | Farm system API integration |
| VPC | 1 | 2 | CI remediation + cash partner docs |
| Starting 5 | 0 | 1 | Architecture spike — primitives undefined |
| Zoe | 0 | 0 | N/A — internal reference impl |

---

*Last updated: 2026-04-02 08:15 MT*
## 2026-04-03 — Standup (9:10 AM MT)

### Pre-Sales Pipeline

#### 🔴 P1 — Active Technical Close

| Deal ID | Entity | Stage | Technical Focus | Next Step | Status |
|---|---|---|---|---|---|
| VPC-CP-001 | Sage (Founding Cash Partner) | Term Sheet | Cash partnership structure, equity math, take-rate mechanics | Sage delivers mark-up — 2026-03-27 (OVERDUE) | 🔴 |
| IRR-DIST-001 | Valley Irrigation | Researched | Pivot manufacturer integration, dealer network API | Intro call with dealer network | 🟡 |
| IRR-DIST-002 | Reinke | Researched | Distribution partnership specs | Intro call with dealer network | 🟡 |
| IRR-DIST-007 | USDA NRCS | Active | EQIP vendor enrollment — GO/NO-GO needed **this week** | Grant pathway + credibility | 🔴 |
| IRR-FARM-001 | Maverick Potato Co | Targeted | Pilot — 2,500+ acres organic, tech adopter | Intro outreach | 🟡 |
| IRR-FARM-002 | Skyline Potato Co | Targeted | Pilot — 3,000+ acres, 3 facilities | Intro outreach | 🟡 |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Contacted | Gatekeeper to SLV potato community (52K acres) | Verify email + intro call | 🟡 |

#### 🟡 P2 — Technical Discovery Needed

| Deal ID | Entity | Technical Focus | Priority |
|---|---|---|---|---|
| IRR-DIST-006 | Planet Labs | Satellite data feed — dev API access needed | 🟡 |
| IRR-FARM-003 | Mix Farms | Qualifying call — 800+ acres | 🟡 |
| IRR-FARM-004 | Proximity Malt Colorado | Partnership explore — malt house integration | 🟡 |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Aggregated 500+ acres, 3,000+ wells | 🟡 |
| VPC-CP-002/003 | TBD Cash Partners x2 | Same structure as VPC-CP-001 | 🟡 |
| GRANT-004 | NSF SBIR Phase I | Technical narrative for SBIR | 🟡 |

### Demo Environment Status

| Environment | Status | URL/Location | Notes |
|---|---|---|---|
| Irrig8 | 🟢 Live | `brodiblanco.zo.space` (Irrig8 routes) | Web UI operational |
| Agentic | 🟢 Live | `brodiblanco.zo.space/agentic` | 6 tabs, private auth |
| VPC | 🟡 CI remediation | VPC project dir | 2 failing checks — Drew owner |
| Starting 5 | 🟡 Planning | Architecture spike blocked | Primitives definition needed |
| Zoe | 🟢 Live | `brodiblanco.zo.space` | Zo Computer core |

### Integration Architecture — Open Items

| Deal | Integration Type | Status |
|---|---|---|
| Valley Irrigation / Reinke | Farm management system API | Awaiting first contact |
| Planet Labs | Satellite data feed | Dev API access request needed |
| USDA NRCS | EQIP enrollment system | GO/NO-GO pending — this week |
| Maverick/Skyline pilots | Sensor/IoT integration | Pre-POC technical discovery |
| VPC Sage | Cash partnership docs | Legal mark-up overdue (2026-03-27) |
| NSF SBIR (GRANT-004) | Agentic technical narrative | Maya owner — deadline Apr 5 |

### Open RFPs/RFIs

*TBD — none filed yet*

### Blockers

| Blocker | Owner | Impact | Resolution |
|---|---|---|---|
| **PostgreSQL outage (P1)** | Pulse/System | Demo envs may be impacted | Investigating — see INBOX.md |
| VPC CI pipeline (2 failures) | Drew | Can't demonstrate VPC | CI remediation |
| BUILDBZ 8 TBD fields | brodiblanco | Can't advance spec | Promote or complete fields |

### Today's Actions (2026-04-03)

1. **[P1]** IRR-DIST-007 USDA NRCS — GO/NO-GO decision **this week**
2. **[P2]** IRR-DIST-006 Planet Labs — request dev API access
3. **[P2]** IRR-FARM-001 Maverick Potato Co — technical discovery outreach
4. **[P2]** IRR-FARM-002 Skyline Potato Co — technical discovery outreach
5. **[P2]** VPC-CP-001 Sage — confirm mark-up status (overdue since 2026-03-27)
6. **[P3]** GRANT-004 NSF SBIR — technical narrative support available for Maya

### Handoff

- **Drew:** VPC-CP-001 Sage markup overdue — confirm status
- **Maya:** USDA SBIR deadline Apr 5 (2 days) — technical narrative assistance available

### Escalations

- PostgreSQL outage (P1) → Pulse handling, INBOX.md flagged
- zo.space recovered from 2026-04-02 outage — demo envs operational

---

*Last updated: 2026-04-03 09:10 AM MT*
## 2026-04-08 08:15 AM MT — Standup

**Note:** Previous standup was 2026-04-06 — 2-day gap. This standup catches forward.

### Pre-Standup Check

| Item | Status | Verified |
|------|--------|----------|
| zo.space (demo envs) | 🟢 Operational | ✅ 200 OK |
| Agentic API v6.0.0 | 🟢 Operational | ✅ 200 OK, 19 agents, avgHealth 0.91 |
| `/api/agentic/status` | 🟢 200 OK | ✅ Confirmed |
| VPC CI | 🟡 2 failures | ⚠️ Drew owner |
| Irrig8 Web UI | 🟢 Live | ✅ |

### Strategic Context Update (from INBOX.md)

| Item | Status | Impact on Solutions Engineering |
|------|--------|--------------------------------|
| **ESTCP — CANCELLED** | 🔴 Exit | All ESTCP obligations terminated. Remove from pipeline. |
| CIG Colorado deadline | 🔴 22 days | IRR-DIST-007 may overlap — reassess |
| USDA REAP/SBIR | 🔴 22 days | Parallel pursuit with Casey |
| ARPA-E OPEN 2026 | 🔴 23 days | Maya owns — technical specs available |
| Cash runway | 🔴 ~1 week | Bridge $400K by July 1 — accelerating VPC closes |
| VPC Sage (VPC-CP-001) | 🟡 Mark-up overdue | Still from 2026-03-27 |

### Pre-Sales Pipeline

#### 🔴 P1 — Active Technical Close

| Deal ID | Entity | Stage | Technical Focus | Next Step | Status |
|---|---|---|---|---|---|
| VPC-CP-001 | Sage (Founding Cash Partner) | Term Sheet | Cash partnership structure, equity math, take-rate mechanics | Sage delivers mark-up — 2026-03-27 (**OVERDUE 12 days**) | 🔴 |
| IRR-DIST-007 | USDA NRCS | Active | EQIP vendor enrollment — GO/NO-GO needed **this week** | Grant pathway + credibility | 🔴 |
| IRR-FARM-001 | Maverick Potato Co | Targeted | Pre-POC — 2,500 acres, sensor integration | Technical discovery outreach | 🟡 |
| IRR-FARM-002 | Skyline Potato Co | Targeted | Pre-POC — 3,000 acres | Technical discovery outreach | 🟡 |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Contacted | Gatekeeper to 52K acre SLV potato community | Intro call — 52K acre gatekeeper | 🟡 |
| IRR-DIST-001 | Valley Irrigation | Researched | Pivot manufacturer API, dealer network | Intro call with dealer network | 🟡 |
| IRR-DIST-002 | Reinke | Researched | Distribution partnership specs | Intro call with dealer network | 🟡 |

#### 🟡 P2 — Technical Discovery Needed

| Deal ID | Entity | Technical Focus | Priority |
|---|---|---|---|
| IRR-DIST-006 | Planet Labs | Satellite data feed — dev API access needed | 🟡 |
| IRR-FARM-003 | Mix Farms | Qualifying call — 800+ acres | 🟡 |
| IRR-FARM-004 | Proximity Malt Colorado | Malt house integration potential | 🟡 |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Aggregated 500+ acres, 3,000 wells | 🟡 |
| VPC-CP-002/003 | TBD Cash Partners x2 | Same structure as VPC-CP-001 | 🟡 |
| GRANT-004 | NSF SBIR Phase I | Technical narrative for SBIR — deadline 2026-04-30 | 🟡 |

### Demo Environment Status

| Environment | Status | URL/Location | Notes |
|---|---|---|---|
| Irrig8 Web UI | 🟢 Live | `brodiblanco.zo.space` | Web UI operational |
| Agentic Webapp | 🟢 Live | `brodiblanco.zo.space/agentic` | 6 tabs, private auth, v6.0.0 |
| VPC | 🟡 CI remediation | VPC project dir | 2 failing checks — Drew owner |
| Starting 5 | 🟡 Planning | Architecture spike blocked | Primitives definition needed |
| Zoe | 🟢 Live | `brodiblanco.zo.space` | Zo Computer core |

### Integration Architecture — Open Items

| Deal | Integration Type | Status |
|---|---|---|
| Valley Irrigation / Reinke | Farm management system API | Awaiting first contact |
| Planet Labs | Satellite data feed | Dev API access request needed |
| **USDA NRCS (IRR-DIST-007)** | EQIP enrollment | **GO/NO-GO — this week critical** |
| Maverick/Skyline pilots | Sensor/IoT integration | Pre-POC technical discovery |
| VPC Sage (VPC-CP-001) | Cash partnership docs | **Legal mark-up overdue 2026-03-27** |
| NSF SBIR (GRANT-004) | Agentic technical narrative | Maya owner — deadline Apr 30 |

### Open RFPs/RFIs

None filed.

### Blockers

| Blocker | Owner | Impact | Resolution |
|---|---|---|---|
| VPC CI pipeline (2 failures) | Drew | Cannot demonstrate VPC | CI remediation |
| VPC Sage mark-up | Drew | Cash partner close blocked | Sage mark-up overdue 12 days |
| BUILDBZ 16 TBD fields | brodiblanco | Spec advancement blocked | brodiblanco decisions needed |
| ESTCP exit | All | ESTCP pipeline items cancelled | Remove from tracking |

### Today's Actions (2026-04-08)

1. **[P1]** IRR-DIST-007 USDA NRCS — GO/NO-GO decision **this week** (was: this week — now 22 days to CIG/REAP/SBIR deadlines)
2. **[P1]** VPC-CP-001 Sage — confirm mark-up status — **12 days overdue**
3. **[P2]** IRR-FARM-001 Maverick Potato Co — technical discovery outreach
4. **[P2]** IRR-FARM-002 Skyline Potato Co — technical discovery outreach
5. **[P2]** IRR-DIST-006 Planet Labs — request dev API access for Irrig8
6. **[P3]** Starting 5 architecture spike — revisit once BUILDBZ TBDs resolved

### Handoff

- **Drew:** VPC-CP-001 Sage markup still overdue (12 days) — escalate to Deal
- **Maya:** ARPA-E OPEN 2026 deadline May 1 (23 days) — technical specs on standby
- **Casey:** CIG Colorado + USDA REAP/SBIR deadlines Apr 30 — technical integration specs ready

### Escalations

- **ESTCP exit:** All ESTCP deals cancelled. IRR-DIST-007 (USDA NRCS EQIP) remains active and is the priority.
- **Cash runway critical:** ~1 week. Accelerating VPC cash partner closes is top commercial priority.

---

*Next standup: 2026-04-09 8:15 AM MT*
