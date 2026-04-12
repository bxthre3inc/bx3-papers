# Key Assumption Documentation
**FP&A — Bxthre3 Inc / Agentic Finance Division**
**Version:** 1.0 | **Date:** 2026-04-06 | **Status:** Initial Framework

---

## Purpose

This document captures the canonical key assumptions underlying all financial models, budgets, and forecasts across the Bxthre3 portfolio. Assumptions are tagged by venture and categorized by confidence level. All models must trace to these assumptions.

---

## Assumption Governance

| Tag | Meaning |
|-----|---------|
| `[LOCKED]` | Confirmed by leadership, not to change without CFO approval |
| `[REVIEW]` | Under review, may change with updated data |
| `[INFERRED]` | Estimated based on limited data, requires verification |

---

## Irrig8 (formerly FarmSense)

### Revenue Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| IRR-001 | SLV Irrigated Acreage | 400,000 acres | `[LOCKED]` | Market research |
| IRR-002 | Target Market Penetration (Year 1) | 1.0% | `[REVIEW]` | Conservative estimate |
| IRR-003 | Target Market Penetration (Year 5) | 10.0% | `[REVIEW]` | Long-range goal |
| IRR-004 | Subscription Price (per acre/year) | $25.00 | `[LOCKED]` | Pricing model |
| IRR-005 | Hardware ASP (VFA) | TBD | `[REVIEW]` | Cost-plus pricing |
| IRR-006 | Hardware ASP (LRZB) | TBD | `[REVIEW]` | Cost-plus pricing |
| IRR-007 | Pilot-to-Production Conversion Rate | 60% | `[INFERRED]` | Industry benchmark |
| IRR-008 | Average Farm Size | 500 acres | `[REVIEW]` | SLV agricultural data |

### Cost Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| IRR-C01 | Hardware COGS — VFA | TBD | `[INFERRED]` | Component cost analysis |
| IRR-C02 | Hardware COGS — LRZB | TBD | `[INFERRED]` | Component cost analysis |
| IRR-C03 | Hardware COGS — LRZN | TBD | `[INFERRED]` | Component cost analysis |
| IRR-C04 | Hardware COGS — PMT | TBD | `[INFERRED]` | Component cost analysis |
| IRR-C05 | Hardware COGS — PFA | TBD | `[INFERRED]` | Component cost analysis |
| IRR-C06 | Hardware Gross Margin Target | 45% | `[LOCKED]` | Strategic target |
| IRR-C07 | Sensor Hardware Life (depreciation) | 5 years | `[LOCKED]` | Engineering spec |
| IRR-C08 | Installation Cost (per acre) | TBD | `[INFERRED]` | Pilot data needed |
| IRR-C09 | Support Cost (per customer/year) | TBD | `[INFERRED]` | SaaS benchmark |

### Growth Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| IRR-G01 | ARR Growth Rate (Year 1) | TBD | `[INFERRED]` | Pipeline analysis |
| IRR-G02 | ARR Growth Rate (Year 3) | TBD | `[INFERRED]` | Model projection |
| IRR-G03 | ARR Growth Rate (Year 5) | TBD | `[INFERRED]` | Long-range plan |
| IRR-G04 | Churn Rate (annual) | 10% | `[INFERRED]` | SaaS benchmark |
| IRR-G05 | Net Revenue Retention | 110% | `[INFERRED]` | Expansion revenue assumption |

---

## Starting 5

### Revenue Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| SF5-001 | Freemium to Paid Conversion | 3.0% | `[INFERRED]` | SaaS benchmark |
| SF5-002 | Monthly ARPU (paid tier) | TBD | `[REVIEW]` | Pricing model |
| SF5-003 | Annual ARPU (paid tier) | TBD | `[REVIEW]` | Pricing model |
| SF5-004 | Freemium User Growth (monthly) | TBD | `[INFERRED]` | Marketing plan |
| SF5-005 | Paid User Growth (monthly) | TBD | `[INFERRED]` | Pipeline |

### Cost Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| SF5-C01 | AI Cost per User (monthly) | TBD | `[INFERRED]` | Infrastructure analysis |
| SF5-C02 | Gross Margin Target | 70% | `[LOCKED]` | SaaS strategic target |
| SF5-C03 | COGS — AI Inference | TBD | `[INFERRED]` | Cloud cost model |
| SF5-C04 | COGS — Data Storage | TBD | `[INFERRED]` | Storage cost model |

### SaaS Metrics

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| SF5-M01 | Monthly Churn Rate | 5.0% | `[INFERRED]` | Early-stage SaaS |
| SF5-M02 | LTV / CAC Target | 3.0x | `[LOCKED]` | Series A threshold |
| SF5-M03 | CAC (blended) | TBD | `[INFERRED]` | Marketing model |
| SF5-M04 | Payback Period Target | 12 months | `[LOCKED]` | Strategic target |

---

## Valley Players Club

### Revenue Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| VPC-001 | Sweepstakes Revenue per Customer (monthly) | TBD | `[INFERRED]` | Historical data |
| VPC-002 | Active Sweepstakes Participants | TBD | `[INFERRED]` | User model |
| VPC-003 | Casino Partner Revenue Share | 70/30 | `[LOCKED]` | Partnership agreement |
| VPC-004 | Sweepstakes Conversion Rate | TBD | `[INFERRED]` | Gaming industry |

### Cost Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| VPC-C01 | Gaming License (annual) | TBD | `[REVIEW]` | Regulatory |
| VPC-C02 | Compliance Cost (monthly) | TBD | `[INFERRED]` | Legal estimate |
| VPC-C03 | Payment Processing (% of revenue) | 2.5% | `[LOCKED]` | Payment processor |
| VPC-C04 | Customer Support (per ticket) | TBD | `[INFERRED]` | Operations estimate |

---

## Zoe / Bxthre3 Corporate

### Revenue Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| ZOE-001 | Enterprise Contract (avg annual) | TBD | `[INFERRED]` | Sales pipeline |
| ZOE-002 | Agent OS License (per agent/month) | TBD | `[REVIEW]` | Pricing model |
| ZOE-003 | Open Source Adoption Rate | TBD | `[INFERRED]` | Community model |
| ZOE-004 | Enterprise Close Rate | 20% | `[INFERRED]` | SaaS benchmark |
| ZOE-005 | Sales Cycle (enterprise) | 90 days | `[INFERRED]` | Sales estimate |

### Headcount Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| ZOE-H01 | Avg Fully-Loaded Cost per Employee | TBD | `[REVIEW]` | HR data |
| ZOE-H02 | Headcount Growth Rate (annual) | TBD | `[INFERRED]` | Operating plan |
| ZOE-H03 | Contractor Ratio | 20% | `[REVIEW]` | Operating model |

### Cap Table Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| ZOE-E01 | Fully Diluted Shares (current) | TBD | `[LOCKED]` | Legal docs |
| ZOE-E02 | Option Pool (% of fully diluted) | 10% | `[LOCKED]` | Board resolution |
| ZOE-E03 | Series A Pre-Money Valuation | TBD | `[INFERRED]` | Fundraising target |

---

## Macro Assumptions

| ID | Assumption | Value | Confidence | Source |
|----|-----------|-------|------------|--------|
| MAC-001 | Revenue Inflation Rate | 3.0% | `[LOCKED]` | Internal planning |
| MAC-002 | COGS Inflation Rate | 2.5% | `[LOCKED]` | Internal planning |
| MAC-003 | Discount Rate (DCF) | 12.0% | `[LOCKED]` | WACC analysis |
| MAC-004 | Terminal Growth Rate | 3.0% | `[LOCKED]` | Long-term GDP |
| MAC-005 | Burn Multiple (Series A target) | <1.5x | `[LOCKED]` | Market standard |

---

## Change Log

| Date | Assumption | Change | Approved By |
|------|-----------|--------|-------------|
| 2026-04-06 | Initial framework | Created | Forecast |

---

*Document Owner: Forecast (VP FP&A)*
*Next Review: 2026-04-13*
