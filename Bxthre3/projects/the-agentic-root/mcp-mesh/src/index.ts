#!/usr/bin/env node

/**
 * MCP Mesh v2.0 — Main Entry Point
 * 
 * 3-Way Symmetric Peer Mesh: Zo ↔ Antigravity ↔ Agentic
 * With support for any MCP IDE: Cursor, VS Code, JetBrains, Windsurf
 * 
 * Fixes applied:
 * ✅ Real adapter integration (Fix #1)
 * ✅ Heartbeat/keepalive (Fix #2)
 * ✅ Schema validation (Fix #3)
 * ✅ Graceful cleanup (Fix #4)
 * ✅ Message compression (Fix #5)
 * ✅ WebSocket reconnect (Fix #6)
 * ✅ Circuit breaker UI (Fix #7)
 * ✅ Graceful degradation (Fix #8)
 * ✅ Metrics endpoint (Fix #9)
 * ✅ CLI enhancement (Fix #10)
 */

import { MCPMeshCore } from "./core/mesh-core.js";
import { MCPMeshExtended, parseCLIArgs, getCLIUsage } from "./core/mesh-extended.js";
import { AgentOSRealAdapter, AntigravityRealAdapter } from "./peer/adapter-wrappers.js";
import { ZoMCPAdapter, AgentOSMCPAdapter } from "./peer/zo-adapter.js";
import { AntigravityAdapter } from "./peer/ide-adapter.js";
import { MESH_PROTOCOL_VERSION, PeerInfo } from "./protocol/v2.js";

export { MCPMeshCore } from "./core/mesh-core.js";
export { MCPMeshExtended } from "./core/mesh-extended.js";
export { AgentOSRealAdapter, AntigravityRealAdapter } from "./peer/adapter-wrappers.js";
export { ZoMCPAdapter, AgentOSMCPAdapter } from "./peer/zo-adapter.js";
export { AntigravityAdapter } from "./peer/ide-adapter.js";
export * from "./protocol/v2.js";

// ✅ Default peer configurations
export const DEFAULT_PEERS: PeerInfo[] = [
  {
    id: "zo",
    name: "Zo AI Assistant",
    role: "assistant",
    version: MESH_PROTOCOL_VERSION,
    capabilities: ["tools", "resources", "events", "file-system"],
    endpoint: { type: "http", url: process.env.ZO_ENDPOINT || "http://localhost:3099" },
    metadata: { apiKey: process.env.ZO_API_KEY || "" },
  },
  {
    id: "antigravity",
    name: "Antigravity IDE",
    role: "ide",
    version: MESH_PROTOCOL_VERSION,
    capabilities: ["tools", "resources", "file-system"],
    endpoint: { type: "stdio", command: "node", args: ["../the-antigravity-project/mcp/dist/index.js"] },
  },
  {
    id: "agentic",
    name: "Agentic",
    role: "agent",
    version: MESH_PROTOCOL_VERSION,
    capabilities: ["tools", "resources", "events"],
    endpoint: { type: "stdio", command: "node", args: ["../the-agentic-project/mcp/dist/index.js"] },
  },
];

// ✅ Create mesh with all three peers (REAL adapters)
export async function createFullMesh(options?: {
  useRealAdapters?: boolean;
  meshPort?: number;
}): Promise<MCPMeshExtended> {
  const mesh = new MCPMeshExtended({
    self: {
      id: "zo",
      name: "Zo AI Assistant",
      role: "assistant",
      version: MESH_PROTOCOL_VERSION,
      capabilities: ["tools", "resources", "events", "file-system"],
      endpoint: { type: "http", url: process.env.ZO_ENDPOINT || "http://localhost:3099" },
    },
    bootstrapPeers: DEFAULT_PEERS.filter((p) => p.id !== "zo"),
  });

  // Initialize adapters
  let agenticAdapter: AgentOSRealAdapter | AgentOSMCPAdapter = new AgentOSMCPAdapter();
  let antigravityAdapter: AntigravityRealAdapter | AntigravityAdapter = new AntigravityAdapter();

  if (options?.useRealAdapters !== false) {
    // Use REAL adapters (Fix #1)
    console.error("Using real MCP server adapters...");

    // Agentic adapter
    agenticAdapter = new AgentOSRealAdapter(
      "agentic",
      "node",
      ["../the-agentic-project/mcp/dist/index.js"],
      "/home/workspace/Bxthre3/projects/the-agentic-project/mcp"
    );

    // Antigravity adapter
    antigravityAdapter = new AntigravityRealAdapter(
      "antigravity",
      "node",
      ["../the-antigravity-project/mcp/dist/index.js"],
      "/home/workspace/Bxthre3/projects/the-antigravity-project/mcp"
    );

    // Start adapters
    try {
      await (agenticAdapter as AgentOSRealAdapter).start();
      console.error("Agentic MCP server connected");
    } catch (e) {
      console.error("Agentic MCP server not available:", e);
    }

    try {
      await (antigravityAdapter as AntigravityRealAdapter).start();
      console.error("Antigravity MCP server connected");
    } catch (e) {
      console.error("Antigravity MCP server not available:", e);
    }
  }

  // Attach to mesh
  if (agenticAdapter instanceof AgentOSRealAdapter) {
    agenticAdapter.attachToMesh(mesh);
  }
  if (antigravityAdapter instanceof AntigravityRealAdapter) {
    antigravityAdapter.attachToMesh(mesh);
  }

  // Attach Zo adapter (using API)
  const zoAdapter = new ZoMCPAdapter({
    apiEndpoint: process.env.ZO_ENDPOINT || "http://localhost:3099",
    apiKey: process.env.ZO_API_KEY,
  });
  zoAdapter.attachToMesh(mesh);

  // Register remote tools in Zo
  for (const tool of agenticAdapter.listTools()) {
    zoAdapter.registerRemoteTool("agentic", tool.name, tool.name);
  }
  for (const tool of antigravityAdapter.listTools()) {
    zoAdapter.registerRemoteTool("antigravity", tool.name, tool.name);
  }

  // Start heartbeat (Fix #2)
  mesh.startHeartbeat();

  // Setup graceful shutdown (Fix #4)
  const shutdown = async () => {
    await mesh.gracefulShutdown();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return mesh;
}

// ✅ CLI entry
async function main() {
  const { cmd, args } = parseCLIArgs(process.argv);

  console.error(`MCP Mesh v${MESH_PROTOCOL_VERSION} starting...`);

  switch (cmd) {
    case "start": {
      const mode = args[0] || "full";
      console.error(`Mode: ${mode}`);

      const mesh = await createFullMesh();

      // Event listeners
      mesh.on("peer:connected", (id: string) => console.error(`Peer connected: ${id}`));
      mesh.on("peer:auth", (id: string) => console.error(`Peer authed: ${id}`));
      mesh.on("peer:disconnect", (id: string) => console.error(`Peer disconnected: ${id}`));
      mesh.on("error", (id: string, err: Error) => console.error(`Error from ${id}:`, err));

      await mesh.start();

      console.error("Mesh started. Press Ctrl+C to stop.");
      break;
    }

    case "status": {
      const mesh = await createFullMesh();
      await mesh.start();

      const handlers = mesh.createHttpHandlers();
      const mockReq = { url: "/mesh/status", method: "GET", headers: {} };
      const chunks: Buffer[] = [];
      const mockRes = {
        writeHead: (code: number, headers: any) => console.error(`Status: ${code}`),
        end: (data: string) => {
          console.error(data);
          mesh.gracefulShutdown();
        },
      };

      await (handlers["/mesh/status"] as any)(mockReq, mockRes);
      break;
    }

    case "metrics": {
      const mesh = await createFullMesh();
      await mesh.start();

      const handlers = mesh.createHttpHandlers();
      const mockRes = {
        writeHead: (code: number) => console.error(`Metrics: ${code}`),
        end: (data: string) => {
          console.error(data);
          mesh.gracefulShutdown();
        },
      };

      await (handlers["/mesh/metrics"] as any)({}, mockRes);
      break;
    }

    case "call": {
      const [peer, tool, ...toolArgs] = args;
      if (!peer || !tool) {
        console.error("Usage: mesh call <peer> <tool> [args...]");
        process.exit(1);
      }

      const mesh = await createFullMesh();
      await mesh.start();

      const result = await mesh.callTool(peer, tool, {});
      console.error(JSON.stringify(result, null, 2));

      await mesh.gracefulShutdown();
      break;
    }

    case "help":
    default:
      console.error(getCLIUsage());
      break;
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
