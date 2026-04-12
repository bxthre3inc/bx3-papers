---
name: grants-prospector
description: Identifies grant opportunities for Bxthre3 ventures (Irrig8, RAIN, Agentic, Starting5) across federal, state, and private funders. Run before grants-hq to populate the pipeline. Use after reviewing the opportunity landscape.
compatibility: Created for Zo Computer
metadata:
  author: brodiblanco.zo.computer
---

# Grants Prospector

Identifies grant opportunities for Bxthre3 ventures.

## Ventures & Keywords

| Venture | Keywords |
|---------|----------|
| Irrig8 | irrigation, precision agriculture, water conservation, smart farming, USDA, NSF SBIR, DOE SBIR |
| RAIN | regulatory arbitrage, fintech, compliance automation, CDFI, state licensing |
| Agentic | AI agents, autonomous systems, open source AI, NSF SBIR, DARPA |
| Starting5 | sports tech, athlete empowerment, NBA, WNBA, NSF, DOC |

## Commands

Run via: `python3 /home/workspace/Skills/grants-prospector/scripts/scan.py <venture> [limit]`

Arguments:
- `venture` — irrig8, rain, agentic, starting5 (or `all`)
- `limit` — max results to return (default: 20)

Output: list of prospective grants with funder, program name, estimated range, deadline, and match score.

## Workflow

1. Run prospector for a venture: `python3 Skills/grants-prospector/scripts/scan.py irrig8`
2. Review results; shortlist promising opportunities
3. Add to pipeline via grants-hq: `python3 Skills/grants-hq/scripts/grants-hq.py add <id> <venture> <name> <funder> <deadline> <amount>`

## Related

- `Skills/grants-hq/` — manages the grants pipeline
- `Bxthre3/grants/` — records, templates, and funder research
