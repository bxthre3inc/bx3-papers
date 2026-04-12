using UnityEngine;
using System.Collections.Generic;

namespace VPC.Games.gold-rush-slots-20260407-090030
{
    /// <summary>
    /// Auto-generated slot game controller for Gold Rush Slots
    /// Theme: western | Grid: 5x3
    /// </summary>
    public class SlotGameController : VPC.Games.Slots.SlotGameController
    {
        [Header("Game Configuration")]
        [SerializeField] private GameConfig config;
        
        private readonly int REELS = 5;
        private readonly int ROWS = 3;
        
        void Start()
        {
            InitializeGrid(REELS, ROWS);
            LoadSymbolSet("gold-rush-slots-20260407-090030");
        }
        
        protected override void OnSpinComplete()
        {
            EvaluatePaylines(5);
        }
    }
}