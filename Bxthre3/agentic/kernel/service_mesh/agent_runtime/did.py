"""
Agent DID — Self-Sovereign Identity for AgentOS
Bxthre3/agentic/kernel/service_mesh/agent_runtime/did.py

DID format: did:agentos:<sha256(public_key_base58)>
"""
import hashlib
import json
import os
import sqlite3
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, asdict
from datetime import datetime

AGENT_STORE = Path(__file__).parent.parent.parent.parent / "store" / "agent_dids.db"

@dataclass
class AgentIdentity:
    did: str
    name: str
    public_key: str      # base58
    secret_key: str       # base58 (stored encrypted at rest in production)
    created_at: str
    version: str          # AgentOS semantic version
    capabilities: list[str]
    tools: list[str]
    tier_policy: str      # "strict" | "relaxed"
    instance_id: str      # which AgentOS instance this belongs to
    last_seen: str

    def to_manifest(self) -> dict:
        return {
            "did": self.did,
            "name": self.name,
            "version": self.version,
            "capabilities": self.capabilities,
            "tools": self.tools,
            "tier_policy": self.tier_policy,
            "instance_id": self.instance_id,
        }

def _init_db():
    AGENT_STORE.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(AGENT_STORE))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS agent_dids (
            did TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            public_key TEXT NOT NULL,
            secret_key TEXT NOT NULL,
            created_at TEXT NOT NULL,
            version TEXT NOT NULL,
            capabilities TEXT NOT NULL,   -- JSON
            tools TEXT NOT NULL,           -- JSON
            tier_policy TEXT NOT NULL,
            instance_id TEXT NOT NULL,
            last_seen TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS instances (
            instance_id TEXT PRIMARY KEY,
            host TEXT NOT NULL,
            port INTEGER NOT NULL,
            did_root TEXT NOT NULL,  -- DID of the root agent on this instance
            joined_at TEXT NOT NULL,
            last_ping TEXT NOT NULL
        )
    """)
    conn.commit()
    return conn

def _did_from_public_key(public_key_b58: str) -> str:
    h = hashlib.sha256(public_key_b58.encode()).hexdigest()[:32]
    return f"did:agentos:{h}"

def generate_agent_identity(
    name: str,
    version: str,
    capabilities: list[str],
    tools: list[str],
    tier_policy: str = "strict",
    instance_id: Optional[str] = None,
) -> AgentIdentity:
    """Generate a new agent DID. Only called once per agent on first spawn."""
    # Use a simple key generation (in production, use ed25519)
    sk = os.urandom(32)
    pk = os.urandom(32)
    import base58
    sk_b58 = base58.b58encode(sk).decode()
    pk_b58 = base58.b58encode(pk).decode()

    did = _did_from_public_key(pk_b58)
    now = datetime.utcnow().isoformat()

    identity = AgentIdentity(
        did=did,
        name=name,
        public_key=pk_b58,
        secret_key=sk_b58,
        created_at=now,
        version=version,
        capabilities=capabilities,
        tools=tools,
        tier_policy=tier_policy,
        instance_id=instance_id or "local",
        last_seen=now,
    )

    conn = _init_db()
    conn.execute("""
        INSERT OR REPLACE INTO agent_dids
        (did, name, public_key, secret_key, created_at, version,
         capabilities, tools, tier_policy, instance_id, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        identity.did, identity.name, identity.public_key, identity.secret_key,
        identity.created_at, identity.version,
        json.dumps(identity.capabilities), json.dumps(identity.tools),
        identity.tier_policy, identity.instance_id, identity.last_seen,
    ))
    conn.commit()

    return identity

def load_agent_identity(name: str) -> Optional[AgentIdentity]:
    conn = _init_db()
    row = conn.execute(
        "SELECT * FROM agent_dids WHERE name = ?", (name,)
    ).fetchone()
    if not row:
        return None
    cols = [c[0] for c in conn.execute("PRAGMA table_info(agent_dids)")]
    data = dict(zip(cols, row))
    return AgentIdentity(
        did=data["did"],
        name=data["name"],
        public_key=data["public_key"],
        secret_key=data["secret_key"],
        created_at=data["created_at"],
        version=data["version"],
        capabilities=json.loads(data["capabilities"]),
        tools=json.loads(data["tools"]),
        tier_policy=data["tier_policy"],
        instance_id=data["instance_id"],
        last_seen=data["last_seen"],
    )

def load_all_identities() -> list[AgentIdentity]:
    conn = _init_db()
    rows = conn.execute("SELECT * FROM agent_dids").fetchall()
    cols = [c[0] for c in conn.execute("PRAGMA table_info(agent_dids)")]
    return [
        AgentIdentity(**dict(zip(cols, row)))
        for row in rows
    ]
