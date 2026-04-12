# V2 RAIN Architecture: Self-Contained Design

> **Goal**: V2 RAIN operates as a fully independent system with zero external dependencies beyond infrastructure providers.

---

## Approval Gate

**Status**: ⏸️ **PENDING BX3 APPROVAL**

V2 RAIN development is currently **blocked** pending an explicit go/no-go decision. This document describes the target architecture, but **no code should be written** until the following conditions are met:

1. **Pre-V2 Assessment Phase completed** — See `PRE_V2_ASSESSMENT.md`
2. **BX3 explicit approval** — Written or verbal confirmation
3. **V1 Enhancement Sprint completed** (if applicable)

### Go/No-Go Criteria

| Criteria | Go Signal | No-Go Signal |
|----------|-----------|--------------|
| Market validation | Strong subscriber feedback, clear demand | Weak or ambiguous interest |
| Resource availability | Team capacity confirmed, budget allocated | Competing priorities, insufficient capital |
| Technical readiness | V1 debt manageable, architecture clear | V1 requires major rewrite, unclear scope |
| Strategic fit | Aligns with Bxthre3 2026 goals | Diverts focus from higher priorities |

**Decision authority**: BX3 (brodiblanco) only.

---

## V1 Enhancement Sprint

While V2 is in assessment, the following V1 improvements should be prioritized to maximize current system value:

### Quick Wins (1-2 days each)
- [ ] **Signup flow optimization** — Reduce friction in SMS signup
- [ ] **Alert copy improvements** — A/B test message formats for engagement
- [ ] **Churn recovery campaign** — Re-engage lapsed subscribers
- [ ] **Pricing experiment** — Test $0.99 vs $1.99 daily tier

### Medium Improvements (1 week each)
- [ ] **Subscriber dashboard** — Basic web view of subscription status
- [ ] **Referral program** — "Give $5, Get $5" for subscriber growth
- [ ] **Alert scheduling** — Quiet hours, custom delivery times
- [ ] **Additional zip codes** — Support multiple locations per user

### Foundation for V2
- [ ] **Data export** — Clean subscriber data export for migration
- [ ] **API documentation** — Document V1 endpoints for transition
- [ ] **Stripe reconciliation** — Ensure billing records are clean
- [ ] **Monitoring alerts** — SMS if V1 service goes down

**Goal**: Maximize V1 revenue and stability while assessing V2 viability.

---

## V1 Architecture (Dependency-Heavy)

```
┌─────────────────────────────────────────────────────────────────┐
│                         V1 RAIN                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Agentic   │◄──►│  Irrig8 DB  │◄──►│  Irrig8 API │         │
│  │   Tasks     │    │  (Shared)   │    │  (Shared)   │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│         ▲                                                       │
│         │                                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   RAIN      │◄──►│  Shared     │◄──►│  Shared     │         │
│  │   Service   │    │  Auth       │    │  Billing    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │  SignalWire │                                                │
│  │   SMS       │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### V1 Problems
- **Shared database**: RAIN data in Irrig8 schema, migration risk
- **Shared auth**: Login depends on Irrig8 auth service uptime
- **Shared billing**: Stripe logic coupled to Irrig8 billing
- **Agentic dependency**: Alert scheduling via Agentic task queue
- **No isolation**: Irrig8 changes can break RAIN
- **Hard to sell**: Cannot spin out RAIN as standalone product

---

## V2 Architecture (Fully Self-Contained)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         V2 RAIN                                         │
│                    (Fully Self-Contained)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    RAIN API Gateway                             │   │
│  │         (Hono + Bun - independent server)                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│          ┌───────────────────┼───────────────────┐                     │
│          ▼                   ▼                   ▼                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│  │   RAIN      │    │   RAIN      │    │   RAIN      │                │
│  │   Auth      │    │   Billing   │    │   Alerts    │                │
│  │  (Internal) │    │  (Internal) │    │  (Internal) │                │
│  └─────────────┘    └─────────────┘    └─────────────┘                │
│          │                   │                   │                     │
│          └───────────────────┼───────────────────┘                     │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    RAIN Database                                │   │
│  │              (SQLite/PostgreSQL - isolated)                     │
│  │                                                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │subscribers│  │  alerts  │  │ billing  │  │  audit   │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                          │
│          ┌───────────────────┼───────────────────┐                     │
│          ▼                   ▼                   ▼                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│  │  SignalWire │    │    NWS      │    │   Stripe    │                │
│  │    SMS      │    │    API      │    │   Connect   │                │
│  │  (External) │    │  (External) │    │  (External) │                │
│  └─────────────┘    └─────────────┘    └─────────────┘                │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    RAIN Scheduler                               │   │
│  │           (Internal cron + queue - no Agentic)                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. RAIN API Gateway
**V1**: Shared Irrig8 API endpoints  
**V2**: Independent Hono/Bun server

```typescript
// V2: rain-api/src/index.ts
import { Hono } from 'hono';

const app = new Hono();

// All RAIN routes are self-contained
app.route('/auth', authRoutes);
app.route('/billing', billingRoutes);
app.route('/alerts', alertRoutes);
app.route('/webhooks', webhookRoutes);

export default app;
```

### 2. RAIN Auth (Internal)
**V1**: Shared Irrig8 auth service  
**V2**: Passwordless SMS auth, RAIN-only users table

```sql
-- V2: RAIN-only schema
CREATE TABLE rain_users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  zip_code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- No foreign keys to external systems
);
```

### 3. RAIN Billing (Internal)
**V1**: Shared billing service, Irrig8 Stripe account  
**V2**: Direct Stripe Connect, RAIN-specific products/prices

```typescript
// V2: Direct Stripe integration
const stripe = new Stripe(process.env.RAIN_STRIPE_KEY);

// RAIN owns its own product catalog
const products = await stripe.products.list({
  metadata: { app: 'rain-v2' }
});
```

### 4. RAIN Database (Isolated)
**V1**: Tables in Irrig8 database  
**V2**: Separate database file/instance

```
V1: /data/irrig8.db → shared table: notifications
V2: /data/rain-v2.db → isolated tables: subscribers, alerts, billing
```

### 5. RAIN Scheduler (Internal)
**V1**: Agentic task queue  
**V2**: Internal cron + queue

```typescript
// V2: Built-in scheduler (no Agentic dependency)
import { Cron } from 'croner';

// Check weather every 15 minutes
new Cron('*/15 * * * *', async () => {
  await alertEngine.checkAndNotify();
});
```

---

## External Dependencies (Infrastructure Only)

| Service | Purpose | Replaceable? |
|---------|---------|--------------|
| SignalWire | SMS delivery | Yes (Twilio, etc.) |
| NWS API | Weather data | Yes (OpenWeather, etc.) |
| Stripe Connect | Payments | Yes (Square, etc.) |
| Zo Space | Hosting | Yes (self-hosted) |

**Key**: All external deps are swappable infrastructure, not coupled logic.

---

## Data Flow: Alert Delivery

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   NWS API   │────►│  Alert      │────►│  Subscriber │
│   (poll)    │     │  Engine     │     │  Filter     │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phone     │◄────│  SignalWire │◄────│  Message    │
│   User      │     │  SMS        │     │  Builder    │
└─────────────┘     └─────────────┘     └─────────────┘
```

**No Agentic. No Irrig8. Fully contained.**

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Zo Space                      │
│     (brodiblanco.zo.space)              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐   ┌─────────────┐     │
│  │  /rain-api  │   │  /rain      │     │
│  │  (API routes)│   │  (Portal)   │     │
│  └─────────────┘   └─────────────┘     │
│                                         │
│  ┌─────────────┐   ┌─────────────┐     │
│  │  /rain/docs │   │  /rain/report│     │
│  │  (API docs) │   │  (Lead mag) │     │
│  └─────────────┘   └─────────────┘     │
│                                         │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│     Independent Service (Bun)           │
│         Port 4001 (internal)            │
│  - Scheduler                            │
│  - Alert engine                         │
│  - Webhook handlers                     │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│     SQLite Database                     │
│     /data/rain-v2.db                    │
└─────────────────────────────────────────┘
```

---

## Migration Path: V1 → V2

```
Phase 1: Parallel Deploy
├── Deploy V2 alongside V1
├── Import V1 subscribers to V2
├── Dual-write to both systems
└── V1 remains primary

Phase 2: Cutover
├── Switch SMS number to V2
├── Stop V1 writes
├── V2 becomes primary
└── V1 in read-only mode

Phase 3: Cleanup
├── Export V1 data archive
├── Decommission V1
└── V2 fully operational
```

---

## Benefits of Self-Contained Architecture

| Benefit | Description |
|---------|-------------|
| **Independence** | No cross-team coordination for deployments |
| **Stability** | Changes to Irrig8/Agentic cannot break RAIN |
| **Portability** | Can migrate to separate hosting easily |
| **Sellability** | Can spin out as standalone company |
| **Testability** | Full system tests without external mocks |
| **Scalability** | Scale RAIN resources independently |

---

## File Structure

```
/home/workspace/Bxthre3/projects/rain-v2/
├── src/
│   ├── api/              # Hono routes
│   │   ├── auth.ts
│   │   ├── billing.ts
│   │   ├── alerts.ts
│   │   └── webhooks.ts
│   ├── core/             # Business logic
│   │   ├── alert-engine.ts
│   │   ├── scheduler.ts
│   │   └── message-builder.ts
│   ├── integrations/     # External APIs
│   │   ├── signalwire.ts
│   │   ├── nws.ts
│   │   └── stripe.ts
│   ├── db/               # Database
│   │   ├── schema.ts
│   │   └── migrations/
│   └── types/            # TypeScript types
├── portal/               # React user portal
├── docs/                 # API documentation
├── tests/                # Test suite
└── scripts/              # Deployment scripts
```

---

*Last updated: 2026-04-04*
