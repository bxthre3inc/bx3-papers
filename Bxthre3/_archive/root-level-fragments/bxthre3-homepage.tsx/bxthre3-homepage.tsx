import { useState, useEffect } from "react";
import { 
  Cpu, Network, Activity, Zap, Globe, Layers, 
  ArrowRight, ChevronRight, Boxes, Terminal, Shield,
  Sparkles, Radio
} from "lucide-react";

function ParticleField() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, delay: number}>>([]);
  
  useEffect(() => {
    const pts = Array.from({length: 30}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-500/20 animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-cyan-500/30"/>
      </svg>
    </div>
  );
}

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function MetricPulse({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
      <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
      <div>
        <div className="text-xs text-zinc-500 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-mono">
          <span className="text-cyan-400">{value}</span>
          <span className="text-zinc-600 ml-1">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ventures = [
    { 
      name: "Irrig8", 
      tagline: "Deterministic Farming OS",
      desc: "End-to-end resource health management for agriculture. Satellite imagery, ground sensors, soil variability.",
      icon: <Globe className="w-6 h-6" />,
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30",
      status: "Live"
    },
    { 
      name: "Valley Players Club", 
      tagline: "Private Investment Network",
      desc: "Investor portal for DVC-powered capital allocation. Deterministic Value-of-Capital analytics.",
      icon: <Layers className="w-6 h-6" />,
      color: "from-violet-500/20 to-fuchsia-500/20",
      borderColor: "border-violet-500/30",
      status: "Beta"
    },
    { 
      name: "RGIU", 
      tagline: "Intelligence Unit",
      desc: "Distressed asset scouting, appraisal, and agentic outreach. Rio Grande market focus.",
      icon: <Terminal className="w-6 h-6" />,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      status: "MVP"
    },
    { 
      name: "Build-A-Biz", 
      tagline: "Digital Onboarding",
      desc: "Streamlined LLC formation and business setup for the San Luis Valley ecosystem.",
      icon: <Boxes className="w-6 h-6" />,
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      status: "Live"
    }
  ];

  const platformFeatures = [
    { icon: <Cpu className="w-5 h-5" />, title: "Edge-Native", desc: "Deterministic compute at the edge" },
    { icon: <Network className="w-5 h-5" />, title: "Mesh Architecture", desc: "Federated agent coordination" },
    { icon: <Shield className="w-5 h-5" />, title: "Zero-Trust", desc: "Telemetry with locked access" },
    { icon: <Zap className="w-5 h-5" />, title: "AgentOS", desc: "Autonomous system orchestration" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <ParticleField />
      
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Bxthre3</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-zinc-400 hover:text-white transition">Platform</a>
            <a href="#ventures" className="text-sm text-zinc-400 hover:text-white transition">Ventures</a>
            <a href="/invest" className="text-sm text-zinc-400 hover:text-white transition">Invest</a>
          </nav>
          <a href="/invest" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px]" />
          
          <div className="relative max-w-7xl mx-auto px-6 py-32">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm text-zinc-400">AgentOS v7.0 Now Running</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8">
                <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                  Deterministic
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Systems at Scale
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
                Bxthre3 Inc builds AgentOS — the edge-native platform for autonomous operations. 
                From agriculture to finance, we orchestrate deterministic AI that runs where data lives.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#ventures" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition group">
                  Explore Our Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </a>
                <a href="#platform" className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 rounded-xl font-semibold hover:bg-zinc-900 transition">
                  <Terminal className="w-5 h-5" />
                  Platform Docs
                </a>
              </div>
            </div>

            <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <MetricPulse label="Agents Active" value="47" unit="online" />
              <MetricPulse label="Edge Nodes" value="12" unit="regions" />
              <MetricPulse label="Uptime" value="99.97" unit="%" />
              <MetricPulse label="Tasks/Day" value="2.4K" unit="avg" />
            </div>
          </div>
        </section>

        {/* Platform Section */}
        <section id="platform" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-cyan-400 mb-6">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wider uppercase">The Platform</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  AgentOS
                </h2>
                <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                  A deterministic operating system for autonomous agents. Built for edge deployment, 
                  designed for auditability, and engineered to run where your data originates.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {platformFeatures.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
                        {f.icon}
                      </div>
                      <h3 className="font-semibold mb-1">{f.title}</h3>
                      <p className="text-sm text-zinc-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-3xl blur-2xl" />
                <GlowCard className="relative">
                  <div className="p-6 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                      <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      <span className="ml-2">agentos-cli</span>
                    </div>
                    <div className="space-y-2 text-zinc-300">
                      <p><span className="text-cyan-400">$</span> agentos pulse --all</p>
                      <p className="text-zinc-500">Scanning mesh nodes...</p>
                      <p className="text-emerald-400">✓ 47 agents responding</p>
                      <p className="text-emerald-400">✓ 12 edge nodes active</p>
                      <p className="text-emerald-400">✓ MCP bridge connected</p>
                      <p className="text-zinc-500">---</p>
                      <p><span className="text-cyan-400">$</span> agentos deploy --env=production</p>
                      <p className="text-violet-400">→ Deploying Irrig8 v2.1.0...</p>
                      <p className="text-violet-400">→ Rolling update: 3/3 nodes</p>
                      <p className="text-emerald-400">✓ Deployment complete</p>
                      <p className="animate-pulse text-zinc-500">_</p>
                    </div>
                  </div>
                </GlowCard>
              </div>
            </div>
          </div>
        </section>

        {/* Ventures Grid */}
        <section id="ventures" className="py-32 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-violet-400 mb-6">
                <Layers className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wider uppercase">Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Built on AgentOS
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Real products solving real problems. Each venture leverages the AgentOS platform 
                for deterministic, autonomous operations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {ventures.map((v, i) => (
                <GlowCard key={i} className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className={`p-8 bg-gradient-to-br ${v.color}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-zinc-900/80 flex items-center justify-center ${v.borderColor} border`}>
                        {v.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-zinc-900/80 text-xs font-medium text-zinc-400 border border-zinc-800">
                        {v.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{v.name}</h3>
                    <p className="text-cyan-400 text-sm font-medium mb-3">{v.tagline}</p>
                    <p className="text-zinc-400 mb-6">{v.desc}</p>
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-medium hover:text-cyan-400 transition">
                      Learn more <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="relative p-12 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Ready to Build?
                </h2>
                <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
                  Whether you are an investor, partner, or developer — we would love to hear from you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="/invest" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition">
                    Investor Deck <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="mailto:hello@bxthre3.com" className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 rounded-xl font-semibold hover:bg-zinc-900 transition">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Bxthre3 Inc</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-zinc-500">
              <a href="#" className="hover:text-zinc-300 transition">Monte Vista, CO</a>
              <span className="text-zinc-700">|</span>
              <a href="https://github.com/bxthre3inc" className="hover:text-zinc-300 transition">GitHub</a>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-600">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
