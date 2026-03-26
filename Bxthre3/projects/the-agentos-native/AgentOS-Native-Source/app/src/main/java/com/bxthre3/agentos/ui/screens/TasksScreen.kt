package com.bxthre3.agentos.ui.screens

import androidx.compose.foundation.background
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

@Composable
fun TasksScreen(
    nav: NavHostController,
    vm: SharedAgentOSViewModel = hiltViewModel()
) {
    val bundle by vm.bundle.collectAsState()
    val tasks = bundle?.tasks ?: emptyList()
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "P0/P1", "In Progress", "Done", "Blocked")

    val filtered = when (selectedFilter) {
        "P0/P1" -> tasks.filter { it.priority == TaskPriority.P0 || it.priority == TaskPriority.P1 }
        "In Progress" -> tasks.filter { it.status == TaskStatus.IN_PROGRESS }
        "Done" -> tasks.filter { it.status == TaskStatus.DONE }
        "Blocked" -> tasks.filter { it.status == TaskStatus.BLOCKED }
        else -> tasks
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Tasks", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text("${tasks.size} total · ${tasks.count { it.status == TaskStatus.IN_PROGRESS }} in progress",
            fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
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
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { task -> TaskCard(task) }
        }
    }
}
