package com.vpcnative.ui.screens
import com.vpcnative.ui.theme.*

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun RewardsScreen(nav: androidx.navigation.NavController) {
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Rewards", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(20.dp))

        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(16.dp)) {
            Column(modifier = Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("🏆", fontSize = 48.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text("MaterialTheme.colorScheme.primary Member", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text("4,250 / 5,000 Points", fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                Spacer(modifier = Modifier.height(12.dp))
                Box(modifier = Modifier.fillMaxWidth().height(8.dp).background(MaterialTheme.colorScheme.background, RoundedCornerShape(4.dp))) {
                    Box(modifier = Modifier.fillMaxWidth(0.85f).fillMaxHeight().background(MaterialTheme.colorScheme.primary, RoundedCornerShape(4.dp)))
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text("750 more points to Platinum! →", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
        Text("Redeem Rewards", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        Spacer(modifier = Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            val rewards = listOf(
                Triple("⭐ 500 Bonus Credits", "1,000 pts", true),
                Triple("🎰 50 Free Spins", "2,500 pts", true),
                Triple("💰 5% Cashback", "5,000 pts", false),
                Triple("👑 VIP Access Pass", "10,000 pts", false),
                Triple("🏨 Luxury Trip Package", "50,000 pts", false)
            )
            items(rewards.size) { i ->
                val (name, pts, unlocked) = rewards[i]
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text(name, color = if (unlocked) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontWeight = FontWeight.Medium)
                        Text(pts, color = if (unlocked) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
