#!/usr/bin/env python3
"""
Grid Builder Module
Generates grid configurations for different game types
"""

import json
from pathlib import Path
from typing import Dict, List

class GridBuilder:
    """Generates game-specific grid configurations"""
    
    def build(self, spec: Dict, pack_dir: Path) -> Dict:
        """Build grid configuration based on game type"""
        
        game_type = spec["game_type"]
        params = spec.get("params", {})
        
        if game_type == "slots":
            return self._build_slots_grid(spec, params, pack_dir)
        elif game_type == "shooter":
            return self._build_shooter_grid(spec, params, pack_dir)
        elif game_type == "match3":
            return self._build_match3_grid(spec, params, pack_dir)
        elif game_type == "crash":
            return self._build_crash_config(spec, params, pack_dir)
        elif game_type == "plinko":
            return self._build_plinko_grid(spec, params, pack_dir)
        
        return {"error": f"Unknown game type: {game_type}"}
    
    def _build_slots_grid(self, spec, params, pack_dir: Path) -> Dict:
        """Build reel-based slot grid"""
        
        reels = params.get("reels", 5)
        rows = params.get("rows", 3)
        paylines = params.get("paylines", 20)
        
        # Generate payline patterns
        payline_patterns = self._generate_paylines(reels, rows, paylines)
        
        grid_config = {
            "type": "slots",
            "reels": reels,
            "rows": rows,
            "total_symbols": reels * rows,
            "paylines": {
                "count": paylines,
                "patterns": payline_patterns
            },
            "reel_stops": [32] * reels,  # Virtual stops per reel
            "grid_size": [reels * 128, rows * 128],  # Pixel dimensions
            "symbol_size": [128, 128],
            "animation_config": {
                "spin_duration": 2.0,
                "stop_delay": 0.1,
                "anticipation_length": 3
            }
        }
        
        return self._save_config(grid_config, pack_dir, "grid_config.json")
    
    def _build_shooter_grid(self, spec, params, pack_dir: Path) -> Dict:
        """Build shooter spawn path grid"""
        
        grid_config = {
            "type": "shooter",
            "field_size": [1920, 1080],
            "spawn_paths": [
                {"name": "left_arc", "points": [[0, 540], [480, 270], [960, 540], [1440, 810], [1920, 540]]},
                {"name": "right_arc", "points": [[1920, 540], [1440, 270], [960, 540], [480, 810], [0, 540]]},
                {"name": "top_wave", "points": [[0, 0], [480, 200], [960, 100], [1440, 200], [1920, 0]]},
                {"name": "bottom_wave", "points": [[0, 1080], [480, 880], [960, 980], [1440, 880], [1920, 1080]]},
                {"name": "circle", "points": [[960, 540], [760, 340], [960, 140], [1160, 340], [960, 540]]}
            ],
            "spawn_zones": {
                "left": {"x": [0, 200], "y": [0, 1080]},
                "right": {"x": [1720, 1920], "y": [0, 1080]},
                "top": {"x": [0, 1920], "y": [0, 200]},
                "bottom": {"x": [0, 1920], "y": [880, 1080]}
            },
            "collision_config": {
                "bullet_speed": 800,
                "hit_radius": 30,
                "target_hit_box": [60, 40]
            }
        }
        
        return self._save_config(grid_config, pack_dir, "grid_config.json")
    
    def _build_match3_grid(self, spec, params, pack_dir: Path) -> Dict:
        """Build match-3 board grid"""
        
        width = params.get("width", 8)
        height = params.get("height", 8)
        
        grid_config = {
            "type": "match3",
            "width": width,
            "height": height,
            "total_cells": width * height,
            "symbol_set_size": 6,
            "colors": ["red", "blue", "green", "yellow", "purple", "orange"],
            "match_rules": {
                "min_match": 3,
                "max_match": 5,
                "cascades": True,
                "gravity": "down"
            },
            "special_pieces": {
                "line_horizontal": "4-match horizontal",
                "line_vertical": "4-match vertical",
                "bomb": "5-match L/T shape",
                "rainbow": "5-match straight"
            },
            "cell_size": [100, 100],
            "board_size": [width * 100, height * 100]
        }
        
        return self._save_config(grid_config, pack_dir, "grid_config.json")
    
    def _build_crash_config(self, spec, params, pack_dir: Path) -> Dict:
        """Build crash game configuration"""
        
        grid_config = {
            "type": "crash",
            "multiplier_config": {
                "min": 1.0,
                "max": 1000.0,
                "house_edge": 0.01
            },
            "animation_config": {
                "rocket_curve": "easeOutQuad",
                "crash_effect": "explosion",
                "graph_duration": 10.0
            },
            "betting": {
                "auto_cashout_enabled": True,
                "double_bet": True,
                "max_players_visible": 10
            }
        }
        
        return self._save_config(grid_config, pack_dir, "grid_config.json")
    
    def _build_plinko_grid(self, spec, params, pack_dir: Path) -> Dict:
        """Build Plinko board configuration"""
        
        grid_config = {
            "type": "plinko",
            "board_size": [800, 1000],
            "rows": 12,
            "pegs_per_row": [5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6],
            "multiplier_slots": [0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 5.0, 2.0, 1.0, 0.5, 0.2],
            "ball_config": {
                "size": 20,
                "physics": "bouncy",
                "gravity": 9.8
            },
            "risk_levels": {
                "low": {"multipliers": [0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 1.5, 1.2, 1.0, 0.8, 0.5]},
                "medium": {"multipliers": [0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 5.0, 2.0, 1.0, 0.5, 0.2]},
                "high": {"multipliers": [0.1, 0.2, 0.5, 1.0, 5.0, 25.0, 5.0, 1.0, 0.5, 0.2, 0.1]}
            }
        }
        
        return self._save_config(grid_config, pack_dir, "grid_config.json")
    
    def _generate_paylines(self, reels: int, rows: int, count: int) -> List[List[int]]:
        """Generate payline patterns"""
        
        # Standard payline patterns for 5x3
        standard_patterns = [
            # Row-based (horizontal)
            [1, 1, 1, 1, 1],  # Middle row
            [0, 0, 0, 0, 0],  # Top row
            [2, 2, 2, 2, 2],  # Bottom row
            # V-patterns
            [0, 1, 2, 1, 0],
            [2, 1, 0, 1, 2],
            # W-patterns
            [0, 0, 1, 2, 2],
            [2, 2, 1, 0, 0],
            [1, 0, 0, 0, 1],
            [1, 2, 2, 2, 1],
            # Diagonal
            [0, 1, 1, 1, 0],
            [2, 1, 1, 1, 2],
            [0, 0, 1, 0, 0],
            [2, 2, 1, 2, 2],
            # Zigzag
            [1, 0, 1, 0, 1],
            [1, 2, 1, 2, 1],
            [0, 1, 0, 1, 0],
            [2, 1, 2, 1, 2],
            [0, 1, 2, 1, 0],
            [2, 1, 0, 1, 2],
        ]
        
        # Return requested count or all available
        return standard_patterns[:min(count, len(standard_patterns))]
    
    def _save_config(self, config: Dict, pack_dir: Path, filename: str) -> Dict:
        """Save grid config to JSON"""
        
        config_path = pack_dir / "Resources" / filename
        config_path.parent.mkdir(parents=True, exist_ok=True)
        config_path.write_text(json.dumps(config, indent=2))
        
        return {
            "config_path": str(config_path),
            "type": config["type"],
            "summary": f"{config.get('reels', config.get('width', 'N/A'))}x{config.get('rows', config.get('height', 'N/A'))} grid"
        }
