package com.bxthre3.agentos.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bxthre3.agentos.data.repository.AgentOSRepository
import com.bxthre3.agentos.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SharedAgentOSViewModel @Inject constructor(
    private val repository: AgentOSRepository
) : ViewModel() {

    // Single source of truth — fetched once, shared across all screens
    private val _bundle = MutableStateFlow<AndroidBundle?>(null)
    val bundle: StateFlow<AndroidBundle?> = _bundle.asStateFlow()

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    // Derived states
    val agents: StateFlow<List<Agent>> = _bundle.map { it?.agents ?: emptyList() }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
    val tasks: StateFlow<List<Task>> = _bundle.map { it?.tasks ?: emptyList() }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
    val metrics: StateFlow<WorkforceMetrics?> = _bundle.map { b ->
        b?.systemHealth?.let { sh ->
            val ags = b.agents
            WorkforceMetrics(
                totalAgents = sh.agentCount,
                activeAgents = sh.activeAgents,
                avgCompletionRate = ags.takeIf { it.isNotEmpty() }?.map { it.completionRate }?.average()?.toFloat() ?: 0f,
                totalTasks = b.tasks.size,
                completedToday = b.tasks.count { it.status == com.agentosnative.domain.model.TaskStatus.DONE },
                blockedTasks = b.tasks.count { it.status == com.agentosnative.domain.model.TaskStatus.BLOCKED },
                openP1s = b.tasks.count { it.priority == com.agentosnative.domain.model.TaskPriority.P0 || it.priority == com.agentosnative.domain.model.TaskPriority.P1 }
            )
        }
    }.stateIn(viewModelScope, SharingStarted.Lazily, null)

    val orgChart: StateFlow<List<OrgChartEntry>> = _bundle.map { it?.departments?.flatMap { d -> d.memberIds.map { id -> OrgChartEntry(id = id, name = id, role = d.name, type = "ai", department = d.name, reportsTo = d.headId) } } ?: emptyList() }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

    init { fetch() }

    fun fetch() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            repository.getBundle().collect { result ->
                result.onSuccess { _bundle.value = it }
                result.onFailure { _error.value = it.message }
                _isLoading.value = false
            }
        }
    }

    fun getAgent(id: String): Agent? = _bundle.value?.agents?.find { it.id == id }
}
