"""
Agentic Workflow Templates
Pre-built DAGs for Bxthre3 verticals
"""
import sqlite3, uuid
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

TEMPLATES = {
    "Grant Writing": {
        "description": "Research → Draft → Review → Submit",
        "task_type": "grant-writing",
        "nodes": [
            {"id": "discover", "name": "Discover Opportunities", "agent": "casey", "phase": "ANALYZE", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "assess", "name": "Assess Fit & Priority", "agent": "casey", "phase": "PLAN", "can_parallel_with": [], "estimated_duration_minutes": 20},
            {"id": "budget", "name": "Draft Budget", "agent": "casey", "phase": "EXECUTE", "can_parallel_with": ["tech-narrative"], "estimated_duration_minutes": 40},
            {"id": "tech-narrative", "name": "Write Technical Narrative", "agent": "alex", "phase": "EXECUTE", "can_parallel_with": ["budget"], "estimated_duration_minutes": 120},
            {"id": "ip-review", "name": "IP Review", "agent": "iris", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "final-review", "name": "Final Review", "agent": "casey", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 45},
            {"id": "submit", "name": "Submit Application", "agent": "casey", "phase": "COMPLETE", "can_parallel_with": [], "estimated_duration_minutes": 15},
        ],
        "edges": [
            ("discover", "assess"),
            ("assess", "budget"),
            ("assess", "tech-narrative"),
            ("budget", "final-review"),
            ("tech-narrative", "ip-review"),
            ("ip-review", "final-review"),
            ("final-review", "submit"),
        ],
    },
    "VPC Investor": {
        "description": "Due Diligence → Term Sheet → Close",
        "task_type": "vpc-investor",
        "nodes": [
            {"id": "duediligence", "name": "Due Diligence", "agent": "erica", "phase": "ANALYZE", "can_parallel_with": [], "estimated_duration_minutes": 60},
            {"id": "valuation", "name": "DVC Valuation", "agent": "drew", "phase": "EXECUTE", "can_parallel_with": ["deck-prep"], "estimated_duration_minutes": 45},
            {"id": "deck-prep", "name": "Pitch Deck Preparation", "agent": "alex", "phase": "EXECUTE", "can_parallel_with": ["valuation"], "estimated_duration_minutes": 60},
            {"id": "termsheet", "name": "Term Sheet Generation", "agent": "erica", "phase": "PLAN", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "legal-review", "name": "Legal Review", "agent": "iris", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 45},
            {"id": "close", "name": "Close Transaction", "agent": "erica", "phase": "COMPLETE", "can_parallel_with": [], "estimated_duration_minutes": 30},
        ],
        "edges": [
            ("duediligence", "valuation"),
            ("duediligence", "deck-prep"),
            ("valuation", "termsheet"),
            ("deck-prep", "termsheet"),
            ("termsheet", "legal-review"),
            ("legal-review", "close"),
        ],
    },
    "Irrig8 Deployment": {
        "description": "Survey → Configure → Deploy → Monitor",
        "task_type": "irrig8-deployment",
        "nodes": [
            {"id": "site-survey", "name": "Site Survey & Soil Analysis", "agent": "casey", "phase": "ANALYZE", "can_parallel_with": [], "estimated_duration_minutes": 60},
            {"id": "hardware-plan", "name": "Hardware & Sensor Plan", "agent": "drew", "phase": "PLAN", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "config-sensor", "name": "Configure Sensor Suite", "agent": "drew", "phase": "EXECUTE", "can_parallel_with": ["config-software"], "estimated_duration_minutes": 45},
            {"id": "config-software", "name": "Configure Irrig8 OS", "agent": "drew", "phase": "EXECUTE", "can_parallel_with": ["config-sensor"], "estimated_duration_minutes": 30},
            {"id": "deploy", "name": "Field Deployment", "agent": "casey", "phase": "EXECUTE", "can_parallel_with": [], "estimated_duration_minutes": 120},
            {"id": "docs", "name": "Documentation & Training", "agent": "alex", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 45},
            {"id": "monitor", "name": "Activate Monitoring", "agent": "pulse", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 15},
            {"id": "commission", "name": "Commission & Handover", "agent": "erica", "phase": "COMPLETE", "can_parallel_with": [], "estimated_duration_minutes": 20},
        ],
        "edges": [
            ("site-survey", "hardware-plan"),
            ("hardware-plan", "config-sensor"),
            ("hardware-plan", "config-software"),
            ("config-sensor", "deploy"),
            ("config-software", "deploy"),
            ("deploy", "docs"),
            ("deploy", "monitor"),
            ("docs", "commission"),
            ("monitor", "commission"),
        ],
    },
    "Patent Filing": {
        "description": "Research → Draft → Review → File",
        "task_type": "patent-filing",
        "nodes": [
            {"id": "prior-art", "name": "Prior Art Search", "agent": "iris", "phase": "ANALYZE", "can_parallel_with": [], "estimated_duration_minutes": 60},
            {"id": "claim-draft", "name": "Draft Patent Claims", "agent": "alex", "phase": "PLAN", "can_parallel_with": [], "estimated_duration_minutes": 90},
            {"id": "tech-review", "name": "Technical Review", "agent": "drew", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "legal-review", "name": "Legal Review", "agent": "iris", "phase": "REVIEW", "can_parallel_with": [], "estimated_duration_minutes": 45},
            {"id": "finalize", "name": "Finalize Application", "agent": "alex", "phase": "EXECUTE", "can_parallel_with": [], "estimated_duration_minutes": 30},
            {"id": "file", "name": "File Provisional", "agent": "iris", "phase": "COMPLETE", "can_parallel_with": [], "estimated_duration_minutes": 20},
        ],
        "edges": [
            ("prior-art", "claim-draft"),
            ("claim-draft", "tech-review"),
            ("tech-review", "legal-review"),
            ("legal-review", "finalize"),
            ("finalize", "file"),
        ],
    },
}


def get_templates():
    return {k: {"description": v["description"], "task_type": v["task_type"], "nodes": v["nodes"]} for k, v in TEMPLATES.items()}


def init_workflow_db(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workflows (
            id TEXT PRIMARY KEY,
            template_name TEXT NOT NULL,
            task_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'planning'
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS workflow_executions (
            id TEXT PRIMARY KEY,
            workflow_id TEXT NOT NULL,
            node_id TEXT NOT NULL,
            agent_id TEXT,
            phase TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            started_at TEXT,
            completed_at TEXT,
            FOREIGN KEY (workflow_id) REFERENCES workflows(id)
        )
    """)
    conn.commit()
    return conn


def create_workflow(db_path, template_name, task_id):
    if template_name not in TEMPLATES:
        return {"error": f"Unknown template: {template_name}"}, 400
    conn = init_workflow_db(db_path)
    wf_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    conn.execute("INSERT INTO workflows (id, template_name, task_id, created_at) VALUES (?, ?, ?, ?)",
                (wf_id, template_name, task_id, now))
    for node in TEMPLATES[template_name]["nodes"]:
        conn.execute("INSERT INTO workflow_executions (id, workflow_id, node_id, agent_id, phase) VALUES (?, ?, ?, ?, ?)",
                    (str(uuid.uuid4()), wf_id, node["id"], node["agent"], node["phase"]))
    conn.commit()
    conn.close()
    return {"workflow_id": wf_id, "template": template_name, "task_id": task_id}


if __name__ == "__main__":
    db = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/workflows.db"
    import json
    # Seed templates
    for name, spec in TEMPLATES.items():
        r = create_workflow(db, name, f"TEMPLATE-{name.replace(' ', '-').upper()}")
        print(f"Created: {name} → workflow_id={r.get('workflow_id', r.get('error', '?'))}")
    print(f"\nAll templates: {list(TEMPLATES.keys())}")
