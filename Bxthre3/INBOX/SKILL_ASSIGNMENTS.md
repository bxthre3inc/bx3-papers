# Skill Registry — AgentOS

Mapping agents to executable skills.

## Engineering Skills
| Agent | Primary Skill | Usage |
|-------|--------------|-------|
| dev | engineering-analysis | `python3 Skills/engineering-analysis/scripts/review.py --phase 1` |
| iris | engineering-analysis | Protocol architecture, BOM validation |
| taylor | engineering-analysis | Security audit tasks |

## Grant Skills
| Agent | Skill | Path |
|-------|-------|------|
| casey | grants-hq | `/home/workspace/Skills/grants-hq/` |

## Data/Monitoring Skills
| Agent | Skill | Description |
|-------|-------|-------------|
| insight | engineering-analysis | Model validation, datasets |
| pulse | Builtin | System health checks |
| sentinel | Builtin | Security scans |

## Phantom Engineers (Resurrect if needed)
| Role | Skill | Description |
|------|-------|-------------|
| Blueprint | engineering-analysis --phase 3 | PCB design, RF layout |
| Current | engineering-analysis --phase 2 | Power systems, load analysis |
| Spark | engineering-analysis --phase 3 | RF architecture, LoRa/LoRaWAN |
| Ground | engineering-analysis --phase 2 | Mechanical, enclosures, weatherproofing |
| Flux | engineering-analysis --phase 1 | Embedded firmware, edge logic |

## Usage Pattern

```bash
cd /home/workspace/Bxthre3/projects/the-irrig8-project
python3 Skills/engineering-analysis/scripts/review.py --phase {1-4}
```

Phases:
- 1: Protocol Architecture Lock
- 2: BOM Validation  
- 3: RF Coexistence Analysis
- 4: Documentation Harmonization
