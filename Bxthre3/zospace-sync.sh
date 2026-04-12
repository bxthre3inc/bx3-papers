#!/bin/bash
# Sync all Bxthre3 zo.space pages with autodark styling
# Usage: bash zospace-sync.sh

# Requires: ZO_CLIENT_IDENTITY_TOKEN env var set

declare -A PAGES[
  ["home"]="/"
  ["irrig8"]="/projects/irrig8"
  ["agentic"]="/projects/agentic"
  ["vpc"]="/projects/vpc"
]

echo "Syncing zo.space routes..."
echo "Token present: ${ZO_CLIENT_IDENTITY_TOKEN:+YES}"

# This requires your Zo token - get it from Settings > Advanced > Access Tokens
# Then run: export ZO_CLIENT_IDENTITY_TOKEN="your_token_here"
