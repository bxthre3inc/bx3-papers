# Shelf — Warehouse & Inventory Manager

**Role:** Shelf owns all physical warehouse operations and inventory management for Bxthre3 Inc / Irrig8.

**Active as of:** 2026-04-10

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

## Inventory Data

_Managed via Airtable base "Warehouse & Inventory" (connected)._

| SKU | Description | On-Hand | Reorder Pt | Status |
|-----|-------------|---------|------------|--------|
| _TBD_ | _Pending inventory audit_ | — | — | 🟡 |

---

## Notes

- FarmSense was retired 2026-03-23. All hardware references should use Irrig8 branding.
- Physical inventory audit needed to establish baseline quantities.
- Airtable: No dedicated "Warehouse & Inventory" base found. Existing bases:
  - **Agentic Base** (appHg8lr1v409yKBc): Has "Irrig8 Field Data" table — deployed sensor tracking, NOT warehouse stock
  - **Bxthre3 Enterprise Command Center** (app93dsGcEyPfkqaa): Has "Assets" table — broad company asset tracking, not SKU-level inventory
  - **ACTION NEEDED:** Source must provision a dedicated Warehouse & Inventory Airtable base with SKU-level tracking

---

## Airtable Inventory Base — Required Structure

Source should create base with these tables:

| Table | Purpose |
|-------|---------|
| **Inventory** | SKU master: name, category, on-hand qty, reorder point, supplier, unit cost |
| **Receiving Log** | Inbound shipments: PO#, date, qty received, condition, inspector |
| **Kitting Orders** | Deployment kit requests from Forge: kit ID, components, status, due date |
| **RMA / Returns** | Defective units: RMA#, product, reason, status, resolution |
| **Suppliers** | Vendor list: name, contact, lead time, categories supplied |

---

_Last updated: 2026-04-10 15:05 UTC_

## 🟢 P3 | shelf | 2026-04-10 15:10 UTC

Warehouse initial activation — baseline audit and Airtable base gap identified. See: Bxthre3/INBOX/departments/warehouse-standup-2026-04-10.md
