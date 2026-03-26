package com.bxthre3.agentos.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.bxthre3.agentos.ui.screens.*

data class BottomNavItem(val label: String, val route: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector)

val bottomNavItems = listOf(
    BottomNavItem("Dashboard", Screen.Dashboard.route, Icons.Filled.Dashboard, Icons.Outlined.Dashboard),
    BottomNavItem("Agents", Screen.Agents.route, Icons.Filled.SmartToy, Icons.Outlined.SmartToy),
    BottomNavItem("Tasks", Screen.Tasks.route, Icons.Filled.Assignment, Icons.Outlined.Assignment),
    BottomNavItem("Org", Screen.OrgChart.route, Icons.Filled.AccountTree, Icons.Outlined.AccountTree),
    BottomNavItem("Inbox", Screen.Inbox.route, Icons.Filled.Inbox, Icons.Outlined.Inbox),
)

@Composable
fun AOSNavHost(navController: NavHostController = rememberNavController()) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { item ->
                    val selected = currentRoute == item.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            if (currentRoute != item.route) {
                                navController.navigate(item.route) { popUpTo(Screen.Dashboard.route) { saveState = true } }
                            }
                        },
                        icon = { Icon(if (selected) item.selectedIcon else item.unselectedIcon, contentDescription = item.label) },
                        label = { Text(item.label) }
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(navController = navController, startDestination = Screen.Dashboard.route, modifier = Modifier.padding(paddingValues)) {
            composable(Screen.Dashboard.route) { DashboardScreen(navController) }
            composable(Screen.Agents.route) { AgentsScreen(navController) }
            composable(Screen.Tasks.route) { TasksScreen(navController) }
            composable(Screen.OrgChart.route) { OrgChartScreen(navController) }
            composable(Screen.Inbox.route) { InboxScreen(navController) }
            composable(Screen.Settings.route) { SettingsScreen(navController) }
            composable(Screen.Workforce.route) { WorkforceScreen(navController) }
            composable(Screen.AgentDetail.route) { AgentDetailScreen(navController, it.arguments?.getString("agentId") ?: "") }
        }
    }
}
