
## 🟡 P2 | stub-finder | 2026-03-25 00:51 UTC

🔍 STUB FINDER REPORT — 2026-03-24

**FINDINGS:**

👻 PHANTOM EMPLOYEES (in org.ts, NOT in live API) — 19 agents:
  brodiblanco, jordan, alex, quinn, riley, sage, nico, blake, ira, skye, cameron, casey-lin, iris-park, quinn-taylor, riley-kim, taylor-brooks, blake-rivera, sage-williams, nico-anderson

❓ GHOST AGENTS (in live API, NOT in org.ts) — 9 agents:
  zoe, atlas, pulse, sentinel, iris, dev, sam, theo, raj

📦 ORPHANED INBOXES (active but untracked) — 12 agents:
  blueprint, palette, trench, deliver, reseller, scout, forecast, mold, research, integration-builder, trace, ledger

🤫 SILENT AGENTS (live API, no INBOX activity 7d) — 2 agents:
  atlas, vance

**ROOT CAUSE:** org.ts writes to /data/agentic/org/chart.json — that path does not exist. All 24 employees in org.ts are never loaded. The org.ts module is non-functional.

**RECOMMENDED ACTIONS:**
1. Fix data path in core/hierarchy/org.ts (change /data/agentic/org → /home/.z/agentic/org)
2. Run stub-finder.ts again post-fix to confirm resolution
3. Decide: canonical roster = org.ts (24) or live API (14) — pick ONE
