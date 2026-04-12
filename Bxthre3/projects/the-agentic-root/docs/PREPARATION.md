# Agentic v6.0.0 — Release Preparation Plan
**Created:** 2026-03-26
**Spec baseline:** `SPEC.md` v6.0.0 (locked 2026-03-26)
**Owner:** Iris (Engineering Lead)
**Sign-off required:** brodiblanco before v6.0.0 release

---

## Preamble

This plan is the execution map to bring all Agentic systems into compliance with `SPEC.md` v6.0.0. Every item is traceable to a spec section. No item is optional — deferred items must be explicitly approved by brodiblanco and documented in SPEC.md as a v6.1 change.

Items are ordered by dependency: Phase 1 must be complete before Phase 2, etc.

---

## Phase 1 — API (Server) Overhaul
**Owner:** Iris (backend)
**Depends on:** Nothing
**Goal:** API becomes the canonical v6.0 source of truth

### P1.1 — Upgrade API Version String to 6.0.0
**Spec ref:** §2.3, §2.1

**Files affected:**
- `src/server.ts` — root `app.get('/')` → `"version": "6.0.0"`
- `src/server.ts` — `app.get('/health')` → `"version": "6.0.0"`
- Any other hardcoded `"4.1.0"` literals

**Action:** Replace all `"4.1.0"` literals with `"6.0.0"`. Commit and push.

---

### P1.2 — Align `/status` Endpoint to Spec Schema
**Spec ref:** §3.3 — `GET /status`

**Spec requires:**
```json
{
  "version": "6.0.0",
  "status": "operational",
  "agentCount": <int>,
  "activeAgents": <int>,
  "workQueueDepth": <int>,
  "escalationCount": <int>,
  "uptime": <float>,
  "diskUsage": <int>,
  "avgHealth": <float>,
  "knownIssues": [<string>]
}
```

**Current gaps:** `agentCount`, `activeAgents`, `workQueueDepth`, `escalationCount`, `uptime`, `diskUsage`, `avgHealth`, `knownIssues` are all missing from current response.

**Action:** Rewrite `/status` handler to return the full spec schema. Compute `diskUsage` from `process.memoryUsage().heapUsed`. Compute `avgHealth` from average `completionRate` of active agents. Compute `knownIssues` from open escalations.

---

### P1.3 — Add Missing `/starting5` Endpoint
**Spec ref:** §3.3 — `GET /starting5`

**Current:** `404 Not Found`

**Required response:**
```json
[{
  "name": "<string>",
  "archetype": "<string>",
  "specialty": "<string>",
  "currentFocus": "<string>",
  "metrics": {}
}]
```

**Data source:** Maya (Grant Strategist), Drew (Sales Lead), Casey (Marketing Lead), Zoe (Executive Agent), Vance (Executive Agent) — the 5 canonical Starting 5 agents per SPEC.md §4.1.

---

### P1.4 — Add Missing `/projects` Endpoint
**Spec ref:** §3.3 — `GET /projects`

**Current:** `404 Not Found`

**Required response:**
```json
[{
  "name": "<string>",
  "status": "<string>",
  "description": "<string>",
  "lastUpdated": "<string>"
}]
```

**Canonical projects:** Irrig8 (STANDBY), Valley Players Club (PLANNING), The Starting 5 (ACTIVE), Agentic (ACTIVE), Rain (ACTIVE), ARD Project (UNKNOWN).

---

### P1.5 — Align `/org` Roster to 19 Canonical Entities
**Spec ref:** §4.1 — 19 entities locked

**Current:** `/org` returns fictional Arkad roster — **deprecated as of SPEC.md v6.0**.

**Required roster (exactly 19):** brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, maya, raj, drew, irrig8, rain, vpc, trenchbabys.

**Action:** Rewrite `/org` handler to return only the 19 canonical entities. Strip all Arkad-era fictional entries.

---

### P1.6 — Align `/agents` to 19 Canonical Entities
**Spec ref:** §4.1, §4.4

**Current:** `/agents` returns 24–36 agents including fictional Arkad names.

**Required:** Exactly 19 agents. Status values only: `ACTIVE | IDLE | OFFLINE | ERROR`.

**Action:** Filter data source to return only the 19 canonical agents. Map any legacy status strings to canonical values server-side.

---

### P1.7 — Verify `/tasks` Canonical Statuses
**Spec ref:** §4.3 — `TODO | IN_PROGRESS | BLOCKED | DONE` only

**Current:** Looks compliant (IN_PROGRESS seen in live response).

**Action:** Audit full task list. Confirm no variant strings. Map any legacy variants server-side.

---

### P1.8 — Full Endpoint Audit
**Spec ref:** §3.3

| Endpoint | Current Status | Action |
|---|---|---|
| `GET /status` | Partial | Fix in P1.1 + P1.2 |
| `GET /agents` | 24–36 agents | Fix in P1.5 + P1.6 |
| `GET /tasks` | Compliant | Verify in P1.7 |
| `GET /org` | Fictional roster | Fix in P1.5 |
| `GET /workforce/metrics` | Working | Counts auto-update via P1.5 |
| `GET /depts` | Working | Schema OK |
| `GET /integrations` | Working | Schema OK |
| `GET /escalations` | Working | Schema OK |
| `GET /starting5` | **404** | Fix in P1.3 |
| `GET /projects` | **404** | Fix in P1.4 |

After P1.1–P1.7, run all 10 endpoint checks and confirm each returns valid JSON matching the schema.

---

## Phase 2 — Android Native App
**Owner:** Iris (Android)
**Depends on:** Phase 1 complete and verified

### P2.1 — Rename Package `com.agenticnative` → `com.bxthre3.agentic`
**Spec ref:** §3.1

**Files to change:** Every `.kt` file has `package com.agenticnative` at top. Also:
- `app/build.gradle.kts` → `namespace = "com.bxthre3.agentic"`, `applicationId = "com.bxthre3.agentic"`
- All `import com.agenticnative.*` statements → `import com.bxthre3.agentic.*`
- `AndroidManifest.xml` references
- `AndroidManifest.xml` package attribute

**Action:**
```bash
find . -type f \( -name "*.kt" -o -name "*.xml" -o -name "*.kts" \) \
  -exec sed -i 's/com\.agenticnative/com.bxthre3.agentic/g' {} \;
```
Then verify `build.gradle.kts` `namespace` and `applicationId` fields explicitly.

---

### P2.2 — Update `build.gradle.kts` Version to 6.0.0
**Spec ref:** §2.3, §3.1

**Current:**
```kotlin
versionCode = 1
versionName = "5.0.1"
```

**Change to:**
```kotlin
versionCode = 1
versionName = "6.0.0"
```

---

### P2.3 — Rename APK Output to `Agentic-6.0.0-release.apk`
**Spec ref:** §3.1

**Current:** `Agentic-Native-debug-5.0.2.apk`

**Action:** After version bump, rename built APK or configure Gradle `archiveFileName`.

---

### P2.4 — Align Screen/Tab Order to 10 Screens
**Spec ref:** §3.1 — 10 tabs in exact order

**Spec order:**
1. Dashboard
2. Workforce
3. Depts
4. Queue
5. Integrations
6. Escalations
7. Starting 5
8. Reports
9. Projects
10. Settings

**Current nav:** Dashboard → Agents → Tasks → OrgChart → Workforce → Inbox → Settings → AgentDetail

**Gaps:** No Depts, Queue, Integrations, Escalations, Starting 5, Reports, or Projects screens. Inbox is not in spec.

**Action:** Replace current 7-tab nav with 10-spec screens. Create 6 new screens: `DeptsScreen.kt`, `QueueScreen.kt`, `IntegrationsScreen.kt`, `EscalationsScreen.kt`, `Starting5Screen.kt`, `ReportsScreen.kt`, `ProjectsScreen.kt`. Reuse `AgentsScreen` as Workforce. Drop `InboxScreen` from the nav bar (inbox routing is internal agent ops, not consumer-facing).

---

### P2.5 — Align API Interface to All 10 Endpoints
**Spec ref:** §3.3

After Phase 1 adds `/starting5` and `/projects`, add to `AgentOSApi.kt`:
```kotlin
@GET("starting5")
suspend fun getStarting5(): Response<List<Starting5>>

@GET("projects")
suspend fun getProjects(): Response<List<Project>>
```

---

### P2.6 — Consolidate Divergent Source Trees
**Spec ref:** KV5

**Two trees exist:**
- `the-agentic-native/Agentic-Native-Source/` — `com.agenticnative`, current build source
- `the-agentic-native/app/` — `com.bxthre3.agentic`, older/different

**Action:** Audit both trees. Keep the one with more complete screens. Move the other to `ARCHIVED/` folder. After P2.1 (package rename), the surviving tree uses `com.bxthre3.agentic`.

---

### P2.7 — Pre-Build Compliance Checklist
**Spec ref:** §6.3

Before building the v6.0.0 APK, all 10 items must pass:
- [ ] `GET /api/agentic/status` returns `"version": "6.0.0"`
- [ ] All 10 API endpoints return valid JSON
- [ ] Agent roster shows exactly 19 entities
- [ ] Agent statuses are only `ACTIVE | IDLE | OFFLINE | ERROR`
- [ ] Task statuses are only `TODO | IN_PROGRESS | BLOCKED | DONE`
- [ ] Android package is `com.bxthre3.agentic`
- [ ] APK filename includes `6.0.0`
- [ ] All 10 screens present and in correct order
- [ ] SOUL.md behavioral principles intact
- [ ] No Arkad/fictional names in live data

---

## Phase 3 — Web Client (`/agentic`)
**Owner:** Iris (frontend)
**Depends on:** Phase 1 complete and verified

### P3.1 — Create `/agentic` Route if Missing
**Spec ref:** §3.2

**Action:** Check if `/agentic` exists. If not, create as a private page (auth required).

---

### P3.2 — Implement 6-Tab Layout
**Spec ref:** §3.2

**Tabs (exact order):** Status | Agents | Tasks | Org Chart | Starting 5 | Integrations

All data fetched live from API endpoints. No stale local state. Version shown in footer: "Agentic v6.0.0".

---

### P3.3 — Graceful Degradation
**Spec ref:** §8

If `GET /api/agentic/status` fails, show warning banner + last-known cached state rather than blank/error page.

---

## Phase 4 — Version & Dependency Audit
**Owner:** Iris
**Depends on:** All previous phases

### P4.1 — Audit All Hardcoded Version Strings
**Spec ref:** §2.3

Search entire codebase for any version string not `"6.0.0"` or derived from API. Fix any findings.

---

### P4.2 — Archive ORG-CHART.md (Arkad)
**Spec ref:** KV4, §4.1

**Action:** Rename `agentic-v2/ORG-CHART.md` → `ORG-CHART.md.ARCHIVED` and add deprecation note pointing to `SPEC.md` and `/api/agentic/org`.

---

### P4.3 — Update SOUL.md Current Priority Context
**Spec ref:** §5

Update the "Current Priority Context" section to reflect v6.0.0 release preparation.

---

## Phase 5 — Final Sign-Off
**Owner:** brodiblanco
**Depends on:** Phases 1–4 complete

### P5.1 — brodiblanco Reviews
- Run full pre-build checklist (§6.3) — confirm all 10 items pass
- Review `/agentic` web client
- Review built APK
- Confirm 19-agent roster matches spec

### P5.2 — Update SPEC.md if Any Deviations
**Spec ref:** §9

If any deviations were agreed upon during execution, document them in SPEC.md before release. The spec is the law — deviation without documentation is not permitted.

### P5.3 — Tag and Ship
```bash
git tag -a v6.0.0 -m "Agentic v6.0.0 — spec-compliant release"
git push origin v6.0.0
```
- Build APK: `Agentic-6.0.0-release.apk`
- Deploy web client: verify `/agentic` is live
- Update APK download link

---

## Summary

| Phase | Owner | Depends |
|---|---|---|
| 1. API Overhaul | Iris | None |
| 2. Android App | Iris | P1 complete |
| 3. Web Client | Iris | P1 complete |
| 4. Version Audit | Iris | P2 + P3 |
| 5. Sign-Off & Ship | brodiblanco | P4 |

**Critical path:** P1.1 → P1.3 → P1.4 → P1.2 → P1.5 → P1.6 → P1.7 → P1.8 → P2.x → P3.x → P4.x → P5

**Known Issues tracked:** KV1 (server.ts `"4.1.0"`), KV2 (Android package), KV3 (APK filename), KV4 (ORG-CHART Arkad roster), KV5 (divergent source trees).

---

*Plan derived from `SPEC.md` v6.0.0. Every item maps to a spec section.*
