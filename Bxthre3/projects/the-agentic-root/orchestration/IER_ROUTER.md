# Agentic IER Router
## Replaces ChatDev IER — Constrained RL That Explains Itself

**Module:** `ier_router.py`
**Location:** `Bxthre3/projects/agentic/orchestration/ier_router.py`
**Status:** SPEC

---

## Purpose

ChatDev's IER is **generic reinforcement learning** — it learns but can't explain why it picked an agent. In regulated environments (grants, legal, compliance), opaque routing is unacceptable.

Agentic's IER Router uses **Contextual Bandits** — a constrained RL variant that:
1. Learns optimal agent-task routing from experience
2. Is **explainable** — logs why each routing decision was made
3. Is **auditable** — every override is cited with evidence
4. Runs on constrained hardware — no GPU required

---

## Algorithm: Contextual Bandits

Standard contextual bandit:
- **State:** Task features (type, complexity, domain, urgency, budget)
- **Action:** Select agent ID
- **Reward:** (quality * speed) / cost

Agentic adaptation:
- **State:** TaskFeatureVector (structured, not raw text)
- **Action:** Select agent + role assignment
- **Reward:** Composite (quality_score * speed_ratio * cost_efficiency)
- **Constraint:** All decisions logged with reasoning

---

## Data Model

```python
@dataclass
class TaskFeatureVector:
    """Structured task representation for routing decisions."""
    task_type: str        # research | code | grant | deploy | general
    domain: str           # agriculture | engineering | legal | grants | ops
    complexity: str       # low | medium | high | critical
    urgency: str          # low | medium | high | critical
    budget_usd: float
    deadline_days: int
    has_citations: bool  # Requires evidence citation
    is_regulated: bool    # Legal/compliance sensitive
    
    def to_state_key(self) -> str:
        """Convert to hashable key for Q-table lookup."""
        return f"{self.task_type}_{self.complexity}_{self.urgency}"

@dataclass
class RoutingDecision:
    """A single routing decision with full audit trail."""
    task_id: str
    state: TaskFeatureVector
    selected_agent: str
    selected_role: str
    confidence: float              # 0.0-1.0 in this decision
    is_override: bool              # True = IER deviated from template
    override_reason: str | None     # Why IER overrode template
    q_value: float                 # Q(state, action) at time of decision
    alternative_agents: list[str]   # What else was considered
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

@dataclass
class OutcomeFeedback:
    """Feedback on a routing decision — used to update Q-values."""
    decision_id: str
    task_id: str
    quality_score: float            # 0-100 from Phase Gate
    actual_duration_minutes: float
    cost_actual_usd: float
    agent_id: str
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
```

---

## Schema

```sql
CREATE TABLE ier_q_table (
    task_class TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    q_value REAL DEFAULT 0.0,
    visit_count INTEGER DEFAULT 0,
    last_updated TEXT,
    PRIMARY KEY (task_class, agent_id)
);

CREATE TABLE ier_routing_decisions (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    task_class TEXT NOT NULL,
    selected_agent TEXT NOT NULL,
    selected_role TEXT NOT NULL,
    confidence REAL NOT NULL,
    is_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    q_value REAL NOT NULL,
    alternative_agents TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ier_outcomes (
    id TEXT PRIMARY KEY,
    decision_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    quality_score REAL NOT NULL,
    actual_duration_minutes REAL NOT NULL,
    cost_actual_usd REAL NOT NULL,
    reward REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (decision_id) REFERENCES ier_routing_decisions(id)
);
```

---

## Core Implementation

```python
import uuid
import json
import sqlite3
import random
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime

class IERRouter:
    """
    Iterative Experience Refinement Router using Contextual Bandits.
    All decisions are explainable and auditable.
    """
    
    def __init__(
        self,
        db_path: str = "agentic_ier.db",
        epsilon: float = 0.1,
        learning_rate: float = 0.1,
        min_confidence_for_override: float = 0.75
    ):
        self.db_path = db_path
        self.epsilon = epsilon
        self.alpha = learning_rate
        self.min_confidence = min_confidence_for_override
        self._init_db()
        self._q_cache: dict[str, dict[str, float]] = defaultdict(dict)
        self._load_q_cache()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript('''
                CREATE TABLE IF NOT EXISTS ier_q_table (
                    task_class TEXT NOT NULL, agent_id TEXT NOT NULL,
                    q_value REAL DEFAULT 0.0, visit_count INTEGER DEFAULT 0, last_updated TEXT,
                    PRIMARY KEY (task_class, agent_id)
                );
                CREATE TABLE IF NOT EXISTS ier_routing_decisions (
                    id TEXT PRIMARY KEY, task_id TEXT NOT NULL, task_class TEXT NOT NULL,
                    selected_agent TEXT NOT NULL, selected_role TEXT NOT NULL,
                    confidence REAL NOT NULL, is_override BOOLEAN DEFAULT FALSE,
                    override_reason TEXT, q_value REAL NOT NULL, alternative_agents TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
                CREATE TABLE IF NOT EXISTS ier_outcomes (
                    id TEXT PRIMARY KEY, decision_id TEXT NOT NULL, task_id TEXT NOT NULL,
                    agent_id TEXT NOT NULL, quality_score REAL NOT NULL,
                    actual_duration_minutes REAL NOT NULL, cost_actual_usd REAL NOT NULL,
                    reward REAL NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            ''')
    
    def _load_q_cache(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            for row in conn.execute('SELECT * FROM ier_q_table'):
                self._q_cache[row['task_class']][row['agent_id']] = row['q_value']
    
    def select_agent(self, task: dict, template_agent: str | None = None, available_agents: list[str] = None) -> RoutingDecision:
        """Select agent for task with full audit trail."""
        state = self._extract_features(task)
        state_key = state.to_state_key()
        agents = available_agents or ["mansu", "zo", "genspark"]
        
        # Exploration
        if random.random() < self.epsilon:
            selected = random.choice(agents)
            decision = self._make_decision(task, state, selected, template_agent,
                is_override=template_agent is not None and selected != template_agent,
                override_reason="Random exploration" if selected != template_agent else None,
                confidence=0.1)
            self._save_decision(decision)
            return decision
        
        # Exploitation
        q_values = self._q_cache.get(state_key, {})
        if not q_values:
            selected = template_agent or random.choice(agents)
            decision = self._make_decision(task, state, selected, template_agent,
                is_override=False, override_reason=None, confidence=0.3)
            self._save_decision(decision)
            return decision
        
        best_agent = max(q_values, key=q_values.get)
        best_q = q_values[best_agent]
        confidence = self._compute_confidence(q_values, best_q)
        
        if template_agent and best_agent != template_agent and confidence >= self.min_confidence:
            decision = self._make_decision(task, state, best_agent, template_agent,
                is_override=True,
                override_reason=f"IER Q={best_q:.3f} > template Q={q_values.get(template_agent, 0):.3f}",
                confidence=confidence, alternative_agents=[template_agent])
        elif template_agent:
            decision = self._make_decision(task, state, template_agent, template_agent,
                is_override=False, override_reason=None, confidence=confidence,
                alternative_agents=[best_agent])
        else:
            decision = self._make_decision(task, state, best_agent, None,
                is_override=False, override_reason=None, confidence=confidence)
        
        self._save_decision(decision)
        return decision
    
    def learn(self, outcome: OutcomeFeedback):
        """Update Q-values based on task outcome."""
        reward = self._compute_reward(outcome)
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            decision_row = conn.execute(
                'SELECT * FROM ier_routing_decisions WHERE id = ?', (outcome.decision_id,)
            ).fetchone()
        
        if not decision_row:
            return
        
        task_class = decision_row['task_class']
        agent_id = outcome.agent_id
        old_q = self._q_cache[task_class].get(agent_id, 0.0)
        n = self._get_visit_count(task_class, agent_id)
        new_q = old_q + self.alpha * (reward - old_q)
        self._q_cache[task_class][agent_id] = new_q
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''INSERT OR REPLACE INTO ier_q_table VALUES (?, ?, ?, ?, ?)''',
                (task_class, agent_id, new_q, n + 1, datetime.utcnow().isoformat()))
            conn.execute('''INSERT INTO ier_outcomes VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                (str(uuid.uuid4()), outcome.decision_id, outcome.task_id, outcome.agent_id,
                 outcome.quality_score, outcome.actual_duration_minutes, outcome.cost_actual_usd, reward))
    
    def _compute_reward(self, outcome: OutcomeFeedback) -> float:
        """Reward = 0.5*quality + 0.3*speed + 0.2*cost_efficiency"""
        quality = outcome.quality_score / 100.0
        baseline = outcome.actual_duration_minutes * 2
        speed = baseline / max(outcome.actual_duration_minutes, 1)
        cost_eff = max(1 - (outcome.cost_actual_usd / max(outcome.cost_actual_usd, 1)), 0)
        return (0.5 * quality) + (0.3 * min(speed, 1.0)) + (0.2 * cost_eff)
    
    def _compute_confidence(self, q_values: dict, best_q: float) -> float:
        if len(q_values) < 2:
            return 0.3
        sorted_q = sorted(q_values.values(), reverse=True)
        gap = sorted_q[0] - sorted_q[1]
        return min(0.5 + (gap * 0.5), 0.95)
    
    def _extract_features(self, task: dict) -> TaskFeatureVector:
        return TaskFeatureVector(
            task_type=task.get('type', 'general'),
            domain=task.get('domain', 'ops'),
            complexity=task.get('complexity', 'medium'),
            urgency=task.get('priority', 'P2').lower().replace('p', ''),
            budget_usd=task.get('budget_usd', 0),
            deadline_days=task.get('deadline_days', 7),
            has_citations=task.get('requires_citations', False),
            is_regulated=task.get('is_regulated', False)
        )
    
    def _make_decision(self, task, state, selected, template_agent, is_override, override_reason, confidence, alternative_agents=None):
        return RoutingDecision(
            task_id=task.get('id', 'unknown'),
            state=state,
            selected_agent=selected,
            selected_role=task.get('role', 'execute'),
            confidence=confidence,
            is_override=is_override,
            override_reason=override_reason,
            q_value=self._q_cache.get(state.to_state_key(), {}).get(selected, 0.0),
            alternative_agents=alternative_agents or []
        )
    
    def _save_decision(self, decision: RoutingDecision):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''INSERT INTO ier_routing_decisions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (str(uuid.uuid4()), decision.task_id, decision.state.to_state_key(),
                 decision.selected_agent, decision.selected_role, decision.confidence,
                 decision.is_override, decision.override_reason, decision.q_value,
                 json.dumps(decision.alternative_agents), datetime.utcnow().isoformat()))
    
    def _get_visit_count(self, task_class: str, agent_id: str) -> int:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute('SELECT visit_count FROM ier_q_table WHERE task_class=? AND agent_id=?',
                (task_class, agent_id)).fetchone()
        return row[0] if row else 0
```

---

## Key Differences from ChatDev IER

| Aspect | ChatDev IER | Agentic IER Router |
|--------|------------|-------------------|
| **Algorithm** | Generic RL | Contextual Bandits |
| **Explainability** | Opaque | Full decision audit trail |
| **Hardware** | GPU recommended | CPU only |
| **Learning** | Full RL (complex) | Incremental mean update |
| **Override logging** | None | Every override logged with reason |
| **Confidence threshold** | None | Configurable min_confidence |

---

*Module: ier_router.py*
*Part of: Agentic Orchestration Layer*
*Replaces: ChatDev IER (opaque RL → explainable contextual bandits)*