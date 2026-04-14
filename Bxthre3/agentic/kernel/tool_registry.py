"""
Tool Registry Service — AgentOS Kernel
Bxthre3/agentic/kernel/tool_registry.py

Loads TOOL_MANIFEST.md at startup, validates all tool definitions,
and exposes them as a queryable service layer (in-process + HTTP).

Tier routing:
  T0 → executed directly (no block)
  T1 → logged + traced (no block)
  T2 → enqueued to ChairmanQueue before execution proceeds

Canonical reference: Bxthre3/agentic/TOOL_MANIFEST.md
"""
import re
import hashlib
import sqlite3
import logging
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from enum import IntEnum

logger = logging.getLogger("agentic.tool_registry")

# ─── Tier Enum ─────────────────────────────────────────────────────────────────

class Tier(IntEnum):
    T0_AUTONOMOUS = 0   # Execute freely — no gate
    T1_INTENTIONAL = 1  # Log intent before execution
    T2_HITL_GATED = 2   # Enqueue to ChairmanQueue before any execution

# ─── Dataclasses ───────────────────────────────────────────────────────────────

@dataclass
class ToolDef:
    name: str
    tier: Tier
    description: str
    params: dict
    lfm_syntax: str
    requires_permission: Optional[str] = None
    hitl_category: Optional[str] = None

# ─── SQLite Store ─────────────────────────────────────────────────────────────

TOOL_REGISTRY_DB = Path(__file__).parent.parent / "store" / "tool_registry.db"

def _get_db():
    TOOL_REGISTRY_DB.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(TOOL_REGISTRY_DB))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tool_registry (
            name                TEXT PRIMARY KEY,
            tier                INTEGER NOT NULL,
            description        TEXT NOT NULL,
            params_json        TEXT NOT NULL,
            lfm_syntax         TEXT NOT NULL,
            requires_permission TEXT,
            hitl_category      TEXT,
            manifest_hash      TEXT NOT NULL,
            loaded_at          TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS invocation_log (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            tool_name   TEXT NOT NULL,
            agent_did   TEXT NOT NULL,
            tier        INTEGER NOT NULL,
            tool_call   TEXT NOT NULL,
            status      TEXT NOT NULL,
            enqueued_id TEXT,
            approved_by TEXT,
            executed_at TEXT
        )
    """)
    conn.commit()
    return conn

# ─── LFM Pythonic Syntax ──────────────────────────────────────────────────────

TOOL_CALL_RE = re.compile(
    r"<\|tool_call_start\|>\[(\w+)\((.*?)\)\]<\|tool_call_end\|>"
)

def parse_lfm_tool_call(raw: str) -> tuple[str, dict]:
    """Parse LFM Pythonic syntax into (tool_name, {param_dict})."""
    match = TOOL_CALL_RE.search(raw)
    if not match:
        raise ValueError(f"Invalid LFM syntax: {raw!r}")
    tool_name = match.group(1)
    args_str  = match.group(2)
    params = {}
    if args_str.strip():
        for part in args_str.split(","):
            part = part.strip()
            if "=" in part:
                k, v = part.split("=", 1)
                params[k.strip()] = v.strip().strip('"').strip("'")
            else:
                params[f"arg{len(params)+1}"] = part.strip()
    return tool_name, params

def format_lfm_tool_call(tool_name: str, **params) -> str:
    """Format params into LFM Pythonic syntax."""
    args = ",".join(f'{k}="{v}"' for k, v in params.items())
    return f'<|tool_call_start|>[{tool_name}({args})]<|tool_call_end|>'

# ─── Manifest Parser ──────────────────────────────────────────────────────────

def _parse_manifest_table(table_text: str) -> list[dict]:
    """Parse a markdown table into list of row dicts."""
    lines = [l.rstrip() for l in table_text.strip().splitlines() if l.strip()]
    if len(lines) < 3:
        return []
    # Skip separator line (|---|---|)
    data_lines = [l for l in lines if not re.match(r'^\|[\s\-|:]+\|$', l)]
    if len(data_lines) < 2:
        return []
    # Parse header
    headers = [h.strip().lower() for h in data_lines[0].strip().strip('|').split('|')]
    results = []
    for row in data_lines[1:]:
        cells = [c.strip() for c in row.strip().strip('|').split('|')]
        if len(cells) >= len(headers):
            row_dict = {headers[i]: cells[i] for i in range(len(headers))}
            results.append(row_dict)
    return results

def load_manifest(manifest_path: str | None = None) -> dict[str, ToolDef]:
    """Load tools from TOOL_MANIFEST.md into the registry."""
    global _TOOL_REGISTRY, _MANIFEST_HASH
    if manifest_path is None:
        manifest_path = str(Path(__file__).parent.parent / "TOOL_MANIFEST.md")
    raw = open(manifest_path).read()
    manifest_hash = hashlib.sha256(raw.encode()).hexdigest()[:12]
    if manifest_hash == _MANIFEST_HASH and _TOOL_REGISTRY:
        logger.info("Tool registry already current (hash=%s)", _MANIFEST_HASH)
        return _TOOL_REGISTRY
    _TOOL_REGISTRY.clear()
    tier_map = {"t0": Tier.T0_AUTONOMOUS, "t1": Tier.T1_INTENTIONAL, "t2": Tier.T2_HITL_GATED}
    section_tier = {"T0 — Autonomous Tools": Tier.T0_AUTONOMOUS,
                    "T1 — Intentional Tools": Tier.T1_INTENTIONAL,
                    "T2 — HITL-Gated Tools": Tier.T2_HITL_GATED}
    current_tier = None
    current_section_tools = []
    current_section_text = ""
    for line in raw.splitlines():
        line = line.rstrip()
        # Section header?
        tier_match = re.match(r'^##\s+(T\d)\s+[—–-]\s+(.+)', line)
        if tier_match:
            if current_section_tools and current_tier is not None:
                _register_section(current_section_tools, current_tier)
            current_tier = section_tier.get(line.lstrip('#').strip(), None)
            current_section_tools = []
            continue
        # New subsection starting with ###
        if line.startswith("### ") and current_tier is not None:
            if current_section_tools:
                _register_section(current_section_tools, current_tier)
            current_section_tools = []
            continue
        current_section_text += line + "\n"
        # Look for table rows
        if current_tier is not None:
            if line.startswith("|") and not re.match(r'^\|[\s\-|:]+\|$', line):
                cells = [c.strip() for c in line.strip().strip('|').split('|')]
                if len(cells) >= 2 and cells[0] and cells[0] != "Tool":
                    name = cells[0].strip().strip('`')
                    desc = cells[1].strip() if len(cells) > 1 else ""
                    current_section_tools.append({"name": name, "description": desc})
    if current_section_tools and current_tier is not None:
        _register_section(current_section_tools, current_tier)
    _save_to_db(manifest_hash)
    _MANIFEST_HASH = manifest_hash
    logger.info("Tool registry loaded: %d tools (hash=%s)", len(_TOOL_REGISTRY), _MANIFEST_HASH)
    return _TOOL_REGISTRY

def _register_section(tools: list[dict], tier: Tier):
    for t in tools:
        name = t["name"]
        desc = t.get("description", "")
        lfm = format_lfm_tool_call(name)
        _TOOL_REGISTRY[name] = ToolDef(name=name, tier=tier, description=desc,
                                        params={}, lfm_syntax=lfm)

def _save_to_db(manifest_hash: str):
    conn = _get_db()
    conn.execute("DELETE FROM tool_registry")
    for name, tool in _TOOL_REGISTRY.items():
        conn.execute("""
            INSERT OR REPLACE INTO tool_registry
            (name, tier, description, params_json, lfm_syntax, requires_permission, hitl_category, manifest_hash, loaded_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, (name, tool.tier.value, tool.description, "{}",
              tool.lfm_syntax, tool.requires_permission, tool.hitl_category, manifest_hash))
    conn.commit()

# ─── Registry API ─────────────────────────────────────────────────────────────

_TOOL_REGISTRY: dict[str, ToolDef] = {}
_MANIFEST_HASH: str = ""

def get_tool(name: str) -> Optional[ToolDef]:
    return _TOOL_REGISTRY.get(name)

def list_tools(tier: Optional[Tier] = None) -> list[ToolDef]:
    if tier is None:
        return list(_TOOL_REGISTRY.values())
    return [t for t in _TOOL_REGISTRY.values() if t.tier == tier]

def route_tool_call(agent_did: str, raw_lfm_call: str) -> dict:
    """Route a tool call based on tier. T2 -> ChairmanQueue."""
    from Bxthre3.agentic.kernel.gateway.chairman_queue import enqueue
    from Bxthre3.agentic.kernel.service_mesh.event_bus import emit_tool_event
    tool_name, params = parse_lfm_tool_call(raw_lfm_call)
    tool = get_tool(tool_name)
    if not tool:
        return {"status": "ERROR", "error": f"Unknown tool: {tool_name}"}
    if tool.tier == Tier.T0_AUTONOMOUS:
        emit_tool_event(tool=tool_name, action="executed", agent_did=agent_did, tier="T0", params=params)
        return {"status": "EXECUTE", "tool": tool_name, "params": params, "tier": 0}
    elif tool.tier == Tier.T1_INTENTIONAL:
        emit_tool_event(tool=tool_name, action="executed", agent_did=agent_did, tier="T1", params=params)
        return {"status": "EXECUTE", "tool": tool_name, "params": params, "tier": 1}
    else:
        enqueued_id = enqueue(
            agent_did=agent_did,
            tool_call=raw_lfm_call,
            intent_summary=f"T2 tool call: {tool_name}",
            risk_level="HIGH"
        )
        emit_tool_event(tool=tool_name, action="blocked_t2", agent_did=agent_did, tier="T2", enqueued_id=enqueued_id)
        return {"status": "BLOCKED_T2", "enqueued_id": enqueued_id, "tool": tool_name}

# ─── Auto-load ────────────────────────────────────────────────────────────────

load_manifest()
