//! SQLite database layer for Agentic.

use anyhow::{Context, Result};
use rusqlite::{Connection, params};
use std::path::Path;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Database wrapper — wraps rusqlite connection in tokio Mutex for async access.
pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    /// Open or create the database at the given path.
    pub fn open<P: AsRef<Path>>(path: P) -> Result<Self> {
        let conn = Connection::open(path)
            .context("failed to open database")?;
        conn.execute_batch(include_str!("schema.sql"))
            .context("failed to initialize schema")?;
        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }

    /// Get a locked reference to the connection.
    pub async fn conn(&self) -> tokio::sync::MutexGuard<'_, Connection> {
        self.conn.lock().await
    }
}

/// Seed the canonical 19-agent roster into the database.
pub async fn seed_agents(db: &Database) -> Result<()> {
    use crate::types::Agent;
    let agents = Agent::canonical_roster();
    let conn = db.conn().await;
    for agent in agents {
        conn.execute(
            "INSERT OR REPLACE INTO agents (id, name, role, department, status, completion_rate, active_tasks, email, avatar, agent_type, last_seen)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
            params![
                agent.id,
                agent.name,
                agent.role,
                agent.department,
                format!("{:?}", agent.status),
                agent.completion_rate,
                agent.active_tasks,
                agent.email,
                agent.avatar,
                agent.agent_type,
                agent.last_seen.to_rfc3339(),
            ],
        )?;
    }
    Ok(())
}