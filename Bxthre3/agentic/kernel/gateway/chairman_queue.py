"""
Chairman Queue — HITL-Gated Tool Call Store
Bxthre3/agentic/kernel/gateway/chairman_queue.py

Stores all T2 (HITL-Gated) tool call requests pending approval.
Only agentos-core or agents with chairman_write permission can write.
Human (brodiblanco) approves via /api/chairman/decide.
"""
import sqlite3
import uuid
import time
import logging
from pathlib import Path
from enum import Enum
from typing import Optional
from dataclasses import dataclass, asdict
from datetime import datetime, timezone

logger = logging.getLogger("agentic.chairman")

DB_PATH = Path(__file__).parent.parent.parent / "store" / "chairman_queue.db"


class Decision(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    EXPIRED = "expired"


@dataclass
class ChairmanItem:
    item_id: str
    agent_id: str
    agent_did: str
    tool_name: str
    tier: str  # T2
    parameters: str  # JSON
    rationale: Optional[str]
    requested_at: str
    decision: str
    decided_by: Optional[str]
    decided_at: Optional[str]
    notes: Optional[str]
    ttl_seconds: int
    context_hash: str  # sha256 of full context for audit
    parent_job_id: Optional[str]
    status: str  # open / closed

    def to_dict(self):
        d = asdict(self)
        d["decision"] = self.decision
        return d


def _get_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chairman_queue (
            item_id        TEXT PRIMARY KEY,
            agent_id       TEXT NOT NULL,
            agent_did      TEXT NOT NULL,
            tool_name      TEXT NOT NULL,
            tier           TEXT NOT NULL DEFAULT 'T2',
            parameters     TEXT NOT NULL,
            rationale      TEXT,
            requested_at   TEXT NOT NULL,
            decision       TEXT NOT NULL DEFAULT 'pending',
            decided_by     TEXT,
            decided_at     TEXT,
            notes          TEXT,
            ttl_seconds    INTEGER NOT NULL DEFAULT 7200,
            context_hash   TEXT NOT NULL,
            parent_job_id  TEXT,
            status         TEXT NOT NULL DEFAULT 'open'
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chairman_decision_log (
            log_id         TEXT PRIMARY KEY,
            item_id        TEXT NOT NULL,
            decided_by     TEXT NOT NULL,
            decision       TEXT NOT NULL,
            rationale      TEXT,
            notes          TEXT,
            created_at     TEXT NOT NULL,
            FOREIGN KEY (item_id) REFERENCES chairman_queue(item_id)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_cq_status ON chairman_queue(status)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_cq_agent ON chairman_queue(agent_id)")
    conn.commit()
    return conn


# ─── Write ────────────────────────────────────────────────────────────────────

def enqueue(
    agent_id: str,
    agent_did: str,
    tool_name: str,
    parameters: dict,
    rationale: Optional[str] = None,
    ttl_seconds: int = 7200,
    context_hash: str = "",
    parent_job_id: Optional[str] = None,
) -> ChairmanItem:
    """Add a T2 tool call to the approval queue."""
    conn = _get_db()
    item_id = f"chm-{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "item_id": item_id,
        "agent_id": agent_id,
        "agent_did": agent_did,
        "tool_name": tool_name,
        "tier": "T2",
        "parameters": __import__("json").dumps(parameters),
        "rationale": rationale or "",
        "requested_at": now,
        "decision": Decision.PENDING.value,
        "decided_by": None,
        "decided_at": None,
        "notes": None,
        "ttl_seconds": ttl_seconds,
        "context_hash": context_hash,
        "parent_job_id": parent_job_id or "",
        "status": "open",
    }
    conn.execute("""
        INSERT INTO chairman_queue
        (item_id, agent_id, agent_did, tool_name, tier, parameters, rationale,
         requested_at, decision, ttl_seconds, context_hash, parent_job_id, status)
        VALUES
        (:item_id, :agent_id, :agent_did, :tool_name, :tier, :parameters, :rationale,
         :requested_at, :decision, :ttl_seconds, :context_hash, :parent_job_id, :status)
    """, row)
    conn.commit()
    conn.close()
    logger.info(f"[Chairman] Enqueued {item_id}: {tool_name} from {agent_id}")
    return ChairmanItem(**{**row, "decision": Decision.PENDING.value})


def decide(
    item_id: str,
    decision: str,  # approved | denied
    decided_by: str = "brodiblanco",
    rationale: Optional[str] = None,
    notes: Optional[str] = None,
) -> ChairmanItem:
    """
    Approve or deny a T2 item.
   decision: 'approved' or 'denied'
    decided_by: 'brodiblanco' or 'chairman_agent:<agent_id>'
    """
    conn = _get_db()
    now = datetime.now(timezone.utc).isoformat()
    conn.execute("""
        UPDATE chairman_queue
        SET decision=:decision, decided_by=:decided_by, decided_at=:decided_at, notes=:notes, status='closed'
        WHERE item_id=:item_id
    """, {"decision": decision, "decided_by": decided_by, "decided_at": now, "notes": notes or "", "item_id": item_id})
    conn.execute("""
        INSERT INTO chairman_decision_log (log_id, item_id, decided_by, decision, rationale, notes, created_at)
        VALUES (:log_id, :item_id, :decided_by, :decision, :rationale, :notes, :created_at)
    """, {
        "log_id": f"log-{uuid.uuid4().hex[:12]}",
        "item_id": item_id,
        "decided_by": decided_by,
        "decision": decision,
        "rationale": rationale or "",
        "notes": notes or "",
        "created_at": now,
    })
    conn.commit()
    item = get(item_id)
    conn.close()
    logger.info(f"[Chairman] {decision.upper()} {item_id} by {decided_by}")
    return item


def expire_stale() -> int:
    """Mark pending items past their TTL as expired. Returns count."""
    conn = _get_db()
    now_ts = time.time()
    cur = conn.execute("""
        SELECT item_id, requested_at, ttl_seconds FROM chairman_queue
        WHERE decision='pending' AND status='open'
    """)
    expired = 0
    for row in cur.fetchall():
        item_id, requested_at, ttl = row
        try:
            requested_ts = datetime.fromisoformat(requested_at).timestamp()
            if now_ts - requested_ts > ttl:
                conn.execute("""
                    UPDATE chairman_queue SET decision='expired', status='closed'
                    WHERE item_id=? AND decision='pending'
                """, (item_id,))
                expired += 1
        except Exception:
            pass
    conn.commit()
    conn.close()
    if expired:
        logger.info(f"[Chairman] Expired {expired} stale items")
    return expired


# ─── Read ─────────────────────────────────────────────────────────────────────

def get(item_id: str) -> Optional[ChairmanItem]:
    conn = _get_db()
    row = conn.execute("SELECT * FROM chairman_queue WHERE item_id=?", (item_id,)).fetchone()
    conn.close()
    if not row:
        return None
    cols = [c[0] for c in conn.execute("SELECT * FROM chairman_queue LIMIT 0").description]
    return ChairmanItem(**dict(zip(cols, row)))


def list_pending(limit: int = 50) -> list[ChairmanItem]:
    conn = _get_db()
    rows = conn.execute("""
        SELECT * FROM chairman_queue
        WHERE status='open' AND decision='pending'
        ORDER BY requested_at ASC LIMIT ?
    """, (limit,)).fetchall()
    conn.close()
    if not rows:
        return []
    cols = [c[0] for c in conn.execute("SELECT * FROM chairman_queue LIMIT 0").description]
    return [ChairmanItem(**dict(zip(cols, row))) for row in rows]


def list_all(limit: int = 100, status: Optional[str] = None) -> list[ChairmanItem]:
    conn = _get_db()
    if status:
        rows = conn.execute("""
            SELECT * FROM chairman_queue
            WHERE status=? ORDER BY requested_at DESC LIMIT ?
        """, (status, limit)).fetchall()
    else:
        rows = conn.execute("""
            SELECT * FROM chairman_queue ORDER BY requested_at DESC LIMIT ?
        """, (limit,)).fetchall()
    conn.close()
    if not rows:
        return []
    cols = [c[0] for c in conn.execute("SELECT * FROM chairman_queue LIMIT 0").description]
    return [ChairmanItem(**dict(zip(cols, row))) for row in rows]


def get_decision_log(item_id: str) -> list[dict]:
    conn = _get_db()
    rows = conn.execute("""
        SELECT * FROM chairman_decision_log WHERE item_id=? ORDER BY created_at ASC
    """, (item_id,)).fetchall()
    conn.close()
    if not rows:
        return []
    cols = [c[0] for c in conn.execute("SELECT * FROM chairman_decision_log LIMIT 0").description]
    return [dict(zip(cols, row)) for row in rows]