#!/usr/bin/env python3
"""
VPC Slot Symbol Generator
Creates slot machine symbols for Unity slot games
"""

import os
import sys
import json

PROJECT_ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
OUTPUT_DIR = f"{PROJECT_ROOT}/unity-vpc/Assets/Resources/Generated/Slots"

SLOT_THEMES = {
    "classic": {
        "symbols": [
            ("red seven", "classic casino red 7, glossy chrome finish, gold trim"),
            ("triple seven", "three 7s stacked, jackpot symbol, glowing gold"),
            ("cherry", "red cherries, stem with leaf, vibrant"),
            ("bar", "single silver bar, engraved, metallic"),
            ("double bar", "two silver bars stacked"),
            ("triple bar", "three gold bars stacked, shiny"),
            ("diamond", "brilliant cut diamond, sparkling, luxury"),
            ("bell", "golden liberty bell, classic slot symbol"),
            ("horseshoe", "golden horseshoe, lucky charm"),
            ("watermelon", "watermelon slice, green rind, red fruit, seeds"),
            ("lemon", "yellow lemon, citrus, bright"),
            ("plum", "purple plum, round, smooth"),
            ("grape", "bunch of purple grapes, cluster"),
            ("orange", "orange fruit, citrus, textured peel"),
            ("wild", "WILD text, fire background, explosive, special symbol"),
            ("scatter", "SCATTER text, stars around, bonus symbol"),
        ]
    },
    "egypt": {
        "symbols": [
            ("pharaoh", "golden pharaoh mask, Egyptian, treasure"),
            ("eye of horus", "Eye of Horus symbol, gold, mystical"),
            ("scarab", "golden scarab beetle, Egyptian, detailed"),
            ("pyramid", "Egyptian pyramid, sunset background in symbol"),
            ("ankh", "golden ankh cross, Egyptian life symbol"),
            ("cleopatra", "beautiful Egyptian queen, gold headdress"),
            ("desert oasis", "palm tree with water, desert scene"),
            ("treasure chest", "golden treasure chest, overflowing gold"),
        ]
    },
    "underwater": {
        "symbols": [
            ("treasure chest", "sunken treasure chest, pearls and coins"),
            ("pearl", "giant pearl in clam shell, glowing"),
            ("crown", "golden underwater crown, coral covered"),
            ("trident", "Poseidon trident, golden, powerful"),
            ("mermaid", "beautiful mermaid, flowing hair, fish tail"),
            ("seahorse", "golden seahorse, stylized, elegant"),
            ("starfish", "colorful starfish, five pointed"),
            ("dolphins", "pair of dolphins jumping, silver"),
        ]
    }
}

def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_prompt(name, description, style):
    styles = {
        "classic": "classic Vegas slot machine, chrome and gold, glossy 3D rendered",
        "egypt": "Egyptian treasure theme, ancient gold, mystical artifacts",
        "underwater": "underwater casino, sunken treasure, glowing aquatic"
    }
    
    style_desc = styles.get(style, styles["classic"])
    
    return (
        f"Casino slot machine symbol: {name}, {description}, "
        f"{style_desc} style, "
        f"glossy 3D rendered appearance, gold and metallic accents, "
        f"completely transparent background, perfect square composition, "
        f"game asset, isolated on transparent, high quality, "
        f"no text outside symbol, no watermark, clean edges"
    )

def main():
    if len(sys.argv) < 2:
        print("Usage: generate-slots.py [--theme classic|egypt|underwater] [--symbol SYMBOL]")
        sys.exit(1)
    
    theme = "classic"
    symbol_filter = None
    
    for i, arg in enumerate(sys.argv):
        if arg == "--theme" and i + 1 < len(sys.argv):
            theme = sys.argv[i + 1]
        if arg == "--symbol" and i + 1 < len(sys.argv):
            symbol_filter = sys.argv[i + 1]
    
    if theme not in SLOT_THEMES:
        print(f"Unknown theme: {theme}. Available: {list(SLOT_THEMES.keys())}")
        sys.exit(1)
    
    ensure_output_dir()
    
    symbols = SLOT_THEMES[theme]["symbols"]
    if symbol_filter:
        symbols = [s for s in symbols if symbol_filter.lower() in s[0].lower()]
    
    generated = []
    for name, desc in symbols:
        filename = f"symbol_{name.replace(' ', '_')}"
        output_path = f"{OUTPUT_DIR}/{filename}.png"
        
        prompt = get_prompt(name, desc, theme)
        
        print(f"\n# Generate slot symbol: {name}")
        print(f"# Theme: {theme}")
        print(f"# Save to: {output_path}")
        print(f"# PROMPT:\n{prompt}\n")
        
        generated.append({
            "file": filename,
            "name": name,
            "theme": theme,
            "description": desc,
            "prompt": prompt,
            "output_path": output_path
        })
    
    # Save batch file
    batch_file = f"{OUTPUT_DIR}/slot_batch_{theme}.json"
    with open(batch_file, 'w') as f:
        json.dump(generated, f, indent=2)
    
    print(f"\n=== SLOT BATCH READY ===")
    print(f"Theme: {theme}")
    print(f"Total symbols to generate: {len(generated)}")
    print(f"Batch spec saved to: {batch_file}")

if __name__ == "__main__":
    main()
