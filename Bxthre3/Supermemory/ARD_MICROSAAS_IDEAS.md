# Ard / Oferta MicroSaaS & SaaS Ideas — Prioritized Backlog

**Status:** Active ideation | **Next Review:** Post 802 Morton closing or Q3 2026

---

## 1. Oferta — Real Estate Offer Platform

**Status:** MVP in production (802 Morton test case)

### Pricing Model (Revised)
| Tier | Monthly | Per Deal | Volume | Notes |
|------|---------|----------|--------|-------|
| Pay-as-you-go | $0 | 7.799% | Unlimited | Includes Stripe (2.9% + $0.30) |
| Starter | $9.99 | 4.799% | Up to 10/mo | Net to Oferta: ~1.9% |
| Pro | $29.99 | 3.499% | Unlimited | Net to Oferta: ~0.6% + subscription |
| Enterprise | $99.99 | 3.199% | Unlimited + API | Net to Oferta: ~0.3% + subscription |

### Stripe Fee Optimization
- **Current:** 2.9% + $0.30
- **Platform rate (negotiable):** 2.4% + $0.25 at $100K+/mo volume
- **Custom pricing:** Available for marketplaces with >$1M annual volume
- **Action item:** Apply for Stripe Partner Program post-$50K MRR

---

## 2. CREDs Wallet Integration (Oferta Bridge)

**Status:** Exploratory | **Decision needed:** Post-MVP

### Potential Use Cases
1. **Escrow holding** — Multi-sig wallet for pending deal funds
2. **Tokenized equity** — Represent Option C 30% stake as CREDs token
3. **Fee discounts** — Pay Oferta fees in CREDs for 20% discount
4. **Loyalty rewards** — High-volume users earn CREDs for fee waivers
5. **Joint venture distributions** — Quarterly dividend payments via smart contract

### Open Questions
- Does CREDs live on EVM chain or Agentic-native?
- Regulatory compliance for tokenized securities (SEC 506(b) exemption?)
- Gas abstraction layer needed for non-crypto users

---

## 3. Future MicroSaaS Concepts (Track for Later)

### A. Ard Assistant — SMB Contract Intelligence
- Extract key terms from uploaded contracts
- Flag unfavorable clauses vs market norms
- Generate counter-offer language

### B. Irrig8 Marketplace — Ag Input Bidding
- Farmers post crop input needs
- Suppliers bid on bulk orders
- Oferta-style offer/accept flow for agriculture

### C. Valley Build-A-Biz — Franchise OS
- Package local service businesses (lawncare, hauling, etc)
- Turnkey website + booking + payment
- Oferta integration for equipment financing

### D. VPC Investor Portal — Deterministic Transparency
- Automated investor reporting from Stripe + QuickBooks + Agentic
- Real-time burn rate, runway, cap table
- Oferta white-label for real estate syndications

---

## Decision Log

| Date | Decision | Notes |
|------|----------|-------|
| 2026-04-06 | Stripe fees included in Oferta pricing | Absorbed to simplify seller UX |
| 2026-04-06 | CREDs integration deferred | Focus on 802 Morton MVP first |
| 2026-04-06 | MicroSaaS ideas parked | Review Q3 2026 or post-$10K MRR |

---

## Next Actions
1. [ ] Close 802 Morton with one of three options (prioritize Oferta equity for test case)
2. [ ] Track deal volume and Stripe costs for 90 days
3. [ ] Apply for Stripe Partner Program if Oferta processes 50+ deals
4. [ ] Architect CREDs <> Oferta bridge (TBD based on 802 Morton seller interest)
5. [ ] Review this document Q3 2026 or upon hitting $10K MRR
