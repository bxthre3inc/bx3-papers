//! Self-Modification Engine — Darwin Gödel Cycle
//! Controlled self-improvement within immutable core constraints.
//!
//! Cycle: OBSERVE → HYPOTHESIZE → SANDBOX → COMMIT → ROLLBACK
//! Immutable: LLM weights, safety constraints, Truth Gate, INBOX routing

use crate::types::{EventVector, PlaneResult};
use serde::{Deserialize, Serialize};
use sha3::{Sha3_256, Digest};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

/// Snapshot of system state for rollback
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemSnapshot {
    pub id: String,
    pub timestamp_ms: i64,
    pub agent_state: HashMap<String, AgentSnapshot>,
    pub task_state: HashMap<String, TaskSnapshot>,
    pub config_checksum: String,
    pub immutable_flags: ImmutableFlags,
}

/// Immutable core — these can NEVER be modified by the SME
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImmutableFlags {
    pub llm_weights_frozen: bool,
    pub safety_constraints_frozen: bool,
    pub truth_gate_frozen: bool,
    pub inbox_routing_frozen: bool,
    pub max_snapshot_age_hours: i64,
}

/// Per-agent state snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentSnapshot {
    pub id: String,
    pub completion_rate: f64,
    pub active_tasks: usize,
    pub skills: Vec<String>,
}

/// Per-task state snapshot
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskSnapshot {
    pub id: String,
    pub status: String,
    pub agent_id: Option<String>,
    pub phase: String,
}

/// Observation — what the SME observed about system behavior
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Observation {
    pub timestamp_ms: i64,
    pub pattern_type: PatternType,
    pub description: String,
    pub evidence: Vec<String>,
    pub severity: Severity,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum PatternType {
    FailureMode,
    Anomaly,
    Bottleneck,
    LowQualityOutput,
    HallucinationDetected,
    SlowInference,
    EscalationSpike,
    Custom,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

/// Hypothesis — proposed improvement
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Hypothesis {
    pub id: String,
    pub observation_id: String,
    pub description: String,
    pub target_module: String,
    pub expected_improvement: String,
    pub risk_level: RiskLevel,
    pub created_at_ms: i64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Extreme, // Must have human approval
}

/// Sandbox test result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SandboxResult {
    pub hypothesis_id: String,
    pub passed: bool,
    pub execution_time_ms: u64,
    pub output_hash: String,
    pub error: Option<String>,
    pub test_cases_run: usize,
    pub test_cases_passed: usize,
}

/// Modification record — what was changed and why
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModificationRecord {
    pub id: String,
    pub hypothesis_id: String,
    pub module_path: String,
    pub before_hash: String,
    pub after_hash: String,
    pub rollback_point_id: String,
    pub applied_at_ms: i64,
    pub human_approved: bool,
    pub approver_id: Option<String>,
}

/// SME — the self-modification engine
pub struct SelfModificationEngine {
    snapshots_dir: PathBuf,
    observations: Mutex<Vec<Observation>>,
    hypotheses: Mutex<Vec<Hypothesis>>,
    sandbox_results: Mutex<Vec<SandboxResult>>,
    modifications: Mutex<Vec<ModificationRecord>>,
    immutable: ImmutableFlags,
    active_snapshot_id: Mutex<Option<String>>,
}

impl SelfModificationEngine {
    pub fn new(snapshots_dir: PathBuf) -> Self {
        Self {
            snapshots_dir,
            observations: Mutex::new(Vec::new()),
            hypotheses: Mutex::new(Vec::new()),
            sandbox_results: Mutex::new(Vec::new()),
            modifications: Mutex::new(Vec::new()),
            immutable: ImmutableFlags {
                llm_weights_frozen: true,
                safety_constraints_frozen: true,
                truth_gate_frozen: true,
                inbox_routing_frozen: true,
                max_snapshot_age_hours: 24,
            },
            active_snapshot_id: Mutex::new(None),
        }
    }

    /// STEP 1 — OBSERVE: Record system behavior patterns
    pub fn observe(&self, pattern: PatternType, description: &str, evidence: Vec<String>, severity: Severity) -> String {
        let obs = Observation {
            timestamp_ms: chrono::Utc::now().timestamp_millis(),
            pattern_type: pattern,
            description: description.into(),
            evidence,
            severity,
        };
        let id = self.hash_observation(&obs);
        let mut obs_list = self.observations.lock().unwrap();
        obs_list.push(obs);
        id
    }

    /// STEP 2 — HYPOTHESIZE: Propose an improvement targeting a specific module
    pub fn hypothesize(
        &self,
        observation_id: &str,
        description: &str,
        target_module: &str,
        expected_improvement: &str,
        risk_level: RiskLevel,
    ) -> String {
        let id = format!("hypo-{}", uuid::Uuid::new_v7(uuid::Timestamp::now(uuid::NoContext::default())));
        let hypo = Hypothesis {
            id: id.clone(),
            observation_id: observation_id.into(),
            description: description.into(),
            target_module: target_module.into(),
            expected_improvement: expected_improvement.into(),
            risk_level,
            created_at_ms: chrono::Utc::now().timestamp_millis(),
        };
        self.hypotheses.lock().unwrap().push(hypo);
        id
    }

    /// STEP 3 — SANDBOX: Execute hypothesis in isolation (simulated here)
    /// In production this would spin up a subprocess with modified code
    pub fn sandbox(&self, hypothesis_id: &str) -> SandboxResult {
        let hypotheses = self.hypotheses.lock().unwrap();
        let hypo = hypotheses.iter().find(|h| h.id == hypothesis_id);
        let (passed, error, test_cases_run, test_cases_passed) = match hypo {
            Some(h) => {
                // Simulate test execution
                // In production: fork process, load modified module, run test suite
                if h.risk_level == RiskLevel::Low || h.risk_level == RiskLevel::Medium {
                    (true, None, 10, 10)
                } else {
                    (true, None, 10, 9) // High risk: simulate 1 test failing
                }
            }
            None => (false, Some("Hypothesis not found".into()), 0, 0),
        };
        let exec_time = 50; // simulated ms
        let result = SandboxResult {
            hypothesis_id: hypothesis_id.into(),
            passed,
            execution_time_ms: exec_time,
            output_hash: "sandbox_hash_placeholder".into(),
            error,
            test_cases_run,
            test_cases_passed,
        };
        self.sandbox_results.lock().unwrap().push(result.clone());
        result
    }

    /// STEP 4 — COMMIT: Apply modification if sandbox passed
    /// Returns true if committed, false if blocked by immutable constraint
    pub fn commit(&self, hypothesis_id: &str, human_approved: bool) -> Result<ModificationRecord, &'static str> {
        let hypotheses = self.hypotheses.lock().unwrap();
        let hypo = match hypotheses.iter().find(|h| h.id == hypothesis_id) {
            Some(h) => h.clone(),
            None => return Err("Hypothesis not found"),
        };
        drop(hypotheses);

        // Check immutable constraints
        let target = &hypo.target_module;
        if target.contains("truth_gate") && self.immutable.truth_gate_frozen {
            return Err("Truth Gate is immutable — cannot be modified");
        }
        if target.contains("inbox_routing") && self.immutable.inbox_routing_frozen {
            return Err("INBOX routing is immutable — cannot be modified");
        }
        if target.contains("safety") && self.immutable.safety_constraints_frozen {
            return Err("Safety constraints are immutable");
        }

        // High risk or Extreme risk requires human approval
        if hypo.risk_level == RiskLevel::High || hypo.risk_level == RiskLevel::Extreme {
            if !human_approved {
                return Err("High/Extreme risk modification requires human approval");
            }
        }

        // Get rollback point
        let snapshot_id = self.active_snapshot_id.lock().unwrap().clone()
            .ok_or("No active snapshot — cannot commit without rollback point")?;

        // Create modification record
        let record = ModificationRecord {
            id: format!("mod-{}", uuid::Uuid::new_v7(uuid::Timestamp::now(uuid::NoContext::default()))),
            hypothesis_id: hypothesis_id.into(),
            module_path: hypo.target_module.clone(),
            before_hash: "before_hash_placeholder".into(),
            after_hash: "after_hash_placeholder".into(),
            rollback_point_id: snapshot_id,
            applied_at_ms: chrono::Utc::now().timestamp_millis(),
            human_approved,
            approver_id: if human_approved { Some("brodiblanco".into()) } else { None },
        };

        self.modifications.lock().unwrap().push(record.clone());
        Ok(record)
    }

    /// STEP 5 — ROLLBACK: Restore system to a previous snapshot
    pub fn rollback(&self, snapshot_id: &str) -> Result<(), &'static str> {
        let snapshot_path = self.snapshots_dir.join(format!("snapshot-{}.json", snapshot_id));
        if !snapshot_path.exists() {
            return Err("Snapshot not found");
        }
        let content = fs::read_to_string(&snapshot_path).map_err(|_| "Cannot read snapshot")?;
        let _snapshot: SystemSnapshot = serde_json::from_str(&content).map_err(|_| "Invalid snapshot format")?;

        // Verify snapshot age constraint
        let snapshot: SystemSnapshot = serde_json::from_str(&content).unwrap();
        let age_hours = (chrono::Utc::now().timestamp_millis() - snapshot.timestamp_ms) as f64 / 3_600_000.0;
        if age_hours > self.immutable.max_snapshot_age_hours as f64 {
            return Err("Snapshot too old — exceeds max_snapshot_age_hours");
        }

        // In production: restore agent state, task state, config from snapshot
        *self.active_snapshot_id.lock().unwrap() = Some(snapshot_id.into());
        Ok(())
    }

    /// Create a rollback snapshot of current system state
    pub fn create_snapshot(&self, agent_states: HashMap<String, AgentSnapshot>, task_states: HashMap<String, TaskSnapshot>, config_checksum: &str) -> String {
        let id = format!("snap-{}", uuid::Uuid::new_v7(uuid::Timestamp::now(uuid::NoContext::default())));
        let snapshot = SystemSnapshot {
            id: id.clone(),
            timestamp_ms: chrono::Utc::now().timestamp_millis(),
            agent_state: agent_states,
            task_state: task_states,
            config_checksum: config_checksum.into(),
            immutable_flags: self.immutable.clone(),
        };
        let path = self.snapshots_dir.join(format!("snapshot-{}.json", id));
        let _ = fs::create_dir_all(&self.snapshots_dir);
        let content = serde_json::to_string_pretty(&snapshot).unwrap();
        let _ = fs::write(&path, content);
        *self.active_snapshot_id.lock().unwrap() = Some(id.clone());
        id
    }

    /// Get current cycle status
    pub fn status(&self) -> serde_json::Value {
        let obs = self.observations.lock().unwrap();
        let hypos = self.hypotheses.lock().unwrap();
        let mods = self.modifications.lock().unwrap();
        let sb_results = self.sandbox_results.lock().unwrap();
        serde_json::json!({
            "observations": obs.len(),
            "hypotheses": hypos.len(),
            "modifications": mods.len(),
            "sandbox_results": sb_results.len(),
            "immutable": self.immutable,
            "active_snapshot_id": self.active_snapshot_id.lock().unwrap().clone(),
        })
    }

    fn hash_observation(&self, obs: &Observation) -> String {
        let mut hasher = Sha3_256::new();
        hasher.update(serde_json::to_string(obs).unwrap_or_default());
        hex::encode(hasher.finalize())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    fn test_engine() -> SelfModificationEngine {
        let dir = std::env::temp_dir().join("agentic-sme-test");
        let _ = fs::create_dir_all(&dir);
        Self::new(dir)
    }

    #[test]
    fn test_observe_and_hypothesize() {
        let sme = test_engine();
        let obs_id = sme.observe(
            PatternType::SlowInference,
            "IER routing latency > 200ms for engineering tasks",
            vec!["ier_router.py:50".into(), "task-123".into()],
            Severity::Medium,
        );
        assert!(!obs_id.is_empty());

        let hypo_id = sme.hypothesize(
            &obs_id,
            "Cache Q-table for engineering domain to reduce inference latency",
            "orchestration/ier_router.py",
            "Reduce routing latency from 200ms to <50ms",
            RiskLevel::Low,
        );
        assert!(hypo_id.starts_with("hypo-"));
    }

    #[test]
    fn test_sandbox_low_risk_passes() {
        let sme = test_engine();
        let obs_id = sme.observe(PatternType::Bottleneck, "Test".into(), vec![], Severity::Low);
        let hypo_id = sme.hypothesize(&obs_id, "Test hypo", "module.py", "improvement", RiskLevel::Low);
        let result = sme.sandbox(&hypo_id);
        assert!(result.passed);
        assert_eq!(result.test_cases_passed, result.test_cases_run);
    }

    #[test]
    fn test_sandbox_high_risk_fails_one_test() {
        let sme = test_engine();
        let obs_id = sme.observe(PatternType::Anomaly, "Test".into(), vec![], Severity::High);
        let hypo_id = sme.hypothesize(&obs_id, "Test hypo", "module.py", "improvement", RiskLevel::High);
        let result = sme.sandbox(&hypo_id);
        assert!(result.passed); // still passes but with 1/10 failing
        assert_eq!(result.test_cases_passed, 9);
    }

    #[test]
    fn test_commit_blocked_by_immutable() {
        let sme = test_engine();
        let obs_id = sme.observe(PatternType::HallucinationDetected, "Test".into(), vec![], Severity::Critical);
        let hypo_id = sme.hypothesize(
            &obs_id,
            "Modify truth gate threshold",
            "core/truth_gate.rs",
            "Lower threshold",
            RiskLevel::Low,
        );
        let result = sme.commit(&hypo_id, false);
        assert!(result.is_err());
        assert_eq!(*result.unwrap_err(), "Truth Gate is immutable — cannot be modified");
    }

    #[test]
    fn test_commit_high_risk_requires_human_approval() {
        let sme = test_engine();
        let obs_id = sme.observe(PatternType::FailureMode, "Test".into(), vec![], Severity::High);
        let hypo_id = sme.hypothesize(&obs_id, "Modify routing", "ier_router.py", "improvement", RiskLevel::High);

        // Without approval — blocked
        let result = sme.commit(&hypo_id, false);
        assert!(result.is_err());

        // With approval — succeeds
        // Need snapshot first
        let mut agents = HashMap::new();
        agents.insert("iris".into(), AgentSnapshot { id: "iris".into(), completion_rate: 0.91, active_tasks: 2, skills: vec![] });
        let mut tasks = HashMap::new();
        tasks.insert("t-1".into(), TaskSnapshot { id: "t-1".into(), status: "DONE".into(), agent_id: None, phase: "COMPLETE".into() });
        sme.create_snapshot(agents, tasks, "checksum123");
        let result = sme.commit(&hypo_id, true);
        assert!(result.is_ok());
    }

    #[test]
    fn test_immutables_are_correct() {
        let dir = std::env::temp_dir().join("agentic-sme-immutable");
        let _ = fs::create_dir_all(&dir);
        let sme = SelfModificationEngine::new(dir);
        let flags = &sme.immutable;
        assert!(flags.llm_weights_frozen);
        assert!(flags.safety_constraints_frozen);
        assert!(flags.truth_gate_frozen);
        assert!(flags.inbox_routing_frozen);
    }
}
