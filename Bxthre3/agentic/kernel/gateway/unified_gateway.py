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

app = Flask(__name__)

# ─── Health ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "agentos-gateway"})

# ─── Tool Registry ─────────────────────────────────────────────────────────────

@app.route("/api/tools", methods=["GET"])
def api_list_tools():
    tools = list_tools()
    by_tier = {"T0": [], "T1": [], "T2": []}
    for t in tools:
        by_tier.setdefault(tier, []).append(t)
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
    return jsonify(get_mesh_summary())

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
    return jsonify(get_runtime())

@app.route("/api/runtime/infer", methods=["POST"])
def api_infer():
    body = request.json
    result = infer_sync(
        prompt=body.get("prompt"),
        agent_did=body.get("agent_did"),
        tier=TierAssignment[body.get("tier", "T0")],
        stream=body.get("stream", False)
    )
    return jsonify(result)

# ─── Evaluator ────────────────────────────────────────────────────────────────

@app.route("/api/eval/tool", methods=["POST"])
def api_eval_tool():
    body = request.json
    result = grade_tool_call(
        tool_name=body.get("tool_name"),
        gold_args=body.get("gold_args", {}),
        actual_args=body.get("actual_args", {}),
        latency_ms=body.get("latency_ms", 0)
    )
    return jsonify(result)

@app.route("/api/eval/agent-round", methods=["POST"])
def api_eval_agent():
    body = request.json
    return jsonify(grade_agent_round_trip(
        agent_did=body.get("agent_did"),
        task=body.get("task"),
        tool_calls=body.get("tool_calls", []),
        final_response=body.get("final_response"),
        expected_outcome=body.get("expected_outcome")
    ))

@app.route("/api/eval/summary", methods=["GET"])
def api_eval_summary():
    return jsonify(get_agent_grade())

# ─── Events ───────────────────────────────────────────────────────────────────

@app.route("/api/events/subscribe", methods=["POST"])
def api_subscribe():
    body = request.json
    sub_id = subscribe(body.get("channel"), body.get("callback_name"))
    return jsonify({"subscription_id": sub_id})

@app.route("/api/events", methods=["GET"])
def api_events():
    channel = request.args.get("channel", "agentic.tool.events")
    events = drain_all(channel)
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

if __name__ == "__main__":
    port = int(os.environ.get("AGENTIC_GATEWAY_PORT", 3097))
    app.run(host="0.0.0.0", port=port, debug=False)
