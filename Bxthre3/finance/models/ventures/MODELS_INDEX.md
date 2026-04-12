# Financial Models — Ventures Index
**FP&A | Bxthre3 Inc / Agentic Finance Division**
**Owner:** Model (Strategic Finance Analyst)
**Last Updated:** 2026-04-06

---

## Venture-Specific Models

| Venture | Model | File | Status |
|---------|-------|------|--------|
| Irrig8 | Hardware Unit Economics | `IRRIG8_HARDWARE_MODEL.md` | 🟡 Framework |
| Irrig8 | SaaS ARR Model | `IRRIG8_SAAS_ARR_MODEL.md` | 🟡 Framework |
| Starting 5 | Freemium-to-Paid Funnel | `STARTING5_FUNNEL_MODEL.md` | 🟡 Framework |
| Valley Players Club | Revenue Share Model | `VPC_REVENUE_MODEL.md` | 🟡 Framework |
| Zoe / Bxthre3 | Enterprise Contract Model | `ZOE_ENTERPRISE_MODEL.md` | 🟡 Framework |

---

## Model Architecture

```
Bxthre3/finance/models/ventures/
├── IRRIG8_HARDWARE_MODEL.md      ← VFA, LRZB, LRZN, PMT, PFA
├── IRRIG8_SAAS_ARR_MODEL.md      ← Per-acre pricing, churn, expansion
├── STARTING5_FUNNEL_MODEL.md      ← Freemium conversion, cohort analysis
├── VPC_REVENUE_MODEL.md          ← Sweepstakes revenue share
└── ZOE_ENTERPRISE_MODEL.md      ← Enterprise contracts, licensing
```

---

## Key Assumptions Summary

### Irrig8
- SLV Irrigated Acres: 400,000
- Subscription Price: $25/acre/year
- Avg Farm Size: 500 acres
- Target Market Penetration (Yr5): 10%
- Hardware Gross Margin Target: 45%

### Starting 5
- Freemium→Paid Conversion: 3%
- Annual ARPU: $480
- Gross Margin Target: 70%
- LTV/CAC Target: >3.0x

### VPC
- Casino Partner Share: 70/30 split
- Payment Processing: 2.5%

### ZoeCorp
- Enterprise Contract Value: TBD
- Agent OS License: TBD
- Enterprise Close Rate: 20%

---

*Model | Strategic Finance Analyst | FP&A*
