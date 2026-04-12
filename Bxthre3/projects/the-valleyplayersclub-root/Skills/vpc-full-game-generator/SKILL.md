---
name: vpc-full-game-generator
description: Complete game pack generator for Valley Players Club. Generates assets + Unity C# scripts + grid configurations + builds testable game scenes. Outputs ZIP ready to drop into unity-vpc/Assets.
compatibility: Unity 2022.3 LTS, VPC Game Engine v7.0.0+
metadata:
  author: brodiblanco.zo.computer
  version: 2.0.0
---

# VPC Full Game Generator

## Capabilities

- **Asset Generation**: 2D symbols, backgrounds, UI, Spine configs
- **Grid Systems**: Slot reels, shooter spawn paths, match-3 boards
- **Game Engines**: Auto-generates C# controllers using VPC base classes
- **Scene Building**: Creates Unity scene files with proper setup
- **Test Package**: ZIP output ready to import into unity-vpc

## Game Types

| Type | Grid | Engine Class | Description |
|------|------|-------------|-------------|
| `slots` | Reel strips (3-6 reels, 3-6 rows) | SlotGameController | Traditional/Megaways |
| `shooter` | Spawn paths + collision zones | ShooterGameController | Fish-table style |
| `match3` | Grid board (6x6, 8x8) | Match3GameController | Candy Crush style |
| `plinko` | Pyramid peg grid | PlinkoGameController | Ball drop game |