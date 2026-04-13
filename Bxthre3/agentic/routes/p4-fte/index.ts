// P4: FTE Synthesis — merge child outputs into Chairman-verified response
import type { Context } from "hono";
import { synthesizeFTE, type FTEChildOutput, type FTEOutput } from "../../engine/fte";

export async function synthesize(c: Context) {
  const { parent_id, children, strategy = "weighted_fidelity" } = await c.req.json();

  if (!parent_id || !Array.isArray(children) || children.length === 0) {
    return c.json({ error: "parent_id and children[] are required" }, 400);
  }

  // Validate child structure
  for (const child of children) {
    if (!child.child_id || !child.child_name || !child.reasoning) {
      return c.json({ error: "Each child must have child_id, child_name, and reasoning" }, 400);
    }
  }

  const result: FTEOutput = synthesizeFTE(
    parent_id,
    children as FTEChildOutput[],
    strategy as FTEOutput["merge_strategy"]
  );

  return c.json(result);
}

// GET /api/agentic/fte/health — FTE health check
export async function fteHealth(c: Context) {
  return c.json({
    status: "ok",
    engine: "FTE v1.0",
    merge_strategies: ["weighted_fidelity", "voting", "earliest_confident", "cascade_sequential"],
    trust_invariant: {
      provenance: "every summary traces to raw leaf-node data",
      auditability: "human can replay any node's logic",
      deterministic: "every outcome is a reproducible math/logic chain",
    },
  });
}
