#!/usr/bin/env python3
"""
VPC Fish Asset Generator
Creates 2D fish sprites for Unity fish table games
"""

import os
import sys
import json

PROJECT_ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
OUTPUT_DIR = f"{PROJECT_ROOT}/unity-vpc/Assets/Resources/Generated/Fish"

FISH_TEMPLATES = {
    "common": [
        "small clownfish, orange with white stripes",
        "blue tang fish, bright blue oval body",
        "yellow butterflyfish, striped pattern",
        "green snapper, silver-green scales",
        "small pufferfish, beige with spots"
    ],
    "rare": [
        "angelfish, silver with black stripes, triangular fins",
        "lionfish, red and white stripes, flowing fins",
        "parrotfish, rainbow colored, beak mouth",
        "manta ray, black with white spots, wide wingspan",
        "sea turtle, green shell, swimming pose"
    ],
    "epic": [
        "golden shark, metallic gold body, aggressive pose",
        "crystal jellyfish, glowing blue, translucent",
        "electric eel, neon green, sparks around body",
        "giant grouper, dark green, massive size",
        "swordfish, silver with long pointed bill"
    ],
    "boss": [
        "ancient sea dragon, blue scales, glowing eyes, massive",
        "kraken, dark purple, multiple tentacles, terrifying",
        "mythical golden whale, enormous, treasure covered",
        "phoenix fish, fire and orange feathers, mythical",
        "emperor crab, giant red, golden armor shell"
    ],
    "mini": [
        "treasure chest with bubbles, gold coins visible",
        "spinning wheel bonus, casino wheel icon",
        "lightning powerup, electric energy ball",
        "gold doubloon pile, shiny coins"
    ]
}

def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_prompt(description, rarity):
    glow = ""
    if rarity == "epic":
        glow = "slight glow effect, magical aura, "
    elif rarity == "boss":
        glow = "intense glowing eyes, dramatic lighting, particle effects, "
    
    return (
        f"Game asset: {rarity} fish for sweepstakes fish table game, {description}, "
        f"side profile view facing left, swimming pose, vibrant colors, "
        f"stylized casino game art style, {glow}"
        f"completely transparent background, isolated game sprite, "
        f"high contrast, 2D mobile game art quality, single entity only, "
        f"no text, no watermark, clean edges"
    )

def main():
    if len(sys.argv) < 2:
        print("Usage: generate-fish.py [--rarity common|rare|epic|boss|mini|all] [--count N]")
        sys.exit(1)
    
    rarity = "all"
    count = None
    
    for i, arg in enumerate(sys.argv):
        if arg == "--rarity" and i + 1 < len(sys.argv):
            rarity = sys.argv[i + 1]
        if arg == "--count" and i + 1 < len(sys.argv):
            count = int(sys.argv[i + 1])
    
    ensure_output_dir()
    
    rarities_to_generate = [rarity] if rarity != "all" else list(FISH_TEMPLATES.keys())
    
    generated = []
    for r in rarities_to_generate:
        if r not in FISH_TEMPLATES:
            continue
        
        templates = FISH_TEMPLATES[r]
        if count:
            templates = templates[:count]
        
        for i, desc in enumerate(templates, 1):
            filename = f"{r}_fish_{i:02d}"
            output_path = f"{OUTPUT_DIR}/{filename}.png"
            
            prompt = get_prompt(desc, r)
            
            # Print command for manual execution with generate_image tool
            print(f"\n# Generate {r} fish {i}")
            print(f"# Description: {desc}")
            print(f"# Save to: {output_path}")
            print(f"# PROMPT:\n{prompt}\n")
            
            generated.append({
                "file": filename,
                "rarity": r,
                "description": desc,
                "prompt": prompt,
                "output_path": output_path
            })
    
    # Save batch file for reference
    batch_file = f"{OUTPUT_DIR}/generation_batch.json"
    with open(batch_file, 'w') as f:
        json.dump(generated, f, indent=2)
    
    print(f"\n=== BATCH READY ===")
    print(f"Total assets to generate: {len(generated)}")
    print(f"Batch spec saved to: {batch_file}")
    print(f"\nTo generate, run each prompt through the generate_image tool")
    print(f"with aspect_ratio='1:1' and output_dir='{OUTPUT_DIR}'")

if __name__ == "__main__":
    main()
