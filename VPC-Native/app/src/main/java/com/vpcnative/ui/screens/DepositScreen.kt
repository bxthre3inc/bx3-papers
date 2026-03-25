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
fun DepositScreen(nav: androidx.navigation.NavController) {
    var amount by remember { mutableStateOf("") }
    val presets = listOf("$25", "$50", "$100", "$250", "$500")
    val methods = listOf("💳 Credit/Debit Card", "🏦 ACH Bank Transfer", "📱 Cash App", "💵 Cash at Partner Location")
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Deposit", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Text("Select Amount", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            presets.forEach { preset ->
                Card(
                    modifier = Modifier.clickable { amount = preset.replace("$", "") },
                    colors = CardDefaults.cardColors(containerColor = if (amount == preset.replace("$", "")) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(8.dp)
                ) { Text(preset, modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp), fontSize = 12.sp, color = if (amount == preset.replace("$", "")) MaterialTheme.colorScheme.background else MaterialTheme.colorScheme.onSurface) }
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = amount, onValueChange = { amount = it },
            label = { Text("Amount") }, modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = MaterialTheme.colorScheme.primary, focusedLabelColor = MaterialTheme.colorScheme.primary)
        )
        Spacer(modifier = Modifier.height(24.dp))
        Text("Payment Method", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        Spacer(modifier = Modifier.height(12.dp))
        LazyColumn {
            items(methods.size) { i ->
                Card(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).clickable { nav.popBackStack(); nav.popBackStack() },
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(10.dp)
                ) { Text(methods[i], modifier = Modifier.padding(16.dp), color = MaterialTheme.colorScheme.onSurface) }
            }
        }
    }
}
