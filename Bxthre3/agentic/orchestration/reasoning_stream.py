"""
Agentic Reasoning Stream
Replaces ChatDev Memory Stream — Structured Reasoning with Citations

Module: reasoning_stream.py
Location: Bxthre3/projects/agentic/orchestration/reasoning_stream.py
Status: IMPLEMENTED

Every agent decision is logged with:
- What was decided
- Why (free-text rationale)
- What evidence was cited (file paths, URLs, API responses, calc values)
- Confidence score (0.0–1.0)
- What the agent expects to happen next

This enables successor agents to read full context, not just final output.
"""

import sqlite3
import uuid
import json
import tempfile
import os
from datetime import datetime
from dataclasses import dataclass, field, asdict
from typing import Optional
from pathlib import Path


# ─────────────────────────────────────────────────────────────────
# DATA MODELS
# ─────────────────────────────────────────────────────────────────

@dataclass
class ReasoningEntry:
    """A single reasoning step in the stream."""
    id: str
    task_id: str
    agent_id: str
    phase: str  # analyze | execute | validate | deliver | complete
    reasoning: str  # Free-text: what was concluded and why
    evidence: list[dict]  # [{type, path, content}] — required citations
    confidence: float  # 0.0–1.0
    next_action: str | None  # What agent expects to happen next
    metadata: dict = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        d = asdict(self)
        d['evidence'] = json.dumps(self.evidence)
        d['metadata'] = json.dumps(self.metadata)
        return d

    @staticmethod
    def from_row(row: sqlite3.Row) -> 'ReasoningEntry':
        return ReasoningEntry(
            id=row['id'],
            task_id=row['task_id'],
            agent_id=row['agent_id'],
            phase=row['phase'],
            reasoning=row['reasoning'],
            evidence=json.loads(row['evidence']),
            confidence=row['confidence'],
            next_action=row['next_action'],
            metadata=json.loads(row['metadata']),
            created_at=row['created_at']
        )


@dataclass
class ReasoningSummary:
    """Short summary of reasoning chain for a task."""
    task_id: str
    total_entries: int
    phases: list[str]
    agent_ids: list[str]
    avg_confidence: float
    has_citations: bool
    last_updated: str


# ─────────────────────────────────────────────────────────────────
# REASONING STREAM CLASS
# ─────────────────────────────────────────────────────────────────

class ReasoningStream:
    """
    Append-only log of agent decision rationale.
    
    NOT: "Agent said X"
    IS:  "Agent concluded Y because Z"
    
    Designed for:
    - Successor agents reading full decision context
    - Audit trails (regulatory, legal, compliance)
    - IER training data generation
    - Post-mortem analysis without chat transcript reconstruction
    """

    DB_SCHEMA = """
    CREATE TABLE IF NOT EXISTS reasoning_stream (
        id          TEXT PRIMARY KEY,
        task_id     TEXT NOT NULL,
        agent_id    TEXT NOT NULL,
        phase       TEXT NOT NULL,
        reasoning   TEXT NOT NULL,
        evidence    TEXT NOT NULL DEFAULT '[]',
        confidence  REAL NOT NULL DEFAULT 0.5,
        next_action TEXT,
        metadata    TEXT NOT NULL DEFAULT '{}',
        created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_rs_task    ON reasoning_stream(task_id);
    CREATE INDEX IF NOT EXISTS idx_rs_agent   ON reasoning_stream(agent_id);
    CREATE INDEX IF NOT EXISTS idx_rs_phase   ON reasoning_stream(phase);
    CREATE INDEX IF NOT EXISTS idx_rs_created ON reasoning_stream(created_at);
    """

    def __init__(self, db_path: str = "agentic_reasoning.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Create tables if not exist."""
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(self.DB_SCHEMA)

    # ─────────────────────────────────────────────────────────────
    # PUBLIC API
    # ─────────────────────────────────────────────────────────────

    def append(
        self,
        task_id: str,
        agent_id: str,
        phase: str,
        reasoning: str,
        evidence: list[dict] | None = None,
        confidence: float = 0.5,
        next_action: str | None = None,
        metadata: dict | None = None
    ) -> str:
        """
        Append a reasoning entry to the stream.
        
        Args:
            task_id:     Task identifier
            agent_id:    Agent that made the decision
            phase:       Current phase (analyze|execute|validate|deliver|complete)
            reasoning:   Free-text rationale (required)
            evidence:    List of {type, path, content} citations (required for verify-or-die)
            confidence:  Agent's confidence in decision (0.0–1.0)
            next_action: What agent expects to happen next
            metadata:    Arbitrary extra data
            
        Returns:
            Entry ID
            
        Raises:
            ValueError: If reasoning is empty or evidence is missing on high-confidence entries
        """
        if not reasoning.strip():
            raise ValueError("reasoning cannot be empty")

        if confidence >= 0.8 and not evidence:
            raise ValueError(
                f"High-confidence entry ({confidence}) requires evidence citations"
            )

        entry_id = str(uuid.uuid4())
        
        entry = ReasoningEntry(
            id=entry_id,
            task_id=task_id,
            agent_id=agent_id,
            phase=phase,
            reasoning=reasoning.strip(),
            evidence=evidence or [],
            confidence=confidence,
            next_action=next_action,
            metadata=metadata or {}
        )

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT INTO reasoning_stream
                   (id, task_id, agent_id, phase, reasoning, evidence, confidence, next_action, metadata, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    entry.id,
                    entry.task_id,
                    entry.agent_id,
                    entry.phase,
                    entry.reasoning,
                    json.dumps(entry.evidence),
                    entry.confidence,
                    entry.next_action,
                    json.dumps(entry.metadata),
                    entry.created_at
                )
            )

        return entry_id

    def get_context(self, task_id: str) -> list[ReasoningEntry]:
        """
        Get full reasoning chain for a task.
        Returns entries in chronological order for successor agents.
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                """SELECT * FROM reasoning_stream
                   WHERE task_id = ?
                   ORDER BY created_at ASC""",
                (task_id,)
            ).fetchall()
            return [ReasoningEntry.from_row(r) for r in rows]

    def get_last_entry(self, task_id: str) -> ReasoningEntry | None:
        """Get most recent entry for a task."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                """SELECT * FROM reasoning_stream
                   WHERE task_id = ?
                   ORDER BY created_at DESC
                   LIMIT 1""",
                (task_id,)
            ).fetchone()
            return ReasoningEntry.from_row(row) if row else None

    def get_summary(self, task_id: str) -> ReasoningSummary | None:
        """Get short summary of reasoning chain for a task."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute(
                """SELECT
                       task_id,
                       COUNT(*) as total_entries,
                       GROUP_CONCAT(DISTINCT phase) as phases,
                       GROUP_CONCAT(DISTINCT agent_id) as agent_ids,
                       AVG(confidence) as avg_confidence,
                       MAX(CASE WHEN evidence != '[]' THEN 1 ELSE 0 END) as has_citations,
                       MAX(created_at) as last_updated
                   FROM reasoning_stream
                   WHERE task_id = ?
                   GROUP BY task_id""",
                (task_id,)
            ).fetchone()

            if not row:
                return None

            return ReasoningSummary(
                task_id=row['task_id'],
                total_entries=row['total_entries'],
                phases=row['phases'].split(',') if row['phases'] else [],
                agent_ids=row['agent_ids'].split(',') if row['agent_ids'] else [],
                avg_confidence=row['avg_confidence'] or 0.0,
                has_citations=bool(row['has_citations']),
                last_updated=row['last_updated']
            )

    def search(
        self,
        agent_id: str | None = None,
        phase: str | None = None,
        min_confidence: float | None = None,
        since: str | None = None,
        limit: int = 50
    ) -> list[ReasoningEntry]:
        """
        Search reasoning stream with filters.
        Used for audit reports, IER training data, and retrospectives.
        """
        query = "SELECT * FROM reasoning_stream WHERE 1=1"
        params: list = []

        if agent_id:
            query += " AND agent_id = ?"
            params.append(agent_id)
        if phase:
            query += " AND phase = ?"
            params.append(phase)
        if min_confidence is not None:
            query += " AND confidence >= ?"
            params.append(min_confidence)
        if since:
            query += " AND created_at >= ?"
            params.append(since)

        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)

        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(query, params).fetchall()
            return [ReasoningEntry.from_row(r) for r in rows]

    def get_evidence_for_audit(self, task_id: str) -> list[dict]:
        """
        Extract all evidence from a task's reasoning chain for audit.
        Returns flat list of {type, path, content} from all entries.
        """
        entries = self.get_context(task_id)
        evidence = []
        for entry in entries:
            for e in entry.evidence:
                evidence.append({
                    'entry_id': entry.id,
                    'agent_id': entry.agent_id,
                    'phase': entry.phase,
                    'created_at': entry.created_at,
                    **e
                })
        return evidence

    def get_training_data(self, min_entries: int = 3) -> list[dict]:
        """
        Generate IER training data from completed reasoning chains.
        Returns: [{task_type, task_domain, agent_sequence, outcome_score}, ...]
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                """SELECT task_id,
                          COUNT(*) as entry_count,
                          GROUP_CONCAT(agent_id) as agent_sequence,
                          AVG(confidence) as avg_confidence,
                          MAX(created_at) as last_entry
                   FROM reasoning_stream
                   GROUP BY task_id
                   HAVING entry_count >= ?""",
                (min_entries,)
            ).fetchall()

            training_data = []
            for row in rows:
                # Infer task type from first entry's phase
                first_entry = conn.execute(
                    """SELECT phase FROM reasoning_stream
                       WHERE task_id = ?
                       ORDER BY created_at ASC LIMIT 1""",
                    (row['task_id'],)
                ).fetchone()

                training_data.append({
                    'task_id': row['task_id'],
                    'task_type': first_entry['phase'] if first_entry else 'unknown',
                    'agent_sequence': row['agent_sequence'].split(',') if row['agent_sequence'] else [],
                    'avg_confidence': row['avg_confidence'],
                    'entry_count': row['entry_count']
                })

            return training_data


# ─────────────────────────────────────────────────────────────────
# MODULE-level helpers (for direct script usage)
# ─────────────────────────────────────────────────────────────────


def temp_db(name):
    """Return a temp file path for test DB. Cleans up on exit."""
    return os.path.join(tempfile.gettempdir(), f"agentic_test_{name}.db")

def main():
    """Demo / test usage."""
    import pprint
    
    rs = ReasoningStream(temp_db("rs"))  # In-memory for demo
    
    # Simulate reasoning chain for a grant task
    task_id = "GRANT-2026-001"
    
    rs.append(
        task_id=task_id,
        agent_id="zo",
        phase="analyze",
        reasoning="ARPA-E OPEN 2026 grant has 3 sub-topics. Topic A (Buildings) is best fit for Irrig8 energy modeling. Topic B (Manufacturing) is secondary. Topic C (Transportation) is out of scope.",
        evidence=[
            {"type": "url", "path": "https://arpa-e.energy.gov/funding", "content": "ARPA-E OPEN 2026 funding opportunities page"},
            {"type": "calc", "path": "topic_relevance_scores.csv", "content": "Irrig8 scored 0.85 on Topic A, 0.62 on Topic B, 0.21 on Topic C"}
        ],
        confidence=0.9,
        next_action="Casey to draft Topic A alignment section"
    )
    
    rs.append(
        task_id=task_id,
        agent_id="mansu",
        phase="execute",
        reasoning="Drafted budget narrative: $180K year 1 (sensors/deployment), $210K year 2 (data infrastructure), $190K year 3 (validation/commercialization). All costs directly support Irrig8 TRL 4→6 advancement.",
        evidence=[
            {"type": "file", "path": "Bxthre3/budget_draft.md", "content": "Line-item budget table with justifications"},
            {"type": "calc", "path": "trL_advancement.pdf", "content": "TRL scale definition used for scope mapping"}
        ],
        confidence=0.75,
        next_action="Casey to review budget against ARPA-E caps"
    )
    
    rs.append(
        task_id=task_id,
        agent_id="genspark",
        phase="validate",
        reasoning="Budget validation: Year 1 $180K < $250K cap ✓. Year 2 $210K < $300K cap ✓. Year 3 $190K < $250K cap ✓. Indirect cost rate 26.1% < 30% cap ✓. All within limits.",
        evidence=[
            {"type": "url", "path": "https://arpa-e.energy.gov/sites/default/files/2026-04/OPEN2026_FAO.pdf", "content": "ARPA-E budget caps by category"},
            {"type": "calc", "path": "indirect_cost_verification.xlsx", "content": "MTDC calculation with 26.1% rate"}
        ],
        confidence=0.95,
        next_action="Ready for submission"
    )
    
    print("=== Reasoning Stream Demo ===\n")
    
    print("--- Full Context for task_id: GRANT-2026-001 ---")
    for entry in rs.get_context(task_id):
        print(f"[{entry.phase.upper()}] {entry.agent_id} ({entry.confidence:.0%} confidence)")
        print(f"  Reasoning: {entry.reasoning}")
        if entry.evidence:
            print(f"  Evidence ({len(entry.evidence)} citations):")
            for e in entry.evidence:
                print(f"    - [{e['type']}] {e['path']}")
        if entry.next_action:
            print(f"  → Next: {entry.next_action}")
        print()
    
    print("--- Summary ---")
    summary = rs.get_summary(task_id)
    print(f"  Total entries: {summary.total_entries}")
    print(f"  Phases: {', '.join(summary.phases)}")
    print(f"  Agents: {', '.join(summary.agent_ids)}")
    print(f"  Avg confidence: {summary.avg_confidence:.0%}")
    print(f"  Has citations: {summary.has_citations}")
    
    print("\n--- IER Training Data ---")
    for td in rs.get_training_data():
        pprint.pp(td)


if __name__ == "__main__":
    main()