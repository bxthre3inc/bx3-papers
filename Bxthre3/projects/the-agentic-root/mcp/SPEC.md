# Agentic MCP Server — Complete Specification

**Version:** 1.0.0  
**Date:** 2026-03-23  
**Purpose:** Expose all Agentic features via Model Context Protocol

---

## Overview

The Agentic MCP Server provides external MCP clients (Claude Desktop, Cursor, etc.) full access to the Agentic multi-agent orchestration system. Any MCP-compatible AI assistant can now interact with brodiblanco's workforce of 25+ digital employees.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Client (External AI)                  │
│              Claude Desktop / Cursor / etc.                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ stdio / HTTP
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agentic MCP Server                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Resources  │  │    Tools     │  │   Prompts    │      │
│  │              │  │              │  │              │      │
│  │  • Agents    │  │  • Tasks    │  │  • Standup   │      │
│  │  • Projects   │  │  • Escalate  │  │  • Briefing  │      │
│  │  • INBOX     │  │  • Query     │  │  • Retro     │      │
│  │  • Memory    │  │  • War Room  │  │  • Review    │      │
│  │  • Depts     │  │  • Grants    │  │              │      │
│  │  • Sprint    │  │  • Budget    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    Agentic Core                             │
│  memory/ • hierarchy/ • escalation/ • warroom/ • etc.      │
└─────────────────────────────────────────────────────────────┘
```

---

## Resources

### `agent://roster`
Full employee roster (human + AI agents) with status.

### `agent://status/{agent_id}`
Individual agent status file.

### `project://list`
All projects with current state.

### `project://{project_name}`
Detailed project status.

### `inbox://canonical`
P0/P1 items from canonical INBOX.

### `inbox://department/{dept}`
Department INBOX items.

### `memory://patterns`
Supermemory pattern index.

### `memory://search?q={query}`
Search supermemory.

### `sprint://current`
Active sprint status.

### `sprint://{sprint_id}`
Historical sprint data.

### `warroom://proposals`
Active war room proposals.

### `grant://pipeline`
Grant opportunities pipeline.

### `deadline://upcoming`
Upcoming deadlines.

---

## Tools

### Workforce Management

| Tool | Description |
|------|-------------|
| `agentic_create_task` | Create task for specific agent |
| `agentic_escalate` | Escalate to P0/P1 INBOX |
| `agentic_get_agent_status` | Get specific agent status |
| `agentic_list_agents` | List all agents with filters |
| `agentic_send_to_agent` | Direct message to agent |

### Project & Department

| Tool | Description |
|------|-------------|
| `agentic_get_project_status` | Full project details |
| `agentic_list_projects` | All projects |
| `agentic_get_department_status` | Department overview |
| `agentic_assign_to_department` | Route work to dept |

### Memory & Knowledge

| Tool | Description |
|------|-------------|
| `agentic_memory_search` | Search supermemory |
| `agentic_memory_store` | Store pattern/observation |
| `agentic_recall_decision` | Find past decision |

### War Room

| Tool | Description |
|------|-------------|
| `agentic_warroom_submit` | Submit proposal for voting |
| `agentic_warroom_vote` | Cast vote |
| `agentic_warroom_status` | Check proposal status |

### Grants & Deadlines

| Tool | Description |
|------|-------------|
| `agentic_grants_list` | List grant opportunities |
| `agentic_grants_apply` | Start grant application |
| `agentic_deadline_add` | Add new deadline |
| `agentic_deadline_list` | List all deadlines |

### Analytics & Reporting

| Tool | Description |
|------|-------------|
| `agentic_executive_briefing` | Get morning/evening briefing |
| `agentic_sprint_report` | Generate sprint report |
| `agentic_risk_score` | Get risk assessment |

---

## Prompts

### `agentic:standup`
Morning standup template — agents report status.

### `agentic:briefing`
Executive briefing — Erica's daily overview.

### `agentic:retro`
Sprint retrospective template.

### `agentic:onboard`
New agent onboarding checklist.

### `agentic:crisis`
P1 escalation response template.

---

## Quick Reference

**Connection:** stdio (local) or HTTP (remote)  
**Auth:** Bearer token in `AGENTOS_API_KEY` env  
**Base URL:** `http://localhost:3098` (default)

---

*Last updated: 2026-03-23*
