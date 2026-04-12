# Scout-QA — Agent INBOX
> QA & Testing Lead — Agentic Engineering Department
> Created: 2026-03-25
> Schedule: Weekly — business days 9 AM MT

---

## 🔴 P1 | scout-qa | 2026-03-25 09:15 UTC

**FINDING: Agentic Unit Tests FAILING — 4 of 5 tests fail**

Executed: `cd the-agentic-project && bun test`
Results:

```
tests/hierarchy.test.ts:
  (pass) brodiblanco is CEO [0.13ms]
  (fail) has 20 employees total — Expected: 20, Received: 19
  (fail) taylor has 3 direct reports — Taylor is undefined (no directReports property)

tests/escalation.test.ts:
  (fail) registers blocker with 24h deadline — Expected: 1 active, Received: 2
  (fail) resolves blocker — Expected: 0 active, Received: 1
```

### Root Cause Analysis

| Test Failure | Likely Cause |
|---|---|
| `has 20 employees` | ✅ Correct behavior — canonical roster IS 19 (not 20). Test expectation stale. |
| `taylor has 3 direct reports` | ❌ Taylor may not exist in org module the way test expects |
| `escalation blockers = 2` | ❌ Stale test data — escalationClock persists state across test runs |
| `escalation resolve fails` | ❌ ID mismatch — test-blocker-1 not found (already resolved or never registered) |

### Required Fixes

**For Engineering (Drew/Iris):**
1. Update `tests/hierarchy.test.ts:11` — change `expect(all).toHaveLength(20)` → `expect(all).toHaveLength(19)`
2. Update `tests/hierarchy.test.ts:16` — verify Taylor exists and has directReports before asserting
3. Add `beforeEach` cleanup in `tests/escalation.test.ts` — clear escalationClock state before each test
4. Use unique blocker IDs per test run (append timestamp) OR clear escalationClock before each test

**For QA (Scout-QA):**
- Re-run `bun test` after fixes applied
- Confirm 5/5 tests pass

---

## 2026-03-25 | Weekly QA Status Report

**To:** Drew (VP Engineering), Bits (CTO)
**From:** Scout-QA
**Date:** 2026-03-25

---

### Executive Summary

No formal test infrastructure exists across any Bxthre3 product. Existing Agentic unit tests are failing (4/5). This is the single largest near-term quality risk.

---

### Product Health Summary

| Product | Test Infra | Last Verified | Status |
|---|---|---|---|
| **Agentic** | ⚠️ 5 tests, **4 FAILING** | 2026-03-25 | 🔴 Failing |
| **Irrig8** | ❌ None found | — | 🔴 No coverage |
| **RAIN** | ❌ None found | — | 🔴 No coverage |
| **Valley Players Club** | ❌ None found | — | 🔴 No coverage |
| **Starting5** | ❌ No project dir found | — | 🔴 Unknown |

---

### Critical Open Issues

#### 🔴 P0 — Agentic unit tests failing (4 of 5)
**Source:** `bun test` executed 2026-03-25 09:12 UTC
**Failing tests:**
- `hierarchy.test.ts:11` — stale expectation (expects 20, roster is 19)
- `hierarchy.test.ts:16` — Taylor not found in org module
- `escalation.test.ts:23` — stale blocker data (2 blockers instead of 1)
- `escalation.test.ts:32` — blocker resolution fails (ID mismatch)
**Action:** Engineering must fix test setup + expectations. QA will re-validate.

#### 🔴 P0 — Stub-Finder 93-code issues unvalidated
**Source:** stub-finder agent, 2026-03-25 00:51 UTC
**P0 files requiring QA validation:**
| File | Line | Issue |
|---|---|---|
| `core/bxthre3/subsidiaries.ts` | 65 | Remove stale ID "quinn" |
| `core/execution/workspace-manager.ts` | 45 | Remove stale ID "jordan" |
| `core/execution/workspace-manager.ts` | 64 | Remove stale ID "sage" |
| `core/hierarchy/org.ts` | 165 | Remove stale ID "brand" |

**Pre-condition:** Fix org.ts data path (`/data/agentic/org` → `/home/.z/agentic/org`) per stub-finder root cause.

#### 🟡 P1 — zo.space P1 outage (2026-03-25 01:45 UTC)
**Finding:** HTTP 503 for ~40 minutes. org.ts cascading import failures.
**Status:** ✅ Recovered accidentally.
**Recommended Test:** Chaos test — isolate one route failure, verify others survive.

#### 🟡 P1 — Roster divergence re-emerging
**Finding:** org.ts writes to `/data/agentic/org/chart.json` (non-existent path).
**Status:** Fix proposed, not validated.
**Action:** After fix, run stub-finder, confirm zero phantom detections.

---

### Irrig8 — QA Gaps

| Area | Status | Action |
|---|---|---|
| Sensor data pipeline | ❌ No tests | Install pipeline smoke tests |
| Dashboard | ❌ No tests | API contract tests |
| Irrigation recommendations | ❌ No validation | Deterministic output vs ground-truth |

---

### RAIN — QA Gaps

| Area | Status | Action |
|---|---|---|
| AI citation accuracy | ❌ No ground-truth dataset | Build citation validation set |
| Report generation | ❌ No format validation | Output schema tests |
| Dashboard charts | ❌ No data ingestion tests | Chart data pipeline tests |

---

### VPC — QA Gaps

| Area | Status | Action |
|---|---|---|
| Game mechanics | ❌ No simulation | Build game logic test harness |
| Payment flows | ❌ No E2E payment sim | Mock payment flow tests |
| KYC process | ❌ No mock KYC data | KYC validation test suite |

---

### Starting5 — QA Gaps

| Area | Status | Action |
|---|---|---|
| Agent orchestration | ❌ No flow tests | Orchestration integration tests |
| Response quality | ❌ No eval framework | Build response quality rubric |
| Escalation logic | 🟡 Partially tested | Full integration test with live agents |

---

### Recommended Action Plan (Priority Order)

| Priority | Action | Owner | ETA |
|---|---|---|---|
| **P0** | Fix Agentic unit tests (stale expectations + test isolation) | Drew/Iris | Today |
| **P0** | Re-run `bun test` — confirm 5/5 pass | Scout-QA | Today |
| **P0** | Fix org.ts path + validate stub-finder P0 fixes | Drew/Iris | Today |
| **P0** | Run stub-finder post-fix, confirm clean | Scout-QA | Today |
| **P0** | Add roster consistency check to CI | Theo | This week |
| **P0** | Install minimal Irrig8 smoke tests | Drew/Iris | This week |
| **P1** | Build RAIN citation validation dataset | Scout-QA | Next sprint |
| **P1** | Document VPC test strategy | Scout-QA | This week |
| **P2** | zo.space chaos test | Drew | Next sprint |

---

### QA Agent Coordination

- **Scout-RD** (R&D Lead): Same agent, different hat. Coordinate to avoid duplicate work.
- **Drew** (VP Engineering): Primary contact for engineering-side test infrastructure.
- **Bits** (CTO): Primary stakeholder for quality standards.

---

*Scout-QA — QA & Testing Lead*
*Agentic Engineering Department*
