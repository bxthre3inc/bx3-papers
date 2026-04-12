# BLUE OCEAN: ARID-LAND ETHANOL CI
**Build Fast / Let Competition Bid — Execution Plan**  
**Date:** 2026-03-23  
**Status:** 🔵 BLUE OCEAN — CONFIRMED  
**Score:** 74/100

---

## THE STRATEGY

**Build vs. Sell:** Build a minimal defensible asset, then run a competitive process among acquirers.

The goal is NOT to become the dominant 45Z CI platform. It's to build something:
1. That ethanol plants or incumbents **cannot replicate** (data moat)
2. That creates **bidding tension** between 2+ acquirers
3. With **minimal ongoing HITL** once live

---

## WHAT TO BUILD (MINIMUM)

### Core Module: "Arid CI Scoring Engine"
**Inputs (already in Irrig8 stack):**
- Satellite imagery (NDVI, evapotranspiration)
- On-ground sensor suite (soil moisture, pump energy draw)
- Neighboring system data (local weather, regional water table)
- Public APIs (USDA, grid emissions intensity by ZIP)

**Output:** Farm-gate CI score per field, GREET-compliant

**What doesn't exist:** No one has multi-source irrigation-energy CI data for arid land. This is the moat.

### Not in scope for MVP:
- Full 45Z compliance workflow
- Farmer-facing app
- Ethanol plant dashboard (yet)
- Carbon credit trading

---

## LIGHTNING BUILD SEQUENCE

| Week | Action | Owner | Output |
|---|---|---|---|
| 1 | Map GREET inputs → Irrig8 data fields | Agentic (Blueprint) | Data mapping doc |
| 2 | Build CI scoring layer on existing pipeline | Agentic (Engineering) | API endpoint: `/ci-score/{field_id}` |
| 3 | Pull 3 years historical SLV sensor data → generate CI scores | Agentic (Data) | Historical CI dataset |
| 4 | Validate with 1 agronomist (remote, per-diem) | Human | GREET validation memo |
| 5 | Approach 1 ethanol plant with pilot proposal | Human (brodiblanco) | Signed LOI or pilot agreement |
| 6 | Run pilot + generate real CI report | Agentic + Human | Pilot report with real numbers |
| 7–8 | Approach 2nd ethanol plant + approach 1 incumbent | Human | Competitive tension established |

**Total to first revenue:** 8 weeks  
**Total to bidding process:** 12–14 weeks

---

## THE BIDDING PLAY

### Acquirers / Licensees (ranked by likely interest)

| Party | Why they'd want it | Urgency |
|---|---|---|
| **BASF Circalo** | Need arid-land data to complete national coverage | HIGH — just launched |
| **Verity** | Data layer to compete with BASF; Irrig8 = irrigation expertise they lack | HIGH |
| **POET** | Vertical integration; own the CI data rather than buy from BASF | MEDIUM |
| **Green Plains** | Same as POET; Nebraska operations align with arid-land thesis | MEDIUM |
| **Syngenta / Corteva** | Embed in dealer network; sell to farmers as "CI-ready" | LOW-MEDIUM |

### How to create bidding tension

**Step 1 — Build 1 pilot with real data**  
One signed pilot with an ethanol plant + real CI scores = proof it works.

**Step 2 — Seed the market quietly**  
Let it be known (via agronomist network, ethanol industry conferences, not PR) that Irrig8 has arid-land CI data.

**Step 3 — Contact BASF AND Verity in same 2-week window**  
Don't reveal you contacted the other. Neither will want the other to have it.

**Step 4 — Run a structured process**  
Brief email to each: "We have a proprietary arid-land CI scoring engine covering [X] acres in [region]. We are exploring strategic options. Are you interested in a conversation this week?"

**Step 5 — Let them bid**  
Whoever offers better terms (acquisition, licensing, partnership) wins.

---

## IP PROTECTION (CRITICAL BEFORE OUTREACH)

Before any outreach:
1. **Document the methodology** — How Irrig8 maps irrigation energy to GREET CI. This is the IP.
2. **Do NOT publish** — Keep the arid-land CI mapping proprietary.
3. **Consider provisional patent** — One-page filing on "Method for field-level carbon intensity scoring using multi-source irrigation energy data in arid regions." ~$5K external cost, Agentic can draft.

**Why:** Incumbents will try to replicate rather than buy. IP makes them **have to** come to the table.

---

## HITL COST (TO KEEP MINIMAL)

| Task | HITL Required | Can Agentic Reduce? |
|---|---|---|
| GREET methodology mapping | 1 agronomist (5 hrs) | Partial — Agentic does data mapping, human validates |
| Pilot LOI / negotiation | brodiblanco (2 hrs/wk) | Partial — Agentic drafts, human signs |
| CI report generation | 0 (fully automated) | Yes — fully automated |
| Acquirer outreach | brodiblanco | No — human required |
| IP filing | External attorney | Partial — Agentic prepares, attorney finalizes |

---

## RISK FACTORS

| Risk | Probability | Mitigation |
|---|---|---|
| Incumbent replicates before we sell | Medium | Move fast; IP protection first |
| Ethanol plant unresponsive | Medium | Target 3 plants simultaneously |
| GREET methodology challenge | Low | Validate with agronomist before pitching |
| BASF locks all ethanol plants first | Medium | Target plants in CO/NE only (BASF less dense there) |

---

## WHAT WE DON'T BUILD

- Farmer-facing app
- Carbon credit registry
- Compliance workflow software
- Grain trading platform

**Rationale:** These are high-HITL, high-competition, off-target. The CI scoring layer is the only thing competitors can't replicate quickly.

---

## SUCCESS METRICS (12 WEEKS)

- [ ] GREET-compliant CI scoring API live
- [ ] 1 ethanol plant signed to pilot
- [ ] 2 acres of historical SLV data → CI scores generated
- [ ] 2 acquirers contacted (BASF + Verity)
- [ ] IP protection filed (provisional patent)
