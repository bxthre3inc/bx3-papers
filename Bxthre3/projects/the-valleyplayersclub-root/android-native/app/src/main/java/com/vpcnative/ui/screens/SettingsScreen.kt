package com.vpcnative.ui.screens
import com.vpcnative.ui.theme.*

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
fun SettingsScreen(nav: androidx.navigation.NavController) {
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Settings", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        LazyColumn {
            val items = listOf(
                "🔔 Notifications" to "notifications",
                "🔐 Security" to "",
                "💳 Payment Methods" to "",
                "📜 Legal" to "",
                "📜 Privacy Policy" to "",
                "📜 Terms of Service" to "",
                "📱 App Version 1.0.0" to ""
            )
            items(items.size) { i ->
                val (label, _) = items[i]
                Card(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable { if (label.contains("Notifications")) nav.navigate("notifications") },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(label, color = MaterialTheme.colorScheme.onSurface)
                        if (label.contains("Notifications")) Text("→", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) else Text("v1.0.0", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    }
                }
            }
        }
    }
}
