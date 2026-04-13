"""
Unified API Gateway — AgentOS Single Entry Point
Bxthre3/agentic/kernel/gateway/unified_gateway.py

Exposes all services under one base URL:
  /api/agents/*    → Agent Gateway
  /api/tools/*      → Tool Gateway  
  /api/training/*   → Training Gateway
  /api/peers/*     → Peer Bridge
  /api/agentic/*   → Agentic core (sessions, intents, chairman queue)

Built on Bun + Hono (zo.space stack).
"""
import json
import asyncio
import logging
from typing import Any
from datetime import datetime

logger = logging.getLogger("agentos.gateway")

# In-memory route table (maps paths to internal service handlers)
# In production, these call the actual service ports (7401-7407)

ROUTE_TABLE: dict[str, dict[str, Any]] = {
    # ── Agent Gateway ──────────────────────────────────────────────
    "POST /api/agents":             {"service": "agent-gateway", "port": 7401},
    "GET  /api/agents":             {"service": "agent-gateway", "port": 7401},
    "GET  /api/agents/:id":        {"service": "agent-gateway", "port": 7401},
    "DELETE /api/agents/:id":       {"service": "agent-gateway", "port": 7401},
    "POST /api/agents/:id/intent": {"service": "agent-gateway", "port": 7401},

    # ── Tool Gateway ────────────────────────────────────────────────
    "GET    /api/tools":            {"service": "tool-gateway", "port": 7402},
    "POST   /api/tools":           {"service": "tool-gateway", "port": 7402},
    "GET    /api/tools/:name":     {"service": "tool-gateway", "port": 7402},
    "DELETE /api/tools/:name":     {"service": "tool-gateway", "port": 7402},
    "POST   /api/tools/:name/invoke": {"service": "tool-gateway", "port": 7402},
    "GET    /api/tools/tiers":     {"service": "tool-gateway", "port": 7402},

    # ── Training Gateway ─────────────────────────────────────────────
    "GET  /api/training/jobs":         {"service": "training-gateway", "port": 7403},
    "POST /api/training/jobs":         {"service": "training-gateway", "port": 7403},
    "GET  /api/training/jobs/:id":     {"service": "training-gateway", "port": 7403},
    "POST /api/training/datasets":      {"service": "training-gateway", "port": 7403},
    "GET  /api/training/datasets":      {"service": "training-gateway", "port": 7403},
    "POST /api/training/evaluate":      {"service": "training-gateway", "port": 7403},
    "GET  /api/training/models":       {"service": "training-gateway", "port": 7403},
    "POST /api/training/models/deploy": {"service": "training-gateway", "port": 7403},
    "POST /api/training/models/rollback": {"service": "training-gateway", "port": 7403},

    # ── Peer Bridge ──────────────────────────────────────────────────
    "GET  /api/peers":              {"service": "peer-bridge", "port": 7404},
    "POST /api/peers/connect":      {"service": "peer-bridge", "port": 7404},
    "GET  /api/peers/:id/manifest": {"service": "peer-bridge", "port": 7404},
    "POST /api/peers/:id/relay":    {"service": "peer-bridge", "port": 7404},

    # ── Agentic Core ─────────────────────────────────────────────────
    "GET  /api/agentic/sessions":       {"service": "agent-runtime", "port": 7405},
    "POST /api/agentic/sessions":      {"service": "agent-runtime", "port": 7405},
    "POST /api/agentic/infer":         {"service": "agent-runtime", "port": 7405},
    "GET  /api/agentic/chairman/queue": {"service": "agent-runtime", "port": 7405},
    "POST /api/agentic/chairman/decide": {"service": "agent-runtime", "port": 7405},
    "GET  /api/agentic/training/monitor": {"service": "evaluator", "port": 7407},
    "GET  /api/agentic/training/signals": {"service": "evaluator", "port": 7407},
}

# Services that require T2/HITL enforcement
HITL_TOOLS = {
    "file_patent", "issue_equity", "authorize_payment",
    "approve_grant_submission", "delete_bx3", "write_to_ledger",
    "deletebx3", "deploy_production", "modify_tier_policy",
}


class UnifiedGateway:
    """
    Single gateway class that routes all requests to internal services.
    In production this runs as a Bun/Hono server on port 443.
    """

    def __init__(self):
        self._services: dict[str, Any] = {}
        self._event_bus = None

    async def route(self, method: str, path: str, body: dict | None, headers: dict) -> dict:
        """Main routing dispatcher. Returns JSON response."""
        route_key = f"{method} {path}"
        matched = self._match_route(method, path)

        if not matched:
            return {
                "error": "Not Found",
                "path": path,
                "method": method,
                "suggestion": "Check /api/{agents,tools,training,peers,agentic}",
            }, 404

        service = matched["service"]

        # ── Pre-processing hooks ────────────────────────────────────
        if service == "tool-gateway" and method == "POST" and "/invoke" in path:
            return await self._handle_tool_invoke(path, body, headers)

        if service == "agent-gateway" and method == "POST" and "/intent" in path:
            return await self._handle_intent(path, body, headers)

        if service == "agent-runtime" and path.endswith("/chairman/decide"):
            return await self._handle_chairman_decide(path, body, headers)

        # Route to internal service (via IPC in production, direct call in dev)
        return await self._forward_to_service(service, method, path, body)

    def _match_route(self, method: str, path: str) -> dict | None:
        """Match a request against the route table with parameter extraction."""
        # Exact match first
        key = f"{method} {path}"
        if key in ROUTE_TABLE:
            return ROUTE_TABLE[key]

        # Parameter match (e.g. GET /api/agents/:id)
        for route, info in ROUTE_TABLE.items():
            rm, rp = route.split(" ", 1)
            if rm != method:
                continue
            if self._path_matches(rp, path):
                return info
        return None

    def _path_matches(self, pattern: str, path: str) -> bool:
        """Check if path matches route pattern like /api/agents/:id."""
        p_parts = pattern.strip("/").split("/")
        x_parts = path.strip("/").split("/")
        if len(p_parts) != len(x_parts):
            return False
        for p, x in zip(p_parts, x_parts):
            if p.startswith(":"):
                continue  # parameter segment always matches
            if p != x:
                return False
        return True

    async def _handle_tool_invoke(self, path: str, body: dict | None, headers: dict) -> dict:
        """Tool invocation with tier enforcement."""
        if not body:
            return {"error": "Body required for tool invocation"}, 400

        tool_name = body.get("tool_name") or path.split("/")[-3]  # /api/tools/:name/invoke
        tier = _get_tool_tier(tool_name)

        if tier == "T2":
            # Queue for chairman approval
            return await self._queue_for_approval(tool_name, body, headers)

        # T0/T1 — proceed
        return await self._forward_to_service("tool-gateway", "POST", "/api/tools/invoke", body)

    async def _handle_intent(self, path: str, body: dict | None, headers: dict) -> dict:
        """T1 Intent routing — validate <|intent_start|> prefix."""
        if not body:
            return {"error": "Body required for intent submission"}, 400

        intent_text = body.get("intent_text", "")
        if not intent_text.startswith("<|intent_start|>") and not intent_text.startswith("<|chairman_intent|>"):
            return {
                "error": "Intent must start with <|intent_start|> or <|chairman_intent|>",
                "received": intent_text[:50],
            }, 400

        # Log intent to audit trail
        await self._emit_audit("intent_announced", {
            "tool_name": body.get("tool_name"),
            "intent_text": intent_text,
            "agent_id": headers.get("X-Agent-ID", "unknown"),
        })

        if intent_text.startswith("<|chairman_intent|>"):
            return await self._queue_for_approval(body.get("tool_name"), body, headers)

        return await self._forward_to_service("agent-gateway", "POST", "/api/agents/intent", body)

    async def _queue_for_approval(self, tool_name: str, body: dict, headers: dict) -> dict:
        """Route T2/HITL tool to chairman queue."""
        item = {
            "id": f"chair-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{tool_name}",
            "requested_at": datetime.utcnow().isoformat(),
            "requesting_agent": headers.get("X-Agent-ID", "unknown"),
            "tool_name": tool_name,
            "parameters": body.get("parameters", {}),
            "rationale": body.get("rationale", "Not provided"),
            "risk": _assess_risk(tool_name),
            "alternatives": body.get("alternatives", "Not provided"),
            "status": "PENDING",
        }
        # In production: write to chairman queue DB
        logger.info(f"[Gateway] Queued for chairman approval: {item['id']}")
        return {
            "status": "PENDING_APPROVAL",
            "queue_id": item["id"],
            "message": f"Chairman approval required for {tool_name}. You will be notified when decided.",
            "item": item,
        }, 202

    async def _handle_chairman_decide(self, path: str, body: dict | None, headers: dict) -> dict:
        """Chairman decision — approve or deny T2 intent."""
        if not body:
            return {"error": "Body required"}, 400

        queue_id = body.get("queue_id")
        decision = body.get("decision")  # "approve" | "deny"
        notes = body.get("notes", "")

        if decision not in ("approve", "deny"):
            return {"error": "decision must be 'approve' or 'deny'"}, 400

        # Log decision
        await self._emit_audit("chairman_decision", {
            "queue_id": queue_id,
            "decision": decision,
            "approver": headers.get("X-Agent-ID", "brodiblanco"),
            "notes": notes,
            "decided_at": datetime.utcnow().isoformat(),
        })

        if decision == "approve":
            # Re-submit as approved T2 — forward to tool gateway
            # The queue item had the original params
            approved_params = body.get("approved_params", {})
            return await self._forward_to_service("tool-gateway", "POST", "/api/tools/invoke", approved_params)

        return {"status": "DENIED", "queue_id": queue_id, "notes": notes}, 200

    async def _forward_to_service(self, service: str, method: str, path: str, body: dict) -> dict:
        """Forward request to internal service (IPC in prod, direct in dev)."""
        # In development: call service directly
        # In production: HTTP POST to internal port (e.g. localhost:7401)
        logger.debug(f"[Gateway] → {service}: {method} {path}")
        # TODO: Implement actual IPC/HTTP forwarding to service ports
        return {"service": service, "method": method, "path": path, "status": "forwarded"}, 200

    async def _emit_audit(self, event_type: str, payload: dict) -> None:
        """Emit to audit.events channel."""
        if self._event_bus:
            await self._event_bus.emit_audit(event_type, payload, source="gateway")


def _get_tool_tier(tool_name: str) -> str:
    """Look up tool tier from manifest."""
    # TODO: Load from TOOL_MANIFEST.md at startup
    if tool_name in HITL_TOOLS:
        return "T2"
    return "T0"


def _assess_risk(tool_name: str) -> str:
    """Return human-readable risk description."""
    risks = {
        "file_patent": "HIGH — Irreversible IP filing",
        "issue_equity": "HIGH — Equity distribution, legally binding",
        "authorize_payment": "HIGH — Financial transaction",
        "approve_grant_submission": "HIGH — Commitments under deadline",
        "delete_bx3": "HIGH — Permanent data deletion",
        "deploy_production": "MEDIUM — Affects live users",
        "modify_tier_policy": "HIGH — Changes security posture",
    }
    return risks.get(tool_name, "MEDIUM — Operational impact")
