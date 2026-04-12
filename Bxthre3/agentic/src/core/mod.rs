//! Core services — task queue, agent registry, DAP engine, event bus.

pub mod task_queue;
pub mod agent_registry;
pub mod dap;
pub mod event_bus;

pub use task_queue::{TaskQueue, TaskOperations};
pub use agent_registry::{AgentRegistry, AgentOperations};
pub use dap::{DapEngine, DapPlane};
pub use event_bus::EventBus;