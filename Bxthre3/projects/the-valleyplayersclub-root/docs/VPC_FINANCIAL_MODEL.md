# VPC Financial Model - "Clever Trap Legal Version"

## Assumptions (Conservative)

| Metric | Value | Rationale |
|--------|-------|-----------|
| **House Edge** | 6% | Industry standard (94% RTP) |
| **Avg GC Purchase/Player/Month** | $35 | Mix of minnows ($10) and dolphins ($100) |
| **$C Bonus Rate** | 10% | $1 $C per $10 GC purchased |
| **Redemption Rate** | 40% | 60% of $C churns back into gameplay |
| **Consumables Attach Rate** | 25% | % of GC spent on store vs gameplay |
| **Churn (Monthly)** | 20% | 80% retention (good for gaming) |
| **CAC (Cost to Acquire)** | $15 | Paid social, influencers, referrals |

---

## 25 PLAYER POOL (Month 1)

### Revenue Streams

| Stream | Calculation | Monthly Revenue |
|--------|-------------|-----------------|
| **GC Purchases** | 25 players × $35 | $875 |
| **House Edge (Gameplay)** | 25 players × $35 × 60% gameplay × 6% edge | $31.50 |
| **Redemption Fees** | ($875 × 10% $C) × 40% redeemed × 10.009% fee | $3.50 |
| **Consumables Store** | $875 × 25% attach | $218.75 |

**Gross Revenue: $1,128.75**

### Costs

| Cost | Calculation | Monthly Cost |
|------|-------------|--------------|
| **$C Payouts (Redemptions)** | $87.50 $C issued × 40% × $0.001 × 89.991% net | $31.50 |
| **Payment Processing (Stripe)** | $875 × 2.9% + $0.30/txn (~4 txns/player) | $54.25 |
| **Infrastructure (AWS/DB)** | Fixed | $200 |
| **Compliance/Legal Reserve** | 5% of gross | $56.44 |

**Total Costs: $342.19**

### Net Profit: $786.56/month

**Per Player: $31.46 ARPU, $31.46 profit after costs**

**Annual (25 players stable): $9,438.72**

---

## 100 PLAYER POOL (Month 3, post-growth)

### Revenue Streams

| Stream | Calculation | Monthly Revenue |
|--------|-------------|-----------------|
| **GC Purchases** | 100 × $35 | $3,500 |
| **House Edge** | $3,500 × 60% × 6% | $126 |
| **Redemption Fees** | $350 $C issued × 40% × 10.009% | $14 |
| **Consumables Store** | $3,500 × 25% | $875 |
| **Memberships (est. 10%)** | 10 players × $49 Gold | $490 |

**Gross Revenue: $5,005**

### Costs

| Cost | Calculation | Monthly Cost |
|------|-------------|--------------|
| **$C Payouts** | $350 × 40% × $0.001 × 89.991% | $126 |
| **Payment Processing** | $3,500 × 2.9% + $0.30 × 400 txns | $221.50 |
| **Infrastructure** | Scaled | $400 |
| **Support (part-time)** | $15/hr × 10 hrs | $150 |
| **Compliance/Legal** | 5% | $250.25 |
| **Cash Partner Commissions** | 1.5% of $350 redemptions | $5.25 |

**Total Costs: $1,153**

### Net Profit: $3,852/month

**Per Player: $50 ARPU, $38.52 profit**

**Annual (100 players): $46,224**

---

## SENSITIVITY ANALYSIS (100 Players)

| Scenario | Monthly Revenue | Monthly Profit | Annual Profit |
|----------|-----------------|----------------|---------------|
| **Conservative** (as above) | $5,005 | $3,852 | $46,224 |
| **Optimistic** ($50 ARPU, 15% edge) | $8,500 | $6,800 | $81,600 |
| **Pessimistic** ($20 ARPU, high churn) | $2,800 | $1,400 | $16,800 |

---

## KEY DRIVERS

### What Moves the Needle

1. **ARPU Increase** ($35 → $50 = +43% profit)
   - Better consumable bundles
   - Flash sales
   - Membership penetration

2. **Retention** (80% → 90% = +50% LTV)
   - Streak mechanics
   - Social features
   - VIP tiers

3. **Redemption Rate** (40% → 60% = +50% fee revenue)
   - But: higher payout liability
   - Sweet spot: 45-55%

4. **Consumables Attach** (25% → 40% = +60% store revenue)
   - Better UX
   - Timed offers
   - Bundling

---

## CASH FLOW TIMELINE (25 → 100 Players)

| Month | Players | Revenue | Costs | Profit | Cumulative |
|-------|---------|---------|-------|--------|------------|
| 1 | 25 | $1,129 | $342 | $787 | $787 |
| 2 | 30 | $1,355 | $410 | $945 | $1,732 |
| 3 | 40 | $1,806 | $547 | $1,259 | $2,991 |
| 4 | 55 | $2,483 | $751 | $1,732 | $4,723 |
| 5 | 70 | $3,160 | $956 | $2,204 | $6,927 |
| 6 | 85 | $3,837 | $1,161 | $2,676 | $9,603 |
| 7 | 100 | $5,005 | $1,153 | $3,852 | $13,455 |

---

## BREAK-EVEN ANALYSIS

**Fixed Costs (Monthly):** ~$500 (infra, legal, basic support)

**Break-even:** ~12 active players at $35 ARPU

**Safe Operating Minimum:** 20 players ($700 profit/month)

---

## COMPARISON: TRADITIONAL SWEEPSTAKES

| Model | Monthly (100 players) | Notes |
|-------|----------------------|-------|
| **Traditional** (no store) | $2,500 | GC purchases only, lower engagement |
| **"Clever Trap"** (above) | $5,005 | +100% via consumables/memberships |
| **Aggressive** (if legal) | $8,000+ | RTP boosts, power items — **risky** |

---

## RECOMMENDATION

**Phase 1 (Launch):** Target 25 players, prove unit economics ($31 profit/player)

**Phase 2 (Scale):** Grow to 100 players, optimize consumables attach rate

**Phase 3 (Expansion):** Add tournaments, partnerships, 500+ players

**With 100 active players:** ~$46K/year profit, enough to fund growth + salaries

**With 500 active players:** ~$230K/year, sustainable small business

**With 2,000 active players:** ~$920K/year, serious revenue

---

*Model assumes no major regulatory changes, stable payment processing, and 6-month player LTV.*
