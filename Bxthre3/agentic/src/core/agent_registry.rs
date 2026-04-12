//! Agent registry — canonical 19-agent roster.

use crate::types::{Agent, AgentStatus, OrgEntry};

pub struct AgentRegistry {
    agents: Vec<Agent>,
}

impl AgentRegistry {
    pub fn new() -> Self {
        Self {
            agents: Agent::canonical_roster(),
        }
    }

    pub fn all(&self) -> &[Agent] {
        &self.agents
    }

    pub fn all_mut(&mut self) -> &mut Vec<Agent> {
        &mut self.agents
    }

    pub fn get(&self, id: &str) -> Option<&Agent> {
        self.agents.iter().find(|a| a.id == id)
    }

    pub fn get_mut(&mut self, id: &str) -> Option<&mut Agent> {
        self.agents.iter_mut().find(|a| a.id == id)
    }

    pub fn org_chart(&self) -> Vec<OrgEntry> {
        self.agents.iter().map(|a| OrgEntry {
            id: a.id.clone(),
            name: a.name.clone(),
            role: a.role.clone(),
            department: a.department.clone(),
            agent_type: a.agent_type.clone(),
            reports_to: if a.id == "brodiblanco" { None } else { Some("brodiblanco".into()) },
        }).collect()
    }

    pub fn active_count(&self) -> usize {
        self.agents.iter().filter(|a| a.status == AgentStatus::Active).count()
    }

    pub fn avg_completion_rate(&self) -> f64 {
        if self.agents.is_empty() {
            return 0.0;
        }
        let sum: f64 = self.agents.iter().map(|a| a.completion_rate).sum();
        sum / self.agents.len() as f64
    }
}

impl Default for AgentRegistry {
    fn default() -> Self {
        Self::new()
    }
}

/// Trait for agent operations.
pub trait AgentOperations {
    fn activate(&mut self, id: &str) -> bool;
    fn deactivate(&mut self, id: &str) -> bool;
}

impl AgentOperations for AgentRegistry {
    fn activate(&mut self, id: &str) -> bool {
        if let Some(agent) = self.get_mut(id) {
            agent.status = AgentStatus::Active;
            agent.last_seen = chrono::Utc::now();
            true
        } else {
            false
        }
    }

    fn deactivate(&mut self, id: &str) -> bool {
        if let Some(agent) = self.get_mut(id) {
            agent.status = AgentStatus::Idle;
            true
        } else {
            false
        }
    }
}