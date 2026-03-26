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
fun OrgChartScreen(
    nav: NavHostController,
    vm: SharedAgentOSViewModel = hiltViewModel()
) {
    val bundle by vm.bundle.collectAsState()
    val agents = bundle?.agents ?: emptyList()
    val humans = agents.filter { it.type == "human" }
    val aiAgents = agents.filter { it.type == "ai" }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Org Chart", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text("${agents.size} agents · Human + AI workforce", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
        Spacer(modifier = Modifier.height(20.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            item { Text("Leadership", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary) }
            items(humans) { agent -> OrgCard(agent, null) { nav.navigate(Screen.AgentDetail.createRoute(agent.id)) } }

            item { Spacer(modifier = Modifier.height(8.dp)); Text("AI Agents", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary) }

            aiAgents.groupBy { it.department }.forEach { (dept, members) ->
                item { Text(dept.replaceFirstChar { it.uppercase() }, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f), modifier = Modifier.padding(top = 8.dp)) }
                items(members) { agent -> OrgCard(agent, agent.managerId) { nav.navigate(Screen.AgentDetail.createRoute(agent.id)) } }
            }
        }
    }
}

@Composable
fun OrgCard(agent: Agent, reportsTo: String?, onClick: () -> Unit) {
    val isHuman = agent.type == "human"
    val avatarColor = if (isHuman) Color(0xFF6366F1) else Color(0xFF22D3EE)

    Card(
        modifier = Modifier.fillMaxWidth().clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(40.dp).clip(CircleShape).background(avatarColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    if (isHuman) Icons.Default.Person else Icons.Default.SmartToy,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(agent.name, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(modifier = Modifier.clip(RoundedCornerShape(4.dp)).background(avatarColor.copy(alpha = 0.15f)).padding(horizontal = 5.dp, vertical = 1.dp)) {
                        Text(agent.type.uppercase(), fontSize = 9.sp, fontWeight = FontWeight.Bold, color = avatarColor)
                    }
                }
                Text("${agent.role} · ${agent.department}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                reportsTo?.let { Text("Reports to: $it", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)) }
            }
            Column(horizontalAlignment = Alignment.End) {
                val statusColor = when (agent.status) {
                    AgentStatus.ACTIVE -> Color(0xFF34D399)
                    AgentStatus.IDLE -> Color(0xFFFBBF24)
                    AgentStatus.OFFLINE -> Color(0xFF6B7280)
                    AgentStatus.ERROR -> Color(0xFFF87171)
                    else -> Color(0xFF6B7280)
                }
                Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(statusColor))
                Spacer(modifier = Modifier.height(4.dp))
                Text(agent.status.name, fontSize = 10.sp, color = statusColor)
            }
        }
    }
}
