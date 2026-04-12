# Investor Transparency Layer
## Product Specification
### The First Agentic-Native External SaaS

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** SPEC  
**Owner:** Bxthre3 Inc

---

## 1. Product Vision

**Radical Transparency SaaS for Startup ↔ Investor Relationships**

The Investor Transparency Layer is an AI-powered platform where investors ask questions directly to an AI that queries **ground truth data** from Stripe, Linear, GitHub, Notion — without founder filtering or bias.

**The Promise:** "Ask anything. Get honest answers."

---

## 2. Product Positioning

| For | The Problem | The Solution |
|-----|-------------|--------------|
| **Founders** | Monthly investor updates are overhead | Auto-generated, data-backed reports |
| **Investors** | Trust but verify takes time | Real-time visibility, instant answers |
| **Both** | Information asymmetry creates conflict | Shared source of truth |

---

## 3. User Flow

```
FOUNDER                             PLATFORM                           INVESTOR
    │                                   │                                │
    │─── 1. Connect Stripe Account ────│                                │
    │                                   │─→ 2. Store credentials          │
    │                                   │─→ 3. Listen to webhooks        │
    │                                   │                                │
    │─→ 5. Can't hide events            │←── 4. Receive invoice.payment  │
    │    (platform owns data)           │      _succeeded webhook        │
    │                                   │                                │
    │                                   │←── 6. Investor asks: "Why did   │
    │                                   │       February MRR drop?"       │
    │                                   │                                │
    │                                   │└→ 7. AI queries:               │
    │                                   │    - Stripe events             │
    │                                   │    - Linear (bugs shipped)     │
    │                                   │    - Notion (strategy notes)   │
    │                                   │                                │
    │                                   │└→ 8. Generates response:        │
    │                                   │    "MRR drop due to 3 failed    │
    │                                   │     renewals. Bug in billing   │
    │                                   │     shipped Feb 15."           │
    │                                   │────────────────────────────────┘
```

---

## 4. Core Features

### 4.1 Natural Language Investor Queries
```
"How much runway does Company X have?"
→ AI pulls:
  - Cash balance (Stripe Connect)
  - Burn rate (payout analysis)
  - Headcount cost (Gusto integration)
  → Response: "$340K at $28K/mo burn = 12 months"

"What caused the customer churn in Q3?"
→ AI analyzes:
  - Subscription deletions (Stripe)
  - Support tickets (Zendesk)
  - Feature removals (Linear)
  → Response: "35% churned after pricing change per strategy doc"
```

### 4.2 Automated Investor Updates
- **Weekly**: Cash position, new logos, churn flags
- **Monthly**: Full metrics deck (MRR, LTV, burn, team)
- **Quarterly**: Board-ready analysis with trend forecasting
- **Alert**: Material events (large churn, delayed payout, etc.)

### 4.3 Founder Dashboard
- **What investors see** — transparent view of investor visibility
- **Blind spots** — data not yet connected
- **AI-suggested disclosures** — "Consider explaining the Feb pricing change"

---

## 5. Technical Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       INVESTOR UI                                │
│         (React App + Natural Language Query Interface)           │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                    AGENTOS PLATFORM                              │
│  ┌───────────────── Queries ──────────────────┐               │
│  │       AI Agent (Claude/GPT-4)                 │               │
│  │  - Parse investor questions                  │               │
│  │  - Determine data sources needed             │               │
│  │  - Generate SQL/API calls                    │               │
│  │  - Synthesize answers                       │               │
│  └──────────────────────────────────────────────┘               │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐│
│  │   STRIPE     │   LINEAR     │    SLACK     │   NOTION     ││
│  │  (Financial) │  (Eng Work)  │(Comms Pulse) │  (Strategy)  ││
│  └──────────────┴──────────────┴──────────────┴──────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │         SHARED WORKSPACE (Ground Truth Data)              ││
│  │  - Stripe webhook events                                    ││
│  │  - Integration sync logs                                  ││
│  │  - Immutable event stream                                   ││
│  │  - Derived metrics (MRR, burn, cohorts)                   ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. API Design

### 6.1 Investor Query Endpoint
```typescript
// POST /v1/investor/query
{
  "workspace_id": "ws_abc123",
  "question": "What's the current burn rate?",
  "context": {
    "investor_type": "lead_series_a",
    "time_range": "last_90_days"
  }
}

// Response
{
  "answer": "$42,500/month based on 90-day average",
  "sources": [
    { "type": "stripe", "account_id": "acct_xyz", "confidence": 0.95 },
    { "type": "gusto", "confidence": 0.88 }
  ],
  "data_points": {
    "last_3_months_payouts": [45000, 42000, 39000],
    "active_subscriptions": 127,
    "team_cost": 38000
  },
  "caveats": [
    "Excludes one-time legal expenses ($15K)"
  ]
}
```

---

## 7. Pricing Model

| Tier | Monthly | Includes |
|------|---------|----------|
| **Seed** | $99 | 1 startup, basic metrics, monthly updates |
| **Series A** | $299 | 3 startups, full AI queries, weekly reports |
| **Fund** | $999/mo | Unlimited, real-time alerts, custom reports |
| **Enterprise** | Custom | Portfolio analytics, API access, white-label |

**Founder Side:** Startup tiers based on revenue (free until $10K MRR).

---

## 8. Competitive Moat

| Competitor | Their Approach | Our Differentiator |
|------------|--------------|-------------------|
| Visible.vc | Founder-driven updates | AI answers from raw data, no founder filter |
| Carta | Cap table + static docs | Real-time Stripe feeds, dynamic metrics |
| FounderSuite | Manual data entry | Automated integrations, webhook ingestion |
| Traditional DD | Quarterly snapshots | Continuous, queryable truth layer |

---

## 9. Go-to-Market

1. **Beta**: 5-10 startups from Build-A-Biz portfolio
2. **Launch**: Demo to Irrig8 investors
3. **Scale**: VC partnerships → portfolio-wide adoption

---

## 10. Success Metrics

- **Adoption**: # of connected Stripe accounts
- **Query Volume**: # of investor questions answered
- **Trust Score**: % of investors who rate answers as "accurate"
- **Retention**: Monthly active investors

---

## 11. Out of Scope (v1)

- [ ] Predictive modeling (included in v2)
- [ ] Multi-currency (add for international startups)
- [ ] Historical backfill past 12 months
- [ ] Board seat voting tools

---

EPIC COMPLETE: All three architecture documents delivered.
