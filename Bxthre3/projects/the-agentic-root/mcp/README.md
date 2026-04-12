# Agentic MCP Server

Exposes all Agentic features via the Model Context Protocol (MCP). Any MCP-compatible AI assistant (Claude Desktop, Cursor, etc.) can now interact with brodiblanco's workforce of 25+ digital employees.

## Features

### Resources (Read-Only Data)
- `agent://roster` - Full employee roster
- `agent://status/{id}` - Individual agent status
- `project://manifest` - All projects
- `project://{name}` - Project details
- `inbox://canonical` - P0/P1 escalations
- `inbox://department/{dept}` - Department INBOXes
- `memory://workspace` - AGENTS.md routing index
- `memory://patterns` - Supermemory patterns
- `sprint://current` - Current sprint
- `warroom://proposals` - Consensus proposals
- `grant://pipeline` - Grant opportunities
- `deadline://upcoming` - Tracked deadlines

### Tools (Actions)

#### Workforce
- `agentic_list_agents` - List all agents
- `agentic_get_agent_status` - Agent status
- `agentic_create_task` - Create task
- `agentic_escalate` - P0/P1 escalation
- `agentic_send_to_agent` - Direct message
- `agentic_workforce_health` - Health report

#### Projects & Departments
- `agentic_list_projects` - All projects
- `agentic_get_project_status` - Project details
- `agentic_list_departments` - All departments
- `agentic_get_department_status` - Department status
- `agentic_assign_to_department` - Route work

#### Memory
- `agentic_memory_search` - Search patterns
- `agentic_memory_store` - Store pattern
- `agentic_recall_decision` - Find decision
- `agentic_memory_get_patterns` - All patterns
- `agentic_get_workspace_memory` - AGENTS.md

#### War Room
- `agentic_warroom_submit` - Submit proposal
- `agentic_warroom_vote` - Cast vote
- `agentic_warroom_status` - Proposal status
- `agentic_warroom_list` - All proposals

#### Grants & Deadlines
- `agentic_grants_list` - Grant pipeline
- `agentic_grant_deadlines` - Upcoming deadlines
- `agentic_deadline_add` - Add deadline
- `agentic_deadline_list` - All deadlines
- `agentic_grants_track` - Track application

#### Analytics
- `agentic_executive_briefing` - Erica briefing
- `agentic_sprint_report` - Sprint report
- `agentic_risk_score` - Risk assessment
- `agentic_inbox_summary` - INBOX overview
- `agentic_agent_performance` - Performance metrics

## Setup

```bash
cd mcp
npm install
npm run build
```

## Usage

### Claude Desktop (stdio)

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentic": {
      "command": "node",
      "args": ["/path/to/Bxthre3/projects/the-agentic-project/mcp/dist/index.js"]
    }
  }
}
```

### HTTP Server Mode

```bash
AGENTOS_API_KEY=your-key node dist/index.js --http --port 3098
```

### Direct Testing

```bash
npm run dev
```

## Architecture

```
Agentic MCP Server
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # Core server class
│   ├── tools/            # Tool implementations
│   │   ├── workforce.ts   # Agent management
│   │   ├── projects.ts   # Project/dept tools
│   │   ├── memory.ts     # Supermemory tools
│   │   ├── warroom.ts    # Voting tools
│   │   ├── grants.ts     # Grant/deadline tools
│   │   └── analytics.ts  # Reporting tools
│   ├── resources/        # Read-only resources
│   └── prompts/          # Prompt templates
```

## Connection Details

- **stdio:** Default (Claude Desktop)
- **HTTP:** Port 3098
- **Auth:** Bearer token in `AGENTOS_API_KEY`

## Requirements

- Node.js 18+
- Agentic core (assumes paths at `Bxthre3/`)
- Read access to `/home/.z/employee-status/`
- Write access to `Bxthre3/INBOX/`

---

*Built for brodiblanco's Agentic - The Starting 5 Architecture*
