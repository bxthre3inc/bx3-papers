// Agentic Orchestration Dashboard
import { useState, useEffect } from "react";

const API = "/api/orchestration";

interface ReasoningEntry {
  id: string; task_id: string; agent_id: string; phase: string;
  reasoning: string; evidence: string[]; confidence: number;
  next_action: string; created_at: string;
}

export default function OrchestrationDashboard() {
  const [tab, setTab] = useState("overview");
  const [reasoning, setReasoning] = useState<ReasoningEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [ierStats, setIerStats] = useState<any>(null);
  const [layers, setLayers] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/reasoning?limit=20`).then(r => r.json()).catch(() => ({ entries: [] })),
      fetch(`${API}/ier`).then(r => r.json()).catch(() => ({ stats: null })),
      fetch(`${API}/coherence`).then(r => r.json()).catch(() => ({ layers: [] })),
    ]).then(([r, i, c]) => {
      setReasoning(r.entries || []);
      setIerStats(i.stats || null);
      setLayers(c.layers || []);
      setLoading(false);
    });
  }, []);

  const phases = ["PENDING","ANALYZE","PLAN","EXECUTE","REVIEW","COMPLETE"];
  const workflows = [
    { name: "Grant Writing", nodes: 4 },
    { name: "Sales Outreach", nodes: 4 },
    { name: "VPC Investor", nodes: 3 },
    { name: "VPC DVC", nodes: 3 },
    { name: "Irrig8 Deployment", nodes: 4 },
    { name: "Patent Filing", nodes: 4 },
  ];
  const tabs = ["overview","reasoning","phases","workflow","ier","coherence"];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Agentic Orchestration</h1>
            <p className="text-zinc-400 text-sm mt-1">ChatDev Methods → Agentic Native · Live Symphony Layer</p>
          </div>
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${tab===t ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {[
                { icon: "🧠", label: "Reasoning", count: reasoning.length },
                { icon: "🚦", label: "Phase Gates", count: phases.length },
                { icon: "🔀", label: "DAG Templates", count: workflows.length },
                { icon: "🎯", label: "IER Decisions", count: ierStats?.total_decisions ?? "—" },
                { icon: "⚡", label: "Coherence Layers", count: layers.length || "—" },
              ].map(c => (
                <div key={c.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="text-2xl font-bold">{c.count}</div>
                  <div className="text-zinc-400 text-xs">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border border-amber-800 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔄</div>
                <div>
                  <div className="text-sm font-semibold text-amber-400">Nightly IER Training Loop</div>
                  <div className="text-xs text-zinc-500">3AM MT · Contextual Bandits · Learn from outcomes</div>
                </div>
              </div>
              <button onClick={() => setTab("ier")} className="bg-zinc-800 hover:bg-zinc-700 rounded px-3 py-1.5 text-xs">View Stats →</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: "🧠", title: "Reasoning Stream", desc: "Structured reasoning with citations. Replaces ChatDev Memory Stream." },
                { icon: "🚦", title: "Phase Gates", desc: "Conditional evidence gates. Replaces ChatDev ChatChain." },
                { icon: "🔀", title: "Workflow DAG", desc: "Learnable DAG templates. Replaces ChatDev MacNet." },
                { icon: "🎯", title: "IER Router", desc: "Constrained contextual bandits. Replaces ChatDev IER." },
              ].map(m => (
                <div key={m.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-xl mb-2">{m.icon}</div>
                  <div className="text-sm font-semibold mb-1">{m.title}</div>
                  <div className="text-xs text-zinc-500">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        {tab === "reasoning" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-emerald-300">Reasoning Stream</h2>
              <span className="text-xs text-zinc-500">{reasoning.length} entries</span>
            </div>
            {loading && <div className="text-zinc-500 text-sm">Loading...</div>}
            {!loading && reasoning.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-sm">
                No reasoning entries yet. Run an agent task to populate the stream.
              </div>
            )}
            {reasoning.map(r => (
              <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-xs font-mono bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">{r.agent_id}</span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{r.phase}</span>
                  </div>
                  <span className="text-xs text-zinc-500">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-zinc-200">{r.reasoning}</div>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span>Confidence: <span className="text-emerald-400">{(r.confidence*100).toFixed(0)}%</span></span>
                  <span>Evidence: {r.evidence?.length || 0}</span>
                  {r.next_action && <span>Next: {r.next_action}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phases */}
        {tab === "phases" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Phase Gate System</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {phases.map((p, i) => (
                  <div key={p} className="flex items-center gap-3 shrink-0">
                    <div className={`px-3 py-1.5 rounded font-semibold text-xs ${i < 2 ? "bg-emerald-900 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>{p}</div>
                    {i < phases.length - 1 && <span className="text-zinc-600">→</span>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["analyze_gate","plan_gate","execute_gate","review_gate"].map(g => (
                  <div key={g} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                    <div className="text-xs font-mono text-emerald-400">{g}</div>
                    <div className="text-xs text-zinc-500 mt-1">Evidence threshold enforced</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-zinc-600">Each gate validates evidence threshold before phase transition. Failed gates route to INBOX for human review.</div>
            </div>
          </div>
        )}

        {/* Workflow */}
        {tab === "workflow" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Workflow DAG Templates</h2>
            <div className="grid grid-cols-3 gap-4">
              {workflows.map(w => (
                <div key={w.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                  <div className="text-sm font-semibold mb-1">{w.name}</div>
                  <div className="text-xs text-zinc-500">{w.nodes} nodes · DAG template</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IER */}
        {tab === "ier" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">IER Router — Agent Routing</h2>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Decisions", value: ierStats?.total_decisions ?? "—" },
                { label: "Agents Tracked", value: ierStats?.agent_stats ? Object.keys(ierStats.agent_stats).length : "—" },
                { label: "Task Types", value: ierStats?.task_stats ? Object.keys(ierStats.task_stats).length : "—" },
                { label: "Last Training", value: ierStats?.last_training ? "✅" : "⏳" },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-sm font-semibold text-emerald-300 mb-2">Nightly Training — 3AM MT</div>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>Contextual bandits track each agent's success rate per task type.</p>
                <p>Thompson sampling balances explore/exploit.</p>
                <p>Immutable core constraints prevent degenerate policy updates.</p>
              </div>
            </div>
          </div>
        )}

        {/* Coherence */}
        {tab === "coherence" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Coherence Engine — Parallel Execution</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-xs text-zinc-500">Live Symphony parallel execution with dependency resolution. Parallel agents run simultaneously within layer boundaries.</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Layer 1: Parallel Agents","Layer 2: Parallel Agents","Layer 3: Aggregation"].map((l, i) => (
                <div key={l} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-sm font-semibold mb-1">{l}</div>
                  <div className="text-xs text-zinc-500">Layer {i+1} · Parallel execution</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}