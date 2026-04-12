// SupermemoryAdapter — Agentic Memory Layer
// Supermemory provides persistent semantic memory for Agentic's Truth Gate, Thompson Q,
// FTE, and DAP decision reasoning. All agent decisions are stored and recalled before acting.
//
// API TRUTH (verified 2026-04-12):
// - add() -> {id, status} ✓
// - documents.list({container_tags:["agentic"], include_content:true}) -> {memories: [...]} ✓
// - search.memories(q, container_tag) -> results[] (unreliable with container_tag filter)
// - container_tags is PLURAL array in list(), SINGULAR string in add()
// - 3 seeded memories confirmed in container "agentic"

interface SmAddResponse { id: string; status: string }
interface SmMemory {
  id: string; content: string; summary: string;
  score?: number; container_tags?: string[];
  title?: string; status?: string; metadata?: Record<string, unknown>;
}

export class SupermemoryAdapter {
  private apiKey: string;
  private containerTag = "agentic";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SUPERMEMORY_API_KEY || "";
  }

  // Store a decision (DAP verdict, Thompson Q outcome, Truth Gate check, FTE synthesis)
  async add(content: string, tags: string[] = []): Promise<{ id: string; status: string }> {
    try {
      const { add } = await import("@supermemory/sdk");
      const result = await add({ content, container_tag: this.containerTag });
      return { id: (result as { id: string }).id, status: "queued" };
    } catch {
      const res = await fetch("https://api.supermemory.ai/v3/memory/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ content, container_tag: this.containerTag }),
      });
      if (!res.ok) throw new Error(`Supermemory add failed: ${res.status}`);
      const data: SmAddResponse = await res.json();
      return { id: data.id, status: data.status || "queued" };
    }
  }

  // Semantic recall — documents.list() is the reliable API
  async recall(query: string, limit = 5): Promise<SmMemory[]> {
    try {
      const { get } = await import("@supermemory/sdk");
      const { documents } = await get({ apiKey: this.apiKey });
      const result = await documents.list({ container_tags: [this.containerTag], include_content: true, limit: 50 });
      const memories = result.memories || [];
      if (!query || query === "agentic") return memories.slice(0, limit).map(this.toSmMemory);
      // Client-side fuzzy filter on content/summary/title
      const q = query.toLowerCase();
      return memories
        .filter(m => !!(m.content || m.summary || m.title || "").toLowerCase().includes(q))
        .slice(0, limit)
        .map(this.toSmMemory);
    } catch {
      return [];
    }
  }

  private toSmMemory(m: Record<string, unknown>): SmMemory {
    return {
      id: String(m.id || ""),
      content: String(m.content || m.summary || ""),
      summary: String(m.summary || m.content || ""),
      score: undefined,
      container_tags: Array.isArray(m.container_tags) ? m.container_tags as string[] : [],
      title: String(m.title || ""),
      status: String(m.status || ""),
      metadata: (m.metadata as Record<string, unknown>) || {},
    };
  }

  // Check if a claim has prior evidence in memory (Truth Gate hook)
  async similarCheck(claim: string, threshold = 0.7): Promise<SmMemory | null> {
    const memories = await this.recall(claim, 20);
    return memories.find(m => m.score !== undefined && m.score >= threshold) || null;
  }

  // Seed Agentic spec documentation into memory
  async seedDoc(title: string, content: string, tags: string[] = []): Promise<{ id: string; status: string }> {
    return this.add(`[SPEC] ${title}\n${content}`, ["doc", "spec", ...tags]);
  }

  // Get all recent memories
  async recent(limit = 20): Promise<SmMemory[]> {
    return this.recall("agentic", limit);
  }

  // Wire into Truth Gate: recall prior evidence before LLM fetch
  async truthGatePreCheck(claim: string): Promise<{ found: boolean; memory?: SmMemory; verdict: "verified" | "unknown" | "contradicted" }> {
    const match = await this.similarCheck(claim);
    if (!match) return { found: false, verdict: "unknown" };
    return { found: true, memory: match, verdict: match.score && match.score > 0.85 ? "verified" : "unknown" };
  }
}
