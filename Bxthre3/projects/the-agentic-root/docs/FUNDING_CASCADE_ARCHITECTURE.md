# FUNDING CASCADE ARCHITECTURE — Event-Driven Capital Formation

**Classification:** BX3 Core Infrastructure  
**Date:** April 5, 2026  
**Philosophy:** Capital events cascade like reality vectors — no polling, pure trigger  

---

## CASCADE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                    FUNDING EVENT SOURCES                         │
├─────────────────────────────────────────────────────────────────┤
│  • Patent lawyer confirms filing       (ip.provisional.filed)   │
│  • SBIR portal deadline detected       (grant.deadline.detected)│
│  • Investor meeting booked             (investor.meeting.booked) │
│  • RBF term sheet received             (capital.rbf.offer)      │
│  • Shadow metric captured              (validation.metric.captured)│
│  • Term sheet signed                   (capital.term-sheet.signed)│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              FUNDING ORCHESTRATOR (DAP Evaluator)                │
│         Evaluates capital events against 4-Funding-Plane DAP       │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  PATENT     │   │   INVESTOR   │   │    RBF      │
    │   AGENT     │   │    AGENT     │   │   AGENT     │
    └─────────────┘   └─────────────┘   └─────────────┘
           │                  │                │
           ▼                  ▼                ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  IP Blocker │   │ Equity Gate │   │ Bridge Flow │
    │   (blocks)   │   │  (dilution) │   │  (non-dil)  │
    └─────────────┘   └─────────────┘   └─────────────┘
```

---

## 4-FUNDING-PLANE DAP

| Plane | Reality Vector Component | Threshold | Trigger Condition |
|-------|-------------------------|-----------|-------------------|
| **P1: Urgency** | Burn runway / opportunity cost | <90 days cash / >$1M opportunity | Immediate activation |
| **P2: Validation** | Proof points / credibility | Patent filed OR metrics captured | Unlock investor conversations |
| **P3: Competitive** | Term sheets / grant awards | 2+ competing offers OR $300K+ non-dilutive | Optimize leverage |
| **P4: Structural** | Equity vs non-equity preference | Non-dilutive >50% of target | Prioritize grants/RBF |

**All 4 planes must evaluate to `execute` for equity raise. Non-dilutive only needs P1+P2.**

---

## EVENT TYPES & CASCADES

### Tier 1: Reality Events (Raw Capital Signals)

```typescript
// ip.provisional.filed
{
  event_type: "ip.provisional.filed",
  tier_source: 1,
  vector: {
    t: timestamp,
    filing_number: string,
    attorney: string,
    invention_summary: "Antifragile Causal Agentic Event System",
    claims_count: 12,
    stress_capital: 0  // increases with validation
  }
}
// CASCADE: → patent-agent (confirms) → unlocks investor-readiness (all agents)

// grant.deadline.detected  
{
  event_type: "grant.deadline.detected",
  tier_source: 1,
  vector: {
    agency: "NSF|USDA|DOE|CDPHE",
    deadline_days: number,
    match_score: 0-100,  // relevance to ACA
    estimated_award: number,
    effort_hours: number
  }
}
// CASCADE: → sbir-agent (if match_score >70) → LOI drafted → orchest