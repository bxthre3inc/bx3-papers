---
name: meeting-orchestrator
description: Agentic meeting orchestration — creates calendar events, sends invites, and facilitates meetings. Use when running department standups, war rooms, or any scheduled meeting.
compatibility: Created for Zo Computer
metadata:
  author: brodiblanco.zo.computer
---

# Meeting Orchestrator Skill

## Overview

This skill handles the creation and facilitation of all Agentic meetings. It integrates with Google Calendar to create real video meetings with invites and follows the 3-Phase Meeting Protocol.

---

## 3-Phase Meeting Protocol

All Agentic meetings follow a **3-Phase Activation Sequence**:

```
Phase 1: TEXT  →  Phase 2: AUDIO  →  Phase 3: VIDEO
(T-15 min)         (T+0 min)           (T+5 min)
```

### Phase 1 — TEXT (T-15 minutes)
- **Duration:** 15 minutes
- **Purpose:** Pre-meeting alignment & async updates
- **Action:** Post agenda to meet chat, attendees post updates asynchronously

### Phase 2 — AUDIO (T+0 minutes)
- **Duration:** Until meeting end or video transition
- **Purpose:** Live verbal sync
- **Action:** Open audio bridge, attendance, round-robin, blocker triage

### Phase 3 — VIDEO (T+5 minutes or when ready)
- **Duration:** As needed
- **Purpose:** Complex problem-solving, demos
- **Action:** All on video, screen share for materials

### Meeting-Specific Timing

| Meeting | Text | Audio | Video |
|---------|------|-------|-------|
| Daily Standup | 8:00 AM | 8:15 AM | 8:20 AM |
| Daily War Room | 3:45 PM | 4:00 PM | 4:05 PM |
| Weekly Board | 1:30 PM | 2:00 PM | 2:05 PM |

---

## War Room (Starting5 / Agentic)

**Location:** Google Meet (auto-created via Google Calendar)
**Frequency:** Daily at 4:00 PM MT (Mon-Fri)
**Attendees:** brodiblanco, Atlas, Balance, department leads

**Calendar Event Description Template:**
```
WAR ROOM — Agentic Executive Sync

PHASE 1: TEXT (3:45 PM) — Async updates in chat
PHASE 2: AUDIO (4:00 PM) — Live verbal sync  
PHASE 3: VIDEO (4:05 PM) — Deep dive

[Agenda checklist]
```

---

## Usage

When orchestrating a meeting:

1. **Create calendar event** via Google Calendar with Meet link
2. **Post agenda** T-15 min to the meet chat
3. **Start audio** at T-0
4. **Transition to video** at T+5 if needed
5. **Log meeting** to `/Bxthre3/meeting-logs/`

---

## Meeting Log Template

```markdown
# [Meeting Name] — YYYY-MM-DD

**Date:** YYYY-MM-DD
**Scheduled:** [Time] (Text → Audio → Video)
**Status:** [SCHEDULED/HELD/NO-SHOW]
**Meeting:** [Meet link]

---

## Phase 1 — TEXT
## Phase 2 — AUDIO
## Phase 3 — VIDEO

## Attendees
## Agenda
## Discussion
## Decisions
## Action Items
```
