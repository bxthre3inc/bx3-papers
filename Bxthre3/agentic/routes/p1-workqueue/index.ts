// P1: Workqueue — read tasks, poll next available, claim a task
import type { Context } from "hono";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STORE_DIR = "/dev/shm/agentic";
const WORKQUEUE_PATH = join(STORE_DIR, "workqueue.json");

function ensureStore() {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
}

function loadWorkqueue(): { items: any[]; last_updated: string } {
  ensureStore();
  try {
    return JSON.parse(readFileSync(WORKQUEUE_PATH, "utf-8"));
  } catch {
    return { items: [], last_updated: new Date().toISOString() };
  }
}

function saveWorkqueue(q: { items: any[]; last_updated: string }) {
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(WORKQUEUE_PATH, JSON.stringify(q, null, 2));
}

// GET /api/agentic/workqueue — list all items
export async function listWorkqueue(c: Context) {
  const q = loadWorkqueue();
  const { status, priority, agent_id } = c.req.query();

  let items = q.items;
  if (status) items = items.filter((i: any) => i.status === status);
  if (priority) items = items.filter((i: any) => i.priority === priority);
  if (agent_id) items = items.filter((i: any) => i.assigned_agent === agent_id);

  return c.json({
    count: items.length,
    queue_depth: items.filter((i: any) => i.status === "PENDING").length,
    items: items.sort((a: any, b: any) => {
      const P = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return (P[a.priority] ?? 4) - (P[b.priority] ?? 4);
    }),
  });
}

// GET /api/agentic/workqueue/next — agent polls for next available task
export async function pollNext(c: Context) {
  const agent_id = c.req.query("agent_id");
  if (!agent_id) return c.json({ error: "agent_id required" }, 400);

  const q = loadWorkqueue();
  const pending = q.items
    .filter((i: any) => i.status === "PENDING")
    .sort((a: any, b: any) => {
      const P: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return (P[a.priority] ?? 4) - (P[b.priority] ?? 4);
    });

  if (!pending.length) {
    return c.json({ item_id: null, status: "empty", message: "No pending tasks" });
  }

  const next = pending[0];
  const now = new Date().toISOString();
  next.status = "ASSIGNED";
  next.assigned_agent = agent_id;
  next.updated_at = now;
  q.last_updated = now;
  saveWorkqueue(q);

  return c.json({ item_id: next.item_id, task_type: next.task_type, task: next.task, priority: next.priority, assigned_agent: agent_id });
}

// PATCH /api/agentic/workqueue/:item_id — update status
export async function updateWorkItem(c: Context) {
  const item_id = c.req.param("item_id");
  const body = await c.req.json();
  const q = loadWorkqueue();
  const idx = q.items.findIndex((i: any) => i.item_id === item_id);

  if (idx === -1) return c.json({ error: "item not found" }, 404);

  const allowed = ["status", "assigned_agent", "routing_decision_id", "workflow"];
  for (const key of allowed) {
    if (key in body) (q.items[idx] as any)[key] = body[key];
  }
  q.items[idx].updated_at = new Date().toISOString();
  q.last_updated = new Date().toISOString();
  saveWorkqueue(q);

  return c.json({ item_id, updated: q.items[idx] });
}

// GET /api/agentic/workqueue/:item_id — get single item
export async function getWorkItem(c: Context) {
  const item_id = c.req.param("item_id");
  const q = loadWorkqueue();
  const item = q.items.find((i: any) => i.item_id === item_id);
  if (!item) return c.json({ error: "item not found" }, 404);
  return c.json(item);
}
