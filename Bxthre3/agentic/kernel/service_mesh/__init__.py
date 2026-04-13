"""
Service Mesh — AgentOS Federated Backend
Bxthre3/agentic/kernel/service_mesh/

All internal services communicate via the event bus.
No direct imports between services — all coupling is via pub/sub.
"""
from .event_bus import EventBus, Channel

__all__ = ["EventBus", "Channel"]
