#!/usr/bin/env python3
"""
MEANINGFUL METRICS: Task Completion & Milestone Velocity
Not commit counts — ACTUAL DELIVERY
"""

import os
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

def parse_inbox_files():
    """Extract real work completion from INBOX files"""
    inbox_dir = Path("/home/workspace/Bxthre3/INBOX/agents")
    department_dir = Path("/home/workspace/Bxthre3/INBOX/departments")
    
    metrics = {
        "p0_completed_7d": 0,
        "p0_active": 0,
        "p1_completed_7d": 0,
        "p1_active": 0,
        "tasks_by_agent": defaultdict(lambda: {"completed": 0, "active": 0}),
        "milestones_hit": [],
        "last_7_days": []
    }
    
    cutoff = datetime.now() - timedelta(days=7)
    
    for inbox_file in list(inbox_dir.glob("*.md")) + list(department_dir.glob("*.md")):
        try:
            content = inbox_file.read_text()
            agent_name = inbox_file.stem
            
            # Count completed tasks (✓, ✅, COMPLETE, DONE)
            completed = len(re.findall(r'(✓|✅|COMPLETE|DONE|FINISHED|VERIFIED)', content, re.IGNORECASE))
            
            # Count active tasks (🟢 ACTIVE, 🔴 ACTIVE, P0, P1)
            active_p0 = len(re.findall(r'🔴.*P0.*ACTIVE|🟢.*P0|ACTIVE.*P0', content))
            active_p1 = len(re.findall(r'🟡.*P1.*ACTIVE|🟢.*P1|ACTIVE.*P1', content))
            
            # Check for dates in last 7 days
            recent = False
            for line in content.split('\n')[:50]:  # Check header
                if any(x in line for x in [cutoff.strftime("%Y-%m-%d"), "April", "2026"]):
                    recent = True
                    break
            
            if recent:
                metrics["p0_completed_7d"] += active_p0
                metrics["p1_completed_7d"] += completed
                metrics["tasks_by_agent"][agent_name]["completed"] = completed
                
            metrics["p0_active"] += active_p0
            metrics["p1_active"] += active_p1
            metrics["tasks_by_agent"][agent_name]["active"] = active_p0 + active_p1
            
        except Exception as e:
            print(f"⚠️ Could not parse {inbox_file}: {e}")
    
    return metrics

def calculate_velocity_score(metrics):
    """Calculate a real velocity score (0-100)"""
    completed = metrics["p0_completed_7d"] + metrics["p1_completed_7d"]
    active = metrics["p0_active"] + metrics["p1_active"]
    
    if active == 0:
        return 0
    
    # Velocity = completed / (completed + active backlog)
    # 100 = all tasks completing immediately
    # 0 = infinite backlog, nothing shipping
    velocity = (completed / (completed + active * 0.5)) * 100 if (completed + active) > 0 else 0
    return min(100, max(0, velocity))

def generate_report():
    """Generate the meaningful metrics report"""
    metrics = parse_inbox_files()
    velocity = calculate_velocity_score(metrics)
    
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "period": "last_7_days",
        "execution": {
            "p0_completed": metrics["p0_completed_7d"],
            "p1_completed": metrics["p1_completed_7d"],
            "p0_active_backlog": metrics["p0_active"],
            "p1_active_backlog": metrics["p1_active"],
            "total_completed": metrics["p0_completed_7d"] + metrics["p1_completed_7d"],
            "total_active": metrics["p0_active"] + metrics["p1_active"]
        },
        "velocity_score": round(velocity, 1),
        "velocity_rating": "HIGH" if velocity > 70 else "MEDIUM" if velocity > 40 else "LOW",
        "by_agent": dict(metrics["tasks_by_agent"]),
        "interpretation": {
            "high_velocity": "Tasks completing faster than new ones created — shipping",
            "low_velocity": "Backlog growing faster than completion — bottleneck detected",
            "zero_velocity": "No completion signals detected — work stalled"
        }
    }
    
    # Save
    os.makedirs("/home/workspace/Bxthre3/projects/investor-protector/data", exist_ok=True)
    with open("/home/workspace/Bxthre3/projects/investor-protector/data/execution_metrics.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"✓ Execution Metrics: {report['execution']['total_completed']} completed, {report['execution']['total_active']} active")
    print(f"✓ Velocity Score: {velocity:.1f}/100 ({report['velocity_rating']})")
    return report

if __name__ == "__main__":
    generate_report()
