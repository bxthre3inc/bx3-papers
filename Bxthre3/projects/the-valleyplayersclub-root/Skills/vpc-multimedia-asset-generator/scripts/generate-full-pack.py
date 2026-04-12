#!/usr/bin/env python3
"""
VPC Multimedia Asset Generator - Full Pack Generator
Orchestrates complete asset pack generation for a theme
"""

import os
import sys
import json
import argparse
from datetime import datetime

PROJECT_ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
OUTPUT_BASE = f"{PROJECT_ROOT}/unity-vpc/Assets/Resources/Generated"

THEME_CONFIGS = {
    "western": {
        "name": "Gold Rush Western",
        "description": "Wild west gold rush theme with bandits, prospectors, and desert wildlife",
        "color_palette": ["#D4AF37", "#8B4513", "#CD853F", "#F4A460", "#2F1810"],
        "symbol_count": 12,
        "background_count": 4,
        "ui_style": "rustic_metal",
        "spine_characters": ["bandit", "prospector", "sheriff"],
        "audio_mood": "western_rock"
    },
    "crypto": {
        "name": "Crypto Casino",
        "description": "Cryptocurrency and blockchain theme with coins, wallets, and digital aesthetics",
        "color_palette": ["#00D084", "#1A1A2E", "#16213E", "#0F3460", "#E94560"],
        "symbol_count": 12,
        "background_count": 3,
        "ui_style": "neon_glass",
        "spine_characters": ["bitcoin_whale", "hodler", "trader"],
        "audio_mood": "synthwave_electronic"
    },
    "space": {
        "name": "Asteroid Mining",
        "description": "Space mining theme with asteroids, aliens, and sci-fi equipment",
        "color_palette": ["#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560"],
        "symbol_count": 12,
        "background_count": 4,
        "ui_style": "holo_tech",
        "spine_characters": ["alien_miner", "robot", "pilot"],
        "audio_mood": "sci_fi_ambient"
    },
    "classic": {
        "name": "Vegas Classic",
        "description": "Traditional casino theme with fruits, 7s, bars, and diamonds",
        "color_palette": ["#FF0000", "#FFD700", "#00FF00", "#0000FF", "#FFFFFF"],
        "symbol_count": 10,
        "background_count": 3,
        "ui_style": "chrome_luxury",
        "spine_characters": ["dealer"],
        "audio_mood": "jazz_lounge"
    },
    "fantasy": {
        "name": "Dragon's Treasure",
        "description": "High fantasy theme with dragons, wizards, and magical artifacts",
        "color_palette": ["#4A0E4E", "#812B8C", "#FF6B9D", "#C44569", "#F8B500"],
        "symbol_count": 14,
        "background_count": 4,
        "ui_style": "gold_mystic",
        "spine_characters": ["dragon", "wizard", "knight", "treasure_guardian"],
        "audio_mood": "epic_orchestral"
    }
}

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def generate_manifest(theme, output_dir, assets_generated):
    """Generate Unity import manifest"""
    manifest = {
        "vpc_asset_pack": {
            "version": "1.0.0",
            "theme": theme,
            "theme_name": THEME_CONFIGS[theme]["name"],
            "generated_at": datetime.now().isoformat(),
            "total_assets": len(assets_generated),
            "assets": assets_generated,
            "import_settings": {
                "texture_type": "Sprite (2D and UI)",
                "sprite_mode": "Single",
                "filter_mode": "Point",
                "compression": "None",
                "generate_mipmaps": False,
                "packing_tag": f"VPC_{theme.upper()}"
            }
        }
    }
    
    manifest_path = os.path.join(output_dir, "manifest.json")
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    return manifest_path

def run_sub_generator(script_name, theme, args):
    """Execute a sub-generator script"""
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    if os.path.exists(script_path):
        cmd = f"python3 {script_path} --theme {theme} {args}"
        os.system(cmd)

def main():
    parser = argparse.ArgumentParser(description="Generate complete VPC asset pack")
    parser.add_argument("--theme", required=True, choices=list(THEME_CONFIGS.keys()),
                       help="Theme to generate assets for")
    parser.add_argument("--size", default="standard", choices=["minimal", "standard", "full"],
                       help="Pack size: minimal (core only), standard (recommended), full (everything)")
    parser.add_argument("--skip-images", action="store_true",
                       help="Only generate specs/prompts, skip actual image generation")
    parser.add_argument("--skip-audio", action="store_true",
                       help="Skip audio spec generation")
    
    args = parser.parse_args()
    
    theme = args.theme
    config = THEME_CONFIGS[theme]
    output_dir = os.path.join(OUTPUT_BASE, theme)
    ensure_dir(output_dir)
    
    print(f"=" * 60)
    print(f"VPC Multimedia Asset Generator - Full Pack")
    print(f"Theme: {config['name']}")
    print(f"Size: {args.size}")
    print(f"=" * 60)
    
    assets_generated = []
    
    # 1. Generate Game Symbols
    print("\n[1/6] Generating Game Symbols...")
    symbol_count = config['symbol_count'] if args.size != 'minimal' else 6
    run_sub_generator("generate-symbols.py", theme, f"--count {symbol_count} --output-dir {output_dir}/Symbols")
    for i in range(symbol_count):
        assets_generated.append({
            "type": "symbol",
            "name": f"symbol_{i+1:02d}",
            "path": f"{theme}/Symbols/symbol_{i+1:02d}.png"
        })
    
    # 2. Generate Backgrounds
    print("\n[2/6] Generating Backgrounds...")
    bg_count = config['background_count'] if args.size != 'minimal' else 2
    run_sub_generator("generate-backgrounds.py", theme, f"--count {bg_count} --output-dir {output_dir}/Backgrounds")
    for i in range(bg_count):
        assets_generated.append({
            "type": "background",
            "name": f"bg_{i+1:02d}",
            "path": f"{theme}/Backgrounds/bg_{i+1:02d}.png"
        })
    
    # 3. Generate UI Kit
    print("\n[3/6] Generating UI Kit...")
    ui_style = config['ui_style']
    run_sub_generator("generate-ui-kit.py", theme, f"--style {ui_style} --output-dir {output_dir}/UI")
    for element in ["btn_spin", "btn_bet", "frame_main", "panel_menu", "progress_bar", "icon_coin", "icon_settings"]:
        assets_generated.append({
            "type": "ui",
            "name": element,
            "path": f"{theme}/UI/{element}.png"
        })
    
    # 4. Generate Spine Specs
    if args.size != 'minimal':
        print("\n[4/6] Generating Spine Animation Specs...")
        for character in config['spine_characters']:
            run_sub_generator("generate-spine-specs.py", theme, 
                            f"--character {character} --output-dir {output_dir}/Spine/{character}")
            assets_generated.append({
                "type": "spine",
                "name": f"char_{character}",
                "path": f"{theme}/Spine/{character}/skeleton.json"
            })
    
    # 5. Generate Audio Specs
    if not args.skip_audio:
        print("\n[5/6] Generating Audio Asset Specs...")
        audio_types = "sfx,music,ambient" if args.size == 'full' else "sfx"
        run_sub_generator("generate-audio-specs.py", theme, 
                        f"--type {audio_types} --mood {config['audio_mood']} --output-dir {output_dir}/Audio")
        assets_generated.append({
            "type": "audio_manifest",
            "name": f"audio_{theme}",
            "path": f"{theme}/Audio/audio_manifest.json"
        })
    
    # 6. Generate Promo Assets
    if args.size == 'full':
        print("\n[6/6] Generating Promo/Marketing Assets...")
        run_sub_generator("generate-promo.py", theme, 
                        f"--type all --output-dir {output_dir}/Promo")
        for promo_type in ["app_icon", "feature_graphic", "screenshot_1", "screenshot_2", "screenshot_3"]:
            assets_generated.append({
                "type": "promo",
                "name": promo_type,
                "path": f"{theme}/Promo/{promo_type}.png"
            })
    
    # Generate Manifest
    manifest_path = generate_manifest(theme, output_dir, assets_generated)
    
    # Generate Summary
    summary = {
        "theme": theme,
        "theme_name": config['name'],
        "color_palette": config['color_palette'],
        "output_directory": output_dir,
        "manifest": manifest_path,
        "total_assets": len(assets_generated),
        "breakdown": {
            "symbols": len([a for a in assets_generated if a['type'] == 'symbol']),
            "backgrounds": len([a for a in assets_generated if a['type'] == 'background']),
            "ui_elements": len([a for a in assets_generated if a['type'] == 'ui']),
            "spine_characters": len([a for a in assets_generated if a['type'] == 'spine']),
            "promo_assets": len([a for a in assets_generated if a['type'] == 'promo'])
        }
    }
    
    summary_path = os.path.join(output_dir, "summary.json")
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\n{'=' * 60}")
    print(f"PACK GENERATION COMPLETE")
    print(f"{'=' * 60}")
    print(f"Theme: {config['name']}")
    print(f"Total Assets: {len(assets_generated)}")
    print(f"Output: {output_dir}")
    print(f"Manifest: {manifest_path}")
    print(f"\nNext Steps:")
    print(f"1. Run individual generators to create actual PNGs")
    print(f"2. Use manifest.json for Unity batch import")
    print(f"3. See IMPORT-GUIDE.md for Unity setup instructions")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()