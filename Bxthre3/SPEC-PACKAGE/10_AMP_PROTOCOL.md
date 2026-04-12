# Agentic Mesh Protocol (AMP) v1.0

**Status:** Draft | **Authors:** Bxthre3 Inc | **Date:** 2026-03-27

---

## Abstract

AMP is a federated, sovereign compute protocol enabling heterogeneous devices to form a unified agentic workload mesh without central coordination.

Key properties:
- **No central server**: Nodes form peer mesh
- **Self-sovereign identity**: Ed25519 keys, no PKI
- **Capability-based routing**: Tasks match to nodes by advertised abilities
- **Eventual consistency**: Vector clocks, not global consensus

---

## 1. Node Model

### 1.1 Identity

```
node_id = hardware_fingerprint + random_nonce → SHA256 → take 8 bytes → uint64
```

### 1.2 Roles

| Role | Priority | When Active |
|------|----------|-------------|
| PRIMARY | 1 | Always first |
| SECONDARY | 2 | PRIMARY unavailable |
| TERTIARY | 3 | Both offline |

### 1.3 Capabilities (Self-Reported)

- `COMPUTE_LIGHT`: Mobile SoC, quantized models
- `COMPUTE_HEAVY`: GPU, batch processing
- `OFFLINE_FIRST`: Works without network
- `VOICE_STREAM`: <50ms audio latency

---

## 2. Wire Format

### UDP (Port 7777)

Max 1500 bytes, unframed JSON.

```json
{
  "type": "HEARTBEAT",
  "sender": 123456789,
  "ts": 1700000000000,
  "node": {
    "id": 123456789,
    "role": "PRIMARY",
    "caps": ["COMPUTE_LIGHT", "GPS"],
    "health": {"cpu": 15, "bat": 87}
  }
}
```

### Stream (TCP/QUIC)

```
[type:1][length:4][payload:N][sig:64]
```

---

## 3. Message Types

| ID | Name | Purpose |
|----|------|---------|
| 1 | HEARTBEAT | 5s presence |
| 2 | STATE_SYNC | CRDT merge |
| 3 | TASK_OFFER | Route compute |
| 4 | TASK_ACCEPT | Commit to run |
| 5 | TASK_RESULT | Return output |
| 6 | VOICE_STREAM | Opus audio |
| 7 | TEXT_COMMAND | SMS/Email/CLI |
| 8 | LEADERSHIP | Coordinator election |

---

## 4. Consensus (None)

- No global state
- Each node: SQLite + vector clock
- Merge: max(timestamp) per node
- Tie-break: higher node_id wins

---

See AMP-RFC.md for full specification.
