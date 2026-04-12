#!/usr/bin/env python3
"""Grant-to-Task Automation — Creates Agentic tasks from grant deadlines."""

import csv
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

PIPELINE_PATH = Path("/home/workspace/Bxthre3/grants/pipeline.csv")
TASKS_PATH = Path("/home/workspace/Bxthre3/INBOX/grant-tasks.json")

# Agentic API endpoint via MCP bridge
AGENTOS_API = "http://localhost:9999/api/agentic"

def load_pipeline():
    if not PIPELINE_PATH.exists():
        return []
    with open(PIPELINE_PATH) as f:
        return list(csv.DictReader(f))

def load_existing_tasks():
    if TASKS_PATH.exists():
        with open(TASKS_PATH) as f:
            return json.load(f)
    return {"tasks": [], "last_run": None}

def save_tasks(tasks):
    TASKS_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(TASKS_PATH, 'w') as f:
        json.dump(tasks, f, indent=2)

def days_until(deadline_str):
    try:
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
        return (deadline.date() - datetime.now().date()).days
    except ValueError:
        return None

def create_task_for_grant(grant, days_left):
    """Generate a task entry for this grant."""
    task_id = f"grant-{grant['id']}-{datetime.now().strftime('%Y%m%d')}"
    
    # P0 override: if notes contain P0 or LOI, escalate regardless of days
    notes = (grant.get('notes') or '').upper()
    if 'P0' in notes or 'LOI' in notes:
        priority = "P0"
    else:
        priority = "P0" if days_left <= 7 else "P1" if days_left <= 14 else "P2"
    
    return {
        "id": task_id,
        "grant_id": grant['id'],
        "grant_name": grant['grant_name'],
        "venture": grant['venture'],
        "funder": grant['funder'],
        "deadline": grant['deadline'],
        "days_left": days_left,
        "priority": priority,
        "action": f"{grant['stage']}: {grant['notes']}" if grant['notes'] else f"Prepare {grant['stage']} materials",
        "created_at": datetime.now().isoformat(),
        "assigned_to": "casey" if grant['venture'] in ['Irrig8'] else "maya",
        "status": "OPEN"
    }

def main():
    grants = load_pipeline()
    tasks_data = load_existing_tasks()
    today = datetime.now().date()
    
    new_tasks = []
    updated_count = 0
    
    print(f"Checking {len(grants)} grants for deadline tasks...")
    
    for grant in grants:
        deadline_str = grant.get("deadline", "")
        stage = grant.get("stage", "")
        
        if not deadline_str or stage in ["SUBMITTED", "AWARDED", "REJECTED", "ARCHIVED"]:
            continue
        
        days_left = days_until(deadline_str)
        if days_left is None or days_left < 0:
            continue
        
        # Create tasks for anything due within 45 days (was 30)
        if days_left <= 45:
            task = create_task_for_grant(grant, days_left)
            
            # Check if task already exists
            existing = [t for t in tasks_data["tasks"] if t["grant_id"] == grant["id"] and t["deadline"] == deadline_str]
            if not existing:
                new_tasks.append(task)
                print(f"  ⚠ NEW TASK: {grant['id']} ({grant['venture']}) — {grant['grant_name']}")
                print(f"     Due: {deadline_str} ({days_left} days) | Priority: {task['priority']}")
    
    if new_tasks:
        tasks_data["tasks"].extend(new_tasks)
        tasks_data["last_run"] = datetime.now().isoformat()
        save_tasks(tasks_data)
        
        # Also write to INBOX for immediate visibility
        inbox_note = f"""# Grant Task Alert — {datetime.now().strftime('%Y-%m-%d')}

## New Tasks Created: {len(new_tasks)}

"""
        for task in new_tasks:
            inbox_note += f"""### {task['priority']} | {task['grant_name']}
- **Grant ID:** {task['grant_id']}
- **Venture:** {task['venture']}
- **Deadline:** {task['deadline']} ({task['days_left']} days)
- **Action:** {task['action']}
- **Assigned:** @{task['assigned_to']}

"""
        
        inbox_path = Path(f"/home/workspace/Bxthre3/INBOX/grants-tasks-{datetime.now().strftime('%Y%m%d')}.md")
        inbox_path.write_text(inbox_note)
        
        print(f"\n✅ Created {len(new_tasks)} new grant tasks")
        print(f"📁 Saved to: {TASKS_PATH}")
        print(f"📧 INBOX alert: {inbox_path}")
    else:
        print(f"\n✓ No new tasks — all upcoming grants have existing reminders")
    
    # Always show upcoming deadlines
    print("\n" + "="*50)
    print("UPCOMING DEADLINES (Next 30 Days)")
    print("="*50)
    
    upcoming = []
    for grant in grants:
        deadline_str = grant.get("deadline", "")
        if deadline_str:
            days_left = days_until(deadline_str)
            if days_left is not None and 0 <= days_left <= 30:
                upcoming.append((grant, days_left))
    
    if upcoming:
        for grant, days_left in sorted(upcoming, key=lambda x: x[1]):
            flag = "🔴" if days_left <= 7 else "🟡" if days_left <= 14 else "🟢"
            print(f"  {flag} {grant['id']}: {grant['grant_name']}")
            print(f"     Due: {grant['deadline']} ({days_left} days) | {grant['venture']}")
    else:
        print("  No deadlines in next 30 days.")

if __name__ == "__main__":
    main()
