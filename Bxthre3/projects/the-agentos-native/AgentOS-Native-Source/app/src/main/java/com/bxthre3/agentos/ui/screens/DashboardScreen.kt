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
fun DashboardScreen(
    nav: NavHostController,
    vm: SharedAgentOSViewModel = hiltViewModel()
) {
    val bundle by vm.bundle.collectAsState()
    val isLoading by vm.isLoading.collectAsState()
    val error by vm.error.collectAsState()

    if (isLoading && bundle == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    val agents = bundle?.agents ?: emptyList()
    val metrics = bundle?.systemHealth?.let { sh ->
        WorkforceMetrics(
            totalAgents = sh.agentCount,
            activeAgents = sh.activeAgents,
            avgCompletionRate = agents.takeIf { it.isNotEmpty() }?.map { it.completionRate }?.average()?.toFloat() ?: 0f,
            totalTasks = bundle?.tasks?.size ?: 0,
            completedToday = bundle?.tasks?.count { it.status == TaskStatus.DONE } ?: 0,
            blockedTasks = bundle?.tasks?.count { it.status == TaskStatus.BLOCKED } ?: 0,
            openP1s = bundle?.tasks?.count { it.priority == TaskPriority.P0 || it.priority == TaskPriority.P1 } ?: 0
        )
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("AgentOS", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("Dashboard", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    bundle?.let { Text("v${it.version}", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)) }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    error?.let {
                        Icon(Icons.Default.Warning, contentDescription = "Error", tint = Color(0xFFF87171), modifier = Modifier.size(20.dp))
                    }
                    IconButton(onClick = { nav.navigate(Screen.Settings.route) }) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            }
        }

        metrics?.let { m ->
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    MetricCard("Active", "${m.activeAgents}/${m.totalAgents}", Icons.Default.Circle, Color(0xFF34D399), Modifier.weight(1f))
                    MetricCard("Completion", "${(m.avgCompletionRate * 100).toInt()}%", Icons.Default.CheckCircle, Color(0xFF22D3EE), Modifier.weight(1f))
                    MetricCard("Tasks", "${m.completedToday}/${m.totalTasks}", Icons.Default.Assignment, Color(0xFFFBBF24), Modifier.weight(1f))
                }
            }
            item {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    MetricCard("Blocked", "${m.blockedTasks}", Icons.Default.Block, Color(0xFFF87171), Modifier.weight(1f))
                    MetricCard("P1 Open", "${m.openP1s}", Icons.Default.Warning, Color(0xFFEF4444), Modifier.weight(1f))
                    MetricCard("Today Done", "${m.completedToday}", Icons.Default.Done, Color(0xFF34D399), Modifier.weight(1f))
                }
            }
        }

        bundle?.escalations?.takeIf { it.isNotEmpty() }?.let { escalations ->
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFEF4444).copy(alpha = 0.08f)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = Color(0xFFEF4444), modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Active Escalations", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFEF4444))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        escalations.take(3).forEach { e ->
                            Text("• ${e.issue.take(80)}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        }
                    }
                }
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("Recent Tasks", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                        TextButton(onClick = { nav.navigate(Screen.Tasks.route) }) { Text("View All") }
                    }
                    bundle?.tasks?.take(5)?.forEachIndexed { idx, task ->
                        TaskRow(task)
                        if (idx < minOf(4, (bundle?.tasks?.size ?: 1) - 1)) HorizontalDivider(modifier = Modifier.padding(.5.dp))
                    }
                }
            }
        }

        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                QuickActionCard("Workforce", "${agents.size} agents", Icons.Default.People, Modifier.weight(1f)) { nav.navigate(Screen.Workforce.route) }
                QuickActionCard("Org Chart", "Human + AI", Icons.Default.AccountTree, Modifier.weight(1f)) { nav.navigate(Screen.OrgChart.route) }
            }
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Active Agents", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(12.dp))
                    agents.filter { it.status == AgentStatus.ACTIVE }.take(6).chunked(3).forEach { row ->
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            row.forEach { agent ->
                                AgentAvatarChip(agent, Modifier.weight(1f)) { nav.navigate(Screen.AgentDetail.createRoute(agent.id)) }
                            }
                            repeat(3 - row.size) { Spacer(modifier = Modifier.weight(1f)) }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }

        bundle?.integrations?.take(4)?.let { ints ->
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Integrations", fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            ints.forEach { IntegrationChip(it, Modifier.weight(1f)) }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun IntegrationChip(integration: Integration, modifier: Modifier = Modifier) {
    val color = when (integration.status) {
        IntegrationStatus.CONNECTED, IntegrationStatus.ACTIVE -> Color(0xFF34D399)
        IntegrationStatus.PARTIAL -> Color(0xFFFBBF24)
        IntegrationStatus.NOT_CONNECTED -> Color(0xFF6B7280)
    }
    Column(modifier = modifier, horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier.size(32.dp).clip(CircleShape).background(color.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Text(integration.icon, fontSize = 14.sp)
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(integration.name, fontSize = 9.sp, maxLines = 1)
    }
}
