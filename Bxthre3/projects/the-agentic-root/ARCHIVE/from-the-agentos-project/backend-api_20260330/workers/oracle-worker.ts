#!/usr/bin/env bun
/** Oracle Cloud Always Free Worker */
const CONTROL_PLANE = process.env.CONTROL_PLANE || "https://brodiblanco.zo.space/api/mesh";
const MESH_SECRET = process.env.MESH_SECRET;
const NODE_ID = process.env.NODE_ID || "oracle-" + Math.random().toString(36).substr(2, 8);
const REGION = process.env.REGION || "us-ashburn-1";
let registered = false;

async function register() {
  const res = await fetch(`${CONTROL_PLANE}/register`, {
    method: "POST",
    headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
    body: JSON.stringify({ nodeId: NODE_ID, endpoint: "direct", region: REGION, provider: "oracle-free", capabilities: ["compute", "storage"], maxTasks: 10 })
  });
  if (res.ok) { registered = true; console.log("[Oracle] Registered:", NODE_ID); }
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
    console.log("[Oracle] Executing:", data.task.taskId, "type:", data.task.type);
    // Heavy compute execution
    const start = Date.now();
    if (data.task.type === "compute.intensive") {
      // Simulate heavy work
      for (let i = 0; i < 1e6; i++) Math.sqrt(i);
    }
    await fetch(`${CONTROL_PLANE}/complete`, {
      method: "POST",
      headers: { "X-Mesh-Token": MESH_SECRET, "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: data.task.taskId, result: { executed: true, duration: Date.now() - start, provider: "oracle-free" } })
    });
  }
}

setInterval(heartbeat, 10000);
setInterval(pollAndExecute, 5000);
console.log("[Oracle] Starting worker...");
register();
