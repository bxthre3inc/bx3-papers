// SupermemoryAdapter — Agentic Memory Bridge
// Routes Agentic's reasoning, events, and agent outputs into Supermemory
// Supermemory acts as the RAG + long-term memory layer beneath Agentic's orchestration

const API_KEY = process.env.SUPERMEMORY_API_KEY || "";
const BASE_URL = "https://api.supermemory.ai/v3";
const CONTAINER_TAG = "bxthre3-agentic-v1";

interface MemDocument {
  id: string;
  status?: string;
  createdAt?: string;
}

interface MemSearchResult {
  results: Array<{
    title: string;
    score: number;
    type: string;
    createdAt: string;
    metadata?: Record<string, string>;
    chunks?: Array<{ content: string; isRelevant: boolean; score: number }>;
  }>;
  timing: number;
  total: number;
}

export class SupermemoryAdapter {
  private apiKey: string;
  private containerTag: string;

  constructor(apiKey?: string, containerTag: string = "bxthre3-agentic-v1") {
    this.apiKey = apiKey || API_KEY;
    this.containerTag = containerTag;
  }

  private async request<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    const opts: RequestInit = {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    };
    if (body) opts.method = "POST", opts.body = JSON.stringify(body);
    const r = await fetch(`${BASE_URL}${path}`, opts);
    if (!r.ok) throw new Error(`Supermemory ${path}: ${r.status} ${await r.text()}`);
    return r.json() as Promise<T>;
  }

  // ── INGEST ─────────────────────────────────────────────
  async addMemory(content: string, metadata?: Record<string, string>): Promise<MemDocument> {
    return this.request<MemDocument>("/documents", {
      content,
      containerTag: this.containerTag,
      metadata: metadata || {},
    });
  }

  async addEvent(eventType: string, data: Record<string, unknown>): Promise<MemDocument> {
    return this.addMemory(
      `[${eventType}] ${JSON.stringify(data)}`,
      { source: "agentic-event", eventType, ...data }
    );
  }

  async addAgentOutput(agentId: string, taskId: string, output: string, quality: number): Promise<MemDocument> {
    return this.addMemory(
      `[Agent:${agentId}] Task:${taskId} | Output: ${output} | Quality:${quality}`,
      { source: "agentic-agent", agentId, taskId, quality: String(quality) }
    );
  }

  async addDecision(agentId: string, reason: string, context: Record<string, unknown>): Promise<MemDocument> {
    return this.addMemory(
      `[Decision:${agentId}] ${reason} | Context: ${JSON.stringify(context)}`,
      { source: "agentic-decision", agentId }
    );
  }

  async addDapResult(vector: Record<string, number>, planes: number[], result: string): Promise<MemDocument> {
    return this.addMemory(
      `[DAP] Planes:${planes.join(",")} → ${result} | Vector:${JSON.stringify(vector)}`,
      { source: "agentic-dap", planes: planes.join(","), result }
    );
  }

  async addThompsonResult(agentId: string, reward: number, bernoulliMean: number): Promise<MemDocument> {
    return this.addMemory(
      `[ThompsonQ] Agent:${agentId} | reward:${reward} | mean:${bernoulliMean.toFixed(4)}`,
      { source: "agentic-thompson", agentId }
    );
  }

  async addTruthGateResult(passed: boolean, dataClass: string, reason: string): Promise<MemDocument> {
    return this.addMemory(
      `[TruthGate] ${passed ? "PASS" : "BLOCK"} | class:${dataClass} | ${reason}`,
      { source: "agentic-truth-gate", result: passed ? "pass" : "block" }
    );
  }

  // ── RECALL (Search) ─────────────────────────────────────
  async recall(query: string, limit: number = 10): Promise<MemSearchResult> {
    return this.request<MemSearchResult>("/search", {
      q: query,
      containerTag: this.containerTag,
      limit,
    });
  }

  async recallByAgent(agentId: string, limit: number = 20): Promise<MemSearchResult> {
    return this.request<MemSearchResult>("/search", {
      q: `agent:${agentId}`,
      containerTag: this.containerTag,
      limit,
    });
  }

  async recallByType(source: string, limit: number = 20): Promise<MemSearchResult> {
    return this.request<MemSearchResult>("/search", {
      q: `source:${source}`,
      containerTag: this.containerTag,
      limit,
    });
  }

  async getAgentHistory(agentId: string): Promise<string> {
    const r = await this.recallByAgent(agentId, 50);
    return r.results.map((res, i) =>
      `[${i+1}] ${res.title}\n${res.chunks?.map(c => c.content).join("\n") || ""}`
    ).join("\n---\n");
  }

  async getDapPattern(planeId: number): Promise<MemSearchResult> {
    return this.request<MemSearchResult>("/search", {
      q: `DAP plane:${planeId}`,
      containerTag: this.containerTag,
      limit: 20,
    });
  }

  async getThompsonStats(agentId: string): Promise<MemSearchResult> {
    return this.recallByType(`agentic-thompson:${agentId}`, 50);
  }

  // ── CONTEXT ENRICHMENT ─────────────────────────────────
  async buildAgentContext(agentId: string, currentTask: string): Promise<string> {
    const [agentHistory, thompsonStats] = await Promise.all([
      this.getAgentHistory(agentId),
      this.getThompsonStats(agentId),
    ]);
    return `Agent ${agentId} | Current task: ${currentTask}\nRecent history:\n${agentHistory}\nThompson Q stats:\n${JSON.stringify(thompsonStats)}`;
  }

  async checkForSimilarOutcome(situation: string): Promise<string | null> {
    const r = await this.recall(situation, 5);
    if (r.results.length > 0 && r.results[0].score > 0.75) {
      return r.results[0].chunks?.[0]?.content || null;
    }
    return null;
  }
}

export const supermemory = new SupermemoryAdapter();

export default supermemory;
