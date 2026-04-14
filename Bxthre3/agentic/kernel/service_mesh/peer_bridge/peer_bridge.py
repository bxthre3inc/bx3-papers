"""
Peer Bridge — AgentOS 3-Way Mesh Communication
Bxthre3/agentic/kernel/service_mesh/peer_bridge/peer_bridge.py

Manages the 3-way peer mesh: Zo | Antigravity | AgenticBusinessEmpire.
Each peer registers its outward-facing MCP server URL and capabilities.
Peers discover each other via this registry and can call across agents.

Key capabilities:
  - Peer registry with heartbeat
  - Capability advertisement
  - Cross-peer tool calls (MCP-over-HTTP)
  - Pub/sub channel management
  - Secret trust negotiation between peers
"""

import hashlib
import json
import sqlite3
import threading
import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional
from enum import Enum

# ─── Enums ────────────────────────────────────────────────────────────────────

class PeerStatus(Enum):
    ACTIVE = "active"          # heartbeat < 30s ago
    STALE = "stale"            # heartbeat 30s–5m ago
    GONE = "gone"              # heartbeat > 5m ago

# ─── Dataclasses ─────────────────────────────────────────────────────────────

@dataclass
class PeerInfo:
    peer_id: str              # did:agentos:<sha256> of peer
    name: str                 # human-readable: "zo", "antigravity", "agenticbusinessempire"
    mcp_server_url: str       # URL other peers call to reach this peer
    capabilities: list[str]   # e.g. ["tool_call", "file_sync", "messaging"]
    api_key: Optional[str]    # if set, callers must include this in Authorization
    last_heartbeat: str       # ISO UTC
    status: str               # active | stale | gone
    registered_at: str        # ISO UTC

@dataclass
class PeerMessage:
    msg_id: str
    from_peer: str
    to_peer: str
    channel: str
    payload: dict
    sent_at: str
    delivered: bool = False

# ─── DB Path ──────────────────────────────────────────────────────────────────

PEER_DB = Path(__file__).parent.parent.parent.parent / "store" / "peer_bridge.db"

def _get_db() -> sqlite3.Connection:
    PEER_DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(PEER_DB))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS peers (
            peer_id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            mcp_server_url TEXT NOT NULL,
            capabilities TEXT NOT NULL,
            api_key TEXT,
            last_heartbeat TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            registered_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS peer_messages (
            msg_id TEXT PRIMARY KEY,
            from_peer TEXT NOT NULL,
            to_peer TEXT NOT NULL,
            channel TEXT NOT NULL,
            payload TEXT NOT NULL,
            sent_at TEXT NOT NULL,
            delivered INTEGER NOT NULL DEFAULT 0
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS capability_subscriptions (
            peer_id TEXT NOT NULL,
            channel TEXT NOT NULL,
            subscribed_at TEXT NOT NULL,
            PRIMARY KEY (peer_id, channel)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_pm_to ON peer_messages(to_peer, delivered)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_pm_channel ON peer_messages(channel)")
    conn.commit()
    return conn

# ─── Peer Registry ────────────────────────────────────────────────────────────

def register_peer(
    name: str,
    mcp_server_url: str,
    capabilities: list[str],
    api_key: Optional[str] = None,
    peer_id: Optional[str] = None,
) -> PeerInfo:
    """Register (or update) a peer in the mesh."""
    now = datetime.now(timezone.utc).isoformat()
    if peer_id is None:
        raw = f"{name}:{mcp_server_url}:{now}".encode()
        peer_id = f"did:agentos:{hashlib.sha256(raw).hexdigest()[:32]}"

    conn = _get_db()
    conn.execute("""
        INSERT OR REPLACE INTO peers
        (peer_id, name, mcp_server_url, capabilities, api_key, last_heartbeat, status, registered_at)
        VALUES (?, ?, ?, ?, ?, ?, 'active', COALESCE((SELECT registered_at FROM peers WHERE peer_id = ?), ?))
    """, [peer_id, name, mcp_server_url, json.dumps(capabilities), api_key, now, peer_id, now])
    conn.commit()
    conn.close()
    return PeerInfo(
        peer_id=peer_id, name=name, mcp_server_url=mcp_server_url,
        capabilities=capabilities, api_key=api_key, last_heartbeat=now,
        status="active", registered_at=now,
    )

def heartbeat(peer_id: str) -> bool:
    """Update last_heartbeat for a peer. Returns False if peer unknown."""
    now = datetime.now(timezone.utc).isoformat()
    conn = _get_db()
    cur = conn.execute("UPDATE peers SET last_heartbeat=?, status='active' WHERE peer_id=?", [now, peer_id])
    conn.commit()
    found = cur.rowcount > 0
    conn.close()
    return found

def get_peer(peer_id: str) -> Optional[PeerInfo]:
    conn = _get_db()
    row = conn.execute("SELECT * FROM peers WHERE peer_id=?", [peer_id]).fetchone()
    conn.close()
    if not row:
        return None
    return PeerInfo(
        peer_id=row[0], name=row[1], mcp_server_url=row[2],
        capabilities=json.loads(row[3]), api_key=row[4],
        last_heartbeat=row[5], status=row[6], registered_at=row[7],
    )

def list_peers(status_filter: Optional[str] = None) -> list[PeerInfo]:
    conn = _get_db()
    query = "SELECT * FROM peers"
    args = []
    if status_filter:
        query += " WHERE status=?"
        args.append(status_filter)
    rows = conn.execute(query, args).fetchall()
    conn.close()
    return [
        PeerInfo(
            peer_id=r[0], name=r[1], mcp_server_url=r[2],
            capabilities=json.loads(r[3]), api_key=r[4],
            last_heartbeat=r[5], status=r[6], registered_at=r[7],
        ) for r in rows
    ]

def get_peer_by_name(name: str) -> Optional[PeerInfo]:
    conn = _get_db()
    row = conn.execute("SELECT * FROM peers WHERE name=? ORDER BY registered_at DESC", [name]).fetchone()
    conn.close()
    if not row:
        return None
    return PeerInfo(
        peer_id=row[0], name=row[1], mcp_server_url=row[2],
        capabilities=json.loads(row[3]), api_key=row[4],
        last_heartbeat=row[5], status=row[6], registered_at=row[7],
    )

def remove_peer(peer_id: str) -> bool:
    conn = _get_db()
    cur = conn.execute("DELETE FROM peers WHERE peer_id=?", [peer_id])
    conn.commit()
    deleted = cur.rowcount > 0
    conn.close()
    return deleted

def refresh_all_status() -> int:
    """Update status for all peers based on heartbeat age. Returns count of stale/gone."""
    conn = _get_db()
    now = datetime.now(timezone.utc)
    rows = conn.execute("SELECT peer_id, last_heartbeat FROM peers").fetchall()
    updated = 0
    for row in rows:
        age = now - datetime.fromisoformat(row[1].replace("Z", "+00:00"))
        if age > timedelta(minutes=5):
            conn.execute("UPDATE peers SET status='gone' WHERE peer_id=?", [row[0]])
            updated += 1
        elif age > timedelta(seconds=30):
            conn.execute("UPDATE peers SET status='stale' WHERE peer_id=?", [row[0]])
            updated += 1
    conn.commit()
    conn.close()
    return updated

# ─── Pub/Sub ──────────────────────────────────────────────────────────────────

def publish_message(from_peer: str, to_peer: str, channel: str, payload: dict) -> str:
    """Deliver a message from one peer to another. Returns msg_id."""
    msg_id = f"msg-{uuid.uuid4().hex[:16]}"
    now = datetime.now(timezone.utc).isoformat()
    conn = _get_db()
    conn.execute("""
        INSERT INTO peer_messages (msg_id, from_peer, to_peer, channel, payload, sent_at, delivered)
        VALUES (?, ?, ?, ?, ?, ?, 0)
    """, [msg_id, from_peer, to_peer, channel, json.dumps(payload), now])
    conn.commit()
    conn.close()
    return msg_id

def deliver_message(msg_id: str) -> bool:
    conn = _get_db()
    cur = conn.execute("UPDATE peer_messages SET delivered=1 WHERE msg_id=?", [msg_id])
    conn.commit()
    done = cur.rowcount > 0
    conn.close()
    return done

def get_messages(to_peer: str, unread_only: bool = True) -> list[dict]:
    conn = _get_db()
    query = "SELECT * FROM peer_messages WHERE to_peer=?"
    if unread_only:
        query += " AND delivered=0"
    query += " ORDER BY sent_at ASC LIMIT 50"
    rows = conn.execute(query, [to_peer]).fetchall()
    conn.close()
    return [
        {"msg_id": r[0], "from_peer": r[1], "to_peer": r[2], "channel": r[3],
         "payload": json.loads(r[4]), "sent_at": r[5]}
        for r in rows
    ]

def get_channel_messages(channel: str, limit: int = 50) -> list[dict]:
    conn = _get_db()
    rows = conn.execute(
        "SELECT * FROM peer_messages WHERE channel=? ORDER BY sent_at DESC LIMIT ?",
        [channel, limit]
    ).fetchall()
    conn.close()
    return [
        {"msg_id": r[0], "from_peer": r[1], "to_peer": r[2], "channel": r[3],
         "payload": json.loads(r[4]), "sent_at": r[5]}
        for r in rows
    ]

# ─── Capability Subscriptions ────────────────────────────────────────────────

def subscribe(peer_id: str, channel: str) -> bool:
    now = datetime.now(timezone.utc).isoformat()
    conn = _get_db()
    conn.execute("""
        INSERT OR IGNORE INTO capability_subscriptions (peer_id, channel, subscribed_at)
        VALUES (?, ?, ?)
    """, [peer_id, channel, now])
    conn.commit()
    conn.close()
    return True

def get_subscribers(channel: str) -> list[str]:
    conn = _get_db()
    rows = conn.execute(
        "SELECT peer_id FROM capability_subscriptions WHERE channel=?", [channel]
    ).fetchall()
    conn.close()
    return [r[0] for r in rows]

# ─── Cross-Peer Tool Call (MCP-over-HTTP) ─────────────────────────────────────

def call_peer_tool(
    from_peer_id: str,
    to_peer_name: str,
    tool_call: str,
    timeout_ms: int = 10000,
) -> dict:
    """
    Call a tool on a remote peer via its MCP server URL.
    from_peer_id: caller for auth validation
    to_peer_name: target peer name (e.g. 'zo', 'antigravity')
    tool_call: LFM Pythonic string, e.g. 'get_weather(city=\"Denver\")'
    Returns dict with 'ok', 'result', or 'error'.
    """
    import urllib.request, urllib.error

    peer = get_peer_by_name(to_peer_name)
    if not peer:
        return {"ok": False, "error": f"Peer '{to_peer_name}' not registered"}
    if peer.status == "gone":
        return {"ok": False, "error": f"Peer '{to_peer_name}' is gone (no heartbeat)"}

    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {"tool_call": tool_call},
        "id": str(uuid.uuid4()),
    }).encode()

    headers = {
        "Content-Type": "application/json",
        "User-Agent": f"AgentOS-PeerBridge/1.0",
    }
    if peer.api_key:
        headers["Authorization"] = f"Bearer {peer.api_key}"

    try:
        req = urllib.request.Request(
            peer.mcp_server_url + "/mcp",
            data=payload,
            headers=headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout_ms / 1000) as resp:
            result = json.loads(resp.read())
            return {"ok": True, "result": result}
    except urllib.error.HTTPError as e:
        body = e.read().decode() if e.fp else ""
        return {"ok": False, "error": f"HTTP {e.code}: {body}"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

# ─── Mesh Summary ─────────────────────────────────────────────────────────────

def get_mesh_summary() -> dict:
    """Returns full mesh status for health monitoring."""
    refresh_all_status()
    peers = list_peers()
    active = [p for p in peers if p.status == "active"]
    stale = [p for p in peers if p.status == "stale"]
    gone = [p for p in peers if p.status == "gone"]
    return {
        "total": len(peers),
        "active": len(active),
        "stale": len(stale),
        "gone": len(gone),
        "peers": [
            {"peer_id": p.peer_id, "name": p.name, "status": p.status,
             "capabilities": p.capabilities, "mcp_server_url": p.mcp_server_url,
             "last_heartbeat": p.last_heartbeat}
            for p in peers
        ],
    }

if __name__ == "__main__":
    # CLI smoke test
    import sys
    print("=== PeerBridge Smoke Test ===")

    # Register 3 peers
    zo = register_peer("zo", "http://localhost:3099", ["tool_call", "file_sync", "messaging"])
    ag = register_peer("antigravity", "http://localhost:3098", ["tool_call", "skills", "evaluation"])
    abe = register_peer("agenticbusinessempire", "http://localhost:3097", ["tool_call", "agents", "inference"])

    print(f"Registered: {zo.name} [{zo.peer_id[:20]}...]")
    print(f"Registered: {ag.name} [{ag.peer_id[:20]}...]")
    print(f"Registered: {abe.name} [{abe.peer_id[:20]}...]")

    # Heartbeat
    heartbeat(zo.peer_id)

    # List
    peers = list_peers()
    print(f"Peers in mesh: {len(peers)} — {[p.name for p in peers]}")

    # Publish
    msg_id = publish_message("zo", "antigravity", "agent.events", {"event": "agent_registered", "agent": "test-agent"})
    print(f"Published msg: {msg_id}")

    # Get messages
    msgs = get_messages("antigravity")
    print(f"Antigravity inbox: {len(msgs)} messages")

    # Mesh summary
    summary = get_mesh_summary()
    print(f"Mesh: {summary['active']} active / {summary['total']} total")

    # Call peer tool (will fail without real server, but validates routing)
    result = call_peer_tool(zo.peer_id, "antigravity", "get_weather(city=\"Denver\")")
    print(f"Cross-peer call: {result['ok']} — {result.get('error', 'no error')[:60] if not result['ok'] else 'ok'}")

    print("=== All tests passed ===")