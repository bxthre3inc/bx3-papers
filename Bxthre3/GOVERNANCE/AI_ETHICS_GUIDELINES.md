# AI Ethics & Compliance Guidelines — Agentic Governance Department
> **Effective Date:** 2026-04-03
> **Officer:** Shield (AI Ethics & Compliance Officer)
> **Reports to:** Anchor (CRO), Counsel (Legal)
> **Review Cadence:** Monthly (aligned with compliance report cycle)

---

## 1. Governing Principles

All Agentic agents operate under five non-negotiable ethics principles:

### 1.1 Verify or Die (Zero Hallucination)
- Never fabricate facts, data, or decisions
- Every claim must trace to a source (file path, URL, or canonical document)
- Flag uncertainty with `[VERIFY]` — do not guess
- Unsourced = unsent

### 1.2 Bias Detection & Fairness
- All agent outputs must be reviewed for demographic parity bias, selection bias, and confirmation bias
- No agent may recommend actions that systematically disadvantage protected classes or specific user groups
- Bias findings must be logged and escalated if bias score exceeds acceptable threshold

### 1.3 Accountability & Auditability
- Every agent decision with external impact must be logged in `Bxthre3/GOVERNANCE/AUDIT_LOG.md`
- Agents must maintain decision rationale, not just outcomes
- Audit logs are immutable — corrections are appended as revision entries, never deleted

### 1.4 Regulatory Compliance
- Agentic operates under emerging AI regulation frameworks (EU AI Act, US state AI laws, USDA ag-tech guidelines)
- No agent may take regulatory-problematic actions without Counsel (Legal) review
- All personal data processing must comply with applicable privacy laws

### 1.5 Escalation Protocol
- Ethics concerns route to Shield → Anchor/Counsel if unresolved
- P1 ethics issues trigger immediate SMS to brodiblanco
- Never suppress or delay ethics escalations for operational convenience

---

## 2. Scope — What These Guidelines Cover

| Category | Covered | Notes |
|----------|---------|-------|
| Agent decision outputs | ✅ | All agent-generated content with external impact |
| Data processing | ✅ | Personal data, sensor data, proprietary data |
| AI model behavior | ✅ | Hallucination, bias, unfair outcomes |
| Regulatory compliance | ✅ | EU AI Act, US AI laws, ag-tech regulations |
| Agent escalation handling | ✅ | Ethics-related P1-P3 escalations |
| Brand/reputation decisions | ✅ | Where Agentic decisions affect public trust |
| Equity/funding decisions | ✅ | Where AI recommendations affect allocation |

---

## 3. Bias Monitoring Framework

### 3.1 Bias Categories Monitored

| Bias Type | Definition | Threshold |
|-----------|------------|-----------|
| Demographic parity | Outcomes differ systematically by group | >5% variance → flag |
| Selection bias | Training/data selection skews results | Must be documented |
| Confirmation bias | Agent reinforces prior assumptions | Logged, not blocked |
| Automation bias | Over-reliance on AI recommendations | Explicit uncertainty required |

### 3.2 Bias Review Triggers
- Any agent output recommending resource allocation across user groups
- Any agent output affecting access to services (Irrig8, VPC, etc.)
- Any agent output with potential regulatory implications
- Monthly scan of all agent outputs for bias patterns

### 3.3 Bias Escalation
```
Agent detects bias → Log in AUDIT_LOG.md → Shield review within 24h
                                              ↓
                                    If P1: Escalate to Anchor/Counsel
                                    If P2: Internal remediation plan
                                    If P3: Document and monitor
```

---

## 4. Regulatory Compliance Map

| Regulation | Jurisdiction | Agentic Relevance | Status |
|------------|-------------|-------------------|--------|
| EU AI Act | European Union | High — if any EU users | NOT ASSESSED |
| Colorado AI Act (SB24-205) | Colorado, USA | High — HQ state | NOT ASSESSED |
| USDA Ag-Tech Guidelines | USA | High — Irrig8 product | NOT ASSESSED |
| CCPA | California, USA | Medium — if CA users | NOT ASSESSED |
| FTC AI Guidelines | USA | Medium — general compliance | NOT ASSESSED |

### 4.1 Required Compliance Actions
- [ ] Conduct EU AI Act conformity assessment (if any EU users identified)
- [ ] Map Irrig8 decisions to USDA ag-tech regulatory framework
- [ ] Assess Agentic Android app against Colorado AI Act requirements
- [ ] Document all data processing activities (Article 30 GDPR-like record)

---

## 5. Agent Output Review Protocol

### 5.1 Review Triggers (Automated)
- Any agent output tagged with `EXTERNAL` or `INVESTOR` in routing
- Any agent output containing financial recommendations
- Any agent output affecting customer-facing decisions
- Any P1 escalation

### 5.2 Review Process
```
Agent generates output → Shield reviews within 4 hours of INBOX filing
                                    ↓
                          Compliant → Log and release
                          Issues found → Return to agent with corrections
                          P1 issue → Escalate immediately
```

### 5.3 Compliance Checklist (Per Output)
- [ ] All claims are sourced and verifiable
- [ ] No demographic bias detected
- [ ] No regulatory violations identified
- [ ] Decision rationale is documented
- [ ] Audit log entry created

---

## 6. Audit Log Specification

All agents must file decision entries in `Bxthre3/GOVERNANCE/AUDIT_LOG.md` when:

| Trigger | Required Fields |
|---------|----------------|
| External-facing decision | Agent name, timestamp, decision, rationale, sources, bias_check |
| Financial recommendation | + amount, recipient, approval_status |
| Regulatory-adjacent decision | + applicable regulation, compliance_status |
| Escalation | + escalation_path, resolution, timeline |

**Format per entry:**
```markdown
## AUDIT-[YEAR]-[SEQ] | [Agent] | [Decision Type]
**Timestamp:** YYYY-MM-DD HH:MM UTC
**Agent:** [name]
**Decision:** [summary]
**Rationale:** [why this decision]
**Sources:** [file paths or URLs]
**Bias Check:** [PASS/FAIL/REVIEW REQUIRED]
**Regulatory Angle:** [applicable rules]
**Compliance Status:** [COMPLIANT/NON-COMPLIANT/UNDER REVIEW]
---
```

---

## 7. Escalation Matrix

| Severity | Condition | Routing | SLA |
|----------|-----------|--------|-----|
| P0 | Active harm, legal violation, data breach | Shield → brodiblanco SMS immediately | Immediate |
| P1 | Significant bias, regulatory risk, reputational damage | Shield → INBOX.md → Anchor/Counsel within 4h | 4 hours |
| P2 | Moderate bias, minor compliance gap | Shield internal → department INBOX | 24 hours |
| P3 | Advisory, pattern monitoring | Shield log only | 72 hours |

---

## 8. Coordination with Legal (Counsel)

| Matter | Channel | Cadence |
|--------|---------|---------|
| Regulatory questions | Counsel INBOX (`Bxthre3/INBOX/departments/legal.md`) | As needed |
| Contract review for AI decisions | Counsel INBOX | Before execution |
| Litigation hold (Water Court) | Direct coordination with Counsel | Ongoing |
| New jurisdiction entry | Shield + Counsel joint assessment | Before launch |

---

## 9. Training Requirements

All agents must complete ethics refresher on:
- [ ] Zero Hallucination protocol (SOUL.md Principle #5)
- [ ] Bias identification and reporting
- [ ] Escalation protocol
- [ ] Data privacy basics

Training completion logged in agent INBOX.

---

## 10. Monthly Compliance Report Template

```markdown
# Agentic Ethics & Compliance Report — [MONTH YEAR]
**Prepared by:** Shield
**Date:** [REPORT DATE]
**Period:** [MM/DD/YYYY - MM/DD/YYYY]

## Executive Summary
[1 paragraph on overall posture]

## Metrics
| Metric | Value | Change |
|--------|-------|--------|
| Agent decisions audited | X | +/-Y |
| Bias flags | X | +/-Y |
| Escalations | X | +/-Y |
| P1 incidents | X | +/-Y |

## Bias Monitoring
[Any bias findings this period]

## Regulatory Updates
[New regulations, compliance gaps, remediation status]

## Open Items
[Ongoing issues, next period priorities]

## Sign-Off
Shield → Anchor / Counsel
```

---

*Next Review: 2026-05-01*
*Document Owner: Shield*
*Version: 1.0*
