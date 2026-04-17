//! Core services — task queue, agent registry, DAP engine, event bus, Truth Gate, Deterministic Shell, Self-Modification Engine, Rollback + Cascade Pause.

pub mod truth_gate;
pub mod shell;
pub mod self_mod;
pub mod rollback;
pub mod ctc_engine;
pub mod inference;
pub mod agent_registry;
pub mod task_queue;
pub mod dap;
pub mod event_bus;

pub use task_queue::{TaskQueue, TaskOperations};
pub use agent_registry::{AgentRegistry, AgentOperations};
pub use dap::{DapEngine, DapPlane};
pub use event_bus::EventBus;