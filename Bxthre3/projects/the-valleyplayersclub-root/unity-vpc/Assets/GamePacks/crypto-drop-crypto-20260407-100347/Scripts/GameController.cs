using UnityEngine;
namespace VPC.Games.crypto_drop_crypto_20260407_100347 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(5, 3);
    }
}