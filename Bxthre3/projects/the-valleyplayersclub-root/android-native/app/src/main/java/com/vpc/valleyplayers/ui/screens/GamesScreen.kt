package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun GamesScreen(token: String, onBack: () -> Unit) {
    var games by remember { mutableStateOf<List<Map<String, String>>>(emptyList()) }

    LaunchedEffect(Unit) {
        VPCApiService.getGames { games = it }
    }

    Column(modifier = Modifier.fillMaxSize().background(androidx.compose.ui.graphics.Color(0xFF0D0015)).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack) { Text("< Back", color = androidx.compose.ui.graphics.Color(0xFFFFD700)) }
            Spacer(Modifier.width(8.dp))
            Text("Games", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
        }
        Spacer(Modifier.height(16.dp))
        LazyColumn {
            items(games) { game ->
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp).clickable { }, shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF1A0033))) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(game["emoji"] ?: "\uD83C\uDFB2", fontSize = 40.sp)
                        Spacer(Modifier.width(16.dp))
                        Column { Text(game["name"] ?: "", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700)); Text(game["desc"] ?: "", fontSize = 12.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700)) }
                    }
                }
            }
        }
    }
}
