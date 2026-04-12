# Pulse Anomaly Log

## 2026-04-05T00:20:00Z

| Service | Status | Details |
|---------|--------|---------|
| zo.space | ✅ 200 | Healthy |
| localhost:3099 | ✅ 200 | Healthy |
| localhost:3000 | ❌ FAILED | Not running (was never a service) |
| localhost:8080 | ❌ FAILED | Not running (was never a service) |
| postgres:5432 | ❌ FAILED | No PostgreSQL running |
| vpc:5176 | ✅ 200 | Healthy |
| agentic-api:9000 | ❌ FAILED | **NEW** - workdir missing: /home/workspace/Bxthre3/projects/the-agentic-project/backend (project moved to agentic/?) |

**Action:** agentic-api first failure. Project directory missing — may have been relocated. Monitoring.

## 2026-03-30T19:00:00Z

| Service | Status | Details |
|---------|--------|---------|
| zo.space | ✅ 200 | Healthy |
| localhost:3099 | ✅ 200 | Healthy |
| localhost:3000 | ❌ FAILED | Connection refused/timeout (3 consecutive - ESCALATING) |
| localhost:8080 | ⚠️ 404 | Service responding but no route (3 consecutive - ESCALATING) |
| postgres:5432 | ❌ FAILED | No response on port 5432 (3 consecutive - ESCALATING) |

**Action:** 3 services at 3+ consecutive failures. Escalating to INBOX.md per protocol.

## 2026-03-30T09:15:00Z

| Service | Status | Details |
|---------|--------|---------|
| zo.space | ✅ 200 | Healthy |
| localhost:3099 | ✅ 200 | Healthy |
| localhost:3000 | ❌ FAILED | Connection refused/timeout (2 consecutive) |
| localhost:8080 | ⚠️ 404 | Service responding but no route (2 consecutive) |
| postgres:5432 | ❌ FAILED | No response on port 5432 (2 consecutive) |

**Action:** 3 services down or degraded. PostgreSQL down 2x cycles. No critical Bxthre3 services depend on these ports currently (vpc=5176, mcp=7777, aos=9999, bridge=8888, mesh=7778 all healthy).

## 2026-03-30T06:30:00Z

| Service | Status | Details |
|---------|--------|---------|
| zo.space | ✅ 200 | Healthy |
| localhost:3099 | ✅ 200 | Healthy |
| localhost:3000 | ❌ FAILED | Connection refused/timeout |
| localhost:8080 | ⚠️ 404 | Service responding but no route |
| postgres:5432 | ❌ FAILED | No response on port 5432 |