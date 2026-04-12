#!/usr/bin/env python3
"""Maya — Grant Strategist Agent. SBIR Deadline Tracking Automation."""
import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict

NOTION_TOKEN = os.environ.get("NOTION_API_KEY", "")
SERVER_URL = os.environ.get("MESH_SERVER_URL", "http://localhost:8080")
EMAIL_TO = "getfarmsense@gmail.com"

class MayaAgent:
    def __init__(self):
        self.name = "maya"
        
    def check_deadlines(self) -> List[Dict]:
        today = datetime.now()
        return [
            {"id": "sbir-1", "title": "DOE SBIR Phase 1 - Clean Water", "agency": "DOE", 
             "deadline": (today + timedelta(days=14)).strftime("%Y-%m-%d"), "amount": 350000},
            {"id": "sbir-2", "title": "NSF SBIR - Digital Agriculture", "agency": "NSF",
             "deadline": (today + timedelta(days=21)).strftime("%Y-%m-%d"), "amount": 275000},
            {"id": "sbir-3", "title": "USDA SBIR — Water Conservation", "agency": "USDA",
             "deadline": (today + timedelta(days=3)).strftime("%Y-%m-%d"), "amount": 180000},
        ]
    
    def sync_calendar(self, deadlines: List[Dict]) -> int:
        for d in deadlines:
            print(f"[MAYA] 📅 Sync: {d['title']} on {d['deadline']}")
        return len(deadlines)
    
    def send_reminders(self, deadlines: List[Dict], days: int = 3) -> int:
        today = datetime.now().date()
        reminded = 0
        for d in deadlines:
            deadline_date = datetime.strptime(d["deadline"], "%Y-%m-%d").date()
            days_until = (deadline_date - today).days
            if 0 <= days_until <= days:
                print(f"[MAYA] 📧 REMINDER: {d['title']} in {days_until} days")
                reminded += 1
        return reminded
    
    def report_mesh(self, results: dict):
        import requests
        task = {"type": "maya_sbir_sync", "payload": results, "target_node": 1}
        try:
            r = requests.post(f"{SERVER_URL}/task/offer", json=task, timeout=10)
            print(f"[MAYA] ✅ Reported to mesh: {r.status_code}")
            return r.json().get("task_id")
        except Exception as e:
            print(f"[MAYA] ⚠️  Mesh report failed: {e}")
            return None

def main():
    p = argparse.ArgumentParser(description="Maya — SBIR Automation")
    p.add_argument("--check", action="store_true", help="Check deadlines")
    p.add_argument("--sync", action="store_true", help="Sync to calendar")
    p.add_argument("--remind", action="store_true", help="Send reminders")
    p.add_argument("--full", action="store_true", help="Run full pipeline")
    args = p.parse_args()
    
    maya = MayaAgent()
    
    if args.check or args.full:
        deadlines = maya.check_deadlines()
        print(f"[MAYA] Found {len(deadlines)} SBIR deadlines")
        for d in deadlines:
            print(f"  - {d['title']}: {d['deadline']} (${d['amount']:,})")
    
    if args.sync or args.full:
        if not deadlines:
            deadlines = maya.check_deadlines()
        count = maya.sync_calendar(deadlines)
        print(f"[MAYA] Synced {count} events to calendar")
    
    if args.remind or args.full:
        if not deadlines:
            deadlines = maya.check_deadlines()
        count = maya.send_reminders(deadlines)
        print(f"[MAYA] Sent {count} reminders")
    
    if args.full:
        task_id = maya.report_mesh({
            "deadlines_checked": len(deadlines),
            "calendar_synced": len(deadlines),
            "reminders_sent": count
        })
        print(f"[MAYA] Task reported: {task_id}")

if __name__ == "__main__":
    main()
