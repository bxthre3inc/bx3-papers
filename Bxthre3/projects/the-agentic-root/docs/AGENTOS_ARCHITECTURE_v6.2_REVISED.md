# Agentic v6.2 — Layered Determinism (Revised)

**Core Principle:** Determinism is expensive. Use it only where failure is catastrophic.

---

## The Reality Check

| Layer | Original Spec | Reality | Revision |
|-------|--------------|---------|----------|
| **AMP Messages** | Byte-exact binary | Debuggable JSON acceptable | Binary for prod, JSON for dev/debug |
| **Task Model** | Immutable FOREVER | Requirements change | Schema versioning with migrations |
| **Utilization** | 85-95% | No headroom for spikes | **70-85%** with burst capacity |
| **Git Sync** | Every action | Performance impact | Batch sync every 30s + manual override |
| **Builds** | SHA256 identical | Overkill | Release builds locked, dev builds flexible |

---

## Revised Determinism Zones

### Zone 1: STRICT (Failure = Data Loss)
| Component | Why Strict | Flexibility |
|-----------|-----------|-------------|
| Task `id` + `createdAt` | Duplication breaks harvest | None |
| Foundry VAULT writes | Append-only | None |
| AMP node IDs | Mesh routing depends on it | None |
| Ed25519 keys | Security | None |

### Zone 2: PRAGMATIC (Failure = Recoverable)
| Component | Strictness | Flexibility |
|-----------|-----------|-------------|
| Task payload | Schema validated | Extra fields ignored (forward compat) |
| AMP wire format | Binary in prod | JSON accepted for debug |
| Heartbeat timing | <5s target | <15s acceptable (grace window) |
| Build hashes | Release only | Dev builds can diverge |

### Zone 3: ADAPTIVE (Failure = Learning)
| Component | Strictness | Flexibility |
|-----------|-----------|-------------|
| Trigger cascade | 1+ actions ideal | 0 actions = warning, not error |
| Utilization | 70-85% target | 50-90% acceptable range |
| Cache warming | Every hour | Adaptive based on actual usage |
| Git sync | Batch acceptable | Conflict = prompted merge |

---

## The Failure Spectrum

```
ZONE 1 (Strict)        ZONE 2 (Pragmatic)        ZONE 3 (Adaptive)
     │                       │                         │
     ▼                       ▼                         ▼
Data loss               Recoverable              Learning opportunity
P0 alert                P2 warning               Metric only
Stop the world          Retry + log              Adjust next cycle
```

---

## What We Actually Need

| Need | Strict? | Solution |
|------|---------|----------|
| Reproducible releases | ✅ | Lock files + SHA256 |
| Debug production | ❌ | Accept JSON AMP messages |
| Handle load spikes | ❌ | **70% baseline, burst to 95%** |
| Schema evolution | ❌ | Versioned migrations, not immutable forever |
| Know what happened | ✅ | Breadcrumb log, not byte-exact builds |

---

## Revised Utilization Target

**Original:** 85-95% sustained (dangerous, no headroom)  
**Revised:** 70-85% baseline, burst to 95%, **never sustain >90%**

```python
# Smart scaling, not rigid targets
IF CPU > 85% FOR 2 MIN:
    → Scale UP: Queue more work
    
IF CPU > 92% FOR 1 MIN:
    → ALERT: "Burst zone" - OK short term only
    
IF CPU > 90% FOR 5 MIN:
    → SHED: Drop P3 tasks, preserve P0/P1
    
IF CPU > 95%:
    → P1: "Capacity exceeded, systemic risk"
```

---

## The Trade-off Matrix

**Strict is expensive because it requires:**
- More code
- More tests
- Slower iteration
- Harder debugging
- Brittle failure modes

**Use strict ONLY when:**
- Data integrity non-negotiable
- Security boundary
- Regulatory requirement
- Reproducibility demanded

**Pragmatic EVERYWHERE else.**

---

## What Changes in v6.2 (Revised)

| Decision | Before | After |
|----------|--------|-------|
| AMP dev format | Binary only | JSON accepted |
| Task schema | Immutable FOREVER | Versioned, migratable |
| Build requirements | SHA256 identical | Release only |
| Utilization target | 85-95% | 70-85% baseline, burst OK |
| Git sync | Every action | Batch 30s + conflict resolution |
| Failure cascade | 1+ actions required | Warning on 0, retry logic |

---

## Validation (Revised)

**Before:** "Byte-exact or failure"  
**After:** "Observable and recoverable"

```bash
# Check determinism where it matters
curl -s http://localhost:8080/tasks | jq '.tasks[0].id' 
# Must be UUID v4, rest flexible

python3 -c "import hashlib; print(hashlib.sha256(open('build/app-release.apk','rb').read()).hexdigest())"
# Release builds only

curl -s http://localhost:8080/health | jq '.cpu_load'
# 70-85% = green, 50-90% = yellow, >90% = red
```

---

## v6.3 Gates (Revised)

**Before:** Zero tolerance  
**After:** "Graceful in degradation"

- [ ] 70-85% utilization sustained (not 85-95%)
- [ ] JSON AMP messages work in dev mode
- [ ] Schema migration test passes (add field)
- [ ] Burst to 95% without failure
- [ ] Zero P0s from flexible layers

---

**You were right. Rigid breaks. Flexible endures.**