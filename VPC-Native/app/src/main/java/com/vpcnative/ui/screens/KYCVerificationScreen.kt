package com.vpcnative.ui.screens
import com.vpcnative.ui.theme.*

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun KYCVerificationScreen(nav: androidx.navigation.NavController) {
    Column(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { nav.popBackStack() }) { Text("←", color = MaterialTheme.colorScheme.primary, fontSize = 22.sp) }
            Spacer(modifier = Modifier.width(8.dp))
            Text("KYC Verification", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(12.dp)) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text("Your Status", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Card(modifier = Modifier.weight(1f), colors = CardDefaults.cardColors(containerColor = AccentGreen.copy(alpha = 0.2f)), shape = RoundedCornerShape(8.dp)) { Text("✓ Email Verified", modifier = Modifier.padding(10.dp), fontSize = 12.sp, color = AccentGreen) }
                    Card(modifier = Modifier.weight(1f), colors = CardDefaults.cardColors(containerColor = AccentGreen.copy(alpha = 0.2f)), shape = RoundedCornerShape(8.dp)) { Text("✓ Phone Verified", modifier = Modifier.padding(10.dp), fontSize = 12.sp, color = AccentGreen) }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)), shape = RoundedCornerShape(8.dp)) { Text("⏳ ID Document — Pending Review", modifier = Modifier.padding(10.dp), fontSize = 12.sp, color = MaterialTheme.colorScheme.primary) }
            }
        }
        Spacer(modifier = Modifier.height(20.dp))
        Button(onClick = {}, modifier = Modifier.fillMaxWidth().height(48.dp), colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary), shape = RoundedCornerShape(10.dp)) { Text("Upload ID Document", color = MaterialTheme.colorScheme.background, fontWeight = FontWeight.Bold) }
    }
}
