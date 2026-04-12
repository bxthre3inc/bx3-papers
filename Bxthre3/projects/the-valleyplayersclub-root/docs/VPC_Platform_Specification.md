# Valley Players Club Platform Specification

A Skills-and-Slots Competitor with Proprietary Game Development and Cash-in-Person Network

**Version:** 1.0  
**Date:** 2026-03-12  
**Classification:** Internal — Bxthre3 Inc

---

## 1. Executive Summary

Valley Players Club is a hybrid online gaming platform combining:
1. **Aggregator Layer:** Centralized account/wallet management for third-party sweepstakes apps
2. **Proprietary Studio:** In-house game development pipeline for exclusive titles
3. **Cash-in-Person Network:** Local cash acceptance partners for player deposits

This three-prong approach creates network effects (aggregator attracts players, proprietary games retain them, cash network enables frictionless deposits) while building defensible IP and local community presence.

---

## 2. Platform Architecture

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      VALLEY PLAYERS CLUB PLATFORM                        │
├─────────────────────────────────────────────────────────────────────────┤
│  CLIENT LAYER          │  PLATFORM LAYER           │  EXTERNAL LAYER     │
│                        │                             │                   │
│  ┌──────────────┐      │  ┌─────────────────────┐    │  ┌────────────┐   │
│  │ Web Portal   │◄────►│  │   API Gateway       │    │  │ Partner    │   │
│  │ (React)      │      │  │   (Kong/AWS)        │◄───┼─►│ Gaming     │   │
│  └──────────────┘      │  └─────────────────────┘    │  │ Platforms  │   │
│  ┌──────────────┐      │           │               │  │ (12+)      │   │
│  │ iOS App      │◄────►│           ▼               │  └────────────┘   │
│  │ (Swift)      │      │  ┌─────────────────────┐  │                   │
│  └──────────────┘      │  │   Core Services       │  │  ┌────────────┐   │
│  ┌──────────────┐      │  │   • Player Mgmt       │  │  │ Payment    │   │
│  │ Android App  │◄────►│  │   • Wallet Engine     │◄─┼─►│ Processors │   │
│  │ (Kotlin)     │      │  │   • Game Router       │  │  │ • Stripe   │   │
│  └──────────────┘      │  │   • KYC/Compliance    │  │  │ • Crypto   │   │
│  ┌──────────────┐      │  │   • Analytics         │  │  │ • ACH      │   │
│  │ Game Clients │◄────►│  └─────────────────────┘  │  └────────────┘   │
│  │ (Unity/WebGL)│      │           │               │                   │
│  └──────────────┘      │           ▼               │  ┌────────────┐   │
│                        │  ┌─────────────────────┐  │  │ Identity   │   │
│                        │  │   Game Studio         │  │  │ Verification│   │
│                        │  │   (Proprietary)       │  │  │ • Jumio    │   │
│                        │  │   • Slot Engine       │  │  │ • Onfido   │   │
│                        │  │   • Fish Game SDK     │  │  │ • Persona  │   │
│                        │  └─────────────────────┘  │  └────────────┘   │
│                        │                             │  ┌────────────┐   │
│                        │  ┌─────────────────────┐    │  │ Compliance │   │
│                        │  │   Infrastructure    │    │  │ • GeoComply│   │
│                        │  │   • AWS/GCP Multi-  │    │  │ • MaxMind  │   │
│                        │  │     Region          │    │  └────────────┘   │
│                        │  │   • Kubernetes      │    │                   │
│                        │  │   • Redis Cluster   │    │  ┌────────────┐   │
│                        │  │   • PostgreSQL      │    │  │ Cash       │   │
│                        │  │   • TimescaleDB     │    │  │ Partners   │   │
│                        │  └─────────────────────┘    │  └────────────┘   │
└────────────────────────┴─────────────────────────────┴───────────────────┘
```

### 2.2 Core Services Breakdown

| Service | Tech | Purpose |
| :--- | :--- | :--- |
| API Gateway | Kong/AWS API Gateway | Rate limiting, auth, routing |
| Player Service | Node.js/TypeScript | Account CRUD, auth, preferences |
| Wallet Engine | Rust/Go | High-performance transaction processing |
| Game Router | Elixir | Real-time game session management |
| RNG Service | C++ | Cryptographically secure randomness |
| Game Studio | Unity + Custom | Proprietary game development |
| Analytics | ClickHouse | Real-time player/game analytics |
| Compliance | Python | KYC, AML, geo-blocking, self-exclusion |
| Cash Partner | Node.js + Mobile SDK | Cash acceptance and logistics |

---

## 3. Aggregator Layer (Phase 1)

### 3.1 Partner Integration Model

```
┌─────────────────────────────────────────────────────────┐
│              PARTNER INTEGRATION ARCHITECTURE            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Valley Players Club    Partner Platform                │
│  ┌──────────┐           ┌──────────────┐                │
│  │ Wallet   │◄─────────►│  Balance API  │               │
│  │ Engine   │  HTTPS    │  (REST/gRPC)  │               │
│  └──────────┘           └──────────────┘                │
│       │                          │                      │
│       │                    ┌─────┴─────┐                │
│       │                    │  Game     │                │
│       │                    │  Servers  │                │
│       │                    └───────────┘                │
│       │                                                 │
│  ┌────┴────┐           ┌──────────────┐                 │
│  │ Session │◄─────────►│  Player Auth  │                │
│  │ Manager │  JWT      │  (SSO/OAuth2) │                │
│  └─────────┘           └──────────────┘                 │
│                                                         │
│  Integration Types:                                     │
│  • Deep: Full wallet + session sync (preferred)         │
│  • Shallow: Link-out with credit tracking               │
│  • API: Direct game embedding via iframe/SDK            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Supported Game Categories

| Category | Examples | Integration Approach |
| :--- | :--- | :--- |
| Sweepstakes Slots | RSweeps, Ultra Monster | Deep wallet integration |
| Fish Games | Fire Kirin, Ocean King | Session-managed embedding |
| Table Games | Partner blackjack, poker | API-driven iframe |
| Skill Games | Skillz-style, arcade | Custom SDK integration |
| Live Dealer | Evolution-style | HLS stream + betting API |

### 3.3 Wallet Engine Specifications

```typescript
// Core transaction types
interface Transaction {
  id: UUID;
  playerId: UUID;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out' | 
        'game_win' | 'game_loss' | 'bonus' | 'fee' | 'cash_partner_deposit';
  amount: Decimal;  // Use decimal for precision
  currency: 'USD' | 'USDC' | 'USDT' | 'BONUS';
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  partnerId?: UUID;  // null for internal games
  cashPartnerId?: UUID;  // null for non-cash deposits
  gameSessionId?: UUID;
  metadata: JSON;
  createdAt: Timestamp;
  settledAt?: Timestamp;
}

// Wallet structure
interface PlayerWallet {
  playerId: UUID;
  balances: {
    cash: Decimal;        // Real money
    bonus: Decimal;       // Promo credits
    partner_credits: Map<PartnerId, Decimal>;
  };
  limits: {
    daily_deposit: Decimal;
    daily_withdrawal: Decimal;
    session_loss: Decimal;
  };
  status: 'active' | 'suspended' | 'self_excluded';
}
```

---

## 4. Proprietary Game Studio (Phase 2)

### 4.1 Game Engine Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  GAME STUDIO STACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              GAME CLIENTS (Unity/WebGL)            │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │  │ Slots    │ │ Fish     │ │ Table    │ │ Skill    │  │    │
│  │  │ Engine   │ │ Games    │ │ Games    │ │ Games    │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           GAME SERVER (Elixir/OTP)                  │    │
│  │  • Session management                               │    │
│  │  • Real-time messaging (WebSocket)                  │    │
│  │  • State reconciliation                             │    │
│  │  • Anti-cheat validation                            │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           GAME LOGIC SERVICES                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │    │
│  │  │ RNG      │ │ Math     │ │ Asset    │ │ Config   │  │    │
│  │  │ Service  │ │ Engine   │ │ Service  │ │ Service  │  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Cash Acceptance Network (Valley Players Club Local)

### 5.1 Overview
Cash Partners are local businesses or individuals who accept physical cash from players and credit it to their Valley Players Club wallets. This enables:
- Unbanked players to participate without traditional banking
- Immediate deposits without ACH delays
- Local community presence and trust

Cash Partners earn a flat percentage of deposits processed.

### 5.2 Commission Structure

| Tier | Monthly Cash Volume | Commission Rate |
| :--- | :--- | :--- |
| Bronze | <$10,000 | 1.0% |
| Silver | $10,000 – $50,000 | 1.5% |
| Gold | >$50,000 | 2.0% |

Example: A Silver partner processes $25,000 in March → earns $375 (1.5% × $25,000).  
Payment timing: Monthly, 15 days after month-end, once cash drops are verified.

### 5.3 Player Transaction Flow

```
Player → Cash Partner location
       → Presents username/QR code
       → Hands over cash
       → Partner logs amount in Valley Players Club Partner app
       → Player wallet credited instantly
       → Cash held by Partner until scheduled drop
```

### 5.4 Drop Scheduling
Partners choose their schedule:

| Type | Trigger |
| :--- | :--- |
| Fixed | Daily or weekly scheduled drops |
| Threshold | When cash on hand reaches $100 or $1,000 |

Drops are made at designated partner banks or vault locations. GPS verification + dual signature required.

---

## 6. Regulatory & Compliance Layer

### 6.1 Jurisdiction Matrix

| Market | Model | Requirements |
| :--- | :--- | :--- |
| US Sweepstakes | No purchase necessary | Free entry path, alternate currency |
| Canada | Skill game focus | Provably skill-based outcomes |
| Europe (UK) | Licensed gambling | UKGC license, strict KYC/AML |
| LatAm | Varies by country | Local partnerships, bank integrations |
| Asia | Social casino | No real money, virtual currency only |

---

## 7. Key Differentiators vs. Skills and Slots

| Feature | Skills and Slots | Valley Players Club |
| :--- | :--- | :--- |
| Own Games | ❌ None | ✅ Full studio |
| Cash-in-Person | ❌ None | ✅ Local partner network |
| UX Quality | Basic | Premium (design system) |
| Crypto Support | Only crypto | Crypto + Fiat |
| Game Discovery | List view | AI-powered recommendations |
| Social Features | None | Friends, leaderboards, clubs |
| Mobile Experience | Web wrappers | Native apps |
| Local Presence | None | Community-based partners |

---

## 8. Budget Estimate (Rough)

| Phase | Duration | Team Size | Cost Range |
| :--- | :--- | :--- | :--- |
| MVP | 6 months | 10 | $800K - $1.2M |
| Proprietary Games | 12 months | 16 | $2M - $3M |
| Scale | 12 months | 25 | $4M - $6M |
| Total Year 1-2 | — | — | $6.8M - $10.2M |

**Additional:**
- Legal/licensing: $500K-$1M
- Marketing launch: $1M-$3M
- Game content (external): $500K-$1M per premium title

---

## 9. Success Metrics

| Metric | 6mo | 12mo | 24mo |
| :--- | :--- | :--- | :--- |
| Registered Players | 10K | 50K | 200K |
| Monthly Active | 3K | 15K | 60K |
| Proprietary Games | 0 | 3 | 15 |
| Partner Platforms | 3 | 8 | 12 |
| Cash Partner Locations | 5 | 25 | 100 |
| Monthly Revenue | $50K | $300K | $1.5M |
| Player LTV | $150 | $200 | $250 |

---
**Document Owner:** User  
**Next Steps:** Architecture review
