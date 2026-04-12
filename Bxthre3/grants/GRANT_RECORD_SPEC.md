# Grant Application Tracking System — Full Data Specification
**Version:** 2.0 | **Updated:** 2026-03-23
**Purpose:** Complete data model for managing 300+ grants across Bxthre3 portfolio

---

## GRANT RECORD — COMPLETE DATA MODEL

Every grant gets ONE file: `{GRANT_ID}.md` — e.g. `FED-US-001.md`
Each file lives in: `Bxthre3/grants/records/{GRANT_ID}.md`
Batches are reference lists only: `Bxthre3/grants/BATCH-01-FED-US.md`

---

## SECTION 1: IDENTIFICATION

```yaml
grant_id: FED-US-001          # CATEGORY-REGION-SEQUENCE (auto-increment per batch)
grant_name: SBIR Phase I       # Full official name from funder
funder: NSF                    # Agency or foundation name
funder_division: Division of Information & Intelligent Systems
category: FEDERAL              # FEDERAL | STATE | FOUNDATION | INTERNATIONAL | CORPORATE | PRIZE
region: US                    # US | CO | CA | EU | UK | AF | AS | SA | OC | GLB
country: United States
url: https://www.nsf.gov/pubs/2026/nsf12345.pdf
opportunity_number: NSF 25-123 # Funder's own reference number
cfda_number: 47.041           # Catalog of Federal Domestic Assistance number
```

---

## SECTION 2: FINANCIAL

```yaml
max_amount: 275000            # Maximum award in USD
min_amount: 50000             # Minimum award
avg_award: 165000             # Historical average (if known)
currency: USD
funding_type: GRANT            # GRANT | PRIZE | EQUITY | DEBT | HYBRID | COOPERATIVE_AGREEMENT

cost_share_required: false   # true = must contribute matching funds
cost_share_percentage: 0      # % of total project cost you must cover
match_required: false
match_source_confirmed: []    # e.g. ["Colorado OEDIT", "Own funds"]

indirect_cost_applicable: true
indirect_cost_rate: 40.0      # Your negotiated indirect cost rate
indirect_cost_waived: false   # true = funder waived indirects (rare + very valuable)

payment_structure: |
  Upon execution of award agreement: 10%
  Upon mid-year progress report: 40%
  Upon final deliverables: 50%
  # Options: REIMBURSEMENT | ADVANCE | QUARTERLY | MILESTONE

total_pipeline_if_awarded: 850000  # If this grant extends across phases — total possible
```

---

## SECTION 3: TIMELINE (All Dates — The Most Important Fields)

```yaml
discovered_date: 2026-03-23   # Date we first found this grant
researcher: Raj               # Agent or human assigned

# DEADLINE HIERARCHY — ordered by importance
loi_required: false
loi_deadline: null            # Letter of Intent deadline — often 30-60 days before full app
loi_deadline_type: null       # HARD | ROLLING | INVITE

preliminary_deadline: null    # Pre-application or whitepaper (separate from full app)

application_deadline: 2026-06-15  # FULL APPLICATION deadline — PRIMARY DATE
deadline_type: HARD            # HARD = miss = rejected | ROLLING = apply anytime | INVITE = must be invited

award_announcement: 2026-09-01  # Estimated date funder announces winners
award_actual: null            # Fill in when announced

agreement_start: 2026-10-01   # Project period start date
agreement_end: 2027-09-30     # Project period end date
period_months: 12             # Length of funding period

reporting_cycle: QUARTERLY    # QUARTERLY | SEMIANNUAL | ANNUAL | MILESTONE_BASED
first_progress_report: 2027-03-01
final_report: 2027-10-30

# THE DATE THAT DRIVES ALL ACTION RIGHT NOW
next_action_date: 2026-05-01  # LOI date minus 14 days prep (or research completion)
next_action_description: Confirm eligibility with program officer
days_until_next_action: 39
days_until_deadline: 114
urgency: HIGH                 # CRITICAL (<30 days) | HIGH (<60) | MEDIUM (<120) | LOW
```

---

## SECTION 4: ELIGIBILITY

```yaml
# Who CAN apply
eligible_entity_types:
  - forprofit_small_business   # Must be for-profit small business
  - university_affiliated: false  # true = universities allowed
  - nonprofit_only: false      # true = only nonprofits can apply
  - state_agency: false        # true = government agencies eligible

years_in_operation_max: null  # null = no limit, "5" = must be <5 years old
revenue_limit: null           # Maximum annual revenue (common for SBIR Phase I)

# Prior funding restrictions
prior_funding_disqualifier: false
cannot_apply_if_received_sbir: false
prior_award_from_this_funder: []   # List existing awards from this funder

# Bxthre3-specific eligibility
bx3_eligible: true
bx3_eligibility_notes: "Bx3 Inc — Colorado for-profit, <500 employees, primary ops in San Luis Valley — meets all SBIR criteria"
bx3_disqualifying_factors: []

# Required registrations for this grant
registration_required:
  - sam.gov
  - grants.gov
duns_number: required
cage_code: required
```

---

## SECTION 5: APPLICATION REQUIREMENTS

Every document required for THIS grant — with exact specs:

```yaml
required_documents:
  - document: Technical_Proposal_Narrative
    page_limit: 6
    format: PDF
    font_size: 11
    single_or_double: double
    required: true
    notes: Must address all three NSF specific criteria

  - document: Broader_Impacts
    page_limit: 1
    format: PDF
    required: true

  - document: Budget_Narrative_Justification
    page_limit: 3
    format: PDF
    required: true

  - document: SF424_Application_Form
    form_number: SF-424
    format: PDF
    required: true

  - document: Biographical_Sketch
    format: NSF biosketch template
    required: true
    per_person: true          # one per key personnel
    template_url: https://www.nsf.gov/bfa/dias/policy/biosketch.docx

  - document: Current_Pending_Support
    format: NSF SPP form
    required: true

  - document: Letters_of_Support
    required: false
    min_letters: 0
    max_letters: 5
    notes: From partners, customers, industry supporters

  - document: Data_Management_Plan
    page_limit: 2
    format: PDF
    required: true

  - document: Prior_Intellectual_Property_Disclosure
    required: true
    notes: Disclose patents + proprietary tech used in project
```

**Key personnel for this grant:**

```yaml
personnel:
  - name: Jeremy Beebe
    role: Principal Investigator (PI)
    position: Founder / CEO
    biosketch_status: pending   # complete | pending | not_started
    percentage_allocated: 20
    key_person: true

  - name: TBD — Technical Lead
    role: Co-PI
    biosketch_status: not_started
    percentage_allocated: 30
    key_person: true
```

---

## SECTION 6: STRATEGIC FIT

```yaml
# FIT SCORES (1-10) per Bx3 vector
strategic_fit_overall: 9
fit_irrig8: 10               # Irrig8 product alignment
fit_agentic: 3               # Agentic alignment
fit_valley_players: 1         # Gaming platform alignment
fit_ard: 2                   # ARD real estate alignment
fit_starting5: 1             # Starting 5 alignment

priority: P1                  # P0 | P1 | P2 | P3
priority_rationale: "NSF SBIR Phase I = gold standard ag-tech seed grant. $275K funds 6 months San Luis Valley field trials."

funder_relationship_score: 3  # 1 = cold, 10 = active relationship
relationship_notes: "First contact with NSF program officer. No prior relationship."

leverages_prior_work: true
prior_work_reference: "NSF Award #XXXXX — Phase I feasibility results (2024)"

# Competitive analysis
estimated_applicants: 500     # Rough total applicants
estimated_award_rate: 15      # % funded
bx3_win_probability: 22       # Bx3's win chance vs. average
why_above_average_win_prob: |
  Irrig8 directly addresses NSF's water conservation + climate resilience priority.
  San Luis Valley = uniquely credible real-world deployment context.
  Only company with live IoT data from 50+ center-pivot systems in this region.

# Multiplier — what this grant unlocks beyond the dollars
multiplier_effect: |
  NSF Phase I → automatically eligible for NSF Phase II ($1M, 2028)
  Phase II funds full commercial launch of Irrig8
funding_stack_position: PHASE_I  # PHASE_I | PHASE_II | PHASE_III | STANDALONE | BRIDGE
can_bridge_to:
  - "NSF Phase II ($1M, expected 2028)"
  - "USDA Conservation Innovation Grant ($1M, 2027)"
```
---

## SECTION 7: STATUS & WORKFLOW

```yaml
stage: RESEARCHING             # IDENTIFIED | RESEARCHING | DRAFTING | REVIEWING | SUBMITTED | AWARDED | REJECTED | WITHDRAWN
stage_date: 2026-03-23
stage_notes: "Initial discovery complete. Assigned to Raj for deep research."

assigned_lead: Raj
reviewer: null                 # Who reviews before submission (usually Jeremy)
submitter: Jeremy Beebe        # Who actually clicks submit

submission_method: grants.gov   # grants.gov | portal | email | mail | online_portal
portal_url: https://www.grants.gov/web/grants/view-opportunity.htm?oppId=123456
portal_login_status: complete  # complete | pending | not_started

submission_confirmed: false
confirmation_number: null
submission_timestamp: null

# If rejected — capture everything for next cycle
rejection_feedback_received: false
rejection_reason: null
improvement_for_next: []
```

---

## SECTION 8: HOW TO WIN (Optimization)

```yaml
# WHAT MAKES US UNIQUELY STRONG FOR THIS GRANT
differentiators:
  - "Only company with live IoT sensor deployment in San Luis Valley — real-time water use data from 50+ center-pivot systems"
  - "Bx3 Agentic manages 25+ AI employees — proof of AI/ML research management capability"
  - "Colorado state legislator endorsement for water conservation (letter on file)"
  - "University of Colorado Boulder research partnership — Dr. Sarah Chen, Precision Agriculture Lab"

# QUICK WINS — things we likely already have or can get fast
quick_wins:
  - "San Luis Valley water rights data — already collected, attach as pilot evidence"
  - "USDA NRCS partnership letter — existing relationship, 1 call to refresh"
  - "Farmer testimonials from irrig8 deployment — 3 farmers committed to provide letters"

# ADAPTABLE NARRATIVE CORE (boilerplate for this grant type)
narrative_core: |
  Bxthre3 Inc (Bx3) is developing Irrig8 — an end-to-end deterministic farming operating system
  that uses IoT sensors, satellite imagery, and AI to optimize center-pivot irrigation in water-constrained
  agricultural regions. The San Luis Valley of Colorado represents the ideal deployment context:
  250,000 acres of irrigated farmland facing increasing water scarcity from declining aquifer levels.

  This project will deploy Irrig8 across 50 center-pivot systems, demonstrating a [X]% reduction
  in water usage while maintaining crop yield. Phase I funds feasibility validation; Phase II
  (anticipated $1M) funds full commercial deployment.

# LETTER OF INTENT DRAFT (if LOI required)
loi_draft: |
  [DRAFT — 2 paragraphs max]
  Bxthre3 Inc is a Colorado-based precision agriculture technology company...
  We propose to...
  [Attach 1-page technical abstract]

# BUDGET TEMPLATE
budget_template: |
  Personnel: Beebe (20% = $XX,XXX) | Technical Lead (30% = $XX,XXX) | Field Tech (100% = $XX,XXX)
  Fringe Benefits (25% of personnel)
  Equipment (<$5K): IoT sensor kits x 50 = $XX,XXX
  Travel: Project coordination = $X,XXX
  Other Direct: Cloud processing, data storage = $X,XXX
  Indirect (40% MTDC): $XX,XXX
  TOTAL: $XXX,XXX
```

---

## SECTION 9: PROGRAM OFFICER & CONTACTS

```yaml
program_officer:
  name: [First Last]
  title: Program Director, Division of Information & Intelligent Systems
  agency: NSF
  email: [email]
  phone: [phone]
  linkedin: [profile URL]
  notes: "Met at NSF Regional Workshop (Denver, 2025). Enthusiastic about precision ag water tools."

  # Every conversation logged
  conversations:
    - date: 2026-03-15
      type: informational_inquiry
      summary: "Asked about budget flexibility for hardware. PO confirmed equipment under $5K is direct cost."
      next_steps: "Will send 1-page project summary before LOI deadline"
      follow_up_date: 2026-04-15

support_staff:
  - name:
    role: Grants Management Specialist
    email:
    notes:

grantsgov_account:
  account_holder: Jeremy Beebe
  email: getfarmsense@gmail.com
  account_active: true
  entity_registered: true
  authorized_individual: Jeremy Beebe
```

---

## SECTION 10: COMPLIANCE CHECKLIST

```yaml
compliance_checklist:
  - item: SAM.gov Registration
    required: true
    status: complete
    expiry: 2027-04-01

  - item: Grants.gov Account
    required: true
    status: complete

  - item: SF-424 Form
    required: true
    status: not_started
    action_by: Raj
    notes: Standard form — 30 min once all supporting docs ready

  - item: Intellectual Property Disclosure
    required: true
    status: not_started
    action_by: Jeremy
    notes: Must disclose any prior patents or proprietary technology

  - item: Debarment/Suspension Certification
    required: true
    status: pending
    action_by: Jeremy

  - item: Cost Share Documentation
    required: false
    status: not_applicable
```

---

## SECTION 11: FILES ATTACHED

```yaml
attachments:
  - filename: FED-US-001_Narrative_v1.pdf
    type: narrative
    version: 1
    status: draft
    last_updated: 2026-03-23
    by: Raj

  - filename: FED-US-001_Budget_Narrative.pdf
    type: budget_narrative
    status: not_started

  - filename: FED-US-001_Biosketch_Beebe.pdf
    type: biographical_sketch
    status: pending

  - filename: FED-US-001_Letter_UC_Boulder.pdf
    type: letter_of_support
    status: confirmed

  - filename: FED-US-001_SF424_Filled.pdf
    type: form
    status: not_started
```

---

## SECTION 12: APPLICATION TIMELINE (Day-by-Day)

```yaml
application_timeline:
  - date: 2026-03-23
    action: Initial discovery and eligibility assessment
    completed_by: Raj
    status: complete

  - date: 2026-03-25
    action: Confirm eligibility with program officer (1 email)
    due_date: 2026-03-25
    completed_by: Raj
    status: pending

  - date: 2026-04-01
    action: Draft Technical Narrative (first pass)
    due_date: 2026-04-01
    completed_by: Raj
    status: pending

  - date: 2026-04-10
    action: Draft Budget and Budget Narrative
    due_date: 2026-04-10
    completed_by: Raj
    status: pending

  - date: 2026-04-15
    action: Collect all forms, certifications, and letters of support
    due_date: 2026-04-15
    completed_by: Raj
    status: pending

  - date: 2026-04-25
    action: Jeremy reviews and approves all documents
    due_date: 2026-04-25
    completed_by: Jeremy
    status: pending

  - date: 2026-05-01
    action: Final submission to grants.gov
    due_date: 2026-05-01
    completed_by: Jeremy
    status: pending

  - date: 2026-05-02
    action: Confirm submission + save confirmation number
    due_date: 2026-05-02
    completed_by: Raj
    status: pending
```

---

## WHAT THIS MODEL ENABLES (Summary)

| Capability | How |
|---|---|
| **Never miss a deadline** | LOI deadline → next_action_date hierarchy with days_until |
| **Win more grants** | Differentiators + quick_wins + narrative_core pre-written |
| **Fast applications** | Narrative + budget templates ready to adapt per grant |
| **Relationship building** | Every PO conversation logged with follow-up dates |
| **Cost avoidance** | Eligibility check before spending time on ineligible grants |
| **Leverage multiplier** | can_bridge_to + funding_stack_position shows what each win unlocks |
| **Portfolio view** | All 12 sections in one file per grant — scannable at a glance |
| **Performance learning** | rejection_reason + improvement_for_next improves every cycle |
| **Investor reporting** | Priority + fit scores + multiplier_effect = compelling grant strategy narrative |
