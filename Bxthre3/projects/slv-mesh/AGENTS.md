# SLV Mesh — Project AGENTS

## Overview
Free off-grid text comms network for San Luis Valley, Colorado using LoRa mesh (Meshtastic).
Goal: Reliable encrypted text messaging between towns without internet or cell service.

## Status
**Planning** — Not yet deployed.

## Architecture
- **Protocol**: Meshtastic (LoRa mesh, ESP32 + 915MHz radio)
- **Topology**: P2P mesh with relay nodes
- **No ongoing costs** — hardware only ($85-120/node rooftop gateway)

## Node Locations
MVP focus: Monte Vista + surrounding 5-node backbone (Alamosa ↔ Del Norte ↔ South Fork + Sargent branch)

Full network: 11 planned nodes across SLV (see `docs/nodes.md`)

## Budget
$2,500 target for MVP (20-25 nodes)

## Key Files
- `docs/nodes.md` — GPS coordinates and tolerance radii for all planned nodes
- `docs/roof-host-pitch.md` — One-pager for recruiting rooftop hosts
- `assets/slv_mesh_nodes.png` — Visual map of node locations and coverage
- `nodes/nodes.csv` — Node data in spreadsheet format

## Next Steps
1. Drive Monte Vista area, identify roof hosts in tolerance zones
2. Source hardware (ESP32 + LoRa + antennas)
3. Flash Meshtastic firmware
4. Deploy first 3-5 nodes as proof-of-concept
