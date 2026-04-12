using UnityEngine;
using UnityEngine.Assertions;

namespace VPC.Games.neon-crypto-slots-crypto-20260407-094105
{
    /// <summary>
    /// Automated test harness for Neon Crypto Slots
    /// Run via Test Runner or attach to scene object
    /// </summary>
    public class NeonCryptoSlotsTests : MonoBehaviour
    {
        public NeonCryptoSlotsController controller;
        public NeonCryptoSlotsConfig config;
        
        [ContextMenu("Run All Tests")]
        public bool RunAllTests()
        {
            bool passed = true;
            
            passed &= TestConfigLoaded();
            passed &= TestGridDimensions();
            passed &= TestSymbolCount();
            passed &= TestControllerState();
            
            Debug.Log($"[{config?.packId ?? "UNKNOWN"}] Tests: {(passed ? "PASSED" : "FAILED")}");
            return passed;
        }
        
        bool TestConfigLoaded()
        {
            Assert.IsNotNull(config, "Config not assigned");
            Assert.AreEqual("neon-crypto-slots-crypto-20260407-094105", config.packId, "Pack ID mismatch");
            return true;
        }
        
        bool TestGridDimensions()
        {
            Assert.AreEqual(6, config.reels, "Reel count mismatch");
            Assert.AreEqual(4, config.rows, "Row count mismatch");
            return true;
        }
        
        bool TestSymbolCount()
        {
            Assert.GreaterOrEqual(config.symbolCount, 6, "Too few symbols");
            Assert.LessOrEqual(config.symbolCount, 20, "Too many symbols");
            return true;
        }
        
        bool TestControllerState()
        {
            if (controller == null) return true;  // May not be in scene yet
            
            var state = controller.GetGameState();
            Assert.IsNotNull(state, "Controller returned null state");
            return true;
        }
    }
}