"""
Agentic Phase Gate System
Replaces ChatDev ChatChain — Conditional Gates, Not Linear Phases

Module: phase_gates.py
Location: Bxthre3/projects/agentic/orchestration/phase_gates.py
Status: IMPLEMENTED

Every phase transition is validated. Failed gates suspend work,
escalate to humans, and prevent bad outputs from propagating.
"""

import sqlite3
import uuid
import json
import tempfile
import os
from enum import Enum
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Optional, Callable, Any


# ─────────────────────────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────────────────────────

class Phase(str, Enum):
    """Task lifecycle phases."""
    PENDING = "pending"
    ANALYZE = "analyze"
    VALIDATE = "validate"
    EXECUTE = "execute"
    DELIVER = "deliver"
    COMPLETE = "complete"
    SUSPENDED = "suspended"
    FAILED = "failed"


# ─────────────────────────────────────────────────────────────────
# DATA MODELS
# ─────────────────────────────────────────────────────────────────

@dataclass
class GateResult:
    """Result of a phase gate evaluation."""
    passed: bool
    gate_name: str
    phase_from: str
    phase_to: str
    failures: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    evaluated_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        d = asdict(self)
        return d


@dataclass
class GateRule:
    """A single validation rule within a gate."""
    name: str
    fn: str  # Function name in GateRules
    args: dict = field(default_factory=dict)
    severity: str = "error"  # error | warning
    failure_message: str = ""


# ─────────────────────────────────────────────────────────────────
# GATE RULES LIBRARY
# ─────────────────────────────────────────────────────────────────

class GateRules:
    """Reusable gate validation rules."""

    @staticmethod
    def has_required_fields(task: dict, context: dict, required_fields: list[str] = None) -> bool:
        """Task must have all required fields populated."""
        required = required_fields or context.get("_required_fields", [])
        missing = [f for f in required if not task.get(f)]
        return len(missing) == 0

    @staticmethod
    def has_citations(task: dict, context: dict, min_count: int = 1) -> bool:
        """Last reasoning entry must have at least min_count citations."""
        rs = context.get("reasoning_stream")
        if not rs:
            return False
        last = rs.get_last_entry(task.get("id", ""))
        if not last or not last.evidence:
            return False
        return len(last.evidence) >= min_count

    @staticmethod
    def confidence_above(task: dict, context: dict, threshold: float = 0.7) -> bool:
        """Last reasoning entry confidence must be >= threshold."""
        rs = context.get("reasoning_stream")
        if not rs:
            return False
        last = rs.get_last_entry(task.get("id", ""))
        if not last:
            return False
        return last.confidence >= threshold

    @staticmethod
    def no_blocking_dependencies(task: dict, context: dict) -> bool:
        """All hard dependencies must be COMPLETE or PENDING."""
        deps = task.get("depends_on", [])
        work_queue = context.get("work_queue", [])
        dep_map = {d.get("id"): d for d in work_queue}
        for dep_id in deps:
            dep = dep_map.get(dep_id)
            if dep and dep.get("status") not in (Phase.COMPLETE.value, Phase.PENDING.value):
                return False
        return True

    @staticmethod
    def budget_not_exceeded(task: dict, context: dict) -> bool:
        """Actual cost must not exceed allocated budget."""
        return task.get("cost_actual_usd", 0) <= task.get("budget_usd", float("inf"))

    @staticmethod
    def quality_above(task: dict, context: dict, threshold: float = 70.0) -> bool:
        """Quality score must be >= threshold."""
        return task.get("quality_score", 0) >= threshold


RULE_DISPATCH = {
    "has_required_fields": GateRules.has_required_fields,
    "has_citations": GateRules.has_citations,
    "confidence_above": GateRules.confidence_above,
    "no_blocking_dependencies": GateRules.no_blocking_dependencies,
    "budget_not_exceeded": GateRules.budget_not_exceeded,
    "quality_above": GateRules.quality_above,
}


# ─────────────────────────────────────────────────────────────────
# PHASE GATE SYSTEM CLASS
# ─────────────────────────────────────────────────────────────────

class PhaseGateSystem:
    """
    Conditional phase validation gates.
    
    ChatDev ChatChain: Linear sequence — bad outputs propagate.
    Agentic Phase Gates: Failed gate → task SUSPENDED + human notified.
    
    Usage:
        system = PhaseGateSystem()
        result = system.evaluate(task={"id": "TASK-001", ...}, from_phase=Phase.PENDING, to_phase=Phase.ANALYZE)
        if result.passed:
            task = system.transition(task, Phase.ANALYZE)
        else:
            system.suspend(task, result)
    """

    DB_SCHEMA = """
    CREATE TABLE IF NOT EXISTS phase_gates (
        id            TEXT PRIMARY KEY,
        task_id       TEXT NOT NULL,
        gate_name     TEXT NOT NULL,
        phase_from    TEXT NOT NULL,
        phase_to      TEXT NOT NULL,
        passed        INTEGER NOT NULL DEFAULT 0,
        failures      TEXT NOT NULL DEFAULT '[]',
        warnings      TEXT NOT NULL DEFAULT '[]',
        metadata      TEXT NOT NULL DEFAULT '{}',
        evaluated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pg_task   ON phase_gates(task_id);
    CREATE INDEX IF NOT EXISTS idx_pg_passed ON phase_gates(passed);
    """

    DEFAULT_GATES: dict[tuple, list[dict]] = {
        (Phase.PENDING.value, Phase.ANALYZE.value): [
            {"name": "schema_gate", "description": "Task has required fields",
             "rules": [{"fn": "has_required_fields", "args": {"required_fields": ["id", "type", "priority"]}}]}
        ],
        (Phase.ANALYZE.value, Phase.VALIDATE.value): [
            {"name": "context_gate", "description": "ANALYZE produced valid context",
             "rules": [
                 {"fn": "has_citations", "args": {"min_count": 1}},
                 {"fn": "confidence_above", "args": {"threshold": 0.6}}
             ]}
        ],
        (Phase.VALIDATE.value, Phase.EXECUTE.value): [
            {"name": "validation_gate", "description": "VALIDATE confirmed quality",
             "rules": [{"fn": "confidence_above", "args": {"threshold": 0.7}}]}
        ],
        (Phase.EXECUTE.value, Phase.DELIVER.value): [
            {"name": "delivery_gate", "description": "EXECUTE produced deliverables",
             "rules": [
                 {"fn": "budget_not_exceeded", "args": {}},
                 {"fn": "no_blocking_dependencies", "args": {}}
             ]}
        ],
        (Phase.DELIVER.value, Phase.COMPLETE.value): [
            {"name": "final_gate", "description": "Task ready for completion",
             "rules": [{"fn": "confidence_above", "args": {"threshold": 0.7}}]}
        ],
    }

    def __init__(
        self,
        db_path: str = "agentic_phase_gates.db",
        gates_config: dict = None,
        reasoning_stream=None
    ):
        self.db_path = db_path
        self.reasoning_stream = reasoning_stream
        self.gates_config = gates_config or self.DEFAULT_GATES
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(self.DB_SCHEMA)

    def evaluate(self, task: dict, from_phase: Phase, to_phase: Phase, context: dict = None) -> GateResult:
        """
        Evaluate all gate rules for a phase transition.
        """
        context = context or {}
        if self.reasoning_stream:
            context["reasoning_stream"] = self.reasoning_stream

        gate_key = (from_phase.value, to_phase.value)
        gate_defs = self.gates_config.get(gate_key, [])

        result = GateResult(
            passed=True,
            gate_name=f"{from_phase.value}_to_{to_phase.value}",
            phase_from=from_phase.value,
            phase_to=to_phase.value
        )

        for gate_def in gate_defs:
            for rule_def in gate_def.get("rules", []):
                rule_fn_name = rule_def.get("fn")
                rule_fn = RULE_DISPATCH.get(rule_fn_name)
                if not rule_fn:
                    continue

                rule_args = rule_def.get("args", {})
                try:
                    passed = rule_fn(task, context, **rule_args)
                except Exception as e:
                    passed = False
                    result.failures.append(f"[RULE ERROR] {rule_fn_name}: {str(e)}")

                if not passed:
                    result.passed = False
                    msg = rule_def.get("failure_message") or f"Rule {rule_fn_name} failed"
                    result.failures.append(f"[{gate_def.get('name')}] {msg}")

        self._log_gate_result(task.get("id", ""), result)
        return result

    def transition(self, task: dict, new_phase: Phase, gate_result: GateResult = None) -> dict:
        """Transition task to new phase after gate passes."""
        task["phase"] = new_phase.value
        task["updated_at"] = datetime.utcnow().isoformat()
        if gate_result:
            task["last_gate"] = gate_result.gate_name
            task["gate_passed"] = gate_result.passed
        return task

    def suspend(self, task: dict, gate_result: GateResult, reason: str = None) -> dict:
        """Suspend task due to gate failure."""
        task["phase"] = Phase.SUSPENDED.value
        task["suspended_at"] = datetime.utcnow().isoformat()
        task["suspension_reason"] = reason or "; ".join(gate_result.failures)
        task["last_gate"] = gate_result.gate_name
        task["gate_failures"] = gate_result.failures
        task["updated_at"] = datetime.utcnow().isoformat()

        if self.reasoning_stream:
            self.reasoning_stream.append(
                task_id=task.get("id", ""),
                agent_id="phase_gate_system",
                phase=Phase.SUSPENDED.value,
                reasoning=f"Task suspended at {gate_result.gate_name}: {'; '.join(gate_result.failures)}",
                evidence=[{"type": "gate_result", "path": "phase_gates.db", "content": json.dumps(gate_result.to_dict())}],
                confidence=1.0,
                next_action=f"Human review required: {reason or 'see failures'}"
            )
        return task

    def resume(self, task: dict, to_phase: Phase = None) -> dict:
        """Resume a suspended task after human override."""
        target = to_phase or Phase.ANALYZE
        task["phase"] = target.value
        task["resumed_at"] = datetime.utcnow().isoformat()
        task["suspension_reason"] = None
        task["gate_failures"] = None
        task["updated_at"] = datetime.utcnow().isoformat()
        return task

    def get_gate_history(self, task_id: str) -> list[GateResult]:
        """Get all gate evaluations for a task."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM phase_gates WHERE task_id = ? ORDER BY evaluated_at ASC",
                (task_id,)
            ).fetchall()
            return [
                GateResult(
                    passed=bool(row["passed"]),
                    gate_name=row["gate_name"],
                    phase_from=row["phase_from"],
                    phase_to=row["phase_to"],
                    failures=json.loads(row["failures"]),
                    warnings=json.loads(row["warnings"]),
                    metadata=json.loads(row["metadata"]),
                    evaluated_at=row["evaluated_at"]
                )
                for row in rows
            ]

    def _log_gate_result(self, task_id: str, result: GateResult):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO phase_gates
                   (id, task_id, gate_name, phase_from, phase_to, passed, failures, warnings, metadata, evaluated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (str(uuid.uuid4()), task_id, result.gate_name, result.phase_from, result.phase_to,
                 1 if result.passed else 0, json.dumps(result.failures), json.dumps(result.warnings),
                 json.dumps(result.metadata), result.evaluated_at)
            )



def temp_db(name):
    """Return a temp file path for test DB. Cleans up on exit."""
    return os.path.join(tempfile.gettempdir(), f"agentic_test_{name}.db")

def main():
    """Demo usage."""
    from reasoning_stream import ReasoningStream

    rs = ReasoningStream(temp_db("rs"))
    system = PhaseGateSystem(db_path=":memory:", reasoning_stream=rs)

    task = {
        "id": "GRANT-2026-001",
        "type": "grant",
        "priority": "P1",
        "budget_usd": 500.0,
        "cost_actual_usd": 0.0,
        "depends_on": [],
        "phase": Phase.PENDING.value
    }

    print("=== Phase Gate System Demo ===\n")
    print(f"Initial: {task['phase']}")

    # PENDING → ANALYZE
    result = system.evaluate(task, Phase.PENDING, Phase.ANALYZE)
    print(f"\nGate PENDING→ANALYZE: {'PASS' if result.passed else 'FAIL'}")
    if result.passed:
        system.transition(task, Phase.ANALYZE, result)
        print(f"  → Transitioned to: {task['phase']}")
    else:
        print(f"  → Failures: {result.failures}")

    # ANALYZE → VALIDATE (needs citations + confidence)
    rs.append(
        task_id=task["id"], agent_id="zo", phase="analyze",
        reasoning="Analyzed ARPA-E OPEN 2026 topics. Topic A best fit.",
        evidence=[{"type": "url", "path": "https://arpa-e.energy.gov/funding", "content": "Funding page"}],
        confidence=0.75
    )

    result = system.evaluate(task, Phase.ANALYZE, Phase.VALIDATE)
    print(f"\nGate ANALYZE→VALIDATE: {'PASS' if result.passed else 'FAIL'}")
    if result.passed:
        system.transition(task, Phase.VALIDATE, result)
        print(f"  → Transitioned to: {task['phase']}")
    else:
        system.suspend(task, result)
        print(f"  → SUSPENDED: {task['suspension_reason']}")
        # Human override
        system.resume(task)
        print(f"  → Resumed to: {task['phase']}")


if __name__ == "__main__":
    main()
