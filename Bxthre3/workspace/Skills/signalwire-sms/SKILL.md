---
name: signalwire-sms
description: Send SMS notifications via SignalWire API for delivery alerts, order confirmations, and supplier notifications
compatibility: Created for Zo Computer
metadata:
  author: brodiblanco.zo.computer
---

# SignalWire SMS Integration

Send SMS messages via SignalWire API.

## Environment Variables

```bash
SIGNALWIRE_PROJECT_ID=your-project-id
SIGNALWIRE_API_TOKEN=your-api-token
SIGNALWIRE_SPACE_URL=your-space.signalwire.com
SIGNALWIRE_FROM_NUMBER=+1XXXXXXXXXX
```

## Usage

```bash
cd Skills/signalwire-sms/scripts
SIGNALWIRE_PROJECT_ID=xxx SIGNALWIRE_API_TOKEN=xxx bun send-sms.ts +15551234567 "Your firewood delivery is scheduled for tomorrow at 2pm"
```

## API Reference

- SignalWire LaML REST API: https://docs.signalwire.com/
- SMS endpoint: POST /api/laml/2010-04-01/Accounts/{AccountSid}/Messages.json
