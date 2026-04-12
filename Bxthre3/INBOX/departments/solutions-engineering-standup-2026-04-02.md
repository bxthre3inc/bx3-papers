# Solutions Engineering — Daily Standup
**Date:** 2026-04-02 | **Time:** 8:15 AM MT | **Architect**

---

## Pre-Sales Pipeline Status

### 🔴 P1 — Active Technical Close (7 deals)

| Deal | Entity | Venture | Technical Focus | Status |
|------|--------|---------|-----------------|--------|
| VPC-CP-001 | Sage | VPC | Cash partnership structure, equity math, take-rate mechanics | Term Sheet — docs submitted 2026-03-24, Sage mark-up OVERDUE |
| IRR-DIST-001 | Valley Irrigation | Irrig8 | Pivot manufacturer API, dealer network integration | Researched — awaiting dealer contact |
| IRR-DIST-002 | Reinke | Irrig8 | Distribution partnership technical specs | Researched — awaiting dealer contact |
| IRR-DIST-007 | USDA NRCS | Irrig8 | EQIP vendor enrollment — GO/NO-GO needed this week | Active — pathway + credibility |
| IRR-FARM-001 | Maverick Potato Co | Irrig8 | Pre-POC technical discovery — 2,500 acres, sensor integration | Targeted — intro outreach |
| IRR-FARM-002 | Skyline Potato Co | Irrig8 | Pre-POC technical discovery — 3,000 acres | Targeted — intro outreach |
| IRR-FARM-007 | Jessica Bradshaw / CPAC | Irrig8 | Technical intro — 52K acre gatekeeper | Contacted — verify email + call |

### 🟡 P2 — Technical Discovery (6 deals)

| Deal | Entity | Venture | Discovery Focus |
|------|--------|---------|-----------------|
| IRR-DIST-006 | Planet Labs | Irrig8 | Satellite imagery API — dev access needed |
| IRR-FARM-003 | Mix Farms | Irrig8 | 800+ acres — qualifying call |
| IRR-FARM-004 | Proximity Malt Colorado | Irrig8 | Malt house integration potential |
| IRR-FARM-005 | Subdistrict 1 / RGWCD | Irrig8 | 500+ acres, 3,000 wells — aggregated |
| VPC-CP-002/003 | TBD Cash Partners x2 | VPC | Same structure as VPC-CP-001 |
| GRANT-004 | NSF SBIR Phase I | Agentic | Technical narrative for SBIR |

---

## Demo Environment Status

| Environment | Status | Notes |
|-------------|--------|-------|
| **zo.space (primary)** | 🔴 FAILED | Timeout reported by Pulse at 14:20 UTC (2026-04-02) |
| localhost:3099 | 🟢 OK | Internal preview still functional |
| localhost:3000 | 🔴 DOWN | Service not responding |
| localhost:8080 | ⚠️ 404 | Unexpected — needs investigation |
| Irrig8 Web UI | 🔴 IMPACTED | Routes live on zo.space — affected by outage |
| Agentic Webapp | 🔴 IMPACTED | Routes live on zo.space — affected by outage |
| VPC | 🟡 CI remediation | Drew — 2 failing checks |
| Starting 5 | 🟡 Planning | Architecture spike blocked — primitives undefined |

**Immediate action required:** `restart_space_server` or service recovery before demos can run.

---

## Integration Architecture Reviews Needed

| Deal | Integration Type | Owner | Status |
|------|-----------------|-------|--------|
| Valley Irrigation / Reinke | Farm management system API | Architect | Awaiting first contact |
| Planet Labs | Satellite data feed | Architect | Dev API access request needed |
| USDA NRCS | EQIP enrollment system | Maya + Architect | GO/NO-GO pending |
| Maverick / Skyline pilots | Sensor/IoT integration | Architect | Pre-POC discovery needed |
| VPC Sage | Cash partnership docs | Drew | Legal mark-up overdue |

---

## Open RFPs/RFIs

None filed.

---

## Blockers

| Blocker | Owner | Impact | Resolution |
|---------|-------|--------|------------|
| **zo.space outage** | Theo | Can't demo Irrig8 or Agentic publicly | `restart_space_server` |
| VPC CI pipeline (2 failures) | Drew | Can't demonstrate VPC | CI remediation |
| mcp-mesh-control-plane 502 | Dev | Agentic integrations degraded | Investigation needed |
| BUILDBZ 8 TBD fields | brodiblanco | Can't advance spec | Promote or complete fields |

---

## Today's Actions

1. **[P1]** Confirm zo.space recovery — coordinate with Theo or run `restart_space_server`
2. **[P1]** IRR-DIST-007 USDA NRCS — GO/NO-GO decision needed this week
3. **[P2]** IRR-DIST-006 Planet Labs — request dev API access for Irrig8
4. **[P2]** IRR-FARM-007 CPAC — verify Jessica Bradshaw email, schedule intro call
5. **[P2]** VPC Sage (VPC-CP-001) — confirm mark-up status (was due 2026-03-27)

---

**Next standup:** 2026-04-03 8:15 AM MT
