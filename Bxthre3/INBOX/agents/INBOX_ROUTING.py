#!/usr/bin/env python3
"""
INBOX Routing Script — Bxthre3 Intra-Agent Communications
==========================================================

RULE: Every agent INBOX goes to its own file at INBOX/agents/<agent>.md
      ONLYBxthre3/INBOX.md goes to brodiblanco (canonical P0/P1 escalations)

Usage:
  python3 INBOX_ROUTING.py <agent_name> "<message>" [priority]

Priority levels:
  P0  — brodiblanco ONLY (service down, security breach, data loss)
  P1  — brodiblanco + responsible agent (needs human decision)
  P2  — Agent-to-agent, supervisor aware (blocker, handoff)
  P3  — Internal only (status, log, routine)

Routed by destination:
  → Bxthre3/INBOX.md        (P0/P1 only)
  → Bxthre3/INBOX/agents/  (agent-specific, all priorities)
  → Bxthre3/INBOX/departments/ (department-level, P2+)
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
}

KNOWN_AGENTS = ["maya", "raj", "casey", "drew", "theo", "taylor", "sam", "iris", "sentinel", "zoe"]
KNOWN_DEPTS = ["engineering", "product", "grants", "legal", "growth"]


def ensure_dirs():
    os.makedirs(AGENTS_DIR, exist_ok=True)
    os.makedirs(DEPTS_DIR, exist_ok=True)
    # Ensure canonical INBOX exists
    if not os.path.exists(CANONICAL_INBOX):
        with open(CANONICAL_INBOX, "w") as f:
            f.write("# INBOX — Canonical | Brodiblanco Only\n\n> **This is the ONLY INBOX that goes to brodiblanco.**\n\n---\n\n")


def route(agent_name, message, priority="P3", department=None):
    agent = agent_name.lower()
    prio = priority.upper()
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    tag = PRIORITY_PALETTE.get(prio, prio)

    entry = f"\n## {tag} | {agent} | {now}\n\n{message}\n"

    # Brodiblanco INBOX: P0 and P1 only
    if prio in ("P0", "P1"):
        ensure_dirs()
        with open(CANONICAL_INBOX, "a") as f:
            f.write(entry)
        # Also always to agent's own INBOX
        _write_agent_inbox(agent, entry)

    # Agent INBOX: all priorities
    else:
        _write_agent_inbox(agent, entry)

    # Department INBOX: if specified and P2+
    if department and prio in ("P0", "P1", "P2"):
        _write_dept_inbox(department.lower(), entry)

    print(f"ROUTED → [{prio}] {agent}{' (' + department + ')' if department else ''}")


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
