# IDEA_VAULT — Unused Value Recovery System
**Version:** 1.0.0  
**Purpose:** Capture ideas not pursued, surface repurposing opportunities  
**Owner:** brodiblanco + raj_defensibility_01

---

## OVERVIEW

Every idea you mention gets logged here. If we don't use it immediately, it's not dead—it's archived, searchable, and monitored for cross-domain reuse.

### Lifecycle
```
IDEA MENTIONED → CAPTURED → SCORED → ACTIVE | ARCHIVED
                    ↓              ↓
               REPURPOSED ← MATCH DETECTED (weekly scan)
```

---

## FOUR VAULTS

| Vault | Purpose | Path |
|-------|---------|------|
| **active/** | Currently being pursued or queued | `active/2026/03/idea-{uuid}.md` |
| **archived/** | Paused, deprioritized, or parked | `archived/YYYY-MM/idea-{uuid}.md` |
| **repurposed/** | Resurrected for new domain/use | `repurposed/from-{source}/idea-{uuid}.md` |
| **scored/** | Defensibility-rated concepts | `scored/{score}-{domain}-{uuid}.md` |

---

## CAPTURE FORMAT

Every idea file follows this structure:

```markdown
---
idea_id: uuid-v4
captured_at: 2026-03-30T14:32:15Z
captured_by: agent-id (zoe, raj_defensibility_01, etc.)
source_conversation: conv-{id} | email-{id} | in-person
domain: irrig8 | vpc | agentic | rain | trenchbabys | general
defensibility_score: NULL | 1-5
status: ACTIVE | ARCHIVED | REPURPOSED | DEPLOYED
original_context: "You said..."
---

# IDEA: {Title}

## Problem Statement
{What problem were you solving?}

## Proposed Solution
{What was the approach?}

## Why Not Pursued
{Reason for pause/archival}

## Cross-Domain Potential
- [ ] irrig8
- [ ] vpc
- [ ] agentic
- [ ] rain
- [ ] trenchbabys

## Repurposing History
- 2026-03-30: Captured
- 2026-04-01: Archived (deprioritized for SBIR)
- 2026-04-15: REPURPOSED to vpc-{feature} by raj_defensibility_01

## Related Ideas
- `file 'IDEA_VAULT/archived/2026-03/idea-{uuid2}.md'`
```

---

## SCORING RUBRIC

From `file 'Bxthre3/SOPS/agents/raj/SPECIALIST_DEFENSIBILITY_IP.md'`

| Score | Defensibility | Action |
|-------|---------------|--------|
| 5 | Trade secret + patent + data | Immediate IP protection |
| 4 | Patent + network effects | File provisional within 30 days |
| 3 | Data moat + switching costs | Core IP, pursue aggressively |
| 2 | Brand + speed | Acceptable for non-core |
| 1 | Cost only | Reject or pivot for defensibility |

---

## ALERT SYSTEM

### Weekly Digest (Friday 4PM MST)
```
Subject: IDEA_VAULT Weekly — 3 matches found

This Week's Repurposing Opportunities:

1. [Idea-234] Agriculture sensor mesh → Agentic AMP protocol
   Match: 87% similarity in connectivity patterns
   Suggested Action: Adapt mesh protocol center-pivot → general compute
   
2. [Idea-189] Gaming sweepstakes KYC → Irrig8 landlord verification
   Match: 82% similarity in identity verification flow
   Suggested Action: Port KYC module to water rights application

3. [Idea-302] Rain regulatory evidence → VPC compliance docs
   Match: 78% similarity in document management
   Suggested Action: Abstract evidence system for gaming
```

### Realtime Alerts (P3)
Triggered when:
- New problem statement matches archived idea > 85% similarity
- You mention "we should..." in conversation with no follow-up task
- Cross-domain pattern detected during weekly scan

---

## INTEGRATION

### Trigger Points
1. **Conversation Capture** — Any "Idea" or "What if" in chat → Auto-file
2. **Task Rejection** — "Not now" or "Later" → Auto-archive
3. **Architecture Review** — Defensibility check → Score and route

### API
```python
# Save new idea
/vault/capture {domain, problem, solution, context}

# Query for matches
/vault/match {domain, problem_description}

# Get weekly digest
/vault/digest {last_n_days=7}

# Repurpose notification
/vault/alert {match_threshold=0.7}
```

### Brodiblanco Interface
- **INBOX:** P3 digest every Friday
- **INBOX:** P2 real-time matches > 85% similarity
- **IDEA_VAULT/scored/:** Self-service browsing
- **Conversation:** Just say "vault that idea" to capture

---

## EXAMPLES

### Example 1: Agriculture Mesh → Agentic

**Original Idea (2026-03-15):**
- Domain: Irrig8
- Problem: Sensors drop offline in field
- Solution: Mesh networking via LoRaWAN
- Status: ARCHIVED — pivoting to cellular

**Match Detected (2026-03-28):**
- New Problem: Agentic needs federated compute
- Similarity: 91% (mesh topology, peer discovery, failover)

**Repurposing:**
- `file 'IDEA_VAULT/repurposed/from-irrig8/idea-{uuid}.md'`
- Action: Generalize irrigation mesh protocol → Agentic AMP
- Result: AMPDiscovery.kt created

### Example 2: Gaming KYC → Water Rights

**Original Idea (2026-01-20):**
- Domain: VPC
- Problem: Age verification for sweepstakes
- Solution: Document upload + automated verification
- Status: ACTIVE — in development

**Match Detected (2026-03-25):**
- New Problem: Water Court needs evidence prep
- Similarity: 84% (document upload, chain of custody, verification)

**Repurposing:**
- Action: Port VPC KYC module → Rain regulatory evidence system
- Result: Shared component library

---

## METRICS

| Metric | Target |
|--------|--------|
| Ideas captured / week | 5+ |
| Repurposing rate | > 20% of archived |
| Match score accuracy | 70%+ correlation with human judgment |
| Alert noise | < 30% false positive |

---

## COMMANDS

```bash
# Manual capture
python3 /home/workspace/Bxthre3/IDEA_VAULT/scripts/capture.py \
  --problem "Centr
