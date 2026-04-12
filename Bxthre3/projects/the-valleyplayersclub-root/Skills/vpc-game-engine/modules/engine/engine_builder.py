#!/usr/bin/env python3
"""
Engine Builder Module
Generates Unity C# scripts for VPC game packs
"""

import json
from pathlib import Path
from typing import Dict

class EngineBuilder:
    """Generates Unity game controller scripts"""
    
    def build(self, spec: Dict, pack_dir: Path) -> Dict:
        """Build all C# scripts for game pack"""
        
        game_type = spec["game_type"]
        pack_id = spec["pack_id"]
        safe_name = self._safe_class_name(spec["name"])
        
        scripts = {}
        
        # Main game controller
        scripts["controller"] = self._generate_controller(spec, safe_name, pack_dir)
        
        # Game configuration ScriptableObject
        scripts["config"] = self._generate_config(spec, safe_name, pack_dir)
        
        # Symbol configuration
        scripts["symbols"] = self._generate_symbol_config(spec, safe_name, pack_dir)
        
        # Grid/Game board setup (if applicable)
        if game_type in ["slots", "match3"]:
            scripts["grid"] = self._generate_grid_setup(spec, safe_name, pack_dir)
        
        # Test harness
        scripts["test"] = self._generate_test_harness(spec, safe_name, pack_dir)
        
        return {
            "scripts_created": list(scripts.keys()),
            "script_paths": scripts,
            "game_type": game_type,
            "inherits_from": f"VPC.Games.{self._base_class(game_type)}"
        }
    
    def _generate_controller(self, spec: Dict, safe_name: str, pack_dir: Path) -> str:
        """Generate main game controller"""
        
        game_type = spec["game_type"]
        pack_id = spec["pack_id"]
        base_class = self._base_class(game_type)
        
        # Game-specific initialization
        if game_type == "slots":
            init_code = self._slots_init(spec)
        elif game_type == "shooter":
            init_code = self._shooter_init(spec)
        elif game_type == "match3":
            init_code = self._match3_init(spec)
        else:
            init_code = "// Default initialization"
        
        cs_code = f'''using UnityEngine;
using System.Collections.Generic;

namespace VPC.Games.{pack_id}
{{
    /// <summary>
    /// Auto-generated {game_type} controller for {spec["name"]}
    /// Theme: {spec["theme"]} | Pack: {pack_id}
    /// </summary>
    public class {safe_name}Controller : VPC.Games.{base_class}
    {{
        [Header("Game Configuration")]
        [SerializeField] private {safe_name}Config config;
        
        [Header("Grid Settings")]
        {self._grid_fields(spec)}
        
        [Header("Asset References")]
        [SerializeField] private Sprite[] symbolSprites;
        [SerializeField] private Sprite[] backgroundSprites;
        
        // Runtime state
        private bool isSpinning = false;
        private float currentBet = 1.0f;
        private float totalWin = 0f;
        
        void Start()
        {{
            InitializeGame();
        }}
        
        private void InitializeGame()
        {{
            LoadConfig("{pack_id}");
            {init_code}
            
            #if UNITY_EDITOR
            Debug.Log("[{pack_id}] {safe_name} initialized");
            #endif
        }}
        
        public override void OnSpinStart()
        {{
            if (isSpinning) return;
            isSpinning = true;
            
            {self._spin_start_code(spec)}
        }}
        
        public override void OnSpinComplete()
        {{
            isSpinning = false;
            
            {self._spin_complete_code(spec)}
        }}
        
        protected override void EvaluateWin()
        {{
            {self._win_evaluation(spec)}
        }}
        
        // Test interface for automated validation
        public bool RunSelfTest()
        {{
            return config != null && symbolSprites.Length > 0;
        }}
        
        public Dictionary<string, object> GetGameState()
        {{
            return new Dictionary<string, object>()
            {{
                {{ "isSpinning", isSpinning }},
                {{ "currentBet", currentBet }},
                {{ "totalWin", totalWin }},
                {{ "symbolsLoaded", symbolSprites?.Length ?? 0 }}
            }};
        }}
    }}
}}'''
        
        path = pack_dir / "Scripts" / f"{safe_name}Controller.cs"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(cs_code)
        return str(path)
    
    def _generate_config(self, spec: Dict, safe_name: str, pack_dir: Path) -> str:
        """Generate ScriptableObject config"""
        
        params = spec.get("params", {})
        theme_config = spec.get("theme_config", {})
        palette = theme_config.get("palette", [])
        
        cs_code = f'''using UnityEngine;

namespace VPC.Games.{spec["pack_id"]}
{{
    /// <summary>
    /// Configuration asset for {spec["name"]}
    /// </summary>
    [CreateAssetMenu(fileName = "{safe_name}Config", menuName = "VPC/{safe_name} Config")]
    public class {safe_name}Config : ScriptableObject
    {{
        [Header("Game Metadata")]
        public string packId = "{spec["pack_id"]}";
        public string gameName = "{spec["name"]}";
        public string theme = "{spec["theme"]}";
        
        [Header("Game Parameters")]
        public int reels = {params.get("reels", 5)};
        public int rows = {params.get("rows", 3)};
        public int paylines = {params.get("paylines", 20)};
        public int symbolCount = {params.get("symbols", 12)};
        
        [Header("Theme Configuration")]
        public string styleAnchor = "{theme_config.get("style_anchor", "")}";
        public Color[] themePalette = new Color[]
        {{
            {self._palette_to_colors(palette)}
        }};
        
        [Header("Payout Configuration")]
        public float minBet = 0.10f;
        public float maxBet = 100.0f;
        public float rtp = 0.96f;  // Target return to player
        
        [Header("Volatility")]
        public VolatilityLevel volatility = VolatilityLevel.Medium;
        
        public enum VolatilityLevel {{ Low, Medium, High }}
    }}
}}'''
        
        path = pack_dir / "Scripts" / f"{safe_name}Config.cs"
        path.write_text(cs_code)
        return str(path)
    
    def _generate_symbol_config(self, spec: Dict, safe_name: str, pack_dir: Path) -> str:
        """Generate symbol definition script"""
        
        cs_code = f'''using UnityEngine;

namespace VPC.Games.{spec["pack_id"]}
{{
    /// <summary>
    /// Symbol definitions for {spec["name"]}
    /// </summary>
    public static class {safe_name}Symbols
    {{
        public static readonly string[] SymbolIds = new string[]
        {{
            {self._symbol_array(spec)}
        }};
        
        public static readonly string[] RarityTiers = new string[]
            {{ "low", "medium", "high", "special", "bonus" }};
        
        public static float GetPayoutMultiplier(string symbolId)
        {{
            // Map symbol IDs to payout multipliers
            switch (symbolId)
            {{
                case "symbol_00": return 1.0f;
                case "symbol_01": return 1.0f;
                case "symbol_02": return 1.0f;
                case "symbol_03": return 2.0f;
                case "symbol_04": return 2.0f;
                case "symbol_05": return 5.0f;
                case "symbol_06": return 10.0f;
                case "symbol_07": return 25.0f;  // Wild
                case "symbol_08": return 0.0f;   // Scatter triggers bonus
                default: return 1.0f;
            }}
        }}
    }}
}}'''
        
        path = pack_dir / "Scripts" / f"{safe_name}Symbols.cs"
        path.write_text(cs_code)
        return str(path)
    
    def _generate_grid_setup(self, spec: Dict, safe_name: str, pack_dir: Path) -> str:
        """Generate grid/board setup script"""
        
        params = spec.get("params", {})
        
        cs_code = f'''using UnityEngine;

namespace VPC.Games.{spec["pack_id"]}
{{
    /// <summary>
    /// Grid/board setup for {spec["name"]}
    /// </summary>
    public class {safe_name}Grid : MonoBehaviour
    {{
        [Header("Grid Dimensions")]
        public int width = {params.get("reels", params.get("width", 5))};
        public int height = {params.get("rows", params.get("height", 3))};
        public float cellSize = 128f;
        public float spacing = 10f;
        
        [Header("References")]
        public GameObject symbolPrefab;
        public Transform gridContainer;
        
        private GameObject[,] gridCells;
        
        void Awake()
        {{
            InitializeGrid();
        }}
        
        private void InitializeGrid()
        {{
            gridCells = new GameObject[width, height];
            
            float totalWidth = width * (cellSize + spacing) - spacing;
            float totalHeight = height * (cellSize + spacing) - spacing;
            Vector3 startPos = new Vector3(-totalWidth / 2 + cellSize / 2, totalHeight / 2 - cellSize / 2, 0);
            
            for (int x = 0; x < width; x++)
            {{
                for (int y = 0; y < height; y++)
                {{
                    Vector3 pos = startPos + new Vector3(x * (cellSize + spacing), -y * (cellSize + spacing), 0);
                    gridCells[x, y] = Instantiate(symbolPrefab, pos, Quaternion.identity, gridContainer);
                    gridCells[x, y].name = $"Cell_{{x}}_{{y}}";
                }}
            }}
        }}
    }}
}}'''
        
        path = pack_dir / "Scripts" / f"{safe_name}Grid.cs"
        path.write_text(cs_code)
        return str(path)
    
    def _generate_test_harness(self, spec: Dict, safe_name: str, pack_dir: Path) -> str:
        """Generate automated test script"""
        
        cs_code = f'''using UnityEngine;
using UnityEngine.Assertions;

namespace VPC.Games.{spec["pack_id"]}
{{
    /// <summary>
    /// Automated test harness for {spec["name"]}
    /// Run via Test Runner or attach to scene object
    /// </summary>
    public class {safe_name}Tests : MonoBehaviour
    {{
        public {safe_name}Controller controller;
        public {safe_name}Config config;
        
        [ContextMenu("Run All Tests")]
        public bool RunAllTests()
        {{
            bool passed = true;
            
            passed &= TestConfigLoaded();
            passed &= TestGridDimensions();
            passed &= TestSymbolCount();
            passed &= TestControllerState();
            
            Debug.Log($"[{{config?.packId ?? "UNKNOWN"}}] Tests: {{(passed ? "PASSED" : "FAILED")}}");
            return passed;
        }}
        
        bool TestConfigLoaded()
        {{
            Assert.IsNotNull(config, "Config not assigned");
            Assert.AreEqual("{spec["pack_id"]}", config.packId, "Pack ID mismatch");
            return true;
        }}
        
        bool TestGridDimensions()
        {{
            Assert.AreEqual({spec["params"].get("reels", 5)}, config.reels, "Reel count mismatch");
            Assert.AreEqual({spec["params"].get("rows", 3)}, config.rows, "Row count mismatch");
            return true;
        }}
        
        bool TestSymbolCount()
        {{
            Assert.GreaterOrEqual(config.symbolCount, 6, "Too few symbols");
            Assert.LessOrEqual(config.symbolCount, 20, "Too many symbols");
            return true;
        }}
        
        bool TestControllerState()
        {{
            if (controller == null) return true;  // May not be in scene yet
            
            var state = controller.GetGameState();
            Assert.IsNotNull(state, "Controller returned null state");
            return true;
        }}
    }}
}}'''
        
        path = pack_dir / "Scripts" / f"{safe_name}Tests.cs"
        path.write_text(cs_code)
        return str(path)
    
    # Helper methods
    def _safe_class_name(self, name: str) -> str:
        """Convert name to safe C# class name"""
        import re
        safe = re.sub(r'[^a-zA-Z0-9]', '', name.replace(" ", ""))
        return safe[:30]  # Limit length
    
    def _base_class(self, game_type: str) -> str:
        """Get base class for game type"""
        classes = {
            "slots": "Slots.SlotGameController",
            "shooter": "Shooter.ShooterGameController",
            "match3": "Match3.Match3GameController",
            "crash": "Crash.CrashGameController",
            "plinko": "Plinko.PlinkoGameController"
        }
        return classes.get(game_type, "GameController")
    
    def _grid_fields(self, spec: Dict) -> str:
        params = spec.get("params", {})
        return f"[SerializeField] private int reels = {params.get('reels', 5)};\n        [SerializeField] private int rows = {params.get('rows', 3)};"
    
    def _slots_init(self, spec: Dict) -> str:
        return '''InitializeGrid(reels, rows);
            LoadSymbolSet(packId);
            SetupPaylines(config.paylines);'''
    
    def _shooter_init(self, spec: Dict) -> str:
        return '''InitializeSpawnPaths();
            SetupCannons(4);
            LoadTargets(packId);'''
    
    def _match3_init(self, spec: Dict) -> str:
        return '''InitializeBoard(width, height);
            LoadPieceSet(packId);
            SetupMatchRules();'''
    
    def _spin_start_code(self, spec: Dict) -> str:
        if spec["game_type"] == "slots":
            return "StartReelSpin(reels);"
        return "// Game-specific spin start"
    
    def _spin_complete_code(self, spec: Dict) -> str:
        if spec["game_type"] == "slots":
            return "EvaluateWin();"
        return "// Game-specific completion"
    
    def _win_evaluation(self, spec: Dict) -> str:
        if spec["game_type"] == "slots":
            return "float win = EvaluatePaylines(config.paylines);\n            totalWin += win;"
        return "// Game-specific win evaluation"
    
    def _palette_to_colors(self, palette: list) -> str:
        if not palette:
            return "new Color(1, 1, 1)  // Default white"
        colors = []
        for hex_color in palette[:5]:
            hex_color = hex_color.lstrip("#")
            r = int(hex_color[0:2], 16) / 255.0
            g = int(hex_color[2:4], 16) / 255.0
            b = int(hex_color[4:6], 16) / 255.0
            colors.append(f"new Color({r:.2f}f, {g:.2f}f, {b:.2f}f)")
        return ",\n            ".join(colors)
    
    def _symbol_array(self, spec: Dict) -> str:
        count = spec["params"].get("symbols", 12)
        ids = [f'"symbol_{i:02d}"' for i in range(count)]
        return ",\n            ".join(ids)
