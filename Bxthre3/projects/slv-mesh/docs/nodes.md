# SLV Mesh — Node Locations

## Network Overview
Meshtastic P2P mesh covering San Luis Valley, Colorado.
Monte Vista is the MVP focus. Full deployment spans Antonito (south) to South Fork (north).

---

## Node Registry

| ID | Location | Latitude | Longitude | Type | Tolerance Radius | Status |
|----|----------|----------|-----------|------|-----------------|--------|
| A | Antonito | 37.089° N | 106.010° W | Town Node | 2.5km | Planned |
| B | La Jara | 37.288° N | 106.075° W | Town Node | 2.5km | Planned |
| R1 | Alamosa N Rural | 37.452° N | 105.780° W | Relay | 3km | Planned |
| C | Alamosa (HUB) | 37.470° N | 105.870° W | Key Hub | 3km | Planned |
| R2 | MV/Alamosa Gap | 37.530° N | 105.860° W | Relay | 3km | Planned |
| D | Monte Vista (MVP) | 37.617° N | 106.148° W | Key Hub | 3km | Planned |
| R3 | E-W Cross | 37.635° N | 106.050° W | Relay | 2km | Planned |
| G | Sargent | 37.635° N | 106.360° W | Town Node | 2km | Planned |
| R4 | Alamosa-Sarg Gap | 37.550° N | 106.200° W | Relay | 2km | Planned |
| E | Del Norte | 37.680° N | 106.350° W | Town Hub | 2.5km | Planned |
| F | South Fork | 37.800° N | 106.640° W | Town Node | 2.5km | Planned |

---

## Tolerance Zones

Each node has a **tolerance zone** — a radius circle within which any suitable rooftop works.
You do not need the exact coordinate. Any rooftop within the tolerance zone maintains mesh connectivity.

**Tolerance zone radii:**
- Relay nodes: 2-3km (more flexible)
- Town nodes: 2-2.5km (stricter due to population density targeting)
- Key hubs (Alamosa, Monte Vista): 3km (largest town = more roof options)

---

## Ideal Roof Profile

**What we're looking for:**
- Single-story or two-story structure
- Metal or shingle roof (not clay tile — blocks 915MHz signal)
- Clear sightline to next nearest node (ideal but not required)
- Homeowner willing to let us run USB cable to porch/outlet
- Draws <5W (less than a WiFi router)

**What we offer:**
- Free install, no monthly fee
- Small weatherproof enclosure (~letter-size)
- Community safety network — works when cell towers fail
- Encrypted, private, no internet required

---

## Backbone Topology

```
Antonito (A)
    ↓
La Jara (B)
    ↓
[R1 Relay]
    ↓
Alamosa (C) ←→ [R4 Relay] ←→ Sargent (G)
    ↓
[R2 Relay]
    ↓
Monte Vista (D) ←→ [R3 Relay] ←→ Del Norte (E)
                                    ↓
                              South Fork (F)
```

**Hops from Monte Vista:**
- Alamosa: 1 hop (direct)
- Del Norte: 1 hop via R3
- La Jara: 3 hops
- Antonito: 4 hops
- South Fork: 2 hops
- Sargent: 1 hop

---

## Hardware Specs (Rooftop Gateway)

| Component | Option | Cost |
|-----------|--------|------|
| SBC | Raspberry Pi Zero 2 W | $25 |
| LoRa board | Meshtastic ESP32-S3 + LoRa | $30 |
| Antenna | 868/915MHz Yagi or omni (outdoor) | $20-40 |
| Enclosure | IP67 junction box | $10 |
| Power | PoE injector or USB | ~$5 |
| **Total** | | **$85-120** |

---

## Budget Scenarios

| Budget | Nodes Deployable | Coverage |
|--------|-----------------|----------|
| $500 | 4-5 nodes | MVP backbone (MV + 4 relays) |
| $1,000 | 9-10 nodes | Full MV + Alamosa + Del Norte |
| $2,500 | 20-25 nodes | Full SLV network |
