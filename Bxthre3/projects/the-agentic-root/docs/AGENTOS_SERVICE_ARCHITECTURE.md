# Agentic Service Architecture
## Core vs. Domain Services

**Version:** 1.0  
**Date:** 2026-03-31  
**Status:** DESIGN

---

## 1. Architecture Overview

Agentic follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────────
│  TIER 3: EXTERNAL PRODUCTS (The "Apps")
│  Starting5, RAIN, Build-A-Biz, Investor Transparency, Irrig8
├─────────────────────────────────────────────────────────────────
│  TIER 2: DOMAIN SERVICES (Vertical Business Logic)
│  Sales, Marketing, Finance, Operations, People, Product/CS
├─────────────────────────────────────────────────────────────────
│  TIER 1: CORE SERVICES (Horizontal Infrastructure)
│  Identity, Memory, Integration Gateway, Agent Engine, Event Bus
└─────────────────────────────────────────────────────────────────
```

**Rule:** Services only depend on tiers below. Never above.

---

## 2. TIER 1: Core Services (Infrastructure Layer)

**Definition:** Core services are **horizontal primitives** shared across ALL domain services and products. They provide infrastructure, never business logic.

| Service | Responsibility | What It Does NOT Do |
|---------|----------------|---------------------|
| **Identity** | Auth, permissions, workspace isolation | CRM, user profiles, roles |
| **Memory** | State persistence, vector search, graph queries | Business analysis, insights |
| **Integration Gateway** | API connectivity to Stripe, Notion, Linear, etc. | Data interpretation |
| **Agent Engine** | Orchestration, workflow execution, tool calling | Business workflows |
| **Event Bus** | Webhook ingestion, streaming, pub/sub | Business triggers |
| **Shared Workspace** | Data lake, ground truth storage | Business reporting |

**Key Characteristic:** A startup using only Core Services has infrastructure but no ability to run a business (no CRM, no burn analysis, no hiring workflows).

---

## 3. TIER 2: Domain Services (Business Logic Layer)

**Definition:** Domain services are **vertical business functions** built ON TOP of Core Services. They solve specific operational problems.

### 3.1 Service Inventory

| Domain Service | User Facing As | Core Dependencies |
|----------------|----------------|-------------------|
| **Sales** | CRM, pipeline, outreach | Identity (roles), Memory (contact history), Integration (HubSpot/Apollo), Workspace (deals) |
| **Marketing** | Campaign manager, attribution | Integration (paid ads), Memory (audiences), Event Bus (track) |
| **Finance** | Burn analysis, reporting, forecasts | Integration (Stripe), Workspace (metrics), Memory (trends) |
| **Operations** | Workflows, approvals, SOPs | Agent Engine (automation), Memory (context), Identity (permissions) |
| **People** | Hiring, onboarding, reviews | Integration (Greenhouse), Memory (candidates), Identity (org chart) |
| **Product** | Roadmap, feedback, CS | Integration (Linear, Zendesk), Memory (customer health), Workspace (features) |

### 3.2 Domain Service Contract

Every Domain Service exposes:

```typescript
interface DomainService {
  // Core dependencies (injected via Agentic)
  core: {
    identity: IdentityClient;
    memory: MemoryClient;
    integrations: IntegrationGateway;
    events: EventBus;
    workspace: WorkspaceClient;
  };
  
  // Business operations
  operations: {
    [key: string]: (args: any) => Promise<any>;
  };
  
  // AI-native queries
  ai: {
    query(question: string, context: QueryContext): Promise<AIAnswer>;
  };
}
```

---

## 4. TIER 3: External Products (Application Layer)

**Definition:** External Products are **complete solutions** that compose Domain Services into marketable products.

| Product | Domain Services Used | Unique Value Layer |
|---------|---------------------|-------------------|
| **Starting5** | Sales, People, Product | Agent marketplace, talent matching |
| **RAIN** | Operations, Finance, Legal | Regulatory arbitrage workflows |
| **Investor Transparency** | Finance | Natural language investor Q&A |
| **Build-A-Biz** | Sales, Marketing, Operations | Venture-as-a-Service playbooks |
| **Irrig8** | Product, Operations | Farming OS, sensor integration |

**Rule:** Products focus on UX and go-to-market. They leverage Domain Services for heavy lifting.

---

## 5. The Service Development Rulebook

### 5.1 What Belongs in CORE?

✅ **YES:** Horizontal infrastructure used by 3+ Domain Services
- User authentication
- Database connections
- Stripe webhook ingestion
- Vector search

❌ **NO:** Business logic, domain knowledge, customer-facing features
- CRM pipelines (Sales domain)
- LTV calculations (Finance domain)
- Hiring workflows (People domain)

### 5.2 What Belongs in DOMAIN?

✅ **YES:** Vertical business capability for specific function
- Deal stage transitions (Sales)
- Cohort analysis (Finance)
- Candidate scoring (People)

❌ **NO:** General infrastructure, cross-domain logic
- Email sending (Core Integration)
- AI text generation (Core Agent Engine)
- File storage (Core Workspace)

### 5.3 What Belongs in PRODUCTS?

✅ **YES:** User-facing application, GTM, brand
- Starting5 marketplace UI
- RAIN compliance dashboards
- Build-A-Biz playbooks

❌ **NO:** Reusable business logic
- Deal tracking (Sales Domain Service)
- Burn calculations (Finance Domain Service)

---

## 6. Why This Architecture Matters

### 6.1 Build Once, Use Everywhere
```
Sales Domain Service (CRM) → Used by Starting5, Build-A-Biz, RAIN
Finance Domain Service (burn) → Used by Investor Transparency, Build-A-Biz
Operations Domain Service → Used by RAIN, Build-A-Biz
```

### 6.2 The Moat Effect
- 1 Domain Service → minimal value
- 3 Domain Services connected → meaningful value  
- 6 Domain Services with shared memory → **network effects**
- External products → **data gravity**

### 6.3 Pricing Architecture
- **Core Platform:** Free/open-source (The Zoe Project)
- **Domain Services:** Per-use or seat pricing ($79-499/mo/service)
- **External Products:** Market pricing ($99-999/mo)

---

## 7. Development Roadmap

### Phase 1: Core (Q2 2026)
- Identity service v1
- Memory service (vector + graph)
- Integration Gateway (Stripe, Notion, Linear, Slack, GitHub)
- Event Bus (webhook ingestion)

### Phase 2: Domain Services (Q3 2026)
- Finance (burn, MRR, runway)
- Sales (CRM, deals, contacts)
- Operations (workflows, approvals)

### Phase 3: Products (Q4 2026)
- Investor Transparency (Finance domain)
- Starting5 v2 (Sales + People domains)
- RAIN v2 (Operations + Finance domains)

---

## 8. Summary

| Layer | Contains | Analogy |
|-------|----------|---------|
| **Core** | Infrastructure | AWS Primitives (S3, Lambda, IAM) |
| **Domain** | Business logic | SaaS Products (Salesforce, QuickBooks) |
| **Products** | Complete solutions | Your Go-To-Market Offerings |

**Golden Rule:** If you can't imagine 3+ products using it, it's probably a Domain Service, not Core.

**The Power:** Sales, Marketing, Finance, Operations, People, Product — these are ALL domain services built on the same Agentic Core. That's 6 verticals × 2-3 products each = **18 potential product combinations** with shared infrastructure.


---

## 9. Infrastructure Services (Core Layer Addition)

Core Services **must include infrastructure primitives**. These are **resold, not owned**.

### 9.1 Infrastructure Service Inventory

| Service | What We Resell | Our Margin Play | Why Not Build |
|---------|----------------|-----------------|---------------|
| **Compute** | Lambda/Edge functions, container runtimes | Small markup on execution time (we pool usage across workspaces) | Infrastructure commoditized, we add orchestration layer |
| **Storage** | Object storage (S3-compatible), file sharing | GB-month markup, egress fees | Build = CAPEX, resale = OPEX, we add semantic indexing |
| **Hosting** | Static sites, serverless apps, API endpoints | Markup on bandwidth + requests | We add Agentic-native routing, auth, deploy |
| **Database** | Managed PG, KV stores, vector DBs | Per-query or per-GB markup | We add unified query layer, cross-DB joins |
| **Secrets** | KMS, environment management | Per-key management fee | We add workspace-scoped secrets, rotation |
| **Observability** | Logging, metrics, tracing | Per-GB ingestion + query fees | We add Agentic-native event correlation |

### 9.2 The Platform Arbitrage Model

```
SUPPLIERS (Infrastructure Vendors)    AGENTOS PLATFORM          CONSUMERS (Startups)
         │                                   │                         │
         │   AWS, Vercel, Railway            │                         │
         │   Cloudflare, Supabase            │                         │
         │   Hetzner, DigitalOcean            │                         │
         │                                   │                         │
         ▼                                   ▼                         ▼
    ┌─────────┐                     ┌─────────────┐              ┌────────┐
    │$0.005/ │                     │  $0.0075/   │              │$0.0075/│
    │   GB   │────────────────────→│ GB (+50%)    │←─────────────│   GB   │
    └─────────┘                     └─────────────┘              └────────┘
                                          │
                                          │   "One bill, one platform,
                                          │    one memory layer"
```

**Key Insight:** We don't own the hardmetal in Phase 1. We:
1. **Aggregate demand** across all Agentic workspaces
2. **Negotiate volume discounts** from suppliers
3. **Add orchestration + unified UX** (the value)
4. **Take a small markup** on every transaction

**Margins:** Target 10-30% markup, not 100-300% SaaS margins. Volume wins.

### 9.3 Infrastructure Pricing Tiers

| Tier | Target | Margin | Rationale |
|------|--------|--------|-----------|
| **Free** | < 1GB storage, < 10k requests/mo | 0% | Acquisition, show value |
| **Growth** | < 100GB, < 1M requests | 20% | Most startups land here |
| **Scale** | Unlimited usage | 10% | Volume discount, still profitable |
| **Custom** | Enterprise | Negotiated | Dedicated resources, higher margin |

### 9.4 Transition Path

| Phase | Infrastructure Source | Margin Strategy |
|-------|----------------------|-----------------|
| **Now (Q2)** | Pure resale (AWS, Vercel, Railway) | 30% markup on marked-up price |
| **Soon (Q3-Q4)** | Volume commitments → better supplier rates | 20% markup (pass savings) |
| **Later (2027)** | Own edge nodes in key regions | 50%+ margin (infrastructure ownership) |

**Hardware Preference:** Start with resale, gradually self-host only where it creates proprietary value (e.g., Agentic-native GPU for model inference, edge cache). Avoid owning hardware for commodity services.

