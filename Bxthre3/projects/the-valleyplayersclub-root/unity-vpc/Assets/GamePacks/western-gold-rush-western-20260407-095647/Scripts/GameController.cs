using UnityEngine;
namespace VPC.Games.western_gold_rush_western_20260407_095647 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(5, 3);
    }
}