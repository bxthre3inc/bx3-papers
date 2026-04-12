#!/usr/bin/env python3
# Stub Finder v2 - Agentic

import re, os, sys
from datetime import datetime
from pathlib import Path

WORKSPACE = Path("/home/workspace")
PATHS = [
    WORKSPACE / "Bxthre3/projects/the-agentic-project/core/",
    WORKSPACE / "Bxthre3/shared/agentic/core/",
    WORKSPACE / "Bxthre3/projects/the-agentic-native/app/src/main/kotlin/com/bxthre3/agentic/",
]
EXTS = {".ts", ".kt", ".java", ".js", ".py", ".sh"}

RESPONSIBLE = {
    "events":"zoe","hierarchy":"zoe","memory":"zoe","protocol":"zoe",
    "escalation":"sentinel","reporting":"pulse","sprint":"maya",
    "subagent":"dev","bxthre3":"zoe","orchestrator":"zoe",
    "personas":"iris","hiring":"pulse","performance":"pulse",
    "monitors":"sentinel","risk":"sentinel","departments":"zoe",
    "warroom":"zoe","employees":"zoe","grants":"maya",
    "ip":"iris","projects":"iris","subsidiary":"zoe",
    "transfer":"pulse","conflict":"zoe","snapshot":"sentinel",
    "scheduler":"theo","security":"taylor","backup":"theo",
    "analytics":"sam","notifications":"zoe","voice":"zoe",
    "collaboration":"zoe","compliance":"raj","onboarding":"pulse",
    "goals":"zoe","drift":"sentinel","training":"pulse",
    "emergency":"sentinel","budget":"sam","audit":"raj",
    "infrastructure":"theo","runtime":"dev","hybrid":"dev",
    "android":"dev","shared/agentic":"zoe",
}

PHANTOMS = {
    "quinn","riley","sage","nico","blake","ira","skye","cameron",
    "alex","jordan","taylor-brooks","blake-rivera","sage-williams",
    "nico-anderson","casey-lin","iris-park","quinn-taylor","riley-kim",
    "chronicler","avery","remy","nexus","navigate","vault","sync",
    "architect","blueprint","brand","trace",
}

CCRS = []

def responsible(rel):
    for prefix, agent in RESPONSIBLE.items():
        if prefix in rel: return agent
    if "android" in rel.lower(): return "dev"
    return "zoe"

def add_ccr(severity, category, rel, line, desc, snippet):
    global CCRS
    key = (rel, line, desc[:50])
    if any(c["file"]==rel and c["line"]==line and c["description"][:50]==desc[:50] for c in CCRS): return
    CCRS.append({
        "id": "stub-{}".format(len(CCRS)+1),
        "severity": severity, "category": category,
        "file": rel, "line": line,
        "description": desc, "snippet": snippet[:120].strip(),
        "agent": responsible(rel), "status": "pending"
    })

def scan_file(fp):
    ext = fp.suffix
    if ext not in EXTS: return
    rel = str(fp.relative_to(WORKSPACE))
    if "stub-finder" in rel or "/test." in rel or "_test." in rel: return
    try: content = fp.read_text(errors="ignore")
    except: return
    lines_list = content.split("\n")
    for i, line in enumerate(lines_list, 1):
        s = line.strip()
        if s.startswith("//") or s.startswith("#") or not s: continue
        if re.search(r"return\s+\{[^\}]{0,200}\}\s*;?\s*(?://.*)?$", line):
            add_ccr("high","stub",rel,i,"Hardcoded object literal return (mock/stub)",line)
        if re.search(r"(?:TODO|FIXME|HACK|XXX|BUG):", line):
            add_ccr("medium","stub",rel,i,"Unresolved TODO/FIXME in live code",line)
        m = re.search(r"function\s+\w+\s*\([^)]*\)\s*\{\s*(?://.*)?\s*\}\s*;?", line)
        if m: add_ccr("high","stub",rel,i,"Empty function body -- unimplemented",line)
        if "console.log" in line and re.search(r"return\s+", line):
            add_ccr("high","stub",rel,i,"console.log + return -- stub pattern",line)
        if re.search(r"(?:faker|randomFloat|randomInt|makeUp)\s*\(", line):
            add_ccr("medium","stub",rel,i,"Fake data generator in production code",line)
        if ext == ".kt" and re.search(r"fun\s+fetch\w+\s*\([^)]*\)\s*[=:]\s*listOf", line):
            add_ccr("high","stub",rel,i,"Fetch returning hardcoded listOf -- mock pattern",line)
        if "fetchSystemHealth" in line and "SystemHealth(" in line:
            add_ccr("high","stub",rel,i,"fetchSystemHealth returning hardcoded data -- no HTTP call",line)
        if re.search(r"throw\s+new\s+Error\s*\(\s*['\"]not", line):
            add_ccr("high","stub",rel,i,"NotImplemented exception -- missing implementation",line)
    for phantom in PHANTOMS:
        if re.search("['\\\"']" + re.escape(phantom) + "['\\\"'\s,:\)]", content):
            add_ccr("high","phantom_agent",rel,1,"Phantom agent id in code: " + phantom, phantom)
    if abs(content.count("{") - content.count("}")) > 2:
        add_ccr("high","incomplete",rel,1,"Mismatched braces -- likely truncated file","brace count off")
    if "ApiService" in content and ("listOf(" in content or "SystemHealth(" in content):
        if not re.search(r"(?:fetch|http|URL|HttpClient)", content):
            add_ccr("high","stub",rel,1,"ApiService has no HTTP calls -- pure mock data","ApiService mock")

def run():
    global CCRS; CCRS = []
    scanned = 0
    for base in PATHS:
        if not base.exists(): continue
        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs if d not in {"node_modules",".gradle","build","dist",".git","__pycache__"}]
            for fn in files:
                scan_file(Path(root)/fn); scanned += 1
    CCRS.sort(key=lambda c: ({"high":0,"medium":1,"low":2}.get(c["severity"],3), c["file"], c["line"]))
    filed = file_ccrs(CCRS)
    print_report(CCRS, scanned, filed)
    return CCRS

def file_ccrs(ccrs):
    by_agent = {}
    for c in ccrs:
        by_agent.setdefault(c["agent"], []).append(c)
    routing = Path("/home/workspace/Bxthre3/INBOX/agents")
    filed = 0
    ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    for agent, findings in by_agent.items():
        inbox = routing / (agent + ".md")
        entries = []
        for c in findings:
            entries.extend(["",
                "## [P1] STUB FINDER CCR | {}:{} | {}".format(c["file"], c["line"], ts),
                "**Category:** {} | **Severity:** {}".format(c["category"], c["severity"]),
                "**File:** `{}` line {}".format(c["file"], c["line"]),
                "**Description:** {}".format(c["description"]),
                "**Snippet:** `{}`".format(c["snippet"]),
                "**Required Action:** Replace stub with real implementation. File resolution in INBOX when fixed.",
                ""])
        try:
            with open(inbox, "a") as fh: fh.write("\n".join(entries))
            filed += len(findings)
        except Exception as e:
            print("  [WARN] Could not file to {}: {}".format(inbox, e), file=sys.stderr)
    return filed

def print_report(ccrs, scanned, filed):
    sep = "="*70
    print("\n" + sep)
    print("STUB FINDER v2 -- AGENTOS".center(70))
    print(datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC").center(70))
    print(sep)
    print("Files scanned: {}".format(scanned))
    print("Total CCRs raised: {}".format(len(ccrs)))
    print("CCRs filed to agent INBOXes: {}".format(filed))
    by_sev, by_cat = {}, {}
    for c in ccrs:
        by_sev[c["severity"]] = by_sev.get(c["severity"],0) + 1
        by_cat[c["category"]] = by_cat.get(c["category"],0) + 1
    print("\nBy severity: " + str(by_sev))
    print("By category: " + str(by_cat))
    if ccrs:
        print("\nTop {} findings:".format(min(10, len(ccrs))))
        for c in ccrs[:10]:
            print("  [{}] {} | {}:{} | agent:{}".format(c["severity"].upper(), c["category"], c["file"], c["line"], c["agent"]))
            print("    {}".format(c["description"]))
    print(sep)

if __name__ == "__main__": run()
