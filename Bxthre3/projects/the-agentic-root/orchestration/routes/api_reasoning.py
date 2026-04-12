"""
Agentic Orchestration — Reasoning Stream API
Location: /api/orchestration/reasoning
"""
import sqlite3
import uuid
import json
from datetime import datetime

SCHEMA = """
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
    created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rs_task ON reasoning_stream(task_id);
CREATE INDEX IF NOT EXISTS idx_rs_agent ON reasoning_stream(agent_id);
CREATE INDEX IF NOT EXISTS idx_rs_created ON reasoning_stream(created_at);
"""

DB_PATH = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/reasoning.db"

def init_db():
    import os
    os.makedirs("/home/workspace/Bxthre3/projects/agentic/orchestration/data", exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA)

def routes(app):
    init_db()

    @app.get("/api/orchestration/reasoning")
    def list_entries():
        """List reasoning stream entries, optionally filtered."""
        task_id = getattr(app, 'g', {}).get('task_id') or _get_param("task_id")
        agent_id = _get_param("agent_id")
        limit = int(_get_param("limit", "50"))
        
        query = "SELECT * FROM reasoning_stream WHERE 1=1"
        params = []
        if task_id:
            query += " AND task_id = ?"
            params.append(task_id)
        if agent_id:
            query += " AND agent_id = ?"
            params.append(agent_id)
        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(query, params).fetchall()
        
        entries = []
        for row in rows:
            d = dict(row)
            d["evidence"] = json.loads(d["evidence"])
            d["metadata"] = json.loads(d["metadata"])
            entries.append(d)
        
        return {"entries": entries, "count": len(entries)}

    @app.post("/api/orchestration/reasoning")
    def append_entry():
        """Append a new reasoning entry."""
        body = app.get("body", {})
        now = datetime.utcnow().isoformat()
        entry_id = str(uuid.uuid4())
        
        entry = {
            "id": entry_id,
            "task_id": body.get("task_id", ""),
            "agent_id": body.get("agent_id", ""),
            "phase": body.get("phase", "unknown"),
            "reasoning": body.get("reasoning", ""),
            "evidence": json.dumps(body.get("evidence", [])),
            "confidence": float(body.get("confidence", 0.5)),
            "next_action": body.get("next_action", ""),
            "metadata": json.dumps(body.get("metadata", {})),
            "created_at": now
        }
        
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                """INSERT INTO reasoning_stream
                   (id, task_id, agent_id, phase, reasoning, evidence, confidence, next_action, metadata, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (*entry.values(),)
            )
        
        entry["evidence"] = json.loads(entry["evidence"])
        entry["metadata"] = json.loads(entry["metadata"])
        return {"entry": entry, "id": entry_id}

    @app.get("/api/orchestration/reasoning/<task_id>")
    def get_task_reasoning(task_id):
        """Get all reasoning entries for a specific task."""
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM reasoning_stream WHERE task_id = ? ORDER BY created_at ASC",
                (task_id,)
            ).fetchall()
        
        entries = []
        for row in rows:
            d = dict(row)
            d["evidence"] = json.loads(d["evidence"])
            d["metadata"] = json.loads(d["metadata"])
            entries.append(d)
        
        return {"task_id": task_id, "entries": entries, "count": len(entries)}

def _get_param(key, default=""):
    return default
