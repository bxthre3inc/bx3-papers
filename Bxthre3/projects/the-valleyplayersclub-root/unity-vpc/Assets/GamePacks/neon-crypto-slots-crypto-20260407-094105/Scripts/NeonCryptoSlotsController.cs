using UnityEngine;
using System.Collections.Generic;

namespace VPC.Games.neon-crypto-slots-crypto-20260407-094105
{
    /// <summary>
    /// Auto-generated slots controller for Neon Crypto Slots
    /// Theme: crypto | Pack: neon-crypto-slots-crypto-20260407-094105
    /// </summary>
    public class NeonCryptoSlotsController : VPC.Games.Slots.SlotGameController
    {
        [Header("Game Configuration")]
        [SerializeField] private NeonCryptoSlotsConfig config;
        
        [Header("Grid Settings")]
        [SerializeField] private int reels = 6;
        [SerializeField] private int rows = 4;
        
        [Header("Asset References")]
        [SerializeField] private Sprite[] symbolSprites;
        [SerializeField] private Sprite[] backgroundSprites;
        
        // Runtime state
        private bool isSpinning = false;
        private float currentBet = 1.0f;
        private float totalWin = 0f;
        
        void Start()
        {
            InitializeGame();
        }
        
        private void InitializeGame()
        {
            LoadConfig("neon-crypto-slots-crypto-20260407-094105");
            InitializeGrid(reels, rows);
            LoadSymbolSet(packId);
            SetupPaylines(config.paylines);
            
            #if UNITY_EDITOR
            Debug.Log("[neon-crypto-slots-crypto-20260407-094105] NeonCryptoSlots initialized");
            #endif
        }
        
        public override void OnSpinStart()
        {
            if (isSpinning) return;
            isSpinning = true;
            
            StartReelSpin(reels);
        }
        
        public override void OnSpinComplete()
        {
            isSpinning = false;
            
            EvaluateWin();
        }
        
        protected override void EvaluateWin()
        {
            float win = EvaluatePaylines(config.paylines);
            totalWin += win;
        }
        
        // Test interface for automated validation
        public bool RunSelfTest()
        {
            return config != null && symbolSprites.Length > 0;
        }
        
        public Dictionary<string, object> GetGameState()
        {
            return new Dictionary<string, object>()
            {
                { "isSpinning", isSpinning },
                { "currentBet", currentBet },
                { "totalWin", totalWin },
                { "symbolsLoaded", symbolSprites?.Length ?? 0 }
            };
        }
    }
}