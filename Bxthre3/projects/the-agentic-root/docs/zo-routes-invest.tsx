import { useState, useEffect } from "react";
import { Zap, Droplets, Shield, CheckCircle, ArrowRight, Clock, Building, Coins, TrendingUp, Lock } from "lucide-react";

const TIERS = [
  {
    amount: 1000,
    equity: "0.005%",
    cap: "$20M",
    revShare: "10% → $3K back, then 5% for 3 months",
    revTarget: "$4,000-$5,000",
    color: "slate"
  },
  {
    amount: 5000,
    equity: "0.025%",
    cap: "$20M",
    revShare: "15% → $7.5K back, then 8% for 6 months",
    revTarget: "$10,000-$12,500",
    color: "blue"
  },
  {
    amount: 10000,
    equity: "0.05%",
    cap: "$20M",
    revShare: "20% → $15K back, then 10% for 6 months",
    revTarget: "$20,000-$25,000",
    color: "amber"
  }
];

export default function Bxthre3IncInvest() {
  const [selectedTier, setSelectedTier] = useState(2);
  const [moisture, setMoisture] = useState(25);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const testThreshold = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agentic/dap/v1/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "demo.pitch.moisture",
          vector: { moisture: moisture / 100, economic_value: 250, fidelity: 0.95 }
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Demo active — try again" });
    }
    setLoading(false);
  };

  const submit = () => { if (name && email) setSubmitted(true); };
  const tier = TIERS[selectedTier];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building className="w-6 h-6 text-blue-400" />
          <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">Bxthre3 Inc</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Investment Opportunity</h1>
        <p className="text-slate-400">Venture studio building event-driven AI infrastructure</p>
      </div>

      {/* Tier Selector */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {TIERS.map((t, i) => (
          <button
            key={t.amount}
            onClick={() => setSelectedTier(i)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedTier === i
                ? i === 0 ? "border-slate-500 bg-slate-800/50" : i === 1 ? "border-blue-500 bg-blue-500/10" : "border-amber-500 bg-amber-500/10"
                : "border-slate-800 bg-slate-900 hover:border-slate-600"
            }`}
          >
            <div className={`text-2xl font-bold mb-1 ${selectedTier === i ? i === 0 ? "text-slate-300" : i === 1 ? "text-blue-400" : "text-amber-400" : "text-slate-300"}`}>
              ${t.amount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mb-3">{t.equity} at {t.cap}</div>
            <div className={`text-xs font-medium ${selectedTier === i ? "text-green-400" : "text-slate-500"}`}>
              + {t.revShare}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Tier Detail */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-green-400" />
          Your Investment: ${tier.amount.toLocaleString()}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Equity</h3>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{tier.equity}</div>
              <div className="text-sm text-slate-400">via YC Post-Money SAFE at {tier.cap}</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Revenue Kicker</h3>
            <div className="p-3 bg-slate-800 rounded-lg">
              <div className="text-sm text-green-400">{tier.revShare}</div>
              <div className="text-sm text-slate-400 mt-1">Target: {tier.revTarget}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Agentic V1
          </h3>
          <p className="text-sm text-slate-400">Event-driven AI infrastructure with DAP evaluation. 10-day sprint.</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" /> Irrig8
          </h3>
          <p className="text-sm text-slate-400">Precision agriculture OS. Sensor-to-action irrigation. Live pilot farms.</p>
        </div>
      </div>

      {/* Demo */}
      <div className="bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" /> Live Demo: Deterministic Decision
        </h2>
        <p className="text-slate-400 mb-4 text-sm">Drag moisture below 20% → automatic trigger. Above 20% → no action.</p>
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>0%</span><span className="text-blue-400 font-medium">{moisture}%</span><span>50%</span>
        </div>
        <input type="range" min="0" max="50" value={moisture} onChange={(e) => setMoisture(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-4" />
        <button onClick={testThreshold} disabled={loading} className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors disabled:opacity-50">
          {loading ? "Processing..." : "Test Threshold"}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              {result.triggered ? <><CheckCircle className="w-5 h-5 text-green-400" /><span className="text-green-400 font-medium">TRIGGERED</span></> : <><Lock className="w-5 h-5 text-slate-400" /><span className="text-slate-400 font-medium">NO ACTION</span></>}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">Hash: {result.hash_prefix || "0x9f3a2b..."}</p>
          </div>
        )}
      </div>

      {/* CTA */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2">
          <span>Invest ${tier.amount.toLocaleString()}</span> <ArrowRight className="w-5 h-5" />
        </button>
      ) : !submitted ? (
        <div className="bg-slate-900 rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold mb-4">Confirm: ${tier.amount.toLocaleString()} into Bxthre3 Inc</h3>
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500" />
            <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-400">
              <p className="font-medium text-white mb-2">Your Terms:</p>
              <ul className="space-y-1 text-xs">
                <li>• ${tier.amount.toLocaleString()} into Bxthre3 Inc</li>
                <li>• {tier.equity} equity via YC SAFE at {tier.cap}</li>
                <li>• + {tier.revShare}</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg">Back</button>
            <button onClick={submit} disabled={!name || !email} className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-medium disabled:opacity-50">Confirm Interest</button>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">Interest Submitted</h3>
          <p className="text-slate-400">Jeremy will contact you within 24 hours with SAFE docs and wire instructions.</p>
        </div>
      )}

      {/* QR */}
      <div className="mt-8 pt-8 border-t border-slate-800 text-center">
        <img src="/images/bxthre3inc-invest-qr.png" alt="QR" className="w-32 h-32 mx-auto mb-3 bg-white p-2 rounded-lg" />
        <p className="text-xs text-slate-500">brodiblanco.zo.space/invest/bxthre3inc</p>
      </div>
    </div>
  );
}