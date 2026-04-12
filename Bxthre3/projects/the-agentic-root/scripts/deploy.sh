#!/bin/bash
# Agentic Deploy Script
# Usage: ./scripts/deploy.sh [environment]

ENV=${1:-production}

echo "Deploying Agentic to $ENV..."

case $ENV in
  local)
    bun run src/server.ts
    ;;
  zo)
    echo "Deploying to Zo Hosting..."
    # Build
    bun run build
    # Deploy via Zo API
    curl -X POST "https://api.zo.computer/v1/services/agentic/deploy" \
      -H "Authorization: Bearer $ZO_API_KEY" \
      --data-binary @dist/server.js
    ;;
  docker)
    docker build -t agentic:latest .
    docker run -p 3000:3000 agentic:latest
    ;;
  *)
    echo "Unknown environment: $ENV"
    echo "Usage: ./deploy.sh [local|zo|docker]"
    exit 1
    ;;
esac