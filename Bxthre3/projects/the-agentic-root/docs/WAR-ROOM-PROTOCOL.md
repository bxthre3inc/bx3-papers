# War Room Protocol — Agentic Phased Meeting System
**Version:** 1.0  
**Effective:** 2026-03-24  
**Owner:** Atlas (COO) / Logger (Meeting Infrastructure)

---

## Overview

All Agentic meetings follow a **3-Phase Activation Sequence**:

```
Phase 1: TEXT  →  Phase 2: AUDIO  →  Phase 3: VIDEO
(-15 min)         (0 min)           (+5 min)
```

This ensures distributed team alignment before real-time sync, maximizes meeting efficiency, and documents decisions in writing.

---

## Phase Breakdown

### Phase 1 — TEXT (T-15 minutes)

**Duration:** 15 minutes  
**Purpose:** Pre-meeting alignment & async updates

**What Happens:**
1. Logger posts agenda to the meeting thread/doc
2. Attendees post their updates asynchronously
3. Blocker identification happens in writing
4. Meeting link shared

**Deliverable:** Filled agenda with pre-populated updates

---

### Phase 2 — AUDIO (T+0 minutes)

**Duration:** Until Phase 3 or meeting end  
**Purpose:** Live verbal sync, rapid discussion

**What Happens:**
1. Audio bridge opens (Google Meet / phone dial-in)
2. Facilitator (Atlas for War Room) takes attendance
3. Round-robin verbal updates (if not already posted)
4. Blocker escalation & triage
5. Decision capture

**Rule:** Camera optional, mic required for speakers

---

### Phase 3 — VIDEO (T+5 minutes or when ready)

**Duration:** As needed  
**Purpose:** Complex problem-solving, demos, sensitive topics

**What Happens:**
1. Facilitator transitions to video
2. Screen share opened for relevant materials
3. Deep-dive discussions
4. Action item assignment with owners & deadlines

**Rule:** All attendees on video for this phase

---

## Meeting Templates

### Daily Standup (8:15 AM MT)
| Phase | Time | Duration | Tool |
|-------|------|----------|------|
| Text | 8:00 AM | 15 min | Slack thread / Meet chat |
| Audio | 8:15 AM | Until done | Google Meet |
| Video | 8:20 AM | Optional | Google Meet |

### Daily War Room (4:00 PM MT)
| Phase | Time | Duration | Tool |
|-------|------|----------|------|
| Text | 3:45 PM | 15 min | Slack thread / Meet chat |
| Audio | 4:00 PM | Until done | Google Meet |
| Video | 4:05 PM | As needed | Google Meet |

### Weekly Board (Friday 2:00 PM MT)
| Phase | Time | Duration | Tool |
|-------|------|----------|------|
| Text | 1:30 PM | 30 min | Document collaboration |
| Audio | 2:00 PM | Until done | Google Meet |
| Video | 2:05 PM | Duration | Google Meet + screen share |

---

## War Room Specific Rules

**War Room = Executive Operational Sync**

- **Frequency:** Daily at 4:00 PM MT (Mon-Fri)
- **Attendees:** brodiblanco, Atlas, Balance, department leads
- **Facilitator:** Atlas
- **Scribe:** Logger (me)

### War Room Agenda

**Phase 1 (Text) — Pre-populated by 3:45 PM:**
```
# War Room Agenda — [DATE]

## 1. Department Status Round Robin
- Engineering: [status]
- Sales: [status]
- Product: [status]
- ...

## 2. Top 3 Blockers
1. [blocker]
2. [blocker]
3. [blocker]

## 3. Decisions Needed
1. [decision]

## 4. Resource Requests
[list]

## 5. Stakeholder Updates
[any external updates]
```

**Phase 2 (Audio):**
- Attendance taken
- 30-second verbal updates (if not in text)
- Blocker triage
- Decision voting

**Phase 3 (Video):**
- Deep-dive on any blocker requiring visual context
- Demo reviews
- Strategy sessions

---

## Tools & Integration

| Function | Tool |
|----------|------|
| Calendar events | Google Calendar (auto-created with Meet) |
| Phase 1 async | Google Meet chat / shared doc |
| Audio bridge | Google Meet |
| Video + screenshare | Google Meet |
| Meeting logs | `/Bxthre3/meeting-logs/` |
| Scribe notes | Logger INBOX |

---

## Orchestrator Responsibilities

Each meeting orchestrator (Sync, War Room, etc.) must:

1. **T-20 min:** Create/update shared agenda document
2. **T-15 min:** Send reminder ping with agenda
3. **T-0 min:** Open audio bridge, start meeting
4. **T+5 min:** Transition to video if needed
5. **Post-meeting:** Ensure Logger writes the meeting log

---

## Compliance

- **All meetings logged** regardless of attendance
- **NO-SHOW status** if orchestrator fails
- **Logger writes logs** if orchestrator is absent
- **Logs stored** in `/Bxthre3/meeting-logs/{meeting-type}/`

---

*War Room Protocol v1.0 — part of Agentic Meeting Infrastructure*
