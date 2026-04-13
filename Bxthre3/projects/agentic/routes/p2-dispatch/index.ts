// P2: IER Dispatch Router — routes work items to workflows using UCB1 bandits
// Reuses the existing ier_router.py logic via child_process

import type { Context } from "hono";
import { randomUUID } from "crypto";

const AVAILABLE_WORKFLOWS = ["finance", "research", "grant", "code", "general"];

function ucb1(avgReward: number, visitCount: number, totalVisits: number, c = 1.414): number {
  if (visitCount === 0) return Infinity;
  return avgReward + c * Math.sqrt(Math.log(totalVisits) / visitCount);
}

export async function dispatchTask(c: Context) {
  const { item_id, task_type, context = {} } = await c.req.json();

  if (!item_id || !task_type) {
    return c.json({ error: "item_id and task_type required" }, 400);
  }

  // Load IER stats from SQLite (if exists)
  let workflowScores: { workflow: string; avg_reward: number; visit_count: number }[] = [];
  try {
    const db = require("better-sqlite3");
    const ierDb = db("/home/workspace/Bxthre3/agentic/store/ier_router.db");
    const rows = ierDb
      .prepare(`SELECT workflow_id, avg_reward, visit_count FROM workflow_stats WHERE task_type = ? AND workflow_id IN (${AVAILABLE_WORKFLOWS.map(() => "?").join(",")})`)
      .all(task_type, ...AVAILABLE_WORKFLOWS) as any[];
    workflowScores = rows.map((r: any) => ({
      workflow: r.workflow_id,
      avg_reward: r.avg_reward,
      visit_count: r.visit_count,
    }));
    ierDb.close();
  } catch {
    // No prior data — all workflows start at 0 visits
    workflowScores = AVAILABLE_WORKFLOWS.map(w => ({ workflow: w, avg_reward: 0, visit_count: 0 }));
  }

  // UCB1 scoring
  const totalVisits = workflowScores.reduce((sum, w) => sum + w.visit_count, 0);
  const scored = workflowScores.map(w => ({
    ...w,
    ucb1: ucb1(w.avg_reward, w.visit_count, Math.max(totalVisits, 1)),
  }));

  // EXPLOIT: pick highest UCB
  scored.sort((a, b) => b.ucb1 - a.ucb1);
  const chosen = scored[0];

  const EPSILON = 0.15;
  const mode = Math.random() < EPSILON ? "EXPLORE" : "EXPLOIT";
  const decision_id = `ier-${randomUUID().hex.slice(0, 12)}`;

  return c.json({
    decision_id,
    item_id,
    task_type,
    chosen_workflow: chosen.workflow,
    mode,
    confidence: Math.min(Math.abs(chosen.avg_reward) * Math.sqrt(Math.max(chosen.visit_count, 1)), 1),
    rationale: chosen.visit_count === 0
      ? `[UNCONFIGURED] No prior data for '${chosen.workflow}' on '${task_type}' — defaulting to UCB1-initiated exploration`
      : `avg_reward=${chosen.avg_reward.toFixed(3)} over ${chosen.visit_count} visits (ucb1=${chosen.ucb1.toFixed(3)})`,
    evidence: scored.map(s => `workflow=${s.workflow} ucb1=${s.ucb1.toFixed(3)}`),
    exploration_bonus: (chosen.ucb1 - chosen.avg_reward).toFixed(4),
    reward_if_known: chosen.avg_reward,
    epsilon: EPSILON,
    all_candidates: scored,
    created_at: new Date().toISOString(),
  });
}

// GET /api/agentic/dispatch/stats — router audit
export async function getRouterStats(c: Context) {
  try {
    const db = require("better-sqlite3");
    const ierDb = db("/home/workspace/Bxthre3/agentic/store/ier_router.db");
    const rows = ierDb.prepare("SELECT * FROM workflow_stats ORDER BY avg_reward DESC").all();
    ierDb.close();
    return c.json({ workflows: rows });
  } catch (e: any) {
    return c.json({ error: e.message });
  }
}
