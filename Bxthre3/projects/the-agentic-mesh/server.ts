import { serveStatic } from "hono/bun";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";
import { readFileSync, writeFileSync, existsSync } from "fs";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

/**
 * Add any API routes here.
 */
app.get("/api/hello-zo", (c) => c.json({ msg: "Hello from Zo" }));

// ── Agentic Orchestration API Routes (JSON persistence) ──────────────────────

const REASONING_FILE = "/tmp/orchestration_reasoning.json";
const IER_FILE = "/tmp/orchestration_ier.json";

interface ReasoningEntry { id: string; task_id: string; agent_id: string; phase: string; reasoning: string; evidence: string[]; confidence: number; next_action: string; metadata: Record<string,any>; created_at: string; }
interface IEREntry { id: number; agent_id: string; task_type: string; selected_agent: string; confidence: number; task_id: string; outcome: string|null; outcome_score: number|null; created_at: string; }
interface IERTraining { id: number; trained_at: string; agents_updated: number; tasks_processed: number; avg_reward: number; epsilon: number; }

function readJson<T>(path: string, def: T): T { try { return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : def; } catch { return def; } }
function writeJson(path: string, data: any) { writeFileSync(path, JSON.stringify(data, null, 2)); }

let reasoningStore: ReasoningEntry[] = readJson(REASONING_FILE, []);
let ierStore: IEREntry[] = readJson(IER_FILE, []);
let ierTrainingLog: IERTraining[] = [];

// Reasoning Stream
app.get("/api/orchestration/reasoning", c => {
  const limit = parseInt(c.req.query("limit") || "50");
  const agentId = c.req.query("agent_id");
  const taskId = c.req.query("task_id");
  let entries = [...reasoningStore].reverse();
  if (agentId) entries = entries.filter(e => e.agent_id === agentId);
  if (taskId) entries = entries.filter(e => e.task_id === taskId);
  return c.json({ entries: entries.slice(0, limit), count: entries.length });
});

app.get("/api/orchestration/reasoning/:task_id", c => {
  const entries = reasoningStore.filter(e => e.task_id === c.req.param("task_id"));
  return c.json({ entries, count: entries.length });
});

app.post("/api/orchestration/reasoning", async c => {
  const body = await c.req.json();
  const entry: ReasoningEntry = { id: crypto.randomUUID(), task_id: body.task_id||"", agent_id: body.agent_id||"unknown", phase: body.phase||"unknown", reasoning: body.reasoning||"", evidence: body.evidence||[], confidence: body.confidence||0.5, next_action: body.next_action||"", metadata: body.metadata||{}, created_at: new Date().toISOString() };
  reasoningStore.push(entry);
  writeJson(REASONING_FILE, reasoningStore);
  return c.json({ id: entry.id, task_id: entry.task_id, agent_id: entry.agent_id, phase: entry.phase });
});

// Phase Gates
app.get("/api/orchestration/phases", c => {
  const phases = [
    { name: "PENDING", status: "active", entries: 0, gate: null },
    { name: "ANALYZE", status: "active", entries: 0, gate: "analyze_gate" },
    { name: "PLAN", status: "pending", entries: 0, gate: "plan_gate" },
    { name: "EXECUTE", status: "pending", entries: 0, gate: "execute_gate" },
    { name: "REVIEW", status: "pending", entries: 0, gate: "review_gate" },
    { name: "COMPLETE", status: "pending", entries: 0, gate: null },
  ];
  return c.json({ phases, gates: ["analyze_gate","plan_gate","execute_gate","review_gate"] });
});

// Workflow DAG
app.get("/api/orchestration/workflow", c => {
  const templates = [
    { name: "Grant Writing", nodes: 4, status: "template", desc: "Research→Draft→Review→Submit" },
    { name: "Sales Outreach", nodes: 4, status: "template", desc: "Prospect→Qualify→Propose→Close" },
    { name: "VPC Investor", nodes: 3, status: "template", desc: "Due Diligence→Term Sheet→Close" },
    { name: "VPC DVC", nodes: 3, status: "template", desc: "Data Collection→Valuation→Report" },
    { name: "Irrig8 Deployment", nodes: 4, status: "template", desc: "Survey→Configure→Deploy→Monitor" },
    { name: "Patent Filing", nodes: 4, status: "template", desc: "Research→Draft→Review→File" },
  ];
  return c.json({ templates, layers: 3 });
});

// IER Router
app.get("/api/orchestration/ier", c => {
  const agents = [...new Set(ierStore.map(e => e.agent_id))];
  const tasks = [...new Set(ierStore.map(e => e.task_type))];
  const last = ierTrainingLog[ierTrainingLog.length - 1];
  return c.json({ stats: { total_decisions: ierStore.length, last_training: last?.trained_at || null, agent_stats: {}, task_stats: {} }, agents_tracked: agents.length, task_types: tasks.length });
});

app.post("/api/orchestration/ier", async c => {
  const body = await c.req.json();
  const entry: IEREntry = { id: ierStore.length + 1, agent_id: body.agent_id||"zo", task_type: body.task_type||"general", selected_agent: body.selected_agent||"zo", confidence: body.confidence||0.5, task_id: body.task_id||crypto.randomUUID(), outcome: body.outcome||null, outcome_score: body.outcome_score||null, created_at: new Date().toISOString() };
  ierStore.push(entry);
  writeJson(IER_FILE, ierStore);
  return c.json({ status: "recorded", id: entry.id });
});

// ── Workflow Templates
import { readFileSync } from "fs";
const WORKFLOW_TEMPLATES: Record<string, any> = {
  "Grant Writing": {"description": "Research → Draft → Review → Submit", "task_type": "grant-writing", "nodes": 7},
  "VPC Investor": {"description": "Due Diligence → Term Sheet → Close", "task_type": "vpc-investor", "nodes": 6},
  "Irrig8 Deployment": {"description": "Survey → Configure → Deploy → Monitor", "task_type": "irrig8-deployment", "nodes": 8},
  "Patent Filing": {"description": "Research → Draft → Review → File", "task_type": "patent-filing", "nodes": 6},
};

app.get("/api/orchestration/workflow", (c) => {
  return c.json({ templates: WORKFLOW_TEMPLATES });
});

// Coherence Engine
app.get("/api/orchestration/coherence", c => {
  const layers = [
    { layer: 1, name: "Parallel Agents", parallel: true, agents: ["Zo","Erica","Sentinel"] },
    { layer: 2, name: "Parallel Agents", parallel: true, agents: ["Casey","Iris","Chronicler"] },
    { layer: 3, name: "Aggregation", parallel: false, agents: ["Orchestrator"] },
  ];
  return c.json({ layers, status: "ready", coherence_check: "passing" });
});

app.post("/api/orchestration/coherence", async c => {
  const body = await c.req.json();
  return c.json({ plan_id: crypto.randomUUID(), layers: body.layers||3, status: "planned" });
});

// ── End Orchestration APIs ────────────────────────────────────────────────────

if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

/**
 * Determine port based on mode. In production, use the published_port if available.
 * In development, always use the local_port.
 * Ports are managed by the system and injected via the PORT environment variable.
 */
const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

/**
 * Configure routing for production builds.
 *
 * - Streams prebuilt assets from `dist`.
 * - Static files from `public/` are copied to `dist/` by Vite and served at root paths.
 * - Falls back to `index.html` for any other GET so the SPA router can resolve the request.
 */
function configureProduction(app: Hono) {
  app.use("/assets/*", serveStatic({ root: "./dist" }));
  app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
  app.use(async (c, next) => {
    if (c.req.method !== "GET") return next();

    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/")) return next();

    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) {
        return new Response(file);
      }
    }

    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

/**
 * Configure routing for development builds.
 *
 * - Boots Vite in middleware mode for transforms.
 * - Static files from `public/` are served at root paths (matching Vite convention).
 * - Mirrors production routing semantics so SPA routes behave consistently.
 */
async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}
