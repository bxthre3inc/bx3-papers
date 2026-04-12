/**
 * Agentic ↔ Zo Bridge Types
 */

export interface Skill {
  name: string;
  path: string;
  available: boolean;
}

export interface Automation {
  id: string;
  name: string;
  rrule: string;
  active: boolean;
  lastRun?: string;
  nextRun?: string;
}

export interface ToolCall {
  tool: string;
  args: Record<string, unknown>;
  callId: string;
}

export interface ToolResponse {
  callId: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

export type ToolHandler = (args: any) => Promise<any>;
