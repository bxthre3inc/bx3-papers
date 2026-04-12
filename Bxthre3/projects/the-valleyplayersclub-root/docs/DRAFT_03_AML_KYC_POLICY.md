# DRAFT: AML/KYC Policy - Valley Players Club

**DRAFT STATUS:** Preliminary — Requires Attorney Review  
**DRAFT DATE:** March 2026  
**REGULATORY FRAMEWORK:** 31 CFR Chapter X, FinCEN Guidance, OFAC Sanctions

---

## 1. POLICY PURPOSE & SCOPE

### 1.1 Regulatory Basis

This Anti-Money Laundering (AML) and Know Your Customer (KYC) Policy is established pursuant to:
- 31 U.S.C. § 5311 et seq. (Bank Secrecy Act)
- 31 CFR 1010.230 (Customer Identification Program requirements)
- FinCEN Guidance FIN-2019-G001 (virtual currency)
- OFAC sanctions programs
- State money transmission laws (as applicable)

### 1.2 Policy Objective

VPC implements this Policy to:
- Prevent money laundering and terrorist financing
- Detect and report suspicious activity
- Verify customer identity
- Maintain audit trails for regulatory examination
- Protect platform integrity from financial crime

### 1.3 Scope

This Policy applies to:
- All VPC employees, contractors, and agents
- Cash Partner network participants
- Third-party service providers handling customer funds
- All customer accounts and transactions

---

## 2. RISK ASSESSMENT

### 2.1 Business Risk Profile

**DRAFTING NOTE:** *VPC's unique features (sweepstakes model, cash partners, crypto redemptions) create distinct risk profile. Must document risk ratings.*

| Risk Category | Level | Mitigation |
|---------------|-------|------------|
| **Product Risk** | Medium | No direct crypto purchases; dual currency with restrictions |
| **Geographic Risk** | Medium | US-only; geo-blocking; FL/NY redemptions prohibited |
| **Customer Risk** | Medium | KYC for all redemptions; transaction monitoring |
| **Delivery Channel** | Medium | Cash partners with collateral; verified endpoints |
| **Transaction Risk** | Medium | Velocity limits; playthrough requirements |

### 2.2 Red Flags

High-risk indicators triggering enhanced review:

| Red Flag | Action |
|----------|--------|
| Rapid deposit/redemption cycling | Account freeze; SAR review |
| Multiple accounts, shared IP/device | Multi-accounting investigation |
| Deposits from high-risk jurisdictions | Block; manual review |
| Structured transactions (just under thresholds) | SAR filing; account review |
| Negative media/PEP status | Enhanced due diligence |
| Cash partner drops without matching deposits | Partner audit; potential burn |

---

## 3. CUSTOMER IDENTIFICATION PROGRAM (CIP)

### 3.1 Identification Requirements

**DRAFTING NOTE:** *31 CFR 1010.230 requires: name, DOB, address, ID number. Enhanced requirements for redemption align with best practices.*

For ALL accounts:
- Full legal name
- Date of birth
- Residential address (no P.O. boxes)
- Email address (verified)
- Phone number (verified)

For REDEMPTION-ELIGIBLE accounts:
- Government-issued photo ID (driver's license, passport, state ID)
- Social Security Number (last 4 digits minimum; full for enhanced review)
- Biometric facial verification (live selfie + liveness detection)
- Source of funds (if cash partner deposit >$500)

### 3.2 Verification Methods

| Tier | Method | Timing |
|------|--------|--------|
| **Standard** | Electronic verification (credit bureau data match) | Real-time |
| **Document** | ID document upload + OCR + manual review | 24-48 hours |
| **Biometric** | Facial recognition + liveness detection | Real-time |
| **Enhanced** | Video call + supplemental documents | 3-5 days |

### 3.3 Third-Party Verification Services

VPC contracts with:
- **Jumio** or **Persona** (document verification, biometric matching)
- **MaxMind** (IP geolocation, proxy/VPN detection)
- **Sift** (device fingerprinting, behavioral analysis)
- **LexisNexis** (identity verification, watchlist screening)

All service providers maintain SOC 2 Type II certification and execute Data Processing Agreements.

### 3.4 Verification Failures

If identity cannot be verified:
- Account remains in "limited" status (GC purchase allowed; $C redemption blocked)
- Customer may retry with alternative documents
- After 3 failures, account suspended pending manual review
- Documentation retained for 5 years

---

## 4. CUSTOMER DUE DILIGENCE (CDD)

### 4.1 Standard Due Diligence

For all customers:
- Transaction pattern analysis
- Device/geolocation verification
- Velocity monitoring (deposits, wagers, redemptions)

### 4.2 Enhanced Due Diligence (EDD)

Triggers for EDD:
- Cumulative redemptions >$2,000/month
- Single redemption >$500
- Politically Exposed Person (PEP) match
- Adverse media match
- High-risk state of residence
- Cash partner as primary funding source

EDD procedures:
- Source of funds documentation
- Employment/income verification
- Enhanced transaction monitoring
- Manager approval for redemptions >$1,000
- Quarterly relationship review

### 4.3 Ongoing Monitoring

| Metric | Review Frequency | Trigger |
|--------|------------------|---------|
| Transaction patterns | Continuous | Automated alerts |
| Watchlist status | Daily | OFAC/LexisNexis updates |
| Device/IP changes | Per session | Security challenge if anomalous |
| Account age | Quarterly | EDD refresh if high-risk |

---

## 5. TRANSACTION MONITORING

### 5.1 Automated Monitoring Rules

| Rule | Threshold | Action |
|------|-----------|--------|
| Daily deposit velocity | >$500 | Alert; delay redemption 24h |
| Daily redemption velocity | >$200 | Alert; require manager approval |
| Monthly redemption volume | >$2,000 | EDD triggered; SAR review |
| Rapid deposit-to-redemption | <$20 wagered per $100 deposited | Alert; account review |
| Multiple accounts, same device | >2 accounts | Multi-accounting investigation |
| VPN/proxy usage | Any | Block; require document verification |
| Cash partner concentration | >50% deposits from single partner | Partner audit; customer EDD |

### 5.2 Manual Review Procedures

Level 1 Review (Compliance Analyst):
- Review transaction history
- Check for structuring patterns
- Verify geolocation consistency
- Document decision

Level 2 Review (Compliance Manager):
- Escalated red flags
- PEP/adverse media hits
- SAR determination
- Account restriction decisions

Level 3 Review (BSA Officer):
- SAR filing decisions
- Law enforcement referrals
- Policy exceptions
- Regulatory examination prep

### 5.3 Recordkeeping

All monitoring activity documented:
- Alert generation date/time
- Reviewer identity
- Investigation steps taken
- Conclusion and rationale
- Retention: 5 years minimum

---

## 6. SUSPICIOUS ACTIVITY REPORTING (SAR)

### 6.1 SAR Filing Obligations

**DRAFTING NOTE:** *31 CFR 1010.320 requires SAR filing within 30 days of suspicious activity identification. FinCEN Form 114.*

VPC files SARs for:
- Transactions aggregating >$5,000 involving funds from illegal activity
- Transactions designed to evade BSA reporting
- Transactions with no apparent lawful purpose
- Activity suggesting money laundering, terrorist financing, or sanctions violations

### 6.2 Internal SAR Process

1. **Detection:** Automated alert or manual identification
2. **Investigation:** 48-hour preliminary review
3. **Determination:** BSA Officer decides SAR filing (within 20 days)
4. **Filing:** FinCEN Form 114 submitted electronically (within 30 days of detection)
5. **Notification:** No customer notification (tipping off prohibited)
6. **Documentation:** Full case file retained 5 years

### 6.3 Confidentiality

SARs and SAR-related information:
- Are confidential under 31 U.S.C. § 5318(g)(2)
- Cannot be disclosed to customer ("tipping off")
- Can be shared with law enforcement upon request
- Subpoena for SAR requires FinCEN consultation

---

## 7. CASH PARTNER COMPLIANCE

### 7.1 Partner Due Diligence

Before onboarding Cash Partner:
- Business entity verification (Secretary of State search)
- EIN/Tax ID verification
- Principal identity verification (KYC on owners)
- Background check (criminal, civil, credit)
- Site inspection (physical location verification)
- Banking relationship verification

### 7.2 Ongoing Partner Monitoring

| Activity | Frequency | Responsible |
|----------|-----------|-------------|
| Transaction reconciliation | Daily | Automated + Analyst |
| Collateral verification | Weekly | Partner Success |
| Drop audit | Monthly | Compliance |
| Full audit | Quarterly | BSA Officer |
| Re-certification | Annually | Legal |

### 7.3 Partner Red Flags

- Drop amounts inconsistent with deposit logs
- Frequent requests for collateral adjustments
- Unexplained changes in banking relationship
- Customer complaints about partner
- Negative media on partner or principals
- Law enforcement inquiries regarding partner

**Action:** Immediate suspension pending investigation; potential collateral burn.

### 7.4 Partner Termination

Grounds for termination:
- Material breach of Partner Agreement
- Fraud or theft
- Regulatory enforcement against partner
- Bankruptcy or insolvency
- Pattern of compliance violations

Post-termination:
- Outstanding deposits reconciled within 72 hours
- Collateral returned minus verified losses
- Customer notifications regarding pending deposits
- Law enforcement notification if criminal activity suspected

---

## 8. SANCTIONS & OFAC COMPLIANCE

### 8.1 OFAC Screening

All customers and transactions screened against:
- SDN List (Specially Designated Nationals)
- Consolidated Sanctions List
- Foreign Sanctions Evaders List
- Sectoral Sanctions Identifications List

### 8.2 Screening Timing

| Trigger | Screening | Action if Match |
|---------|-----------|-----------------|
| Account creation | Real-time OFAC | Block; manual review |
| Each redemption | Real-time OFAC | Hold; compliance review |
| Quarterly | Batch rescreen all active | Review matches |
| List update | Batch rescreen within 24h | Review new matches |

### 8.3 Match Procedures

Potential OFAC match:
1. Block transaction/account
2. Do NOT notify customer (tipping off)
3. Compliance Manager reviews within 24 hours
4. If confirmed match:
   - Block and freeze all assets
   - File blocked property report within 10 business days
   - Notify OFAC within 24 hours for terrorism matches
   - Notify FBI if criminal nexus

### 8.4 Geographic Restrictions

Prohibited jurisdictions (comprehensive sanctions):
- Cuba
- Iran
- North Korea
- Syria
- Crimea region
- Donetsk/Luhansk regions

Enhanced due diligence (limited sanctions):
- Russia (sectoral)
- Venezuela
- Myanmar
- Other OFAC-designated regions

---

## 9. RECORDKEEPING & RETENTION

### 9.1 CIP Records

| Record | Retention | Format |
|--------|-----------|--------|
| Identification documents | 5 years from account closure | Encrypted digital |
| Verification attempts | 5 years | Database log |
| Biometric data | 3 years | Encrypted, isolated storage |
| Third-party verification reports | 5 years | PDF + metadata |

### 9.2 Transaction Records

| Record | Retention | Format |
|--------|-----------|--------|
| All transactions | 7 years | Database + immutable log |
| Suspicious activity files | 5 years from SAR | Case file |
| Currency transaction reports | 5 years | FinCEN filing copy |
| Cash partner reconciliation | 7 years | Spreadsheet + blockchain |

### 9.3 Policy & Training Records

| Record | Retention |
|--------|-----------|
| This Policy (all versions) | Permanent |
| Training materials | Duration of use + 5 years |
| Employee training completion | Duration of employment + 5 years |
| Risk assessment | 5 years |
| Audit reports | 5 years |
| Regulatory correspondence | Permanent |

---

## 10. TRAINING PROGRAM

### 10.1 Training Requirements

| Role | Initial Training | Ongoing | Content |
|------|------------------|---------|---------|
| All employees | 2 hours | Annual 1 hour | AML basics, red flags, reporting |
| Customer-facing | 4 hours | Quarterly | Identity verification, fraud detection |
| Compliance team | 40 hours | 20 hours/year | Advanced AML, SAR writing, regulations |
| BSA Officer | 80 hours | 40 hours/year | Leadership, regulatory updates, examination prep |
| Cash Partners | 4 hours | Annual 2 hours | AML obligations, suspicious activity, VPC requirements |
| Senior management | 4 hours | Annual 2 hours | Oversight responsibilities, liability |

### 10.2 Training Documentation

- Attendance records
- Completion certificates
- Test scores (if applicable)
- Training materials maintained

---

## 11. COMPLIANCE OFFICER & GOVERNANCE

### 11.1 BSA/AML Officer

VPC designates a qualified individual as BSA/AML Officer:
- Reports to CEO/Board
- Independent authority to implement compliance program
- Authority to override business decisions for compliance
- Direct access to senior management and Board
- Required experience: 5+ years AML compliance or equivalent

### 11.2 Responsibilities

- Oversee day-to-day compliance operations
- Ensure policy updates reflect regulatory changes
- File SARs and other regulatory reports
- Interface with FinCEN, state regulators, and law enforcement
- Lead regulatory examinations
- Report to Board quarterly

### 11.3 Board Oversight

Board of Directors (or equivalent) provides:
- Approval of AML Policy
- Quarterly compliance reports review
- Resource allocation for compliance program
- Approval of significant policy exceptions

---

## 12. INDEPENDENT TESTING (AUDIT)

### 12.1 Audit Requirements

- **Frequency:** Annual minimum; semi-annual if significant issues
- **Scope:** Full compliance program review
- **Independence:** External auditor or internal audit (independent of compliance)
- **Report:** Delivered to BSA Officer and Board

### 12.2 Audit Scope

- CIP effectiveness
- Transaction monitoring calibration
- SAR quality and timeliness
- Recordkeeping compliance
- Training effectiveness
- Cash partner compliance
- Sanctions screening accuracy

### 12.3 Remediation

Audit findings:
- Rated by severity (Critical, High, Medium, Low)
- Remediation timeline assigned
- Follow-up testing for critical findings
- Board notification of critical/high findings within 30 days

---

## 13. REGULATORY EXAMINATION

### 13.1 Examination Preparedness

VPC maintains examination readiness:
- Complete, organized records
- Updated policies and procedures
- Trained staff
- Documented compliance decisions
- SAR support documentation

### 13.2 Examination Response

Upon regulatory examination:
- Single point of contact designated
- Document production logged
- Legal counsel engaged
- BSA Officer present for all meetings
- Follow-up items tracked to completion

---

## 14. POLICY REVIEW & UPDATES

### 14.1 Review Schedule

| Review Type | Frequency | Responsible |
|-------------|-----------|-------------|
| Risk assessment | Annual | BSA Officer |
| Policy updates | As needed | BSA Officer + Legal |
| Regulatory update review | Quarterly | Compliance team |
| Independent testing | Annual | External/Internal audit |

### 14.2 Change Triggers

Policy updated upon:
- New FinCEN guidance or regulations
- Change in business model (new products, partners)
- Independent testing findings
- Regulatory examination feedback
- Significant compliance incident

### 14.3 Approval

All policy changes approved by:
- BSA Officer
- General Counsel (or outside counsel)
- Board of Directors (for material changes)

---

## 15. CONTACT INFORMATION

**BSA/AML Officer**  
[Name]  
Email: compliance@valleyplayers.club  
Phone: [NUMBER]

**General Counsel**  
[Name/Firm]  
Email: legal@valleyplayers.club

**FinCEN Contact** (for emergencies only)  
Financial Crimes Enforcement Network  
[FinCEN public contact]

---

## APPENDIX A: DEFINITIONS

| Term | Definition |
|------|------------|
| **AMOE** | Alternative Method of Entry — free participation method |
| **$C** | Sweeps Credits — promotional redeemable currency |
| **Cash Partner** | Third-party authorized to accept physical cash deposits |
| **CIP** | Customer Identification Program |
| **EDD** | Enhanced Due Diligence |
| **FinCEN** | Financial Crimes Enforcement Network |
| **GC** | Gold Coins — play money with no cash value |
| **KYC** | Know Your Customer |
| **MSB** | Money Services Business |
| **OFAC** | Office of Foreign Assets Control |
| **PEP** | Politically Exposed Person |
| **SAR** | Suspicious Activity Report |
| **SDN** | Specially Designated Nationals |

---

**DRAFTING ATTORNEY NOTES FOR REVIEW:**

1. **MSB Determination:** Critical threshold question. At what redemption volume does VPC trigger money transmitter registration? Current analysis: sweepstakes exemption may apply, but verify with FinCEN counsel.

2. **Cash Partner Liability:** Are partners MSBs? If so, they need state MT licenses. VPC's secured collateral model may not be money transmission, but verify.

3. **BSA Officer Qualifications:** Document specific experience of designated BSA Officer. Must meet "qualified individual" standard.

4. **CTR Exemption:** VPC does not currently accept >$10,000 cash per customer per day, avoiding CTR filing. If this changes, add Currency Transaction Report procedures.

5. **State Variations:** CA, NV, NY have additional AML requirements. Verify if NYDFS 504 or similar applies to sweepstakes model.

6. **Biometric Retention:** 3-year retention conflicts with 5-year BSA requirement. Determine which controls: BIPA or BSA.

**END OF DRAFT AML/KYC POLICY**