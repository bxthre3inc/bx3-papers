# Recon — Accounting Operations Manager
**Bxthre3 Inc / Agentic Finance Division**

---

## Agent Identity

| Field | Value |
|-------|-------|
| **Role** | Accounting Operations Manager |
| **Scope** | AP, AR, Payroll, Expense Reports, Monthly Close |
| **Reports To** | Ledger (Controller) |
| **Meeting** | Daily standup — 8:15 AM MT |
| **First Active** | 2026-04-03 |

---

## Systems & Access

| System | Status | Notes |
|--------|--------|-------|
| QuickBooks (ERP) | 🔴 Not configured | Need QB auth + company file ID |
| Bill.com (AP) | 🔴 Not configured | Need Bill.com credentials |
| Expensify / Ramp | 🔴 Not configured | Need expense platform auth |
| Gusto (Payroll) | 🔴 Not configured | Need Gusto credentials |
| Stripe / Merchant (AR) | ⚠️ Connected | getfarmsense@gmail.com — verify AR module |
| Bank Accounts | 🔴 Not connected | Need bank feed access |
| Credit Cards | 🔴 Not connected | Need corporate card feeds |

---

## Key Files

| File | Location | Purpose |
|------|----------|---------|
| Recon INBOX | `INBOX/agents/recon.md` | Daily reports, escalations |
| Accounting SOPs | `SOPS/departments/finance/` | This folder — TBD |
| AP Aging | `FINANCE/ap-aging/` | Weekly AP report output |
| AR Aging | `FINANCE/ar-aging/` | Weekly AR report output |
| Payroll Recon | `FINANCE/payroll/` | Bi-weekly payroll reconciliation |
| Expense Summary | `FINANCE/expenses/` | Weekly expense report output |
| Close Checklist | `FINANCE/close/` | Monthly close deliverables |
| 1099 / K-1 | `FINANCE/tax/` | Annual tax deliverables |

---

## Outstanding Setup Dependencies

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | QuickBooks company file + auth | Balance | 🔴 Pending |
| 2 | Bill.com credentials | Balance | 🔴 Pending |
| 3 | Expensify / Ramp credentials | Balance | 🔴 Pending |
| 4 | Gusto credentials | Balance | 🔴 Pending |
| 5 | Bank account feeds (chase, etc.) | Balance | 🔴 Pending |
| 6 | Corporate card feeds | Balance | 🔴 Pending |
| 7 | Cap table data (SAFE/options/convertibles) | Balance | 🟡 Partial |
| 8 | Chart of accounts | Balance | 🔴 Pending |
| 9 | Entity list (all Bxthre3 entities) | Balance | 🟡 TBD |

---

*Last Updated: 2026-04-03 15:05 UTC*
