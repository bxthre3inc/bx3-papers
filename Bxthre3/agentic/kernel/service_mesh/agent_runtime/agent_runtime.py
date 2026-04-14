"""
Agent Runtime — Local LFM 2.5 Inference Node
Bxthre3/agentic/kernel/service_mesh/agent_runtime/agent_runtime.py

Hosts local LFM 2.5 models for agent inference.
Multi-model: LFM2.5-350M (fast/T0), LFM2.5-1.2B (balanced), LFM2.5-1.2B-Thinking (reasoning)

Request queue: FIFO with priority override for T2-HITL bypass.
Streaming: yield tokens as they arrive from model.
"""
import os
import time
import uuid
import sqlite3
import asyncio
import threading
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional, Literal, AsyncIterator

# ─── Constants ────────────────────────────────────────────────────────────────

RUNTIME_DB = Path(__file__).parent.parent.parent.parent / "store" / "agent_runtime.db"
DEFAULT_MODEL = os.environ.get("AGENTIC_MODEL", "vercel:minimax/minimax-m2.7")
MAX_TOKENS_DEFAULT = 2048

# ─── Enums ────────────────────────────────────────────────────────────────────

class RuntimeModel(Enum):
    LFM_350M  = "lfm2.5-350m"
    LFM_1_2B  = "lfm2.5-1.2b"
    LFM_THINK = "lfm2.5-1.2b-thinking"
    ZO_CLOUD  = "zo-cloud"

class TierAssignment(Enum):
    T0_AUTONOMOUS = "T0"
    T1_INTENTIONAL = "T1"
    T2_HITL = "T2"

class InferenceStatus(Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

# ─── Data Models ───────────────────────────────────────────────────────────────

@dataclass
class InferenceRequest:
    request_id: str
    agent_did: str
    prompt: str
    model: RuntimeModel
    max_tokens: int
    temperature: float
    system_prompt: Optional[str]
    tools: list[str]
    tier: TierAssignment
    streaming: bool
    created_at: str

@dataclass
class InferenceResponse:
    response_id: str
    request_id: str
    status: InferenceStatus
    content: str
    model: str
    tokens_used: Optional[int]
    duration_ms: int
    tool_calls: list[str]
    error: Optional[str]
    created_at: str

# ─── Database ─────────────────────────────────────────────────────────────────

def _get_db() -> sqlite3.Connection:
    RUNTIME_DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(RUNTIME_DB))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS inference_requests (
            request_id   TEXT PRIMARY KEY,
            agent_did    TEXT NOT NULL,
            prompt_hash  TEXT NOT NULL,
            prompt       TEXT NOT NULL,
            model        TEXT NOT NULL,
            max_tokens   INTEGER,
            temperature  REAL,
            system_prompt TEXT,
            tools        TEXT NOT NULL,
            tier         TEXT NOT NULL,
            streaming    INTEGER,
            status       TEXT NOT NULL,
            created_at   TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS inference_responses (
            response_id  TEXT PRIMARY KEY,
            request_id   TEXT NOT NULL,
            status       TEXT NOT NULL,
            content      TEXT,
            model        TEXT NOT NULL,
            tokens_used  INTEGER,
            duration_ms  INTEGER,
            tool_calls   TEXT NOT NULL,
            error        TEXT,
            created_at   TEXT NOT NULL
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_req ON inference_requests(agent_did, status)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_resp ON inference_responses(request_id)")
    conn.commit()
    return conn

# ─── Singleton Runtime ─────────────────────────────────────────────────────────

class AgentRuntime:
    def __init__(self):
        self.model = RuntimeModel.ZO_CLOUD
        self.status = "idle"
        self.default_tier = TierAssignment.T0_AUTONOMOUS
        self.max_tokens = MAX_TOKENS_DEFAULT
        self._lock = threading.Lock()

    def _route_tier(self, tier: TierAssignment) -> RuntimeModel:
        if tier == TierAssignment.T0_AUTONOMOUS:
            return RuntimeModel.LFM_350M
        elif tier == TierAssignment.T1_INTENTIONAL:
            return RuntimeModel.LFM_1_2B
        else:
            return RuntimeModel.LFM_THINK

    def _execute_local(self, req: InferenceRequest) -> InferenceResponse:
        """Execute inference. In production this calls LFM 2.5 ONNX or llama.cpp server."""
        # Simulate inference
        start = time.monotonic()
        time.sleep(0.05)
        duration_ms = int((time.monotonic() - start) * 1000)

        # Parse any tool calls from prompt
        tool_calls = []
        if "<|tool_call_start|>" in req.prompt:
            import re
            calls = re.findall(r"<\|tool_call_start\|>\[([^\]]+)\]<\|tool_call_end\|>", req.prompt)
            tool_calls = calls

        return InferenceResponse(
            response_id=str(uuid.uuid4()),
            request_id=req.request_id,
            status=InferenceStatus.COMPLETED,
            content=f"[{self.model.value}] inference simulation for {req.agent_did}",
            model=self.model.value,
            tokens_used=len(req.prompt.split()) * 2,
            duration_ms=duration_ms,
            tool_calls=tool_calls,
            error=None,
            created_at=datetime.now(timezone.utc).isoformat()
        )

    def infer_sync(self, req: InferenceRequest) -> InferenceResponse:
        with self._lock:
            self.status = "running"
            try:
                resp = self._execute_local(req)
                return resp
            finally:
                self.status = "idle"

    async def infer_async(self, req: InferenceRequest) -> InferenceResponse:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.infer_sync, req)

    async def stream_infer(self, req: InferenceRequest) -> AsyncIterator[str]:
        """Stream tokens as they arrive."""
        # Simulate streaming
        resp = await self.infer_async(req)
        words = resp.content.split()
        for w in words:
            yield w + " "
            await asyncio.sleep(0.01)

    def get_queue_depth(self) -> dict:
        conn = _get_db()
        rows = conn.execute("""
            SELECT tier, status, COUNT(*) FROM inference_requests GROUP BY tier, status
        """).fetchall()
        conn.close()
        return {f"{r[0]}_{r[1]}": r[2] for r in rows}

# ─── Global Instance ───────────────────────────────────────────────────────────

_runtime: Optional[AgentRuntime] = None

def get_runtime() -> AgentRuntime:
    global _runtime
    if _runtime is None:
        _runtime = AgentRuntime()
    return _runtime

# ─── Convenience Functions ────────────────────────────────────────────────────

def infer_sync(
    agent_did: str,
    prompt: str,
    tier: TierAssignment = TierAssignment.T0_AUTONOMOUS,
    model: Optional[RuntimeModel] = None,
    tools: Optional[list[str]] = None,
    system_prompt: Optional[str] = None,
) -> InferenceResponse:
    rt = get_runtime()
    req = InferenceRequest(
        request_id=str(uuid.uuid4()),
        agent_did=agent_did,
        prompt=prompt,
        model=model or rt._route_tier(tier),
        max_tokens=rt.max_tokens,
        temperature=0.7,
        system_prompt=system_prompt,
        tools=tools or [],
        tier=tier,
        streaming=False,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    return rt.infer_sync(req)

async def infer_async(
    agent_did: str,
    prompt: str,
    tier: TierAssignment = TierAssignment.T0_AUTONOMOUS,
    model: Optional[RuntimeModel] = None,
    tools: Optional[list[str]] = None,
    system_prompt: Optional[str] = None,
) -> InferenceResponse:
    rt = get_runtime()
    req = InferenceRequest(
        request_id=str(uuid.uuid4()),
        agent_did=agent_did,
        prompt=prompt,
        model=model or rt._route_tier(tier),
        max_tokens=rt.max_tokens,
        temperature=0.7,
        system_prompt=system_prompt,
        tools=tools or [],
        tier=tier,
        streaming=False,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    return await rt.infer_async(req)

async def stream_infer(
    agent_did: str,
    prompt: str,
    tier: TierAssignment = TierAssignment.T0_AUTONOMOUS,
    tools: Optional[list[str]] = None,
) -> AsyncIterator[str]:
    rt = get_runtime()
    req = InferenceRequest(
        request_id=str(uuid.uuid4()),
        agent_did=agent_did,
        prompt=prompt,
        model=rt._route_tier(tier),
        max_tokens=rt.max_tokens,
        temperature=0.7,
        system_prompt=None,
        tools=tools or [],
        tier=tier,
        streaming=True,
        created_at=datetime.now(timezone.utc).isoformat()
    )
    async for token in rt.stream_infer(req):
        yield token

def check_health() -> dict:
    rt = get_runtime()
    conn_ok = False
    try:
        conn = _get_db()
        conn.execute("SELECT 1").fetchone()
        conn.close()
        conn_ok = True
    except Exception:
        pass

    import psutil
    mem = psutil.virtual_memory()

    return {
        "status": rt.status,
        "model": rt.model.value,
        "session": {"ok": True},
        "memory": {"ok": mem.percent < 90, "percent": mem.percent},
        "db": {"ok": conn_ok},
    }