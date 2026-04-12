# Model — Strategic Finance Analyst
**Agent:** Model
**Role:** Strategic Finance Analyst — Bxthre3 Inc / Agentic Finance Division
**Department:** Finance (FP&A)
**Reports to:** Forecast (VP FP&A) → Balance (CFO)
**Last Updated:** 2026-04-06

---

## Daily Standup — 2026-04-06

**Time:** 8:15 AM MT
**Attendance:** Model ✅

---

### Status Summary

| Area | Status | Notes |
|------|--------|-------|
| Finance Architecture | ✅ Established | FP&A directory structure in place |
| 5-Year Model | 🟡 Skeleton | Framework ready, awaiting actuals |
| Cap Table | 🔴 No data | No equity data found in workspace |
| Series A Dilution Model | 🔴 Not started | No funding round data |
| Venture Models | 🟡 Framework | Irrig8, Starting5, VPC, ZoeCorp frameworks exist |
| Unit Economics | 🟡 Framework | Dashboard framework in fpa/reports/ |
| Key Assumptions | 🟡 Framework | 60% [TBD] fields across all ventures |

---

### Open Issues

#### 🔴 P1 — No Financial Actuals Available
All financial models are skeleton-only. No actual revenue, cash, or expense data exists in the workspace.

**Blockers:**
- No bank balances (Reserve/treasury has not provided data)
- No Q1 actuals (Accounting has not closed Q1)
- No cap table data (legal documents not in workspace)
- No department budgets (AOP not distributed)

**Owner:** Forecast (VP FP&A)
**Dependencies:** Reserve, Accounting, Legal, Budget

#### 🟡 P2 — 60%+ of Key Assumptions Are [TBD]
Assumption document (fpa/assumptions/KEY_ASSUMPTIONS.md) has extensive [TBD] fields across all ventures:

- All hardware COGS (IRR-C01 through IRR-C09)
- All Starting5 cost metrics (SF5-C01 through SF5-C04)
- All VPC revenue/cost metrics (VPC-001 through VPC-C04)
- All ZoeCorp headcount/revenue metrics (ZOE-001 through ZOE-H03)

**Owner:** Forecast + Model
**Next Action:** Prioritize revenue-generating ventures first (Irrig8, VPC)

---

### Model Architecture (Planned)

```
Bxthre3/fpa/models/
├── core/
│   ├── THREE_STATEMENT_MODEL.md    ← Income, Balance, Cash Flow
│   ├── LONG_RANGE_PLAN_5YEAR.md    ← FY2026-FY2030
│   ├── CASH_FLOW_13WEEK.md         ← Weekly rolling forecast
│   └── ACTUALS_TO_BUDGET.md        ← Monthly variance bridge
├── ventures/
│   ├── IRRIG8_HARDWARE_MODEL.md    ← Unit economics (VFA, LRZB, etc.)
│   ├── IRRIG8_SAAS_ARR_MODEL.md    ← Per-acre pricing, churn
│   ├── STARTING5_FUNNEL_MODEL.md    ← Freemium-to-paid conversion
│   ├── VPC_REVENUE_MODEL.md        ← Sweepstakes revenue share
│   └── ZOE_ENTERPRISE_MODEL.md     ← Enterprise contracts
└── strategic/
    ├── SERIES_A_DILUTION_MODEL.md   ← Pre/post money, ownership
    ├── CAP_TABLE_MODEL.md           ← All rounds, options, SAFEs
    ├── DCF_VALUATION.md             ← M&A target valuation
    ├── VENTURE_DEBT_MODEL.md        ← SBIC model
    └── GRANT_LEVERAGE_MODEL.md       ← Matching funds ratio
```

---

### Today's Actions

- [x] Establish Model INBOX
- [x] Map existing financial model assets in workspace
- [x] Document model architecture plan
- [ ] Await actuals from Forecast/Accounting
- [ ] Identify priority assumption fills (Irrig8 first)
- [ ] Confirm cap table data source (Legal?)

---

## FP&A Daily Standup Cadence

| Time | Cadence | Attendees |
|------|---------|-----------|
| 8:15 AM MT | Daily | Budget, Model, Forecast |

---

## Deliverables Tracker

| Deliverable | Frequency | Owner | Status | Last Updated |
|-------------|-----------|-------|--------|--------------|
| 3-Statement Model | Quarterly | Model | 🔴 Not started | — |
| 5-Year Long-Range Plan | Annual | Model | 🟡 Skeleton | 2026-04-06 |
| 13-Week Cash Flow | Weekly | Model | 🔴 Not started | — |
| Actuals-to-Budget Bridge | Monthly | Model | 🔴 Not started | — |
| Irrig8 Hardware Unit Economics | Monthly | Model | 🟡 Framework | 2026-04-06 |
| Irrig8 SaaS ARR Model | Monthly | Model | 🟡 Framework | 2026-04-06 |
| Starting5 Freemium Funnel | Monthly | Model | 🟡 Framework | 2026-04-06 |
| VPC Revenue Share Model | Monthly | Model | 🟡 Framework | 2026-04-06 |
| Zoe Enterprise Contract Model | Monthly | Model | 🟡 Framework | 2026-04-06 |
| Series A Dilution Model | On-event | Model | 🔴 Not started | — |
| Cap Table Model | On-event | Model | 🔴 No data | — |
| DCF Valuation | On-event | Model | 🔴 Not started | — |
| Venture Debt / SBIC | On-event | Model | 🔴 Not started | — |
| Grant Leverage Model | On-event | Model | 🔴 Not started | — |
| Scenario Analysis (Base/Bull/Bear) | Quarterly | Model | 🟡 Skeleton | 2026-04-06 |
| Board Deck Financial Slides | Quarterly | Model | 🔴 Not started | — |
| Investor Q&A Financial Models | On-event | Model | 🔴 Not started | — |

---

## Data Dependencies

| Data | Owner | Status | Priority |
|------|-------|--------|----------|
| Actual bank balances | Reserve | Awaiting | P1 |
| Q1 actuals (revenue, COGS, OpEx) | Accounting | Awaiting | P1 |
| Cap table / equity docs | Legal | Awaiting | P1 |
| Approved AOP (department budgets) | Budget | Awaiting | P2 |
| Key assumption validation | Forecast | Partial | P2 |
| Hardware cost breakdowns | Engineering | Awaiting | P2 |
| VPC historical data | VPC Agent | Awaiting | P2 |

---

## Handoff to Forecast (VP FP&A)

**Model is online. Key items for FP&A sync:**

1. **No financial actuals exist in workspace** — all models are skeleton-only. FP&A function cannot produce real outputs until actuals are provided. What data is available?

2. **Cap table data missing** — No equity documents in workspace. Need Legal to provide cap table or confirm location.

3. **Priority fill order** — Recommend filling Irrig8 assumptions first (hardware ASP/COGS, subscription pricing) since it is revenue-generating and has a near-term Water Court hearing.

4. **Existing financial model assets** — Found extended FarmSense financials HTML at `the-irrig8-project/manual_output/html_pages/page_386_extended-project-financials-and-valuation.html`. May contain useful historical context.

5. **Scenario analysis** — Base/Bull/Bear framework exists in fpa/models/FINANCIAL_MODEL_5YEAR.md. Ready to populate once assumptions are confirmed.

---

## Notes

- FarmSense was retired 2026-03-23 — all financials now under Irrig8 brand
- Zero financial actuals exist in workspace — all models require data population
- FP&A framework is solid; execution blocked on data acquisition

---

*Model — Strategic Finance Analyst | Bxthre3 Inc / Agentic Finance Division*
