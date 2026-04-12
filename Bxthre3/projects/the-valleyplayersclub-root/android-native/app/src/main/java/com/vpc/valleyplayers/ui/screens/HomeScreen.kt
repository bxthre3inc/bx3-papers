package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vpc.valleyplayers.data.api.VPCApiService

@Composable
fun HomeScreen(token: String, onLogout: () -> Unit, onNavigate: (String) -> Unit) {
    var gc by remember { mutableStateOf(0.0) }
    var sweepstakes by remember { mutableStateOf(0.0) }
    var sweepC by remember { mutableStateOf(0.0) }

    LaunchedEffect(token) {
        VPCApiService.getWallet(token) { g, s, cc -> gc = g; sweepstakes = s; sweepC = cc }
    }

    Column(modifier = Modifier.fillMaxSize().background(androidx.compose.ui.graphics.Color(0xFF0D0015)).padding(16.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Column { Text("Valley Players Club", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = 0xFFFFD700.toInt().let { androidx.compose.ui.graphics.Color(it) }); Text("Welcome back", fontSize = 12.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700)) }
            TextButton(onClick = onLogout) { Text("Logout", color = androidx.compose.ui.graphics.Color(0xFFFF6B6B)) }
        }

        Spacer(Modifier.height(24.dp))

        Card(modifier = Modifier.fillMaxWidth().height(120.dp), shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF6B21A8))) {
            Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.Center) {
                Text("Gold Coins", fontSize = 12.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
                Text("$${String.format("%.2f", gc)}", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                Text("Sweepstakes: $${String.format("%.2f", sweepstakes)} | SC:${String.format("%.0f", sweepC)}", fontSize = 11.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
            }
        }

        Spacer(Modifier.height(24.dp))

        Text("Quick Actions", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700), modifier = Modifier.padding(bottom = 12.dp))

        listOf(
            "\uD83D\uDCB5 Wallet" to "wallet",
            "\uD83C\uDFB2 Games" to "games",
            "\uD83D\uDC64 Profile" to "profile"
        ).forEach { (label, route) ->
            Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable { onNavigate(route) }, shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF1A0033))) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(label, fontSize = 16.sp, fontWeight = FontWeight.Medium, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                }
            }
        }
    }
}
