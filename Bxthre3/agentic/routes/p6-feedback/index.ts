// P6: IER Feedback Loop — closes the bandit learning loop
// Called after an agent completes a task successfully or unsuccessfully

import type { Context } from "hono";

export async function recordFeedback(c: Context) {
  const { decision_id, outcome_label, evidence = [] } = await c.req.json();

  if (!decision_id || !outcome_label) {
    return c.json({ error: "decision_id and outcome_label required" }, 400);
  }

  const valid_labels = ["success", "failure", "partial"];
  if (!valid_labels.includes(outcome_label.toLowerCase())) {
    return c.json({ error: `outcome_label must be one of: ${valid_labels.join(", ")}` }, 400);
  }

  try {
    const rewardMap: Record<string, number> = { success: 1.0, partial: 0.3, failure: -0.8 };
    const reward = rewardMap[outcome_label.toLowerCase()] ?? 0.0;

    // Update IER SQLite directly
    const db = require("better-sqlite3");
    const ierDb = db("/home/workspace/Bxthre3/agentic/store/ier_router.db");

    // Get the routing decision
    const decision = ierDb
      .prepare("SELECT task_type, chosen_workflow FROM routing_log WHERE decision_id = ?")
      .get(decision_id);

    if (!decision) {
      ierDb.close();
      return c.json({ error: `Unknown decision_id: ${decision_id}` }, 404);
    }

    const { task_type, chosen_workflow } = decision as { task_type: string; chosen_workflow: string };

    // Incremental reward update
    const stats = ierDb
      .prepare("SELECT total_reward, visit_count, avg_reward FROM workflow_stats WHERE workflow_id = ? AND task_type = ?")
      .get(chosen_workflow, task_type) as { total_reward: number; visit_count: number; avg_reward: number } | undefined;

    if (stats) {
      const alpha = 0.2;
      const new_avg = (1 - alpha) * stats.avg_reward + alpha * reward;
      ierDb
        .prepare("UPDATE workflow_stats SET total_reward = ?, avg_reward = ?, last_updated = ? WHERE workflow_id = ? AND task_type = ?")
        .run(stats.total_reward + reward, new_avg, new Date().toISOString(), chosen_workflow, task_type);
    }

    // Log feedback
    ierDb
      .prepare(`INSERT INTO feedback_log (feedback_id, decision_id, outcome_reward, outcome_label, evidence, created_at)
                 VALUES (?, ?, ?, ?, ?, ?)`)
      .run(
        `fb-${Date.now().toString(36)}`,
        decision_id,
        reward,
        outcome_label,
        JSON.stringify(evidence),
        new Date().toISOString()
      );

    ierDb.close();

    return c.json({
      feedback_id: decision_id,
      outcome_label,
      reward,
      status: "recorded",
    });
  } catch (e: any) {
    return c.json({ error: `Feedback loop error: ${e.message}` }, 500);
  }
}

// GET /api/agentic/feedback/stats — feedback summary
export async function getFeedbackStats(c: Context) {
  try {
    const db = require("better-sqlite3");
    const ierDb = db("/home/workspace/Bxthre3/agentic/store/ier_router.db");
    const rows = ierDb
      .prepare(`SELECT outcome_label, COUNT(*) as count, AVG(outcome_reward) as avg_reward FROM feedback_log GROUP BY outcome_label`)
      .all();
    ierDb.close();
    return c.json({ outcomes: rows });
  } catch (e: any) {
    return c.json({ error: e.message });
  }
}
