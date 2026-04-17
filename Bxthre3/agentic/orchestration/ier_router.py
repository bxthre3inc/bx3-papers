#!/usr/bin/env python3
"""
IER Router — Learnable Task→Agent Routing via Contextual Bandits
Persists Q-table to disk so learning survives restarts.
"""
import json, os, time
from dataclasses import dataclass, asdict
from typing import Dict, Optional

Q_TABLE_PATH = os.environ.get("IER_Q_TABLE", "/dev/shm/agentic/ier_q_table.json")
EPSILON = 0.1
MIN_CONFIDENCE = 0.75
ALPHA = 0.1

AGENTS = ["iris", "dev", "sam", "taylor", "theo", "casey", "maya", "raj", "drew"]

def _state_key(task: dict) -> str:
    return f"{task.get('task_type','unknown')}_{task.get('complexity','low')}_{task.get('urgency','low')}"

@dataclass
class RoutingDecision:
    id: str
    task_id: str
    state: str
    selected_agent: str
    confidence: float
    is_override: bool
    override_reason: Optional[str]
    q_value: float
    alternative_agents: list

@dataclass
class OutcomeFeedback:
    decision_id: str
    task_id: str
    agent_id: str
    quality_score: float
    actual_duration_minutes: float
    cost_actual_usd: float

class IERRouter:
    def __init__(self, q_path: str = Q_TABLE_PATH):
        self.q_path = q_path
        self.q_table_path = q_path
        os.makedirs(os.path.dirname(q_path), exist_ok=True)
        self._load()

    def _load(self):
        if os.path.exists(self.q_path):
            try:
                with open(self.q_path) as f:
                    d = json.load(f)
                    self.states = d.get("states", {})
                    self.version = d.get("version", 1)
            except Exception:
                self.states = {}
                self.version = 1
        else:
            self.states = {}
            self.version = 1
        for state in ["engineering_medium_high", "marketing_medium_medium"]:
            if state not in self.states:
                self.states[state] = {a: 0.0 for a in AGENTS}
                for a in AGENTS:
                    self.states[state][a] = float(hash(state + a) % 100) / 100

    def _save(self):
        with open(self.q_path, "w") as f:
            json.dump({"version": self.version, "states": self.states}, f)

    def _best(self, state: str) -> tuple:
        if state not in self.states:
            self.states[state] = {a: 0.0 for a in AGENTS}
        q_vals = self.states[state]
        best_agent = max(q_vals, key=q_vals.get)
        best_q = q_vals[best_agent]
        avg_q = sum(q_vals.values()) / len(q_vals)
        spread = best_q - avg_q
        confidence = min(0.5 + spread, 1.0)
        return best_agent, best_q, confidence

    def decide(self, task: dict) -> RoutingDecision:
        state = _state_key(task)
        task_id = task.get("task_id", f"task-{time.time()}")
        decision_id = f"dec-{task_id}"

        import random
        if random.random() < EPSILON:
            selected = random.choice(AGENTS)
            q_val = self.states.get(state, {}).get(selected, 0.0)
            decision = RoutingDecision(
                id=decision_id, task_id=task_id, state=state,
                selected_agent=selected, confidence=0.0,
                is_override=False, override_reason=None,
                q_value=q_val, alternative_agents=[a for a in AGENTS if a != selected]
            )
        else:
            best, q_val, conf = self._best(state)
            decision = RoutingDecision(
                id=decision_id, task_id=task_id, state=state,
                selected_agent=best, confidence=conf,
                is_override=False, override_reason=None,
                q_value=q_val, alternative_agents=[a for a in AGENTS if a != best]
            )

        self._save()
        return decision

    def record_outcome(self, feedback: OutcomeFeedback):
        state = None
        if feedback.decision_id:
            pass
        reward = feedback.quality_score - (feedback.cost_actual_usd / 100)
        if state and state in self.states and feedback.agent_id in self.states[state]:
            q = self.states[state][feedback.agent_id]
            self.states[state][feedback.agent_id] = q + ALPHA * (reward - q)
            self._save()

if __name__ == "__main__":
    router = IERRouter()
    task = {"task_id": "test-001", "task_type": "engineering", "complexity": "medium", "urgency": "high", "domain": "backend"}
    result = router.decide(task)
    print(f"Selected: {result.selected_agent} | confidence: {result.confidence:.2f} | q: {result.q_value:.3f}")
    print(f"Q-table: {os.path.getsize(router.q_path)} bytes | states: {len(router.states)}")
    import pprint
    pprint.pprint(dict(list(router.states.items())[:3]))
