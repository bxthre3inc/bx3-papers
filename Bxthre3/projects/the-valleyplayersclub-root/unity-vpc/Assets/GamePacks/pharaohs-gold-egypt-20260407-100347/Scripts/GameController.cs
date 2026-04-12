using UnityEngine;
namespace VPC.Games.pharaohs_gold_egypt_20260407_100347 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(6, 4);
    }
}