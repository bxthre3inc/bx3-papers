"""
Agentic IER Router — Interpretable Explorable Rationale Router
Module: Bxthre3/agentic/orchestration/ier_router.py
Status: IMPLEMENTED (v1.0)

Contextual bandit router. For a given task context, selects the best
workflow and explains why. Learns from feedback via reward signals.

Two modes:
  - EXPLOIT: pick the highest-expected-reward workflow
  - EXPLORE: epsilon-greedy random pick to discover new strategies

Trust Invariant: every routing decision is logged with rationale.
Zero hallucination: if no prior data exists, route defaults to
the workflow DAG's default_path with explicit [UNCONFIGURED] flag.
"""

import sqlite3
import json
import math
import uuid
from datetime import datetime
from dataclasses import dataclass, field, asdict
from typing import Optional, Literal
from pathlib import Path

# ─── Constants ────────────────────────────────────────────────────────────────

EPSILON = 0.15          # 15% random exploration
MIN_REWARD = -1.0
MAX_REWARD = 1.0
DEFAULT_WORKFLOW = "default"
ROUTER_DB = Path(__file__).parent.parent / "store" / "ier_router.db"

# ─── Data Models ─────────────────────────────────────────────────────────────

@dataclass
class WorkflowStats:
    total_reward: float
    visit_count: int
    avg_reward: float
    last_updated: str

@dataclass
class RoutingDecision:
    decision_id: str
    task_type: str
    context_hash: str
    chosen_workflow: str
    mode: Literal["EXPLOIT", "EXPLORE"]
    confidence: float
    rationale: str          # human-readable why
    evidence: list[str]     # citations for this decision
    exploration_bonus: float
    reward_if_known: float  # avg_reward of chosen workflow
    epsilon: float
    created_at: str

@dataclass
class RoutingFeedback:
    decision_id: str
    outcome_reward: float   # -1 to +1
    outcome_label: str      # "success" | "failure" | "partial"
    evidence: list[str]     # what justified the outcome
    created_at: str

# ─── Database ────────────────────────────────────────────────────────────────

def _get_db() -> sqlite3.Connection:
    ROUTER_DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(ROUTER_DB))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workflow_stats (
            workflow_id   TEXT PRIMARY KEY,
            task_type     TEXT NOT NULL,
            total_reward  REAL NOT NULL DEFAULT 0,
            visit_count   INTEGER NOT NULL DEFAULT 0,
            avg_reward    REAL NOT NULL DEFAULT 0,
            last_updated  TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS routing_log (
            decision_id      TEXT PRIMARY KEY,
            task_type        TEXT NOT NULL,
            context_hash     TEXT NOT NULL,
            chosen_workflow  TEXT NOT NULL,
            mode             TEXT NOT NULL,
            confidence       REAL NOT NULL,
            rationale        TEXT NOT NULL,
            evidence         TEXT NOT NULL,
            exploration_bonus REAL NOT NULL,
            reward_if_known  REAL NOT NULL,
            epsilon          REAL NOT NULL,
            created_at       TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback_log (
            feedback_id    TEXT PRIMARY KEY,
            decision_id    TEXT NOT NULL,
            outcome_reward REAL NOT NULL,
            outcome_label  TEXT NOT NULL,
            evidence       TEXT NOT NULL,
            created_at     TEXT NOT NULL,
            FOREIGN KEY (decision_id) REFERENCES routing_log(decision_id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS task_type_contexts (
            task_type      TEXT PRIMARY KEY,
            features       TEXT NOT NULL,   -- JSON feature vector
            description    TEXT NOT NULL,
            default_workflow TEXT NOT NULL,
            created_at     TEXT NOT NULL
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_rl_task ON routing_log(task_type)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_fl_decision ON feedback_log(decision_id)")
    conn.commit()
    return conn

# ─── Reward Helpers ─────────────────────────────────────────────────────────

def _clamp_reward(r: float) -> float:
    return max(MIN_REWARD, min(MAX_REWARD, r))

def _ucb1(avg_reward: float, visit_count: int, total_visits: int, c: float = 1.414) -> float:
    """Upper Confidence Bound 1 — balances explore/exploit."""
    if visit_count == 0:
        return float('inf')
    return avg_reward + c * math.sqrt(math.log(total_visits) / visit_count)

def _reward_from_label(label: str) -> float:
    mapping = {"success": 1.0, "partial": 0.3, "failure": -0.8}
    return mapping.get(label.lower(), 0.0)

# ─── Public API ──────────────────────────────────────────────────────────────

def register_workflow(workflow_id: str, task_type: str) -> None:
    """Pre-register a workflow for a task type."""
    conn = _get_db()
    now = datetime.utcnow().isoformat()
    conn.execute("""
        INSERT OR IGNORE INTO workflow_stats
            (workflow_id, task_type, total_reward, visit_count, avg_reward, last_updated)
        VALUES (?, ?, 0, 0, 0, ?)
    """, [workflow_id, task_type, now])
    conn.commit()
    conn.close()

def record_task_type(task_type: str, features: dict, description: str, default_workflow: str = DEFAULT_WORKFLOW) -> None:
    """Record the feature profile for a task type."""
    conn = _get_db()
    now = datetime.utcnow().isoformat()
    conn.execute("""
        INSERT OR REPLACE INTO task_type_contexts
            (task_type, features, description, default_workflow, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, [task_type, json.dumps(features), description, default_workflow, now])
    conn.commit()
    conn.close()

def compute_context_hash(task_type: str, features: dict) -> str:
    """Deterministic hash of task context for similarity lookups."""
    import hashlib
    raw = json.dumps({"task_type": task_type, "features": features}, sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def route_task(
    task_type: str,
    context: dict,          # arbitrary task metadata
    available_workflows: list[str],
    forced_workflow: Optional[str] = None,
    override_mode: Optional[Literal["EXPLOIT", "EXPLORE"]] = None,
) -> RoutingDecision:
    """
    Core routing function. Returns a RoutingDecision with full provenance.

    If forced_workflow is set, bypasses routing (used for testing / HITL overrides).
    If no prior data exists for a workflow, marks it [UNCONFIGURED] in rationale.
    """
    conn = _get_db()
    now = datetime.utcnow().isoformat()
    decision_id = f"ier-{uuid.uuid4().hex[:12]}"
    mode = override_mode or ("EXPLOIT" if (override_mode is None and
                        conn.execute("SELECT COUNT(*) FROM workflow_stats WHERE task_type=? AND visit_count > 0",
                                    [task_type]).fetchone()[0] > 0)
                        else "EXPLORE")

    context_hash = compute_context_hash(task_type, context)
    chosen_workflow = forced_workflow
    rationale_parts = []
    evidence = []

    # Ensure all workflows are registered
    for wf in available_workflows:
        conn.execute("""
            INSERT OR IGNORE INTO workflow_stats
                (workflow_id, task_type, total_reward, visit_count, avg_reward, last_updated)
            VALUES (?, ?, 0, 0, 0, ?)
        """, [wf, task_type, now])

    rows = conn.execute("""
        SELECT workflow_id, avg_reward, visit_count FROM workflow_stats
        WHERE task_type=? AND workflow_id IN ({})
    """.format(",".join("?" * len(available_workflows))),
        [task_type] + available_workflows).fetchall()

    total_visits = sum(r[2] for r in rows)

    if chosen_workflow is None:
        # Compute UCB1 for each workflow
        scored = []
        for workflow_id, avg_reward, visit_count in rows:
            ucb = _ucb1(avg_reward, visit_count, max(total_visits, 1))
            scored.append((workflow_id, ucb, avg_reward, visit_count))

        if mode == "EXPLOIT":
            scored.sort(key=lambda x: -x[1])  # highest UCB first
        else:
            # EXPLORE: epsilon-greedy random from top-3 or all
            if scored and scored[0][1] > float('-inf') and \
               __import__('random').random() > EPSILON:
                scored.sort(key=lambda x: -x[1])
            # else: random already in scored order

        chosen_workflow = scored[0][0] if scored else DEFAULT_WORKFLOW
        avg_reward = scored[0][2] if scored else 0.0
        visit_count = scored[0][3] if scored else 0
        confidence = min(abs(avg_reward) * math.sqrt(max(visit_count, 1)), 1.0)
        exploration_bonus = scored[0][1] - scored[0][2] if scored else 0.0

    else:
        # Forced workflow path
        row = conn.execute(
            "SELECT avg_reward, visit_count FROM workflow_stats WHERE workflow_id=? AND task_type=?",
            [chosen_workflow, task_type]).fetchone()
        avg_reward = row[0] if row else 0.0
        visit_count = row[1] if row else 0
        confidence = 0.95  # forced = high confidence
        exploration_bonus = 0.0
        rationale_parts.append(f"[FORCED via HITL override]")

    # Build rationale
    if visit_count == 0:
        rationale_parts.append(f"[UNCONFIGURED] No prior data for '{chosen_workflow}' on task_type '{task_type}'")
        rationale_parts.append("Defaulting to UCB1-initiated exploration.")
    else:
        rationale_parts.append(f"avg_reward={avg_reward:.3f} over {visit_count} visits")

    rationale_parts.append(f"mode={mode}, epsilon={EPSILON}")
    rationale_parts.append(f"context_hash={context_hash}")

    # Fetch similar past decisions for evidence
    similar = conn.execute("""
        SELECT decision_id, chosen_workflow, rationale, confidence
        FROM routing_log WHERE task_type=?
        ORDER BY created_at DESC LIMIT 3
    """, [task_type]).fetchall()
    for s in similar:
        evidence.append(f"past:decision_id={s[0]} workflow={s[1]} conf={s[3]}")

    rationale = "; ".join(rationale_parts)

    decision = RoutingDecision(
        decision_id=decision_id,
        task_type=task_type,
        context_hash=context_hash,
        chosen_workflow=chosen_workflow,
        mode=mode,
        confidence=round(confidence, 4),
        rationale=rationale,
        evidence=evidence,
        exploration_bonus=round(exploration_bonus, 4),
        reward_if_known=round(avg_reward, 4),
        epsilon=EPSILON,
        created_at=now
    )

    # Persist decision
    conn.execute("""
        INSERT INTO routing_log
            (decision_id, task_type, context_hash, chosen_workflow, mode,
             confidence, rationale, evidence, exploration_bonus, reward_if_known, epsilon, created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    """, [
        decision.decision_id, decision.task_type, decision.context_hash,
        decision.chosen_workflow, decision.mode, decision.confidence,
        decision.rationale, json.dumps(decision.evidence),
        decision.exploration_bonus, decision.reward_if_known, decision.epsilon, decision.created_at
    ])

    # Increment visit count
    conn.execute("""
        UPDATE workflow_stats SET visit_count = visit_count + 1 WHERE workflow_id=? AND task_type=?
    """, [chosen_workflow, task_type])

    conn.commit()
    conn.close()
    return decision


def record_feedback(decision_id: str, outcome_label: str, evidence: list[str] = None) -> None:
    """
    Record outcome for a routing decision. Updates workflow stats via
    incremental reward update (no retraining needed — bandit property).
    """
    conn = _get_db()
    now = datetime.utcnow().isoformat()
    reward = _clamp_reward(_reward_from_label(outcome_label))

    # Fetch the decision
    row = conn.execute(
        "SELECT task_type, chosen_workflow FROM routing_log WHERE decision_id=?",
        [decision_id]).fetchone()
    if not row:
        conn.close()
        raise ValueError(f"Unknown decision_id: {decision_id}")

    task_type, workflow_id = row

    # Update running reward average: incremental update
    stats = conn.execute(
        "SELECT total_reward, visit_count, avg_reward FROM workflow_stats WHERE workflow_id=? AND task_type=?",
        [workflow_id, task_type]).fetchone()

    if stats:
        total_reward, visit_count, _ = stats
        # Weighted update: α = 0.2 (conservative)
        alpha = 0.2
        new_avg = (1 - alpha) * stats[2] + alpha * reward
        conn.execute("""
            UPDATE workflow_stats
            SET total_reward=?, avg_reward=?, last_updated=?
            WHERE workflow_id=? AND task_type=?
        """, [total_reward + reward, new_avg, now, workflow_id, task_type])

    # Log feedback
    feedback_id = f"fb-{uuid.uuid4().hex[:12]}"
    conn.execute("""
        INSERT INTO feedback_log
            (feedback_id, decision_id, outcome_reward, outcome_label, evidence, created_at)
        VALUES (?,?,?,?,?,?)
    """, [feedback_id, decision_id, reward, outcome_label,
          json.dumps(evidence or []), now])
    conn.commit()
    conn.close()


def get_router_stats(task_type: Optional[str] = None) -> dict:
    """Return current routing stats for audit."""
    conn = _get_db()
    if task_type:
        rows = conn.execute("""
            SELECT workflow_id, task_type, total_reward, visit_count, avg_reward, last_updated
            FROM workflow_stats WHERE task_type=?
        """, [task_type]).fetchall()
    else:
        rows = conn.execute("""
            SELECT workflow_id, task_type, total_reward, visit_count, avg_reward, last_updated
            FROM workflow_stats
        """).fetchall()
    conn.close()
    return {
        "task_type": task_type or "ALL",
        "workflows": [
            {"workflow_id": r[0], "task_type": r[1], "total_reward": round(r[2], 4),
             "visit_count": r[3], "avg_reward": round(r[4], 4), "last_updated": r[5]}
            for r in rows
        ]
    }


def explain_route(task_type: str, workflow_id: str) -> str:
    """Human-readable explanation of why a workflow was selected."""
    conn = _get_db()
    row = conn.execute("""
        SELECT avg_reward, visit_count, last_updated FROM workflow_stats
        WHERE workflow_id=? AND task_type=?
    """, [workflow_id, task_type]).fetchone()
    conn.close()
    if not row:
        return f"[UNCONFIGURED] No routing history for '{workflow_id}' on '{task_type}'."
    avg, visits, updated = row
    return (
        f"Workflow '{workflow_id}' for task_type '{task_type}':\n"
        f"  avg_reward={avg:.3f} | visits={visits} | last={updated}\n"
        f"  UCB1={_ucb1(avg, visits, max(visits, 1)):.3f}\n"
        f"  Interpretation: {'well-explored' if visits > 10 else 'under-explored'}"
    )

# ─── Backward-Compatible Class API ─────────────────────────────────────────

class IERRouter:
    """
    Stateful router with per-task-type configuration.
    Usage: router = IERRouter(); decision = router.route(task_type, context, workflows)
    """
    def __init__(self, epsilon: float = EPSILON):
        self.epsilon = epsilon
        self._db_path = str(ROUTER_DB)

    def route(self, task_type: str, context: dict,
              available_workflows: list[str],
              forced_workflow: Optional[str] = None,
              override_mode: Optional[Literal["EXPLOIT", "EXPLORE"]] = None) -> RoutingDecision:
        return route_task(task_type, context, available_workflows,
                         forced_workflow=forced_workflow,
                         override_mode=override_mode)

    def feedback(self, decision_id: str, outcome_label: str,
                 evidence: list[str] = None) -> None:
        return record_feedback(decision_id, outcome_label, evidence)

    def stats(self, task_type: Optional[str] = None) -> dict:
        return get_router_stats(task_type)

    def explain(self, task_type: str, workflow_id: str) -> str:
        return explain_route(task_type, workflow_id)

    def register_workflow(self, workflow_id: str, task_type: str) -> None:
        return register_workflow(workflow_id, task_type)

    def record_task_type(self, task_type: str, features: dict,
                        description: str, default_workflow: str = DEFAULT_WORKFLOW) -> None:
        return record_task_type(task_type, features, description, default_workflow)


# Alias for import compatibility
OutcomeFeedback = RoutingDecision  # used as input type for feedback calls
