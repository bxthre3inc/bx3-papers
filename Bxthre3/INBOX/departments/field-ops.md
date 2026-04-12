# Field Ops Department — Departmental INBOX

> **Lead:** Forge  
> **Reports to:** Atlas (Operations), Source (Supply Chain)  
> **Cadence:** Daily standup 8:15 AM MT

---

## Scope

| Vertical | Focus |
|----------|-------|
| **Irrig8** | VFA/LRZB/LRZN sensor deployment, SLV on-farm installation, pivot calibration, field maintenance, farmer training |
| **Valley Players Club** | Casino partner on-site support, hardware deployment |
| **Zoe Enterprise** | On-site implementation, developer training |

---

## Status — 2026-04-08

**Season:** April 2026 — Planting support mode (80% field / 20% office)  
**Days to typical first water:** ~21 days  
**Inventory:** 50 field units ready (per Source)  
**Deployments:** LRZ1, LRZ2 deployed; VFA/LRZB/LRZN pipeline needed

---

## Sensor Deployment Status

### VFA (Vertical Field Anchor)
| Spec | Value |
|------|-------|
| BOM Cost | $358.90 (1K+ volume) |
| Depth | 4-point: 10", 18", 25", 35", 48" |
| Accuracy | ±2% VWC |
| Deployment | 2-4 per field (wellhead, mid-field, edge) |
| MTBF | 80,000 hrs (9.1 yrs) |
| **Current** | **[TBD] — Pipeline needed** |

### LRZB (Lateral Root Zone Beacon)
| Spec | Value |
|------|-------|
| BOM Cost | $54.30 (10K+ volume) |
| Depth | Single configurable |
| Accuracy | ±2% VWC + ±0.5°C |
| Deployment | 4/field + 12 LRZN = 16 total nodes |
| MTBF | 60,000 hrs (6.8 yrs) |
| **Current** | **[TBD] — Pipeline needed** |

### LRZN (Lateral Root Zone Node)
| Spec | Value |
|------|-------|
| BOM Cost | $29.00 |
| Depth | Single configurable |
| Accuracy | ±3% VWC |
| Deployment | 12/field |
| **Current** | **[TBD] — Pipeline needed** |

### Legacy LRZ Units
| Unit | Status | Notes |
|------|--------|-------|
| LRZ1 | ✅ Deployed | — |
| LRZ2 | ✅ Deployed | — |
| LRZ3 | ⏳ Pending | Sensor availability |
| LRZ4 | ⏳ Pending | Sensor availability |

---

## Simulation Results — irrig8 Agent (2026-04-07)

**Production-Ready Correlations:**
| Correlation | R² | Inference Target |
|-------------|-----|------------------|
| moisture + temp → soil_temp | 0.933 | Soil temperature |
| moisture + temp → soil_moisture | 0.853 | Soil moisture (VMC) |
| moisture_texture | 0.904 | Soil texture class |

**Degradation Risk Under Noise:**
| Pair | Baseline R² | Noisy R² | Loss |
|------|-------------|----------|------|
| moisture+temp | 0.982 | 0.733 | **-25.4% 🔴** |
| temp+ec | 0.980 | 0.640 | **-34.7% 🔴** |

**Required Actions:**
- Deploy sensor redundancy to handle >5% noise
- Add thermal compensation for heat spike conditions (28-32°C)
- EC baseline calibration for SLV soil chemistry

---

## Valley Players Club

**Status:** Pre-launch

| Item | Status |
|------|--------|
| WY LLC formation | Pending |
| FL bond ($545) | Pending |
| NY bond ($545) | Pending |
| Compliance review | Pending |
| Player target | 50 by Month 3 |

**Hardware:** No deployment dates — waiting on LLC formation.

---

## Daily Standup — 2026-04-08

### 🚨 Blockers (P2)
| Blocker | Owner | Needed By |
|---------|-------|-----------|
| Farm intake / deployment pipeline | Atlas (Ops) | Today |
| VFA/LRZB/LRZN inventory count | Source (Supply Chain) | Today |
| No pilot farm identified | Forge + Atlas | This week |
| LRZ3/4 sensor availability | Source (Supply Chain) | This week |

### Key Hand-offs
- irrig8 → Simulation R² 0.933 ready for field validation
- VPC → Hardware on hold pending LLC
- Source → 50 field units ready; VFA/LRZB/LRZN spec hardware unconfirmed

**No P1 escalations.**

---

## Seasonal Operations

| Month | Activity | Allocation |
|-------|----------|------------|
| March | Pre-season prep | 100% field |
| **April** | **Planting support** | **80% field** |
| May | Early season | 60% field |
| June | Peak VRI | 40% field |
| July | Irrigation peak | 30% field |
| August | Late season | 40% field |
| September | Harvest prep | 70% field |
| October | Harvest / sled extract | 90% field |
| November | Sled Hospital | 100% workshop |
| December | Winter / R&D | 50% field |

---

*Field Ops INBOX — Updated 2026-04-08 08:20 AM MT*