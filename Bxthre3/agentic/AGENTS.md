# Agentic — Build Configuration

> Last updated: 2026-04-17

## Context

This is the standalone production build of **Agentic** — the AI workforce orchestration platform from Bxthre3 Inc. It is NOT built on zo.space "parts" — it compiles and runs as a standalone Rust binary, integrating with zo.computer via API calls (not as a embedded subsystem).

The zo.space Agentic is the prototype/shell. This repo is the real thing.

---

## Build Goal

**Get `agentic-core` binary running on a Linux host (or as a GitHub Actions artifact)**

Binary entry point: `src/bin/agentic.rs`
Library: `src/lib.rs`
Axum HTTP server on port 3001 (configurable via AGENTIC_PORT env var)
SQLite persistence (configurable via AGENTIC_DB env var)

## Dependencies (Cargo.toml)

```
axum 0.7, tokio 1.x (full), rusqlite 0.32 (bundled), serde, uuid 1.11.0,
chrono, sha3 0.10.6, async-trait
```

**Constraint: Rust 1.63 toolchain (cargo 1.65)** — older machine, cannot update
→ sha3 pinned to 0.10.6, uuid pinned to 1.11.0 to avoid getrandom 0.4.2 which requires edition 2024

## Key Files

| File | Purpose |
|------|---------|
| `Cargo.toml` | Package manifest |
| `Cargo.lock` | Lock file (regenerated from scratch) |
| `src/lib.rs` | Core library exports |
| `src/bin/agentic.rs` | Binary entry point |
| `src/api/mod.rs` | Axum router + handlers |
| `src/core/agent_registry.rs` | 18-agent registry |
| `src/core/dap.rs` | Deterministic Assertion Protocol |
| `src/db/schema.sql` | SQLite schema |

## Build Commands

```bash
# Local (fails — Rust too old)
cargo build --release

# GitHub Actions (uses latest Rust)
cargo build --release  # in ubuntu-latest with stable Rust

# Test binary location
./target/release/agentic-core
# Run: AGENTIC_PORT=3001 AGENTIC_DB=/tmp/agentic.db ./target/release/agentic-core
```

## What Needs Fixing

1. **Rust toolchain** — cargo 1.65 / Rust 1.63 can't build modern crates
   - Solution: GitHub Actions uses latest stable, bypasses local constraint
2. **Cargo.lock** — was regenerated, may need `--locked` after first successful build
3. **API parity** — `src/api/mod.rs` and `src/api/handlers/` need to match the zo.space prototype endpoints (19 endpoints listed in BUILD_STATUS.md)

## Production Target

Binary runs on any Linux x86_64 host. No runtime dependencies beyond standard library + SQLite (bundled via rusqlite). Serve on port 3001, accepts API calls from zo.computer for integration.

## Environment Variables

| Var | Default | Purpose |
|-----|---------|---------|
| AGENTIC_PORT | 3001 | HTTP server port |
| AGENTIC_DB | /tmp/agentic.db | SQLite database path |
| LOG_LEVEL | info | tracing log level |