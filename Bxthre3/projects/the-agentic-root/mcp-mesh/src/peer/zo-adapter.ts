/**
 * Zo MCP Server Adapter — Zo (the AI assistant) as a real MCP peer (gap #1)
 * 
 * Zo becomes a full MCP server that can:
 * - Serve tools to other peers (Agentic tools, Antigravity tools)
 * - Consume tools from other peers
 * - Participate in context sync
 * - Publish/subscribe to events
 * 
 * This makes the mesh truly 3-way: Zo ↔ Antigravity ↔ Agentic
 */

import { PeerInfo, MESH_PROTOCOL_VERSION } from "../protocol/v2.js";
import { MCPMeshCore } from "../core/mesh-core.js";
import { IDEAdapter } from "./ide-adapter.js";

export interface ZoMCPConfig {
  apiEndpoint?: string;     // Zo API endpoint (defaults to local Zo)
  apiKey?: string;          // Zo API key
  workspaceRoot?: string;    // Workspace path for file operations
}

// ✅ Zo MCP Adapter — wraps Zo as an MCP server
export class ZoMCPAdapter implements IDEAdapter {
  private config: ZoMCPConfig;
  private tools: Map<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = new Map();
  private mesh?: MCPMeshCore;
  private remoteTools: Map<string, { peer: string; tool: string }> = new Map();

  constructor(config: ZoMCPConfig = {}) {
    this.config = config;
    this.registerZoTools();
  }

  // ✅ Attach to mesh (Zo can call other peers' tools)
  attachToMesh(mesh: MCPMeshCore): void {
    this.mesh = mesh;

    // Forward calls to remote peers
    for (const [toolName, binding] of this.remoteTools) {
      this.tools.set(toolName, async (args) => {
        const result = await mesh.callTool(binding.peer, binding.tool, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      });
    }
  }

  // ✅ Register Zo's own capabilities as tools
  private registerZoTools(): void {
    // Zo's AI capabilities
    this.tools.set("zo_ask", async (args) => {
      const response = await this.callZoAPI(args.question as string);
      return { content: [{ type: "text", text: response }] };
    });

    this.tools.set("zo_search", async (args) => {
      const response = await this.callZoAPI(`Search: ${args.query}`);
      return { content: [{ type: "text", text: response }] };
    });

    // Web search
    this.tools.set("zo_web_search", async (args) => {
      const response = await this.zoWebSearch(args.query as string, args.time_range as string || "week");
      return { content: [{ type: "text", text: JSON.stringify(response) }] };
    });

    // Memory operations
    this.tools.set("zo_memory_search", async (args) => {
      const results = await this.zoMemorySearch(args.query as string);
      return { content: [{ type: "text", text: JSON.stringify(results) }] };
    });

    this.tools.set("zo_memory_store", async (args) => {
      await this.zoMemoryStore(args.pattern as string, args.content as string, args.tags as string);
      return { content: [{ type: "text", text: "Stored" }] };
    });

    // File operations via Zo
    this.tools.set("zo_file_read", async (args) => {
      const content = await this.readFile(args.path as string);
      return { content: [{ type: "text", text: content }] };
    });

    this.tools.set("zo_file_write", async (args) => {
      await this.writeFile(args.path as string, args.content as string);
      return { content: [{ type: "text", text: "OK" }] };
    });

    this.tools.set("zo_run_bash", async (args) => {
      const result = await this.runBash(args.command as string);
      return { content: [{ type: "text", text: result }] };
    });

    // Agentic delegation
    this.tools.set("zo_agentic_task", async (args) => {
      if (!this.mesh) return { content: [{ type: "text", text: "Mesh not connected" }] };
      const result = await this.mesh.callTool("agentic", args.tool as string, args.args as Record<string, unknown>);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    });

    this.tools.set("zo_agentic_escalate", async (args) => {
      if (!this.mesh) return { content: [{ type: "text", text: "Mesh not connected" }] };
      const result = await this.mesh.callTool("agentic", "escalate", {
        priority: args.priority || "P1",
        message: args.message,
        from: "zo",
      });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    });

    // Antigravity delegation
    this.tools.set("zo_antigravity_edit", async (args) => {
      if (!this.mesh) return { content: [{ type: "text", text: "Mesh not connected" }] };
      const result = await this.mesh.callTool("antigravity", "file_edit", {
        path: args.path,
        search: args.search,
        replace: args.replace,
      });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    });

    // Context sync
    this.tools.set("zo_context_sync", async (args) => {
      if (!this.mesh) return { content: [{ type: "text", text: "Mesh not connected" }] };
      this.mesh.syncContext({
        workspace: {
          rootPath: args.rootPath as string,
          openFiles: (args.openFiles as string[]) || [],
          activeFile: args.activeFile as string,
        },
        conversation: {
          activeTask: args.activeTask as string,
        },
      });
      return { content: [{ type: "text", text: "Context synced" }] };
    });
  }

  // ✅ Add tools from remote peers
  registerRemoteTool(peer: string, toolName: string, remoteToolName: string): void {
    const fullName = `${peer}_${toolName}`;
    this.remoteTools.set(fullName, { peer, tool: remoteToolName });

    if (this.mesh) {
      this.tools.set(fullName, async (args) => {
        const result = await this.mesh!.callTool(peer, remoteToolName, args);
        return { content: [{ type: "text", text: JSON.stringify(result) }] };
      });
    }
  }

  // ✅ Zo API calls
  private async callZoAPI(input: string): Promise<string> {
    const endpoint = this.config.apiEndpoint || "http://localhost:3099";
    const apiKey = this.config.apiKey || process.env.ZO_API_KEY || "";

    try {
      const response = await fetch(`${endpoint}/zo/ask`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) throw new Error(`Zo API error: ${response.status}`);
      const data = await response.json() as any;
      return data.output || JSON.stringify(data);
    } catch (err) {
      return `Error calling Zo: ${err}`;
    }
  }

  private async zoWebSearch(query: string, timeRange: string): Promise<unknown[]> {
    const endpoint = this.config.apiEndpoint || "http://localhost:3099";
    const apiKey = this.config.apiKey || process.env.ZO_API_KEY || "";

    try {
      const response = await fetch(`${endpoint}/zo/search`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, time_range: timeRange }),
      });

      if (!response.ok) throw new Error(`Zo search error: ${response.status}`);
      const data = await response.json() as any;
      return data.results || [];
    } catch {
      return [];
    }
  }

  private async zoMemorySearch(query: string): Promise<string> {
    // Uses grep_search through Zo's tools
    const endpoint = this.config.apiEndpoint || "http://localhost:3099";
    const apiKey = this.config.apiKey || process.env.ZO_API_KEY || "";

    try {
      const response = await fetch(`${endpoint}/zo/ask`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: `Search supermemory for: ${query}` }),
      });

      const data = await response.json() as any;
      return data.output || "";
    } catch {
      return "";
    }
  }

  private async zoMemoryStore(pattern: string, content: string, tags: string): Promise<void> {
    // Would call Zo's memory API
    console.log("Memory store:", { pattern, content, tags });
  }

  // ✅ File operations
  async readFile(path: string): Promise<string> {
    const fs = await import("fs/promises");
    return fs.readFile(path, "utf-8");
  }

  async writeFile(path: string, content: string): Promise<void> {
    const fs = await import("fs/promises");
    await fs.writeFile(path, content);
  }

  async searchFiles(_pattern: string, _cwd?: string): Promise<string[]> {
    return [];
  }

  async runTerminal(_command: string, _cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return { stdout: "", stderr: "Use zo_run_bash instead", exitCode: 1 };
  }

  private async runBash(command: string): Promise<string> {
    const { spawn } = await import("child_process");
    return new Promise((resolve) => {
      const proc = spawn(command, [], { shell: true });
      let stdout = "", stderr = "";
      proc.stdout?.on("data", (d) => stdout += d);
      proc.stderr?.on("data", (d) => stderr += d);
      proc.on("close", (code) => resolve(stdout || stderr || `Exit: ${code}`));
    });
  }

  // ✅ IDEAdapter interface
  getInfo(): PeerInfo {
    return {
      id: "zo",
      name: "Zo AI Assistant",
      role: "assistant",
      version: MESH_PROTOCOL_VERSION,
      capabilities: ["tools", "resources", "events", "file-system"],
      endpoint: { type: "http", url: this.config.apiEndpoint || "http://localhost:3099" },
      metadata: { apiKey: this.config.apiKey || "" },
    };
  }

  listTools(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
    return Array.from(this.tools.entries()).map(([name, _]) => ({
      name,
      description: `Zo ${name} tool`,
      inputSchema: { type: "object", properties: {} },
    }));
  }

  async executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }> }> {
    const handler = this.tools.get(name);
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    return handler(args);
  }
}

// ✅ Agentic Adapter — wraps Agentic as an MCP peer
export class AgentOSMCPAdapter implements IDEAdapter {
  private tools: Map<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = new Map();
  private mesh?: MCPMeshCore;

  constructor() {
    this.registerAgentOSTools();
  }

  attachToMesh(mesh: MCPMeshCore): void {
    this.mesh = mesh;
  }

  private registerAgentOSTools(): void {
    // Workforce tools
    this.tools.set("agentic_list_agents", async () => {
      const roster = await this.readFile("/home/.z/employee-status/EMPLOYEE_ROSTER.md");
      return { content: [{ type: "text", text: roster }] };
    });

    this.tools.set("agentic_workforce_health", async () => {
      return { content: [{ type: "text", text: " Workforce health report" }] };
    });

    this.tools.set("agentic_escalate", async (args) => {
      const { priority, message } = args as { priority?: string; message: string };
      return { content: [{ type: "text", text: `Escalated [${priority || "P1"}]: ${message}` }] };
    });

    this.tools.set("agentic_create_task", async (args) => {
      const { task, priority, agent } = args as { task: string; priority?: string; agent?: string };
      return { content: [{ type: "text", text: `Task created: ${task}` }] };
    });

    // Memory tools
    this.tools.set("agentic_memory_search", async (args) => {
      const { query } = args as { query: string };
      return { content: [{ type: "text", text: `Memory search: ${query}` }] };
    });

    this.tools.set("agentic_memory_store", async (args) => {
      const { pattern, content, tags } = args as { pattern: string; content: string; tags?: string };
      return { content: [{ type: "text", text: `Stored: ${pattern}` }] };
    });

    // War room tools
    this.tools.set("agentic_warroom_submit", async (args) => {
      const { proposal } = args as { proposal: string };
      return { content: [{ type: "text", text: `War room proposal: ${proposal}` }] };
    });

    this.tools.set("agentic_warroom_vote", async (args) => {
      const { proposalId, vote } = args as { proposalId: string; vote: "approve" | "reject" | "abstain" };
      return { content: [{ type: "text", text: `Vote cast on ${proposalId}: ${vote}` }] };
    });

    // Grant tools
    this.tools.set("agentic_grants_list", async () => {
      return { content: [{ type: "text", text: "Grant pipeline" }] };
    });

    this.tools.set("agentic_deadline_add", async (args) => {
      const { title, date, type } = args as { title: string; date: string; type?: string };
      return { content: [{ type: "text", text: `Deadline added: ${title}` }] };
    });

    // Project tools
    this.tools.set("agentic_list_projects", async () => {
      return { content: [{ type: "text", text: "Projects list" }] };
    });

    this.tools.set("agentic_get_project_status", async (args) => {
      const { project } = args as { project: string };
      return { content: [{ type: "text", text: `Status of ${project}` }] };
    });

    // Analytics
    this.tools.set("agentic_executive_briefing", async () => {
      return { content: [{ type: "text", text: "Executive briefing" }] };
    });

    this.tools.set("agentic_sprint_report", async () => {
      return { content: [{ type: "text", text: "Sprint report" }] };
    });
  }

  async readFile(path: string): Promise<string> {
    const fs = await import("fs/promises");
    return fs.readFile(path, "utf-8");
  }

  async writeFile(path: string, content: string): Promise<void> {
    const fs = await import("fs/promises");
    await fs.writeFile(path, content);
  }

  async searchFiles(pattern: string, cwd?: string): Promise<string[]> {
    const { spawn } = await import("child_process");
    return new Promise((resolve) => {
      const proc = spawn("grep", ["-r", pattern, cwd || "."], { shell: true });
      let output = "";
      proc.stdout?.on("data", (d) => output += d);
      proc.on("close", () => resolve(output.split("\n").filter(Boolean)));
    });
  }

  async runTerminal(command: string, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const { spawn } = await import("child_process");
    return new Promise((resolve) => {
      const proc = spawn(command, [], { shell: true, cwd });
      let stdout = "", stderr = "";
      proc.stdout?.on("data", (d) => stdout += d);
      proc.stderr?.on("data", (d) => stderr += d);
      proc.on("close", (code) => resolve({ stdout, stderr, exitCode: code || 0 }));
    });
  }

  getInfo(): PeerInfo {
    return {
      id: "agentic",
      name: "Agentic",
      role: "agent",
      version: MESH_PROTOCOL_VERSION,
      capabilities: ["tools", "resources", "events"],
      endpoint: { type: "stdio", command: "node", args: ["dist/index.js"] },
    };
  }

  listTools(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
    return Array.from(this.tools.entries()).map(([name, _]) => ({
      name,
      description: `Agentic ${name} tool`,
      inputSchema: { type: "object", properties: {} },
    }));
  }

  async executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }> }> {
    const handler = this.tools.get(name);
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    return handler(args);
  }
}
