#!/usr/bin/env bun
import { Hono } from "hono";
import { cors } from "hono/cors";

const PORT = parseInt(process.env.PORT || "9999");
const MESH_SECRET = process.env.PASSWORD || process.env.MESH_SECRET || "dev-secret";

// State
const agents = new Map();
const inbox = new Map();
const nodes = new Map();
const tasks = new Map();
const taskQueue = [];

// Schedulers
setInterval(() => {
  for (const [id, node] of nodes) {
    if (Date.now() - node.lastSeen > 60000) node.healthy = false;
  }
}, 30000);

setInterval(() => {
  if (taskQueue.length === 0) return;
  const healthy = Array.from(nodes.values()).filter(n => n.healthy);
  if (healthy.length === 0) return;
  
  for (let i = 0; i < taskQueue.length && i < healthy.length; i++) {
    const taskId = taskQueue.shift();
    const task = tasks.get(taskId);
    if (!task) continue;
    const node = healthy[i % healthy.length];
    task.status = "running";
    task.assignedTo = node.nodeId;
    task.startedAt = Date.now();
    node.tasksRunning++;
    if (node.nodeId === "zo-embedded") executeTask(task);
  }
}, 3000);

async function executeTask(task) {
  try {
    task.result = { executed: true, timestamp: Date.now() };
    task.status = "completed";
    task.completedAt = Date.now();
    const node = nodes.get(task.assignedTo);
    if (node) { node.tasksRunning--; node.tasksCompleted++; }
  } catch (e) {
    task.status = "failed";
    task.result = { error: String(e) };
  }
}

// API
const app = new Hono();
app.use("*", cors());

const auth = async (c, next) => {
  if (c.req.header("X-Mesh-Token") !== MESH_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};

// Health & Status
app.get("/health", () => new Response("OK"));
app.get("/status", (c) => c.json({
  status: "active", timestamp: Date.now(),
  mesh: {
    totalNodes: nodes.size,
    healthyNodes: Array.from(nodes.values()).filter(n => n.healthy).length,
    totalTasks: tasks.size, pending: taskQueue.length,
    running: Array.from(tasks.values()).filter(t => t.status === "running").length,
    completed: Array.from(tasks.values()).filter(t => t.status === "completed").length
  },
  agents: agents.size, inbox: inbox.size,
  nodes: Array.from(nodes.values())
}));

// Agents
app.post("/agents/create", async (c) => {
  const body = await c.req.json();
  const agent = { id: crypto.randomUUID(), name: body.name, status: "idle", createdAt: Date.now() };
  agents.set(agent.id, agent);
  return c.json({ agent });
});
app.get("/agents", (c) => c.json({ agents: Array.from(agents.values()) }));

// Inbox
app.post("/inbox/submit", async (c) => {
  const body = await c.req.json();
  const item = { id: crypto.randomUUID(), ...body, status: "unread", timestamp: Date.now() };
  inbox.set(item.id, item);
  return c.json({ item });
});
app.get("/inbox", (c) => c.json({ items: Array.from(inbox.values()).sort((a, b) => b.timestamp - a.timestamp) }));

// MCP Mesh
app.post("/mesh/register", auth, async (c) => {
  const body = await c.req.json();
  nodes.set(body.nodeId, { 
    ...body, 
    healthy: true, 
    lastSeen: Date.now(), 
    tasksRunning: 0, 
    tasksCompleted: 0,
    failures: 0 
  });
  return c.json({ success: true, nodesInMesh: nodes.size });
});

app.post("/mesh/heartbeat", auth, async (c) => {
  const body = await c.req.json();
  const node = nodes.get(body.nodeId);
  if (node) { node.lastSeen = Date.now(); node.healthy = true; }
  return c.json({ ok: true });
});

// Tasks
app.post("/tasks/submit", auth, async (c) => {
  const body = await c.req.json();
  const task = { taskId: crypto.randomUUID(), ...body, status: "queued", createdAt: Date.now() };
  tasks.set(task.taskId, task);
  taskQueue.push(task.taskId);
  return c.json({ queued: true, taskId: task.taskId, position: taskQueue.length });
});

app.post("/tasks/poll", auth, async (c) => {
  const body = await c.req.json();
  const assigned = Array.from(tasks.values()).find(t => t.assignedTo === body.nodeId && t.status === "running");
  if (assigned) return c.json({ task: assigned });
  return c.json({ queueLength: taskQueue.length });
});

app.post("/tasks/complete", auth, async (c) => {
  const body = await c.req.json();
  const task = tasks.get(body.taskId);
  if (!task) return c.json({ error: "Not found" }, 404);
  task.status = "completed";
  task.result = body.result;
  task.completedAt = Date.now();
  const node = nodes.get(body.nodeId);
  if (node) { node.tasksRunning--; node.tasksCompleted++; }
  return c.json({ ok: true });
});

// Task Failure & Reroute
app.post("/mesh/task-failed", auth, async (c) => {
  const body = await c.req.json();
  const { taskId, nodeId, shouldReroute } = body;
  
  const task = tasks.get(taskId);
  if (!task) return c.json({ error: "Task not found" }, 404);
  
  // Mark original node task as failed
  const failedNode = nodes.get(nodeId);
  if (failedNode) {
    failedNode.tasksRunning--;
    failedNode.failures = (failedNode.failures || 0) + 1;
    if (failedNode.failures >= 5) failedNode.healthy = false;
  }
  
  if (!shouldReroute) {
    task.status = "failed";
    task.failedAt = Date.now();
    return c.json({ rerouted: false, status: "failed" });
  }
  
  // Find backup node (different provider, healthy, available capacity)
  const backups = Array.from(nodes.values())
    .filter(n => n.nodeId !== nodeId && n.healthy && n.tasksRunning < (n.maxTasks || 3));
  
  if (backups.length === 0) {
    // Queue for Android (PRIMARY) to handle when next online
    task.queuedFor = "android-primary";
    task.status = "reroute-pending";
    return c.json({ rerouted: false, queued: true, pendingFor: "android" });
  }
  
  // Select backup by lowest load
  const backup = backups.sort((a, b) => a.tasksRunning - b.tasksRunning)[0];
  
  // Reassign task
  task.assignedTo = backup.nodeId;
  task.reroutedFrom = nodeId;
  task.rerouteCount = (task.rerouteCount || 0) + 1;
  task.status = "running";
  task.reroutedAt = Date.now();
  backup.tasksRunning++;
  
  // Dispatch to backup
  try {
    await fetch(`${backup.endpoint}/task`, {
      method: "POST",
      headers: { "X-Root-Signature": MESH_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: task.taskId,
        type: task.type || "compute",
        payload: task.payload,
        rerouted: true,
        originalNode: nodeId
      })
    });
  } catch (e) {
    // If dispatch fails, queue for retry
    taskQueue.push(taskId);
    task.status = "queued";
  }
  
  return c.json({ 
    rerouted: true, 
    toNode: backup.nodeId, 
    fromNode: nodeId,
    rerouteCount: task.rerouteCount 
  });
});

// Threshold Signature Combination
app.post("/crypto/combine-threshold", auth, async (c) => {
  const body = await c.req.json();
  const { partials, taskId } = body;
  
  // Validate: need exactly 2 partials for 2-of-3 threshold
  if (partials.length !== 2) {
    return c.json({ error: "Need exactly 2 partial signatures" }, 400);
  }
  
  // Shard 2 comes from Zo Secrets (PASSWORD)
  const zoShard = process.env.PASSWORD;
  if (!zoShard) {
    return c.json({ error: "Zo shard unavailable" }, 500);
  }
  
  // Combine partials using XOR (simplified SSS recombination)
  // Real impl: use sss-wasm or similar
  const combined = combineSss(partials, zoShard);
  
  return c.json({ 
    combined: true, 
    publicKey: await derivePubKey(combined),
    taskId 
  });
});

// SSS helpers (pseudo)
function combineSss(partials: string[], zoShard: string): string {
  // In production: @siliconlabs/sss or similar
  return partials.reduce((acc, p) => {
    // XOR combined with Zo shard contribution
    return Buffer.from(p).map((b, i) => 
      b ^ Buffer.from(zoShard.slice(0, p.length))[i]
    ).toString('hex');
  }, '');
}

function derivePubKey(combined: string): string {
  return crypto.createHash('sha256').update(combined).digest('hex').slice(0, 32);
}

app.get("/dashboard", (c) => c.html(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Agentic MCP Mesh</title>
  <style>
    body { font-family: system-ui; background: #0a0a0a; color: #fff; margin: 0; padding: 2rem; }
    h1 { font-weight: 300; letter-spacing: -0.02em; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .card { background: #111; border: 1px solid #222; border-radius: 8px; padding: 1.5rem; }
    .stat { font-size: 2rem; font-weight: 200; color: #00ff88; }
    .label { color: #666; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .node { background: #111; border-left: 3px solid #00ff88; padding: 1rem; margin: 0.5rem 0; }
    .node.unhealthy { border-left-color: #ff4444; }
    pre { background: #111; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.75rem; }
    a { color: #00ff88; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Agentic MCP Mesh</h1>
  <p>Status: <span id="status"></span> | <a href="${c.req.url}/status">View JSON API</a></p>
  
  <div class="grid">
    <div class="card"><div class="stat" id="nodes">0</div><div class="label">Nodes</div></div>
    <div class="card"><div class="stat" id="tasks">0</div><div class="label">Tasks</div></div>
    <div class="card"><div class="stat" id="agents">0</div><div class="label">Agents</div></div>
  </div>
  
  <h2>Nodes</h2>
  <div id="nodeList"></div>
  
  <script>
    async function load() {
      const data = await fetch(\"/status\").then(r => r.json());
      document.getElementById(\"status\").textContent = data.status;
      document.getElementById(\"nodes\").textContent = data.mesh.totalNodes;
      document.getElementById(\"tasks\").textContent = data.mesh.totalTasks;
      document.getElementById(\"agents\").textContent = data.agents;
      
      let nodesHtml = \"\";
      for (const n of data.nodes || []) {
        nodesHtml += \`<div class=\"node \${n.healthy ? "" : "unhealthy"}\">\${n.nodeId} (\${n.provider}) — \${n.healthy ? "healthy" : "unhealthy"}</div>\`;
      }
      document.getElementById(\"nodeList\").innerHTML = nodesHtml || "No nodes connected";
    }
    load();
    setInterval(load, 5000);
  </script>
</body>
</html>`));

console.log("[Agentic] Starting unified backend...");
Bun.serve({ port: PORT, fetch: app.fetch });
console.log(`[Agentic] Running on port ${PORT}`);
