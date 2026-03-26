package com.bxthre3.agentos.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.bxthre3.agentos.data.repository.agentOSRepository
import com.bxthre3.agentos.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AppUiState(
    val bundle: AndroidBundle? = null,
    val isLoading: Boolean = true,
    val error: String? = null
)

@HiltViewModel
class MainViewModel @Inject constructor() : ViewModel() {

    private val _uiState = MutableStateFlow(AppUiState())
    val uiState: StateFlow<AppUiState> = _uiState

    init { load() }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            agentOSRepository.getBundle().collect { result ->
                result.fold(
                    onSuccess = { bundle ->
                        _uiState.value = _uiState.value.copy(bundle = bundle, isLoading = false)
                    },
                    onFailure = { e ->
                        _uiState.value = _uiState.value.copy(error = e.message, isLoading = false)
                    }
                )
            }
        }
    }

    fun refresh() = load()
}
