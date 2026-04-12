#!/usr/bin/env python3
"""
VPC Game Symbol Generator
Generates 2D slot/shooter game symbols for Unity
"""

import os
import sys
import json
import argparse
from datetime import datetime

THEME_SYMBOLS = {
    "western": {
        "high": [
            ("golden_nugget", "massive gold nugget, raw gold, sparkling, natural formation, wild west prospector treasure"),
            ("dynamite_stick", "red dynamite TNT bundle with lit fuse, sparks, old west mining gear"),
            ("chest_gold", "wooden treasure chest overflowing with gold coins, western style, worn wood"),
            ("cowboy_hat", "leather cowboy hat, brown worn leather, silver badge, sheriff style")
        ],
        "medium": [
            ("horseshoe", "lucky silver horseshoe, nails attached, metal shine, cowboy symbol"),
            ("revolver", "silver revolver pistol, pearl handle, western six-shooter, polished metal"),
            ("wanted_poster", "weathered wanted poster with 'REWARD' text, old west paper, nail holes"),
            ("cactus", "tall saguaro cactus, desert plant, two arms, green with flower on top")
        ],
        "low": [
            ("bandit", "masked bandit with red bandana, cowboy hat, sneaky grin, wanted criminal"),
            ("boot", "brown leather cowboy boot, worn and dusty, spur on heel"),
            ("lantern", "vintage mining lantern, brass metal, warm glow, handle on top"),
            (pick_axe}, "wooden pickaxe, metal head, mining tool, worn handle")
        ],
        "special": [
            ("wild_bull", "furious wild bull with horns, kicking up dust, charging pose, symbol with 'WILD' text"),
            ("scatter_sunset", "western sunset with wagon wheel silhouette, big sky, orange and purple, 'SCATTER' text")
        ]
    },
    "crypto": {
        "high": [
            ("bitcoin_whale", "massive golden whale with Bitcoin B on body, swimming through coins, crypto wealth symbol"),
            ("wallet_diamond", "crypto hardware wallet made of diamond, USB plug, glowing green, luxury cold storage"),
            ("ethereum_temple", "Greek temple made of Ethereum blocks, glowing diamond logo, decentralized sanctuary"),
            ("golden_blockchain", "3D golden blockchain link, interlocking blocks, futuristic, expensive metal")
        ],
        "medium": [
            ("bitcoin_coin", "classic gold Bitcoin coin, detailed B symbol, tilted 3D view, metallic shine"),
            ("ethereum_coin", "shiny silver Ethereum coin, diamond logo, metallic, cryptocurrency"),
            ("rocket_moon", "red rocket ship blasting off toward moon, crypto meme symbol, flames"),
            ("mining_rig", "GPU mining rig setup, multiple graphics cards, blue LED lights, tech")
        ],
        "low": [
            ("crypto_punk", "pixelated NFT avatar, cyberpunk style, blue mohawk, pixel art style game symbol"),
            ("ledger", "closed ledger book, leather bound, gold lock, transaction records"),
            ("bull_market", "golden bull charging upward, stock market symbol, crypto bull run"),
            ("bear_market", "red bear claw mark, bearish symbol, danger warning")
        ],
        "special": [
            ("hodl_hands", "diamond hands made of actual diamonds, holding Bitcoin, diamond grip, 'HODL' text"),
            ("airdrop_parachute", "golden parachute dropping coins, crypto airdrop symbol, 'SCATTER' text")
        ]
    },
    "space": {
        "high": [
            ("planet_diamond", "diamond planet, crystalline surface, glowing core, precious space rock"),
            ("alien_mothership", "massive alien mothership, organic design, glowing purple lights, boss enemy"),
            ("laser_drill", "advanced laser mining drill, blue energy beam, sci-fi equipment, high tech"),
            ("space_station", "orbital mining station, ring design, solar panels, industrial space habitat")
        ],
        "medium": [
            ("alien_miner", "green alien with space helmet, holding laser pickaxe, cute but determined"),
            ("asteroid_gold", "golden asteroid with craters, floating in space, precious metals visible"),
            ("robot_probe", "small mining probe robot, treads, drill arm, antenna, cute mechanical"),
            ("crystal_cluster", "cluster of space crystals, glowing blue and purple, zero gravity floating")
        ],
        "low": [
            ("space_rock", "small gray asteroid, craters, rocky texture, common space debris"),
            ("satellite", "small satellite dish, solar panels, antenna array, communication device"),
            ("fuel_canister", "sci-fi fuel container, red and white, warning labels, resource"),
            ("oxygen_tank", "blue oxygen tank, pressure gauge, life support equipment")
        ],
        "special": [
            ("black_hole", "swirling black hole with event horizon, purple accretion disk, 'WILD' text, space anomaly"),
            ("wormhole", "blue swirling wormhole portal, tunnel effect, travel portal, 'SCATTER' text")
        ]
    }
}

def generate_symbol_prompt(name, description, theme, tier):
    """Generate full image generation prompt"""
    base = f"Casino game symbol: {name}"
    
    style_modifiers = {
        "western": "western wild west style, desert aesthetic, rustic",
        "crypto": "futuristic crypto aesthetic, neon accents, digital",
        "space": "sci-fi space aesthetic, high tech, cosmic background",
        "classic": "classic Vegas slot machine style, glossy chrome",
        "fantasy": "fantasy RPG aesthetic, magical glow, epic"
    }
    
    quality = "game asset, completely transparent background, isolated on transparent, perfect square composition, 2D sprite, high contrast, vibrant colors, no text outside symbol, no watermark, clean edges, mobile game quality"
    
    return f"{base}, {description}, {style_modifiers.get(theme, 'stylized')}, {quality}"

def main():
    parser = argparse.ArgumentParser(description="Generate game symbol specs")
    parser.add_argument("--theme", required=True, choices=list(THEME_SYMBOLS.keys()))
    parser.add_argument("--count", type=int, default=12)
    parser.add_argument("--output-dir", default=None)
    parser.add_argument("--generate-images", action="store_true", help="Also generate actual images")
    
    args = parser.parse_args()
    
    theme = args.theme
    symbols = THEME_SYMBOLS[theme]
    
    # Flatten all tiers
    all_symbols = []
    for tier, items in symbols.items():
        for name, desc in items:
            all_symbols.append((name, desc, tier))
    
    # Take requested count
    selected = all_symbols[:args.count]
    
    # Setup output
    if args.output_dir:
        output_dir = args.output_dir
    else:
        project_root = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
        output_dir = f"{project_root}/unity-vpc/Assets/Resources/Generated/{theme}/Symbols"
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate spec file
    batch = {
        "theme": theme,
        "generated_at": datetime.now().isoformat(),
        "total_symbols": len(selected),
        "symbols": []
    }
    
    for i, (name, desc, tier) in enumerate(selected):
        prompt = generate_symbol_prompt(name, desc, theme, tier)
        filename = f"symbol_{tier}_{name}.png"
        
        batch["symbols"].append({
            "id": i + 1,
            "name": name,
            "tier": tier,
            "filename": filename,
            "prompt": prompt,
            "unity_import": {
                "texture_type": "Sprite (2D and UI)",
                "sprite_mode": "Single",
                "pixels_per_unit": 100,
                "mesh_type": "Full Rect",
                "wrap_mode": "Clamp",
                "filter_mode": "Point"
            }
        })
    
    # Save batch spec
    batch_path = os.path.join(output_dir, "symbol_batch.json")
    with open(batch_path, 'w') as f:
        json.dump(batch, f, indent=2)
    
    print(f"Generated {len(selected)} symbol specs for {theme} theme")
    print(f"Batch spec saved to: {batch_path}")
    
    # Generate actual images if requested
    if args.generate_images:
        print("\nGenerating images...")
        # This would call generate_image tool for each
        # For now, just output the prompts
        for sym in batch["symbols"]:
            print(f"\n{sym['filename']}:")
            print(f"  Prompt: {sym['prompt'][:80]}...")
            print(f"  To generate: generate_image --prompt '{sym['prompt']}' --file_stem {sym['name']} --aspect_ratio 1:1")

if __name__ == "__main__":
    main()