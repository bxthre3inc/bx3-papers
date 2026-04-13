// Agentic v1 — Shared types for all routes
// All route modules import from here

export interface IntentPayload {
  intent: string;           // natural language goal from Chairman
  source: "email" | "notion" | "api" | "chat";
  correlation_id?: string;
  context?: Record<string, unknown>;
  priority?: "P0" | "P1" | "P2" | "P3";
}

export interface WorkItem {
  item_id: string;
  intent_id: string;
  task_type: string;
  task: string;
  assigned_agent: string | null;
  status: "PENDING" | "ASSIGNED" | "RUNNING" | "DONE" | "FAILED";
  routing_decision_id: string | null;
  workflow: string;
  priority: "P0" | "P1" | "P2" | "P3";
  created_at: string;
  updated_at: string;
}

export interface RoutingDecision {
  decision_id: string;
  task_type: string;
  context_hash: string;
  chosen_workflow: string;
  mode: "EXPLOIT" | "EXPLORE";
  confidence: number;
  rationale: string;
  evidence: string[];
  exploration_bonus: number;
  reward_if_known: number;
  epsilon: number;
  created_at: string;
}

export interface ExecutionResult {
  result_id: string;
  item_id: string;
  agent_id: string;
  raw_response: string;
  parsed: unknown;
  confidence: number;
  status: "SUCCESS" | "FAILURE" | "TIMEOUT";
  duration_ms: number;
  created_at: string;
}

export interface FTEChildOutput {
  child_id: string;
  child_name: string;
  phase: string;
  reasoning: string;
  evidence: string[];
  confidence: number;
  data: unknown;
  fidelity_score: number;
  provenance_chain: string[];
}

export interface APSEMetrics {
  timestamp: string;
  queue_depth: number;
  active_tasks: number;
  completed_tasks_1h: number;
  failed_tasks_1h: number;
  avg_confidence: number;
  avg_duration_ms: number;
  error_rate: number;
  router_stats: Record<string, { visit_count: number; avg_reward: number }>;
}
