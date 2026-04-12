# Agentic Engineering Roadmap

**Current State:** 5% (Documentation & Scaffolding)  
**Target State:** 100% (Production-Grade Federated System)  
**Standard:** Production Software Engineering (Tested, Reviewed, Deployed)

---

## Phase 0: Foundation (Week 1) — 5% → 15%

### Goal
Working build system, CI/CD pipeline, and single working component.

### Entry Criteria
- [ ] This document approved
- [ ] Development environment documented

### Tasks

#### 0.1 Build System (Mobile)
```bash
# Deliverable: APK builds successfully
./gradlew :mobile:assembleDebug
# Exit: app-debug.apk exists, installs on FOXXD
```

#### 0.2 Build System (Desktop)
```bash
# Deliverable: Linux binary
./gradlew :chromebook:packageDeb
# Exit: .deb package installs on A14 G5
```

#### 0.3 CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
# - Lint (ktlint, pylint)
# - Unit tests
# - Build APK
# - Build desktop
# Exit: Green checkmark on every PR
```

#### 0.4 Python Server Packaging
```bash
# Deliverable: pip installable
pip install -e server/
python -m agentic_server --version
# Exit: Server starts, responds to HTTP ping
```

### Phase 0 Exit Criteria
| Check | Verified By |
|-------|-------------|
| APK builds | CI artifact exists |
| Desktop builds | CI artifact exists |
| Server runs | `curl localhost:8080/health` returns 200 |
| All tests pass | CI green |

---

## Phase 1: AMP Core (Weeks 2-3) — 15% → 35%

### Goal
UDP discovery and heartbeat working between two nodes.

### Entry Criteria
- Phase 0 complete
- Two test devices available (FOXXD + emulator/laptop)

### Tasks

#### 1.1 UDP Discovery (Kotlin Common)
```kotlin
// common/src/commonMain/kotlin/.../mesh/Discovery.kt
interface DiscoveryProtocol {
    fun broadcastPresence()
    fun listenForPeers(): Flow<PeerAnnouncement>
}

// Test: Two emulators see each other
```

#### 1.2 UDP Discovery (Python)
```python
# server/amp/discovery.py
class UDPDiscovery:
    async def broadcast(self) -> None: ...
    async def listen(self) -> AsyncIterator[Peer]: ...

# Test: Python server sees Kotlin mobile
```

#### 1.3 Heartbeat Protocol
```
Message format (protobuf or JSON):
- node_id: u64
- timestamp: u64 (HLC)
- capabilities: Capabilities[]
- load: u8 (0-100)
- battery: u8 (0-100)

Test: 5s interval, 99.9% delivery
```

#### 1.4 HLC Implementation
```kotlin
// Hybrid Logical Clock for event ordering
// Test: Concurrent events ordered correctly
```

### Phase 1 Exit Criteria
| Check | Verified By |
|-------|-------------|
| Discovery works | Wireshark shows UDP packets |
| Heartbeat < 5s | Logs show regular broadcasts |
| HLC orders events | Unit test with concurrent writes |
| Two-node mesh | FOXXD + emulator see each other |

---

## Phase 2: Task Distribution (Weeks 4-5) — 35% → 55%

### Goal
Tasks route to capable nodes; failover works.

### Entry Criteria
- Phase 1 complete
- Minimum 2 nodes in test mesh

### Tasks

#### 2.1 Task Registry
```kotlin
// What tasks can each node execute?
interface TaskRegistry {
    fun canExecute(task: Task): Boolean
    fun estimateCost(task: Task): ResourceEstimate
}
```

#### 2.2 Task Offer Protocol
```
AMP Message: TASK_OFFER
- task_id: u64
- task_type: String
- payload: Bytes
- deadline: u64 (HLC)

Response: TASK_ACCEPT or TASK_DECLINE
```

#### 2.3 Leader Election
```kotlin
// Lowest node_id wins
// On leader death: re-election < 10s
// Test: Kill leader, verify failover
```

#### 2.4 First Real Task: "grant_scan"
```kotlin
// FOXXD: Receive SMS "check grants"
// Offer to Chromebook (has Kali + Python)
// Chromebook: Run scan
// Return results to FOXXD
// Display notification

// Exit: End-to-end in < 30 seconds
```

### Phase 2 Exit Criteria
| Check | Verified By |
|-------|-------------|
| Task routes correctly | Logs show offer → accept → execute |
| Failover works | Kill primary, task completes on secondary |
| Leader election < 10s | Timer test in integration suite |
| First use case works | Manual test: SMS → scan → notification |

---

## Phase 3: State & Persistence (Weeks 6-7) — 55% → 75%

### Goal
State syncs across nodes; offline works.

### Entry Criteria
- Phase 2 complete
- SQLite/Room configured

### Tasks

#### 3.1 CRDT for Agent State
```kotlin
// LWW-Element-Set for agent status
// PN-Counter for task counts
// Test: Concurrent updates converge
```

#### 3.2 Local Persistence
```kotlin
// Room database schema
// - agents table
// - tasks table  
// - state_snapshots table
// Test: Kill app, restart, state recovered
```

#### 3.3 State Sync Protocol
```
AMP Message: STATE_SYNC
- vector_clock: Map<node_id, u64>
- delta: StateDelta

Test: Node offline 1 hour, syncs correctly on reconnect
```

#### 3.4 Conflict Resolution
```kotlin
// If same task completed on two nodes:
// - HLC decides winner
// - Loser logs conflict, notifies user
// Test: Simulate network partition
```

### Phase 3 Exit Criteria
| Check | Verified By |
|-------|-------------|
| State persists offline | Airplane mode test |
| Sync converges | Jepsen-style tests pass |
| Conflicts resolved | Simulated partition test |
| Recovery < 30s | Reconnection timing test |

---

## Phase 4: Foundry Integration (Weeks 8-9) — 75% → 90%

### Goal
Every task auto-harvests; Vault updates automatically.

### Entry Criteria
- Phase 3 complete
- Task system stable

### Tasks

#### 4.1 Breadcrumb Generation
```kotlin
// On every TASK_COMPLETE:
fun generateBreadcrumb(task: Task, result: Result): Breadcrumb {
    return Breadcrumb(
        timestamp = HLC.now(),
        agent = task.agentId,
        task_type = task.type,
        description = task.description,
        outcome = result.summary,
        value_proof = result.metrics
    )
}
```

#### 4.2 Local Breadcrumb Cache
```kotlin
// Room table: breadcrumbs
// Auto-sync to server when online
// Test: Create 1000 breadcrumbs, verify no loss
```

#### 4.3 Refinery Pipeline
```python
# server/foundry/refinery.py
class Refinery:
    def weekly_digest(self) -> Digest:
        # Aggregate breadcrumbs → Win Sheet
        pass
    
    def case_study(self, project: str) -> CaseStudy:
        # Deep dive into significant work
        pass
```

#### 4.4 Vault Auto-Update
```python
# server/foundry/vault.py
class Vault:
    def publish_digest(self, digest: Digest):
        # Update VAULT/index.html
        # Commit to git
        # Push to GitHub Pages
```

### Phase 4 Exit Criteria
| Check | Verified By |
|-------|-------------|
| Every task breadcrumbs | Log inspection |
| Weekly digest auto-gen | Cron job + file exists |
| Vault updates | GitHub Pages shows new content |
| Foundry < 5 min/day | Timer on manual review |

---

## Phase 5: Production Hardening (Weeks 10-12) — 90% → 100%

### Goal
Production ready: monitored, secure, documented.

### Entry Criteria
- Phase 4 complete
- 2 weeks stable operation

### Tasks

#### 5.1 Security Audit
```bash
# Checklist:
# - [ ] Ed25519 keys never leave secure enclave
# - [ ] No hardcoded secrets
# - [ ] TLS 1.3 everywhere
# - [ ] Input validation fuzz tests
# - [ ] Dependency audit (snyk/dependabot)
```

#### 5.2 Observability
```kotlin
// Metrics: Prometheus
// Logs: Structured JSON
// Tracing: OpenTelemetry

// Dashboards:
# - Mesh health (nodes, latency)
# - Task throughput
# - Error rates
# - Battery impact (mobile)
```

#### 5.3 Documentation
```
docs/
├── API.md           # HTTP + AMP reference
├── OPERATIONS.md    # Runbook
├── TROUBLESHOOTING.md
└── SECURITY.md
```

#### 5.4 Load Testing
```python
# Simulate 100 nodes
# 1000 tasks/second
# 48 hour endurance test
# Exit: < 1% error rate, memory stable
```

### Phase 5 Exit Criteria
| Check | Verified By |
|-------|-------------|
| Security audit clean | Third-party review or checklist |
| Dashboards live | Grafana/Prometheus accessible |
| Docs complete | Another dev can deploy in 1 hour |
| Load test passed | 48h test report |

---

## Standards & Practices

### Every Phase Requires

1. **Tests**
   - Unit: > 80% coverage
   - Integration: Component interactions
   - E2E: Full user flows

2. **Code Review**
   - PR required for all changes
   - One approval minimum
   - CI must pass

3. **Documentation**
   - Architecture Decision Records (ADRs)
   - API changes documented
   - Runbook updates

4. **Demo/Review**
   - End-of-phase demo
   - Go/no-go decision
   - Next phase planning

---

## Timeline Summary

| Phase | Weeks | State | Deliverable |
|-------|-------|-------|-------------|
| 0 | 1 | 5% → 15% | Builds + CI |
| 1 | 2-3 | 15% → 35% | AMP Discovery |
| 2 | 4-5 | 35% → 55% | Task Routing |
| 3 | 6-7 | 55% → 75% | State Sync |
| 4 | 8-9 | 75% → 90% | Foundry Auto |
| 5 | 10-12 | 90% → 100% | Production |

**Total: 12 weeks to production** (June 19, 2026)

---

## Immediate Next Action

**Start Phase 0.1:** Get APK building.

```bash
cd /home/workspace/Bxthre3/projects/the-agentic-project/mobile
./gradlew assembleDebug
```

If this fails, fix it. Nothing else matters until builds work.

---

*Approved by:* _________________  
*Date:* _________________  
*Next Review:* End of Phase 0 (April 6, 2026)
