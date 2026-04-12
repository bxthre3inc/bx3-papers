---
title: Agentic Mesh Protocol (AMP)
subtitle: Federated Compute for Agentic Workloads
document: RFC-Draft-1
date: 2026-03-27
author: Bxthre3 Inc <dev@bxthre3.inc>
category: std
---

# 1.  Introduction

AMP enables personal devices to form a sovereign compute mesh for running AI agents. Unlike cloud servers, each node maintains local state and identity. Unlike blockchains, there's no global consensus. Unlike serverless, nodes are long-lived.

## 1.1  Requirements Language

- MUST / MUST NOT: Hard requirements for interoperability
- SHOULD / SHOULD NOT: Recommended but not required
- MAY: Optional features

## 1.2  Design Goals

1. **Sovereignty**: User owns identity, cannot be deplatformed
2. **Offline-first**: Works without internet, syncs when available
3. **Heterogeneous**: Android, Linux, x86_64, ARM64 coexist
4. **Zero-config**: mDNS discovery, no manual pairing
5. **Transparent**: All traffic visible to user, no hidden telemetry

## 1.3  Non-Goals

- Global consensus (use blockchain)
- Enterprise multi-tenancy (separate protocol)
- Military-grade security (no side-channel resistance)

# 2.  Protocol Overview

## 2.1  Transport

- **Discovery**: IPv4 UDP multicast 224.0.0.251:7777 (mDNS-compatible)
- **Data**: IPv4/IPv6 UDP unicast or QUIC stream
- **Fallback**: HTTP POST to known peer addresses

## 2.2  Cryptography

- **Authentication**: Ed25519 signatures on all messages
- **Identity**: 64-bit node_id derived from public key
- **Secrecy**: Optional Curve25519 for payload encryption
- **Hashing**: BLAKE3 for content addressing

## 2.3  Framing

UDP: raw JSON
QUIC: [type:1][len:4][payload:N][sig:64]

# 3.  Node State Machine

```
OFFLINE → DISCOVERING → JOINING → ACTIVE → SUSPECT → OFFLINE
              ↑                              ↓
              └───────── SYNC ←──────────────┘
```

**OFFLINE**: No network
**DISCOVERING**: Sending heartbeats, waiting for ACK
**JOINING**: At least one peer ACKed
**ACTIVE**: Participating in mesh
**SUSPECT**: Missed 3 heartbeats from peer

# 4.  Message Types (Full)

... (full spec continues)
