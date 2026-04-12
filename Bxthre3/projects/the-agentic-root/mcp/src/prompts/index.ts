/**
 * Agentic Prompts - Reusable prompt templates
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";

export function registerAllPrompts(server: AgentOSServer) {
  // Morning standup
  server.addPrompt({
    name: "agentic:standup",
    description: "Morning standup template - agents report status",
    arguments: [
      { name: "date", description: "Standup date (YYYY-MM-DD)", required: false }
    ]
  });

  // Executive briefing
  server.addPrompt({
    name: "agentic:briefing",
    description: "Executive briefing template - Erica's daily overview",
    arguments: []
  });

  // Sprint retrospective
  server.addPrompt({
    name: "agentic:retro",
    description: "Sprint retrospective template",
    arguments: [
      { name: "sprint_id", description: "Sprint ID", required: true }
    ]
  });

  // New agent onboarding
  server.addPrompt({
    name: "agentic:onboard",
    description: "New agent onboarding checklist",
    arguments: [
      { name: "agent_id", description: "New agent ID", required: true }
    ]
  });

  // P1 Crisis response
  server.addPrompt({
    name: "agentic:crisis",
    description: "P1 escalation response template",
    arguments: []
  });

  // Weekly review
  server.addPrompt({
    name: "agentic:weekly-review",
    description: "Weekly review template - assess all projects",
    arguments: []
  });

  // War room proposal
  server.addPrompt({
    name: "agentic:warroom-proposal",
    description: "Template for submitting a War Room proposal",
    arguments: [
      { name: "title", description: "Proposal title", required: true }
    ]
  });

  // Grant application
  server.addPrompt({
    name: "agentic:grant-apply",
    description: "Grant application template",
    arguments: [
      { name: "grant_name", description: "Grant opportunity name", required: true }
    ]
  });

  // Add the prompt content handlers
  server.prompts = server.prompts.map(prompt => {
    // Store the template content
    (prompt as any).template = getPromptTemplate(prompt.name);
    return prompt;
  });
}

function getPromptTemplate(name: string): string {
  const templates: Record<string, string> = {
    "agentic:standup": `# Morning Standup - {{date}}

## Date: {{date}}

### Yesterday's Accomplishments
- 

### Today's Priorities
- 

### Blockers
- 

### Notes
`,

    "agentic:briefing": `# Executive Briefing

## Overview
[Brief summary of current state]

## P1 Escalations
[Active P1s requiring attention]

## Top 3 Priorities Today
1. 
2. 
3. 

## Project Status
| Project | Status | Notes |
|---------|--------|-------|
| Irrig8 | | |
| Agentic | | |
| Valley Players | | |
| Starting 5 | | |

## Decisions Needed
- 

## Blockers
- 
`,

    "agentic:retro": `# Sprint Retrospective - {{sprint_id}}

## Sprint: {{sprint_id}}

### What Went Well
- 

### What Could Be Improved
- 

### Action Items
- [ ] 
- [ ] 

### Metrics
- Tasks completed: 
- Velocity: 
- Blockers encountered: 
`,

    "agentic:onboard": `# Agent Onboarding - {{agent_id}}

## Welcome, {{agent_id}}!

### 1. System Access
- [ ] INBOX configured: \`Bxthre3/INBOX/agents/{{agent_id}}.md\`
- [ ] Status file: \`/home/.z/employee-status/{{agent_id}}.json\`
- [ ] Role assigned

### 2. Know Your Role
[Insert role description]

### 3. Key Files
- AGENTS.md: \`/home/workspace/Bxthre3/AGENTS.md\`
- Project Manifest: \`/home/workspace/Bxthre3/PROJECT_MANIFEST.md\`
- INBOX Routing: \`/home/workspace/Bxthre3/INBOX/agents/INBOX_ROUTING.py\`

### 4. First Week Tasks
- [ ] Review current sprint status
- [ ] Check department INBOX
- [ ] Introduce yourself to team

### 5. Key Contacts
- brodiblanco (CEO)
- Atlas (COO)
- Pulse (VP People Ops)
`,

    "agentic:crisis": `# P1 Crisis Response

## 🚨 P1 ESCALATION

### Issue
[Describe the issue]

### Impact
- Who/what is affected:
- Severity:
- Time sensitivity:

### Current Status
[What has been done]

### Required Actions
1. 
2. 
3. 

### Resources Needed
- 
- 

### Decision Required
[What needs to be decided]

### Update Frequency
Every 30 minutes until resolved
`,

    "agentic:weekly-review": `# Weekly Review

## Week of {{date}}

### Accomplishments
-

### Missed Goals
-

### Budget Status
-

### Team Health
-

### Next Week Priorities
1. 
2. 
3. 
`,

    "agentic:warroom-proposal": `# War Room Proposal

## Title: {{title}}

### Proponent
[Name/Agent ID]

### Problem Statement
[What problem does this solve?]

### Proposed Solution
[Detailed description]

### Impact
- Expected outcomes:
- Risks:

### Resource Requirements
- Time:
- Budget:
- People:

### Timeline
- Phase 1:
- Phase 2:
- Phase 3:

### Alternatives Considered
[Other options that were rejected and why]
`,

    "agentic:grant-apply": `# Grant Application - {{grant_name}}

## Grant: {{grant_name}}

### Eligibility
[Check eligibility requirements]

### Requirements Checklist
- [ ] Eligibility confirmed
- [ ] Registration complete
- [ ] Required documents gathered
- [ ] Budget finalized
- [ ] Narrative drafted
- [ ] Reviewed

### Key Dates
- Submission deadline:
- Decision date:

### Assigned Agent
[Who is responsible]

### Current Status
[researching/drafting/submitted/awarded/rejected]
`
  };

  return templates[name] || `# Prompt: ${name}\n\nTemplate not found.`;
}
