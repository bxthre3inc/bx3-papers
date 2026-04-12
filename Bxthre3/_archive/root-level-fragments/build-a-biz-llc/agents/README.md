# Build-A-Biz LLC - AgentOS Sales Engine
# Master Agent Configuration Directory

## Overview
This directory contains the configuration for all sales engine agents
supporting Build-A-Biz LLC operations.

## Agent Directory Structure
```
agents/
├── leadgen/           # LeadGen Agent - Prospecting
│   ├── AGENT.md
│   └── inbox.md
├── sales/             # Sales Agent - Closing Deals
│   ├── AGENT.md
│   └── inbox.md
├── onboarding/        # Onboarding Agent - New Client Setup
│   ├── AGENT.md
│   └── inbox.md
└── account-manager/   # Account Manager - Client Relationships
    ├── AGENT.md
    └── inbox.md
```

## Agent Roles & Handoffs

```
LeadGen Agent
    ↓ (qualified leads)
Sales Agent
    ↓ (signed clients)
Onboarding Agent
    ↓ (active clients)
Account Manager
    ↓ (escalations)
Owner (brodiblanco)
```

## Shared Resources
- Google Calendar: Scheduling
- Gmail: Client communications
- Airtable: Lead/client tracking
- Dropbox: Document storage

## Owner Contact
- brodiblanco
- +17194909228
- getfarmsense@gmail.com

## Created
2026-03-29