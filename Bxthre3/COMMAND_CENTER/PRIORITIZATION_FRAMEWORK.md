# Prioritization Framework — Agentic Product Management
**Owner:** Prime (Product Operations Lead)
**Status:** DRAFT v1.0 — Needs: Roadmap (VP Product) approval
**Last Updated:** 2026-04-03

---

## Overview

This document defines the prioritization framework used across all Bxthre3/Agentic ventures for sizing features, initiatives, and roadmap candidates.

**Framework stack:**
1. **RICE** — Primary scoring for features with clear reach × impact × confidence × effort
2. **ICE** — Fast-tranche scoring for early-stage ideas where data is thin
3. **Eisenhower** — Triage layer before scoring (urgent vs. important)
4. **MoSCoW** — Post-scoring rollout phasing (Must / Should / Could / Won't)

---

## 1. RICE Scoring

### Formula

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

### Inputs

| Input | Definition | Scale | Weight |
|---|---|---|---|
| **Reach** | Users affected per quarter | # users | Per actual |
| **Impact** | Effect on core metric per user | 0.25 / 0.5 / 1 / 2 / 3 | Multiplier |
| **Confidence** | Data quality of estimates | 50% / 80% / 100% | % |
| **Effort** | Person-weeks to ship | # weeks | Divisor |

### Impact Scale

| Score | Label | Definition |
|---|---|---|
| 3 | Massive | 3× improvement on core metric |
| 2 | High | 50–100% improvement on core metric |
| 1 | Medium | 10–50% improvement on core metric |
| 0.5 | Low | 1–10% improvement |
| 0.25 | Minimal | <1% or unmeasurable |

### Confidence Scale

| Score | Label | When to Use |
|---|---|---|
| 100% | High | A/B test data, historical同类 data |
| 80% | Medium | Analogy to similar features, user research |
| 50% | Low | Hypothesis, team intuition, no data |

### Effort Scale

Measured in **person-weeks** (pw) of full-time engineering + design.

| Score | Label | When to Use |
|---|---|---|
| 1 pw | Tiny | Copy change, config flag, trivial bug |
| 2–3 pw | Small | Simple feature, no backend |
| 4–6 pw | Medium | Feature with backend, no new infra |
| 8–12 pw | Large | New infra, integration, multi-page |
| 13+ pw | XL | New system, platform-level, 2+ quarters |

### Interpretation

| RICE Score | Tier | Action |
|---|---|---|
| >100 | 🔴 P0 | **Must do** — near-term roadmap mandatory |
| 50–100 | 🟠 P1 | **Should do** — high priority, schedule this quarter |
| 20–49 | 🟡 P2 | **Could do** — backlog, next quarter candidate |
| 5–19 | 🟢 P3 | **Nice to have** — low priority, opportunistic |
| <5 | ⚪ P4 | **Won't do** — deprioritized, revisit only if spare capacity |

---

## 2. ICE Scoring (Fast-Tranche)

### When to Use ICE

Use ICE instead of RICE when:
- Early-stage idea with no user data
- Exploratory / hack week proposals
- Time-constrained triage before full RICE is warranted
- Ventures where reach is hard to measure (pre-launch)

### Formula

```
ICE Score = Impact × Confidence × Ease
```

> **Note:** ICE does NOT include Reach. For early-stage ventures (VPC pre-launch, Irrig8 beta), Reach = 1 for all candidates until user base is defined. Use RICE once you have real reach data.

### Inputs

| Input | Definition | Scale |
|---|---|---|
| **Impact** | How much this moves the needle if successful | 1–10 |
| **Confidence** | How sure are we this will work | 10–100% |
| **Ease** | How hard to build/test | 1–10 (higher = easier) |

### Interpretation

| ICE Score | Tier |
|---|---|
| >200 | 🔴 Do first |
| 100–200 | 🟠 High priority |
| 50–99 | 🟡 Backlog |
| <50 | 🟢 Deprioritize |

---

## 3. Eisenhower Matrix (Triage Layer)

Apply BEFORE RICE/ICE to all incoming candidates.

```
                URGENT              NOT URGENT
            ┌─────────────────┬─────────────────┐
  IMPORTANT  │  🔴 DO FIRST    │  🟠 SCHEDULE    │
            │  (RICE now)     │  (RICE this q)  │
            ├─────────────────┼─────────────────┤
NOT IMPORTANT│  🟡 DELEGATE    │  ⚪ ELIMINATE   │
            │  (RICE if time) │  (Won't do)     │
            └─────────────────┴─────────────────┘
```

**Rules:**
- P1 incidents = Urgent + Important → Immediate action, skip scoring
- Strategic investments = Not Urgent + Important → Schedule in RICE
- Busy work = Urgent + Not Important → Delegate or eliminate
- Noise = Not Urgent + Not Important → Eliminate

---

## 4. MoSCoW Phasing

Post-RICE, divide backlog into shipping waves.

| Phase | Label | Definition | Max % of Capacity |
|---|---|---|---|
| **Must** | P0 | Launch blocker, legal/compliance, critical bug | 60% |
| **Should** | P1 | High-value, quarter-level impact | 20% |
| **Could** | P2 | Desirable but not essential | 15% |
| **Won't** | P3 | Explicitly deprioritized this cycle | 5% |

> Total must not exceed 100% of planned capacity. "Won't" items are not deleted — they are parked for next cycle.

---

## 5. Per-Venture Scoring Adaptations

### Irrig8 (San Luis Valley, Colorado)

| Metric | Definition |
|---|---|
| Core metric | Water saved per acre-foot irrigated |
| Secondary | Yield improvement % |
| Tertiary | Audit trail completeness (regulatory) |

**Irrig8-specific scoring rules:**
- Compliance features (water court, sensor calibration) = auto-**Must**
- Sensor integration reach = number of active pivots
- Confidence on yield impact = historical data from pilot fields

### Valley Players Club (VPC)

| Metric | Definition |
|---|---|
| Core metric | Cash-in-person conversion rate |
| Secondary | Jurisdictional compliance score |
| Tertiary | Regulatory risk score |

**VPC-specific scoring rules:**
- Legal/compliance blockers = auto-**Must**
- Geo-block implementation = auto-**Must** before launch
- Marketing/sales features = scored against expected user reach at launch

### Agentic (Platform)

| Metric | Definition |
|---|---|
| Core metric | Agent task completion rate |
| Secondary | Time-to-completion reduction |
| Tertiary | Agent utilization % |

**Agentic-specific scoring rules:**
- Platform stability/security = auto-**Must**
- MCP integration reach = number of connected agents
- Launch features scored on agent adoption rate

---

## 6. Scoring Process

### Bi-Weekly Feature Prioritization Meeting

1. **Pre-meeting (T-2 days):** Prime collects all candidate cards with draft RICE/ICE scores
2. **Meeting (60 min):** Roadmap + Prime + relevant Engineering lead review scores
3. **Calibration:** Adjust Impact/Confidence/Effort based on discussion
4. **Final score:** Agreed score recorded on card
5. **Decision:** MoSCoW phasing confirmed
6. **Output:** Ranked backlog → Roadmap (VP Product) confirms quarter schedule

### Scoring Card Template

```markdown
## Feature: [Name]
**Venture:** [Irrig8 / VPC / Agentic]
**Date scored:** YYYY-MM-DD
**Scoring method:** [RICE / ICE]

| Input | Value | Rationale |
|---|---|---|
| Reach | | |
| Impact | | |
| Confidence | | |
| Effort | pw | |

**RICE Score:** XX
**ICE Score:** XX (if applicable)
**Tier:** P0 / P1 / P2 / P3 / P4
**MoSCoW:** Must / Should / Could / Won't
**Notes:**
```

---

## 7. Quality Gates

- [ ] All P0/P1 items require Engineering lead sign-off on Effort estimate
- [ ] All Must-have items require legal/compliance review if touching regulatory domains
- [ ] Scores must be re-run if Effort estimate changes by >30% mid-sprint
- [ ] Post-launch retrospective must update Confidence estimates for future scoring

---

## 8. Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0-draft | 2026-04-03 | Prime | Initial draft |

**Approvals pending:**
- [ ] Roadmap (VP Product) — primary approver
- [ ] Atlas (COO) — secondary approver

---

*Framework owned by Prime — Product Operations Lead*
