# VPC Multimedia Asset Generator

**Location**: `file 'Bxthre3/projects/the-valleyplayersclub-project/Skills/vpc-multimedia-asset-generator/'`

## What It Does

Prompt → Spec Review → Approval → Batch Asset Generation with **Forced Style Matching**

### Workflow

```bash
# 1. Propose a new asset pack
python3 scripts/vpc-assets.py propose \
  --prompt "wild west gold rush with bandits" \
  --theme western \
  --symbol-count 12

# 2. Review the generated spec (shows counts, style anchor, palette)
python3 scripts/vpc-assets.py status --spec-id western-20260407-001

# 3. Approve to generate manifest
python3 scripts/vpc-assets.py approve --spec-id western-20260407-001

# 4. Generate all assets (outputs commands for generate_image tool)
python3 scripts/vpc-assets.py generate --spec-id western-20260407-001
```

## Style Enforcement

Every asset in a pack shares the **Style Anchor** - a forced style descriptor applied to all prompts:

| Theme | Style Anchor |
|-------|--------------|
| western | wild west, dusty desert, warm gold and brown tones, aged leather textures |
| crypto | neon digital glow, circuit patterns, holographic shimmer, dark cyberpunk |
| space | deep space void, stellar nebula, sci-fi tech panels, cosmic lighting |
| mythology | ancient divine glow, marble and gold, ethereal mist, legendary artifacts |

## Generated Assets Per Pack

| Category | Items | Unity Path |
|----------|-------|------------|
| **Symbols** | 10-12 | `Symbols/symbol_[name].png` |
| **Backgrounds** | 4 | `Backgrounds/bg_[name].png` (1920x1080) |
| **UI Kit** | 14 | `UI/buttons/`, `UI/icons/`, `UI/frames/` |
| **Spine Characters** | 2 | `Spine/` (with animation specs) |
| **Audio Specs** | 8 | Manifest only (use external tools) |
| **Cover Images** | 2 | `Cover/` (store + app icon) |

## Example Output Structure

```
unity-vpc/Assets/Resources/Generated/western-20260407-001/
├── _generation_manifest.json    # All prompts + metadata
├── _unity_import.md            # Import instructions
├── Symbols/
│   ├── symbol_golden_nugget.png
│   ├── symbol_dynamite.png
│   ├── symbol_revolver.png
│   └── ...
├── Backgrounds/
│   ├── bg_main_game.png        # 1920x1080
│   ├── bg_bonus.png
│   ├── bg_lobby.png
│   └── bg_free_spins.png
├── UI/
│   ├── buttons/btn_spin.png
│   ├── buttons/btn_max_bet.png
│   ├── frames/frame_main.png
│   └── icons/icon_coin.png
└── Spine/
    ├── spine_bandit.png        # Character sprite
    └── spine_prospector.png
```

## Free 3D Asset Sources

| Source | Type | Cost | Quality |
|--------|------|------|---------|
| **Unity Asset Store** | Slots, casinos, coins | $$ | Pro |
| **RetroStyle Westworld** | Western slot pack | Free (Discord L5) | Good |
| **Mixamo** | Character animations | Free | Pro |
| **Kenney.nl** | UI, icons, coins | Free | Simple |

## Integration with 3D Designer Agents

The audio/3D specs in `_generation_manifest.json` can be passed to specialist agents:

```json
{
  "spine_characters": [{
    "name": "bandit",
    "prompt": "masked bandit...",
    "animations": ["idle", "win", "celebrate"],
    "spine_json": "bandit_skeleton.json"
  }],
  "audio": {
    "bgm": { "lobby": "western_rock_120bpm" },
    "sfx": { "spin": "mechanical_reel.wav" }
  }
}
```

## Status

- [x] Spec generation workflow
- [x] Style anchor enforcement
- [x] Batch manifest generation
- [x] Unity import paths
- [ ] Fix theme detection bug (use --theme explicit for now)
- [ ] Auto-generate images via API
