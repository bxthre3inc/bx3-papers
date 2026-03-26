package com.bxthre3.agentos.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.navigation.NavHostController
import com.bxthre3.agentos.data.repository.agentOSRepository
import com.bxthre3.agentos.domain.model.*

@Composable
fun WorkforceScreen(nav: NavHostController) {
    var bundle by remember { mutableStateOf<AndroidBundle?>(null) }
    LaunchedEffect(Unit) { agentOSRepository.getBundle().collect { it.onSuccess { bundle = it } } }

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
            Text("Workforce", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Text("${agents.size} agents · Human + AI workforce", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
        }

        metrics?.let { m ->
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    WFMetricRow("Total Agents", "${m.totalAgents}", Icons.Default.SmartToy, Color(0xFF6366F1))
                    WFMetricRow("Active Agents", "${m.activeAgents}", Icons.Default.Circle, Color(0xFF34D399))
                    WFMetricRow("Avg Completion Rate", "${(m.avgCompletionRate * 100).toInt()}%", Icons.Default.CheckCircle, Color(0xFF22D3EE))
                    WFMetricRow("Total Tasks", "${m.totalTasks}", Icons.Default.Assignment, Color(0xFFFBBF24))
                    WFMetricRow("Completed Today", "${m.completedToday}", Icons.Default.Done, Color(0xFF34D399))
                    WFMetricRow("Blocked Tasks", "${m.blockedTasks}", Icons.Default.Block, Color(0xFFF87171))
                    WFMetricRow("Open P1s", "${m.openP1s}", Icons.Default.Warning, Color(0xFFEF4444))
                }
            }
        }

        if (agents.isNotEmpty()) {
            item { Text("By Department", fontSize = 16.sp, fontWeight = FontWeight.SemiBold) }
            item {
                val departments = agents.groupBy { it.department }.mapValues { it.value.size }
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    departments.forEach { (dept, count) ->
                        WFDeptCard(dept, count, agents.size)
                    }
                }
            }
        }
    }
}

@Composable
fun WFMetricRow(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector, color: Color) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(10.dp)
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(36.dp).clip(CircleShape).background(color.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(12.dp))
            Text(label, fontSize = 14.sp, modifier = Modifier.weight(1f))
            Text(value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
fun WFDeptCard(dept: String, count: Int, total: Int) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(10.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(dept.replaceFirstChar { it.uppercase() }, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                Text("$count agents", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
            }
            Spacer(modifier = Modifier.height(6.dp))
            LinearProgressIndicator(
                progress = { count.toFloat() / total },
                modifier = Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant,
            )
        }
    }
}
