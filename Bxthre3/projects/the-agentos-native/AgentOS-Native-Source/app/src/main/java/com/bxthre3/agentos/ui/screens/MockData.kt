package com.bxthre3.agentos.ui.screens

import com.bxthre3.agentos.domain.model.*

fun getMockAgents(): List<Agent> = listOf(
    Agent("zoe", "Zoe", "Chief of Staff", "EXECUTIVE", AgentStatus.ACTIVE, 0.97f, 3, "zoe@bxthre3.io", "2m ago", "ZO"),
    Agent("atlas", "Atlas", "COO", "EXECUTIVE", AgentStatus.ACTIVE, 0.94f, 2, "atlas@bxthre3.io", "5m ago", "AT"),
    Agent("pulse", "Pulse", "VP People Ops", "HR", AgentStatus.ACTIVE, 0.96f, 2, "pulse@bxthre3.io", "10m ago", "PL"),
    Agent("sentinel", "Sentinel", "System Monitor", "OPERATIONS", AgentStatus.ACTIVE, 0.99f, 1, "sentinel@bxthre3.io", "Live", "SN"),
    Agent("iris", "Iris", "Product Lead", "ENGINEERING", AgentStatus.ACTIVE, 0.91f, 4, "iris@bxthre3.io", "1h ago", "IR"),
    Agent("dev", "Dev", "Backend Engineer", "ENGINEERING", AgentStatus.ACTIVE, 0.88f, 3, "dev@bxthre3.io", "30m ago", "DV"),
    Agent("casey", "Casey", "Marketing Lead", "MARKETING", AgentStatus.ACTIVE, 0.85f, 2, "casey@bxthre3.io", "2h ago", "CS"),
    Agent("raj", "Raj", "Legal & Compliance", "LEGAL", AgentStatus.IDLE, 0.92f, 1, "raj@bxthre3.io", "3h ago", "RJ"),
    Agent("maya", "Maya", "Grant Strategist", "GRANTS", AgentStatus.ACTIVE, 0.90f, 3, "maya@bxthre3.io", "1h ago", "MY"),
    Agent("drew", "Drew", "Sales Lead", "SALES", AgentStatus.IDLE, 0.82f, 2, "drew@bxthre3.io", "4h ago", "DW"),
    Agent("sam", "Sam", "Data Analyst", "ENGINEERING", AgentStatus.ACTIVE, 0.87f, 2, "sam@bxthre3.io", "45m ago", "SM"),
    Agent("taylor", "Taylor", "Security Engineer", "ENGINEERING", AgentStatus.ACTIVE, 0.93f, 1, "taylor@bxthre3.io", "Live", "TY"),
    Agent("theo", "Theo", "DevOps Engineer", "ENGINEERING", AgentStatus.IDLE, 0.89f, 2, "theo@bxthre3.io", "2h ago", "TH"),
)

fun getMockTasks(): List<Task> = listOf(
    Task("t1", "Deploy Irrig8 sensor firmware v2.1", "dev", "Dev", TaskPriority.P1, TaskStatus.IN_PROGRESS, "Today", "Push OTA update to LRZ1/LRZ2 field units"),
    Task("t2", "SBIR Phase 1 Narrative Draft", "maya", "Maya", TaskPriority.P0, TaskStatus.IN_PROGRESS, "Today", "Complete first draft for DOE submission"),
    Task("t3", "VPC Sweepstakes Compliance Audit", "raj", "Raj", TaskPriority.P1, TaskStatus.TODO, "Tomorrow", "Review latest sweepstakes regulations for CO"),
    Task("t4", "Series A Deck v3 Final Review", "casey", "Casey", TaskPriority.P2, TaskStatus.BLOCKED, "This Week", "Atlas to review before investor outreach"),
    Task("t5", "AgentOS Health Check — Daily", "sentinel", "Sentinel", TaskPriority.P0, TaskStatus.DONE, "Today", "All 4 services operational"),
    Task("t6", "Irrig8 Field Mapping Complete", "iris", "Iris", TaskPriority.P1, TaskStatus.DONE, "Yesterday", "LRZ1 and LRZ2 sensor locations confirmed"),
    Task("t7", "Refresh All Investor Contacts", "drew", "Drew", TaskPriority.P3, TaskStatus.TODO, "This Week", "Update CRM with latest Valley investor list"),
    Task("t8", "Weekly Workforce Report", "pulse", "Pulse", TaskPriority.P2, TaskStatus.DONE, "Today", "Posted to INBOX — all departments green"),
)

fun getMockMetrics(): WorkforceMetrics = WorkforceMetrics(
    totalAgents = 13,
    activeAgents = 9,
    avgCompletionRate = 0.91f,
    totalTasks = 24,
    completedToday = 8,
    blockedTasks = 1,
    openP1s = 3
)

fun getMockOrgChart(): List<OrgChartEntry> = listOf(
    OrgChartEntry("brodiblanco", "brodiblanco", "Founder & CEO", "human", "EXECUTIVE", null),
    OrgChartEntry("zoe", "Zoe", "Chief of Staff", "ai", "EXECUTIVE", "brodiblanco"),
    OrgChartEntry("atlas", "Atlas", "COO", "ai", "EXECUTIVE", "brodiblanco"),
    OrgChartEntry("pulse", "Pulse", "VP People Ops", "ai", "HR", "atlas"),
    OrgChartEntry("sentinel", "Sentinel", "System Monitor", "ai", "OPERATIONS", "atlas"),
    OrgChartEntry("iris", "Iris", "Product Lead", "ai", "ENGINEERING", "atlas"),
    OrgChartEntry("dev", "Dev", "Backend Engineer", "ai", "ENGINEERING", "iris"),
    OrgChartEntry("sam", "Sam", "Data Analyst", "ai", "ENGINEERING", "iris"),
    OrgChartEntry("taylor", "Taylor", "Security Engineer", "ai", "ENGINEERING", "iris"),
    OrgChartEntry("theo", "Theo", "DevOps Engineer", "ai", "ENGINEERING", "iris"),
    OrgChartEntry("casey", "Casey", "Marketing Lead", "ai", "MARKETING", "atlas"),
    OrgChartEntry("raj", "Raj", "Legal & Compliance", "ai", "LEGAL", "atlas"),
    OrgChartEntry("maya", "Maya", "Grant Strategist", "ai", "GRANTS", "atlas"),
    OrgChartEntry("drew", "Drew", "Sales Lead", "ai", "SALES", "atlas"),
)
