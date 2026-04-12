using UnityEngine;

namespace VPC.Games.gold-rush-slots-20260407-090030
{
    [CreateAssetMenu(fileName = "gold-rush-slots-20260407-090030_Config", menuName = "VPC/Game Configs/Gold Rush Slots")]
    public class GameConfig : ScriptableObject
    {
        [Header("Grid Configuration")]
        public string gridType = "reel_strip";
        public int reels = 5;
        public int rows = 3;
        
        [Header("Visual Style")]
        public Color[] colorPalette = new Color[] { 
            new Color(0.8313725490196079f, 0.6862745098039216f, 0.21568627450980393f, 1f), new Color(0.5450980392156862f, 0.27058823529411763f, 0.07450980392156863f, 1f), new Color(0.9568627450980393f, 0.8941176470588236f, 0.7568627450980392f, 1f), new Color(0.803921568627451f, 0.5215686274509804f, 0.24705882352941178f, 1f), new Color(0.1843137254901961f, 0.09411764705882353f, 0.06274509803921569f, 1f)
        };
        
        [Header("Assets")]
        public string symbolSetId = "gold-rush-slots-20260407-090030";
        public string[] backgroundIds;
        public string[] uiIds;
    }
}