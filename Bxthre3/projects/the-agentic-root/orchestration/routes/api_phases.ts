// Agentic Orchestration — Phase Gates API
// Route: /api/orchestration/phases
import type { Context } from "hono";
import { Hono } from "hono";
import { sqlite } from "bun";

const DB = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/phase_gates.db";

const db = sqlite.open(DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS phase_gates (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    gate_name TEXT NOT NULL,
    phase_from TEXT NOT NULL,
    phase_to TEXT NOT NULL,
    passed INTEGER NOT NULL DEFAULT 0,
    failures TEXT NOT NULL DEFAULT '[]',
    warnings TEXT NOT NULL DEFAULT '[]',
    metadata TEXT NOT NULL DEFAULT '{}',
    evaluated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_pg_task ON phase_gates(task_id);
`);

const app = new Hono();

// Phases enum
const PHASES = ["pending","analyze","validate","execute","deliver","complete","suspended","failed"] as const;
type Phase = typeof PHASES[number];

// POST /api/orchestration/phases/transition — evaluate gate and transition
app.post("/transition", async (c) => {
  const body = await c.req.json();
  const { task_id, from_phase, to_phase, task_data } = body;
  
  if (!PHASES.includes(from_phase) || !PHASES.includes(to_phase)) {
    return c.json({ error: "Invalid phase" }, 400);
  }
  
  const gateName = `${from_phase}_to_${to_phase}`;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  // Simple gate logic — real implementation would run rule checks
  let passed = true;
  const failures: string[] = [];
  
  // Gate: schema check on pending→analyze
  if (gateName === "pending_to_analyze") {
    if (!task_data?.id || !task_data?.type) {
      passed = false;
      failures.push("Missing required fields: id, type");
    }
  }
  
  // Gate: context check on analyze→validate
  if (gateName === "analyze_to_validate") {
    if ((task_data?.confidence || 0) < 0.6) {
      passed = false;
      failures.push("Confidence below 0.6 threshold");
    }
  }
  
  // Gate: validation check on validate→execute
  if (gateName === "validate_to_execute") {
    if ((task_data?.citations_count || 0) < 1) {
      passed = false;
      failures.push("No citations in evidence");
    }
  }
  
  db.query(
    `INSERT INTO phase_gates (id, task_id, gate_name, phase_from, phase_to, passed, failures, warnings, metadata, evaluated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, task_id, gateName, from_phase, to_phase, passed ? 1 : 0,
    JSON.stringify(failures), "[]", "{}", now);
  
  return c.json({
    task_id,
    gate_name: gateName,
    passed,
    failures,
    next_phase: passed ? to_phase : from_phase,
    suspended: !passed
  });
});

// GET /api/orchestration/phases/:task_id — gate history
app.get("/:task_id", async (c) => {
  const taskId = c.req.param("task_id");
  const rows = db.query(
    "SELECT * FROM phase_gates WHERE task_id = ? ORDER BY evaluated_at ASC"
  ).all(taskId) as any[];
  
  const history = rows.map((r: any) => ({
    ...r,
    passed: Boolean(r.passed),
    failures: JSON.parse(r.failures || "[]"),
    warnings: JSON.parse(r.warnings || "[]"),
    metadata: JSON.parse(r.metadata || "{}"),
  }));
  
  return c.json({ task_id: taskId, history, count: history.length });
});

// GET /api/orchestration/phases — list recent gates
app.get("/", async (c) => {
  const limit = parseInt(c.req.query("limit") || "50");
  const rows = db.query(
    "SELECT * FROM phase_gates ORDER BY evaluated_at DESC LIMIT ?"
  ).all(limit) as any[];
  
  const gates = rows.map((r: any) => ({
    ...r,
    passed: Boolean(r.passed),
    failures: JSON.parse(r.failures || "[]"),
  }));
  
  return c.json({ gates, count: gates.length });
});

export default app;
