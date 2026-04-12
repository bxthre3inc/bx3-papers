using UnityEngine;

namespace VPC.Games.neon-crypto-slots-crypto-20260407-094105
{
    /// <summary>
    /// Symbol definitions for Neon Crypto Slots
    /// </summary>
    public static class NeonCryptoSlotsSymbols
    {
        public static readonly string[] SymbolIds = new string[]
        {
            "symbol_00",
            "symbol_01",
            "symbol_02",
            "symbol_03",
            "symbol_04",
            "symbol_05",
            "symbol_06",
            "symbol_07",
            "symbol_08",
            "symbol_09",
            "symbol_10",
            "symbol_11",
            "symbol_12",
            "symbol_13",
            "symbol_14"
        };
        
        public static readonly string[] RarityTiers = new string[]
            { "low", "medium", "high", "special", "bonus" };
        
        public static float GetPayoutMultiplier(string symbolId)
        {
            // Map symbol IDs to payout multipliers
            switch (symbolId)
            {
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
            }
        }
    }
}