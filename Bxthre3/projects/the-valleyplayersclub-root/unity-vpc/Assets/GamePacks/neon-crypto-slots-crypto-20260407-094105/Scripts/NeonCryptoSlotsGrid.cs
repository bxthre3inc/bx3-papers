using UnityEngine;

namespace VPC.Games.neon-crypto-slots-crypto-20260407-094105
{
    /// <summary>
    /// Grid/board setup for Neon Crypto Slots
    /// </summary>
    public class NeonCryptoSlotsGrid : MonoBehaviour
    {
        [Header("Grid Dimensions")]
        public int width = 6;
        public int height = 4;
        public float cellSize = 128f;
        public float spacing = 10f;
        
        [Header("References")]
        public GameObject symbolPrefab;
        public Transform gridContainer;
        
        private GameObject[,] gridCells;
        
        void Awake()
        {
            InitializeGrid();
        }
        
        private void InitializeGrid()
        {
            gridCells = new GameObject[width, height];
            
            float totalWidth = width * (cellSize + spacing) - spacing;
            float totalHeight = height * (cellSize + spacing) - spacing;
            Vector3 startPos = new Vector3(-totalWidth / 2 + cellSize / 2, totalHeight / 2 - cellSize / 2, 0);
            
            for (int x = 0; x < width; x++)
            {
                for (int y = 0; y < height; y++)
                {
                    Vector3 pos = startPos + new Vector3(x * (cellSize + spacing), -y * (cellSize + spacing), 0);
                    gridCells[x, y] = Instantiate(symbolPrefab, pos, Quaternion.identity, gridContainer);
                    gridCells[x, y].name = $"Cell_{x}_{y}";
                }
            }
        }
    }
}