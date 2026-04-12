// Agentic Orchestration — Reasoning Stream API
// Route: /api/orchestration/reasoning
import type { Context } from "hono";
import { Hono } from "hono";
import { sqlite } from "bun";

const DB = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/reasoning.db";

// Initialize database
const db = sqlite.open(DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS reasoning_stream (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    evidence TEXT NOT NULL DEFAULT '[]',
    confidence REAL NOT NULL DEFAULT 0.5,
    next_action TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_rs_task ON reasoning_stream(task_id);
  CREATE INDEX IF NOT EXISTS idx_rs_agent ON reasoning_stream(agent_id);
`);

const app = new Hono();

// GET /api/orchestration/reasoning — list entries
app.get("/", async (c) => {
  const taskId = c.req.query("task_id");
  const agentId = c.req.query("agent_id");
  const limit = parseInt(c.req.query("limit") || "50");
  
  let query = "SELECT * FROM reasoning_stream WHERE 1=1";
  const params: (string | number)[] = [];
  
  if (taskId) { query += " AND task_id = ?"; params.push(taskId); }
  if (agentId) { query += " AND agent_id = ?"; params.push(agentId); }
  query += " ORDER BY created_at DESC LIMIT ?";
  params.push(limit);
  
  const rows = db.query(query).all(...params) as any[];
  const entries = rows.map((r: any) => ({
    ...r,
    evidence: JSON.parse(r.evidence || "[]"),
    metadata: JSON.parse(r.metadata || "{}"),
  }));
  
  return c.json({ entries, count: entries.length });
});

// GET /api/orchestration/reasoning/:task_id — task chain
app.get("/:task_id", async (c) => {
  const taskId = c.req.param("task_id");
  const rows = db.query(
    "SELECT * FROM reasoning_stream WHERE task_id = ? ORDER BY created_at ASC"
  ).all(taskId) as any[];
  
  const entries = rows.map((r: any) => ({
    ...r,
    evidence: JSON.parse(r.evidence || "[]"),
    metadata: JSON.parse(r.metadata || "{}"),
  }));
  
  return c.json({ task_id: taskId, entries, count: entries.length });
});

// POST /api/orchestration/reasoning — append entry
app.post("/", async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  db.query(
    `INSERT INTO reasoning_stream (id, task_id, agent_id, phase, reasoning, evidence, confidence, next_action, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    body.task_id || "",
    body.agent_id || "",
    body.phase || "unknown",
    body.reasoning || "",
    JSON.stringify(body.evidence || []),
    body.confidence || 0.5,
    body.next_action || "",
    JSON.stringify(body.metadata || {}),
    now
  );
  
  return c.json({ id, task_id: body.task_id, agent_id: body.agent_id, phase: body.phase });
});

export default app;
