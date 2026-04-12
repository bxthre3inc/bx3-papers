# VPC Game Engine

Modular asset pipeline for Valley Players Club Unity project.

## Quick Commands

```bash
# Create new game pack
./engine.py create --name "Game Name" --type slots --theme western --reels 5 --rows 3 --symbols 10

# Approve (creates Unity structure)
./engine.py approve --id pack-id-from-create

# Generate asset prompts
./engine.py build --id pack-id

# Package for Unity import
./engine.py package --id pack-id
```

## Game Types

| Type | Params | Assets Generated |
|------|--------|------------------|
| `slots` | reels, rows, symbols | symbols, backgrounds, UI |
| `shooter` | cannons, bosses, waves | targets, cannons, backgrounds, UI |
| `match3` | grid, special | gems, effects, backgrounds, UI |
| `plinko` | pegs, buckets | ball, pegs, buckets, backgrounds, UI |

## Themes (9 Total)

- `western` - Wild West, 1800s vintage
- `crypto` - Neon cyberpunk, circuits
- `space` - Deep space, nebula
- `mythology` - Ancient divine, marble/gold
- `egypt` - Pyramids, pharaohs, scarabs
- `jungle` - Mayan temples, emerald canopy
- `candy` - Sugar rush, rainbow sprinkles
- `vampire` - Gothic, blood moon crimson
- `steampunk` - Brass gears, steam engines

## Style Enforcement

All assets in a pack share the **same style anchor** - forced into every prompt.

## Ready Game Packs

| Pack | Type | Theme | Assets | Status |
|------|------|-------|--------|--------|
| pharaohs-gold-egypt-20260407-100347 | slots | egypt | 14 symbols + 1 bg + 6 UI | ✓ Packaged |
| space-hunter-space-20260407-100346 | shooter | space | 15 targets + 4 cannons + 1 bg + 4 UI | ✓ Packaged |
| jungle-jewels-jungle-20260407-100346 | match3 | jungle | 8 gems + 5 effects + 1 bg + 4 UI | ✓ Packaged |
| crypto-drop-crypto-20260407-100347 | plinko | crypto | 1 ball + 16 pegs + 9 buckets + 1 bg + 3 UI | ✓ Packaged |

## Asset Generation

When you have credits, run the prompts in `.gen/` folder:

```bash
# Example: Generate one asset
generate_image --prompt "ancient egypt golden pharaoh mask, pyramids, game slot symbol, transparent background" --file_stem sym_00_pharaoh --output_dir unity-vpc/Assets/GamePacks/pharaohs-gold-egypt-20260407-100347/Textures

# Or batch via scripts in .gen/
```

## Unity Import

Drop any ZIP from `packages/` into Unity's `Assets/GamePacks/` folder. Each pack includes:
- `Scripts/GameController.cs` - Unity C# controller
- `manifest.json` - Asset manifest
- Empty `Textures/` folder for generated assets
- Empty `Audio/` folder for sound files
- Empty `Prefabs/` for Unity prefabs