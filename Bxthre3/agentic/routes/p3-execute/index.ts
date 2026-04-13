// P3: Execute — runs inference via Zo API and records outcome
import type { Context } from "hono";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STORE_DIR = "/dev/shm/agentic";
const EXECUTION_LOG = join(STORE_DIR, "execution_log.json");

function ensureStore() {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
}

function loadExecLog(): any[] {
  ensureStore();
  try {
    return JSON.parse(readFileSync(EXECUTION_LOG, "utf-8"));
  } catch {
    return [];
  }
}

function saveExecLog(log: any[]) {
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(EXECUTION_LOG, JSON.stringify(log, null, 2));
}

// POST /api/agentic/execute — execute a work item via Zo API inference
export async function executeTask(c: Context) {
  const { item_id, agent_id, prompt, system_prompt, model = "vercel:minimax/minimax-m2.7", max_tokens = 2048, temperature = 0 } = await c.req.json();

  if (!item_id || !agent_id || !prompt) {
    return c.json({ error: "item_id, agent_id, and prompt are required" }, 400);
  }

  const result_id = `res-${randomUUID().hex.slice(0, 12)}`;
  const now = new Date().toISOString();
  const start = Date.now();

  // Call Zo API
  let raw_response = "";
  let status: "SUCCESS" | "FAILURE" | "TIMEOUT" = "SUCCESS";
  let error_msg: string | null = null;

  try {
    const token = process.env.ZO_CLIENT_IDENTITY_TOKEN;
    if (!token) throw new Error("ZO_CLIENT_IDENTITY_TOKEN not set");

    const body = JSON.stringify({
      input: prompt,
      model_name: model,
      ...(system_prompt ? { system: system_prompt } : {}),
      ...(temperature !== 0 ? { temperature } : {}),
      ...(max_tokens !== 2048 ? { max_tokens } : {}),
    });

    const res = await fetch("https://api.zo.computer/zo/ask", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body,
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`HTTP ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    raw_response = data.output || "";
  } catch (e: any) {
    status = e.message.includes("TIMEOUT") ? "TIMEOUT" : "FAILURE";
    error_msg = e.message;
    raw_response = "";
  }

  const duration_ms = Date.now() - start;

  const record = {
    result_id,
    item_id,
    agent_id,
    raw_response,
    parsed: raw_response, // downstream parses
    confidence: status === "SUCCESS" ? 0.95 : 0.0,
    status,
    duration_ms,
    error: error_msg,
    created_at: now,
  };

  // Persist execution log
  const log = loadExecLog();
  log.push(record);
  // Keep last 1000 entries
  if (log.length > 1000) log.splice(0, log.length - 1000);
  saveExecLog(log);

  // Update workqueue item status
  updateWorkqueueStatus(item_id, status === "SUCCESS" ? "DONE" : "FAILED");

  return c.json(record, status === "FAILURE" ? 500 : 200);
}

function updateWorkqueueStatus(item_id: string, status: string) {
  try {
    const WORKQUEUE_PATH = join(STORE_DIR, "workqueue.json");
    const q = JSON.parse(readFileSync(WORKQUEUE_PATH, "utf-8"));
    const idx = q.items.findIndex((i: any) => i.item_id === item_id);
    if (idx !== -1) {
      q.items[idx].status = status;
      q.items[idx].updated_at = new Date().toISOString();
      writeFileSync(WORKQUEUE_PATH, JSON.stringify(q, null, 2));
    }
  } catch {
    // best-effort
  }
}

// GET /api/agentic/execute/log — fetch recent execution log
export async function getExecutionLog(c: Context) {
  const limit = parseInt(c.req.query("limit") || "50");
  const log = loadExecLog();
  return c.json({ count: log.length, entries: log.slice(-limit).reverse() });
}
