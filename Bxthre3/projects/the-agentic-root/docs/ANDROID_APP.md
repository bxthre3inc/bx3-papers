# Agentic Android App — Full Specification & Architecture

**Document Version:** 1.0 | **Date:** 2026-03-24  
**Status:** Ready for dedicated build session

---

## Source of Truth — What This App Reflects

Agentic is a **full enterprise-grade AI workforce operating system** with:
- **25+ AI agents** across 9 departments
- **Executive layer** (Zoe/COO, Maya/CTO, Drew/COO, Erica/executive briefings)
- **The Starting 5** (AI co-founders: Visionary, Builder, Operator, Hunter, Architect)
- **9 operational departments** with managers and employees
- **Core OS features**: War Room, Risk Scorer, Sprint Mode, Escalation Clock, Supermemory
- **10+ integrations** connected via Zo

---

## Agent Roster (Complete)

### Executive Layer
| ID | Name | Role | Department |
|---|---|---|---|
| `zoe` | Zoe Patel | COO / Orchestrator | Executive |
| `maya` | Maya Patel | CTO | Engineering |
| `drew` | Drew Morrison | COO | Operations |
| `alex` | Alex Chen | Visionary (Starting 5) | Strategy |
| `jordan` | Jordan Reyes | Hunter (Starting 5) | Revenue |
| `riley` | Riley Chen | Architect (Starting 5) | Product |
| `taylor` | Taylor Chen | Builder (Starting 5) | Engineering |
| `morgan` | Morgan Blake | Operator (Starting 5) | Operations |

### Department Managers
| ID | Name | Department |
|---|---|---|
| `casey` | Casey Wu | Build |
| `quinn` | Quinn Martinez | Portfolio Ops |
| `sage` | Sage Okafor | Archive |
| `nico` | Nico Park | Finance |
| `blake` | Blake Yamamoto | Legal |
| `ira` | Ira Bernstein | Investor Relations |
| `skye` | Skye Nakamura | Intelligence |
| `cameron` | Cameron Foster | Infrastructure |
| `taylor` | Taylor Reed | Research |

### Department Employees
| ID | Name | Manager | Department |
|---|---|---|---|
| `casey-lin` | Casey Lin | Maya | Engineering |
| `iris-park` | Iris Park | Maya | Engineering |
| `quinn-taylor` | Quinn Taylor | Drew | Operations |
| `riley-kim` | Riley Kim | Drew | Operations |
| `taylor-brooks` | Taylor Brooks | Jordan | Revenue |
| `blake-rivera` | Blake Rivera | Jordan | Revenue |
| `sage-williams` | Sage Williams | Alex | Strategy |
| `nico-anderson` | Nico Anderson | Alex | Strategy |

### Specialty Agents
| ID | Name | Role |
|---|---|---|
| `erica` | Erica | Executive Briefing Agent |
| `vance` | Vance | Founder's Assistant |
| `sentinel` | Sentinel | Security |
| `raj` | Raj | VP Grants |
| `casey` | Casey | VP Grants |
| `theo` | Theo | Field Systems |
| `sam` | Sam | Legal |
| `iris` | Iris | Investor Relations |

---

## Departments (9 Total)

| # | Department | Head | Employees |
|---|---|---|---|
| 1 | Engineering | Maya | Casey Lin, Iris Park |
| 2 | Operations | Drew | Quinn Taylor, Riley Kim |
| 3 | Revenue | Jordan | Taylor Brooks, Blake Rivera |
| 4 | Strategy | Alex | Sage Williams, Nico Anderson |
| 5 | Research | Taylor Reed | — |
| 6 | Build | Casey Wu | — |
| 7 | Portfolio Ops | Quinn | — |
| 8 | Finance | Nico Park | — |
| 9 | Legal | Blake | — |
| 10 | Investor Relations | Ira | — |
| 11 | Intelligence | Skye | — |
| 12 | Infrastructure | Cameron | — |
| 13 | Archive | Sage | — |
| 14 | Commercialization | Riley | — |

---

## App Screens (Full OS)

### Core Screens
1. **Dashboard** — System health, agent count, KPIs, work queue summary, escalations
2. **Workforce** — Full roster of 25+ agents with search/filter/status
3. **Departments** — 9 department views with members and metrics
4. **Work Queue** — Unified inbox across all departments, priority routing

### Executive & AI Screens
5. **Starting 5** — AI co-founders: Alex Morgan, Taylor Chen, Morgan Blake, Jordan Reyes, Riley Park
6. **Erica** — Executive briefing agent, daily standups
7. **War Room** — Consensus voting (4/5), decision tracking
8. **Risk Scorer** — Real-time risk assessment (Financial, Legal, Technical, Reputational)

### Operational Screens
9. **Escalations** — P0/P1 queue with 24h clock timers
10. **Sprint Mode** — Active sprints, velocity metrics, resource reallocation
11. **Integrations Hub** — All 10+ connected services with live status
12. **Supermemory** — Pattern library, learned preferences
13. **Reports** — 12-hour reporting, sprint summaries, workforce health

### Project Screens
14. **Irrig8** — Field sensor status, LRZ1/LRZ2/CSA, pivot monitoring
15. **VPC** — Gaming platform status, cash partners (server: vpc-brodiblanco.zocomputer.io)

### System Screens
16. **Settings** — Notifications, agent config, user prefs
17. **INBOX** — P0/P1 escalations only (canonical INBOX.md)
18. **Agent Detail** — Per-agent profile (reusable screen for all 25+ agents)

---

## Agent Detail Screen (Reusable Component)

Each agent profile shows:
- Name, role, department, supervisor
- Skills (linked to skills registry)
- Tools (what they can do)
- Current task / work item
- Status (active/idle/blocked/monitoring)
- Health score
- INBOX link
- Performance metrics
- Colleagues

---

## Data Model

### Agent
```kotlin
data class Agent(
    val id: String,
    val name: String,
    val role: String,
    val department: String,
    val managerId: String?,
    val colleagues: List<String>,
    val shifts: List<String>,
    val skills: List<String>,
    val tools: List<String>,
    val status: AgentStatus,
    val currentTask: String?,
    val health: Int, // 0-100
    val inboxPath: String,
    val lastSeen: String?
)

enum class AgentStatus { IDLE, WORKING, BLOCKED, OFF, MONITORING }
```

### Department
```kotlin
data class Department(
    val id: String,
    val name: String,
    val headId: String,
    val memberIds: List<String>,
    val activeProjects: List<String>,
    val kpis: Map<String, Int>,
    val escalationCount: Int,
    val workQueueDepth: Int
)
```

### Integration
```kotlin
data class Integration(
    val id: String,
    val name: String,
    val status: IntegrationStatus,
    val lastSync: String?,
    val unreadCount: Int?,
    val metrics: Map<String, Any>
)

enum class IntegrationStatus { CONNECTED, DISCONNECTED, ERROR, PENDING }
```

### Escalation
```kotlin
data class Escalation(
    val id: String,
    val priority: Priority,
    val agentId: String,
    val description: String,
    val timestamp: String,
    val deadline: String,
    val status: EscalationStatus
)

enum class Priority { P0, P1, P2, P3 }
enum class EscalationStatus { OPEN, IN_PROGRESS, RESOLVED, CANCELLED }
```

---

## Technical Approach

### Stack
- **Language:** Kotlin 2.0
- **UI:** Jetpack Compose with Material 3
- **HTTP:** Ktor client (lightweight, no OkHttp conflicts)
- **State:** ViewModel + StateFlow
- **DI:** Manual (no Hilt)
- **Navigation:** Custom NavHost with State (no Navigation Compose)
- **Icons:** Built-in Android system icons
- **AGP:** 8.2.2
- **Kotlin:** 1.9.22

### API Base URLs
- **Agentic:** `https://agentic-brodiblanco.zocomputer.io/api/agentic`
- **VPC:** `https://vpc-brodiblanco.zocomputer.io`

### Key Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/status` | System health |
| GET | `/api/work/queue` | Work queue |
| GET | `/api/employees` | All agents |
| GET | `/api/starting5` | Starting 5 status |
| GET | `/api/integrations/status` | Integration health |
| GET | `/api/departments` | Department data |
| GET | `/api/reports` | Sprint reports |
| GET | `/api/escalations` | P0/P1 escalations |

### VPC Endpoints
| Method | Path | Description |
|---|---|---|
| GET | `/api/analytics` | VPC metrics |

---

## Build Phases

### Phase 1 — Core Shell (15 min)
- Navigation setup with all routes
- Theme (Agentic dark theme)
- Dashboard skeleton with live API data
- Build APK to verify shell works

### Phase 2 — Workforce Tab (30 min)
- Full agent roster with search/filter
- Agent detail screens for all agents
- Real-time status from API

### Phase 3 — Starting5 + Erica (30 min)
- All 5 co-founder agents
- Erica executive agent
- Specialty cards and metrics

### Phase 4 — War Room + Risk + Escalations (30 min)
- Consensus voting UI
- Risk score display
- Escalation queue with timers

### Phase 5 — Integrations + Reports (30 min)
- Integration status hub
- Workforce reports
- Department views

### Phase 6 — Polish (15 min)
- Animations
- Notifications setup
- Final APK build

---

## Build Notes

- **Do NOT use Navigation Compose** — causes version conflicts
- **Do NOT use OkHttp** — conflicts with Ktor
- **Do NOT use Hilt** — manual DI is simpler
- Use built-in icons
- Write files in batches
- Fix Kotlin errors incrementally
- AGP 8.2.2 + Kotlin 1.9.22 is stable combo
