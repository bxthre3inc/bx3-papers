//! Task queue — SQLite-backed state machine.
//!
//! States: PENDING → ASSIGNED → WORKING → REVIEW → DONE
//!         BLOCKED ↔ SUSPENDED
//!
//! Priority: P0 | P1 | P2 | P3

use crate::types::{Task, TaskStatus};

pub struct TaskQueue {
    tasks: Vec<Task>,
}

impl TaskQueue {
    pub fn new() -> Self {
        Self { tasks: Vec::new() }
    }

    /// Get all tasks.
    pub fn all(&self) -> &[Task] {
        &self.tasks
    }

    /// Get all tasks (mutable).
    pub fn all_mut(&mut self) -> &mut Vec<Task> {
        &mut self.tasks
    }

    /// Get task by ID.
    pub fn get(&self, id: &str) -> Option<&Task> {
        self.tasks.iter().find(|t| t.id == id)
    }

    /// Get task by ID (mutable).
    pub fn get_mut(&mut self, id: &str) -> Option<&mut Task> {
        self.tasks.iter_mut().find(|t| t.id == id)
    }

    /// Add a new task.
    pub fn add(&mut self, task: Task) {
        self.tasks.push(task);
    }

    /// Get tasks in a specific status.
    pub fn by_status(&self, status: TaskStatus) -> Vec<&Task> {
        self.tasks.iter().filter(|t| t.status == status).collect()
    }

    /// Get active tasks (PENDING or WORKING).
    pub fn active(&self) -> Vec<&Task> {
        self.tasks.iter()
            .filter(|t| t.status == TaskStatus::Pending || t.status == TaskStatus::Assigned || t.status == TaskStatus::Working)
            .collect()
    }

    /// Get tasks by agent ID.
    pub fn by_agent(&self, agent_id: &str) -> Vec<&Task> {
        self.tasks.iter().filter(|t| t.agent_id.as_deref() == Some(agent_id)).collect()
    }

    /// Get P0/P1 escalations.
    pub fn escalations(&self) -> Vec<&Task> {
        self.tasks.iter()
            .filter(|t| t.priority.as_str() == "P0" || t.priority.as_str() == "P1")
            .collect()
    }

    /// Work queue depth — tasks waiting or in progress.
    pub fn work_queue_depth(&self) -> usize {
        self.tasks.iter()
            .filter(|t| t.status == TaskStatus::Pending || t.status == TaskStatus::Assigned || t.status == TaskStatus::Working)
            .count()
    }
}

impl Default for TaskQueue {
    fn default() -> Self {
        Self::new()
    }
}

/// Trait for task operations (implemented by TaskQueue).
pub trait TaskOperations {
    fn assign(&mut self, task_id: &str, agent_id: &str, agent_name: &str) -> bool;
    fn complete(&mut self, task_id: &str) -> bool;
    fn block(&mut self, task_id: &str, reason: &str) -> bool;
}

impl TaskOperations for TaskQueue {
    fn assign(&mut self, task_id: &str, agent_id: &str, agent_name: &str) -> bool {
        if let Some(task) = self.get_mut(task_id) {
            if task.status != TaskStatus::Pending {
                return false;
            }
            task.agent_id = Some(agent_id.to_string());
            task.agent_name = Some(agent_name.to_string());
            task.status = TaskStatus::Assigned;
            task.updated_at = chrono::Utc::now();
            true
        } else {
            false
        }
    }

    fn complete(&mut self, task_id: &str) -> bool {
        if let Some(task) = self.get_mut(task_id) {
            task.status = TaskStatus::Done;
            task.updated_at = chrono::Utc::now();
            true
        } else {
            false
        }
    }

    fn block(&mut self, task_id: &str, reason: &str) -> bool {
        if let Some(task) = self.get_mut(task_id) {
            task.status = TaskStatus::Blocked;
            task.blockers.push(reason.to_string());
            task.updated_at = chrono::Utc::now();
            true
        } else {
            false
        }
    }
}