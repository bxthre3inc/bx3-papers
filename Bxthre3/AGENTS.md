# AGENTS.md — Bxthre3 Workspace Memory Index

> **Last Updated:** 2026-03-23
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

| Project | Path |
|---|---|
| **Irrig8** (primary — was FarmSense) | `Bxthre3/projects/the-irrig8-project/` |
| **AgentOS / Zoe** | `Bxthre3/projects/the-agentos-project/` |
| **The Zoe Project** | `Bxthre3/projects/the-zoe-project/` |
| **Valley Players Club** | `Bxthre3/projects/the-valleyplayersclub-project/` |
| **The ARD Project** (was Oferta) | `Bxthre3/projects/the-ard-project/` |
| **The Rain Project** | `Bxthre3/projects/the-rain-project/` |
| **The Starting 5** | `Bxthre3/the-starting5-project/` |
| **Zo Space** | `zo.space` (managed, not filesystem) |
| **MCP Mesh** | `Bxthre3/projects/mcp-mesh/` |

## Repo Structure

- **Meta-repo:** `bxthre3inc/bxthre3` — parent repo tracking all projects as submodules
- **7 Submodules (all on GitHub):**
  - `Bxthre3/projects/mcp-mesh` → `bxthre3inc/mcp-mesh`
  - `Bxthre3/projects/the-irrig8-project` → `bxthre3inc/irrig8`
  - `Bxthre3/projects/the-agentos-project` → `bxthre3inc/the-agentos-project`
  - `Bxthre3/projects/the-zoe-project` → `bxthre3inc/the-zoe-project`
  - `Bxthre3/projects/the-ard-project` → `bxthre3inc/the-ard-project`
  - `Bxthre3/projects/the-rain-project` → `bxthre3inc/the-rain-project`
  - `Bxthre3/projects/the-valleyplayersclub-project` → `bxthre3inc/the-valleyplayersclub-project`

---

## Architecture & Nesting Protocol

### Repo Topology

```
bxthre3inc/bxthre3.git          ← PARENT META-REPO (workspace root)
├── Bxthre3/                     ← WORKING DIRECTORY (AGENTS.md, INBOX/, agents/)
└── Bxthre3/projects/            ← ALL PROJECTS ARE PEER SUBMODULES
    ├── the-agentos-project.git
    ├── the-ard-project.git
    ├── the-irrig8-project.git
    ├── the-valleyplayersclub-project.git
    └── the-zoe-project.git
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

### How to Add a New Project

```
1. Create the repo on GitHub under bxthre3inc/
2. In the parent bxthre3 repo (workspace root):
   git submodule add https://github.com/bxthre3inc/{new-project}.git \
     Bxthre3/projects/{new-project}
3. Commit and push from workspace root
4. Add canonical path to the table above
```

### About the-rain-project

`the-rain-project.git` is an arbitrage intelligence and notifications tool — distinct from the meta-repo structure. Its actual purpose is arbitrage signal processing and alerting, not god-view project tracking. The `Bxthre3/` nested inside it (now removed) was an accidental copy of the meta-repo, not part of its intentional design.

---

*Last updated: 2026-03-23 — Protocol established after nesting cleanup.*

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

## Active Agent Roster

See: `/home/.z/employee-status/EMPLOYEE_ROSTER.md`

---

*This file is a routing index. For behavioral identity, see `Bxthre3/projects/the-zoe-project/SOUL.md`.*
