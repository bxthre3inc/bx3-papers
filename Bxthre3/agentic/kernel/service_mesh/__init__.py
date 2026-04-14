"""
Service Mesh — AgentOS Federated Backend
Bxthre3/agentic/kernel/service_mesh/

All internal services communicate via the event bus.
"""
from .event_bus import (
    subscribe, unsubscribe, publish, drain_all,
    list_subscriptions, clear, emit_tool_event,
    emit_agent_event, emit_training_event, emit_mesh_event,
    emit_chairman_event, CHANNELS, Event
)

__all__ = [
    "subscribe", "unsubscribe", "publish", "drain_all",
    "list_subscriptions", "clear",
    "emit_tool_event", "emit_agent_event",
    "emit_training_event", "emit_mesh_event",
    "emit_chairman_event", "CHANNELS", "Event",
]
