#!/usr/bin/env python3
"""
Asset Builder Module
Generates asset manifests with strict style enforcement
"""

import json
from pathlib import Path
from typing import Dict, List

class AssetBuilder:
    """Generates complete asset manifests for game packs"""
    
    def build(self, spec: Dict, pack_dir: Path) -> Dict:
        """Build complete asset manifest"""
        
        theme_config = spec["theme_config"]
        style_anchor = theme_config.get("style_anchor", "")
        palette = theme_config.get("palette", [])
        
        assets = {
            "metadata": {
                "pack_id": spec["pack_id"],
                "theme": spec["theme"],
                "style_anchor": style_anchor,
                "palette": palette,
                "total_count": 0
            },
            "symbols": [],
            "backgrounds": [],
            "ui": [],
            "spine": [],
            "audio": []
        }
        
        # Generate symbols based on rarity distribution
        symbols = self._generate_symbols(spec, style_anchor, palette)
        assets["symbols"] = symbols
        
        # Generate backgrounds
        backgrounds = self._generate_backgrounds(spec, style_anchor, palette)
        assets["backgrounds"] = backgrounds
        
        # Generate UI kit
        ui = self._generate_ui(spec, style_anchor, palette)
        assets["ui"] = ui
        
        # Generate Spine animations (specs only)
        spine = self._generate_spine(spec, style_anchor, palette)
        assets["spine"] = spine
        
        # Calculate total
        assets["metadata"]["total_count"] = sum(len(v) for v in [
            assets["symbols"], assets["backgrounds"], 
            assets["ui"], assets["spine"]
        ])
        
        # Save manifest
        manifest_path = pack_dir / "Resources" / "asset_manifest.json"
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps(assets, indent=2))
        
        # Save generation script
        self._save_generation_script(assets, pack_dir)
        
        return {
            "manifest_path": str(manifest_path),
            "symbol_count": len(symbols),
            "background_count": len(backgrounds),
            "ui_count": len(ui),
            "spine_count": len(spine)
        }
    
    def _generate_symbols(self, spec, style_anchor, palette) -> List[Dict]:
        """Generate slot/shooter symbols with rarity tiers"""
        
        params = spec.get("params", {})
        symbol_count = params.get("symbols", 12)
        
        # Standard rarity distribution
        distribution = {
            "low": max(3, int(symbol_count * 0.4)),
            "medium": max(3, int(symbol_count * 0.3)),
            "high": max(2, int(symbol_count * 0.2)),
            "special": 1,  # Wild
            "bonus": 1     # Scatter/Bonus
        }
        
        # Adjust to hit exact count
        while sum(distribution.values()) < symbol_count:
            distribution["medium"] += 1
        while sum(distribution.values()) > symbol_count:
            distribution["medium"] = max(0, distribution["medium"] - 1)
        
        symbols = []
        idx = 0
        
        rarity_configs = {
            "low": ("basic symbol", "simple design"),
            "medium": ("valuable symbol", "detailed design"),
            "high": ("premium symbol", "intricate ornate design"),
            "special": ("WILD symbol", "shimmering magical"),
            "bonus": ("BONUS scatter", "explosive glowing")
        }
        
        for rarity, count in distribution.items():
            for i in range(count):
                desc, design = rarity_configs[rarity]
                symbol = {
                    "id": f"symbol_{idx:02d}",
                    "type": "symbol",
                    "rarity": rarity,
                    "filename": f"symbol_{idx:02d}.png",
                    "path": f"Textures/Symbols/symbol_{idx:02d}.png",
                    "size": [128, 128],
                    "prompt": f"slot symbol {idx}, {rarity} rarity, {desc}, {design}, {style_anchor}, transparent background, casino game asset, crisp 2D",
                    "aspect_ratio": "1:1"
                }
                symbols.append(symbol)
                idx += 1
        
        return symbols
    
    def _generate_backgrounds(self, spec, style_anchor, palette) -> List[Dict]:
        """Generate game backgrounds"""
        
        backgrounds = [
            {
                "id": "bg_main",
                "type": "background",
                "filename": "bg_main.png",
                "path": "Textures/Backgrounds/bg_main.png",
                "size": [1920, 1080],
                "prompt": f"game background, main scene, {style_anchor}, immersive environment, no UI elements, game background art, 16:9 composition",
                "aspect_ratio": "16:9"
            },
            {
                "id": "bg_bonus",
                "type": "background",
                "filename": "bg_bonus.png",
                "path": "Textures/Backgrounds/bg_bonus.png",
                "size": [1920, 1080],
                "prompt": f"game background, bonus round scene, {style_anchor}, special event atmosphere, glowing effects, no UI elements, 16:9 composition",
                "aspect_ratio": "16:9"
            }
        ]
        
        return backgrounds
    
    def _generate_ui(self, spec, style_anchor, palette) -> List[Dict]:
        """Generate UI button and panel assets"""
        
        ui_elements = [
            ("btn_spin", "SPIN button, round, main action button"),
            ("btn_max_bet", "MAX BET button, high stakes, aggressive"),
            ("btn_auto", "AUTO PLAY button, continuous, flowing"),
            ("btn_bet_up", "BET UP arrow, increase"),
            ("btn_bet_down", "BET DOWN arrow, decrease"),
            ("btn_settings", "SETTINGS gear icon"),
            ("btn_home", "HOME house icon"),
            ("panel_frame", "game frame border, decorative edge"),
            ("panel_menu", "menu panel, clean background"),
            ("icon_coin", "coin/credit icon, currency"),
            ("icon_win", "win amount display, celebration"),
            ("icon_info", "information icon, help")
        ]
        
        ui = []
        for name, desc in ui_elements:
            element = {
                "id": name,
                "type": "ui",
                "filename": f"{name}.png",
                "path": f"Textures/UI/{name}.png",
                "size": [256, 256],
                "prompt": f"{desc}, {style_anchor}, casino UI element, transparent background, game asset",
                "aspect_ratio": "1:1"
            }
            ui.append(element)
        
        return ui
    
    def _generate_spine(self, spec, style_anchor, palette) -> List[Dict]:
        """Generate Spine animation specs"""
        
        spine_chars = [
            {
                "id": "char_dealer",
                "name": "Game Dealer/Host",
                "type": "spine_character",
                "prompt": f"casino dealer character, animated, {style_anchor}, friendly expression, game host",
                "animations": ["idle", "celebrate", "announce"]
            },
            {
                "id": "char_mascot",
                "name": "Lucky Mascot",
                "type": "spine_character",
                "prompt": f"lucky mascot character, cute, {style_anchor}, bouncy, celebratory",
                "animations": ["idle", "dance", "win"]
            }
        ]
        
        return spine_chars
    
    def _save_generation_script(self, assets: Dict, pack_dir: Path):
        """Save shell script for asset generation"""
        
        script_lines = ["#!/bin/bash", "# Auto-generated asset generation script", ""]
        
        for symbol in assets["symbols"]:
            script_lines.append(f'# Symbol: {symbol["id"]}')
            script_lines.append(f'# Prompt: {symbol["prompt"]}')
            script_lines.append(f'# Output: {pack_dir}/{symbol["path"]}')
            script_lines.append('')
        
        for bg in assets["backgrounds"]:
            script_lines.append(f'# Background: {bg["id"]}')
            script_lines.append(f'# Prompt: {bg["prompt"]}')
            script_lines.append(f'# Output: {pack_dir}/{bg["path"]}')
            script_lines.append('')
        
        script_path = pack_dir / "generate_assets.sh"
        script_path.write_text("\n".join(script_lines))
        script_path.chmod(0o755)
