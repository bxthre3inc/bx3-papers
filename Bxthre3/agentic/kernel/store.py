"""
Agentic Unified Storage Abstraction Layer
Four backends: SQLite (local), Neon Postgres, Supabase, Airtable
Switch via AGENTIC_STORAGE_BACKEND env var

Backends:
  sqlite  → aiosqlite, local file
  neon    → psycopg2, Neon serverless Postgres
  supabase → supabase-py, Supabase hosted Postgres
  airtable → Airtable REST API

Usage:
  store = get_store()
  await store.execute("CREATE TABLE ...")
  rows = await store.query("SELECT * FROM agents")
"""

import os
import json
import sqlite3
import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Any, Optional, List, Dict, Tuple
from dataclasses import dataclass, field

logger = logging.getLogger("agentic.store")

# ─── Config ──────────────────────────────────────────────────────────────────

BACKEND = os.getenv("AGENTIC_STORAGE_BACKEND", "sqlite").lower()

NEON_HOST     = os.getenv("NEON_HOST", "")
NEON_USER     = os.getenv("NEON_USER", "bxthre3")
NEON_PASSWORD = os.getenv("NEON_PASSWORD", "")
NEON_DB       = os.getenv("NEON_DB", "agentic")

SUPABASE_URL  = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY  = os.getenv("SUPABASE_KEY", "")

AIRTABLE_BASE_ID   = os.getenv("AIRTABLE_BASE_ID", "")
AIRTABLE_API_KEY   = os.getenv("AIRTABLE_API_KEY", "")

LOCAL_DB_PATH = os.getenv("AGENTIC_DB_PATH", "/data/agentic/agentic.db")

# ─── Abstract Store ───────────────────────────────────────────────────────────

class BaseStore(ABC):
    @abstractmethod
    async def execute(self, sql: str, params: tuple = ()) -> None: ...
    @abstractmethod
    async def query(self, sql: str, params: tuple = ()) -> List[Dict]: ...
    @abstractmethod
    async def query_one(self, sql: str, params: tuple = ()) -> Optional[Dict]: ...
    @abstractmethod
    async def close(self) -> None: ...

# ─── SQLite Store ─────────────────────────────────────────────────────────────

class SQLiteStore(BaseStore):
    def __init__(self, path: str = LOCAL_DB_PATH):
        self.path = path
        self._lock = asyncio.Lock()
        os.makedirs(os.path.dirname(path), exist_ok=True)

    async def execute(self, sql: str, params: tuple = ()) -> None:
        async with self._lock:
            await asyncio.to_thread(self._sync_execute, sql, params)

    def _sync_execute(self, sql: str, params: tuple) -> None:
        with sqlite3.connect(self.path) as conn:
            conn.execute(sql, params)
            conn.commit()

    async def query(self, sql: str, params: tuple = ()) -> List[Dict]:
        async with self._lock:
            return await asyncio.to_thread(self._sync_query, sql, params)

    def _sync_query(self, sql: str, params: tuple) -> List[Dict]:
        with sqlite3.connect(self.path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(sql, params).fetchall()
            return [dict(r) for r in rows]

    async def query_one(self, sql: str, params: tuple = ()) -> Optional[Dict]:
        rows = await self.query(sql + " LIMIT 1", params)
        return rows[0] if rows else None

    async def close(self) -> None:
        pass  # SQLite connection is stateless per call

# ─── Neon Postgres Store ──────────────────────────────────────────────────────

class NeonStore(BaseStore):
    def __init__(self):
        import psycopg2
        self.pool = psycopg2.pool.ThreadedConnectionPool(
            1, 8,
            host=NEON_HOST, user=NEON_USER,
            password=NEON_PASSWORD, database=NEON_DB,
            connect_timeout=10
        )

    async def execute(self, sql: str, params: tuple = ()) -> None:
        def _run():
            with self.pool.getconn() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                conn.commit()
        await asyncio.to_thread(_run)

    async def query(self, sql: str, params: tuple = ()) -> List[Dict]:
        def _run():
            with self.pool.getconn() as conn:
                conn.autocommit = True
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    cols = [d[0] for d in cur.description]
                    rows = cur.fetchall()
                    return [dict(zip(cols, r)) for r in rows]
        return await asyncio.to_thread(_run)

    async def query_one(self, sql: str, params: tuple = ()) -> Optional[Dict]:
        rows = await self.query(sql + " LIMIT 1", params)
        return rows[0] if rows else None

    async def close(self) -> None:
        self.pool.closeall()

# ─── Supabase Store ────────────────────────────────────────────────────────────

class SupabaseStore(BaseStore):
    def __init__(self):
        from supabase import create_client
        self.sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def execute(self, sql: str, params: tuple = ()) -> None:
        # Supabase uses RPC for mutations; raw SQL via postgrest
        await asyncio.to_thread(self._exec_rpc_raw, sql, params)

    def _exec_rpc_raw(self, sql: str, params: tuple) -> None:
        # Fallback: use HTTP request to Supabase REST
        import urllib.request, urllib.parse
        data = json.dumps({"query": sql, "params": list(params)}).encode()
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
            data=data,
            headers={"apikey": SUPABASE_KEY, "Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            r.read()

    async def query(self, sql: str, params: tuple = ()) -> List[Dict]:
        # Supabase query via REST — simple WHERE clauses
        # Complex queries: use stored procedure
        def _run():
            import urllib.request, urllib.parse
            q = urllib.parse.quote(sql)
            url = f"{SUPABASE_URL}/rest/v1/rpc/query_sql?params=eq.{urllib.parse.quote(json.dumps(params))}"
            req = urllib.request.Request(
                url,
                headers={"apikey": SUPABASE_KEY, "Prefer": "return=representation"},
                method="GET"
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                return json.loads(r.read())
        return await asyncio.to_thread(_run)

    async def query_one(self, sql: str, params: tuple = ()) -> Optional[Dict]:
        rows = await self.query(sql, params)
        return rows[0] if rows else None

    async def close(self) -> None:
        pass

# ─── Airtable Store ───────────────────────────────────────────────────────────

@dataclass
class AirtableTable:
    name: str
    fields: List[str]
    id_field: str = "id"

class AirtableStore(BaseStore):
    """
    Airtable as a document store. Tables map to entity types.
    Simple CRUD — not a relational DB. Use for human-facing records.
    """

    BASE_URL = "https://api.airtable.com/v0"

    def __init__(self, base_id: str = AIRTABLE_BASE_ID, api_key: str = AIRTABLE_API_KEY):
        self.base_id = base_id
        self.api_key = api_key
        self._cache: Dict[str, List[Dict]] = {}
        self._cache_ttl: Dict[str, float] = {}
        self._cache_duration = 30  # seconds

    def _headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}

    def _table_url(self, table: str) -> str:
        return f"{self.BASE_URL}/{self.base_id}/{urllib.parse.quote(table)}"

    async def execute(self, sql: str, params: tuple = ()) -> None:
        # Airtable doesn't support raw SQL. Map to CRUD operations.
        # Expect caller passes parsed intent.
        pass

    async def query(self, sql: str, params: tuple = ()) -> List[Dict]:
        # Airtable REST pagination — max 100 records/page
        table = params[0] if params else "Agents"
        offset = None
        results = []
        while True:
            url = self._table_url(table)
            if offset:
                url += f"?offset={offset}"
            req = urllib.request.Request(url, headers=self._headers())
            with urllib.request.urlopen(req, timeout=15) as r:
                data = json.loads(r.read())
                results.extend(data.get("records", []))
                offset = data.get("offset")
            if not offset:
                break
        return [{"id": rec["id"], **rec["fields"]} for rec in results]

    async def query_one(self, sql: str, params: tuple = ()) -> Optional[Dict]:
        rows = await self.query(sql, params)
        return rows[0] if rows else None

    async def close(self) -> None:
        pass

# ─── Factory ──────────────────────────────────────────────────────────────────

def get_store() -> BaseStore:
    if BACKEND == "neon":
        logger.info("Using Neon Postgres backend")
        return NeonStore()
    elif BACKEND == "supabase":
        logger.info("Using Supabase backend")
        return SupabaseStore()
    elif BACKEND == "airtable":
        logger.info("Using Airtable backend")
        return AirtableStore()
    else:
        logger.info("Using SQLite backend")
        return SQLiteStore(LOCAL_DB_PATH)

# ─── Schema Init ──────────────────────────────────────────────────────────────

SCHEMA_SQLITE = """
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL,
    department TEXT NOT NULL, status TEXT DEFAULT 'idle',
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, type TEXT NOT NULL, priority TEXT DEFAULT 'P2',
    status TEXT DEFAULT 'PENDING', agent_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY, type TEXT NOT NULL, payload TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY, name TEXT NOT NULL,
    status TEXT DEFAULT 'DISCONNECTED', updated_at TEXT DEFAULT (datetime('now'))
);
"""

SCHEMA_PG = """
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL,
    department TEXT NOT NULL, status TEXT DEFAULT 'idle',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, type TEXT NOT NULL, priority TEXT DEFAULT 'P2',
    status TEXT DEFAULT 'PENDING', agent_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY, type TEXT NOT NULL, payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY, name TEXT NOT NULL,
    status TEXT DEFAULT 'DISCONNECTED', updated_at TIMESTAMPTZ DEFAULT NOW()
);
"""

async def init_schema(store: BaseStore) -> None:
    if isinstance(store, SQLiteStore):
        for stmt in SCHEMA_SQLITE.strip().split(";"):
            stmt = stmt.strip()
            if stmt:
                await store.execute(stmt)
    else:
        for stmt in SCHEMA_PG.strip().split(";"):
            stmt = stmt.strip()
            if stmt:
                await store.execute(stmt)

# ─── Module Entry Point ────────────────────────────────────────────────────────

_store: Optional[BaseStore] = None

async def get_default_store() -> BaseStore:
    global _store
    if _store is None:
        _store = get_store()
        await init_schema(_store)
    return _store

def sync_init_schema():
    """Synchronous schema init for store modules that don't use async."""
    conn = sqlite3.connect(LOCAL_DB_PATH)
    conn.executescript(SCHEMA_SQLITE)
    conn.close()