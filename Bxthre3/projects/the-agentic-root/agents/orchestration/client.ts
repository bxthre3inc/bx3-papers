/**
 * Agentic Orchestration Client
 * Wires existing agents into the new orchestration layer
 *
 * Usage:
 *   import { OrchestrationClient } from './orchestration/client';
 *   const orch = new OrchestrationClient('http://localhost:54491');
 *   await orch.reasoning().append({ task_id, agent_id, phase, reasoning, evidence });
 *   await orch.phases().transition(task_id, 'EXECUTE');
 *   await orch.ier().route(agent_id, task_type);
 */