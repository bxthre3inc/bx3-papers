# AGENTIC — MERGED SPEC
# Bxthre3 Inc — One document, zero hallucinations, all decisions resolved
# Version: CANONICAL-FINAL | Date: 2026-04-11

## IDENTITY

**"Agentic" is the only name.** Agentic, ABE, AgenticBusinessEmpire, Helm, SymphonyOS (internal), and Live Symphony (research) are all deprecated. Only "Agentic" survives.

## WHAT IS AGENTIC

Agentic is Bxthre3's internal AI operating system. It is not a chatbot wrapper. It is not a dashboard. It is an operating system with:
- A kernel (protected core)
- Agents as processes (workers)
- Enforced correctness (Truth Gate)
- State management (ledger)
- Interrupt/resume (phase gates)
- Self-improvement (Self-Modification Engine)
- Hardware fabric (compute mesh)
- Persistence (reasoning stream)
- Extensibility (orchestration plugins)

**Agentic powers all Bxthre3 verticals:** Irrig8, VPC, RAIN, Build-A-Biz, ARD, Trenchbabys.

## THE THREE NON-NEGOTIABLES

1. ZERO HALLUCINATION — Every claim traces to source. No fetch, no think.
2. DETERMINISM — Same inputs always produce same outputs.
3. GRACEFUL DEGRADATION — No single point of failure.

## BEHAVIORAL PRINCIPLES (from SOUL.md)

1. Be Direct. No Noise.
2. Execute to Completion
3. Canonical Always
4. Ship With Integrity
5. Verify or Die (Zero Hallucination)
6. Evolve or Die (Self-Modification)
7. Communicate With Precision

## DEPLOYED SYSTEM (what currently exists)

### Live Routes
- GET /api/agentic/status
- GET /api/agentic/agents
- GET /api/agentic/tasks
- GET /api/agentic/org
- GET /api/agentic/workforce/metrics
- GET /api/agentic/depts
- GET /api/agentic/integrations
- GET /api/agentic/escalations
- GET /api/agentic/starting5
- GET /api/agentic/projects
- POST /api/agentic/events/ingest
- POST /api/agentic/agents/register
- GET /api/agentic/forensic/trace
- GET /api/agentic/events/stream

### Agent Roster (19 entities: 18 AI + 1 human)

| ID | Name | Role | Dept | Type |
|---|---|---|---|---|
| brodiblanco | Jeremy Beebe | Founder & CEO | Executive | human |
| zoe | Zoe Patel | Executive Agent | Executive | ai |
| atlas | Atlas | Operations Agent | Operations | ai |
| vance | Vance | Executive Agent | Executive | ai |
| pulse | Pulse | People Ops | Operations | ai |
| sentinel | Sentinel | System Monitor | Operations | ai |
| iris | Iris | Engineering Lead | Engineering | ai |
| dev | Dev | Backend Engineer | Engineering | ai |
| sam | Sam | Data Analyst | Engineering | ai |
| taylor | Taylor | Security Engineer | Engineering | ai |
| theo | Theo | DevOps Engineer | Engineering | ai |
| casey | Casey | Marketing Lead | Marketing | ai |
| maya | Maya | Grant Strategist | Grants | ai |
| raj | Raj | Legal & Compliance | Legal | ai |
| drew | Drew | Sales Lead | Sales | ai |
| irrig8 | Irrig8 Field Agent | Field Operations | Operations | ai |
| rain | RAIN | Regulatory Intelligence | Strategy | ai |
| vpc | VPC Agent | Gaming Operations | Operations | ai |
| trenchbabys | Trenchbabys Agent | Retail Operations | Sales | ai |

Canonical name: zoe (tribute to Zo platform). No fictional Arkad names.

### Canonical Data Values
- Task status: TODO | IN_PROGRESS | BLOCKED | DONE
- Priority: P0 | P1 | P2 | P3
- Agent status: ACTIVE | IDLE | OFFLINE | ERROR

## 5-LAYER ARCHITECTURE



## ORCHESTRATION ENGINE (5 MODULES — ALL IMPLEMENTED)

| Module | File | Purpose |
|--------|------|---------|
| Reasoning Stream | reasoning_stream.py | Append-only audit |
| Phase Gates | phase_gates.py | Conditional checkpoints |
| Workflow DAG | workflow_dag.py | Learnable DAG templates with IER override |
| IER Router | ier_router.py | Contextual bandits — explainable routing |
| Coherence Engine | coherence_engine.py | Parallel execution layers |

## EVENT-DRIVEN ARCHITECTURE

No rrule. No polling. Pure cascade.

### 4-Tier Cascade


### Event Schema (10-Point Reality Vector)
| Field | Symbol | Description |
|-------|--------|-------------|
| Timestamp | t | Milliseconds since epoch |
| Spatial X | s_x | Longitude or abstract |
| Spatial Y | s_y | Latitude |
| Z-Negative | z_negative | Risk/concern (-100 to 0) |
| Z-Positive | z_positive | Value/opportunity (0 to +10m) |
| Certainty | c | Confidence [0.0–1.0] |
| Logic State | l | DAP decision state |
| Fidelity | v_f | Resolution scale factor |
| Economic | e | Value/cost in USD |
| Governance | g | Compliance status |

### Event Taxonomy


## 9-PLANE DAP (DETERMINISTIC AUTONOMOUS PROTOCOL)

| Plane | Name | Threshold | Type |
|-------|------|-----------|------|
| 1 | Boolean | z_positive < 0.20 | Deterministic |
| 2 | Temporal | time > 24h | Deterministic |
| 3 | Spatial | Kriging coverage > 80% | Deterministic |
| 4 | Geostatistical | variogram model confidence | Deterministic |
| 5 | Hydraulic | percolation > 0.50 | Deterministic |
| 6 | Atmospheric | ET integration complete | Deterministic |
| 7 | Economic | e > 0 (positive ROI) | Bounded |
| 8 | Compliance | governance == COMPLIANT | Deterministic |
| 9 | Strategic | Long-term optimization | Supervised |

Planes 1-6: deterministic. Planes 7-9: bounded uncertainty, human approval for edge cases.

## IRRIG8-SPECIFIC: 4-TIER EAN (SymphonyOS IP)



## AGENT TRIGGER MATRIX

| Agent | Subscriptions | DAP Planes |
|-------|-------------|------------|
| zoe | sfd.*, pmt.*, rss.anomaly.* | [7,8,9] |
| pulse | sfd.agent.*, rss.execution.* | [1,2] |
| iris | pmt.*, dhu.* | [3,4,10,11,12] |
| atlas | sfd.*, rss.* | [5,6,7,8] |
| maya | pmt.market.*, rss.funding.* | [7,9] |
| sentinel | sfd.*, rss.anomaly.* | [1,2,3,4] |

## WU-BASED PRICING MODEL

- BASE_COST: bash.50/WU
- PLATFORM_PREMIUM: bash.20/WU
- Total: bash.70/WU
- Role range: 6-45 WU
- 13 departments, ~90 roles

## DETERMINISM GUARANTEES

| Layer | Input | Output | Guarantee |
|-------|-------|--------|-----------|
| AMP Messages | Binary wire format (76+ bytes) | Same binary format | Byte-exact |
| Tasks | Kotlin data class with JSON schema | Task result with status enum | Type-safe |
| Triggers | Cron OR event type | Cascade actions (1..n) | No orphans |
| Builds | Locked dependency hashes | Binary with SHA256 | Reproducible |

## UTILIZATION TARGET

CPU target: 85%-95%. Minimum: 30%. Never idle.
- CPU < 70% for 3 min → batch burst
- CPU < 50% for 5 min → synthetic task generation
- No active tasks 10 min → Sentinel diagnostic mode

## INTEGRATIONS (connected)

Gmail | Google Calendar | Google Tasks | Google Drive | Notion | Airtable | Linear | Spotify | Dropbox | Supermemory
- Stripe: partial (read only)
- GitHub: NOT CONNECTED
- SMS/SignalWire: API routes exist

## CRITICAL GAPS

| Priority | Gap | Description |
|----------|-----|-------------|
| P0 | Truth Gate | No-Fetch-No-Think mandatory RAG — NOT IMPLEMENTED |
| P0 | Deterministic Shell | Command whitelist — NOT IMPLEMENTED |
| P0 | Self-Modification Engine | Darwin Gödel cycle — NOT IMPLEMENTED |
| P1 | SEM Worksheet Engine | 48-hour edge autonomy — NOT IMPLEMENTED |
| P1 | SHA-256 Forensic Sealing @ PMT | Court-admissible hash chain — NOT IMPLEMENTED |
| P1 | IER weekly training loop | Q-value re-evaluation — NOT IMPLEMENTED |
| P1 | Android Agentic Panel (native Kotlin) | PIMPED Edition spec — NOT IMPLEMENTED |
| P2 | 9-Plane DAP Decision Engine | SymphonyOS IP — NOT IMPLEMENTED |
| P2 | FTE Satellite Calibration | SymphonyOS IP — NOT IMPLEMENTED |
| P2 | GitHub OAuth Integration | Connected workspace — NOT IMPLEMENTED |

## FUNDING CASCADE — 4-FUNDING-PLANE DAP

| Plane | Component | Threshold | Trigger |
|-------|-----------|-----------|---------|
| P1: Urgency | Burn runway / opportunity cost | <90 days cash / >M opportunity | Immediate |
| P2: Validation | Proof points / credibility | Patent filed OR metrics captured | Unlock conversations |
| P3: Competitive | Term sheets / grant awards | 2+ competing offers OR 00K+ non-dilutive | Optimize leverage |
| P4: Structural | Equity vs non-equity | Non-dilutive >50% of target | Prioritize grants/RBF |

## LIVE SYMPHONY (RESEARCH)

Research project proving agentic systems can conduct their own research using human as proxy. Not a product — a research layer. Internal middleware, separate LLC planned.

## CANONICAL DIRECTORY STRUCTURE



## NON-NEGOTIABLE RULES

1. Agentic is canonical — never Agentic, ABE, Helm
2. Irrig8 is canonical — never FarmSense
3. No nested Bxthre3/
4. P0/P1 to Jeremy only — via INBOX.md + SMS
5. Agentic is internal only — trade secret
6. RAG before reporting — always read source files
7. Verify or Die — never fabricate, cite everything

## PRODUCT DEFINITIONS

| Product | Type | Status |
|---------|------|--------|
| Bxthre3 Inc | Delaware C-Corp | Active |
| Irrig8 LLC | Colorado LLC — precision agriculture SaaS | Active |
| VPC LLC | Nevada/Wyoming LLC — sweepstakes gaming | Active |
| Valley Build-A-Biz LLC | Colorado LLC — SMB kits | Active |
| RAIN LLC | Delaware LLC — intel subscriptions | Draft |
| ARD/Oferta LLC | Colorado LLC — real estate arbitrage | Minimal |
| Trenchbabys LLC | Colorado LLC — DTC retail | Draft |

## IP PORTFOLIO (PROVISIONAL — NOT YET FILED)

| ID | Title | Deadline |
|----|-------|---------|
| P1 | Bi-Dimensional Resource Orchestration (10-Point Vector) | 2026-05-15 |
| P2 | Forensic Environmental Data Sealing | 2026-05-15 |
| P3 | Deterministic Autonomous Protocol (9-Plane DAP) | 2026-05-15 |
| P4 | Cascading Workflow Trigger | 2026-05-15 |
| P5 | Self-Modification Engine | 2026-05-15 |
| P6 | Antifragile Event Cascade | 2026-04-19 |
| P7 | 48-Hour Local Autonomy | 2026-06-15 |
| P8 | Fidelity Transition Event | 2026-06-15 |

Owner: Raj (Legal). Status: PROVISIONAL PENDING.

## GITHUB REPO DISPOSITION

| Repo | Action |
|------|--------|
| bxthre3inc/agentic | RENAME to agentic |
| bxthre3inc/agentic | ARCHIVE |
| bxthre3inc/AgenticBusinessEmpire | ARCHIVE (superseded) |
| bxthre3inc/Helm-the-Business-Automation-Platform | KEEP (public MIT) |
| bxthre3inc/mcp-mesh | MERGE into agentic/mesh/ |
| bxthre3inc/Distributed-Execution-System | MERGE into agentic/execution/ |
| bxthre3inc/zo-computer-android | KEEP as agentic-android-client |
| bxthre3inc/zo-computer-linux | KEEP as agentic-linux-client |
| bxthre3inc/GhostCloud | KEEP private |
| bxthre3inc/instant-ai-widget | KEEP (public MIT) |

## ZO VS AGENTIC BOUNDARY

**Zo.computer is the hosting layer. Agentic is the management layer.**
- Zo: builds and hosts zo.space routes, runs user services, provides terminal/AI tooling
- Agentic: owns all Bxthre3 strategy, manages workspace structure, configures services

**Never the twain shall cross.**

---

*AGENTIC MERGED SPEC — CANONICAL-FINAL — 2026-04-11*
*All decisions resolved. All sources merged. Zero hallucinations.*
