// Agentic Orchestration — Workflow DAG API
// Route: /api/orchestration/workflow
import { Hono } from "hono";
import { sqlite } from "bun";

const DB = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/workflow_dag.db";

const db = sqlite.open(DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS workflow_dags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    template_type TEXT NOT NULL,
    nodes TEXT NOT NULL DEFAULT '[]',
    edges TEXT NOT NULL DEFAULT '[]',
    ier_overrides TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS execution_plans (
    id TEXT PRIMARY KEY,
    dag_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    layers TEXT NOT NULL DEFAULT '[]',
    estimated_duration_minutes REAL NOT NULL DEFAULT 0,
    estimated_cost_usd REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

const app = new Hono();

// Templates
const TEMPLATES: Record<string, any> = {
  general: {
    nodes: [
      { id: "start", type: "START", phase: "pending", deps: [] },
      { id: "analyze", type: "ANALYZE", phase: "analyze", deps: ["start"] },
      { id: "validate", type: "VALIDATE", phase: "validate", deps: ["analyze"] },
      { id: "execute", type: "EXECUTE", phase: "execute", deps: ["validate"] },
      { id: "deliver", type: "DELIVER", phase: "deliver", deps: ["execute"] },
      { id: "end", type: "COMPLETE", phase: "complete", deps: ["deliver"] },
    ],
    edges: [
      { from: "start", to: "analyze" },
      { from: "analyze", to: "validate" },
      { from: "validate", to: "execute" },
      { from: "execute", to: "deliver" },
      { from: "deliver", to: "end" },
    ]
  },
  grant: {
    nodes: [
      { id: "start", type: "START", phase: "pending", deps: [] },
      { id: "research", type: "RESEARCH", phase: "analyze", deps: ["start"] },
      { id: "validate_fit", type: "VALIDATE", phase: "validate", deps: ["research"] },
      { id: "write", type: "WRITE", phase: "execute", deps: ["validate_fit"] },
      { id: "review", type: "REVIEW", phase: "validate", deps: ["write"] },
      { id: "submit", type: "DELIVER", phase: "deliver", deps: ["review"] },
      { id: "end", type: "COMPLETE", phase: "complete", deps: ["submit"] },
    ],
    edges: [
      { from: "start", to: "research" },
      { from: "research", to: "validate_fit" },
      { from: "validate_fit", to: "write" },
      { from: "write", to: "review" },
      { from: "review", to: "submit" },
      { from: "submit", to: "end" },
    ]
  },
  code: {
    nodes: [
      { id: "start", type: "START", phase: "pending", deps: [] },
      { id: "plan", type: "PLAN", phase: "analyze", deps: ["start"] },
      { id: "implement", type: "IMPLEMENT", phase: "execute", deps: ["plan"] },
      { id: "test", type: "TEST", phase: "validate", deps: ["implement"] },
      { id: "deploy", type: "DEPLOY", phase: "deliver", deps: ["test"] },
      { id: "end", type: "COMPLETE", phase: "complete", deps: ["deploy"] },
    ],
    edges: [
      { from: "start", to: "plan" },
      { from: "plan", to: "implement" },
      { from: "implement", to: "test" },
      { from: "test", to: "deploy" },
      { from: "deploy", to: "end" },
    ]
  }
};

// POST /api/orchestration/workflow — create/resolve DAG
app.post("/", async (c) => {
  const body = await c.req.json();
  const { task_id, template_type = "general", task_data = {} } = body;
  
  const template = TEMPLATES[template_type] || TEMPLATES.general;
  const dagId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  // Resolve layers from DAG
  const layers: string[][] = [];
  const nodeMap = new Map(template.nodes.map((n: any) => [n.id, n]));
  
  // Layer 0: nodes with no deps
  const layer0 = template.nodes.filter((n: any) => n.deps.length === 0).map((n: any) => n.id);
  if (layer0.length) layers.push(layer0);
  
  // Build remaining layers
  const remaining = new Set(template.nodes.map((n: any) => n.id).filter((id: string) => !layer0.includes(id)));
  let iteration = 0;
  while (remaining.size > 0 && iteration < 10) {
    const nextLayer: string[] = [];
    for (const nodeId of remaining) {
      const node = nodeMap.get(nodeId);
      if (node && node.deps.every((d: string) => !remaining.has(d) || layers.flat().includes(d))) {
        nextLayer.push(nodeId);
      }
    }
    if (nextLayer.length === 0) break;
    layers.push(nextLayer);
    nextLayer.forEach(id => remaining.delete(id));
    iteration++;
  }
  
  const estimatedDuration = layers.length * 15;
  const planId = crypto.randomUUID();
  
  db.query(
    `INSERT INTO workflow_dags (id, name, template_type, nodes, edges, ier_overrides, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(dagId, `dag_${task_id}`, template_type, JSON.stringify(template.nodes), JSON.stringify(template.edges), "[]", now);
  
  db.query(
    `INSERT INTO execution_plans (id, dag_id, task_id, layers, estimated_duration_minutes, estimated_cost_usd, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(planId, dagId, task_id, JSON.stringify(layers), estimatedDuration, 0, now);
  
  return c.json({
    dag_id: dagId,
    plan_id: planId,
    task_id,
    template_type,
    layers,
    estimated_duration_minutes: estimatedDuration,
    node_count: template.nodes.length
  });
});

// GET /api/orchestration/workflow/:dag_id — get DAG
app.get("/:dag_id", async (c) => {
  const dagId = c.req.param("dag_id");
  const rows = db.query("SELECT * FROM workflow_dags WHERE id = ?").all(dagId) as any[];
  if (!rows.length) return c.json({ error: "DAG not found" }, 404);
  
  const r = rows[0];
  return c.json({
    ...r,
    nodes: JSON.parse(r.nodes || "[]"),
    edges: JSON.parse(r.edges || "[]"),
    ier_overrides: JSON.parse(r.ier_overrides || "[]"),
  });
});

// GET /api/orchestration/workflow/templates/list — available templates
app.get("/templates/list", async (c) => {
  return c.json({ templates: Object.keys(TEMPLATES) });
});

export default app;
