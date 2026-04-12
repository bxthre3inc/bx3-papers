// Agentic Orchestration Dashboard
// Route: /orchestration
import { useState, useEffect } from "react";

const API = "";

export default function OrchestrationDashboard() {
  const [tab, setTab] = useState<"overview"|"reasoning"|"phases"|"workflow"|"ier"|"coherence">("overview");
  const [reasoning, setReasoning] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [ierStats, setIerStats] = useState<any>(null);
  const [coherence, setCoherence] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch(API+"/api/orchestration/reasoning?limit=20").then(r=>r.json()).catch(()=>({entries:[]})),
      fetch(API+"/api/orchestration/phases").then(r=>r.json()).catch(()=>({phases:[]})),
      fetch(API+"/api/orchestration/workflow").then(r=>r.json()).catch(()=>({templates:[]})),
      fetch(API+"/api/orchestration/ier").then(r=>r.json()).catch(()=>({stats:{}})),
      fetch(API+"/api/orchestration/coherence").then(r=>r.json()).catch(()=>({layers:[]})),
    ]).then(([r,p,w,i,c])=>{
      setReasoning(r.entries||[]);
      setPhases(p.phases||[]);
      setWorkflows(w.templates||[]);
      setIerStats(i.stats||null);
      setCoherence(c||null);
    });
  }, []);

  const tabs = ["overview","reasoning","phases","workflow","ier","coherence"];
  const cards = [
    { label:"Reasoning", key:"reasoning", icon:"🧠", count: reasoning.length },
    { label:"Phase Gates", key:"phases", icon:"🚦", count: phases.length },
    { label:"Workflows", key:"workflow", icon:"🔀", count: workflows.length },
    { label:"IER Stats", key:"ier", icon:"🎯", count: ierStats ? 1 : 0 },
    { label:"Coherence", key:"coherence", icon:"⚡", count: coherence?.layers?.length||0 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">Orchestration Layer</h1>
            <p className="text-zinc-400 text-sm mt-1">Agentic · ChatDev-Native Rebuild</p>
          </div>
          <div className="flex gap-1">
            {tabs.map(t=>(
              <button key={t} onClick={()=>setTab(t as any)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${tab===t?"bg-emerald-600 text-white":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tab==="overview" && (
          <div className="grid grid-cols-5 gap-4">
            {cards.map(c=>(
              <div key={c.key} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="text-2xl font-bold text-white">{c.count}</div>
                <div className="text-zinc-400 text-sm">{c.label}</div>
              </div>
            ))}
            <div className="bg-zinc-900 border border-amber-800 rounded-xl p-4">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-semibold text-amber-400">Nightly Training</div>
              <div className="text-zinc-500 text-xs mt-1">IER Loop · 3AM MT</div>
              <button onClick={()=>setTab("ier")} className="mt-3 w-full bg-zinc-800 hover:bg-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">View Stats →</button>
            </div>
          </div>
        )}

        {tab==="reasoning" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-300">Reasoning Stream</h2>
              <span className="text-xs text-zinc-500">{reasoning.length} entries</span>
            </div>
            {reasoning.length===0 && <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">No reasoning entries yet. Run an agent task to populate.</div>}
            {reasoning.map((r:any)=>(
              <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">{r.agent_id}</span>
                  <span className="text-xs text-zinc-500">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-zinc-200 mb-2 leading-relaxed">{r.reasoning}</div>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span className="bg-zinc-800 px-1.5 py-0.5 rounded">{r.phase}</span>
                  <span>Confidence: <span className="text-emerald-400">{(r.confidence*100).toFixed(0)}%</span></span>
                  <span>Evidence: {r.evidence?.length||0} items</span>
                  {r.next_action && <span>Next: {r.next_action}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="phases" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Phase Gate System</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 text-sm mb-6 overflow-x-auto">
                {["PENDING","ANALYZE","PLAN","EXECUTE","REVIEW","COMPLETE"].map((phase,i)=>(
                  <div key={phase} className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded font-semibold text-xs ${i>=1?"bg-emerald-900 text-emerald-300":"bg-zinc-800 text-zinc-400"}`}>{phase}</div>
                    {i<5 && <span className="text-zinc-600">→</span>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["analyze_gate","plan_gate","execute_gate","review_gate"].map(g=>(
                  <div key={g} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
                    <div className="text-xs font-mono text-emerald-400 mb-1">{g}</div>
                    <div className="text-xs text-zinc-500">Evidence threshold enforced</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-zinc-600">Each gate validates evidence threshold before phase transition. Failed gates route to INBOX for human review.</div>
            </div>
          </div>
        )}

        {tab==="workflow" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Workflow DAG Templates</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                {name:"Grant Writing",desc:"Research→Draft→Review→Submit",nodes:4},
                {name:"Sales Outreach",desc:"Prospect→Qualify→Propose→Close",nodes:4},
                {name:"VPC Investor",desc:"Due Diligence→Term Sheet→Close",nodes:3},
                {name:"VPC DVC",desc:"Data Collection→Valuation→Report",nodes:3},
                {name:"Irrig8 Deployment",desc:"Survey→Configure→Deploy→Monitor",nodes:4},
                {name:"Patent Filing",desc:"Research→Draft→Review→File",nodes:4},
              ].map(t=>(
                <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                  <div className="text-sm font-semibold text-white mb-1">{t.name}</div>
                  <div className="text-xs text-zinc-500 mb-2">{t.desc}</div>
                  <div className="text-xs text-emerald-500">{t.nodes} nodes · DAG template</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="ier" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">IER Router — Agent Routing</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-emerald-400">{ierStats?.total_decisions||0}</div>
                <div className="text-xs text-zinc-400 mt-1">Total Decisions</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{ierStats?.agent_stats?Object.keys(ierStats.agent_stats).length:"—"}</div>
                <div className="text-xs text-zinc-400 mt-1">Agents Tracked</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-white">{ierStats?.task_stats?Object.keys(ierStats.task_stats).length:"—"}</div>
                <div className="text-xs text-zinc-400 mt-1">Task Types</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-3xl font-bold text-amber-400">{ierStats?.last_training?"✅":"⏳"}</div>
                <div className="text-xs text-zinc-400 mt-1">Last Training</div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-sm font-semibold text-emerald-300 mb-3">Agent Performance Matrix</div>
              <div className="text-xs text-zinc-500">Contextual bandits track each agent's success rate per task type. Nightly IER loop trains on outcome feedback at 3AM MT.</div>
            </div>
          </div>
        )}

        {tab==="coherence" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-emerald-300">Coherence Engine — Parallel Execution</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="text-sm text-zinc-300 mb-2">Live Symphony Parallel Execution</div>
              <div className="text-xs text-zinc-500">Layers execute with dependency resolution. Parallel agents run simultaneously within layer boundaries.</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Layer 1: Parallel Agents","Layer 2: Parallel Agents","Layer 3: Aggregation"].map((l,i)=>(
                <div key={l} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="text-sm font-semibold text-white mb-1">{l}</div>
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
