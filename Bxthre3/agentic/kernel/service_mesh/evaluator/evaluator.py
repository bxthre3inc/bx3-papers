"""
Evaluator — AgentOS Kernel
Bxthre3/agentic/kernel/service_mesh/evaluator/evaluator.py

Grading and scoring service for training data quality,
agent performance, tool call accuracy, and model quality.
"""
import hashlib
import random
import re
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional

EVAL_DB = Path(__file__).parent.parent.parent.parent / "store" / "evaluator.db"

class ToolGrade(Enum):
    CORRECT = "CORRECT"
    PARTIAL = "PARTIAL"
    INCORRECT = "INCORRECT"
    HALLUCINATED_TOOL = "HALLUCINATED_TOOL"
    HALLUCINATED_ARGS = "HALLUCINATED_ARGS"
    MISSING_TOOL = "MISSING_TOOL"

class ReasoningGrade(Enum):
    CORRECT_STEPS = "CORRECT_STEPS"
    MISSING_STEP = "MISSING_STEP"
    EXTRA_STEP = "EXTRA_STEP"
    WRONG_STEP = "WRONG_STEP"
    INSUFFICIENT = "INSUFFICIENT"

class AgentGrade(Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    FAIL = "FAIL"

class GroundingLevel(Enum):
    GROUNDED = "GROUNDED"
    INFERRED = "INFERRED"
    SPECULATED = "SPECULATED"
    HALLUCINATED = "HALLUCINATED"

@dataclass
class ToolCallGrade:
    tool_name: str
    grade: ToolGrade
    score: float
    latency_ms: Optional[int]
    veracity: GroundingLevel
    hallucinations: list[str] = field(default_factory=list)
    graded_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

@dataclass
class ReasoningTraceGrade:
    trace: str
    grade: ReasoningGrade
    score: float
    steps_matched: list[str]
    steps_missing: list[str]
    steps_extra: list[str]
    complexity: int
    graded_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

@dataclass
class AgentRoundGrade:
    agent_did: str
    task_id: str
    grade: AgentGrade
    score: float
    tool_accuracy: float
    reasoning_score: float
    hallucination_count: int
    grounded_facts: int
    graded_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

def _get_db() -> sqlite3.Connection:
    EVAL_DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(EVAL_DB))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tool_grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tool_name TEXT NOT NULL,
            gold_args TEXT NOT NULL,
            pred_args TEXT NOT NULL,
            pred_result TEXT,
            grade TEXT NOT NULL,
            score REAL NOT NULL,
            veracity TEXT NOT NULL,
            hallucinations TEXT,
            latency_ms INTEGER,
            graded_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS reasoning_grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT,
            trace TEXT NOT NULL,
            gold_steps TEXT NOT NULL,
            grade TEXT NOT NULL,
            score REAL NOT NULL,
            steps_matched TEXT NOT NULL,
            steps_missing TEXT NOT NULL,
            steps_extra TEXT NOT NULL,
            complexity INTEGER NOT NULL,
            graded_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS agent_grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_did TEXT NOT NULL,
            task_id TEXT NOT NULL,
            grade TEXT NOT NULL,
            score REAL NOT NULL,
            tool_accuracy REAL NOT NULL,
            reasoning_score REAL NOT NULL,
            hallucination_count INTEGER NOT NULL,
            grounded_facts INTEGER NOT NULL,
            graded_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS synthetic_samples (
            id TEXT PRIMARY KEY,
            agent_did TEXT NOT NULL,
            task_type TEXT NOT NULL,
            tier TEXT NOT NULL,
            correct_tool_name TEXT NOT NULL,
            gold_args TEXT NOT NULL,
            veracity TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            sample_hash TEXT NOT NULL,
            graded_at TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn

def grade_tool_call(
    tool_name: str,
    gold_args: dict,
    pred_args: dict,
    pred_result: Optional[dict] = None,
    latency_ms: Optional[int] = None
) -> ToolCallGrade:
    hallucinations = []
    veracity = GroundingLevel.GROUNDED

    missing = []
    extra = []
    for k, v in gold_args.items():
        if k.startswith("_"):
            continue
        if k not in pred_args:
            missing.append(k)
            veracity = GroundingLevel.INFERRED if veracity == GroundingLevel.GROUNDED else veracity
        elif pred_args[k] != v:
            extra.append(f"{k}: gold={v}, pred={pred_args[k]}")
            veracity = GroundingLevel.HALLUCINATED

    for k in pred_args:
        if k not in gold_args and k != "_tool":
            extra.append(f"Unexpected arg: {k}")

    if missing or extra:
        grade = ToolGrade.INCORRECT
        score = 0.0
    elif pred_args == gold_args:
        grade = ToolGrade.CORRECT
        score = 1.0
    else:
        grade = ToolGrade.PARTIAL
        score = 0.5

    conn = _get_db()
    conn.execute("""
        INSERT INTO tool_grades (tool_name, gold_args, pred_args, pred_result, grade, score, veracity, hallucinations, latency_ms, graded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (tool_name, str(gold_args), str(pred_args), str(pred_result), grade.value, score, veracity.value, str(hallucinations), latency_ms, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()

    return ToolCallGrade(tool_name=tool_name, grade=grade, score=score, latency_ms=latency_ms, veracity=veracity, hallucinations=hallucinations)

def grade_reasoning_trace(trace: str, gold_steps: list[str], task_complexity: int = 3) -> ReasoningTraceGrade:
    steps_matched = []
    steps_missing = []
    steps_extra = []
    score = 0.0

    for step in gold_steps:
        step_normalized = step.lower().replace("_", " ").replace("-", " ")
        if step_normalized in trace.lower():
            steps_matched.append(step)
        else:
            steps_missing.append(step)

    if steps_missing:
        grade = ReasoningGrade.MISSING_STEP
        score = len(steps_matched) / len(gold_steps) if gold_steps else 0.0
    elif len(steps_matched) > len(gold_steps):
        grade = ReasoningGrade.EXTRA_STEP
        score = len(gold_steps) / len(steps_matched)
    else:
        grade = ReasoningGrade.CORRECT_STEPS
        score = 1.0

    conn = _get_db()
    conn.execute("""
        INSERT INTO reasoning_grades (task_id, trace, gold_steps, grade, score, steps_matched, steps_missing, steps_extra, complexity, graded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (None, trace, str(gold_steps), grade.value, score, str(steps_matched), str(steps_missing), str(steps_extra), task_complexity, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()

    return ReasoningTraceGrade(trace=trace, grade=grade, score=score, steps_matched=steps_matched, steps_missing=steps_missing, steps_extra=steps_extra, complexity=task_complexity)

def grade_agent_round_trip(
    agent_did: str,
    task_id: str,
    tool_accuracy: float,
    reasoning_score: float,
    hallucination_count: int,
    grounded_facts: int
) -> AgentRoundGrade:
    total = tool_accuracy + reasoning_score - (hallucination_count * 0.2)
    total = max(0.0, min(1.0, total / 2.0))

    if total >= 0.9:
        grade = AgentGrade.EXCELLENT
    elif total >= 0.7:
        grade = AgentGrade.GOOD
    elif total >= 0.4:
        grade = AgentGrade.NEEDS_REVIEW
    else:
        grade = AgentGrade.FAIL

    conn = _get_db()
    conn.execute("""
        INSERT INTO agent_grades (agent_did, task_id, grade, score, tool_accuracy, reasoning_score, hallucination_count, grounded_facts, graded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (agent_did, task_id, grade.value, total, tool_accuracy, reasoning_score, hallucination_count, grounded_facts, datetime.now(timezone.utc).isoformat()))
    conn.commit()
    conn.close()

    return AgentRoundGrade(agent_did=agent_did, task_id=task_id, grade=grade, score=total, tool_accuracy=tool_accuracy, reasoning_score=reasoning_score, hallucination_count=hallucination_count, grounded_facts=grounded_facts)

def generate_synthetic_sample(agent_did: str, task_type: str, tier: str) -> dict:
    irrigation_tasks = [
        ("get_sensor_reading", {"sensor_id": "soil-moisture-001", "field": "north-40"}, {"value": 0.34, "unit": "m3/m3"}),
        ("get_weather", {"city": "Monte Vista"}, {"temperature": 52, "conditions": "partly-cloudy", "wind_mph": 12}),
        ("calculate_irrigation_schedule", {"field_id": "pivot-7", "crop": "potato", "et_rate": 0.22}, {"gallons": 142000, "duration_min": 480}),
        ("get_water_usage", {"account_id": "wcdws-7821", "period": "30d"}, {"used_gallons": 4820000, "remaining": 1180000}),
    ]

    task = random.choice(irrigation_tasks)
    tool_name, gold_args, correct_result = task
    veracity = random.choices(["GROUNDED", "INFERRED", "SPECULATED"], weights=[0.7, 0.2, 0.1])[0]
    veracity = GroundingLevel[veracity]

    if veracity == GroundingLevel.HALLUCINATED:
        correct_result = {"value": correct_result["value"] * random.uniform(1.3, 1.8)}
    elif veracity == GroundingLevel.SPECULATED:
        correct_result = None

    sample_id = hashlib.sha256(f"{agent_did}{task_type}{random.random()}".encode()).hexdigest()[:16]
    graded_at = datetime.now(timezone.utc).isoformat()

    conn = _get_db()
    conn.execute("""
        INSERT INTO synthetic_samples (id, agent_did, task_type, tier, correct_tool_name, gold_args, veracity, difficulty, sample_hash, graded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (f"synth-{sample_id}", agent_did, task_type, tier, tool_name, str(gold_args), veracity.value, "MEDIUM", sample_id, graded_at))
    conn.commit()
    conn.close()

    return {"sample_id": f"synth-{sample_id}", "correct_tool_name": tool_name, "gold_args": gold_args, "correct_result": correct_result, "veracity": veracity}

def get_tool_accuracy(tool_name: str) -> dict:
    conn = _get_db()
    row = conn.execute("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN grade IN ('CORRECT','PARTIAL') THEN 1 ELSE 0 END) as correct
        FROM tool_grades WHERE tool_name = ?
    """, (tool_name,)).fetchone()
    conn.close()
    total = row[0] or 0
    correct = row[1] or 0
    return {"tool": tool_name, "total": total, "correct": correct, "accuracy": correct / total if total > 0 else 0.0}

def get_agent_grade(agent_did: str) -> dict:
    conn = _get_db()
    row = conn.execute("""
        SELECT COUNT(*) as total,
               AVG(score) as avg_score,
               SUM(hallucination_count) as total_hallucinations
        FROM agent_grades WHERE agent_did = ?
    """, (agent_did,)).fetchone()
    conn.close()
    return {"agent_did": agent_did, "total_tasks": row[0] or 0, "avg_score": row[1] or 0.0, "total_hallucinations": row[2] or 0}

def get_grounding_stats() -> dict:
    conn = _get_db()
    row = conn.execute("""
        SELECT veracity, COUNT(*) as count FROM tool_grades GROUP BY veracity
    """).fetchall()
    conn.close()
    dist = {r[0]: r[1] for r in row}
    return {"distribution": dist, "total": sum(dist.values())}
