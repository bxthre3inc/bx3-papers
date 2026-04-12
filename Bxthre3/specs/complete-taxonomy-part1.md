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

# PART III: COMPLETE DOCUMENT TAXONOMY

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
