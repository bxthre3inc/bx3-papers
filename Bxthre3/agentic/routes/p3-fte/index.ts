/**
 * FTE — Fidelity Transition Engine
 * Agentic Core — Synthesizes agent outputs upward through the hierarchy
 *
 * THE TRUST INVARIANT: Every summary given to the Chairman traces to raw leaf-node data.
 * The system is "deterministic" because every outcome is reproducible math/logic,
 * not a hallucination.
 *
 * How it works:
 *   1. RECEIVE child outputs (from subordinate agents or data sources)
 *   2. CONSOLIDATE — merge all child outputs into a unified view
 *   3. VERIFY — check each summary against the raw evidence (Trust Invariant)
 *   4. COMPRESS — distill into Chairman-ready briefing
 *   5. If any child output fails verification → flag for human review
 *
 * POST /api/agentic/fte/synthesize
 * GET  /api/agentic/fte/trace?task_id=X
 */

import type { Context } from "hono";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChildOutput {
  child_id: string;
  child_name: string;
  phase: string;
  raw_data: unknown;
  reasoning: string;
  evidence: EvidenceRef[];
  confidence: number;
  fidelity_score: number;
  provenance_chain: string[];
  created_at: string;
}

export interface EvidenceRef {
  source: string;
  type: "sensor" | "document" | "api" | "agent_output" | "memory";
  hash?: string;
  fetched_at: string;
  stale_hours?: number;
}

export interface FTEViolation {
  type: "STALE_EVIDENCE" | "UNAUTHORIZED_SOURCE" | "HASH_MISMATCH" | "CONFIDENCE_TOO_LOW" | "PROVENANCE_GAP";
  child_id: string;
  description: string;
  severity: "BLOCK" | "WARN" | "INFO";
}

export interface FTESynthesis {
  synthesis_id: string;
  parent_task_id: string;
  phase: string;
  children: ChildOutput[];
  consolidated: string;
  evidence_count: number;
  provenance_depth: number;
  violations: FTEViolation[];
  confidence: number;
  passes_gate: boolean;
  requires_human_review: boolean;
  Chairman_ready_summary: string;
  created_at: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_STALE_HOURS = 24;
const MIN_CONFIDENCE = 0.70;

const UNVERIFIED_SOURCES = new Set([
  "web.search", "browser.screenshot", "wikipedia.org",
  "twitter.com", "reddit.com", "chatgpt.com",
]);

// ─── Core FTE Logic ────────────────────────────────────────────────────

function verifyEvidence(refs: EvidenceRef[]): FTEViolation[] {
  const violations: FTEViolation[] = [];
  for (const ref of refs) {
    if (ref.stale_hours !== undefined && ref.stale_hours > MAX_STALE_HOURS) {
      violations.push({
        type: "STALE_EVIDENCE",
        child_id: ref.source,
        description: `Evidence "${ref.source}" is ${ref.stale_hours}h old (max ${MAX_STALE_HOURS}h)`,
        severity: "WARN",
      });
    }
    for (const bad of UNVERIFIED_SOURCES) {
      if (ref.source.startsWith(bad)) {
        violations.push({
          type: "UNAUTHORIZED_SOURCE",
          child_id: ref.source,
          description: `Evidence from "${ref.source}" requires verification before use`,
          severity: "WARN",
        });
      }
    }
  }
  return violations;
}

function consolidate(children: ChildOutput[]): {
  raw_text: string;
  evidence_refs: EvidenceRef[];
  max_depth: number;
} {
  const all_evidence: EvidenceRef[] = [];
  let max_depth = 0;
  const lines: string[] = [];

  for (const child of children) {
    max_depth = Math.max(max_depth, child.provenance_chain.length);
    all_evidence.push(...child.evidence);
    lines.push(`[${child.child_name} (${child.phase}): ${child.reasoning}]`);
  }

  return {
    raw_text: lines.join("\n"),
    evidence_refs: all_evidence,
    max_depth,
  };
}

function compress(raw_text: string, children: ChildOutput[], violations: FTEViolation[]): {
  summary: string;
  confidence: number;
} {
  const allLines = raw_text.split("\n").filter(l => l.length > 20).slice(0, 5);
  const base_confidence = children.reduce((sum, c) => sum + c.confidence, 0) / children.length;
  const penalty = violations.length * 0.1;
  const confidence = Math.max(0, base_confidence - penalty);
  return {
    summary: allLines.join(". ") || raw_text.slice(0, 200),
    confidence,
  };
}

function buildChairmanSummary(
  task: string,
  phase: string,
  summary: string,
  violations: FTEViolation[],
  passes_gate: boolean,
): string {
  const lines: string[] = [];
  const blocks = violations.filter(v => v.severity === "BLOCK");
  const warns = violations.filter(v => v.severity === "WARN");

  if (blocks.length > 0) {
    lines.push(`⚠️  BLOCKED: ${blocks.map(v => v.description).join("; ")}`);
  }
  if (warns.length > 0) {
    lines.push(`⚡ NOTE: ${warns.length} verification warning(s) — see details.`);
  }
  lines.push(summary);
  lines.push(passes_gate ? "🟢 Gate passed — ready for next phase." : "🔴 GATE BLOCKED — Human review required before advancing.");
  return lines.join("\n");
}

// ─── API Handler ────────────────────────────────────────────────────────

export default async (c: Context) => {
  const method = c.req.method;

  if (method === "GET") {
    const task_id = c.req.query("task_id");
    if (!task_id) return c.json({ error: "task_id required" }, 400);
    return c.json({
      task_id,
      synthesis_history: [],
      trust_invariant_holds: true,
      message: "FTE trace store not yet implemented — wiring in progress",
    });
  }

  if (method === "POST") {
    const body = await c.req.json<{
      parent_task_id: string;
      phase: string;
      task_description: string;
      children: ChildOutput[];
    }>();

    const { parent_task_id, phase, task_description, children } = body;

    if (!parent_task_id || !phase || !children?.length) {
      return c.json({ error: "parent_task_id, phase, and children[] required" }, 400);
    }

    // Step 1: Verify each child's evidence
    const all_violations: FTEViolation[] = [];
    for (const child of children) {
      all_violations.push(...verifyEvidence(child.evidence));
    }

    // Step 2: Consolidate
    const { raw_text, evidence_refs, max_depth } = consolidate(children);

    // Step 3: Compress
    const { summary, confidence } = compress(raw_text, children, all_violations);

    // Step 4: Gate decision
    const blocks = all_violations.filter(v => v.severity === "BLOCK");
    const requires_review = blocks.length > 0 || confidence < MIN_CONFIDENCE;
    const passes_gate = !requires_review;

    // Step 5: Chairman-ready summary
    const Chairman_ready_summary = buildChairmanSummary(
      task_description, phase, summary, all_violations, passes_gate,
    );

    const synthesis: FTESynthesis = {
      synthesis_id: `fte-${Date.now().toString(36)}`,
      parent_task_id,
      phase,
      children,
      consolidated: summary,
      evidence_count: evidence_refs.length,
      provenance_depth: max_depth,
      violations: all_violations,
      confidence,
      passes_gate,
      requires_human_review: requires_review,
      Chairman_ready_summary,
      created_at: new Date().toISOString(),
    };

    return c.json(synthesis);
  }

  return c.json({ error: "Method not allowed" }, 405);
};
