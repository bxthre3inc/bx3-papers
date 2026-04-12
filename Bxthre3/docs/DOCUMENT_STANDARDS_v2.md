# Bxthre3 Document Standards v2.0
**Owner:** brodiblanco | **Maintained by:** Agentic  
**Effective:** 2026-04-02  
**Reference:** Principle #5 (Zero Hallucination)

---

# PART I: UNIVERSAL STANDARDS

## Agentic Positioning — Internal Infrastructure

> **Agentic is not a product.** It is the internal force multiplier that builds and runs products.  
> **Analogy:** IBM Watson — demonstrated capability, competitive advantage, but NOT a standalone SKU.

### What Agentic Is
- **Internal AI workforce orchestration** — for Bxthre3 only
- **Enables ventures** — indirect value, not standalone revenue
- **Proprietary moat** — not sold, not licensed, not SaaS

### External Positioning (Clout/Investment ONLY)
**Say:**
> "Agentic gives us 24/7 execution with 18 AI agents. Internal capability = speed-to-market advantage."

**Never say:**
- ❌ "Agentic is our next product"
- ❌ "We're building it to sell"
- ❌ "It's a standalone business unit"

---

## Document Quality Gates

Before ANY document ships:
1. [ ] Type matches template
2. [ ] Required sections complete  
3. [ ] Sources cited ≥90%
4. [ ] No `[VERIFY]` tags remaining
5. [ ] Dependencies declared
6. [ ] Approved by authority
7. [ ] Stored in canonical location

---

# PART II: DOCUMENT TAXONOMY

## A. AGENTOS PLATFORM (Internal Only — Not Products)

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Platform Architecture | AOS-ARCH | System design, APIs | CTO |
| Build Spec | AOS-BUILD | How to build/deploy | DevOps |
| Agent Def | AGENT-DEF | Standard for agents | CTO |
| Task Schema | TASK-SCHEMA | Task validation | CTO |
| Platform BOM | AOS-BOM | Infra parts | DevOps |
| API Contract | AOS-API | Endpoints | CTO |
| Release Notes | AOS-REL | What's in version | DevOps |
| Security Spec | AOS-SEC | Threat model | Security |

## B. PRODUCT DOCUMENTATION (All Verticals)

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Product Spec | SPEC | What product is/does | Product Lead |
| Hardware Spec | HW-SPEC | Physical reqs | Hardware Lead |
| Software Spec | SW-SPEC | Code/module reqs | Engineering |
| Architecture | ARCH | Tech design | Engineering |
| UI/UX Spec | UX-SPEC | Interface design | Design |
| API Spec | API-SPEC | Public API contracts | Engineering |

## C. BILL OF MATERIALS (All Verticals)

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| BOM Electronics | BOM-E | PCBs, sensors | Engineering |
| BOM Mechanical | BOM-M | Enclosures, mounts | Engineering |
| BOM Consumables | BOM-C | Items consumed | Operations |
| BOM Infrastructure | BOM-I | Server, network | DevOps |
| BOM Software | BOM-S | Licenses, SaaS | Engineering |
| BOM Labor | BOM-L | Contractors, services | Operations |

## D. BUSINESS & FINANCE

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Business Plan | BIZ | Market, model, financials | Founder |
| Go-to-Market | GTM | Launch strategy | Marketing |
| Financial Model | FIN | Projections | CFO |
| Investor Deck | DECK | Equity raise | CFO |
| One Pager | 1PG | Venture summary | Press/Comms |

## E. GRANTS & LEGAL

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Grant Application | GRANT | Funding request | Grants Lead |
| Legal Doc | LEGAL | Contracts, filings | Legal |
| Research Brief | RSRCH | Grant discovery | Researcher |

## F. OPERATIONS

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| SOP | SOP | Standard procedures | Dept Lead |
| Runbook | RUN | Operational execution | Operations |
| Build-Out Docs | BUILD | Site/facility | Operations |
| Depend Spec | DEPS | What project needs | Owner |

## G. AGENTOS CAPABILITIES (The Work)

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Agent INBOX | AGIN | Daily reports | Agent |
| Canonical INBOX | CIN | P0/P1 escalations | brodiblanco |
| Agent Spec | AG-SPEC | Agent instructions | Dept Lead |
| Task Definition | TASK | Work assignments | Any Agent |
| Structured Output | SOUT | Machine-readable | Any Agent |

## H. COLLABORATION

| Type | Code | Purpose | Owner |
|------|------|---------|-------|
| Meeting Notes | MTG | Decisions, actions | Any |
| Email/Draft | EM | External comms | Any |
| Research Notes | RSRCH | Investigation | Any |

---

# PART III: SEPARATION RULES

| Rule | Platform (AOS-*) | Products |
|------|------------------|----------|
| **Location** | `the-agentic-project/` | `projects/{name}/` |
| **Users** | Internal only | External (customers) |
| **Breaking** | All agents affected | One venture |
| **Versioning** | Semantic (v1.0.0) | Iterative (v1, v2) |
| **Approval** | CTO + brodiblanco | Venture lead |

---

# PART IV: STATUS LIFECYCLE

```
DRAFT → REVIEW → APPROVED → DEPRECATED
   │       │         │
   └── [reject] ─────┘
   └── [revise]──────┘
```

---

**Version:** 2.0 | **Status:** APPROVED