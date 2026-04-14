"""
Event Bus — AgentOS internal pub/sub spine.
"""
from dataclasses import dataclass, field
from typing import Callable, Any
from datetime import datetime
from collections import defaultdict
import threading

CHANNELS = {
    'tool': 'agentic.tool.events',
    'agent': 'agentic.agent.events',
    'training': 'agentic.training.events',
    'mesh': 'agentic.mesh.events',
    'chairman': 'agentic.chairman.events',
}

@dataclass
class Event:
    channel: str
    payload: dict
    published_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

_subscribers: dict[str, list[tuple[Callable, str]]] = defaultdict(list)
_lock = threading.RLock()

def subscribe(channel: str, handler: Callable, name: str = '') -> None:
    with _lock:
        _subscribers[channel].append((handler, name))

def unsubscribe(channel: str, handler: Callable) -> None:
    with _lock:
        _subscribers[channel] = [(h, n) for h, n in _subscribers[channel] if h != handler]

def publish(channel: str, payload: dict) -> None:
    event = Event(channel=channel, payload=payload)
    handlers = []
    with _lock:
        handlers = list(_subscribers[channel])
    for handler, _ in handlers:
        try:
            handler(event)
        except Exception:
            pass

def drain_all() -> None:
    pass

def list_subscriptions() -> dict[str, int]:
    with _lock:
        return {ch: len(handlers) for ch, handlers in _subscribers.items()}

def clear() -> None:
    with _lock:
        _subscribers.clear()

def emit_tool_event(tool: str, action: str, agent_did: str, **kwargs) -> None:
    publish('agentic.tool.events', {'tool': tool, 'action': action, 'agent_did': agent_did, **kwargs})

def emit_agent_event(agent_did: str, action: str, **kwargs) -> None:
    publish('agentic.agent.events', {'agent_did': agent_did, 'action': action, **kwargs})

def emit_training_event(run_id: str, stage: str, action: str, **kwargs) -> None:
    publish('agentic.training.events', {'run_id': run_id, 'stage': stage, 'action': action, **kwargs})

def emit_mesh_event(peer_id: str, action: str, **kwargs) -> None:
    publish('agentic.mesh.events', {'peer_id': peer_id, 'action': action, **kwargs})

def emit_chairman_event(action: str, item_id: str, **kwargs) -> None:
    publish('agentic.chairman.events', {'action': action, 'item_id': item_id, **kwargs})
