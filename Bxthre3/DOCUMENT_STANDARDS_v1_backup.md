# Bxthre3 Document Standards
**Version:** 1.0  
**Owner:** brodiblanco | **Maintained by:** Agentic  
**Effective:** 2026-04-02  
**Reference:** `file 'SOUL.md'` Principle #5 (Zero Hallucination)

---

## Purpose

This document defines every document type used across Bxthre3 Inc and Agentic, including:
- Required sections and structure
- Quality criteria and acceptance standards
- Approval workflows and sign-offs
- Rejection criteria (what instantly disqualifies a document)
- Source verification requirements

**Core Principle:** *No document ships without meeting its standard. Unsourced = Unsent.*

---

## Document Taxonomy

### LEGACY TYPES (v1.0 — Maintained)

| Type | Code | Purpose | Owner | Approval |
|------|------|---------|-------|----------|
| Product Spec | SPEC | What product is/does | Product Lead | brodiblanco |
| Architecture Doc | ARCH | Technical design | Engineering Lead | CTO + brodiblanco |
| BOM | BOM | Parts/materials list | Engineering | CFO + brodiblanco |
| Grant Application | GRANT | Funding request | Grants Lead | brodiblanco |
| Investor Deck | DECK | Equity raise materials | CFO | brodiblanco |
| One Pager | 1PG | Venture summary | Press/Comms | brodiblanco |
| SOP | SOP | Standard procedure | Dept Lead | COO |
| Runbook | RUN | Operational execution | Operations | Dept Lead |
| Financial Projection | FIN | Revenue forecasts | CFO | brodiblanco |
| Legal Doc | LEGAL | Contracts | Legal | brodiblanco + Counsel |
| Meeting Notes | MTG | Meeting capture | Any | None |
| Email/Draft | EM | External comms | Any | Per content |

### AGENTOS PLATFORM TYPES (The Engine)

| Type | Code | Purpose | Owner | Approval |
|------|------|---------|-------|----------|
| Platform Architecture | AOS-ARCH | System design, APIs, data | CTO | brodiblanco |
| Build Spec | AOS-BUILD | How to build/deploy AOS | DevOps | CTO + brodiblanco |
| Agent Definition | AGENT-DEF | Standard for new agents | CTO | brodiblanco |
| Task Schema | TASK-SCHEMA | Task structure, validation | CTO | CTO |
| Platform BOM | AOS-BOM | Infrastructure parts | DevOps | CTO + CFO |
| API Contract | AOS-API | All endpoints documented | Engineering | CTO |
| Release Notes | AOS-REL | Version contents | DevOps | brodiblanco |
| Dependency Map | AOS-DEPS | External deps + versions | DevOps | CTO |

### AGENTOS CAPABILITY TYPES (The Work)

| Type | Code | Purpose | Owner | Approval |
|------|------|---------|-------|----------|
| Hardware Spec | HW-SPEC | Physical product reqs | Hardware Lead | brodiblanco |
| Software Spec | SW-SPEC | Code/module reqs | Engineering Lead | brodiblanco |
| Architecture Spec | ARCH | Product-specific tech | Engineering Lead | CTO |
| Build-Out Docs | BUILD | Site/facility specs | Operations | COO |
| BOM Electronics | BOM-E | PCBs, sensors | Engineering | CFO |
| BOM Mechanical | BOM-M | Enclosures, mounts | Engineering | CFO |
| BOM Consumables | BOM-C | Items consumed | Operations | COO |
| BOM Infrastructure | BOM-I | Server, network, facility | DevOps | CTO + CFO |
| Agent Spec | AG-SPEC | Agent definition | Dept Lead | brodiblanco |
| Task Definition | TASK | Specific work assignment | Any Agent | Dept Lead |
| Structured Output | SOUT | Machine-readable deliverable | Author | Dept Lead |
| Dependency Spec | PROJ-DEPS | What project needs from others | Owner | brodiblanco |
| Business Plan | BIZ | Market, model, financials | Founder | brodiblanco |
| Go-to-Market | GTM | Launch strategy | Marketing | brodiblanco |

---

## 1. PRODUCT SPEC (SPEC)

**Purpose:** Defines a product or feature completely enough to build it.

### Required Sections

```
SPEC-{PRODUCT_CODE}-{VERSION}.md

# {Product Name} — Product Specification v{VERSION}
**Status:** [DRAFT → REVIEW → APPROVED → DEPRECATED]
**Owner:** {Agent/Department}
**Created:** {YYYY-MM-DD}
**Updated:** {YYYY-MM-DD}

---

## 1. Problem Statement
What problem does this solve? Who has this problem? [Source: user interview, data, or direct input]

## 2. Solution Hypothesis
What is the proposed solution? How does it solve the problem?

## 3. Target Users
- Primary user persona: [defined]
- Secondary users: [if any]
- User research source: [file path or URL]

## 4. Functional Requirements
| ID | Requirement | Priority | Acceptance Criteria | Source |
|----|-------------|----------|---------------------|--------|
| FR-01 | {requirement} | P0 | {criteria} | {source file} |

## 5. Non-Functional Requirements
- Performance: [metric + source]
- Security: [requirement + source]
- Scalability: [metric]
- Compliance: [reg + source]

## 6. Success Metrics
How do we know this worked? [Specific, measurable]

## 7. Dependencies
- Technical: [arch doc refs]
- Business: [stakeholder sign-off refs]
- External: [APIs, vendors, etc.]

## 8. Open Questions
[What needs decision before build?]

## 9. TBD Fields (if incomplete)
List fields awaiting brodiblanco input with: `DECIDE: {field} — {impact if undecided}`

## SOURCES
List all file paths, URLs, and documents referenced:
- `file 'path/to/user-research.md'`
- `file 'path/to/technical-constraint.md'`
- https://source-url.com/page
```

### Quality Criteria
- [ ] Every requirement has acceptance criteria
- [ ] Every metric is quantifiable (not "better" or "improved")
- [ ] All sources cited in section 9
- [ ] No TBD fields in APPROVED specs

### Rejection Criteria (Auto-fail)
- Requirements without acceptance criteria
- Unmeasurable success metrics
- Missing source citations
- Solution without defined problem

### Approval Workflow
1. Author completes SPEC → drafts
2. Author self-certifies: sources verified, criteria met
3. Submit to brodiblanco via INBOX.md P2
4. brodiblanco: Approve, Request Changes, or Reject
5. Approved → promote from `ThinkTank/` to `projects/{code}/SPEC.md`

---

## 2. ARCHITECTURE DOCUMENT (ARCH)

**Purpose:** Technical design that multiple engineers can implement from.

### Required Sections

```
ARCH-{PROJECT}-{COMPONENT}.md

# {Component} Architecture
**Status:** [DRAFT → REVIEW → APPROVED → DEPRECATED]
**System:** {System name}
**Component:** {Component name}
**Owner:** {Engineering Lead}
**Created:** {YYYY-MM-DD}

---

## Context
What exists now? What is this changing?

## Decision Records (ADRs)
Each significant decision as a table:

| ID | Decision | Alternatives Considered | Rationale | Consequences |
|----|----------|------------------------|-----------|--------------|
| ADR-001 | {decision} | {options} | {why chosen} | {trade-offs} |

## System Diagram
[Mermaid or link to diagram file]

## Data Models
// interface definitions with field meanings

## API Contracts
| Endpoint | Method | Request | Response | Auth | Rate Limit |
|----------|--------|---------|----------|------|------------|

## Integration Points
- Systems this touches
- Contracts with those systems
- Failure modes

## Security Considerations
- Threat model
- Mitigations
- Secrets handling

## Deployment
- Infrastructure requirements
- Environment differences
- Rollback plan

## SOURCES
- `file 'path/to/constraint-doc.md'`
- https://api-docs.external-service.com
```

### Quality Criteria
- [ ] ADRs explain *why*, not just *what*
- [ ] Diagrams are current (date stamped)
- [ ] API contracts include error responses
- [ ] Security section reviewed by Security Lead

### Rejection Criteria
- Diagrams without explanation
- APIs without error handling
- Architecture without identified trade-offs
- Missing security review for external-facing components

---

## 3. BILL OF MATERIALS (BOM)

**Purpose:** Complete list of parts, materials, assemblies needed to build hardware.

### Required Sections

```
BOM-{PRODUCT}-{VERSION}.csv (or .md table)

# {Product} — Bill of Materials v{VERSION}
**Status:** [DRAFT → SOURCING → ORDERED → INVENTORY → DEPRECATED]
**Assembly:** {Assembly name/number}
**Owner:** {Engineering}
**Created:** {YYYY-MM-DD}
**Unit Cost Target:** ${amount}

---

## Line Items

| Line | Part Number | Description | Specs | Qty | Unit Cost | Source/Vendor | Lead Time | Status |
|------|-------------|-------------|-------|-----|-----------|---------------|-----------|--------|
| 001 | PN-XXX | {description} | {specs} | {n} | ${cost} | {vendor} | {weeks} | [QUOTE/PENDING/ORDERED] |

## Assembly Hierarchy
- Assembly A
  - Sub-assembly A.1
    - Part 001
    - Part 002
  - Sub-assembly A.2

## Sourcing Notes
- Vendor contacts verified? [ ] Y [ ] N
- Quotes current? [ ] Y [ ] N (as of {date})
- Alternatives identified for each part? [ ] Y [ ] N

## Cost Breakdown
| Category | Line Item Range | Subtotal |
|----------|-----------------|----------|
| Electronics | 001-025 | $X |
| Enclosure | 026-040 | $Y |

## SOURCES
- Vendor quote: `file 'path/to/quote.pdf'`
- Datasheet: https://manufacturer.com/part/datasheet.pdf
```

### Quality Criteria
- [ ] Every part has verified part number
- [ ] Vendor contact info verified within 30 days
- [ ] Lead times documented
- [ ] Unit cost based on quote (not estimate)
- [ ] Alternates identified for critical/long-lead parts

### Rejection Criteria
- Estimated costs without quote reference
- Parts without vendor contact
- No alternates for single-source components
- Missing lead times for critical path items

---

## 4. GRANT APPLICATION (GRANT)

**Purpose:** Complete funding request ready for submission.

### Required Sections

```
GRANT-{FUNDER}-{OPPORTUNITY}.md

# {Grant Name} — Application Package
**Status:** [RESEARCH → DRAFT → REVIEW → READY → SUBMITTED → FUNDED/REJECTED]
**Opportunity ID:** {funder-assigned ID}
**Funder:** {Agency Name}
**Deadline:** {YYYY-MM-DD HH:MM}
**Amount:** ${amount}
**Fit Score:** {0-100}
**Owner:** {Grants Lead}
**Writer:** {Drew}
**Researcher:** {Raj}

---

## Executive Summary
1-page narrative covering:
- What we are requesting
- Why we qualify
- Expected outcomes

## Narrative Sections
### Problem Statement
[Verified need with source citations]

### Solution
[How this addresses the problem]

### Innovation
[What is novel — with prior art comparison]

### Team Qualifications
[Why us — with bio refs]

### Impact
[Quantified expected outcomes]

## Budget
| Line Item | Amount | Justification | Source Quote |
|-----------|--------|---------------|--------------|
| Personnel | $X | [role + hours] | N/A |
| Equipment | $Y | [what + why] | `file 'quote.pdf'` |

## Required Attachments
- [ ] Letters of support (with signers identified)
- [ ] Financial statements (dated)
- [ ] Certifications (with expiration dates)

## SOURCES.md (Separate File Required)
Every fact about the grant:
- Funder page: https://grants.gov/opportunity/{ID}
- Eligibility: https://funder.gov/eligibility
- Contact verification: [date + method]
- Deadline source: [screenshot or email]
```

### Quality Criteria
- [ ] SOURCES.md created and linked
- [ ] ≥90% of facts cite verified sources
- [ ] Budget based on quotes, not estimates
- [ ] Letters of support confirmed (not just requested)
- [ ] Reviewed by Casey for accuracy

### Rejection Criteria
- Claims about eligibility without funder citation
- Budget line items without justification
- Generic boilerplate without customization
- Missing required certifications
- Unverified contact information
- Any `[VERIFY]` or `[NEEDS SOURCE]` tags remaining

---

## 5. INVESTOR DECK (DECK)

**Purpose:** Equity raise presentation for investors.

### Required Sections

```
DECK-{VENTURE}-{DATE}.html or .pdf

# {Venture} — Investor Deck
**Status:** [DRAFT → REVIEW → APPROVED → PRESENTED → CLOSED]
**Funding Ask:** ${amount}
**Round:** {Series/Stage}
**Pre-money:** ${valuation}
**Minimum Check:** ${amount}

---

## 1. The Problem
[Clear, validated problem with market size — cited source]

## 2. The Solution
- What we built
- Why it works
- Proof points (metrics, pilots, customers)

## 3. Market Opportunity
| Metric | Value | Source |
|----------|-------|--------|
| TAM | $X | [citation] |
| SAM | $Y | [citation] |

## 4. Business Model
- Revenue model
- Unit economics (with source data)
- GTM strategy

## 5. Traction
| Metric | Value | Date | Source |
|--------|-------|------|--------|
| Users | X | YYYY-MM | [dashboard ref] |
| Revenue | $Y | YYYY-MM | [stripe ref] |

## 6. Team
- Key members with verified backgrounds
- [LinkedIn profiles attached]

## 7. Financial Projections
- Years 1-3 with assumptions documented
- Source for assumptions: `file 'FIN-{venture}-2026.md'`

## 8. The Ask
- Amount
- Use of funds
- Milestones

## SOURCES
- Market data: https://source.com
- Traction: `file 'Bxthre3/TELEMETRY/telemetry_YYYY-MM-DD.json'`
- Financials: `file 'Bxthre3/projects/{venture}/fin/FIN-...md'`
```

### Quality Criteria
- [ ] Every number has a source
- [ ] Market sizes cited (not invented)
- [ ] Team bios verified
- [ ] Financial projections have documented assumptions
- [ ] Unit economics calculated, not guessed

### Rejection Criteria
- Round market sizes ("~$5B") without source
- Unverified team claims
- Missing traction data
- Generic market analysis
- Financial projections without assumptions documented

---

## 6. AGENT INBOX (AGIN)

**Purpose:** Daily reports, status, escalations from individual agents.

### Required Format

```
{AGENT_NAME}.md

# {Agent Name} — Agent INBOX
**Role:** {Role}
**Reports to:** {Department Lead}
**Updated:** {YYYY-MM-DD HH:MM UTC}

---

## YOUR JOB
[Clear, specific instructions for this agent]

## STATUS
- **Current Task:** {what is being worked on now}
- **Status:** [BLOCKED → WORKING → REVIEW → COMPLETE]
- **ETA:** {YYYY-MM-DD}
- **Blockers:** [none → listed]

## DECISIONS NEEDED
| Priority | Question | Due | Impact |
|----------|----------|-----|--------|
| P1 | {question} | {date} | {if not answered} |

## COMPLETED
| Date | Task | Result |
|------|------|--------|
| YYYY-MM-DD | {task} | {outcome} |

## SOURCES
References this agent uses:
- `file 'path/to/doc.md'`
- `file 'path/to/standard.md'`
```

### Quality Criteria
- [ ] Updated daily
- [ ] Blockers explicit (not vague)
- [ ] Timezone specified on timestamps
- [ ] Sources section maintained

### Rejection Criteria
- Vague status ("working on stuff")
- Missing timestamps
- Blockers without specific dependency named
- Out of date (>48 hours without update)

### Routing Rules
- P0/P1: `INBOX.md` AND SMS brodiblanco
- P2: `INBOX/agents/{agent}.md` + escalate to department
- P3: `INBOX/agents/{agent}.md` only

---

## 7. CANONICAL INBOX (CIN)

**Purpose:** P0/P1 escalations to CEO only.

### Required Format

```
INBOX.md

# Bxthre3 INC CEO INBOX
**Owner:** brodiblanco | **Last Updated:** {ISO timestamp}

---

## 🔴 P0 — Crisis / Down / Blocking Everything

### [YYYY-MM-DD] 🔴 {Agent} | {One-line summary}
**Issue:** {what broke / what is blocked}
**Impact:** {scope of damage}
**Action:** {what is being done}
**ETA:** {when fixed}

---

## 🟠 P1 — Critical / Urgent Decision

### [YYYY-MM-DD] 🟠 {Agent} | {One-line summary}
**Decision needed:** {what brodiblanco must decide}
**Deadline:** {YYYY-MM-DD}
**Context:** {file reference}
**Recommendation:** {agent's suggestion}

---

## 🟡 P2 — Important / Review Soon

### [YYYY-MM-DD] 🟡 {Agent} | {One-line summary}
{Details}

---

## 🟢 P3 — Administrative / FYI

### [YYYY-MM-DD] 🟢 {Agent} | {One-line summary}
{Details}

---
```

### Quality Criteria
- [ ] P0/P1 trigger SMS alert
- [ ] One-line summary tells the whole story
- [ ] Every entry has timestamp
- [ ] File references are exact paths

### Rejection Criteria
- P0 without immediate SMS
- Vague summaries ("something is wrong")
- Missing file references
- Routine updates at P0/P1

---

## 8. RESEARCH BRIEF (RSRCH)

**Purpose:** Grant/contract/IOI discovery for pipeline.

### Required Format

```
RSRCH-{GRANT_ID}-{DATE}.md

# {Grant Name} — Research Brief
**Grant ID:** {internal tracking ID}
**Opportunity ID:** {funder ID}
**Funder:** {Agency Name}
**Fit Score:** {0-100}
**Amount:** ${value} — Source: {URL}
**Deadline:** {YYYY-MM-DD} — Source: {URL}
**Eligibility:** {criteria} — Source: {URL}
**Researcher:** {Raj}
**Date:** {YYYY-MM-DD}

---

## EXECUTIVE SUMMARY
{2-3 sentence summary}

## OPPORTUNITY DETAILS
- Program name: [cited]
- Funding mechanism: [cited]
- Award range: [cited]
- Cost share required: [cited]

## ELIGIBILITY VERIFICATION
| Requirement | Status | Source |
|-------------|--------|--------|
| {req} | [Y/N/MAYBE] | {URL or file} |

## APPLICATION REQUIREMENTS
| Document | Required | Source |
|----------|----------|--------|
| {doc} | [Y/N] | {URL} |

## CONTACT
Name: {name} — Source: {URL or email}
Phone: {number} — Source: {URL}
Status: [VERIFIED by {method} on {date} / UNVERIFIED]

## CONFIDENCE ASSESSMENT
- Data completeness: {%}
- Source reliability: [Official/Secondary/Unclear]
- Gaps: [what is unknown]

## RECOMMENDATION
[GO/NO-GO/DEFER] — {rationale}

## SOURCES
1. {funder URL}
2. `file 'path/to/downloaded.pdf'`
3. Email from {contact} {date}
```

### Quality Criteria
- [ ] ≥90% sourced facts
- [ ] Contact info verified OR flagged [UNVERIFIED]
- [ ] Confidence assessment included
- [ ] Deadline traced to official source

### Rejection Criteria
- Amount/deadline without source URL
- Contact info invented (not verified/found)
- Generic eligibility (not specific to this grant)
- Boilerplate summary without specifics
- No confidence assessment

### Routing
- ≥80 fit → Casey immediately via INBOX
- 60-79 fit → Department INBOX weekly roundup
- <60 fit → Archive with note

---

## 9. SOP — STANDARD OPERATING PROCEDURE

**Purpose:** Repeatable process for consistent execution.

### Required Format

```
SOP-{DEPARTMENT}-{PROCESS}-{VERSION}.md

# {Process Name} — Standard Operating Procedure
**Department:** {Department}
**Version:** {semantic version}
**Owner:** {Department Lead}
**Created:** {YYYY-MM-DD}
**Last Reviewed:** {YYYY-MM-DD}
**Review Cadence:** {monthly/quarterly/yearly}

---

## Purpose
What process does this document? Why does it exist?

## Scope
- In scope: {what IS covered}
- Out of scope: {what is NOT covered}

## Prerequisites
- [ ] {what must be true before starting}
- [ ] {checklist items}

## Procedure Steps

### Step 1: {Name}
**Time:** {duration}
**Who:** {role responsible}

1. {specific action}
2. {specific action}
3. {verification: how do you know it worked?}

### Step 2: {Name}
...

## Decision Points
| Step | Condition | If Yes | If No |
|------|-----------|--------|-------|
| 3 | {condition} | {action} | {action} |

## Common Issues
| Issue | Cause | Solution |
|-------|-------|----------|
| {symptom} | {root cause} | {fix} |

## Escalation
- Escalate to {role} when: {condition}
- Via: {method — INBOX, SMS, etc.}

## Audit Trail
| Date | Person | Change | Reason |
|------|--------|--------|--------|
| YYYY-MM-DD | {who} | {what} | {why} |
```

### Quality Criteria
- [ ] Every step has verification
- [ ] Decision points with yes/no paths
- [ ] Escalation criteria explicit
- [ ] Reviewed within last 90 days

### Rejection Criteria
- Steps without verification method
- Missing escalation criteria
- Vague language ("do the thing")
- Links to external docs without backup plan

---

## 10. RUNBOOK — OPERATIONAL EXECUTION

**Purpose:** Emergency/operational execution guide for live systems.

### Required Format

```
RUN-{SYSTEM}-{SCENARIO}.md

# {System} Runbook — {Scenario}
**Severity:** [P0/P1/P2/P3]
**System:** {name}
**Scenario:** {what went wrong}
**Owner:** {on-call role}
**Created:** {YYYY-MM-DD}

---

## Detection
- **Alert:** {what alert fires?}
- **Symptom:** {what does user see?}
- **Dashboard:** {where to check?}

## Immediate Assessment (First 2 Minutes)
| Check | Command/Location | Expected |
|-------|------------------|----------|
| Is the service running? | {command} | {expected output} |
| Last error log | {grep command} | {what to look for} |

## Response Flowchart
```
Service Running?
├─ YES → Check Load Balancer
│        ├─ Healthy → Check Database
│        └─ Unhealthy → {action}
└─ NO → Start Service
         ├─ Success → {action}
         └─ Fails → {escalation}
```

## Step-by-Step Remediation

### Option A: {Condition}
```bash
# Exact commands to run
curl -X POST ...
systemctl restart ...
```

### Option B: {Alternative Condition}
...

## Verification
| Step | Verification | Pass |
|------|------------|------|
| 1 | Health check returns 200 | [ ] |
| 2 | Response time < {ms} | [ ] |

## Rollback
If fix fails, revert to: {previous state / tag}
Commands: {exact rollback commands}

## Post-Incident
- Log to: {incident log location}
- Notify: {who to tell}

## Related Runbooks
- `file 'RUN-{system}-{other}.md'`
```

### Quality Criteria
- [ ] Exact commands (copy-paste ready)
- [ ] Verification steps measurable
- [ ] Rollback procedure tested
- [ ] Decision flowchart included

### Rejection Criteria
- Vague instructions ("check the logs")
- No verification steps
- Missing rollback procedure
- No escalation path

---

## 11. FINANCIAL PROJECTION (FIN)

**Purpose:** Revenue/cost forecasting with documented assumptions.

### Required Format

```
FIN-{VENTURE}-{PERIOD}.md

# {Venture} — Financial Projections
**Period:** {YYYY - YYYY}
**Status:** [DRAFT → REVIEW → APPROVED]
**Owner:** CFO/Balance
**Last Updated:** {YYYY-MM-DD}

---

## Summary
| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue | $X | $Y | $Z |
| Costs | $A | $B | $C |
| Net | $(X-A) | $(Y-B) | $(Z-C) |

## Revenue Model

### Revenue Stream 1: {Name}
| Variable | Value | Assumption Source |
|----------|-------|-------------------|
| Customers | N | {file 'source.md'} |
| ARPU | $X | {research citation} |
| Churn | Y% | {comp benchmark} |

**Calculation:** {explicit formula}

## Cost Structure

### Fixed Costs
| Item | Monthly | Annual |
|------|---------|--------|
| {item} | $X | $Y |

### Variable Costs
| Item | Unit Cost | Basis |
|------|-----------|-------|
| COGS | $X | {quote} |

## Assumptions Log
| ID | Assumption | Source | Confidence |
|----|------------|--------|------------|
| A1 | {statement} | {file or URL} | [High/Med/Low] |

## Sensitivity Analysis
| Scenario | Revenue Impact | Trigger |
|----------|---------------|---------|
| {scenario} | {+/- X%} | {condition} |

## SOURCES
- Market research: {file 'path'}
- Customer quotes: {file 'path'}
- Vendor quotes: {file 'path'}
```

### Quality Criteria
- [ ] Every assumption cited
- [ ] Formulas explicit (not magic numbers)
- [ ] Sensitivity analysis included
- [ ] Confidence levels on assumptions

### Rejection Criteria
- Numbers without calculation basis
- Market size without source
- Missing sensitivity scenarios
- Undocumented assumptions

---


## 12. ONE PAGER (1PG)

**Purpose:** Venture summary for investors/partners to understand quickly.

### Required Format

```
1PG-{VENTURE}-{DATE}.md

# {Venture} — One Pager
**Version:** {version}
**Date:** {YYYY-MM-DD}
**Owner:** {Press/Comms}
**Status:** [DRAFT → REVIEW → APPROVED]

---

## The Problem (2 sentences)
{clear problem with market context}

## The Solution (2 sentences)
{what we built and how it solves the problem}

## Traction (Facts only)
- {metric}: {value} (as of {date})
- {metric}: {value}

## Ask / Opportunity
- Raising: ${amount}
- Use: {specific, not generic}
- Contact: {email}

## Sources
- `file 'SPEC-{code}-v1.md'`
- `file 'DECK-{code}-2026.md'`
```

### Quality Criteria
- [ ] Fits on 1 printed page
- [ ] Every claim has source
- [ ] Contact info verified

### Rejection Criteria
- More than 1 page
- Vague traction
- No source citations

---

## GENERAL QUALITY GATES

### Pre-Submission Checklist (All Documents)

```
DOCUMENT CERTIFICATION

Type: {SPEC/ARCH/BOM/etc.}
Doc ID: {filename}
Author: {agent name}

[ ] All sources cited (≥90% for research, 100% for investor docs)
[ ] No placeholder text (TODO, FIXME, coming soon)
[ ] No fabricated information (amounts, deadlines, contacts)
[ ] All dates with timezone
[ ] File references verified to exist
[ ] Self-checked against rejection criteria (see below)
[ ] Author sign-off: ________________ (initials)

Routing to: {INBOX location}
Expected signatory: {who approves}
```

### Universal Rejection Criteria (All Doc Types)

| Issue | Severity | Action |
|-------|----------|--------|
| Missing source citation | REJECT | Return to author with source request |
| `[VERIFY]` tag remaining | REJECT | Must be resolved or explained |
| `[NEEDS SOURCE]` tag | REJECT | Source must be found, not invented |
| Placeholder text (TODO/FIXME/etc) | REJECT | Complete or remove before submission |
| Fabricated fact discovered | REJECT + FLAG | Escalate to brodiblanco as P1 accuracy breach |
| Outdated timestamp (>30 days) | WARNING | Update before routing |
| Unmeasurable success criteria | REJECT | Define metrics |

### Document Routing Matrix

| Document Type | Where Created | Where Routed | Approval |
|---------------|---------------|--------------|----------|
| SPEC | ThinkTank/ | projects/{code}/SPEC.md | brodiblanco |
| ARCH | projects/{code}/docs/ | Same (REVIEW → APPROVED) | CTO |
| BOM | projects/{code}/manufacturing/ | Same (ORDERED → INVENTORY) | CFO |
| GRANT | grants/in-progress/ | grants/submitted/ → FUNDED | brodiblanco |
| DECK | vpc-decks/ | Published to zo.space | brodiblanco |
| 1PG | projects/{code}/docs/ | Same → External | brodiblanco |
| AGIN | INBOX/agents/{agent}.md | Same (daily) | Department Lead |
| CIN | INBOX.md only | P0/P1 → SMS brodiblanco | brodiblanco |
| RSRCH | grants/research/ | INBOX/departments/grants.md | Casey |
| SOP | SOPS/ | Same (monthly review) | COO |
| RUN | SOPS/runbooks/ | Same (quarterly test) | Department Lead |
| FIN | projects/{code}/fin/ | Same → INBOX.md P2 | brodiblanco |
| LEGAL | Legal/ | Same → INBOX.md P1 | Legal + brodiblanco |

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

# PART II: AGENTOS POSITIONING — INTERNAL INFRASTRUCTURE

> **Agentic is not a product.** It is the internal force multiplier that builds and runs products.
> **Analogy:** IBM Watson — impressive technology that demonstrated capability, but primarily served as internal infrastructure and competitive advantage, not a standalone SKU.

## What Agentic Is

| Aspect | Description |
|--------|-------------|
| **Nature** | Internal AI workforce orchestration platform |
| **Purpose** | Force multiplier for Bxthre3 ventures |
| **Users** | Bxthre3 agents, employees, contractors |
| **Value** | Speed, consistency, 24/7 execution, zero-hallucination quality |
| **Revenue** | Indirect — enables products that generate revenue |

## What Agentic Is NOT

| Aspect | Description |
|--------|-------------|
| **NOT a product** | Not sold to customers, not licensed, not SaaS |
| **NOT a venture** | No P&L, no fundraising round, no separate equity structure |
| **NOT external** | Not marketed to enterprises as "AI workforce solution" |
| **NOT open source** | Core IP, proprietary to Bxthre3 |

## External Positioning (For Clout/Investment)

**How we talk about it publicly:**

> *"Bxthre3 operates its own AI workforce orchestration platform — Agentic — that enables our 18 AI agents to work 24/7 across all ventures. This internal capability accelerates execution, ensures quality standards, and gives us unfair advantage in speed-to-market."*

**What investors see:**
- Demo of agents working in parallel
- Quality gates (zero hallucination enforcement)
- Speed metrics vs. traditional human-only teams
- Infrastructure moat — not easily replicated

**What we do NOT say:**
- ❌ "Agentic is our next product"
- ❌ "We're building Agentic to sell to enterprises"
- ❌ "Agentic is a standalone business unit"

## Document Implications

| Type | Location | Contains |
|------|----------|----------|
| **Agentic Platform Docs** | `the-agentic-project/docs/` | Internal architecture, NOT customer-facing |
| **Agentic Demos** | `the-agentic-project/demos/` | Investor demos, NOT product marketing |
| **Agent PRs** | `the-agentic-project/press/` | Capability announcements, NOT product launches |

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS-*) | Capabilities (Project Docs) |
|--------|------------------|----------------------------|
| **What** | How Agentic runs | What Agentic agents DO |
| **Why** | Foundation/execution layer | Business value/ventures |
| **Who owns** | Agentic team | Venture leads |
| **Stability** | Slow, careful changes | Fast iteration |
| **Tests** | CI/CD blocking | Integration tests |
| **Docs in** | `the-agentic-project/docs/` | `projects/{name}/` |
| **Breaking** | All agents affected | One venture affected |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

## Coherence Rules

1. **Platform changes flow OUT** → never depend on venture-specific implementations
2. **Capabilities compose UP** → use platform primitives, don't recreate them
3. **No circular deps** → Platform doesn't know about Specific Product Specs
4. **Interface contracts only** → Capabilities see platform through APIs, not internals
5. **Version lock platform** → Capabilities declare which AOS version they target
6. **Upgrade path defined** → When AOS updates, capability upgrade steps documented

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

**Universal truth:** *If it doesn't meet the standard, it doesn't exist.*

---

## DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │           │
   └── [rejected] ────┘           │
   └── [changes] ────┘            │
                                  └── [archive]
```

| Status | Meaning | Who Can Set |
|--------|---------|-------------|
| **DRAFT** | Author working, not ready | Author |
| **REVIEW** | Submitted for approval | Author |
| **APPROVED** | Meets standards, canonical | brodiblanco or delegate |
| **DEPRECATED** | Superseded, do not use | brodiblanco or Owner |

---

## DOCUMENT VERIFICATION CHECKSUM

Every document file must include at end:

```
---
## DOCUMENT VERIFICATION
**Author:** {name}
**Date:** {YYYY-MM-DD}
**Status:** {DRAFT/REVIEW/APPROVED}
**Next Review:** {YYYY-MM-DD}

### Self-Certification
- [ ] ≥90% sourced (all claims attributable)
- [ ] No placeholders
- [ ] No fabrications
- [ ] File refs verified

Certified by: _______________
```

---

## REFERENCE DOCUMENTS

| Concept | Location |
|---------|----------|
| Behavioral principles | `SOUL.md` |
| Document standards | `DOCUMENT_STANDARDS.md` (this file) |
| Agent roster | `AGENTS.md` |
| INBOX routing | `INBOX.md` header + `INBOX/INBOX_ROUTING.py` |
| Project locations | `AGENTS.md` → Project Canonical Locations |
| Zero hallucination rule | User Rule: ID `7f8b17e7-9cd4-46a0-b683-fa1e8335a737` |

---

*This document is the canonical standard for all Bxthre3 Inc documentation. Agents must verify document type and apply appropriate standard before creation or submission.*

**Last Updated:** 2026-04-02  
**Version:** 1.0  
**Owner:** brodiblanco | Maintained by: Agentic  
**Status:** APPROVED


---

# PART II: AGENTOS DOCUMENTATION FRAMEWORK

> **Principle:** Separate **Platform** (what runs Agentic) from **Capabilities** (what it does)

---

## DOCUMENT CATEGORIES

### 1. AGENTOS PLATFORM (The Engine)

These documents define Agentic itself — how it runs, is built, and maintains coherence.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Platform Architecture** | AOS-ARCH | `the-agentic-project/docs/ARCHITECTURE.md` | System design, APIs, data flows |
| **Agentic Build Spec** | AOS-BUILD | `the-agentic-project/docs/BUILD-SPEC.md` | How to build/deploy Agentic |
| **Agent Def Spec** | AGENT-DEF | `the-agentic-project/docs/AGENT-SPEC.md` | Standard for defining agents |
| **Task Schema** | TASK-SCHEMA | `the-agentic-project/schemas/task.yaml` | Task structure, validation |
| **Platform BOM** | AOS-BOM | `the-agentic-project/docs/BOM.md` | Infra parts, services, deps |
| **API Contract** | AOS-API | `the-agentic-project/api/*.ts` + specs | All endpoints documented |
| **Release Notes** | AOS-REL | `releases/v{X.Y.Z}.md` | What's in each version |
| **Dependency Map** | AOS-DEPS | `the-agentic-project/docs/DEPS.md` | External deps + versions |

---

### 2. AGENTOS CAPABILITIES (The Work)

These documents define what Agentic agents DO — products, projects, operations.

| Type | Code | Location | Purpose |
|------|------|----------|---------|
| **Product Spec** | SPEC | `projects/{name}/SPEC-{code}-v{N}.md` | What product is/does |
| **Hardware Spec** | HW-SPEC | `projects/{name}/hardware/SPEC.md` | Physical product reqs |
| **Software Spec** | SW-SPEC | `projects/{name}/software/SPEC.md` | Code/module reqs |
| **Architecture** | ARCH | `projects/{name}/ARCHITECTURE.md` | Product technical design |
| **Build-Out Docs** | BUILD | `projects/{name}/build-out/*.md` | Site/facility construction |
| **BOM Electronics** | BOM-E | `projects/{name}/BOM/electronics.csv` | PCBs, sensors |
| **BOM Mechanical** | BOM-M | `projects/{name}/BOM/mechanical.csv` | Enclosures, mounts |
| **BOM Consumables** | BOM-C | `projects/{name}/BOM/consumables.csv` | Items consumed |
| **BOM Infra** | BOM-I | `projects/{name}/BOM/infrastructure.csv` | Server, network, facility |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |
| **SOP** | SOP | `projects/{name}/SOPs/{proc}.md` | Standard procedures |
| **Agent Spec** | AG-SPEC | `projects/{name}/agents/{agent}.md` | Agent instructions |
| **Task Definition** | TASK | `INBOX/tasks/{id}.md` | Specific work assignments |
| **Structured Output** | SOUT | `projects/{name}/outputs/{type}.json` | Machine-readable deliverable |
| **Dependency Spec** | PROJ-DEPS | `projects/{name}/DEPS-v{VERSION}.md` | What project needs from others |
| **Business Plan** | BIZ | `projects/{name}/BUSINESS-PLAN.md` | Market, model, financials |
| **Go-to-Market** | GTM | `projects/{name}/GTM.md` | Launch strategy |

---

## PART III: SEPARATION OF CONCERNS

## Platform vs Capabilities

| Aspect | Platform (AOS