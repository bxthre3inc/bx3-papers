package com.vpcnative.data.api

import retrofit2.http.*

interface VPCApi {
    @GET("games") suspend fun getGames(): List<GameDto>
    @GET("user/profile") suspend fun getProfile(): UserDto
    @GET("wallet/balance") suspend fun getBalance(): BalanceDto
    @GET("tournaments") suspend fun getTournaments(): List<TournamentDto>
}

data class GameDto(val id: String, val name: String, val category: String, val imageUrl: String, val description: String, val rtp: Double, val volatility: String)
data class UserDto(val id: String, val username: String, val email: String, val phone: String, val tier: String, val balance: Double, val vipPoints: Int)
data class BalanceDto(val balance: Double, val bonusBalance: Double, val currency: String)
data class TournamentDto(val id: String, val name: String, val prizePool: Double, val entryFee: Double, val startsAt: String, val status: String)