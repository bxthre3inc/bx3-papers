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
fun NotificationsScreen(nav: androidx.navigation.NavController) {
    val notifications = listOf(
        Triple("🏆 Leaderboard Update", "You moved to #3!", "2h ago"),
        Triple("🎁 Rewards Unlocked", "500 bonus credits available", "5h ago"),
        Triple("💰 Withdrawal Complete", "$200 sent to your account", "1d ago"),
        Triple("🎰 Lucky Win!", "You won $75 on Lucky 7s", "2d ago")
    )
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Notifications", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        LazyColumn {
            items(notifications.size) { i ->
                val (title, body, time) = notifications[i]
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth().padding(14.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column(modifier = Modifier.weight(1f)) { Text(title, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Medium); Text(body, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) }
                        Text(time, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    }
                }
            }
        }
    }
}
