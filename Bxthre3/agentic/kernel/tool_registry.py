"""
Tool Registry Service — AgentOS Kernel
Bxthre3/agentic/kernel/tool_registry.py

Loads TOOL_MANIFEST.md at startup, validates all tool definitions,
and exposes them as a queryable service layer (in-process + HTTP).

Tier routing:
  T0 → executed directly (no block)
  T1 → logged + traced (no block)
  T2 → enqueued to ChairmanQueue before execution proceeds

Canonical reference: TOOL_MANIFEST.md (sibling file)
"""
import json
import hashlib
import logging
import re
from pathlib import Path
from typing import Optional, Literal
from enum import Enum
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone

logger = logging.getLogger("agentic.tool_registry")

# ─── Tier Enum ────────────────────────────────────────────────────────────────

class ToolTier(Enum):
    T0_AUTONOMOUS = "T0"
    T1_INTENTIONAL = "T1"
    T2_HITL = "T2"


class ExecutionPolicy(Enum):
    ALLOW = "allow"
    LOG_ONLY = "log_only"
    ENQUEUE_CHAIRMAN = "enqueue_chairman"


# ─── Data Models ──────────────────────────────────────────────────────────────

@dataclass
class ToolParameter:
    name: str
    type: str
    description: str
    required: bool
    default: Optional[str] = None
    enum_values: Optional[list[str]] = None


@dataclass
class ToolDefinition:
    name: str
    tier: ToolTier
    description: str
    category: str
    parameters: list[ToolParameter]
    lfm_syntax: str                           # e.g. get_weather(city="<str>")
    intent_format: str                        # e.g. INTENT: get_weather
    examples: list[str]
    execution_policy: ExecutionPolicy
    hitl_reason: Optional[str] = None         # why T2 requires HITL
    tags: list[str] = field(default_factory=list)
    hash: str = ""                            # sha256 of definition


@dataclass
class ToolInvocation:
    tool_name: str
    agent_id: str
    agent_did: str
    parameters: dict
    tier: ToolTier
    invoked_at: str
    context_hash: str
    parent_job_id: Optional[str] = None
    execution_policy: ExecutionPolicy = ExecutionPolicy.ALLOW
    enqueued_item_id: Optional[str] = None   # set if policy=ENQUEUE_CHAIRMAN


# ─── Registry ─────────────────────────────────────────────────────────────────

class ToolRegistry:
    """
    In-process tool registry. Load once, query forever.
    Thread-safe for reads. Write access is only via reload().
    """

    def __init__(self, manifest_path: Optional[Path] = None):
        self._tools: dict[str, ToolDefinition] = {}
        self._by_category: dict[str, list[ToolDefinition]] = {}
        self._by_tier: dict[ToolTier, list[ToolDefinition]] = {}
        self._manifest_path = manifest_path or self._default_manifest()
        self._loaded_at: Optional[str] = None
        self._manifest_hash: str = ""
        self.load()

    def _default_manifest(self) -> Path:
        return Path(__file__).parent.parent.parent.parent / "agentic" / "TOOL_MANIFEST.md"

    # ── Load ──────────────────────────────────────────────────────────────────

    def load(self) -> dict[str, int]:
        """
        Parse TOOL_MANIFEST.md and populate the registry.
        Returns summary: {"loaded": N, "errors": M, "by_tier": {...}}
        """
        self._tools.clear()
        self._by_category.clear()
        self._by_tier.clear()

        path = self._manifest_path
        if not path.exists():
            logger.error(f"[ToolRegistry] Manifest not found: {path}")
            return {"loaded": 0, "errors": 1, "by_tier": {}}

        raw = path.read_text()
        self._manifest_hash = hashlib.sha256(raw.encode()).hexdigest()

        tools = self._parse_manifest(raw)
        errors = 0

        for td in tools:
            try:
                self._validate(td)
                td.hash = self._compute_hash(td)
                self._tools[td.name] = td

                cat = td.category
                if cat not in self._by_category:
                    self._by_category[cat] = []
                self._by_category[cat].append(td)

                tier = td.tier
                if tier not in self._by_tier:
                    self._by_tier[tier] = []
                self._by_tier[tier].append(td)
            except Exception as e:
                logger.warning(f"[ToolRegistry] Invalid tool '{getattr(td, 'name', '?')}': {e}")
                errors += 1

        self._loaded_at = datetime.now(timezone.utc).isoformat()
        tier_counts = {t.value: len(self._by_tier.get(t, [])) for t in ToolTier}
        logger.info(f"[ToolRegistry] Loaded {len(self._tools)} tools from {path.name} | tiers: {tier_counts}")
        return {"loaded": len(self._tools), "errors": errors, "by_tier": tier_counts}

    def _parse_manifest(self, raw: str) -> list[ToolDefinition]:
        """
        Parse the markdown manifest into ToolDefinition objects.
        Format per tool:
          ### ToolName
          - **Tier:** T0 / T1 / T2
          - **Category:** ...
          - **Description:** ...
          - **LFMSyntax:** get_weather(city="<str>")
          - **IntentFormat:** INTENT: get_weather
          - **ExecutionPolicy:** allow | log_only | enqueue_chairman
          - **HITLReason:** (T2 only) ...
          - **Tags:** tag1, tag2
          - **Examples:**
            - `example1`
            - `example2`
          - **Parameters:**
            - `name` (type, required): description
        """
        tools = []
        # Split on tool headers
        tool_sections = re.split(r"\n(?=### )", raw)

        for section in tool_sections:
            if not section.strip().startswith("### "):
                continue

            header = re.search(r"^### (\S+)", section)
            if not header:
                continue

            name = header.group(1).strip()
            tier_raw = self._extract_field(section, "Tier")
            tier = self._tier_from_str(tier_raw)
            category = self._extract_field(section, "Category") or "uncategorized"
            description = self._extract_field(section, "Description") or ""
            lfm_syntax = self._extract_field(section, "LFMSyntax") or f"{name}()"
            intent_format = self._extract_field(section, "IntentFormat") or f"INTENT: {name}"
            exec_raw = self._extract_field(section, "ExecutionPolicy") or "allow"
            exec_policy = self._exec_policy_from_str(exec_raw)
            hitl_reason = self._extract_field(section, "HITLReason")
            tags_raw = self._extract_field(section, "Tags")
            tags = [t.strip() for t in tags_raw.split(",")] if tags_raw else []
            examples = re.findall(r"^\s*-\s+`([^`]+)`", section, re.MULTILINE)
            if not examples:
                examples = re.findall(r"^\s*-\s+(.+)$", section, re.MULTILINE)

            params = self._parse_parameters(section)

            tools.append(ToolDefinition(
                name=name,
                tier=tier,
                description=description,
                category=category,
                parameters=params,
                lfm_syntax=lfm_syntax,
                intent_format=intent_format,
                examples=examples,
                execution_policy=exec_policy,
                hitl_reason=hitl_reason,
                tags=tags,
            ))

        return tools

    def _extract_field(self, section: str, field: str) -> Optional[str]:
        patterns = [
            rf"- \*\*{field}:\*\* (.+)",
            rf"\*\*{field}:\*\* (.+)",
        ]
        for pat in patterns:
            m = re.search(pat, section)
            if m:
                return m.group(1).strip()
        return None

    def _tier_from_str(self, s: Optional[str]) -> ToolTier:
        mapping = {"T0": ToolTier.T0_AUTONOMOUS, "T1": ToolTier.T1_INTENTIONAL, "T2": ToolTier.T2_HITL}
        return mapping.get(s, ToolTier.T1_INTENTIONAL)

    def _exec_policy_from_str(self, s: str) -> ExecutionPolicy:
        mapping = {
            "allow": ExecutionPolicy.ALLOW,
            "log_only": ExecutionPolicy.LOG_ONLY,
            "enqueue_chairman": ExecutionPolicy.ENQUEUE_CHAIRMAN,
            "enqueue": ExecutionPolicy.ENQUEUE_CHAIRMAN,
        }
        return mapping.get(s.lower().strip(), ExecutionPolicy.LOG_ONLY)

    def _parse_parameters(self, section: str) -> list[ToolParameter]:
        params = []
        param_section = re.search(r"(?i)\*\*Parameters:\*\*(.+?)(?=\n### |\Z)", section, re.DOTALL)
        if not param_section:
            return params

        lines = param_section.group(1).strip().split("\n")
        for line in lines:
            # Format: - `name` (type, required|optional): description
            m = re.search(r"- `([^`]+)`\s*\(([^,]+),\s*(required|optional)\)\s*:\s*(.+)", line)
            if not m:
                continue
            name, ptype, req_opt, desc = m.groups()
            params.append(ToolParameter(
                name=name.strip(),
                type=ptype.strip(),
                required=(req_opt.strip() == "required"),
                description=desc.strip(),
            ))
        return params

    def _validate(self, td: ToolDefinition) -> None:
        if not td.name:
            raise ValueError("Tool name is required")
        if not re.match(r"^[a-z_][a-z0-9_]*$", td.name):
            raise ValueError(f"Tool name '{td.name}' must be snake_case")
        if td.tier == ToolTier.T2_HITL and td.execution_policy != ExecutionPolicy.ENQUEUE_CHAIRMAN:
            raise ValueError(f"T2 tool '{td.name}' must have enqueue_chairman policy")
        for ex in td.examples:
            if td.name not in ex and td.lfm_syntax.split("(")[0] not in ex:
                logger.debug(f"[ToolRegistry] Example for '{td.name}' may not reference tool name: {ex}")

    def _compute_hash(self, td: ToolDefinition) -> str:
        canonical = json.dumps({
            "name": td.name,
            "tier": td.tier.value,
            "category": td.category,
            "lfm_syntax": td.lfm_syntax,
            "parameters": [{"name": p.name, "type": p.type, "required": p.required} for p in td.parameters],
            "tags": sorted(td.tags),
        }, sort_keys=True)
        return hashlib.sha256(canonical.encode()).hexdigest()

    # ── Query ─────────────────────────────────────────────────────────────────

    def get(self, name: str) -> Optional[ToolDefinition]:
        return self._tools.get(name)

    def get_tier(self, name: str) -> Optional[ToolTier]:
        td = self._tools.get(name)
        return td.tier if td else None

    def get_policy(self, name: str) -> ExecutionPolicy:
        td = self._tools.get(name)
        return td.execution_policy if td else ExecutionPolicy.LOG_ONLY

    def list_all(self) -> list[ToolDefinition]:
        return list(self._tools.values())

    def list_by_tier(self, tier: ToolTier) -> list[ToolDefinition]:
        return list(self._by_tier.get(tier, []))

    def list_by_category(self, category: str) -> list[ToolDefinition]:
        return list(self._by_category.get(category, []))

    def categories(self) -> list[str]:
        return list(self._by_category.keys())

    def search(self, query: str) -> list[ToolDefinition]:
        q = query.lower()
        return [
            td for td in self._tools.values()
            if q in td.name.lower() or q in td.description.lower() or q in td.category.lower()
        ]

    def validate_invocation(self, tool_name: str, parameters: dict) -> tuple[bool, Optional[str]]:
        """
        Check if parameters are valid for the tool definition.
        Returns (valid, error_message).
        """
        td = self._tools.get(tool_name)
        if not td:
            return False, f"Tool '{tool_name}' not found in registry"

        for param in td.parameters:
            if param.required and param.name not in parameters:
                return False, f"Missing required parameter '{param.name}' for tool '{tool_name}'"

        for pname in parameters:
            if pname not in [par.name for par in td.parameters]:
                logger.warning(f"[ToolRegistry] Extra parameter '{pname}' passed to '{tool_name}'")

        return True, None

    # ── Audit ─────────────────────────────────────────────────────────────────

    def audit_report(self) -> dict:
        """Full registry state for compliance / auditing."""
        return {
            "loaded_at": self._loaded_at,
            "manifest_hash": self._manifest_hash,
            "manifest_path": str(self._manifest_path),
            "total_tools": len(self._tools),
            "by_tier": {
                "T0": len(self._by_tier.get(ToolTier.T0_AUTONOMOUS, [])),
                "T1": len(self._by_tier.get(ToolTier.T1_INTENTIONAL, [])),
                "T2": len(self._by_tier.get(ToolTier.T2_HITL, [])),
            },
            "by_category": {cat: len(tools) for cat, tools in self._by_category.items()},
            "all_tools": [
                {
                    "name": td.name,
                    "tier": td.tier.value,
                    "category": td.category,
                    "execution_policy": td.execution_policy.value,
                    "hash": td.hash,
                }
                for td in sorted(self._tools.values(), key=lambda t: t.name)
            ],
        }

    def reload(self) -> dict:
        """Reload the manifest from disk."""
        return self.load()


# ─── Singleton ────────────────────────────────────────────────────────────────

_registry: Optional[ToolRegistry] = None


def get_registry() -> ToolRegistry:
    global _registry
    if _registry is None:
        _registry = ToolRegistry()
    return _registry


def reload_registry() -> dict:
    return get_registry().reload()