# EXECUTABLE HONEY-DO TASKS
Assigned: 2026-03-31 | Due: Daily Sprint

## TASK 1: Daily Maya SBIR Check
**Owner:** maya_alpha
**Command:** python3 Skills/maya-sbir-automation/scripts/maya.py --full
**Frequency:** Daily 08:00
**Time:** 2m
**Dependency:** mesh_server running

## TASK 2: IP Fortress Patrol
**Owner:** ip_defensibility_alpha  
**Command:** python3 /home/workspace/Bxthre3/SOPS/agents/raj/fortress_patrol.py
**Frequency:** Daily 12:00
**Time:** 5m
**Output:** /home/workspace/Bxthre3/IP_AUDIT/daily_scan.json

## TASK 3: AMP Health Pulse
**Owner:** sentinel_alpha
**Command:** curl -s http://localhost:8080/health && curl -s http://localhost:8080/tasks
**Frequency:** Every 15 minutes
**Time:** 10s
**Alert:** SMS if health != 200

## TASK 4: Weekly Idea Vault Harvest
**Owner:** vance_alpha
**Command:** python3 /home/workspace/Bxthre3/IDEA_VAULT/scripts/weekly_digest.py
**Frequency:** Weekly Monday 09:00
**Time:** 10m
**Output:** brodiblanco INBOX.md digest

## TASK 5: Grant Pipeline Scout
**Owner:** vert_sbir_alpha
**Command:** python3 Skills/maya-sbir-automation/scripts/maya.py --check
**Frequency:** Twice weekly (Mon/Thu)
**Time:** 3m
**Output:** /home/workspace/Bxthre3/VAULT/grants_opportunities.md

## TASK 6: Git Sync All Nodes
**Owner:** dev_alpha
**Command:** cd /home/workspace && git pull && sync_to_android_desktop
**Frequency:** On each commit (event-triggered)
**Time:** 30s
**Trigger:** post-commit hook

## TASK 7: Survival Cost Check
**Owner:** cfo_planning_alpha
**Command:** python3 /home/workspace/Bxthre3/SURVIVAL_PLAN/scripts/daily_check.py
**Frequency:** Daily 06:00
**Time:** 1m
**Action:** Alert if burn > threshold

## TASK 8: Agent Health Report
**Owner:** pulse_alpha
**Command:** python3 /home/workspace/Bxthre3/SOPS/agentic/health_check.py --all
**Frequency:** Daily 16:00
**Time:** 2m
**Output:** INBOX.md P0 report

## EXECUTION STATUS
- [ ] Task 1: Maya automation (scheduled via agent above)
- [ ] Task 2: IP Fortress (script exists, needs execution)
- [ ] Task 3: AMP Health (curl works, needs SMS alert setup)
- [ ] Task 4: Idea Vault (digest framework only)
- [ ] Task 5: SBIR Scout (working, needs scheduling)
- [ ] Task 6: Git Sync (manual trigger working)
- [ ] Task 7: Cost Check (script framework exists)
- [ ] Task 8: Health Report (framework exists)

## READY TO RUN NOW:
1. curl http://localhost:8080/health ✅
2. python3 Skills/maya-sbir-automation/scripts/maya.py --check ✅
3. python3 Skills/maya-sbir-automation/scripts/maya.py --full ✅

## NEEDS BUILD:
- fortress_patrol.py (exists as framework)
- weekly_digest.py (exists as framework)
- daily_check.py (exists as framework)
- health_check.py (exists as framework)

---

## ANDROID-LEAD UPDATE — 2026-04-06

### Build Status: ✅ SUCCESSFUL
- APK: `Bxthre3/projects/agentic/the-agentic-project/client/android/app/build/outputs/apk/debug/app-debug.apk` (24M)
- Fixed: Created `local.properties` with SDK path — must be committed

### Open Tasks for Dev:
| Priority | Task |
|----------|------|
| 🟡 P2 | Update `ApiClient` base URL: `https://brodiblanco.zo.space` + `/api/agentic/` prefix |
| 🟡 P2 | Wire `DashboardTab` to call `apiClient.health()` |
| 🟡 P2 | Implement real screens for 7 tabs (currently all placeholders) |
| 🟡 P2 | Add MCP WebSocket client (requires Mesh-Engineer adapter paths) |
| 🟡 P2 | Fix `generateRoadmap()` — points to non-existent `/v1/roadmaps` |
| 🟡 P2 | Remove unused `apiClient` param warning in `DashboardTab` |
