/**
 * Grants & Deadlines Tools
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";

const GRANTS_PATH = "/home/workspace/Bxthre3/grants";
const DEADLINE_PATH = "/home/workspace/Bxthre3/tasks";

export function register(server: AgentOSServer) {
  // List grant opportunities
  server.addTool(
    {
      name: "agentic_grants_list",
      description: "List grant opportunities from pipeline",
      inputSchema: {
        type: "object",
        properties: {
          batch: {
            type: "string",
            description: "Filter by batch (e.g., BATCH-01-FED-US)"
          },
          status: {
            type: "string",
            enum: ["open", "submitted", "awarded", "closed"],
            description: "Filter by status"
          }
        }
      }
    },
    async (args) => {
      const pipelinePath = `${GRANTS_PATH}/pipeline.csv`;
      
      if (!fs.existsSync(pipelinePath)) {
        return { content: [{ type: "text", text: "No grant pipeline found" }] };
      }
      
      const csv = fs.readFileSync(pipelinePath, "utf-8");
      const lines = csv.split("\n");
      
      let filtered = lines;
      if (args.batch) {
        filtered = lines.filter(line => line.includes(args.batch as string));
      }
      
      return { content: [{ type: "text", text: filtered.join("\n") }] };
    }
  );

  // Get grant deadlines
  server.addTool(
    {
      name: "agentic_grant_deadlines",
      description: "Get upcoming grant deadlines",
      inputSchema: {
        type: "object",
        properties: {
          days: {
            type: "number",
            default: 30,
            description: "Look ahead days"
          }
        }
      }
    },
    async () => {
      const deadlineFile = `${DEADLINE_PATH}/DEADLINES.md`;
      let content = "No deadlines found";
      
      if (fs.existsSync(deadlineFile)) {
        content = fs.readFileSync(deadlineFile, "utf-8");
      }
      
      return { content: [{ type: "text", text: content }] };
    }
  );

  // Add deadline
  server.addTool(
    {
      name: "agentic_deadline_add",
      description: "Add a new deadline to track",
      inputSchema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Deadline title" },
          date: { type: "string", description: "Deadline date (YYYY-MM-DD)" },
          type: { type: "string", enum: ["grant", "patent", "report", "meeting", "other"], default: "other" },
          priority: { type: "string", enum: ["P0", "P1", "P2", "P3"], default: "P2" }
        },
        required: ["title", "date"]
      }
    },
    async (args) => {
      const deadlineFile = `${DEADLINE_PATH}/DEADLINES.md`;
      const deadlineType = (args.type as string)?.toUpperCase() || "DEADLINE";
      const entry = `\n## ${deadlineType}: ${args.title}\n**Date:** ${args.date}\n**Priority:** ${args.priority || "P2"}\n**Created:** ${new Date().toISOString()}\n`;
      
      if (fs.existsSync(deadlineFile)) {
        fs.appendFileSync(deadlineFile, entry);
      } else {
        fs.writeFileSync(deadlineFile, `# Deadlines\n${entry}`);
      }
      
      return { content: [{ type: "text", text: `Deadline added:\n\n## ${args.title}\nDate: ${args.date}\nType: ${args.type || "other"}\nPriority: ${args.priority || "P2"}` }] };
    }
  );

  // List all deadlines
  server.addTool(
    {
      name: "agentic_deadline_list",
      description: "List all tracked deadlines",
      inputSchema: {
        type: "object",
        properties: {
          upcoming_only: { type: "boolean", default: true, description: "Only show upcoming deadlines" }
        }
      }
    },
    async () => {
      const deadlineFile = `${DEADLINE_PATH}/DEADLINES.md`;
      
      if (!fs.existsSync(deadlineFile)) {
        return { content: [{ type: "text", text: "No deadlines tracked" }] };
      }
      
      const content = fs.readFileSync(deadlineFile, "utf-8");
      return { content: [{ type: "text", text: content }] };
    }
  );

  // Track grant application
  server.addTool(
    {
      name: "agentic_grants_track",
      description: "Track a grant application status",
      inputSchema: {
        type: "object",
        properties: {
          grant_name: { type: "string", description: "Name of the grant" },
          status: { type: "string", enum: ["researching", "drafting", "submitted", "awarded", "rejected"] },
          notes: { type: "string", description: "Additional notes" }
        },
        required: ["grant_name", "status"]
      }
    },
    async (args) => {
      const trackingFile = `${GRANTS_PATH}/TRACKING.md`;
      const entry = `\n## ${args.grant_name}\n**Status:** ${args.status}\n**Updated:** ${new Date().toISOString()}\n${args.notes ? `**Notes:** ${args.notes}` : ""}\n`;
      
      if (fs.existsSync(trackingFile)) {
        fs.appendFileSync(trackingFile, entry);
      } else {
        fs.writeFileSync(trackingFile, `# Grant Tracking\n${entry}`);
      }
      
      return { content: [{ type: "text", text: `Grant tracked:\n\n## ${args.grant_name}\nStatus: ${args.status}\n${args.notes ? `Notes: ${args.notes}` : ""}` }] };
    }
  );
}
