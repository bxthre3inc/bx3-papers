import { useState, useEffect, useRef } from "react";
import { 
  Cpu, Globe, ArrowRight, Zap, Boxes, BarChart3,
  Droplets, Sparkles, CheckCircle2, Clock, Mail,
  TrendingUp, Users, Terminal
} from "lucide-react";

const brands = [
  { name: "AgentOS", role: "AI Workforce Platform", icon: Cpu, color: "cyan", desc: "Deterministic agent orchestration", slug: "agentos" },
  { name: "Irrig8", role: "Precision Agriculture", icon: Droplets, color: "emerald", desc: "Satellite-driven resource intelligence", slug: "irrig8" },
  { name: "VPC", role: "Entertainment & Community", icon: Sparkles, color: "violet", desc: "Interactive experiences & esports", slug: "vpc" }
];

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e?.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const d = delay === 100 ? "delay-100" : delay === 200 ? "delay-200" : delay === 300 ? "delay-300" : delay === 400 ? "delay-400" : "";
  return <div ref={ref} className={`transition-all duration-700 ${d} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>{children}</div>;
}

function useAgentOSData() {
  const [data, setData] = useState({ agents: [], tasks: [], loading: true });
  useEffect(() => {
    Promise.all([
      fetch("/api/agents").then(r => r.json().catch(() => ({ agents: [] }))),
      fetch("/api/tasks").then(r => r.json().catch(() => ({ tasks: [] })))
    ]).then(([a, t]) => setData({ agents: a.agents || [], tasks: t.tasks || [], loading: false }));
  }, []);
  return data;
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (email) { setOk(true); setEmail(""); setTimeout(() => setOk(false), 3000); }};
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold">Stay in the Loop</h3>
      </div>
      <p className="text-zinc-400 mb-6">Get AgentOS release notes, venture updates, and edge tech insights.</p>
      <form onSubmit={submit} className="flex gap-3">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm focus:border-cyan-400 focus:outline-none transition" />
        <button type="submit" className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/20 transition">{ok ? "Subscribed!" : "Subscribe"}</button>
      </form>
    </div>
  );
}

function LiveActivity({ agents }: { agents: any[] }) {
  const online = agents.filter(a => a.status === "ACTIVE").length;
  return (
    <div className="bg-zinc-950/50 rounded-xl border border-zinc-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <h4 className="font-medium">Live Activity</h4>
        </div>
        <span className="text-xs text-zinc-500">{online}/{agents.length} agents online</span>
      </div>
      <div className="space-y-3">
        {agents.slice(0, 6).map((a, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{a.avatar?.slice(0,2) || a.name[0]}</div>
              <div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-zinc-500">{a.department}</p></div>
            </div>
            <span className={`text-xs ${a.status === "ACTIVE" ? "text-emerald-400" : "text-zinc-500"}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InvestorStats() {
  const stats = [
    { label: "Valuation", value: "$12M", change: "Pre-seed", icon: TrendingUp },
    { label: "Team Size", value: "19 Agents", change: "+3 this month", icon: Users },
    { label: "Uptime", value: "99.97%", change: "last 30d", icon: Clock },
    { label: "Systems", value: "3", change: "ventures", icon: Boxes }
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="group p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all duration-300">
            <Icon className="w-5 h-5 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{s.change}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function Bxthre3Home() {
  const { agents, tasks, loading } = useAgentOSData();
  const active = agents.filter((a: any) => a.status === "ACTIVE").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration:"4s"}} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration:"5s",animationDelay:"1s"}} />
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 1px)",backgroundSize:"40px 40px"}} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Hero - entertainment updated */}
        <ScrollReveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-zinc-400 tracking-wider">BUILT ON THE EDGE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Bxthre3 Inc
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Deterministic systems for deterministic outcomes. We build agentic 
              infrastructure that powers agriculture, entertainment, and the future of work.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <a href="/invest" className="px-6 py-3 bg-cyan-500 text-zinc-950 font-medium rounded-lg hover:bg-cyan-400 transition">Invest</a>
              <a href="#ventures" className="px-6 py-3 border border-zinc-700 rounded-lg hover:border-zinc-500 transition">View Ventures</a>
            </div>
          </div>
        </ScrollReveal>

        {/* Investor Stats */}
        <ScrollReveal delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold tracking-wider">INVESTOR SNAPSHOT</h2>
            </div>
            <InvestorStats />
          </div>
        </ScrollReveal>

        {/* Platform Stats with Live Data */}
        <ScrollReveal delay={200}>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 rounded-2xl border border-zinc-800 p-8 mb-16">
            <div className="flex items-center gap-4 mb-6">
              <Boxes className="w-8 h-8 text-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold">AgentOS</h2>
                <p className="text-zinc-500">The platform powering all Bxthre3 ventures</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-zinc-950/50 rounded-xl">
                <div className="text-3xl font-bold text-cyan-400">{loading ? "—" : agents.length}</div>
                <div className="text-xs text-zinc-500 mt-1">Total Agents</div>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl">
                <div className="text-3xl font-bold text-emerald-400">{loading ? "—" : active}</div>
                <div className="text-xs text-zinc-500 mt-1">Active Now</div>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl">
                <div className="text-3xl font-bold text-violet-400">{loading ? "—" : tasks.length}</div>
                <div className="text-xs text-zinc-500 mt-1">Queued Tasks</div>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-xl">
                <div className="text-3xl font-bold text-white">&lt;50ms</div>
                <div className="text-xs text-zinc-500 mt-1">Edge Latency</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ventures */}
        <ScrollReveal delay={300}>
          <div id="ventures" className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold tracking-wider">VENTURES</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {brands.map((b, i) => {
                const Icon = b.icon;
                const colorClass = b.color === "emerald" ? "text-emerald-400" : b.color === "violet" ? "text-violet-400" : "text-cyan-400";
                return (
                  <a key={i} href={`/projects/${b.slug}`} className="group p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300 hover:scale-[1.02]">
                    <Icon className={`w-8 h-8 mb-4 ${colorClass} group-hover:scale-110 transition-transform`} />
                    <h3 className="text-lg font-bold mb-1">{b.name}</h3>
                    <p className="text-xs text-zinc-500 mb-3">{b.role}</p>
                    <p className="text-sm text-zinc-400 mb-4">{b.desc}</p>
                    <div className="flex items-center gap-2 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Live Activity & Newsletter */}
        <ScrollReveal delay={400}>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {loading ? (
              <div className="bg-zinc-950/50 rounded-xl border border-zinc-800/50 p-6 flex items-center justify-center">
                <p className="text-zinc-500">Loading agent data...</p>
              </div>
            ) : (
              <LiveActivity agents={agents} />
            )}
            <NewsletterSignup />
          </div>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal delay={500}>
          <footer className="text-center text-zinc-600 text-sm pt-8 border-t border-zinc-800">
            <div className="flex justify-center gap-6 mb-4">
              <a href="https://github.com/bxthre3inc" className="hover:text-zinc-400 transition">GitHub</a>
              <a href="/invest" className="hover:text-zinc-400 transition">Invest</a>
              <a href="https://discord.gg/zocomputer" className="hover:text-zinc-400 transition">Discord</a>
            </div>
            <p>© {new Date().getFullYear()} Bxthre3 Inc · Built on the edge</p>
          </footer>
        </ScrollReveal>
      </div>
    </div>
  );
}
