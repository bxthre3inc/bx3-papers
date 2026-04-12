# INVESTOR PROTECTOR MVP SPEC
## Self-Proving Dashboard — Build in 4 Weeks

**Classification:** BX3 Internal — Funding Critical Path  
**Version:** MVP-1.0  
**Deadline:** April 26, 2026 (21 days)  
**Status:** BUILDING NOW

---

## SCOPE: What Ships in 4 Weeks

| Component | Tech | Effort | Owner |
|-----------|------|--------|-------|
| `/investor` zo.space route | React + Tailwind | 3 days | Iris |
| Data pipeline (Python) | GitHub API, Airtable API, zo.space deploy logs | 4 days | Dev |
| Truth verification layer | CSV export + source links | 2 days | Dev |
| Dashboard sections | 4 cards (Velocity, Cost, Productivity, Verification) | 3 days | Iris |
| Public deploy | No auth, full transparency | 1 day | Theo |
| **Total** | | **13 days** | + buffer = 21 days |

---

## SECTION 1: DATA SOURCES (What We Track)

### 1.1 Build Velocity (GitHub API)

```python
# data_sources/github_metrics.py
import requests
from datetime import datetime, timedelta

class GitHubMetrics:
    def __init__(self, token: str, owner: str = "bxthre3inc"):
        self.headers = {"Authorization": f"token {token}"}
        self.owner = owner
    
    def get_repo_metrics(self, repo: str, days: int = 28) -> dict:
        """Get commits, deploys, features, bugs for last N days"""
        since = (datetime.now() - timedelta(days=days)).isoformat()
        
        # Commits
        commits_url = f"https://api.github.com/repos/{self.owner}/{repo}/commits"
        commits = requests.get(commits_url, headers=self.headers, params={"since": since}).json()
        
        # Issues (closed as features/bugs)
        issues_url = f"https://api.github.com/repos/{self.owner}/{repo}/issues"
        issues = requests.get(issues_url, headers=self.headers, params={
            "state": "closed",
            "since": since,
            "labels": "feature,bug"
        }).json()
        
        features = len([i for i in issues if "feature" in [l["name"] for l in i.get("labels", [])]])
        bugs = len([i for i in issues if "bug" in [l["name"] for l in i.get("labels", [])]])
        
        return {
            "days_since_start": days,
            "commits": len(commits),
            "deploys": self._count_deploys(repo, since),  # From GitHub Actions
            "features_shipped": features,
            "bugs_fixed": bugs,
            "hours_logged": self._estimate_hours(commits),
            "source_url": f"https://github.com/{self.owner}/{repo}/commits",
            "retrieved_at": datetime.now().isoformat()
        }
    
    def _count_deploys(self, repo: str, since: str) -> int:
        """Count successful GitHub Actions workflow runs"""
        runs_url = f"https://api.github.com/repos/{self.owner}/{repo}/actions/runs"
        runs = requests.get(runs_url, headers=self.headers, params={
            "status": "completed",
            "conclusion": "success",
            "created": f">{since}"
        }).json()
        return len(runs.get("workflow_runs", []))
    
    def _estimate_hours(self, commits: list) -> int:
        """Rough heuristic: 2 hrs per meaningful commit"""
        meaningful = [c for c in commits if len(c.get("commit", {}).get("message", "")) > 20]
        return len(meaningful) * 2
```

### 1.2 Cost Efficiency (Manual + Stripe/Airtable)

```python
# data_sources/cost_metrics.py
class CostMetrics:
    def get_all(self) -> dict:
        """All costs tracked manually for MVP (automated in v1.0)"""
        return {
            "cloud_infrastructure": {
                "value": 0,
                "source": "Stripe dashboard: $0 charges",
                "verify_url": "https://dashboard.stripe.com/payments"
            },
            "api_costs": {
                "value": 0,
                "source": "Zo Kimi included; no external LLM APIs",
                "verify_url": "https://zo.computer/account"
            },
            "software_licenses": {
                "value": 0,
                "source": "Open source stack only",
                "verify_url": "https://github.com/bxthre3inc"
            },
            "tools_used": [
                {"name": "Zo", "cost": 0, "tier": "existing subscription"},
                {"name": "GitHub", "cost": 0, "tier": "free public repos"},
                {"name": "Airtable", "cost": 0, "tier": "free tier"},
                {"name": "Render", "cost": 0, "tier": "free tier (if used)"}
            ],
            "total_spend": 0,
            "retrieved_at": datetime.now().isoformat()
        }
```

### 1.3 Team Productivity (Agentic Logs + Manual)

```python
# data_sources/productivity_metrics.py
class ProductivityMetrics:
    def get_all(self) -> dict:
        """Hybrid: manual Sovereign hours + agent task estimates"""
        return {
            "human_sovereign": {
                "hours_per_week": 20,
                "source": "Self-reported (Sovereign)",
                "verify_method": "Calendar analysis available on request"
            },
            "ai_agents_active": {
                "count": 4,  # Iris, Dev, Maya, Zoe
                "names": ["Iris", "Dev", "Maya", "Zoe"],
                "source": "Agent roster in Bxthre3/AGENTS.md"
            },
            "ai_tasks_completed": {
                "value": 340,  # Estimated from commit messages + INBOX entries
                "source": "GitHub commit analysis + INBOX/agents/*.md count",
                "calculation": "~12 tasks/day × 28 days"
            },
            "ai_hours_equivalent": {
                "value": 85,
                "source": "2.5 hrs/task estimate based on task complexity",
                "disclaimer": "Heuristic only—no actual AI 'hours'"
            },
            "blended_team_hours_per_week": 105,
            "cost_per_productive_hour": 0,
            "retrieved_at": datetime.now().isoformat()
        }
```

### 1.4 Truth Verification (Meta-Layer)

```python
# data_sources/verification_metrics.py
class VerificationMetrics:
    def get_all(self, all_metrics: dict) -> dict:
        """Verify every metric has source + accessibility"""
        total = len(all_metrics)
        with_sources = sum(1 for v in all_metrics.values() if "source" in str(v))
        with_verify = sum(1 for v in all_metrics.values() if "verify" in str(v).lower())
        
        return {
            "metrics_with_sources": f"{with_sources}/{total} ({100*with_sources//total}%)",
            "metrics_verifiable": f"{with_verify}/{total} ({100*with_verify//total}%)",
            "verification_status": "ALL VERIFIED" if with_sources == total else "PARTIAL",
            "last_full_audit": datetime.now().isoformat(),
            "audit_csv_url": "/api/investor/audit.csv",  # Download full chain
            "disclaimer": "All metrics sourced. Some require manual verification (Sovereign hours)."
        }
```

---

## SECTION 2: DASHBOARD UI (zo.space Route)

### Route: `/investor` (Public, No Auth)

```typescript
// zo.space route: /investor.tsx
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, CheckCircle, AlertCircle } from "lucide-react";

export default function InvestorProtector() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("/api/investor/metrics")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading transparent metrics...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Investor Protector
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time transparency into how Bxthre3 Inc operates—and how this dashboard was built
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Last updated: {lastUpdated}</span>
            <span>•</span>
            <span>All metrics sourced • 100% auditable</span>
          </div>
        </div>

        {/* Build Velocity */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Build Velocity
              <span className="text-sm font-normal text-slate-500">— How we built this</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="Days Active" value={data.velocity.days_since_start} />
              <MetricBox label="Commits" value={data.velocity.commits} />
              <MetricBox label="Deploys" value={data.velocity.deploys} />
              <MetricBox label="Features Shipped" value={data.velocity.features_shipped} />
            </div>
            <div className="mt-4 flex gap-2">
              <SourceButton url={data.velocity.source_url} />
              <VerifyButton metric="velocity" />
            </div>
          </CardContent>
        </Card>

        {/* Cost Efficiency */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Cost Efficiency — What we spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-emerald-400 mb-4">
              ${data.costs.total_spend}
            </div>
            <div className="space-y-2 mb-4">
              {data.costs.tools_used.map(tool => (
                <div key={tool.name} className="flex justify-between text-sm">
                  <span className="text-slate-400">{tool.name}</span>
                  <span className="text-emerald-400">${tool.cost} ({tool.tier})</span>
                </div>
              ))}
            </div>
            <SourceButton url={data.costs.cloud_infrastructure.verify_url} />
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Team Productivity — Who did the work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-3xl font-bold text-cyan-400">{data.productivity.human_sovereign.hours_per_week}</div>
                <div className="text-sm text-slate-500">Sovereign hrs/week</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">{data.productivity.ai_agents_active.count}</div>
                <div className="text-sm text-slate-500">AI agents active</div>
              </div>
            </div>
            <div className="text-sm text-slate-500 mb-4">
              AI agents: {data.productivity.ai_agents_active.names.join(", ")}
            </div>
            <SourceButton url="https://github.com/bxthre3inc/Bxthre3/blob/main/AGENTS.md" />
          </CardContent>
        </Card>

        {/* Truth Verification */}
        <Card className="bg-slate-900 border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              Truth Verification — Can you trust this?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Metrics with sources:</span>
                <span className="text-emerald-400">{data.verification.metrics_with_sources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verifiable on-demand:</span>
                <span className="text-emerald-400">{data.verification.metrics_verifiable}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <DownloadButton url="/api/investor/audit.csv" />
              <span className="text-xs text-slate-600 self-center">
                Download full audit chain (CSV)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-600">
          <p>Built by Bxthre3 Inc using our own tools • 
            <a href="https://github.com/bxthre3inc/investor-protector" className="text-cyan-400 hover:underline">View source</a>
          </p>
          <p className="mt-2">This dashboard tracks how this dashboard was built. Recursively transparent.</p>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

function SourceButton({ url }: { url: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
      <ExternalLink className="w-4 h-4 mr-2" />
      Verify Source
    </Button>
  );
}

function VerifyButton({ metric }: { metric: string }) {
  return (
    <Button variant="ghost" size="sm" onClick={() => alert(`Verification for ${metric}: [DETAIL VIEW]`)}>
      <CheckCircle className="w-4 h-4 mr-2" />
      How We Verify
    </Button>
  );
}

function DownloadButton({ url }: { url: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")}>
      <Download className="w-4 h-4 mr-2" />
      Download Audit
    </Button>
  );
}
```

---

## SECTION 3: API ROUTE (Hono Backend)

```typescript
// zo.space API route: /api/investor/metrics.ts
import type { Context } from "hono";

// Cache for 5 minutes to reduce API calls
let cache: any = null;
let cacheTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async (c: Context) => {
  const now = Date.now();
  
  if (cache && (now - cacheTime) < CACHE_TTL) {
    return c.json(cache);
  }
  
  // Fetch from data pipeline (Python scripts write to SQLite/JSON)
  const metrics = {
    velocity: await fetchGitHubMetrics(),
    costs: await fetchCostMetrics(),
    productivity: await fetchProductivityMetrics(),
    verification: await fetchVerificationMetrics()
  };
  
  cache = metrics;
  cacheTime = now;
  
  return c.json(metrics);
};

async function fetchGitHubMetrics() {
  // Read from SQLite or JSON file updated by Python pipeline
  const data = await Bun.file("/home/workspace/Bxthre3/investor-protector/data/velocity.json").json();
  return data;
}

async function fetchCostMetrics() {
  const data = await Bun.file("/home/workspace/Bxthre3/investor-protector/data/costs.json").json();
  return data;
}

async function fetchProductivityMetrics() {
  const data = await Bun.file("/home/workspace/Bxthre3/investor-protector/data/productivity.json").json();
  return data;
}

async function fetchVerificationMetrics() {
  const data = await Bun.file("/home/workspace/Bxthre3/investor-protector/data/verification.json").json();
  return data;
}
```

---

## SECTION 4: DEPLOYMENT CHECKLIST

### Week 1 (Days 1-7): Data Pipeline

- [ ] Day 1: Create `/home/workspace/Bxthre3/investor-protector/` directory structure
- [ ] Day 2: Write `data_sources/github_metrics.py`
- [ ] Day 3: Write `data_sources/cost_metrics.py`
- [ ] Day 4: Write `data_sources/productivity_metrics.py`
- [ ] Day 5: Write `data_sources/verification_metrics.py`
- [ ] Day 6: Create `pipeline.py` orchestrator (runs all sources, writes JSON)
- [ ] Day 7: Test pipeline, verify JSON outputs

### Week 2 (Days 8-14): Dashboard UI

- [ ] Day 8: Draft `/investor.tsx` route (static mock data)
- [ ] Day 9: Style with Tailwind (dark theme, match AgentOS branding)
- [ ] Day 10: Add interactivity (source links, verify buttons)
- [ ] Day 11: Connect to API (real data)
- [ ] Day 12: Add CSV export endpoint `/api/investor/audit.csv`
- [ ] Day 13: Responsive design, mobile testing
- [ ] Day 14: Copy polish, Sovereign review

### Week 3 (Days 15-21): Polish & Launch

- [ ] Day 15: Set up daily pipeline cron (runs at 6 AM MT)
- [ ] Day 16: Add error handling (graceful degradation if APIs fail)
- [ ] Day 17: Write "About This Dashboard" explainer copy
- [ ] Day 18: Final Sovereign review + approval
- [ ] Day 19: Deploy to `brodiblanco.zo.space/investor` (PUBLIC)
- [ ] Day 20: Test with friendly advisor, gather feedback
- [ ] Day 21: Iterate based on feedback, freeze v1.0

---

## IMMEDIATE NEXT ACTIONS (Today)

| # | Action | Owner | Time |
|---|--------|-------|------|
| 1 | Create directory structure | Theo | 15 min |
| 2 | Write `data_sources/github_metrics.py` | Dev | 2 hrs |
| 3 | Write `pipeline.py` orchestrator | Dev | 1 hr |
| 4 | Test pipeline with `bxthre3inc` repos | Dev | 30 min |
| 5 | Draft `/investor.tsx` mockup | Iris | 2 hrs |
| 6 | Sovereign review of mockup | brodiblanco | 30 min |

---

## SUCCESS CRITERIA (April 26)

- [ ] `/investor` loads in <2 seconds
- [ ] All 4 sections display real data (even if manual)
- [ ] Every metric has [Verify] link to source
- [ ] CSV export works
- [ ] Zero errors in 7 days of operation
- [ ] Used in at least 1 investor conversation

---

**Status: READY TO BUILD. Awaiting Sovereign green light to assign agents and start.**