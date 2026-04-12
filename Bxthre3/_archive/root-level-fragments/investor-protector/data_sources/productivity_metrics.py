#!/usr/bin/env python3
"""
Productivity Metrics Collector for Investor Protector
Tracks agent activity, task completion, milestone velocity
"""

import os
import json
from datetime import datetime
from pathlib import Path

def count_agent_commits():
    """Count git commits by agent (if any)"""
    return {}

def parse_inbox_activity():
    """Parse agent inbox files for activity indicators"""
    inbox_dir = Path("/home/workspace/Bxthre3/INBOX/agents")
    if not inbox_dir.exists():
        return {}
    
    agent_activity = {}
    for agent_file in inbox_dir.glob("*.md"):
        agent_name = agent_file.stem
        content = agent_file.read_text()
        
        # Count tasks assigned/completed
        p0_count = content.count("🔴 P0")
        p1_count = content.count("🟡 P1")
        completed = content.count("✅")
        
        agent_activity[agent_name] = {
            "p0_active": p0_count,
            "p1_active": p1_count,
            "completed": completed
        }
    
    return agent_activity

def collect_productivity():
    """Collect productivity metrics"""
    metrics = {
        "timestamp": datetime.utcnow().isoformat(),
        "agents_active": parse_inbox_activity(),
        "tasks_total": 0,  # Calculate from agent_activity
        "tasks_completed_week": 0,
        "milestones_total": 0,
        "milestones_completed": 0
    }
    
    # Save to data directory
    os.makedirs("/home/workspace/Bxthre3/projects/investor-protector/data", exist_ok=True)
    path = "/home/workspace/Bxthre3/projects/investor-protector/data/productivity_metrics.json"
    with open(path, "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✓ Productivity metrics saved: {path}")
    return metrics

if __name__ == "__main__":
    collect_productivity()
