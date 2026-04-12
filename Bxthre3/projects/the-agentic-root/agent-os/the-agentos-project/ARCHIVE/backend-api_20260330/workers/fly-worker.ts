#!/usr/bin/env bun
/** Fly.io Worker */  
import { Hono } from "hono";
const app = new Hono();
const CONTROL_PLANE = process.env.CONTROL_PLANE || "https://brodiblanco.zo.space/api/mesh";
const MESH_SECRET = process.env.MESH_SECRET;
const NODE_ID = process.env.FLY_ALLOC_ID || "fly-" + Math.random().toString(36).substr(2, 8);
const REGION = process.env.FLY_REGION || "iad";
const PORT = parseInt(process.env.PORT || "8080");
let registered = false;

async function register() {
  const res = await fetch(`${CONTROL_PLANE}/register`, {
    method: "POST",
    headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: NODE_ID, endpoint: `https://${process.env.FLY_APP_NAME}.fly.dev`, region: REGION, provider: "fly", capabilities: ["compute", "edge"], maxTasks: 5 })
  });
  if (res.ok) { registered = true; console.log("[Fly] Registered:", NODE_ID); }
}

async function heartbeat() {
  if (!registered) return register();
  await fetch(`${CONTROL_PLANE}/heartbeat`, {
    method: "POST",
    headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: NODE_ID })
  });
}

async function pollAndExecute() {
  const res = await fetch(`${CONTROL_PLANE}/poll`, {
    method: "POST",
    headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: NODE_ID })
  });
  const data = await res.json();
  if (data.task) {
    console.log("[Fly] Executing:", data.task.taskId);
    await fetch(`${CONTROL_PLANE}/complete`, {
      method: "POST",
      headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: data.task.taskId, result: { executed: true, timestamp: Date.now() } })
    });
  }
}

setInterval(heartbeat, 10000);
setInterval(pollAndExecute, 5000);
register();

app.get("/health", () => new Response("OK"));
Bun.serve({ port: PORT, fetch: app.fetch });
console.log(`[Fly] Worker on port ${PORT}`);
