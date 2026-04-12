# 2B2F Multi-Entity Capital Stack Model

**Model ID:** 2B2F-CAPITAL-v0.3  
**Status:** DRAFT  
**Agent:** FABRICATOR  
**Date:** 2026-04-04

---

## Architecture Overview

```
Bxthre3 Inc (Delaware C-Corp)
│
├── Founders Pool (20% equity reserve)
├── Investor Pool (Series A/B/C)
│   ├── Series A: $8M @ $20M pre
│   ├── Series B: $50M @ $200M pre  
│   └── Series C: $200M @ $1B pre
│
└── OpCo Holdings (80% fully diluted)
    │
    ├── IRRIG8CO Holdings LLC (60% of OpCo value)
    │   ├── IRRIG8CO Ops LLC
    │   ├── IRRIG8CO IP LLC
    │   └── IRRIG8CO Data LLC
    │
    ├── VPC Holdings LLC (30% of OpCo value)
    │   ├── Valley Players Club LLC
    │   ├── VPC IP LLC
    │   └── VPC Cash Services LLC
    │
    └── Agentic Holdings LLC (10% of OpCo value)
        ├── Agentic Platform LLC
        └── Agentic Licensing LLC
```

---

## Funding Cascade Model

### Phase 1: Inception (M1-12)

| Entity | Source | Amount | Structure | Use of Funds |
|--------|--------|--------|-----------|--------------|
| Bxthre3 Inc | Founder | $150K | Equity | Incorporation, legal, initial hires |
| Bxthre3 Inc | Friends & Family | $350K | Convertible | Prototype development |
| IRRIG8CO | Bxthre3 Inc | $500K | Intercompany | M1-6 operations |
| VPC | Bxthre3 Inc | $300K | Intercompany | M1-6 operations |
| Agentic | Bxthre3 Inc | $200K | Intercompany | Platform development |
| **Total Phase 1** | — | **$1.5M** | — | — |

### Phase 2: Seed (M12-18)

| Entity | Source | Amount | Valuation | Dilution |
|--------|--------|--------|-----------|----------|
| Bxthre3 Inc | Seed Round | $2M | $8M cap | 25% |
| IRRIG8CO | Seed Round | $3M | $12M cap | 25% |
| VPC | Seed Round | $3M | $10M cap | 30% |
| **Total Phase 2** | — | **$8M** | — | — |

### Phase 3: Series A (M18-24)

| Entity | Source | Amount | Valuation | Dilution |
|--------|--------|--------|-----------|----------|
| Bxthre3 Inc | Series A | $8M | $32M pre | 20% |
| IRRIG8CO | Series A | $6M | $24M pre | 20% |
| VPC | Series A | $4M | $20M pre | 17% |
| **Total Phase 3** | — | **$18M** | — | — |

### Phase 4: Series B (M36-48)

| Entity | Source | Amount | Valuation | Dilution |
|--------|--------|--------|-----------|----------|
| Bxthre3 Inc | Series B | $50M | $200M pre | 20% |
| IRRIG8CO | Series B | $30M | $150M pre | 17% |
| VPC | Series B | $20M | $120M pre | 14% |
| **Total Phase 4** | — | **$100M** | — | — |

---

## Fully Diluted Cap Table (M48 Projection)

| Stakeholder | Bxthre3 Inc | IRRIG8CO | VPC | Agentic | Effective % |
|-------------|-------------|----------|-----|---------|-------------|
| Founders | 35% | 40% | 42% | 60% | 38% |
| Seed Investors | 15% | 18% | 20% | 15% | 17% |
| Series A | 12% | 15% | 12% | 10% | 13% |
| Series B | 16% | 12% | 10% | 8% | 13% |
| Option Pool | 12% | 10% | 10% | 5% | 11% |
| Bxthre3 Inc (holdco) | — | 5% | 6% | 2% | 8% |

---

## Intercompany Arrangements

### Funding Flows

```
Bxthre3 Inc HoldCo
    ↓ Management fees (5% of OpCo revenue)
    ↓ Equity investments (dilutive)
    ↓ Debt financing (8% interest)
    
OpCo Subsidiaries
    ↑ Dividend distributions (post-tax profits)
    ↑ IP licensing fees (arm's length)
    ↑ Service fees (shared services)
```

### Shared Services Model

| Service | Provider | Consumer | Pricing |
|---------|----------|----------|---------|
| Agentic Platform | Agentic LLC | IRRIG8CO, VPC | $50K/year base + $1/user |
| Legal/Compliance | Bxthre3 Inc | All OpCos | $200K/year allocated |
| Accounting/Finance | Bxthre3 Inc | All OpCos | $150K/year allocated |
| Engineering | IRRIG8CO | VPC, Agentic | Cost + 15% |
| Data Infrastructure | IRRIG8CO Data | All OpCos | $0.01/API call |

---

## Dilution Waterfall Scenarios

### Scenario A: Successful Exit at M120 ($50B valuation)

| Round | Investment | Ownership | Exit Value | Multiple |
|-------|------------|-----------|------------|----------|
| Founder (sweat) | $500K equiv | 35% | $17.5B | 35,000x |
| Seed | $2M | 15% | $7.5B | 3,750x |
| Series A | $8M | 12% | $6.0B | 750x |
| Series B | $50M | 16% | $8.0B | 160x |
| Series C | $200M | 10% | $5.0B | 25x |
| Option Pool | — | 12% | $6.0B | — |

### Scenario B: Moderate Exit at M84 ($5B valuation)

| Round | Investment | Ownership | Exit Value | Multiple |
|-------|------------|-----------|------------|----------|
| Founder | $500K equiv | 38% | $1.9B | 3,800x |
| Seed | $2M | 18% | $900M | 450x |
| Series A | $8M | 14% | $700M | 88x |
| Series B | $50M | 15% | $750M | 15x |
| Option Pool | — | 15% | $750M | — |

### Scenario C: Down Round at M48 ($50M valuation)

| Round | Investment | Ownership | Paper Value | Status |
|-------|------------|-----------|-------------|--------|
| Founder | $500K equiv | 45% | $22.5M | Impaired |
| Seed | $2M | 22% | $11M | Break-even |
| Series A | $8M | 18% | $9M | -44% |
| Series B | $50M | 15% | $7.5M | -85% |

---

## Risk Mitigation: Cross-Guarantee Firewall

### Structuring Principles

1. **No Cross-Guarantees:** Each OpCo is bankruptcy-remote
2. **Non-Consolidation Opinion:** Legal separation for creditor protection
3. **Arm's Length Pricing:** All intercompany transactions at market rates
4. **Separate Boards:** Independent directors for each OpCo

### Liability Isolation

| Risk Type | IRRIG8CO | VPC | Agentic |
|-----------|----------|-----|---------|
| Product Liability | Product insurance: $5M | Gaming bond: $750K | E&O: $2M |
| Regulatory Fines | N/A | State bonds: $500K | N/A |
| IP Infringement | IP insurance: $3M | IP insurance: $2M | IP insurance: $5M |
| Data Breach | Cyber: $5M | Cyber: $3M | Cyber: $5M |

---

## Liquidity Management

### Cash Reserve Requirements

| Entity | Operating Reserve | Growth Reserve | Emergency Fund | Total |
|--------|-------------------|----------------|----------------|-------|
| Bxthre3 Inc | $500K | $1M | $500K | $2M |
| IRRIG8CO | $1M | $2M | $1M | $4M |
| VPC | $750K | $1.5M | $750K | $3M |
| Agentic | $250K | $500K | $250K | $1M |

### Undrawn Credit Facilities

| Facility | Amount | Interest | Covenants |
|----------|--------|----------|-----------|
| SVB Line of Credit | $5M | Prime + 2% | 12-month runway |
| Founder Note | $1M | 6% | Subordinated |
| Revenue-Based Financing | $3M | 1.5x repayment | Revenue >$50K/mo |

---

## Founder Economics

### Jeremy Beebe (brodiblanco) — M120 Projection

| Component | Basis | Ownership | M120 Value |
|-----------|-------|-----------|------------|
| Bxthre3 Inc Founder Equity | Sweat + cash | 35% | $17.5B @ $50B exit |
| IRRIG8CO Founder Equity | Sweat | 40% → 20% via holdco | $2.0B |
| VPC Founder Equity | Sweat | 42% → 15% via holdco | $1.5B |
| Agentic Founder Equity | Sweat | 60% → 10% via holdco | $500M |
| **Total Effective** | — | — | **$21.5B** |

---

## Next Steps

1. Legal review of multi-entity structure (Delaware counsel)
2. Tax optimization study (transfer pricing, IP migration)
3. Investor presentation (5-slide version)
4. Term sheet templates (NVCA standard with Bxthre3 modifications)

---

*Model Version: 0.3 | Next Update: Post-Series A close*
