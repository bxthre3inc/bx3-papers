//! Agentic HTTP API — Axum handlers.
//!
//! Thin layer: routes HTTP requests to core services.
//! All business logic lives in core/.

use crate::core::{AgentRegistry, DapEngine, EventBus, TaskQueue};
use crate::types::*;
use crate::db::Database;
use axum::{
    extract::{Path, State},
    response::Json,
    routing::{get, post},
    Router,
};
use std::sync::Arc;
use tokio::sync::RwLock;

/// Shared application state.
pub struct AppState {
    pub agents: RwLock<AgentRegistry>,
    pub tasks: RwLock<TaskQueue>,
    pub events: EventBus,
    pub db: Database,
}

impl AppState {
    pub fn new(db: Database) -> Self {
        Self {
            agents: RwLock::new(AgentRegistry::new()),
            tasks: RwLock::new(TaskQueue::new()),
            events: EventBus::new(),
            db,
        }
    }
}

// GET /api/agentic/status
pub async fn status(State(state): State<Arc<AppState>>) -> Json<serde_json::Value> {
    let agents = state.agents.read().await;
    let tasks = state.tasks.read().await;

    Json(serde_json::json!({
        "version": env!("CARGO_PKG_VERSION"),
        "status": "operational",
        "agentCount": agents.all().len(),
        "activeAgents": agents.active_count(),
        "workQueueDepth": tasks.work_queue_depth(),
        "escalationCount": tasks.escalations().len(),
        "avgHealth": agents.avg_completion_rate(),
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

// GET /api/agentic/agents
pub async fn get_agents(State(state): State<Arc<AppState>>) -> Json<AgentResponse> {
    let agents = state.agents.read().await;
    Json(AgentResponse {
        agents: agents.all().to_vec(),
    })
}

// GET /api/agentic/tasks
pub async fn get_tasks(State(state): State<Arc<AppState>>) -> Json<TaskResponse> {
    let tasks = state.tasks.read().await;
    Json(TaskResponse {
        tasks: tasks.all().to_vec(),
    })
}

// GET /api/agentic/org
pub async fn get_org(State(state): State<Arc<AppState>>) -> Json<Vec<OrgEntry>> {
    let agents = state.agents.read().await;
    Json(agents.org_chart())
}

// GET /api/agentic/starting5
pub async fn get_starting5() -> Json<Vec<Starting5>> {
    Json(Starting5::canonical())
}

// GET /api/agentic/integrations
pub async fn get_integrations() -> Json<Vec<Integration>> {
    Json(Integration::canonical())
}

// POST /api/agentic/events/ingest
pub async fn ingest_event(
    State(_state): State<Arc<AppState>>,
    Json(payload): Json<serde_json::Value>,
) -> Json<serde_json::Value> {
    // Parse event vector from payload
    let vector = EventVector {
        t: payload.get("t").and_then(|v| v.as_i64()).unwrap_or_else(|| chrono::Utc::now().timestamp_millis()),
        s_x: payload.get("s_x").and_then(|v| v.as_f64()).unwrap_or(0.0),
        s_y: payload.get("s_y").and_then(|v| v.as_f64()).unwrap_or(0.0),
        z_negative: payload.get("z_negative").and_then(|v| v.as_f64()).unwrap_or(0.0),
        z_positive: payload.get("z_positive").and_then(|v| v.as_f64()).unwrap_or(0.0),
        c: payload.get("c").and_then(|v| v.as_f64()).unwrap_or(1.0),
        l: payload.get("l").and_then(|v| v.as_str()).unwrap_or("APPROVED").to_string(),
        v_f: payload.get("v_f").and_then(|v| v.as_f64()).unwrap_or(0.5),
        e: payload.get("e").and_then(|v| v.as_i64()).unwrap_or(0),
        g: payload.get("g").and_then(|v| v.as_str()).unwrap_or("COMPLIANT").to_string(),
    };

    let plane_results = DapEngine::evaluate(&vector);
    let all_match = DapEngine::all_match(&plane_results);

    Json(serde_json::json!({
        "status": "evaluated",
        "all_match": all_match,
        "plane_results": plane_results,
        "execution_state": DapEngine::execution_state(&plane_results),
    }))
}

// POST /api/agentic/android/agents/:id/:action
pub async fn agent_action(
    Path((id, action)): Path<(String, String)>,
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    let mut agents = state.agents.write().await;

    match action.as_str() {
        "activate" => {
            if let Some(agent) = agents.get_mut(&id) {
                agent.status = AgentStatus::Active;
                agent.last_seen = chrono::Utc::now();
                return Json(serde_json::json!({
                    "id": agent.id,
                    "name": agent.name,
                    "status": "ACTIVE",
                    "activatedAt": agent.last_seen.to_rfc3339(),
                }));
            }
        }
        "deactivate" => {
            if let Some(agent) = agents.get_mut(&id) {
                agent.status = AgentStatus::Idle;
                return Json(serde_json::json!({
                    "id": agent.id,
                    "name": agent.name,
                    "status": "IDLE",
                    "deactivatedAt": chrono::Utc::now().to_rfc3339(),
                }));
            }
        }
        _ => {}
    }

    Json(serde_json::json!({
        "error": "Agent not found or invalid action",
        "id": id,
        "action": action,
    }))
}

/// Build the router for all agentic API routes.
pub fn router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/agentic/status", get(status))
        .route("/api/agentic/agents", get(get_agents))
        .route("/api/agentic/tasks", get(get_tasks))
        .route("/api/agentic/org", get(get_org))
        .route("/api/agentic/starting5", get(get_starting5))
        .route("/api/agentic/integrations", get(get_integrations))
        .route("/api/agentic/events/ingest", post(ingest_event))
        .route("/api/agentic/android/agents/{id}/{action}", post(agent_action))
        .with_state(state)
}