# Agentic v6.1 Implementation Plan
**Goal:** Close the gap between architecture stubs and working automation  
**Approach:** Phase-gated, one end-to-end flow at a time  
**Target:** Working MVP by April 11, 2026

---

## Current State Snapshot

| Component | Status | Blocker |
|-----------|--------|---------|
| AMP Discovery | Stubbed | Not wired in Application class |
| AMP Messaging | Implemented | No server integration |
| Task Routing | UI only | No execution pipeline |
| Maya Automation | Manual tasks in API | No skills/integrations wired |
| Foundry Harvest | None | No breadcrumb capture |
| Threshold Signing | Stubbed | No key generation flow |
| Offline Mode | None | No Room persistence |

---

## PHASE 1: AMP Baseline (Days 1-3) — Wire What's Built

**Goal:** Heartbeat between FOXXD and Server

### Day 1: Android Bootstrap
1. Wire `AMPManager.start()` in `AgentOSApplication.onCreate()`
2. Add foreground service for persistent mesh (required on Android 10+)
3. Request `INTERNET` and `ACCESS_WIFI_STATE` permissions
4. Verify via `adb logcat | grep AMP`

**Success:** Logs show heartbeat emit every 5s

### Day 2: Server Integration
1. Deploy Python `mesh_server.py` to Zo host
2. Bridge to existing `/api/mesh/*` routes
3. Add `/api/mesh/status` returning live peer list
4. Log all heartbeats with node ID and health

**Success:** Server logs: `Peer 1 (FOXXD) at 192.168.x.x`

### Day 3: Cross-Network Test
1. Test over WiFi vs mobile data
2. Document NAT/firewall limitations
3. Add status badge to Dashboard screen
4. Record demo: phone and server discovering each other

**Deliverable:** 60s video of mutual discovery

---

## PHASE 2: Task Routing Core (Days 4-6) — Execute On Phone

**Goal:** Server assigns task → Phone executes → Reports result

### Day 4: Task Definition
```kotlin
// Task types
- notion-query: Query Notion database
- calendar-create: Create Calendar event  
- email-send: Send via Gmail
- notion-update: Update page property
- slack-notify: Send Slack message
```

1. Create `TaskProcessor` interface
2. Implement `NotionQueryTask`, `CalendarCreateTask`, `EmailSendTask`
3. Room table: `pending_tasks` with priority index
4. msgpack serialization in `AMPMessage`

### Day 5: Server Router
1. `POST /api/mesh/tasks/assign` with capability matching
2. Select node with required caps (FOXXD has STORAGE_PERSISTENT, EMAIL_GATEWAY)
3. Queue if no nodes available (exponential backoff)
4. Retry logic: 3 attempts, then escalate to user

### Day 6: Android Execution
1. `TaskWorker` — WorkManager for background execution
2. Notification: "Maya has a task" with Accept/Reject
3. Acceptance: Add to queue, start execution
4. Result: Send `TaskResult` back via AMP

**Verification:**
- Server assigns → Phone notifies → User accepts → Executes → Reports success

---

## PHASE 3: Maya Automation — First Real Agent (Days 7-10)

**Goal:** Zero manual SBIR tracking

### Day 7: Notion SBIR Skill
```python
# Skills/maya-grants/scripts/sync.py
- Query Notion "SBIR Deadlines" database
- Filter: deadlines in next 30 days
- Output: [{title, deadline, agency, status, page_id}]
```

### Day 8: Calendar + Email Pipeline
For each upcoming deadline:
- Create Calendar event (7 days before)
- Schedule email reminder (3 days before)  
- Update Notion "Status" property to "Tracked"

### Day 9: End-to-End Test
1. Server schedules `maya-sbir-sync` daily at 9am MST
2. Task routes to FOXXD
3. Phone runs full pipeline
4. Results logged, email sent

### Day 10: Schedule Cadence
- Daily: SBIR sync at 9am
- Weekly: Friday summary email
- Config: `agent_config.json` in workspace

**Deliverable:** Automated SBIR tracking working

---

## PHASE 4: Foundry Harvest (Days 11-13) — Prove Value

**Goal:** Task completions become vault evidence

### Day 11: Breadcrumbs
On task completion, write to:
```
Bxthre3/INBOX/breadcrumbs/
  maya-2026-04-05.jsonl
  
Schema:
{ts, agent, task, outcome, artifacts: {emails_sent, events_created, deadlines_found}}
```

### Day 12: Refine Script
```python
# Skills/foundry-refiner/scripts/refine.py
- Read breadcrumbs for agent + window
- Generate win sheet narrative
- Pattern: "Maya identified 5 opportunities, tracked 3 to calendar"
```

### Day 13: Vault Publishing
- Auto-publish refined wins to `/vault` page
- Trigger: 3+ breadcrumbs or weekly
- Update `VAULT/index.html` automatically

**Deliverable:** Public VAULT shows automated work

---

## PHASE 5: Offline + Security (Days 14-17)

### Day 14: Offline Queue
1. Room database for pending tasks
2. Queue when no connectivity
3. Sync on reconnection (upload/download)
4. Conflict: HLC timestamp wins

### Day 15: Threshold Signer
1. Generate Ed25519 keypair on first launch
2. Derive Android shard
3. Server holds shard 2
4. Reconstruct for critical ops only

### Day 16: Local Execution
- Offline > 5min: switch to local processing
- Use cached API keys
- Results sync when back online
- UI: "Offline Mode" indicator

### Day 17: Security Review
- Document key storage (Keystore/StrongBox)
- Shard transmission security
- Recovery procedures

---

## Resource Allocation

| Role | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|
| brodiblanco | Test, verify | Test | Validate | Review | Sign-off |
| dev (me) | Server deployment | Router API | Skill wiring | Refiner | Security |
| iris | Android wiring | Task execution | UI polish | Breadcrumb | Offline mode |

---

## Escalation Criteria

| Trigger | Action |
|---------|--------|
| AMP heartbeat fails Day 2 | Switch to HTTP fallback |
| Task routing fails Day 6 | Drop mesh, use Zo API only |
| Maya automation fails Day 10 | Manual mode only, no vault |
| No vault win by Day 13 | Extend or pivot to documentation-only |

---

## Definition of Done (MVP)

- [ ] FOXXD heartbeats to Server (logs prove)
- [ ] Server assigns task → Phone executes → Reports result
- [ ] Maya SBIR sync runs daily without manual intervention
- [ ] Task completion writes breadcrumb → VAULT updates
- [ ] Offline queue: 3+ tasks queued and synced
- [ ] Threshold signing: 2-of-2 works for one operation

**Success:** You open VAULT and see automated Maya work as equity proof.

---

*Plan locked: March 30, 2026. First commit: AMP Application wiring.*

## Consolidation Complete (2026-03-30)

| Directory | Action | Status |
|-----------|--------|--------|
| `backend-api/` | Archived to `ARCHIVE/backend-api_20260330` | ✅ |
| `worker-render/` | Merged into `server/render-worker/` | ✅ |
| `mcp-mesh/` | Archived to `ARCHIVE/mcp-mesh_20260330` (AMP replaced MCP) | ✅ |

### Current Canonical Locations

| Component | Source | Build Output |
|-----------|--------|--------------|
| Android App | `mobile/app/src/` | `mobile/app/build/outputs/apk/` |
| Mesh Server | `server/mesh_server.py` | Runtime on port 8080 (local) / service |
| AMP Discovery | `mobile/app/src/.../mesh/AMPDiscovery.kt` | Compiled into APK |
| Agent Scripts | `Skills/maya-sbir-automation/scripts/` | Manual + scheduled execution |
| Render Worker | `server/render-worker/` | Future: unified server entrypoint |

### Single Server Policy
All backend services now route through `server/`:
- `mesh_server.py` — AMP mesh + task routing
- `amp_types.py` — Shared types
- `render-worker/` — Background job worker (to be merged)

**Rule:** No new server directories. Extend `server/` only.
