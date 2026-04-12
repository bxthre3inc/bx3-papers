using UnityEngine;
namespace VPC.Games.jungle_jewels_jungle_20260407_100346 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(5, 3);
    }
}