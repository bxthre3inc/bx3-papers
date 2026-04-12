#!/bin/bash
# Investor Protector — Data Collection Pipeline
# Run every 6 hours via cron or Agentic automation

cd /home/workspace/Bxthre3/projects/investor-protector/data_sources

echo "=== Investor Protector Data Collection ==="
echo "Started: $(date)"
echo ""

# Collect all metrics
python3 execution_metrics.py
python3 artifact_metrics.py  
python3 cost_tracker.py
python3 productivity_metrics.py
python3 verification_audit.py

echo ""
echo "Completed: $(date)"
