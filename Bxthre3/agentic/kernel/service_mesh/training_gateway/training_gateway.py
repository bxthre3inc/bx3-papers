"""
Training Gateway — AgentOS Fine-Tuning Pipeline
Bxthre3/agentic/kernel/service_mesh/training_gateway/training_gateway.py

Stage 0 (Collect) -> Stage 1 (Eval) -> Stage 2 (HITL) -> Stage 3 (Train) -> Done
"""
import sqlite3, uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Optional

DB = Path(__file__).parent.parent.parent.parent / "store" / "training_gateway.db"

class Stage(Enum):
    S0_COLLECT = "S0_COLLECT"; S1_EVAL = "S1_EVAL"; S2_HITL = "S2_HITL"
    S3_TRAIN = "S3_TRAIN"; DONE = "DONE"

class RunStatus(Enum):
    RUNNING = "RUNNING"; BLOCKED = "BLOCKED"; APPROVED = "APPROVED"; COMPLETED = "COMPLETED"

class SampleType(Enum):
    TOOL_CALL = "TOOL_CALL"; REASONING = "REASONING"; SYNTHETIC = "SYNTHETIC"

@dataclass
class TrainingRun:
    run_id: str; agent_did: str; base_model: str; sample_source: str
    stage: Stage; status: RunStatus; samples: int; accuracy: float
    hitl_approver: Optional[str]; created_at: str

def _db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB))
    conn.execute("""CREATE TABLE IF NOT EXISTS runs (
        run_id TEXT PRIMARY KEY, agent_did TEXT NOT NULL, base_model TEXT,
        sample_source TEXT, stage TEXT DEFAULT 'S0_COLLECT', status TEXT DEFAULT 'RUNNING',
        samples INTEGER DEFAULT 0, accuracy REAL DEFAULT 0.0,
        hitl_approver TEXT, created_at TEXT)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS samples (
        sample_id TEXT PRIMARY KEY, run_id TEXT, conversation_id TEXT, role TEXT,
        content TEXT, lfm_tool_call TEXT, gold_reasoning TEXT, sample_type TEXT,
        approved INTEGER DEFAULT 1, grade_score REAL DEFAULT 1.0, created_at TEXT)""")
    conn.commit()
    return conn

def create_run(agent_did: str, base_model: str = "LFM2.5-350M", sample_source: str = "agentic") -> str:
    rid = f"run-{uuid.uuid4().hex[:16]}"
    conn = _db()
    conn.execute("INSERT INTO runs VALUES (?,?,?,?,'S0_COLLECT','RUNNING',0,0.0,?,?)",
        (rid, agent_did, base_model, sample_source, None,
         datetime.now(timezone.utc).isoformat()))
    conn.commit(); conn.close()
    return rid

def get_run(rid: str) -> Optional[TrainingRun]:
    r = _db().execute("SELECT * FROM runs WHERE run_id=?", (rid,)).fetchone(); _db().close()
    if not r: return None
    return TrainingRun(run_id=r[0], agent_did=r[1], base_model=r[2], sample_source=r[3],
                        stage=Stage(r[4]), status=RunStatus(r[5]), samples=r[6], accuracy=r[7],
                        hitl_approver=r[8], created_at=r[9])

def advance_stage(rid: str, operator: str) -> bool:
    run = get_run(rid); conn = _db()
    if run.stage == Stage.S0_COLLECT:
        if run.samples < 20: return False
        conn.execute("UPDATE runs SET stage='S1_EVAL' WHERE run_id=?", (rid,))
    elif run.stage == Stage.S1_EVAL:
        if run.accuracy < 0.70: return False
        conn.execute("UPDATE runs SET stage='S2_HITL',status='BLOCKED' WHERE run_id=?", (rid,))
    elif run.stage == Stage.S2_HITL:
        if not run.hitl_approver: return False
        conn.execute("UPDATE runs SET stage='S3_TRAIN',status='APPROVED' WHERE run_id=?", (rid,))
    elif run.stage == Stage.S3_TRAIN:
        conn.execute("UPDATE runs SET stage='DONE',status='COMPLETED' WHERE run_id=?", (rid,))
    else: return False
    conn.commit(); conn.close(); return True

def approve_hitl(rid: str, approver_did: str) -> bool:
    run = get_run(rid)
    if not run or run.stage != Stage.S2_HITL: return False
    conn = _db()
    conn.execute("UPDATE runs SET hitl_approver=? WHERE run_id=?", (approver_did, rid))
    conn.commit(); conn.close(); return advance_stage(rid, approver_did)

def submit_sample(rid: str, conversation_id: str, role: str, content: str,
                  lfm_tool_call: str = None, gold_reasoning: str = None,
                  sample_type: str = "TOOL_CALL", grade_score: float = 1.0) -> str:
    sid = f"synth-{uuid.uuid4().hex[:16]}"
    conn = _db()
    conn.execute("""INSERT INTO samples VALUES (?,?,?,?,?,?,?,?,1,?,?)""",
        (sid, rid, conversation_id, role, content, lfm_tool_call, gold_reasoning,
         sample_type, grade_score, datetime.now(timezone.utc).isoformat()))
    conn.execute("UPDATE runs SET samples=samples+1 WHERE run_id=?", (rid,))
    conn.execute("UPDATE runs SET accuracy=(SELECT AVG(grade_score) FROM samples WHERE run_id=?) WHERE run_id=?", (rid, rid))
    conn.commit(); conn.close(); return sid

def get_samples(rid: str) -> list:
    rows = _db().execute("SELECT * FROM samples WHERE run_id=?", (rid,)).fetchall(); _db().close()
    return [dict(sample_id=r[0], run_id=r[1], conversation_id=r[2], role=r[3],
                 content=r[4], lfm_tool_call=r[5], gold_reasoning=r[6],
                 sample_type=r[7], approved=bool(r[8]), grade_score=r[9]) for r in rows]

def get_pending_hitl() -> list:
    rows = _db().execute("SELECT * FROM runs WHERE stage='S2_HITL'").fetchall(); _db().close()
    return [get_run(r[0]) for r in rows]

def trigger_eval(rid: str) -> dict:
    run = get_run(rid)
    acc = run.accuracy if run else 0.0
    ready = acc >= 0.70
    conn = _db()
    if ready and run.stage == Stage.S1_EVAL:
        conn.execute("UPDATE runs SET stage='S2_HITL',status='BLOCKED' WHERE run_id=?", (rid,))
        conn.commit()
    conn.close()
    return {"accuracy": acc, "ready_for_next_stage": ready, "samples": run.samples if run else 0}

def list_runs() -> list:
    rows = _db().execute("SELECT run_id FROM runs ORDER BY created_at DESC").fetchall(); _db().close()
    return [get_run(r[0]) for r in rows]
