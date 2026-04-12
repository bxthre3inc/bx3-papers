# Agentic Reasoning Stream
## Replaces ChatDev Memory Stream — Structured Reasoning, Not Chat Logs

**Module:** `reasoning_stream.py`
**Location:** `Bxthre3/projects/agentic/orchestration/reasoning_stream.py`
**Status:** SPEC

---

## Purpose

ChatDev's Memory Stream stores chat transcripts — "Agent said X." Agentic's Reasoning Stream stores structured reasoning with citations — "Agent concluded Y because Z."

Every agent decision is logged with:
- What was decided
- Why it was decided (free-text rationale)
- What evidence was cited (file paths, URLs, API responses, calc values)
- Confidence score (0.0–1.0)
- What the agent expects to happen next

This enables:
1. **Successor agents** read full context, not just final output
2. **Auditors** trace why decisions were made, not just what was done
3. **IER Router** uses reasoning patterns to improve future routing
4. **Dispute resolution** has immutable record of agent rationale

---

## Data Model

### Schema (SQLite)

```python
CREATE TABLE reasoning_stream (
    id TEXT PRIMARY KEY,              -- UUID
    task_id TEXT NOT NULL,            -- Links to task
    agent_id TEXT NOT NULL,           -- Which agent reasoned
    phase TEXT NOT NULL,              -- analyze | execute | validate | deliver
    step_id TEXT,                      -- Sub-step within phase
    
    reasoning TEXT NOT NULL,          -- Free-text: why this decision
    evidence TEXT NOT NULL DEFAULT '[]',  -- JSON array of citations
    confidence REAL NOT NULL,          -- 0.0 to 1.0
    
    next_action TEXT,                 -- What agent expects to happen next
    metadata TEXT DEFAULT '{}',        -- Arbitrary key-value context
    
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rs_task ON reasoning_stream(task_id, created_at);
CREATE INDEX idx_rs_agent ON reasoning_stream(agent_id, created_at);
```

### Evidence Array Format

```json
{
  "evidence": [
    {"type": "file", "path": "/Bxthre3/IRRIG8/sensors/soil_reading.csv", "line": 42},
    {"type": "url", "url": "https://api.openweathermap.org/data/2.5/weather", "response": "..."},
    {"type": "calc", "formula": "water_deficit = et0 - precipitation", "value": 23.4},
    {"type": "api", "endpoint": "/api/satellite/tiles", "status": 200}
  ]
}
```

---

## Class API

```python
import uuid
import json
import sqlite3
from datetime import datetime
from dataclasses import dataclass, field, asdict
from typing import Optional

@dataclass
class ReasoningEntry:
    """Single unit of agent reasoning."""
    task_id: str
    agent_id: str
    phase: str                          # analyze | execute | validate | deliver
    reasoning: str                      # Why this decision was made
    evidence: list[dict] = field(default_factory=list)
    confidence: float = 0.5
    next_action: str = ""
    step_id: Optional[str] = None
    metadata: dict = field(default_factory=dict)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

class ReasoningStream:
    """
    Append-only log of agent decision rationale.
    
    NOT: "Agent said X"
    IS: "Agent concluded Y because Z"
    """
    
    def __init__(self, db_path: str = "agentic_reasoning.db"):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        """Create tables if not exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS reasoning_stream (
                    id TEXT PRIMARY KEY,
                    task_id TEXT NOT NULL,
                    agent_id TEXT NOT NULL,
                    phase TEXT NOT NULL,
                    step_id TEXT,
                    reasoning TEXT NOT NULL,
                    evidence TEXT NOT NULL DEFAULT '[]',
                    confidence REAL NOT NULL DEFAULT 0.5,
                    next_action TEXT DEFAULT '',
                    metadata TEXT DEFAULT '{}',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_rs_task ON reasoning_stream(task_id, created_at)')
            conn.execute('CREATE INDEX IF NOT EXISTS idx_rs_agent ON reasoning_stream(agent_id, created_at)')
    
    def append(
        self,
        task_id: str,
        agent_id: str,
        phase: str,
        reasoning: str,
        evidence: list[dict] | None = None,
        confidence: float = 0.5,
        next_action: str = "",
        step_id: str | None = None,
        metadata: dict | None = None
    ) -> ReasoningEntry:
        """
        Append a reasoning entry to the stream.
        
        Args:
            task_id: UUID of the task this reasoning belongs to
            agent_id: Which agent made this reasoning
            phase: Current phase (analyze | execute | validate | deliver)
            reasoning: Free-text explanation of the decision
            evidence: List of citation dicts {type, path/url/endpoint, ...}
            confidence: 0.0-1.0 confidence in this reasoning
            next_action: What this agent expects to happen next
            step_id: Optional sub-step within the phase
            metadata: Arbitrary additional context
        
        Returns:
            ReasoningEntry that was appended
        """
        entry = ReasoningEntry(
            task_id=task_id,
            agent_id=agent_id,
            phase=phase,
            reasoning=reasoning,
            evidence=evidence or [],
            confidence=confidence,
            next_action=next_action,
            step_id=step_id,
            metadata=metadata or {}
        )
        
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                INSERT INTO reasoning_stream 
                (id, task_id, agent_id, phase, step_id, reasoning, evidence, confidence, next_action, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                entry.id,
                entry.task_id,
                entry.agent_id,
                entry.phase,
                entry.step_id,
                entry.reasoning,
                json.dumps(entry.evidence),
                entry.confidence,
                entry.next_action,
                json.dumps(entry.metadata)
            ))
        
        return entry
    
    def get_context(self, task_id: str) -> list[ReasoningEntry]:
        """
        Get full reasoning chain for a task.
        Returns entries in chronological order for successor agents.
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute('''
                SELECT * FROM reasoning_stream 
                WHERE task_id = ? 
                ORDER BY created_at ASC
            ''', (task_id,)).fetchall()
        
        return [self._row_to_entry(row) for row in rows]
    
    def get_agent_history(self, agent_id: str, limit: int = 100) -> list[ReasoningEntry]:
        """Get recent reasoning entries for a specific agent (for IER training)."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute('''
                SELECT * FROM reasoning_stream 
                WHERE agent_id = ? 
                ORDER BY created_at DESC
                LIMIT ?
            ''', (agent_id, limit)).fetchall()
        
        return [self._row_to_entry(row) for row in rows]
    
    def search(self, query: str, task_id: str | None = None) -> list[ReasoningEntry]:
        """
        Full-text search across reasoning text.
        Used by IER to find similar past decisions.
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            if task_id:
                rows = conn.execute('''
                    SELECT * FROM reasoning_stream 
                    WHERE task_id = ? AND reasoning LIKE ?
                    ORDER BY created_at DESC
                ''', (task_id, f'%{query}%')).fetchall()
            else:
                rows = conn.execute('''
                    SELECT * FROM reasoning_stream 
                    WHERE reasoning LIKE ?
                    ORDER BY created_at DESC
                    LIMIT 50
                ''', (f'%{query}%',)).fetchall()
        
        return [self._row_to_entry(row) for row in rows]
    
    def _row_to_entry(self, row: sqlite3.Row) -> ReasoningEntry:
        """Convert database row to ReasoningEntry."""
        return ReasoningEntry(
            id=row['id'],
            task_id=row['task_id'],
            agent_id=row['agent_id'],
            phase=row['phase'],
            step_id=row['step_id'],
            reasoning=row['reasoning'],
            evidence=json.loads(row['evidence']),
            confidence=row['confidence'],
            next_action=row['next_action'],
            metadata=json.loads(row['metadata']),
            created_at=row['created_at']
        )
    
    def to_markdown(self, task_id: str) -> str:
        """
        Render reasoning stream as markdown for human review.
        Used by Phase Gate failure reports.
        """
        entries = self.get_context(task_id)
        if not entries:
            return f"No reasoning recorded for task {task_id}"
        
        lines = [f"# Reasoning Stream: {task_id}\n"]
        
        for entry in entries:
            lines.append(f"## [{entry.created_at}] {entry.agent_id} ({entry.phase})")
            lines.append(f"**Confidence:** {entry.confidence:.0%}")
            lines.append(f"\n**Reasoning:**\n{entry.reasoning}")
            
            if entry.evidence:
                lines.append(f"\n**Evidence:**")
                for e in entry.evidence:
                    if e['type'] == 'file':
                        lines.append(f"  - 📄 `{e['path']}` (line {e.get('line', 'N/A')})")
                    elif e['type'] == 'url':
                        lines.append(f"  - 🔗 {e['url']}")
                    elif e['type'] == 'calc':
                        lines.append(f"  - 🔢 {e['formula']} = {e['value']}")
                    elif e['type'] == 'api':
                        lines.append(f"  - 🌐 {e['endpoint']} → {e['status']}")
            
            if entry.next_action:
                lines.append(f"\n**Next Action:** {entry.next_action}")
            
            lines.append("\n---\n")
        
        return "\n".join(lines)
```

---

## Usage Patterns

### Agent Writing to Stream

```python
rs = ReasoningStream()

# Agent completes analysis phase
rs.append(
    task_id="task_2026_001247",
    agent_id="zo",
    phase="analyze",
    reasoning="Task is a grant application for ARPA-E OPEN. Deadline is 2026-05-01 (24 days). "
              "Budget request $250K matches our projected burn rate for Year 1. "
              "Technical approach aligns with our published work on resource-constrained inference.",
    evidence=[
        {"type": "file", "path": "/Bxthre3/GRANTS/ARPA-E-OPEN-2026/prospectus.md", "line": 15},
        {"type": "calc", "formula": "days_until_deadline", "value": 24},
        {"type": "url", "url": "https://arpa-e.energy.gov/sites/default/files/2026-OPEN.pdf", "response": "confirmed"}
    ],
    confidence=0.85,
    next_action="Route to Manus for initial draft generation",
    metadata={"grant_id": "ARPA-E-OPEN-2026", "budget_requested": 250000}
)
```

### Successor Agent Reading Context

```python
rs = ReasoningStream()
context = rs.get_context("task_2026_001247")

# Agent can now see WHY previous decisions were made
for entry in context:
    print(f"{entry.agent_id} in {entry.phase}: {entry.reasoning}")
    print(f"  Evidence: {entry.evidence}")
    print(f"  Expected next: {entry.next_action}")
```

### IER Router Querying Similar Past Reasoning

```python
# Find similar past tasks for routing decisions
similar = rs.search("grant application deadline")
for entry in similar[:5]:
    print(f"Task {entry.task_id}: {entry.reasoning[:100]}...")
```

---

## Integration Points

| Component | Integration |
|-----------|------------|
| **Phase Gates** | Write reasoning at each gate evaluation |
| **IER Router** | Query past reasoning to inform routing decisions |
| **Coherent Parallelism** | Read reasoning to understand soft dependencies |
| **Agent Connectors** | Each agent writes reasoning after each action |
| **INBOX Routing** | Phase gate failures render as markdown for human review |

---

## Differences from ChatDev Memory Stream

| Aspect | ChatDev Memory Stream | Agentic Reasoning Stream |
|--------|----------------------|------------------------|
| **Content** | Chat transcripts | Structured reasoning with citations |
| **Citations** | None | Required evidence array |
| **Confidence** | Implicit | Explicit 0.0–1.0 |
| **Phase context** | None | Phase-tagged entries |
| **Queryability** | Full-text only | Indexable by task, agent, phase |
| **IER integration** | None | Designed for RL training data |

---

*Module: reasoning_stream.py*
*Part of: Agentic Orchestration Layer*
*Replaces: ChatDev Memory Stream (chat logs → structured reasoning)*
