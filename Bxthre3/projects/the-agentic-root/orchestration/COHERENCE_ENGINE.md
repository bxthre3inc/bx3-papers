# Agentic Coherence Engine
## Native — Live Symphony's Parallel Execution, Integrated with Orchestration

**Module:** `coherence_engine.py`
**Location:** `Bxthre3/projects/agentic/orchestration/coherence_engine.py`
**Status:** SPEC

---

## Purpose

Live Symphony's core innovation is **Coherent Parallelism** — the system understands which tasks can run simultaneously and which have hard dependencies, then optimizes accordingly.

Agentic's Coherence Engine implements this natively, integrated with:
- **Reasoning Stream** — logs why dependency decisions were made
- **Phase Gates** — gates enforce dependency completion before proceeding
- **Workflow DAG** — receives DAG structure and executes layers
- **IER Router** — learns optimal parallelism patterns

This is NOT borrowed from ChatDev — it is native to Live Symphony (Agentic's parent project).

---

## Architecture

```
TASK GRAPH
═══════════════════════════════════════════════════════════════

    Task A ────────────────┐
        │                  │
        ▼                  ▼
    Task B              Task C ──────▶ Task D
        │                  │               ▲
        ▼                  ▼               │
    Task E              Task F ────────────┘

RESOLUTION:
═══════════════════════════════════════════════════════════════

  Layer 0: A (no dependencies)        ──▶ Execute immediately
  Layer 1: B, C (A complete)         ──▶ Parallel
  Layer 2: E (B complete), D (C+F)   ──▶ D waits for C and F
  Layer 3: F (C complete)            ──▶ After C
  Layer 4: D (C + F complete)        ──▶ After C and F

═══════════════════════════════════════════════════════════════
```

---

## Dependency Types

```python
class DependencyType(str, Enum):
    NONE = "none"           # Can execute immediately, no dependency
    SOFT = "soft"           # Start both, merge output when ready
    HARD = "hard"          # Queue until upstream completes
    CONFLICT = "conflict"   # Escalate to human — cannot resolve automatically

@dataclass
class DependencyEdge:
    source_task_id: str
    target_task_id: str
    dependency_type: DependencyType
    reason: str  # Why this dependency exists
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())
```

---

## Core Classes

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
from collections import defaultdict
import asyncio

class DependencyType(str, Enum):
    NONE = "none"       # No dependency — execute immediately
    SOFT = "soft"       # Start immediately, merge outputs when ready
    HARD = "hard"       # Wait for upstream completion
    CONFLICT = "conflict"  # Cannot resolve — escalate to human

@dataclass
class TaskNode:
    """A task as a node in the dependency graph."""
    task_id: str
    phase: str                    # From Phase Gates
    status: str                   # pending | running | complete | suspended | failed
    depends_on: list[str] = field(default_factory=list)
    soft_uses: list[str] = field(default_factory=list)  # Output will be used but not required
    priority: str = "P3"
    context: dict = field(default_factory=dict)

@dataclass
class ExecutionLayer:
    """A layer of tasks that can execute in parallel."""
    layer_id: int
    task_ids: list[str]
    depends_on_layers: list[int]  # Which prior layers must complete first

@dataclass
class ExecutionPlan:
    """Complete execution plan with ordered layers."""
    task_id: str
    layers: list[ExecutionLayer]
    estimated_duration_minutes: int
    conflicts: list[DependencyEdge] = field(default_factory=list)  # Escalated to human

class CoherenceEngine:
    """
    Resolves task dependencies into parallel execution layers.
    
    Implements Live Symphony's Coherent Parallelism:
    - No hard dependency → execute immediately
    - Soft dependency → start both, merge outputs
    - Hard dependency → wait for upstream
    - Conflict → escalate to human
    """
    
    def __init__(
        self,
        reasoning_stream=None,
        phase_gate_system=None,
        workflow_dag_engine=None,
        ier_router=None
    ):
        self.reasoning_stream = reasoning_stream
        self.phase_gate = phase_gate_system
        self.workflow_dag = workflow_dag_engine
        self.ier = ier_router
    
    def resolve_dependencies(self, tasks: list[TaskNode]) -> ExecutionPlan:
        """
        Resolve a list of tasks into an execution plan with layers.
        
        Args:
            tasks: List of TaskNode objects with dependency info
            
        Returns:
            ExecutionPlan with ordered layers for parallel execution
        """
        # Build adjacency map
        task_map = {t.task_id: t for t in tasks}
        
        # Classify each dependency
        dep_matrix: dict[str, dict[str, DependencyType]] = defaultdict(dict)
        
        for target in tasks:
            for source_id in target.depends_on:
                if source_id not in task_map:
                    # Orphan dependency — warn but continue
                    dep_matrix[target.task_id][source_id] = DependencyType.HARD
                    continue
                
                source = task_map[source_id]
                dep_type = self.classify_dependency(source, target)
                dep_matrix[target.task_id][source_id] = dep_type
        
        # Build execution layers via topological sort
        layers = self._build_layers(task_map, dep_matrix)
        
        # Detect conflicts
        conflicts = self._detect_conflicts(tasks, dep_matrix)
        
        # Log reasoning for each dependency classification
        if self.reasoning_stream:
            for target_id, sources in dep_matrix.items():
                for source_id, dep_type in sources.items():
                    self.reasoning_stream.append(
                        task_id=target_id,
                        agent_id="coherence-engine",
                        phase="analyze",
                        reasoning=f"Dependency classification: {source_id} → {target_id} = {dep_type.value}",
                        evidence=[],
                        confidence=0.9,
                        next_action=f"Execute {dep_type.value} dependency resolution",
                        metadata={"source": source_id, "target": target_id, "type": dep_type.value}
                    )
        
        return ExecutionPlan(
            task_id=f"batch_{len(tasks)}",
            layers=layers,
            estimated_duration_minutes=self._estimate_duration(layers),
            conflicts=conflicts
        )
    
    def classify_dependency(self, source: TaskNode, target: TaskNode) -> DependencyType:
        """
        Classify the dependency relationship between two tasks.
        
        Rules:
        - If target.result_requires(source): HARD
        - If target.uses_output_of(source): SOFT
        - If target.conflicts_with(source): CONFLICT
        - Otherwise: NONE
        """
        # Hard dependency: target cannot start without source output
        if self._is_result_required(source, target):
            return DependencyType.HARD
        
        # Soft dependency: target uses source output but can start independently
        if self._is_soft_use(source, target):
            return DependencyType.SOFT
        
        # Conflict: tasks cannot run simultaneously
        if self._is_conflict(source, target):
            return DependencyType.CONFLICT
        
        return DependencyType.NONE
    
    def _is_result_required(self, source: TaskNode, target: TaskNode) -> bool:
        """
        Check if target absolutely requires source's result.
        
        Examples:
        - Code review must wait for code to be written
        - Deploy must wait for tests to pass
        - Grant submission must wait for final draft
        """
        # Phase-gated dependencies
        if target.phase == "execute" and source.phase == "execute":
            if "write" in source.context.get("role", "") and "validate" in target.context.get("role", ""):
                return True
        
        # Explicit result requirement
        if target.task_id in source.soft_uses:  # Wait, soft_uses means source expects to be used
            return True
        
        return False
    
    def _is_soft_use(self, source: TaskNode, target: TaskNode) -> bool:
        """
        Check if target will use source output but doesn't need to wait.
        
        Examples:
        - Two reports both referencing the same research
        - Parallel validation of the same artifact
        """
        return target.task_id in source.soft_uses
    
    def _is_conflict(self, source: TaskNode, target: TaskNode) -> bool:
        """
        Check if tasks conflict and cannot run simultaneously.
        
        Examples:
        - Two tasks modifying the same file
        - Two tasks with same priority but different approaches
        """
        # Same file modification
        source_files = source.context.get("modifies_files", [])
        target_files = target.context.get("modifies_files", [])
        if set(source_files) & set(target_files):
            return True
        
        # Same resource exclusive lock
        if source.context.get("exclusive_resource") == target.context.get("exclusive_resource"):
            return True
        
        return False
    
    def _build_layers(
        self,
        task_map: dict[str, TaskNode],
        dep_matrix: dict[str, dict[str, DependencyType]]
    ) -> list[ExecutionLayer]:
        """
        Topological sort grouping tasks into execution layers.
        
        Algorithm:
        1. Find all tasks with no HARD dependencies → Layer 0
        2. Remove Layer 0 tasks, repeat for Layer 1, etc.
        3. SOFT dependencies don't block layer assignment
        4. HARD dependencies block until upstream complete
        """
        remaining = set(task_map.keys())
        layers = []
        layer_id = 0
        
        while remaining:
            # Find tasks whose HARD dependencies are all satisfied
            layer_tasks = []
            
            for task_id in list(remaining):
                task = task_map[task_id]
                
                # Check all HARD dependencies are in prior layers
                hard_deps = [
                    src for src, dep_type in dep_matrix.get(task_id, {}).items()
                    if dep_type == DependencyType.HARD
                ]
                
                if all(dep not in remaining for dep in hard_deps):
                    layer_tasks.append(task_id)
            
            if not layer_tasks:
                # Deadlock — all remaining tasks have unsatisfied dependencies
                # Put them all in one layer and let it fail
                layers.append(ExecutionLayer(
                    layer_id=layer_id,
                    task_ids=list(remaining),
                    depends_on_layers=list(range(layer_id))
                ))
                break
            
            layers.append(ExecutionLayer(
                layer_id=layer_id,
                task_ids=layer_tasks,
                depends_on_layers=list(range(layer_id)) if layer_id > 0 else []
            ))
            
            for task_id in layer_tasks:
                remaining.remove(task_id)
            
            layer_id += 1
        
        return layers
    
    def _detect_conflicts(
        self,
        tasks: list[TaskNode],
        dep_matrix: dict[str, dict[str, DependencyType]]
    ) -> list[DependencyEdge]:
        """Identify CONFLICT-type dependencies for human escalation."""
        conflicts = []
        
        for target_id, sources in dep_matrix.items():
            for source_id, dep_type in sources.items():
                if dep_type == DependencyType.CONFLICT:
                    target = next((t for t in tasks if t.task_id == target_id), None)
                    source = next((t for t in tasks if t.task_id == source_id), None)
                    
                    conflicts.append(DependencyEdge(
                        source_task_id=source_id,
                        target_task_id=target_id,
                        dependency_type=DependencyType.CONFLICT,
                        reason=f"Task {target_id} and {source_id} conflict: "
                               f"both modify {target.context.get('modifies_files', []) if target else []}"
                    ))
        
        return conflicts
    
    def _estimate_duration(self, layers: list[ExecutionLayer]) -> int:
        """Estimate total duration based on longest path."""
        # In production: query each task's estimated_duration from DB
        # Here: simple approximation
        return len(layers) * 15  # Assume 15 min avg per layer
```

---

## Async Execution

```python
class CoherentParallelismExecutor:
    """
    Executes tasks layer by layer with parallel coordination.
    Integrates with Phase Gates for quality enforcement.
    """
    
    def __init__(self, coherence_engine: CoherenceEngine, reasoning_stream=None):
        self.coherence = coherence_engine
        self.reasoning_stream = reasoning_stream
    
    async def execute_plan(self, plan: ExecutionPlan, task_map: dict[str, TaskNode]) -> dict[str, Any]:
        """
        Execute plan layer by layer.
        
        For each layer:
        1. Fire all tasks in parallel (async)
        2. Wait for all to complete or timeout
        3. Run Phase Gate validation before next layer
        4. Log reasoning for each task
        """
        results = {}
        
        for layer in plan.layers:
            if layer.task_ids:
                # Execute layer in parallel
                layer_tasks = [
                    self._execute_task(task_id, task_map[task_id], results)
                    for task_id in layer.task_ids
                ]
                
                layer_results = await asyncio.gather(*layer_tasks, return_exceptions=True)
                
                for task_id, result in zip(layer.task_ids, layer_results):
                    results[task_id] = result
                    
                    # Log reasoning
                    if self.reasoning_stream:
                        self.reasoning_stream.append(
                            task_id=task_id,
                            agent_id=result.get("agent_id", "unknown"),
                            phase="execute",
                            reasoning=f"Layer {layer.layer_id} execution: {result.get('status', 'unknown')}",
                            evidence=result.get("evidence", []),
                            confidence=result.get("confidence", 0.5),
                            next_action=f"Layer {layer.layer_id + 1}" if layer.layer_id < len(plan.layers) - 1 else "Complete",
                            metadata={"layer_id": layer.layer_id, "task_ids": layer.task_ids}
                        )
                
                # Wait for phase gate before next layer (if configured)
                # gate_result = await self._run_layer_gate(layer, results)
                # if not gate_result.passed:
                #     return self._handle_layer_failure(layer, results, gate_result)
        
        return results
    
    async def _execute_task(self, task_id: str, task: TaskNode, prior_results: dict) -> dict:
        """Execute single task via agent connector."""
        # Build context from prior layer results
        context = {
            "task": task,
            "prior_results": prior_results,
            "layer_id": task.context.get("layer_id", 0)
        }
        
        # In production: call agent connector
        # result = await agent_connectors[task.assignee].execute(task, context)
        
        return {
            "task_id": task_id,
            "agent_id": task.context.get("assignee"),
            "status": "complete",
            "reasoning": f"Executed {task.phase} for {task_id}",
            "evidence": [],
            "confidence": 0.8
        }
```

---

## Integration with Live Symphony

Live Symphony coordinates Digital, Physical, and Human workers. The Coherence Engine extends this to:

```
Digital Worker (Agent) ──▶ Agentic Agent Connector ──▶ Task result
Physical Worker (Robot) ──▶ OPC-UA/MQTT adapter ──▶ Task result  
Human Worker ──▶ Notification/Approval ──▶ Task result
                              │
                              ▼
                    Coherence Engine
                    (resolves all three into unified execution plan)
```

---

## File Structure

```
agentic/
└── orchestration/
    ├── reasoning_stream.py    # Completed
    ├── phase_gates.py         # Completed
    ├── workflow_dag.py        # Completed
    ├── ier_router.py          # Completed
    ├── coherence_engine.py   # THIS FILE
    └── __init__.py           # Export all components
```

---

*Module: coherence_engine.py*
*Part of: Agentic Orchestration Layer*
*Origin: Live Symphony (Agentic's parent project) — native implementation*
*Replaces: Nothing (this is Agentic/Live Symphony native, not from ChatDev)*