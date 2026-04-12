/**
 * Memory & Knowledge Tools
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";
import * as path from "path";

const SUPERMEMORY_PATH = "/home/.z/supermemory";
const PATTERNS_PATH = "/home/.z/supermemory/patterns.md";

export function register(server: AgentOSServer) {
  // Search supermemory
  server.addTool(
    {
      name: "agentic_memory_search",
      description: "Search supermemory for patterns, observations, or past decisions",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query"
          },
          type: {
            type: "string",
            enum: ["pattern", "observation", "decision", "all"],
            default: "all"
          }
        },
        required: ["query"]
      }
    },
    async (args) => {
      const results: string[] = [];
      
      // Search patterns file
      if (fs.existsSync(PATTERNS_PATH)) {
        const content = fs.readFileSync(PATTERNS_PATH, "utf-8");
        const lines = content.split("\n");
        const matching = lines.filter(line => 
          line.toLowerCase().includes((args.query as string).toLowerCase())
        );
        if (matching.length > 0) {
          results.push(`## Patterns\n${matching.join("\n")}`);
        }
      }
      
      // Search supermemory directory
      if (fs.existsSync(SUPERMEMORY_PATH)) {
        const files = fs.readdirSync(SUPERMEMORY_PATH);
        for (const file of files) {
          if (file.endsWith(".md") || file.endsWith(".txt")) {
            const content = fs.readFileSync(`${SUPERMEMORY_PATH}/${file}`, "utf-8");
            if (content.toLowerCase().includes((args.query as string).toLowerCase())) {
              results.push(`## ${file}\n${content.substring(0, 1000)}...`);
            }
          }
        }
      }
      
      return { content: [{ type: "text", text: results.join("\n\n---\n\n") || "No results found" }] };
    }
  );

  // Store pattern/observation
  server.addTool(
    {
      name: "agentic_memory_store",
      description: "Store a new pattern or observation in supermemory",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "Pattern or observation to store"
          },
          type: {
            type: "string",
            enum: ["pattern", "observation", "decision"],
            default: "observation"
          },
          tags: {
            type: "string",
            description: "Comma-separated tags"
          }
        },
        required: ["content"]
      }
    },
    async (args) => {
      const timestamp = new Date().toISOString();
      const type = (args.type as string) || "observation";
      const tags = args.tags ? (args.tags as string).split(",").map((t: string) => t.trim()) : [];
      const entry = `\n## ${type.charAt(0).toUpperCase() + type.slice(1)}: ${timestamp}\n**Tags:** ${tags.join(", ") || "none"}\n\n${args.content}\n`;
      
      fs.appendFileSync(PATTERNS_PATH, entry);
      
      return { content: [{ type: "text", text: `Stored ${type}:\n\n${args.content}\n\nTags: ${tags.join(", ")}` }] };
    }
  );

  // Recall decision
  server.addTool(
    {
      name: "agentic_recall_decision",
      description: "Find a past decision by topic or date",
      inputSchema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Topic to search for"
          }
        },
        required: ["topic"]
      }
    },
    async (args) => {
      if (!fs.existsSync(PATTERNS_PATH)) {
        return { content: [{ type: "text", text: "No decisions found (patterns file does not exist)" }] };
      }
      
      const content = fs.readFileSync(PATTERNS_PATH, "utf-8");
      const lines = content.split("\n");
      const matching = lines.filter(line => 
        line.toLowerCase().includes((args.topic as string).toLowerCase()) ||
        content.includes((args.topic as string).toLowerCase())
      );
      
      // Get context around matches
      const decisions: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes((args.topic as string).toLowerCase()) && 
            lines[i].startsWith("##")) {
          decisions.push(lines.slice(i, i + 10).join("\n"));
        }
      }
      
      return { content: [{ type: "text", text: decisions.join("\n\n---\n\n") || "No decisions found" }] };
    }
  );

  // Get all patterns
  server.addTool(
    {
      name: "agentic_memory_get_patterns",
      description: "Get all stored patterns and observations",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    async () => {
      if (!fs.existsSync(PATTERNS_PATH)) {
        return { content: [{ type: "text", text: "No patterns stored yet" }] };
      }
      
      const content = fs.readFileSync(PATTERNS_PATH, "utf-8");
      return { content: [{ type: "text", text: content }] };
    }
  );

  // Get AGENTS.md (workspace memory)
  server.addTool(
    {
      name: "agentic_get_workspace_memory",
      description: "Get the AGENTS.md workspace memory index",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    async () => {
      const agentsPath = "/home/workspace/Bxthre3/AGENTS.md";
      if (fs.existsSync(agentsPath)) {
        const content = fs.readFileSync(agentsPath, "utf-8");
        return { content: [{ type: "text", text: content }] };
      }
      return { content: [{ type: "text", text: "AGENTS.md not found" }] };
    }
  );
}
