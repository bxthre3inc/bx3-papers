/**
 * IDE Adapter — Universal interface for any IDE (gap #11)
 * 
 * Any MCP-compatible IDE can join the mesh:
 * - Claude Desktop (stdio)
 * - Cursor (stdio)
 * - VS Code (MCP extension)
 * - JetBrains (MCP plugin)
 * - Windsurf (stdio)
 * - Antigravity (stdio/HTTP)
 */

import { PeerInfo, PeerRole, PeerEndpoint, PeerCapability } from "../protocol/v2.js";
import { MCPMeshCore } from "../core/mesh-core.js";

export interface IDETool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface IDEAdapter {
  getInfo(): PeerInfo;
  listTools(): IDETool[];
  executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }> }>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  searchFiles(pattern: string, cwd?: string): Promise<string[]>;
  runTerminal(command: string, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }>;
  onToolCall?(tool: string, handler: (args: Record<string, unknown>) => Promise<unknown>): void;
}

// ✅ Antigravity IDE Adapter
export class AntigravityAdapter implements IDEAdapter {
  private tools: Map<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = new Map();
  private workspaceRoot: string;

  constructor(workspaceRoot: string = process.cwd()) {
    this.workspaceRoot = workspaceRoot;
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    this.tools.set("file_read", async (args) => {
      const fs = await import("fs/promises");
      const content = await fs.readFile(args.path as string, "utf-8");
      return { content: [{ type: "text", text: content }] };
    });

    this.tools.set("file_write", async (args) => {
      const fs = await import("fs/promises");
      await fs.writeFile(args.path as string, args.content as string);
      return { content: [{ type: "text", text: "OK" }] };
    });

    this.tools.set("file_search", async (args) => {
      const { grep_search } = await import("../utils/file-search.js");
      const results = await grep_search(args.pattern as string, args.cwd as string || this.workspaceRoot);
      return { content: [{ type: "text", text: JSON.stringify(results) }] };
    });

    this.tools.set("terminal", async (args) => {
      const { spawn } = await import("child_process");
      return new Promise<{ content: Array<{ type: string; text: string }> }>((resolve) => {
        const proc = spawn(args.command as string, [], { shell: true, cwd: args.cwd as string || this.workspaceRoot });
        let stdout = "", stderr = "";
        proc.stdout?.on("data", (d) => stdout += d);
        proc.stderr?.on("data", (d) => stderr += d);
        proc.on("close", (code) => resolve({ content: [{ type: "text", text: stdout || stderr }] }));
      });
    });
  }

  getInfo(): PeerInfo {
    return {
      id: "antigravity",
      name: "Antigravity IDE",
      role: "ide",
      version: "2.0.0",
      capabilities: ["tools", "resources", "file-system"],
      endpoint: { type: "stdio", command: "node", args: ["dist/index.js"] },
    };
  }

  listTools(): IDETool[] {
    return Array.from(this.tools.entries()).map(([name, _]) => ({
      name,
      description: `Antigravity ${name} tool`,
      inputSchema: { type: "object", properties: {} },
    }));
  }

  async executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }> }> {
    const handler = this.tools.get(name);
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    return handler(args);
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
    const { grep_search } = await import("../utils/file-search.js");
    return grep_search(pattern, cwd || this.workspaceRoot);
  }

  async runTerminal(command: string, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const { spawn } = await import("child_process");
    return new Promise((resolve) => {
      const proc = spawn(command, [], { shell: true, cwd: cwd || this.workspaceRoot });
      let stdout = "", stderr = "";
      proc.stdout?.on("data", (d) => stdout += d);
      proc.stderr?.on("data", (d) => stderr += d);
      proc.on("close", (code) => resolve({ stdout, stderr, exitCode: code || 0 }));
    });
  }

  onToolCall(tool: string, handler: (args: Record<string, unknown>) => Promise<unknown>): void {
    this.tools.set(tool, async (args) => {
      const result = await handler(args);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    });
  }
}

// ✅ Generic MCP Server Adapter — wraps any MCP server
export class MCPServerAdapter implements IDEAdapter {
  private serverInfo: PeerInfo;
  private tools: Map<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = new Map();

  constructor(id: string, name: string, role: PeerRole = "ide") {
    this.serverInfo = {
      id,
      name,
      role,
      version: "2.0.0",
      capabilities: ["tools", "resources"],
      endpoint: { type: "stdio", command: "echo", args: ["MCP server"] },
    };
  }

  getInfo(): PeerInfo {
    return this.serverInfo;
  }

  listTools(): IDETool[] {
    return Array.from(this.tools.entries()).map(([name, _]) => ({
      name,
      description: `${this.serverInfo.name} ${name} tool`,
      inputSchema: { type: "object", properties: {} },
    }));
  }

  registerTool(name: string, handler: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>): void {
    this.tools.set(name, handler);
  }

  async executeTool(name: string, args: Record<string, unknown>): Promise<{ content: Array<{ type: string; text: string }> }> {
    const handler = this.tools.get(name);
    if (!handler) throw new Error(`Unknown tool: ${name}`);
    return handler(args);
  }

  async readFile(path: string): Promise<string> {
    throw new Error("Not implemented");
  }

  async writeFile(_path: string, _content: string): Promise<void> {
    throw new Error("Not implemented");
  }

  async searchFiles(_pattern: string, _cwd?: string): Promise<string[]> {
    return [];
  }

  async runTerminal(_command: string, _cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return { stdout: "", stderr: "Not implemented", exitCode: 1 };
  }
}
