#!/usr/bin/env python3
"""
Meeting Helper Utilities — Agentic Meeting Infrastructure
Handles Google Calendar integration for meeting orchestration.
"""

import json
import sys
from datetime import datetime, timedelta
from typing import Optional

# Configuration
TIMEZONE = "America/Denver"
ORG_CHART_PATH = "/home/workspace/Bxthre3/agentic-v2/ORG-CHART.md"

# Meeting configurations
MEETINGS = {
    "daily-standup": {
        "summary": "Daily Department Standup",
        "start_hour": 8,
        "start_minute": 15,
        "duration_minutes": 15,
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "meet": True
    },
    "daily-warroom": {
        "summary": "Daily War Room",
        "start_hour": 16,
        "start_minute": 0,
        "duration_minutes": 30,
        "days": ["MON", "TUE", "WED", "THU", "FRI"],
        "meet": True
    },
    "weekly-board": {
        "summary": "Weekly Board Meeting",
        "start_hour": 14,
        "start_minute": 0,
        "duration_minutes": 60,
        "days": ["FRI"],
        "meet": True
    },
    "monthly-allhands": {
        "summary": "Monthly All-Hands",
        "start_hour": 15,
        "start_minute": 0,
        "duration_minutes": 60,
        "day_of_month": 1,
        "meet": True
    },
    "quarterly-qbr": {
        "summary": "Quarterly Business Review",
        "start_hour": 14,
        "start_minute": 0,
        "duration_minutes": 120,
        "qtr_days": [15],  # Mar, Jun, Sep, Dec
        "meet": True
    },
    "annual-summit": {
        "summary": "Annual Strategy Summit",
        "start_hour": 9,
        "start_minute": 0,
        "duration_minutes": 480,
        "month": 1,
        "day_of_month": 15,
        "meet": True
    }
}


def get_next_occurrence(meeting_type: str, from_date: Optional[datetime] = None) -> datetime:
    """Calculate next occurrence of a meeting."""
    if from_date is None:
        from_date = datetime.now()
    
    config = MEETINGS.get(meeting_type)
    if not config:
        raise ValueError(f"Unknown meeting type: {meeting_type}")
    
    # Start from today at the meeting time
    next_date = from_date.replace(
        hour=config["start_hour"],
        minute=config["start_minute"],
        second=0,
        microsecond=0
    )
    
    if "days" in config:
        # For daily/weekly meetings
        from datetime import time
        days_of_week = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
        
        while True:
            # If we're past the time today, move to tomorrow
            if next_date <= from_date:
                next_date += timedelta(days=1)
            
            # Check if it's the right day
            if next_date.strftime("%a").upper()[:3] in config["days"]:
                return next_date
            
            next_date += timedelta(days=1)
    
    elif "day_of_month" in config:
        # Monthly meetings
        while True:
            if next_date.day == config["day_of_month"] and next_date > from_date:
                return next_date
            
            # Move to next month
            if next_date.month == 12:
                next_date = next_date.replace(year=next_date.year + 1, month=1)
            else:
                next_date = next_date.replace(month=next_date.month + 1)
    
    elif "qtr_days" in config:
        # Quarterly meetings (Mar, Jun, Sep, Dec)
        qtr_months = [3, 6, 9, 12]
        
        while True:
            if next_date.month in qtr_months and next_date.day == 15 and next_date > from_date:
                return next_date
            
            # Move to next month
            if next_date.month == 12:
                next_date = next_date.replace(year=next_date.year + 1, month=1)
            else:
                next_date = next_date.replace(month=next_date.month + 1)
    
    return next_date


def format_calendar_datetime(dt: datetime) -> str:
    """Format datetime for Google Calendar API (RFC3339)."""
    return dt.strftime("%Y-%m-%dT%H:%M:%S-07:00")  # MT offset


def create_event_payload(meeting_type: str, start_dt: datetime, description: str = "") -> dict:
    """Create Google Calendar event payload."""
    config = MEETINGS.get(meeting_type)
    if not config:
        raise ValueError(f"Unknown meeting type: {meeting_type}")
    
    end_dt = start_dt + timedelta(minutes=config["duration_minutes"])
    
    payload = {
        "summary": config["summary"],
        "start": {
            "dateTime": format_calendar_datetime(start_dt),
            "timeZone": TIMEZONE
        },
        "end": {
            "dateTime": format_calendar_datetime(end_dt),
            "timeZone": TIMEZONE
        },
        "description": description,
        "createMeetRoom": config.get("meet", True)
    }
    
    return payload


def main():
    """CLI interface for meeting-helpers."""
    if len(sys.argv) < 2:
        print("Usage: meeting-helpers.py <command> [args]")
        print("Commands:")
        print("  next <meeting_type>     - Get next occurrence")
        print("  payload <meeting_type> - Get calendar event payload")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "next":
        if len(sys.argv) < 3:
            print("Usage: meeting-helpers.py next <meeting_type>")
            sys.exit(1)
        meeting_type = sys.argv[2]
        next_dt = get_next_occurrence(meeting_type)
        print(f"Next {meeting_type}: {next_dt.isoformat()}")
    
    elif command == "payload":
        if len(sys.argv) < 3:
            print("Usage: meeting-helpers.py payload <meeting_type>")
            sys.exit(1)
        meeting_type = sys.argv[2]
        next_dt = get_next_occurrence(meeting_type)
        payload = create_event_payload(meeting_type, next_dt)
        print(json.dumps(payload, indent=2))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
