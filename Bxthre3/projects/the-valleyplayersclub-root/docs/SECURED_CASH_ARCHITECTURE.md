# VPC Secured Cash Network Architecture

## Core Concept
Cash partners maintain **digital collateral** equal to their maximum cash-handling capacity. When a partner accepts $100 cash from a player, their secured balance decreases by $100. When they "drop" (deposit) the physical cash, their digital collateral restores.

## Secured Balance Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    COLLATERAL LIFECYCLE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PARTNER                        VPC PLATFORM                │
│  ┌──────────┐                  ┌──────────────┐           │
│  │ $500     │ ──deposit────► │ Secured      │           │
│  │ Cash     │   collateral     │ Balance: $500│           │
│  └──────────┘                  └──────────────┘           │
│                                      │                      │
│                                      ▼                      │
│  ┌──────────┐                  ┌──────────────┐           │
│  │ Accepts  │                  │ Max Cash     │           │
│  │ $50 cash │◄───────────────│ Capacity: $500│           │
│  │ from     │   capacity      │              │           │
│  │ player   │   check         │ Commission: 5% │           │
│  └──────────┘                  └──────────────┘           │
│       │                            │                        │
│       │ credit                     │ secured                │
│       ▼                            ▼ balance                │
│  ┌──────────┐                  ┌──────────────┐           │
│  │ Player   │                  │ Secured      │           │
│  │ Wallet   │                  │ Balance: $450│ ◄── remaining
│  │ +$50     │                  │              │     capacity
│  └──────────┘                  └──────────────┘           │
│                                                              │
│  ┌──────────┘                  ┌──────────────┐           │
│  │ Physical │ ──bank drop──► │ Cash drop    │           │
│  │ $50      │   verified      │ confirmed    │           │
│  └──────────┘                  └──────────────┘           │
│                                      │                      │
│                                      ▼                      │
│                                ┌──────────────┐           │
│                                │ Secured      │           │
│                                │ Balance: $500│ ◄── restored
│                                └──────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Tier Structure

| Tier | Secured Required | Max Cash Capacity | Commission Rate | Daily Limit | Monthly Volume Cap |
|------|------------------|-------------------|-----------------|-------------|-------------------|
| 1 | $100 | $100 | 5.0% | $500 | $5,000 |
| 2 | $250 | $250 | 6.0% | $750 | $10,000 |
| 3 | $500 | $500 | 7.0% | $1,000 | $15,000 |
| 4 | $1,000 | $1,000 | 8.0% | $2,000 | $25,000 |
| 5 | $2,500 | $2,500 | 9.0% | $3,000 | $50,000 |
| 6 | $5,000 | $5,000 | 10.0% | $5,000 | $100,000 |
| 7 | $10,000 | $10,000 | 11.0% | $8,000 | $200,000 |
| 8 | $20,000 | $20,000 | 12.0% | $12,000 | $350,000 |
| 9 | $35,000 | $35,000 | 13.0% | $20,000 | $500,000 |
| 10 | $50,000 | $50,000 | 14.0% | $30,000 | $750,000 |

### Commission Formula
```
commission_rate = 5.0% + (tier - 1) * 1.0%
```

### Secured Growth Formula (Exponential)
```
secured_required = 100 * (2.0 ^ (tier - 1))  // Tiers 1-6
secured_required = 5000 * (2.0 ^ (tier - 6))   // Tiers 7-10 adjusted
```

## Database Schema

```sql
-- Secured cash partner table
CREATE TABLE secured_cash_partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  tier INTEGER DEFAULT 1,
  
  -- Collateral / Secured Balance
  secured_balance INTEGER DEFAULT 0,        -- Digital collateral held
  secured_required INTEGER DEFAULT 100,     -- Minimum for current tier
  
  -- Capacity tracking
  max_cash_capacity INTEGER DEFAULT 100,    -- Equal to secured_required
  available_capacity INTEGER DEFAULT 100,   -- secured_balance - pending_cash
  pending_cash INTEGER DEFAULT 0,           -- Cash accepted, not yet dropped
  
  -- Performance tracking
  total_deposits_processed INTEGER DEFAULT 0,
  total_volume_lifetime INTEGER DEFAULT 0,
  current_month_volume INTEGER DEFAULT 0,
  consecutive_active_days INTEGER DEFAULT 0,
  last_activity_at DATETIME,
  
  -- Tier progression
  tier_achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  tier_reviewed_at DATETIME,
  
  -- Status
  status TEXT DEFAULT 'active',             -- active, suspended, dropped
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cash drop verification (bank deposits)
CREATE TABLE cash_drops (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  drop_type TEXT,                         -- bank, vault, partner
  verification_method TEXT,               -- photo, dual_sig, gps
  verified_by TEXT,
  secured_balance_before INTEGER,
  secured_balance_after INTEGER,
  status TEXT DEFAULT 'pending',            -- pending, verified, rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified_at DATETIME
);

-- Partner deposits (funding their secured balance)
CREATE TABLE partner_collateral_deposits (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT,                            -- bank_transfer, crypto, cash
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME
);

-- Tier history (audit trail)
CREATE TABLE partner_tier_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  partner_id TEXT NOT NULL,
  old_tier INTEGER,
  new_tier INTEGER,
  reason TEXT,                            -- promotion, demotion, manual_review
  triggered_by_volume INTEGER,
  triggered_by_streak INTEGER,
  triggered_by_days_inactive INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## State Transitions

### Normal Operation
```
Partner Secured: $500
Available Capacity: $500

Player wants to deposit $100:
├── Check: $100 <= $500 (available capacity) ✓
├── Accept $100 cash
├── Credit player wallet $100
├── Secured balance: $500 → $400
├── Pending cash: $0 → $100
└── Available capacity: $500 → $400

Partner drops $100 at bank:
├── Partner logs drop in app
├── Upload receipt photo
├── VPC verifies (manual or AI)
├── Secured balance: $400 → $500 (RESTORED)
├── Pending cash: $100 → $0
└── Available capacity: $500 → $500
```

### Capacity Exhausted
```
Partner Secured: $1000
Available Capacity: $50 (nearly depleted)

Player wants to deposit $100:
├── Check: $100 <= $50? ✗ REJECTED
├── Partner must:
│   ├── Drop pending cash at bank, OR
│   ├── Add more digital collateral
└── System prevents over-extension
```

## Tier Progression Rules

### Promotion (Level Up)
```
IF (current_month_volume >= next_tier.secured_required * 2) 
   AND (consecutive_active_days >= 7)
   AND (zero_disputes_last_30_days)
THEN tier += 1
```

### Demotion (Deleveling)
```
IF (days_since_last_activity >= 14)
   OR (dispute_rate > 1%)
   OR (failed_verification_rate > 5%)
THEN tier -= 1 (minimum 1)
```

### Stagnancy Penalty
```
IF (consecutive_inactive_days >= 30)
THEN tier = MAX(1, tier - 2)
    status = 'review_required'
```

## Commission Payout

| Frequency | Trigger | Method |
|-----------|---------|--------|
| Real-time | Each deposit | Added to partner's VPC wallet |
| Weekly | Auto if balance > $50 | Bank transfer / CashApp / Crypto |
| On-demand | Manual request | Any available balance |

## Risk Controls

| Risk | Mitigation |
|------|------------|
| Partner runs with cash | Max loss = secured_balance (capped) |
| Fake receipts | Dual verification + GPS + photo hash |
| Money laundering | KYC required for tier 4+, volume flags |
| Collusion | Pattern detection, velocity checks |
| System gaming | Pending cash timeout (24h auto-flag) |

## Implementation Phases

### Phase 1: MVP (Week 1)
- [ ] Secured partner registration
- [ ] Capacity-gated deposits
- [ ] Basic cash drop logging
- [ ] Tier 1-3 manual review

### Phase 2: Automation (Week 2-3)
- [ ] Auto tier progression
- [ ] Deleveling logic
- [ ] Photo verification AI
- [ ] Partner mobile app

### Phase 3: Scale (Month 2)
- [ ] Tiers 4-10 enablement
- [ ] Bank API integration
- [ ] Multi-location partners
- [ ] Insurance integration

## API Endpoints

```
POST /api/cash/partner/register          // New partner, Tier 1
POST /api/cash/partner/collateral        // Add secured balance
GET  /api/cash/partner/status            // Capacity, tier, metrics
POST /api/cash/partner/drop              // Log cash drop
POST /api/cash/deposit/request           // (existing)
POST /api/cash/deposit/confirm           // (existing, check capacity)
GET  /api/cash/partner/commission        // Earnings, payout request
```

---
**Version:** 1.0.0  
**Classification:** Internal - Bxthre3 Inc  
**Author:** brodiblanco  
**Date:** 2026-03-18
