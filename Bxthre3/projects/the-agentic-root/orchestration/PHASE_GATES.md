# Agentic Phase Gate System
## Replaces ChatDev ChatChain — Conditional Gates, Not Linear Phases

**Module:** `phase_gates.py`
**Location:** `Bxthre3/projects/agentic/orchestration/phase_gates.py`
**Status:** SPEC

---

## Purpose

ChatDev's ChatChain is a **linear sequence** — agents pass work forward. Bad outputs propagate unchecked.

Agentic's Phase Gates are **conditional checkpoints** — every phase transition is validated. Failed gates suspend work, escalate to humans, and prevent bad outputs from propagating.

---

## Architecture

```
TASK LIFECYCLE
═══════════════════════════════════════════════════════════════

  PENDING → ANALYZE → VALIDATE → EXECUTE → DELIVER → COMPLETE
     │         │          │         │          │
     ▼         ▼          ▼         ▼          ▼
  [gate:    [gate:     [gate:   [gate:    [gate:
   well-     context    sanity   result    routing
   formed?]   fit?]      check]   quality]  confirmed]

  Any gate FAIL → SUSPENDED → Human Review → P3 INBOX notification
  Any gate PASS → Automatic progression to next phase

═══════════════════════════════════════════════════════════════
```

---

## Phase Definitions

| Phase | Purpose | Agents Active | Gate Rules |
|-------|---------|---------------|------------|
| `PENDING` | Task intake | Orchestrator | Schema validation, deduplication |
| `ANALYZE` | Context gathering | Manus, Zo, Genspark | Task completeness, context fit |
| `VALIDATE` | Quality check | Zo, Human | Output matches spec, citations valid |
| `EXECUTE` | Core work | Any | No scope creep, cost within budget |
| `DELIVER` | Handoff | Any | Quality ≥ 70%, artifacts committed |
| `COMPLETE` | Closed | — | Final audit logged |

---

## Gate Rules by Phase

### PENDING Gate Rules

```python
PENDING_RULES = [
    GateRule(
        name="required_fields",
        check=lambda t, ctx: all([
            t.get("title"),
            t.get("type"),           # research | code | grant | deploy | general
            t.get("priority"),       # P0 | P1 | P2 | P3
            t.get("assignee") or t.get("agent_pool")  # specific or pool
        ]),
        failure_msg="Task missing required fields: title, type, priority, assignee/agent_pool"
    ),
    GateRule(
        name="no_duplicate",
        check=lambda t, ctx: not is_duplicate_task(t),
        failure_msg="Task is duplicate of existing task"
    ),
    GateRule(
        name="schema_valid",
        check=lambda t, ctx: validate_task_schema(t),
        failure_msg="Task schema validation failed"
    ),
    GateRule(
        name="priority_legal",
        check=lambda t, ctx: t.get("priority") in ["P0","P1","P2","P3"],
        failure_msg="Invalid priority value"
    ),
]
```

### ANALYZE Gate Rules

```python
ANALYZE_RULES = [
    GateRule(
        name="context_complete",
        check=lambda t, ctx: len(ctx.get("files", [])) >= t.get("min_context_files", 0),
        failure_msg="Insufficient context files for analysis"
    ),
    GateRule(
        name="agent_capability_match",
        check=lambda t, ctx: agent_has_capability(t.get("assignee"), t.get("type")),
        failure_msg="Assigned agent lacks required capability for this task type"
    ),
    GateRule(
        name="deadline_reasonable",
        check=lambda t, ctx: (t.get("deadline") - now()).days >= t.get("min_days", 1),
        failure_msg=f"Deadline too soon — minimum {t.get('min_days', 1)} day(s) required"
    ),
    GateRule(
        name="budget_allocated",
        check=lambda t, ctx: t.get("budget_usd", 0) >= t.get("min_budget", 0),
        failure_msg="Insufficient budget allocated for task type"
    ),
]
```

### VALIDATE Gate Rules

```python
VALIDATE_RULES = [
    GateRule(
        name="output_spec_match",
        check=lambda t, ctx: output_matches_spec(t, ctx),
        failure_msg="Output does not match task specification"
    ),
    GateRule(
        name="citations_valid",
        check=lambda t, ctx: all_citations_exist(ctx.get("evidence", [])),
        failure_msg="One or more evidence citations are invalid or inaccessible"
    ),
    GateRule(
        name="confidence_threshold",
        check=lambda t, ctx: ctx.get("confidence", 0) >= t.get("min_confidence", 0.7),
        failure_msg=f"Confidence {ctx.get('confidence', 0):.0%} below threshold {t.get('min_confidence', 0.7):.0%}"
    ),
    GateRule(
        name="no_hallucination_flag",
        check=lambda t, ctx: not ctx.get("has_hallucination_flags", False),
        failure_msg="Task output contains hallucination flags — requires human review"
    ),
]
```

### EXECUTE Gate Rules

```python
EXECUTE_RULES = [
    GateRule(
        name="no_scope_creep",
        check=lambda t, ctx: ctx.get("original_scope_hash") == ctx.get("current_scope_hash"),
        failure_msg="Scope has changed since task started — requires re-approval"
    ),
    GateRule(
        name="cost_within_budget",
        check=lambda t, ctx: ctx.get("cost_actual", 0) <= t.get("budget_usd", 0) * 1.1,  # 10% buffer
        failure_msg=f"Cost ${ctx.get('cost_actual', 0):.2f} exceeds budget ${t.get('budget_usd', 0):.2f}"
    ),
    GateRule(
        name="no_circular_dependency",
        check=lambda t, ctx: not has_circular_deps(t),
        failure_msg="Circular dependency detected — cannot execute"
    ),
    GateRule(
        name="upstream_complete",
        check=lambda t, ctx: all(ctx.get("upstream_complete", [])),
        failure_msg="One or more upstream dependencies not yet complete"
    ),
]
```

### DELIVER Gate Rules

```python
DELIVER_RULES = [
    GateRule(
        name="quality_threshold",
        check=lambda t, ctx: ctx.get("quality_score", 0) >= 70,
        failure_msg=f"Quality score {ctx.get('quality_score', 0)} below 70 threshold"
    ),
    GateRule(
        name="artifacts_committed",
        check=lambda t, ctx: all(ctx.get("artifacts_committed", [])),
        failure_msg="One or more artifacts not committed to repository"
    ),
    GateRule(
        name="reasoning_logged",
        check=lambda t, ctx: ctx.get("reasoning_entries", 0) >= 1,
        failure_msg="No reasoning stream entries — task requires audit trail"
    ),
    GateRule(
        name="routing_confirmed",
        check=lambda t, ctx: ctx.get("delivery_confirmed", False),
        failure_msg="Delivery destination not confirmed"
    ),
]
```

---

## Core Classes

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Callable, Any
from datetime import datetime
import hashlib

class Phase(str, Enum):
    PENDING = "pending"
    ANALYZE = "analyze"
    VALIDATE = "validate"
    EXECUTE = "execute"
    DELIVER = "deliver"
    COMPLETE = "complete"
    SUSPENDED = "suspended"  # Special state — waiting for human

class GateResult:
    passed: bool
    failures: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    suspend: bool = False
    escalate_to_human: bool = False
    gate_name: str = ""
    evaluated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

class GateRule:
    name: str
    check: Callable[[dict, dict], bool]  # task, context
    failure_msg: str
    severity: str = "error"  # error | warning

@dataclass
class PhaseGate:
    phase: Phase
    rules: list[GateRule]
    
    def evaluate(self, task: dict, context: dict) -> GateResult:
        """
        Evaluate all rules for this phase gate.
        
        Args:
            task: Full task dict
            context: ReasoningStream context + runtime state
        
        Returns:
            GateResult with pass/fail + any failures
        """
        result = GateResult(passed=True, gate_name=f"{self.phase.value}_gate")
        
        for rule in self.rules:
            try:
                passed = rule.check(task, context)
            except Exception as e:
                passed = False
                result.failures.append(f"[RULE ERROR] {rule.name}: {str(e)}")
            
            if not passed and rule.severity == "error":
                result.failures.append(f"[{rule.name}] {rule.failure_msg}")
                result.suspend = True
                result.escalate_to_human = True
            elif not passed and rule.severity == "warning":
                result.warnings.append(f"[{rule.name}] {rule.failure_msg}")
        
        if result.failures:
            result.passed = False
        
        return result

class PhaseGateSystem:
    """
    Orchestrates phase transitions with gate evaluation.
    """
    
    PHASES = {
        Phase.PENDING: PhaseGate(Phase.PENDING, PENDING_RULES),
        Phase.ANALYZE: PhaseGate(Phase.ANALYZE, ANALYZE_RULES),
        Phase.VALIDATE: PhaseGate(Phase.VALIDATE, VALIDATE_RULES),
        Phase.EXECUTE: PhaseGate(Phase.EXECUTE, EXECUTE_RULES),
        Phase.DELIVER: PhaseGate(Phase.DELIVER, DELIVER_RULES),
    }
    
    def __init__(self, reasoning_stream=None, inbox_routing=None):
        self.reasoning_stream = reasoning_stream  # ReasoningStream instance
        self.inbox_routing = inbox_routing        # INBOX routing function
    
    def transition(
        self, 
        task: dict, 
        from_phase: Phase, 
        to_phase: Phase,
        context: dict
    ) -> GateResult:
        """
        Attempt phase transition. Evaluates gate for target phase.
        
        Args:
            task: Task dict
            from_phase: Current phase
            to_phase: Desired phase (must be next in sequence)
            context: ReasoningStream context + runtime state
        
        Returns:
            GateResult — if passed, task can transition; if failed, task suspended
        """
        # Validate phase ordering
        if not self._is_valid_transition(from_phase, to_phase):
            return GateResult(
                passed=False,
                failures=[f"Invalid phase transition: {from_phase.value} → {to_phase.value}"],
                suspend=True,
                escalate_to_human=True
            )
        
        # Get gate for target phase
        gate = self.PHASES.get(to_phase)
        if not gate:
            return GateResult(passed=True)  # COMPLETE has no gate
        
        # Evaluate gate
        result = gate.evaluate(task, context)
        
        if result.passed:
            # Log to reasoning stream
            if self.reasoning_stream:
                self.reasoning_stream.append(
                    task_id=task["id"],
                    agent_id="phase-gate-system",
                    phase=to_phase.value,
                    reasoning=f"Phase transition {from_phase.value} → {to_phase.value} approved.",
                    evidence=[{"type": "gate_result", "gate": gate.phase.value, "warnings": result.warnings}],
                    confidence=1.0,
                    next_action=f"Proceed to {to_phase.value} phase",
                    metadata={"from_phase": from_phase.value, "failures": result.failures}
                )
        else:
            # Suspend task, log failure, notify human
            if self.reasoning_stream:
                self.reasoning_stream.append(
                    task_id=task["id"],
                    agent_id="phase-gate-system",
                    phase="suspended",
                    reasoning=f"Phase transition {from_phase.value} → {to_phase.value} FAILED.",
                    evidence=[{"type": "gate_result", "gate": gate.phase.value, "failures": result.failures}],
                    confidence=1.0,
                    next_action="Human review required",
                    metadata={"from_phase": from_phase.value, "failures": result.failures}
                )
            
            # Notify human via INBOX
            if result.escalate_to_human and self.inbox_routing:
                self.inbox_routing(
                    agent="phase-gate-system",
                    message=self._format_failure_message(task, result),
                    priority="P2" if to_phase in [Phase.ANALYZE, Phase.EXECUTE] else "P3",
                    department="engineering" if task.get("type") == "code" else "ops"
                )
        
        return result
    
    def _is_valid_transition(self, from_phase: Phase, to_phase: Phase) -> bool:
        """Validate phase ordering."""
        sequence = [Phase.PENDING, Phase.ANALYZE, Phase.VALIDATE, Phase.EXECUTE, Phase.DELIVER, Phase.COMPLETE]
        try:
            from_idx = sequence.index(from_phase)
            to_idx = sequence.index(to_phase)
            return to_idx == from_idx + 1
        except ValueError:
            return False
    
    def _format_failure_message(self, task: dict, result: GateResult) -> str:
        """Format failure for INBOX notification."""
        lines = [
            f"🔴 **Phase Gate Failure**: `{task['id']}`",
            f"**Title**: {task.get('title', 'Untitled')}",
            f"**Failed Gate**: {result.gate_name}",
            f"",
            f"**Failures:**",
        ]
        for failure in result.failures:
            lines.append(f"  - {failure}")
        
        if result.warnings:
            lines.append(f"")
            lines.append(f"**Warnings:**")
            for warning in result.warnings:
                lines.append(f"  - {warning}")
        
        lines.append(f"")
        lines.append(f"**Action Required**: Review and either fix the issue or manually override the gate.")
        
        return "\n".join(lines)
```

---

## Phase Gate Failure Workflow

```
Gate Failure Detected
        │
        ▼
┌───────────────────┐
│ Suspend Task      │
│ (phase = SUSPENDED)│
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Log to Reasoning  │
│ Stream with full   │
│ failure context    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Notify Human       │
│ (P2/P3 → INBOX)    │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Human Reviews      │
│ (in INBOX.md)      │
└───────────────────┘
        │
        ├─── Override ───→ Resume (gate marked as overridden)
        │
        └─── Fix ────────→ Retry gate evaluation
```

---

## INBOX Integration

When a gate fails, the system writes to `Bxthre3/INBOX/departments/{dept}.md`:

```markdown
## 🔴 Phase Gate Failure — 2026-04-08 02:15 UTC

**Task:** task_2026_001247
**Title:** ARPA-E OPEN Grant Application
**Failed Gate:** validate_gate
**Failed Rules:** [citations_valid], [confidence_threshold]

### Failures
- [citations_valid] One or more evidence citations are invalid or inaccessible
  - File `/Bxthre3/GRANTS/ARPA-E-OPEN-2026/prospectus.md` line 15 does not exist
  - URL `https://arpa-e.energy.gov/...` returned 404
- [confidence_threshold] Confidence 45% below threshold 70%

### Context
[View full reasoning stream](agentic_reasoning.db)

### Human Actions
- [ ] Verify/fix cited evidence
- [ ] Review low-confidence reasoning
- [ ] Either: `@zo retry` or `@brodiblanco override`
```

---

## Key Differences from ChatDev ChatChain

| Aspect | ChatDev ChatChain | Agentic Phase Gates |
|--------|------------------|---------------------|
| **Flow** | Linear sequence | Conditional with validation |
| **Bad output** | Propagates unchecked | Triggers suspend + escalate |
| **Gate failure** | None | Mandatory human review |
| **Phase ordering** | Hard sequence | Enforced but overridable |
| **Context** | None at gates | Full ReasoningStream context |
| **Escalation** | Implicit (humans check output) | Explicit (INBOX notification) |

---

*Module: phase_gates.py*
*Part of: Agentic Orchestration Layer*
*Replaces: ChatDev ChatChain (linear phases → conditional gates)*
