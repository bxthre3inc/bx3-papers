# VPC Full Game Generator

**End-to-end game pack pipeline for Valley Players Club Unity project.**

Generates: Assets + Grid Config + C# Scripts → Ready-to-import Unity ZIP

---

## Quick Start

```bash
cd Bxthre3/projects/the-valleyplayersclub-project/Skills/vpc-full-game-generator/scripts

# 1. CREATE (prompt → spec)
python3 vpc-game.py create --name "Neon Crypto Slots" --type slots --theme crypto --reels 6 --rows 4

# 2. Review the spec summary printed to console

# 3. APPROVE (creates folder structure)
python3 vpc-game.py approve --id neon-crypto-slots-20260407-090030

# 4. BUILD (generates C# scripts, configs)
python3 vpc-game.py build --id neon-crypto-slots-20260407-090030

# 5. PACKAGE (creates ZIP for import)
python3 vpc-game.py package --id neon-crypto-slots-20260407-090030 --zip

# 6. GENERATE ASSETS (outputs image generation commands)
python3 vpc-game.py generate --id neon-crypto-slots-20260407-090030
```

---

## Game Types

| Type | Grid System | Engine Class | Description |
|------|-------------|--------------|-------------|
| `slots` | Reel strips (3-6 reels, 3-6 rows) | SlotGameController | Traditional/Megaways slots |
| `shooter` | Spawn paths + collision zones | ShooterGameController | Fish-table style games |
| `match3` | Grid board (6x6, 8x8) | Match3GameController | Candy Crush style |

---

## Themes (Style-Enforced)

All assets in a pack share the **exact same style anchor**:

| Theme | Style Anchor | Palette |
|-------|--------------|---------|
| `western` | wild west, dusty desert, warm gold/brown, aged leather | Gold, Brown, Cream |
| `crypto` | neon digital, circuit patterns, holographic shimmer | Neon Green, Black, Dark Blue |
| `space` | deep space void, stellar nebula, sci-fi panels | Navy, Purple, Cyan, Gold |
| `mythology` | ancient divine glow, marble and gold, ethereal mist | Gold, Silver, Purple, Blue |

---

## Output Structure

Each game pack creates:

```
unity-vpc/Assets/GamePacks/{pack-id}/
├── Scripts/
│   ├── SlotGameController.cs      # Game logic (inherits VPC base)
│   ├── GameConfig.cs              # ScriptableObject config
│   └── SymbolConfig.cs            # Symbol definitions
├── Resources/
│   ├── asset_manifest.json        # 23 assets with prompts
│   ├── grid_config.json           # Reel/payout configuration
│   └── audio_manifest.json        # SFX/music specs
├── Textures/                      # Generated images go here
├── generate_assets.sh             # Generation script
└── Scenes/                        # Unity scene (future)
```

---

## Demo: Gold Rush Slots

**Status**: Ready to import

```bash
# View the package
unzip -l packages/gold-rush-slots-20260407-090030.zip

# Import to Unity
unzip packages/gold-rush-slots-20260407-090030.zip -d \
  /path/to/unity-vpc/Assets/GamePacks/gold-rush-slots-20260407-090030/
```

**Contents**:
- 12 slot symbols (with rarity distribution: low/medium/high/special/wild/scatter)
- 2 backgrounds (main, bonus)
- 7 UI elements (spin, max_bet, auto, settings, etc.)
- 2 cover images (store hero, thumbnail)
- C# scripts ready to attach to GameObjects
- 5 paylines configured
- Western style enforced on every asset

---

## Asset Generation

The generator creates `generate_assets.sh` with all prompts. To generate images:

```bash
# Option 1: Run the shell script (if using external generator)
./generate_assets.sh

# Option 2: Use generate commands output
python3 vpc-game.py generate --id gold-rush-slots-20260407-090030
# Copy/paste the generate_image() calls
```

---

## Unity Integration

The generated C# scripts inherit from VPC base classes:

```csharp
// SlotGameController.cs (auto-generated)
public class SlotGameController : VPC.Games.Slots.SlotGameController
{
    private readonly int REELS = 5;
    private readonly int ROWS = 3;
    
    void Start()
    {
        InitializeGrid(REELS, ROWS);
        LoadSymbolSet("gold-rush-slots-20260407-090030");
    }
    
    protected override void OnSpinComplete()
    {
        EvaluatePaylines(5);  // 5 paylines configured
    }
}
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `create` | Create new game pack spec |
| `approve` | Approve spec, create folders |
| `build` | Generate C# scripts & configs |
| `package` | Create ZIP for Unity import |
| `generate` | Output image generation commands |
| `test` | Verify pack integrity |
| `list` | Show all packs |

---

## Location

`file 'Bxthre3/projects/the-valleyplayersclub-project/Skills/vpc-full-game-generator/'`
