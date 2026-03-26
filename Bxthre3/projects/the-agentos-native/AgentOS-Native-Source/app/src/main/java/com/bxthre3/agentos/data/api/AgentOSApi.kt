package com.bxthre3.agentos.data.api

import com.bxthre3.agentos.domain.model.*
import retrofit2.http.*

interface AgentOSApi {
    // Full bundle — single call, everything the app needs
    @GET("android")
    suspend fun getAndroidBundle(): AndroidBundle

    // Granular endpoints
    @GET("agents")
    suspend fun getAgents(): List<Agent>

    @GET("agents/{id}")
    suspend fun getAgent(@Path("id") id: String): Agent

    @GET("status")
    suspend fun getStatus(): StatusResponse

    @GET("tasks")
    suspend fun getTasks(): List<Task>

    @GET("tasks/active")
    suspend fun getActiveTasks(): List<Task>

    @GET("workforce/metrics")
    suspend fun getWorkforceMetrics(): WorkforceMetrics

    @GET("org")
    suspend fun getOrgChart(): List<OrgChartEntry>

    @GET("depts")
    suspend fun getDepts(): List<Department>

    @GET("integrations")
    suspend fun getIntegrations(): List<Integration>

    @GET("escalations")
    suspend fun getEscalations(): List<Escalation>

    @GET("workqueue")
    suspend fun getWorkQueue(): List<WorkQueueItem>

    // Write actions (stub — no write endpoints yet)
    @POST("tasks")
    suspend fun createTask(@Body task: Task): Task

    @PUT("tasks/{id}")
    suspend fun updateTask(@Path("id") id: String, @Body task: Task): Task

    @POST("agents/{id}/activate")
    suspend fun activateAgent(@Path("id") id: String)

    @POST("agents/{id}/deactivate")
    suspend fun deactivateAgent(@Path("id") id: String)
}

// Raw status response (wraps agents + metrics + integrations)
data class StatusResponse(
    val version: String,
    val timestamp: String,
    val status: String,
    val agents: List<Agent>,
    val metrics: WorkforceMetrics,
    val tasks: List<Task>,
    val integrations: List<Integration>,
    val starting5: List<Starting5>,
    val employees: Map<String, Int>,
    val uptime: Int,
    val autonomyLevel: Int
)
