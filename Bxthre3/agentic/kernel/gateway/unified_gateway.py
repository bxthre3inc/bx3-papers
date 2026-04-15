"""
Unified Gateway — AgentOS Single Entry Point
Bxthre3/agentic/kernel/gateway/unified_gateway.py

Exposes a monolithic HTTP API surface. Internally routes to
service_mesh (event_bus, peer_bridge, agent_runtime) and kernel
services (tool_registry, chairman_queue, evaluator).

No business logic lives here — pure dispatcher.
"""
import sys, os
sys.path.insert(0, '/home/workspace')
sys.path.insert(0, '/home/workspace/Bxthre3')

from flask import Flask, request, jsonify
from Bxthre3.agentic.kernel.tool_registry import route_tool_call, parse_lfm_tool_call, list_tools
from Bxthre3.agentic.kernel.gateway.chairman_queue import enqueue, get_pending, approve, get_by_id
from Bxthre3.agentic.kernel.service_mesh.peer_bridge.peer_bridge import register_peer, list_peers, publish_message, get_messages, get_mesh_summary
from Bxthre3.agentic.kernel.service_mesh.agent_runtime.agent_runtime import get_runtime, infer_sync, TierAssignment
from Bxthre3.agentic.kernel.service_mesh.evaluator.evaluator import grade_tool_call, grade_agent_round_trip, get_agent_grade
from Bxthre3.agentic.kernel.service_mesh.event_bus import subscribe, drain_all, list_subscriptions
import json
from pathlib import Path
from enum import Enum

AGENTIC_STORE = Path(__file__).parent / "agentic-store.json"
GRANTS_DB    = Path(__file__).parent.parent.parent / "store" / "grants_pipeline.json"

app = Flask(__name__)

def _flat(obj):
    """Recursively convert Enum values and dataclasses to plain Python."""
    from dataclasses import is_dataclass, asdict as _asdict
    if isinstance(obj, Enum):
        return obj.value
    if is_dataclass(obj):
        return {k: _flat(v) for k, v in _asdict(obj).items()}
    if isinstance(obj, dict):
        return {k: _flat(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_flat(i) for i in obj]
    return obj

# ─── Health ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "agentos-gateway"})

# ─── Tool Registry ─────────────────────────────────────────────────────────────

@app.route("/api/tools", methods=["GET"])
def api_list_tools():
    tools = list_tools()  # returns list[ToolDef]
    by_tier = {"T0": [], "T1": [], "T2": []}
    for t in tools:
        tier_str = str(t.tier.value) if hasattr(t.tier, 'value') else str(t.tier)
        by_tier.setdefault(tier_str, []).append(t.name)
    return jsonify({"count": len(tools), "by_tier": by_tier})

@app.route("/api/tools/route", methods=["POST"])
def api_route_tool():
    body = request.json
    agent_did = body.get("agent_did", "did:agentos:unknown")
    raw_lfm_call = body.get("raw_lfm_call", "")
    result = route_tool_call(agent_did, raw_lfm_call)
    return jsonify(result)

# ─── Chairman Queue ────────────────────────────────────────────────────────────

@app.route("/api/chairman/enqueue", methods=["POST"])
def api_enqueue():
    body = request.json
    result = enqueue(
        agent_did=body.get("agent_did"),
        raw_tool_call=body.get("raw_tool_call"),
        intent_summary=body.get("intent_summary", ""),
        risk_level=body.get("risk_level", "MEDIUM"),
        ttl_minutes=body.get("ttl_minutes", 60)
    )
    return jsonify(result)

@app.route("/api/chairman/pending", methods=["GET"])
def api_pending():
    return jsonify({"items": get_pending()})

@app.route("/api/chairman/approve/<item_id>", methods=["POST"])
def api_approve(item_id):
    body = request.json
    result = approve(item_id, body.get("rationale", ""))
    return jsonify(result)

@app.route("/api/chairman/item/<item_id>", methods=["GET"])
def api_item(item_id):
    return jsonify(get_by_id(item_id))

# ─── Peer Bridge ─────────────────────────────────────────────────────────────

@app.route("/api/mesh/register", methods=["POST"])
def api_register_peer():
    body = request.json
    return jsonify(register_peer(
        peer_id=body.get("peer_id"),
        mcp_server_url=body.get("mcp_server_url"),
        capabilities=body.get("capabilities", []),
        api_key=body.get("api_key")
    ))

@app.route("/api/mesh/peers", methods=["GET"])
def api_list_peers():
    return jsonify(list_peers())

@app.route("/api/mesh/summary", methods=["GET"])
def api_mesh_summary():
    summary = get_mesh_summary()
    return jsonify(summary)

@app.route("/api/mesh/publish", methods=["POST"])
def api_publish():
    body = request.json
    return jsonify(publish_message(body.get("to"), body.get("topic"), body.get("payload")))

@app.route("/api/mesh/inbox", methods=["GET"])
def api_inbox():
    return jsonify({"messages": get_messages(body.get("peer_id", "agentic"))})

# ─── Agent Runtime ────────────────────────────────────────────────────────────

@app.route("/api/runtime", methods=["GET"])
def api_runtime():
    from Bxthre3.agentic.kernel.service_mesh.agent_runtime.agent_runtime import get_runtime
    rt = get_runtime()
    return jsonify({
        "model": str(rt.model),
        "status": str(rt.status.value if hasattr(rt.status, 'value') else rt.status),
        "default_tier": str(rt.default_tier.value if hasattr(rt.default_tier, 'value') else rt.default_tier),
        "queue_depth": rt.get_queue_depth(),
    })

@app.route("/api/runtime/infer", methods=["POST"])
def api_infer():
    body = request.json
    prompt = body.get("prompt", "")
    model  = body.get("model", "zo-cloud")
    result = infer_sync(model, prompt, event_bus=None)
    return jsonify(result)

# ─── Evaluator ────────────────────────────────────────────────────────────────

@app.route("/api/eval/tool", methods=["POST"])
def api_eval_tool():
    from dataclasses import asdict as _asdict
    body = request.json
    result = grade_tool_call(
        tool_name=body.get("tool_name"),
        gold_args=body.get("gold_args", {}),
        pred_args=body.get("pred_args", {}),
        pred_result=body.get("pred_result"),
        latency_ms=body.get("latency_ms")
    )
    return app.response_class(json.dumps(_flat(result)), mimetype="application/json")

@app.route("/api/eval/agent-round", methods=["POST"])
def api_eval_agent():
    body = request.json
    return jsonify(_flat(grade_agent_round_trip(
        agent_did=body.get("agent_did"),
        task=body.get("task"),
        tool_calls=body.get("tool_calls", []),
        final_response=body.get("final_response"),
        expected_outcome=body.get("expected_outcome")
    )))

@app.route("/api/eval/summary", methods=["GET"])
def api_eval_summary():
    from Bxthre3.agentic.kernel.service_mesh.evaluator.evaluator import get_agent_grade
    aid = request.args.get("agent_id", "agentic")
    grade = get_agent_grade(aid)
    return jsonify({"agent_id": aid, "grade": grade})

# ─── Events ───────────────────────────────────────────────────────────────────

@app.route("/api/events/subscribe", methods=["POST"])
def api_subscribe():
    body = request.json
    sub_id = subscribe(body.get("channel"), body.get("callback_name"))
    return jsonify({"subscription_id": sub_id})

@app.route("/api/events", methods=["GET"])
def api_events():
    channel = request.args.get("channel", "agentic.tool.events")
    events = drain_all()
    return jsonify({"channel": channel, "count": len(events), "events": events})

@app.route("/api/events/subscriptions", methods=["GET"])
def api_subs():
    return jsonify(list_subscriptions())

# ─── Gateway info ─────────────────────────────────────────────────────────────

@app.route("/api/gateway/info", methods=["GET"])
def api_info():
    return jsonify({
        "service": "AgentOS Unified Gateway",
        "version": "1.0.0",
        "endpoints": {
            "tools": "/api/tools",
            "route": "/api/tools/route",
            "chairman": "/api/chairman/enqueue",
            "mesh": "/api/mesh/peers",
            "runtime": "/api/runtime",
            "evaluator": "/api/eval/tool",
            "events": "/api/events"
        }
    })

# ─── Agents ───────────────────────────────────────────────────────────────────

@app.route("/api/agents", methods=["GET"])
def api_agents():
    store = json.loads(AGENTIC_STORE.read_text()) if AGENTIC_STORE.exists() else {}
    agents = store.get("agents", [])
    return jsonify({"agents": agents, "count": len(agents)})

@app.route("/api/agents/<agent_id>/<action>", methods=["POST"])
def api_agent_action(agent_id, action):
    allowed = {"start", "stop", "restart", "pause"}
    if action not in allowed:
        return jsonify({"error": f"Unknown action '{action}'"}), 400
    store = json.loads(AGENTIC_STORE.read_text()) if AGENTIC_STORE.exists() else {}
    agents = store.get("agents", [])
    for a in agents:
        if a.get("id") == agent_id:
            a["status"] = action.upper()
            a["last_action"] = action
            break
    store["agents"] = agents
    AGENTIC_STORE.write_text(json.dumps(store, indent=2))
    return jsonify({"ok": True, "agent_id": agent_id, "action": action})

# ─── Subsidiaries ─────────────────────────────────────────────────────────────

@app.route("/api/subsidiaries", methods=["GET"])
def api_subsidiaries():
    subs = [
        {"id": "irrig8",    "name": "Irrig8",    "status": "active",   "health": 0.92},
        {"id": "vpc",      "name": "Valley Players Club", "status": "active", "health": 0.87},
        {"id": "rain",     "name": "RAIN",      "status": "active",   "health": 0.78},
        {"id": "ard",      "name": "AgentOS R&D","status": "active",   "health": 0.95},
        {"id": "bab",      "name": "Build-A-Biz","status": "active",   "health": 0.81},
        {"id": "trench",   "name": "TrenchBabys","status": "active",   "health": 0.73},
    ]
    return jsonify({"subsidiaries": subs, "count": len(subs)})

# ─── Grants Pipeline ───────────────────────────────────────────────────────────

@app.route("/api/grants", methods=["GET"])
def api_grants():
    grants = [
        {"id": "arpa-e-2026",  "name": "ARPA-E OPEN 2026",      "due": "2026-05-01", "amount": 350000, "status": "active",  "stage": "pre-submission"},
        {"id": "cig-colorado", "name": "CIG Colorado FY2026",   "due": "2026-06-15", "amount": 75000,  "status": "active",  "stage": "prospecting"},
        {"id": "usda-sbir",    "name": "USDA SBIR Phase I",      "due": "2026-07-15", "amount": 100000, "status": "prospecting", "stage": "research"},
    ]
    return jsonify({"grants": grants, "count": len(grants)})

if __name__ == "__main__":
    port = int(os.environ.get("AGENTIC_GATEWAY_PORT", 3097))
    app.run(host="0.0.0.0", port=port, debug=False)
