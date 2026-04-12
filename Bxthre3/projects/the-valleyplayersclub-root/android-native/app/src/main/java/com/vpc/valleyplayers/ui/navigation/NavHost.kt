package com.vpc.valleyplayers.ui.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.vpc.valleyplayers.ui.screens.*

@Composable
fun VPCNavHost() {
    val navController = rememberNavController()
    var token by remember { mutableStateOf("") }

    NavHost(navController, startDestination = "login") {
        composable("login") {
            LoginScreen(
                onLogin = { t -> token = t; navController.navigate("home") { popUpTo("login") { inclusive = true } } },
                onRegister = { navController.navigate("register") }
            )
        }
        composable("register") {
            RegisterScreen(
                onRegistered = { navController.navigate("login") { popUpTo("register") { inclusive = true } } },
                onBack = { navController.popBackStack() }
            )
        }
        composable("home") {
            HomeScreen(
                token = token,
                onLogout = { token = ""; navController.navigate("login") { popUpTo("home") { inclusive = true } } },
                onNavigate = { route -> navController.navigate(route) }
            )
        }
        composable("wallet") {
            WalletScreen(token = token, onBack = { navController.popBackStack() })
        }
        composable("games") {
            GamesScreen(token = token, onBack = { navController.popBackStack() })
        }
        composable("profile") {
            ProfileScreen(token = token, onLogout = { token = ""; navController.navigate("login") { popUpTo("profile") { inclusive = true } } })
        }
    }
}
