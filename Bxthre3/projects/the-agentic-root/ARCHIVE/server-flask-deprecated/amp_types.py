"""
AMP Types - Python dataclasses matching Kotlin serialization
"""
import json
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import Dict, Set, Optional, Any

class NodeRole(Enum):
    PRIMARY = "PRIMARY"
    SECONDARY = "SECONDARY" 
    TERTIARY = "TERTIARY"

class NodeCapability(Enum):
    COMPUTE_LIGHT = "COMPUTE_LIGHT"
    COMPUTE_HEAVY = "COMPUTE_HEAVY"
    STORAGE_LOCAL = "STORAGE_LOCAL"
    STORAGE_PERSISTENT = "STORAGE_PERSISTENT"
    VOICE_STREAM = "VOICE_STREAM"
    SMS_GATEWAY = "SMS_GATEWAY"
    EMAIL_GATEWAY = "EMAIL_GATEWAY"

class TaskPriority(Enum):
    P0_CRITICAL = "P0_CRITICAL"
    P1_HIGH = "P1_HIGH"
    P2_NORMAL = "P2_NORMAL"
    P3_LOW = "P3_LOW"

@dataclass
class NodeHealth:
    battery_percent: int = 100
    cpu_load_percent: int = 0
    memory_used_percent: int = 0
    active_tasks: int = 0
    queued_tasks: int = 0

@dataclass
class AMPNode:
    node_id: int
    name: str
    role: NodeRole
    address: Optional[str] = None
    port: int = 7777
    capabilities: Set[str] = field(default_factory=set)
    health: NodeHealth = field(default_factory=NodeHealth)

    def to_dict(self):
        return {
            "id": self.node_id,
            "name": self.name,
            "role": self.role.value,
            "address": self.address,
            "port": self.port,
            "capabilities": list(self.capabilities),
            "health": asdict(self.health)
        }
