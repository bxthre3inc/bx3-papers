# P0 Workspace Remediation Plan
**Created:** 2026-03-25
**Priority:** 🔴 P0 — All items must be resolved before any P1 work
**Estimated Total Time:** ~90 minutes

---

## SEQUENTIAL EXECUTION ORDER

> Each step must be verified complete before moving to the next. If a step fails, STOP and fix before proceeding.

---

## STEP 1 — P0.1: Rewrite `Bxthre3/README.md`
**Time:** ~10 min | **Risk:** Low | **Impact:** Foundation

### Pre-step verification
```bash
grep -c "Irrig8\|irrig8" /home/workspace/Bxthre3/README.md
grep -c "zoe-project" /home/workspace/Bxthre3/README.md
```

### Execute
Overwrite `Bxthre3/README.md` with the corrected version (see file end for full content). Key changes:
- Replace all `Irrig8` → `Irrig8`
- Remove `zoe` as standalone project (absorbed into Agentic — pending merge decision)
- Remove `Android-Native IDE` (renamed to Agentic Native)
- Remove `ADM Standard` (never shipped)
- Add all 11 current projects to the table
- Remove all old submodule references
- Remove `docs/` line item (doesn't exist)

### Post-step verification
```bash
grep -c "Irrig8\|irrig8" /home/workspace/Bxthre3/README.md
# Must return 0
grep "Irrig8\|irrig8" /home/workspace/Bxthre3/README.md
# Must return nothing
```

---

## STEP 2 — P0.2: Delete `Bxthre3/Bxthre3/` nested directory
**Time:** ~5 min | **Risk:** Low | **Impact:** Structure violation

### Pre-step verification
```bash
ls -la /home/workspace/Bxthre3/Bxthre3/
du -sh /home/workspace/Bxthre3/Bxthre3/
cat .gitmodules | grep -A2 "Bxthre3/Bxthre3"
```

### Execute (3 actions in sequence)

**2a — Remove the nested Bxthre3 directory from filesystem:**
```bash
rm -rf /home/workspace/Bxthre3/Bxthre3/
```

**2b — Remove the duplicate mcp-mesh submodule entry from `.gitmodules`:**
The current `.gitmodules` has BOTH:
```
[submodule "Bxthre3/Bxthre3/projects/mcp-mesh"]   ← DELETE THIS (nested)
[submodule "Bxthre3/projects/mcp-mesh"]            ← KEEP THIS
```
Edit `.gitmodules` to remove the `Bxthre3/Bxthre3/projects/mcp-mesh` entry.

**2c — Remove the nested submodule from git index:**
```bash
cd /home/workspace
git submodule deinit -f Bxthre3/Bxthre3/projects/mcp-mesh
git rm -f Bxthre3/Bxthre3/projects/mcp-mesh
```

### Post-step verification
```bash
ls /home/workspace/Bxthre3/Bxthre3/
# Must return: No such file or directory
cat .gitmodules | grep "Bxthre3/Bxthre3"
# Must return nothing
git submodule status | grep "Bxthre3/Bxthre3"
# Must return nothing
```

---

## STEP 3 — P0.3: Move loose APKs into project directories
**Time:** ~5 min | **Risk:** Low | **Impact:** Workspace hygiene

### Pre-step verification
```bash
ls -lh /home/workspace/Agentic-Native.apk
ls -lh /home/workspace/VPC-Native.apk
ls /home/workspace/Bxthre3/projects/the-agentic-native/ | grep apk
ls /home/workspace/Bxthre3/projects/the-valleyplayersclub-project/android-native/ | grep apk
```

### Execute

**3a — Move Agentic APK:**
```bash
mv /home/workspace/Agentic-Native.apk /home/workspace/Bxthre3/projects/the-agentic-native/Agentic-Native.apk
```

**3b — Move VPC APK:**
```bash
mv /home/workspace/VPC-Native.apk /home/workspace/Bxthre3/projects/the-valleyplayersclub-project/android-native/VPC-Native.apk
```

### Post-step verification
```bash
ls -lh /home/workspace/Bxthre3/projects/the-agentic-native/Agentic-Native.apk
ls -lh /home/workspace/Bxthre3/projects/the-valleyplayersclub-project/android-native/VPC-Native.apk
ls /home/workspace/*.apk
# Last command must return: No such file or directory
```

---

## STEP 4 — P0.4: Archive 29 orphaned agent INBOXes
**Time:** ~20 min | **Risk:** Medium | **Impact:** Noise reduction

### Pre-step verification
```bash
echo "Current agent INBOX count:"
ls /home/workspace/Bxthre3/INBOX/agents/*.md | wc -l
```

### Archive destination
`/home/workspace/Bxthre3/INBOX/agents/ARCHIVED/`

### Create archive directory
```bash
mkdir -p /home/workspace/Bxthre3/INBOX/agents/ARCHIVED
```

### Agents to archive (29 total)

| # | Agent | Reason |
|---|---|---|
| 1 | `architect.md` | Design agent — no active workload |
| 2 | `atlas.md` | One CCR log, stale |
| 3 | `blueprint.md` | Duplicate of Palette/Design scope |
| 4 | `brand.md` | Brand function absorbed by Press |
| 5 | `chronicler.md` | Archival function — no active logs |
| 6 | `forecast.md` | No content |
| 7 | `gavel.md` | Duplicate regulatory scope |
| 8 | `integration-builder.md` | No content |
| 9 | `irrig8.md` | Duplicate of field ops — Maya owns |
| 10 | `ledger.md` | Finance — function in Taylor/Erica |
| 11 | `mold.md` | No content |
| 12 | `navigate.md` | No content |
| 13 | `nexus.md` | No content |
| 14 | `palette.md` | Design — absorbed by Blueprint |
| 15 | `prospect.md` | No content |
| 16 | `pulse.md` | Duplicate status function |
| 17 | `rain.md` | Duplicate — RAIN is VPC team scope |
| 18 | `reel.md` | No content |
| 19 | `research.md` | No content |
| 20 | `reseller.md` | No content |
| 21 | `scout.md` | No content |
| 22 | `scout-qa.md` | No content |
| 23 | `stub-finder.md` | No content |
| 24 | `sync.md` | No content |
| 25 | `trace.md` | No content |
| 26 | `trench.md` | No content |
| 27 | `trenchbabys.md` | No content |
| 28 | `vector.md` | No content |
| 29 | `vault.md` | No content |
| + | `vpc.md` | VPC agent should route through drew |
| + | `water-court.md` | No content |

### Execute (batch move)
```bash
ARCHIVE="/home/workspace/Bxthre3/INBOX/agents/ARCHIVED"
cd /home/workspace/Bxthre3/INBOX/agents/

for agent in architect atlas blueprint brand chronicler forecast gavel integration-builder irrig8 ledger mold navigate nexus palette prospect pulse rain reel research reseller scout scout-qa stub-finder sync trace trench trenchbabys vector vault vpc water-court; do
  if [ -f "${agent}.md" ]; then
    mv "${agent}.md" "${ARCHIVE}/${agent}.md"
    echo "ARCHIVED: ${agent}.md"
  fi
done
```

### Update `INBOX_ROUTING.py` KNOWN_AGENTS
Edit `/home/workspace/Bxthre3/INBOX/agents/INBOX_ROUTING.py`:
```python
# Change:
KNOWN_AGENTS = ["maya", "raj", "casey", "drew", "theo", "taylor", "sam", "iris", "sentinel", "zoe"]
# To:
KNOWN_AGENTS = ["maya", "raj", "casey", "drew", "theo", "taylor", "sam", "iris", "sentinel", "zoe", "erica"]
```

Also add "corp-dev", "engineering", "finance", "grants", "legal" to `KNOWN_DEPTS`.

### Post-step verification
```bash
echo "Remaining agent INBOX count:"
ls /home/workspace/Bxthre3/INBOX/agents/*.md | wc -l
echo "---Remaining agents---"
ls /home/workspace/Bxthre3/INBOX/agents/*.md
echo "---Archived count---"
ls /home/workspace/Bxthre3/INBOX/agents/ARCHIVED/ | wc -l
```
**Expected remaining (13 files):**
`casey.md`, `drew.md`, `erica.md`, `INBOX_ROUTING.py`, `iris.md`, `maya.md`, `raj.md`, `sam.md`, `sentinel.md`, `taylor.md`, `theo.md`, `zoe.md`, `ARCHIVED/` (dir)

---

## STEP 5 — P0.5: Commit all 22 modified git files
**Time:** ~15 min | **Risk:** Medium | **Impact:** Git hygiene

### Pre-step verification
```bash
cd /home/workspace
git status --short | grep "^ M\|^ m" | wc -l
```

### Execute — 3 logical commits

**Commit 1 — INBOX state snapshot:**
```bash
cd /home/workspace
git add \
  Bxthre3/INBOX/agents/casey.md \
  Bxthre3/INBOX/agents/drew.md \
  Bxthre3/INBOX/agents/erica.md \
  Bxthre3/INBOX/agents/iris.md \
  Bxthre3/INBOX/agents/maya.md \
  Bxthre3/INBOX/agents/nexus.md \
  Bxthre3/INBOX/agents/raj.md \
  Bxthre3/INBOX/agents/sentinel.md \
  Bxthre3/INBOX/agents/theo.md \
  Bxthre3/INBOX/agents/zoe.md \
  Bxthre3/INBOX/agents/reseller.md \
  Bxthre3/INBOX/agents/scout-qa.md \
  Bxthre3/INBOX/departments/corp-dev.md \
  Bxthre3/INBOX/departments/engineering.md \
  Bxthre3/INBOX/departments/finance.md \
  Bxthre3/INBOX/departments/grants.md \
  Bxthre3/INBOX/departments/legal.md
git commit -m "chore(INBOX): snapshot agent and department state - $(date +%Y-%m-%d)"
```

**Commit 2 — Agent status updates:**
```bash
git add \
  Bxthre3/AGENTS.md \
  Bxthre3/INBOX.md \
  Bxthre3/agents/status/daemon.json \
  Bxthre3/agents/status/iris.json \
  Bxthre3/agents/status/pulse.json \
  Bxthre3/agents/status/sentinel.json
git commit -m "chore(agents): status updates and AGENTS.md refresh - $(date +%Y-%m-%d)"
```

**Commit 3 — P0 remediation (after Steps 1-4 complete):**
```bash
git add \
  Bxthre3/README.md \
  Bxthre3/P0_REMEDIATION_PLAN.md \
  Bxthre3/WORKSPACE_ASSESSMENT.md
git add Bxthre3/projects/the-agentic-native/Agentic-Native.apk
git add Bxthre3/projects/the-valleyplayersclub-project/android-native/VPC-Native.apk
git add Bxthre3/INBOX/agents/ARCHIVED/
git add Bxthre3/INBOX/agents/INBOX_ROUTING.py
git add .gitmodules
git add Bxthre3/Bxthre3  # deletion will be staged automatically
git commit -m "chore(workspace): P0 remediation - $(date +%Y-%m-%d)"
```

### Post-step verification
```bash
cd /home/workspace
git status --short | grep "^ M\|^ m" | wc -l
# Must return 0
```

---

## FINAL VERIFICATION CHECKLIST

After ALL steps complete, run this:

```bash
echo "=== P0 VERIFICATION ==="
echo ""
echo "1. README Irrig8 refs:"
grep -c "Irrig8\|irrig8" /home/workspace/Bxthre3/README.md
echo "2. Nested Bxthre3:"
ls /home/workspace/Bxthre3/Bxthre3/ 2>&1
echo "3. Loose APKs at root:"
ls /home/workspace/*.apk 2>&1
echo "4. Agent INBOX count:"
ls /home/workspace/Bxthre3/INBOX/agents/*.md 2>/dev/null | wc -l
echo "5. Archived agents:"
ls /home/workspace/Bxthre3/INBOX/agents/ARCHIVED/ 2>/dev/null | wc -l
echo "6. Git modified files:"
cd /home/workspace && git status --short | grep "^ M\|^ m" | wc -l
echo "7. .gitmodules nested entry:"
cat .gitmodules | grep "Bxthre3/Bxthre3"
```

All must return 0 or "no such file" before P0 is considered complete.

---

## NEW README.md CONTENT (Full replacement)

```
# Bxthre3 Inc — Projects

R&D Studio & Holdings company focused on Infrastructure, Agronomics, Recycling, and Robotics.

## Folder Structure

```
Bxthre3/
├── projects/           # All active R&D projects (each has its own folder)
├── INBOX/             # Intra-agent communications and escalations
├── agents/            # Agent definitions, status, and logs
├── docs/              # (reserved for cross-project documentation)
└── README.md          # This file
```

## Projects

Each project lives in its own folder under `projects/` following the naming convention `the-{project-name}-project/`. Prefixless folders (e.g., `mcp-mesh/`, `slv-mesh/`) are established internal projects.

| Project | Folder | Description | Status |
|---------|--------|-------------|--------|
| **Irrig8** | `the-irrig8-project/` | Precision Agriculture OS — deterministic irrigation operating system leveraging satellite, sensor, and API data | Active |
| **Valley Players Club** | `the-valleyplayersclub-project/` | Skills-and-slots sweepstakes gaming platform | Active |
| **RAIN** | `the-rain-project/` | Regulatory Arbitrage Intelligence Network — AI-powered compliance gap mapping | Beta Live |
| **Agentic** | `the-agentic-project/` | Mobile-first agentic computing platform | Active |
| **Agentic Native** | `the-agentic-native/` | Native Android APK for Agentic | Active |
| **MCP Mesh** | `mcp-mesh/` | MCP interoperability mesh protocol for agent communication | Active |
| **SLV Mesh** | `slv-mesh/` | San Luis Valley sensor mesh infrastructure | Pilot |
| **Zoe** | `the-zoe-project/` | Conversational AI interface (pending merge into Agentic) | Review |
| **Antigravity** | `the-antigravity-project/` | Purpose under review | Review |
| **ARD** | `the-ard-project/` | Purpose under review — no README | Review |
| **Trenchbabys** | `the-trenchbabys-project/` | Purpose under review — no README | Review |
| **Real Estate Arbitrage** | `the-realestate-arbitrage-project/` | Purpose under review — no README | Review |

## Project Status Definitions

- **Active:** Full development and operations underway
- **Beta Live:** Deployed and generating value, iterative improvements
- **Pilot:** Early-stage testing in controlled environment
- **Review:** Needs owner assignment and scope definition or archiving

## Project Conventions

- Each project folder should contain a `README.md` with project overview
- Route paths follow `/projects/{slug}` for public projects
- Private/internal projects may have custom routes
- APK outputs live inside their project directory (not at workspace root)

## Website

Public presence: [brodiblanco.zo.space](https://brodiblanco.zo.space)
- Homepage displays active project portfolio
- Investor portal at `/invest`
- Individual project pages at `/projects/{slug}`

## Brand Note

**Irrig8** is the canonical product name. Irrig8 was retired on 2026-03-23. All materials should reference Irrig8.

---

*Built by Bxthre3 Inc — Infrastructure, Agronomics, Recycling, Robotics*
```

---

*Plan by Press — 2026-03-25*
