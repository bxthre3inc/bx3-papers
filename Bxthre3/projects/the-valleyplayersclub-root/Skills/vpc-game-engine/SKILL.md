---
name: vpc-game-engine
description: Modular game asset and engine pipeline for Valley Players Club. Plugin-based architecture for game types, theme engines, grid systems, and validation. Outputs production-ready Unity packages with automated testing.
compatibility: Unity 2022.3 LTS, VPC Game Engine v7.0+
version: 2.0.0
---

# VPC Game Engine - Modular Asset Pipeline

## Architecture

```
vpc-game-engine/
├── modules/
│   ├── core/           # Game pack orchestration, validation
│   ├── assets/         # Asset generation, style anchors, manifests
│   ├── grid/           # Grid systems (reels, spawn paths, boards)
│   ├── engine/         # C# script generators, Unity integration
│   └── themes/         # Theme definitions, palettes, style anchors
├── templates/          # Game type blueprints (slots, shooter, match3)
├── tests/               # Automated validation tests
└── config/              # Global settings, defaults
```

## Plugin System

Game types are modular plugins. Add new game types without touching core code.