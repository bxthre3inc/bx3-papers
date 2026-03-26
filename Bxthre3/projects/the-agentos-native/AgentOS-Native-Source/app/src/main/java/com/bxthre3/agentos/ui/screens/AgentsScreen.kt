package com.bxthre3.agentos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.bxthre3.agentos.domain.model.*
import com.bxthre3.agentos.ui.SharedAgentOSViewModel
import com.bxthre3.agentos.ui.navigation.Screen

@Composable
fun AgentsScreen(
    nav: NavHostController,
    vm: SharedAgentOSViewModel = hiltViewModel()
) {
    val bundle by vm.bundle.collectAsState()
    val agents = bundle?.agents ?: emptyList()
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Active", "Idle", "Offline")

    val filtered = when (selectedFilter) {
        "Active" -> agents.filter { it.status == AgentStatus.ACTIVE }
        "Idle" -> agents.filter { it.status == AgentStatus.IDLE }
        "Offline" -> agents.filter { it.status == AgentStatus.OFFLINE }
        else -> agents
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Agents", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text(
            "${agents.size} total · ${agents.count { it.status == AgentStatus.ACTIVE }} active",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            filters.forEach { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter, fontSize = 12.sp) }
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(filtered) { agent ->
                AgentCard(agent) { nav.navigate(Screen.AgentDetail.createRoute(agent.id)) }
            }
        }
    }
}
