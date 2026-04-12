//! Agentic — AI Workforce Orchestration Platform
//!
//! Canonical Rust implementation. Clean architecture:
//! - api/: HTTP handlers (Axum)
//! - core/: Business logic (task queue, DAP, event bus, agent registry)
//! - db/: SQLite persistence
//! - types/: Domain types
//! - integrations/: Skills and tool registry
//!
//! Build: cargo build --release
//! Run: AGENTIC_DB=/data/agentic.db AGENTIC_PORT=3001 cargo run --bin agentic-core

pub mod api;
pub mod core;
pub mod db;
pub mod integrations;
pub mod types;