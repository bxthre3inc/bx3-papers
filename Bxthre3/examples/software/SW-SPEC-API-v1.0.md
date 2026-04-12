# SW-SPEC-API-v1.0 — Agentic API Specification
**Status:** APPROVED  
**Owner:** Engineering (Iris)  
**Created:** 2026-03-20  
**Updated:** 2026-04-02

---

## 1. Overview

REST API for Agentic platform. Serves agent status, tasks, org data to desktop and mobile clients.

**Base URL:** `https://brodiblanco.zo.space/api/agentic/`  
**Version:** v1  
**Auth:** Bearer token in header

---

## 2. Endpoints

### GET /status
System health check.

**Response:**
```json
{
  "version": "2.5.1",
  "status": "healthy",
  "agents": 18,
  "tasks_pending": 47,
  "last_sync": "2026-04-02T09:00:00Z"
}
```

### GET /agents
List all agents.

**Response:**
```json
{
  "agents": [
    {
      "id": "zoe",
      "name": "Zoe",
      "role": "Chief of Staff",
      "status": "active",
      "last_report": "2026-04-02T08:45:00Z"
    }
  ]
}
```

### GET /tasks
Active task queue.

**Query params:** `?status=pending|in_progress|complete&priority=P0|P1|P2|P3`

**Response:**
```json
{
  "tasks": [
    {
      "id": "TASK-2026-001",
      "title": "CIG Colorado LOI",
      "status": "pending",
      "priority": "P0",
      "due": "2026-04-30",
      "assigned_to": "casey"
    }
  ]
}
```

### GET /org
Organization chart.

**Response:**
```json
{
  "departments": ["Engineering", "Operations", "Grants"],
  "leadership": [
    {"role": "CEO", "name": "brodiblanco"},
    {"role": "CTO", "name": "Bits"}
  ]
}
```

---

## 3. Error Handling

| Code | Meaning | Retry? |
|------|---------|--------|
| 200 | Success | No |
| 400 | Bad request | No |
| 401 | Unauthorized | No |
| 404 | Not found | No |
| 429 | Rate limited | Yes (exponential) |
| 500 | Server error | Yes |

---

## 4. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response time (p95) | < 200ms | New Relic |
| Error rate | < 0.1% | Loki logs |
| Uptime | 99.9% | Pingdom |

---

*[APPROVED]* — Iris + CTO
