using UnityEngine;
namespace VPC.Games.space_hunter_space_20260407_100346 {
    public class GameController : VPC.Core.GameControllerBase {
        [SerializeField] private GridConfig grid;
        void Start() => Initialize(5, 3);
    }
}