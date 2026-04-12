//! Agentic main binary entry point.

use agentic::api::{self, AppState};
use agentic::db::{self, Database};
use anyhow::Result;
use std::net::SocketAddr;
use std::path::PathBuf;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[tokio::main]
async fn main() -> Result<()> {
    // Parse CLI args
    let db_path = std::env::var("AGENTIC_DB")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("/tmp/agentic.db"));

    let port: u16 = std::env::var("AGENTIC_PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse()?;

    // Initialize logging
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("agentic-core starting");
    tracing::info!("database: {}", db_path.display());
    tracing::info!("port: {}", port);

    // Open database
    let db = Database::open(&db_path)?;

    // Seed canonical agents
    db::seed_agents(&db).await?;

    // Build state and router
    let state = std::sync::Arc::new(AppState::new(db));
    let app = api::router(state);

    // Start server
    let addr: SocketAddr = ([0, 0, 0, 0], port).into();
    tracing::info!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}