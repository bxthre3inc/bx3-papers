//! Event bus — pub/sub for agentic events.
//!
//! Agents subscribe to event patterns and are notified when matching events occur.

use crate::types::Event;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::broadcast;

/// Event subscription — agent listens to a pattern.
#[derive(Debug, Clone)]
pub struct Subscription {
    pub agent_id: String,
    pub pattern: String,
}

impl Subscription {
    /// Check if an event type matches this subscription pattern.
    pub fn matches(&self, event_type: &str) -> bool {
        // Simple glob matching: "sfd.*" matches "sfd.moisture.reading"
        if self.pattern == "*" {
            return true;
        }
        if self.pattern.ends_with(".*") {
            let prefix = &self.pattern[..self.pattern.len() - 2];
            return event_type.starts_with(prefix);
        }
        self.pattern == event_type
    }
}

/// Event bus — broadcast channel for event distribution.
pub struct EventBus {
    subscriptions: HashMap<String, Vec<Subscription>>,
    tx: broadcast::Sender<Arc<Event>>,
}

impl EventBus {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(1024);
        Self {
            subscriptions: HashMap::new(),
            tx,
        }
    }

    /// Subscribe an agent to an event pattern.
    pub fn subscribe(&mut self, agent_id: &str, pattern: &str) {
        let sub = Subscription {
            agent_id: agent_id.to_string(),
            pattern: pattern.to_string(),
        };
        self.subscriptions
            .entry(agent_id.to_string())
            .or_default()
            .push(sub);
    }

    /// Unsubscribe an agent from all patterns.
    pub fn unsubscribe_all(&mut self, agent_id: &str) {
        self.subscriptions.remove(agent_id);
    }

    /// Publish an event to all matching subscribers.
    pub fn publish(&self, event: Arc<Event>) {
        // Broadcast to all subscribers (best-effort)
        let _ = self.tx.send(event);
    }

    /// Get subscriptions for a specific agent.
    pub fn get_subscriptions(&self, agent_id: &str) -> Option<&Vec<Subscription>> {
        self.subscriptions.get(agent_id)
    }

    /// Get all subscribed agents for a given event type.
    pub fn matching_agents(&self, event_type: &str) -> Vec<String> {
        let mut agents = Vec::new();
        for (agent_id, subs) in &self.subscriptions {
            for sub in subs {
                if sub.matches(event_type) {
                    agents.push(agent_id.clone());
                    break;
                }
            }
        }
        agents
    }

    /// Subscribe to the event stream.
    pub fn subscribe_stream(&self) -> broadcast::Receiver<Arc<Event>> {
        self.tx.subscribe()
    }
}

impl Default for EventBus {
    fn default() -> Self {
        Self::new()
    }
}