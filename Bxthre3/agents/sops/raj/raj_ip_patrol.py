#!/usr/bin/env python3
"""
raj IP Patrol Script
Impenetrability analysis. No tools required. Pattern-based only.
"""
import os
import json
import sys
from datetime import datetime, timedelta

SOPS_DIR = "/home/workspace/Bxthre3/SOPS"
VAULT_DIR = "/home/workspace/Bxthre3/VAULT"

def check_defensibility_layers():
    """
    Check what defensibility layers exist in current IP.
    Returns hardness score 0-10.
    """
    score = 0
    checks = []
    
    # Check 1: Architecture docs exist
    arch_file = f"/home/workspace/Bxthre3/projects/the-agentic-project/AGENTOS_ARCHITECTURE_v6.2.md"
    if os.path.exists(arch_file):
        score += 2
        checks.append("✅ Architecture locked (v6.2)")
    else:
        checks.append("❌ No architecture lock file")
    
    # Check 2: AMP protocol spec
    amp_binary = f"/home/workspace/Bxthre3/projects/the-agentic-project/mobile/app/src/main/java/com/bxthre3/agentic/mesh/protocol/AMPMessage.kt"
    if os.path.exists(amp_binary):
        score += 2
        checks.append("✅ AMP binary protocol defined")
    else:
        checks.append("❌ AMP protocol not hardened")
    
    # Check 3: Build lock files
    mobile_lock = "/home/workspace/Bxthre3/projects/the-agentic-project/mobile/gradle.lockfile"
    if os.path.exists(mobile_lock):
        score += 1
        checks.append("✅ Mobile deps locked")
    else:
        checks.append("❌ No mobile gradle.lockfile")
    
    # Check 4: SOPs exist
    sop_index = f"{SOPS_DIR}/SOP_MASTER_INDEX.md"
    if os.path.exists(sop_index):
        score += 1
        checks.append("✅ SOP framework written")
    else:
        checks.append("❌ No SOP framework")
    
    # Check 5: Guard rails (rules)
    try:
        import subprocess
        result = subprocess.run(['python3', '/home/workspace/Bxthre3/INBOX/agents/INBOX_ROUTING.py', 'test', 'test'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0 or 'ROUTED' in result.stdout:
            score += 1
            checks.append("✅ INBOX routing works")
    except:
        checks.append("⚠️ INBOX routing check failed")
    
    # Check 6: Specialist roster
    roster = f"{SOPS_DIR}/MASTER_ROSTER/COMPLETE_SPECIALIST_ROSTER.md"
    if os.path.exists(roster):
        with open(roster) as f:
            content = f.read()
            if content.count('\n') > 200:
                score += 1
                checks.append("✅ Specialist roster populated")
    else:
        checks.append("❌ No specialist roster")
    
    # Check 7: IDEA_VAULT initialized
    if os.path.exists(f"/home/workspace/Bxthre3/IDEA_VAULT/SYSTEM.md"):
        score += 1
        checks.append("✅ IDEA_VAULT initialized")
    else:
        checks.append("❌ No IDEA_VAULT")
    
    # Check 8: Honey-Do tasks with time
    honey_tasks = f"/home/workspace/Bxthre3/HONEY_DO/backlog/READY_TASKS.md"
    if os.path.exists(honey_tasks):
        score += 1
        checks.append("✅ Honey-Do system defined")
    else:
        checks.append("❌ No Honey-Do system")
    
    return score, checks

def patrol_report():
    """Generate impenetrability report."""
    print("[raj-IP] Running defensibility patrol...")
    print()
    
    score, checks = check_defensibility_layers()
    
    print("-" * 50)
    print(f"DEFENSIBILITY SCORE: {score}/10")
    print("-" * 50)
    print()
    
    for check in checks:
        print(f"  {check}")
    
    print()
    print(f"Assessment: ", end="")
    if score >= 7:
        print("🟢 FORTIFIED — Multiple layers present")
    elif score >= 5:
        print("🟡 MODERATE — Some protection, gaps remain")
    elif score >= 3:
        print("🟠 EXPOSED — Easily replicated by competitors")
    else:
        print("🔴 NAKED — Replicable within weeks")
    
    print()
    print("Recommendations:")
    if score < 7:
        print("  - Lock dependency versions (gradle.lockfile)")
        print("  - Define more SOPs with specialist assignments")
        print("  - Add build reproducibility tests")
    
    # Save report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    report_file = f"{VAULT_DIR}/ip_patrol_{timestamp}.txt"
    os.makedirs(os.path.dirname(report_file), exist_ok=True)
    
    with open(report_file, 'w') as f:
        f.write(f"IP Patrol Report — {datetime.now().isoformat()}\n")
        f.write(f"Score: {score}/10\n\n")
        for c in checks:
            f.write(f"{c}\n")
    
    print(f"\n[raj-IP] Report saved: {report_file}")
    return score

if __name__ == '__main__':
    score = patrol_report()
    sys.exit(0 if score >= 5 else 1)
