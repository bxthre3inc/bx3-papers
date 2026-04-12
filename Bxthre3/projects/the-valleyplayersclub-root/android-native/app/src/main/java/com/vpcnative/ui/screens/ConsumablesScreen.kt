package com.vpcnative.ui.screens

import androidx.compose.foundation.background
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
import com.vpcnative.ui.theme.*

@Composable
fun ConsumablesScreen(nav: androidx.navigation.NavController) {
    val items = listOf(
        Triple("Happy Hour Tokens", "2x tokens for 1 hour", "500 pts"),
        Triple("Pizza Party Pass", "Double XP all night", "750 pts"),
        Triple("Mystery Box", "Random reward 100-5000 pts", "250 pts"),
        Triple("Power-Up Pack", "+50% win chance for 30 min", "1,000 pts"),
        Triple("VIP Lounge Access", "Exclusive games & better odds", "5,000 pts"),
        Triple("Tournament Entry", "Weekly tournament seat", "2,500 pts")
    )
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Consumables", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        LazyVerticalGrid(columns = GridCells.Fixed(2), horizontalArrangement = Arrangement.spacedBy(10.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(items) { (name, desc, cost) ->
                Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(12.dp)) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(name, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(desc, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(cost, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
