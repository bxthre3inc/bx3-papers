#!/usr/bin/env python3
"""
AgentOS Runner v1.1 — Bridges file INBOXes to Zo API execution
Managed by Pulse (VP People Operations)
"""
import os, json, subprocess
from datetime import datetime

WORKSPACE = "/home/workspace"
INBOX_DIR = WORKSPACE + "/Bxthre3/INBOX/agents"
RUNNER_LOG = WORKSPACE + "/Bxthre3/agents/runner/runner.log"
ZO_API = "https://api.zo.computer/zo/ask"

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = "[{ts}] {msg}".format(ts=ts, msg=msg)
    print(line)
    os.makedirs(os.path.dirname(RUNNER_LOG), exist_ok=True)
    with open(RUNNER_LOG, "a") as f:
        f.write(line + "\n")

def read_inbox(agent):
    path = INBOX_DIR + "/" + agent + ".md"
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return f.read()

def extract_field(content, field):
    for line in content.split("\n"):
        if "**" + field + ":**" in line:
            return line.split(":**", 1)[1].strip()
    return None

def get_status(content):
    for line in content.split("\n"):
        if "Status:" in line:
            for s in ["complete", "in_progress", "blocked"]:
                if s in line.lower():
                    return s
    return "unknown"

def extract_task_section(content):
    # Find the task section — look for lines after ## headers that contain **Task:**
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if "**Task:**" in line:
            return line.split("**Task:**", 1)[1].strip()
        if "**Task:**" in line:
            task_line = lines[i]
            task = task_line.split("**Task:**", 1)[1].strip()
            # Grab following lines that are continuation
            j = i + 1
            while j < len(lines) and (lines[j].startswith("**") or lines[j].strip() == "" or not lines[j].startswith("##")):
                if lines[j].startswith("**") and ":**" in lines[j]:
                    break
                task += " " + lines[j].strip()
                j += 1
            return task.strip()
    return None

def needs_execution(agent):
    content = read_inbox(agent)
    if not content:
        return False, None
    status = get_status(content)
    task = extract_task_section(content)
    if task:
        return status in ("unknown", "pending", "") and len(task) > 10, task
    return False, None

def call_zo(prompt):
    token = os.environ.get("ZO_CLIENT_IDENTITY_TOKEN", "")
    if not token:
        log("ERROR: ZO_CLIENT_IDENTITY_TOKEN not set")
        return None
    try:
        payload = json.dumps({
            "input": prompt,
            "model_name": "vercel:minimax/minimax-m2.7"
        })
        result = subprocess.run([
            "curl", "-s", "-X", "POST", ZO_API,
            "-H", "Authorization: Bearer " + token,
            "-H", "Content-Type: application/json",
            "-d", payload
        ], capture_output=True, text=True, timeout=300)
        if result.returncode == 0 and result.stdout:
            data = json.loads(result.stdout)
            return data.get("output", "")
    except Exception as e:
        log("ERROR calling Zo API: " + str(e))
    return None

def mark_in_progress(agent):
    content = read_inbox(agent)
    if not content:
        return
    if "Status: pending" in content:
        content = content.replace("Status: pending", "Status: in_progress")
    elif "Status: unknown" in content:
        content = content.replace("Status: unknown", "Status: in_progress")
    elif "Status:" in content and "in_progress" not in content and "complete" not in content:
        for line in content.split("\n"):
            if "Status:" in line and "in_progress" not in line and "complete" not in line:
                content = content.replace(line, line.replace("Status:", "Status: in_progress — "))
                break
    with open(INBOX_DIR + "/" + agent + ".md", "w") as f:
        f.write(content)

def run_agent(agent, task):
    log("EXECUTING: " + agent + " -- " + task[:80])
    prompt = (
        "You are " + agent.title() + ", an AgentOS agent at Bxthre3 Inc.\n"
        "Your job: " + task + "\n\n"
        "Working directory: " + WORKSPACE + "/Bxthre3/\n"
        "Write your completed work to: " + INBOX_DIR + "/" + agent + ".md under '## Results'\n"
        "Mark status as 'complete' when done.\n"
        "Escalate to " + WORKSPACE + "/Bxthre3/INBOX.md if P0/P1.\n"
        "Start immediately. Execute now."
    )
    result = call_zo(prompt)
    if result:
        log("DONE: " + agent + " -- " + str(len(result)) + " chars")
    else:
        log("FAILED: " + agent)
    return result

def scan_and_execute():
    try:
        agents = [f[:-3] for f in os.listdir(INBOX_DIR) if f.endswith(".md")]
    except:
        agents = []
    executed = 0
    for agent in agents:
        needs_run, task = needs_execution(agent)
        if needs_run:
            log("FOUND TASK: " + agent + " — " + task[:60])
            mark_in_progress(agent)
            run_agent(agent, task)
            executed += 1
    return executed

if __name__ == "__main__":
    log("=== AgentOS Runner scan ===")
    executed = scan_and_execute()
    log("Done. Executed: " + str(executed))
