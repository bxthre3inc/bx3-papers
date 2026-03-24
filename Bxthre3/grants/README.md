# Grant Pipeline — Bxthre3 Inc

**Last Updated:** 2026-03-24

---

## Active Batches

| Batch | File | Status |
|-------|------|--------|
| Federal US | `BATCH-01-FED-US.md` | Active |
| ESTCP | `ESTCP_SUBMISSION_FINAL.md` (v2.0, Irrig8 mgmt/) | **ACTIVE — REACTIVATED March 24** |
| State Colorado | `BATCH-03-STATE-CO.md` | Active |
| UK/EU | `BATCH-04-UK-EU.md` | Active |
| Africa/International | `BATCH-05-AFRICA-INTL.md` | Active |
| Canada/Foundations | `BATCH-06-CANADA-FOUNDATIONS.md` | Active |
| SBIR/EDA | `BATCH-07-FED-SBIR-EDA.md` | Active |
| State/SBA/DOD | `BATCH-08-STATE-SBA-DOD.md` | Active |

---

## ESTCP Reactivation (March 24, 2026)

ESTCP was **suspended March 23** due to accuracy concerns. It has been **reactivated March 24** after revalidation by Pulse (System Health Monitor).

### What Was Fixed

1. **Accuracy Claims**: MAPE/R² reframed from "verified data" to "engineering projections" — no field data exists yet (deployment May 2026)
2. **Digital Workforce Added**: Section 4 + supporting evidence doc quantify AgentOS 25+ agents, 1:4+ human-to-network ratio
3. **Document Status**: All claims now accurately represent current state of development

### ESTCP Package Location

Primary: `Bxthre3/projects/the-irrig8-project/docs/management/ESTCP_SUBMISSION_FINAL.md` (v2.0)

Supporting:
- `ESTCP_AGENTOS_WORKFORCE.md` — Digital workforce evidence
- `ESTCP_FIELD_VALIDATION_PROTOCOL_NITRATE.md` — Gap #1
- `ESTCP_CYBERSECURITY_RISK_ASSESSMENT.md` — Gap #3
- `ESTCP_PHASE2_BACKUP_SLIDE.md` — Phase 2 roadmap
- `ESTCP_SPECTROSCOPY_DECISION.md` — Engineering decision log

---

## Folder Structure

```
grants/
├── BATCH-01-FED-US.md          # Active
├── BATCH-03-STATE-CO.md        # Active
├── BATCH-04-UK-EU.md           # Active
├── BATCH-05-AFRICA-INTL.md    # Active
├── BATCH-06-CANADA-FOUNDATIONS.md
├── BATCH-07-FED-SBIR-EDA.md
├── BATCH-08-STATE-SBA-DOD.md
├── PIPELINE_INDEX.md          # Master index
├── pipeline.csv               # Structured data
├── pipeline_300plus.duckdb    # Queryable database
├── templates/                 # Reusable templates
│   └── README.md
└── archive/
    └── ESTCP-suspended/        # Pre-March 24 materials (superseded)
```

---

## Next Steps

- [ ] Submit ESTCP by March 26 deadline
- [ ] Confirm Zo Space / Irrig8 demo is operational for reviewers
- [ ] Update BATCH-01-FED-US.md with new Irrig8/AgentOS branding
- [ ] Audit all active batches for FarmSense → Irrig8 rebrand completeness

---

**Decision (March 24, 2026):** ESTCP reactivated with corrected accuracy claims and new digital workforce section. Ready for submission.
