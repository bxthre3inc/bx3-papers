import { useState } from "react";

const PHASES = [
  { id: 1, label: "Phase 1", sub: "Months 0–18", color: "bg-green-600" },
  { id: 2, label: "Phase 2", sub: "Months 18–36", color: "bg-blue-600" },
  { id: 3, label: "Phase 3", sub: "Years 3–5", color: "bg-purple-600" },
];

const STEPS = {
  1: [
    { id: "1.1", title: "Execute Operator Agreement", desc: "Poncho employment + conversion protection clause — NON-NEGOTIABLE", status: "todo" },
    { id: "1.2", title: "Form Chahalheel LLC (Colorado)", desc: "Registered agent, EIN, operating agreement", status: "todo" },
    { id: "1.3", title: "Identify & Secure Land", desc: "2,000–2,500 acres in Monte Vista / Saguache County. 10-yr lease w/ purchase option", status: "todo" },
    { id: "1.4", title: "Water Rights Verification", desc: "Verify ditch rights, aquifer allocation. No water = no ranch", status: "todo" },
    { id: "1.5", title: "File Section 17 Petition", desc: "Submit to Navajo Nation Council. 18-month charter process", status: "todo" },
    { id: "1.6", title: "Acquire Starter Herd", desc: "~500 bison via FSA operating loan + NAAF grant", status: "todo" },
    { id: "1.7", title: "Deploy Agrivoltaics (REAP Grant)", desc: "~1MW solar array. 50% grant / 45% REAP loan / 5% other", status: "todo" },
    { id: "1.8", title: "Mobile Slaughter Unit", desc: "USDA-certified mobile unit operational by Month 18", status: "todo" },
  ],
  2: [
    { id: "2.1", title: "Section 17 Conversion Complete", desc: "Chahalheel becomes Navajo Nation federal corporation", status: "todo" },
    { id: "2.2", title: "IAG Grant — Processing Facility", desc: "$1M–$2M toward fixed facility on Navajo trust land", status: "todo" },
    { id: "2.3", title: "Land Purchase Option Exercised", desc: "Evaluate at Month 18 based on operational performance", status: "todo" },
    { id: "2.4", title: "Lease Expansion to 3,500 Acres", desc: "Contracted by Month 18 for Year 4–5 herd expansion to 2,250 head", status: "todo" },
    { id: "2.5", title: "Fixed Processing Facility Online", desc: "Window Rock AZ or Crownpoint NM", status: "todo" },
  ],
  3: [
    { id: "3.1", title: "Herd at 2,250 Head", desc: "Full carrying capacity on 3,500 acres", status: "todo" },
    { id: "3.2", title: "Solar Grazing Revenue", desc: "3rd-party solar arrays grazed by bison. ~$50K–$150K/yr", status: "todo" },
    { id: "3.3", title: "Meat Processing Profitability", desc: "Vertical integration margins kick in", status: "todo" },
    { id: "3.4", title: "Cash Flow Positive — Month 34", desc: "Cumulative break-even achieved", status: "todo" },
  ],
};

const GRANTS = [
  { name: "USDA REAP (Solar)", amount: 500000, status: "pending", deadline: "Q3 2026" },
  { name: "NAAF — Bison Herd", amount: 500000, status: "pending", deadline: "Rolling" },
  { name: "ICDBG — Infrastructure", amount: 1000000, status: "pending", deadline: "TBD" },
  { name: "IAG — Processing", amount: 2000000, status: "pending", deadline: "Q4 2026" },
  { name: "First Nations Oweesta", amount: 250000, status: "pending", deadline: "Rolling" },
  { name: "TCRPG — Tribal Colleges", amount: 500000, status: "pending", deadline: "TBD" },
];

const OPS_CHECKLIST = [
  "Daily water rotation check",
  "Herd health observation (weekly)",
  "Fence line inspection (monthly)",
  "Solar panel grazing clearance",
  "Meat processing schedule",
  "Grant reporting deadlines",
];

export default function Roadmap() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [phase, setPhase] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🦬</div>
            <h1 className="text-2xl font-bold text-white">Chahalheel Enterprise</h1>
            <p className="text-zinc-400 text-sm mt-1">"The threshold where darkness becomes light"</p>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setAuthed(pw.length > 0)}
            className="w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-3 mb-4 placeholder-zinc-500"
          />
          <button
            onClick={() => setAuthed(pw.length > 0)}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition"
          >
            Enter Roadmap
          </button>
          <p className="text-zinc-600 text-xs text-center mt-4">Chahalheel Enterprise — Confidential</p>
        </div>
      </div>
    );
  }

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const pct = (p: number) => Math.round((Object.entries(checked).filter(([k, v]) => v && k.startsWith(String(p))).length / STEPS[p].length) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-400">Chahalheel Enterprise</h1>
          <p className="text-zinc-400 text-xs">Chahalheel Roadmap · Monte Vista, CO</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{GRANTS.reduce((s, g) => s + g.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</div>
          <div className="text-zinc-500 text-xs">Total Grant Target</div>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex gap-2 px-6 pt-6">
        {PHASES.map((ph) => (
          <button
            key={ph.id}
            onClick={() => setPhase(ph.id)}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition border ${
              phase === ph.id
                ? `${ph.color} text-white border-transparent`
                : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500"
            }`}
          >
            {ph.label} <span className="block text-xs font-normal opacity-75">{ph.sub}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-6 py-6">
        {/* Main Steps */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-zinc-300">Implementation Steps</h2>
            <span className={`text-sm font-bold ${pct(phase) === 100 ? "text-green-400" : "text-zinc-400"}`}>{pct(phase)}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-4">
            <div className={`h-full rounded-full transition-all ${PHASES[phase-1].color.replace('bg-', 'bg-').replace('600', '400')}`} style={{ width: `${pct(phase)}%` }} />
          </div>
          {STEPS[phase].map((step) => (
            <div
              key={step.id}
              onClick={() => toggle(step.id)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                checked[step.id]
                  ? "bg-green-950 border-green-700 opacity-60"
                  : "bg-zinc-900 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${
                  checked[step.id] ? "bg-green-500 border-green-500" : "border-zinc-500"
                }`}>
                  {checked[step.id] && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-xs font-mono">{step.id}</span>
                    <span className={`font-semibold ${checked[step.id] ? "line-through text-zinc-500" : "text-white"}`}>{step.title}</span>
                  </div>
                  <p className={`text-sm mt-1 ${checked[step.id] ? "text-zinc-600" : "text-zinc-400"}`}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Grant Tracker */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Grant Tracker</h3>
            <div className="space-y-3">
              {GRANTS.map((g) => (
                <div key={g.name} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-300">{g.name}</div>
                    <div className="text-xs text-zinc-500">{g.deadline}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">${(g.amount/1000).toFixed(0)}K</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${
                      g.status === "approved" ? "bg-green-900 text-green-300" :
                      g.status === "submitted" ? "bg-yellow-900 text-yellow-300" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>{g.status}</div>
                  </div>
                </div>
              ))}
              <div className="border-t border-zinc-700 pt-3 flex justify-between">
                <span className="text-zinc-400 text-sm">Total</span>
                <span className="text-white font-bold">$4.75M</span>
              </div>
            </div>
          </div>

          {/* Ops Loop */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <h3 className="font-bold text-white mb-4">Daily / Weekly Ops</h3>
            <div className="space-y-2">
              {OPS_CHECKLIST.map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-zinc-600 bg-zinc-800 group-hover:border-green-500 transition" />
                  <span className="text-sm text-zinc-300 group-hover:text-white transition">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profit Share */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
            <h3 className="font-bold text-white mb-2">Poncho's Role</h3>
            <p className="text-zinc-400 text-sm mb-3">Profits + Salary + Milestone Bonuses</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-400">Salary (Phase 1)</span><span className="text-zinc-200">$5,000/mo</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Salary (Phase 2+)</span><span class="text-zinc-200">$8,333/mo</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Profit Share</span><span class="text-green-400">10–20%</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Milestone Bonuses</span><span class="text-zinc-200">$100K–$300K</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-6 py-4 text-center text-zinc-600 text-xs">
        Chahalheel Enterprise v1.0 · April 2026 · CONFIDENTIAL
      </div>
    </div>
  );
}
