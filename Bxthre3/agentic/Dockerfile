FROM rust:slim-bookworm AS builder

WORKDIR /app

# Install protobuf + OpenSSL for rusqlite
RUN apt-get update && apt-get install -y \
    protobuf-compiler \
    libssl-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests first (for dependency caching)
COPY Cargo.toml Cargo.lock* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release && rm -rf src

# Copy real source
COPY src ./src
COPY AGENTS.md ./

# Build with linkedition=static to avoid glibc version mismatches
RUN cargo build --release \
    --target x86_64-unknown-linux-gnu \
    --package agentic-core \
    --features vendored-openssl

# ─────────────────────────────────────────────
FROM debian:bookworm-slim

LABEL maintainer="Bxthre3 Inc <info@bxthre3.com>"
LABEL description="Agentic — AI Workforce Orchestration Platform"

# Install minimal runtime deps
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/x86_64-unknown-linux-gnu/release/agentic-core /usr/local/bin/
COPY --from=builder /app/AGENTS.md /app/AGENTS.md

# Env defaults
ENV AGENTIC_DB=/app/agentic.db
ENV AGENTIC_PORT=3001
ENV RUST_LOG=info

EXPOSE 3001

ENTRYPOINT ["agentic-core"]
