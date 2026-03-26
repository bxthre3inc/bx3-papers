package com.bxthre3.agentos.data.repository

import com.bxthre3.agentos.data.api.AgentOSApiService
import com.bxthre3.agentos.domain.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AgentOSRepository @Inject constructor() {
    private val api = AgentOSApiService.api

    fun getBundle(): Flow<Result<AndroidBundle>> = flow {
        try {
            emit(Result.success(api.getAndroidBundle()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getStatus(): Flow<Result<com.agentosnative.data.api.StatusResponse>> = flow {
        try {
            emit(Result.success(api.getStatus()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getAgents(): Flow<Result<List<Agent>>> = flow {
        try {
            emit(Result.success(api.getAgents()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getAgent(id: String): Flow<Result<Agent>> = flow {
        try {
            emit(Result.success(api.getAgent(id)))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getTasks(): Flow<Result<List<Task>>> = flow {
        try {
            emit(Result.success(api.getTasks()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getActiveTasks(): Flow<Result<List<Task>>> = flow {
        try {
            emit(Result.success(api.getActiveTasks()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getWorkforceMetrics(): Flow<Result<WorkforceMetrics>> = flow {
        try {
            emit(Result.success(api.getWorkforceMetrics()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getOrgChart(): Flow<Result<List<OrgChartEntry>>> = flow {
        try {
            emit(Result.success(api.getOrgChart()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getDepts(): Flow<Result<List<Department>>> = flow {
        try {
            emit(Result.success(api.getDepts()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getIntegrations(): Flow<Result<List<Integration>>> = flow {
        try {
            emit(Result.success(api.getIntegrations()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getEscalations(): Flow<Result<List<Escalation>>> = flow {
        try {
            emit(Result.success(api.getEscalations()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    fun getWorkQueue(): Flow<Result<List<WorkQueueItem>>> = flow {
        try {
            emit(Result.success(api.getWorkQueue()))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }

    suspend fun activateAgent(agentId: String): Result<Unit> = try {
        api.activateAgent(agentId)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }

    suspend fun deactivateAgent(agentId: String): Result<Unit> = try {
        api.deactivateAgent(agentId)
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e)
    }
}

// Global singleton instance (avoids DI complexity)
val agentOSRepository: AgentOSRepository by lazy { AgentOSRepository() }
