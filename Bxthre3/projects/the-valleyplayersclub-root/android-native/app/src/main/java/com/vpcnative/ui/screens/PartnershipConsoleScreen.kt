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
fun PartnershipConsoleScreen(nav: androidx.navigation.NavController) {
    val partners = listOf(
        Triple("Marty's Bar & Grill", "Active", "$1,240/mo"),
        Triple("Monte Vista Liquor", "Active", "$890/mo"),
        Triple("SLV Farm Supply", "Pending", "$450/mo")
    )
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Partnership Console", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(12.dp)) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceEvenly) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) { Text("$2,580", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary); Text("Total MRR", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) }
                Column(horizontalAlignment = Alignment.CenterHorizontally) { Text("3", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary); Text("Partners", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) }
                Column(horizontalAlignment = Alignment.CenterHorizontally) { Text("847", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary); Text("Signups", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) }
            }
        }
        Spacer(modifier = Modifier.height(20.dp))
        Text("Active Partners", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        Spacer(modifier = Modifier.height(12.dp))
        LazyColumn {
            items(partners.size) { i ->
                val (name, status, rev) = partners[i]
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Column { Text(name, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Medium); Text(status, fontSize = 12.sp, color = if (status == "Active") AccentGreen else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)) }
                        Text(rev, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}
