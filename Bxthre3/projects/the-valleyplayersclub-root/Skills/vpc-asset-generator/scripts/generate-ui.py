#!/usr/bin/env python3
"""
VPC UI Asset Generator
Creates casino UI elements for Unity
"""

import os
import sys
import json

PROJECT_ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
OUTPUT_DIR = f"{PROJECT_ROOT}/unity-vpc/Assets/Resources/Generated/UI"

UI_ELEMENTS = {
    "buttons": {
        "spin": "large circular SPIN button, casino slot machine style, red and gold, glossy, arrow symbol",
        "bet_plus": "square plus button, green, betting controls",
        "bet_minus": "square minus button, red, betting controls",
        "max_bet": "MAX BET button, gold luxury style, rectangular",
        "auto_spin": "AUTO PLAY button, blue neon glow, rectangular",
        "cash_out": "CASH OUT button, green money style, rounded",
        "menu": "MENU hamburger button, gold frame, circular",
        "close": "X close button, red circle, white X",
        "back": "BACK arrow button, gold frame, left arrow",
        "play": "PLAY button, green gradient, rounded rectangle",
    },
    "panels": {
        "lobby_bg": "casino game lobby background, dark velvet with gold patterns, widescreen",
        "game_frame": "ornate game frame, gold and dark wood, decorative border, transparent center",
        "win_popup": "WINNER celebration panel, gold burst effect, transparent center",
        "menu_panel": "settings menu background, frosted glass dark, rounded corners",
        "jackpot_display": "JACKPOT banner, flashing gold, marquee style, curved top",
        "balance_display": "player balance panel, digital display look, green LED numbers area",
    },
    "icons": {
        "coin": "gold coin icon, stack of coins, shiny metallic",
        "ticket": "sweepstakes ticket icon, perforated edges, gold",
        "trophy": "trophy cup icon, gold, winner symbol",
        "crown": "crown icon, golden king crown, VIP symbol",
        "star": "five point star, gold, rating symbol",
        "lightning": "lightning bolt, yellow electric, power symbol",
        "gift": "gift box, red ribbon, bonus symbol",
        "clock": "clock icon, time bonus symbol",
    },
    "frames": {
        "gold_round": "round picture frame, ornate gold, decorative border",
        "neon_rect": "rectangle frame, neon glow edges, cyberpunk style",
        "wood_classic": "wooden frame, poker table style, dark oak",
        "bubble": "speech bubble frame, comic style, rounded",
    },
    "backgrounds": {
        "felt_green": "casino table felt texture, green velvet, seamless pattern",
        "felt_blue": "casino table felt texture, blue velvet, seamless pattern",
        "felt_red": "casino table felt texture, red velvet, seamless pattern",
        "wood_table": "wooden table surface, polished oak, poker table",
        "gradient_dark": "dark gradient background, purple to black, subtle",
        "underwater_bg": "underwater scene, coral reef, fish silhouettes, blue gradient",
        "egypt_bg": "Egyptian temple interior, hieroglyphics, golden light",
    }
}

def ensure_output_dir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_prompt(name, description, style="casino"):
    styles = {
        "casino": "casino game UI, Vegas style, gold and chrome, glossy 3D",
        "neon": "neon cyberpunk UI, glowing edges, dark background, electric",
        "luxury": "luxury premium UI, black and gold, leather textures, high-end",
        "fun": "casual fun UI, bright colors, cartoon style, friendly"
    }
    
    style_desc = styles.get(style, styles["casino"])
    
    # Adjust based on element type
    if "background" in description.lower() or "_bg" in name or "texture" in description.lower():
        return (
            f"Seamless game background texture: {description}, "
            f"{style_desc}, tileable pattern, "
            f"game asset, high resolution, no text"
        )
    
    return (
        f"Casino game UI element: {name}, {description}, "
        f"{style_desc}, "
        f"completely transparent background, isolated UI element, "
        f"2D game interface asset, mobile game UI, "
        f"clean edges, no text outside element, no watermark"
    )

def main():
    if len(sys.argv) < 2:
        print("Usage: generate-ui.py [--type buttons|panels|icons|frames|backgrounds|all] [--style casino|neon|luxury|fun]")
        sys.exit(1)
    
    element_type = "all"
    style = "casino"
    
    for i, arg in enumerate(sys.argv):
        if arg == "--type" and i + 1 < len(sys.argv):
            element_type = sys.argv[i + 1]
        if arg == "--style" and i + 1 < len(sys.argv):
            style = sys.argv[i + 1]
    
    ensure_output_dir()
    
    types_to_generate = [element_type] if element_type != "all" else list(UI_ELEMENTS.keys())
    
    generated = []
    for t in types_to_generate:
        if t not in UI_ELEMENTS:
            continue
        
        for name, desc in UI_ELEMENTS[t].items():
            filename = f"{t}_{name}"
            output_path = f"{OUTPUT_DIR}/{filename}.png"
            
            # Use appropriate aspect ratio based on type
            aspect = "1:1"
            if "_bg" in name or t == "backgrounds":
                aspect = "16:9"
            elif "panel" in name or t == "panels":
                aspect = "16:9"
            
            prompt = get_prompt(name, desc, style)
            
            print(f"\n# Generate UI: {t}/{name}")
            print(f"# Style: {style}")
            print(f"# Aspect: {aspect}")
            print(f"# Save to: {output_path}")
            print(f"# PROMPT:\n{prompt}\n")
            
            generated.append({
                "file": filename,
                "type": t,
                "name": name,
                "style": style,
                "aspect_ratio": aspect,
                "description": desc,
                "prompt": prompt,
                "output_path": output_path
            })
    
    # Save batch file
    batch_file = f"{OUTPUT_DIR}/ui_batch_{style}.json"
    with open(batch_file, 'w') as f:
        json.dump(generated, f, indent=2)
    
    print(f"\n=== UI BATCH READY ===")
    print(f"Style: {style}")
    print(f"Total UI elements: {len(generated)}")
    print(f"Batch spec saved to: {batch_file}")

if __name__ == "__main__":
    main()
