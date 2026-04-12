#!/usr/bin/env python3
"""
MEANINGFUL METRICS: Deliverables & Knowledge Capture
Not lines of code — ACTUAL SPECS, PLANS, ARCHITECTURE
"""

import os
import json
from datetime import datetime, timezone
from pathlib import Path
from collections import defaultdict

def scan_deliverables():
    """Find actual deliverables (specs, plans, working code)"""
    
    deliverable_patterns = [
        "*SPEC*.md", "*PLAN*.md", "*ARCHITECTURE*.md", "*CHARTER*.md",
        "*.tsx", "*.py", "*.ts", "*working*", "*MVP*", "*README*"
    ]
    
    # Count by category
    categories = {
        "architecture_docs": [],
        "execution_plans": [],
        "working_code": [],
        "research_outputs": [],
        "total_deliverables": 0
    }
    
    # Scan key directories
    scan_paths = [
        Path("/home/workspace/Bxthre3/projects"),
        Path("/home/workspace/Bxthre3/RESEARCH"),
        Path("/home/workspace/Bxthre3/INBOX")
    ]
    
    for base_path in scan_paths:
        if not base_path.exists():
            continue
            
        for pattern in deliverable_patterns:
            for file in base_path.rglob(pattern):
                if ".git" in str(file) or "node_modules" in str(file):
                    continue
                    
                categories["total_deliverables"] += 1
                
                # Categorize
                if "ARCHITECTURE" in file.name or "SPEC" in file.name:
                    categories["architecture_docs"].append(str(file.relative_to(Path("/home/workspace"))))
                elif "PLAN" in file.name or "CHARTER" in file.name:
                    categories["execution_plans"].append(str(file.relative_to(Path("/home/workspace"))))
                elif file.suffix in [".py", ".tsx", ".ts"] and "working" in str(file).lower():
                    categories["working_code"].append(str(file.relative_to(Path("/home/workspace"))))
                elif "RESEARCH" in str(file) or "VAULT" in str(file):
                    categories["research_outputs"].append(str(file.relative_to(Path("/home/workspace"))))
    
    return categories

def calculate_documentation_ratio():
    """Ratio of docs to code — is knowledge being captured?"""
    docs = len(list(Path("/home/workspace/Bxthre3").rglob("*.md")))
    code = len(list(Path("/home/workspace/Bxthre3").rglob("*.py"))) + \
           len(list(Path("/home/workspace/Bxthre3").rglob("*.ts"))) + \
           len(list(Path("/home/workspace/Bxthre3").rglob("*.tsx")))
    
    if code == 0:
        return 0
    return docs / code

def generate_report():
    """Generate artifact deliverables report"""
    deliverables = scan_deliverables()
    doc_ratio = calculate_documentation_ratio()
    
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "deliverables": {
            "total": deliverables["total_deliverables"],
            "architecture_specs": len(deliverables["architecture_docs"]),
            "execution_plans": len(deliverables["execution_plans"]),
            "working_code_modules": len(deliverables["working_code"]),
            "research_outputs": len(deliverables["research_outputs"])
        },
        "quality_indicators": {
            "documentation_to_code_ratio": round(doc_ratio, 2),
            "knowledge_capture": "STRONG" if doc_ratio > 1.0 else "ADEQUATE" if doc_ratio > 0.5 else "WEAK",
        },
        "interpretation": {
            "high_deliverables": "Value being documented and captured",
            "low_deliverables": "Activity not translating to artifacts",
            "strong_docs": "Knowledge institutionalized, onboarding possible",
            "weak_docs": "Tribal knowledge risk — bus factor dangerous"
        }
    }
    
    # Save
    os.makedirs("/home/workspace/Bxthre3/projects/investor-protector/data", exist_ok=True)
    with open("/home/workspace/Bxthre3/projects/investor-protector/data/artifact_metrics.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"✓ Deliverables: {report['deliverables']['total']} total")
    print(f"✓ Doc/Code Ratio: {doc_ratio:.2f} ({report['quality_indicators']['knowledge_capture']})")
    return report

if __name__ == "__main__":
    generate_report()
