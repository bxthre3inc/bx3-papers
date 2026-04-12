//! API middleware — auth, rate limiting, logging.

use axum::{
    extract::Request,
    middleware::Next,
    response::Response,
};
use std::time::Instant;

/// Logging middleware — logs request method, path, and latency.
pub async fn logging(next: Next) -> Response {
    let method = next.request().method().clone();
    let uri = next.request().uri().clone();
    let start = Instant::now();
    let response = next.run(next.request).await;
    let elapsed = start.elapsed();
    tracing::info!(
        method = %method,
        uri = %uri,
        status = response.status().as_u16(),
        elapsed_ms = elapsed.as_millis(),
        "request completed"
    );
    response
}