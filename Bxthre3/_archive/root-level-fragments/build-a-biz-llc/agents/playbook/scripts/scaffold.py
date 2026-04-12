#!/usr/bin/env python3
"""
Build-A-Biz Business Scaffolder
Generates a new Build-A-Biz instance from templates
"""

import argparse
import os
import shutil
import re
from pathlib import Path
import subprocess
import json

def scaffold_business(name: str, owner: str, territory: str, state: str = "Colorado", 
                      biz_type: str = "SERVICE", archetype: str = "FIRST_TIME"):
    """Create a new Build-A-Biz directory structure with dynamic questionnaire."""
    
    base = Path("/home/workspace/Bxthre3/projects/build-a-biz-enterprise")
    slug = name.lower().replace(" ", "-").replace("_", "-")
    target = base / "scaffolds" / slug
    
    if target.exists():
        print(f"⚠️  {target} already exists. Aborting.")
        return False
    
    # Generate dynamic questionnaire via engine
    engine_path = base / "playbook" / "scripts" / "questionnaire_engine.py"
    try:
        result = subprocess.run(
            ["python3", str(engine_path), 
             "--type", biz_type, 
             "--archetype", archetype, 
             "--territory", territory],
            capture_output=True, text=True, check=True
        )
        q_data = json.loads(result.stdout)
    except Exception as e:
        print(f"⚠️  Questionnaire engine failed: {e}")
        q_data = None
    
    # Copy template structure
    shutil.copytree(base / "templates", target)
    
    # Create supporting directories
    (target / "client-data").mkdir(exist_ok=True)
    (target / "outreach").mkdir(exist_ok=True)
    (target / "onboarding").mkdir(exist_ok=True)
    (target / "grants").mkdir(exist_ok=True)
    (target / "legal").mkdir(exist_ok=True)
    
    # Generate DYNAMIC owner questionnaire
    if q_data:
        q_md = f"""% {name}
% Owner Questionnaire
% Path: {q_data['path_name']}
% Prepared for: {owner}
% {os.popen('date +"%B %Y"').read().strip()}

---

# {name}
## Owner Onboarding Questionnaire

**Owner:** {owner}  
**Business:** {name}  
**Territory:** {territory}  
**State:** {state}  
**Question Path:** {q_data['path_name']}  
**Estimated Time:** {q_data['estimated_minutes']} minutes  
**Hash:** `{q_data['hash']}`

---

This questionnaire is **deterministic** — same business type + archetype + territory always produces this exact question set. Questions are weighted for grant scoring.

---

"""
        for q in q_data['questions']:
            q_md += f"""### {q['id'].upper()}

**Question:** {q['text'].replace('[BUSINESS]', name)}

**Why we ask:** {q['context']}

**Grant weight:** {q['weight']}x

---

**Answer:**

_____________________________________________________________________________

_____________________________________________________________________________

---

"""
        
        q_md += f"""---

*Path ID: {q_data['path_id']}*  
*Generated: {os.popen('date -I').read().strip()}*
"""
        
        (target / "onboarding" / "QUESTIONNAIRE.md").write_text(q_md)
    
    # Create customized agent configs
    for agent_type in ["leadgen", "sales", "onboarding", "account-manager"]:
        agent_file = target / "agents" / agent_type / "AGENT.md"
        if agent_file.exists():
            content = agent_file.read_text()
            content = content.replace("[BUSINESS_NAME]", name)
            content = content.replace("[OWNER_NAME]", owner)
            agent_file.write_text(content)
    
    # Create README for new business
    readme = f"""# {name}

**Owner:** {owner}
**Territory:** {territory}
**State:** {state}
**Model:** Build-A-Biz Package

---

## Quick Links

- Owner Questionnaire: `file 'onboarding/OWNER_QUESTIONNAIRE.md'`
- Agent Configs: `file 'agents/'`
- Client Data: `file 'client-data/'`

---

## Next Steps

1. [ ] Complete OWNER_QUESTIONNAIRE.md with {owner}
2. [ ] File Articles of Organization ({state} Secretary of State)
3. [ ] Obtain EIN from IRS
4. [ ] Open business bank account
5. [ ] Configure digital presence (Google, Calendly, etc.)
6. [ ] Deploy onboarding portal
7. [ ] First client outreach

---

*Scaffolded: {os.popen('date -I').read().strip()}*
"""
    
    (target / "README.md").write_text(readme)
    
    print(f"✅ Scaffolded: {target}")
    print(f"   Owner: {owner}")
    print(f"   Territory: {territory}")
    print(f"\nNext: Edit {target}/onboarding/OWNER_QUESTIONNAIRE.md")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scaffold a new Build-A-Biz instance")
    parser.add_argument("--name", required=True, help="Business name")
    parser.add_argument("--owner", required=True, help="Owner full name")
    parser.add_argument("--territory", required=True, help="Service territory")
    parser.add_argument("--state", default="Colorado", help="State of formation")
    parser.add_argument("--biz-type", default="SERVICE", 
                        choices=["SERVICE", "PRODUCT", "RETAIL", "TECH", "FARM", "GRANT_WRITER"],
                        help="Business type (determines question path)")
    parser.add_argument("--archetype", default="FIRST_TIME",
                        choices=["FIRST_TIME", "SERIAL", "PIVOT", "SIDE_HUSTLE"],
                        help="Owner archetype (determines question depth)")
    parser.add_argument("--dry-run", action="store_true", help="Preview questionnaire only")
    args = parser.parse_args()
    
    if args.dry_run:
        # Just show the questionnaire
        import subprocess
        import json
        engine = Path("/home/workspace/Bxthre3/projects/build-a-biz-enterprise/playbook/scripts/questionnaire_engine.py")
        result = subprocess.run(
            ["python3", str(engine), "--type", args.biz_type, 
             "--archetype", args.archetype, "--territory", args.territory],
            capture_output=True, text=True, check=True
        )
        q = json.loads(result.stdout)
        print(f"\n📋 QUESTIONNAIRE PREVIEW")
        print(f"   Path: {q['path_name']}")
        print(f"   Time: {q['estimated_minutes']} min")
        print(f"   Questions: {q['question_count']}\n")
        for question in q['questions']:
            print(f"   • {question['text'].replace('[BUSINESS]', args.name)}")
            print(f"     (weight: {question['weight']}x — {question['context']})\n")
    else:
        scaffold_business(args.name, args.owner, args.territory, args.state, args.biz_type, args.archetype)
