#!/usr/bin/env python3
"""
Cost Tracking Collector for Investor Protector
Tracks all BX3 infrastructure and service costs
"""

import os
import json
from datetime import datetime, timezone

COST_CATEGORIES = {
    "zo_computer": 0,  # Included in base
    "github_actions": 0,  # Free tier
    "render": 0,  # Ghost cloud strategy
    "twilio": 0,  # SMS costs
    "supabase": 0,  # Database
    "vercel": 0,  # Ghost cloud strategy
    "stripe": 0,  # Payment processing (variable)
}

def collect_costs():
    """Collect all cost data — manual entry for MVP"""
    # TODO: Integrate with actual APIs when available
    # For now, manual weekly update via dashboard
    
    metrics = {
        "timestamp": datetime.utcnow().isoformat(),
        "categories": COST_CATEGORIES,
        "total_weekly": 0,  # Calculate from categories
        "runway_weeks": None if sum(COST_CATEGORIES.values()) == 0 else "calculating",
        "burn_rate": "needs manual entry"
    }
    
    # Save to data directory
    os.makedirs("/home/workspace/Bxthre3/projects/investor-protector/data", exist_ok=True)
    path = "/home/workspace/Bxthre3/projects/investor-protector/data/cost_metrics.json"
    with open(path, "w") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✓ Cost metrics saved: {path}")
    return metrics

if __name__ == "__main__":
    collect_costs()
