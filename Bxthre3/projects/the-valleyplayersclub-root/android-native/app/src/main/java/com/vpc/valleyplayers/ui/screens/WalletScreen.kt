package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
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
fun WalletScreen(token: String, onBack: () -> Unit) {
    var gc by remember { mutableStateOf(0.0) }
    var sweepstakes by remember { mutableStateOf(0.0) }
    var sweepC by remember { mutableStateOf(0.0) }
    var depositAmt by remember { mutableStateOf("20") }
    var redeemAmt by remember { mutableStateOf("") }
    var msg by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(false) }

    LaunchedEffect(token) {
        VPCApiService.getWallet(token) { g, s, cc -> gc = g; sweepstakes = s; sweepC = cc }
    }

    Column(modifier = Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(androidx.compose.ui.graphics.Color(0xFF0D0015), androidx.compose.ui.graphics.Color(0xFF1A0033)))).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack) { Text("< Back", color = androidx.compose.ui.graphics.Color(0xFFFFD700)) }
            Spacer(Modifier.width(8.dp))
            Text("Wallet", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
        }

        Spacer(Modifier.height(24.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF6B21A8))) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("\uD83D\uDCB0", fontSize = 32.sp)
                    Text("Gold Coins", fontSize = 11.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
                    Text("$${String.format("%.2f", gc)}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                }
            }
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF6B21A8))) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("\uD83C\uDFC6", fontSize = 32.sp)
                    Text("Sweepstakes", fontSize = 11.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
                    Text("$${String.format("%.2f", sweepstakes)}", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                }
            }
            Card(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.ui.graphics.Color(0xFF6B21A8))) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("$", fontSize = 32.sp, color = androidx.compose.ui.graphics.Color(0xFF22C55E))
                    Text("SC Coins", fontSize = 11.sp, color = androidx.compose.ui.graphics.Color(0x80FFD700))
                    Text(String.format("%.0f", sweepC), fontSize = 20.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
                }
            }
        }

        Spacer(Modifier.height(32.dp))

        Text("Deposit", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
        Spacer(Modifier.height(8.dp))
        Row {
            OutlinedTextField(value = depositAmt, onValueChange = { depositAmt = it }, modifier = Modifier.weight(1f), singleLine = true, prefix = { Text("$") }, colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = androidx.compose.ui.graphics.Color(0xFF6B21A8)))
            Spacer(Modifier.width(8.dp))
            Button(onClick = {
                loading = true; msg = null
                VPCApiService.deposit(token, depositAmt.toDoubleOrNull() ?: 0.0, "card") { ok, m ->
                    loading = false; msg = if (ok) "Deposit successful!" else m
                    if (ok) VPCApiService.getWallet(token) { g, s, cc -> gc = g; sweepstakes = s; sweepC = cc }
                }
            }, modifier = Modifier.height(56.dp), enabled = !loading, colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.ui.graphics.Color(0xFF22C55E))) {
                Text("Buy GC", fontWeight = FontWeight.Bold)
            }
        }

        Spacer(Modifier.height(24.dp))

        Text("Redeem SC", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = androidx.compose.ui.graphics.Color(0xFFFFD700))
        Spacer(Modifier.height(8.dp))
        Row {
            OutlinedTextField(value = redeemAmt, onValueChange = { redeemAmt = it }, modifier = Modifier.weight(1f), singleLine = true, prefix = { Text("$") }, colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = androidx.compose.ui.graphics.Color(0xFF6B21A8)))
            Spacer(Modifier.width(8.dp))
            Button(onClick = {
                loading = true; msg = null
                VPCApiService.redeem(token, redeemAmt.toDoubleOrNull() ?: 0.0) { ok, m ->
                    loading = false; msg = if (ok) "Redeem request submitted!" else m
                }
            }, modifier = Modifier.height(56.dp), enabled = !loading, colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.ui.graphics.Color(0xFFEF4444))) {
                Text("Redeem", fontWeight = FontWeight.Bold)
            }
        }

        if (msg != null) {
            Spacer(Modifier.height(16.dp))
            Text(msg!!, fontSize = 14.sp, color = androidx.compose.ui.graphics.Color(0xFF22C55E))
        }
    }
}
