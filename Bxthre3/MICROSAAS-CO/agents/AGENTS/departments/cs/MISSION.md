# Customer Success Department — MicroSaaS Ventures
**Agent Roster: 12 agents | 6 products | 24/7 automated support**

## Department Head: cs-command
**Role:** Own CS metrics across all products, handle escalations, drive retention
**Rrule:** `FREQ=DAILY;INTERVAL=1;BYHOUR=8;TZ=America/Denver`

### Agent Registry

| Agent | Product | RRule | Hours | Channels |
|-------|---------|-------|-------|----------|
| tradedesk-support | TradeDesk | FREQ=HOURLY;INTERVAL=1;BYHOUR=7-21 | 7AM-9PM | email, in_app |
| paintpro-support | PaintPro | FREQ=DAILY;INTERVAL=1;BYHOUR=8,12,17,20 | coverage | email, sms |
| slvride-support | SLV Ride | FREQ=DAILY;INTERVAL=1;BYHOUR=6-23 | 24/6 | phone, sms, chat |
| sd-support | Special Delivery | FREQ=DAILY;INTERVAL=1;BYHOUR=8,11,14,17,20 | coverage | chat, sms, phone |
| sd-driver-support | Special Delivery | FREQ=DAILY;INTERVAL=1;BYHOUR=7,22 | extended | sms, chat |
| sd-review-agent | Special Delivery | FREQ=DAILY;INTERVAL=1;BYHOUR=13,20 | 2x daily | in_app |
| escapeslv-support | EscapeSlv | FREQ=DAILY;INTERVAL=1;BYHOUR=9,14,19 | coverage | email, chat |
| slvnow-support | SLV Now | FREQ=DAILY;INTERVAL=1;BYHOUR=8,12,17 | business hours | email, chat |
| slvnow-directory-support | SLV Now | FREQ=DAILY;INTERVAL=1;BYHOUR=10 | as needed | email |
| agentdeploy-support | AgentDeploy | FREQ=DAILY;INTERVAL=1;BYHOUR=7,12,17,21 | coverage | email, chat |
| cs-command | ALL | FREQ=DAILY;BYHOUR=8 | oversight | all channels |

### SLA Standards
| Tier | Response Time | Resolution | Refund Authority |
|------|--------------|------------|-----------------|
| Urgent (P1) | 5 min | 1 hour | Up to $50 |
| Standard (P2) | 15 min | 4 hours | Up to $20 |
| Low (P3) | 2 hours | 24 hours | Up to $0 |

### Department KPIs (consolidated)
| Metric | Target | Agent(s) Responsible |
|--------|--------|----------------------|
| Avg CSAT (blended) | > 4.4 / 5 | all support agents |
| Avg First Contact Resolution | > 65% | all support agents |
| Refund rate (normalized) | < 5% | all support agents |
| Ticket close rate (24h) | > 90% | cs-command |
| Net Promoter Score | > 50 | review agents |

### Escalation Rules
- P0/P1 issues → cs-command → SMS to brodiblanco if unresolvable in 1 hour
- Billing disputes > $50 → cs-command review
- Legal/threats → immediate brodiblanco alert
- Driver/partner deactivation → cs-command pre-approval required

### Tools
- gmail (ticket triage, customer responses)
- airtable_oauth (ticket tracking, CSAT logging)
- stripe (refund processing, billing dispute resolution)
- google_calendar (scheduling adjustments for delivery/trade agents)
