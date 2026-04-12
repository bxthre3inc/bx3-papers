# VPC Legal & OpEx Analysis

## PART 1: LEGAL STANDING

### THE SWEEPSTAKES MODEL - COMPLIANCE CHECKLIST

| Requirement | VPC Status | Risk Level |
|-------------|------------|------------|
| **No Purchase Necessary (AMOE)** | ✅ Free $C via mail-in, social | 🟢 Low |
| **Alternate Method of Entry** | ✅ Daily wheel, promos, contests | 🟢 Low |
| **$C = No Cash Value Until Played** | ✅ $C is virtual, redeemable after play | 🟢 Low |
| **GC = Play Money Only** | ✅ Gold Coins never redeemable | 🟢 Low |
| **Transparent Math** | ✅ RTP disclosed, provably fair | 🟢 Low |
| **Age Verification (18+)** | ⚠️ KYC required | 🟡 Medium |
| **Geo-Blocking (States)** | ⚠️ Must block WA, CT, ID, NV | 🟡 Medium |
| **Responsible Gaming Limits** | ⚠️ Self-exclusion, timeouts | 🟡 Medium |
| **Anti-Money Laundering** | ⚠️ Cash partner verification | 🟡 Medium |
| **Sweepstakes Registration** | ❌ Not filed (needed in FL, NY) | 🔴 High |

### LEGAL RISK ASSESSMENT

#### 🟢 GREEN (We're Good)
- Dual-currency system (GC + $C) is industry standard
- Free entry path satisfies "no purchase necessary"
- 10.009% redemption fee = revenue model, not rake
- House edge disclosed = entertainment, not investment

#### 🟡 YELLOW (Needs Attention)
- **Cash Partners**: Unlicensed money transmission risk
  - *Mitigation*: Partners are "agents" not MSBs, collateral secured
  - *Cost*: $50K legal opinion + $20K compliance system
  
- **KYC/AML**: Player verification required
  - *Mitigation*: Integrate Persona/Onfido
  - *Cost*: $2/verification, ~$200/mo at 100 players

- **State Blocking**: 4 states ban sweepstakes casinos
  - *Mitigation*: GeoComply IP + GPS verification
  - *Cost*: $5K/mo for compliance layer

#### 🔴 RED (Critical Before Launch)
- **Sweepstakes Bond**: FL and NY require $50K-100K bond
  - *Cost*: $1,500/year premium
  
- **Legal Opinion**: Need gaming counsel review
  - *Cost*: $25K-75K one-time
  
- **Terms of Service**: Must be bulletproof
  - *Cost*: $15K drafting

### COMPETITIVE LEGAL LANDSCAPE

| Platform | Legal Model | Our Difference |
|----------|-------------|----------------|
| **Chumba Casino** | Sweepstakes (GC + SC) | Same model ✅ |
| **LuckyLand Slots** | Sweepstakes | Same model ✅ |
| **Skillz** | Skill games (no chance) | We have slots 🔴 |
| **PrizePicks** | DFS (pick'em) | Different model |
| **Stake.us** | Sweepstakes + crypto | Same model ✅ |

**Verdict:** Our model is **legally identical** to Chumba/LuckyLand which operate in 49 states. The risk is operational (compliance), not structural (business model).

---

## PART 2: OPERATING EXPENSES (OpEx)

### MONTHLY FIXED COSTS (50 Players)

| Category | Item | Monthly Cost | Annual |
|----------|------|--------------|--------|
| **Legal/Compliance** | | | |
| | Gaming counsel retainer | $5,000 | $60,000 |
| | Compliance officer (part-time) | $3,000 | $36,000 |
| | KYC/AML (Persona) | $200 | $2,400 |
| | GeoComply | $5,000 | $60,000 |
| | Sweepstakes bonds (FL, NY) | $125 | $1,500 |
| **Subtotal Legal** | | **$13,325** | **$159,900** |

| **Technology** | | | |
| | Zo hosting (current) | $0 | $0 |
| | Database (Turso/libSQL) | $0 | $0 |
| | CDN (Cloudflare) | $0 | $0 |
| | Monitoring/Logs (Loki) | $0 | $0 |
| | Backup storage | $50 | $600 |
| **Subtotal Tech** | | **$50** | **$600** |

| **Payment Processing** | | | |
| | Stripe (GC sales) | $88 | $1,056 |
| | Crypto gateway (BitPay) | $200 | $2,400 |
| | Cash partner tracking | $100 | $1,200 |
| **Subtotal Payments** | | **$388** | **$4,656** |

| **Customer Support** | | | |
| | Helpdesk (Zendesk) | $100 | $1,200 |
| | Support agent (1 FTE) | $3,500 | $42,000 |
| **Subtotal Support** | | **$3,600** | **$43,200** |

| **Marketing/Acquisition** | | | |
| | Paid ads (Meta, Google) | $2,000 | $24,000 |
| | Affiliate commissions (10%) | $300 | $3,600 |
| | Influencer deals | $500 | $6,000 |
| **Subtotal Marketing** | | **$2,800** | **$33,600** |

| **Admin/Overhead** | | | |
| | Accounting/bookkeeping | $500 | $6,000 |
| | Business insurance | $200 | $2,400 |
| | Misc (office, tools) | $300 | $3,600 |
| **Subtotal Admin** | | **$1,000** | **$12,000** |

### TOTAL MONTHLY OpEx: $21,163
### TOTAL ANNUAL OpEx: $253,956

---

## PROFITABILITY AT SCALE

### CURRENT MODEL (50 Players)

| Metric | Amount |
|--------|--------|
| Gross Revenue | $55,428 |
| Less: Player Payouts | -$15,000 |
| Less: Stripe Fees | -$1,614 |
| **Gross Profit** | **$38,814** |
| Less: OpEx | -$253,956 |
| **NET PROFIT** | **-$215,142** ❌ |

**We're losing $215K/year at 50 players.**

### BREAK-EVEN ANALYSIS

To cover $253,956 OpEx with $776 profit/player:

| Players Needed | Annual Profit | Status |
|----------------|---------------|--------|
| 50 | -$215,142 | ❌ Massive loss |
| 100 | -$176,348 | ❌ Still losing |
| 200 | -$98,760 | ❌ Still losing |
| 327 | $0 | ✅ Break-even |
| 500 | $134,044 | ✅ Profitable |
| 1,000 | $522,044 | ✅ Strong profit |
| 5,000 | $3,626,044 | ✅ Scale |

### SENSITIVITY: REDUCING OpEx

**What if we cut costs?**

| Scenario | Monthly OpEx | Break-Even Players |
|----------|--------------|-------------------|
| **Full compliance** | $21,163 | 327 |
| **No legal retainer** | $16,163 | 250 |
| **DIY support** | $17,663 | 273 |
| **No marketing** | $18,363 | 284 |
| **Bare minimum** | $12,000 | 186 |

---

## REALISTIC LAUNCH STRATEGY

### PHASE 1: SOFT LAUNCH (Months 1-3)
**Goal:** 100 players, prove model

| Action | Cost | Risk |
|--------|------|------|
| Legal opinion only | $25K | Medium |
| No sweepstakes bond | $0 | Higher risk |
| DIY support (you + 1 agent) | $3,500/mo | Manageable |
| Minimal marketing | $500/mo | Slow growth |
| **OpEx** | **~$10K/mo** | |

**At 100 players:** -$6,444/mo burn rate. Need $20K seed capital.

### PHASE 2: PROPER LAUNCH (Months 4-12)
**Goal:** 300 players, break-even

| Action | Cost | Status |
|--------|------|--------|
| Full legal compliance | $15K/mo | Required |
| Marketing scale | $5K/mo | Growth |
| 2 support agents | $7K/mo | Service |
| **OpEx** | **~$27K/mo** | |

**At 300 players:** +$7,556/mo profit. Model proven.

### PHASE 3: SCALE (Year 2)
**Goal:** 1,000+ players

| Metric | Value |
|--------|-------|
| Monthly OpEx | $35K (efficiencies) |
| Monthly Profit | $43K |
| Annual Profit | $522K |
| Margin | 55% |

---

## CRITICAL SUCCESS FACTORS

### 1. PLAYER ACQUISITION COST (PAC)

| Channel | CAC | Conversion | LTV |
|---------|-----|------------|-----|
| Meta ads | $150 | 5% | $776 |
| Affiliate | $77 (10%) | 15% | $776 |
| Organic/TikTok | $20 | 2% | $776 |
| **Target CAC** | **<$100** | — | 7.7x LTV/CAC |

### 2. CHURN MANAGEMENT

| Action | Cost | Impact |
|--------|------|--------|
| Daily bonuses | $200/mo | -20% churn |
| VIP host (Platinum) | $500/mo | -50% churn |
| Retargeting ads | $300/mo | -15% churn |

### 3. CASH PARTNER ECONOMICS

| Metric | Per Partner | 10 Partners |
|--------|-------------|-------------|
| Commission paid | 1.5% avg | — |
| Monthly volume | $5K | $50K |
| Commission cost | $75 | $750 |
| **Our profit** | **$500** | **$5,000** |

Cash partners are **net positive** after secured collateral system.

---

## FINAL VERDICT

### Legal: ✅ VIABLE
- Model matches Chumba/LuckyLand (legal, operating)
- Requires $100K upfront legal + bonds
- Ongoing compliance: $15K/mo

### Economic: ⚠️ CHALLENGING
- 50 players = massive loss (-$215K/year)
- Break-even at 327 players
- Profitable at 500+ players
- **Need $50K-100K seed capital to reach 300 players**

### Timeline to Profitability
| Milestone | Players | Time | Capital Needed |
|-------------|---------|------|----------------|
| Launch | 0 | Month 1 | $25K (legal) |
| Soft launch | 100 | Month 3 | $30K (burn) |
| Break-even | 327 | Month 9 | $50K (marketing) |
| Profitability | 500 | Month 12 | Self-funded |

**Bottom line:** Legally sound, economically challenging. Need 6-9 months and $100K to reach profitability. Model works at scale (500+ players).