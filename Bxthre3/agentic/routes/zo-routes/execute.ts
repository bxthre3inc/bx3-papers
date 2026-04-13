// P3: Execute — run inference via Zo API, log result, update workqueue
import type { Context } from "hono";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STORE_DIR = "/dev/shm/agentic";
const EXECUTION_LOG = join(STORE_DIR, "execution_log.json");
const WORKQUEUE_PATH = join(STORE_DIR, "workqueue.json");

function ensureStore() { if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true }); }
function loadExecLog(): any[] {
  ensureStore();
  try { return JSON.parse(readFileSync(EXECUTION_LOG, "utf-8")); }
  catch { return []; }
}
function saveExecLog(log: any[]) {
  mkdirSync(STORE_DIR, { recursive: true });
  if (log.length > 1000) log.splice(0, log.length - 1000);
  writeFileSync(EXECUTION_LOG, JSON.stringify(log, null, 2));
}
function loadWorkqueue() {
  if (!existsSync(STORE_DIR)) return { items: [] };
  try { return JSON.parse(readFileSync(WORKQUEUE_PATH, "utf-8")); }
  catch { return { items: [] }; }
}
function saveWorkqueue(q: any) {
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(WORKQUEUE_PATH, JSON.stringify(q, null, 2));
}
function updateWQStatus(item_id: string, status: string) {
  try {
    const q = loadWorkqueue();
    const idx = q.items.findIndex((i: any) => i.item_id === item_id);
    if (idx !== -1) { q.items[idx].status = status; q.items[idx].updated_at = new Date().toISOString(); saveWorkqueue(q); }
  } catch {}
}

export default async (c: Context) => {
  const body = await c.req.json();
  const { item_id, agent_id, prompt, system_prompt, model = "vercel:minimax/minimax-m2.7", max_tokens = 2048, temperature = 0 } = body;

  if (!item_id || !agent_id || !prompt) return c.json({ error: "item_id, agent_id, and prompt required" }, 400);

  const result_id = "res-" + randomUUID().slice(0, 12);
  const now = new Date().toISOString();
  const start = Date.now();
  let raw_response = "";
  let status: "SUCCESS" | "FAILURE" | "TIMEOUT" = "SUCCESS";
  let error_msg: string | null = null;

  try {
    const token = process.env.ZO_CLIENT_IDENTITY_TOKEN;
    if (!token) throw new Error("ZO_CLIENT_IDENTITY_TOKEN not set");
    const res = await fetch("https://api.zo.computer/zo/ask", {
      method: "POST",
      headers: { "Authorization": token, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ input: prompt, model_name: model, ...(system_prompt ? { system: system_prompt } : {}), ...(temperature ? { temperature } : {}), ...(max_tokens !== 2048 ? { max_tokens } : {}) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    raw_response = data.output || "";
  } catch (e: any) {
    status = e.message.includes("TIMEOUT") ? "TIMEOUT" : "FAILURE";
    error_msg = e.message;
  }

  const duration_ms = Date.now() - start;
  const record = { result_id, item_id, agent_id, raw_response, parsed: raw_response, confidence: status === "SUCCESS" ? 0.95 : 0, status, duration_ms, error: error_msg, created_at: now };

  const log = loadExecLog();
  log.push(record);
  saveExecLog(log);
  updateWQStatus(item_id, status === "SUCCESS" ? "DONE" : "FAILED");

  return c.json(record, status === "FAILURE" ? 500 : 200);
};
