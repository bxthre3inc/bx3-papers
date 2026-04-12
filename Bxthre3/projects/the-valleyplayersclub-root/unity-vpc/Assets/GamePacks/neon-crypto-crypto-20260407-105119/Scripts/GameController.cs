using UnityEngine;
namespace VPC.Games.neon_crypto_crypto_20260407_105119 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(6, 3);
    }
}