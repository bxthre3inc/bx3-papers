"""
Environment Manager — AgentOS Kernel
Bxthre3/agentic/kernel/service_mesh/env_manager/env_manager.py

Manages Python virtual environments for each agent in the mesh.
Each agent gets its own venv, installable tool dependencies, and namespace isolation.
"""
import os
import sqlite3
import subprocess
import shutil
import hashlib
import threading
from pathlib import Path
from dataclasses import dataclass
from typing import Optional
from enum import IntEnum

ENV_STORE = Path(__file__).parent.parent.parent.parent / "store" / "envs"
ENV_STORE.mkdir(parents=True, exist_ok=True)

class EnvStatus(IntEnum):
    PENDING = 0
    BUILDING = 1
    READY = 2
    ERROR = 3
    FAILED = 4

@dataclass
class EnvDef:
    env_id: str
    agent_did: str
    python_version: str
    packages: list[str]
    status: EnvStatus
    venv_path: Optional[str]
    error: Optional[str]
    created_at: str

def _db():
    ENV_STORE.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(ENV_STORE / "envs.db"))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS envs (
            env_id       TEXT PRIMARY KEY,
            agent_did    TEXT NOT NULL,
            python_version TEXT NOT NULL DEFAULT '3.12',
            packages     TEXT NOT NULL DEFAULT '[]',
            status       INTEGER NOT NULL DEFAULT 0,
            venv_path    TEXT,
            error        TEXT,
            created_at   TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS package_versions (
            env_id       TEXT NOT NULL,
            package      TEXT NOT NULL,
            version      TEXT NOT NULL,
            installed_at  TEXT NOT NULL DEFAULT (datetime('now')),
            PRIMARY KEY  (env_id, package),
            FOREIGN KEY  (env_id) REFERENCES envs(env_id)
        )
    """)
    conn.commit()
    return conn

def _make_env_id(agent_did: str, python_version: str, packages: list[str]) -> str:
    key = f"{agent_did}:{python_version}:{','.join(sorted(packages))}"
    return "env-" + hashlib.sha256(key.encode()).hexdigest()[:16]

def _run(cmd: list[str], cwd: str | None = None) -> tuple[int, str, str]:
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    return r.returncode, r.stdout, r.stderr

# ─── Core API ─────────────────────────────────────────────────────────────────

def create_env(
    agent_did: str,
    packages: list[str] | None = None,
    python_version: str = "3.12"
) -> EnvDef:
    """Create or return existing venv for an agent."""
    pkgs = packages or []
    env_id = _make_env_id(agent_did, python_version, pkgs)
    venv_path = str(ENV_STORE / env_id)
    conn = _db()
    row = conn.execute("SELECT * FROM envs WHERE env_id=?", (env_id,)).fetchone()
    if row:
        conn.close()
        return EnvDef(
            env_id=row[0], agent_did=row[1], python_version=row[2],
            packages=eval(row[3]), status=EnvStatus(row[4]),
            venv_path=row[5], error=row[6], created_at=row[7]
        )
    conn.execute(
        "INSERT INTO envs (env_id,agent_did,python_version,packages,status,venv_path) VALUES (?,?,?,?,?,?)",
        (env_id, agent_did, python_version, str(pkgs), EnvStatus.PENDING, venv_path)
    )
    conn.commit()
    conn.close()
    _build_async(env_id, venv_path, python_version, pkgs)
    return EnvDef(env_id=env_id, agent_did=agent_did, python_version=python_version,
                   packages=pkgs, status=EnvStatus.PENDING, venv_path=venv_path,
                   error=None, created_at="")

def _build_async(env_id: str, venv_path: str, python: str, packages: list[str]):
    def _build():
        import time; time.sleep(0.1)
        _set_status(env_id, EnvStatus.BUILDING)
        # Create venv
        rc, out, err = _run(["python3" if python == "3.12" else f"python{python}",
                              "-m", "venv", venv_path])
        if rc != 0:
            _set_error(env_id, f"venv create failed: {err}")
            return
        # Upgrade pip
        pip = Path(venv_path, "bin", "pip")
        rc, _, err = _run([str(pip), "install", "--upgrade", "pip"])
        if rc != 0:
            _set_error(env_id, f"pip upgrade failed: {err}"); return
        # Install packages
        if packages:
            rc, _, err = _run([str(pip), "install"] + packages)
            if rc != 0:
                _set_error(env_id, f"package install failed: {err}"); return
        # Record versions
        conn = _db()
        for pkg in packages:
            rc2, out2, _ = _run([str(pip), "show", pkg.split("==")[0].split(">=")[0]])
            ver = out2.splitlines()[0].split(":", 1)[1].strip() if out2 else "unknown"
            conn.execute("INSERT OR REPLACE INTO package_versions (env_id,package,version) VALUES (?,?,?)",
                         (env_id, pkg.split("==")[0].split(">=")[0], ver))
        conn.execute("UPDATE envs SET status=? WHERE env_id=?", (EnvStatus.READY, env_id))
        conn.commit(); conn.close()
    t = threading.Thread(target=_build, daemon=True)
    t.start()

def _set_status(env_id: str, status: EnvStatus):
    conn = _db(); conn.execute("UPDATE envs SET status=? WHERE env_id=?", (status, env_id)); conn.commit(); conn.close()

def _set_error(env_id: str, error: str):
    conn = _db(); conn.execute("UPDATE envs SET status=?,error=? WHERE env_id=?", (EnvStatus.ERROR, error, env_id))
    conn.commit(); conn.close()

def get_env(env_id: str) -> EnvDef | None:
    conn = _db(); row = conn.execute("SELECT * FROM envs WHERE env_id=?", (env_id,)).fetchone(); conn.close()
    if not row: return None
    return EnvDef(env_id=row[0], agent_did=row[1], python_version=row[2],
                  packages=eval(row[3]), status=EnvStatus(row[4]),
                  venv_path=row[5], error=row[6], created_at=row[7])

def list_envs(agent_did: str | None = None) -> list[EnvDef]:
    conn = _db()
    rows = conn.execute("SELECT * FROM envs WHERE ? IS NULL OR agent_did=?" ,
                       (agent_did, agent_did) if agent_did else (None, None)).fetchall()
    conn.close()
    return [EnvDef(env_id=r[0], agent_did=r[1], python_version=r[2],
                   packages=eval(r[3]), status=EnvStatus(r[4]),
                   venv_path=r[5], error=r[6], created_at=r[7]) for r in rows]

def install_packages(env_id: str, packages: list[str]) -> dict:
    env = get_env(env_id)
    if not env: return {"status": "ERROR", "error": "env not found"}
    if env.status != EnvStatus.READY:
        return {"status": "ERROR", "error": f"env not ready (status={env.status.name})"}
    pip = Path(env.venv_path, "bin", "pip")
    rc, _, err = _run([str(pip), "install"] + packages)
    if rc != 0:
        return {"status": "ERROR", "error": err}
    return {"status": "READY", "installed": packages}

def delete_env(env_id: str) -> dict:
    env = get_env(env_id)
    if not env: return {"status": "ERROR", "error": "env not found"}
    if env.venv_path and Path(env.venv_path).exists():
        shutil.rmtree(env.venv_path)
    conn = _db()
    conn.execute("DELETE FROM package_versions WHERE env_id=?", (env_id,))
    conn.execute("DELETE FROM envs WHERE env_id=?", (env_id,))
    conn.commit(); conn.close()
    return {"status": "DELETED", "env_id": env_id}
