"""
Chairman Queue — HITL-Gated Tool Call Store
Bxthre3/agentic/kernel/gateway/chairman_queue.py

Stores T2 (HITL-Gated) tool call requests pending human approval.
Humans (brodiblanco) approve via /api/chairman/ approve endpoint.

Tool call syntax: LFM Pythonic
  <|tool_call_start|>[T2_tool_name(arg="value")]<|tool_call_end|>
"""
import json
import uuid
import sqlite3
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from enum import Enum

logger = logging.getLogger("agentic.chairman")

DB_PATH = Path(__file__).parent.parent / "store" / "chairman_queue.db"


class QueueStatus(Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    DENIED = "DENIED"
    EXPIRED = "EXPIRED"


def count_pending() -> int:
    """Return count of PENDING items."""
    conn = _get_db()
    n = conn.execute("SELECT COUNT(*) FROM chairman_queue WHERE status='PENDING'").fetchone()[0]
    conn.close()
    return n

def clear() -> None:
    """Wipe all items from the queue. Use for testing only."""
    DB_PATH.unlink(missing_ok=True)

# ── SQLite ───────────────────────────────────────────────────────────────────

def _get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chairman_queue (
            id              TEXT PRIMARY KEY,
            agent_did       TEXT NOT NULL,
            tool_call       TEXT NOT NULL,
            tool_name       TEXT NOT NULL,
            intent_summary  TEXT NOT NULL,
            risk_level      TEXT NOT NULL,
            status          TEXT NOT NULL DEFAULT 'PENDING',
            requested_at    TEXT NOT NULL,
            reviewed_by     TEXT,
            reviewed_at     TEXT,
            rationale       TEXT,
            expires_at      TEXT NOT NULL
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_status ON chairman_queue(status)")
    conn.commit()
    return conn


def enqueue(
    agent_did: str,
    tool_call: str,
    intent_summary: str,
    risk_level: str = "HIGH",
    ttl_hours: int = 24
) -> str:
    """Enqueue a T2 tool call for HITL approval. Returns queue item ID."""
    item_id = f"hitl-{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    expires = datetime.fromtimestamp(
        now.timestamp() + ttl_hours * 3600, tz=timezone.utc
    )

    conn = _get_db()
    conn.execute("""
        INSERT INTO chairman_queue
            (id, agent_did, tool_call, tool_name, intent_summary, risk_level, status, requested_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        item_id,
        agent_did,
        tool_call,
        tool_call.split("(")[0],
        intent_summary,
        risk_level,
        QueueStatus.PENDING.value,
        now.isoformat(),
        expires.isoformat()
    ))
    conn.commit()
    conn.close()
    logger.info(f"[CHAIRMAN] Enqueued: {item_id} | {tool_call}")
    return item_id


def approve(item_id: str, reviewer: str, rationale: str = "") -> bool:
    """Approve a pending T2 item."""
    conn = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    cur = conn.execute(
        "SELECT status FROM chairman_queue WHERE id = ?", (item_id,)
    ).fetchone()
    if not cur:
        conn.close()
        return False
    if cur[0] != QueueStatus.PENDING.value:
        conn.close()
        return False

    conn.execute("""
        UPDATE chairman_queue
        SET status=?, reviewed_by=?, reviewed_at=?, rationale=?
        WHERE id=?
    """, (QueueStatus.APPROVED.value, reviewer, now, rationale, item_id))
    conn.commit()
    conn.close()
    logger.info(f"[CHAIRMAN] Approved: {item_id} by {reviewer}")
    return True


def deny(item_id: str, reviewer: str, rationale: str = "") -> bool:
    """Deny a pending T2 item."""
    conn = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    cur = conn.execute(
        "SELECT status FROM chairman_queue WHERE id = ?", (item_id,)
    ).fetchone()
    if not cur:
        conn.close()
        return False
    if cur[0] != QueueStatus.PENDING.value:
        conn.close()
        return False

    conn.execute("""
        UPDATE chairman_queue
        SET status=?, reviewed_by=?, reviewed_at=?, rationale=?
        WHERE id=?
    """, (QueueStatus.DENIED.value, reviewer, now, rationale, item_id))
    conn.commit()
    conn.close()
    logger.info(f"[CHAIRMAN] Denied: {item_id} by {reviewer}")
    return True


def get_pending(limit: int = 50) -> list[dict]:
    """Return all PENDING items oldest-first."""
    conn = _get_db()
    rows = conn.execute("""
        SELECT id, agent_did, tool_call, tool_name, intent_summary,
               risk_level, requested_at, expires_at
        FROM chairman_queue
        WHERE status = ?
        ORDER BY requested_at ASC
        LIMIT ?
    """, (QueueStatus.PENDING.value, limit)).fetchall()
    conn.close()
    return [
        {
            "id": r[0], "agent_did": r[1], "tool_call": r[2],
            "tool_name": r[3], "intent_summary": r[4],
            "risk_level": r[5], "requested_at": r[6], "expires_at": r[7]
        }
        for r in rows
    ]


def get_by_id(item_id: str) -> Optional[dict]:
    """Return a single queue item by ID."""
    conn = _get_db()
    row = conn.execute(
        "SELECT * FROM chairman_queue WHERE id = ?", (item_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    cols = [c[0] for c in conn.execute("PRAGMA table_info(chairman_queue)").fetchall()] if False else [
        "id","agent_did","tool_call","tool_name","intent_summary",
        "risk_level","status","requested_at","reviewed_by",
        "reviewed_at","rationale","expires_at"
    ]
    return dict(zip(cols, row))
