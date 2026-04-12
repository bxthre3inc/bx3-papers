"""
Agentic Orchestration Layer
ChatDev Methods → Agentic Native Rebuild

Modules:
- reasoning_stream  — Structured reasoning with citations
- phase_gates        — Conditional phase validation
- workflow_dag       — Learnable DAG templates
- ier_router         — Contextual bandits routing
- coherence_engine   — Parallel execution (Live Symphony native)

Usage:
    from orchestration import (
        ReasoningStream,
        PhaseGateSystem, Phase,
        WorkflowDAGEngine,
        IERRouter,
        CoherenceEngine
    )
"""

from orchestration.reasoning_stream import ReasoningStream
from orchestration.phase_gates import PhaseGateSystem, Phase, GateRules, GateResult
from orchestration.workflow_dag import WorkflowDAGEngine, WorkflowDAG, DAGNode, ExecutionPlan
from orchestration.ier_router import IERRouter, RoutingDecision, OutcomeFeedback
from orchestration.coherence_engine import CoherenceEngine, CoherencePlan, CoherenceTask

__all__ = [
    # Reasoning
    "ReasoningStream",
    # Phase Gates
    "PhaseGateSystem",
    "Phase",
    "GateRules",
    "GateResult",
    # Workflow DAG
    "WorkflowDAGEngine",
    "WorkflowDAG",
    "DAGNode",
    "ExecutionPlan",
    # IER Router
    "IERRouter",
    "RoutingDecision",
    "OutcomeFeedback",
    # Coherence Engine
    "CoherenceEngine",
    "CoherencePlan",
    "CoherenceTask",
]
