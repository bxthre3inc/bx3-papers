# AGENTS.md — Bxthre3 Workspace Memory Index

> **Last Updated:** 2026-03-24
> **Purpose:** Routing index — tells agents where to find and store information.

---

## Memory System

| Store | Location | What It Holds |
|---|---|---|
| **Supermemory** | `/home/.z/supermemory/` | Patterns, observations, preferences (structured + human-readable) |
| **Agent INBOXes** | `Bxthre3/INBOX/agents/` | One `.md` per agent — daily reports, escalations, hand-offs |
| **Department INBOXes** | `Bxthre3/INBOX/departments/` | One `.md` per dept — engineering, legal, grants, etc. |
| **Canonical INBOX** | `Bxthre3/INBOX.md` | **Only INBOX that goes to brodiblanco** — P1s, decisions needed |
| **Supermemory Index** | `/home/.z/supermemory/patterns.md` | Human-readable memory summary |

---

## Project Canonical Locations

| Project | Path | Description |
|---|---|---|
| **Irrig8** (primary — was FarmSense) | `Bxthre3/projects/the-irrig8-project/` | Precision agriculture OS, IoT irrigation |
| **Valley Players Club** | `Bxthre3/projects/the-valleyplayersclub-project/` | Sweepstakes gaming, cash-in-person |
| **The Starting 5** | `Bxthre3/the-starting5-project/` | AI co-founders SaaS |
| **ARD / Oferta** | `Bxthre3/projects/the-ard-project/` | 802 Morton St real estate arbitrage deal — branded as "Oferta" at `/offer` |
| **The Rain Project** | `Bxthre3/projects/the-rain-project/` | Arbitrage intelligence + notifications tool |

## Repo Structure

- **Meta-repo:** `bxthre3inc/bxthre3` — parent repo tracking all projects as submodules
- **6 Submodules (all on GitHub):**
  - `Bxthre3/projects/the-irrig8-project` → `bxthre3inc/irrig8`
  - `Bxthre3/projects/the-agentos-project` → `bxthre3inc/the-agentos-project`
  - `Bxthre3/projects/the-zoe-project` → `bxthre3inc/the-zoe-project`
  - `Bxthre3/projects/the-ard-project` → `bxthre3inc/the-ard-project`
  - `Bxthre3/projects/the-rain-project` → `bxthre3inc/the-rain-project`
  - `Bxthre3/projects/the-valleyplayersclub-project` → `bxthre3inc/the-valleyplayersclub-project`

---

## AgentOS / Zoe — The AI Workforce

AgentOS is Zoe — the AI workforce system. Zoe lives in two places:

| Layer | Location | Purpose |
|---|---|---|
| **Core AI identity** | `Bxthre3/projects/the-zoe-project/SOUL.md` | Zoe's personality, behavior, values |
| **Workforce INBOX** | `Bxthre3/INBOX/agents/` | Maya, Raj, Casey, Drew, Theo, Taylor, Sam, Iris, Sentinel, etc. |
| **Dashboard (wrapper)** | `Bxthre3/projects/the-agentos-project/` | Zo Site — `/aos` dashboard UI at `zo.space` |
| **Workforce status** | `/home/.z/employee-status/` | Live roster and agent health |

### Active Agents

Maya (CTO), Drew (COO), Raj (Grant Coordinator), Casey (Grant Coordinator), Theo (Field Systems), Taylor (Sales), Sam (Legal), Iris (Investor Relations), Sentinel (Security), Zoe (COO/Orchestrator)

### AgentOS Dashboard

Public URL: `https://brodiblanco.zo.space/aos`
Internal: `https://aos-brodiblanco.zocomputer.io`
API: `https://aos-brodiblanco.zocomputer.io/api/agentos/status`

---

## Architecture & Nesting Protocol

### Repo Topology

```
bxthre3inc/bxthre3.git          ← PARENT META-REPO (workspace root)
├── Bxthre3/                     ← WORKING DIRECTORY (AGENTS.md, INBOX/, agents/)
└── Bxthre3/projects/            ← ALL PROJECTS ARE PEER SUBMODULES
    ├── the-agentos-project.git   ← AgentOS dashboard wrapper
    ├── the-ard-project.git       ← ARD real estate deal
    ├── the-irrig8-project.git   ← Irrig8 (primary product)
    ├── the-rain-project.git      ← Rain arbitrage tool
    ├── the-valleyplayersclub-project.git
    └── the-zoe-project.git       ← Zoe/AgentOS core (SOUL.md, workforce)
```

### Why Nesting Is Forbidden

Nesting a `Bxthre3/` directory inside any project creates a circular reference loop:
- `bxthre3.git` → submodule `the-zoe-project.git` → nested `Bxthre3/` → contains another copy of all submodules
- This causes git to lose track of which commit is canonical, creates duplicate INBOX paths, and doubles storage
- **Historical damage:** `the-zoe-project` accumulated ~2GB of nested Bxthre3 artifacts before cleanup (2026-03-23)

### Golden Rules

1. **No `Bxthre3/` inside any project submodule.** Ever. Not even temporarily.
2. **Projects are peers, not children.** No project path under another project's path.
3. **Cross-project references via submodule dependency, not copy.** If Project A needs files from Project B, add Project B as a submodule inside Project A — not a copy of the whole meta-repo.

---

## INBOX Routing Rules

```
Any agent creates a report → Bxthre3/INBOX/agents/{agent-name}.md
Any department report       → Bxthre3/INBOX/departments/{dept}.md
P0/P1 escalations          → Bxthre3/INBOX.md  (+ SMS to brodiblanco)
Routine status             → Agent INBOX only (no alert)
```

**Canonical INBOX.md is the ONLY file that triggers SMS to brodiblanco.**

---

## Naming Conventions

- **Product name:** `Irrig8` (NOT FarmSense — that name is retired as of 2026-03-23)
- **AI assistant name:** `Zoe` (sounds like Joey) — NOT "Zoe the AI" or similar
- **ARD name:** `ARD` — not "Oferta" (Oferta was the 802 Morton St deal brand, now absorbed into ARD)
- **Firmware version:** `v2.1` (current)
- **Device codenames:** LRZ1, LRZ2, VFA, PMT, DHU, CSA (see `GLOSSARY.md`)
- **Agent codenames:** Maya, Raj, Casey, Drew, Theo, Taylor, Sam, Iris, Sentinel, Zoe

---

## Investor Deal Terms (Source of Truth)

- **Cash Partnership minimum:** 1% equity (10,000+ shares of VPC)
- **Regular investment partner:** Higher threshold than cash partnership — never conflate the two
- All pitch materials must reflect correct minimums per investor type

---

*This file is a routing index. For behavioral identity of Zoe, see `Bxthre3/projects/the-zoe-project/SOUL.md`.*
