// Agentic Orchestration — Coherence Engine API
// Route: /api/orchestration/coherence
import { Hono } from "hono";
import { sqlite } from "bun";

const DB = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/coherence.db";

const db = sqlite.open(DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS coherence_plans (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    layers TEXT NOT NULL DEFAULT '[]',
    conflict_tasks TEXT NOT NULL DEFAULT '[]',
    estimated_duration_minutes REAL NOT NULL DEFAULT 0,
    estimated_cost_usd REAL NOT NULL DEFAULT 0,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );
`);

const app = new Hono();

type DependencyType = "NONE" | "SOFT" | "HARD" | "CONFLICT";

// POST /api/orchestration/coherence/resolve — resolve task dependencies into layers
app.post("/resolve", async (c) => {
  const body = await c.req.json();
  const { task_id, tasks = [] } = body;
  
  // Build dependency graph
  const taskMap = new Map(tasks.map((t: any) => [t.id, t]));
  const depGraph = new Map<string, string[]>();
  
  for (const task of tasks) {
    depGraph.set(task.id, task.depends_on || []);
  }
  
  // Resolve into layers (topological sort with parallel groups)
  const layers: string[][] = [];
  const resolved = new Set<string>();
  const remaining = new Set(tasks.map((t: any) => t.id));
  
  while (remaining.size > 0) {
    const layer: string[] = [];
    
    for (const taskId of remaining) {
      const deps = depGraph.get(taskId) || [];
      const allResolved = deps.every(d => resolved.has(d));
      if (allResolved) {
        layer.push(taskId);
      }
    }
    
    if (layer.length === 0) {
      // Circular dependency or orphaned tasks — force resolve
      for (const taskId of remaining) {
        layer.push(taskId);
      }
      break;
    }
    
    layers.push(layer);
    layer.forEach(id => { resolved.add(id); remaining.delete(id); });
  }
  
  // Calculate conflicts (tasks with HARD deps that aren't satisfied)
  const conflicts: string[] = [];
  for (const task of tasks) {
    if (task.dep_type === "HARD" || task.dep_type === "CONFLICT") {
      const deps = task.depends_on || [];
      const unsatisfied = deps.filter((d: string) => !resolved.has(d));
      if (unsatisfied.length > 0) {
        conflicts.push(task.id);
      }
    }
  }
  
  // Calculate totals
  const totalDuration = layers.length * 15;
  const totalCost = tasks.reduce((sum: number, t: any) => sum + (t.cost_usd || 0), 0);
  
  const planId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  db.query(
    `INSERT INTO coherence_plans
     (id, task_id, layers, conflict_tasks, estimated_duration_minutes, estimated_cost_usd, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(planId, task_id, JSON.stringify(layers), JSON.stringify(conflicts), totalDuration, totalCost, now);
  
  return c.json({
    plan_id: planId,
    task_id,
    layers,
    layer_count: layers.length,
    conflicts,
    conflict_count: conflicts.length,
    estimated_duration_minutes: totalDuration,
    estimated_cost_usd: totalCost,
    has_conflicts: conflicts.length > 0
  });
});

// GET /api/orchestration/coherence/:plan_id — get plan
app.get("/:plan_id", async (c) => {
  const planId = c.req.param("plan_id");
  const rows = db.query("SELECT * FROM coherence_plans WHERE id = ?").all(planId) as any[];
  if (!rows.length) return c.json({ error: "Plan not found" }, 404);
  
  const r = rows[0];
  return c.json({
    ...r,
    layers: JSON.parse(r.layers || "[]"),
    conflict_tasks: JSON.parse(r.conflict_tasks || "[]"),
    metadata: JSON.parse(r.metadata || "{}"),
  });
});

// GET /api/orchestration/coherence — list recent plans
app.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") || "20");
  const rows = db.query(
    "SELECT * FROM coherence_plans ORDER BY created_at DESC LIMIT ?"
  ).all(limit) as any[];
  
  return c.json({ plans: rows.map((r: any) => ({
    ...r,
    layers: JSON.parse(r.layers || "[]"),
    conflict_tasks: JSON.parse(r.conflict_tasks || "[]"),
  })), count: rows.length });
});

export default app;
