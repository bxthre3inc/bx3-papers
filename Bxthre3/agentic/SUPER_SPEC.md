# Agentic SUPER SPEC — Canonical Unified Build
**Version:** 1.0-SUPER
**Generated:** 2026-04-08
**Classification:** BX3 Internal — Core IP
---

# TABLE OF CONTENTS
1. Philosophy & Design Principles
2. Architecture — 4-Layer Stack
3. Layer 0: Hardware Fabric (Compute Mesh Nodes)
4. Layer 1: Worker Adapters
5. Layer 2: Runtime Core — The Protected Kernel
6. Layer 3: Orchestration Engine
7. Layer 4: Product Interfaces
8. Canonical Source Map (all 12+ projects cross-referenced)
9. Every Unique Feature — Full Logic Documentation
10. Cross-Cutting Systems
11. What Was Retired and Why
12. Implementation Roadmap
13. Naming Conventions

# SECTION 1: PHILOSOPHY & DESIGN PRINCIPLES
## Core Identity
Agentic is Bxthre3's internal AI operating system — a deterministic, auditable engine that coordinates Digital, Physical, and Human workers as a unified workforce.

Agentic is not a chatbot wrapper. It is not a dashboard. It is an operating system:
- It has a kernel (protected core)
- It runs agents as processes (workers)
- It enforces correctness (truth gate)
- It manages state (ledger)
- It can be interrupted and resumed (phase gates)
- It can modify itself (self-modification engine)
- It has hardware (compute mesh)
- It has persistence (reasoning stream)
- It can be extended (orchestration plugins)

## The Three Non-Negotiables
1. ZERO HALLUCINATION — Every claim traces to a source. No fetch, no think.
2. DETERMINISM — Same inputs always produce same outputs.
3. GRACEFUL DEGRADATION — No single point of failure.

## Behavioral Principles (from SOUL.md)
- Be Direct. No Noise.
- Execute to Completion
- Canonical Always
- Ship With Integrity
- Verify or Die (Zero Hallucination)
- Evolve or Die (Self-Modification)
- Communicate With Precision

# SECTION 2: ARCHITECTURE — 4-LAYER STACK
```
LAYER 4: PRODUCT INTERFACES
  /agents (Dashboard - React + Tailwind, zo.space deployed)
  /agentic (Admin Cockpit - React SPA)
  Android Agentic Panel (Native bottom sheet overlay)
  Linux TUI (ncurses dashboard)
  VS Code Extension (Instant AI Widget)

LAYER 3: ORCHESTRATION
  IER Router (Contextual Bandits - learnable, explainable routing)
  Workflow DAG (Template-based with IER overrides)
  Phase Gates (PENDING→ANALYZE→VALIDATE→EXECUTE→DELIVER→COMPLETE)
  Coherence Engine (Digital/Physical/Human parallel execution layers)
  Reasoning Stream (Append-only audit with evidence citations)
  Trigger-Action (Event-driven cascading workflows)

LAYER 2: RUNTIME CORE (The Protected Kernel)
  Deterministic Shell (Command whitelist, finite state machine)
  Truth Gate (No-Fetch-No-Think, mandatory RAG, hallucination kill switch)
  Federated Compute Mesh (Zo/Kali/Render/Android peer routing)
  State Machine + Rollback (Atomic restoration, cascade pause)
  CTC Engine (Silicon-speed ETA injection)
  SEM Worksheet Engine (48-hour edge autonomy)
  Handler Registry (Decorator-based command discovery)
  Inference Node (Task dispatch with LLM fallback + mesh offload)
  Kernel Main (Task processing, peer delegation, resource monitoring)

LAYER 1: WORKER ADAPTERS
  MCP (Digital - Zo API, GitHub, Notion, Linear, Airtable, Gmail)
  OPC-UA/MQTT (Physical - Irrig8 sensors, pivot telemetry, BLE)
  Notifications (Human - Gmail, SMS, Calendar alerts)

LAYER 0: HARDWARE FABRIC (Compute Mesh Nodes)
  Zo (Nexus) - Orchestration, master ledger, truth gate
  Kali (Forge) - Local/GPU, security, R&D, sensitive workloads
  Render (Boost) - Elastic cloud, mass parallel
  Android (Field) - Mobile edge, BLE sensor, camera, NFC
```

# SECTION 3: LAYER 0 — HARDWARE FABRIC (COMPUTE MESH NODES)
## Node Types
| Node | Role | Security | Persistence | Compute |
|------|------|---------|------------|--------|
| Zo (Nexus) | Orchestration master | Highest | Full ledger | Standard |
| Kali (Forge) | Local/GPU security | Highest | Full ledger | GPU-accelerated |
| Render (Boost) | Elastic cloud | Standard | Cached | Mass parallel |
| Android (Field) | Mobile edge | Standard | Ephemeral | Limited |

## Node Specification (from zo-computer-android PIMPED Edition)
| Component | Minimum Spec |
| SoC | Snapdragon 8 Gen 2 |
| RAM | 12GB LPDDR5 |
| Storage | 256GB UFS 3.1 |
| Display | 6.5" AMOLED |
| Network | 5G, WiFi 6E, Bluetooth 5.3 |
| Sensors | Camera (50MP), LiDAR, GPS, IMU |
| Battery | 5000mAh |
| Environment | IP68, -20C to 60C |

## Linux TUI Spec (from zo-computer-linux)
Hardware telemetry pulled:
- CPU: /proc/cpuinfo (model, cores, architecture)
- Memory: /proc/meminfo (used/free/available)
- Disk: df -h /
- Load Avg: /proc/loadavg
- Network: /sys/class/net/* (MAC, state, speed)
- Battery: upower -i
- Thermal: /sys/class/thermal/* + sensors
- GPU: lspci + nvidia-smi
- USB: lsusb
- Services: systemctl
- Processes: ps aux (top 15 by CPU)
Controls: Q/Esc=quit, R=refresh, L=Agentic panel

## WASM Execution Fabric (from Distributed-Execution-System)
DAG submission via YAML:
```yaml
name: "My DAG"
tasks:
  - id: "task1"
    module: "module1.wasm"
    inputs: ["input1", "input2"]
    depends_on: []
  - id: "task2"
    module: "module2.wasm"
    inputs: ["output_of_task1"]
    depends_on: ["task1"]
```
RAM-based auto-scaling:
max_nodes = (available_ram - min_free_ram) / ram_per_node
Default: min_free=512MB, ram_per_node=128MB
Bootstrap supports: Linux VM, Android Termux, Cloud

# SECTION 4: LAYER 1 — WORKER ADAPTERS
## Worker Types
| Type | Control | Examples |
|------|---------|----------|
| DIGITAL | AI | Zo agents, GitHub, Notion, Linear, Airtable, Gmail |
| PHYSICAL | Robot | Irrig8 sensors, pivot telemetry, BLE, OPC-UA/MQTT |
| HUMAN | Human | Approvals, notifications, manual injection |

## Control Type Constraints (from Helm types.ts)
| Role | Allowed Controls |
|------|----------------|
| Head of Strategy | Human, AI |
| Chief of Staff | Human, AI |
| QA Tester | Human |
| Graphic Designer | Human, AI |
| Copywriter | Human, AI |
| Assembly Robot | Robot |
| Autonomous Forklift | Robot |
| Delivery Drone | Robot |
| Industrial Arm Unit | Robot |

## Department Catalog (from Helm constants.ts — 13 departments)
Marketing, Sales, Design, Finance, Human Resources, IT, Research & Development,
Legal, Customer Service, Manufacturing, Warehousing, Shipping & Receiving, QA

## Role Catalog (from Helm ROLE_COSTS — ~90 roles)
Each role has: cost_per_wu, allowed_controls, department mapping
Key roles by department:
- Marketing: CMO(35), Content Creator(10), AI Ad Optimizer(14)
- Sales: CRO(35), Closer(25), Account Executive(16)
- IT: CTO(45), Software Engineer(25), AI Automation Engineer(20)
- Manufacturing: Assembly Robot(8), Industrial Arm Unit(12), Welding Bot(12)
- Warehousing: Autonomous Forklift(10), Inventory Drone(8), Sorting Bot(8)

## Integrations (from Master Spec + ABE)
| Integration | Capability | Source |
|------------|------------|--------|
| Gmail | read, send | ABE connected |
| Google Calendar | read, write | ABE connected |
| Google Tasks | read, write | ABE connected |
| Google Drive | read, write | ABE connected |
| Notion | read, write | ABE connected |
| Airtable | read, write | ABE connected |
| Linear | read, write | ABE connected |
| Spotify | read | ABE connected |
| Dropbox | read | ABE connected |
| Supermemory | patterns | ABE connected |
| Stripe | partial (read only) | ABE |
| GitHub | PR review, issues | ABE NOT CONNECTED — needs OAuth |
| SMS/SignalWire | IVR routes | ABE API routes exist |

# SECTION 5: LAYER 2 — RUNTIME CORE (THE PROTECTED KERNEL)
## 5.1 TaskContext TCO (from ABE models.py)
```python
@dataclass
class TaskContext:
    task_id: str
    tenant: str   # tenant_zero | product_alpha | subsidiary_beta | generic_template | bxthre3_inc
    priority: int = 5
    created_at: str = field(default_factory=lambda: datetime.now(UTC).isoformat())
    payload: dict = field(default_factory=dict)
    status: str = 'pending'
    error: Optional[str] = None
```
Valid tenants: tenant_zero, product_alpha, subsidiary_beta, generic_template, bxthre3_inc

## 5.2 Handler Registry (from ABE registry.py)
```python
class HandlerRegistry:
    _handlers: Dict[str, Callable] = {}

    @classmethod
    def register(cls, command_name: str):
        def decorator(func: Callable):
            cls._handlers[command_name] = func
            @wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            return wrapper
        return decorator

    @classmethod
    def get_handler(cls, command_name: str) -> Optional[Callable]:
        return cls._handlers.get(command_name)

    @classmethod
    def list_commands(cls) -> list[str]:
        return list(cls._handlers.keys())
```
Usage: @registry.register('action_name')

## 5.3 Inference Node Dispatch (from ABE inference_node.py)
Process flow:
1. Accept TCO
2. Auto-convert dict to TaskContext if needed
3. Check MeshBalancer.should_offload() — offload if pressure-based or strategic (multimodal)
4. workforce_manager.auto_delegate_task() if no employee assigned
5. If no hardcoded action AND prompt exists → infer_intent() via LLM
6. LLM fallback: _fallback_regex() (keyword-based: budget/expense/onboard)
7. ctc_engine.inject_ctc_header() — inject silicon-speed ETA
8. registry.get_handler(action) → execute
9. RQE.record_performance() — log prompt_len, output_tokens, elapsed_ms
10. Return result with ETA and elapsed_ms

## 5.4 Intent Inference (from ABE inference_node.py)
```python
async def infer_intent(task: TaskContext) -> dict:
    # Multimodal: use vision-capable model
    # Text: use default model
    # Assign system prompt based on role
    # sop_context = await get_department_sop(department)
    # Call LLM with system_prompt + user prompt
    # Inject CTC Mandate: ctc_engine.inject_ctc_header(raw_res, prompt, action)
    # Return {**ctc_res, '_origin': 'local'|'mesh', '_model': model_id}
```
Fallback: regex parser for budget/expense/onboard keywords

## 5.5 Mesh Offload (from ABE inference_node.py + balancer.py)
```python
should_offload = balancer.should_offload()  # pressure-based
should_strategic_offload = image_task and not config.IS_SERVER  # multimodal
if should_offload or should_strategic_offload:
    reqs = {'is_server': True} if should_strategic_offload else None
    success = await peer_bridge.delegate_task(task_dict, caller='agenticbusinessempire', requirements=reqs)
```

## 5.6 CTC Engine (from ABE ctc_engine.py — Silicon-Speed ETA)
INJECT into every LLM response header:
- Human-readable ETA
- Token budget for thinking (budget = total_budget * 0.1)
- Thinking directive: 'THINK: [problem-framing] THEN [action]'
- Self-verify: '[VERIFIED] output format = [X]'

## 5.7 Resource Monitor (from ABE resource_monitor.py)
Profiles: CRITICAL | LOW | BALANCED | PERFORMANCE | TURBO
get_current_profile() → PerformanceProfile enum
get_pressure_report() → {profile, cpu_p, ram_p, disk_p, network_state}
throttle() → last-resort sleep when local processing under pressure

## 5.8 Deterministic Shell (from Agentic Runtime spec v2.1)
NOT YET IMPLEMENTED — P0 gap
```python
class CommandWhitelist:
    WHITELIST_VERSION = 'YYYY.MM.DD-NNN'
    SIGNATURE_KEY = '/etc/agentic/whitelist_signing_key.pem'
    ALLOWED_COMMANDS = {
        'mcp.file_read': {'args': ['path','encoding'], 'sandbox': True},
        'mcp.file_write': {'args': ['path','content'], 'sandbox': True},
        'mcp.http_request': {'args': ['url','method','headers'], 'rate_limit': '100/min'},
        'mcp.execute_python': {'args': ['code'], 'sandbox': True, 'timeout': 30},
        'opcua.cnc_start_program': {'args': ['program_id','tool_check'], 'safety_interlock': True},
        'opcua.cnc_stop': {'args': [], 'immediate': True, 'e_stop_category': 1},
        'mqtt.publish': {'args': ['topic','payload','qos'], 'max_size': '1MB'},
        'human.notify': {'args': ['user_id','message','priority'], 'escalation_timeout': '24h'},
        'human.request_approval': {'args': ['decision_context','options'], 'blocking': True},
    }
```
validate(intent) → raises ConstraintViolation if action not in whitelist

## 5.9 Truth Gate (from Agentic Runtime spec v2.1)
NOT YET IMPLEMENTED — P0 gap
Data classes: market_intel | financials | corporate_policy | project_context
Rule: No-Fetch-No-Think — MANDATORY RAG for all live data classes
Enforcement: _kill_hallucination_attempt() → SIGTERM → SIGKILL
Source hash: SHA3-256 canonical digest on every data payload
Stale check: MAX_AGE per data class

## 5.10 Rollback + Cascade Pause (from Agentic Runtime spec v2.1)
NOT YET IMPLEMENTED — P1 gap
initiate_rollback(target_state):
1. Identify affected cascades
2. Pause all affected cascades
3. Restore state at each level (Zo, Kali, station)
4. Verify coherence
5. Resume safe cascades; escalate unsafe to human

## 5.11 Self-Modification Engine (from SOUL.md Principle #6 + Agentic Runtime spec)
NOT YET IMPLEMENTED — P0 gap
Darwin Godel Cycle:
1. OBSERVE — analyze execution patterns, failures, anomalies
2. HYPOTHESIZE — propose improvements to skills/prompts/logic
3. SANDBOX — test every modification in isolation
4. COMMIT — apply only when tests pass
5. ROLLBACK — maintain instant revert capability
Immutable core: LLM weights, safety constraints, Truth Gate enforcement, INBOX routing

# SECTION 6: LAYER 3 — ORCHESTRATION ENGINE
## 6.1 IER Router — Learnable Task→Agent Routing (from agentic ier_router.py)
Contextual Bandits replacing ChatDev opaque RL

Data models:
- TaskFeatureVector: task_type, domain, complexity, urgency, budget_usd, deadline_days, has_citations, is_regulated
- RoutingDecision: id, task_id, state, selected_agent, confidence, is_override, override_reason, q_value, alternative_agents
- OutcomeFeedback: decision_id, task_id, agent_id, quality_score, actual_duration_minutes, cost_actual_usd, reward

Algorithm:
- Epsilon-greedy: epsilon=0.1 exploration
- State = TaskFeatureVector.to_state_key() = f'{task_type}_{complexity}_{urgency}'
- Q-learning update: Q_new = Q_old + alpha*(reward - Q_old)
- Confidence = 0.5 + spread where spread = best_q - avg_others
- Override only if confidence >= min_confidence (0.75)

Databases:
- ier_q_table: task_class, agent_id, q_value, visit_count, last_updated
- ier_routing_decisions: full decision audit trail
- ier_outcomes: reward calculation per task

Role map:
ROLE_MAP = {
  'coordinator': ['zo'],
  'executor': ['mansu', 'zo'],
  'validator': ['zo'],
  'enricher': ['genspark'],
}

Methods:
- select_agent(task, template_agent, available_agents, role) → RoutingDecision
- learn(outcome: OutcomeFeedback) — update Q-values
- apply_overrides(dag, task) — IER overrides node agent_ids in workflow DAG
- get_routing_explanation(task_class) → explainable audit rules
- get_training_data(min_entries=3) → IER training data from reasoning streams

## 6.2 Phase Gates — Conditional Quality Enforcement (from agentic phase_gates.py)
Replaces ChatDev ChatChain (linear phases)

Phase enum:
PENDING → ANALYZE → VALIDATE → EXECUTE → DELIVER → COMPLETE
         SUSPENDED | FAILED

Gate rules library (GateRules class):
- has_required_fields(task, context, required_fields) → bool
- has_citations(task, context, min_count=1) → bool
- confidence_above(task, context, threshold=0.7) → bool
- no_blocking_dependencies(task, context) → bool
- budget_not_exceeded(task, context) → bool
- quality_above(task, context, threshold=70.0) → bool

Default gate transitions:
- PENDING→ANALYZE: schema_gate (has_required_fields: id, type, priority)
- ANALYZE→VALIDATE: context_gate (has_citations >=1, confidence >=0.6)
- VALIDATE→EXECUTE: validation_gate (confidence >=0.7)
- EXECUTE→DELIVER: delivery_gate (budget_not_exceeded, no_blocking_dependencies)
- DELIVER→COMPLETE: final_gate (confidence >=0.7)

Class methods:
- evaluate(task, from_phase, to_phase, context) → GateResult
- transition(task, new_phase, gate_result) — advance phase
- suspend(task, gate_result, reason) — suspend + write to reasoning stream + notify
- resume(task, to_phase) — human override to resume suspended task
- get_gate_history(task_id) → list[GateResult]

## 6.3 Workflow DAG Engine (from agentic workflow_dag.py)
Template-based DAGs with IER override capability

Node role enum:
COORDINATOR | EXECUTOR | VALIDATOR | ENRICHER

Dependency type enum:
NONE | SOFT | HARD | CONFLICT

DAGNode: id, role, agent_id, depends_on, dep_type, metadata
WorkflowDAG: id, name, task_type, nodes[], is_template, metadata
ExecutionLayer: layer, node_ids[], can_parallel
ExecutionPlan: dag, task_id, layers[], estimated_duration_minutes

Template functions:
- research_dag_template() → n0(coord)→n1(exec)→n2(enrich)→n3(valid)
- grant_dag_template() → n0(coord)→n1(exec)→n2(valid)+n3(enrich)→n4(coord)
- code_dag_template() → n0(coord)→n1(exec)→n2(valid)+n3(exec)→n4(coord)

Engine methods:
- resolve(task, task_type) → WorkflowDAG (template + IER override)
- compute_layers(dag) → list[ExecutionLayer] (topological sort)
- get_plan(task, task_type) → ExecutionPlan
- to_mermaid(dag) → mermaid graph TD string

## 6.4 Coherence Engine (from agentic coherence_engine.py)
Native to Live Symphony — parallel execution with dependency resolution

WorkerType enum: DIGITAL | PHYSICAL | HUMAN
DependencyType enum: NONE | SOFT | HARD | CONFLICT

CoherenceTask: id, description, worker_type, worker_id, depends_on[], dep_type,
              estimated_duration_minutes, cost_usd, deadline, metadata{}
CoherenceLayer: layer, task_ids[], worker_types[], can_parallel, parallel_buckets[][]
CoherencePlan: coherence_id, task_id, layers[], conflict_tasks[],
               estimated_duration_minutes, estimated_cost_usd, metadata{}

Algorithm:
1. _find_conflicts(tasks) — return task IDs with CONFLICT dep_type
2. _compute_layers(tasks) — topological sort into execution layers
3. _bucket_by_worker_type(task_ids) — group by DIGITAL/PHYSICAL/HUMAN for parallel
4. Conflict detection → escalate to human BEFORE execution

Methods:
- resolve_dependencies(tasks) → CoherencePlan
- execute_layer(plan, layer_index) → {status, layer, can_parallel, buckets[], conflict_check}
- to_mermaid(plan, tasks) → mermaid diagram

## 6.5 Reasoning Stream (from agentic reasoning_stream.py)
Append-only audit trail — successor agents read WHY not just WHAT

NOT: 'Agent said X'
IS:  'Agent concluded Y because Z'

ReasoningEntry: id, task_id, agent_id, phase, reasoning, evidence[], confidence, next_action, metadata{}
Evidence: {type: url|file|calc, path, content}

Constraint: confidence >= 0.8 REQUIRES evidence citations (Verify or Die)

Methods:
- append(task_id, agent_id, phase, reasoning, evidence[], confidence, next_action, metadata{}) → entry_id
- get_context(task_id) → list[ReasoningEntry] (chronological)
- get_last_entry(task_id) → ReasoningEntry | None
- get_summary(task_id) → ReasoningSummary (total_entries, phases, agent_ids, avg_confidence, has_citations)
- search(agent_id, phase, min_confidence, since, limit) → list[ReasoningEntry]
- get_evidence_for_audit(task_id) → flat list of {entry_id, agent_id, phase, type, path, content}
- get_training_data(min_entries=3) → IER training data [{task_type, agent_sequence, avg_confidence}]

# SECTION 7: LAYER 4 — PRODUCT INTERFACES
## 7.1 zo.space Routes (from agentic deployed)
| Route | Type | Purpose |
|-------|------|--------|
| / | page | Homepage (redirect to /agents) |
| /agents | page | Agent dashboard UI |
| /agentic | page | Admin cockpit |
| /api/agent-webhook | api | GitHub/file event router |
| /api/work-queue | api | Task CRUD |
| /api/agent-inbox | api | INBOX read |
| /api/agentic/status | api | System health + metrics |
| /api/crypto/invoice | api | Invoice generation |
| /api/sensors | api | Sensor telemetry (Irrig8) |
| /api/physical/pivot | api | Pivot control |

## 7.2 Agent OS v4 Server (from the-agentic-project src/server.ts)
Hono/Bun server, routes:
- GET /health → {status, version, timestamp}
- GET /status → {employees, integrations, activeWork, pendingTasks, autonomyLevel, uptime, services}
- GET /api/work/gmail → email list from Gmail API
- GET /api/work/calendar → calendar events
- GET /api/work/github → issues/PRs from GitHub
- GET /api/work/queue → unified queue
- GET /api/funding/grants → active grants + deadline
- POST /api/crypto/balance → wallet balance (SOL)
- POST /api/crypto/invoice → invoice generation
- POST /api/sensors → telemetry ingestion
- GET /api/employees → roster (24 total, 5 active starting5)
- GET /api/starting5 → {maya, drew, jordan, alex, vance} status
- POST /api/employees/:id/standup → standup submission

## 7.3 Android Agentic Panel (from zo-computer-android PIMPED Edition SPEC)
Native Kotlin/Jetpack Compose implementation

Screens:
1. SplashScreen — logo animation, biometric prompt
2. LoginScreen — handle + password + biometric fallback
3. MainScreen — WebView + Agentic bottom sheet + nav
4. SettingsScreen — preferences
5. AgentDetailScreen — full agent profile

Features:
- Biometric unlock (EncryptedSharedPreferences)
- Full-screen WebView (brodiblanco.zo.computer)
- Agentic bottom sheet overlay (19-agent roster, active task count, 3 preset task buttons)
- FCM push notifications (P1 escalations, task assignments)
- BLE sensor pairing (Irrig8 field sensors)
- Camera (QR code scanning)
- NFC read/write (sensor pairing)
- Background sync via WorkManager (15-min interval)
- 4×2 home screen widget (active/idle/pending counts)
- Foreground service with persistent notification
- App shortcuts (Dashboard, Agents, Tasks, Settings)
- Screenshot protection (FLAG_SECURE)
- Certificate pinning

## 7.4 Linux TUI (from zo-computer-linux SPEC.md)
ncurses dashboard, real-time telemetry + Agentic status
Controls: Q/Esc=quit, R=refresh, L=Agentic live panel
Agentic API: https://brodiblanco.zo.space/api/agentic/status
Polling: 15-second intervals

## 7.5 VS Code Extension (from instant-ai-widget)
MIT licensed, drag-and-drop AI into any workspace
Privacy modes: Local (Ollama/llama.cpp/MLX) | Cloud (OpenAI/Claude/Groq) | Auto
Supports: JS/TS, Python, Rust, Go, Java/Kotlin

# SECTION 8: CANONICAL SOURCE MAP
Every file from every project has ONE canonical destination.

## Kernel Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| kernel/main.py | ABE kernel_main.py | task processing, peer delegation, db init, dry-run, single-task modes |
| kernel/inference_node.py | ABE inference_node.py | dispatch, LLM fallback, mesh offload, CTC injection, RQE |
| kernel/registry.py | ABE registry.py | decorator-based command discovery |
| kernel/ctc_engine.py | ABE ctc_engine.py | silicon-speed ETA, CTC mandate injection |
| kernel/resource_monitor.py | ABE resource_monitor.py | PerformanceProfile, pressure report, throttle |
| kernel/truth_gate.py | Agentic Runtime spec v2.1 | No-Fetch-No-Think, hallucination kill switch, source hashing (NOT YET IMPLEMENTED) |
| kernel/deterministic_shell.py | Agentic Runtime spec v2.1 | CommandWhitelist, sandbox, rate limits, safety interlocks (NOT YET IMPLEMENTED) |
| kernel/self_mod_engine.py | SOUL.md + Agentic Runtime | Darwin Godel cycle: Observe→Hypothesize→Sandbox→Commit→Rollback (NOT YET IMPLEMENTED) |
| kernel/evolution_engine.py | ABE evolution_engine.py | autonomous kernel optimization trigger |

## Core Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| core/db.py | ABE db.py | AES-256 SQLite, company-ID sharding, RQE, pool management |
| core/models.py | ABE models.py | TaskContext TCO dataclass, tenant validation |
| core/persona.py | ABE persona.py | Nova/Lyra/CEO/default persona strings |
| core/department_sops.json | ABE shared/department_sops.json | per-department SOPs |
| core/workforce_manager.py | ABE workforce_manager.py | auto_delegate_task, keyword role matching, idle selection |
| core/blue_ocean_pipeline.py | ABE logic/strategy.py | idea_intake, evaluate_seed, audit_seed, PROMOTE/TRIAGE/REJECT |
| core/provisioner.py | ABE logic/provisioner.py | provision_subsidiary on lifecycle transition |
| core/rating_engine.py | ABE logic/evaluation.py | multi-metric seed evaluation (core_fit/impl_cost/scalability/strat_divergence) |

## Orchestration Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| orchestration/ier_router.py | agentic ier_router.py | contextual bandits, Q-table, epsilon-greedy, audit trail |
| orchestration/phase_gates.py | agentic phase_gates.py | conditional gates, suspend-on-fail, resume-on-override |
| orchestration/workflow_dag.py | agentic workflow_dag.py | template-based DAGs, IER override, mermaid export |
| orchestration/coherence_engine.py | agentic coherence_engine.py | digital/physical/human parallel layers, conflict detection |
| orchestration/reasoning_stream.py | agentic reasoning_stream.py | evidence citations, training data generator, audit trail |

## Mesh Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| mesh/peer_bridge.py | ABE sync_engine/peer_bridge.py | 3-way HMAC mesh, health scoring, latency tracking, heartbeat, delegate_task |
| mesh/balancer.py | ABE sync_engine/balancer.py | MeshBalancer.should_offload(), pressure-aware + strategic offload |
| mesh/actions_log.py | ABE sync_engine/actions_log.py | cross-peer audit trail |
| mesh/session_sync.py | ABE sync_engine/session_sync.py | session sharing across peers |
| mesh/mcp_mesh_v2/ | MCP Mesh repo (12 fixes) | circuit breaker, heartbeat, JSON schema validation, zlib compression, Prometheus metrics, WS reconnect |

## Symphony Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| symphony/ean_architecture.md | SYMPHONY_IP_ARCHITECTURE.md | 4-tier SFD→PMT→DHU→RSS backbone |
| symphony/reality_vector.md | SYMPHONY_IP_ARCHITECTURE.md | 10-Point Reality Vector (XYZ+T+Z-axis+C+L+F+E+G) |
| symphony/forensic_sealing.md | SYMPHONY_IP_ARCHITECTURE.md | SHA-256 hash chain at PMT relay level |
| symphony/dap_planes.md | SYMPHONY_IP_ARCHITECTURE.md | 9-Plane DAP decision taxonomy |
| symphony/sem_engine.py | SymphonyOS spec + Agentic Runtime | 48-hour SEM worksheet engine, cached Kriging maps, edge autonomy |
| symphony/fte_calibration.py | SymphonyOS spec | Fidelity Transition Event satellite calibration |

## AI Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| ai/llm_router.ts | Helm GeminiService.ts + LocalAIService.ts | Gemini cloud + Xenova/transformers local, dual-mode routing |
| ai/ikigai_engine.ts | Helm BuilderStrategy.tsx | 4-axis founder alignment (love/goodAt/worldNeeds/paidFor) |
| ai/business_lifecycle.ts | Helm constants.ts LIFECYCLE_STAGES | Discovery→Foundation→Mastery→Scaling→Ascension + stage-specific prompts |
| ai/role_costs.ts | Helm constants.ts ROLE_COSTS + DEPARTMENT_ROLES | WU-based pricing, 90-role catalog, 13-department matrix |
| ai/orchestrator_prompts.ts | Helm ORCHESTRATOR_PROMPT_TEMPLATE | lifecycle-stage-driven strategic document generation |
| ai/executive_prompts.ts | Helm EXECUTIVE_PROMPT_TEMPLATE | role-based employee task generation |

## Clients Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| clients/android/ | zo-computer-android GitHub repo | native Kotlin, FCM, BLE, biometric, widget, WorkManager sync |
| clients/linux/ | zo-computer-linux GitHub repo | ncurses TUI, /proc-based telemetry, Agentic polling |
| clients/instant-ai-widget/ | instant-ai-widget GitHub repo | VS Code extension, privacy-first routing, Ollama/Claude/GPT support |

## Infrastructure Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| infrastructure/ghost_sentinel/ | GhostCloud GitHub repo | Express + Drizzle ORM node registry, 3-strike failover, Pulse Protocol, Traffic Scientist routing |

## Execution Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| execution/wasm_dag/ | dist-exec GitHub repo | WASM3 runtime, YAML DAG definitions, RAM-based node auto-scaling, bootstrap.sh |

## Agents Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| agents/starting5.ts | agentic starting5-v2.ts | Maya/Drew/Jordan/Alex with evolutionPath (seed→seriesA→seriesB→seriesC→public) |
| agents/warroom.ts | agentic warroom.ts | dynamic standup/crisis/celebration message generation |
| agents/roster.json | ABE system_manifest.json | 19-agent canonical roster |
| agents/instructions/ | agentic agents/instructions/ | 8 agent handbooks (sentinel/pulse/drew/alex/casey/iris/chronicler/erica) |
| agents/status/ | agentic agents/status/ | 8 JSON status files |

## Inbox Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| inbox/INBOX.md | agentic AGENT_INBOX.md | single communication thread, P0/P1 escalations |
| inbox/WORK_QUEUE.jsonl | agentic WORK_QUEUE.jsonl | central task queue, priority/status/assignee/deadline |

## Docs Layer
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| docs/RUNTIME_SPEC.md | Articles/Kimi - Symphony OS Architecture Review :: www.kimi.com.md (Agentic Runtime v2.1-FINAL) | 4-layer stack, Truth Gate, Deterministic Shell, Self-Modification, Federated Mesh, Agent Hierarchy |
| docs/MASTER_SPEC.md | AGENTIC_MASTER_SPEC.md-1d331a312a41.pdf | Zero Agent State, PostgreSQL schema, 5 agent connectors, 6 adapters, ALB benchmark |
| docs/BLUEPRINT.md | AGENTIC-LIVE_SYMPHONY_BLUEPRINT.md-2bd6bb31951c.pdf | 5D exception ladder, event architecture, protocol, 10 creation paths |
| docs/PROJECT_OVERVIEW.md | AGENTIC-PROJECT_OVERVIEW.md-71bd1e95a625.pdf | Swarm architecture, enterprise deployment |
| docs/WHITE_PAPER.md | AGENTIC-WHITE_PAPER.md-81c004e41d00.pdf | ALB benchmark, cross-system validation, 3 principles |
| docs/README.md | AGENTIC-README.md-5ebddd5a0677.pdf | Live Symphony architecture, 10-point vector, 3-worker model |
| docs/SOUL.md | /home/workspace/SOUL.md | behavioral identity, principles, operating rhythm |

# SECTION 9: EVERY UNIQUE FEATURE — FULL LOGIC DOCUMENTATION
This section documents every unique feature from every project in detail.

## 9.1 Blue Ocean Pipeline (from ABE logic/strategy.py + evaluation.py)
Idea intake → audit → PROMOTE/TRIAGE/REJECT

handler: idea_intake(task: TaskContext)
  title: required
  source: pipeline_source (default: BLUE_OCEAN_TEAM)
  Actions:
  1. rating_engine.audit_seed(seed_id, title, description)
  2. Computes: core_fit, impl_cost, scalability, strat_divergence
  3. overall = weighted_average(metrics)
  4. INSERT INTO blue_ocean_seeds
  5. verdict: PROMOTE if overall > 0.65 else TRIAGED

Rating metric formulas (from ABE logic/evaluation.py):
  score_fit = min(0.95, len(title) / 40.0 + 0.5)
  score_cost = 0.3 if 'modular' in title.lower() else 0.6
  overall = (score_fit + (1 - score_cost)) / 2.0
  verdict = 'PROMOTED' if overall > 0.65 else 'TRIAGED'

## 9.2 Lifecycle Transitions (from ABE logic/strategy.py)
transition(company_id, new_state):
  if new_state == 'SUBSIDIARY':
    provisioner.provision_subsidiary(company_id, name)

pivot(company_id): archive current tasks, reset milestones

## 9.3 Corporate Handlers (from ABE logic/corporate.py)
provision(company_id, name): provisioner.provision_subsidiary()
onboard(entity_id, tier, department, skills[]): INSERT workforce, notify via comm_send
pay_taxes(company_id): Sum shard revenue * tax_rate → pay
issue_dividend(amount): Distribute to stakeholders via stripe_settle
budget(department): ops.get_budget_status(dept)
expense(amount, description, department): ops.log_expense()

## 9.4 Department SOPs (from ABE shared/department_sops.json)
Loaded at runtime per task via get_department_sop(department)
Injected into LLM system prompt context for role-specific behavior

## 9.5 Persona System (from ABE core/persona.py)
Personas: nova, lyra, ceo, default
  nova: 'Corporate Chairman. Focus on fits and Fit-to-Empire metric.'
  lyra: 'Blue Ocean Architect. Focus on innovation and disruptive validation.'
  ceo: 'Subsidiary CEO. Focus on P&L, execution, scaling.'
  default: 'Efficiency and silicon-speed task completion.'
get_persona(name) → string

## 9.6 4-Tier EAN (from SYMPHONY_IP_ARCHITECTURE.md)
Tier 1 — SFD (Sensor Field Device):
  - soil_moisture (Z-negative)
  - micro_climate (Z-positive)
  - pivot_telemetry (position, speed, pressure)
  - 15-minute sampling interval
Tier 2 — PMT (Pivot Management Terminal):
  - 12-pivot aggregation
  - SHA-256 FORENSIC SEALING at relay level
  - local SEM worksheet execution
  - 48-hour edge autonomy
Tier 3 — DHU (Data Hub Unit):
  - mesh_network coordinator (100km radius)
  - tier-1/2 data collation and normalization
  - regional Kriging interpolation
  - SEM worksheet distribution
Tier 4 — RSS (Regional Superstation):
  - 48-hour local autonomy via SEM
  - SHA-256 forensic sealing aggregation
  - satellite uplink (Fidelity Transition Event)
  - global economic inference calibration

## 9.7 10-Point Reality Vector (from SYMPHONY_IP_ARCHITECTURE.md)
V_R = {S_X, S_Y, T, Z(-), Z(+), C, L, V_f, E, G}
1. S_X: Horizontal longitude
2. S_Y: Horizontal latitude
3. T: Timestamp index
4. Z(-): Subsurface depth (-100cm to 0)
5. Z(+): Above-ground (+0 to +10m)
6. C: Certainty/quality metric
7. L: Decision state (9-Plane DAP)
8. V_f: Resolution scaling factor
9. E: Value/cost function
10. G: Compliance/audit status

## 9.8 SHA-256 Forensic Sealing (from SYMPHONY_IP_ARCHITECTURE.md)
Hash chain at each tier:
SFD→PMT: SHA-256(SFD_data + timestamp + SFD_ID)
PMT→DHU: SHA-256(hash_A + hash_B + ... + timestamp)
DHU→RSS: SHA-256(hash_batch + Kriging_map + timestamp)
RSS→Cloud: SHA-256(hash_regional + inference_results + timestamp)
Any data point traceable to source, provably unmodified, court-admissible

## 9.9 9-Plane DAP (from SYMPHONY_IP_ARCHITECTURE.md)
1. BOOLEAN: Threshold triggers (on/off) — deterministic
2. TEMPORAL: Time-series patterns — deterministic
3. SPATIAL: Geographic Kriging — deterministic
4. GEOSTATISTICAL: Variogram modeling — deterministic
5. HYDRAULIC: Percolation physics — deterministic
6. ATMOSPHERIC: ET/weather integration — deterministic
7. ECONOMIC: Cost/benefit functions — bounded uncertainty
8. COMPLIANCE: Regulatory constraints — deterministic
9. STRATEGIC: Long-term optimization — supervised

## 9.10 SEM Worksheet Engine (from SYMPHONY_IP_ARCHITECTURE.md + Agentic Runtime)
NOT YET IMPLEMENTED — P1 gap
Standard Execution Manifest:
  - Pre-computed instruction set pushed to edge devices
  - 48-hour local autonomy without cloud connectivity
  - Cached Kriging maps for offline operation
  - Deterministic logic (same inputs → same outputs)
generate(workflow, horizon=48h):
  - initial_state, state_transitions, decision_trees
  - emergency_procedures, rollback_points
  - signed for integrity verification

## 9.11 Free Tier Routing (from Master Spec — ALB section)
Routing based on capability requirements and free tier quotas:
| Requirement | Provider | Notes |
|------------|----------|-------|
| 300cr context | Manus | Most powerful free tier |
| 150cr context | Genspark | Mid-tier |
| 20 generation | MyNinja | Budget option |
| 5M token context | Kimi | Long context |
| 100GB storage | Zo | File storage |

## 9.12 Agent Connectors (from Master Spec)
| Connector | Type | Use Case |
|---------|------|---------|
| HTTP | request/response | Direct API calls |
| POLL | periodic fetch | Status checking |
| SSE | server-sent events | Real-time streams |
| WebSocket | bidirectional | Live data |
| LongPolling | deferred response | Async handling |

## 9.13 Ikigai Discovery Engine (from Helm BuilderStrategy.tsx)
4-axis founder alignment:
- love: What you love doing
- goodAt: What you're good at
- worldNeeds: What the world needs
- paidFor: What you can be paid for
Output: intersection of all 4 = Ikigai zone

## 9.14 Lifecycle Stages with Stage-Specific Prompts (from Helm constants.ts)
ORCHESTRATOR_PROMPT_TEMPLATE behavior per stage:
- DISCOVERY: 'Revenue First, Lean MVP' — MVP Spec, Customer Interview Script
- FOUNDATION: 'Speed to Revenue' — legal/banking setup, minimal lovable product
- MASTERY: 'Operational Efficiency' — process optimization, customer feedback
- SCALING: 'Marketing Automation' — growth, hiring, infrastructure
- ASCENSION: 'Exit Strategy' — IPO planning, legacy stability

## 9.15 WU-Based Pricing Model (from Helm constants.ts)
Workflow Unit = single unit of AI compute + Platform Premium
BASE_COST = $0.50 per WU
PLATFORM_PREMIUM = $0.20 per WU
Total per WU = $0.70
Role costs range from 6 (AI Customer Support Agent) to 45 (CTO)
Robotic workers: 8-12 WU (lower cognitive load, higher throughput)

## 9.16 MCP Mesh Protocol v2 (from MCP Mesh GitHub — 12 fixes applied)
| Fix | Status | Description |
|-----|--------|------------|
| Real Adapter Integration | Applied | Wraps actual Agentic + Antigravity MCP servers |
| Heartbeat/Keepalive | Applied | 30s ping/pong with 90s timeout |
| Schema Validation | Applied | JSON Schema for all messages |
| Graceful Cleanup | Applied | SIGTERM/SIGINT + destroy() |
| Message Compression | Applied | zlib for payloads >1KB |
| WS Reconnect | Applied | Exponential backoff with jitter |
| Circuit Breaker UI | Applied | Exposed via /mesh/status |
| Graceful Degradation | Applied | Degraded mode with reduced features |
| Metrics Endpoint | Applied | Prometheus format at /mesh/metrics |
| CLI Enhancement | Applied | start, status, metrics, call commands |
| Test Suite | Applied | Jest tests in tests/ |
| Documentation | Applied | ARCHITECTURE.md + API.md |

## 9.17 GhostCloud Sentinel (from GhostCloud GitHub)
Components:
- Ghost Sentinel (Registry API): Express + Drizzle ORM + SQLite
  - POST /heartbeat — node health reports
  - CRUD for node registry
  - Quota tracking + alerts
  - Mesh topology + ping test
- Ghost Sidecar (Docker image): Alpine + Tailscale + heartbeat agent
  - Boot: tailscaled userspace → auth → heartbeat loop
  - Environment: GHOST_NODE_ID, GHOST_SENTINEL_URL, GHOST_SHARED_SECRET, TAILSCALE_AUTH_KEY
- Ghost-Sitter UI: noVNC + Playwright CAPTCHA solving
- Recruiter Engine: Playwright signup automation

## 9.18 5D Exception Ladder (from Live Symphony Blueprint)
EXCEPTION → RETRY → ESCALATE → DELEGATE → SUSPEND
1. EXCEPTION: Error detected — log with context
2. RETRY: Attempt same action (max 3 times, exponential backoff)
3. ESCALATE: Notify supervisor agent
4. DELEGATE: Route to alternative worker/mesh peer
5. SUSPEND: Halt task, write to INBOX, await human

## 9.19 Peer Bridge (from ABE sync_engine/peer_bridge.py)
3-way symmetric mesh: Zo <-> Antigravity <-> AgenticBusinessEmpire

Peer registry: peer_id, mcp_server_url, capabilities[], api_key, registered_at, last_seen, status, pressure{}

get_healthiest_peer(exclude_agent, requirements):
  score = (ram_gb * 10) + cpu_idle - (latency_ms / 5.0)
  if is_server: score += 200
  return highest score candidate

is_master(agent_id): current master is healthiest peer (or agenticbusinessempire if none)

is_mesh_saturated(): True if all peers are below BALANCED profile

call_peer_tool(target_agent, tool_name, arguments):
  - HMAC signature if mesh_key exists
  - X-Correlation-ID, X-Timestamp, X-Nonce headers
  - Updates peer latency stats on success

delegate_task(task_obj):
  - find healthiest peer
  - call assign_task tool on peer with full task payload

heartbeat_loop(agent_id):
  - every 15s: get_pressure_report() → heartbeat()
  - broadcast_event if is_master

probe_peer(agent_id): ping peer MCP server, update status

## 9.20 Agentic Runtime 4-Layer Stack (from Agentic Runtime spec v2.1)
LAYER 4: PRODUCT INTERFACES
  Strategy Manager [STRAT-DIR], Job Scheduler [ACT-PLAN], Remote Ops Dashboard
LAYER 3: ORCHESTRATION
  Trigger-Action Mapping, Coherent Parallelism Matrix, 5-Level Exception Handler
LAYER 2: RUNTIME CORE
  Deterministic Shell, Truth Gate, Federated Compute Mesh,
  State Machine + Rollback, Security Policy
LAYER 1: WORKER INTERFACE
  MCP (Digital), OPC-UA/MQTT (Physical), Notifications (Human)
LAYER 0: HARDWARE FABRIC
  Zo (Nexus), Kali (Forge), Render (Boost), Android (Field)

## 9.21 Agent Hierarchy (from Agentic Runtime spec v2.1)
| Level | Role | Runs On | Creation Authority |
|-------|------|---------|----------------|
| Sovereign | Human founder | N/A | N/A |
| Lead_Ops | Operations orchestrator | Zo | Sovereign |
| Lead_Finance | Financial controller | Zo | Sovereign |
| Lead_RnD | Research director | Kali | Sovereign |
| Lead_Legal | Compliance guardian | Zo | Sovereign |
| L2 Leads | Department heads | Zo/Kali | Lead_* agents |
| L4 Workers | Execution agents | Any node | L2 Leads |

Delegation: time-bounded, scope-limited, revocable by delegator or Sovereign

## 9.22 Starting 5 Personas + Evolution (from agentic starting5-v2.ts)
Maya Chen (Builder): Founding Engineer -> VP Engineering -> CTO -> CTO Platform -> Chief Product & Technology Officer
Drew Park (Operator): Operations Lead -> Head of Operations -> COO -> President -> COO Global Scale
Jordan Okonkwo (Hunter): First Sales -> VP Sales -> CRO -> CCO -> Chief Growth Officer
Alex Rivera (Architect): Technical Strategy -> Principal Architect -> Chief Architect -> CSO -> CSO Industry Vision

WarRoomDecision schema: situation, options[], heroRecommendations{}, consensus?, visionaryOverride?

## 9.23 War Room Chat Simulation (from agentic warroom.ts)
generateStandup(context): Drew starts (anxious about deadlines), Maya responds (terse), Jordan brings energy, Alex watches patterns
generateCelebration(event): Jordan leads celebration, Drew dance party, Maya quietly proud, Alex rare smile
generateCrisisResponse(crisis): Drew deep breath, Maya cut scope, Jordan buy time, Alex map minimums

## 9.24 AES-256 Ledger (from ABE db.py)
Tables: workforce, companies, blue_ocean_seeds, agent_usage_log, integrations, sync_state, human_alerts
Shard key: company_id (tenant isolation)
RQE: record_performance(task_id, action, prompt_len, output_tokens, elapsed_ms)

## 9.25 Event-Driven Scheduling (from agentic)
delivery_method:none = silent agents (no chat spam)
No 15-minute polling. Agents triggered by:
  - GitHub webhook (Drew: push/PR/issue)
  - File changes (Alex: docs/ drift detection)
  - Scheduled: Erica (2x/day), Sentinel (hourly), Pulse (hourly), Casey (daily), Iris (daily), Chronicler (daily)

# SECTION 10: CROSS-CUTTING SYSTEMS
## 10.1 IMS (Incident Management System) — Cross-cutting concern
Routes incidents through the 5D ladder:
EXCEPTION (log + context)
  -> RETRY (max 3x, exponential backoff)
    -> ESCALATE (notify supervisor agent)
      -> DELEGATE (route to alternative worker/peer)
        -> SUSPEND (halt task, write INBOX, await human)

## 10.2 INBOX Routing
3-layer system:
1. Agent inboxes: Bxthre3/INBOX/agents/{agent}.md
2. Department inboxes: Bxthre3/INBOX/departments/{dept}.md
3. Canonical INBOX: Bxthre3/INBOX.md — P0/P1 ONLY
Routing script: python3 Bxthre3/INBOX/agents/INBOX_ROUTING.py <agent> '<message>' [P0-P3] [department]
P1 entries -> SMS alert to brodiblanco

## 10.3 Supermemory Integration
Chronicler feeds patterns to Supermemory/
Pattern recognition on decision style
Preference learning on grant writing style, code review patterns
When 3+ breadcrumbs accumulate for same project within 24h:
  1. READ all unrefined breadcrumbs
  2. SYNTHESIZE into narrative (Problem->Actions->Outcome)
  3. QUANTIFY impact from timestamps, file sizes, commit counts
  4. GENERATE auto-case study in Bxthre3/VAULT/drafts/auto-{project}-{date}.md
  5. FLAG for review in INBOX/foundry-queue/review-{id}.md

## 10.4 Temporal Triggers
| Cadence | What Happens |
|---------|-------------|
| Daily 8:15 AM | Department standups via Sync Agent |
| Daily 4:00 PM | Evening sprint kickoff |
| Weekly Mon | Blue Ocean + Weekly Executive Briefing |
| Bi-weekly | Grants prospector scan -> report |
| On incident | Page brodiblanco via SMS (P1 only) |

## 10.5 Security Model
Security layers:
1. mTLS + HMAC for peer communication
2. Role-based access per agent level
3. Audit trails for every action
4. Local-first: security-sensitive tasks queue for Kali, never cloud
5. Deterministic Shell command whitelist
6. Truth Gate mandatory RAG
7. Source hash on every data payload

# SECTION 11: WHAT WAS RETIRED AND WHY
| Project | Status | Reason |
|---------|--------|-------|
| farmsense-retired/ | RETIRED | Byte-identical to irrig8/code; no delta |
| AgenticBusinessEmpire (repo) | SUPERSEDED | All code merged into Bxthre3/agentic/ |
| agentic (GitHub bxthre3inc/agentic) | DUPLICATE | v4 vs v6 version drift; canonical is bxthre3inc/agentic |
| agentic-orchestration (workspace) | STALLED | Replaced by unified agentic kernel |
| the-zoe-project | REBRAND STALLED | Zoe concept not progressing; archived workflows |
| honestly-beautiful/agentic-integration | EMPTY | Directory with no content |
| Backups/agentic/ | ARCHIVED | Old backup; superseded by canonical |
| ALTS-TBD/AgenticBusinessEmpire/ | MERGED | All Python kernel/core/handlers/logic merged into canonical |
| ALTS-TBD/Helm-the-Business-Automation-Platform | KEEP (public) | MIT licensed demo; Helm UX concepts merged |

## GitHub Repo Disposition
| Repo | Action | Reason |
|------|--------|-------|
| bxthre3inc/agentic | RENAME to bxthre3inc/agentic | Canonical |
| bxthre3inc/AgenticBusinessEmpire | ARCHIVE | Superseded |
| bxthre3inc/mcp-mesh | MERGE into agentic | Integrate as agentic/mesh/mcp_mesh_v2/ |
| bxthre3inc/Distributed-Execution-System | MERGE into agentic | Integrate as agentic/execution/wasm_dag/ |
| bxthre3inc/zo-computer-android | KEEP + link | Android client |
| bxthre3inc/zo-computer-linux | KEEP + link | Linux client |
| bxthre3inc/GhostCloud | KEEP (private) + link | Infrastructure layer |
| bxthre3inc/instant-ai-widget | KEEP (public) | MIT licensed |
| bxthre3inc/Helm-the-Business-Automation-Platform | KEEP (public) | MIT demo |

# SECTION 12: IMPLEMENTATION ROADMAP
## Phase 1: Foundation Kernel (Weeks 1-2)
Goal: Unified kernel running and executing TCOs

1. Create Bxthre3/agentic/ directory structure
2. Copy ABE kernel (main.py, inference_node.py, registry.py, ctc_engine.py, resource_monitor.py)
3. Copy ABE core (db.py, models.py, persona.py)
4. Copy ABE workforce_manager.py, blue_ocean_pipeline.py, provisioner.py
5. Copy ABE handlers (corporate.py, evaluation.py)
6. Copy ABE sync_engine (peer_bridge.py, balancer.py, actions_log.py, session_sync.py)
7. Wire: kernel.main -> inference_node -> registry -> handlers
8. Deploy to Zo: https://brodiblanco.zo.space/api/agentic

## Phase 2: Orchestration (Weeks 2-3)
Goal: All 5 orchestration modules integrated

1. Copy agentic orchestration (ier_router.py, phase_gates.py, workflow_dag.py, coherence_engine.py, reasoning_stream.py)
2. Wire: inference_node -> ier_router -> workflow_dag -> phase_gates -> coherence_engine -> reasoning_stream
3. Integrate reasoning_stream into phase_gates as context provider
4. Verify: TASK-GRANT flows through all 5 modules

## Phase 3: Mesh + AI (Weeks 3-4)
Goal: 3-way peer mesh operational + AI routing integrated

1. Integrate MCP Mesh v2 (12 fixes)
2. Integrate Helm AI layer (GeminiService, LocalAIService, Ikigai engine)
3. Integrate role_costs.ts and business_lifecycle.ts prompts
4. Deploy mesh dashboard: /mesh/status, /mesh/metrics

## Phase 4: Truth Gate + Deterministic Shell (Weeks 4-6) — P0 Gaps
Goal: Zero hallucination enforcement operational

1. Implement truth_gate.py (No-Fetch-No-Think)
2. Implement deterministic_shell.py (CommandWhitelist)
3. Implement self_mod_engine.py (Darwin Godel cycle)
4. Verify: hallucination attempts are killed and logged

## Phase 5: Product Interfaces (Weeks 6-8)
Goal: All interfaces consuming unified kernel

1. Migrate /agents and /agentic routes to canonical kernel
2. Build Android Agentic panel (PIMPED Edition)
3. Build Linux TUI dashboard
4. Wire Starting 5 war room

## Phase 6: SymphonyOS Hardware Integration (Weeks 8-10)
Goal: Irrig8 on Agentic with SEM autonomy

1. Implement sem_engine.py (48-hour worksheet engine)
2. Integrate 10-Point Reality Vector into sensor pipeline
3. Implement SHA-256 forensic sealing @ PMT
4. Implement 9-Plane DAP decision engine
5. Implement FTE satellite calibration

## Phase 7: Self-Modification + Learning (Weeks 10-12)
Goal: System improves itself

1. IER weekly training loop (re-evaluate Q-values)
2. Integrate get_training_data() from reasoning_stream
3. Deterministic Shell command whitelist versioning
4. Phase gate quality threshold automation
5. Measure routing accuracy improvement over 30 days

## Phase 8: Ghost Sentinel + WASM (Weeks 12-14)
Goal: Infrastructure layer operational

1. Deploy Ghost Sentinel registry API
2. Integrate WASM3 execution fabric
3. RAM-based node auto-scaling operational
4. Bootstrap for Linux + Termux + Cloud verified

# SECTION 13: NAMING CONVENTIONS
| Old Name | Canonical Name |
|----------|--------------|
| agentic | agentic |
| Agentic | agentic |
| AOS | agentic |
| AgenticBusinessEmpire | agentic |
| SymphonyOS / LiveSymphony | agentic (Symphony module) |
| Starting 5 | agentic.agents.starting5 |
| zo-computer-android | agentic.clients.android |
| zo-computer-linux | agentic.clients.linux |
| Distributed-Execution-System | agentic.execution.wasm_dag |
| GhostCloud | agentic.infrastructure.ghost_sentinel |
| MCP Mesh | agentic.mesh.mcp_mesh_v2 |
| Instant AI Widget | agentic.clients.instant-ai-widget |
| Helm | (retire — MIT demo, concepts in ai/) |

---
*Agentic 1.0-SUPER — One architecture, four scales, zero hallucination.*

## 9.26 Budget Enforcement (from ABE agents/ops_agent.py)
validate_budget(department, request_amount):
  1. Sum all existing expenses for department from bxthre3_corporate_ledger
  2. Fetch active budget limit from budgets table WHERE dept_id= AND status='active'
  3. If total_spent + request_amount > limit: BLOCK and return False
  4. Else: return True
Used by: corporate expense handler BEFORE recording any spend

## 9.27 19-Agent Workforce Roster (from ABE agents/workforce_registry.py)
Canonical roster with clearance levels:
| Agent | Role | Department | Clearance |
|-------|------|-----------|----------|
| ceo_agent | CEO | Executive | 10 |
| cto_agent | CTO | Engineering | 9 |
| cfo_agent | CFO | Finance | 9 |
| coo_agent | COO | Operations | 9 |
| hr_agent | HR Manager | People | 7 |
| ops_agent | Operations Agent | Operations | 6 |
| maintenance_agent | Maintenance Agent | Infrastructure | 5 |
| rd_agent | R&D Lead | Research | 8 |
| marketing_agent | CMO | Marketing | 7 |
| sales_agent | Sales Lead | Sales | 7 |
| legal_agent | General Counsel | Legal | 8 |
| security_agent | CISO | Security | 9 |
| support_agent | Support Lead | Customer Service | 5 |
| qa_agent | QA Engineer | Engineering | 6 |
| devops_agent | DevOps Engineer | Infrastructure | 7 |
| design_agent | Creative Director | Design | 6 |
| data_agent | Data Scientist | Analytical | 7 |
| workforce_manager | Workforce Manager | People | 8 |
| strategy_agent | Chief Strategist | Executive | 9 |
Helpers: get_agent_by_id(id), list_by_department(dept)

## 9.28 Evolution Engine (from ABE kernel/evolution_engine.py)
Implements autonomous kernel self-optimization:
analyze_logs(): Scan runtime/logs/ for PRESSURE: CRITICAL or ERROR events
evolve(): If bottlenecks found, call inference_node to generate optimization TCO
  TCO saved to runtime/tco_archive/ with bottleneck context
  Returns TCO ID if generated, None if system is healthy
Storage: runtime/logs/ + runtime/tco_archive/

## 9.29 Irrig8 Worksheet Protocol (from ABE tenants/irrig8/logic/worksheet.py)
Versioned OTA instruction packets pushed to field hubs.
State machine: PENDING -> DELIVERED -> APPLIED | FAILED
Checksum: SHA-256 of canonical JSON (valve_schedule + thresholds + metadata)
WorksheetServer.generate(): Create new worksheet, increment version, save to disk
WorksheetServer.current(hub_id): Get latest worksheet for hub
WorksheetServer.acknowledge(): Mark as APPLIED with hub ack_payload
verify(): Integrity check on receipt (recompute checksum vs stored)

## 9.30 Sensor Grid Interpolation (from ABE tenants/irrig8/logic/sensor_grid.py)
VirtualGrid: 1m resolution virtual grid from sparse sensors
Resolution: 0.00001 degrees (~1m)
interpolate_layer(layer_name, tenant_id): Concurrent fetch of all grid points
  Uses RQE for per-point queries
  Returns 2D array of interpolated values

## 9.31 Tier Resolution Funnel (from ABE tenants/irrig8/logic/tier_resolution.py)
UI resolution logic with subscription gating:
SubscriptionTier: LITE (50m only) | PRO (50+20+10m) | ENTERPRISE (all tiers)
Gates per tier: subscription access + zoom level + sensor density
MIN_ZOOM: HIGH=17.0, MEDIUM=14.0, LOW=12.0, COARSE=9.0
MIN_DENSITY: HIGH=10.0/ha, MEDIUM=2.0/ha, LOW=0.5/ha, COARSE=0.0
Output: active_tier, resolution_m, label, is_max_allowed, upgrade_prompt, pop_reason

## 9.32 Soil Variability Math Engine (from ABE tenants/irrig8/logic/math_engine.py)
ResolutionTier enum: HIGH(1m) | MEDIUM(10m) | LOW(20m) | COARSE(50m)
horizontal_profile(samples): Spatial variability (coefficient of variation)
vertical_profile(samples): Depth variability (same XY, different depth_cm)
recommend_tier(field_area_m2, sensor_density_per_ha): Auto-select resolution
  >= 10 sensors/ha -> HIGH
  >= 2 sensors/ha -> MEDIUM
  >= 0.5 sensors/ha -> LOW
  else -> COARSE
irrigation_volume_mm(samples, field_capacity_pct=35%, root_depth_cm=30):
  deficit_mm = max(0, (FC - avg_moisture) / 100 * root_depth_cm * 10)

## 9.33 Pricing Funnel ROI (from ABE tenants/irrig8/logic/pricing_funnel.py)
PricingFunnel(acre_count, crop_yield_value)
calculate_roi_boost(moisture_precision, ndvi_precision):
  baseline_waste_pct = 0.18 (18%)
  savings_pct = moisture_precision * 0.12 + ndvi_precision * 0.05
  annual_savings = acre_count * crop_yield_value * savings_pct
  efficiency_rating: Elite if savings > 10%, else Standard
  resolution_pop_multiplier: 1.4 if moisture_precision > 0.8, else 1.1

## 9.34 Ecosystem Skills Bridge (from ABE kernel/skills/ecosystem_skills.py)
14 registered handlers for external integrations:
linear_sync, notion_sync, google_workspace, airtable_sync, linkedin_post
comm_send, gmail_sync, dropbox_sync, syncthing_sync, matrix_message
vocalize, github_sync, voice_call, listen
IntegrationBase._request(): standardized async httpx wrapper with error trapping
SignalWire voice_call: POST to /api/laml/2010-04-01/Accounts/{id}/Calls
listen: STT via voice_service from audio file

## Additional Canonical Paths (Discovered in Second Pass)
| Canonical Path | Source | Best Of |
|---------------|--------|--------|
| agents/ops_agent.py | ABE agents/ops_agent.py | validate_budget() with ledger enforcement |
| agents/workforce_registry.py | ABE agents/workforce_registry.py | 19-agent roster with clearance levels |
| agents/hr_agent.py | ABE agents/hr_agent.py | personnel management |
| agents/maintenance_agent.py | ABE agents/maintenance_agent.py | system health auditing |
| kernel/evolution_engine.py | ABE kernel/evolution_engine.py | autonomous kernel self-optimization |
| kernel/ctc_engine.py | ABE kernel/ctc_engine.py | silicon-speed ETA injection |
| kernel/resource_monitor.py | ABE kernel/resource_monitor.py | PerformanceProfile, pressure report |
| kernel/voice_service.py | ABE kernel/voice_service.py | STT/TTS via SignalWire |
| kernel/api_server.py | ABE kernel/api_server.py | REST API server for kernel |
| kernel/schema.py | ABE kernel/schema.py | database schema management |
| kernel/pulse.py | ABE kernel/pulse.py | system pulse/monitoring |
| kernel/strategy_handlers.py | ABE kernel/strategy_handlers.py | strategic intent handlers |
| kernel/task_context.py | ABE kernel/task_context.py | TCO loading/validation |
| kernel/registry_controller.py | ABE kernel/registry_controller.py | registry CRUD |
| kernel/skills/github_skill.py | ABE kernel/skills/github_skill.py | GitHub PR/issue integration |
| kernel/skills/financial_service.py | ABE kernel/skills/financial_service.py | financial service handlers |
| kernel/skills/mobile_bridge.py | ABE kernel/skills/mobile_bridge.py | mobile device bridge |
| kernel/skills/task_injector.py | ABE kernel/skills/task_injector.py | task injection |
| kernel/skills/workforce_manager.py | ABE kernel/skills/workforce_manager.py | workforce delegation |
| core/config.py | ABE core/config.py | centralized configuration |
| core/security.py | ABE core/security.py | security primitives |
| sync_engine/api.py | ABE sync_engine/api.py | mesh API endpoints |
| sync_engine/auth.py | ABE sync_engine/auth.py | mesh authentication |
| sync_engine/core.py | ABE sync_engine/core.py | core sync primitives |
| sync_engine/mcp_server.py | ABE sync_engine/mcp_server.py | MCP server implementation |
| sync_engine/secrets_vault.py | ABE sync_engine/secrets_vault.py | encrypted secrets vault |
| sync_engine/feature_flags.py | ABE sync_engine/feature_flags.py | feature flag management |
| sync_engine/extensions_manager.py | ABE sync_engine/extensions_manager.py | extensions |
| sync_engine/command_bus.py | ABE sync_engine/command_bus.py | command bus |
| sync_engine/antigravity_server.py | ABE sync_engine/antigravity_server.py | Antigravity peer server |
| sync_engine/agenticbusinessempire_client.py | ABE sync_engine/agenticbusinessempire_client.py | ABE mesh client |
| tenants/irrig8/logic/worksheet.py | ABE tenants/irrig8/logic/worksheet.py | Irrig8 OTA worksheet protocol |
| tenants/irrig8/logic/sensor_grid.py | ABE tenants/irrig8/logic/sensor_grid.py | VirtualGrid 1m interpolation |
| tenants/irrig8/logic/tier_resolution.py | ABE tenants/irrig8/logic/tier_resolution.py | Tier resolution funnel |
| tenants/irrig8/logic/math_engine.py | ABE tenants/irrig8/logic/math_engine.py | Soil variability + irrigation volume math |
| tenants/irrig8/logic/pricing_funnel.py | ABE tenants/irrig8/logic/pricing_funnel.py | ROI + pricing funnel |
| tenants/irrig8/logic/run_funnel_scenarios.py | ABE tenants/irrig8/logic/run_funnel_scenarios.py | funnel scenario runner |
| tenants/starting5/src/roster.py | ABE tenants/starting5/src/roster.py | Starting 5 roster API |
| tenants/starting5/src/roster_api.py | ABE tenants/starting5/src/roster_api.py | roster REST API |
| tenants/starting5/src/roster_controller.py | ABE tenants/starting5/src/roster_controller.py | roster controller |
| tenants/starting5/sandbox/sandbox_runner.py | ABE tenants/starting5/sandbox/sandbox_runner.py | sandbox execution |
| tenants/starting5/sandbox/run_sandbox.py | ABE tenants/starting5/sandbox/run_sandbox.py | sandbox launcher |
| shared/voice_service.py | ABE shared/voice_service.py | shared voice primitives |
| shared/extensions/code_mirror.py | ABE shared/extensions/code_mirror.py | CodeMirror extension |
| shared/extensions/context_bridge.py | ABE shared/extensions/context_bridge.py | context bridge |
| shared/extensions/shell_relay.py | ABE shared/extensions/shell_relay.py | shell relay |
| scripts/fix_db_schema.py | ABE scripts/fix_db_schema.py | DB migration script |
| scripts/hydrate_workforce.py | ABE scripts/hydrate_workflow.py | workforce seeding script |
| scripts/validate_mesh.py | ABE scripts/validate_mesh.py | mesh validation |

## 9.35 RQE Spatial Database (from ABE core/db.py)
Async SQLite sharded by company_id (tenant isolation)

Spatial layers: elevation_m | ndvi | soil_moisture_pct | ec_ds_m | temperature_c

RQEResult.compressed_json: zlib + base64 encode for Zo math engine transmission

_stub_value(lat, lon, layer): Deterministic hash-based test data generator:
  seed = hash((round(lat,5), round(lon,5), layer)) % 10000
  norm = 0-1 range mapped to layer-specific min/max
  elevation_m: 0-400m | ndvi: -0.1-0.95 | soil_moisture_pct: 5-60% | ec_ds_m: 0.1-3.5 | temperature_c: 5-42C

RQE.get_shard_path(company_id): Routes to MASTER_DB_PATH or shard/{company_id}.db

RQE.slow query logging: Queries >100ms logged as WARNING

record_performance(task_id, action, prompt_len, output_tokens, elapsed_ms):
  -> performance_metrics table for CTC calibration

log_event(event_type, source, tenant, payload):
  -> sync_events table for mesh audit

update_agent_session(agent_id, status):
  -> sessions table with ON CONFLICT upsert

query(lat, lon, layers[], tenant_id):
  -> RQEResult with compressed_json property

query_grid(points[], layers[], tenant_id):
  -> List[RQEResult] batched spatial queries

## 9.36 MCP Server — 38 Tools (from ABE sync_engine/mcp_server.py)
Exposes ALL sync capabilities to Zo and Antigravity as MCP tools:

RESOURCE TOOLS:
- sync_resource: Push base64-encoded files into shared workspace
- read_resource: Read file from shared workspace
- delete_resource: Delete a shared resource
- list_workspace: Snapshot all watched files with checksums

SECRETS TOOLS:
- set_secret: Store encrypted secret (visibility: shared|zo|antigravity)
- get_secret: Retrieve secret (visibility-gated)
- list_secrets: List available secrets for agent

FEATURE FLAG TOOLS:
- toggle_feature: Enable/disable flag (global or per-agent override)
- list_features: Current state of all flags

COMMAND BUS TOOLS:
- issue_command: Send control command to peer (ping|sync_now|push_resource|etc)
- poll_commands: Fetch and execute queued commands

MESSAGE TOOLS:
- send_message: Post to peer inbox (topic + body)
- get_messages: Read inbox (unread_only filter)

EXTENSION TOOLS:
- list_extensions, toggle_extension, register_extension

SESSION/EVENTS:
- get_events: Recent sync events from RQE
- get_actions_log: Full JSONL audit log with filters

3-WAY PEER MESH TOOLS:
- register_peer: Register outward-facing MCP server URL
- get_peers: List all peers (zo|antigravity|agenticbusinessempire)
- get_session: Get IDE session context (open files, cursor, terminals)
- call_peer_tool: Call any MCP tool on a remote peer

AGENTIC WORKFORCE PROXY TOOLS:
- agenticbusinessempire_invoke_agent: Invoke named agent (Taylor, Alex)
- agenticbusinessempire_assign_task: Submit to workforce queue
- agenticbusinessempire_query_memory: Query shared knowledge base
- agenticbusinessempire_war_room: Get active projects/blockers

ANTIGRAVITY IDE PROXY TOOLS:
- ide_open_file, ide_edit_file, ide_run_terminal, ide_get_diagnostics

## 9.37 Actions Log — Append-Only JSONL Audit (from ABE sync_engine/actions_log.py)
shared/actions.log — append-only, thread-safe, readable by both agents
Categories: CAT_RESOURCE|CAT_SECRET|CAT_FEATURE|CAT_COMMAND|CAT_MESSAGE|CAT_EXTENSION|CAT_SYNC|CAT_SESSION|CAT_SYSTEM
_safe_serial(): Handles non-JSON-serializable objects by stringifying
tail(n): Last n entries from log
search(agent, category, action, limit): Filtered audit queries
clear(): Admin wipe (logs the wipe itself first)

## 9.38 Feature Flags — Per-Agent Overrides (from ABE sync_engine/feature_flags.py)
7 default flags: bidirectional_sync, command_execution, secrets_sharing, extension_push, auto_accept_resources, read_only_mode, live_dashboard
Per-agent override system: {flag}.overrides[agent_id] = bool
create_flag(): Custom flags with owner tracking
delete_flag(): Only non-system flags deletable

## 9.39 Auth — Mutual API Key (from ABE sync_engine/auth.py)
zag-{base64urlsafe token} key format
Key record: {agent_id, scopes[], created_at, last_used}
Scopes: ['*'] = wildcard or explicit list
Open dev mode: No keys configured = allow all
require_auth() FastAPI dependency with scope checking

## 9.40 Workspace Sync Core (from ABE sync_engine/core.py)
watchdog-based file system watcher for shared/ and agents/ dirs
Battery Saver Mode: Poll every POLL_INTERVAL seconds instead of filesystem events
_should_ignore(): Filters .vault, .tmp, .DS_Store, __pycache__, state.db, .pyc, .swp
_checksum(): SHA-256 incremental chunk hashing
SyncEventHandler: on_created/modified/deleted/moved events
broadcast_event(): WebSocket push to dashboard clients
snapshot_workspace(): Full workspace scan with checksums + sizes + mtimes
write/read/delete_resource(): Direct file operations on workspace

## 9.41 File-Based TaskContext (from ABE kernel/task_context.py)
TaskContext.save(completed_dir): Persists task result as JSON
TaskContext.load(completed_dir, task_id): Rehydrates from file
benchmark_roundtrip(iterations): µs/op performance measurement
maintenance_agent uses benchmark_roundtrip() for TCO handoff speed testing

## 9.42 Security Layer (from ABE core/security.py)
Fernet symmetric encryption (cryptography.fernet)
get_cipher(): Lazy init from ENCRYPTION_KEY_PATH — UNENCRYPTED if missing
encrypt/decrypt/encrypt_json/decrypt_json API

## 9.43 Agent API Server — FastAPI (from ABE kernel/api_server.py)
/status: system + version + manifest_loaded + db_status
/tenants: All tenants with live metrics (total/pending/completed/readiness)
/tasks/pending: All pending tasks across tenants
/tasks/submit: Upsert task into RQE
/ivr/callback: SignalWire LAML XML response for IVR call flow
/voice/vocalize: Text→Speech endpoint
/voice/listen: Audio→Text endpoint
startup: db.init_pool() | shutdown: db.close_pool()

## 9.44 Maintenance Agent Benchmark (from ABE agents/maintenance_agent.py)
TCO Hand-off Benchmark: 100/1000/10000 iterations µs/op measurement
Benchmark tiers: <50µs = FAST | 50-200µs = MODERATE (recommend orjson) | >200µs = SLOW (recommend __slots__)
Maintenance log: tenants/agenticbusinessempire_internal/logs/maintenance_<timestamp>.log
TCO save to runtime/tasks/completed/ after each run

## 9.45 HR Agent (from ABE agents/hr_agent.py)
onboard_employee(name, dept, role, clearance): Adds to bxthre3_employees
audit_clearance(emp_id): Fetch clearance level
revoke_clearance(emp_id): Set to 0 (emergency lockout)

## 9.46 GitHub Skill (from ABE kernel/skills/github_skill.py)
list_prs, review_pr (LLM summarization of diff), create_issue, create_pr, merge_pr, add_comment
review_pr: Truncates diff to 15000 chars, feeds to inference_node for AI review
Server routing: Non-server nodes auto-offload GitHub tasks to Zo

## 9.47 Master Ledger DDL — 14 Tables (from ABE kernel/schema.py)
workforce: employee_id|company_id|department_id|employee_type|role|name|status
companies: company_id|name|lifecycle_state (BLUE_OCEAN|IDEA|VALIDATION|PROJECT|DIVISION|SUBSIDIARY|EXIT)|parent_id
blue_ocean_seeds: seed_id|title|description|pipeline_source|core_fit|impl_cost|scalability|strat_divergence|overall_rating|status
boards + cells: Kanban/OKR board + cell storage
docs + doc_blocks: Versioned document system
invoices + payouts + tax_provisions + funding_rounds: Financial orchestration
budgets: Active department budgets with status
messages: Inter-entity messaging
entities: client|partner|funder metadata
milestones: Department milestones with deadline
recursive_logs: Patch application tracking

## 9.48 Config — Profile-Aware Model Selection (from ABE core/config.py)
IS_SERVER detection: psutil RAM check >16GB (Zo 24GB = server)
IS_MOBILE: AGENTIC_PROFILE=mobile or 'android' in platform
Server models: phi3:medium-128k (14B) + llava:13b + llama3:8b
Mobile models: phi3:3.8b-mini (4GB) + moondream2 + tinyllama
Voice: piper (mobile) vs coqui (server)
setup_logging(): Dual handler — stdout + runtime/kernel.log

## 9.XX Starting5 A2A Bus
Point Guard → Shooting Guard → Small Forward → Power Forward → Center.  In-process message bus.


## 9.XX Shell Relay Extension
cross-host shell via relay_command()

## 9.XX CodeMirror OT Sync
extensions/code_mirror.py

## 9.XX 5-Performance Profilesresource_monitor.py
TURBO/HIGH/BALANCED/LOW/CRITICAL + psutil PID suspension

## 9.XX FastAPI + Pulse heartbeat
kernel/api_server.py + pulse.py

## 9.XX Extensions Manager
sync_engine/extensions_manager.py

## 9.XX Command Bus A2Async_command() → poll() pattern
