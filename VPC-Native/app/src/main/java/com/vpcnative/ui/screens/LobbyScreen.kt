package com.vpcnative.ui.screens
import com.vpcnative.ui.theme.*

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LobbyScreen(nav: androidx.navigation.NavController) {
    val tableGames = listOf(
        Triple("VIP Blackjack", "Min $25", "🃏"), Triple("Texas Hold'em", "Min $50", "🂡"),
        Triple("Lightning Roulette", "Min $10", "🎡"), Triple("Baccarat Pro", "Min $25", "💳"),
        Triple("Three Card Poker", "Min $15", "🃏"), Triple("Ultimate Texas", "Min $25", "🂡")
    )
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Live Casino Lobby", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(16.dp))
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary), shape = RoundedCornerShape(12.dp)) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column { Text("Dealer Online Now", fontSize = 13.sp, color = MaterialTheme.colorScheme.background); Text("12 tables open", fontSize = 11.sp, color = MaterialTheme.colorScheme.background.copy(alpha = 0.8f)) }
                Button(onClick = {}, colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.background), shape = RoundedCornerShape(8.dp)) { Text("Join Now", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold) }
            }
        }
        Spacer(modifier = Modifier.height(20.dp))
        LazyVerticalGrid(columns = GridCells.Fixed(2), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(tableGames) { (name, min, icon) ->
                Card(modifier = Modifier.fillMaxWidth().clickable { }, colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(12.dp)) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(icon, fontSize = 28.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(name, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Medium)
                        Text(min, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(onClick = {}, modifier = Modifier.fillMaxWidth().height(32.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary), shape = RoundedCornerShape(6.dp)) { Text("Sit", fontSize = 11.sp, color = MaterialTheme.colorScheme.background, fontWeight = FontWeight.Bold) }
                    }
                }
            }
        }
    }
}
