# Agentic Consolidation Assessment

**Date:** March 29, 2026  
**Target Architecture:** 4-Node Federated Mesh with Dynamic Leadership

---

## Vision: User-Key = Commander Principle

> Wherever the user is actively authenticated with their key, that device becomes the **Primary Control Interface** for the mesh.

---

## Current State: 4 Runtimes

| Runtime | Status | Node Role |
|---------|--------|-----------|
| **Android** | APK builds (21MB) | PRIMARY - User C&C |
| **Chromebook** | Skeleton exists | SECONDARY - Compute |
| **Render** | Template only | WORKER - Burst |
| **Zo Backend** | mesh_server.py running | TERTIARY - Persistence |

---

## Feature Audit

| Feature | Android | Chromebook | Render | Zo | Status |
|---------|---------|------------|--------|----|--------|
| AMP Discovery | Partial | Partial | None | Partial | **NEEDS RENDER** |
| Heartbeat | 5s | 5s | None | 5s | **GAP: Render** |
| Leader by User Key | No | No | No | No | **MISSING** |
| Load Balancing | Hardcoded | Hardcoded | None | None | **MISSING** |
| Failover Chain | FOXXD→Chrome→Zo | Same | None | None | **MISSING** |

---

## Critical Gaps

### Gap 1: Key-Auth Session
Currently leader = min(node_id). Required: 
1. User signs on device X
2. Device broadcasts ASSUME_COMMAND
3. Mesh recognizes X as PRIMARY until X goes offline

### Gap 2: Render Worker
File `/backend-api/workers/render-worker.ts` is stub only. Needs full AMP implementation.

### Gap 3: No Task Sharding
Tasks run on single node. Need split/aggregate across 2+ nodes.

---

## Consolidated Directory Structure

the-agentic-project/
├── android/           # Primary C&C interface
├── chromebook/        # Secondary compute
├── worker-render/     # TypeScript implementation
├── node-backend/      # Python always-on
├── common/            # Shared types (Kotlin Multiplatform)
├── control-plane/     # Session manager
└── ui-kit/            # Shared Compose components

---

## Success Criteria

- [ ] Android: "Take Command" button → mesh acknowledges PRIMARY
- [ ] Chromebook: Seamless takeover when Android offline
- [ ] Render worker: Appears in mesh topology
- [ ] Load balancing: Tasks route to least-loaded node
