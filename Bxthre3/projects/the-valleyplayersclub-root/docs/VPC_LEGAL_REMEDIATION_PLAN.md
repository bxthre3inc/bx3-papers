# VPC Legal Remediation Plan
**Objective:** Close all P0/P1 gaps before attorney review and beta launch
**Target:** 14-day sprint completion
**Owner:** brodiblanco + legal counsel (upon retention)

---

## PHASE 1: P0 CRITICAL (Days 1-3)
*Blockers to launch - must be fixed before any player sees platform*

### 1.1 AMOE Fee Removal
**Gap:** $1 postal entry fee after 5 free entries violates FTC "no purchase necessary" spirit
**Fix:** 
- [ ] Remove fee from `DRAFT_01_TERMS_OF_SERVICE.md` Section 6.1
- [ ] Change: "$1.00 processing fee applies after 5 free entries" → "Unlimited free postal entries"
- [ ] Update cost schedule: Remove AMOE row entirely
- [ ] Add: "No purchase or payment of any kind is necessary to enter or win. ALL ENTRIES ARE FREE."
- [ ] Add prominent disclosure in AMOE section: "Free entry has equal chance of winning as purchased entry."
**Verification:** Copy-paste AMOE section to attorney with note: "Confirm this meets FTC guidance"
**Owner:** brodiblanco
**Time:** 2 hours

### 1.2 Problem Gambling Infrastructure
**Gap:** No helpline, self-exclusion, or player protection vs. Chumba/LuckyLand
**Fix:**
- [ ] Add to `DRAFT_01_TERMS_OF_SERVICE.md` new Section: "16. RESPONSIBLE GAMING"
  - National Council on Problem Gambling: 1-800-522-4700
  - Gamblers Anonymous: www.gamblersanonymous.org
  - Self-exclusion: playersupport@valleyplayersclub.com
- [ ] Add to Navbar.tsx: "Help" dropdown with "Responsible Gaming" link
- [ ] Add to Footer.tsx: "1-800-522-4700 | 24/7 Confidential Help"
- [ ] Implement API endpoints:
  - `POST /api/player/self-exclude` (30-day, 1-year, permanent)
  - `POST /api/player/cooldown` (24-hour voluntary lockout)
  - `GET /api/player/limits` (view current deposit/play limits)
  - `POST /api/player/limits` (set daily/weekly/monthly deposit caps)
- [ ] Add reality check: Pop-up every 60 minutes showing "Time played: X min | Net: +/- Y $C"
**Verification:** Screenshot responsible gaming section; test self-exclusion API
**Owner:** brodiblanco (docs) + dev (API)
**Time:** 8 hours (docs 2h, API 6h)

### 1.3 RNG Certification Disclosure
**Gap:** No GLI/BMM/iTech Labs certification mentioned (required for legitimacy)
**Fix:**
- [ ] Add to `DRAFT_01_TERMS_OF_SERVICE.md` new Section 4.8:
  "**FAIRNESS CERTIFICATION:** All games use cryptographically secure random number generation (RNG) certified by [GLI/BMM/iTech Labs - pending]. Certificates available upon request to compliance@valleyplayersclub.com."
- [ ] Add to footer of every game screen: "RNG Certified | Fair Play Guaranteed"
- [ ] Obtain actual RNG certification:
  - Option A: GLI-19 (Gaming Laboratories International) - $15K-25K, 4-6 weeks
  - Option B: BMM Testlabs - $12K-20K, 3-4 weeks
  - Option C: iTech Labs - $10K-18K, 2-3 weeks (fastest)
  **RECOMMENDATION:** Start iTech Labs process immediately; use placeholder "Certification pending - expected [DATE]" if needed for soft launch
**Verification:** Add certificate to `docs/COMPLIANCE/` folder; update ToS with cert number
**Owner:** brodiblanco (engage lab) + attorney (review cert scope)
**Time:** 4 hours + 3-6 weeks lab time

### 1.4 BIPA Compliance Fix
**Gap:** 3-year biometric retention vs. BSA 5-year creates conflict + $1K-$5K per violation exposure
**Fix:**
- [ ] Update `DRAFT_02_PRIVACY_POLICY.md` Section 5.2:
  - Change: "Facial recognition data retained for 3 years"
  - To: "Facial recognition TEMPLATES are anonymized immediately after verification. Only verification RESULTS (pass/fail) retained for regulatory period (5 years BSA / 7 years IRS). Original images deleted within 30 days."
- [ ] Implement technical deletion:
  - Auto-delete selfie images 30 days post-verification
  - Store only salted hash of facial geometry (non-reversible)
  - No raw biometric data stored beyond verification session
- [ ] Add BIPA notice to onboarding: "Illinois Residents: We collect facial geometry solely for identity verification per BIPA §14/15. Data anonymized within 30 days. Questions: privacy@valleyplayersclub.com"
**Verification:** Code review of deletion logic; privacy policy redline
**Owner:** dev + brodiblanco (docs)
**Time:** 6 hours

---

## PHASE 2: P1 HIGH PRIORITY (Days 4-7)
*Serious issues - fix before attorney review or soft launch*

### 2.1 Exchange Rate Standardization (10,000:1 → 1:1)
**Gap:** Non-standard $C exchange rate vs. industry 1:1 creates confusion + regulatory scrutiny
**Fix:**
- [ ] Update all documents (`DRAFT_01`, `DRAFT_02`, `DRAFT_04`):
  - Change: "10,000 $C = $1 USD"
  - To: "1 $C = $1 USD (or local currency equivalent)"
- [ ] Redenominate existing balances: Divide all $C amounts by 10,000
- [ ] Adjust fees:
  - Current: 10.009% fee on redemption
  - New: No explicit fee; house edge absorbs cost
  - **Alternative:** Keep fee but make it invisible (baked into exchange spread)
- [ ] Update UI: Show "$C" as equivalent to USD (e.g., "100 $C = $100")
- [ ] Adjust minimums:
  - Redemption: 10,000 $C → 50 $C (match Chumba)
  - Membership freebies: Scale down proportionally
**Verification:** Search/replace audit for "10,000" across codebase; financial model recalculation
**Owner:** brodiblanco (docs) + dev (UI/API)
**Time:** 6 hours (docs 2h, code 4h)

### 2.2 Extend Burn Trigger (72 hours → 7 days)
**Gap:** 72-hour auto-burn is operationally impossible for Partners
**Fix:**
- [ ] Update `DRAFT_04_CASH_PARTNER_AGREEMENT.md` Section 7.3:
  - Change: "72 hours"
  - To: "7 calendar days (168 hours)"
- [ ] Add escalation sequence:
  - Hour 0: Freeze notification (email + SMS + push)
  - Hour 24: Reminder (email + SMS)
  - Hour 72: Final warning (email + SMS + call)
  - Hour 168: Auto-burn if unresolved
- [ ] Add grace path: "Partner may request 7-day extension with $100 extension fee (added to collateral requirement)"
**Verification:** Update Partner App notification logic; test notification sequence
**Owner:** brodiblanco (docs) + dev (notifications)
**Time:** 4 hours

### 2.3 Add Dispute Resolution for Game Outcomes
**Gap:** No process for challenging game results (industry standard)
**Fix:**
- [ ] Add to `DRAFT_01_TERMS_OF_SERVICE.md` new Section 14.5:
  "**GAME DISPUTE RESOLUTION:** If you believe a game malfunctioned:
  1. Screenshot the result immediately
  2. Email support@valleyplayersclub.com within 24 hours
  3. Include: Game ID, timestamp, wager amount, claimed result
  4. We will review server logs and RNG seed within 48 hours
  5. Decision: (a) Confirm result (no action), (b) Refund wager, or (c) Credit win
  6. Final decision subject to binding arbitration under Section 15"
- [ ] Implement API:
  - `POST /api/dispute` (create dispute)
  - `GET /api/dispute/:id` (status)
  - Internal: Dispute dashboard for admin review
- [ ] Log retention: Extend game logs to 7 years for dispute purposes
**Verification:** Test dispute flow with sample malfunction
**Owner:** brodiblanco (docs) + dev (API/dashboard)
**Time:** 8 hours

### 2.4 Self-Exclusion + Deposit Limit APIs
**Gap:** No technical implementation of responsible gaming controls
**Fix:**
- [ ] Add to `server/src/services/ComplianceService.ts`:
  - `setSelfExclusion(userId, duration)` (30-day, 1-year, permanent)
  - `setDepositLimit(userId, period, amount)` (daily/weekly/monthly)
  - `checkLimits(userId, requestedAmount)` (returns allowed/blocked)
- [ ] Block during exclusion:
  - All wagers rejected with: "Account self-excluded until [DATE]. Help: 1-800-522-4700"
  - Cash deposits blocked at Partner App level
  - Redemptions allowed (can't trap player funds)
- [ ] Add to database:
  - `self_exclusions` table (user_id, start_date, end_date, type)
  - `deposit_limits` table (user_id, period_type, limit_amount, current_used)
**Verification:** Unit tests for limit enforcement; test exclusion blocks wager
**Owner:** dev
**Time:** 6 hours

### 2.5 CTR (Currency Transaction Report) Procedure
**Gap:** Cash deposits >$10K trigger BSA reporting; no procedure in place
**Fix:**
- [ ] Add to `DRAFT_03_AML_KYC_POLICY.md` new Section 4.4:
  "**CTR FILING:** Cash deposits ≥$10,000 by a single player within 24 hours trigger Form 8300 filing with FinCEN within 15 days. Compliance Officer completes filing. Player notified: 'Large cash transaction reported per federal law.'"
- [ ] Implement auto-flag:
  - System flags when sum(player_daily_cash_deposits) ≥ $10,000
  - Auto-email to compliance@valleyplayersclub.com
  - Suspends further cash deposits from that player until CTR filed
- [ ] Add to Partner App: Warning when entering deposit >$8,000 ("Approaching CTR threshold")
**Verification:** Test with $10,001 deposit; confirm flag + email
**Owner:** brodiblanco (docs) + dev (flagging)
**Time:** 4 hours

---

## PHASE 3: P2 MEDIUM PRIORITY (Days 8-10)
*Should be fixed but not blockers*

### 3.1 Membership Clarification ("Consideration" Risk)
**Gap:** Membership subscriptions with RTP boosts could be argued as paying for better odds
**Fix:**
- [ ] Add to `DRAFT_01_TERMS_OF_SERVICE.md` Section 7.2:
  "**MEMBERSHIP DISCLAIMER:** Memberships provide convenience features (faster redemptions, priority support) and entertainment features (cosmetic effects, achievement badges). NO MEMBERSHIP IMPROVES ODDS OF WINNING. All players, regardless of membership status, have identical mathematical chances on every wager."
- [ ] Update membership page: Remove "RTP Profile" language → "Priority Queue" and "Enhanced Experience"
- [ ] Ensure actual math: Gold/Platinum memberships must NOT change game math (verify in code)
**Verification:** Code audit of `MembershipService.ts`; confirm no math changes
**Owner:** brodiblanco (docs) + dev (code audit)
**Time:** 3 hours

### 3.2 Partner Fraud Protection
**Gap:** Partners bear 100% chargeback/fraud liability (uncompetitive vs. Square)
**Fix:**
- [ ] Add to `DRAFT_04_CASH_PARTNER_AGREEMENT.md` Section 6.3:
  "**FRAUD PROTECTION:** If Partner verifies identity per Section 4.2 (valid token, matching ID photo) and transaction later charged back due to stolen card/fraudulent payment (not Partner verification failure), VPC absorbs loss. Partner commission protected."
- [ ] Implement: If chargeback reason = "fraud" AND Partner logs show valid ID check → clawback from VPC reserve, not Partner
**Verification:** Test chargeback scenario in dispute system
**Owner:** brodiblanco (docs) + dev (logic)
**Time:** 4 hours

### 3.3 Data Breach Notification Timeline
**Gap:** No 72-hour GDPR / reasonable US timeline specified
**Fix:**
- [ ] Add to `DRAFT_02_PRIVACY_POLICY.md` Section 8.1:
  "**BREACH NOTIFICATION:** We will notify affected users within 72 hours of discovering a data breach involving personal information. We will also notify appropriate regulatory authorities as required by law."
- [ ] Create incident response runbook:
  - Hour 0: Detect → Contain
  - Hour 2: Assess scope
  - Hour 24: Draft notifications
  - Hour 48: Legal review
  - Hour 72: User notification sent
**Verification:** Tabletop exercise with mock breach
**Owner:** brodiblanco (docs) + compliance (runbook)
**Time:** 2 hours

### 3.4 Force Majeure for Cash Transport
**Gap:** Partner liable for cash lost in robbery/natural disaster
**Fix:**
- [ ] Add to `DRAFT_04_CASH_PARTNER_AGREEMENT.md` Section 12.2:
  "**FORCE MAJEURE CASH LOSS:** If cash is lost due to robbery (with police report), natural disaster, or other force majeure event during VPC-directed transport to drop location, liability is shared: Partner liable for insurance deductible only ($1,000), VPC absorbs remainder via fidelity bond."
- [ ] Require: Police report filed within 24 hours, GPS tracking confirms route compliance
**Verification:** Add scenario to insurance coverage confirmation
**Owner:** brodiblanco (docs)
**Time:** 2 hours

---

## PHASE 4: P3 NICE-TO-HAVE (Days 11-14)
*Polish and future-proofing*

### 4.1 State-Specific Age Gates
**Gap:** Single 18+ requirement; some states require 21+
**Fix:**
- [ ] Implement geofenced age verification:
  - Default: 18+
  - MA, IA, LA: 21+
  - Nebraska (if ever): 19+
- [ ] Add to registration: "By clicking, you confirm you are [AGE] years or older per your state of residence"
- [ ] Block registration if IP geolocation ≠ user-stated state (fraud flag)
**Verification:** VPN test from MA/LA IP addresses
**Owner:** dev
**Time:** 6 hours

### 4.2 Official Rules Document (Standalone)
**Gap:** Sweepstakes rules embedded in ToS; FTC prefers standalone
**Fix:**
- [ ] Create `docs/OFFICIAL_RULES.md` standalone document:
  - How to enter (purchase or free)
  - Odds of winning (disclosed per game)
- [ ] Add link in footer: "Official Rules" → separate page
**Verification:** FTC guidance comparison
**Owner:** brodiblanco
**Time:** 4 hours

### 4.3 Florida/New York Bond Deferral Strategy
**Gap:** No explicit plan for FL/NY $5K bonds
**Fix:**
- [ ] Add to launch plan: "Phase 1: All states except FL, NY, WA"
- [ ] Create deferred roadmap:
  - Month 3: FL bond ($5K) if player volume >100
  - Month 6: NY bond ($5K) if player volume >200
  - Never: WA (prohibited)
- [ ] Add geoblock: `if (state === 'FL' || state === 'NY') return { allowed: false, reason: 'Coming soon' }`
- [ ] Track waiting list for FL/NY: `GET /api/waitlist?state=FL`
**Verification:** Test VPN from FL/NY IPs
**Owner:** dev + brodiblanco (strategy)
**Time:** 4 hours

---

## BUDGET SUMMARY

| Item | Cost | Timeline |
|------|------|----------|
| iTech Labs RNG Certification | $10,000-$18,000 | 2-3 weeks (start Day 1) |
| Attorney review (4 docs × $200/hr × 5 hrs) | $4,000 | After Phase 2 complete |
| Insurance (GL + Cyber) | $3,000-$5,000/year | Quote by Day 7 |
| Florida Bond | $5,000 | Month 3 (deferred) |
| New York Bond | $5,000 | Month 6 (deferred) |
| **TOTAL IMMEDIATE** | **~$17,000-$27,000** | |
| **TOTAL WITH BONDS** | **~$27,000-$37,000** | 6 months |

---

## SUCCESS CRITERIA

**Day 3 (Phase 1 Complete):**
- [ ] All P0 gaps closed
- [ ] AMOE 100% free
- [ ] Responsible gaming helpline live
- [ ] RNG certification engaged
- [ ] BIPA deletion logic deployed

**Day 7 (Phase 2 Complete):**
- [ ] Exchange rate standardized to 1:1
- [ ] Burn trigger extended to 7 days
- [ ] Dispute resolution system live
- [ ] Self-exclusion APIs working
- [ ] CTR procedure documented

**Day 14 (Phase 3-4 Complete):**
- [ ] Membership disclaimer clear
- [ ] Partner fraud protection active
- [ ] Breach notification SOP set
- [ ] Force majeure clause added
- [ ] State age gates implemented
- [ ] Official Rules standalone doc
- [ ] FL/NY geoblock active

**Attorney Review Gate:**
- [ ] All P0/P1 complete
- [ ] Docs sent to gaming attorney
- [ ] Review feedback incorporated
- [ ] Final sign-off

**Launch Readiness:**
- [ ] RNG cert received (or pending placeholder)
- [ ] Insurance bound
- [ ] Compliance officer designated
- [ ] Incident response tested

---

## RISK IF NOT FIXED

| Gap | Probability | Impact | Mitigation |
|-----|-------------|--------|------------|
| AMOE fee | 70% | FTC enforcement action | **Fix Day 1** |
| No gambling helpline | 80% | State AG cease & desist | **Fix Day 1** |
| No RNG cert | 90% | Player trust collapse | **Engage Day 1** |
| Biometric BIPA | 40% | $5M class action | **Fix Day 3** |
| Exchange rate confusion | 60% | Chargebacks, complaints | **Fix Day 4-7** |
| 72-hour burn | 50% | Partner churn | **Fix Day 4-7** |
| No dispute resolution | 30% | Small claims flood | **Fix Day 4-7** |

---

**END OF REMEDIATION PLAN**