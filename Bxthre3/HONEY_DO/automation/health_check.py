#!/usr/bin/env python3
"""
Agentic Health Monitor — Runs every 15 minutes.
Checks: AMP server, disk, tasks, cost.
"""
import os
import sys
import json
import requests
from datetime import datetime

SERVER_URL = "http://localhost:8080"
LOG_FILE = "/home/workspace/Bxthre3/TELEMETRY/health_check.log"

def check_amp_server():
    """Check if AMP server is responding."""
    try:
        r = requests.get(f"{SERVER_URL}/health", timeout=5)
        if r.status_code == 200:
            data = r.json()
            return True, f"Server: {data.get('node', {}).get('name', 'unknown')}"
        return False, f"HTTP {r.status_code}"
    except Exception as e:
        return False, str(e)

def check_disk_space():
    """Check disk usage."""
    try:
        stat = os.statvfs("/home/workspace")
        used = (stat.f_blocks - stat.f_bavail) / stat.f_blocks * 100
        return used < 80, f"Disk: {used:.1f}%"
    except Exception as e:
        return False, f"Error: {e}"

def check_tasks():
    """Check for stuck tasks."""
    try:
        r = requests.get(f"{SERVER_URL}/tasks", timeout=5)
        if r.status_code == 200:
            data = r.json()
            tasks = data.get('tasks', [])
            stuck = [t for t in tasks if t.get('status') == 'IN_PROGRESS' 
                     and datetime.fromisoformat(t.get('created_at')) < datetime.now() - timedelta(hours=1)]
            return len(stuck) == 0, f"Tasks: {len(tasks)} total, {len(stuck)} stuck >1hr"
    except:
        return True, "Tasks: server down"

def check_maya_deadlines():
    """Check Maya SBIR output."""
    try:
        import subprocess
        result = subprocess.run(
            ['python3', '/home/workspace/Skills/maya-sbir-automation/scripts/maya.py', '--check'],
            capture_output=True, text=True, timeout=10
        )
        return result.returncode == 0, f"Maya: {'running' if result.returncode == 0 else 'FAILED'}"
    except:
        return False, "Maya: check failed"

def send_alert(check_name, status, details):
    """Send alert to INBOX if check fails."""
    if not status:
        alert = f"🔴 HEALTH ALERT: {check_name}\n  Details: {details}"
        try:
            result = subprocess.run([
                'python3', '/home/workspace/Bxthre3/INBOX/agents/INBOX_ROUTING.py',
                'sentinel', alert, 'P1'
            ], capture_output=True, text=True, timeout=10)
            return result.returncode
        except:
            with open(LOG_FILE, 'a') as f:
                f.write(f"{datetime.now().isoformat()} | ALERT: {check_name} | {details}\n")

def main():
    """Run all health checks."""
    print(f"[{datetime.now().strftime('%H:%M')}] Health check running...")
    
    checks = [
        ("AMP Server", check_amp_server),
        ("Disk Space", check_disk_space),
        ("Task Queue", check_tasks),
        ("Maya Deadlines", check_maya_deadlines)
    ]
    
    results = []
    for name, check_fn in checks:
        status, details = check_fn()
        results.append((name, status, details))
        print(f"  {'✅' if status else '❌'} {name}: {details}")
        if not status:
            send_alert(name, status, details)
    
    # Log results
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, 'a') as f:
        f.write(f"{datetime.now().isoformat()} | "
                f"{sum(1 for r in results if r[1])}/{len(results)} checks passed\n")
    
    return 0 if all(r[1] for r in results) else 1

if __name__ == '__main__':
    sys.exit(main())
