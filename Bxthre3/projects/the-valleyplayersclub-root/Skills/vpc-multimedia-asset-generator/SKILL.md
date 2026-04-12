---
name: vpc-multimedia-asset-generator
description: Comprehensive multimedia asset pipeline for Valley Players Club. Batches 2D game symbols, backgrounds, UI kits, Spine animation specs, audio asset lists, cover images, and sprite sheets. Generates Unity-ready asset manifests and import instructions.
compatibility: Created for Zo Computer. Generates image prompts, audio asset specs, Spine JSON configs, and Unity import manifests. Works with generate_image tool and external audio/animation tools.
metadata:
  author: brodiblanco.zo.computer
  version: 1.0.0
  project: Valley Players Club
  unity_version: 2022.3 LTS
allowed-tools: generate_image
---

# VPC Multimedia Asset Generator

Complete asset pipeline for sweepstakes casino games. Generates:
- **2D Game Symbols** (slot reels, shootable enemies, collectibles)
- **Backgrounds** (game rooms, parallax layers, lobby screens)
- **UI Kits** (frames, buttons, panels, progress bars)
- **Spine Animation Specs** (skeletal animation configs, atlas packing lists)
- **Audio Asset Lists** (SFX descriptors, music loop specs, voiceover spots)
- **Cover/Promo Images** (app store art, social media, loading screens)
- **Sprite Sheets** (packed atlases, animation strips)

## Themes Supported
- western (gold rush, bandits, desert)
- crypto (coins, wallets, blockchain)
- space (asteroids, aliens, sci-fi)
- classic (fruits, 7s, bars, diamonds)
- fantasy (dragons, magic, treasure)
- underwater (fish, coral, treasure) -- legacy

## Usage

```bash
cd /home/workspace/Bxthre3/projects/the-valleyplayersclub-project

# Generate complete asset pack for a theme
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-full-pack.py --theme western --size full

# Generate specific asset types
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-symbols.py --theme crypto --count 12
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-ui-kit.py --theme western --style neon
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-audio-specs.py --theme western --type all
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-spine-specs.py --theme western --character bandit
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-backgrounds.py --theme space --count 5

# Generate marketing/promo assets
python3 Skills/vpc-multimedia-asset-generator/scripts/generate-promo.py --theme western --type app-store
```

## Output Structure

```
unity-vpc/Assets/Resources/Generated/
├── {theme}/
│   ├── Symbols/           # 2D game symbols (PNG, 512x512)
│   ├── Backgrounds/       # Background layers (PNG, various sizes)
│   ├── UI/                # UI elements (PNG, 9-slice ready)
│   ├── Spine/             # Spine animation specs (JSON)
│   ├── Audio/             # Audio asset lists (JSON specs)
│   └── Promo/             # Marketing images (PNG, various sizes)
└── manifest.json          # Unity import manifest
```

## Unity Import

All generated assets include:
- Naming conventions (prefix: VPC_{theme}_{type}_{name})
- Texture import settings (PNG, alpha, point filter for pixel art)
- Sprite slicing data (for atlases)
- 9-slice coordinates (for UI frames)
- Spine runtime compatibility specs

See `IMPORT-GUIDE.md` for Unity import instructions.