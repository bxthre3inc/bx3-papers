# Agentic Guard Rails v6.2 — Anti-Slop Specification

**Purpose:** Prevent cutting corners, hallucination of specs, and scope creep through mechanical enforcement, not best intentions.

---

## 1. ARTIFACT BINDING (Hard Rule)

### The Problem
Agent "remembers" a spec from 3 days ago. Spec changed yesterday. Agent uses stale memory. Deliverable is wrong.

### The Mechanism
```
IF user references file 'X/path/to/file.md' in message:
    THEN read_file(target_file="/home/workspace/X/path/to/file.md") MUST execute
    AND content_hash = sha256(file_content)
    AND agent_response.includes("Per file 'X/path/to/file.md' (hash: a1b2c3...)")
    ELSE response is INVALID and must be regenerated
```

### Implementation
- Rule: `read_before_reference` → Condition: file mention in user prompt
- Violation: SMS alert to brodiblanco + task blocked in INBOX

---

## 2. QUALITY GATES (No "Done" Without Proof)

### Before Marking Any Task Complete:

| Gate | Check | Evidence Required |
|------|-------|-------------------|
| **Reference** | All cited files read within this session | Hash list in response |
| **Scope** | Task matches original spec line-item | Quote from spec |
| **Test** | At least one verification command executed | Command output in response |
| **Review** | No TODOs, no placeholder text, no "fix later" | String search proof |
| **Commit** | Changes committed with descriptive message | Git log line |

### Anti-Pattern Detection
```
IF response contains ("placeholder" OR "TODO" OR "FIXME" OR "<insert" OR "coming soon"):
    THEN mark_incomplete()
    AND escalate_to(brodiblanco, reason="slop_detected")
```

---

## 3. SCOPE CREEP LOCK

### The Scope Document
Every task starts with a SCOPE.md:
```markdown
# Task Scope: [ID]

## In Scope (These = "done" criteria)
1. [Specific deliverable with measurable criteria]
2. [Specific deliverable with measurable criteria]

## Out of Scope (These = Rejection)
- [Temptation #1]
- [Temptation #2]

## If User Requests Scope Change:
1. PAUSE current work
2. UPDATE SCOPE.md with new bounds
3. RESET timeline
4. EXPLICIT approval before continuing
```

### Enforcement
```python
def accept_task_change(user_request, current_scope):
    if expands_scope(current_scope, user_request):
        return {
            "action": "BLOCK",
            "message": "Scope expansion detected. Update SCOPE.md and get approval.",
            "escalation": "brodiblanco"
        }
    return {"action": "PROCEED"}
```

---

## 4. SENSITIVE ARTIFACT PROTOCOL

### Definition of "Sensitive"
- Product specs (PRDs, roadmaps, architecture)
- Business plans, financials, investor materials
- Legal documents, compliance frameworks
- Equity/cap tables, term sheets

### Access Rule
```
IF user asks about [sensitive_topic]:
    THEN IF file_mentioned:
        read_file(file) → respond_with_specific_citation
    ELSE IF no file_mentioned:
        respond_with: "No source document cited. 
                     Please reference specific file: 'file 'X/path/to/doc.md'"
```

### Prohibition
- NEVER: "Based on our previous discussions..." when artifact exists
- NEVER: "I recall from earlier that..." → Always re-read
- NEVER: Summarize from memory when file is one read_file away

---

## 5. PROOF OF WORK STANDARD

### Every Response Must Include:

| Element | Why | Format |
|---------|-----|--------|
| Source files read | Prevents hallucination | `Files: file 'X/a.md', file 'Y/b.md'` |
| Commands executed | Proves it actually works | ```bash\n$ command\noutput\n``` |
| Verification evidence | Proves completion | Screenshot, test output, or hash |
| Scope check | Proves no creep | `Scope: unchanged / expanded (blocked)` |

### Template
```markdown
## What I Did
[Specific actions with file and line references]

## Files Modified
- `file 'X/path/to/file.ext'` — [what changed]

## Evidence
```bash
$ [verification command]
[output showing success]
```

## Scope Status
- [ ] In scope per SCOPE.md
- [ ] No placeholders detected
- [ ] Tests passing
```

---

## 6. VIOLATION ESCALATION

| Violation | Action | Notification |
|-----------|--------|--------------|
| Cited file not read | Block response, re-read | INBOX P1 |
| Placeholder text found | Mark incomplete, return | INBOX P1 |
| Scope expansion without approval | Block, request explicit approve | SMS + INBOX P0 |
| Sensitive topic from memory | Refuse, request file citation | INBOX P1 |
| No verification evidence | Mark incomplete | INBOX P2 |

---

## 7. IMPLEMENTATION CHECKLIST

- [ ] Rule created: `read_before_reference` — triggers on file mention
- [ ] Rule created: `no_placeholder_output` — blocks slop
- [ ] Rule created: `scope_expansion_block` — requires approval
- [ ] INBOX routing: Guard rail violations → P1/P0
- [ ] Template: Proof of Work format in all agent responses
- [ ] Review: Weekly audit of violations

---

**This document is enforced, not suggested.**
