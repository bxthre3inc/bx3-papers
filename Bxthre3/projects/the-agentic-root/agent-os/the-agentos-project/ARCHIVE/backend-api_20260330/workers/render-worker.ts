#!/usr/bin/env bun
/** Render.com Worker */
import { Hono } from "hono";
const app = new Hono();
const CONTROL_PLANE = process.env.CONTROL_PLANE || "https://brodiblanco.zo.space/api/mesh";
const MESH_SECRET = process.env.MESH_SECRET;
const NODE_ID = process.env.NODE_ID || "render-" + Math.random().toString(36).substr(2, 8);
const REGION = process.env.REGION || "us-east";
const PORT = parseInt(process.env.PORT || "3000");
let registered = false;

async function register() {
  const res = await fetch(`${CONTROL_PLANE}/register`, {
    method: "POST",
    headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: NODE_ID, endpoint: `https://${process.env.RENDER_EXTERNAL_HOSTNAME || "localhost"}:${PORT}`, region: REGION, provider: "render", capabilities: ["compute"], maxTasks: 3 })
  });
  if (res.ok) { registered = true; console.log("[Render] Registered:", NODE_ID); }
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
    console.log("[Render] Executing:", data.task.taskId);
    const result = { executed: true, timestamp: Date.now() };
    await fetch(`${CONTROL_PLANE}/complete`, {
      method: "POST",
      headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: data.task.taskId, result })
    });
  }
}

setInterval(heartbeat, 10000);
setInterval(pollAndExecute, 5000);
register();

app.get("/health", () => new Response("OK"));
Bun.serve({ port: PORT, fetch: app.fetch });
console.log(`[Render] Worker on port ${PORT}`);
