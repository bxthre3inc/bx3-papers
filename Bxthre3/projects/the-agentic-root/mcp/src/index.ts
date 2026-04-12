#!/usr/bin/env node

/**
 * Agentic MCP Server
 * 
 * Exposes all Agentic features via Model Context Protocol.
 * Connect via stdio (Claude Desktop) or HTTP (remote clients).
 * 
 * Mesh Mode: --mesh enables connection to Antigravity and Zo peers.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { AgentOSServer } from "./server.js";
import { registerAllTools } from "./tools/index.js";
import { registerAllResources } from "./resources/index.js";
import { registerAllPrompts } from "./prompts/index.js";

const HTTP_MODE = process.argv.includes("--http");
const MESH_MODE = process.argv.includes("--mesh");
const PORT = parseInt(process.env.AGENTOS_PORT || "3098");
const API_KEY = process.env.AGENTOS_API_KEY || "";

async function main() {
  const server = new AgentOSServer({ name: "Agentic MCP Server", version: "1.0.0" } as any);

  // Register all capabilities
  registerAllResources(server);
  registerAllTools(server);
  registerAllPrompts(server);

  // Handle incoming requests
  server.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: server.resources,
  }));

  server.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const resource = server.resources.find((r: any) => r.uri === uri);
    if (!resource) throw new Error(`Resource not found: ${uri}`);
    return { contents: [{ uri, mimeType: resource.mimeType || "text/plain", text: resource.text || "" }] };
  });

  server.server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: server.tools,
  }));

  server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = server.toolHandlers.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return await tool(args || {});
  });

  server.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: server.prompts,
  }));

  if (MESH_MODE) {
    // Import mesh dynamically
    const { createMeshAdapter, startMeshHttp } = await import("../../../../mcp-mesh/src/adapters.js");
    
    const mesh = createMeshAdapter("agentic", {
      name: "Agentic",
      version: "1.0.0",
      getTools: () => server.tools,
      callTool: (name, args) => server.toolHandlers.get(name)?.(args as Record<string, unknown>) as any,
      getResources: () => server.resources,
    }, [
      { id: "zo", url: "http://localhost:3099" },
      { id: "antigravity", command: "node", args: ["../the-antigravity-project/mcp/dist/index.js"] },
    ], { meshPort: PORT, meshApiKey: API_KEY, enableHttpMesh: true });

    await startMeshHttp(PORT, API_KEY, [
      { path: "/mesh/call", handler: mesh.httpHandler },
      { path: "/mesh/sync", handler: mesh.httpHandler },
      { path: "/mesh/status", handler: mesh.httpHandler },
    ]);
    mesh.connectPeers();
    console.error(`Agentic MCP+Mesh running on port ${PORT}`);

  } else if (HTTP_MODE) {
    const http = await import("node:http");
    http.createServer(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

      const url = new URL(req.url || "/", `http://localhost:${PORT}`);
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (API_KEY && token !== API_KEY) { res.writeHead(401); res.end("Unauthorized"); return; }

      try {
        if (url.pathname === "/tools/call" && req.method === "POST") {
          let body = ""; for await (const chunk of req) body += chunk;
          const { name, arguments: args } = JSON.parse(body);
          const result = await server.toolHandlers.get(name)?.(args || {});
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        } else if (url.pathname === "/tools" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ tools: server.tools }));
        } else {
          res.writeHead(404); res.end("Not Found");
        }
      } catch (err) { res.writeHead(500); res.end(String(err)); }
    }).listen(PORT, () => console.error(`Agentic MCP HTTP Server running on port ${PORT}`));

  } else {
    // Stdio mode
    const transport = new StdioServerTransport();
    await server.server.connect(transport);
    console.error("Agentic MCP Server running on stdio");
  }
}

main().catch(console.error);
