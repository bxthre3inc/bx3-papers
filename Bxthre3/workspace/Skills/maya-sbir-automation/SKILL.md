---
name: maya-sbir-automation
description: Maya agent — SBIR deadline tracking automation
compatibility: Requires Notion integration, Gmail, Google Calendar
metadata:
  author: brodiblanco.zo.computer
---

# Maya SBIR Automation

Maya (Grant Strategist) automatically:
1. Pulls SBIR deadlines from Notion database
2. Syncs to Google Calendar
3. Sends email reminders 3 days before deadline
4. Updates task status in AgentOS mesh

## Setup

```bash
export NOTION_API_KEY="your_notion_key"
export NOTION_DATABASE_ID="your_database_id"
```

## Usage

```bash
python3 Skills/maya-sbir-automation/scripts/maya.py --check-deadlines
python3 Skills/maya-sbir-automation/scripts/maya.py --sync-calendar
python3 Skills/maya-sbir-automation/scripts/maya.py --send-reminders
```
