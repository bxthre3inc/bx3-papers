# Agentic V1 — Digital Pitch Infrastructure

**Live URL:** https://brodiblanco.zo.space/agentic-invest  
**Status:** Public, mobile-optimized, interactive demo  
**QR Code:** /images/agentic-invest-qr.png

---

## HOW DANNY EXPERIENCES IT

### Option 1: You Show Him (Recommended)
1. Open `brodiblanco.zo.space/agentic-invest` on your phone
2. Hand him your phone
3. "Drag the slider. Watch it trigger."
4. Scroll down to see terms
5. He taps "Invest $10,000" → fills name/email → you get notified

### Option 2: He Opens It Himself
1. Text him: `brodiblanco.zo.space/agentic-invest`
2. Or show him the QR code (below)
3. Same flow: demo → terms → submit interest

### Option 3: You Send QR Code
1. Send the image in this folder: `agentic-invest-qr.png`
2. "Scan this. Demo is live. Terms are at the bottom."

---

## QR CODE

![Agentic Invest QR](/images/agentic-invest-qr.png)

**Direct link:** https://brodiblanco.zo.space/agentic-invest

---

## CONVERSION FLOW

```
Danny opens link
    ↓
Sees live demo (moisture slider)
    ↓
Tests it (instant feedback)
    ↓
Sees 10-day sprint details
    ↓
Sees return structure ($10K → $20-25K)
    ↓
Taps "Invest $10,000"
    ↓
Enters name + email
    ↓
Hits "Confirm"
    ↓
You get notified (24hr follow-up)
```

---

## YOUR NOTIFICATION SETUP (Todo)

Currently: Manual check
Recommended: Add webhook to ping you via SMS/email when someone submits

**Quick fix:**
- Add `/api/agentic/invest/notify` endpoint
- Connect to your SMS (SignalWire already set up?)
- Or: Check submissions at `https://brodiblanco.zo.space/agentic-invest` admin view

---

## SMS TEMPLATES

### Initial Outreach
```
Danny, I'm building event-driven AI for precision ag. Demo is live — check the link. Need $10K for 10-day sprint. Revenue share: 20% til $15K, then 10% for 6mo. Target $20-25K return. brodiblanco.zo.space/agentic-invest — can we talk tomorrow?
```

### Follow-Up (If No Response, Day 2)
```
Hey Danny — following up on the pitch. Demo still live at that link. Have 2 other parties interested but wanted to give you first shot. Can do 15 min call today?
```

### Urgency (Day 3, if warm)
```
Danny — about to kick off sprint with another investor. Last chance to claim the 20% terms. Demo: brodiblanco.zo.space/agentic-invest
```

---

## TRACKING

| Date | Action | Danny's Response | Your Next Move |
|------|--------|------------------|----------------|
| Apr 6 | SMS sent | | |
| | Meeting scheduled | | |
| | Demo shown live | | |
| | He opens link himself | | |
| | Submits interest | | Call within 24hr |
| | Doesn't respond | | Follow up Day 2 |

---

## SHARE WITH OTHERS

If Danny forwards to someone:
- Same link works for anyone
- No personalization (generic is fine for warm intros)
- If you want tracking per person: add `?ref=danny` to URL

Example: `brodiblanco.zo.space/agentic-invest?ref=danny`

Then you know: "Danny sent this to [whoever]"

---

## BACKUP: IF SITE IS DOWN

Your demo also works via API:
```bash
curl -X POST https://brodiblanco.zo.space/api/agentic/dap/v1/single \
  -H "Content-Type: application/json" \
  -d '{"event_type":"demo.moisture.reading","vector":{"moisture":0.15,"economic_value":250}}'
```

Show him the JSON response — that's your forensic proof.

---

**Everything is live. The pitch is now a URL.**