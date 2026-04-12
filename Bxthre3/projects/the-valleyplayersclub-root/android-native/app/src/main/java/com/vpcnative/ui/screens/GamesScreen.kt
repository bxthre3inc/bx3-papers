package com.vpcnative.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun GamesScreen(nav: NavController) {
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Slots", "Table", "Instant Win", "Jackpot")

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Games", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.height(16.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(categories.size) { index ->
                val cat = categories[index]
                val selected = (cat == selectedCategory)
                Surface(
                    onClick = { selectedCategory = cat },
                    shape = RoundedCornerShape(16.dp),
                    color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface
                ) {
                    Text(
                        cat,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        color = if (selected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                        fontSize = 14.sp, fontWeight = FontWeight.Medium
                    )
                }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        val games = listOf(
            Triple("Mystic Jungle", "Slots", "high"),
            Triple("Golden Pharaoh", "Slots", "medium"),
            Triple("Lucky 7s", "Slots", "low"),
            Triple("Arctic Diamonds", "Instant Win", "high"),
            Triple("Jackpot Blitz", "Jackpot", "high"),
            Triple("Neon Nights", "Slots", "medium")
        )
        LazyVerticalGrid(columns = GridCells.Fixed(2), verticalArrangement = Arrangement.spacedBy(12.dp), horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxSize()) {
            items(games.size) { index ->
                val (name, category, _) = games[index]
                Card(
                    modifier = Modifier.aspectRatio(0.85f).clickable { nav.navigate("game/$index") },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Box(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(name, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(category, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        }
                    }
                }
            }
        }
    }
}
