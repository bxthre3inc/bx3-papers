package com.bxthre3.agentos.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.bxthre3.agentos.data.repository.agentOSRepository
import com.bxthre3.agentos.domain.model.*
import com.bxthre3.agentos.ui.navigation.Screen

@Composable
fun SettingsScreen(nav: NavHostController) {
    var darkMode by remember { mutableStateOf(true) }
    var notifications by remember { mutableStateOf(true) }
    var soundEnabled by remember { mutableStateOf(true) }
    var bundle by remember { mutableStateOf<AndroidBundle?>(null) }
    LaunchedEffect(Unit) { agentOSRepository.getBundle().collect { it.onSuccess { bundle = it } } }

    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        item { Text("Settings", fontSize = 24.sp, fontWeight = FontWeight.Bold); Spacer(modifier = Modifier.height(8.dp)) }

        item { SettingsSection("Appearance") }
        item { SettingsToggle("Dark Mode", "Follow system theme", Icons.Default.DarkMode, darkMode) { darkMode = it } }

        item { SettingsSection("Notifications") }
        item { SettingsToggle("Push Notifications", "Agent alerts and updates", Icons.Default.Notifications, notifications) { notifications = it } }
        item { SettingsToggle("Sound", "Task completion sounds", Icons.Default.VolumeUp, soundEnabled) { soundEnabled = it } }

        item { SettingsSection("Connected Services") }
        bundle?.integrations?.filter { it.status == IntegrationStatus.CONNECTED || it.status == IntegrationStatus.ACTIVE }?.forEach { i ->
            item { SettingsItem(i.name, "Connected", Icons.Default.CheckCircle, Color(0xFF34D399)) }
        }
        bundle?.integrations?.filter { it.status == IntegrationStatus.NOT_CONNECTED }?.forEach { i ->
            item { SettingsItem(i.name, "Not connected", Icons.Default.CloudOff, Color(0xFF6B7280)) }
        }

        item { SettingsSection("Account") }
        item { SettingsItem("brodiblanco", "Founder & CEO · brodiblanco.zo.computer", Icons.Default.Person, Color(0xFF6366F1)) }

        item { SettingsSection("AgentOS") }
        item { SettingsItem("AgentOS Native v1.0.0", "Built with Kotlin + Jetpack Compose", Icons.Default.Info, Color(0xFF6B7280)) }
        item { SettingsItem("API", "brodiblanco.zo.space/api/agentos", Icons.Default.Cloud, Color(0xFF22D3EE)) }
        item { SettingsItem("Version", bundle?.version ?: "—", Icons.Default.Build, Color(0xFF6B7280)) }

        item { Spacer(modifier = Modifier.height(16.dp)) }
        item { Button(onClick = { nav.navigate(Screen.Dashboard.route) }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp)) { Text("Back to Dashboard") } }
    }
}

@Composable
fun SettingsSection(title: String) {
    Text(title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary, modifier = Modifier.padding(vertical = 4.dp))
}

@Composable
fun SettingsToggle(title: String, subtitle: String, icon: androidx.compose.ui.graphics.vector.ImageVector, checked: Boolean, onToggle: (Boolean) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(10.dp)) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) { Text(title, fontSize = 14.sp); Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)) }
            Switch(checked = checked, onCheckedChange = onToggle)
        }
    }
}

@Composable
fun SettingsItem(title: String, subtitle: String, icon: androidx.compose.ui.graphics.vector.ImageVector, iconColor: Color) {
    Card(modifier = Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(10.dp)) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, tint = iconColor)
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) { Text(title, fontSize = 14.sp); Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)) }
        }
    }
}
