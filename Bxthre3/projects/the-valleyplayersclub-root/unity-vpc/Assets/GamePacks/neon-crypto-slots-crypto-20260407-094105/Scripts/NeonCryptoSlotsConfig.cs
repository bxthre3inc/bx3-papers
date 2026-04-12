using UnityEngine;

namespace VPC.Games.neon-crypto-slots-crypto-20260407-094105
{
    /// <summary>
    /// Configuration asset for Neon Crypto Slots
    /// </summary>
    [CreateAssetMenu(fileName = "NeonCryptoSlotsConfig", menuName = "VPC/NeonCryptoSlots Config")]
    public class NeonCryptoSlotsConfig : ScriptableObject
    {
        [Header("Game Metadata")]
        public string packId = "neon-crypto-slots-crypto-20260407-094105";
        public string gameName = "Neon Crypto Slots";
        public string theme = "crypto";
        
        [Header("Game Parameters")]
        public int reels = 6;
        public int rows = 4;
        public int paylines = 25;
        public int symbolCount = 15;
        
        [Header("Theme Configuration")]
        public string styleAnchor = "";
        public Color[] themePalette = new Color[]
        {
            new Color(1, 1, 1)  // Default white
        };
        
        [Header("Payout Configuration")]
        public float minBet = 0.10f;
        public float maxBet = 100.0f;
        public float rtp = 0.96f;  // Target return to player
        
        [Header("Volatility")]
        public VolatilityLevel volatility = VolatilityLevel.Medium;
        
        public enum VolatilityLevel { Low, Medium, High }
    }
}