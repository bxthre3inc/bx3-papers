# BX3 Integration Architecture
> Last updated: 2026-04-17

## Overview

BX3 Inc runs on Zo Computer as its primary agentic infrastructure. This
document is the canonical reference for how all integrations connect and
what the current state is.

---

## INTEGRATION STACK (2026-04-17)

### Event-Driven GitHub → Linear (✅ Live)
- **Webhook endpoint:** `https://brodiblanco.zo.space/api/github-webhook`
  (HMAC-SHA256 verified via `GITHUB_WEBHOOK_SECRET`)
- **What it does:** On PR merge → parses `BX3-N` from title/body →
  closes Linear issue instantly. No polling.
- **Registered repos:** `agent-os`, `bxthre3`, `agentos-command-center`,
  `Distributed-Execution-System`, `CREDsWallet`

### Linear ↔ Google Tasks Bridges (✅ Live — 15-min polling)
- **Linear → Google Tasks:** Every 15 min. Issues assigned to you
  (`be904814-6678-4b8d-8e62-c7acd880cef2`) → created as Google Tasks,
  routed by keyword (Agentic→BX3:Agentic, Irrig8→BX3:Irrig8, etc.)
- **Google Tasks → Linear:** Every 15 min. Tasks completed in Google Tasks
  → corresponding Linear issue moved to Done
- **Weekly Hygiene:** Every Monday 9am MT. Cleans stale Linear issues,
  archives completed, checks unstarted tasks
- **Sync state file:** `Bxthre3/INBOX/foundry-queue/linear-gtasks-bridge.json`

### Daily Morning Brief (✅ Live — 8am MT)
- **Agent:** BX3 Daily Brief — sends email to brodiblanco @ 8am MT
- **Content:** Google Tasks summaries (BX3:Today, BX3:Agentic, BX3:Irrig8,
  BX3:Projects), open Linear issues, workspace breadcrumbs
- **Log:** `Bxthre3/INBOX/foundry-queue/google-tasks-log.md`

---

## GOOGLE TASKS — STRUCTURE

4 lists created 2026-04-17. Use these IDs in all API calls:

| List | ID | Use For |
|------|----|---------|
| BX3:Today | `MjJ3TlRoU3pjT1c4X2pERw` | General tasks, triage |
| BX3:Agentic | `eG9wOUxObnpidmptczNNA` | Agentic development |
| BX3:Irrig8 | `bGsxVXFOcmotNnRscWhKMQ` | Irrig8 farming OS |
| BX3:Projects | `WEozRDdoa1VrUFRjRnAzag` | Everything else |

---

## LINEAR — CONFIG

| Field | Value |
|-------|-------|
| Team ID | `ffb6f386-e51a-4aa9-a686-e92e3e1c3e81` |
| User ID | `be904814-6678-4b8d-8e62-c7acd880cef2` |
| Issue convention | `BX3-N` (e.g. `BX3-5`) |
| Connected accounts | `getfarmsense@gmail.com`, `bxthre3inc@gmail.com` |

---

## GOOGLE WORKSPACE — CONNECTED

| Service | Status | Account |
|---------|--------|---------|
| Gmail | ✅ full read/write | getfarmsense@gmail.com |
| Google Calendar | ✅ full read/write | getfarmsense@gmail.com |
| Google Tasks | ✅ full read/write | getfarmsense@gmail.com |
| Google Drive | ✅ full read/write | getfarmsense@gmail.com |

---

## AIRTABLE — CONNECTED

- **Account:** getfarmsense@gmail.com
- **Bases in use:**
  - `appHg8lr1v409yKBc` — 6 tables (type: Organizations)
  - `app93dsGcEyPfkqaa` — 8 tables (Irrig8 base, see below)

### Irrig8 Base Tables (app93dsGcEyPfkqaa)
| Table | Purpose |
|-------|---------|
| Field Operations | Pivot-level irrigation tasks |
| Sensor Data | In-ground/above-ground telemetry |
| Compliance | Audit trail, regulatory filings |
| Equipment | Hardware inventory, firmware |
| Staff | Field team management |

---

## NOTION — CONNECTED

- **Account:** getfarmsense@gmail.com
- **Capabilities:** Pages, databases, file uploads, comments, block
  append — full read/write

---

## GITHUB — FULL TOKEN (✅ Connected)

- **Token:** `GITHUB_TOKEN` (repo scope + gist + read:org)
- **Org:** bxthre3inc (22 repos including agentic, CREDsWallet, etc.)
- **Webhook secret:** `GITHUB_WEBHOOK_SECRET` (verified in use)

### Key Repos
| Repo | Purpose |
|------|---------|
| bxthre3inc/agentic | Standalone Rust build (primary IP) |
| bxthre3inc/agent-os | Legacy AgentOS reference |
| bxthre3inc/bxthre3 | Workspace root git |
| bxthre3inc/CREDsWallet | Credits wallet product |
| bxthre3inc/agentos-command-center | Zo Space command routes |
| bxthre3inc/Distributed-Execution-System | WASM mesh |

---

## STRIPE — TEST MODE (⚠️ Onboarding incomplete)

- **Secret key:** `STRIPE_API_SECRET_TEST`
- **Webhook configured:** `https://brodiblanco.zo.space/api/stripe-webhook`
- **Status:** Stripe Connect onboarding needs completion at [Sell](/?t=sell)
  before accepting live payments

---

## AGENTIC STANDALONE BUILD (⚠️ Blocked — Rust toolchain)

**Repo:** `https://github.com/bxthre3inc/agentic`

The standalone Rust binary (`Bxthre3/agentic/src/`) cannot compile on
this machine due to Rust 1.63 / cargo 1.65 — too old for modern crate
ecosystem (uuid v1.23 requires edition 2024 which needs cargo 1.82+).

**Workaround:** GitHub Actions uses latest Rust. Push → CI builds.
See `bxthre3inc/agentic/.github/workflows/build.yml`.

**CI Pipeline (5 jobs, all automatic on push):**
1. Security audit (trivy)
2. Test suite
3. Multi-arch binary build (Linux x64/arm64, macOS, Windows)
4. Docker image → `ghcr.io/bxthre3inc/agentic:latest`
5. Release → on git tag → GitHub Releases page with all artifacts

**Trigger build without Antigravity:**
```bash
gh workflow run "Build Agentic" --repo bxthre3inc/agentic
```

**Build targeting:**
```bash
gh workflow run "Build Agentic" --repo bxthre3inc/agentic \
  --field build_target=docker   # Docker only
```

**Release:**
```bash
git tag v1.0.0 && git push origin v1.0.0
```

---

## SOUND + MUSIC

- **Spotify** — connected (read/write). Use for ambient music during
  focused work, or automation triggers based on listening activity.
