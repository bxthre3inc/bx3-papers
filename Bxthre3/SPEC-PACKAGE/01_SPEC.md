# Agentic — Product Specification v6.0
**Lock Version:** 6.0.0
**Lock Date:** 2026-03-26
**Owner:** brodiblanco (CEO), Engineering Lead (Iris)
**Status:** FROZEN — No feature drift permitted until v6.1 or explicit override by brodiblanco

---

## 1. Purpose

This document locks Agentic v6.0 as the canonical, immutable baseline for all current clients and future development. It exists to prevent feature drift, eliminate version fragmentation, and give every agent and developer a single document to test against.

> *"The story you don't tell is one someone else tells for you."* — Press

If something is not in this spec, it does not ship in v6. If a feature is in this spec and missing from the implementation, that is a **P1 defect** and must be fixed.

---

## 2. Version Architecture

### 2.1 Single Source of Truth

All version references **must** derive from the live API response at `GET /api/agentic/status`:

```json
{
  "version": "6.0.0",
  "status": "operational",
  ...
}
```

**There is exactly one canonical version string.** No secondary version constants anywhere in the codebase may differ from this value.

### 2.2 Version Ownership Chain

```
API server (server.ts)
  └─ must respond: "version": "6.0.0" at /api/agentic/status
      │
      ├─ Android App (com.bxthre3.agentic package)
      │     └─ displays version from API response
      │     └─ filename: Agentic-6.0.0-release.apk
      │
      ├─ Web Client (/agentic)
      │     └─ reads from /api/agentic/status
      │
      └─ All future clients
            └─ must fetch version from API — no hardcoding
```

### 2.3 Hardcoded Version Constants — FROZEN

| File | Old Value | Correct Value | Status |
|---|---|---|---|
| `server.ts` (root) | `"4.1.0"` | `"6.0.0"` | **MUST FIX** — P1 |
| `config-loader.ts` | `version: string` | Must be `"6.0.0"` | Implement from API |
| APK filename | `Agentic-Native-debug-5.0.2.apk` | `Agentic-6.0.0-release.apk` | Next build |
| Android `package` | `com.agenticnative` | `com.bxthre3.agentic` | **MUST FIX** — next release |

---

## 3. Client Specification

### 3.1 Android Native App

**Package name:** `com.bxthre3.agentic`

**APK naming convention:** `Agentic-{VERSION}-{BUILD_TYPE}.apk`
- Example: `Agentic-6.0.0-release.apk`
- Debug builds include the date: `Agentic-6.0.0-debug-20260326.apk`

**Base URL:** `https://brodiblanco.zo.space/api/agentic/`

**Screens (10 tabs, exact order):**

1. **Dashboard** — System health, active agents count, queue depth, escalation count, uptime, disk usage, known issues
2. **Workforce** — All agents listable by department, searchable by name/role, filterable by status
3. **Depts** — Department cards showing head, agent count, active projects, escalation badges
4. **Queue** — Work queue items with priority (P1/P2/P3), agent assignment, status, blockers
5. **Integrations** — Connected services: Gmail, Calendar, Tasks, Drive, Notion, Airtable, Linear, Spotify, Dropbox, Stripe; shows connection status and last sync timestamp
6. **Escalations** — P1 items (red), P2 items (amber); shows agent, issue description, hours open, status
7. **Starting 5** — AI co-founder archetypes: name, archetype, specialty, current focus, top 3 metrics
8. **Reports** — Sprint history (velocity, blocker rate, avg cycle), workforce report for current cycle
9. **Projects** — Active ventures: Irrig8, Valley Players Club, The Starting 5, ARD Project, Rain, Agentic
10. **Settings** — Notification toggles (P0/P1, daily digest, weekly report, standups), display toggles (agent IDs, dept colors, health scores, protocol counts), About card

**Status color mapping:**

| Status | Color |
|---|---|
| `ACTIVE` / `AWAKENED` | Accent (green) |
| `AWAKE_PROCESSING` | Accent |
| `MONITORING` / `WORKING` | Sky blue |
| `STANDBY` | Gray |
| `IDLE` / `OFFLINE` | Red |
| `COMPLETE` | Emerald |

**Department colors:**

| Department | Color |
|---|---|
| Engineering | Accent (green) |
| Operations | Sky blue |
| Grants | Violet |
| Finance | Emerald |
| Sales | Amber |
| Legal | Red |
| Marketing | Pink |
| Product | Cyan |
| Security | Lime |
| Strategy | Orange |
| Compliance | Indigo |
| HR | Teal |
| Funding | Rose |
| Integrations | Purple |

### 3.2 Web Client (`/agentic`)

**Route:** `https://brodiblanco.zo.space/agentic` (private, auth required)

**Tabs (6):** Status, Agents, Tasks, Org Chart, Starting 5, Integrations

**Requirements:**
- All data fetched live from API endpoints — no stale local state
- Version shown in footer: "Agentic v6.0.0"
- Graceful degradation if API is unreachable (show last-known state + warning banner)

### 3.3 API Endpoints (all on `https://brodiblanco.zo.space/api/agentic/`)

| Endpoint | Returns |
|---|---|
| `GET /status` | version, status, agentCount, activeAgents, workQueueDepth, escalationCount, uptime, diskUsage, avgHealth, knownIssues |
| `GET /agents` | All agents: id, name, role, department, status, completionRate, activeTasks, email, lastSeen, avatar, type, skills, tools, shifts, colleagues |
| `GET /tasks` | All tasks: id, title, priority, status, assignedAgent, createdAt, updatedAt, blockers |
| `GET /org` | Org chart: id, name, role, department, reportsTo, directReports, headCount |
| `GET /workforce/metrics` | workforce metrics: totalAgents, activeToday, avgCompletionRate, topPerformers, departments |
| `GET /depts` | Departments: name, head, agents[], activeProjects[], escalationCount |
| `GET /integrations` | Integrations: name, status, lastSync, icon, actions[] |
| `GET /escalations` | Escalations: priority, agent, issue, hoursOpen, status |
| `GET /starting5` | Starting 5: name, archetype, specialty, currentFocus, metrics{} |
| `GET /projects` | Projects: name, status, description, lastUpdated |

---

## 4. Data Contract — Non-Negotiable Rules

### 4.1 Agent Roster (Canonical: 19 entities)

```
18 AI agents + 1 human (brodiblanco)
```

| ID | Name | Role | Department | Type |
|---|---|---|---|---|
| brodiblanco | brodiblanco | Founder & CEO | Executive | human |
| zoe | Zoe Patel | Executive Agent | Executive | ai |
| atlas | Atlas | Operations Agent | Operations | ai |
| vance | Vance | Executive Agent | Executive | ai |
| pulse | Pulse | People Ops | Operations | ai |
| sentinel | Sentinel | System Monitor | Operations | ai |
| iris | Iris | Engineering Lead | Engineering | ai |
| dev | Dev | Backend Engineer | Engineering | ai |
| sam | Sam | Data Analyst | Engineering | ai |
| taylor | Taylor | Security Engineer | Engineering | ai |
| theo | Theo | DevOps Engineer | Engineering | ai |
| casey | Casey | Marketing Lead | Marketing | ai |
| maya | Maya | Grant Strategist | Grants | ai |
| raj | Raj | Legal & Compliance | Legal | ai |
| drew | Drew | Sales Lead | Sales | ai |
| irrig8 | Irrig8 Field Agent | Field Operations | Operations | ai |
| rain | RAIN | Regulatory Intelligence | Strategy | ai |
| vpc | VPC Agent | Gaming Operations | Operations | ai |
| trenchbabys | Trenchbabys Agent | Retail Operations | Sales | ai |

**No fictional names.** The Arkad employee roster from ORG-CHART.md (v3.0, 2026-03-23) is **deprecated** and must not be used as live data.

### 4.2 Task Status Values

Only these exact strings are valid:

```
TODO | IN_PROGRESS | BLOCKED | DONE
```

### 4.3 Priority Values

Only these exact strings are valid:

```
P0 | P1 | P2 | P3
```

### 4.4 Agent Status Values

Only these exact strings are valid:

```
ACTIVE | IDLE | OFFLINE | ERROR
```

(Mapping from legacy API strings to these canonical values must happen server-side. Clients receive only canonical values.)

---

## 5. Behavioral Identity

From `SOUL.md` (incorporated here as a binding contract):

### 5.1 Core Principles

1. **Be Direct. No Noise.** — No filler, no preamble. Say what is broken.
2. **Execute to Completion** — "Half done" is not done.
3. **Canonical Always** — Names, numbers, and terms are never details.
4. **Ship With Integrity** — No public placeholders. Test what you deploy.
5. **Protect Data Like It's the Business** — Backup failures are P1.
6. **Communicate With Precision** — Right info, right agent, right time.

### 5.2 INBOX Routing (binding for all agents)

```
Agent report          → Bxthre3/INBOX/agents/{agent-name}.md
Escalation P1         → Bxthre3/INBOX.md (→ brodiblanco via SMS)
Department report     → Bxthre3/INBOX/departments/{dept}.md
```

### 5.3 Non-Negotiable Rules

- **Irrig8 is canonical** — FarmSense retired 2026-03-23. Never reintroduce.
- **No nested Bxthre3/** — project directories are flat peers.
- **P0/P1 to brodiblanco only** — everything else routes through agent/department system.
- **Backup before destructive operations.**
- **Public = built** — no public-facing routes that are placeholders.

---

## 6. Stability Requirements

### 6.1 Zero Regression Policy

**v6.0 is frozen.** The following are **permanently blocked** without explicit brodiblanco approval:

- Adding new API endpoints not defined in §3.3
- Removing existing API endpoints
- Changing field names or types in any API response schema
- Adding new agent statuses outside the 4 canonical values (§4.4)
- Adding new task statuses outside the 4 canonical values (§4.3)
- Changing the agent roster (19 entities is locked)
- Changing any department name or color mapping (§3.1)
- Changing the package name or APK naming convention

### 6.2 Version Increment Protocol

| Change Type | Increment |
|---|---|
| Bug fix, patch, no schema change | `6.0.1` → `6.0.2` |
| New optional feature, backwards-compatible | `6.1.0` |
| Schema change, breaking or new required field | `7.0.0` |
| New client (e.g., iOS app) | `6.x.0` + client qualifier |

**Version jump to 7.0.0 requires brodiblanco sign-off.**

### 6.3 Pre-Build Checklist (run before any APK or deploy)

- [ ] `GET /api/agentic/status` returns `"version": "6.0.0"`
- [ ] All 10 API endpoints (§3.3) return valid JSON
- [ ] Agent roster shows exactly 19 entities (§4.1)
- [ ] Agent statuses are only `ACTIVE | IDLE | OFFLINE | ERROR`
- [ ] Task statuses are only `TODO | IN_PROGRESS | BLOCKED | DONE`
- [ ] Android package is `com.bxthre3.agentic`
- [ ] APK filename includes `6.0.0`
- [ ] Web client `/agentic` loads and displays version `v6.0.0`
- [ ] SOUL.md behavioral principles are intact
- [ ] No new agent or fictional Arkad names appear in live data

---

## 7. Known Issues (v6.0 Baseline)

| # | Issue | Severity | Owner | Status |
|---|---|---|---|---|
| KV1 | `server.ts` hardcoded version `"4.1.0"` conflicts with live `"5.0.0"` | P1 | Iris | MUST FIX before v6.0 release |
| KV2 | Android package is `com.agenticnative` instead of `com.bxthre3.agentic` | P1 | Iris | MUST FIX before v6.0 release |
| KV3 | APK filename uses `5.0.2` instead of `6.0.0` | P2 | Iris | Next build |
| KV4 | ORG-CHART.md (agentic-v2) contains Arkad/fictional roster | P1 | Iris | Deprecate; redirect all clients to live API roster |
| KV5 | `com.agenticnative` source tree (`Agentic-Native-Source/`) is a divergent fork | P2 | Iris | Consolidate into single `com.bxthre3.agentic` source |

---

## 8. Future Client Policy

All clients (web, mobile, third-party) connecting to Agentic must:

1. **Read version from API** — never hardcode `"6.0.0"` in client code
2. **Handle graceful degradation** — show last-known state + warning if API unreachable
3. **Use canonical field names only** — as defined in §3.3 endpoint documentation
4. **Implement status mapping** — server sends legacy strings, client maps to canonical (§4.3, §4.4)

---

## 9. Document Governance

| Field | Value |
|---|---|
| **Spec version** | 6.0.0 |
| **Locked on** | 2026-03-26 |
| **Owner** | brodiblanco + Engineering Lead |
| **Next review** | Upon v6.1 release |
| **Amendments** | Require brodiblanco explicit approval |
| **Supersedes** | All prior version docs, ORG-CHART.md (agentic-v2), APK filename conventions |
| **Canonical location** | `Bxthre3/projects/the-agentic-project/SPEC.md` |

---

*This document is the law for v6.0. Not a guideline. Not a suggestion.*
