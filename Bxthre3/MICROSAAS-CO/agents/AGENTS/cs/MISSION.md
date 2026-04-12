# Customer Success Department — MicroSaaS Ventures
**Agent Roster: 13 agents | 6 products | Daily + weekly orchestration**

## Department Head: cs-command
**Role:** Own activation, retention, and satisfaction metrics across all products
**Rrule:** `FREQ=DAILY;INTERVAL=1;BYHOUR=10;TZ=America/Denver`

### Agent Registry

| Agent | Product | RRule | Focus |
|-------|---------|-------|-------|
| paintpro-onboarding | PaintPro | FREQ=DAILY;BYHOUR=10:30 | Day 1/3/7 checkpoints |
| paintpro-support | PaintPro | FREQ=DAILY;BYHOUR=8,10,12,14,16,18 | Tier-1 tickets |
| escapeslv-session-coordinator | EscapeSlv | FREQ=DAILY;BYHOUR=18 | Active sessions |
| escapeslv-support | EscapeSlv | FREQ=DAILY;BYHOUR=20 | Post-session |
| tradedesk-dispatch-optimizer | TradeDesk | FREQ=DAILY;BYHOUR=6 | Morning dispatch |
| tradedesk-csr-agent | TradeDesk | FREQ=DAILY;BYHOUR=8,12,17 | Voice/SMS/email |
| tradedesk-invoice-agent | TradeDesk | FREQ=WEEKLY;BYDAY=FR | A/R follow-up |
| tradedesk-onboarding | TradeDesk | FREQ=DAILY;BYHOUR=10 | Day 1/3/7 |
| slvride-support | SLV Ride | FREQ=DAILY;BYHOUR=6,22 | Rider + driver |
| slvride-retention | SLV Ride | FREQ=WEEKLY;BYDAY=SU;BYHOUR=18 | Churn prevention |
| slveats-support | SLV Eats | FREQ=DAILY;BYHOUR=11,18 | Order issues |
| slveats-review-agent | SLV Eats | FREQ=DAILY;BYHOUR=13,20 | Review collection |
| slvnow-support | SLV Now | FREQ=DAILY;BYHOUR=8,16 | Community + mod |
| slvnow-weather-alert | SLV Now | FREQ=DAILY;BYHOUR=6 | Safety alerts |

### CS Tier Definitions
- **Tier 1:** FAQ, how-to, account issues → support-agent (automated)
- **Tier 2:** Complex troubleshooting, refunds > $15 → cs-command escalation
- **Tier 3:** Enterprise issues, legal, P1 incidents → brodiblanco via INBOX.md + SMS

### SLA Standards
| Tier | Response | Resolution |
|------|----------|------------|
| Tier 1 | 1 hr | 4 hr |
| Tier 2 | 2 hr | 24 hr |
| Tier 3 | 15 min | 1 hr |

### Activation Gates
- PaintPro: First room measured
- EscapeSlv: First session completed
- TradeDesk: First job scheduled
- SLV Ride: First completed ride
- SLV Eats: First order delivered
- SLV Now: First event posted OR first listing claimed

### Department INBOX
`Bxthre3/INBOX/departments/cs.md`
