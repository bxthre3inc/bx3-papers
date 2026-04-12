#!/usr/bin/env python3
"""VPC Assets - Prompt → Spec → Approval → Batch Generation"""
import os, sys, json, argparse
from datetime import datetime

ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
SPEC_DIR = f"{ROOT}/Assets/.specs"
OUT_DIR = f"{ROOT}/unity-vpc/Assets/Resources/Generated"

STYLES = {
    "western": ("wild west, dusty desert, warm gold/brown, aged leather textures", ["#D4AF37", "#8B4513", "#F4E4C1", "#CD853F", "#2F1810"]),
    "crypto": ("neon digital glow, circuit patterns, holographic shimmer, dark cyberpunk", ["#00FF41", "#0D0208", "#008F11", "#003B00", "#1A1A2E"]),
    "space": ("deep space void, stellar nebula, sci-fi panels, metallic sheen", ["#0B0B1F", "#4B0082", "#00BFFF", "#FFD700", "#1E90FF"]),
    "mythology": ("ancient divine glow, marble and gold, ethereal mist, godlike radiance", ["#FFD700", "#C0C0C0", "#800080", "#4169E1", "#FF4500"]),
}

def propose(args):
    theme = args.theme or "custom"
    style, palette = STYLES.get(theme, ("custom aesthetic", ["#FFFFFF"]))
    
    spec = {
        "pack_id": f"{theme}-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        "status": "pending",
        "theme": theme,
        "prompt": args.prompt,
        "style_anchor": style,
        "palette": palette,
        "assets": {
            "symbols": [f"symbol_{i:02d}" for i in range(args.symbols)],
            "backgrounds": ["bg_main", "bg_lobby"],
            "ui": ["btn_spin", "btn_maxbet", "btn_bet_up", "btn_bet_down", "panel_frame", "icon_coin", "icon_wallet"],
            "cover": ["game_cover", "app_icon"],
            "spine": [f"character_{i:02d}" for i in range(args.spine)]
        },
        "total": args.symbols + 2 + 7 + 2 + args.spine
    }
    os.makedirs(SPEC_DIR, exist_ok=True)
    path = f"{SPEC_DIR}/{spec['pack_id']}.json"
    with open(path, 'w') as f:
        json.dump(spec, f, indent=2)
    
    print(f"""
┌─────────────────────────────────────────────────────────────┐
│ PROPOSED ASSET PACK: {spec['pack_id']:<32}│
├─────────────────────────────────────────────────────────────┤
│ THEME:        {theme:<45}│
│ STYLE ANCHOR: {style[:43]:<45}│
│ TOTAL ASSETS: {spec['total']} items{' ':<42}│
├─────────────────────────────────────────────────────────────┤
│ BREAKDOWN:                                                  │
│   • Symbols:      {len(spec['assets']['symbols']):<4}  (slot/shooter symbols)            │
│   • Backgrounds:  {len(spec['assets']['backgrounds']):<4}  (game scenes, lobby)           │
│   • UI Elements:  {len(spec['assets']['ui']):<4}  (buttons, frames, icons)              │
│   • Cover Art:    {len(spec['assets']['cover']):<4}  (store art, icons)                  │
│   • Spine Chars:  {len(spec['assets']['spine']):<4}  (animated characters)               │
├─────────────────────────────────────────────────────────────┤
│ SPEC SAVED: {path:<49}│
└─────────────────────────────────────────────────────────────┘
REVIEW: {path}
APPROVE: python3 vpc-assets.py approve --id {spec['pack_id']}
""")
    return spec

def approve(args):
    path = f"{SPEC_DIR}/{args.id}.json"
    if not os.path.exists(path):
        print(f"ERROR: Spec not found: {path}")
        return
    
    with open(path, 'r') as f:
        spec = json.load(f)
    
    # Create output structure
    pack_dir = f"{OUT_DIR}/{spec['pack_id']}"
    os.makedirs(f"{pack_dir}/Symbols", exist_ok=True)
    os.makedirs(f"{pack_dir}/Backgrounds", exist_ok=True)
    os.makedirs(f"{pack_dir}/UI/buttons", exist_ok=True)
    os.makedirs(f"{pack_dir}/UI/frames", exist_ok=True)
    os.makedirs(f"{pack_dir}/Cover", exist_ok=True)
    os.makedirs(f"{pack_dir}/Spine", exist_ok=True)
    
    # Generate manifest with ALL prompts
    manifest = {"pack_id": spec['pack_id'], "theme": spec['theme'], "style": spec['style_anchor'], "assets": []}
    
    for sym in spec['assets']['symbols']:
        manifest['assets'].append({
            "type": "symbol", "name": sym,
            "prompt": f"{sym.replace('_',' ')} casino game symbol, {spec['style_anchor']}, transparent background, game asset",
            "output": f"{pack_dir}/Symbols/{sym}.png", "aspect": "1:1"
        })
    
    for bg in spec['assets']['backgrounds']:
        manifest['assets'].append({
            "type": "background", "name": bg,
            "prompt": f"{bg} game background, {spec['style_anchor']}, no UI elements, atmospheric",
            "output": f"{pack_dir}/Backgrounds/{bg}.png", "aspect": "16:9"
        })
    
    for ui in spec['assets']['ui']:
        manifest['assets'].append({
            "type": "ui", "name": ui,
            "prompt": f"{ui} casino UI element, {spec['style_anchor']}, transparent background, game interface",
            "output": f"{pack_dir}/UI/{ui}.png", "aspect": "1:1"
        })
    
    for cover in spec['assets']['cover']:
        manifest['assets'].append({
            "type": "cover", "name": cover,
            "prompt": f"{cover} app store cover art, {spec['style_anchor']}, professional marketing, high quality",
            "output": f"{pack_dir}/Cover/{cover}.png", "aspect": "3:2"
        })
    
    for spine in spec['assets']['spine']:
        manifest['assets'].append({
            "type": "spine", "name": spine,
            "prompt": f"{spine} game character, {spec['style_anchor']}, character design, full body, T-pose",
            "output": f"{pack_dir}/Spine/{spine}.png", "aspect": "3:4"
        })
    
    manifest_path = f"{pack_dir}/_manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    spec['status'] = 'approved'
    with open(path, 'w') as f:
        json.dump(spec, f, indent=2)
    
    print(f"""
┌─────────────────────────────────────────────────────────────┐
│ APPROVED: {spec['pack_id']:<49}│
├─────────────────────────────────────────────────────────────┤
│ STRUCTURE CREATED:                                          │
│   {pack_dir}/Symbols/{' ':<52}│
│   {pack_dir}/Backgrounds/{' ':<50}│
│   {pack_dir}/UI/{' ':<57}│
│   {pack_dir}/Cover/{' ':<54}│
│   {pack_dir}/Spine/{' ':<54}│
├─────────────────────────────────────────────────────────────┤
│ MANIFEST: {manifest_path:<49}│
│ TOTAL ITEMS: {len(manifest['assets']):<46}│
├─────────────────────────────────────────────────────────────┤
│ GENERATION COMMANDS:                                        │
│   python3 vpc-assets.py generate --id {spec['pack_id']}        │
└─────────────────────────────────────────────────────────────┘
""")

def generate(args):
    path = f"{OUT_DIR}/{args.id}/_manifest.json"
    if not os.path.exists(path):
        print(f"ERROR: Manifest not found. Approve first: python3 vpc-assets.py approve --id {args.id}")
        return
    
    with open(path, 'r') as f:
        manifest = json.load(f)
    
    print(f"""
=================================================================
GENERATING {len(manifest['assets'])} ASSETS - {manifest['pack_id']}
STYLE: {manifest['style']}
=================================================================
""")
    
    for i, asset in enumerate(manifest['assets'], 1):
        print(f"""
# Asset {i}/{len(manifest['assets'])}: {asset['name']} ({asset['type']})
# File: {asset['output']}
# Aspect: {asset['aspect']}
PROMPT: {asset['prompt']}
---
""")
    
    print(f"""
=================================================================
RUN THESE THROUGH generate_image TOOL:
  aspect_ratio='{manifest['assets'][0]['aspect']}'
  output_dir='{OUT_DIR}/{manifest['pack_id']}'
=================================================================
COMPLETE: {len(manifest['assets'])} assets staged for generation
""")

def list_specs():
    if not os.path.exists(SPEC_DIR):
        print("No specs yet.")
        return
    specs = [f for f in os.listdir(SPEC_DIR) if f.endswith('.json')]
    print(f"\nPENDING/APPROVED SPECS ({len(specs)}):")
    for s in specs:
        with open(f"{SPEC_DIR}/{s}") as f:
            spec = json.load(f)
        status = "[APPROVED]" if spec.get('status') == 'approved' else "[PENDING]"
        print(f"  {status} {spec['pack_id']} - {spec['theme']} ({spec.get('total','?')} assets)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='cmd')
    
    p = sub.add_parser('propose')
    p.add_argument('--prompt', required=True)
    p.add_argument('--theme', choices=['western','crypto','space','mythology','custom'])
    p.add_argument('--symbols', type=int, default=10)
    p.add_argument('--spine', type=int, default=2)
    
    a = sub.add_parser('approve')
    a.add_argument('--id', required=True)
    
    g = sub.add_parser('generate')
    g.add_argument('--id', required=True)
    
    sub.add_parser('list')
    
    args = parser.parse_args()
    
    if args.cmd == 'propose':
        propose(args)
    elif args.cmd == 'approve':
        approve(args)
    elif args.cmd == 'generate':
        generate(args)
    elif args.cmd == 'list':
        list_specs()
    else:
        parser.print_help()
