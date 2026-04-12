# Agentic ↔ Zo Bridge

Bidirectional MCP integration allowing Agentic to access all Zo capabilities.

## What Agentic Can Call (Zo Tools)

- **Integrations**: Gmail, Calendar, Notion, Airtable, Linear, Drive
- **Files**: Read, write, search workspace files
- **Web**: Search, research
- **Automations**: List, create scheduled agents
- **Messages**: SMS, Email
- **Space**: Routes, assets

## What Zo Can Call (Agentic Tools)

- **Workforce**: List agents, get status
- **Inbox**: List items, add message
- **Tasks**: Create, poll for execution

## Environment Variables

```bash
BRIDGE_PORT=8888
ZO_API_ENDPOINT=http://localhost:3099
AGENTOS_API_ENDPOINT=http://localhost:9999
BRIDGE_SECRET=your-secret
AGENTOS_SECRET=dev-secret
```

## Run

```bash
bun install
bun run server.ts
```

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /tools | List all available tools |
| POST | /call | Call a tool |
