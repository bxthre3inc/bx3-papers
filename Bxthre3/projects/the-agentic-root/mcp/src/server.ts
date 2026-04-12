/**
 * Agentic MCP Server Core
 */

import { Server as MCPServer, ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  text?: string;
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface Prompt {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
}

export interface ServerConfig {
  name: string;
  version: string;
}

export class AgentOSServer {
  server: MCPServer;
  resources: Resource[] = [];
  tools: Tool[] = [];
  prompts: Prompt[] = [];
  toolHandlers: Map<string, (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>> = new Map();

  constructor(config: ServerConfig) {
    this.server = new MCPServer(
      { name: config.name, version: config.version },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );
  }

  addResource(resource: Resource) {
    this.resources.push(resource);
  }

  addTool(tool: Tool, handler: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }> }>) {
    this.tools.push(tool);
    this.toolHandlers.set(tool.name, handler);
  }

  addPrompt(prompt: Prompt) {
    this.prompts.push(prompt);
  }
}
