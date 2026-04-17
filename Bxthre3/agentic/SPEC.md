# Agentic — Product Specification v1
**Variant:** Standalone (Rust) | **Status:** In Build
**Canonical source:** `Bxthre3/agentic/SPEC.md`

---

## 1. Identity

**Agentic** is Bxthre3's AI workforce orchestration platform. It is an operating system:
- Has a kernel (protected core)
- Runs agents as processes (workers)
- Enforces correctness (Truth Gate)
- Manages state (ledger)
- Interrupts and resumes (phase gates)
- Self-improves (Self-Modification Engine)
- Has hardware (compute mesh)
- Has persistence (reasoning stream)
- Extends via plugins (orchestration)

**Zo Prototype** runs on Zo Computer as the orchestration layer.
**Standalone v1** runs as a self-hosted Rust binary on any machine.

Both share the same agent roster, task model, and orchestration philosophy — only the hosting differs.

---

## 2. Non-Negotiables (Both Variants)

1. **ZERO HALLUCINATION** — Every claim traces to a source. No fetch, no think.
2. **DETERMINISM** — Same inputs always produce same outputs.
3. **GRACEFUL DEGRADATION** — No single point of failure.

---

## 3. Agent Roster (Both Variants)

19 entities: 18 AI + 1 human (brodiblanco)

| Name | Role | Department |
|------|------|-----------|
| brodiblanco | Founder & CEO | Executive |
| zoe | Executive Agent | Executive |
| atlas | Operations Agent | Operations |
| vance | Executive Agent | Executive |
| pulse | People Ops | Operations |
| sentinel | System Monitor | Operations |
| iris | Engineering Lead | Engineering |
| dev | Backend Engineer | Engineering |
| sam | Data Analyst | Engineering |
| taylor | Security Engineer | Engineering |
| theo | DevOps Engineer | Engineering |
| casey | Marketing Lead | Marketing |
| maya | Grant Strategist | Grants |
| raj | Legal & Compliance | Legal |
| drew | Sales Lead | Sales |
| irrig8 | Field Operations | Operations |
| rain | Regulatory Intelligence | Strategy |
| vpc | Gaming Operations | Operations |
| trenchbabys | Retail Operations | Sales |

---

## 4. Task Model (Both Variants)

**Task status:** `TODO | IN_PROGRESS | BLOCKED | DONE`  
**Priority:** `P0 | P1 | P2 | P3`  
**Phase gates:** `PENDING → ANALYZE → VALIDATE → EXECUTE → DELIVER → COMPLETE`

---

## 5. Feature Architecture

### Layer 4 — Product Interfaces

| Feature | Zo Prototype | Standalone |
|---------|-------------|------------|
| Web dashboard | ✅ zo.space `/agentic` | ✅ TUI (ncurses) |
| Android app | ✅ Native panel | ❌ Out of scope |
| Voice (STT/TTS) | ✅ zo.space API | ✅ Local via coqui/piper |
| LinkedIn integration | ✅ OAuth flow | ✅ OAuth flow |

### Layer 3 — Orchestration

| Feature | Zo Prototype | Standalone |
|---------|-------------|------------|
| IER Router (contextual bandits) | ✅ Python | ✅ Rust |
| Phase Gates | ✅ Python | ✅ Rust |
| Workflow DAG | ✅ Python | ✅ Rust |
| Coherence Engine | ✅ Python | ✅ Rust |
| Reasoning Stream | ✅ Append-only JSONL | ✅ Append-only file |
| Event cascade | ✅ In-process | ✅ Async channel |

### Layer 2 — Runtime Core

| Feature | Zo Prototype | Standalone |
|---------|-------------|------------|
| **Truth Gate** | ✅ zo.space route | ⚠️ Needed — P0 |
| **Deterministic Shell** | ⚠️ Route whitelist | ⚠️ Needed — P0 |
| Inference Node | ✅ Zo API | ⚠️ Needed — P1 |
| Handler Registry | ✅ Python decorators | ✅ Rust trait-based |
| Secrets Vault | ✅ ABE implementation | ✅ Rust AES-256-GCM |
| Auth | ✅ Zo session | ✅ Mutual TLS + API key |
| Feature Flags | ✅ ABE | ⚠️ Needed — P2 |
| **Self-Modification Engine** | ⚠️ ABE exists | ⚠️ Needed — P0 |
| CTC Engine (ETA injection) | ✅ ABE | ⚠️ Needed — P1 |
| Rollback + Cascade Pause | ❌ Not implemented | ⚠️ Needed — P1 |

### Layer 1 — Mesh

| Feature | Zo Prototype | Standalone |
|---------|-------------|------------|
| MCP Server | ✅ ABE 38 tools | ⚠️ Needed — P2 |
| Peer Bridge | ✅ ABE | ⚠️ Needed — P3 |
| Command Bus | ✅ ABE | ⚠️ Needed — P3 |
| Session Sync | ✅ ABE | ⚠️ Needed — P3 |

### Layer 0 — Hardware Fabric

| Node | Zo Prototype | Standalone |
|------|-------------|------------|
| Zo (Nexus) | ✅ Master | ❌ Not applicable |
| Kali (Forge) | ⚠️ Planned | ⚠️ Planned |
| Render (Boost) | ⚠️ Planned | ⚠️ Planned |
| Android (Field) | ✅ Connected | ⚠️ Planned |

---

## 6. Event System (Both Variants)

**10-Point Reality Vector schema:**

| Field | Symbol | Description |
|-------|--------|-------------|
| Timestamp | `t` | Milliseconds since epoch |
| Spatial X | `s_x` | Longitude |
| Spatial Y | `s_y` | Latitude |
| Z-Negative | `z_negative` | Risk/concern |
| Z-Positive | `z_positive` | Value/opportunity |
| Certainty | `c` | Confidence [0.0–1.0] |
| Logic State | `l` | DAP decision state |
| Fidelity | `v_f` | Resolution scale |
| Economic | `e` | Value/cost USD |
| Governance | `g` | Compliance status |

---

## 7. 9-Plane DAP (Both Variants)

| Plane | Name | Trigger | Type |
|-------|------|---------|------|
| 1 | Boolean | `z_positive < 0.20` | Deterministic |
| 2 | Temporal | `time > 24h` | Deterministic |
| 3 | Spatial | `Kriging > 80%` | Deterministic |
| 4 | Geostatistical | Variogram confidence | Deterministic |
| 5 | Hydraulic | `percolation > 0.50` | Deterministic |
| 6 | Atmospheric | ET integration | Deterministic |
| 7 | Economic | `e > 0` | Bounded |
| 8 | Compliance | `g == COMPLIANT` | Deterministic |
| 9 | Strategic | Long-term optimization | Supervised |

---

## 8. Tool Tier System (Both Variants)

| Tier | Label | Behavior |
|------|-------|----------|
| **T0** | Autonomous | Free to call. No announcement. |
| **T1** | Intentional | Must announce `<|intent_start|>` before calling. |
| **T2** | HITL-Gated | Routes to Chairman queue. brodiblanco approves. |

**T2 tools requiring Chairman approval:**
- `file_patent`, `issue_equity`, `authorize_payment >$500`
- `approve_grant_submission`, `delete_workspace_path`
- `create_agent`, `deploy_public_route`, `revoke_secret`
- `submit_water_claim`, `open_external_api_key`

---

## 9. Irrig8 Tier System (Both Variants — Shared IP)

4-tier EAN for physical agriculture:

| Tier | Unit | Function |
|------|------|----------|
| 1 | SFD (Sensor Field Device) | Soil moisture, microclimate, pivot telemetry |
| 2 | PMT (Pivot Management Terminal) | 12-pivot aggregation, SHA-256 sealing |
| 3 | DHU (Data Hub Unit) | 100km mesh, Kriging interpolation |
| 4 | RSS (Regional Superstation) | 48h edge autonomy, satellite uplink |

SHA-256 forensic sealing chain across all tiers. 48h SEM worksheet autonomy at edge.

---

## 10. Deterministic Shell Command Whitelist (Standalone P0)

```rust
ALLOWED_COMMANDS = {
    "mcp.file_read":     { sandbox: true, args: ["path", "encoding"] },
    "mcp.file_write":    { sandbox: true, args: ["path", "content"] },
    "mcp.http_request":  { rate_limit: "100/min", args: ["url", "method", "headers"] },
    "mcp.execute_python":{ sandbox: true, timeout: 30, args: ["code"] },
    "opcua.cnc_start":   { safety_interlock: true, args: ["program_id"] },
    "opcua.cnc_stop":    { immediate: true, e_stop: true },
    "mqtt.publish":      { max_size: "1MB", args: ["topic", "payload", "qos"] },
    "human.notify":      { escalation_timeout: "24h", args: ["user_id", "message"] },
    "human.approval":    { blocking: true, args: ["decision_context", "options"] },
}
```

---

## 11. What Each Variant Adds

### Standalone adds over Zo Prototype

| Feature | Why |
|---------|-----|
| Runs on any Linux machine | No Zo dependency for self-hosted |
| Rust AXUM server on port 3001 | Lightweight, fast, single binary |
| Docker deployment | `docker build .` → deploy anywhere |
| Multi-arch builds (amd64/arm64) | Raspberry Pi, cloud VMs, edge devices |
| Self-contained binary | No Python environment needed |
| No Zo API dependency | Works offline with cached SEM worksheets |

### Zo Prototype adds over Standalone

| Feature | Why |
|---------|-----|
| Zo integrations (Gmail, Calendar, Drive) | Direct native connection |
| Zo AI inference | No local model needed |
| Zo browser sessions | Authenticated web access |
| Zo storage (Bun/SQLite) | Built-in persistence |
| Zo hosting | Zero infra management |

---

## 12. Build & Deploy

### Standalone (Rust)
```bash
cargo build --release
./target/release/agentic-core
# Or:
docker build -t agentic .
docker run -p 3001:3001 agentic
```

### Zo Prototype
```bash
# Already deployed at https://brodiblanco.zo.space/agentic
# Code lives in: Bxthre3/projects/the-agentic-project/
```

---

## 13. Reference

- Standalone source: `github.com/bxthre3inc/agentic`
- Zo prototype: `Bxthre3/projects/the-agentic-project/`
- Full feature audit: `Bxthre3/INBOX/agentic-variant-audit.md`

## Core Modules (Layer 2 — all implemented)

| Module | File | Status | Notes |
|--------|------|--------|-------|
| Truth Gate | `src/core/truth_gate.rs` | ✅ Done | SHA3-256 source hashing, per-class max age, kill switch |
| Deterministic Shell | `src/core/shell.rs` | ✅ Done | 18 whitelisted commands, rate limits, e-stop |
| Self-Modification Engine | `src/core/self_mod.rs` | ✅ Done | Darwin Gödel Cycle, immutable core enforced |
| Rollback + Cascade Pause | `src/core/rollback.rs` | ✅ Done | Cascade lifecycle, rollback points, coherence check |
| CTC Engine | `src/core/ctc_engine.rs` | ✅ Done | Silicon-speed ETA injection, token budget, THINK directive, self-verify |
| Inference Node | `src/core/inference.rs` | ✅ Done | TCO→IER→LLM→CTC pipeline, regex fallback, mesh offload, RQE performance logging |
