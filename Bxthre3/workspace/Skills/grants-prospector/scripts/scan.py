#!/usr/bin/env python3
"""
Grants Prospector — Identifies grant opportunities for Bxthre3 ventures.
Usage: python3 scan.py <venture> [limit]
Venture: irriga8, rain, agentic, starting5, all
"""

import sys
import json
from datetime import datetime, timedelta

# ── Venture keyword maps ──────────────────────────────────────────────────────
KEYWORDS = {
    "irriga8": [
        "precision irrigation", "water conservation", "smart farming",
        "agricultural technology", "USDA SBIR", "DOE SBIR", "NRCS EQIP",
        "center pivot irrigation", "soil moisture sensors", "agtech",
    ],
    "rain": [
        "regulatory technology", "fintech", "compliance automation",
        "CDFI", "financial inclusion", "state licensing", "money transmission",
        "payment infrastructure", "banking desert", "revenue assurance",
    ],
    "agentic": [
        "AI agents", "autonomous systems", "open source AI",
        "NSF SBIR", "DARPA", "machine learning", "agentic AI",
        "LLM", "workflow automation", "software infrastructure",
    ],
    "starting5": [
        "sports technology", "athlete empowerment", "NBA", "WNBA",
        "NSF", "DOC", "youth sports", "athletic performance",
        "sports analytics", "player development",
    ],
}

# ── Mock funder database (replace with SAM.gov / Grants.gov API in production) ─
FUNDERS = {
    "usda_sbir": {
        "name": "USDA Small Business Innovation Research",
        "agency": "USDA", "type": "federal", "CfDA": "10.212",
    },
    "doe_sbir": {
        "name": "DOE Small Business Innovation Research",
        "agency": "DOE", "type": "federal", "CfDA": "81.049",
    },
    "nsf_sbir": {
        "name": "NSF Small Business Innovation Research",
        "agency": "NSF", "type": "federal", "CfDA": "47.041",
    },
    "nsf_solic": {
        "name": "NSF Directorate for Technology, Innovation and Partnerships",
        "agency": "NSF", "type": "federal", "CfDA": "47.041",
    },
    "darpa": {
        "name": "DARPA", "agency": "DoD", "type": "federal", "CfDA": "12.910",
    },
    "doc_ntia": {
        "name": "NTIA", "agency": "DOC", "type": "federal", "CfDA": "11.420",
    },
    "hhs_sbir": {
        "name": "HHS Small Business Innovation Research",
        "agency": "HHS", "type": "federal", "CfDA": "93.984",
    },
    "eda": {
        "name": "Economic Development Administration",
        "agency": "DOC", "type": "federal", "CfDA": "11.307",
    },
    "nifa": {
        "name": "USDA NIFA", "agency": "USDA", "type": "federal", "CfDA": "10.500",
    },
    "eps_corps": {
        "name": "EPSCoR RING", "agency": "NSF", "type": "federal", "CfDA": "47.083",
    },
    "cdfi": {
        "name": "CDFI Fund", "agency": "Treasury", "type": "federal", "CfDA": "21.000",
    },
    "sba_sttr": {
        "name": "SBA STTR", "agency": "SBA", "type": "federal", "CfDA": "59.051",
    },
    "dol workforce": {
        "name": "DOL Workforce Innovation",
        "agency": "DOL", "type": "federal", "CfDA": "17.720",
    },
    "colorado oedit": {
        "name": "Colorado OEDIT", "agency": "State of Colorado", "type": "state", "CfDA": None,
    },
    "csu_ventures": {
        "name": "CSU Ventures", "agency": "Colorado State University", "type": "academic", "CfDA": None,
    },
}

# ── Program definitions (funder_id → list of programs per venture) ───────────
PROGRAMS = {
    "irriga8": [
        {
            "id": "usda_sbir_p1", "funder": "usda_sbir",
            "name": "Phase I: Smart Irrigation Systems",
            "range": "$275,000", "duration": "8 months",
            "match_keywords": ["irrigation", "precision agriculture", "water conservation", "USDA SBIR"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "doe_sbir_energyeff", "funder": "doe_sbir",
            "name": "Energy Efficiency in Agriculture",
            "range": "$375,000", "duration": "2 years",
            "match_keywords": ["energy efficiency", "agriculture", "DOE SBIR", "water-energy"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "nifa_sbir", "funder": "nifa",
            "name": "Agricultural Technology Innovation",
            "range": "$325,000", "duration": "2 years",
            "match_keywords": ["agtech", "smart farming", "NIFA", "soil sensors"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "nrcs_eqip", "funder": "nifa",
            "name": "EQIP High Tunnel & Water Management",
            "range": "$50,000–$100,000", "duration": "1 year",
            "match_keywords": ["EQIP", "water conservation", "irrigation efficiency", "NRCS"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "csu_ventures_irriga8", "funder": "csu_ventures",
            "name": "San Luis Valley Ag Tech Pilot",
            "range": "$25,000–$75,000", "duration": "1 year",
            "match_keywords": ["San Luis Valley", "irrigation", "agtech", "Colorado"],
            "sbir_type": "academic", "phase": None,
        },
        {
            "id": "colorado_oedit_irriga8", "funder": "colorado oedit",
            "name": "Colorado Advanced Industries Accelerator",
            "range": "$25,000–$250,000", "duration": "1 year",
            "match_keywords": ["Colorado", "agtech", "water", "advanced industries"],
            "sbir_type": "state", "phase": None,
        },
    ],
    "rain": [
        {
            "id": "cdfi_tech", "funder": "cdfi",
            "name": "CDFI Technical Assistance",
            "range": "$100,000–$250,000", "duration": "1 year",
            "match_keywords": ["CDFI", "fintech", "financial inclusion", "compliance automation"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "eda_fintech", "funder": "eda",
            "name": "EDA Regional Innovation",
            "range": "$250,000–$500,000", "duration": "2 years",
            "match_keywords": ["fintech", "regulatory technology", "rural finance", "EDA"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "colorado_oedit_fintech", "funder": "colorado oedit",
            "name": "Colorado Fintech Sandbox",
            "range": "$20,000–$50,000", "duration": "6 months",
            "match_keywords": ["fintech", "Colorado", "regulatory", "payments"],
            "sbir_type": "state", "phase": None,
        },
    ],
    "agentic": [
        {
            "id": "nsf_sbir_ai", "funder": "nsf_sbir",
            "name": "NSF SBIR Phase I: AI Agent Infrastructure",
            "range": "$275,000", "duration": "8 months",
            "match_keywords": ["AI agents", "NSF SBIR", "LLM", "autonomous systems", "workflow automation"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "nsf_tip", "funder": "nsf_solic",
            "name": "NSF TIP: Agentic AI for Science",
            "range": "$1,000,000–$2,000,000", "duration": "3 years",
            "match_keywords": ["agentic AI", "NSF", "open source AI", "autonomous systems"],
            "sbir_type": "solicitation", "phase": None,
        },
        {
            "id": "darpa_ai", "funder": "darpa",
            "name": "DARPA AI Tools & Infrastructure",
            "range": "$1,000,000+", "duration": "3–5 years",
            "match_keywords": ["DARPA", "AI agents", "software infrastructure", "autonomous"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "doe_ai_agents", "funder": "doe_sbir",
            "name": "DOE AI for Science & Energy",
            "range": "$375,000–$1,500,000", "duration": "2–3 years",
            "match_keywords": ["DOE SBIR", "AI", "machine learning", "scientific computing"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "hhs_sbir_ai", "funder": "hhs_sbir",
            "name": "HHS SBIR: AI in Health Administration",
            "range": "$275,000", "duration": "8 months",
            "match_keywords": ["AI", "HHS", "healthcare", "workflow automation"],
            "sbir_type": "sbir", "phase": "I",
        },
    ],
    "starting5": [
        {
            "id": "doc_ntia_sports", "funder": "doc_ntia",
            "name": "NTIA Sports & Media Technology",
            "range": "$100,000–$500,000", "duration": "1–2 years",
            "match_keywords": ["sports technology", "DOC", "NTIA", "media"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "nsf_sports_sbirc", "funder": "nsf_sbir",
            "name": "NSF SBIR: Sports Performance Technology",
            "range": "$275,000", "duration": "8 months",
            "match_keywords": ["sports technology", "NSF SBIR", "athlete performance", "analytics"],
            "sbir_type": "sbir", "phase": "I",
        },
        {
            "id": "dol_youth_sports", "funder": "dol workforce",
            "name": "DOL Youth Sports Workforce Development",
            "range": "$250,000–$750,000", "duration": "2 years",
            "match_keywords": ["youth sports", "DOL", "workforce", "athletic development"],
            "sbir_type": "program", "phase": None,
        },
        {
            "id": "csu_ventures_starting5", "funder": "csu_ventures",
            "name": "CSU Sports Tech Innovation",
            "range": "$20,000–$50,000", "duration": "1 year",
            "match_keywords": ["sports analytics", "Colorado", "athlete empowerment"],
            "sbir_type": "academic", "phase": None,
        },
    ],
}

# ── Estimated deadlines ───────────────────────────────────────────────────────
TODAY = datetime.now()


def next_deadline(months_ahead: int) -> str:
    d = (TODAY + timedelta(days=months_ahead * 30)).replace(day=1)
    return d.strftime("%Y-%m-%d")


PROGRAM_DEADLINES = {
    "usda_sbir_p1": next_deadline(2),
    "doe_sbir_energyeff": next_deadline(3),
    "nifa_sbir": next_deadline(3),
    "nrcs_eqip": next_deadline(4),
    "csu_ventures_irriga8": next_deadline(1),
    "colorado_oedit_irriga8": next_deadline(2),
    "cdfi_tech": next_deadline(3),
    "eda_fintech": next_deadline(4),
    "colorado_oedit_fintech": next_deadline(1),
    "nsf_sbir_ai": next_deadline(3),
    "nsf_tip": next_deadline(6),
    "darpa_ai": next_deadline(5),
    "doe_ai_agents": next_deadline(3),
    "hhs_sbir_ai": next_deadline(2),
    "doc_ntia_sports": next_deadline(4),
    "nsf_sports_sbirc": next_deadline(3),
    "dol_youth_sports": next_deadline(5),
    "csu_ventures_starting5": next_deadline(1),
}


def score_program(program: dict, venture: str) -> int:
    """Score 1-10 based on keyword overlap with the venture's query."""
    query_kw = KEYWORDS.get(venture, [])
    prog_kw = program.get("match_keywords", [])
    if not query_kw or not prog_kw:
        return 5
    overlap = sum(1 for kw in prog_kw if any(kw.lower() in q.lower() or q.lower() in kw.lower() for q in query_kw))
    raw = min(10, int((overlap / len(prog_kw)) * 10) + 3)
    return raw


def format_row(program: dict, funder: dict, score: int) -> str:
    pid = program["id"]
    deadline = PROGRAM_DEADLINES.get(pid, "TBD")
    label = "🔴" if score >= 8 else "🟡" if score >= 6 else "🟢"
    return (
        f"  {label} [{score:02d}/10] {program['name']}\n"
        f"       Funder: {funder['name']} ({funder['agency']})\n"
        f"       Range: {program['range']} | Deadline: {deadline} | Duration: {program['duration']}\n"
        f"       Type: {program['sbir_type'].upper()} {program.get('phase', '') or 'Grant'}\n"
    )


def scan(venture: str, limit: int = 20) -> list[dict]:
    results = []
    ventures = list(PROGRAMS.keys()) if venture == "all" else [venture]

    for vent in ventures:
        programs = PROGRAMS.get(vent, [])
        for prog in programs:
            funder = FUNDERS.get(prog["funder"], {})
            score = score_program(prog, vent)
            results.append({
                "venture": vent,
                "program": prog,
                "funder": funder,
                "score": score,
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]


def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: python3 scan.py <venture> [limit]")
        print("Venture: irriga8, rain, agentic, starting5, all")
        sys.exit(1)

    venture = args[0].lower()
    limit = int(args[1]) if len(args) > 1 else 20

    valid = list(KEYWORDS.keys()) + ["all"]
    if venture not in valid:
        print(f"Unknown venture: {venture}")
        print(f"Valid: {', '.join(valid)}")
        sys.exit(1)

    results = scan(venture, limit)

    print(f"\n{'='*60}")
    print(f"  Grants Prospector — {venture.upper()}")
    print(f"{'='*60}")
    print(f"  Scanning {len(results)} opportunities...\n")

    for r in results:
        funder = r["funder"]
        prog = r["program"]
        score = r["score"]
        pid = prog["id"]
        deadline = PROGRAM_DEADLINES.get(pid, "TBD")
        label = "🔴" if score >= 8 else "🟡" if score >= 6 else "🟢"

        print(f"{label} [{score:02d}/10] {prog['name']}")
        print(f"   Funder: {funder.get('name','N/A')} ({funder.get('agency','N/A')})")
        print(f"   Range: {prog['range']} | Deadline: {deadline} | Duration: {prog['duration']}")
        print(f"   Type: {prog['sbir_type'].upper()} {prog.get('phase','') or 'Grant'} | Venture: {r['venture']}")
        print()

    print(f"Total: {len(results)} opportunities shown")
    print(f"\nAdd to pipeline: python3 Skills/grants-hq/scripts/grants-hq.py add <id> <venture> <name> <funder> <deadline> <amount>")


if __name__ == "__main__":
    main()
