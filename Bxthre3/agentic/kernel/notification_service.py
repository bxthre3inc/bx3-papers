"""Notification Service -- AgentOS"""
import sqlite3, uuid
from pathlib import Path
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

DB = Path(__file__).parent.parent / "store" / "notifications.db"

class Priority(Enum):
    P0 = "P0"; P1 = "P1"; P2 = "P2"; P3 = "P3"

class NotifChannel(Enum):
    SMS = "sms"; EMAIL = "email"; INBOX = "inbox"

@dataclass
class Notification:
    notif_id: str; priority: Priority; channel: NotifChannel; subject: str
    body: str; agent_did: Optional[str]; related_id: Optional[str]
    sent_at: Optional[str]; delivered: bool; created_at: str

def _db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB)); conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("""CREATE TABLE IF NOT EXISTS notifications (
        notif_id TEXT PRIMARY KEY, priority TEXT NOT NULL, channel TEXT NOT NULL,
        subject TEXT NOT NULL, body TEXT NOT NULL, agent_did TEXT, related_id TEXT,
        sent_at TEXT, delivered INTEGER DEFAULT 0, created_at TEXT)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS subscriptions (
        sub_id TEXT PRIMARY KEY, event_type TEXT, priority_threshold TEXT,
        channel TEXT, agent_did TEXT, active INTEGER DEFAULT 1)""")
    conn.commit(); return conn

def dispatch(
    priority: Priority,
    subject: str,
    body: str,
    channel: NotifChannel = NotifChannel.INBOX,
    agent_did: Optional[str] = None,
    related_id: Optional[str] = None
) -> Notification:
    nid = f"notif-{uuid.uuid4().hex[:16]}"
    now = datetime.now(timezone.utc).isoformat()
    conn = _db()
    conn.execute(
        "INSERT INTO notifications VALUES (?,?,?,?,?,?,?,?,0,?)",
        (nid, priority.value, channel.value, subject, body, agent_did, related_id, None, now)
    )
    conn.commit(); conn.close()
    notif = Notification(nid, priority, channel, subject, body, agent_did, related_id, None, False, now)
    _send(notif)
    return notif

def _do_sms_zo(msg):
    try:
        from common import send_sms_to_user as _sms
        _sms(message=msg)
    except ImportError:
        pass

def _do_email_zo(subject, body):
    try:
        from common import send_email_to_user as _email
        _email(subject=subject, markdown_body=body)
    except ImportError:
        pass

def _send(n: Notification) -> None:
    try:
        if n.channel == NotifChannel.SMS and n.priority in (Priority.P0, Priority.P1):
            msg = f"[{n.priority.value}] {n.subject}"
            if len(msg) > 160: msg = msg[:157]+"..."
            _do_sms_zo(msg)
        elif n.channel == NotifChannel.EMAIL:
            _do_email_zo(n.subject, n.body)
            e(subject=f"[AgentOS] {n.subject}", markdown_body=n.body)
    except Exception:
        pass
    conn = _db()
    conn.execute("UPDATE notifications SET delivered=1,sent_at=? WHERE notif_id=?",
                 (datetime.now(timezone.utc).isoformat(), n.notif_id))
    conn.commit(); conn.close()

def notify_chairman(item_id: str, action: str, summary: str) -> None:
    dispatch(Priority.P1, f"Chairman: {action}", f"Review: {action} | {summary}",
             NotifChannel.SMS, related_id=item_id)

def notify_training(run_id: str, from_s: str, to_s: str, acc: Optional[float] = None) -> None:
    body = f"Run {run_id}: {from_s} -> {to_s}"
    if acc is not None: body += f" (acc: {acc:.1%})"
    p = Priority.P1 if to_s in ("S2_HITL","DONE") else Priority.P3
    dispatch(p, f"Training: {from_s} -> {to_s}", body, NotifChannel.INBOX, related_id=run_id)

def notify_failure(tool: str, agent_did: str, error: str) -> None:
    dispatch(Priority.P2, f"Tool failure: {tool}", f"{agent_did} | {tool} | {error[:200]}",
             NotifChannel.INBOX, agent_did=agent_did)

def get_recent(limit: int = 20):
    conn = _db()
    rows = conn.execute("SELECT * FROM notifications ORDER BY created_at DESC LIMIT ?",(limit,)).fetchall()
    conn.close()
    cols = ["notif_id","priority","channel","subject","body","agent_did","related_id","sent_at","delivered","created_at"]
    return [Notification(**dict(zip(cols,r))) for r in rows]

def get_pending_count() -> int:
    conn = _db()
    c = conn.execute("SELECT COUNT(*) FROM notifications WHERE delivered=0").fetchone()[0]
    conn.close()
    return c
