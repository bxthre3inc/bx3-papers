#!/usr/bin/env python3
"""
VPC Western Theme Asset Generator
Creates 2D western/gold-rush themed sprites for Unity sweepstakes games
Alternative to fish table games
"""

import os
import sys
import json
import argparse

PROJECT_ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
OUTPUT_DIR = f"{PROJECT_ROOT}/unity-vpc/Assets/Resources/Generated/Western"

WESTERN_ENEMIES = {
    "common": [
        ("rattlesnake", "green rattlesnake, coiled strike pose, desert rattlesnake"),
        ("cactus", "saguaro cactus with face, cartoon style, desert plant"),
        ("boot", "old brown cowboy boot, worn leather, tumbleweed nearby"),
        ("skull", "cow skull, bleached white, desert ground"),
        ("vulture", "black vulture, circling pose, spread wings")
    ],
    "uncommon": [
        ("bandit", "masked bandit with red bandana, sneaky pose, cowboy hat"),
        ("horse", "brown wild horse, galloping pose, dust cloud"),
        ("gold_pan", "gold pan with nuggets, wooden handle, river mining"),
        ("lantern", "old mining lantern, glowing warm, metal frame"),
        ("pickaxe", "wooden pickaxe, metal head, worn handle")
    ],
    "rare": [
        ("sheriff_badge", "gold sheriff star badge, engraved, shiny"),
        ("wanted_poster", "torn wanted poster, face silhouette, REWARD text"),
        ("saloon", "wild west saloon building, double doors, swinging sign"),
        ("stagecoach", "wooden stagecoach, gold trim, horse team")
    ],
    "epic": [
        ("gold_cart", "mine cart overflowing with gold nuggets, sparkling"),
        ("tnt_barrel", "red dynamite TNT barrel, fuse sparking, danger"),
        ("bison", "giant bison, charging pose, dust storm"),
        ("golden_revolver", "ornate revolver, gold plated, pearl handle")
    ],
    "boss": [
        ("steam_train", "massive steam locomotive, black engine, smoke stacks billowing"),
        ("bank_vault", "giant round bank vault door, gold inside, massive"),
        ("giant_snake", "enormous green serpent, desert monster, glowing eyes"),
        (tornado", "massive dust devil tornado, brown funnel, debris flying")
    ],
    "mini": [
        ("gold_nugget", "shiny gold nugget, bonus coin, sparkling"),
        ("horseshoe", "golden horseshoe, lucky charm, upside down U"),
        ("poker_chip", "red casino chip, cowboy hat symbol, bonus"),
        ("whiskey", "bourbon whiskey bottle, glowing amber, bonus item")
    ]
}

WESTERN_SLOTS = {
    "low": [
        ("cactus", "green saguaro cactus symbol, cartoon style"),
        ("boot", "brown cowboy boot, worn leather"),
        ("horseshoe", "golden horseshoe, classic slot symbol"),
        ("whiskey", "bourbon bottle, amber liquid")
    ],
    "medium": [
        ("snake", "green rattlesnake, striking pose"),
        ("bandit", "masked outlaw, red bandana"),
        ("horse", "brown wild horse, galloping"),
        ("lantern", "mining lantern, warm glow")
    ],
    "high": [
        ("gold_bars", "stacked gold bars, shiny, valuable"),
        ("cowboy", "rugged cowboy, revolver, hat"),
        ("cowgirl", "blonde cowgirl, green dress, confident pose"),
        ("sheriff", "sheriff with badge, authoritative")
    ],
    "special": [
        ("dynamite_wild", "bundle of dynamite sticks, red, WILD text, explosive"),
        ("wanted_scatter", "wanted poster, mysterious face, SCATTER text"),
        ("train_jackpot", "steam locomotive, gold smoke, JACKPOT text"),
        ("nugget_bonus", "large gold nugget, coin explosion, BONUS text")
    ]
}

WESTERN_UI = {
    "buttons": {
        "spin": "large circular SPIN button, cowboy style, wood and gold, lasso icon",
        "shoot": "SHOOT button, revolver barrel style, red and metal",
        "bet_plus": "bet increase, up arrow, gold coin pile growing",
        "bet_minus": "bet decrease, down arrow, gold coin pile shrinking",
        "auto_spin": "AUTO PLAY, stagecoach wheel spinning icon",
        "cash_out": "CASH OUT, bank vault door opening icon",
        "max_bet": "MAX BET, golden dynamite bundle, explosive style"
    },
    "frames": {
        "game_table": "wooden western saloon table frame, dark oak, brass studs",
        "reel_frame": "gold rush era slot machine frame, ornate metal, vintage",
        "hud_frame": "cowboy belt leather frame, stitched, brass buckle corners"
    },
    "backgrounds": {
        "desert_day": "wild west desert landscape, red rocks, blue sky, cacti, distant mesas",
        "desert_sunset": "western sunset, orange and purple sky, long shadows, epic",
        "saloon_interior": "old west saloon, wooden bar, swinging doors, warm lantern light",
        "mine_tunnel": "gold mine tunnel, wooden beams, lantern glow, gold veins in walls"
    },
    "effects": {
        "muzzle_flash": "gun muzzle flash, orange yellow burst, smoke",
        "gold_sparkle": "gold coin sparkle particles, shiny, magical",
        "dynamite_fuse": "dynamite fuse sparking, red sparks, smoke trail",
        "dust_cloud": "cowboy dust cloud, brown, desert sand, billowing"
    }
}

def get_prompt(asset_type, name, description, style="game"):
    """Generate optimized prompt for AI image generation"""
    
    base_prompts = {
        "enemy": f"""Game asset: western shoot-em-up target for sweepstakes game, {description}, 
side profile view facing left, dynamic action pose, wild west game art style, 
vibrant colors, completely transparent background, isolated game sprite, 
high contrast, 2D mobile game quality, single entity only, no text, 
no watermark, clean edges, casino game aesthetic""",
        
        "slot": f"""Casino slot machine symbol: {name}, {description}, 
wild west casino style, wood and gold aesthetic, glossy 3D rendered appearance, 
metallic accents, completely transparent background, perfect square composition, 
game asset, isolated on transparent, high quality, no text outside symbol, 
no watermark, clean edges, sweepstakes casino quality""",
        
        "button": f"""Game UI button: {name}, {description}, 
wild west saloon style, wooden and brass elements, casino game interface, 
completely transparent background, isolated UI element, high contrast, 
2D mobile game UI quality, no text, no watermark, clean edges""",
        
        "background": f"""Game background: {name}, {description}, 
16:9 landscape composition, wild west casino game atmosphere, 
high quality digital painting, atmospheric lighting, detailed environment, 
no UI elements, no characters, just environment, casino game quality""",
        
        "effect": f"""Game VFX sprite: {name}, {description}, 
sprite sheet style, multiple frames implied, wild west casino game, 
completely transparent background, isolated effect, particle style, 
2D mobile game quality, no text, no watermark"""
    }
    
    return base_prompts.get(asset_type, base_prompts["enemy"])

def generate_batch(rarities=None, asset_types=None, count_per_rarity=2):
    """Generate a batch of prompts for image generation"""
    
    rarities = rarities or ["common", "uncommon", "rare", "epic", "boss", "mini"]
    asset_types = asset_types or ["enemies"]
    
    batch = []
    
    for rarity in rarities:
        if rarity in WESTERN_ENEMIES:
            items = WESTERN_ENEMIES[rarity][:count_per_rarity]
            for name, desc in items:
                prompt = get_prompt("enemy", name, desc)
                filename = f"western_{rarity}_{name}.png"
                batch.append({
                    "rarity": rarity,
                    "name": name,
                    "description": desc,
                    "prompt": prompt,
                    "filename": filename,
                    "output_path": f"{OUTPUT_DIR}/Enemies/{rarity}/{filename}"
                })
    
    return batch

def generate_slot_batch(tiers=None):
    """Generate slot symbol batch"""
    
    tiers = tiers or ["low", "medium", "high", "special"]
    batch = []
    
    for tier in tiers:
        if tier in WESTERN_SLOTS:
            for name, desc in WESTERN_SLOTS[tier]:
                prompt = get_prompt("slot", name, desc)
                filename = f"slot_{tier}_{name}.png"
                batch.append({
                    "tier": tier,
                    "name": name,
                    "prompt": prompt,
                    "filename": filename,
                    "output_path": f"{OUTPUT_DIR}/Slots/{filename}"
                })
    
    return batch

def generate_ui_batch(elements=None):
    """Generate UI elements batch"""
    
    batch = []
    
    for category, items in WESTERN_UI.items():
        if elements is None or category in elements:
            for name, desc in items.items():
                prompt_type = "button" if category == "buttons" else \
                             "background" if category == "backgrounds" else \
                             "effect" if category == "effects" else "button"
                prompt = get_prompt(prompt_type, name, desc)
                filename = f"ui_{category}_{name}.png"
                batch.append({
                    "category": category,
                    "name": name,
                    "prompt": prompt,
                    "filename": filename,
                    "output_path": f"{OUTPUT_DIR}/UI/{category}/{filename}"
                })
    
    return batch

def save_batch(batch, filename):
    """Save batch specification to JSON"""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(batch, f, indent=2)
    return filename

def print_batch(batch, batch_name):
    """Print batch for manual generation"""
    print(f"\n{'='*60}")
    print(f"  {batch_name} BATCH - {len(batch)} assets")
    print(f"{'='*60}")
    
    for i, item in enumerate(batch, 1):
        rarity = item.get('rarity', item.get('tier', item.get('category', 'ui')))
        print(f"\n#{i:02d} [{rarity.upper()}] {item['name']}")
        print(f"File: {item['filename']}")
        print(f"Path: {item['output_path']}")
        print(f"Prompt:\n{item['prompt']}")
        print(f"{'-'*60}")

def main():
    parser = argparse.ArgumentParser(description='VPC Western Asset Generator')
    parser.add_argument('--type', choices=['enemies', 'slots', 'ui', 'all'], default='all')
    parser.add_argument('--rarity', nargs='+', choices=['common', 'uncommon', 'rare', 'epic', 'boss', 'mini', 'all'], default=['all'])
    parser.add_argument('--count', type=int, default=2, help='Assets per rarity')
    parser.add_argument('--save', action='store_true', help='Save batch to JSON')
    
    args = parser.parse_args()
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    rarities = None if 'all' in args.rarity else args.rarity
    
    all_batches = []
    
    if args.type in ['enemies', 'all']:
        batch = generate_batch(rarities=rarities, count_per_rarity=args.count)
        print_batch(batch, "WESTERN ENEMIES")
        all_batches.extend(batch)
        
        if args.save:
            save_batch(batch, f"{OUTPUT_DIR}/generation_enemies_batch.json")
    
    if args.type in ['slots', 'all']:
        batch = generate_slot_batch()
        print_batch(batch, "WESTERN SLOTS")
        all_batches.extend(batch)
        
        if args.save:
            save_batch(batch, f"{OUTPUT_DIR}/generation_slots_batch.json")
    
    if args.type in ['ui', 'all']:
        batch = generate_ui_batch()
        print_batch(batch, "WESTERN UI")
        all_batches.extend(batch)
        
        if args.save:
            save_batch(batch, f"{OUTPUT_DIR}/generation_ui_batch.json")
    
    if args.save and all_batches:
        save_batch(all_batches, f"{OUTPUT_DIR}/generation_master_batch.json")
    
    print(f"\n{'='*60}")
    print(f"  TOTAL: {len(all_batches)} assets ready for generation")
    print(f"{'='*60}")
    print(f"\nTo generate images:")
    print(f"1. Use the prompts above with your AI image tool")
    print(f"2. Save as PNG with transparency")
    print(f"3. Move to: {OUTPUT_DIR}")
    print(f"4. Import into Unity as Sprite (2D and UI)")
    print(f"\nAspect ratios:")
    print(f"  - Enemies/Slots: 1:1 (square)")
    print(f"  - Buttons/UI: 1:1 or 2:1 (rectangular)")
    print(f"  - Backgrounds: 16:9 (landscape)")

if __name__ == "__main__":
    main()
