// P6: IER Feedback Loop — record outcome and update bandit Q-table
import type { Context } from "hono";

const REWARD_MAP: Record<string, number> = { success: 1.0, partial: 0.3, failure: -0.8 };

export default async (c: Context) => {
  const { decision_id, outcome_label, evidence = [] } = await c.req.json();
  if (!decision_id || !outcome_label) return c.json({ error: "decision_id and outcome_label required" }, 400);
  const reward = REWARD_MAP[outcome_label.toLowerCase()];
  if (reward === undefined) return c.json({ error: "outcome_label must be success|partial|failure" }, 400);

  try {
    const Database = require("better-sqlite3");
    const ierDb = new Database("/home/workspace/Bxthre3/agentic/store/ier_router.db");

    const decision = ierDb.prepare("SELECT task_type, chosen_workflow FROM routing_log WHERE decision_id=?").get(decision_id) as { task_type: string; chosen_workflow: string } | undefined;
    if (!decision) { ierDb.close(); return c.json({ error: `Unknown decision_id: ${decision_id}` }, 404); }

    const stats = ierDb.prepare("SELECT total_reward, visit_count, avg_reward FROM workflow_stats WHERE workflow_id=? AND task_type=?").get(decision.chosen_workflow, decision.task_type) as { total_reward: number; visit_count: number; avg_reward: number } | undefined;

    if (stats) {
      const alpha = 0.2;
      const new_avg = (1 - alpha) * stats.avg_reward + alpha * reward;
      ierDb.prepare("UPDATE workflow_stats SET total_reward=?, avg_reward=?, last_updated=? WHERE workflow_id=? AND task_type=?").run(stats.total_reward + reward, new_avg, new Date().toISOString(), decision.chosen_workflow, decision.task_type);
    }

    ierDb.prepare("INSERT INTO feedback_log (feedback_id, decision_id, outcome_reward, outcome_label, evidence, created_at) VALUES (?,?,?,?,?,?)").run(
      `fb-${Date.now().toString(36)}`, decision_id, reward, outcome_label, JSON.stringify(evidence), new Date().toISOString()
    );
    ierDb.close();

    return c.json({ feedback_id: decision_id, outcome_label, reward, status: "recorded" });
  } catch (e: any) { return c.json({ error: `Feedback loop error: ${e.message}` }, 500); }
};
