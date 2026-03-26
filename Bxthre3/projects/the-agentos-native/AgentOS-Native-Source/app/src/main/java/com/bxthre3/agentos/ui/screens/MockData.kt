package com.bxthre3.agentos.ui.screens

import com.bxthre3.agentos.domain.model.*

// Canonical 19-agent roster per SPEC.md v6.0
fun getMockAgents(): List<Agent> = listOf(
    // Executive (4)
[
    Agent("brodiblanco", "brodiblanco", "Founder & CEO", "Executive", AgentStatus.ACTIVE, 1.0f, 0, "brodiblanco@bxthre3.io", "Live", "BL", "human", listOf("strategy","vision"), listOf("zo"), emptyList(), listOf("zoe","atlas","vance")),
    Agent("zoe", "Zoe Patel", "Executive Agent", "Executive", AgentStatus.ACTIVE, 0.97f, 2, "zoe@bxthre3.io", "2m ago", "ZO", "ai", listOf("orchestration","memory"), listOf("zo","supermemory"), emptyList(), listOf("atlas","vance","pulse")),
    Agent("atlas", "Atlas", "Operations Agent", "Operations", AgentStatus.ACTIVE, 0.94f, 2, "atlas@bxthre3.io", "5m ago", "AT", "ai", listOf("coordination","execution"), listOf("notion","calendar"), emptyList(), listOf("zoe","vance")),
    Agent("vance", "Vance", "Executive Agent", "Executive", AgentStatus.ACTIVE, 0.95f, 1, "vance@bxthre3.io", "Live", "VA", "ai", listOf("pattern_learning","gap_detection"), listOf("all","supermemory"), emptyList(), listOf("zoe","atlas","balance")),
    Agent("pulse", "Pulse", "People Ops", "Operations", AgentStatus.ACTIVE, 0.96f, 2, "pulse@bxthre3.io", "10m ago", "PL", "ai", listOf("workforce","scheduling"), listOf("notion","sheets"), emptyList(), listOf("sentinel","sam")),
    Agent("sentinel", "Sentinel", "System Monitor", "Operations", AgentStatus.ACTIVE, 0.99f, 1, "sentinel@bxthre3.io", "Live", "SN", "ai", listOf("monitoring","alerting"), listOf("supermemory","sms"), emptyList(), listOf("pulse")),
    Agent("irrig8", "Irrig8 Field Agent", "Field Operations", "Operations", AgentStatus.ACTIVE, 0.90f, 3, "irrig8@bxthre3.io", "15m ago", "I8", "ai", listOf("field_ops","sensor_data"), listOf("timescale","postgres"), emptyList(), listOf("rain","vpc")),
    Agent("rain", "RAIN", "Regulatory Intelligence", "Strategy", AgentStatus.ACTIVE, 0.88f, 2, "rain@bxthre3.io", "20m ago", "RN", "ai", listOf("regulatory","crypto"), listOf("notion","web_research"), emptyList(), listOf("irrig8","vpc")),
    Agent("iris", "Iris", "Engineering Lead", "Engineering", AgentStatus.ACTIVE, 0.91f, 4, "iris@bxthre3.io", "1h ago", "IR", "ai", listOf("product","roadmapping"), listOf("notion","figma"), emptyList(), listOf("dev","sam","theo")),
    Agent("dev", "Dev", "Backend Engineer", "Engineering", AgentStatus.ACTIVE, 0.88f, 3, "dev@bxthre3.io", "30m ago", "DV", "ai", listOf("backend","firmware"), listOf("github","vscode"), emptyList(), listOf("sam","theo")),
    Agent("sam", "Sam", "Data Analyst", "Engineering", AgentStatus.ACTIVE, 0.87f, 2, "sam@bxthre3.io", "45m ago", "SM", "ai", listOf("data_analysis","sql"), listOf("sheets","notion"), emptyList(), listOf("dev","theo")),
    Agent("taylor", "Taylor", "Security Engineer", "Engineering", AgentStatus.ACTIVE, 0.92f, 1, "taylor@bxthre3.io", "Live", "TY", "ai", listOf("security","threat_modeling"), listOf("github","datadog"), emptyList(), listOf("vault")),
    Agent("theo", "Theo", "DevOps Engineer", "Engineering", AgentStatus.IDLE, 0.89f, 2, "theo@bxthre3.io", "2h ago", "TH", "ai", listOf("devops","cicd"), listOf("github","aws"), emptyList(), listOf("dev")),
    Agent("casey", "Casey", "Marketing Lead", "Marketing", AgentStatus.ACTIVE, 0.90f, 2, "casey@bxthre3.io", "2h ago", "CS", "ai", listOf("marketing","demand_gen"), listOf("figma","canva"), emptyList(), listOf("brand")),
    Agent("maya", "Maya", "Grant Strategist", "Grants", AgentStatus.ACTIVE, 0.90f, 3, "maya@bxthre3.io", "1h ago", "MY", "ai", listOf("grants","sbir"), listOf("notion","github"), emptyList(), listOf("raj","casey")),
    Agent("raj", "Raj", "Legal & Compliance", "Legal", AgentStatus.IDLE, 0.92f, 1, "raj@bxthre3.io", "3h ago", "RJ", "ai", listOf("legal","compliance"), listOf("clio","notion"), emptyList(), listOf("maya")),
    Agent("drew", "Drew", "Sales Lead", "Sales", AgentStatus.IDLE, 0.93f, 2, "drew@bxthre3.io", "4h ago", "DW", "ai", listOf("sales","partnerships"), listOf("gmail","crm"), emptyList(), listOf("vpc")),
    Agent("vpc", "VPC Agent", "Gaming Ops", "Operations", AgentStatus.ACTIVE, 0.87f, 2, "vpc@bxthre3.io", "25m ago", "VP", "ai", listOf("gaming_ops","kyc"), listOf("notion","stripe"), emptyList(), listOf("irrig8","rain"))
]
)

fun getMockTasks(): List<Task> = listOf(
    Task("t1", "Deploy Irrig8 sensor firmware v2.1", "dev", "Dev", TaskPriority.P1, TaskStatus.IN_PROGRESS, "Today", "Push OTA update to LRZ1/LRZ2 field units"),
    Task("t2", "SBIR Phase 1 Narrative Draft", "maya", "Maya", TaskPriority.P0, TaskStatus.IN_PROGRESS, "Today", "Complete first draft for DOE submission"),
    Task("t3", "VPC Sweepstakes Compliance Audit", "raj", "Raj", TaskPriority.P1, TaskStatus.TODO, "Tomorrow", "Review latest sweepstakes regulations for CO")
)

fun getMockMetrics(): WorkforceMetrics = WorkforceMetrics(
    totalAgents = 19,
    activeAgents = 16,
    avgCompletionRate = 0.91f,
    totalTasks = 24,
    completedToday = 8,
    blockedTasks = 1,
    openP1s = 3
)
