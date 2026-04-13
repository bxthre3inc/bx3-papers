// P1: Workqueue — list, poll, claim, update work items
import type { Context } from "hono";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const STORE_DIR = "/dev/shm/agentic";
const WORKQUEUE_PATH = join(STORE_DIR, "workqueue.json");

function ensureStore() {
  if (!existsSync(STORE_DIR)) mkdirSync(STORE_DIR, { recursive: true });
}
function loadWorkqueue() {
  ensureStore();
  try { return JSON.parse(readFileSync(WORKQUEUE_PATH, "utf-8")); }
  catch { return { items: [], last_updated: new Date().toISOString() }; }
}
function saveWorkqueue(q: { items: any[]; last_updated: string }) {
  mkdirSync(STORE_DIR, { recursive: true });
  writeFileSync(WORKQUEUE_PATH, JSON.stringify(q, null, 2));
}

export default async (c: Context) => {
  const method = c.req.method;

  if (method === "GET") {
    const q = loadWorkqueue();
    const { status, priority, agent_id } = c.req.query();
    let items = q.items;
    if (status) items = items.filter((i: any) => i.status === status);
    if (priority) items = items.filter((i: any) => i.priority === priority);
    if (agent_id) items = items.filter((i: any) => i.assigned_agent === agent_id);
    const P: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    items = items.sort((a: any, b: any) => (P[a.priority] ?? 4) - (P[b.priority] ?? 4));
    return c.json({
      count: items.length,
      queue_depth: items.filter((i: any) => i.status === "PENDING").length,
      items,
    });
  }

  if (method === "POST") {
    // Agent polls for next task
    const agent_id: string = c.req.query("agent_id");
    if (!agent_id) return c.json({ error: "agent_id query param required" }, 400);
    const q = loadWorkqueue();
    const P: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
    const pending = q.items.filter((i: any) => i.status === "PENDING")
      .sort((a: any, b: any) => (P[a.priority] ?? 4) - (P[b.priority] ?? 4));
    if (!pending.length) return c.json({ item_id: null, status: "empty" });
    const next = pending[0];
    next.status = "ASSIGNED";
    next.assigned_agent = agent_id;
    next.updated_at = new Date().toISOString();
    q.last_updated = new Date().toISOString();
    saveWorkqueue(q);
    return c.json({ item_id: next.item_id, task_type: next.task_type, task: next.task, priority: next.priority, assigned_agent: agent_id });
  }

  return c.json({ error: "Method not allowed" }, 405);
};
