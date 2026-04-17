#!/usr/bin/env python3
"""
INBOX Routing Script — Bxthre3 Intra-Agent Communications
==========================================================

TIERED ROUTING POLICY:
  Tier 0 (brodiblanco only) — P0/P1:
    - Service down, security breach, data loss
    - Cash/equity decisions, legal exposure, contracts
    - Verified P1 blockers requiring human decision
    → Routes to: Bxthre3/INBOX.md (→ SMS alert per rule)

  Tier 1 (Department Leads) — P2:
    - Blockers requiring lead judgment
    - Cross-agent handoffs with dependencies
    - Minor decisions with material impact
    → Routes to: Lead INBOX + department INBOX (no SMS)

  Tier 2 (Agent-level) — P3/P4:
    - Routine status updates, completions, FYIs
    - No decision required, no escalation needed
    → Routes to: Agent INBOX only (no notification)

Usage:
  python3 INBOX_ROUTING.py <agent_name> "<message>" [priority] [department]

Priority levels:
  P0  — brodiblanco ONLY (service down, security breach, data loss)
  P1  — brodiblanco + responsible agent (needs human decision)
  P2  — Agent-to-agent, supervisor aware (blocker, handoff)
  P3  — Internal only (status, log, routine)
  P4  — Fully delegated (FYI only)
"""

import os
import sys
import json
from datetime import datetime

INBOX_BASE = "/home/workspace/Bxthre3/INBOX"
CANONICAL_INBOX = "/home/workspace/Bxthre3/INBOX.md"
AGENTS_DIR = f"{INBOX_BASE}/agents"
DEPTS_DIR = f"{INBOX_BASE}/departments"

PRIORITY_PALETTE = {
    "P0": "🔴 P0",
    "P1": "🔴 P1",
    "P2": "🟡 P2",
    "P3": "🟢 P3",
    "P4": "⚪ P4",
}

# Department lead mapping — lead handles P2, routes to dept INBOX
DEPT_LEADS = {
    "engineering": "iris",
    "grants": "maya",
    "legal": "raj",
    "sales": "drew",
    "marketing": "casey",
    "operations": "atlas",
    "finance": "balance",
    "product": "roadmap",
}

# Known agents by department
KNOWN_DEPTS = list(DEPT_LEADS.keys())


def ensure_dirs():
    os.makedirs(AGENTS_DIR, exist_ok=True)
    os.makedirs(DEPTS_DIR, exist_ok=True)
    if not os.path.exists(CANONICAL_INBOX):
        with open(CANONICAL_INBOX, "w") as f:
            f.write("# INBOX — P0/P1 Only | brodiblanco\n\n> **This is the ONLY INBOX that triggers SMS alerts.**\n\n---\n\n")


def route(agent_name, message, priority="P3", department=None):
    agent = agent_name.lower()
    prio = priority.upper()
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    tag = PRIORITY_PALETTE.get(prio, prio)

    entry = f"\n## {tag} | {agent} | {now}\n\n{message}\n"

    # TIER 0 — P0/P1 → brodiblanco only
    if prio in ("P0", "P1"):
        ensure_dirs()
        with open(CANONICAL_INBOX, "a") as f:
            f.write(entry)
        _write_agent_inbox(agent, entry)
        print(f"TIER 0 → [{prio}] {agent} → brodiblanco INBOX + SMS")
        return

    # TIER 1 — P2 → Lead + Department
    if prio == "P2":
        _write_agent_inbox(agent, entry)
        if department and department.lower() in DEPT_LEADS:
            lead = DEPT_LEADS[department.lower()]
            if lead != agent:
                _write_agent_inbox(lead, entry)
            _write_dept_inbox(department.lower(), entry)
        print(f"TIER 1 → [{prio}] {agent} → agent INBOX + lead ({lead if department else 'n/a'})")
        return

    # TIER 2 — P3/P4 → Agent INBOX only, no notifications
    _write_agent_inbox(agent, entry)
    print(f"TIER 2 → [{prio}] {agent} → agent INBOX only")


def _write_agent_inbox(agent, entry):
    fpath = f"{AGENTS_DIR}/{agent}.md"
    with open(fpath, "a") as f:
        f.write(entry)


def _write_dept_inbox(dept, entry):
    fpath = f"{DEPTS_DIR}/{dept}.md"
    with open(fpath, "a") as f:
        f.write(entry)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    agent = sys.argv[1]
    message = sys.argv[2]
    priority = sys.argv[3] if len(sys.argv) > 3 else "P3"
    department = sys.argv[4] if len(sys.argv) > 4 else None

    ensure_dirs()
    route(agent, message, priority, department)


if __name__ == "__main__":
    main()
