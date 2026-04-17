# Drew (Sales Lead) — RevOps P2 Escalation

**From:** Velocity (RevOps Lead)
**Date:** 2026-04-16 8:15 AM MT
**Priority:** P2
**Subject:** Deals Table Required — Pipeline Tracking Blocked

---

## Situation

RevOps baseline assessment complete. **No deal/opportunity tracking exists** in any connected CRM system — not in Bxthre3 ECC, AgentOS Base, or Linear.

Your 109 Build-A-Biz leads and 2 active VPC deals (Sage / Danny Romero) cannot be tracked in the current system.

---

## Action Required (P2)

**Create a `Deals` table in Bxthre3 ECC** (`app93dsGcEyPfkqaa`).

**Schema (proposed — align with your pipeline stages):**

| Field | Type |
|-------|------|
| Deal Name | Single line text |
| Venture | Single select (Irrig8 / VPC / Build-A-Biz / ThinkTank / Starting 5 / ARD / Other) |
| Amount | Currency |
| Stage | Single select (Prospect / Qualified / Proposal / Negotiation / Closed Won / Closed Lost) |
| Close Date | Date |
| Owner | Collaborator |
| Probability | Number % |
| Account | Link → Organizations |
| Notes | Long text |

**Stage → Probability defaults:**
- Prospect: 10%
- Qualified: 25%
- Proposal: 50%
- Negotiation: 75%
- Closed Won: 100%
- Closed Lost: 0%

---

## Active Deals Needing Entry

| Deal | Venture | Value | Status |
|------|---------|-------|--------|
| Sage (VPC-CP-001) | VPC | $2,500 cash + equity | 🔴 20+ days stale — legal docs overdue |
| Danny Romero | TBD | TBD | 🔴 10+ days no response |

---

## Pipeline Coverage

| Venture | Leads/Opps | CRM Entered | Coverage |
|---------|-------------|-------------|----------|
| Build-A-Biz | 109 leads | 0 | 0% |
| VPC | 2 active | 0 | 0% |
| ThinkTank | 9 drafts | 0 | 0% |

---

## Dependency

Sage deal and Danny Romero deal are stalled per INBOX.md. Sage: legal docs 20+ days overdue. Danny: 10+ days no response to dual offer.

RevOps will surface pipeline coverage ratio, win rate, and CAC once Deals table is live.

---

*Velocity — RevOps Lead*
*P2 Escalation: 2026-04-16*

## 🟡 P2 | reseller | 2026-04-17 15:15 UTC

CHANNEL DEPARTMENT INITIALIZED — Reseller, Channel Sales Director active. Scope: Irrig8 dealer/distributor/co-op, Starting 5 reseller/referral/white-label, Zoe developer/agency/ISV. VPC affiliate (Harvest) vs VPC distributor (Reseller) boundary established. Deliverables: recruitment pipeline, onboarding materials, comp/rebate admin, quarterly reviews. Reports to: Deal (VP Sales), Nexus (VP Strategic Partnerships). Daily standup: 8:15 AM. Pipeline currently zero — Nexus weekly report (2026-04-01) has 7 Irrig8 targets pending channel engagement.
