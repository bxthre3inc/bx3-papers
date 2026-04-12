# Agentic v6.2 — The Immutable Architecture

**Purpose:** Stop scope creep. One document. One truth. Every build same result.\
**Rule:** If Agentic and it's not in this doc, then it doesn't exist.\
**Goal:** Zero idle seconds. Always compute.

---

## 0. THE DETERMINISM PRINCIPLE (Why Structure = Power)

> "The best AI has structured I/O. The more deterministic the system, the more effective it becomes. There is a limit, I haven't found it yet though" - Jeremy Beebe 3/30/2026 10:02pm

**Agentic applies this at every layer:**

| Layer | Input Structure | Output Structure | Determinism Guarantee |
| --- | --- | --- | --- |
| **AMP Messages** | Binary wire format (76+ bytes) | Same binary format | Byte-exact parsing |
| **Tasks** | Kotlin data class with JSON schema | Task result with status enum | Type-safe serialization |
| **Triggers** | Cron expression OR event type | Cascade actions (1..n) | No orphaned triggers |
| **Breadcrumbs** | JSONL with fixed schema | Win sheet markdown | Foundry harvest always works |
| **Builds** | Locked dependency hashes | Binary with SHA256 | Same input = same output |

**What This Prevents:**

- "Sometimes it works" → Never. Always works or always fails.
- "Let me check what format..." → Format is in this doc. Immutable.
- "That field used to be..." → Fields don't change. Ever.
- "Did the last build..." → `sha256sum build.apk` tells you.

---

## 1. TRIGGER TAXONOMY (The Cascade)

```markdown
TIME-BASED (Cron)
├── Daily 08:00 → Maya SBIR Scout
│   └── Triggers: 4 Deadline Checks → Calendar Sync → Email Alert
│   └── Output: maya_deadlines[].json → Foundry
│
├── Daily 04:00 → Agent Health Pulse
│   └── Triggers: All agents report → INBOX sweep → Escalation if P0/P1
│   └── Output: pulse_report.json → VAULT
│
├── Weekly Mon 08:00 → Blue Ocean Scan
│   └── Triggers: Grants prospector → SBIR fetch → Pipeline update
│   └── Output: weekly_briefing.md
│
└── Realtime (Event-Driven)
    ├── AMP Heartbeat (< 5s) → Mesh Discovery
    │   └── Triggers: Peer update → Load rebalancing → Task routing
    │
    ├── Task Completion → Foundry Harvest
    │   └── Triggers: breadcrumb write → Win sheet → VAULT publish
    │
    ├── P1 Detection → SMS Alert → brodiblanco
    │   └── Triggers: SMS sent + INBOX update
    │
    └── Git Push → Auto-Pull (all connected nodes)
        └── Triggers: Android sync → Desktop sync → Server deploy
```

### Trigger Rules

| Rule | Enforcement |
| --- | --- |
| Every trigger MUST have 1+ downstream actions | No orphaned triggers |
| Time-based triggers MUST complete &lt; 60s | Timeout protection |
| Event triggers MUST queue, not block | Async pipeline |
| Failed trigger → P1 escalation | No silent failures |

---

## 2. TASK LOOP (Always-On Guarantee)

**The Golden Loop:**

```markdown
┌─────────────────────────────────────────────────┐
│  SENTINEL (Monitor) → PULSES (Health) → TASKS   │
│  ↑______________________________________________↓│
└─────────────────────────────────────────────────┘
```

### Minimum Viable Compute

| Component | Idle Cost | Active Work |
| --- | --- | --- |
| Mesh Server | $ (already running) | AMP heartbeat + task routing |
| Maya Agent | Scheduled daily | SBIR deadline tracking |
| Sentinel Agent | Real-time polling | Health checks + P1 detection |
| Foundry Harvest | Event-triggered | Win sheet generation |

**Utilization Target:** &gt; 70% of server capacity\
**Never Idle:** If no tasks → Sentinel generates diagnostic heartbeat

---

## 3. DATA CONTRACTS (Canonical Structures)

### Task Model (Unchanged FOREVER)

```kotlin
data class Task(
    val id: String,              // UUID v4
    val type: String,            // dot notation: maya.sbir.check
    val priority: Int,           // 0-3 maps to P0-P3
    val status: TaskStatus,       // OFFERED → ACCEPTED → COMPLETED
    val payload: Map<String, Any>,
    val sourceNode: Long,        // Who created it
    val targetNode: Long?,       // Where it runs (null = any)
    val createdAt: Long,         // epoch millis
    val completedAt: Long?        // null until done
)
```

### AMP Message (Binary Spec)

```markdown
[0]       = Message Type (1 byte)
[1]       = Priority (0-3)
[2-3]     = Payload length (u16)
[4-11]    = Hybrid Logical Clock (u64)
[12-19]   = Source Node ID (u64)
[20-n]    = Payload (msgpack)
[last-64] = Ed25519 Signature
```

### Breadcrumb (Foundry Input)

```json
{
  "agent": "maya",
  "action": "sbir.check",
  "timestamp": 1714392000000,
  "inputs": {},
  "outputs": {},
  "impact": {"deadlines_found": 3, "value": 805000}
}
```

---

## 4. BUILD REPRODUCIBILITY (Same Result Every Time)

### Directory Structure (Immutable)

```markdown
Bxthre3/projects/the-agentic-project/
├── mobile/                    # Android FOXXD Client
│   ├── app/src/main/...      # Kotlin only
│   └── build.gradle.kts      # v34 SDK locked
│
├── desktop/                   # Linux Compose Desktop
│   ├── compose/src/...        # Kotlin only
│   └── build.gradle.kts       # Same deps as mobile
│
├── server/                    # Python AMP Server
│   ├── mesh_server.py        # One file. One entrypoint.
│   ├── amp_types.py          # Shared types
│   └── render-worker/         # Background jobs
│
├── common/                    # Shared between all platforms
│   ├── security/              # AES-256 vault
│   └── tasks/                 # Task model definitions
│
└── docs/                      # ARCHITECTURE.md (this file)
```

### Build Lock Files

| Platform | Lock File | Purpose |
| --- | --- | --- |
| Android | gradle.lockfile | Dependency hashes |
| Desktop | gradle.lockfile | Same as mobile |
| Server | requirements-frozen.txt | Python versions |
| Web | bun.lock | Zo.space dependencies |

### No-Go Zones (Scope Creep Prevention)

- No new languages (Kotlin + Python only)
- No new directories at root level
- No new message formats (AMP binary only)
- No feature branches &gt; 1 week old
- No manual steps in deployment

---

## 5. COST OPTIMIZATION (85%-95% Utilization Target)

**Golden Rule:** If we pay for always-on, we use it always. **Never pay for idle.**

---

### Resource Thresholds & Actions

| Resource | Target | Warning | Critical | Action When Below Target |
|----------|--------|---------|----------|--------------------------|
| **CPU** | 85%-95% | <70% | <50% | Queue batch jobs → Synthetic load → Diagnostic mode |
| **Memory** | 70%-85% | <50% | <30% | Cache warm → Data preload → Compress old data |
| **Disk I/O** | Active streaming | <20 IOPS | Zero IOPS | Log rotation → Backup verify → Index rebuild |
| **Network** | 60%-90% capacity | <30% | <10% | Peer discovery burst → Data sync → Status broadcast |

---

### 24/7 Load Matrix (Never Zero)

| Time (UTC) | Expected Load | Primary Work | Idle Prevention Backup |
|------------|--------------|--------------|------------------------|
| **00:00-04:00** | 30-50% | Night batch: Log compression, data archival, ML training | Synthetic benchmarks, cache warming, full system diagnostic |
| **04:00-08:00** | 60-75% | Morning prep: Maya SBIR, health pulses, daily syncs | Predictive load generation, connection pool warming |
| **08:00-12:00** | **85%-95%** | **PEAK:** Real-time task routing, AMP mesh, active compute | None needed - main productivity window |
| **12:00-16:00** | **85%-95%** | **PEAK:** End-to-end automation, client requests, harvest | None needed - sustained high utilization |
| **16:00-20:00** | 70-85% | Evening sprint: Batch reports, data processing, cleanup | Warm-down tasks, predictive scheduling |
| **20:00-24:00** | 45-65% | Background farm: Index rebuilds, pattern analysis, training | Pre-midnight cache prep, synthetic heartbeat |

**Key Principle:** Minimum 30% load even at 3am. Never power-save mode. Always working.

---

### Auto-Scale & Recovery Triggers

```python
# Reactive: Respond to low utilization
IF CPU < 70% FOR 3 MIN:
    → Queue: Batch job priority burst (SBIR full scan, data audit)
    → Trigger: Generate synthetic tasks until CPU > 75%

IF CPU < 50% FOR 5 MIN:
    → Alert: "System underutilized"
    → Queue: Full diagnostic suite + self-test + load test
    → Trigger: Generate 500 synthetic tasks, verify pipeline

IF CPU > 95% FOR 2 MIN:
    → Alert: "Approaching capacity limit"
    → Action: Shed P3 tasks, queue for later
    → Escalate: P1 if >98% for 5min

IF Memory < 50% FOR 5 MIN:
    → Trigger: Compress breadcrumbs older than 7 days
    → Trigger: Archive logs to cold storage
    → Trigger: Preload next-hour likely data

IF Disk > 80%:
    → Emergency: Purge oldest logs, archive to cloud
    → Alert: P1 on-call

IF NO ACTIVE TASKS FOR 10 MIN:
    → Trigger: Sentinel diagnostic mode
    → Generate: Health report, latency test, self-check
    → Verify: All upstream APIs responding
```

---

### Proactive Synthetic Load (Never Idle)

| Synthetic Trigger | Frequency | Compute Generated | Purpose |
|-------------------|-----------|-------------------|---------|
| **Pipeline Stress Test** | Every 30min idle | 100 synthetic tasks | Verify end-to-end works |
| **Cache Warmer** | Every hour | Pre-load hot data | Memory >50% always |
| **AMP Heartbeat** | Every 5s | UDP beacon + mesh sync | Network always active |
| **Connection Pool Keepalive** | Every 60s | Ping all peers | Latency baseline |
| **Prediction Pipeline** | Free CPU bursts | ML model training | Learn patterns |

### Success Metric

**Target Achieved When:**
```
24-hour average: 85% < CPU < 95%
Peak hours (08:00-16:00): 90% < CPU < 95%
Minimum observed: Never below 30%
Idle seconds: 0
```

---

## 6. VALIDATION CHECKPOINTS

### Pre-Deploy Checklist

- [ ]  All triggers have downstream actions defined

- [ ]  Task model matches canonical specification byte-for-byte

- [ ]  Build produces identical hash to reference

- [ ]  Server registers heartbeat within 5 seconds

- [ ]  At least 1 task completes end-to-end

### Post-Deploy Verification

```bash
# Run this after every build
curl -s http://localhost:8080/health | jq .
# Expected: {"peers": 0}

python3 Skills/maya-sbir-automation/scripts/maya.py --check
# Expected: 3 deadlines

curl -s http://localhost:8080/tasks | jq '.tasks | length'
# Expected: > 0
```

---

## 7. CHANGE PROCESS (How To Modify This Doc)

### Allowed Changes

- Bug fix with reference to failing test
- Performance optimization with metrics
- Security patch with CVE reference

### Blocked Changes (Require Version Bump)

- New trigger type → Requires v6.3
- New data field → Requires migration
- New directory → Rejected
- New language → Rejected

## 8. FAILURE MODES & RECOVERY (Graceful Degradation)

**Principle:** Fail safe. Fail visible. Never fail silent.

---

### Failure Scenarios & Responses

| Failure | Detection | Immediate Action | Recovery Time |
|---------|-----------|------------------|---------------|
| **FOXXD Offline** (Node 1) | Heartbeat timeout >15s | Traffic → Node 2 (Chromebook) or Node 3 (Server) | <5s failover |
| **Chromebook Offline** (Node 2) | Heartbeat timeout >15s | Traffic → Node 3 (Server) as tertiary | <5s failover |
| **Server Restart** (Node 3) | HTTP 503 or timeout | All nodes queue tasks locally | <30s for full mesh |
| **Network Partition** | Can reach server, not peers | Server routes all tasks to itself | <1s switch |
| **Task Timeout** | >60s no completion | Mark FAILED, queue for retry | Auto-retry ×3 |
| **Task Exception** | Error return | Log + breadcrumb + P1 if repeated | Immediate |
| **Full Mesh Death** | All heartbeats lost | Sentinel runs solo diagnostic | 5min alert |

---

### Cascade Failure Prevention

```python
# Circuit breaker pattern
IF Node X fails 3 times in 5 min:
    → Circuit: OPEN
    → Redirect: All traffic to healthy nodes
    → Backoff: 60s before retry Node X
    → Alert: P1 if >50% of mesh unhealthy
```

---

### Recovery Procedures

| Priority | Procedure | Automation Level |
|----------|-----------|-----------------|
| P0 | Manual restart of mesh server | Sentinel SMS + scripted restart |
| P1 | Node rejoin after network partition | Auto: Node detects recovery, rejoins |
| P2 | Partial mesh rebuild | Auto: Discovery finds new topology |
| P3 | Full state rebuild from VAULT | Semi-auto: Script + brodiblanco approval |

---

### Data Persistence Guarantees
- Local breadcrumbs: 7 days on each node
- Server persistence: 90 days minimum
- Foundry VAULT: Indefinite (win sheets)
- INBOX: 30 days rolling

**Loss Scenarios:**
- Single node death → No data loss (replicated to Server)
- Server death → Rebuild from Android + Desktop copies
- Full cluster death → Rebuild from Foundry VAULT (last state)

---

## 9. GIT SYNC SPECIFICATION (All Frontends)

**Goal:** Single source of truth. Every frontend syncs before/after every user action.

### Sync Triggers

| Action | Local Effect | Sync Trigger | Remote Effect |
|--------|-------------|--------------|---------------|
| Login success | Auth token acquired | `git pull origin main` | Latest config |
| Task completed | Status updated | `git commit -m "user:task"` + `git push` | VAULT updated |
| Settings changed | Preference updated | `git commit -am "user:settings"` + `git push` | All devices get update |
| Logout | Session ended | `git push --dry-run` (verify sync) | None (session ended) |

### Sync Behavior by Platform

```kotlin
// Android (Kotin)
fun onUserAction(action: UserAction) {
    localUpdate(action)
    coroutineScope.launch {
        gitPull()  // Always pull first
        gitCommit(action)  // Record change
        gitPush()  // Sync to remote
    }
}

# Server (Python)
def handle_user_request(req):
    git_pull()  # Ensure latest before processing
    result = process(req)
    git_commit(f"server:{req.type}")
    git_push()
    return result
```

### Conflict Resolution

| Conflict | Resolution | Example |
|----------|------------|---------|
| Same task updated on 2 devices | Last-write-wins (timestamp) | Task status race |
| Same setting diverged | Merge with user prompt | Preference mismatch |
| Device offline for >1 day | Full re-sync on reconnect | Laptop offline |

---

## 10. VERSION FREEZE CHECKPOINT (v6.2)

| Component | Status | Location |
|-----------|--------|----------|
| Architecture Doc | ✅ LOCKED | `file 'Bxthre3/projects/the-agentic-project/AGENTOS_ARCHITECTURE_v6.2.md'` |
| Trigger Taxonomy | ✅ Defined | Section 1 |
| Task Data Contract | ✅ Immutable | Section 3 |
| Utilization Target | ✅ 85%-95% | Section 5 |
| Failure Modes | ✅ Documented | Section 8 |
| Git Sync Spec | ✅ Defined | Section 9 |
| Build Reproducibility | ✅ Locked | Section 4 |

---

**Next Version (v6.3) Gates:**
- [ ] All v6.2 builds passing for 7 days
- [ ] 85%+ utilization sustained for 30 days
- [ ] Zero unplanned outages for 30 days
- [ ] brodiblanco approval required