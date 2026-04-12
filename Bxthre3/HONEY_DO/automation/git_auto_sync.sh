#!/bin/bash
# Git Auto-Sync for Agentic
# Triggers on login to any frontend → syncs all connected nodes

REPO_DIR="/home/workspace/Bxthre3/projects/the-agentic-project"
USER="brodiblanco"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/home/workspace/Bxthre3/TELEMETRY/git_sync.log"

log_sync() {
    echo "[$TIMESTAMP] $1" >> "$LOG_FILE"
}

cd "$REPO_DIR" || exit 1

# Pull latest from origin
log_sync "Pulling from origin..."
if git pull origin main >> "$LOG_FILE" 2>&1; then
    log_sync "✅ Pull successful"
else
    log_sync "⚠️  Pull failed or no origin"
fi

# Check for local changes
if ! git diff-index --quiet HEAD --; then
    # Changes detected - commit and push
    log_sync "Changes detected, committing..."
    git add -A
    git commit -m "auto-sync: $TIMESTAMP from $USER" >> "$LOG_FILE" 2>&1
    
    if git push origin main >> "$LOG_FILE" 2>&1; then
        log_sync "✅ Push successful"
    else
        log_sync "❌ Push failed"
    fi
else
    log_sync "No local changes"
fi

# Sync notification to AMP mesh (if server running)
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    curl -s -X POST http://localhost:8080/task/offer \
        -H "Content-Type: application/json" \
        -d "{\"type\":\"git.sync\",\"payload\":{\"user\":\"$USER\",\"timestamp\":\"$TIMESTAMP\"},\"target_node\":1}" \
        >> "$LOG_FILE" 2>&1
    log_sync "✅ AMP notified"
else
    log_sync "⚠️  AMP server not running"
fi

echo "[$TIMESTAMP] Git sync complete"
