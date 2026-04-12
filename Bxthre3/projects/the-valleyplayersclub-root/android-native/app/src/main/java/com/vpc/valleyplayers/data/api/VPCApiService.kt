package com.vpc.valleyplayers.data.api

import kotlinx.coroutines.*
import java.net.HttpURLConnection
import java.net.URL
import org.json.JSONObject

object VPCApiService {
    private const val BASE = "https://vpc-brodiblanco.zocomputer.io/server"
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    fun register(email: String, password: String, onResult: (Boolean, String) -> Unit) {
        scope.launch {
            try {
                val url = URL("$BASE/api/auth/register")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true
                conn.outputStream.write(JSONObject().put("email", email).put("password", password).toString().toByteArray())
                val code = conn.responseCode
                val body = conn.inputStream.bufferedReader().readText()
                withContext(Dispatchers.Main) { onResult(code == 200 || code == 201, body) }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { onResult(false, e.message ?: "Network error") }
            }
        }
    }

    fun login(email: String, password: String, onResult: (Boolean, String) -> Unit) {
        scope.launch {
            try {
                val url = URL("$BASE/api/auth/login")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true
                conn.outputStream.write(JSONObject().put("email", email).put("password", password).toString().toByteArray())
                val code = conn.responseCode
                val body = conn.inputStream.bufferedReader().readText()
                val token = if (code == 200) JSONObject(body).optString("token", "") else ""
                withContext(Dispatchers.Main) { onResult(code == 200, token) }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { onResult(false, e.message ?: "Network error") }
            }
        }
    }

    fun getWallet(token: String, onResult: (Double, Double, Double) -> Unit) {
        scope.launch {
            try {
                val url = URL("$BASE/api/wallet/balance")
                val conn = url.openConnection() as HttpURLConnection
                conn.setRequestProperty("Authorization", "Bearer $token")
                val body = conn.inputStream.bufferedReader().readText()
                val json = JSONObject(body)
                withContext(Dispatchers.Main) { onResult(json.optDouble("gc", 0.0), json.optDouble("sweepstakes", 0.0), json.optDouble("sc", 0.0)) }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { onResult(0.0, 0.0, 0.0) }
            }
        }
    }

    fun deposit(token: String, amount: Double, method: String, onResult: (Boolean, String) -> Unit) {
        scope.launch {
            try {
                val url = URL("$BASE/api/wallet/deposit")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.doOutput = true
                val body = JSONObject().put("amount", amount).put("method", method).toString()
                conn.outputStream.write(body.toByteArray())
                val code = conn.responseCode
                val resp = conn.inputStream.bufferedReader().readText()
                withContext(Dispatchers.Main) { onResult(code == 200, resp) }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { onResult(false, e.message ?: "Error") }
            }
        }
    }

    fun redeem(token: String, amount: Double, onResult: (Boolean, String) -> Unit) {
        scope.launch {
            try {
                val url = URL("$BASE/api/wallet/redeem")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.doOutput = true
                val body = JSONObject().put("amount", amount).toString()
                conn.outputStream.write(body.toByteArray())
                val code = conn.responseCode
                val resp = conn.inputStream.bufferedReader().readText()
                withContext(Dispatchers.Main) { onResult(code == 200, resp) }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { onResult(false, e.message ?: "Error") }
            }
        }
    }

    fun getGames(onResult: (List<Map<String, String>>) -> Unit) {
        scope.launch {
            val games = listOf(
                mapOf("id" to "slots_lucky", "name" to "Lucky Slots", "category" to "slots", "emoji" to "\uD83C\uDFB2", "desc" to "Spin to win up to 10,000x your bet"),
                mapOf("id" to "slots_gold", "name" to "Gold Rush", "category" to "slots", "emoji" to "\uD83D\uDCB0", "desc" to "Mine for gold coins and multipliers"),
                mapOf("id" to "cards_video", "name" to "Video Poker", "category" to "cards", "emoji" to "\uD83C\uDCA0", "desc" to "Classic video poker action"),
                mapOf("id" to "cards_blackjack", "name" to "Blackjack", "category" to "cards", "emoji" to "\uD83C\uDCBF", "desc" to "Beat the dealer to 21")
            )
            withContext(Dispatchers.Main) { onResult(games) }
        }
    }
}
