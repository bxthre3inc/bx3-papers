// Agentic Orchestration — IER Router API
// Route: /api/orchestration/ier
import { Hono } from "hono";
import { sqlite } from "bun";

const DB = "/home/workspace/Bxthre3/projects/agentic/orchestration/data/ier_router.db";

const db = sqlite.open(DB);
db.exec(`
  CREATE TABLE IF NOT EXISTS ier_routing_log (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    priority TEXT NOT NULL,
    selected_agent TEXT NOT NULL,
    q_value REAL NOT NULL,
    confidence REAL NOT NULL,
    reason TEXT NOT NULL,
    override_used INTEGER NOT NULL DEFAULT 0,
    outcome_feedback TEXT,
    reward REAL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS ier_q_table (
    agent_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    priority TEXT NOT NULL,
    q_value REAL NOT NULL DEFAULT 0.0,
    visit_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (agent_id, task_type, priority)
  );
  CREATE INDEX IF NOT EXISTS idx_ier_task ON ier_routing_log(task_id);
`);

const app = new Hono();

// Agent roster
const AGENTS = ["zo", "kimi", "genspark", "byok", "claude", "gpt4o"];

// Feature extraction from task
function extract_features(task_data: any): string {
  const type = task_data?.type || "general";
  const priority = task_data?.priority || "P2";
  return `${type}_${priority}`;
}

// POST /api/orchestration/ier/select — select agent for task
app.post("/select", async (c) => {
  const body = await c.req.json();
  const { task_id, task_type = "general", priority = "P2", task_data = {} } = body;
  
  const featureKey = extract_features({ type: task_type, priority, ...task_data });
  
  // Get Q-values for all agents for this feature
  const qRows = db.query(
    "SELECT agent_id, q_value FROM ier_q_table WHERE task_type = ? AND priority = ?"
  ).all(task_type, priority) as any[];
  
  // Build Q table with defaults
  const qMap: Record<string, number> = {};
  for (const agent of AGENTS) qMap[agent] = 0.0;
  for (const row of qRows) qMap[row.agent_id] = row.q_value;
  
  // Epsilon-greedy: 10% exploration
  const epsilon = 0.1;
  let selectedAgent: string;
  let confidence: number;
  
  if (Math.random() < epsilon) {
    selectedAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    confidence = 0.3;
  } else {
    // Select best
    let bestAgent = AGENTS[0];
    let bestQ = qMap[AGENTS[0]];
    for (const agent of AGENTS) {
      if (qMap[agent] > bestQ) { bestQ = qMap[agent]; bestAgent = agent; }
    }
    selectedAgent = bestAgent;
    confidence = Math.min(0.9, 0.5 + bestQ * 0.2);
  }
  
  // Log routing decision
  const logId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  db.query(
    `INSERT INTO ier_routing_log
     (id, task_id, task_type, priority, selected_agent, q_value, confidence, reason, override_used, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(logId, task_id, task_type, priority, selectedAgent, qMap[selectedAgent], confidence,
    `IER selected ${selectedAgent} for ${featureKey} (Q=${qMap[selectedAgent].toFixed(3)})`, 0, now);
  
  return c.json({
    task_id,
    agent_id: selectedAgent,
    q_value: qMap[selectedAgent],
    confidence,
    reason: `Contextual bandit selection for ${featureKey}`,
    epsilon_used: Math.random() < epsilon,
    alternative_agents: AGENTS.filter(a => a !== selectedAgent).slice(0, 3)
  });
});

// POST /api/orchestration/ier/learn — record outcome and update Q-table
app.post("/learn", async (c) => {
  const body = await c.req.json();
  const { task_id, agent_id, task_type, priority, success, quality_score, cost_usd } = body;
  
  const reward = success ? (quality_score || 0.8) * 1.0 : -0.5;
  const now = new Date().toISOString();
  
  // Update Q-table
  const featureKey = `${task_type}_${priority}`;
  const existing = db.query(
    "SELECT q_value, visit_count FROM ier_q_table WHERE agent_id = ? AND task_type = ? AND priority = ?"
  ).get(agent_id, task_type, priority) as any;
  
  let newQ = reward;
  let visitCount = 1;
  
  if (existing) {
    visitCount = existing.visit_count + 1;
    const alpha = 1.0 / visitCount; // Decaying learning rate
    newQ = existing.q_value + alpha * (reward - existing.q_value);
  }
  
  db.query(
    `INSERT OR REPLACE INTO ier_q_table (agent_id, task_type, priority, q_value, visit_count, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(agent_id, task_type, priority, newQ, visitCount, now);
  
  // Update routing log
  db.query(
    "UPDATE ier_routing_log SET outcome_feedback = ?, reward = ? WHERE task_id = ? AND selected_agent = ?"
  ).run(success ? "success" : "failure", reward, task_id, agent_id);
  
  return c.json({ agent_id, task_type, priority, new_q_value: newQ, visit_count: visitCount, reward });
});

// GET /api/orchestration/ier/q-table — inspect Q-table
app.get("/q-table", async (c) => {
  const rows = db.query("SELECT * FROM ier_q_table ORDER BY agent_id, task_type, priority").all() as any[];
  return c.json({ q_table: rows, agent_count: AGENTS.length });
});

// GET /api/orchestration/ier/logs — recent routing decisions
app.get("/logs", async (c) => {
  const limit = parseInt(c.req.query("limit") || "50");
  const rows = db.query(
    "SELECT * FROM ier_routing_log ORDER BY created_at DESC LIMIT ?"
  ).all(limit) as any[];
  
  return c.json({ logs: rows.map((r: any) => ({
    ...r,
    override_used: Boolean(r.override_used)
  })), count: rows.length });
});

export default app;
