# Salvage Inventory from AgenticBusinessEmpire

## Critical Components (Port to AMP)

### 1. Security Layer
**Source**: `sync_engine/secrets_vault.py`, `core/security.py`
**Status**: MUST port
**Work**: Extract AES-256-GCM, HMAC-SHA256 → Kotlin `common/security/`

### 2. Voice Service
**Source**: `kernel/voice_service.py`
**Status**: MUST port  
**Work**: Opus streaming, VAD → Kotlin `common/voice/`

### 3. Actions Log
**Source**: `sync_engine/actions_log.py`
**Status**: CAN port
**Work**: JSONL audit trail → Kotlin `common/telemetry/`

### 4. Pulse/Health
**Source**: `kernel/pulse.py`, `kernel/resource_monitor.py`
**Status**: MUST port
**Work**: Metrics collection → Kotlin `common/health/`

### 5. Task Context
**Source**: `kernel/task_context.py`
**Status**: SHOULD port
**Work**: State machine → Kotlin `common/tasks/`

### 6. Registry
**Source**: `kernel/registry.py`
**Status**: SHOULD port
**Work**: Agent registry → Kotlin `common/registry/`

## Tenant-Specific (Port with care)

### Irrig8 Logic
**Source**: `tenants/irrig8/logic/`
**Components**: sensor_grid, tier_resolution, pricing_funnel
**Status**: Port math engines, discard old web UI

### Starting 5 Roster
**Source**: `tenants/starting5/src/`
**Components**: roster.py, roster_api.py, A2A tests
**Status**: Evaluate A2A compatibility with AMP

## Discard

- MCP server/client (replaced by AMP)
- JSON-RPC transport (replaced by framed binary)
- Dashboard SPA (replaced by Compose UI)
- Hub topology (replaced by mesh)

## Action Items

1. [ ] Port security vault → common/security/Vault.kt
2. [ ] Port voice service → common/voice/VoiceStream.kt
3. [ ] Port pulse → common/health/Monitor.kt
4. [ ] Port registry → common/registry/AgentRegistry.kt
5. [ ] Port Irrig8 math → tenants/irrig8/
