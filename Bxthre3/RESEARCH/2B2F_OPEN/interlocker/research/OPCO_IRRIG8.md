# OpCo Capability Audit — Irrig8

## Overview
Precision agriculture OS for center-pivot irrigation in Colorado's San Luis Valley.

## Data Sources
| Source | Type | Frequency | Volume |
|--------|------|-----------|--------|
| Planet Labs | Satellite imagery | Daily | ~2GB/day |
| Sentinel-2 | Satellite imagery | 5-day revisit | ~500MB/day |
| Soil sensors | Ground telemetry | Hourly | ~50MB/day |
| Weather stations | Meteorological | 15-min | ~10MB/day |
| Flow meters | Irrigation data | Real-time | ~100MB/day |

## Technical Architecture
- **Database**: DuckDB for analytics, SQLite for edge
- **AI Stack**: TensorFlow Lite, on-device inference
- **API**: REST endpoints, JWT auth
- **Edge**: Raspberry Pi gateways, LoRaWAN backhaul

## Shared Services Potential
| Service | Current State | Integration Readiness |
|---------|---------------|----------------------|
| Cloud hosting | Self-managed | High — move to shared |
| User auth | Custom | Medium — needs OAuth2 |
| Data lake | Isolated | High — unified schema |
| AI training | Local | Medium — needs Zoe |

## Synergy Vectors
1. **Data → Zoe**: Field telemetry trains agriculture domain model
2. **AI ← Agentic**: Use multi-agent orchestration for complex decisions
3. **Distribution → VPC**: Shared Valley retail presence

## GDP Attribution Model
- Direct: Water savings → farmer profit
- Indirect: Data licensing → platform revenue
- Network: Zoe agriculture capabilities → new sectors

---
*Audit Date: 2026-04-01*
*Auditor: INTERLOCKER*
