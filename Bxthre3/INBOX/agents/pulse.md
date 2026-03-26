# Pulse — Health Check Report
**Timestamp:** 2026-03-26T05:45:00 UTC

## Summary
| System | Status | Response Time |
|--------|--------|---------------|
| zo.space | ✅ Healthy | 1.85s |
| AgentOS API | ⚠️ No route /api/agentos | N/A |
| n8n connector hub | ✅ Healthy | 0.65s |
| Airtable | ✅ Connected | 0.42s |
| Linear | ✅ Connected | 0.29s |
| Gmail/Google Calendar | ✅ Configured | N/A |

## Details

### zo.space
- **URL:** https://brodiblanco.zo.space
- **Status:** ✅ Healthy
- **Response Code:** 200
- **Response Time:** 1.85s (< 2s threshold)

### AgentOS API
- **URL:** http://localhost:3099/api/agentos
- **Status:** ⚠️ No route at /api/agentos (returns 404)
- **Note:** The base zo.space server responds, but the /api/agentos route is not configured. AgentOS routes may be under a different path or handled via zo.space pages.

### n8n Connector Hub
- **URL:** https://n8n-connector-hub-brodiblanco.zocomputer.io
- **Status:** ✅ Healthy
- **Response Code:** 200
- **Response Time:** 0.65s (< 2s threshold)

### Airtable
- **Status:** ✅ Connected
- **Email:** getfarmsense@gmail.com
- **Bases:** 1 (AgentOS Base)
- **Response Time:** 0.42s
- **Note:** Integration working via use_app_airtable

### Linear
- **Status:** ✅ Connected
- **User:** FarmSense (getfarmsense@gmail.com)
- **Organization:** BX3
- **Response Time:** 0.29s
- **Note:** Integration working via use_app_linear

### Gmail / Google Calendar
- **Status:** ✅ Configured
- **Note:** OAuth integrations active per Zo settings

## Escalation
- **P1:** None required
- **P2:** None required  
- **P3:** AgentOS API route /api/agentos not found (404) - investigate route configuration

## Action Items
- [ ] Verify AgentOS API route configuration in zo.space
- [ ] Confirm if /api/agentos is intended endpoint or alternative path exists
