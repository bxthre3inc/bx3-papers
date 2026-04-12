#!/usr/bin/env python3
"""
VPC UI Kit Generator
Generates casino UI elements - buttons, frames, panels, icons
"""

import os
import json
import argparse
from datetime import datetime

UI_STYLES = {
    "rustic_metal": {
        "name": "Rustic Metal",
        "themes": ["western"],
        "frame": "weathered metal frame, rust edges, gold rivets, western saloon style",
        "button": "metal button with wood backing, brass rim, engraved, wild west",
        "panel": "wooden saloon wall texture, dark oak, grain visible, vintage",
        "progress": "brass gauge with needle, steampunk pressure meter, copper and gold"
    },
    "neon_glass": {
        "name": "Neon Glass",
        "themes": ["crypto"],
        "frame": "glass panel with neon edges, cyan glow, futuristic crypto UI",
        "button": "hexagonal tech button, blue LED glow, black carbon fiber",
        "panel": "dark glass with circuit patterns, holographic overlay, tech",
        "progress": "circular digital progress ring, cyan fill, futuristic HUD"
    },
    "holo_tech": {
        "name": "Holographic Tech",
        "themes": ["space"],
        "frame": "floating holographic frame, blue energy border, sci-fi UI",
        "button": "touch sensor button, glowing blue activation ring, metallic",
        "panel": "transparent HUD panel, data readout style, sci-fi interface",
        "progress": "energy bar with plasma fill, futuristic power gauge"
    },
    "chrome_luxury": {
        "name": "Chrome Luxury",
        "themes": ["classic"],
        "frame": "gold chrome frame with velvet backing, luxury casino style",
        "button": "circular gold button with diamond center, glossy, expensive",
        "panel": "green felt texture with gold trim, blackjack table style",
        "progress": "gold coin stack meter, coins piling up, luxury wealth"
    },
    "gold_mystic": {
        "name": "Gold Mystic",
        "themes": ["fantasy"],
        "frame": "ornate gold frame with magical runes, glowing purple gems",
        "button": "spell circle button, arcane symbols, magical energy glow",
        "panel": "ancient parchment with gold leaf, mystical symbols, aged",
        "progress": "mana crystal meter, glowing gem fill, fantasy RPG"
    }
}

UI_ELEMENTS = [
    {
        "id": "btn_spin",
        "name": "Spin Button",
        "type": "button_primary",
        "size": "256x256",
        "variants": ["normal", "pressed", "disabled"]
    },
    {
        "id": "btn_bet_plus",
        "name": "Bet Plus Button",
        "type": "button_control",
        "size": "128x128",
        "variants": ["normal", "pressed"]
    },
    {
        "id": "btn_bet_minus",
        "name": "Bet Minus Button",
        "type": "button_control",
        "size": "128x128",
        "variants": ["normal", "pressed"]
    },
    {
        "id": "btn_max_bet",
        "name": "Max Bet Button",
        "type": "button_secondary",
        "size": "192x96",
        "variants": ["normal", "pressed", "glow"]
    },
    {
        "id": "btn_auto",
        "name": "Auto Play Button",
        "type": "button_toggle",
        "size": "192x96",
        "variants": ["off", "on", "active"]
    },
    {
        "id": "btn_menu",
        "name": "Menu Button",
        "type": "button_icon",
        "size": "96x96",
        "variants": ["normal", "pressed"]
    },
    {
        "id": "btn_close",
        "name": "Close Button",
        "type": "button_icon",
        "size": "64x64",
        "variants": ["normal", "pressed"]
    },
    {
        "id": "frame_main",
        "name": "Main Game Frame",
        "type": "frame",
        "size": "1024x768",
        "variants": ["default"],
        "nine_slice": True
    },
    {
        "id": "frame_dialog",
        "name": "Dialog Frame",
        "type": "frame",
        "size": "512x384",
        "variants": ["default"],
        "nine_slice": True
    },
    {
        "id": "panel_menu",
        "name": "Menu Panel",
        "type": "panel",
        "size": "400x600",
        "variants": ["default"]
    },
    {
        "id": "panel_info",
        "name": "Info Panel",
        "type": "panel",
        "size": "300x200",
        "variants": ["default"]
    },
    {
        "id": "progress_bar",
        "name": "Progress Bar",
        "type": "progress",
        "size": "400x32",
        "variants": ["empty", "full"]
    },
    {
        "id": "icon_coin",
        "name": "Coin Icon",
        "type": "icon",
        "size": "64x64",
        "variants": ["default"]
    },
    {
        "id": "icon_gem",
        "name": "Gem Icon",
        "type": "icon",
        "size": "64x64",
        "variants": ["default"]
    },
    {
        "id": "icon_settings",
        "name": "Settings Icon",
        "type": "icon",
        "size": "64x64",
        "variants": ["default"]
    }
]

def generate_ui_prompt(element, style_name):
    """Generate prompt for UI element"""
    style = UI_STYLES[style_name]
    
    if element["type"] == "button_primary":
        base = f"Big circular SPIN button, casino slot machine, {style['button']}, prominent"
    elif element["type"] == "button_control":
        base = f"Square control button with {'plus' if 'plus' in element['id'] else 'minus'} symbol, {style['button']}"
    elif element["type"] == "button_secondary":
        base = f"Rectangular 'MAX BET' button, {style['button']}, gold text"
    elif element["type"] == "button_toggle":
        base = f"Toggle button 'AUTO PLAY', {style['button']}, active glow"
    elif element["type"] == "button_icon":
        icon = "hamburger" if "menu" in element['id'] else "X"
        base = f"Small icon button with {icon} symbol, {style['button']}"
    elif element["type"] == "frame":
        base = f"Game UI frame border, {style['frame']}, 9-slice ready, high quality"
    elif element["type"] == "panel":
        base = f"UI background panel, {style['panel']}, textured, seamless"
    elif element["type"] == "progress":
        base = f"Progress bar, {style['progress']}, empty state visible"
    elif element["type"] == "icon":
        icon_type = "coin" if "coin" in element['id'] else "gem" if "gem" in element['id'] else "gear"
        base = f"Game icon: {icon_type}, {style.get('icon', style['button'])}, small UI element"
    
    quality = "UI game asset, completely transparent background, isolated, high contrast, mobile game quality, no text artifacts, clean edges"
    
    return f"{base}, {quality}"

def main():
    parser = argparse.ArgumentParser(description="Generate UI kit specs")
    parser.add_argument("--theme", required=True, choices=["western", "crypto", "space", "classic", "fantasy"])
    parser.add_argument("--style", choices=list(UI_STYLES.keys()), default=None)
    parser.add_argument("--output-dir", default=None)
    parser.add_argument("--elements", default="all")
    
    args = parser.parse_args()
    
    # Auto-select style based on theme if not specified
    if not args.style:
        for style_name, style_data in UI_STYLES.items():
            if args.theme in style_data["themes"]:
                args.style = style_name
                break
    
    style = UI_STYLES[args.style]
    
    # Setup output
    if args.output_dir:
        output_dir = args.output_dir
    else:
        project_root = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
        output_dir = f"{project_root}/unity-vpc/Assets/Resources/Generated/{args.theme}/UI"
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate UI kit spec
    kit = {
        "theme": args.theme,
        "style": args.style,
        "style_name": style["name"],
        "generated_at": datetime.now().isoformat(),
        "total_elements": len(UI_ELEMENTS),
        "elements": []
    }
    
    for element in UI_ELEMENTS:
        prompt = generate_ui_prompt(element, args.style)
        
        for variant in element["variants"]:
            filename = f"{element['id']}_{variant}.png" if len(element["variants"]) > 1 else f"{element['id']}.png"
            
            kit["elements"].append({
                "id": element["id"],
                "name": element["name"],
                "variant": variant,
                "type": element["type"],
                "size": element["size"],
                "filename": filename,
                "prompt": prompt,
                "nine_slice": element.get("nine_slice", False),
                "unity_import": {
                    "texture_type": "Sprite (2D and UI)",
                    "sprite_mode": "Single" if not element.get("nine_slice") else "Multiple",
                    "pixels_per_unit": 100,
                    "mesh_type": "Full Rect",
                    "wrap_mode": "Clamp",
                    "filter_mode": "Trilinear",
                    "compression": "High Quality"
                }
            })
    
    # Save kit spec
    kit_path = os.path.join(output_dir, "ui_kit.json")
    with open(kit_path, 'w') as f:
        json.dump(kit, f, indent=2)
    
    print(f"Generated UI kit with {len(kit['elements'])} elements")
    print(f"Style: {style['name']}")
    print(f"Theme: {args.theme}")
    print(f"Spec saved to: {kit_path}")
    print(f"\nGeneration commands:")
    for elem in kit["elements"][:3]:
        print(f"  generate_image --file_stem {elem['id']} --aspect_ratio 1:1")
    print(f"  ... ({len(kit['elements']) - 3} more elements)")

if __name__ == "__main__":
    main()