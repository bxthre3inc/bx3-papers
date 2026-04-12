#!/usr/bin/env bun
import { Hono } from "hono";
import { cors } from "hono/cors";

const PORT = parseInt(process.env.PORT || "9999");
const MESH_SECRET = process.env.MESH_SECRET || "dev-secret";

// State
const agents = new Map();
const inbox = new Map();
const nodes = new Map();
const tasks = new Map();
const taskQueue = [];

// Embedded worker ID
const WORKER_ID = "zo-embedded-" + Math.random().toString(36).substr(2, 9);
let isWorkerRegistered = false;

console.log("[Agentic] Unified backend starting...");

// Schedulers
setInterval(() => {
  const now = Date.now();
  for (const [id, node] of nodes) {
    if (now - node.lastSeen > 60000) node.healthy = false;
  }
}, 30000);

setInterval(() => {
  if (taskQueue.length === 0) return;
  const healthy = Array.from(nodes.values()).filter(n => n.healthy && n.tasksRunning < n.maxTasks);
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
    
    console.log(`[Scheduler] ${taskId} -> ${node.nodeId}`);
    if (node.nodeId === WORKER_ID) executeTask(task);
  }
}, 3000);

setInterval(() => {
  if (!isWorkerRegistered) {
    nodes.set(WORKER_ID, {
      nodeId: WORKER_ID, endpoint: `http://localhost:${PORT}`,
      region: "us-central", provider: "zo-embedded",
      healthy: true, lastSeen: Date.now(),
      tasksRunning: 0, tasksCompleted: 0,
      capabilities: ["compute", "agent", "mcp"], maxTasks: 5
    });
    isWorkerRegistered = true;
    console.log(`[Worker] Registered: ${WORKER_ID}`);
  } else {
    const node = nodes.get(WORKER_ID);
    if (node) { node.lastSeen = Date.now(); node.healthy = true; }
  }
}, 10000);

async function executeTask(task) {
  console.log(`[Worker] Executing: ${task.taskId} (${task.type})`);
  const start = Date.now();
  
  try {
    let result;
    switch (task.type) {
      case "agent.create":
        const agent = { id: crypto.randomUUID(), name: task.payload.name || "unnamed",
          status: "idle", lastPing: Date.now(), tasksCompleted: 0 };
        agents.set(agent.id, agent);
        result = { agentId: agent.id, created: true };
        break;
      case "agent.execute":
        const a = agents.get(task.payload.agentId);
        if (!a) throw new Error("Agent not found");
        a.status = "running";
        await new Promise(r => setTimeout(r, 100));
        a.status = "idle"; a.tasksCompleted++;
        result = { executed: true };
        break;
      case "inbox.process":
        const item = { id: crypto.randomUUID(), from: task.payload.from || "system",
          subject: task.payload.subject || "", body: task.payload.body || "",
          priority: task.payload.priority || "P3", status: "unread", timestamp: Date.now() };
        inbox.set(item.id, item);
        result = { itemId: item.id };
        break;
      default:
        await new Promise(r => setTimeout(r, 50));
        result = { executed: true, type: task.type };
    }
    
    task.result = result;
    task.status = "completed";
    task.completedAt = Date.now();
    
    const node = nodes.get(WORKER_ID);
    if (node) { node.tasksRunning--; node.tasksCompleted++; }
    
    console.log(`[Worker] Completed: ${task.taskId} (${Date.now() - start}ms)`);
  } catch (err) {
    task.status = "failed";
    task.result = { error: String(err) };
    const node = nodes.get(WORKER_ID);
    if (node) node.tasksRunning--;
    console.error(`[Worker] Failed: ${task.taskId}`, err);
  }
}

const app = new Hono();
app.use("*", cors());

const auth = async (c, next) => {
  const token = c.req.header("X-Mesh-Token");
  if (token !== MESH_SECRET) return c.json({ error: "Unauthorized" }, 401);
  await next();
};

// Health & Status
app.get("/health", (c) => new Response("OK"));
app.get("/status", (c) => {
  const now = Date.now();
  const nodeList = Array.from(nodes.values());
  return c.json({
    status: "active", timestamp: new Date().toISOString(),
    mesh: { totalNodes: nodes.size, healthyNodes: nodeList.filter(n => n.healthy).length,
      totalTasks: tasks.size, pendingTasks: taskQueue.length,
      runningTasks: nodeList.reduce((s, n) => s + n.tasksRunning, 0),
      completedTasks: nodeList.reduce((s, n) => s + n.tasksCompleted, 0) },
    agents: agents.size, inbox: inbox.size
  });
});

// Agentic Core
app.get("/agents", (c) => c.json({ agents: Array.from(agents.values()) }));
app.get("/inbox", (c) => c.json({ items: Array.from(inbox.values()).sort((a, b) => b.timestamp - a.timestamp) }));

// Mesh: Register/Heartbeat
app.post("/mesh/register", auth, async (c) => {
  const body = await c.req.json();
  nodes.set(body.nodeId, {
    nodeId: body.nodeId, endpoint: body.endpoint,
    region: body.region || "unknown", provider: body.provider || "unknown",
    healthy: true, lastSeen: Date.now(), tasksRunning: 0, tasksCompleted: 0,
    capabilities: body.capabilities || [], maxTasks: body.maxTasks || 3
  });
  return c.json({ success: true, nodesInMesh: nodes.size });
});

app.post("/mesh/heartbeat", auth, async (c) => {
  const body = await c.req.json();
  const node = nodes.get(body.nodeId);
  if (!node) return c.json({ error: "Not found" }, 404);
  node.lastSeen = Date.now(); node.healthy = true;
  return c.json({ ok: true });
});

// Tasks: Submit/Poll/Complete
app.post("/tasks/submit", auth, async (c) => {
  const body = await c.req.json();
  const taskId = crypto.randomUUID();
  tasks.set(taskId, { taskId, type: body.type || "generic", payload: body.payload || {},
    status: "queued", createdAt: Date.now() });
  taskQueue.push(taskId);
  return c.json({ queued: true, taskId, position: taskQueue.length });
});

app.post("/tasks/poll", auth, async (c) => {
  const body = await c.req.json();
  const available = Array.from(tasks.values())
    .filter(t => t.assignedTo === body.nodeId && t.status === "running");
  return c.json({ tasks: available });
});

app.post("/tasks/complete", auth, async (c) => {
  const body = await c.req.json();
  const task = tasks.get(body.taskId);
  if (!task) return c.json({ error: "Not found" }, 404);
  task.status = "completed";
  task.result = body.result;
  task.completedAt = Date.now();
  const node = nodes.get(task.assignedTo);
  if (node) { node.tasksRunning--; node.tasksCompleted++; }
  return c.json({ ok: true });
});

const server = Bun.serve({
  port: PORT,
  fetch: app.fetch
});

console.log(`[Agentic] Unified backend running on :${PORT}`);
console.log(`[Agentic] Endpoints:`);
console.log(`  GET  /status        - Mesh + Agentic status`);
console.log(`  GET  /agents        - List agents`);
console.log(`  GET  /inbox         - List inbox`);
console.log(`  POST /mesh/register - Register node`);
console.log(`  POST /tasks/submit  - Submit task`);
console.log(`[Agentic] Worker ID: ${WORKER_ID}`);
