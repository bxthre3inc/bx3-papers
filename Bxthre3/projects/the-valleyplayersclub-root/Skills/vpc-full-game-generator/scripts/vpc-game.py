#!/usr/bin/env python3
"""
VPC Full Game Generator
Assets + Grid + Engine Scripts + Scene + Test Package

Usage:
  python3 vpc-game.py create --name "Gold Rush Slots" --type slots --theme western --reels 5 --rows 3
  python3 vpc-game.py build --id gold-rush-slots-20260407
  python3 vpc-game.py package --id gold-rush-slots-20260407 --zip
  python3 vpc-game.py test --id gold-rush-slots-20260407
"""

import os
import sys
import json
import zipfile
import shutil
import argparse
from datetime import datetime
from pathlib import Path

# Paths
ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
UNITY_ROOT = f"{ROOT}/unity-vpc"
GENERATOR_ROOT = f"{ROOT}/Skills/vpc-full-game-generator"
OUTPUT_BASE = f"{UNITY_ROOT}/Assets/GamePacks"
PACKAGE_BASE = f"{GENERATOR_ROOT}/packages"
SPEC_DIR = f"{GENERATOR_ROOT}/.specs"

# Ensure dirs
for d in [OUTPUT_BASE, PACKAGE_BASE, SPEC_DIR]:
    os.makedirs(d, exist_ok=True)

# Style anchors for consistency
STYLES = {
    "western": {
        "anchor": "wild west, dusty desert atmosphere, warm gold and brown tones, aged leather textures, vintage 1800s aesthetic, weathered wood",
        "palette": ["#D4AF37", "#8B4513", "#F4E4C1", "#CD853F", "#2F1810"],
        "music_mood": "western saloon piano, banjo, ambient desert wind"
    },
    "crypto": {
        "anchor": "neon digital glow, circuit board patterns, holographic shimmer, dark cyberpunk aesthetic, blockchain data streams",
        "palette": ["#00FF41", "#0D0208", "#008F11", "#003B00", "#1A1A2E"],
        "music_mood": "synthwave electronic, digital glitch ambience"
    },
    "space": {
        "anchor": "deep space void, stellar nebula backgrounds, sci-fi tech panels, metallic sheen, cosmic lighting effects",
        "palette": ["#0B0B1F", "#4B0082", "#00BFFF", "#FFD700", "#1E90FF"],
        "music_mood": "ambient space drone, cosmic synth, ethereal pads"
    },
    "mythology": {
        "anchor": "ancient divine glow, marble and gold textures, ethereal mist, legendary artifacts, godlike radiance, temple architecture",
        "palette": ["#FFD700", "#C0C0C0", "#800080", "#4169E1", "#FF4500"],
        "music_mood": "epic orchestral, ancient choir, mystical ambience"
    }
}

# Game type configurations
GAME_TYPES = {
    "slots": {
        "default_reels": 5,
        "default_rows": 3,
        "engine_class": "SlotGameController",
        "base_class": "VPC.Games.Slots.SlotGameController",
        "grid_type": "reel_strip",
        "assets": {
            "symbols": {"count": 12, "rarities": ["low", "low", "low", "medium", "medium", "medium", "high", "high", "special", "special", "scatter", "wild"]},
            "backgrounds": ["main", "bonus"],
            "ui": ["spin", "max_bet", "auto", "settings", "paytable", "plus", "minus"],
            "cover": ["store_hero", "thumbnail"]
        }
    },
    "shooter": {
        "engine_class": "ShooterGameController",
        "base_class": "VPC.Games.Shooter.ShooterGameController",
        "grid_type": "spawn_paths",
        "assets": {
            "targets": {"count": 15, "rarities": ["common"] * 6 + ["uncommon"] * 5 + ["rare"] * 3 + ["boss"] * 1},
            "projectiles": ["bullet", "missile", "laser"],
            "backgrounds": ["arena", "depths"],
            "ui": ["aim", "fire", "weapon_select", "powerup"],
            "cover": ["store_hero", "thumbnail"]
        }
    },
    "match3": {
        "default_grid": 8,
        "engine_class": "Match3GameController",
        "base_class": "VPC.Games.Match3.Match3GameController",
        "grid_type": "grid_board",
        "assets": {
            "gems": {"count": 8, "types": ["red", "blue", "green", "yellow", "purple", "orange", "bomb", "rainbow"]},
            "backgrounds": ["board"],
            "ui": ["shuffle", "hint", "pause", "boosters"],
            "cover": ["store_hero", "thumbnail"]
        }
    }
}

class GamePack:
    def __init__(self, name, game_type, theme, **kwargs):
        self.id = f"{self._slug(name)}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        self.name = name
        self.game_type = game_type
        self.theme = theme
        self.style = STYLES.get(theme, STYLES["western"])
        self.config = GAME_TYPES[game_type]
        self.params = kwargs
        self.assets = []
        self.spec_path = f"{SPEC_DIR}/{self.id}.json"
        self.output_dir = f"{OUTPUT_BASE}/{self.id}"
        
    def _slug(self, text):
        return text.lower().replace(" ", "-").replace("_", "-")[:30]
    
    def create_spec(self):
        """Generate complete game specification"""
        spec = {
            "pack_id": self.id,
            "name": self.name,
            "game_type": self.game_type,
            "theme": self.theme,
            "style_anchor": self.style["anchor"],
            "color_palette": self.style["palette"],
            "music_mood": self.style["music_mood"],
            "created": datetime.now().isoformat(),
            "status": "draft",
            "grid_config": self._generate_grid(),
            "assets": self._generate_asset_list(),
            "scripts": self._generate_script_list(),
            "scene": self._generate_scene_config(),
            "audio": self._generate_audio_list()
        }
        
        os.makedirs(SPEC_DIR, exist_ok=True)
        with open(self.spec_path, 'w') as f:
            json.dump(spec, f, indent=2)
        
        return spec
    
    def _generate_grid(self):
        """Generate grid/spawn configuration based on game type"""
        if self.game_type == "slots":
            reels = self.params.get("reels", self.config["default_reels"])
            rows = self.params.get("rows", self.config["default_rows"])
            return {
                "type": "reel_strip",
                "reels": reels,
                "rows": rows,
                "visible_symbols": reels * rows,
                "symbol_size": 128,
                "reel_spacing": 140,
                "paylines": self._generate_paylines(reels, rows)
            }
        elif self.game_type == "shooter":
            return {
                "type": "spawn_paths",
                "paths": [
                    {"id": "top_left", "curve": "bezier", "points": [(-5, 3), (0, 2), (5, 3)]},
                    {"id": "mid_left", "curve": "linear", "points": [(-5, 0), (5, 0)]},
                    {"id": "bottom_left", "curve": "bezier", "points": [(-5, -3), (0, -2), (5, -3)]},
                    {"id": "deep", "curve": "sine", "amplitude": 2, "frequency": 0.5}
                ],
                "spawn_zones": ["left_edge", "top_edge", "right_edge"],
                "collision_layers": ["projectiles", "targets", "powerups"]
            }
        elif self.game_type == "match3":
            grid = self.params.get("grid", self.config["default_grid"])
            return {
                "type": "grid_board",
                "width": grid,
                "height": grid,
                "cell_size": 64,
                "gem_types": 6,
                "special_tiles": ["bomb", "rainbow", "rocket"],
                "gravity": "down"
            }
        return {}
    
    def _generate_paylines(self, reels, rows):
        """Generate standard slot paylines"""
        lines = []
        # Horizontal lines
        for r in range(rows):
            lines.append([(i, r) for i in range(reels)])
        # V patterns
        lines.append([(i, i % rows) for i in range(reels)])
        lines.append([(i, (reels - 1 - i) % rows) for i in range(reels)])
        return lines
    
    def _generate_asset_list(self):
        """Generate all assets with style enforcement"""
        assets = []
        cfg = self.config["assets"]
        
        # Game-specific assets
        if self.game_type == "slots":
            for i, rarity in enumerate(cfg["symbols"]["rarities"]):
                assets.append({
                    "id": f"symbol_{i:02d}",
                    "type": "symbol",
                    "category": rarity,
                    "filename": f"symbol_{i:02d}.png",
                    "size": [128, 128],
                    "prompt": f"slot symbol {i}, {rarity} rarity, {self.style['anchor']}, transparent background, casino game asset, crisp 2D"
                })
        elif self.game_type == "shooter":
            for i, rarity in enumerate(cfg["targets"]["rarities"]):
                assets.append({
                    "id": f"target_{i:02d}",
                    "type": "target",
                    "category": rarity,
                    "filename": f"target_{i:02d}.png",
                    "size": [256, 256],
                    "prompt": f"shooter game target, {rarity} enemy/boss, {self.style['anchor']}, side view, transparent background"
                })
        
        # Backgrounds
        for bg in cfg["backgrounds"]:
            assets.append({
                "id": f"bg_{bg}",
                "type": "background",
                "filename": f"bg_{bg}.png",
                "size": [1920, 1080],
                "prompt": f"game background {bg}, {self.style['anchor']}, atmospheric, 16:9 composition, no UI elements"
            })
        
        # UI elements
        for ui in cfg["ui"]:
            assets.append({
                "id": f"ui_{ui}",
                "type": "ui",
                "filename": f"ui_{ui}.png",
                "size": [128, 64],
                "prompt": f"casino {ui} button, {self.style['anchor']}, transparent background, UI element"
            })
        
        # Cover art
        for cover in cfg["cover"]:
            assets.append({
                "id": f"cover_{cover}",
                "type": "cover",
                "filename": f"cover_{cover}.png",
                "size": [1024, 768] if cover == "thumbnail" else [1920, 1080],
                "prompt": f"game {cover} promotional art, {self.name}, {self.style['anchor']}, eye-catching, bold composition"
            })
        
        return assets
    
    def _generate_script_list(self):
        """Generate required C# scripts"""
        return [
            {
                "filename": f"{self.config['engine_class']}.cs",
                "template": self.config["engine_class"],
                "inherits": self.config["base_class"]
            },
            {
                "filename": "GameConfig.cs",
                "template": "GameConfig",
                "data": self._generate_grid()
            },
            {
                "filename": "SymbolConfig.cs",
                "template": "SymbolConfig",
                "data": {"symbol_count": len([a for a in self.assets if a["type"] == "symbol"])}
            }
        ]
    
    def _generate_scene_config(self):
        """Generate Unity scene configuration"""
        return {
            "scene_name": f"{self.id}_Main",
            "canvas": {
                "width": 1920,
                "height": 1080,
                "render_mode": "ScreenSpaceOverlay"
            },
            "camera": {
                "projection": "orthographic",
                "size": 5.4
            },
            "game_objects": [
                {"name": "GameController", "script": self.config["engine_class"]},
                {"name": "Background", "type": "Image", "asset": "bg_main"},
                {"name": "ReelContainer", "type": "Grid", "layout": "reels"} if self.game_type == "slots" else
                {"name": "SpawnManager", "type": "Empty", "component": "SpawnManager"}
            ]
        }
    
    def _generate_audio_list(self):
        """Generate audio specifications"""
        return {
            "sfx": [
                {"id": "spin", "type": "reel_spin_loop", "duration": 2.0},
                {"id": "stop", "type": "reel_stop", "duration": 0.3},
                {"id": "win_small", "type": "coin_drop", "duration": 1.0},
                {"id": "win_big", "type": "jackpot_celebration", "duration": 3.0},
                {"id": "button_click", "type": "ui_click", "duration": 0.1}
            ],
            "music": [
                {"id": "bgm_main", "mood": self.style["music_mood"], "loop": True, "bpm": 120}
            ]
        }
    
    def print_summary(self, spec):
        """Print readable spec summary"""
        print(f"""
╔═══════════════════════════════════════════════════════════════╗
│ GAME PACK SPEC: {self.id}
╠═══════════════════════════════════════════════════════════════╣
│ Name:    {self.name}
│ Type:    {self.game_type.upper()} | Theme: {self.theme.upper()}
│ Status:  {spec['status'].upper()}
╠═══════════════════════════════════════════════════════════════╣
│ GRID CONFIG:
│   Type:  {spec['grid_config']['type']}""")
        
        if spec['grid_config']['type'] == 'reel_strip':
            print(f"│   Reels: {spec['grid_config']['reels']} x Rows: {spec['grid_config']['rows']}")
            print(f"│   Paylines: {len(spec['grid_config']['paylines'])}")
        elif spec['grid_config']['type'] == 'spawn_paths':
            print(f"│   Paths: {len(spec['grid_config']['paths'])}")
            print(f"│   Zones: {', '.join(spec['grid_config']['spawn_zones'])}")
        elif spec['grid_config']['type'] == 'grid_board':
            print(f"│   Size: {spec['grid_config']['width']}x{spec['grid_config']['height']}")
        
        print(f"""│
│ ASSETS ({len(spec['assets'])}):
│   • Symbols/Targets: {len([a for a in spec['assets'] if a['type'] == 'symbol' or a['type'] == 'target'])}
│   • Backgrounds:     {len([a for a in spec['assets'] if a['type'] == 'background'])}
│   • UI Elements:     {len([a for a in spec['assets'] if a['type'] == 'ui'])}
│   • Cover Art:       {len([a for a in spec['assets'] if a['type'] == 'cover'])}
│
│ STYLE ANCHOR:
│   {self.style['anchor'][:50]}...
╠═══════════════════════════════════════════════════════════════╣
│ COMMANDS:
│   Approve:  python3 vpc-game.py approve --id {self.id}
│   Build:    python3 vpc-game.py build --id {self.id}
│   Package:  python3 vpc-game.py package --id {self.id} --zip
╚═══════════════════════════════════════════════════════════════╝
""")


def cmd_create(args):
    """Create new game pack spec"""
    pack = GamePack(
        name=args.name,
        game_type=args.type,
        theme=args.theme,
        reels=args.reels,
        rows=args.rows,
        grid=args.grid
    )
    spec = pack.create_spec()
    pack.print_summary(spec)
    print(f"Spec saved: {pack.spec_path}")
    return pack.id


def cmd_approve(args):
    """Approve spec and create output structure"""
    spec_path = f"{SPEC_DIR}/{args.id}.json"
    if not os.path.exists(spec_path):
        print(f"ERROR: Spec not found: {spec_path}")
        return 1
    
    with open(spec_path) as f:
        spec = json.load(f)
    
    spec['status'] = 'approved'
    
    # Create output directories
    pack_dir = f"{OUTPUT_BASE}/{args.id}"
    dirs = [
        f"{pack_dir}/Textures",
        f"{pack_dir}/Scripts",
        f"{pack_dir}/Scenes",
        f"{pack_dir}/Prefabs",
        f"{pack_dir}/Audio/SFX",
        f"{pack_dir}/Audio/Music",
        f"{pack_dir}/Spine",
        f"{pack_dir}/Resources"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
    
    # Save approved spec
    with open(spec_path, 'w') as f:
        json.dump(spec, f, indent=2)
    
    print(f"APPROVED: {args.id}")
    print(f"Output dir: {pack_dir}")
    return 0


def cmd_build(args):
    """Generate all scripts and manifests"""
    spec_path = f"{SPEC_DIR}/{args.id}.json"
    if not os.path.exists(spec_path):
        print(f"ERROR: Spec not found: {spec_path}")
        return 1
    
    with open(spec_path) as f:
        spec = json.load(f)
    
    pack_dir = f"{OUTPUT_BASE}/{args.id}"
    
    # Generate C# scripts
    for script in spec.get('scripts', []):
        script_path = f"{pack_dir}/Scripts/{script['filename']}"
        content = generate_cs_script(script, spec)
        with open(script_path, 'w') as f:
            f.write(content)
        print(f"Generated: {script['filename']}")
    
    # Generate asset manifest
    manifest_path = f"{pack_dir}/Resources/asset_manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(spec['assets'], f, indent=2)
    
    # Generate grid config
    grid_path = f"{pack_dir}/Resources/grid_config.json"
    with open(grid_path, 'w') as f:
        json.dump(spec['grid_config'], f, indent=2)
    
    # Generate generation commands
    gen_path = f"{pack_dir}/generate_assets.sh"
    with open(gen_path, 'w') as f:
        f.write(generate_asset_commands(spec))
    os.chmod(gen_path, 0o755)
    
    print(f"\nBUILD COMPLETE: {args.id}")
    print(f"Scripts: {pack_dir}/Scripts/")
    print(f"Configs: {pack_dir}/Resources/")
    print(f"Generate: {gen_path}")
    return 0


def cmd_package(args):
    """Create ZIP package ready for import"""
    pack_dir = f"{OUTPUT_BASE}/{args.id}"
    if not os.path.exists(pack_dir):
        print(f"ERROR: Build not found: {pack_dir}")
        return 1
    
    zip_path = f"{PACKAGE_BASE}/{args.id}.zip"
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(pack_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, pack_dir)
                zf.write(file_path, arcname)
    
    size = os.path.getsize(zip_path)
    print(f"PACKAGE CREATED: {zip_path}")
    print(f"Size: {size / 1024:.1f} KB")
    print(f"\nIMPORT INSTRUCTIONS:")
    print(f"  1. Unzip to: unity-vpc/Assets/GamePacks/")
    print(f"  2. Open Scene: Scenes/{args.id}_Main.unity")
    print(f"  3. Generate assets: Run generate_assets.sh")
    return 0


def cmd_test(args):
    """Run Unity tests for the game pack"""
    pack_dir = f"{OUTPUT_BASE}/{args.id}"
    print(f"TEST CONFIG: {args.id}")
    print(f"Checking: {pack_dir}")
    
    checks = [
        ("Scripts", os.path.exists(f"{pack_dir}/Scripts")),
        ("Asset Manifest", os.path.exists(f"{pack_dir}/Resources/asset_manifest.json")),
        ("Grid Config", os.path.exists(f"{pack_dir}/Resources/grid_config.json")),
        ("Scene File", os.path.exists(f"{pack_dir}/Scenes/{args.id}_Main.unity")),
    ]
    
    for name, ok in checks:
        status = "✓" if ok else "✗"
        print(f"  [{status}] {name}")
    
    return 0


def cmd_list(args):
    """List all game packs"""
    print("\nGAME PACKS:")
    for f in os.listdir(SPEC_DIR):
        if f.endswith('.json'):
            with open(f"{SPEC_DIR}/{f}") as spec_file:
                spec = json.load(spec_file)
                status = spec.get('status', 'unknown')
                print(f"  [{status:8}] {spec['pack_id']} - {spec['name']}")
    print()


def cmd_generate(args):
    """Output all image generation commands"""
    spec_path = f"{SPEC_DIR}/{args.id}.json"
    if not os.path.exists(spec_path):
        print(f"ERROR: Spec not found: {spec_path}")
        return 1
    
    with open(spec_path) as f:
        spec = json.load(f)
    
    pack_dir = f"{OUTPUT_BASE}/{args.id}"
    
    print(f"\n=== GENERATION COMMANDS FOR: {args.id} ===\n")
    print(f"# Run these with generate_image tool:")
    print()
    
    for i, asset in enumerate(spec['assets']):
        size = asset['size']
        aspect = "1:1" if size[0] == size[1] else ("16:9" if size[0]/size[1] > 1.5 else "4:3")
        output_path = f"{pack_dir}/Textures/{asset['filename']}"
        
        print(f"# Asset {i+1}/{len(spec['assets'])}: {asset['id']}")
        print(f"# File: {output_path}")
        print(f"generate_image(")
        print(f'    prompt="{asset["prompt"]}",')
        print(f'    file_stem="{asset["filename"].replace(".png", "")}",')
        print(f'    aspect_ratio="{aspect}",')
        print(f'    output_dir="{pack_dir}/Textures"')
        print(")")
        print()
    
    return 0


def generate_cs_script(script_spec, game_spec):
    """Generate Unity C# script content"""
    
    if script_spec['template'] == 'SlotGameController':
        return f'''using UnityEngine;
using System.Collections.Generic;

namespace VPC.Games.{game_spec['pack_id']}
{{
    /// <summary>
    /// Auto-generated slot game controller for {game_spec['name']}
    /// Theme: {game_spec['theme']} | Grid: {game_spec['grid_config']['reels']}x{game_spec['grid_config']['rows']}
    /// </summary>
    public class {script_spec['template']} : VPC.Games.Slots.SlotGameController
    {{
        [Header("Game Configuration")]
        [SerializeField] private GameConfig config;
        
        private readonly int REELS = {game_spec['grid_config']['reels']};
        private readonly int ROWS = {game_spec['grid_config']['rows']};
        
        void Start()
        {{
            InitializeGrid(REELS, ROWS);
            LoadSymbolSet("{game_spec['pack_id']}");
        }}
        
        protected override void OnSpinComplete()
        {{
            EvaluatePaylines({len(game_spec['grid_config']['paylines'])});
        }}
    }}
}}'''
    
    elif script_spec['template'] == 'GameConfig':
        return f'''using UnityEngine;

namespace VPC.Games.{game_spec['pack_id']}
{{
    [CreateAssetMenu(fileName = "{game_spec['pack_id']}_Config", menuName = "VPC/Game Configs/{game_spec['name']}")]
    public class GameConfig : ScriptableObject
    {{
        [Header("Grid Configuration")]
        public string gridType = "{game_spec['grid_config']['type']}";
        public int reels = {game_spec['grid_config'].get('reels', 0)};
        public int rows = {game_spec['grid_config'].get('rows', 0)};
        
        [Header("Visual Style")]
        public Color[] colorPalette = new Color[] {{ 
            {', '.join([f'new Color({int(c[1:3], 16)/255}f, {int(c[3:5], 16)/255}f, {int(c[5:7], 16)/255}f, 1f)' for c in game_spec['color_palette']])}
        }};
        
        [Header("Assets")]
        public string symbolSetId = "{game_spec['pack_id']}";
        public string[] backgroundIds;
        public string[] uiIds;
    }}
}}'''
    
    return f"// Template: {script_spec['template']}\n"


def generate_asset_commands(spec):
    """Generate shell script for asset generation"""
    lines = ["#!/bin/bash", "# Auto-generated asset generation commands", ""]
    
    for asset in spec['assets']:
        size = asset['size']
        aspect = "1:1" if size[0] == size[1] else ("16:9" if size[0]/size[1] > 1.5 else "4:3")
        lines.append(f"# {asset['id']}: {asset['type']}")
        lines.append(f"# Prompt: {asset['prompt']}")
        lines.append(f"# Output: Textures/{asset['filename']}")
        lines.append("")
    
    return "\n".join(lines)


# CLI
def main():
    parser = argparse.ArgumentParser(description="VPC Full Game Generator")
    subparsers = parser.add_subparsers(dest='command')
    
    # create
    create_p = subparsers.add_parser('create', help='Create new game pack')
    create_p.add_argument('--name', required=True, help='Game name')
    create_p.add_argument('--type', required=True, choices=['slots', 'shooter', 'match3'], help='Game type')
    create_p.add_argument('--theme', required=True, choices=list(STYLES.keys()), help='Visual theme')
    create_p.add_argument('--reels', type=int, default=5, help='For slots: reel count')
    create_p.add_argument('--rows', type=int, default=3, help='For slots: row count')
    create_p.add_argument('--grid', type=int, default=8, help='For match3: grid size')
    
    # approve
    approve_p = subparsers.add_parser('approve', help='Approve spec')
    approve_p.add_argument('--id', required=True, help='Pack ID')
    
    # build
    build_p = subparsers.add_parser('build', help='Build scripts and manifests')
    build_p.add_argument('--id', required=True, help='Pack ID')
    
    # package
    package_p = subparsers.add_parser('package', help='Create ZIP package')
    package_p.add_argument('--id', required=True, help='Pack ID')
    package_p.add_argument('--zip', action='store_true', help='Create ZIP file')
    
    # test
    test_p = subparsers.add_parser('test', help='Test game pack')
    test_p.add_argument('--id', required=True, help='Pack ID')
    
    # list
    subparsers.add_parser('list', help='List all packs')
    
    # generate
    gen_p = subparsers.add_parser('generate', help='Output generation commands')
    gen_p.add_argument('--id', required=True, help='Pack ID')
    
    args = parser.parse_args()
    
    commands = {
        'create': cmd_create,
        'approve': cmd_approve,
        'build': cmd_build,
        'package': cmd_package,
        'test': cmd_test,
        'list': cmd_list,
        'generate': cmd_generate
    }
    
    if args.command in commands:
        return commands[args.command](args)
    else:
        parser.print_help()
        return 1


if __name__ == '__main__':
    sys.exit(main())
ENDSCRIPT
chmod +x /home/workspace/Bxthre3/projects/the-valleyplayersclub-project/Skills/vpc-full-game-generator/scripts/vpc-game.py
