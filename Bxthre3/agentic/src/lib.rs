pub mod core;

pub mod api {
    pub mod routes;
    pub mod middleware;
    pub mod models;
    pub mod handlers;
}

pub mod db;

pub mod types;

pub mod integrations;

pub mod orchestration;

pub mod agents;

pub mod mesh;

pub mod tenants;

// Re-export core primitives for external use
pub use core::truth_gate::{TruthGate, VerifyResult, DataClass, SourceHash};
pub use core::shell::{DeterministicShell, ConstraintViolation, WHITELIST_VERSION};

use std::sync::Arc;
use crate::db::Database;
use crate::core::truth_gate::TruthGate;
use crate::core::shell::DeterministicShell;
use crate::core::{AgentRegistry, DapEngine, EventBus, TaskQueue};

/// Application state — shared across all routes.
pub struct AppState {
    pub db: Database,
    pub truth_gate: TruthGate,
    pub shell: DeterministicShell,
    pub version: String,
}

impl AppState {
    pub fn new(db: Database) -> Self {
        AppState {
            db,
            truth_gate: TruthGate::new(),
            shell: DeterministicShell::new(),
            version: env!("CARGO_PKG_VERSION").to_string(),
        }
    }
}