# Agentic — Canonical Build

> ONE architecture. All agents. All environments.

## What

Agentic is Bx3 Inc's unified AI operating system consolidating **12+ prior agent/orchestration projects** into a single, deterministic, production-grade build.

## Architecture

Layer 4 — **Product Interfaces** (zo.space, Android, Linux TUI)
Layer 3 — **Orchestration** (IER Router, Phase Gates, Workflow DAG, Coherence Engine, Reasoning Stream)
Layer 2 — **Runtime Core** (Kernel, Inference, Registry, Secrets, Auth, Feature Flags)
Layer 1 — **Mesh** (peer-bridge, command bus, session sync, MCP protocol)
Layer 0 — **Hardware Fabric** (Zo, Kali, Render, Android)

## Quick Start

```bash
# Kernel
python3 kernel/main.py

# Orchestration modules (standalone test)
python3 orchestration/ier_router.py
python3 orchestration/phase_gates.py
python3 orchestration/workflow_dag.py
python3 orchestration/reasoning_stream.py
python3 orchestration/coherence_engine.py
```

## Key Files

| Path | Purpose |
|------|---------|
| kernel/main.py | Entry point |
| kernel/inference_node.py | LLM inference + dispatch |
| kernel/task_context.py | TCO schema + persistence |
| kernel/resource_monitor.py | 5-tier performance profiles |
| kernel/pulse.py | ConglomeratePulse heartbeat |
| core/db.py | RQE spatial database |
| core/security.py | Fernet encryption |
| orchestration/ier_router.py | Learnable routing (canonical) |
| orchestration/phase_gates.py | Conditional gates (canonical) |
| mesh/peer_bridge.py | 3-way symmetric mesh |
| mesh/secrets_vault.py | AES-256-GCM vault |
| agents/starting5_roster.py | 19-agent workforce registry |

## Source Map

| Feature | Best Source |
|--------|------------|
| IER Router | agentic/orchestration |
| Phase Gates | agentic/orchestration |
| Workforce Registry | ABE agents/workforce_registry.py |
| Secrets Vault | ABE sync_engine/secrets_vault.py |
| Performance Profiles | ABE kernel/resource_monitor.py |
| Reasoning Stream | agentic/orchestration |
| SME WorkSheet Protocol | ABE tenants/irrig8/worksheet.py |
| Tier Resolution Funnel | ABE tenants/irrig8/tier_resolution.py |
| Pricing Funnel | ABE tenants/irrig8/pricing_funnel.py |
| 10-Point Reality Vector | SYMPHONY_IP_ARCHITECTURE.md |
| Ikigai Wizard | Helm-BAP constants.ts |
| Lifecycle Stages | Helm-BAP types.ts |

Full feature map: SUPER_SPEC.md
