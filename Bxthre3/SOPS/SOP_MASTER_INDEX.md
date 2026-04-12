# SOP Master Index — Bxthre3 Inc & Agentic
**Version:** 1.0.0 | **Total SOPs Required:** 252

---

## Required SOP List

### Agentic System SOPs (5)
| SOP | Status | Assigned | Due |
|-----|--------|----------|-----|
| AGENT_LIFECYCLE_SOP.md | T-010 | zoe_orchestrator | 2026-03-30 |
| TASK_ROUTING_SOP.md | T-010 | zoe_orchestrator | 2026-03-30 |
| ESCALATION_SOP.md | T-010 | zoe_orchestrator | 2026-03-30 |
| HONEY_DO_HANDLING_SOP.md | T-010 | zoe_orchestrator | 2026-03-30 |
| GRADING_SOP.md | T-010 | zoe_orchestrator | 2026-03-30 |

### Specialist Agent SOPs (243)
| Domain | Count | Coverage |
|--------|-------|----------|
| Starting 5 x3 | 15 | OK |
| Finance x9 | 27 | OK |
| Legal x12 | 36 | OK |
| People x9 | 27 | OK |
| Engineering x9 | 27 | OK |
| Product x8 | 24 | OK |
| Sales x6 | 18 | OK |
| Marketing x6 | 18 | OK |
| Vertical x8 | 24 | OK |
| **TOTAL** | **243** | **3x coverage** |

---

## SOP Freshness Rules
- **All SOPs reviewed every 30 days**
- **Outdated SOPs = Blocked tasks**
- **No SOP = Cannot assign work**
- **SOP Hash logged for each task completion**

---

## Compliance Check
```bash
python3 /home/workspace/Bxthre3/SOPS/verify_sops.py --scan-all
# Expected: 252 SOPs found, all within 30 days
```
