package com.bxthre3.agentos.data.api

import com.bxthre3.agentos.domain.model.*
import com.google.gson.*
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.reflect.Type
import java.util.concurrent.TimeUnit

object AgentOSApiService {
    // Points to the Android-optimized endpoint on zo.space
    private const val BASE_URL = "https://brodiblanco.zo.space/api/agentos/"

    private val gson: Gson by lazy {
        GsonBuilder()
            .setLenient()
            .registerTypeAdapter(AgentStatus::class.java, AgentStatusDeserializer())
            .registerTypeAdapter(TaskPriority::class.java, TaskPriorityDeserializer())
            .registerTypeAdapter(TaskStatus::class.java, TaskStatusDeserializer())
            .registerTypeAdapter(IntegrationStatus::class.java, IntegrationStatusDeserializer())
            .create()
    }

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    val api: AgentOSApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
            .create(AgentOSApi::class.java)
    }
}

// Maps API string → AgentStatus enum (handles legacy and new variants)
class AgentStatusDeserializer : JsonDeserializer<AgentStatus> {
    override fun deserialize(e: JsonElement, t: Type, ctx: JsonDeserializationContext): AgentStatus {
        val s = e.asString.uppercase()
        return when (s) {
            "ACTIVE", "WORKING", "MONITORING", "AWAKENED", "AWAKE_PROCESSING", "ACTIVE" -> AgentStatus.ACTIVE
            "IDLE", "STANDBY" -> AgentStatus.IDLE
            "OFFLINE", "OFF" -> AgentStatus.OFFLINE
            "ERROR", "BLOCKED" -> AgentStatus.ERROR
            else -> try { AgentStatus.valueOf(s) } catch (_: Exception) { AgentStatus.IDLE }
        }
    }
}

class TaskPriorityDeserializer : JsonDeserializer<TaskPriority> {
    override fun deserialize(e: JsonElement, t: Type, ctx: JsonDeserializationContext): TaskPriority {
        val s = e.asString.uppercase().replace("-", "_").replace("P0", "P0").replace("P1", "P1").replace("P2", "P2").replace("P3", "P3")
        return try { TaskPriority.valueOf(s) } catch (_: Exception) { TaskPriority.P2 }
    }
}

class TaskStatusDeserializer : JsonDeserializer<TaskStatus> {
    override fun deserialize(e: JsonElement, t: Type, ctx: JsonDeserializationContext): TaskStatus {
        val s = e.asString.uppercase().replace("-", "_").replace(" ", "_")
        return when (s) {
            "IN_PROGRESS", "INPROGRESS", "IN_PROG" -> TaskStatus.IN_PROGRESS
            "TODO", "NOT_STARTED", "PENDING" -> TaskStatus.TODO
            "DONE", "COMPLETE", "COMPLETED" -> TaskStatus.DONE
            "BLOCKED" -> TaskStatus.BLOCKED
            else -> try { TaskStatus.valueOf(s) } catch (_: Exception) { TaskStatus.TODO }
        }
    }
}

class IntegrationStatusDeserializer : JsonDeserializer<IntegrationStatus> {
    override fun deserialize(e: JsonElement, t: Type, ctx: JsonDeserializationContext): IntegrationStatus {
        val s = e.asString.uppercase()
        return when (s) {
            "CONNECTED", "ACTIVE" -> IntegrationStatus.CONNECTED
            "PARTIAL" -> IntegrationStatus.PARTIAL
            "NOT_CONNECTED", "NOTCONNECTED", "DISCONNECTED" -> IntegrationStatus.NOT_CONNECTED
            else -> try { IntegrationStatus.valueOf(s) } catch (_: Exception) { IntegrationStatus.NOT_CONNECTED }
        }
    }
}
