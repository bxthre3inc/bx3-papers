# VPC Unit Economics: $20 Player Deposit

## ASSUMPTIONS

| Variable | Value | Notes |
|----------|-------|-------|
| Player deposit | $20.00 | Entry point |
| Wager-through cycles | 5x | $20 played 5 times across games |
| Total wagered | $100.00 | $20 × 5 cycles |
| House edge | 5% | Average across slots/cards |
| Consumables attach | 25% | 25% of players buy extras |
| $C redemption rate | 40% | 40% of $C earned gets redeemed |
| Stripe fee | 2.9% + $0.30 | Per transaction |
| Redemption fee | 10% | VPC takes 10% of $C cashouts |

---

## THE MONEY FLOW

### STEP 1: Player Deposits $20

| Party | Amount |
|-------|--------|
| Player pays | $20.00 |
| Stripe fee | −$0.88 |
| **VPC nets from GC sale** | **$19.12** |

---

### STEP 2: Player Gameplay (Over ~30 Days)

Player wagers their $20 balance across 5 sessions. House edge of 5% applies per wager.

| Outcome | Amount |
|---------|--------|
| Total wagered | $100.00 |
| House edge (5%) | +$5.00 to VPC |
| Player losses back to platform | $95.00 |

---

### STEP 3: Consumables (25% Attach Rate)

| Party | Amount |
|-------|--------|
| Players who buy extras (25%) | 25% × $20 = $5.00 |
| VPC cost (digital goods) | $0.00 |
| **VPC nets from consumables** | **$5.00** |

---

### STEP 4: $C Redemption (40% Redeem)

Player earned 2,000 $C = $2.00 value. Only 40% redeem.

| Party | Amount |
|-------|--------|
| Player wants to redeem | $1.00 ($C value) |
| Redemption fee (10%) | −$0.10 to VPC |
| VPC cash payout | −$0.90 |
| **VPC nets from $C** | **+$0.10 fee − $0.90 payout = −$0.80** |

---

## NET MATH: WHAT VPC ACTUALLY KEEPS

### Revenue

| Source | Amount |
|--------|--------|
| GC sale (after Stripe) | $19.12 |
| House edge | +$5.00 |
| Consumables | +$5.00 |
| $C redemption fee | +$0.10 |
| **Total revenue** | **$29.22** |

### Costs

| Source | Amount |
|--------|--------|
| $C cash payouts | −$0.90 |
| Chargebacks/fraud buffer | −$0.50 |
| Promo GC given | −$0.00 (already accounted in $C) |
| **Total costs** | **−$1.40** |

### Net Profit Per $20 Deposit

| | Per Player |
|-|------------|
| **VPC net profit** | **$27.82** |

> The $2.00 $C bonus is a liability on day 0 but 60% of players never redeem it — that $1.20 effectively returns to VPC's P&L as the liability expires.

---

## CONSERVATIVE ESTIMATE (With Promo Spend)

If VPC runs a 20% promo match on deposits:

| | Amount |
|-|--------|
| VPC nets from GC sale | $19.12 |
| House edge | +$5.00 |
| Consumables | +$5.00 |
| $C redemption fee | +$0.10 |
| $C cash payouts | −$0.90 |
| Promo match (20% of deposit) | −$4.00 |
| **VPC conservative net** | **$24.32** |

---

## BOTTOM LINE

| Scenario | Net per $20 deposit |
|----------|---------------------|
| Base case | **$27.82** |
| Conservative (with promos) | **$24.32** |
| Aggressive (no consumables) | **$19.82** |

**VPC's unit economics are extremely strong.** Even in the worst case, the platform nets nearly 100% margin on every deposit. The house edge, consumables, and redemption fees compound to produce $20+ net profit per $20 player — one of the highest margin businesses in gaming.

---

## AT SCALE

| Players | Monthly Deposits | Conservative Net |
|---------|-----------------|-----------------|
| 10 | $200 | $243 |
| 25 | $500 | $608 |
| 50 | $1,000 | $1,216 |
| 100 | $2,000 | $2,432 |
| 500 | $10,000 | $12,160 |

**Year 1 at 100 players:** $29,184 net profit
**Year 1 at 500 players:** $145,920 net profit

---

## WHY THE NUMBERS WORK

1. **Wagering cycles multiply value** — $20 becomes $100 in action, 5% house = $5 per player
2. **Consumables attach at near-zero cost** — digital goods have 100% margin
3. **$C redemption fee covers itself** — fee income offsets most payouts
4. **60% of $C never redeemed** — liability expires as pure profit
5. **Chargeback risk is minimal** — cash partners eliminate chargebacks for cash transactions
