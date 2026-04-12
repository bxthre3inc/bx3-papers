---
name: vpc-asset-generator
description: AI-powered asset generator for Valley Players Club Unity project. Creates 2D game assets, UI elements, textures, and sprite sheets for fish tables, slots, and casino interfaces. Outputs Unity-ready PNGs with transparency and proper naming conventions.
compatibility: Created for Zo Computer. Requires generate_image tool. Output assets are Unity-compatible PNGs.
metadata:
  author: brodiblanco.zo.computer
  version: 1.0.0
  project: Valley Players Club
allowed-tools: generate_image
---

# VPC Asset Generator

Generates casino/sweepstakes game assets for Unity import. All outputs are PNG with transparency, properly named for Unity Resources folder.

## Usage

### Generate Fish Assets
```bash
cd /home/workspace/Bxthre3/projects/the-valleyplayersclub-project
python3 Skills/vpc-asset-generator/scripts/generate-fish.py --rarity common --count 5
```

### Generate Slot Symbols
```bash
python3 Skills/vpc-asset-generator/scripts/generate-slots.py --theme classic
```

### Generate UI Elements
```bash
python3 Skills/vpc-asset-generator/scripts/generate-ui.py --type buttons --style neon
```

## Output Structure

Assets are saved to `unity-vpc/Assets/Resources/Generated/`:

```
Generated/
├── Fish/
│   ├── common_fish_01.png
│   ├── rare_fish_01.png
│   └── boss_dragon.png
├── Slots/
│   ├── symbol_7.png
│   ├── symbol_cherry.png
│   └── symbol_diamond.png
└── UI/
    ├── btn_spin.png
├── panel_lobby.png
    └── frame_gold.png
```

## Asset Types

| Category | Types | Unity Use |
|----------|-------|-----------|
| Fish | Common, Rare, Epic, Boss, Mini-game trigger | SpriteRenderer, UI Image |
| Slots | 7s, Bars, Fruits, Diamonds, Wild, Scatter | UI Image, Animation frames |
| UI | Buttons, Panels, Frames, Icons, Backgrounds | UI Canvas elements |
| Effects | Muzzle flash, Coin burst, Win glow | Particle textures |
| Table | Felt textures, Wood trim, Card faces | Material textures |

## Naming Convention

All assets follow Unity naming: `category_descriptor_variant.png`
- Lowercase with underscores
- No spaces
- Sequential numbering for variants

## Manual Generation

Use the `generate_image` tool directly with these optimized prompts:

### Fish Asset Prompt Template
```
Game asset: [rarity] fish for sweepstakes fish table game, [description], 
side profile view, vibrant colors, stylized casino art style, 
transparent background, isolated sprite, high contrast, 
2D game art, mobile game quality, single entity only
```

### Slot Symbol Prompt Template
```
Casino slot machine symbol: [symbol], [style] style, 
glossy 3D rendered look, gold accents, transparent background, 
perfect square aspect ratio, game asset, isolated
```

### UI Element Prompt Template
```
Casino game UI element: [type], [style] aesthetic, 
rounded corners, transparent background, 
2D game interface asset, mobile game UI, 
clean edges, isolated element
```

## Style Presets

| Preset | Description | Best For |
|--------|-------------|----------|
| neon | Cyberpunk, glowing edges | Modern appeal, younger players |
| classic | Vegas-style, gold/chrome | Traditional casino feel |
| underwater | Ocean blues, bubbles | Fish table immersion |
| luxury | Black/gold, premium feel | High-roller positioning |
| fun | Bright, cartoonish | Casual accessibility |

## Unity Import Settings

All generated assets should use these import settings:
- **Texture Type**: Sprite (2D and UI)
- **Sprite Mode**: Single
- **Packing Tag**: Fish / Slots / UI (for atlasing)
- **Filter Mode**: Point (pixel art) or Bilinear (smooth)
- **Compression**: PNG high quality
