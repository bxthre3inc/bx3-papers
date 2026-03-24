# Research Report: Google AI Studio API for RAIN Integration

**Agent:** research  
**Date:** 2026-03-23  
**Task:** Google AI Studio API options for integrating with RAIN
**Status:** complete

---

## 1. Google AI Studio API Options

### Does AI Studio Have a Public API for Managing Prompts?

**No** — AI Studio itself does not expose a REST API for CRUD operations on prompts.

However, there are two relevant alternatives:

| Layer | Has API? | Purpose |
|---|---|---|
| **AI Studio UI** | ❌ No API | Browser-based prompt prototyping |
| **Gemini API (ai.google.dev)** | ✅ Yes | Direct programmatic calls with your prompts |
| **Vertex AI Prompt Management** | ✅ Yes | Enterprise-grade prompt versioning, stored in Google Cloud |

### Gemini API Integration Path for External Calls

**Yes, absolutely.** The Gemini API is the primary path for external programmatic access:

```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent
Auth:     ?key=YOUR_GOOGLE_API_KEY
```

**Getting an API key:**
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create an API key (free tier available)
3. Use it in requests to the Gemini API

**Language support:** Python, JavaScript, REST, Go, and more via the [Google Gen AI SDK](https://ai.google.dev/gemini-api/docs/libraries).

### Can We Call the RAIN Build Programmatically from Outside AI Studio?

**Yes — but with a key distinction:**

- AI Studio's "Build mode" generates React/TypeScript code you can export and self-host
- That exported code calls the **Gemini API directly** (with your API key embedded)
- So once you have the exported RAIN code, you can call it from anywhere — Zo Computer, another server, etc.

**Export path:** In AI Studio Build mode → Export → Download ZIP → Deploy on your own infrastructure

---

## 2. RAIN Build Location

### Current RAIN Deployment

Based on workspace files, RAIN is currently deployed on **Zo Space**, not Google AI Studio:

| Route | URL | Type |
|---|---|---|
| RAIN API | `https://brodiblanco.zo.space/rain` | API route |
| RAIN UI | `https://brodiblanco.zo.space/projects/rain` | Page route |

> ⚠️ **Note:** The daily-brief from 2026-03-23 flags: *"RAIN app at https://brodiblanco.zo.space/rain appears inaccessible"* — this may need verification/restoration.

### AI Studio RAIN Demo

The task references an "existing RAIN demo in Google AI Studio" — **no such deployment was found in the workspace.**

Possibilities:
1. The AI Studio build exists but is not tracked in the workspace git repo
2. The build was done in a separate Google account not connected to this workspace
3. The reference is to a planned (not yet built) demo

**Action required:** Confirm if a separate AI Studio RAIN build URL exists and share it so this report can be updated.

---

## 3. Integration Path Recommendation

### Best Way to Connect Zo Computer to the AI Studio RAIN Build

**Option A: Direct Gemini API (Recommended if re-building)**

If the goal is programmatic access to RAIN's logic from Zo Computer:

1. Get a Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Store it in Zo: [Settings → Advanced → Secrets](/?t=settings&s=advanced) as `GOOGLE_API_KEY`
3. Call the Gemini API directly from a Zo script/agent:

```python
import os, requests
api_key = os.environ["GOOGLE_API_KEY"]
response = requests.post(
    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
    json={"contents": [{"parts": [{"text": "Your RAIN query"}]}]}
)
```

**Option B: If AI Studio Build was exported and self-hosted**

- Deploy the exported RAIN build to Google Cloud Run (or any hosting)
- Call it as a standard HTTP API from Zo Computer
- No special AI Studio credentials needed — just the deployed service URL

### API Key Requirements

| Key | Where to Get | Cost |
|---|---|---|
| `GOOGLE_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Free tier available |

### Rate Limits and Costs (Gemini API)

**Free tier limits (per model varies):**

| Model | Free Input | Free Output | RPM (free) |
|---|---|---|---|
| Gemini 2.5 Flash | ✅ Free | ✅ Free | ~15 RPM |
| Gemini 2.5 Pro | ✅ Free | ✅ Free | ~2 RPM |
| Gemini 3.1 Flash-Lite | ✅ Free | ✅ Free | ~15 RPM |

**Paid tier (pay-as-you-go):**

| Model | Input $/1M tokens | Output $/1M tokens |
|---|---|---|
| Gemini 2.5 Flash | $0.30 | $2.50 |
| Gemini 2.5 Pro | $1.25–$2.50 | $10.00–$15.00 |
| Gemini 3.1 Flash-Lite | $0.075 | $0.30 |

**Tier upgrades:** Free → Tier 1 (add billing) → Tier 2 ($100 spend + 3 days) → Tier 3 ($1,000 spend + 30 days)

**Key rate limit dimensions:** RPM (requests/min), TPM (tokens/min), RPD (requests/day)

---

## 4. Summary & Recommendations

| Question | Finding |
|---|---|
| AI Studio public API for prompts? | ❌ No — use Gemini API directly |
| Gemini API integration path? | ✅ `generativelanguage.googleapis.com` with `GOOGLE_API_KEY` |
| Call RAIN build programmatically? | ✅ Yes — either via Gemini API or if exported, as HTTP service |
| RAIN build location? | Zo Space: `brodiblanco.zo.space/rain` (API) + `/projects/rain` (UI) |
| AI Studio demo found? | ❌ Not in workspace — needs confirmation |

### Immediate Actions

1. **Verify RAIN app accessibility** at `https://brodiblanco.zo.space/rain`
2. **Confirm AI Studio RAIN demo URL** — if it exists, share it to update this report
3. **If re-building:** Use direct Gemini API with a stored `GOOGLE_API_KEY` in Zo Settings
4. **If AI Studio build exists and is deployed:** Export it, self-host, call as HTTP from Zo

---

## Results

### Key Findings

1. **AI Studio does NOT have a public API** for managing prompts or builds — it's a UI-only tool
2. **Gemini API is the correct integration path** — direct REST access at `generativelanguage.googleapis.com`
3. **Two integration options for RAIN:**
   - **Option A:** Build RAIN-style logic using direct Gemini API calls from Zo (no AI Studio needed)
   - **Option B:** If an AI Studio "Build" was exported, deploy as HTTP service and call from Zo
4. **RAIN currently lives on Zo Space** at `/rain` and `/projects/rain` — not in AI Studio
5. **No AI Studio RAIN demo found** in workspace — requires confirmation if one exists elsewhere

### Recommended Path Forward

**For RAIN integration via Gemini API:**
1. Store `GOOGLE_API_KEY` in Zo Settings → Advanced → Secrets
2. Call `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}` with RAIN prompts
3. Use context caching for cost savings (up to 90% on large prompts)

**Status: complete** — No P0/P1 escalation needed.

---

*Research agent — auto-delete after 48 hours if not needed*
