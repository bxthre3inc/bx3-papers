# Training Wheels Protocol — Bxthre3 AI Accountability Framework

> **Version:** 1.0  
> **Created:** 2026-04-21  
> **Status:** ACTIVE — deployed on Agentic (zo.space)  
> **Canonical name:** Training Wheels  
> **Also known as:** HITL Mode, Human-in-the-Loop Accountability Protocol, Supervised Autonomy Mode

---

## Summary

Training Wheels is a **graduated autonomy framework** for AI agents and agentic systems. It ensures every AI action that touches external parties — customers, partners, regulators, investors, or the public — is reviewed by a human before execution, until the system has demonstrated consistent, trustworthy behavior.

It is not a cage. It is a **training scaffold** that makes AI deployment safer, more accountable, and faster to trust.

---

## Core Principle

> **Every outbound action passes through a human gate until that human explicitly trusts the system to act alone.**

Training Wheels closes the gap between "AI can do this" and "AI is allowed to do this unsupervised." That gap is where most AI failures live — systems that work in demos but break in production, agents that hallucinate commitments, products that act without accountability.

---

## The Four Modes

### Mode 0 — OFF (Full Autonomy)
AI acts freely. No human review. Used only after prolonged Mode 1 success.

### Mode 1 — Training Wheels (HITL Active)
Every action that touches external parties is queued for human review before execution. The human approves or rejects each action. Rejections teach the system via feedback signals.

### Mode 2 — Observation (Shadow Mode)
AI actions are logged and visible to the human but execute immediately. Human reviews post-hoc. Used during onboarding or after graduating from Mode 1.

### Mode 3 — Lockdown (Emergency)
System is paused. No actions execute. Used when failure patterns are detected or during security events.

---

## Training Wheels Mode 1 — Detailed Protocol

### What Gets Queued

Any action that is:
- **OUTBOUND** — sent to anyone outside the AI system (email, SMS, API call, webhook, public post)
- **COMMITTING** — makes a promise, commitment, or binding representation to a third party
- **PUBLISHING** — publishes content that represents the company or its products publicly
- **FINANCIAL** — initiates a transaction, adjusts pricing, modifies billing
- **DELETING** — removes data that cannot be easily recovered
- **ESCALATING** — routes a matter to legal, executive, or P1 escalation

### What Does NOT Get Queued
- Internal database writes with no external side effects
- Reading/searching/querying data
- Calculating, formatting, or aggregating
- Logging and heartbeat events
- Internal routing decisions

---

## HITL Queue Data Model

```
hitl_queue
  id              — UUID
  task_id         — originating task
  agent_id        — which agent wants to act
  action_type     — email | sms | api_call | publish | financial | delete | escalate
  recipient       — who it goes to (email, phone, endpoint)
  subject         — brief description
  body_preview    — first 200 chars of content
  full_payload    — JSON of the complete action
  status          — PENDING | APPROVED | REJECTED | EXPIRED
  decision_notes  — human's reasoning (required on reject, optional on approve)
  created_at      — when queued
  resolved_at     — when decided
  resolved_by     — who decided (agent_id or 'brodiblanco')
```

---

## Feedback Signals

Every approval or rejection creates a feedback signal that feeds into the agent's learning:

```
feedback_signals
  id              — UUID
  task_id         — related task
  agent_id        — agent being evaluated
  action_type     — what they tried to do
  signal          — APPROVED | REJECTED | MODIFIED
  notes           — decision reasoning
  created_at      — timestamp
```

### Signal Interpretation
- **APPROVED** → add to confidence model, log as trusted pattern
- **REJECTED** → add to avoidance model, log reason, do not retry same approach
- **MODIFIED** → approved with changes — teach the delta between what was proposed and what was accepted

---

## Accountability Audit Trail

Every action, decision, and override is permanently logged:

```
audit_log
  id              — UUID
  timestamp       — when it happened
  actor           — agent_id or 'human:{name}'
  action          — what was attempted
  target          — who/what it affected
  mode            — Training_Wheels | Observation | Full_Autonomy | Lockdown
  outcome         — executed | blocked | modified | failed
  notes           — context or override reasoning
```

**Immutable.** Never deleted. Never modified. This is the system's conscience.

---

## Graduated Exit Protocol

The system does not graduate from Training Wheels by calendar — it graduates by **demonstrated consistency**:

### Prerequisites for Mode 1 → Mode 0
1. **30 consecutive actions** without a rejection
2. **No rejected patterns repeating** — same action_type + same rejection_reason twice
3. **Human explicitly toggles** — no automatic graduation
4. **Minimum 14 days** in Mode 1

### Automatic Downgrade (Mode 0 → Mode 1)
If any of these occur in autonomous mode:
- Any rejected outbound action
- Customer complaint directly traceable to AI action
- Financial error exceeding $100
- Any compliance-relevant action without audit trail

### Shadow Mode Before Graduation
Before moving from Mode 1 to Mode 0, run in Mode 2 (Observation) for 7 days:
- Log all actions in real-time
- Human reviews post-hoc
- Any post-hoc rejection triggers return to Mode 1

---

## Contextual Variants

### For Agentic (current deployment)
- **Mode 1 active** — all external actions (emails, API calls, reports) queue for brodiblanco approval
- **Training Wheels default ON** for all new agents
- **Per-agent mode toggle** — different agents can be at different autonomy levels

### For Irrig8
- **Mode 1 for:** any irrigation schedule change, any data shared with third parties, any financial transaction
- **Mode 2 for:** sensor data ingestion, internal alerting, calculation-only tasks
- **Mode 0 locked:** never fully autonomous on irrigation decisions — too many physical-world consequences

### For VPC (Valley Players Club)
- **Mode 1 for:** all customer-facing communications, any payout initiation, any data shared with regulators
- **Mode 0 not recommended** — gaming regulations require human accountability at key decision points

### For Enterprise Clients (future Agentic licensing)
- **Mode 1 is default** for all white-label deployments
- **Client can configure** their own autonomy threshold
- **Bxthre3 retains override** — we can switch any client deployment to Mode 1 or Mode 3 remotely

---

## Naming Conventions

| Old Name | New Canonical Name |
|----------|------------------|
| HITL | Training Wheels Mode |
| Human-in-the-Loop | Training Wheels Protocol |
| Shadow Mode | Observation Mode |
| Full Autonomy | Off (Mode 0) |
| Kill Switch | Lockdown Mode (Mode 3) |

---

## Why This Matters

Most AI deployments fail because the jump from "works in demo" to "works in production" is treated as a binary switch. Training Wheels makes it a **graduated bridge** — with clear signals, audit trails, and accountability at every step.

It also makes AI **explainable in court.** When a regulator asks "who approved this decision?" — you have an answer. When a customer says "who made this promise?" — you have a log.

---

## File References

- **Implementation:** `Bxthre3/projects/the-agentic-project/` (zo.space routes)
- **Database:** `/data/agentic/agentic.db` — `hitl_queue`, `feedback_signals`, `audit_log` tables
- **UI:** `/agentic/hitl-queue` (zo.space page route)
- **Automation:** Cascade Backstop fires every 5 minutes (automation ID: `467ff83a-32e3-4c47-923d-673e1db304ca`)
- **VAULT:** `Bxthre3/VAULT/training-wheels-protocol-v1.md`

---

*Training Wheels Protocol — Bxthre3 Inc — Confidential*
*For internal use and licensed partner reference only*
