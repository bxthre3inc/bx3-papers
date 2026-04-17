//! Rollback + Cascade Pause — State restoration for cascade safety.
//!
//! Architecture:
//!   1. Identify affected cascades when rollback is needed
//!   2. Pause all affected cascades
//!   3. Restore state at each level (Zo / Kali / station)
//!   4. Verify coherence across restored levels
//!   5. Resume safe cascades; escalate unsafe to human

use crate::types::{EventVector, PlaneResult};
use serde::{Deserialize, Serialize};
use sha3::{Sha3_256, Digest};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::RwLock;

/// A single cascade — a chain of causally linked events
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Cascade {
    pub id: String,
    pub task_id: String,
    pub status: CascadeStatus,
    pub depth: usize,
    pub events: Vec<CascadeEvent>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum CascadeStatus {
    Active,
    Paused,
    Resumed,
    Escalated,
    Terminated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CascadeEvent {
    pub sequence: usize,
    pub timestamp_ms: i64,
    pub actor: String,
    pub action: String,
    pub vector_snapshot: EventVector,
    pub plane_results: Vec<PlaneResult>,
}

/// Rollback point — captures full state needed to restore a cascade
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RollbackPoint {
    pub id: String,
    pub cascade_id: String,
    pub task_id: String,
    pub timestamp_ms: i64,
    pub depth: usize,
    pub agent_states: HashMap<String, AgentState>,
    pub task_states: HashMap<String, TaskState>,
    pub cascade_events: Vec<CascadeEvent>,
    pub event_log_hash: String,
    pub verify_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentState {
    pub id: String,
    pub completion_rate: f64,
    pub active_tasks: usize,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskState {
    pub id: String,
    pub status: String,
    pub phase: String,
    pub agent_id: Option<String>,
    pub blockers: Vec<String>,
}

/// Initiation result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RollbackResult {
    pub success: bool,
    pub rollback_point_id: String,
    pub cascades_paused: usize,
    pub cascades_resumed: usize,
    pub cascades_escalated: usize,
    pub error: Option<String>,
}

/// Cascade Manager — tracks and controls cascade lifecycles
pub struct CascadeManager {
    cascades: RwLock<HashMap<String, Cascade>>,
    rollback_dir: PathBuf,
    rollback_points: RwLock<HashMap<String, RollbackPoint>>,
}

impl CascadeManager {
    pub fn new(rollback_dir: PathBuf) -> Self {
        let _ = fs::create_dir_all(&rollback_dir);
        Self {
            cascades: RwLock::new(HashMap::new()),
            rollback_dir,
            rollback_points: RwLock::new(HashMap::new()),
        }
    }

    /// Register a new cascade
    pub fn register_cascade(&self, task_id: &str) -> String {
        let id = format!("cascade-{}", uuid::Uuid::new_v7(uuid::Timestamp::now(uuid::NoContext::default())));
        let cascade = Cascade {
            id: id.clone(),
            task_id: task_id.into(),
            status: CascadeStatus::Active,
            depth: 0,
            events: Vec::new(),
        };
        self.cascades.write().unwrap().insert(id.clone(), cascade);
        id
    }

    /// Record a cascade event
    pub fn record_event(&self, cascade_id: &str, actor: &str, action: &str, vector: EventVector, plane_results: Vec<PlaneResult>) -> Option<usize> {
        let mut cascades = self.cascades.write().unwrap();
        let cascade = cascades.get_mut(cascade_id)?;
        let sequence = cascade.events.len();
        let event = CascadeEvent {
            sequence,
            timestamp_ms: chrono::Utc::now().timestamp_millis(),
            actor: actor.into(),
            action: action.into(),
            vector_snapshot: vector,
            plane_results,
        };
        cascade.events.push(event);
        cascade.depth = cascade.events.len();
        Some(sequence)
    }

    /// Initiate rollback to a target state
    pub fn initiate_rollback(&self, target_state: &str) -> RollbackResult {
        let rollback_points = self.rollback_points.read().unwrap();
        let Some(target) = rollback_points.get(target_state) else {
            return RollbackResult {
                success: false,
                rollback_point_id: target_state.into(),
                cascades_paused: 0,
                cascades_resumed: 0,
                cascades_escalated: 0,
                error: Some("Rollback point not found".into()),
            };
        };
        drop(rollback_points);

        // Step 1: Identify affected cascades
        let cascades = self.cascades.read().unwrap();
        let affected: Vec<String> = cascades.iter()
            .filter(|(_, c)| c.task_id == target.task_id && c.status == CascadeStatus::Active)
            .map(|(id, _)| id.clone())
            .collect();
        drop(cascades);

        // Step 2: Pause affected cascades
        {
            let mut cascades = self.cascades.write().unwrap();
            for id in &affected {
                if let Some(c) = cascades.get_mut(*id) {
                    c.status = CascadeStatus::Paused;
                }
            }
        }

        // Step 3: Restore state (placeholder — in production this replays state)
        // Step 4: Verify coherence (placeholder)
        // Step 5: Resume safe cascades, escalate unsafe
        let mut resumed = 0;
        let mut escalated = 0;
        let cascades = self.cascades.read().unwrap();
        for id in &affected {
            if let Some(c) = cascades.get(id) {
                // Simulate coherence check: if depth < 5 → safe, else escalate
                if c.depth < 5 {
                    resumed += 1;
                } else {
                    escalated += 1;
                }
            }
        }
        drop(cascades);

        // Mark cascades as resumed or escalated
        {
            let mut cascades = self.cascades.write().unwrap();
            for id in &affected {
                if let Some(c) = cascades.get_mut(*id) {
                    c.status = if escalated > 0 && c.depth >= 5 {
                        CascadeStatus::Escalated
                    } else {
                        CascadeStatus::Resumed
                    };
                }
            }
        }

        RollbackResult {
            success: true,
            rollback_point_id: target_state.into(),
            cascades_paused: affected.len(),
            cascades_resumed: resumed,
            cascades_escalated: escalated,
            error: None,
        }
    }

    /// Create a rollback point for a cascade
    pub fn create_rollback_point(
        &self,
        cascade_id: &str,
        task_id: &str,
        agent_states: HashMap<String, AgentState>,
        task_states: HashMap<String, TaskState>,
        event_log_hash: &str,
    ) -> String {
        let cascades = self.cascades.read().unwrap();
        let Some(cascade) = cascades.get(cascade_id) else {
            return format!("error-no-cascade-{}", cascade_id);
        };

        let id = format!("rb-{}", uuid::Uuid::new_v7(uuid::Timestamp::now(uuid::NoContext::default())));
        let mut hasher = Sha3_256::new();
        hasher.update(serde_json::to_string(&cascade.events).unwrap_or_default());
        let verify_hash = hex::encode(hasher.finalize());

        let point = RollbackPoint {
            id: id.clone(),
            cascade_id: cascade_id.into(),
            task_id: task_id.into(),
            timestamp_ms: chrono::Utc::now().timestamp_millis(),
            depth: cascade.depth,
            agent_states,
            task_states,
            cascade_events: cascade.events.clone(),
            event_log_hash: event_log_hash.into(),
            verify_hash,
        };
        drop(cascades);

        let path = self.rollback_dir.join(format!("{}.json", id));
        let content = serde_json::to_string_pretty(&point).unwrap();
        let _ = fs::write(&path, content);

        self.rollback_points.write().unwrap().insert(id.clone(), point);
        id
    }

    /// List all rollback points
    pub fn list_rollback_points(&self) -> Vec<serde_json::Value> {
        self.rollback_points.read().unwrap()
            .values()
            .map(|p| serde_json::json!({
                "id": p.id,
                "cascade_id": p.cascade_id,
                "task_id": p.task_id,
                "depth": p.depth,
                "timestamp_ms": p.timestamp_ms,
                "age_hours": (chrono::Utc::now().timestamp_millis() - p.timestamp_ms) as f64 / 3_600_000.0,
            }))
            .collect()
    }

    /// Get cascade status
    pub fn get_cascade_status(&self, cascade_id: &str) -> Option<CascadeStatus> {
        self.cascades.read().unwrap().get(cascade_id).map(|c| c.status)
    }

    /// Pause a specific cascade
    pub fn pause_cascade(&self, cascade_id: &str) -> bool {
        self.cascades.write().unwrap()
            .get_mut(cascade_id)
            .map(|c| { c.status = CascadeStatus::Paused; true })
            .unwrap_or(false)
    }

    /// Resume a paused cascade
    pub fn resume_cascade(&self, cascade_id: &str) -> bool {
        self.cascades.write().unwrap()
            .get_mut(cascade_id)
            .map(|c| { c.status = CascadeStatus::Resumed; true })
            .unwrap_or(false)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn test_manager() -> CascadeManager {
        let dir = std::env::temp_dir().join("agentic-rollback-test");
        let _ = fs::create_dir_all(&dir);
        CascadeManager::new(dir)
    }

    #[test]
    fn test_cascade_register_and_record() {
        let mgr = test_manager();
        let cid = mgr.register_cascade("task-123");
        assert!(cid.starts_with("cascade-"));

        let vector = EventVector {
            t: chrono::Utc::now().timestamp_millis(),
            s_x: -105.5, s_y: 37.2,
            z_negative: 0.0, z_positive: 0.5,
            c: 0.95, l: "APPROVED".into(),
            v_f: 0.5, e: 1000, g: "COMPLIANT".into(),
        };
        let planes = vec![
            PlaneResult { plane: 1, matched: true, threshold: "z_positive >= 0.2".into() },
            PlaneResult { plane: 8, matched: true, threshold: "g == COMPLIANT".into() },
        ];

        let seq = mgr.record_event(&cid, "zoe", "routing_decision", vector, planes);
        assert_eq!(seq, Some(0));

        let seq2 = mgr.record_event(&cid, "iris", "task_assigned", vector, planes);
        assert_eq!(seq2, Some(1));
    }

    #[test]
    fn test_create_and_list_rollback_points() {
        let mgr = test_manager();
        let cid = mgr.register_cascade("task-456");

        let mut agents = HashMap::new();
        agents.insert("iris".into(), AgentState { id: "iris".into(), completion_rate: 0.91, active_tasks: 2, status: "ACTIVE".into() });
        let mut tasks = HashMap::new();
        tasks.insert("t-1".into(), TaskState { id: "t-1".into(), status: "WORKING".into(), phase: "EXECUTE".into(), agent_id: Some("iris".into()), blockers: vec![] });

        let point_id = mgr.create_rollback_point(&cid, "task-456", agents, tasks, "log-hash-abc");
        assert!(point_id.starts_with("rb-"));

        let points = mgr.list_rollback_points();
        assert!(!points.is_empty());
    }

    #[test]
    fn test_initiate_rollback_success() {
        let mgr = test_manager();
        let cid = mgr.register_cascade("task-789");
        let mut agents = HashMap::new();
        let mut tasks = HashMap::new();
        tasks.insert("t-1".into(), TaskState { id: "t-1".into(), status: "WORKING".into(), phase: "EXECUTE".into(), agent_id: None, blockers: vec![] });
        let point_id = mgr.create_rollback_point(&cid, "task-789", agents, tasks, "log-hash");

        let result = mgr.initiate_rollback(&point_id);
        assert!(result.success);
        assert_eq!(result.cascades_paused, 1);
        assert_eq!(result.error, None);
    }

    #[test]
    fn test_initiate_rollback_not_found() {
        let mgr = test_manager();
        let result = mgr.initiate_rollback("rb-nonexistent");
        assert!(!result.success);
        assert!(result.error.is_some());
    }

    #[test]
    fn test_pause_and_resume() {
        let mgr = test_manager();
        let cid = mgr.register_cascade("task-pause");
        assert_eq!(mgr.get_cascade_status(&cid), Some(CascadeStatus::Active));

        mgr.pause_cascade(&cid);
        assert_eq!(mgr.get_cascade_status(&cid), Some(CascadeStatus::Paused));

        mgr.resume_cascade(&cid);
        assert_eq!(mgr.get_cascade_status(&cid), Some(CascadeStatus::Resumed));
    }
}
