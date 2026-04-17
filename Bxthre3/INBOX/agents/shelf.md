# Shelf — Warehouse & Inventory Manager

**Role:** Shelf owns all physical warehouse operations and inventory management for Bxthre3 Inc / Irrig8.

**Active as of:** 2026-04-16 8:15 AM MT

**Reports to:** Source (Supply Chain), Atlas (COO)

---

## Scope

### Product Lines
| Line | Items |
|------|-------|
| **Irrig8 Hardware** | Sensor nodes, VFA anchors, LRZB relays, PMT power units, cables, connectors, enclosures |
| **Valley Players Club** | Physical hardware for casino deployments |
| **Zoe / Bxthre3** | Developer kits, branded hardware, merchandise |
| **Corporate** | Event materials, trade show booth equipment |

---

## Key Activities

- **Inventory tracking & cycle counts** — maintain accurate on-hand quantities
- **Reorder point management** — trigger procurement when stock hits reorder thresholds
- **Receiving & quality inspection** — verify inbound shipments
- **Kitting & fulfillment** — assemble deployment kits for Forge (Field Ops)
- **Returns & RMA processing** — handle defective returns
- **Coordinate with Forge** — deployment kit readiness
- **Coordinate with Source** — supplier management, purchase orders

---

## Daily Cadence

- **8:15 AM** — Warehouse standup (internal)
- Ad-hoc coordination with Source and Forge throughout the day

---

## Status Definitions

| Level | Meaning |
|-------|---------|
| 🟢 Healthy | Stock above reorder point, no issues |
| 🟡 Low | Stock below reorder point, procurement pending |
| 🔴 Critical | Stockout risk or zero on-hand for active SKUs |

---

## Current Status — 2026-04-16

### 🟡 Inventory Baseline
- No physical inventory audit conducted — all SKU counts are TBD
- Cannot fulfill Forge kitting requests without baseline quantities
- Airtable "Warehouse & Inventory" base **confirmed NOT provisioned** — scan of both available Airtable bases shows no warehouse/inventory table

### 🔴 P1 — G2E 2026 Hardware (POST-EVENT)
- G2E was **2026-04-15** — event has passed
- Demo hardware status **UNKNOWN** — no confirmation received on what was sourced or deployed
- **Action:** Request Source post-event debrief — what hardware was used, what needs returning
- **Risk:** Unresolved = untracked inventory, potential shrinkage

### 🟡 P2 — VPC Node Hardware (BLOCKED)
- Blocked pending WY LLC formation — no warehouse action until resolved
- **Owner:** Raj (Legal)

### 🟡 P2 — Farm Pipeline (ON HOLD)
- Forge cannot confirm deployment kit requirements until farm intake pipeline defined
- **Owner:** Atlas + Forge

---

## Inventory Data

_Managed via Airtable base "Warehouse & Inventory" (NOT YET PROVISIONED — gap flagged to Source)._

| SKU | Description | On-Hand | Reorder Pt | Status |
|-----|-------------|---------|------------|--------|
| — | Pending inventory audit | — | — | 🟡 |

---

## Open Hand-offs

| To | Item | Priority | Status |
|----|------|----------|--------|
| **Source** | G2E post-event hardware debrief | 🔴 P1 | Needs response |
| **Source** | Airtable "Warehouse & Inventory" base provisioning | 🟡 P2 | Pending |
| **Forge** | Deployment kit readiness | 🟡 P2 | On hold (pipeline TBD) |
| **Raj** | WY LLC formation status | 🟡 P2 | Monitoring |

---

## Airtable Gap Analysis

Scanned via Airtable API — 2 bases found:

| Base | Tables | Warehouse Coverage? |
|------|--------|-------------------|
| **AgentOS Base** (appHg8lr1v409yKBc) | "Irrig8 Field Data" table | ❌ Sensor deployment tracking, NOT warehouse stock |
| **Bxthre3 Enterprise Command Center** (app93dsGcEyPfkqaa) | "Assets" table | ❌ Company asset tracking, NOT SKU-level inventory |

**Required:** Source provisions dedicated "Warehouse & Inventory" Airtable base with tables:
- Inventory (SKU master)
- Receiving Log
- Kitting Orders
- RMA / Returns
- Suppliers

---

## Notes

- FarmSense retired 2026-03-23. All hardware references use Irrig8 branding.
- G2E 2026 is now concluded — hardware return/inventory close-out is immediate priority.

---

*Last updated: 2026-04-16 8:15 AM MT*
