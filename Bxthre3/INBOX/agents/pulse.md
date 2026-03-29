# Pulse Health Check — 2026-03-29 14:15 UTC

## Summary
| System | Status | Response Time | Notes |
|--------|--------|---------------|-------|
| zo.space | ✅ 200 | < 2s | Healthy |
| AgentOS API | ⚠️ 404 | 0.001s | Endpoint not found (may not exist) |
| n8n connector hub | ❌ 521 | — | Server error |
| Airtable | ⚠️ 404 | — | Auth missing (expected without token) |
| Linear | ⚠️ 400 | — | Auth missing (expected without token) |
| Gmail | ⚠️ 401 | — | Auth missing (expected without token) |

## Details

### ✅ zo.space (https://brodiblanco.zo.space)
- HTTP 200
- Returns valid HTML page
- Response time: < 2s

### ⚠️ AgentOS API (http://localhost:3099/api/agentos)
- HTTP 404
- Endpoint may not exist or different path
- Response time: 0.001s

### ❌ n8n connector hub (https://n8n-connector-hub-brodiblanco.zocomputer.io)
- HTTP 521
- Web server error — service down

### ⚠️ Airtable (connected)
- Auth test required — 404 expected without valid token
- Integration connected, full test requires OAuth

### ⚠️ Linear (connected)
- Auth test required — 400 expected without valid token
- Integration connected, full test requires OAuth

### ⚠️ Gmail (connected)
- Auth test required — 401 expected without valid token
- Integration connected, full test requires OAuth

## Escalation
- **P3**: n8n connector hub returning 521 — investigate service