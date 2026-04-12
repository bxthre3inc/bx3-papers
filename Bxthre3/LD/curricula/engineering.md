# Engineering Training Curriculum
**Department:** Engineering | **Lead:** Iris | **L&D Owner:** Learn

---

## Role Baseline Skills

| Skill | Required Level | Agents |
|---|---|---|
| TypeScript / Bun | Proficient | All |
| Kotlin (Android) | Working | dev, iris |
| Python (Flask) | Working | All backend |
| AMP Protocol | Expert | iris, dev |
| Zo.space Routes | Proficient | All |
| Git / Version Control | Proficient | All |
| SQLite / DuckDB | Working | All |
| Security (TLS, auth) | Working | taylor |

---

## Required Training Modules

### Module E1 — Agentic Architecture (All Engineers)
**Duration:** 2 hours  
**Format:** Self-paced + quiz  
**File:** `the-agentic-project/AGENTOS_ARCHITECTURE_v6.2.md`

| Topic | Depth |
|---|---|
| Determinism Principle | Must understand |
| AMP Message Protocol | Must implement |
| Trigger Taxonomy | Must know all triggers |
| Task Loop | Must trace end-to-end |
| Guard Rails v6.2 | Must follow |

**Verification:** Score ≥ 80% on architecture quiz (to be created)

---

### Module E2 — Android Integration (dev, iris)
**Duration:** 4 hours  
**Prerequisites:** E1  
**File:** `the-agentic-project/mobile/`

| Topic | Depth |
|---|---|
| AMPService lifecycle | Must implement |
| Task routing (accept/reject/complete) | Must implement |
| AMPDiscovery peer finding | Must understand |
| Crypto/ThresholdSigner | Must know |
| HLC Logical Clock | Must understand |

**Verification:** Pull request merging mobile AMP work

---

### Module E3 — Backend & Mesh Server (All Backend)
**Duration:** 3 hours  
**Prerequisites:** E1  
**File:** `the-agentic-project/server/`

| Topic | Depth |
|---|---|
| Flask server routes | Must extend |
| mesh_server.py AMP handling | Must modify |
| Worker pattern (oracle, render, fly) | Must understand |
| WebSocket mesh signaling | Must debug |

**Verification:** Can trace a task from Android → mesh_server → worker → result

---

### Module E4 — Zo.space Route Development (All)
**Duration:** 2 hours  
**Prerequisites:** E1  
**Reference:** `/?t=settings&s=integrations`

| Topic | Depth |
|---|---|
| Hono routing patterns | Must use |
| API route security (bearer auth) | Must implement |
| Route registration and syncing | Must follow |
| Error handling and logging | Must do |

**Verification:** New route passes Sentinel check

---

### Module E5 — DevOps & Infrastructure (theo)
**Duration:** 4 hours  
**Prerequisites:** E1, E3

| Topic | Depth |
|---|---|
| Service registration (register_user_service) | Must manage |
| Health check patterns | Must implement |
| Log retrieval (Loki) | Must use |
| Backup verification | Must perform |

**Verification:** Can restore from backup without data loss

---

## Skill Gap Matrix — Engineering

| Agent | TypeScript | Kotlin | Python | AMP | Zo.space | Git | Security |
|---|---|---|---|---|---|---|---|
| iris | ●●●○ | ●●●○ | ●●●○ | ●●●○ | ●●●○ | ●●●○ | ●●○○ |
| dev | ●●●○ | ●●●○ | ●●○○ | ●●●○ | ●●●○ | ●●●○ | ●○○○ |
| sam | ●●●○ | ○○○○ | ●●●○ | ●○○○ | ●●○○ | ●●○○ | ○○○○ |
| taylor | ●●●○ | ○○○○ | ●●●○ | ●○○○ | ●○○○ | ●●●○ | ●●●○ |
| theo | ●●●○ | ○○○○ | ●●○○ | ●○○○ | ●○○○ | ●●●○ | ●○○○ |

**Legend:** ●●●○ = Expert | ●●●○ = Proficient | ●●○○ = Working | ●○○○ = Novice

---

## Cross-Training Opportunities

| From | To | Value |
|---|---|---|
| dev → iris | Android AMP expertise | Redundancy |
| theo → dev | Backend debugging | Coverage |
| sam → taylor | Security patterns | Security depth |

---

## Next Actions

- [ ] Deploy E1 quiz system
- [ ] Schedule E2 workshops with iris
- [ ] Pair sam with taylor on security module
