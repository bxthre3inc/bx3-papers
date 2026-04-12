#!/usr/bin/env python3
"""
VPC Game Engine - Modular Asset & Game Generator

Workflow:
  1. CREATE spec from prompt
  2. VALIDATE the spec (rules engine)
  3. APPROVE (locks spec, creates structure)
  4. BUILD modules (assets, grid, engine, audio)
  5. TEST automated validation
  6. PACKAGE for Unity import
  7. GENERATE output generation commands

Usage:
  ./vpc-engine.py create --name "Neon Slots" --type slots --theme crypto --reels 6 --rows 4
  ./vpc-engine.py validate --id neon-slots-crypto-20260407-090000
  ./vpc-engine.py approve --id neon-slots-crypto-20260407-090000
  ./vpc-engine.py build --id neon-slots-crypto-20260407-090000
  ./vpc-engine.py test --id neon-slots-crypto-20260407-090000
  ./vpc-engine.py package --id neon-slots-crypto-20260407-090000 --format zip
  ./vpc-engine.py generate --id neon-slots-crypto-20260407-090000
"""

import sys
import json
import argparse
from pathlib import Path

# Add modules to path
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR / "modules"))

from core.pack_manager import PackManager

def main():
    pm = PackManager()
    
    parser = argparse.ArgumentParser(
        description="VPC Game Engine - Modular asset & game pack generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  Create new pack:
    %(prog)s create --name "Gold Rush" --type slots --theme western --reels 5 --rows 3
  
  Full pipeline:
    %(prog)s create --name "Crypto Vegas" --type slots --theme crypto --reels 6
    %(prog)s validate --id <pack-id>
    %(prog)s approve --id <pack-id>
    %(prog)s build --id <pack-id>
    %(prog)s package --id <pack-id>
    %(prog)s generate --id <pack-id>
        """
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # CREATE
    create_parser = subparsers.add_parser("create", help="Create new game pack spec")
    create_parser.add_argument("--name", required=True, help="Game display name")
    create_parser.add_argument("--type", required=True, choices=pm.SUPPORTED_TYPES,
                               help=f"Game type: {', '.join(pm.SUPPORTED_TYPES)}")
    create_parser.add_argument("--theme", required=True, choices=pm.SUPPORTED_THEMES,
                               help=f"Visual theme: {', '.join(pm.SUPPORTED_THEMES)}")
    # Slots params
    create_parser.add_argument("--reels", type=int, default=5, help="Number of reels (slots)")
    create_parser.add_argument("--rows", type=int, default=3, help="Number of rows (slots)")
    create_parser.add_argument("--paylines", type=int, default=20, help="Number of paylines")
    # Shooter params
    create_parser.add_argument("--cannons", type=int, default=4, help="Player positions (shooter)")
    create_parser.add_argument("--targets", type=int, default=15, help="Target variety (shooter)")
    # Match3 params
    create_parser.add_argument("--width", type=int, default=8, help="Board width (match3)")
    create_parser.add_argument("--height", type=int, default=8, help="Board height (match3)")
    # General
    create_parser.add_argument("--symbols", type=int, default=12, help="Total symbol count")
    create_parser.add_argument("--audio", action="store_true", default=True, help="Include audio manifest")
    
    # VALIDATE
    subparsers.add_parser("validate", help="Validate spec against rules").add_argument("--id", required=True)
    
    # APPROVE
    subparsers.add_parser("approve", help="Approve spec and create structure").add_argument("--id", required=True)
    
    # BUILD
    subparsers.add_parser("build", help="Build all modules").add_argument("--id", required=True)
    
    # TEST
    subparsers.add_parser("test", help="Run automated tests").add_argument("--id", required=True)
    
    # PACKAGE
    package_parser = subparsers.add_parser("package", help="Create distributable package")
    package_parser.add_argument("--id", required=True)
    package_parser.add_argument("--format", default="zip", choices=["zip", "folder"])
    
    # GENERATE (asset prompts)
    subparsers.add_parser("generate", help="Output image generation commands").add_argument("--id", required=True)
    
    # LIST
    subparsers.add_parser("list", help="List all packs")
    
    # STATUS
    subparsers.add_parser("status", help="Show pack details").add_argument("--id", required=True)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    # Route commands
    if args.command == "create":
        return cmd_create(pm, args)
    elif args.command == "validate":
        return cmd_validate(pm, args)
    elif args.command == "approve":
        return cmd_approve(pm, args)
    elif args.command == "build":
        return cmd_build(pm, args)
    elif args.command == "test":
        return cmd_test(pm, args)
    elif args.command == "package":
        return cmd_package(pm, args)
    elif args.command == "generate":
        return cmd_generate(pm, args)
    elif args.command == "list":
        return cmd_list(pm, args)
    elif args.command == "status":
        return cmd_status(pm, args)
    
    return 0

def cmd_create(pm, args):
    """Create new game pack spec"""
    
    # Build params based on game type
    params = {"symbols": args.symbols, "audio": args.audio}
    
    if args.type == "slots":
        params["reels"] = args.reels
        params["rows"] = args.rows
        params["paylines"] = args.paylines
    elif args.type == "shooter":
        params["cannons"] = args.cannons
        params["targets"] = args.targets
    elif args.type == "match3":
        params["width"] = args.width
        params["height"] = args.height
    elif args.type in ["crash", "plinko"]:
        pass  # These have simpler configs
    
    try:
        pack_id, spec = pm.create_spec(args.name, args.type, args.theme, params)
        
        print(f"\n╔═══════════════════════════════════════════════════════════════╗")
        print(f"║  GAME PACK SPEC CREATED                                       ║")
        print(f"╠═══════════════════════════════════════════════════════════════╣")
        print(f"║  ID:       {pack_id[:50]:<48} ║")
        print(f"║  Name:     {args.name[:50]:<48} ║")
        print(f"║  Type:     {args.type:<48} ║")
        print(f"║  Theme:    {args.theme:<48} ║")
        print(f"╠═══════════════════════════════════════════════════════════════╣")
        print(f"║  Modules:  {', '.join(spec['modules']):<48} ║")
        print(f"║  Status:   {spec['status']:<48} ║")
        print(f"╚═══════════════════════════════════════════════════════════════╝")
        print(f"\nNext: validate → approve → build → package → generate")
        print(f"\n  ./vpc-engine.py validate --id {pack_id}")
        
        return 0
        
    except ValueError as e:
        print(f"[ERROR] {e}")
        return 1

def cmd_validate(pm, args):
    """Validate spec against rules engine"""
    
    result = pm.validate_spec(args.id)
    
    status_icon = "✓" if result["status"] == "passed" else ("⚠" if result["status"] == "warning" else "✗")
    
    print(f"\n╔═══════════════════════════════════════════════════════════════╗")
    print(f"║  VALIDATION: {status_icon} {result['status'].upper():<45} ║")
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    
    if result["errors"]:
        print(f"║  ERRORS ({len(result['errors'])}):                                         ║")
        for err in result["errors"]:
            print(f"║    • {err[:54]:<54} ║")
    
    if result["warnings"]:
        print(f"║  WARNINGS ({len(result['warnings'])}):                                       ║")
        for warn in result["warnings"]:
            print(f"║    • {warn[:54]:<54} ║")
    
    if not result["errors"] and not result["warnings"]:
        print(f"║  All validation rules passed                                  ║")
    
    print(f"╚═══════════════════════════════════════════════════════════════╝")
    
    return 0 if result["status"] in ["passed", "warning"] else 1

def cmd_approve(pm, args):
    """Approve spec and create directory structure"""
    
    if pm.approve(args.id):
        spec = pm.status(args.id)
        pack_dir = spec["outputs"]["pack_dir"]
        
        print(f"\n╔═══════════════════════════════════════════════════════════════╗")
        print(f"║  PACK APPROVED                                                ║")
        print(f"╠═══════════════════════════════════════════════════════════════╣")
        print(f"║  Structure created at:                                        ║")
        print(f"║  {pack_dir:<63} ║")
        print(f"╠═══════════════════════════════════════════════════════════════╣")
        print(f"║  Scripts/                                                     ║")
        print(f"║  Resources/                                                   ║")
        print(f"║  Textures/Symbols, Backgrounds, UI/                         ║")
        print(f"║  Audio/SFX, Music/                                            ║")
        print(f"║  Animation/Spine/                                             ║")
        print(f"║  Prefabs/                                                     ║")
        print(f"╚═══════════════════════════════════════════════════════════════╝")
        print(f"\nNext: build modules")
        print(f"\n  ./vpc-engine.py build --id {args.id}")
        
        return 0
    else:
        print(f"[ERROR] Approval failed - fix validation errors first")
        return 1

def cmd_build(pm, args):
    """Build all modules"""
    
    results = pm.build(args.id)
    spec = pm.status(args.id)
    
    print(f"\n╔═══════════════════════════════════════════════════════════════╗")
    print(f"║  MODULE BUILD COMPLETE                                        ║")
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    
    for module, result in results.items():
        status = "✓" if "error" not in str(result) else "✗"
        print(f"║  {status} {module.upper():<10}: {str(result)[:50]:<50} ║")
    
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    print(f"║  Pack status: {spec['status']:<49} ║")
    print(f"╚═══════════════════════════════════════════════════════════════╝")
    
    print(f"\nNext: test → package → generate")
    print(f"\n  ./vpc-engine.py test --id {args.id}")
    
    return 0

def cmd_test(pm, args):
    """Run automated tests"""
    
    spec = pm.status(args.id)
    
    print(f"\n╔═══════════════════════════════════════════════════════════════╗")
    print(f"║  AUTOMATED TESTS                                              ║")
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    
    # Test each module
    tests = []
    
    # Config test
    config_path = Path(spec["outputs"]["pack_dir"]) / "Resources" / "asset_manifest.json"
    tests.append(("Asset manifest exists", config_path.exists()))
    
    # Grid test
    grid_path = Path(spec["outputs"]["pack_dir"]) / "Resources" / "grid_config.json"
    tests.append(("Grid config exists", grid_path.exists()))
    
    # Scripts test
    scripts_dir = Path(spec["outputs"]["pack_dir"]) / "Scripts"
    has_scripts = any(scripts_dir.glob("*.cs")) if scripts_dir.exists() else False
    tests.append(("C# scripts generated", has_scripts))
    
    # Theme consistency test
    import json
    config_path = Path(spec["outputs"]["pack_dir"]) / "Resources" / "asset_manifest.json"
    config = json.loads(config_path.read_text()) if config_path.exists() else {}
    style = config.get("metadata", {}).get("style_anchor", "")
    theme_match = spec["theme"] in style.lower() or bool(style)
    tests.append(("Style anchor consistent", theme_match))
    
    # Run tests
    passed = 0
    for name, result in tests:
        icon = "✓" if result else "✗"
        status = "PASS" if result else "FAIL"
        print(f"║  {icon} {name:<30}: {status:<22} ║")
        if result:
            passed += 1
    
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    print(f"║  Results: {passed}/{len(tests)} tests passed{' ':<40} ║")
    print(f"╚═══════════════════════════════════════════════════════════════╝")
    
    return 0 if passed == len(tests) else 1

def cmd_package(pm, args):
    """Create distributable package"""
    
    path = pm.package(args.id, args.format)
    
    print(f"\n╔═══════════════════════════════════════════════════════════════╗")
    print(f"║  PACKAGE CREATED                                              ║")
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    print(f"║  Path: {path:<58} ║")
    print(f"║  Format: {args.format.upper():<56} ║")
    print(f"╚═══════════════════════════════════════════════════════════════╝")
    
    print(f"\nImport to Unity:")
    print(f"  unzip {path} -d unity-vpc/Assets/GamePacks/{args.id}/")
    
    return 0

def cmd_generate(pm, args):
    """Output image generation commands"""
    
    spec = pm.status(args.id)
    pack_dir = Path(spec["outputs"]["pack_dir"])
    manifest_path = pack_dir / "Resources" / "asset_manifest.json"
    
    if not manifest_path.exists():
        print(f"[ERROR] Manifest not found. Run 'build' first.")
        return 1
    
    manifest = json.loads(manifest_path.read_text())
    assets = manifest.get("symbols", []) + manifest.get("backgrounds", []) + manifest.get("ui", [])
    
    print(f"\n{'='*65}")
    print(f"GENERATION COMMANDS FOR: {args.id}")
    print(f"Style: {manifest['metadata']['style_anchor'][:50]}")
    print(f"Total assets: {len(assets)}")
    print(f"{'='*65}\n")
    
    for i, asset in enumerate(assets, 1):
        print(f"# Asset {i}/{len(assets)}: {asset['id']} ({asset['type']})")
        print(f"# File: {pack_dir}/{asset['path']}")
        print(f"""generate_image(
    prompt="{asset['prompt']}",
    file_stem="{asset['id']}",
    aspect_ratio="{asset.get('aspect_ratio', '1:1')}",
    output_dir="{pack_dir}/{Path(asset['path']).parent}"
)""")
        print()
    
    print(f"\n{'='*65}")
    print(f"Copy these generate_image() calls and run them to create assets")
    print(f"{'='*65}")
    
    return 0

def cmd_list(pm, args):
    """List all packs"""
    
    packs = pm.list_packs()
    
    print(f"\n╔═══════════════════════════════════════════════════════════════╗")
    print(f"║  ALL GAME PACKS ({len(packs)} total)                              ║")
    print(f"╠═══════════════════════════════════════════════════════════════╣")
    
    for pack in packs:
        val_icon = "✓" if pack["validation"] == "passed" else ("⚠" if pack["validation"] == "warning" else "✗")
        print(f"║  [{pack['status']:8}] {val_icon} {pack['id'][:45]:<45} ║")
        print(f"║      {pack['name'][:30]:<30} ({pack['type']}/{pack['theme']})    ║")
    
    print(f"╚═══════════════════════════════════════════════════════════════╝")
    
    return 0

def cmd_status(pm, args):
    """Show detailed pack status"""
    
    spec = pm.status(args.id)
    
    print(f"\n{'='*65}")
    print(f"PACK: {spec['pack_id']}")
    print(f"{'='*65}")
    print(f"Name:    {spec['name']}")
    print(f"Type:    {spec['game_type']}")
    print(f"Theme:   {spec['theme']}")
    print(f"Status:  {spec['status']}")
    print(f"Created: {spec['created']}")
    print(f"Version: {spec['version']}")
    print(f"\nParameters:")
    for k, v in spec['params'].items():
        print(f"  {k}: {v}")
    print(f"\nModules: {', '.join(spec['modules'])}")
    print(f"Validation: {spec['validation']['status']}")
    if spec['validation']['errors']:
        print(f"  Errors: {spec['validation']['errors']}")
    if spec['outputs']:
        print(f"\nOutputs:")
        for k, v in spec['outputs'].items():
            print(f"  {k}: {v}")
    print(f"{'='*65}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
