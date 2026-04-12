/**
 * Workforce Management Tools
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";
import * as path from "path";

const ROSTER_PATH = "/home/.z/employee-status/EMPLOYEE_ROSTER.md";
const INBOX_PATH = "/home/workspace/Bxthre3/INBOX";
const ROUTING_SCRIPT = "/home/workspace/Bxthre3/INBOX/agents/INBOX_ROUTING.py";

export function register(server: AgentOSServer) {
  // List all agents
  server.addTool(
    {
      name: "agentic_list_agents",
      description: "List all Agentic employees (human + AI agents) with their status",
      inputSchema: {
        type: "object",
        properties: {
          department: {
            type: "string",
            description: "Filter by department (e.g., engineering, grants, legal)"
          },
          status: {
            type: "string",
            enum: ["active", "idle", "busy", "offline"],
            description: "Filter by current status"
          }
        }
      }
    },
    async (args) => {
      const roster = fs.readFileSync(ROSTER_PATH, "utf-8");
      let filtered = roster;
      
      if (args.department) {
        filtered = filtered.split("\n")
          .filter(line => line.toLowerCase().includes(args.department as string))
          .join("\n");
      }
      
      return { content: [{ type: "text", text: filtered }] };
    }
  );

  // Get specific agent status
  server.addTool(
    {
      name: "agentic_get_agent_status",
      description: "Get detailed status for a specific agent",
      inputSchema: {
        type: "object",
        properties: {
          agent_id: {
            type: "string",
            description: "Agent ID (e.g., casey, erica, maya, raj)"
          }
        },
        required: ["agent_id"]
      }
    },
    async (args) => {
      const statusPath = `/home/.z/employee-status/${args.agent_id}.json`;
      if (fs.existsSync(statusPath)) {
        const status = fs.readFileSync(statusPath, "utf-8");
        return { content: [{ type: "text", text: status }] };
      }
      
      // Try markdown INBOX
      const inboxPath = `${INBOX_PATH}/agents/${args.agent_id}.md`;
      if (fs.existsSync(inboxPath)) {
        const inbox = fs.readFileSync(inboxPath, "utf-8");
        return { content: [{ type: "text", text: inbox }] };
      }
      
      return { content: [{ type: "text", text: `Agent not found: ${args.agent_id}` }] };
    }
  );

  // Create task for agent
  server.addTool(
    {
      name: "agentic_create_task",
      description: "Create a task for a specific agent and add to their queue",
      inputSchema: {
        type: "object",
        properties: {
          agent_id: {
            type: "string",
            description: "Target agent ID"
          },
          task: {
            type: "string",
            description: "Task description"
          },
          priority: {
            type: "string",
            enum: ["P0", "P1", "P2", "P3"],
            default: "P2",
            description: "Task priority"
          },
          deadline: {
            type: "string",
            description: "Optional deadline (ISO 8601)"
          }
        },
        required: ["agent_id", "task"]
      }
    },
    async (args) => {
      const taskId = `TASK-${Date.now()}`;
      const taskContent = `---
id: ${taskId}
agent: ${args.agent_id}
priority: ${args.priority || "P2"}
status: pending
created: ${new Date().toISOString()}
${args.deadline ? `deadline: ${args.deadline}` : ""}

## Task
${args.task}
---
`;
      
      const taskPath = `/home/workspace/Bxthre3/tasks/TASK-${args.agent_id}-${Date.now()}.md`;
      fs.writeFileSync(taskPath, taskContent);
      
      return { content: [{ type: "text", text: `Task created: ${taskId}\nAssigned to: ${args.agent_id}\nPriority: ${args.priority || "P2"}\n\n${args.task}` }] };
    }
  );

  // Escalate to INBOX
  server.addTool(
    {
      name: "agentic_escalate",
      description: "Escalate an issue to P0/P1 INBOX (triggers SMS to brodiblanco)",
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Brief title for the escalation"
          },
          description: {
            type: "string",
            description: "Detailed description of the issue"
          },
          priority: {
            type: "string",
            enum: ["P0", "P1"],
            default: "P1",
            description: "P0 (immediate) or P1 (urgent)"
          },
          from_agent: {
            type: "string",
            description: "Agent raising the escalation"
          }
        },
        required: ["title", "description"]
      }
    },
    async (args) => {
      const priority = args.priority || "P1";
      const timestamp = new Date().toISOString();
      const entry = `\n## 🔴 ${priority} ${args.title}\n**From:** ${args.from_agent || "MCP Client"}\n**Time:** ${timestamp}\n\n${args.description}\n`;
      
      fs.appendFileSync("/home/workspace/Bxthre3/INBOX.md", entry);
      
      return { content: [{ type: "text", text: `Escalated: ${priority} ${args.title}\n\n${args.description}` }] };
    }
  );

  // Send direct message to agent
  server.addTool(
    {
      name: "agentic_send_to_agent",
      description: "Send a message directly to an agent's INBOX",
      inputSchema: {
        type: "object",
        properties: {
          agent_id: {
            type: "string",
            description: "Target agent ID"
          },
          message: {
            type: "string",
            description: "Message content"
          }
        },
        required: ["agent_id", "message"]
      }
    },
    async (args) => {
      const inboxPath = `${INBOX_PATH}/agents/${args.agent_id}.md`;
      const entry = `\n## 📬 Message\n**From:** MCP Client\n**Time:** ${new Date().toISOString()}\n\n${args.message}\n`;
      
      if (fs.existsSync(inboxPath)) {
        fs.appendFileSync(inboxPath, entry);
      } else {
        fs.writeFileSync(inboxPath, `# ${args.agent_id}\n${entry}`);
      }
      
      return { content: [{ type: "text", text: `Message sent to ${args.agent_id}:\n\n${args.message}` }] };
    }
  );

  // Get workforce health report
  server.addTool(
    {
      name: "agentic_workforce_health",
      description: "Get a workforce health report (agent completion rates, blockers, morale)",
      inputSchema: {
        type: "object",
        properties: {}
      },
    },
    async () => {
      // Aggregate status files
      const statusDir = "/home/.z/employee-status";
      const reports: string[] = [];
      
      if (fs.existsSync(statusDir)) {
        const files = fs.readdirSync(statusDir).filter(f => f.endsWith(".json"));
        for (const file of files) {
          const content = fs.readFileSync(`${statusDir}/${file}`, "utf-8");
          reports.push(`### ${file}\n${content}`);
        }
      }
      
      return { content: [{ type: "text", text: reports.join("\n---\n") || "No workforce data available" }] };
    }
  );
}
