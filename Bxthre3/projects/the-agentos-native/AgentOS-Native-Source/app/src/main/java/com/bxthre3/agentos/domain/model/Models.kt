package com.bxthre3.agentos.domain.model

// ─── Agent ────────────────────────────────────────────────────────────────────
data class Agent(
    val id: String,
    val name: String,
    val role: String,
    val department: String,
    val status: AgentStatus,
    val completionRate: Float,       // 0.0–1.0
    val activeTasks: Int,
    val email: String,
    val lastSeen: String,            // ISO timestamp
    val avatar: String,              // 2-letter initials
    val type: String = "ai",         // "ai" | "human"
    val skills: List<String> = emptyList(),
    val tools: List<String> = emptyList(),
    val shifts: List<String> = emptyList(),
    val colleagues: List<String> = emptyList(),
    // Extra fields (may be null if not in response)
    val accomplishments: List<String>? = null,
    val blockers: List<String>? = null,
    val escalations: List<String>? = null,
    val nextShift: String? = null,
    val managerId: String? = null,
    val locked: Boolean = false,
    val protocolWakeups: Int = 0
)

enum class AgentStatus {
    ACTIVE, IDLE, OFFLINE, ERROR,
    // API string variants
    WORKING, MONITORING, BLOCKED, STANDING_BY
}

// ─── Task ────────────────────────────────────────────────────────────────────
data class Task(
    val id: String,
    val title: String,
    val agentId: String,
    val agentName: String,
    val priority: TaskPriority,
    val status: TaskStatus,
    val dueDate: String,
    val description: String,
    val blockers: List<String> = emptyList(),
    val created: String? = null
)

enum class TaskPriority { P0, P1, P2, P3 }
enum class TaskStatus { TODO, IN_PROGRESS, DONE, BLOCKED }

// ─── Org Chart ───────────────────────────────────────────────────────────────
data class OrgChartEntry(
    val id: String,
    val name: String,
    val role: String,
    val type: String,                // "ai" | "human"
    val department: String,
    val reportsTo: String?           // manager's id, null for root
)

// ─── Workforce Metrics ────────────────────────────────────────────────────────
data class WorkforceMetrics(
    val totalAgents: Int,
    val activeAgents: Int,
    val avgCompletionRate: Float,
    val totalTasks: Int,
    val completedToday: Int,
    val blockedTasks: Int,
    val openP1s: Int
)

// ─── Department ──────────────────────────────────────────────────────────────
data class Department(
    val id: String,
    val name: String,
    val headId: String,
    val memberIds: List<String>,
    val metrics: Map<String, Any> = emptyMap(),
    val activeProjects: List<String> = emptyList(),
    val escalationCount: Int = 0
)

// ─── Integration ─────────────────────────────────────────────────────────────
data class Integration(
    val id: String,
    val name: String,
    val status: IntegrationStatus,
    val lastSync: String,
    val icon: String,
    val actions: List<String> = emptyList()
)

enum class IntegrationStatus { CONNECTED, PARTIAL, NOT_CONNECTED, ACTIVE }

// ─── System Health ───────────────────────────────────────────────────────────
data class SystemHealth(
    val agentCount: Int,
    val activeAgents: Int,
    val idleAgents: Int = 0,
    val blockedAgents: Int = 0,
    val workQueueDepth: Int = 0,
    val escalationCount: Int = 0,
    val avgHealth: Float = 0f,
    val uptime: String = "",
    val diskUsage: Int = 0,
    val knownIssues: List<String> = emptyList()
)

// ─── Starting 5 ──────────────────────────────────────────────────────────────
data class Starting5(
    val name: String,
    val archetype: String,
    val specialty: String,
    val currentFocus: String,
    val metrics: Map<String, Any> = emptyMap(),
    val status: String = "active"
)

// ─── Escalation ──────────────────────────────────────────────────────────────
data class Escalation(
    val id: String,
    val agentId: String,
    val issue: String,
    val priority: String,
    val hoursOpen: Int,
    val status: String
)

// ─── Work Queue Item ─────────────────────────────────────────────────────────
data class WorkQueueItem(
    val id: String,
    val agentId: String,
    val task: String,
    val priority: String,
    val status: String,
    val created: String,
    val blockers: List<String> = emptyList()
)

// ─── Android Bundle (all data in one call) ───────────────────────────────────
data class AndroidBundle(
    val agents: List<Agent>,
    val tasks: List<Task>,
    val departments: List<Department>,
    val integrations: List<Integration>,
    val starting5: List<Starting5>,
    val escalations: List<Escalation>,
    val workQueue: List<WorkQueueItem>,
    val systemHealth: SystemHealth,
    val version: String,
    val timestamp: String
)
