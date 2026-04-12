package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
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
fun ProfileScreen(token: String, onLogout: () -> Unit) {
    var gc by remember { mutableStateOf(0.0) }
    var sweepstakes by remember { mutableStateOf(0.0) }
    var sweepC by remember { mutableStateOf(0.0) }

    LaunchedEffect(token) {
        VPCApiService.getWallet(token) { g, s, cc -> gc = g; sweepstakes = s; sweepC = cc }
    }

    Column(modifier = Modifier.fillMaxSize().background(androidx.compose.ui.graphics.Color(0xFF0D0015)).padding(16.dp)) {
        Text("Profile", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
        Spacer(Modifier.height(24.dp))
        Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
            Surface(modifier = Modifier.size(80.dp), shape = CircleShape, color = androidx.compose.ui.graphics.Color(0xFF6B21A8)) {
                Box(contentAlignment = Alignment.Center) { Text("\uD83D\uDC64", fontSize = 40.sp) }
            }
        }
        Spacer(Modifier.height(16.dp))
        Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Player", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                Text("Lifetime GC: $${String.format("%.2f", gc)}", fontSize = 14.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
            }
        }
        Spacer(Modifier.height(32.dp))
        Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF1A0033))) {
            Column(modifier = Modifier.padding(16.dp)) {
                listOf("Gold Coins" to "$${String.format("%.2f", gc)}", "Sweepstakes" to "$${String.format("%.2f", sweepstakes)}", "SC Coins" to String.format("%.0f", sweepC), "Account Status" to "Active").forEach { (label, value) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(label, fontSize = 14.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
                        Text(value, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                    }
                }
            }
        }
        Spacer(Modifier.weight(1f))
        Button(onClick = onLogout, modifier = Modifier.fillMaxWidth().height(52.dp), colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.ui.graphics.Color(0xFFEF4444))) {
            Text("Logout", fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}
