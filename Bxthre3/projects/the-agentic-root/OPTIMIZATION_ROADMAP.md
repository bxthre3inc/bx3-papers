# Agentic 3.1 — Bxthre3 Optimization Roadmap

## Current State: Generic Workforce Platform
## Target: Bxthre3-Specific Operating System

---

## Optimization 1: Subsidiary-Aware Architecture

**Problem:** Agentic assumes single org. Bxthre3 has multiple legal entities.

**Solution:** Multi-tenant with cross-subsidiary coordination

```
Bxthre3 Inc (Holding)
├── Bxthre3 R&D (Agentic host)
│   ├── Agent: Maya — VP Engineering
│   └── Agent: Taylor — Investor Relations
│
├── Irrig8 Inc (Subsidiary)
│   ├── Agent: Raj — VP Operations
│   ├── Agent: Casey — Grant Coordinator  
│   └── Agent: Drew — Systems Architect
│   └── Reports to: Maya (Bxthre3)
│
└── Valley Players Club LLC
    └── Agent: Jordan — Hunter (Partnerships)
    └── Reports to: Alex (Bxthre3)
```

**Implementation:**
- Legal entity separation in employee records
- Cross-subsidiary escalation paths
- IP isolation per entity
- Consolidated reporting for holding company

---

## Optimization 2: Project-Centric Context

**Problem:** Agents have generic context. Should know project specifics.

**Solution:** Project-aware memory + resource allocation

| Project | Active Agents | Priority | Deadline |
|:---|:---|:---|:---|
| Irrig8 | 8 agents | P0 | ESTCP: Mar 26 |
| RAIN | 3 agents | P1 | Beta: Apr 15 |
| Starting5 | 4 agents | P1 | MVP: May 1 |
| ADM Standard | 2 agents | P2 | Draft: Jun 1 |

**Implementation:**
- `project/` module with priority scoring
- Agent capacity allocation per project
- Deadline-aware Sprint Mode (auto-activates)
- Cross-project resource contention resolution

---

## Optimization 3: Grant Lifecycle Management

**Problem:** Casey tracks grants manually. Should be system-native.

**Solution:** First-class grant management

```typescript
interface Grant {
  id: string;
  agency: 'ESTCP' | 'NSF' | 'USDA' | 'DOE';
  program: string;
  dueDate: string;
  amount: number;
  status: 'research' | 'drafting' | 'review' | 'submitted' | 'awarded' | 'declined';
  
  // Auto-calculated
  daysUntilDue: number;
  priorityScore: number; // Based on amount + strategic fit + win probability
  
  // Agent assignments
  lead: Agent;        // Casey
  writer: Agent;      // Grant Writer
  technical: Agent;   // Maya/Drew
  finance: Agent;     // Raj
  
  // Sprint Mode trigger
  sprintThreshold: number; // Days before due date to activate
}
```

**Implementation:**
- `grants/` module with lifecycle tracking
- Auto-activation of Sprint Mode when `daysUntilDue <= sprintThreshold`
- Pipeline view for brodiblanco: "Active Grants", "Upcoming Deadlines", "Pipeline Value"

---

## Optimization 4: IP Portfolio Management

**Problem:** Iris tracks patents manually. No system integration.

**Solution:** Patent-native in Agentic

```typescript
interface Patent {
  id: string;
  title: string;
  status: 'ideation' | 'provisional' | 'full' | 'granted' | 'licensed';
  priority: 'strategic' | 'defensive' | 'revenue';
  
  // Auto-calculated
  filingDeadline?: string; // Provisional expires 12 months
  maintenanceDue?: string; // Fees due
  
  // Value tracking
  licensingRevenue: number;
  blockingCompetitors: string[];
  
  // Agent assignments
  agent: Agent; // Iris
  attorney?: string; // External counsel
}
```

**Features:**
- Patent calendar (filing deadlines, maintenance fees)
- Portfolio valuation dashboard
- Competitive intelligence (who's filing similar)
- Licensing opportunity tracking

---

## Optimization 5: Investor Relations Workflow

**Problem:** Taylor handles IR ad-hoc. No systematic process.

**Solution:** IR pipeline management

```
Investor Journey:
1. Lead Generation (Jordan — Hunter)
   ↓
2. Qualification (Taylor — Screening)
   ↓
3. Materials Sent (System auto-generates deck)
   ↓
4. Meeting Scheduled (Erica handles calendar)
   ↓
5. Due Diligence (Maya + Raj prepare data room)
   ↓
6. Term Sheet (Taylor + Alex negotiate)
   ↓
7. Close (Alex + brodiblanco sign)
```

**Implementation:**
- `investors/` module with pipeline stages
- Auto-generated materials from memory
- Meeting prep briefings from Erica
- Term sheet tracking

---

## Optimization 6: Cross-Project Resource Intelligence

**Problem:** Maya pulled 3 directions (Irrig8, Starting5, Bxthre3).

**Solution:** Capacity-aware allocation

```typescript
interface CapacityManager {
  // Track agent availability
  getAvailableCapacity(agent: Agent, week: Date): number; // hours
  
  // Auto-suggest allocation
  suggestReallocation(): {
    agent: Agent;
    fromProject: string;
    toProject: string;
    reason: string;
    hoursPerWeek: number;
  }[];
  
  // Conflict detection
  detectOverallocation(): OverallocationWarning[];
}
```

**Features:**
- Weekly capacity reports in Erica briefings
- Auto-suggestions: "Maya overallocated. Suggest reducing Starting5 from 20h → 10h/week"
- Sprint Mode resource reallocation (from other projects)

---

## Optimization 7: Legal Entity & IP Isolation

**Problem:** Irrig8 IP must stay separate from Bxthre3 holding IP.

**Solution:** Tenant isolation with selective sharing

```typescript
interface LegalEntity {
  id: string;
  name: string;
  type: 'holding' | 'subsidiary' | 'llc';
  
  // Isolation
  memoryNamespace: string; // Separate Supermemory
  ipPortfolio: Patent[]; // Separate patent tracking
  financials: Financials; // Separate P&L
  
  // Cross-entity (with permission)
  sharedServices: Agent[]; // Maya can serve multiple
  licensingAgreements: License[]; // Bxthre3 → Irrig8
}
```

---

## Implementation Phases

| Phase | Feature | Duration | Impact |
|:---|:---|:---|:---|
| 3.1.1 | Subsidiary Architecture | 2 days | Multi-entity support |
| 3.1.2 | Project-Centric Context | 3 days | Priority-aware allocation |
| 3.1.3 | Grant Lifecycle | 2 days | ESTCP auto-tracking |
| 3.1.4 | IP Portfolio | 3 days | Patent-native system |
| 3.1.5 | IR Workflow | 2 days | Systematic fundraising |
| 3.1.6 | Capacity Intelligence | 3 days | Overallocation prevention |
| 3.1.7 | Entity Isolation | 2 days | Legal compliance |

**Total: ~2.5 weeks** for full Bxthre3 optimization.

---

## Success Metrics

| Before | After |
|:---|:---|
| Generic workforce | Bxthre3-specific OS |
| Casey tracks grants manually | Auto-prioritized grant pipeline |
| Iris tracks patents separately | IP portfolio in Agentic |
| Maya pulled ad-hoc | Capacity-managed allocation |
| Single org | Multi-subsidiary architecture |
| Manual investor tracking | IR pipeline with stage tracking |

---

*Agentic 3.1 — Built for Bxthre3. Ready for subsidiaries.*
