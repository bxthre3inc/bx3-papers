#!/usr/bin/env python3
"""
VPC Pack Manager - Core orchestration module
Manages game pack lifecycle: spec → validate → build → test → package
"""

import os
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Paths
ROOT = "/home/workspace/Bxthre3/projects/the-valleyplayersclub-project"
SPEC_DIR = Path(f"{ROOT}/Assets/.specs")
PACKS_DIR = Path(f"{ROOT}/unity-vpc/Assets/GamePacks")
ZIPS_DIR = Path(f"{ROOT}/Skills/vpc-game-engine/packages")

class PackManager:
    """Central orchestrator for game pack generation"""
    
    VERSION = "2.0.0"
    SUPPORTED_TYPES = ["slots", "shooter", "match3", "crash", "plinko"]
    SUPPORTED_THEMES = ["western", "crypto", "space", "mythology", "underwater", "retro", "jungle", "vegas"]
    
    def __init__(self):
        SPEC_DIR.mkdir(parents=True, exist_ok=True)
        PACKS_DIR.mkdir(parents=True, exist_ok=True)
        ZIPS_DIR.mkdir(parents=True, exist_ok=True)
    
    def create_spec(self, name: str, game_type: str, theme: str, 
                    params: Dict) -> Tuple[str, Dict]:
        """Create validated game pack specification"""
        
        # Validate inputs
        errors = self._validate_inputs(name, game_type, theme, params)
        if errors:
            raise ValueError(f"Validation failed: {', '.join(errors)}")
        
        # Generate ID
        pack_id = self._generate_id(name, theme)
        
        # Load theme config
        theme_config = self._load_theme(theme)
        
        # Build spec
        spec = {
            "pack_id": pack_id,
            "version": self.VERSION,
            "status": "draft",
            "created": datetime.now().isoformat(),
            "name": name,
            "game_type": game_type,
            "theme": theme,
            "theme_config": theme_config,
            "params": params,
            "modules": self._determine_modules(game_type, params),
            "validation": {"status": "pending", "errors": [], "warnings": []},
            "outputs": {}
        }
        
        # Save spec
        spec_path = SPEC_DIR / f"{pack_id}.json"
        spec_path.write_text(json.dumps(spec, indent=2))
        
        return pack_id, spec
    
    def validate_spec(self, pack_id: str) -> Dict:
        """Run validation rules on spec"""
        spec = self._load_spec(pack_id)
        errors = []
        warnings = []
        
        # Rule 1: Name uniqueness (handle missing keys gracefully)
        existing = list(SPEC_DIR.glob("*.json"))
        names = []
        for p in existing:
            try:
                data = json.loads(p.read_text())
                names.append(data.get("name", "unknown"))
            except:
                pass
        if names.count(spec["name"]) > 1:
            warnings.append(f"Name '{spec['name']}' exists in other packs")
        
        # Rule 2: Grid constraints
        params = spec.get("params", {})
        if spec["game_type"] == "slots":
            reels = params.get("reels", 5)
            rows = params.get("rows", 3)
            if reels > 6:
                warnings.append(f"{reels} reels may impact mobile performance")
            if reels * rows > 40:
                errors.append(f"Grid {reels}x{rows} = {reels*rows} symbols exceeds safe limit")
        
        # Rule 3: Asset count
        symbol_count = params.get("symbols", 10)
        if symbol_count < 6:
            errors.append("Minimum 6 symbols required for viable game")
        if symbol_count > 20:
            warnings.append(f"{symbol_count} symbols may increase load time")
        
        # Rule 4: Theme compatibility
        if spec["theme"] not in self.SUPPORTED_THEMES:
            errors.append(f"Theme '{spec['theme']}' not in supported list")
        
        # Update spec
        spec["validation"] = {
            "status": "failed" if errors else ("warning" if warnings else "passed"),
            "errors": errors,
            "warnings": warnings
        }
        self._save_spec(pack_id, spec)
        
        return spec["validation"]
    
    def approve(self, pack_id: str) -> bool:
        """Approve spec and create pack structure"""
        spec = self._load_spec(pack_id)
        
        # Must pass validation
        val = spec.get("validation", {})
        if val.get("status") == "failed":
            print(f"[ERROR] Cannot approve - validation failed: {val['errors']}")
            return False
        
        # Create pack directory structure
        pack_dir = PACKS_DIR / pack_id
        dirs = [
            pack_dir / "Scripts",
            pack_dir / "Resources",
            pack_dir / "Textures/Symbols",
            pack_dir / "Textures/Backgrounds", 
            pack_dir / "Textures/UI",
            pack_dir / "Audio/SFX",
            pack_dir / "Audio/Music",
            pack_dir / "Animation/Spine",
            pack_dir / "Prefabs"
        ]
        for d in dirs:
            d.mkdir(parents=True, exist_ok=True)
        
        spec["status"] = "approved"
        spec["outputs"]["pack_dir"] = str(pack_dir)
        self._save_spec(pack_id, spec)
        
        return True
    
    def build(self, pack_id: str) -> Dict:
        """Build all modules for pack"""
        spec = self._load_spec(pack_id)
        pack_dir = Path(spec["outputs"]["pack_dir"])
        
        results = {}
        
        # Build each required module
        for module in spec["modules"]:
            if module == "assets":
                results["assets"] = self._build_assets(spec, pack_dir)
            elif module == "grid":
                results["grid"] = self._build_grid(spec, pack_dir)
            elif module == "engine":
                results["engine"] = self._build_engine(spec, pack_dir)
            elif module == "audio":
                results["audio"] = self._build_audio(spec, pack_dir)
        
        spec["outputs"]["build_results"] = results
        spec["status"] = "built"
        self._save_spec(pack_id, spec)
        
        return results
    
    def package(self, pack_id: str, format: str = "zip") -> str:
        """Create distributable package"""
        spec = self._load_spec(pack_id)
        pack_dir = Path(spec["outputs"]["pack_dir"])
        
        if format == "zip":
            import zipfile
            zip_path = ZIPS_DIR / f"{pack_id}.zip"
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
                for file in pack_dir.rglob("*"):
                    if file.is_file():
                        arcname = str(file.relative_to(pack_dir))
                        zf.write(file, arcname)
            
            spec["outputs"]["package"] = str(zip_path)
            self._save_spec(pack_id, spec)
            return str(zip_path)
        
        return None
    
    def status(self, pack_id: str) -> Dict:
        """Get full pack status"""
        return self._load_spec(pack_id)
    
    def list_packs(self) -> List[Dict]:
        """List all packs with status"""
        packs = []
        for spec_file in SPEC_DIR.glob("*.json"):
            spec = json.loads(spec_file.read_text())
            packs.append({
                "id": spec["pack_id"],
                "name": spec["name"],
                "type": spec["game_type"],
                "theme": spec["theme"],
                "status": spec["status"],
                "validation": spec.get("validation", {}).get("status", "unknown")
            })
        return packs
    
    # Internal methods
    def _validate_inputs(self, name, game_type, theme, params) -> List[str]:
        errors = []
        if not name or len(name) < 3:
            errors.append("Name must be at least 3 characters")
        if game_type not in self.SUPPORTED_TYPES:
            errors.append(f"Type '{game_type}' not supported. Use: {', '.join(self.SUPPORTED_TYPES)}")
        if theme not in self.SUPPORTED_THEMES:
            errors.append(f"Theme '{theme}' not supported. Use: {', '.join(self.SUPPORTED_THEMES)}")
        return errors
    
    def _generate_id(self, name, theme):
        slug = name.lower().replace(" ", "-")[:20]
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        return f"{slug}-{theme}-{timestamp}"
    
    def _load_theme(self, theme):
        theme_path = Path(__file__).parent.parent / "themes" / f"{theme}.json"
        if theme_path.exists():
            return json.loads(theme_path.read_text())
        return {"error": f"Theme {theme} not found"}
    
    def _determine_modules(self, game_type, params):
        modules = ["assets", "grid", "engine"]
        if params.get("audio", True):
            modules.append("audio")
        return modules
    
    def _build_assets(self, spec, pack_dir):
        """Generate asset manifest with style enforcement"""
        from modules.assets.asset_builder import AssetBuilder
        builder = AssetBuilder()
        return builder.build(spec, pack_dir)
    
    def _build_grid(self, spec, pack_dir):
        """Generate grid configuration"""
        from modules.grid.grid_builder import GridBuilder
        builder = GridBuilder()
        return builder.build(spec, pack_dir)
    
    def _build_engine(self, spec, pack_dir):
        """Generate C# scripts"""
        from modules.engine.engine_builder import EngineBuilder
        builder = EngineBuilder()
        return builder.build(spec, pack_dir)
    
    def _build_audio(self, spec, pack_dir):
        """Generate audio manifest (placeholder - no external import)"""
        audio_path = pack_dir / "Resources" / "audio_manifest.json"
        audio_config = {
            "pack_id": spec["pack_id"],
            "sfx": [
                {"id": "spin_start", "type": "spin", "duration": 0.5},
                {"id": "spin_stop", "type": "mechanical", "duration": 0.3},
                {"id": "win_small", "type": "coin", "duration": 1.0},
                {"id": "win_big", "type": "celebration", "duration": 3.0},
                {"id": "bonus_trigger", "type": "fanfare", "duration": 2.0}
            ],
            "music": [
                {"id": "bgm_main", "type": "ambient", "duration": 120, "loop": True},
                {"id": "bgm_bonus", "type": "intense", "duration": 90, "loop": True}
            ]
        }
        audio_path.parent.mkdir(parents=True, exist_ok=True)
        audio_path.write_text(json.dumps(audio_config, indent=2))
        return {"manifest_path": str(audio_path), "sfx_count": 5, "music_count": 2}
    
    def _load_spec(self, pack_id):
        spec_path = SPEC_DIR / f"{pack_id}.json"
        return json.loads(spec_path.read_text())
    
    def _save_spec(self, pack_id, spec):
        spec_path = SPEC_DIR / f"{pack_id}.json"
        spec_path.write_text(json.dumps(spec, indent=2))

if __name__ == "__main__":
    import argparse
    
    pm = PackManager()
    
    parser = argparse.ArgumentParser(description="VPC Pack Manager")
    subparsers = parser.add_subparsers(dest="command")
    
    # Create command
    create_parser = subparsers.add_parser("create", help="Create new pack spec")
    create_parser.add_argument("--name", required=True)
    create_parser.add_argument("--type", required=True, choices=pm.SUPPORTED_TYPES)
    create_parser.add_argument("--theme", required=True, choices=pm.SUPPORTED_THEMES)
    create_parser.add_argument("--reels", type=int, default=5)
    create_parser.add_argument("--rows", type=int, default=3)
    create_parser.add_argument("--symbols", type=int, default=12)
    create_parser.add_argument("--paylines", type=int, default=20)
    
    # Other commands
    subparsers.add_parser("validate", help="Validate spec")
    subparsers.add_parser("approve", help="Approve and create structure")
    subparsers.add_parser("build", help="Build all modules")
    subparsers.add_parser("package", help="Create package")
    subparsers.add_parser("list", help="List all packs")
    
    args = parser.parse_args()
    
    if args.command == "create":
        params = {"reels": args.reels, "rows": args.rows, "symbols": args.symbols, "paylines": args.paylines}
        pack_id, spec = pm.create_spec(args.name, args.type, args.theme, params)
        print(f"\n[CREATED] {pack_id}")
        print(f"  Name: {spec['name']}")
        print(f"  Type: {spec['game_type']} | Theme: {spec['theme']}")
        print(f"  Params: {spec['params']}")
        print(f"  Spec: {SPEC_DIR}/{pack_id}.json")
    
    elif args.command == "list":
        for pack in pm.list_packs():
            status_icon = "✓" if pack["validation"] == "passed" else ("⚠" if pack["validation"] == "warning" else "✗")
            print(f"{status_icon} [{pack['status']:8}] {pack['id']}: {pack['name']} ({pack['type']}/{pack['theme']})")
