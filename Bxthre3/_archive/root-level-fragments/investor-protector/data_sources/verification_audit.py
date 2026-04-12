#!/usr/bin/env python3
"""
Verification & Audit Trail Generator for Investor Protector
Creates Merkle-like hashes for all metrics
"""

import os
import json
import hashlib
from datetime import datetime
from pathlib import Path

def hash_metrics_file(filepath: str) -> str:
    """Generate SHA-256 hash of metrics file"""
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:16]

def generate_audit_trail():
    """Generate audit trail with hashes"""
    data_dir = Path("/home/workspace/Bxthre3/projects/investor-protector/data")
    
    audit = {
        "timestamp": datetime.utcnow().isoformat(),
        "sources": {},
        "integrity_hash": None
    }
    
    for metrics_file in data_dir.glob("*.json"):
        source_name = metrics_file.stem
        audit["sources"][source_name] = {
            "file": str(metrics_file),
            "hash": hash_metrics_file(str(metrics_file)),
            "size_bytes": metrics_file.stat().st_size
        }
    
    # Overall integrity hash
    all_hashes = "".join(sorted([s["hash"] for s in audit["sources"].values()]))
    audit["integrity_hash"] = hashlib.sha256(all_hashes.encode()).hexdigest()[:16]
    
    # Save audit
    os.makedirs(data_dir, exist_ok=True)
    audit_path = data_dir / "audit_trail.json"
    with open(audit_path, "w") as f:
        json.dump(audit, f, indent=2)
    
    print(f"✓ Audit trail saved: {audit_path}")
    return audit

if __name__ == "__main__":
    generate_audit_trail()
