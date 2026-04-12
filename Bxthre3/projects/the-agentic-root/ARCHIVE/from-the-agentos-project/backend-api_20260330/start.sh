#!/bin/bash
export PORT="${PORT:-9999}"
export MESH_SECRET="${MESH_SECRET:-dev-secret}"
exec /usr/local/bin/bun /home/workspace/Bxthre3/projects/agentic-backend/dist/server.js
