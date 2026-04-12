# Agent Launcher — Product Brief
**"One agent. One role. Deployed today."**
*Part of the Agentic platform family (see ARCHITECTURE.md)*

---

## What It Is

Agent Launcher is the **simplest AI employee deployment platform** for small businesses. A company signs up, defines a single agent role (Sales, Customer Service, Marketing, or HR), connects their existing tools (Gmail, Calendar, Stripe, HubSpot, etc.), uploads a knowledge base, and launches. One agent. One job. Running 24/7.

No agent coordination. No mesh. No infrastructure to manage. Just one focused AI worker doing the job.

---

## Target Customer

**Small businesses with 1–20 employees** who are:
- Overwhelmed by repetitive admin tasks
- Can't afford a full-time receptionist, sales rep, or CS agent
- Already using tools like Gmail, Google Calendar, Stripe, HubSpot
- Skeptical of "AI everything" but willing to try one focused use case

**Ideal first buyer:** A local contractor, dentist office, real estate agent, or e-commerce brand.

---

## The Four Roles

### 1. Sales Agent
- Responds to inbound leads within 5 minutes
- Qualifies prospects via structured conversation
- Schedules demos/calls via Google Calendar
- Follows up on stale deals automatically
- Logs all activity to CRM

### 2. Customer Service Agent
- Answers FAQs from knowledge base instantly
- Handles refunds, cancellations, modifications via tool access
- Escalates complex issues to human (you)
- Sends order confirmations, shipping updates, appointment reminders
- Runs post-interaction CSAT survey

### 3. Marketing Agent
- Publishes social media content on schedule (LinkedIn, X, Instagram)
- Sends email drip campaigns to nurture leads
- Scrapes and curates relevant industry content
- Reports on campaign performance weekly
- Manages email list segmentation

### 4. HR Agent
- Answers employee policy questions from handbook
- Schedules interviews and sends calendar invites
- Sends onboarding checklists to new hires
- Handles PTO requests and tracks accruals
- Runs employee pulse surveys monthly

---

## How It Works (User Journey)

```
1. Sign up (5 min)         → Email, password, company name
2. Choose your role        → Sales / CS / Marketing / HR
3. Connect your tools      → Gmail, Calendar, Stripe, HubSpot, Slack
4. Upload your knowledge   → Paste text, upload PDF, link Notion/Google Docs
5. Set your preferences    → Tone, working hours, escalation rules
6. Launch                  → Agent goes live, you get a dashboard
7. Monitor + refine        → See activity log, adjust knowledge, iterate
```

---

## Tool Connectors (Launch Priority)

| Connector | Role | Priority |
|-----------|------|----------|
| Gmail / Google Workspace | All | P0 |
| Google Calendar | Sales, HR | P0 |
| Stripe | CS, Sales | P0 |
| HubSpot | Sales, Marketing | P1 |
| Slack | All | P1 |
| Notion | All | P1 |
| Airtable | All | P1 |
| Shopify | CS | P2 |
| QuickBooks | HR | P2 |
| Zapier | All | P2 |

---

## Pricing

| Tier | Price | Agents | Tool Connections | Knowledge Size |
|------|-------|--------|-----------------|----------------|
| Starter | $49/mo | 1 | 3 | 10 pages |
| Professional | $99/mo | 3 | 8 | 100 pages |
| Team | $199/mo | 10 | Unlimited | Unlimited |

**Free trial:** 14 days, full features, no card required

---

## Differentiation from Agentic

| | Agent Launcher | Agentic |
|-|---------------|---------|
| Agents | 1 (single, isolated) | Unlimited (coordinated mesh) |
| Coordination | None | Full orchestration, escalation, shared memory |
| Context sharing | Self only | Cross-agent shared context |
| Use case | One role, one focus | Multiple teams, complex workflows |
| Price | $49–199/mo | Custom / higher |
| Buyer | Small business owner | Operations leader, CTO |
| Entry | Self-serve signup | Guided onboarding |

Agent Launcher customers who need more graduate to Agentic. Same agents, more power. This is intentional.

---

## Go-to-Market

**Launch strategy:**
1. Organic content (LinkedIn, Indie Hackers) — "I deployed my first AI employee in 15 minutes"
2. Product Hunt launch
3. Niche communities: contractor forums, dentist forums, real estate agent groups
4. Referral program: $50 credit per paying referral

**Launch date target:** Q2 2026

---

## Tech Notes

- Built on Agentic agent architecture (single-instance mode)
- Frontend: Zo Space (dashboard, settings, knowledge base editor)
- Agent runtime: Agentic core (same as multi-agent mesh, just single-agent)
- Database: Per-customer isolated SQLite → PostgreSQL at scale
- Auth: Email + magic link, SSO at Team tier
- Billing: Stripe subscription, proration, upgrade/downgrade flows
