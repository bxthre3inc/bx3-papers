# Bxthre3 Unified Project Manifest
**Last Updated:** 2026-03-23 (Evening Sprint EV-2026-03-23)

---

## Active Ventures

| Project | Path | Status | Priority |
|---------|------|--------|----------|
| **Irrig8** | `projects/the-irrig8-project/` | 🟡 STANDBY — awaiting funding | P0 |
| **Agentic (Zoe)** | `projects/the-agentic-project/` + `projects/the-zoe-project/` | 🟢 ACTIVE — internal ops | P0 |
| **Valley Players Club** | `projects/the-valleyplayersclub-project/` | 🟡 PLANNING — legal docs drafted | P1 |
| **The Starting 5** | `projects/the-starting5-project/` | 🔴 NOT STARTED | P2 |
| **ARKAD (Real Estate)** | `projects/the-realestate-arbitrage-project/` | 🔴 ARCHIVED | — |
| **The ARD Project** | `projects/the-ard-project/` | 🔴 UNKNOWN — needs review | — |

---

## Core Infrastructure

| System | Location | Status |
|--------|----------|--------|
| **INBOX System** | `Bxthre3/INBOX/` | 🟢 OPERATIONAL |
| **Grant Pipeline** | `Bxthre3/grants/` | 🟢 OPERATIONAL |
| **Agentic (aos)** | Zo Service (`aos-brodiblanco.zocomputer.io`) | 🟢 LIVE |
| **PostgreSQL** | Local (`postgres-data/`) | 🟡 READY |
| **Zo Sites** | `projects/*/site/`, `projects/*/Sites/` | MIXED |

---

## Service Status (Intentionally Offline)

| Service | Port | Status | Notes |
|---------|------|--------|-------|
| Irrig8 API | 8001 | 🔴 OFFLINE | Intentional — funding gate |
| Irrig8 Frontend | 5174 | 🔴 OFFLINE | Intentional — funding gate |
| VPC Edge | 3001 | 🔴 OFFLINE | Not deployed |
| PostgreSQL | 5432 | 🔴 OFFLINE | Standalone ready |

---

## System Dependencies

```
Irrig8
├── API (port 8001) — OFFLINE
├── Frontend (port 5174) — OFFLINE
├── PostgreSQL (port 5432) — OFFLINE
├── Edge Compute (`edge-compute/`) — OFFLINE
└── Satellite/Sensor Integration — UNVERIFIED

Agentic (Zoe)
├── Core Service — LIVE (zo.computer)
├── INBOX System — OPERATIONAL
├── Agent Workforce (25+) — OPERATIONAL
└── Zoe Project (`the-zoe-project/`) — ACTIVE

Valley Players Club
├── Platform — PLANNING
├── Legal Framework — DRAFTED
└── Cash Deposit System — ARCHITECTURE DONE
```

---

## Grant Pipeline

| Batch | Status | Notes |
|-------|--------|-------|
| BATCH-01-FED-US | Active | Federal grants |
| BATCH-03-STATE-CO | Active | Colorado state |
| BATCH-04-UK-EU | Active | International |
| BATCH-05-AFRICA-INTL | Active | Africa opportunities |
| BATCH-06-CANADA-FOUNDATIONS | Active | Canada + foundations |
| BATCH-07-FED-SBIR-EDA | Active | SBIR/EDA focused |
| BATCH-08-STATE-SBA-DOD | Active | State + SBA + DOD |


---

## Key Gaps & Risks

| Issue | Impact | Priority |
|-------|--------|----------|
| No unified dashboard/view across ventures | Low | P2 |
| Grant materials scattered across projects | Medium | P1 |
| Services disconnected, no single state | Medium | P1 |
| "the-ard-project" status unknown | Low | P2 |
| Real estate arbitrage project archived but not cleaned | Low | P2 |

---

## Tonight's Actions

- [x] Full workspace audit
- [x] Unified project manifest (this file)
- [ ] Grant folder structure consolidation
- [ ] Overnight sprint brief prepared

---

## Next Sprint: ON-2026-03-24

**Priority Items:**
1. Consolidate grant materials into `Bxthre3/grants/`
2. Create unified status dashboard
3. Verify all system dependencies are documented

---

**Report Generated:** 2026-03-23 16:25 UTC  
**Lead:** Drew (Evening Sprint EV-2026-03-23)
