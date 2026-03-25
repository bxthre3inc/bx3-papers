package com.vpcnative.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.vpcnative.ui.screens.*

@Composable
fun NavHost(navController: NavController = rememberNavController()) {
    NavHost(navController = navController as androidx.navigation.NavHostController, startDestination = "splash") {
        composable("splash") { SplashScreen(navController) }
        composable("auth") { AuthScreen(navController) }
        composable("home") { HomeScreen(navController) }
        composable("lobby") { LobbyScreen(navController) }
        composable("games") { GamesScreen(navController) }
        composable("game/{id}", arguments = listOf(navArgument("id") { type = NavType.StringType })) {
            GameDetailScreen(navController, it.arguments?.getString("id") ?: "")
        }
        composable("profile") { ProfileScreen(navController) }
        composable("cashier") { CashierScreen(navController) }
        composable("cash_payment") { CashPaymentScreen(navController) }
        composable("rewards") { RewardsScreen(navController) }
        composable("leaderboards") { LeaderboardsScreen(navController) }
        composable("notifications") { NotificationsScreen(navController) }
        composable("settings") { SettingsScreen(navController) }
        composable("consumables") { ConsumablesScreen(navController) }
        composable("kyc_verification") { KYCVerificationScreen(navController) }
        composable("responsible_gaming") { ResponsibleGamingScreen(navController) }
    }
}
