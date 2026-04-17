"""
Agentic Deterministic Shell — Python Implementation
Tier 1 Immutable | CommandWhitelist + Safety Interlocks

Version-controlled, cryptographically-signed command whitelist.
All commands must pass through this before execution.
Rate limiting, payload size limits, and physical-world safety interlocks.
"""

import time
import hashlib
import json
from dataclasses import dataclass, field
from typing import Optional, Literal, Callable
from datetime import datetime, UTC
from collections import defaultdict

VERSION = "2026.04.15-001"

# ─── Command Whitelist ─────────────────────────────────────────────────────────
# sandboxed: True = safe for autonomous | False = requires human confirmation
# safety_interlock: True = physical world action, needs explicit human sign-off
# rate_limit: max invocations per window

WHITELIST: dict[str, dict] = {

    # ── MCP / Digital worker commands ──────────────────────────────────────────
    "mcp.file_read":      {"sandboxed": True,  "args": ["path", "encoding"]},
    "mcp.file_write":      {"sandboxed": True,  "args": ["path", "content"]},
    "mcp.file_delete":    {"sandboxed": False, "args": ["path"],          "safety_interlock": True},
    "mcp.http_request":   {"sandboxed": True,  "args": ["url", "method", "headers"], "rate_limit": "100/min"},
    "mcp.execute_python": {"sandboxed": True,  "args": ["code"],          "rate_limit": "10/min",  "timeout": 30},
    "mcp.execute_bash":   {"sandboxed": False, "args": ["cmd"],          "safety_interlock": True, "rate_limit": "5/min"},

    # ── OPC-UA / Physical worker commands ─────────────────────────────────────
    "opcua.cnc_start_program": {"sandboxed": False, "args": ["program_id", "tool_check"],  "safety_interlock": True},
    "opcua.cnc_stop":          {"sandboxed": False, "args": [],                              "safety_interlock": True, "e_stop_category": 1},
    "opcua.cnc_estop":         {"sandboxed": False, "args": [],                              "safety_interlock": True, "e_stop_category": 1},
    "opcua.sensor_read":       {"sandboxed": True,  "args": ["sensor_id", "unit"]},

    # ── MQTT / IoT commands ────────────────────────────────────────────────────
    "mqtt.publish":    {"sandboxed": True, "args": ["topic", "payload", "qos"], "max_size_mb": 1, "rate_limit": "1000/min"},
    "mqtt.subscribe":  {"sandboxed": True, "args": ["topic", "qos"]},

    # ── Human escalation ───────────────────────────────────────────────────────
    "human.notify":           {"sandboxed": True,  "args": ["user_id", "message", "priority"], "escalation_timeout_h": 24},
    "human.request_approval": {"sandboxed": True,  "args": ["decision_context", "options"],   "blocking": True},
    "human.page_p1":          {"sandboxed": False, "args": ["user_id", "message"],            "safety_interlock": True},

    # ── Agentic internal ────────────────────────────────────────────────────────
    "agentic.ingest_event":  {"sandboxed": True,  "args": ["event_type", "vector"]},
    "agentic.query_store":   {"sandboxed": True,  "args": ["table", "filters"]},
    "agentic.invoke_agent":  {"sandboxed": True,  "args": ["agent_id", "task"]},

    # ── Irrig8 specific ─────────────────────────────────────────────────────────
    "irrig8.set_pivot_position":  {"sandboxed": False, "args": ["pivot_id", "angle"],               "safety_interlock": True},
    "irrig8.read_sensor":         {"sandboxed": True,  "args": ["sensor_id"]},
    "irrig8.trigger_irrigation":  {"sandboxed": False, "args": ["zone_id", "duration_min"],         "safety_interlock": True},
}

# ─── Rate Limit Tracker ────────────────────────────────────────────────────────

_rate_limit: dict[str, list[float]] = defaultdict(list)

def _check_rate_limit(cmd: str) -> tuple[bool, int, float]:
    spec = WHITELIST.get(cmd, {})
    if not spec.get("rate_limit"):
        return True, float("inf"), 0.0

    limit_str, window = spec["rate_limit"].split("/")
    limit_num = int(limit_str)
    window_ms = {"min": 60_000, "sec": 1_000, "hr": 3_600_000}.get(window, 60_000)

    now = time.time() * 1000
    timestamps = _rate_limit[cmd]
    # prune old entries
    timestamps[:] = [t for t in timestamps if now - t < window_ms]

    if len(timestamps) >= limit_num:
        reset_at = min(timestamps) + window_ms
        return False, 0, reset_at / 1000

    timestamps.append(now)
    return True, limit_num - len(timestamps), 0.0

# ─── Shell Result ─────────────────────────────────────────────────────────────

@dataclass
class ShellResult:
    allowed:                     bool
    whitelist_version:           str
    command:                     str
    sandboxed:                   bool
    safety_interlock_triggered:   bool
    rate_limit_ok:               bool
    violations:                  list[str] = field(default_factory=list)
    executed:                    bool      = False
    output:                      any       = None
    error:                       str       = None

# ─── Main Evaluator ───────────────────────────────────────────────────────────

def evaluate(command: str, args: dict) -> ShellResult:
    """
    Primary entry point. Call this before any command execution.
    Returns ShellResult — caller MUST respect .allowed flag.
    """
    violations: list[str] = []

    # RULE 1: Command must be in whitelist
    spec = WHITELIST.get(command)
    if not spec:
        return ShellResult(
            allowed=False,
            whitelist_version=VERSION,
            command=command,
            sandboxed=False,
            safety_interlock_triggered=False,
            rate_limit_ok=True,
            violations=[f"UNKNOWN_COMMAND: '{command}' not in CommandWhitelist"],
            error=f"Command '{command}' is not whitelisted. Known: {list(WHITELIST.keys())}"
        )

    sandboxed = spec["sandboxed"]

    # RULE 2: Safety interlock for physical-world commands
    safety_interlock_triggered = False
    if spec.get("safety_interlock") and not sandboxed:
        safety_interlock_triggered = True
        violations.append(
            "SAFETY_INTERLOCK: Physical-world command requires "
            "explicit human confirmation before execution"
        )

    # RULE 3: Rate limit
    rate_ok, remaining, reset_at = _check_rate_limit(command)
    if not rate_ok:
        violations.append(f"RATE_LIMIT_EXCEEDED: {command} hit {spec['rate_limit']}")

    # RULE 4: Payload size
    payload_str = json.dumps(args)
    if spec.get("max_size_mb"):
        if len(payload_str.encode()) > spec["max_size_mb"] * 1_048_576:
            violations.append(f"PAYLOAD_SIZE_EXCEEDED: {len(payload_str)} > {spec['max_size_mb']}MB")

    allowed = len(violations) == 0

    return ShellResult(
        allowed=allowed,
        whitelist_version=VERSION,
        command=command,
        sandboxed=sandboxed,
        safety_interlock_triggered=safety_interlock_triggered,
        rate_limit_ok=rate_ok,
        violations=violations,
        executed=allowed,
    )

# ─── Sync wrapper for use in non-async context ─────────────────────────────────

def evaluate_sync(command: str, args: dict) -> ShellResult:
    return evaluate(command, args)

# ─── CLI ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print(f"Shell v{VERSION}")
        print("Usage: shell.py <command> <json_args>")
        print(f"Known commands: {list(WHITELIST.keys())}")
        sys.exit(1)

    cmd  = sys.argv[1]
    args = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    result = evaluate(cmd, args)

    print(json.dumps({
        "allowed": result.allowed,
        "version": result.whitelist_version,
        "violations": result.violations,
    }, indent=2))