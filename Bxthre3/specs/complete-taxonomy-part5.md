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
