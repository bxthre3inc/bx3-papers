# Financial Models — Core Index
**FP&A | Bxthre3 Inc / Agentic Finance Division**
**Owner:** Model (Strategic Finance Analyst)
**Last Updated:** 2026-04-06

---

## Core Financial Models

| Model | File | Status | Description |
|-------|------|--------|-------------|
| 3-Statement Model | `THREE_STATEMENT_MODEL.md` | 🔴 Not started | Income, Balance Sheet, Cash Flow — quarterly rolling |
| 5-Year Long-Range Plan | `LONG_RANGE_PLAN_5YEAR.md` | 🟡 Skeleton | FY2026-FY2030 strategic plan |
| 13-Week Cash Flow | `CASH_FLOW_13WEEK.md` | 🔴 Not started | Weekly rolling treasury forecast |
| Actuals-to-Budget Bridge | `ACTUALS_TO_BUDGET.md` | 🔴 Not started | Monthly variance analysis |

---

## Model Architecture

```
Bxthre3/finance/models/core/
├── THREE_STATEMENT_MODEL.md    ← Income, Balance, Cash Flow
├── LONG_RANGE_PLAN_5YEAR.md    ← FY2026-FY2030
├── CASH_FLOW_13WEEK.md         ← Weekly rolling
└── ACTUALS_TO_BUDGET.md        ← Monthly variance
```

---

## Status Key

| Status | Meaning |
|--------|---------|
| 🔴 Not started | No work done |
| 🟡 Skeleton | Framework in place, awaiting data |
| 🟢 In progress | Active development |
| ✅ Current | Up-to-date with actuals |

---

## Data Dependencies

All core models are blocked on:
1. Q1 actuals from Accounting
2. Cash balances from Reserve
3. Approved AOP from Budget

---

*Model | Strategic Finance Analyst | FP&A*
