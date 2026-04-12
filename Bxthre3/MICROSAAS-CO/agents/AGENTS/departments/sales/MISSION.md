# Sales Department — MicroSaaS Ventures
**Agent Roster: 14 agents | 6 products | Pipeline automation**

## Department Head: pipeline-command
**Role:** Coordinate all sales agents, own pipeline health, report conversion rates
**Rrule:** `FREQ=DAILY;INTERVAL=1;BYHOUR=8;TZ=America/Denver`

### Agent Registry

| Agent | Product | RRule | Primary Focus |
|-------|---------|-------|---------------|
| paintpro-sales | PaintPro | FREQ=DAILY;BYHOUR=9 | Contractor pipeline |
| paintpro-onboarding | PaintPro | FREQ=DAILY;BYHOUR=10,15 | Contractor setup |
| tradedesk-sales | TradeDesk | FREQ=DAILY;BYHOUR=9 | Trade contractor pipeline |
| tradedesk-onboarding | TradeDesk | FREQ=DAILY;BYHOUR=10 | Trade setup assist |
| slvride-driver-sales | SLV Ride | FREQ=DAILY;BYHOUR=9 | Driver recruitment pipeline |
| slvride-onboarding | SLV Ride | FREQ=DAILY;BYHOUR=10 | Driver activation |
| sd-restaurant-onboarding | Special Delivery | FREQ=DAILY;BYHOUR=9 | Restaurant pipeline |
| sd-store-onboarding | Special Delivery | FREQ=DAILY;BYHOUR=9 | Store pipeline |
| sd-dispatch | Special Delivery | FREQ=DAILY;BYHOUR=7,11,17 | Order dispatch |
| escapeslv-booking | EscapeSlv | FREQ=DAILY;BYHOUR=9 | Party booking pipeline |
| slvnow-directory-sales | SLV Now | FREQ=DAILY;BYHOUR=10 | Directory upgrade outreach |
| slvnow-event-sales | SLV Now | FREQ=DAILY;BYHOUR=11 | Event ticketing outreach |
| agentdeploy-concierge | AgentDeploy | FREQ=DAILY;BYHOUR=9,14 | Trial-to-paid |
| agentdeploy-onboarding | AgentDeploy | FREQ=DAILY;BYHOUR=10,15 | Setup wizard |

### Department KPIs (consolidated)
| Metric | Target | Agent(s) Responsible |
|--------|--------|----------------------|
| Contacts/day total | 200 | all sales agents |
| Pipeline conversion rate | > 8% | pipeline-command |
| Time-to-close (avg days) | < 14 | all sales agents |
| Onboarding completion rate | > 80% | onboarding agents |
| Active pipeline value | tracked in Airtable | pipeline-command |
| Trial-to-paid rate | > 30% | agentdeploy-concierge |

### Pipeline Management
- All leads flow through Airtable with stage tags
- Stale leads (>14 days no action) auto-escalate to pipeline-command review
- Weekly pipeline review every Monday → pipeline-command to all agents
- CRM fields: contact, company, product, stage, last_contact, next_action, agent, notes

### Tools
- gmail (outbound sequences)
- airtable_oauth (pipeline database)
- google_calendar (meeting booking)
- stripe (billing verification)
