// /api/agentic/triggers/register — Register Trigger Handlers
// /api/agentic/triggers/list — List Active Triggers
// /api/agentic/dap/evaluate — 9-Plane DAP Evaluation

import type { Context } from "hono";

interface TriggerHandler {
  id: string;
  event_type: string;
  planes: number[];
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  parallelism: "sequential" | "parallel" | "race";
  created_at: number;
  active: boolean;
}

interface TriggerCondition {
  plane: number;
  field: string;
  op: "<" | ">" | "==" | "!=" | "<=" | ">=";
  value: number | string;
}

interface TriggerAction {
  type: "emit" | "notify" | "cache" | "worksheet" | "dap";
  params: Record<string, unknown>;
}

// Default trigger registry (in-memory)
const triggerStore: TriggerHandler[] = [
  // Tier 1: Moisture threshold → PMT aggregation
  {
    id: "trigger-moisture-low-v1",
    event_type: "sfd.moisture.reading",
    planes: [1, 5],
    conditions: [
      { plane: 1, field: "moisture", op: "<", value: 0.20 },
      { plane: 5, field: "z_negative", op: ">", value: -50 }
    ],
    actions: [
      { type: "emit", params: { event: "pmt.worksheet.request" } },
      { type: "cache", params: { key: "dry_field_alert", ttl: 3600 } }
    ],
    parallelism: "parallel",
    created_at: Date.now(),
    active: true
  },
  
  // Tier 2: PMT aggregation complete → DHU Kriging
  {
    id: "trigger-pmt-aggregate-v1",
    event_type: "pmt.aggregate.complete",
    planes: [3, 4],
    conditions: [
      { plane: 3, field: "spatial_coverage", op: ">=", value: 0.8 },
      { plane: 4, field: "confidence", op: ">", value: 0.7 }
    ],
    actions: [
      { type: "emit", params: { event: "dhu.kriging.request" } },
      { type: "dap", params: { planes: [3, 4, 5] } }
    ],
    parallelism: "sequential",
    created_at: Date.now(),
    active: true
  },
  
  // Tier 3: Kriging complete → FTE evaluation
  {
    id: "trigger-kriging-ftev1",
    event_type: "dhu.kriging.complete",
    planes: [7, 8],
    conditions: [
      { plane: 7, field: "economic_value", op: ">", value: 100 },
      { plane: 8, field: "fidelity", op: ">", value: 0.9 }
    ],
    actions: [
      { type: "emit", params: { event: "rss.fte.triggered" } },
      { type: "notify", params: { agent: "vas-data-arbitrage", priority: "P2" } }
    ],
    parallelism: "parallel",
    created_at: Date.now(),
    active: true
  }
];

// 9-Plane DAP Evaluation
interface DAPInput {
  vector: {
    moisture?: number;
    time_since_irrigation?: number;
    percolation_rate?: number;
    spatial_coverage?: number;
    confidence?: number;
    economic_value?: number;
    fidelity?: number;
    [key: string]: number | undefined;
  };
  planes: number[];
}

interface DAPResult {
  plane_results: Record<number, {
    triggered: boolean;
    reason: string;
    value: number;
  }>;
  all_match: boolean;
  final_state: "proceed" | "supervise" | "reject";
  recommended_actions: string[];
}

function evaluateDAP(input: DAPInput): DAPResult {
  const results: DAPResult["plane_results"] = {};
  
  for (const plane of input.planes) {
    switch (plane) {
      case 1: // Boolean Plane
        const moisture = input.vector.moisture || 0;
        results[plane] = {
          triggered: moisture < 0.20,
          reason: moisture < 0.20 ? "Moisture below 20% threshold" : "Moisture adequate",
          value: moisture
        };
        break;
        
      case 2: // Temporal Plane
        const time = input.vector.time_since_irrigation || 0;
        results[plane] = {
          triggered: time > 24,
          reason: time > 24 ? ">24h since irrigation" : "Recent irrigation",
          value: time
        };
        break;
        
      case 3: // Spatial Plane
        const coverage = input.vector.spatial_coverage || 0;
        results[plane] = {
          triggered: coverage >= 0.8,
          reason: coverage >= 0.8 ? "Adequate spatial coverage" : "Insufficient coverage",
          value: coverage
        };
        break;
        
      case 4: // Geostatistical
        const conf = input.vector.confidence || 0;
        results[plane] = {
          triggered: conf > 0.7,
          reason: conf > 0.7 ? "High confidence" : "Low confidence",
          value: conf
        };
        break;
        
      case 5: // Hydraulic
        const perc = input.vector.percolation_rate || 0;
        results[plane] = {
          triggered: perc > 0.5,
          reason: perc > 0.5 ? "Percolation active" : "Percolation slow",
          value: perc
        };
        break;
        
      case 6: // Atmospheric
        results[plane] = {
          triggered: true,
          reason: "Atmospheric conditions within bounds",
          value: 1
        };
        break;
        
      case 7: // Economic
        const econ = input.vector.economic_value || 0;
        results[plane] = {
          triggered: econ > 0,
          reason: econ > 0 ? "Positive ROI" : "Check cost-benefit",
          value: econ
        };
        break;
        
      case 8: // Fidelity
        const fid = input.vector.fidelity || 0;
        results[plane] = {
          triggered: fid > 0.5,
          reason: fid > 0.9 ? "Ground truth quality" : fid > 0.5 ? "Acceptable" : "Low fidelity",
          value: fid
        };
        break;
        
      case 9: // Strategic
        results[plane] = {
          triggered: true,
          reason: "Requires human supervision",
          value: 0
        };
        break;
    }
  }
  
  // Determine final state
  const deterministicPlanes = input.planes.filter(p => p <= 6);
  const uncertainPlanes = input.planes.filter(p => p >= 7);
  
  const allDetMatch = deterministicPlanes.every(p => results[p]?.triggered);
  const anyUncertain = uncertainPlanes.some(p => !results[p]?.triggered);
  
  let finalState: DAPResult["final_state"] = "proceed";
  if (!allDetMatch) finalState = "reject";
  else if (anyUncertain) finalState = "supervise";
  
  return {
    plane_results: results,
    all_match: allDetMatch,
    final_state: finalState,
    recommended_actions: generateRecommendations(results, finalState)
  };
}

function generateRecommendations(results: DAPResult["plane_results"], state: string): string[] {
  const actions: string[] = [];
  
  if (state === "reject") {
    actions.push("HOLD: Deterministic planes not satisfied");
    if (!results[1]?.triggered) actions.push("ALERT: Moisture threshold not met");
    if (!results[5]?.triggered) actions.push("ALERT: Hydraulic conditions insufficient");
  } else if (state === "supervise") {
    actions.push("PROCEED WITH SUPERVISION: Economic/strategic review required");
    if (!results[7]?.triggered) actions.push("REVIEW: Economic value unclear");
    if (results[8]?.value && results[8].value < 0.9) actions.push("FTE: Satellite calibration opportunity");
  } else {
    actions.push("EXECUTE: All deterministic planes satisfied");
    actions.push("EMIT: pmt.worksheet.issued");
  }
  
  return actions;
}

// API Route Handlers

// POST /api/agentic/triggers/register
export async function registerTrigger(c: Context) {
  try {
    const body = await c.req.json();
    
    const trigger: TriggerHandler = {
      id: `trigger-${body.event_type}-${Date.now()}`,
      event_type: body.event_type,
      planes: body.planes || [],
      conditions: body.conditions || [],
      actions: body.actions || [],
      parallelism: body.parallelism || "parallel",
      created_at: Date.now(),
      active: true
    };
    
    triggerStore.push(trigger);
    
    return c.json({
      trigger_id: trigger.id,
      event_type: trigger.event_type,
      planes: trigger.planes,
      active: trigger.active,
      registered_at: new Date(trigger.created_at).toISOString()
    }, 201);
    
  } catch (err) {
    return c.json({ error: "Invalid trigger format", details: (err as Error).message }, 400);
  }
}

// GET /api/agentic/triggers/list
export function listTriggers(c: Context) {
  const eventType = c.req.query("event_type");
  const plane = c.req.query("plane");
  
  let triggers = triggerStore.filter(t => t.active);
  
  if (eventType) {
    triggers = triggers.filter(t => t.event_type === eventType);
  }
  
  if (plane) {
    const planeNum = parseInt(plane);
    triggers = triggers.filter(t => t.planes.includes(planeNum));
  }
  
  return c.json({
    count: triggers.length,
    triggers: triggers.map(t => ({
      id: t.id,
      event_type: t.event_type,
      planes: t.planes,
      condition_count: t.conditions.length,
      action_count: t.actions.length,
      parallelism: t.parallelism
    }))
  });
}

// POST /api/agentic/dap/evaluate
export async function evaluateDAPRoute(c: Context) {
  try {
    const body: DAPInput = await c.req.json();
    
    if (!body.vector || !body.planes || !Array.isArray(body.planes)) {
      return c.json({ error: "vector and planes[] required" }, 400);
    }
    
    const result = evaluateDAP(body);
    
    return c.json({
      evaluation_id: `dap-${Date.now()}`,
      planes_evaluated: body.planes,
      ...result
    });
    
  } catch (err) {
    return c.json({ error: "DAP evaluation failed", details: (err as Error).message }, 500);
  }
}

// Default export
export default {
  register: registerTrigger,
  list: listTriggers,
  evaluate: evaluateDAPRoute
};
