# Bxthre3 Document Standards v3.0 — COMPLETE SPEC TAXONOMY
**Owner:** brodiblanco | **Maintained by:** Agentic  
**Effective:** 2026-04-02  
**Status:** APPROVED

---

# PART I: AGENTOS POSITIONING

> **Agentic = INTERNAL INFRASTRUCTURE** (like IBM Watson)
> NOT a product, NOT for sale — internal force multiplier only

---

# PART II: UNIVERSAL QUALITY GATES

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete
3. [ ] ≥90% sourced
4. [ ] No `[VERIFY]` tags
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Canonical location

---

# PART III: EXAMPLES

> **Each category has a working example** — agents should reference these when creating new documents.

| Category | Code | Example | Description |
|----------|------|---------|-------------|
| **Platform** | AOS-ARCH | `examples/platform/AOS-ARCH-v1.0.md` | Agentic system architecture |
| **Product** | PRD | `examples/product/PRD-Irrig8-v2.1.md` | Irrig8 product requirements |
| **Hardware** | HW-SPEC | `examples/hardware/HW-SPEC-Sensor-v1.0.md` | Soil moisture sensor spec |
| **Software** | SW-SPEC | `examples/software/SW-SPEC-API-v1.0.md` | Agentic API specification |
| **Business** | BIZ | `examples/business/BIZ-Irrig8-v1.0.md` | Irrig8 business plan |
| **Grants** | GRANT | `examples/grants/GRANT-CIG-Colorado-v1.0.md` | CIG grant application |
| **Legal** | NDA | `examples/legal/NDA-Template-v1.0.md` | NDA agreement template |
| **Marketing** | 1PG | `examples/marketing/1PG-Bxthre3-v1.0.md` | One pager for investors |
| **Agent** | AG-SPEC | `examples/agentic/AG-SPEC-Maya-v1.0.md` | Maya agent specification |
| **BOM** | BOM-E | `examples/hardware/BOM-E-Irrig8-v1.0.md` | Electronics bill of materials |

**All examples follow:**
- Document standard template
- ≥90% sourced
- Approved workflow
- Canonical naming (`{TYPE}-{NAME}-v{VERSION}.md`)

---

# PART IV: COMPLETE DOCUMENT TAXONOMY

## A. AGENTOS PLATFORM (Internal)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| AOS-ARCH | Platform Architecture | System design | CTO |
| AOS-BUILD | Build Spec | Deploy procedures | DevOps |
| AOS-SEC | Security Spec | Threat model | Security |
| AOS-MON | Monitoring Spec | Metrics, alerts | DevOps |
| AOS-API | API Contract | Endpoints | CTO |
| AOS-REL | Release Notes | Version log | DevOps |
| AOS-DEPS | Dependency Map | Versions | DevOps |
| AGENT-DEF | Agent Definition | New agent std | CTO |
| TASK-SCHEMA | Task Schema | Validation | CTO |
| AOS-BOM | Platform BOM | Infra parts | DevOps |
| AOS-TEST | Test Spec | QA standards | QA |
| AOS-CICD | CI/CD Spec | Pipeline | DevOps |
| AOS-SLA | SLA Spec | Uptime targets | CTO |
| AOS-DATA | Data Architecture | Storage, privacy | CTO |

**Location:** `the-agentic-project/docs/`

---

## B. PRODUCT SPECS (All Verticals)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| PRD | Product Req Doc | What, why, whom | Product |
| SPEC | Product Spec | Complete def | Product |
| MVP-SPEC | MVP Scope | Minimum viable | Product |
| ROADMAP | Roadmap | Timeline | Product |
| PERSONA | User Persona | Target user | Product |
| JTBD | Jobs-to-be-Done | Needs framework | Product |
| USER-STORY | User Stories | Scenarios | Product |
| ACCEPTANCE | Acceptance Criteria | Done def | Product |
| INTEGRATION-SPEC | Integration Spec | Third-party | Product |
| DEPRECATION | Deprecation Plan | End-of-life | Product |

**Location:** `projects/{name}/specs/`

---

## C. HARDWARE SPECS (Physical)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| HW-SPEC | Hardware Spec | Device def | Hardware |
| PCB-DESIGN | PCB Design | Layout, layers | EE |
| MECH-SPEC | Mechanical Spec | Enclosure | Mech Eng |
| ENV-SPEC | Environmental | Temp, IP rating | Hardware |
| POWER-SPEC | Power Spec | Battery, solar | EE |
| RADIO-SPEC | RF Spec | LoRa, WiFi | EE |
| SENSOR-SPEC | Sensor Spec | Calibration | Hardware |
| ACTUATOR-SPEC | Actuator Spec | Motors, valves | Hardware |
| DFM | Design for Mfg | Manufacturability | Mfg |
| DFA | Design for Assembly | Assembly | Mfg |
| TEST-HW | Hardware Test | Validation | QA |
| CERT-SPEC | Certification | FCC, CE, UL | Compliance |
| FIELD-SPEC | Field Deploy | Installation | Field Ops |
| MAINT-SPEC | Maintenance | Repair | Field Ops |
| CALIBRATION | Calibration | Procedure | Hardware |
| BOM-E | BOM Electronics | PCBs, parts | EE |
| BOM-M | BOM Mechanical | Enclosures | Mech Eng |
| BOM-C | BOM Consumables | Replaceable | Ops |

**Location:** `projects/{name}/hardware/`
## D. SOFTWARE SPECS (Code)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| SW-SPEC | Software Spec | Code requirements | Eng |
| ARCH | Architecture | System design | Eng |
| API-SPEC | API Spec | Public APIs | Eng |
| DB-SCHEMA | Database Schema | Data model | Eng |
| ALGO-SPEC | Algorithm Spec | Logic requirements | Eng |
| PERF-SPEC | Performance | Latency targets | Eng |
| SCALING-SPEC | Scaling | Growth arch | Eng |
| SECURITY-SPEC | Security | Auth, encryption | Security |
| PRIVACY-SPEC | Privacy | GDPR, CCPA | Legal |
| MOBILE-SPEC | Mobile Spec | App requirements | Mobile |
| FRONTEND-SPEC | Frontend Spec | UI tech | Frontend |
| BACKEND-SPEC | Backend Spec | Server reqs | Backend |
| EVENT-SPEC | Event Spec | Event-driven | Eng |
| ERROR-SPEC | Error Handling | Recovery | Eng |
| LOGGING-SPEC | Logging | Formats, retention | Eng |
| CONFIG-SPEC | Configuration | Mgmt | DevOps |
| MIGRATION-SPEC | Migration | Data moves | Eng |
| DEPLOY-SPEC | Deployment | Release | DevOps |
| BOM-S | BOM Software | Licenses, SaaS | Eng |

**Location:** `projects/{name}/software/`

---

## E. UI/UX SPECS (Design)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| UX-SPEC | UX Spec | Experience | Design |
| UI-SPEC | UI Spec | Visual design | Design |
| DESIGN-SYS | Design System | Components | Design |
| WIREFRAME | Wireframes | Low-res | Design |
| MOCKUP | Mockups | High-res | Design |
| PROTOTYPE | Prototype | Interactive | Design |
| INTERACTION | Interaction | Animations | Design |
| BRAND-SPEC | Brand | Colors, type | Brand |
| CONTENT-GUIDE | Content Guide | Copy, tone | Content |
| ACCESSIBILITY | A11y Spec | WCAG, ADA | Design |
| RESPONSIVE | Responsive | Breakpoints | Design |
| NATIVE-SPEC | Native UI | Platform UI | Mobile |
| DESIGN-TOKENS | Design Tokens | Colors, spacing | Design |

**Location:** `projects/{name}/design/`

---

## F. BUSINESS & FINANCE

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| BIZ | Business Plan | Market, model | Founder |
| GTM | Go-to-Market | Launch strategy | Marketing |
| FIN | Financial Model | Projections | CFO |
| PITCH | Investor Pitch | Fundraising | Founder |
| DECK | Investor Deck | Slides | CFO |
| 1PG | One Pager | Summary | Press |
| MARKET-ANALYSIS | Market Analysis | TAM, SAM | Strategy |
| COMP-ANALYSIS | Competitive | Landscape | Strategy |
| PRICING | Pricing Spec | Models, tiers | Product |
| UNIT-ECON | Unit Economics | Margins, CAC | Finance |
| CAC-LTV | CAC/LTV Model | Acquisition | Finance |
| REV-FORECAST | Revenue Forecast | Projections | CFO |
| COST-STRUCTURE | Cost Structure | Fixed, variable | CFO |
| BURN-RATE | Burn Rate | Runway | CFO |
| CAP-TABLE | Cap Table | Ownership | CFO |
| VALUATION | Valuation | Methods | CFO |
| INVESTOR-UPDATE | Investor Update | Monthly reports | Founder |
| BOARD-DECK | Board Deck | Governance | Founder |

**Location:** `projects/{name}/business/` or `finance/`

---

## G. GRANTS & LEGAL

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| GRANT | Grant Application | Funding req | Grants |
| LOI | Letter of Intent | Pre-application | Grants |
| SOURCES | Sources Doc | Citations | Researcher |
| NARRATIVE | Grant Narrative | Story | Writer |
| BUDGET-GRANT | Grant Budget | Financials | Grants |
| LEGAL | Legal Doc | Contracts | Legal |
| INCORP | Incorporation | Formation | Legal |
| OPERATING-AG | Operating Agreement | LLC docs | Legal |
| BYLAWS | Bylaws | Corp governance | Legal |
| SAFE | SAFE Note | Investment | Legal |
| CONVERTIBLE | Convertible Note | Investment | Legal |
| TERM-SHEET | Term Sheet | Negotiation | Legal |
| NDA | NDA | Confidentiality | Legal |
| MSA | MSA | Services | Legal |
| SOW | Statement of Work | Projects | Legal |
| EMPLOYMENT | Employment | Hiring | Legal |
| IP-ASSIGN | IP Assignment | Ownership | Legal |
| LICENSE | License | Third-party | Legal |
| TRADEMARK | Trademark | Brand protection | Legal |
| PATENT | Patent | Invention | Legal |
| COMPLIANCE | Compliance | Regulatory | Legal |
| PRIVACY-POL | Privacy Policy | Legal | Legal |
| TERMS | Terms of Service | Legal | Legal |
| DPA | DPA | Data processing | Legal |
| BAA | BAA | Healthcare | Legal |
| NIST-RMF | Security Framework | Compliance | Security |
| SOC2 | SOC 2 | Security audit | Security |
| ISO27001 | ISMS | Security mgmt | Security |

**Location:** `projects/{name}/legal/` or `grants/`
## H. MANUFACTURING & OPERATIONS

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| MFG-PLAN | Manufacturing Plan | Production | Mfg |
| SOP-MFG | Mfg SOP | Procedures | Mfg |
| QC-SPEC | Quality Control | Inspection | QA |
| QA-PLAN | QA Plan | Testing strategy | QA |
| SUPPLIER-SPEC | Supplier Spec | Vetting | Procurement |
| VENDOR-EVAL | Vendor Eval | Scoring | Procurement |
| FACTORY-SPEC | Factory Spec | Facility | Mfg |
| LINE-SPEC | Line Spec | Production line | Mfg |
| TOOLING | Tooling Spec | Dies, molds | Mfg |
| FIXTURE-SPEC | Fixtures | Jigs, holders | Mfg |
| BOM-FINAL | BOM Final | Shipped product | Mfg |
| BOM-RAW | BOM Raw | Materials | Mfg |
| BOM-SUB | BOM Subassembly | Components | Mfg |
| BOM-PACK | BOM Packaging | Materials | Mfg |
| INVENTORY | Inventory Spec | Tracking | Ops |
| LOGISTICS | Logistics | Shipping | Ops |
| SUPPLY-CHAIN | Supply Chain | Vendors | Ops |
| SHIPPING | Shipping Spec | Carriers, costs | Ops |
| RECEIVING | Receiving | Inspection | Ops |
| RETURNS | Returns Spec | RMA process | Ops |
| WAREHOUSE | Warehouse Spec | Storage | Ops |
| FULFILLMENT | Fulfillment | Pick/pack/ship | Ops |
| WORK-ORDER | Work Order | Production tasks | Mfg |
| TRAVELER | Traveler Doc | Shop floor | Mfg |
| AS-BUILT | As-Built | What was made | Mfg |
| SERIAL-SPEC | Serial Number | Tracking | Mfg |
| TRACEABILITY | Traceability | Compliance | Mfg |
| CAL-SCHED | Calibration Schedule | Maintenance | Mfg |
| PM-SCHED | Preventive Maint | Maintenance | Mfg |
| REWORK-SPEC | Rework | Defect handling | QA |
| SCRAP-SPEC | Scrap | Disposal | QA |

**Location:** `projects/{name}/manufacturing/` or `operations/`

---

## I. FIELD & DEPLOYMENT

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| FIELD-GUIDE | Field Guide | Installation | Field |
| INSTALL | Install Spec | Procedures | Field |
| COMMISSION | Commissioning | Setup | Field |
| SITE-SURVEY | Site Survey | Assessment | Field |
| SITE-PREP | Site Prep | Requirements | Field |
| TOWER-SPEC | Tower Spec | Structure | Field |
| GATEWAY-SPEC | Gateway Spec | Install | Field |
| SENSOR-DEPLOY | Sensor Deploy | Placement | Field |
| NETWORK-DEPLOY | Network Deploy | LoRa, mesh | Field |
| POWER-DEPLOY | Power Deploy | Solar, battery | Field |
| GROUNDING | Grounding | Safety | Field |
| LIGHTNING | Lightning Protection | Safety | Field |
| WEATHER-RESIST | Weather Resistance | Durability | Field |
| FIELD-TEST | Field Test | Validation | QA |
| ACCEPTANCE-T | Acceptance Test | Sign-off | Field |
| TRAINING | Training Spec | User training | Success |
| SUPPORT | Support Spec | Tier 1/2/3 | Success |
| TROUBLESHOOT | Troubleshooting | Diagnostics | Support |
| RMA | RMA Spec | Returns | Support |
| SLA-CUST | Customer SLA | Support terms | Success |

**Location:** `projects/{name}/field/` or `deployment/`

---

## J. MARKETING & SALES

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| MKT-PLAN | Marketing Plan | Strategy | Marketing |
| CONTENT-PLAN | Content Plan | Calendar | Content |
| SEO-SPEC | SEO Spec | Search | Marketing |
| SEM-PLAN | SEM Plan | Paid search | Marketing |
| SOCIAL-SPEC | Social Spec | Channels | Marketing |
| EMAIL-SPEC | Email Spec | Campaigns | Marketing |
| AFFILIATE | Affiliate Spec | Partners | Marketing |
| PR-PLAN | PR Plan | Press | Press |
| EVENT-SPEC | Event Spec | Trade shows | Marketing |
| WEBINAR-SPEC | Webinar | Virtual events | Marketing |
| DEMO-SCRIPT | Demo Script | Sales | Sales |
| SALES-PLAYBOOK | Sales Playbook | Process | Sales |
| TALISMAN | One-Sheeter | Quick pitch | Sales |
| CASE-STUDY | Case Study | Proof | Marketing |
| TESTIMONIAL | Testimonial | Social proof | Marketing |
| WHITEPAPER | Whitepaper | Thought leadership | Marketing |
| DATASHEET | Datasheet | Tech specs | Marketing |
| PRESS-RELEASE | Press Release | Announcements | Press |
| BRAND-GUIDE | Brand Guide | Voice, tone | Brand |
| STYLE-GUIDE | Style Guide | Visual | Brand |
| MESSAGING | Messaging | Value prop | Brand |
| POSITIONING | Positioning | Market stance | Brand |
| COMPARE | Comparison | Vs competitors | Marketing |

**Location:** `projects/{name}/marketing/` or `press/`

---

## K. PARTNERSHIPS & CHANNELS

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| PARTNER-PROG | Partner Program | Structure | BD |
| RESELLER-AG | Reseller Agreement | Terms | Legal |
| REFERRAL | Referral Terms | Incentives | BD |
| DISTRIBUTOR | Distributor Spec | Channel | BD |
| OEM-SPEC | OEM Spec | White label | BD |
| SI-SPEC | SI Spec | Integration | BD |
| API-PARTNER | API Partner | Integration | BD |
| COSELL | Co-Sell Spec | Joint sales | BD |
| CHANNEL-PLAN | Channel Plan | Strategy | BD |
| PARTNER-TIER | Partner Tiers | Levels | BD |

**Location:** `projects/{name}/partnerships/`
## L. PEOPLE & HR

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| ORG-CHART | Org Chart | Structure | HR |
| ROLE-SPEC | Role Spec | Position | HR |
| JD | Job Description | Hiring | HR |
| INTERVIEW | Interview Spec | Process | HR |
| ONBOARDING | Onboarding | 30/60/90 | HR |
| OFFBOARDING | Offboarding | Exit | HR |
| TRAINING-PLAN | Training Plan | Development | HR |
| COMP-SPEC | Compensation | Pay grades | HR |
| BENEFITS | Benefits | Package | HR |
| PERFORMANCE | Performance | Reviews | HR |
| COACHING | Coaching Plan | Development | HR |
| GROWTH-PLAN | Growth Plan | Career | HR |
| SUCCESSION | Succession | Backup plans | HR |
| CULTURE | Culture Doc | Values | HR |
| SAFE-WORK | Safety | OSHA | HR |
| ERGONOMICS | Ergonomics | Workplace | HR |
| REMOTE | Remote Work | Policy | HR |
| TRAVEL | Travel | Policy | HR |
| EXPENSE | Expense | Reimbursement | HR |

**Location:** `hr/` or `people/`

---

## M. RESEARCH & DEVELOPMENT

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| R&D-PLAN | R&D Plan | Strategy | R&D |
| TECH-ROADMAP | Tech Roadmap | Innovation | CTO |
| PROTOTYPE | Prototype Spec | Build | R&D |
| PILOT | Pilot Spec | Test | R&D |
| EXPERIMENT | Experiment | Hypothesis | R&D |
| WHITE-PROT | White Paper | Research | R&D |
| PATENT-SEARCH | Patent Search | Prior art | Legal |
| PROOF-CONCEPT | PoC | Validation | R&D |
| FEASIBILITY | Feasibility Study | Can we? | R&D |
| RISK-ANALYSIS | Risk Analysis | Tech risk | R&D |
| TRADE-STUDY | Trade Study | Options | R&D |
| BENCHMARK | Benchmark | Performance | R&D |

**Location:** `projects/{name}/rd/` or `research/`

---

## N. REPORTING & ANALYTICS

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| DASHBOARD | Dashboard Spec | Metrics | Analytics |
| REPORT-SPEC | Report Spec | Regular reports | Analytics |
| METRICS-DEF | Metrics Def | Definitions | Analytics |
| KPI | KPI Spec | Targets | Analytics |
| OKR | OKR Spec | Objectives | Strategy |
| ANALYTICS-PLAN | Analytics Plan | Tracking | Analytics |
| DATA-PIPELINE | Data Pipeline | ETL | Data Eng |
| ETL-SPEC | ETL Spec | Transform | Data Eng |
| DATA-WAREHOUSE | Data Warehouse | Storage | Data Eng |
| DATA-GOVERNANCE | Governance | Quality | Data Gov |
| DATA-LINEAGE | Data Lineage | Origin | Data Eng |

**Location:** `analytics/` or `data/`

---

## O. AGENTOS CAPABILITIES (The Work)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| AGIN | Agent INBOX | Daily reports | Agent |
| CIN | Canonical INBOX | Escalations | brodiblanco |
| AG-SPEC | Agent Spec | Instructions | Dept Lead |
| TASK | Task | Work assigned | Any Agent |
| SOUT | Structured Output | Machine-readable | Any Agent |
| HANDOFF | Handoff Doc | Transition | Agent |
| DECISION-LOG | Decision Log | Choices made | Agent |
| AGENT-TRAINING | Training Spec | How to use | CTO |
| PROMPT | Prompt Spec | LLM prompts | Agent |
| TOOL-SPEC | Tool Spec | Agent tools | Agent |
| MEMORY-SPEC | Memory Spec | Context | Agent |
| SCHEDULE | Schedule Spec | Agent cadence | Agent |
| DEP-SPEC | Dependency Spec | What Agent needs | Agent |
| ESCALATION | Escalation Spec | When to page | Agent |
| THRESHOLD | Threshold Spec | Triggers | Agent |
| WORKFLOW | Workflow Spec | Multi-agent | Agent |
| ORCHESTRATION | Orchestration | Coordination | Agent |

**Location:** `INBOX/agents/` or `projects/{name}/agents/`

---

## P. COLLABORATION & ADMIN

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| MTG | Meeting Notes | Decisions | Any |
| EM | Email Draft | External | Any |
| NOTES | Research Notes | Investigation | Any |
| DECISION | Decision Doc | Choices | Any |
| ADR | Architecture Decision | Tech choices | Eng |
| RFC | Request for Comments | Proposals | Any |
| TEMPLATE | Template | Reusable | Any |
| CHECKLIST | Checklist | Tasks | Any |
| HOWTO | How-To | Instructions | Any |
| FAQ | FAQ | Questions | Any |
| GLOSSARY | Glossary | Terms | Any |
| INDEX | Index | Navigation | Any |
| LOG | Activity Log | History | Any |
| RETRO | Retrospective | Learnings | Any |
| POSTMORTEM | Postmortem | Incident | Any |
| RUNBOOK | Runbook | Operations | Ops |
| STATUS | Status Doc | Current state | Any |
| READ | README | Overview | Any |

**Location:** Any project or `docs/`
## Q. DEPENDENCIES & RELATIONSHIPS

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| DEPS-PROJ | Project Dependencies | Internal deps | Owner |
| DEPS-EXT | External Dependencies | Third-party | Owner |
| DEPS-SYS | System Dependencies | Services | Owner |
| DEPS-VER | Version Locks | Specific versions | Owner |
| CONTRACT | Contract | Interface spec | Owner |
| INTERFACE | Interface Spec | API contract | Eng |
| INTEGRATION | Integration Test | Connection test | QA |
| MATRIX | Dependency Matrix | All deps | Owner |
| CONFLICT | Conflict Resolution | Version conflicts | Owner |
| UPGRADE | Upgrade Plan | Migration | Owner |

**Location:** `projects/{name}/DEPS.md`

---

## R. STRUCTURED OUTPUTS (Machine-Readable)

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| JSON-SPEC | JSON Schema | Data format | Eng |
| API-RESPONSE | API Response | Expected output | Eng |
| CSV-DEF | CSV Definition | Columns | Data |
| EVENT-SCHEMA | Event Schema | Event format | Eng |
| COMMAND-SPEC | Command Spec | Instructions | Agent |
| CONFIG-SCHEMA | Config Schema | Settings | DevOps |
| MANIFEST | Manifest | Contents | Any |
| INDEX-JSON | Index JSON | Navigation | Any |
| METADATA | Metadata | Document meta | Any |

**Location:** `projects/{name}/outputs/` or `schemas/`

---

## S. BUILD-OUT & FACILITIES

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| BUILD-PLAN | Build Plan | New facility | Ops |
| FACILITY | Facility Spec | Building | Ops |
| LAYOUT | Floor Layout | Space | Ops |
| HVAC-SPEC | HVAC Spec | Climate | Ops |
| ELEC-SPEC | Electrical Power | Power | EE |
| PLUMBING | Plumbing | Water | Ops |
| NETWORK-INFRA | Network Infra | Cabling | IT |
| SEC-PHYSICAL | Physical Security | Access | Security |
| FIRE-SYSTEM | Fire System | Safety | Safety |
| EMERGENCY | Emergency Plan | Evacuation | Safety |
| EQUIP-INSTALL | Equipment Install | Machinery | Mfg |
| CONSTRUCTION | Construction Plan | Build | Ops |
| PERMIT | Permit Spec | Approvals | Legal |
| INSPECTION | Inspection Plan | Checks | Ops |
| SIGNAGE | Signage Wayfinding | Direction | Ops |

**Location:** `projects/{name}/build-out/` or `facilities/`

---

## T. COMPLIANCE & REGULATORY

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| COMPLIANCE-MAP | Compliance Map | All reqs | Compliance |
| REG-REVIEW | Regulatory Review | Current state | Compliance |
| HIPAA-SPEC | HIPAA | Healthcare | Compliance |
| SOX | SOX | Financial | Compliance |
| PCI-DSS | PCI-DSS | Payments | Compliance |
| FERPA | FERPA | Education | Compliance |
| GLBA | GLBA | Banking | Compliance |
| ADA | ADA | Accessibility | Compliance |
| OSHA | OSHA | Workplace | Compliance |
| FDA | FDA | Medical | Compliance |
| FCC | FCC | Radio | Legal |
| DOT | DOT | Transport | Legal |
| USDA | USDA Spec | Agriculture | Compliance |
| EPA | EPA | Environment | Compliance |
| WATER-RIGHTS | Water Rights | Irrigation | Legal |
| LAND-USE | Land Use | Zoning | Legal |

**Location:** `compliance/` or `legal/compliance/`

---
## U. EMERGENCY & SAFETY

| Code | Name | Purpose | Owner |
|------|------|---------|-------|
| EMO-PLAN | Emergency Plan | Response | Safety |
| CONTINUITY | Business Continuity | BCP | Ops |
| DISASTER | Disaster Recovery | DR | IT |
| INCIDENT | Incident Response | Security | Security |
| BREACH | Breach Response | Data breach | Security |
| SAFETY-SPEC | Safety Spec | Procedures | Safety |
| LOCKDOWN | Lockdown | Security | Security |
| EVACUATION | Evacuation Plan | Exit | Safety |
| PPE-SPEC | PPE Spec | Equipment | Safety |
| HAZMAT | Hazmat | Chemicals | Safety |

**Location:** `safety/` or `emergency/`

---

# PART IV: SEPARATION OF CONCERNS

| Rule | Platform (AOS-*) | Products |
|------|------------------|----------|
| **Location** | `the-agentic-project/` | `projects/{name}/` |
| **Users** | Internal only | External customers |
| **Breaking** | All agents affected | One venture |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Lead/Founder |
| **Docs for** | Agentic runs | Customer value |
| **Revenue** | Indirect (enables) | Direct (customers) |

---

# PART V: DOCUMENT STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED → ARCHIVED
   │       │         │           │
   └──[reject]───────┘           │
   └──[revise]────────────────────┘
```

---

# PART VI: MASTER TAXONOMY SUMMARY

## By Function (A-Z)

| Category | Count | Key Types |
|----------|-------|-----------|
| Agentic Platform | 15 | AOS-ARCH, SEC, API, AGENT-DEF |
| Business & Finance | 18 | BIZ, GTM, FIN, PITCH, CAC-LTV |
| Collaboration | 15 | MTG, EM, ADR, RFC, RETRO |
| Compliance & Regulation | 15 | HIPAA, SOX, FDA, WATER-RIGHTS |
| Emergency & Safety | 10 | EMO-PLAN, DISASTER, INCIDENT |
| Field & Deployment | 20 | FIELD-GUIDE, INSTALL, GATEWAY |
| Grants & Legal | 25 | GRANT, LOI, SAFE, IP-ASSIGN |
| Hardware | 20 | HW-SPEC, PCB, MECH, RADIO |
| HR & People | 19 | JD, COMP, BENEFITS, TRAINING |
| Manufacturing | 25 | MFG-PLAN, QC, BOM-* |
| Marketing & Sales | 24 | MKT-PLAN, SEO, CASE-STUDY |
| Partnerships | 11 | PARTNER, RESELLER, OEM |
| Product | 14 | PRD, MVP-SPEC, ROADMAP, JTBD |
| R&D | 12 | R&D-PLAN, PILOT, FEASIBILITY |
| Reporting | 11 | DASHBOARD, KPI, OKR, ETL |
| Software | 20 | SW-SPEC, ARCH, API-SPEC, PERF |
| Structured Outputs | 9 | JSON-SPEC, CSV, EVENT-SCHEMA |
| UI/UX Design | 13 | UX, UI, DESIGN-SYS, WIREFRAME |

## TOTAL: **~285 Document Types**

---

**Version:** 3.0 | **Status:** APPROVED | **Last Updated:** 2026-04-02
