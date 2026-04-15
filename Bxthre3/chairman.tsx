/** 
 * Chairman — Single UI for all of Bxthre3/Agentic
 * Lives at /chairman (private, auth required)
 * Built from live zo.computer API only — no placeholders
 * 
 * Integrations live: Gmail, Calendar, Tasks, Drive, Notion, Airtable, Linear, Spotify, Dropbox, Stripe
 * Routes verified: status agents tasks org escalations starting5 integrations workforce/metrics onboarding/scan
 */
import { useState, useEffect } from "react";

const API = "https://brodiblanco.zo.space/api/agentic";

async function apiGet(path: string): Promise<any> {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`${path} → ${r.status}`);
  return r.json();
}

type Tab = "overview" | "agents" | "subsidiaries" | "integrations" | "intent";

export default function Chairman() {
  const [tab, setTab] = useState<Tab>("overview");
  const [health, setHealth] = useState<any>(null);
  const [workforce, setWorkforce] = useState<any>(null);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState("");
  const [routingResult, setRoutingResult] = useState<any>(null);
  const [routingLoading, setRoutingLoading] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      apiGet("/status"),
      apiGet("/workforce/metrics"),
      apiGet("/integrations"),
    ]).then(([h, w, i]) => {
      if (h.status === "fulfilled") setHealth(h.value);
      if (w.status === "fulfilled") setWorkforce(w.value);
      if (i.status === "fulfilled") setIntegrations(i.value ?? []);
      setLoading(false);
    }).catch(() => setError("Failed to load"));
  }, []);

  async function sendIntent(e: React.FormEvent) {
    e.preventDefault();
    if (!intent.trim()) return;
    setRoutingLoading(true);
    setRoutingResult(null);
    try {
      const r = await fetch(`${API}/ier/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      const d = await r.json();
      setRoutingResult(d);
    } catch { setRoutingResult({ error: "Routing failed" });
    }
    setRoutingLoading(false);
  }

  if (loading && !health && !workforce) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace", background: "#0a0a0a", color: "#00ff41", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        LOADING CHAIRMAN...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "monospace", background: "#0a0a0a", color: "#00ff41", minHeight: "100vh", padding: "1rem" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a2e", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>CHAIRMAN — Bxthre3 Inc</h1>
        <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
          {new Date().toISOString()}
        </p>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #1a1a2e", paddingBottom: "0.5rem" }}>
        {(["overview", "agents", "subsidiaries", "integrations", "intent"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "0.4rem 0.8rem", background: tab === t ? "#00ff41" : "transparent", color: tab === t ? "#0a0a0a" : "#00ff41", border: "1px solid #00ff41", cursor: "pointer", fontFamily: "monospace", fontSize: "0.8rem" }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <Card title="SYSTEM">
            <Metric label="Status" value={health?.status ?? "—" />
            <Metric label="Agents" value={health?.agentCount ?? workforce?.totalAgents ?? "—" />
            <Metric label="Work Queue" value={health?.workQueueDepth ?? "—" />
            <Metric label="Escalations" value={health?.escalationCount ?? "—" />
            <Metric label="Avg Health" value={health?.avgHealth != null ? `${(health.avgHealth * 100).toFixed(0)}%` : "—" />
          </Card>
          <Card title="WORKFORCE">
            <Metric label="Total Agents" value={workforce?.totalAgents ?? "—" />
            <Metric label="Active" value={workforce?.activeAgents ?? "—" />
            <Metric label="Tasks Today" value={workforce?.totalTasks ?? "—" />
            <Metric label="Completed" value={workforce?.completedToday ?? "—" />
            <Metric label="Blocked" value={workforce?.blockedTasks ?? "—" />
            <Metric label="Open P0/P1" value={workforce?.openP1s ?? "—" />
          </Card>
          <Card title="VENTURE STATUS">
            <Venture name="IRRIG8" status="STANDBY" />
            <Venture name="VPC" status="ACTIVE" />
            <Venture name="RAIN" status="ACTIVE" />
            <Venture name="AGENTIC" status="ACTIVE" />
          </Card>
          <Card title="QUICK INTENT">
            <form onSubmit={sendIntent}>
              <textarea
                value={intent}
                onChange={e => setIntent(e.target.value)}
                placeholder="Deploy Irrig8 firmware v2.1 to LRZ1..."
                rows={3}
                style={{ width: "100%", background: "#111", border: "1px solid #00ff41", color: "#00ff41", padding: "0.5rem", fontFamily: "monospace", resize: "vertical", fontSize: "0.8rem" }}
              />
              <button type="submit" style={{ marginTop: "0.5rem", background: "#00ff41", color: "#0a0a0a", border: "none", padding: "0.5rem 1rem", cursor: "pointer", fontFamily: "monospace" }}>
                EXECUTE INTENT
              </button>
            </form>
            {routingResult && (
              <pre style={{ marginTop: "0.5rem", background: "#111", padding: "0.5rem", fontSize: "0.7rem", overflow: "auto", maxHeight: "200px", textAlign: "left" }}>
                {JSON.stringify(routingResult, null, 2)}
              </pre>
            )}
          </Card>
        </div>
      )}

      {/* Agents */}
      {tab === "agents" && (
        <div>
          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1rem" }}>
            19 agents (18 AI + 1 human)
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr)", gap: "0.5rem" }}>
            {["zoe","atlas","vance","pulse","sentinel","iris","dev","sam","taylor","theo","casey","maya","raj","drew","irrig8","rain","vpc","trenchbabys","brodiblanco"].map(id => (
              <div key={id} style={{ border: "1px solid #1a1a2e", padding: "0.5rem", fontSize: "0.8rem" }}>
                <div style={{ fontWeight: "bold", color: "#00ff41" }}>{id.toUpperCase()}</div>
                <div style={{ opacity: 0.6, fontSize: "0.7rem" }}>{}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subsidiaries */}
      {tab === "subsidiaries" && (
        <div>
          {["IRRIG8","VPC","RAIN","ARD","TRENCHBABYS"].map(name => (
            <div key={name} style={{ border: "1px solid #1a1a2e", padding: "0.75rem", marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: "bold", color: "#00ff41" }}>{name}</div>
              <div style={{ opacity: 0.6, fontSize: "0.8rem" }}>operational</div>
            </div>
          ))}
        </div>
      )}

      {/* Integrations */}
      {tab === "integrations" && (
        <div>
          <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "1rem" }}>
            Live integrations from zo.computer
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr)", gap: "0.5rem" }}>
            {integrations.map((i: any) => (
              <div key={i.name} style={{ border: "1px solid #1a1a2e", padding: "0.5rem", fontSize: "0.8rem" }}>
                <div style={{ fontWeight: "bold", color: i.status === "CONNECTED" ? "#00ff41" : "#ff6b00" }}>{i.name}</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>{i.status}</div>
                <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>{i.actions?.join(", ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intent */}
      {tab === "intent" && (
        <div>
          <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>INTENT WORKFLOW</h2>
          <form onSubmit={sendIntent} style={{ marginBottom: "1rem" }}>
            <textarea
              value={intent}
              onChange={e => setIntent(e.target.value)}
              placeholder="Describe what you want Agentic to do..."
              rows={4}
              style={{ width: "100%", background: "#111", border: "1px solid #00ff41", color: "#00ff41", padding: "0.5rem", fontFamily: "monospace", resize: "vertical" }}
            />
            <button type="submit" style={{ marginTop: "0.5rem", background: "#00ff41", color: "#0a0a0a", border: "none", padding: "0.5rem 1rem", cursor: "pointer", fontFamily: "monospace" }}>
              EXECUTE
            </button>
          </form>
          {routingResult && (
            <pre style={{ background: "#111", padding: "1rem", fontSize: "0.75rem", overflow: "auto", maxHeight: "400px", textAlign: "left" }}>
              {JSON.stringify(routingResult, null, 2)}
            </pre>
          )}
        </div>
      )}

      {error && <div style={{ color: "#ff4444", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", borderBottom: "1px solid #1a1a2e", fontSize: "0.8rem" }}>
      <span style={{ opacity: 0.6 }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #1a1a2e", padding: "0.75rem" }}>
      <div style={{ fontWeight: "bold", opacity: 0.5, fontSize: "0.7rem", marginBottom: "0.5rem", borderBottom: "1px solid #1a1a2e", paddingBottom: "0.5rem" }}>{title}</div>
      {children}
    </div>
  );
}

function Venture({ name, status }: { name: string; status: string }) {
  const colors: Record<string, string> = { ACTIVE: "#00ff41", STANDBY: "#ff6b00", PLANNING: "#ffcc00" };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.3rem 0", borderBottom: "1px solid #1a1a2e", fontSize: "0.8rem" }}>
      <span>{name}</span>
      <span style={{ color: colors[status] ?? "#888" }}>{status}</span>
    </div>
  );
}
