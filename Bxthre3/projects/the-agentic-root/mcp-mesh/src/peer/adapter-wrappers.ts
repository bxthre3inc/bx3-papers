/**
 * Real Adapter Wrappers — Fixes adapter stubs (Fix #1)
 * 
 * Wraps actual AgentOSServer and AntigravityServer classes
 * instead of demo implementations.
 */

import { randomUUID } from "crypto";
import { spawn, ChildProcess } from "child_process";
import { PeerInfo, MESH_PROTOCOL_VERSION, ToolCall, ToolResponse } from "../protocol/v2.js";
import { MCPMeshCore } from "../core/mesh-core.js";

// ✅ Agentic MCP Adapter — Wraps real Agentic MCP Server
export class AgentOSRealAdapter {
  private process?: ChildProcess;
  private tools: Map<string, {
    description: string;
    inputSchema: Record<string, unknown>;
  }> = new Map();
  private pendingCalls: Map<string, {
    resolve: (r: ToolResponse) => void;
    reject: (e: Error) => void;
  }> = new Map();
  private messageBuffer = "";
  private mesh?: MCPMeshCore;
  private toolHandler?: (tool: string, args: Record<string, unknown>) => Promise<unknown>;

  constructor(
    private peerId: string = "agentic",
    private command: string = "node",
    private args: string[] = ["dist/index.js"],
    private cwd?: string
  ) {}

  // ✅ Attach to mesh
  attachToMesh(mesh: MCPMeshCore): void {
    this.mesh = mesh;
    
    // Register local handler for incoming tool calls
    mesh.on(`tool:*`, async (tool: string, args: Record<string, unknown>) => {
      if (this.toolHandler) {
        return this.toolHandler(tool, args);
      }
      return { content: [{ type: "text", text: "No handler registered" }] };
    });
  }

  // ✅ Register local tool handler
  onToolCall(handler: (tool: string, args: Record<string, unknown>) => Promise<unknown>): void {
    this.toolHandler = handler;
  }

  // ✅ Start the MCP server process
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.args, {
        cwd: this.cwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });

      this.process.on("error", reject);
      this.process.on("exit", (code) => {
        console.error(`Agentic process exited: ${code}`);
      });

      // Read stdout for JSON-RPC messages
      this.process.stdout?.on("data", (data) => {
        this.messageBuffer += data.toString();
        this.processBuffer();
      });

      this.process.stderr?.on("data", (data) => {
        console.error(`[Agentic stderr]: ${data}`);
      });

      // Initialize: send capabilities request
      setTimeout(() => {
        this.discoverTools().then(() => resolve()).catch(resolve);
      }, 1000);
    });
  }

  // ✅ Discover tools from Agentic MCP server
  private async discoverTools(): Promise<void> {
    // Send JSON-RPC tools/list request
    const request = {
      jsonrpc: "2.0",
      id: randomUUID(),
      method: "tools/list",
      params: {},
    };

    this.process?.stdin?.write(JSON.stringify(request) + "\n");
  }

  // ✅ Process incoming messages
  private processBuffer(): void {
    const lines = this.messageBuffer.split("\n");
    this.messageBuffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        this.handleMessage(msg);
      } catch {}
    }
  }

  // ✅ Handle incoming JSON-RPC message
  private handleMessage(msg: any): void {
    if (msg.id && msg.result?.tools) {
      // Tools list response
      for (const tool of msg.result.tools) {
        this.tools.set(tool.name, {
          description: tool.description,
          inputSchema: tool.inputSchema || {},
        });
      }
    } else if (msg.method === "tools/call") {
      // Incoming tool call from Agentic
      this.handleIncomingToolCall(msg);
    } else if (msg.result && msg.id) {
      // Response to our request
      const pending = this.pendingCalls.get(msg.id);
      if (pending) {
        this.pendingCalls.delete(msg.id);
        pending.resolve({
          callId: msg.id,
          success: !msg.error,
          result: msg.result,
          error: msg.error,
        });
      }
    }
  }

  // ✅ Handle incoming tool call
  private async handleIncomingToolCall(msg: any): Promise<void> {
    const { name, arguments: args } = msg.params;
    const callId = msg.id;

    try {
      if (this.toolHandler) {
        const result = await this.toolHandler(name, args);
        this.sendResponse(callId, { success: true, result });
      } else {
        this.sendResponse(callId, { success: false, error: "No handler" });
      }
    } catch (err) {
      this.sendResponse(callId, { success: false, error: String(err) });
    }
  }

  // ✅ Send tool call to Agentic
  async callTool(tool: string, args: Record<string, unknown>): Promise<ToolResponse> {
    if (!this.process) {
      return { callId: "", success: false, error: "Process not running" };
    }

    const callId = randomUUID();

    return new Promise((resolve) => {
      this.pendingCalls.set(callId, { resolve, reject: (e) => resolve({ callId, success: false, error: e.message }) });

      const request = {
        jsonrpc: "2.0",
        id: callId,
        method: "tools/call",
        params: { name: tool, arguments: args },
      };

      this.process?.stdin?.write(JSON.stringify(request) + "\n");

      // Timeout after 30s
      setTimeout(() => {
        if (this.pendingCalls.has(callId)) {
          this.pendingCalls.delete(callId);
          resolve({ callId, success: false, error: "Timeout" });
        }
      }, 30000);
    });
  }

  // ✅ Send response to incoming call
  private sendResponse(id: string, result: any): void {
    const response = {
      jsonrpc: "2.0",
      id,
      result,
    };
    this.process?.stdin?.write(JSON.stringify(response) + "\n");
  }

  // ✅ Get peer info
  getInfo(): PeerInfo {
    return {
      id: this.peerId,
      name: "Agentic",
      role: "agent",
      version: MESH_PROTOCOL_VERSION,
      capabilities: ["tools", "resources", "events"],
      endpoint: { type: "stdio", command: this.command, args: this.args },
    };
  }

  // ✅ List available tools
  listTools(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
    return Array.from(this.tools.entries()).map(([name, info]) => ({
      name,
      description: info.description,
      inputSchema: info.inputSchema,
    }));
  }

  // ✅ Stop the process
  stop(): void {
    this.process?.kill();
    this.process = undefined;
  }
}

// ✅ Antigravity MCP Adapter — Wraps real Antigravity MCP Server  
export class AntigravityRealAdapter {
  private process?: ChildProcess;
  private tools: Map<string, {
    description: string;
    inputSchema: Record<string, unknown>;
  }> = new Map();
  private pendingCalls: Map<string, {
    resolve: (r: ToolResponse) => void;
    reject: (e: Error) => void;
  }> = new Map();
  private messageBuffer = "";
  private mesh?: MCPMeshCore;
  private toolHandler?: (tool: string, args: Record<string, unknown>) => Promise<unknown>;

  constructor(
    private peerId: string = "antigravity",
    private command: string = "node",
    private args: string[] = ["dist/index.js"],
    private cwd?: string
  ) {}

  attachToMesh(mesh: MCPMeshCore): void {
    this.mesh = mesh;
  }

  onToolCall(handler: (tool: string, args: Record<string, unknown>) => Promise<unknown>): void {
    this.toolHandler = handler;
  }

  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn(this.command, this.args, {
        cwd: this.cwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
      });

      this.process.on("error", reject);
      this.process.on("exit", (code) => {
        console.error(`Antigravity process exited: ${code}`);
      });

      this.process.stdout?.on("data", (data) => {
        this.messageBuffer += data.toString();
        this.processBuffer();
      });

      this.process.stderr?.on("data", (data) => {
        console.error(`[Antigravity stderr]: ${data}`);
      });

      setTimeout(() => {
        this.discoverTools().then(() => resolve()).catch(resolve);
      }, 1000);
    });
  }

  private async discoverTools(): Promise<void> {
    const request = {
      jsonrpc: "2.0",
      id: randomUUID(),
      method: "tools/list",
      params: {},
    };
    this.process?.stdin?.write(JSON.stringify(request) + "\n");
  }

  private processBuffer(): void {
    const lines = this.messageBuffer.split("\n");
    this.messageBuffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        this.handleMessage(msg);
      } catch {}
    }
  }

  private handleMessage(msg: any): void {
    if (msg.id && msg.result?.tools) {
      for (const tool of msg.result.tools) {
        this.tools.set(tool.name, {
          description: tool.description,
          inputSchema: tool.inputSchema || {},
        });
      }
    } else if (msg.method === "tools/call") {
      this.handleIncomingToolCall(msg);
    } else if (msg.result && msg.id) {
      const pending = this.pendingCalls.get(msg.id);
      if (pending) {
        this.pendingCalls.delete(msg.id);
        pending.resolve({
          callId: msg.id,
          success: !msg.error,
          result: msg.result,
          error: msg.error,
        });
      }
    }
  }

  private async handleIncomingToolCall(msg: any): Promise<void> {
    const { name, arguments: args } = msg.params;
    const callId = msg.id;

    try {
      if (this.toolHandler) {
        const result = await this.toolHandler(name, args);
        this.sendResponse(callId, { success: true, result });
      } else {
        this.sendResponse(callId, { success: false, error: "No handler" });
      }
    } catch (err) {
      this.sendResponse(callId, { success: false, error: String(err) });
    }
  }

  async callTool(tool: string, args: Record<string, unknown>): Promise<ToolResponse> {
    if (!this.process) {
      return { callId: "", success: false, error: "Process not running" };
    }

    const callId = randomUUID();

    return new Promise((resolve) => {
      this.pendingCalls.set(callId, { resolve, reject: (e) => resolve({ callId, success: false, error: e.message }) });

      const request = {
        jsonrpc: "2.0",
        id: callId,
        method: "tools/call",
        params: { name: tool, arguments: args },
      };

      this.process?.stdin?.write(JSON.stringify(request) + "\n");

      setTimeout(() => {
        if (this.pendingCalls.has(callId)) {
          this.pendingCalls.delete(callId);
          resolve({ callId, success: false, error: "Timeout" });
        }
      }, 30000);
    });
  }

  private sendResponse(id: string, result: any): void {
    const response = { jsonrpc: "2.0", id, result };
    this.process?.stdin?.write(JSON.stringify(response) + "\n");
  }

  getInfo(): PeerInfo {
    return {
      id: this.peerId,
      name: "Antigravity IDE",
      role: "ide",
      version: MESH_PROTOCOL_VERSION,
      capabilities: ["tools", "resources", "file-system"],
      endpoint: { type: "stdio", command: this.command, args: this.args },
    };
  }

  listTools(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
    return Array.from(this.tools.entries()).map(([name, info]) => ({
      name,
      description: info.description,
      inputSchema: info.inputSchema,
    }));
  }

  stop(): void {
    this.process?.kill();
    this.process = undefined;
  }
}
