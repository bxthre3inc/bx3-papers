#!/usr/bin/env python3
"""VPC Game Engine - Modular Asset & Game Generator"""
import os, sys, json, argparse, zipfile
from datetime import datetime
from pathlib import Path

# Add modules to path
sys.path.insert(0, str(Path(__file__).parent / "modules"))

try:
    from unity_scene import generate_scene
    from audio_pipeline import AudioPipeline
    from threed_pipeline import ThreeDPipeline
    from batch_ops import BatchOps
    MODULES_AVAILABLE = True
except ImportError:
    MODULES_AVAILABLE = False

ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
SPEC_DIR = Path(f"{ROOT}/Assets/.specs")
PACKS_DIR = Path(f"{ROOT}/unity-vpc/Assets/GamePacks")
ZIPS_DIR = Path(f"{ROOT}/Skills/vpc-engine/packages")
THEME_DIR = Path(f"{ROOT}/Skills/vpc-engine/themes")

THEMES = {
    "western": "wild west, dusty desert, warm gold/brown, aged leather, 1800s vintage",
    "crypto": "neon digital, circuit patterns, cyberpunk, holographic, blockchain aesthetics",
    "space": "deep space, nebula, sci-fi panels, metallic, cosmic lighting",
    "mythology": "ancient divine, marble/gold, ethereal mist, legendary, godlike radiance",
    "egypt": "ancient pyramids, golden pharaoh treasures, scarab beetles, hieroglyphics, desert heat",
    "jungle": "mayan temples, vine-covered ruins, emerald green canopy, golden idols, tropical",
    "candy": "cotton candy clouds, rainbow sprinkles, chocolate rivers, gummy bears, lollipop",
    "vampire": "gothic cathedrals, blood moon crimson, obsidian black, silver crosses, crypts",
    "steampunk": "brass gears, copper pipes, steam engines, victorian machinery, brass rivets"
}

class PackManager:
    def __init__(self):
        self.batch = BatchOps(ROOT) if MODULES_AVAILABLE else None
    
    def create(self, name, game_type, theme, **params):
        pack_id = f"{name.lower().replace(' ', '-')}-{theme}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        spec = {
            "pack_id": pack_id,
            "name": name,
            "game_type": game_type,
            "theme": theme,
            "style_anchor": THEMES.get(theme, theme),
            "params": params,
            "status": "pending",
            "created": datetime.now().isoformat(),
            "assets_2d": self._generate_2d_assets(game_type, params),
            "assets_3d": {},
            "audio": {},
            "outputs": {}
        }
        SPEC_DIR.mkdir(parents=True, exist_ok=True)
        (SPEC_DIR / f"{pack_id}.json").write_text(json.dumps(spec, indent=2))
        return pack_id, spec
    
    def _generate_2d_assets(self, game_type, params):
        if game_type == "slots":
            syms = params.get('symbols', 10)
            return {
                "symbols": [{"id": f"sym_{i:02d}", "rarity": "high" if i < 3 else "medium" if i < 6 else "low", "size": [128,128]} for i in range(syms)],
                "backgrounds": [{"id": "bg_main", "size": [1920,1080]}],
                "ui": ["btn_spin", "btn_max_bet", "btn_auto", "panel_balance", "panel_win", "frame_reels"]
            }
        elif game_type == "shooter":
            return {
                "targets": [{"id": f"tgt_{i:02d}", "type": "boss" if i < 2 else "rare" if i < 5 else "common"} for i in range(params.get('bosses',3) + params.get('waves',5) * 3)],
                "cannons": [{"id": f"can_{i:02d}"} for i in range(params.get('cannons',4))],
                "bullets": ["bullet_tracer", "bullet_explosion"],
                "backgrounds": [{"id": "bg_arena", "size": [1920,1080]}],
                "ui": ["btn_fire", "btn_bet", "panel_score", "radar"]
            }
        elif game_type == "match3":
            return {
                "gems": [{"id": f"gem_{i:02d}", "special": i >= params.get('grid',8) - params.get('special',4)} for i in range(params.get('grid',8))],
                "effects": ["match3_burst", "match4_line", "match5_bomb", "cascade"],
                "backgrounds": [{"id": "bg_board", "size": [1080,1920]}],
                "ui": ["btn_shuffle", "btn_hint", "panel_moves", "panel_score"]
            }
        else:
            return {"symbols": [{"id": f"sym_{i:02d}"} for i in range(10)]}

    def approve(self, pack_id):
        spec_file = SPEC_DIR / f"{pack_id}.json"
        if not spec_file.exists():
            return None
        spec = json.loads(spec_file.read_text())
        spec["status"] = "approved"
        spec_file.write_text(json.dumps(spec, indent=2))
        
        pack_dir = PACKS_DIR / pack_id
        pack_dir.mkdir(parents=True, exist_ok=True)
        (pack_dir / "Scripts").mkdir(exist_ok=True)
        (pack_dir / "Resources").mkdir(exist_ok=True)
        (pack_dir / "Audio").mkdir(exist_ok=True)
        (pack_dir / "Scenes").mkdir(exist_ok=True)
        
        cs = f'''using UnityEngine;
namespace VPC.Games.{pack_id.replace("-", "_")} {{
    public class GameController : VPC.Core.GameControllerBase {{
        [SerializeField] private GridConfig grid;
        void Start() => Initialize({spec["params"].get("reels",5)}, {spec["params"].get("rows",3)});
    }}
}}'''
        (pack_dir / "Scripts" / "GameController.cs").write_text(cs)
        return pack_dir

    def build(self, pack_id):
        spec_file = SPEC_DIR / f"{pack_id}.json"
        if not spec_file.exists():
            return None
        spec = json.loads(spec_file.read_text())
        
        # Generate 3D and Audio manifests if modules available
        if MODULES_AVAILABLE:
            theme = spec.get("theme", "western")
            game_type = spec.get("game_type", "slots")
            
            audio_pipe = AudioPipeline(theme)
            spec["audio"] = audio_pipe.generate_manifest(game_type)
            
            threed_pipe = ThreeDPipeline(theme, game_type)
            spec["assets_3d"] = threed_pipe.generate_manifest()
            
            spec_file.write_text(json.dumps(spec, indent=2))
        
        return spec

    def scene(self, pack_id):
        """Generate Unity scene file"""
        if not MODULES_AVAILABLE:
            return None
        spec_file = SPEC_DIR / f"{pack_id}.json"
        if not spec_file.exists():
            return None
        spec = json.loads(spec_file.read_text())
        
        pack_dir = PACKS_DIR / pack_id / "Scenes"
        pack_dir.mkdir(parents=True, exist_ok=True)
        
        scene_path = pack_dir / f"{pack_id}_Main.unity"
        generate_scene(spec, scene_path)
        return scene_path

    def package(self, pack_id):
        pack_dir = PACKS_DIR / pack_id
        if not pack_dir.exists():
            return None
        ZIPS_DIR.mkdir(parents=True, exist_ok=True)
        zip_path = ZIPS_DIR / f"{pack_id}.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for file in pack_dir.rglob("*"):
                if file.is_file():
                    arcname = str(file.relative_to(pack_dir))
                    zf.write(file, arcname)
        return zip_path

    def list(self):
        specs = []
        for f in SPEC_DIR.glob("*.json"):
            try:
                specs.append(json.loads(f.read_text()))
            except:
                pass
        return specs

def main():
    p = argparse.ArgumentParser(description="VPC Game Engine")
    sp = p.add_subparsers(dest="cmd")
    
    # Create
    c = sp.add_parser("create", help="Create new pack spec")
    c.add_argument("--name", required=True)
    c.add_argument("--type", choices=["slots","shooter","match3","plinko"], required=True)
    c.add_argument("--theme", choices=list(THEMES.keys()), required=True)
    c.add_argument("--reels", type=int, default=5)
    c.add_argument("--rows", type=int, default=3)
    c.add_argument("--symbols", type=int, default=10)
    c.add_argument("--cannons", type=int, default=4)
    c.add_argument("--bosses", type=int, default=3)
    c.add_argument("--waves", type=int, default=5)
    c.add_argument("--grid", type=int, default=8)
    c.add_argument("--special", type=int, default=4)
    
    # Approve
    sp.add_parser("approve", help="Approve and create structure").add_argument("--id", required=True)
    
    # Build
    sp.add_parser("build", help="Generate full asset manifests").add_argument("--id", required=True)
    
    # Scene
    sp.add_parser("scene", help="Generate Unity scene file").add_argument("--id", required=True)
    
    # Package
    sp.add_parser("package", help="Create ZIP package").add_argument("--id", required=True)
    
    # Audio
    a = sp.add_parser("audio", help="Generate audio manifest")
    a.add_argument("--id", required=True)
    
    # 3D
    d = sp.add_parser("3d", help="Generate 3D asset manifest")
    d.add_argument("--id", required=True)
    
    # Batch
    b = sp.add_parser("batch", help="Batch operations")
    b.add_argument("--file", help="JSON file with pack definitions")
    b.add_argument("--report", action="store_true", help="Generate batch report")
    
    # List
    sp.add_parser("list", help="List all packs")
    
    args = p.parse_args()
    if not args.cmd:
        p.print_help()
        return 1
    
    pm = PackManager()
    
    if args.cmd == "create":
        params = {k:v for k,v in vars(args).items() if v is not None and k not in ['cmd','name','type','theme']}
        pack_id, spec = pm.create(args.name, args.type, args.theme, **params)
        print(f"\n[CREATED] {pack_id}")
        print(f"  Name: {spec['name']} | Type: {spec['game_type']} | Theme: {spec['theme']}")
        print(f"  Assets: {len(spec['assets_2d'].get('symbols',[]))} symbols, {len(spec['assets_2d'].get('backgrounds',[]))} backgrounds, {len(spec['assets_2d'].get('ui',[]))} UI")
        print(f"  Style: {spec['style_anchor'][:50]}...")
        print(f"\n  Next: ./engine.py approve --id {pack_id}")
    
    elif args.cmd == "approve":
        pack_dir = pm.approve(args.id)
        if pack_dir:
            print(f"\n[APPROVED] {args.id}")
            print(f"  Dir: {pack_dir}")
            print(f"  Scripts/, Resources/, Audio/, Scenes/ created")
            print(f"  Next: ./engine.py build --id {args.id}")
        else:
            print(f"[ERROR] Spec not found: {args.id}")
    
    elif args.cmd == "build":
        spec = pm.build(args.id)
        if spec and MODULES_AVAILABLE:
            print(f"\n[BUILT] {args.id}")
            print(f"  2D Assets: {sum(len(v) for v in spec['assets_2d'].values())} items")
            # Count 3D assets properly
            threed = spec.get('assets_3d', {})
            char_count = len(threed.get('characters', []))
            env_count = len(threed.get('environments', []))
            prop_count = len(threed.get('props', []))
            print(f"  3D Assets: {char_count + env_count + prop_count} items (chars: {char_count}, envs: {env_count}, props: {prop_count})")
            print(f"  Audio: {spec['audio'].get('total_assets',0)} tracks")
            print(f"  Next: ./engine.py scene --id {args.id}")
        elif spec:
            print(f"\n[BUILT] {args.id} (basic 2D only - modules not loaded)")
        else:
            print(f"[ERROR] Spec not found: {args.id}")
    
    elif args.cmd == "scene":
        scene_path = pm.scene(args.id)
        if scene_path:
            print(f"\n[SCENE] {args.id}")
            print(f"  Generated: {scene_path}")
            print(f"  Ready to open in Unity")
        else:
            print(f"[ERROR] Could not generate scene (modules or spec missing)")
    
    elif args.cmd == "audio":
        spec_file = SPEC_DIR / f"{args.id}.json"
        if spec_file.exists() and MODULES_AVAILABLE:
            spec = json.loads(spec_file.read_text())
            audio_pipe = AudioPipeline(spec.get("theme","western"))
            manifest = audio_pipe.generate_manifest(spec.get("game_type","slots"))
            spec["audio"] = manifest
            spec_file.write_text(json.dumps(spec, indent=2))
            print(f"\n[AUDIO] {args.id}")
            print(f"  SFX: {len(manifest['sfx'])} effects")
            print(f"  Music: {len(manifest['music'])} tracks")
            for sfx in manifest['sfx'][:3]:
                print(f"    - {sfx['id']}: {sfx['description'][:50]}...")
        else:
            print(f"[ERROR] Spec not found or modules unavailable")
    
    elif args.cmd == "3d":
        spec_file = SPEC_DIR / f"{args.id}.json"
        if spec_file.exists() and MODULES_AVAILABLE:
            spec = json.loads(spec_file.read_text())
            threed_pipe = ThreeDPipeline(spec.get("theme","western"), spec.get("game_type","slots"))
            manifest = threed_pipe.generate_manifest()
            spec["assets_3d"] = manifest
            spec_file.write_text(json.dumps(spec, indent=2))
            print(f"\n[3D] {args.id}")
            print(f"  Characters: {len(manifest['characters'])} models")
            print(f"  Environments: {len(manifest['environments'])} scenes")
            print(f"  Props: {len(manifest['props'])} items")
            print(f"  Poly budget: {manifest['total_poly_budget']}")
        else:
            print(f"[ERROR] Spec not found or modules unavailable")
    
    elif args.cmd == "package":
        zip_path = pm.package(args.id)
        if zip_path:
            print(f"\n[PACKAGED] {args.id}")
            print(f"  ZIP: {zip_path}")
            print(f"  Size: {zip_path.stat().st_size/1024:.1f} KB")
            print(f"  Import to Unity: Assets/GamePacks/{args.id}")
        else:
            print(f"[ERROR] Pack not built: {args.id}")
    
    elif args.cmd == "batch":
        if args.report and pm.batch:
            report = pm.batch.generate_batch_report()
            print(f"\n[BATCH REPORT]")
            print(f"  Total Packs: {report['total_packs']}")
            print(f"  By Status: {report['by_status']}")
            print(f"  By Type: {report['by_type']}")
            print(f"  By Theme: {report['by_theme']}")
        elif args.file and pm.batch:
            with open(args.file) as f:
                packs = json.load(f)
            result = pm.batch.batch_create(packs)
            print(f"\n[BATCH CREATED]")
            print(f"  Success: {len(result['created'])}")
            print(f"  Failed: {len(result['failed'])}")
            for p in result['created'][:5]:
                print(f"    - {p['id']}")
        else:
            print("[ERROR] --file or --report required")
    
    elif args.cmd == "list":
        for spec in pm.list():
            status = "✓" if spec.get("status") == "approved" else "○"
            name = spec.get("name", spec.get("pack_id", "Unknown"))
            pack_id = spec.get("pack_id", "no-id")
            game_type = spec.get("game_type", "unknown")
            theme = spec.get("theme", "unknown")
            print(f"{status} [{spec.get('status','unknown'):8}] {pack_id}: {name} ({game_type}/{theme})")

if __name__ == "__main__":
    main()
