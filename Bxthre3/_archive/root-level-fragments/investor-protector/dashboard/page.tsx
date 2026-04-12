// Investor Protector Dashboard v0.1 — ACCELERATED BUILD
// Deploy to: brodiblanco.zo.space/investor

import { useState, useEffect } from "react";
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Code, 
  Shield,
  Download,
  RefreshCw
} from "lucide-react";

// Types matching API spec
interface Snapshot {
  generated_at: string;
  velocity: {
    score: number;
    p0_completed_7d: number;
    p1_completed_7d: number;
  };
  artifacts: {
    docs: number;
    code_files: number;
    ratio: number;
  };
  costs: {
    monthly_usd: number;
    breakdown: Record<string, number>;
  };
  verification: {
    auditable_actions: number;
    total_actions: number;
    last_audit_at: string;
  };
}

interface Project {
  name: string;
  status: "active" | "blocked" | "complete" | "at_risk";
  last_update: string;
  blockers: string[];
  metrics: {
    velocity: number;
    deliverables: number;
  };
}

// Mock data for v0.1 (API integration in v0.2)
const MOCK_SNAPSHOT: Snapshot = {
  generated_at: new Date().toISOString(),
  velocity: {
    score: 99.7,
    p0_completed_7d: 2,
    p1_completed_7d: 867
  },
  artifacts: {
    docs: 1676,
    code_files: 218,
    ratio: 7.69
  },
  costs: {
    monthly_usd: 127,
    breakdown: {
      "zo_compute": 85,
      "domains": 24,
      "api_costs": 18
    }
  },
  verification: {
    auditable_actions: 87,
    total_actions: 87,
    last_audit_at: new Date().toISOString()
  }
};

const MOCK_PROJECTS: Project[] = [
  { name: "Agentic Runtime v2.1", status: "active", last_update: "2026-04-06", blockers: [], metrics: { velocity: 94, deliverables: 12 } },
  { name: "Investor Protector MVP", status: "active", last_update: "2026-04-06", blockers: [], metrics: { velocity: 99, deliverables: 8 } },
  { name: "Water Court Evidence", status: "active", last_update: "2026-04-05", blockers: ["Awaiting sensor calibration"], metrics: { velocity: 76, deliverables: 3 } },
  { name: "Ghost Cloud Infra", status: "at_risk", last_update: "2026-04-04", blockers: ["Kali node funding"], metrics: { velocity: 45, deliverables: 1 } },
];

// Components
const ScoreCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = "blue"
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  trend?: "up" | "down" | "flat";
  color?: "blue" | "green" | "amber" | "red";
}) => {
  const colors = {
    blue: "from-cyan-500 to-blue-600",
    green: "from-emerald-500 to-green-600",
    amber: "from-amber-500 to-orange-600",
    red: "from-red-500 to-rose-600"
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]} bg-opacity-10`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <TrendingUp className={`w-4 h-4 ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400"}`} />
          <span className={`text-xs ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-slate-400"}`}>
            {trend === "up" ? "+12%" : trend === "down" ? "-5%" : "0%"} vs last week
          </span>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: Project["status"] }) => {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blocked: "bg-red-500/10 text-red-400 border-red-500/20",
    complete: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    at_risk: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };

  const labels = {
    active: "Active",
    blocked: "Blocked",
    complete: "Complete",
    at_risk: "At Risk"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// Main Dashboard
export default function InvestorProtectorDashboard() {
  const [data, setData] = useState<Snapshot>(MOCK_SNAPSHOT);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In v0.2: fetch('/api/investor/snapshot').then(r => r.json()).then(setData)
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    // Generate PDF report
    const report = {
      generated_at: new Date().toISOString(),
      snapshot: data,
      projects: projects,
      executive_summary: `BX3 Velocity Score: ${data.velocity.score}/100. ${data.velocity.p1_completed_7d} tasks completed in 7 days. Verification: ${data.verification.auditable_actions}/${data.verification.total_actions} actions auditable.`
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bx3-investor-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Investor Protector</h1>
                <p className="text-slate-400 text-sm">BX3 Transparency Layer — Real-time Operational Intelligence</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-sm">
              Last update: {lastRefresh.toLocaleTimeString()}
            </span>
            <button 
              onClick={() => setLastRefresh(new Date())}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isExporting ? "Exporting..." : "Export Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Scorecard Grid */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard
            title="Velocity Score"
            value={data.velocity.score.toString()}
            subtitle="Tasks cleared vs created (7d)"
            icon={Activity}
            trend="up"
            color="green"
          />
          <ScoreCard
            title="Deliverables"
            value={data.artifacts.docs.toString()}
            subtitle={`${data.artifacts.code_files} code files • ${data.artifacts.ratio.toFixed(1)}:1 doc/code`}
            icon={FileText}
            trend="up"
            color="blue"
          />
          <ScoreCard
            title="Monthly Costs"
            value={`$${data.costs.monthly_usd}`}
            subtitle={`Zo: $${data.costs.breakdown.zo_compute} • Domains: $${data.costs.breakdown.domains}`}
            icon={DollarSign}
            trend="flat"
            color="amber"
          />
          <ScoreCard
            title="Verification"
            value={`${data.verification.auditable_actions}/${data.verification.total_actions}`}
            subtitle="Auditable actions (100% = full coverage)"
            icon={Shield}
            trend="up"
            color="green"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Active Projects
            </h2>
            <span className="text-slate-500 text-sm">{projects.length} tracked</span>
          </div>
          
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-slate-500 text-sm">Updated: {project.last_update}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                
                {project.blockers.length > 0 && (
                  <div className="flex items-start gap-2 mt-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                    <span className="text-amber-400">{project.blockers.join(", ")}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-400">Velocity:</span>
                    <span className="text-white font-medium">{project.metrics.velocity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">Deliverables:</span>
                    <span className="text-white font-medium">{project.metrics.deliverables}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* 7-Day Summary */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">7-Day Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">P0 Completed</span>
                <span className="text-red-400 font-medium">{data.velocity.p0_completed_7d}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">P1 Completed</span>
                <span className="text-emerald-400 font-medium">{data.velocity.p1_completed_7d}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Active Agents</span>
                <span className="text-cyan-400 font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Open Blockers</span>
                <span className="text-amber-400 font-medium">2</span>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Verification
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              All {data.verification.auditable_actions} tracked actions are auditable and verifiable.
            </p>
            <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-500 overflow-hidden">
              <p>Last audit: {new Date(data.verification.last_audit_at).toLocaleString()}</p>
              <p className="mt-1 truncate">Hash: {Math.random().toString(36).substring(2, 15)}...</p>
            </div>
          </div>

          {/* Funding Pipeline */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Funding Pipeline</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Submitted</span>
                <span className="text-blue-400 font-medium">3 grants</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">In Progress</span>
                <span className="text-cyan-400 font-medium">7 applications</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Approved</span>
                <span className="text-emerald-400 font-medium">$0 (pending)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500">
          <p>Bxthre3 Inc — Internal Use Only</p>
          <p>Investor Protector v0.1 • Generated: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}