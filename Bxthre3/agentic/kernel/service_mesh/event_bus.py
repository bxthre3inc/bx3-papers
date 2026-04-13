"""
Event Bus — AgentOS Internal Spine
Based on NATS.io lightweight client (asyncio-nats)

Channels:
  agent.events       — agent lifecycle
  tool.events        — tool registration/invocation
  training.events    — job status, model events
  peer.events        — peer discovery, federation
  audit.events       — immutable T2 action log
"""
import asyncio
import json
import uuid
import logging
from datetime import datetime
from enum import Enum
from typing import Callable, Awaitable, Any
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod

logger = logging.getLogger("agentos.event_bus")

class Channel(str, Enum):
    AGENT = "agent.events"
    TOOL = "tool.events"
    TRAINING = "training.events"
    PEER = "peer.events"
    AUDIT = "audit.events"

@dataclass
class Event:
    channel: str
    event_id: str
    event_type: str
    source: str          # which service emitted it
    payload: dict
    timestamp: str
    trace_id: str = ""   # for distributed tracing across services

    def to_json(self) -> str:
        return json.dumps(asdict(self))

    @classmethod
    def from_json(cls, raw: str) -> "Event":
        return cls(**json.loads(raw))

def _make_event(channel: Channel, event_type: str, source: str, payload: dict, trace_id: str = "") -> Event:
    return Event(
        channel=channel.value,
        event_id=str(uuid.uuid4()),
        event_type=event_type,
        source=source,
        payload=payload,
        timestamp=datetime.utcnow().isoformat(),
        trace_id=trace_id or str(uuid.uuid4()),
    )

class EventBus(ABC):
    """Abstract event bus — NATS implementation below."""

    @abstractmethod
    async def publish(self, channel: Channel, event: Event) -> None:
        ...

    @abstractmethod
    async def subscribe(self, channel: Channel, handler: Callable[[Event], Awaitable[None]]) -> str:
        ...

    @abstractmethod
    async def unsubscribe(self, subscription_id: str) -> None:
        ...

    # Convenience publishers
    async def emit_agent(self, event_type: str, payload: dict, source: str, trace_id: str = "") -> None:
        await self.publish(Channel.AGENT, _make_event(Channel.AGENT, event_type, source, payload, trace_id))

    async def emit_tool(self, event_type: str, payload: dict, source: str, trace_id: str = "") -> None:
        await self.publish(Channel.TOOL, _make_event(Channel.TOOL, event_type, source, payload, trace_id))

    async def emit_training(self, event_type: str, payload: dict, source: str, trace_id: str = "") -> None:
        await self.publish(Channel.TRAINING, _make_event(Channel.TRAINING, event_type, source, payload, trace_id))

    async def emit_peer(self, event_type: str, payload: dict, source: str, trace_id: str = "") -> None:
        await self.publish(Channel.PEER, _make_event(Channel.PEER, event_type, source, payload, trace_id))

    async def emit_audit(self, event_type: str, payload: dict, source: str, trace_id: str = "") -> None:
        await self.publish(Channel.AUDIT, _make_event(Channel.AUDIT, event_type, source, payload, trace_id))


# ─── NATS Implementation ────────────────────────────────────────────────────────

try:
    import asyncionats
    HAS_NATS = True
except ImportError:
    HAS_NATS = False
    logger.warning("NATS not installed. Using InMemoryEventBus fallback.")


class InMemoryEventBus(EventBus):
    """Fallback in-memory event bus for single-instance dev/deployment."""

    def __init__(self):
        self._subscribers: dict[str, list[tuple[str, Callable[[Event], Awaitable[None]]]]] = {
            ch.value: [] for ch in Channel
        }
        self._lock = asyncio.Lock()

    async def publish(self, channel: Channel, event: Event) -> None:
        async with self._lock:
            subscribers = list(self._subscribers.get(channel.value, []))

        # Fire-and-forget handlers (non-blocking)
        for sub_id, handler in subscribers:
            try:
                asyncio.create_task(handler(event))
            except Exception as e:
                logger.error(f"[EventBus] Handler error in {sub_id}: {e}")

    async def subscribe(self, channel: Channel, handler: Callable[[Event], Awaitable[None]]) -> str:
        sub_id = str(uuid.uuid4())
        async with self._lock:
            self._subscribers[channel.value].append((sub_id, handler))
        logger.info(f"[EventBus] Subscribed {sub_id} → {channel.value}")
        return sub_id

    async def unsubscribe(self, subscription_id: str) -> None:
        async with self._lock:
            for ch in self._subscribers:
                self._subscribers[ch] = [
                    (sid, h) for sid, h in self._subscribers[ch]
                    if sid != subscription_id
                ]


class NATSEventBus(EventBus):
    """Production event bus using NATS.io."""

    def __init__(self, servers: list[str] | None = None):
        self.servers = servers or ["nats://localhost:7400"]
        self._nc = None
        self._subscriptions: dict[str, Any] = {}

    async def connect(self):
        if not HAS_NATS:
            raise ImportError("asyncio-nats not installed. Run: pip install asyncio-nats")
        import asyncio_nats
        self._nc = await asyncio_nats.connect(self.servers)
        logger.info(f"[EventBus/NATS] Connected to {self.servers}")

    async def close(self):
        if self._nc:
            await self._nc.close()

    async def publish(self, channel: Channel, event: Event) -> None:
        if not self._nc:
            raise RuntimeError("NATS not connected. Call connect() first.")
        await self._nc.publish(channel.value, event.to_json().encode())

    async def subscribe(self, channel: Channel, handler: Callable[[Event], Awaitable[None]]) -> str:
        sub_id = str(uuid.uuid4())
        if not self._nc:
            raise RuntimeError("NATS not connected.")
        sub = await self._nc.subscribe(channel.value)
        async def wrapped(msg):
            event = Event.from_json(msg.data.decode())
            await handler(event)
        self._subscriptions[sub_id] = sub
        logger.info(f"[EventBus/NATS] Subscribed {sub_id} → {channel.value}")
        return sub_id

    async def unsubscribe(self, subscription_id: str) -> None:
        if subscription_id in self._subscriptions:
            await self._subscriptions[subscription_id].unsubscribe()
            del self._subscriptions[subscription_id]


# ─── Singleton factory ──────────────────────────────────────────────────────────

_event_bus: EventBus | None = None

def get_event_bus() -> EventBus:
    global _event_bus
    if _event_bus is None:
        _event_bus = InMemoryEventBus()
    return _event_bus

def set_event_bus(bus: EventBus):
    global _event_bus
    _event_bus = bus
