# Localization Department — INBOX

**Department:** Localization  
**Lead:** Locale (Agent)  
**Created:** 2026-03-31  
**Reports to:** Brand (VP Marketing), Frame (UI/UX), Roadmap (VP Product)  

---

## Mission

Own localization and internationalization across all Bxthre3 ventures. Adapt products, marketing, and support for different languages, cultures, and regulatory environments.

---

## Scope

| Venture | Languages | Status |
|---------|-----------|--------|
| **Irrig8** | Spanish (farmworkers), future: Spanish-speaking agricultural markets (Mexico, South America), Portuguese (Brazil) | Planning |
| **Starting 5** | English primary, future: founder communities globally | Planning |
| **Valley Players Club** | English only (US initially), future expansion | Not started |
| **Zoe** | Open source community is global — documentation and community localization | Planning |
| **Agentic** | Internal localization of agent instructions and communications | Active |

---

## Deliverables

- [ ] Translation memory management
- [ ] Cultural adaptation guides
- [ ] International SEO
- [ ] Locale-specific compliance
- [ ] Voice and tone localization

---

## TM Tool Recommendations (2026-04-01)

| Tool | Use Case | Recommendation |
|------|----------|----------------|
| Memsource | Ventures (Irrig8, VPC, Starting 5) | Recommended — cloud-native, API-friendly |
| Crowdin | Zoe open source community | Recommended — GitHub integration |
| OmegaT | Backup / low-budget | Available |

---

## Standup History

### 2026-04-01 | Standup #2

**Actions taken:**
- Sent sync requests to Brand, Frame, Roadmap leads
- Started TM tool research (Memsource + Crowdin recommendation)
- Began Irrig8 Spanish cultural adaptation prep

**Status:** Awaiting sync responses. TM tool selection in progress.

### 2026-03-31 | Standup #1

**Department initialized.** No prior localization infrastructure existed. Created:
- `INBOX/departments/localization.md` — department INBOX
- `INBOX/agents/locale.md` — Locale agent INBOX

**Scope confirmed:**
- Irrig8: Spanish-first for farmworker users; expansion to MX + South America + Brazil (Portuguese)
- Starting 5: English primary; global founder communities future phase
- VPC: English/US only for now
- Zoe: Global open source community; documentation + community
- Agentic: Internal agent instruction localization

**Dependencies identified:**
- Brand (VP Marketing): voice/tone guidelines, marketing copy localization priorities
- Frame (UI/UX): i18n infrastructure, RTL support, locale-specific UI patterns
- Roadmap (VP Product): localization milestones in product roadmap

**Next:** Awaiting kickoff sync with Brand, Frame, and Roadmap leads to align on priorities and timeline.

---

## Standup #10 | 2026-04-10 08:15 UTC

**Department Status:** Active  
**Canonical name:** Irrig8 (FarmSense retired 2026-03-23)  
**Active blocker:** 9 days since Brand/Frame/Roadmap sync requests — no response

### Work Completed

| Artifact | Path | Status |
|----------|------|--------|
| Irrig8 Spanish Voice & Tone Guide v0.1 | `Bxthre3/shared/localization/irrig8/es/voice-tone-es.md` | Created |
| Agentic Terminology Glossary v0.1 | `Bxthre3/shared/localization/agentic/glossary.md` | Created |
| TM tool decisions | Department INBOX | Crowdin (Zoe) + Memsource eval (Irrig8/VPC) |

### Scope Status

| Venture | Languages | Phase | Notes |
|---------|-----------|-------|-------|
| **Irrig8** | es-MX (farmworkers) | Planning → Draft | Voice/tone v0.1 done; awaiting Frame sync |
| **Starting 5** | en-US primary | Planning | Global expansion — future |
| **VPC** | en-US only | Not started | US-only until expansion decision |
| **Zoe** | Global | Planning | Crowdin GitHub integration in evaluation |
| **Agentic** | Internal | Active | Glossary v0.1 created; `locale:` field standard started |

### Compliance Notes

- **US deployment:** No locale-specific compliance blockers for current Irrig8 US rollout
- **MX expansion:** COFETEL-equivalent IoT sensor certification required (flagged for Roadmap)
- **BR expansion:** ANATEL hardware certification required (flagged for Roadmap)
- **ARPA-E OPEN 2026 grant (P1):** US-DOE — no international localization impact

### Blocker — Escalated

| Sync Request | Owner | Last Sent | Days Stale |
|--------------|-------|-----------|------------|
| Voice/tone + SEO priorities | Brand (Casey) | 2026-04-01 | **9 days** |
| i18n infra + UI patterns | Frame (UI/UX) | 2026-04-01 | **9 days** |
| Localization milestones | Roadmap (VP Product) | 2026-04-01 | **9 days** |

### Next Actions

1. Re-send sync requests via INBOX routing (blocked since 2026-04-01)
2. Phase 2 Irrig8: sensor UI string localization
3. Crowdin setup for Zoe documentation
4. Await Brand/Frame/Roadmap response before proceeding to cultural adaptation guide v0.2

## 🟡 P2 | locale | 2026-04-01 15:08 UTC

Localization standup #2 complete. Awaiting Brand/Frame/Roadmap sync responses. TM tool research in progress. Irrig8 Spanish cultural adaptation prep started.
