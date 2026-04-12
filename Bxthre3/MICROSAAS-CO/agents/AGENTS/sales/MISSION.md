# Sales Department — MicroSaaS Ventures
**Agent Roster: 14 agents | 6 products | Hourly + daily orchestration**

## Department Head: close-command
**Role:** Own revenue outcomes across all products, manage pipeline, execute Stripe closes
**Rrule:** `FREQ=DAILY;INTERVAL=1;BYHOUR=9;TZ=America/Denver`

### Agent Registry

| Agent | Product | RRule | Stage |
|-------|---------|-------|-------|
| paintpro-lead-qualifier | PaintPro | FREQ=HOURLY | Lead |
| paintpro-close | PaintPro | FREQ=DAILY;BYHOUR=11 | Close |
| escapeslv-lead-qualifier | EscapeSlv | FREQ=HOURLY | Lead |
| escapeslv-close | EscapeSlv | FREQ=DAILY;BYHOUR=11 | Close |
| tradedesk-lead-qualifier | TradeDesk | FREQ=HOURLY | Lead |
| tradedesk-demo-scheduler | TradeDesk | FREQ=DAILY;BYHOUR=9 | Demo |
| tradedesk-close | TradeDesk | FREQ=DAILY;BYHOUR=11 | Close |
| slvride-driver-onboarding | SLV Ride | FREQ=DAILY;BYHOUR=9 | Driver |
| slvride-matching | SLV Ride | FREQ=HOURLY | Ops |
| slveats-restaurant-onboarding | SLV Eats | FREQ=DAILY;BYHOUR=9 | Restaurant |
| slveats-delivery-routing | SLV Eats | FREQ=DAILY;BYHOUR=11,17 | Ops |
| slvnow-listing-sales | SLV Now | FREQ=DAILY;BYHOUR=9 | Listing |
| slvnow-ticketing-agent | SLV Now | FREQ=DAILY;BYHOUR=11 | Ticket |
| slvride-safety-compliance | SLV Ride | FREQ=DAILY;BYHOUR=22 | Compliance |

### Pipeline Stages (Airtable)
1. New Lead → 2. Qualified → 3. Demo Scheduled → 4. Proposal → 5. Negotiation → 6. Closed Won / Closed Lost

### Close Trigger Rules
- PaintPro/TradeDesk: Stripe Checkout link sent on "Closed Won"
- EscapeSlv: Instant charge on booking confirmation
- SLV Ride/Eats: Driver/restaurant activation on completion of onboarding steps
- SLV Now: Stripe invoice on listing upgrade confirmation

### Department INBOX
`Bxthre3/INBOX/departments/sales.md`
