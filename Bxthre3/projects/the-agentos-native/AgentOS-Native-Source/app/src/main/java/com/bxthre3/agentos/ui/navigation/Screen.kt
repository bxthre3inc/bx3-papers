package com.bxthre3.agentos.ui.navigation

sealed class Screen(val route: String) {
    data object Dashboard : Screen("dashboard")
    data object Agents : Screen("agents")
    data object Tasks : Screen("tasks")
    data object OrgChart : Screen("orgchart")
    data object Workforce : Screen("workforce")
    data object Inbox : Screen("inbox")
    data object Settings : Screen("settings")
    data object AgentDetail : Screen("agent/{agentId}") {
        fun createRoute(agentId: String) = "agent/$agentId"
    }
}
