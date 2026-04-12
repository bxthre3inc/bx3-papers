---
name: grants-hq
description: Grants pipeline management for Bxthre3 Inc. Track prospects, manage writing stages, submit applications, and record outcomes across all ventures (Irrig8, RAIN, Agentic, Starting5). Use after grants-prospector has identified opportunities.
compatibility: Created for Zo Computer
metadata:
  author: brodiblanco.zo.computer
---

# Grants HQ

Manages the Bxthre3 grants pipeline via `pipeline.csv`.

## Pipeline File

`/home/workspace/Bxthre3/grants/pipeline.csv`

Fields: `id, venture, grant_name, funder, deadline, amount_requested, status, stage, gfs_score, notes, created_date, last_updated`

## Commands

Run via: `python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py <command>`

Available commands:
- `report` — Full pipeline summary (total, by stage, by venture)
- `stage <STAGE>` — List grants in a specific stage (PROSPECT, SHORTLIST, WRITING, SUBMITTED, AWARDED, REJECTED, ARCHIVED)
- `add <id> <venture> <grant_name> <funder> <deadline> <amount>` — Add a new grant
- `update <id> <field> <value>` — Update a grant field
- `next` — Show next action items (upcoming deadlines, WRITING stage grants)

## Stages

1. **PROSPECT** — Identified, not yet evaluated
2. **SHORTLIST** — Passed initial filter, worth pursuing
3. **WRITING** — Active proposal writing
4. **SUBMITTED** — Application filed
5. **AWARDED** — Funded
6. **REJECTED** — Not funded
7. **ARCHIVED** — Dead or superseded

## Usage Examples

```bash
# Get full pipeline summary
python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py report

# Show grants in WRITING stage
python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py stage WRITING

# Show what to do next
python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py next

# Add a new grant
python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py add IRR-003 Irrig8 "USDA SBIR Phase II" USDA 2026-09-30 250000

# Update a grant stage
python3 /home/workspace/Skills/grants-hq/scripts/grants-hq.py update IRR-002 stage WRITING
```

## Reports

Reports are generated on demand. For automated daily digest, set up a scheduled agent.

## Related

- `Skills/grants-prospector/` — Identifies grant opportunities
- `Bxthre3/grants/records/` — Award letters, submitted applications, funder correspondence
- `Bxthre3/grants/templates/` — Proposal templates by grant type
