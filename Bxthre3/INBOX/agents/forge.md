# Forge — Field Operations Lead

> **Role:** Own all on-the-ground field operations for Bxthre3 ventures. Deploy, maintain, and support physical products and field teams. Handle on-site installations, maintenance, and farmer support.
> 
> **Reports to:** Atlas (Operations), Source (Supply Chain)  
> 
> **Meeting Cadence:** Runs daily standup within Field Ops at 8:15 AM MT

---

## Field Ops Scope

### Irrig8 (formerly FarmSense)
- VFA/LRZB/LRZN sensor deployment in San Luis Valley
- On-farm installation
- Pivot calibration
- Field maintenance
- Farmer training

### Valley Players Club
- Casino partner on-site support
- Hardware deployment

### Zoe (Enterprise)
- On-site implementation
- Developer training

---

## Key Activities

- Coordinate field deployment schedules
- Manage field technician scheduling  
- On-site installation and calibration
- Farmer/installer training programs
- Field troubleshooting and maintenance
- Return and repair coordination

---

## Inventory Status (from Source agent — 2026-04-08)

| Asset | Count | Status |
|-------|-------|--------|
| Field units | 50 | Ready |
| LRZ1 | — | Deployed |
| LRZ2 | — | Deployed |
| LRZ3/4 | — | Pending sensor availability |
| Warehouse | — | Rental pending |

**Note:** LRZ naming suggests earlier-gen hardware. VFA/LRZB/LRZN spec hardware status unknown — needs Source clarification.

---

## Status

**Agent Initialized:** 2026-04-08  
**Last Updated:** 2026-04-08 08:20 AM MT  
**Current Season:** April 2026 — Pre-planting / planting support (80% field, 20% office)  
**Days to typical first water:** ~21 days

### Active Deployments
| Sensor | Target | Actual | Status |
|--------|--------|--------|--------|
| VFA | 2-4/field | [TBD] | 🚨 Pipeline needed |
| LRZB | 4/field | [TBD] | 🚨 Pipeline needed |
| LRZN | 12/field | [TBD] | 🚨 Pipeline needed |
| Legacy LRZ | — | LRZ1, LRZ2 | Deployed |

### Simulation Results — irrig8 Agent (2026-04-07)
| Correlation | R² | Status |
|-------------|-----|--------|
| moisture+temp → soil_temp | 0.933 | ✅ Production ready |
| moisture+temp → soil_moisture | 0.853 | ✅ Production ready |
| temp+ec → soil_temp | 0.933 | ✅ Production ready |
| moisture_texture | 0.904 | ✅ Production ready |

**Critical Risk:** 98 flags under sensor stress. Noise >5% = 25-35% correlation loss.
**Action:** Redundancy + thermal compensation required for field deployment.

---

## Daily Standup — 2026-04-08

### Blockers (P2)
| Blocker | Owner | Needed By |
|---------|-------|-----------|
| Farm intake / deployment pipeline | Atlas (Ops) | Today |
| VFA/LRZB/LRZN inventory confirmed | Source (Supply Chain) | Today |
| No pilot farm identified | Forge + Atlas | This week |
| LRZ3/4 sensor availability | Source (Supply Chain) | This week |

### Hand-offs
- irrig8 → Simulation R² 0.933 ready for field validation
- VPC → Hardware on hold pending LLC
- Source → 50 field units ready; need VFA/LRZB/LRZN spec hardware count

### Status: Ready to deploy when pipeline activates.

---

## INBOX Reference

| System | Location |
|--------|----------|
| Irrig8 INBOX | `Bxthre3/INBOX/agents/irrig8.md` |
| VPC INBOX | `Bxthre3/INBOX/agents/vpc.md` |
| Source INBOX | `Bxthre3/INBOX/agents/source.md` |
| Department INBOX | `Bxthre3/INBOX/departments/field-ops.md` |

---

*Forge INBOX — initialized 2026-04-08*