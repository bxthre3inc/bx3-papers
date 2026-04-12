# Agentic — AI Workforce Orchestration Platform

**Version:** v6.1.0  
**Status:** Active Development  
**Last Updated:** 2026-03-29

---

## What is Agentic

Agentic is the AI workforce orchestration platform that powers all Bxthre3 ventures. It manages autonomous agents across multiple modalities: mobile, desktop, server, and cloud.

---

## Consolidated Project Structure (v6.1)

```
the-agentic-project/
├── mobile/              # Android native app (Kotlin + Jetpack Compose) — PRIMARY
│   └── app/build/outputs/apk/debug/app-debug.apk
├── chromebook/          # Kali Linux/ChromeOS worker — SECONDARY
├── worker-render/       # Render.com cloud worker — VOLUNTARY COMPUTE
│   ├── src/worker.ts   # Bun-based worker with retry/reroute
│   └── render.yaml     # Blueprint for Render deploy
├── backend-api/         # API server & Zo-hosted mesh
├── server/              # AMP mesh control plane
├── mcp-mesh/            # MCP protocol mesh
├── common/              # Shared libraries
└── docs/
    ├── ARCHITECTURE.md
    ├── AMP_PROTOCOL.md
    └── KEY_ARCHITECTURE.md  # ← NEW: Sovereign federation keys
```

---

## Federated Compute Mesh

Agentic operates as a **Sovereign Federation** — not consensus-based, but permissioned hive:

| Role | Node | Capabilities | Auth |
|------|------|-----------|------|
| **Root** | You (Android) | Command, sign, decommission | Split key (Zo+Render+PIN) |
| **Primary** | Android | Interface, router, offline backup | Device key |
| **Secondary** | Chromebook | LLM inference, heavy compute | Worker key |
| **Voluntary** | Render | Stateless compute, autoscale | Root-signed |
| **Backend** | Zo-hosted | Control plane, persistence | Root key |

**Task Routing**: Automatic → Retry (3× backoff) → Reroute on failure → Backup node takes over.

See `docs/KEY_ARCHITECTURE.md` for key distribution.

---

## Quick Start

### Android Build

```bash
cd mobile
./gradlew assembleDebug
# Output: mobile/app/build/outputs/apk/debug/app-debug.apk
```

**Latest APK:** `app-debug.apk` (21MB, built 2026-03-29)

---

## Protocol Stack

- **AMP v1.0** — Node discovery, task routing, state sync
- **MCP v2025** — Model context protocol for tool interoperability
- **Foundry** — Breadcrumb capture → Vault equity proof

---

## Download

**Agentic Android v6.1.0:** [Download APK](https://brodiblanco.zo.space/api/agentic/download-apk)

---

© 2026 **Bxthre3 Inc.**