# Agentic Feature Gap Audit
**Date:** 2026-04-17
**Canonical sources:** SUPER_SPEC.md, MERGED_SPEC.md, BUILD_STATUS.md,
SPEC.md (the-agentic-project), TOOL_MANIFEST.md

---

## VARIANT MAP

| Variant | Location | Purpose | Runnable? |
|---------|----------|---------|-----------|
| **Rust Standalone** | `Bxthre3/agentic/src/` | Production binary, no Zo deps | ⚠️ Blocked (Rust 1.63 too old) |
| **zo.space API** | `projects/the-agentic-project/routes/` | 29 live endpoints on brodiblanco.zo.space | ✅ Live |
| **Python (ABE)** | `Bxthre3/agentic/` | Research/prototyper, tenant system | ✅ Runnable locally |
| **Helm / Starting 5** | `MICROSAAS-CO/` | SaaS AI co-founders product | ⚠️ Partial |

---

## COMPLETE FEATURE AUDIT

### Legend
- ✅ **Implemented** — code exists and verified
- 🔶 **Partial** — skeleton exists, core logic missing
- ❌ **Missing** — in spec, no code
- N/A **N/A** — not applicable to this variant

---

### RUNTIME CORE — LAYER 2

| Feature | Spec Source | Rust Standalone | zo.space API | Python ABE |
|---------|------------|-----------------|--------------|------------|
| Task queue + dispatch | SUPER_SPEC §5 | ✅ `task_queue.rs` | ✅ 5 task routes | ✅ `kernel/task_context.py` |
| Handler registry + decorators | SUPER_SPEC §5.2 | 🔶 skeleton | ❌ | ✅ `registry.py` |
| Inference node (LLM dispatch) | SUPER_SPEC §5.3 | ❌ | ❌ | ✅ `inference_node.py` |
| Intent inference (LLM + regex fallback) | SUPER_SPEC §5.4 | ❌ | ❌ | ✅ `inference_node.py` |
| Mesh balancer + offload | SUPER_SPEC §5.5 | ❌ | ❌ | ✅ `balancer.py` |
| CTC engine (ETA injection) | SUPER_SPEC §5.6 | ❌ | ❌ | ✅ `ctc_engine.py` |
| Resource monitor (5 profiles) | SUPER_SPEC §5.7 | ❌ | ❌ | ✅ `resource_monitor.py` |
| Deterministic Shell | SUPER_SPEC §5.8 | ❌ | ❌ | ❌ |
| Truth Gate | SUPER_SPEC §5.9 | ❌ | ✅ `/truth-gate/check` route | ❌ |
| Rollback + Cascade Pause | SUPER_SPEC §5.10 | ❌ | ❌ | ❌ |
| Self-Modification Engine (SEM) | SUPER_SPEC §5.11 | ❌ | ✅ `/sem` route | ❌ |
| Secrets vault (Fernet/AES-256) | SUPER_SPEC §9.42 | ❌ | ❌ | ✅ `sync_engine/secrets_vault.py` |
| Auth (mutual API key) | SUPER_SPEC §9.39 | ❌ | ❌ | ✅ `sync_engine/auth.py` |

---

### ORCHESTRATION — LAYER 3

| Feature | Spec Source | Rust Standalone | zo.space API | Python ABE |
|---------|------------|-----------------|--------------|------------|
| IER Router (contextual bandits) | SUPER_SPEC §6.1 | ❌ | ✅ `/fte/synthesize` route | ✅ `ier_router.py` |
| Phase Gates | SUPER_SPEC §6.2 | ❌ | ❌ | ✅ `phase_gates.py` |
| Workflow DAG | SUPER_SPEC §6.3 | ❌ | ❌ | ✅ `workflow_dag.py` |
| Reasoning Stream (append-only audit) | SUPER_SPEC §6.4 | ❌ | ✅ `/events/stream` | ✅ `reasoning_stream.py` |
| Coherence Engine (D/P/H layers) | SUPER_SPEC §6.5 | ❌ | ✅ `/coherence` route | ✅ `coherence_engine.py` |
| Thompson Q (was UCB bandits) | MERGED_SPEC | ❌ | ✅ `/bench` route | ❌ |
| Agent Lifecycle (6-phase) | MERGED_SPEC | ❌ | ✅ `/lifecycle` route | ❌ |
| Cascade Engine | MERGED_SPEC | ❌ | ✅ `/cascade` route | ❌ |
| OTA check | MERGED_SPEC | ❌ | ✅ `/ota/check` route | ❌ |
| Subscriptions (push model) | MERGED_SPEC | ❌ ✅ `/subscriptions` | ❌ | |

---

### 9-PLANE DAP

| Feature | Spec Source | Rust Standalone | zo.space API | Python ABE |
|---------|------------|-----------------|--------------|------------|
| DAP core engine | SUPER_SPEC §7 | ✅ `dap.rs` | ✅ `/dap/evaluate` | ❌ |
| 9-plane decision routing | SUPER_SPEC §7 | ✅ | ✅ | ❌ |
| Forensics/trace | SPEC.md §F2 | ❌ | ✅ `/forensic/trace` | ❌ |
| SHA-256 event sealing | SPEC.md §F2 | ❌ | ❌ | N/A (ABE uses RQE logging) |

---

### INTEGRATIONS — LAYER 1

| Feature | Spec Source | Rust Standalone | zo.space API | Python ABE |
|---------|------------|-----------------|--------------|------------|
| MCP server (38 tools) | SUPER_SPEC §9.36 | ❌ | ❌ | ✅ `sync_engine/mcp_server.py` |
| Linear workforce registry | SUPER_SPEC §9.33 | ✅ `agent_registry.rs` | ✅ `/org` route | ✅ `agents/workforce_registry.py` |
| GitHub skill (PR/issue) | SUPER_SPEC §9.46 | ❌ | ❌ | ✅ `kernel/skills/github_skill.py` |
| HR agent (onboard/revoke) | SUPER_SPEC §9.45 | ❌ | ❌ | ✅ `agents/hr_agent.py` |
| FastAPI agent server | SUPER_SPEC §9.43 | ❌ | N/A | ✅ `kernel/api_server.py` |
| Maintenance agent benchmark | SUPER_SPEC §9.44 | ❌ | ❌ | ✅ `agents/maintenance_agent.py` |

---

### IRRIG8-SPECIFIC (SymphonyOS IP)

| Feature | Spec Source | Status |
|---------|------------|--------|
| 4-Tier EAN (SFD/PMT/DHU/RSS) | SUPER_SPEC §9.6 | ❌ Not implemented |
| 10-Point Reality Vector | SUPER_SPEC §9.7 | ❌ Not implemented |
| SHA-256 Forensic Sealing (chain) | SUPER_SPEC §9.8 | ❌ Not implemented |
| 9-Plane DAP for irrigation | SUPER_SPEC §9.9 | ❌ Not implemented |
| SEM Worksheet Engine (48h edge) | SUPER_SPEC §9.10 | ❌ Not implemented |
| Tier Resolution Funnel | SUPER_SPEC §9.17 | ✅ `tenants/irrig8/logic/tier_resolution.py` |
| Virtual Grid 1m interpolation | SUPER_SPEC §9.18 | ✅ `tenants/irrig8/logic/sensor_grid.py` |
| Soil variability + math engine | SUPER_SPEC §9.19 | ✅ `tenants/irrig8/logic/math_engine.py` |
| Pricing funnel (ROI) | SUPER_SPEC §9.20 | ✅ `tenants/irrig8/logic/pricing_funnel.py` |
| Worksheet protocol (OTA child) | SUPER_SPEC §9.21 | ❌ Not implemented |
| RQE spatial database | SUPER_SPEC §9.35 | ✅ `core/db.py` |

---

### GOVERNANCE + ACCOUNTABILITY

| Feature | Spec Source | Rust | zo.space | ABE |
|---------|------------|------|----------|-----|
| 3-layer BX3 Loop | SPEC.md §2 | ❌ | ❌ | ❌ |
| 5 Pillars (Loop Isolation → Bailout) | SPEC.md §3 | ❌ | ❌ | ❌ |
| Spatial Firewall (4-tier) | SPEC.md §P3 | ❌ | ❌ | ❌ |
| Root Tunneling + Sandbox Gate | SPEC.md §P4 | ❌ | ❌ | ❌ |
| Bailout Protocol (3 triggers) | SPEC.md §P5 | ❌ | ❌ | ❌ |
| Tier 0/1/2 Tool Manifest | TOOL_MANIFEST | ❌ | ❌ | ❌ |
| Chairman Queue UI | TOOL_MANIFEST | ❌ | ❌ | ❌ |
| Human Accountability Anchor | SPEC.md §P2 | ❌ | ❌ | ❌ |

---

### PRODUCT INTERFACES — LAYER 4

| Feature | Spec Source | Status |
|---------|------------|--------|
| zo.space dashboard (`/agentic`) | BUILD_STATUS | ✅ Live — 70+ routes |
| Android app | BUILD_STATUS | ✅ APK built, API connected |
| Linux TUI | SUPER_SPEC §3 | ❌ Not built |
| VS Code extension | SUPER_SPEC §3 | ❌ Not built |
| Voice (STT/TTS/Command) | BUILD_STATUS | ✅ 3 voice routes live |

---

### STARTING 5 / HELM (MICROSAAS-CO)

| Feature | Spec Source | Status |
|---------|------------|--------|
| A2A point-guard bus | SUPER_SPEC §9.XX | ❌ Not built |
| Role catalog (90 roles) | SUPER_SPEC §9.32 | ✅ `Helm/constants.ts` |
| Department SOPs | SUPER_SPEC §9.4 | ✅ JSON in ABE |
| Ikigai discovery wizard | SUPER_SPEC §9.13 | ✅ `Helm/BuilderStrategy.tsx` |
| Lifecycle stage prompts | SUPER_SPEC §9.14 | ✅ `Helm/constants.ts` |
| WU-based pricing model | SUPER_SPEC §9.15 | ✅ `Helm/constants.ts` |
| Blue Ocean scoring | SUPER_SPEC §9.22 | ✅ `ABE/logic/blue_ocean.py` |
| Helm FastAPI server | MICROSAAS-CO | ✅ Runnable |

---

## CRITICAL GAPS — PRIORITIZED

### P0 — Production Blockers

| Gap | Why It Matters |
|-----|---------------|
| **Deterministic Shell** | Cannot safely execute commands without this. No external tool call is safe without a whitelist. |
| **Truth Gate (runtime)** | zo.space has the endpoint but no enforcement engine behind it. |
| **Self-Modification Engine** | SEM worksheet protocol for edge autonomy (Irrig8 48h offline) depends on this. |
| **3-Layer BX3 Loop (runtime)** | Core governance architecture — nowhere implemented as a runtime primitive. |
| **Bailout Protocol** | Exception escalation to human — not implemented anywhere. |

### P1 — Major Feature Gaps

| Gap | Why It Matters |
|-----|---------------|
| **IER Router** | zo.space has the endpoint but not the learning/feedback loop. |
| **MCP server** | Python ABE has it; Rust doesn't. No shared protocol. |
| **Worksheet protocol (OTA child agents)** | Recursive spawning — Irrig8 edge autonomy depends on this. |
| **Chairman Queue UI** | T2 tools (HITL-gated) have no approval interface. |
| **LLM inference in Rust** | zo.space endpoints call out to external LLMs; no local inference. |
| **4-Tier EAN + SHA-256 sealing** | Irrig8 IP — not built. This is the core patent-able IP. |

### P2 — Nice to Have

| Gap | Why It Matters |
|-----|---------------|
| Linux TUI | Local system monitoring dashboard |
| VS Code extension | Developer workflow integration |
| Shell relay extension | Cross-host shell via CodeMirror |
| FastAPI server in Rust | Production-grade API server |

---

## RECOMMENDATION

**Shortest path to production Agentic:**

1. **Right now:** Use GitHub Actions CI to build Rust binary (bypasses toolchain block)
2. **Phase 1:** Wire the Python ABE modules into the Rust binary as FFI or subprocess
   — inference_node, handler_registry, resource_monitor, coherence_engine
3. **Phase 2:** Implement Deterministic Shell + Truth Gate in Rust first
   — these are prerequisites for any real workload
4. **Phase 3:** IER Router learning loop + Phase Gates
5. **Phase 4:** MCP server + peer bridge for Zo interop
6. **Phase 5:** Irrig8-specific IP (4-Tier EAN, SEM worksheet, SHA-256 sealing)

**The Python ABE is the working prototype. The Rust repo is the production target.
They must be merged before shipping.**

---

## SOURCE FILES AUDIT

| File | Variant | Runnable? |
|------|---------|-----------|
| `agentic/src/` (Rust) | Standalone | ⚠️ Build blocked |
| `the-agentic-project/routes/` | zo.space | ✅ Live |
| `agentic/kernel/` | Python ABE | ✅ Runnable |
| `agentic/orchestration/` | Python ABE | ✅ Runnable |
| `agentic/sync_engine/` | Python ABE | ✅ Runnable |
| `agentic/tenants/` | Python ABE | ✅ Runnable |
| `MICROSAAS-CO/Helm/` | Helm/Starting5 | ⚠️ Partial |
