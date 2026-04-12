"""
Agentic Workflow DAG Engine
Replaces ChatDev MacNet — Learnable Templates, Not Fixed Topologies

Module: workflow_dag.py
Location: Bxthre3/projects/agentic/orchestration/workflow_dag.py
Status: IMPLEMENTED

Template-based DAGs with IER override capability.
"""

import sqlite3
import uuid
import json
import tempfile
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Optional
from enum import Enum


class DependencyType(str, Enum):
    NONE = "none"
    SOFT = "soft"
    HARD = "hard"
    CONFLICT = "conflict"


class NodeRole(str, Enum):
    COORDINATOR = "coordinator"
    EXECUTOR = "executor"
    VALIDATOR = "validator"
    ENRICHER = "enricher"


@dataclass
class DAGNode:
    id: str
    role: str
    agent_id: str = None
    depends_on: list[str] = field(default_factory=list)
    dep_type: str = DependencyType.NONE.value
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return asdict(self)

    @staticmethod
    def from_dict(d: dict) -> 'DAGNode':
        return DAGNode(
            id=d["id"],
            role=d["role"],
            agent_id=d.get("agent_id"),
            depends_on=d.get("depends_on", []),
            dep_type=d.get("dep_type", DependencyType.NONE.value),
            metadata=d.get("metadata", {})
        )


@dataclass
class WorkflowDAG:
    id: str
    name: str
    task_type: str
    nodes: list[DAGNode] = field(default_factory=list)
    is_template: bool = False
    metadata: dict = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        d = asdict(self)
        d["nodes"] = [n.to_dict() for n in self.nodes]
        return d

    @staticmethod
    def from_dict(d: dict) -> 'WorkflowDAG':
        return WorkflowDAG(
            id=d["id"],
            name=d["name"],
            task_type=d["task_type"],
            nodes=[DAGNode.from_dict(n) for n in d.get("nodes", [])],
            is_template=d.get("is_template", False),
            metadata=d.get("metadata", {}),
            created_at=d.get("created_at", datetime.utcnow().isoformat())
        )


@dataclass
class ExecutionLayer:
    layer: int
    node_ids: list[str]
    can_parallel: bool = True


@dataclass
class ExecutionPlan:
    dag: WorkflowDAG
    task_id: str
    layers: list[ExecutionLayer]
    estimated_duration_minutes: float


# ─────────────────────────────────────────────────────────────────
# DAG TEMPLATES
# ─────────────────────────────────────────────────────────────────

def research_dag_template() -> WorkflowDAG:
    """Template for research tasks."""
    return WorkflowDAG(
        id="tmpl_research",
        name="Research Workflow",
        task_type="research",
        is_template=True,
        nodes=[
            DAGNode(id="n0", role=NodeRole.COORDINATOR.value, depends_on=[], dep_type=DependencyType.NONE.value),
            DAGNode(id="n1", role=NodeRole.EXECUTOR.value, depends_on=["n0"], dep_type=DependencyType.HARD.value),
            DAGNode(id="n2", role=NodeRole.ENRICHER.value, depends_on=["n1"], dep_type=DependencyType.SOFT.value),
            DAGNode(id="n3", role=NodeRole.VALIDATOR.value, depends_on=["n2"], dep_type=DependencyType.HARD.value),
        ]
    )


def grant_dag_template() -> WorkflowDAG:
    """Template for grant tasks."""
    return WorkflowDAG(
        id="tmpl_grant",
        name="Grant Workflow",
        task_type="grant",
        is_template=True,
        nodes=[
            DAGNode(id="n0", role=NodeRole.COORDINATOR.value, depends_on=[], dep_type=DependencyType.NONE.value),
            DAGNode(id="n1", role=NodeRole.EXECUTOR.value, depends_on=["n0"], dep_type=DependencyType.HARD.value),
            DAGNode(id="n2", role=NodeRole.VALIDATOR.value, depends_on=["n1"], dep_type=DependencyType.HARD.value),
            DAGNode(id="n3", role=NodeRole.ENRICHER.value, depends_on=["n1"], dep_type=DependencyType.SOFT.value),
            DAGNode(id="n4", role=NodeRole.COORDINATOR.value, depends_on=["n2", "n3"], dep_type=DependencyType.HARD.value),
        ]
    )


def code_dag_template() -> WorkflowDAG:
    """Template for code tasks."""
    return WorkflowDAG(
        id="tmpl_code",
        name="Code Workflow",
        task_type="code",
        is_template=True,
        nodes=[
            DAGNode(id="n0", role=NodeRole.COORDINATOR.value, depends_on=[], dep_type=DependencyType.NONE.value),
            DAGNode(id="n1", role=NodeRole.EXECUTOR.value, depends_on=["n0"], dep_type=DependencyType.HARD.value),
            DAGNode(id="n2", role=NodeRole.VALIDATOR.value, depends_on=["n1"], dep_type=DependencyType.HARD.value),
            DAGNode(id="n3", role=NodeRole.EXECUTOR.value, depends_on=["n1"], dep_type=DependencyType.SOFT.value),
            DAGNode(id="n4", role=NodeRole.COORDINATOR.value, depends_on=["n2", "n3"], dep_type=DependencyType.HARD.value),
        ]
    )


DAG_TEMPLATES: dict[str, callable] = {
    "research": research_dag_template,
    "grant": grant_dag_template,
    "code": code_dag_template,
}


# ─────────────────────────────────────────────────────────────────
# WORKFLOW DAG ENGINE CLASS
# ─────────────────────────────────────────────────────────────────

class WorkflowDAGEngine:
    """
    Manages workflow DAGs with template support and IER overrides.
    
    ChatDev MacNet: Fixed DAG topology, no learning.
    Agentic WorkflowDAG: Templates + IER can override agent assignments.
    """

    DB_SCHEMA = """
    CREATE TABLE IF NOT EXISTS workflow_dags (
        id           TEXT PRIMARY KEY,
        dag_json     TEXT NOT NULL,
        is_template  INTEGER NOT NULL DEFAULT 0,
        task_id      TEXT,
        created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_dag_task    ON workflow_dags(task_id);
    CREATE INDEX IF NOT EXISTS idx_dag_tmpl   ON workflow_dags(is_template);
    """

    def __init__(self, db_path: str = "agentic_workflow_dag.db", ier_router=None):
        self.db_path = db_path
        self.ier_router = ier_router
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(self.DB_SCHEMA)

    def resolve(self, task: dict, task_type: str = None) -> WorkflowDAG:
        """
        Resolve DAG for a task: template → IER override → concrete DAG.
        """
        tt = task_type or task.get("type", "general")
        template_fn = DAG_TEMPLATES.get(tt, DAG_TEMPLATES.get("research"))
        dag = template_fn()

        # IER override if available
        if self.ier_router:
            dag = self.ier_router.apply_overrides(dag, task)

        # Save instantiated DAG
        self._save_dag(dag, task_id=task.get("id"))
        return dag

    def compute_layers(self, dag: WorkflowDAG) -> list[ExecutionLayer]:
        """
        Topological sort into execution layers.
        Nodes with no deps → Layer 0.
        Nodes with all deps satisfied → next available layer.
        """
        node_map = {n.id: n for n in dag.nodes}
        assigned = set()
        layers = []

        while len(assigned) < len(dag.nodes):
            layer_nodes = []
            for node in dag.nodes:
                if node.id in assigned:
                    continue
                deps_satisfied = all(d in assigned for d in node.depends_on)
                if deps_satisfied:
                    layer_nodes.append(node.id)

            if not layer_nodes:
                break  # Circular dependency

            layers.append(ExecutionLayer(
                layer=len(layers),
                node_ids=layer_nodes,
                can_parallel=True
            ))
            assigned.update(layer_nodes)

        return layers

    def get_plan(self, task: dict, task_type: str = None) -> ExecutionPlan:
        """Get full execution plan for a task."""
        dag = self.resolve(task, task_type)
        layers = self.compute_layers(dag)
        estimated = self._estimate_duration(dag, layers)
        return ExecutionPlan(
            dag=dag,
            task_id=task.get("id", "unknown"),
            layers=layers,
            estimated_duration_minutes=estimated
        )

    def to_mermaid(self, dag: WorkflowDAG) -> str:
        """Generate Mermaid diagram for visualization."""
        lines = ["graph TD"]
        for node in dag.nodes:
            label = f"{node.role}"
            if node.agent_id:
                label += f"\n({node.agent_id})"
            lines.append(f'    {node.id}["{label}"]')
        for node in dag.nodes:
            for dep in node.depends_on:
                style = ""
                if node.dep_type == DependencyType.HARD.value:
                    style = " -.->|hard|"
                elif node.dep_type == DependencyType.SOFT.value:
                    style = " -.->|soft|"
                elif node.dep_type == DependencyType.CONFLICT.value:
                    style = " ==>|CONFLICT|"
                else:
                    style = " -->"
                lines.append(f"    {dep}{style}{node.id}")
        return "\n".join(lines)

    def _estimate_duration(self, dag: WorkflowDAG, layers: list[ExecutionLayer]) -> float:
        """Rough estimate in minutes based on layer count."""
        return len(layers) * 15.0  # 15 min per layer average

    def _save_dag(self, dag: WorkflowDAG, task_id: str = None):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                """INSERT OR REPLACE INTO workflow_dags (id, dag_json, is_template, task_id, created_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (dag.id, json.dumps(dag.to_dict()), 1 if dag.is_template else 0,
                 task_id, datetime.utcnow().isoformat())
            )



def temp_db(name):
    """Return a temp file path for test DB. Cleans up on exit."""
    return os.path.join(tempfile.gettempdir(), f"agentic_test_{name}.db")

def main():
    """Demo usage."""
    engine = WorkflowDAGEngine(temp_db("rs"))

    task = {"id": "GRANT-2026-001", "type": "grant", "priority": "P1"}
    plan = engine.get_plan(task)

    print("=== Workflow DAG Engine Demo ===\n")
    print(f"Task: {plan.task_id}")
    print(f"DAG: {plan.dag.name} ({plan.dag.id})")
    print(f"Layers: {len(plan.layers)}")
    for layer in plan.layers:
        print(f"  Layer {layer.layer}: {layer.node_ids}")
    print(f"\nEstimated duration: {plan.estimated_duration_minutes} min")
    print(f"\nMermaid:\n{engine.to_mermaid(plan.dag)}")


if __name__ == "__main__":
    main()
