#!/usr/bin/env bun
import { Hono } from "hono";
import { cors } from "hono/cors";
import crypto from "node:crypto";

// Configuration
const NODE_ID = process.env.NODE_ID || "render-" + crypto.randomUUID().slice(0, 8);
const CONTROL_PLANE = process.env.CONTROL_PLANE || "https://brodiblanco.zocomputer.io/api/agentic";
const MESH_SECRET = process.env.PASSWORD || process.env.MESH_SECRET || "dev-secret";
const REGION = process.env.REGION || "us-east";
const PORT = parseInt(process.env.PORT || "3000");
const IS_THRESHOLD_MODE = process.env.THRESHOLD_MODE === "true";

// Render holds Shard 3 in threshold mode
const RENDER_SHARD = process.env.RENDER_SHARD || crypto.randomBytes(32).toString('hex');

let registered = false;
const metrics = { tasksRunning: 0, tasksCompleted: 0, tasksFailed: 0, healthChecks: 0 };

const app = new Hono();
app.use("*", cors());

// Health endpoint
app.get("/health", () => c.json({
  nodeId: NODE_ID, healthy: true, metrics, uptime: process.uptime(),
  mode: IS_THRESHOLD_MODE ? "threshold-shard" : "compute-only",
  region: REGION, provider: "render"
}));

// Task execution
app.post("/task", async (c) => {
  const task = await c.req.json();
  const taskId = task.taskId || crypto.randomUUID();
  const isReroute = task.rerouted === true;
  
  console.log(`[Render ${NODE_ID}] ${isReroute ? 'REROUTED' : 'NEW'} task: ${taskId}`);
  metrics.tasksRunning++;
  
  // Execute with retry logic
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      // Simulate work
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
      
      // Simulate occasional failure for testing reroute
      if (!isReroute && Math.random() < 0.1) throw new Error("Simulated processing error");
      
      metrics.tasksRunning--;
      metrics.tasksCompleted++;
      
      return c.json({ 
        success: true, 
        taskId, 
        nodeId: NODE_ID,
        provider: "render",
        result: { processed: true },
        rerouted: isReroute
      });
      
    } catch (e) {
      attempts++;
      console.log(`[Render ${NODE_ID}] Task ${taskId} attempt ${attempts} failed: ${e.message}`);
      
      if (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 1000 * attempts)); // Exponential backoff
      }
    }
  }
  
  // All retries failed
  metrics.tasksRunning--;
  metrics.tasksFailed++;
  
  // Report failure to control plane for rerouting
  await fetch(`${CONTROL_PLANE}/mesh/task-failed`, {
    method: "POST",
    headers: { 
      "X-Mesh-Token": MESH_SECRET, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      taskId, 
      nodeId: NODE_ID,
      shouldReroute: true 
    })
  }).catch(err => console.log(`[Render ${NODE_ID}] Failed to report failure: ${err.message}`));
  
  return c.json({ 
    success: false, 
    taskId, 
    error: "Max retries exceeded",
    rerouteRequested: true 
  }, 500);
});

// Threshold signature contribution (Shard 3)
app.post("/crypto/contribute-shard", async (c) => {
  const { taskId, partials = [] } = await c.req.json();
  
  // Render contributes its shard (Shard 3)
  if (partials.length === 1) {
    // We have Android shard, combine with Render shard
    const combined = combineShards(partials[0], RENDER_SHARD);
    
    // Send to Zo for final combination with Zo shard
    const res = await fetch(`${CONTROL_PLANE}/crypto/final-combine`, {
      method: "POST",
      headers: { 
        "X-Mesh-Token": MESH_SECRET, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        taskId, 
        partials: [combined]  // Android+Render combined
      })
    });
    
    return res.ok 
      ? c.json({ partialSent: true, taskId })
      : c.json({ error: "Final combine failed" }, 500);
  }
  
  return c.json({ error: "Expected 1 partial (Android)" }, 400);
});

// Shard combination helper
function combineShards(shardA: string, shardB: string): string {
  const bufA = Buffer.from(shardA, 'hex');
  const bufB = Buffer.from(shardB, 'hex');
  const result = Buffer.alloc(bufA.length);
  
  for (let i = 0; i < bufA.length; i++) {
    result[i] = bufA[i] ^ bufB[i]; // XOR combination
  }
  
  return result.toString('hex');
}

// Control plane registration
async function register() {
  const res = await fetch(`${CONTROL_PLANE}/mesh/register`, {
    method: "POST",
    headers: { 
      "X-Mesh-Token": MESH_SECRET, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      nodeId: NODE_ID, 
      endpoint: `https://${process.env.RENDER_EXTERNAL_HOSTNAME || "localhost"}:${PORT}`,
      region: REGION, 
      provider: "render",
      capabilities: ["compute", IS_THRESHOLD_MODE ? "threshold" : ""].filter(Boolean),
      maxTasks: IS_THRESHOLD_MODE ? 2 : 4,
      hasThresholdShard: IS_THRESHOLD_MODE
    })
  });
  
  if (res.ok) { 
    registered = true; 
    console.log(`[Render ${NODE_ID}] Registered with control plane`);
  } else {
    console.log(`[Render ${NODE_ID}] Registration failed: ${res.status}`);
  }
}

// Heartbeat to control plane
async function heartbeat() {
  if (!registered) return register();
  
  await fetch(`${CONTROL_PLANE}/mesh/heartbeat`, {
    method: "POST",
    headers: { 
      "X-Mesh-Token": MESH_SECRET, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ nodeId: NODE_ID, ...metrics })
  }).catch(err => console.log(`[Render ${NODE_ID}] Heartbeat failed: ${err.message}`));
  
  metrics.healthChecks++;
}

// Start
console.log(`[Render ${NODE_ID}] Starting...`);
console.log(`[Render ${NODE_ID}] Mode: ${IS_THRESHOLD_MODE ? 'threshold-shard' : 'compute-only'}`);
console.log(`[Render ${NODE_ID}] Control plane: ${CONTROL_PLANE}`);

register().then(() => {
  setInterval(heartbeat, 10000); // Every 10 seconds
  Bun.serve({ fetch: app.fetch, port: PORT });
  console.log(`[Render ${NODE_ID}] Listening on port ${PORT}`);
});
