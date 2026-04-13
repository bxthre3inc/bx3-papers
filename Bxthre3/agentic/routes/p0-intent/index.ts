// P0: Chairman Intent Ingress
// Route: POST /api/agentic/intent
// Ingests Chairman intent from any source (email, Notion, API, chat)
// and creates WorkItems for the workqueue

import type { Context } from "hono";
import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const STORE_DIR = "/dev/shm/agentic";
const WORKQUEUE_PATH = join(STORE_DIR, "workqueue.json");

function ensureStore() {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
}

function loadWorkqueue(): { items: any[]; last_updated: string } {
  ensureStore();
  try {
    const { readFileSync } = require("fs");
    return JSON.parse(readFileSync(WORKQUEUE_PATH, "utf-8"));
  } catch {
    return { items: [], last_updated: new Date().toISOString() };
  }
}

function saveWorkqueue(q: { items: any[]; last_updated: string }) {
  ensureStore();
  const { writeFileSync, mkdirSync } = require("fs");
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(WORKQUEUE_PATH, JSON.stringify(q, null, 2));
}

function decomposeIntent(intent: string): { task_type: string; task: string }[] {
  // Naive keyword decomposition — swap in LLM call for production
  const tasks: { task_type: string; task: string }[] = [];
  const intent_lower = intent.toLowerCase();

  // Finance keywords
  if (/finance|budget|roi|cost|expense|p&l|revenue/.test(intent_lower)) {
    tasks.push({ task_type: "finance", task });
  }
  // Research keywords
  if (/research|find|search|discover|analyze|evaluate/.test(intent_lower)) {
    tasks.push({ task_type: "research", task });
  }
  // Grant keywords
  if (/grant|sbir|proposal|application|funding/.test(intent_lower)) {
    tasks.push({ task_type: "grant", task });
  }
  // Code keywords
  if (/code|implement|build|develop|deploy|fix|bug/.test(intent_lower)) {
    tasks.push({ task_type: "code", task });
  }
  // Default — generate
  if (tasks.length === 0) {
    tasks.push({ task_type: "general", task: intent });
  }
  return tasks;
}

export async function handleIntent(c: Context) {
  const body = await c.req.json();
  const { intent, source = "api", correlation_id, context = {}, priority = "P2" } = body;

  if (!intent || typeof intent !== "string" || intent.trim().length === 0) {
    return c.json({ error: "intent is required and must be non-empty" }, 400);
  }

  const intent_id = `intent-${randomUUID().hex.slice(0, 12)}`;
  const now = new Date().toISOString();
  const items: any[] = [];

  const raw_tasks = decomposeIntent(intent);
  for (const { task_type, task } of raw_tasks) {
    items.push({
      item_id: `wi-${randomUUID().hex.slice(0, 12)}`,
      intent_id,
      task_type,
      task,
      assigned_agent: null,
      status: "PENDING",
      routing_decision_id: null,
      workflow: task_type, // default to task_type as workflow
      priority,
      created_at: now,
      updated_at: now,
    });
  }

  // Persist intent header
  const intent_record = {
    intent_id,
    intent: intent.trim(),
    source,
    correlation_id: correlation_id || randomUUID().hex.slice(0, 12),
    context,
    priority,
    created_at: now,
    task_count: items.length,
    status: "DISPATCHED",
  };

  // Append work items to workqueue
  const q = loadWorkqueue();
  q.items.push(...items);
  q.last_updated = now;
  saveWorkqueue(q);

  return c.json({
    intent_id,
    status: "accepted",
    task_count: items.length,
    items: items.map(i => ({ item_id: i.item_id, task_type: i.task_type, status: i.status, priority })),
  }, 201);
}

// GET: fetch intent status and its work items
export async function getIntentStatus(c: Context) {
  const intent_id = c.req.param("intent_id");
  const q = loadWorkqueue();
  const items = q.items.filter((i: any) => i.intent_id === intent_id);
  if (!items.length) return c.json({ error: "intent not found" }, 404);
  return c.json({ intent_id, items });
}
