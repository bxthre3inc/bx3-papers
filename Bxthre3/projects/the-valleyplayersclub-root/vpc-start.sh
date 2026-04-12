#!/bin/bash
# VPC Edge Server Start Script for Zo Computer

set -e

cd /home/workspace/Bxthre3/projects/the-valleyplayersclub-project

# Ensure data directories exist
mkdir -p server/data server/backups server/uploads

# Install deps and build
cd server
bun install

# Run migrations (SQLite)
# bun run migrate (if you have a migrate script)

cd ..

# Build frontend
npm run build

# Start edge server
cd server
bun run src/index.ts
