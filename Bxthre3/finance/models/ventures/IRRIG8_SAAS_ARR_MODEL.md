# Irrig8 SaaS ARR Model
**FP&A | Bxthre3 Inc / Agentic Finance Division**
**Venture:** Irrig8 (formerly FarmSense — retired 2026-03-23)
**Model:** Strategic Finance Analyst (Model)
**Version:** 1.0 | **Date:** 2026-04-06 | **Status:** Skeleton — Awaiting Actuals

---

## Purpose

Model Irrig8 subscription revenue (ARR) based on per-acre pricing, market penetration, churn, and expansion revenue.

---

## Market Sizing

| Parameter | Value | Source |
|-----------|-------|--------|
| Total SLV Irrigated Acres | 400,000 | Market research [LOCKED] |
| Target Penetration (Year 1) | 1.0% | [REVIEW] |
| Target Penetration (Year 5) | 10.0% | [REVIEW] |
| Average Farm Size | 500 acres | SLV data [REVIEW] |

---

## Revenue Model — Base Case

| Metric | FY2026 | FY2027 | FY2028 | FY2029 | FY2030 |
|--------|--------|--------|--------|--------|--------|
| Acres Under Management | 4,000 | 10,000 | 20,000 | 30,000 | 40,000 |
| Subscription Price ($/acre/year) | $25.00 | $25.00 | $25.00 | $25.00 | $25.00 |
| ARR (Subscription) | $100,000 | $250,000 | $500,000 | $750,000 | $1,000,000 |
| YoY Growth | — | 150% | 100% | 50% | 33% |

---

## ARR Build — Funnel Model

| Stage | FY2026 | FY2027 | FY2028 | FY2029 | FY2030 |
|-------|--------|--------|--------|--------|--------|
| **Acres Under Mgmt (BOY)** | — | 4,000 | 10,000 | 20,000 | 30,000 |
| + New Acres (new farms) | 4,000 | 6,000 | 10,000 | 10,000 | 10,000 |
| - Churned Acres | — | (400) | (1,000) | (2,000) | (3,000) |
| + Expansion (upsells) | — | 400 | 1,000 | 2,000 | 3,000 |
| **Acres Under Mgmt (EOY)** | **4,000** | **10,000** | **20,000** | **30,000** | **40,000** |

---

## Churn & Retention

| Metric | Value | Source |
|--------|-------|--------|
| Annual Churn Rate | 10% | [INFERRED] — SaaS benchmark |
| Net Revenue Retention | 110% | [INFERRED] — assumes expansion |
| Pilot-to-Production Conversion | 60% | [INFERRED] |

---

## Cohort Analysis

| Cohort Year | Farms Entering | Conversion to Paid | ARR (Year 1) |
|------------|---------------|-------------------|--------------|
| FY2026 | [TBD] | [TBD] | $100,000 |
| FY2027 | [TBD] | [TBD] | $250,000 |
| FY2028 | [TBD] | [TBD] | $500,000 |

---

## Key Metrics — Series A Readiness

| Metric | FY2026 | FY2027 | FY2028 | Target |
|--------|--------|--------|--------|--------|
| ARR | $100K | $250K | $500K | >$2M |
| ARR Growth (YoY) | — | 150% | 100% | >100% |
| Gross Margin | [TBD] | [TBD] | [TBD] | >60% |
| LTV/CAC | [TBD] | [TBD] | [TBD] | >3.0x |

---

## Pricing

| Tier | Price | Description |
|------|-------|-------------|
| Base | $25/acre/year | Core Irrig8 OS |
| Premium | [TBD] | + advanced analytics |
| Enterprise | [TBD] | + white-glove support |

---

## Notes

- Subscription pricing confirmed at $25/acre/year [LOCKED]
- All other assumptions require validation from actual pilot data
- Model ready to populate once first paying customers are confirmed

---

*Document Owner: Model (Strategic Finance Analyst)*
*Status: Awaiting pilot/production actuals*
