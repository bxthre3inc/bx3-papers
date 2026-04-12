# AGENTIC V1 — 10-Day Production Build Plan

**Target:** 10 days (hard)  
**Maximum:** 30 days (ship whatever works)  
**Philosophy:** Brutal scope, brutal priority, brutal cuts  
**Motto:** "Perfect is the enemy of funded"

---

## SCOPE: MINIMUM FUNDABLE PRODUCT (MFP)

**What Ship Day 10:**
- Event ingestion API (10K/sec sustained)
- 9-Plane DAP evaluation engine
- Cascade trigger system (depth 5)
- Forensic hash chain (SHA-3, not SHA-256)
- 3 agent runtime types wake on events
- Irrig8 sensor → Agentic → Action (one real integration)
- Demo video + build spec v1.0

**What CUT (post-30-day):**
- WebSocket SSE streaming (use polling for demo)
- Full forensic dashboard (use CLI/logs)
- Agent subscription UI (API only)
- Chaos testing framework (manual for now)
- Multi-region (single Zo instance)

---

## 10-DAY SPRINT BREAKDOWN

### DAYS 1-2: FOUNDATION
**Focus:** Persistence + Event Bus  
**Lead:** shadow-engineer  

| Hour | Task | Deliverable |
|------|------|-------------|
| 0-4 | SQLite schema: events, cascades, traces | `schema.sql` |
| 4-8 | Event bus: ingest → DAP → cascade | `bus.rs` or `bus.ts` |
| 8-16 | UUIDv7 + forensic hashing | Hash chain working |
| 16-24 | Persistence layer: writes, reads, ancestry | API handlers |

**Day 2 6PM Checkpoint:**
- ✅ Can ingest 1K events, persist, retrieve by ID
- ✅ Hash chain validates
- 🚫 If not: cut persistence to JSON files, proceed

---

### DAYS 3-4: DAP ENGINE
**Focus:** 9-Plane evaluation, deterministic  
**Lead:** shadow-engineer + iris (code review)  

| Hour | Task | Deliverable |
|------|------|-------------|
| 0-8 | Plane 1-6: Temporality → Execution Matrix | Evaluator v1 |
| 8-16 | Plane 7-9: Evolutionary → Governance | Evaluator v2 |
| 16-24 | Integration: DAP → Cascade trigger | End-to-end test |

**Day 4 6PM Checkpoint:**
- ✅ All 9 planes evaluate correctly
- ✅ `all_match=true` triggers cascade
- ✅ `all_match=false` blocks + logs reason
- 🚫 If not: hardcode Planes 1,5,9 only (80% coverage)

---

### DAYS 5-6: CASCADE + AGENT RUNTIME
**Focus:** Child event emission, agent wake  
**Lead:** shadow-engineer  

| Hour | Task | Deliverable |
|------|------|-------------|
| 0-8 | Cascade engine: parent → children | Depth 3 working |
| 8-16 | Agent registry: subscriptions, webhooks | 3 agent types defined |
| 16-24 | Agent runtime: wake → process → sleep | TypeScript workers |

**Day 6 6PM Checkpoint:**
- ✅ Cascade depth 3 with full trace
- ✅ 1 agent type wakes on event, does work, emits result
- 🚫 If not: use HTTP webhooks instead of workers

---

### DAYS 7-8: IRRIG8 INTEGRATION
**Focus:** One real vertical, one real sensor  
**Lead:** shadow-engineer + irrig8-agent  

| Hour | Task | Deliverable |
|------|------|-------------|
| 0-4 | Sensor mock → real (use existing Irrig8 data) | Data bridge |
| 4-12 | End-to-end: Moisture event → DAP → Agent → Action | Pipeline working |
| 12-20 | Error handling, retries, logging | Resilient pipeline |
| 20-24 | Documentation: integration guide | `INTEGRATION.md` |

**Day 8 6PM Checkpoint:**
- ✅ Real Irrig8 data flows through Agentic
- ✅ Agent wakes, evaluates, triggers action (even mock action)
- 🚫 If not: use synthetic data, label clearly in demo

---

### DAYS 9-10: DEMO + SHIP
**Focus:** Narrative, video, build spec  
**Lead:** casey (narrative) + shadow-engineer (tech)  

| Hour | Task | Deliverable |
|------|------|-------------|
| 0-4 | Load test: 10K events/second | Benchmark results |
| 4-8 | Demo script: 3-minute story | Script v1 |
| 8-16 | Video production: screen capture + voiceover | Demo video MP4 |
| 16-20 | Build spec v1.0: formal, complete | `AGENTIC_V1_SPEC.md` |
| 20-24 | Deploy to Zo production, DNS, SSL | Live endpoint |

**Day 10 6PM SHIP:**
- ✅ `https://agentic.brodiblanco.zo.space` live
- ✅ Demo video on Loom/YouTube
- ✅ Build spec in repo
- ✅ 10K/sec benchmark screenshot
- 🎉 FUNDING UNLOCKS

---

## DAILY STANDUP STRUCTURE

**Time:** 9:00 AM MT (15 min sharp)  
**Attending:** shadow-engineer, iris (review), brodiblanco (decisions)  

```
1. Yesterday: What shipped? (demo in 30 seconds)
2. Today: What will ship? (commit publicly)
3. Blockers: What stops you? (brodiblanco resolves in standup)
4. Cuts: What scope can we kill? (brutal honesty)
```

---

## SCOPING RULES (Brutal)

| If This... | Then That... |
|-------------|--------------|
| Feature takes >4 hours | Cut or defer |
| Bug blocks for >2 hours | Work around, document, move on |
| Test fails non-core path | Skip test, ship core |
| Docs take >2 hours | Bullet points only, video explains |
| Performance <10K/sec | Ship what works, optimize in thesis phase |

---

## 30-DAY FALLBACK

If Day 10 fails, we ship Day 30 with whatever works:

| Component | Day 10 Target | Day 30 Fallback |
|-----------|-------------|-----------------|
| Throughput | 10K/sec | 1K/sec |
| Cascade depth | 5 | 3 |
| Planes | 9 | 5 (1,3,5,6,9) |
| Agents | 3 types | 1 type |
| Integration | Irrig8 real | Irrig8 synthetic |
| Forensics | SHA-3 | SHA-256 |
| Dashboard | CLI only | CLI + basic web |

**Rule:** Ship > Perfect. Funded > Complete.

---

## THESIS BRIDGE (Days 11-90)

**Day 10 → Day 30:** Sprint retrospective, thesis outline  
**Day 30 → Day 60:** Draft paper, validation experiments  
**Day 60 → Day 90:** Submit to arXiv + conference (AAAI, ICML, NeurIPS workshops)

**Thesis Title:** "Deterministic Assessment Protocols for Event-Driven Agentic Systems: A Forensic Approach to AI Orchestration"

**Core Claims:**
1. 9-Plane DAP enables deterministic evaluation of agent triggers
2. Forensic hash chains provide tamper-evident audit trails for autonomous systems
3. Cascade architectures reduce agent wake frequency by 99% vs polling

