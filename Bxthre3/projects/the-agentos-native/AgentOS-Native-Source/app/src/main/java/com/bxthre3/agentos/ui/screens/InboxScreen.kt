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
import androidx.navigation.NavHostController
import com.bxthre3.agentos.data.repository.agentOSRepository
import com.bxthre3.agentos.domain.model.*

@Composable
fun InboxScreen(nav: NavHostController) {
    var bundle by remember { mutableStateOf<AndroidBundle?>(null) }
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("All", "P0/P1", "Archived")

    LaunchedEffect(Unit) {
        agentOSRepository.getBundle().collect { it.onSuccess { bundle = it } }
    }

    val allItems = remember(bundle) {
        val escalations = bundle?.escalations ?: emptyList()
        val workQueue = bundle?.workQueue ?: emptyList()
        escalations.map { e ->
            InboxItem(
                id = e.id,
                from = e.agentId,
                subject = e.issue.take(60),
                body = "Priority: ${e.priority} · ${e.hoursOpen}h open · Status: ${e.status}",
                priority = e.priority,
                time = "${e.hoursOpen}h ago",
                isRead = e.status in listOf("resolved", "closed")
            )
        } + workQueue.map { w ->
            InboxItem(
                id = w.id,
                from = w.agentId,
                subject = w.task.take(60),
                body = "Status: ${w.status} · Created: ${w.created}",
                priority = w.priority,
                time = w.created,
                isRead = w.status in listOf("done", "completed")
            )
        }
    }

    val filtered = remember(selectedTab, allItems) {
        when (selectedTab) {
            1 -> allItems.filter { it.priority in listOf("P0", "P1", "P0", "P1") }
            2 -> allItems.filter { it.isRead }
            else -> allItems
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Inbox", fontSize = 24.sp, fontWeight = FontWeight.Bold)
        Text("${allItems.count { !it.isRead }} unread · ${allItems.size} total items",
            fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
        Spacer(modifier = Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            tabs.forEachIndexed { idx, tab ->
                FilterChip(
                    selected = selectedTab == idx,
                    onClick = { selectedTab = idx },
                    label = { Text(tab, fontSize = 12.sp) }
                )
            }
        }
        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(filtered) { item -> InboxCard(item) }
        }
    }
}

data class InboxItem(
    val id: String,
    val from: String,
    val subject: String,
    val body: String,
    val priority: String,
    val time: String,
    val isRead: Boolean
)

@Composable
fun InboxCard(item: InboxItem) {
    val priorityColor = when (item.priority) {
        "P0", "P1" -> Color(0xFFEF4444)
        else -> Color(0xFFFBBF24)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (item.isRead) MaterialTheme.colorScheme.surface
            else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.1f)
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.Top) {
            Box(
                modifier = Modifier.size(40.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primary),
                contentAlignment = Alignment.Center
            ) {
                Text(item.from.first().uppercase().toString(), color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(item.from, fontSize = 14.sp, fontWeight = if (!item.isRead) FontWeight.Bold else FontWeight.Medium)
                    Text(item.time, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(item.subject, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))
                Spacer(modifier = Modifier.height(2.dp))
                Text(item.body, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f), maxLines = 2)
            }
            Spacer(modifier = Modifier.width(8.dp))
            Box(modifier = Modifier.clip(RoundedCornerShape(4.dp)).background(priorityColor.copy(alpha = 0.15f)).padding(horizontal = 6.dp, vertical = 2.dp)) {
                Text(item.priority, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = priorityColor)
            }
        }
    }
}
