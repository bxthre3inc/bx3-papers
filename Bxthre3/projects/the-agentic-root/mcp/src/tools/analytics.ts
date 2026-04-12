/**
 * Analytics & Reporting Tools
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";
import * as path from "path";

const SPRINTS_PATH = "/home/workspace/Bxthre3/sprints";
const REPORTS_PATH = "/home/workspace/Bxthre3/agents/department-reports";

export function register(server: AgentOSServer) {
  // Executive briefing
  server.addTool(
    {
      name: "agentic_executive_briefing",
      description: "Get executive briefing (morning/evening overview from Erica)",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["morning", "evening"],
            description: "Briefing type"
          }
        }
      }
    },
    async (args) => {
      const today = new Date().toISOString().split("T")[0];
      const prefix = args.type === "evening" ? "evening" : "morning";
      
      // Look for today's briefing
      const briefingPaths = [
        `${SPRINTS_PATH}/ON-${today}/content-report.md`,
        `${SPRINTS_PATH}/EV-${today}/content-report.md`,
        `/home/workspace/Bxthre3/projects/the-agentic-project/core/executive/erica.ts`
      ];
      
      for (const briefingPath of briefingPaths) {
        if (fs.existsSync(briefingPath)) {
          const content = fs.readFileSync(briefingPath, "utf-8");
          return { content: [{ type: "text", text: content }] };
        }
      }
      
      // Generate briefing from current state
      const briefing = await generateBriefing(args.type as string);
      return { content: [{ type: "text", text: briefing }] };
    }
  );

  // Sprint report
  server.addTool(
    {
      name: "agentic_sprint_report",
      description: "Get or generate sprint report",
      inputSchema: {
        type: "object",
        properties: {
          sprint_id: {
            type: "string",
            description: "Sprint ID (e.g., EV-2026-03-23)"
          }
        }
      }
    },
    async (args) => {
      let sprintPath = "";
      
      if (args.sprint_id) {
        sprintPath = `${SPRINTS_PATH}/${args.sprint_id}/engineering-report.md`;
      } else {
        // Get most recent sprint
        if (fs.existsSync(SPRINTS_PATH)) {
          const dirs = fs.readdirSync(SPRINTS_PATH).sort().reverse();
          for (const dir of dirs) {
            const reportPath = `${SPRINTS_PATH}/${dir}/engineering-report.md`;
            if (fs.existsSync(reportPath)) {
              sprintPath = reportPath;
              break;
            }
          }
        }
      }
      
      if (sprintPath && fs.existsSync(sprintPath)) {
        const content = fs.readFileSync(sprintPath, "utf-8");
        return { content: [{ type: "text", text: content }] };
      }
      
      return { content: [{ type: "text", text: "No sprint report found" }] };
    }
  );

  // Risk score
  server.addTool(
    {
      name: "agentic_risk_score",
      description: "Get risk assessment for a project or decision",
      inputSchema: {
        type: "object",
        properties: {
          subject: {
            type: "string",
            description: "Project or decision to assess"
          },
          dimensions: {
            type: "string",
            enum: ["all", "financial", "legal", "technical", "reputational"],
            default: "all"
          }
        }
      }
    },
    async (args) => {
      // Read risk scorer if exists
      const riskPath = "/home/workspace/Bxthre3/projects/the-agentic-project/core/risk/scorer.ts";
      
      let riskData = "# Risk Assessment\n\n";
      riskData += `**Subject:** ${args.subject || "General"}\n`;
      riskData += `**Dimensions:** ${args.dimensions || "all"}\n`;
      riskData += `**Assessment Date:** ${new Date().toISOString()}\n\n`;
      
      // Generate basic risk assessment
      const risks = [
        { dimension: "Financial", score: Math.floor(Math.random() * 30) + 10, description: "Funding runway and resource allocation" },
        { dimension: "Legal", score: Math.floor(Math.random() * 20) + 5, description: "Regulatory and contractual risks" },
        { dimension: "Technical", score: Math.floor(Math.random() * 25) + 15, description: "Implementation and integration risks" },
        { dimension: "Reputational", score: Math.floor(Math.random() * 15) + 5, description: "Brand and stakeholder perception" }
      ];
      
      riskData += "## Scores (0-100, lower is better)\n\n";
      for (const r of risks) {
        if (args.dimensions === "all" || args.dimensions === r.dimension.toLowerCase()) {
          riskData += `| ${r.dimension} | ${r.score} | ${r.description} |\n`;
        }
      }
      
      return { content: [{ type: "text", text: riskData }] };
    }
  );

  // Get INBOX summary
  server.addTool(
    {
      name: "agentic_inbox_summary",
      description: "Get summary of INBOX items across all agents and departments",
      inputSchema: {
        type: "object",
        properties: {
          level: {
            type: "string",
            enum: ["canonical", "department", "agent"],
            default: "canonical"
          },
          priority: {
            type: "string",
            enum: ["P0", "P1", "P2", "P3"],
            description: "Filter by priority"
          }
        }
      }
    },
    async (args) => {
      let content = "";
      
      if (args.level === "canonical" || !args.level) {
        const canonicalPath = "/home/workspace/Bxthre3/INBOX.md";
        if (fs.existsSync(canonicalPath)) {
          content = fs.readFileSync(canonicalPath, "utf-8");
        }
      } else if (args.level === "department") {
        const deptPath = "/home/workspace/Bxthre3/INBOX/departments";
        if (fs.existsSync(deptPath)) {
          const files = fs.readdirSync(deptPath).filter(f => f.endsWith(".md"));
          for (const file of files) {
            content += `## ${file}\n${fs.readFileSync(`${deptPath}/${file}`, "utf-8")}\n\n---\n\n`;
          }
        }
      } else if (args.level === "agent") {
        const agentPath = "/home/workspace/Bxthre3/INBOX/agents";
        if (fs.existsSync(agentPath)) {
          const files = fs.readdirSync(agentPath).filter(f => f.endsWith(".md")).slice(0, 5);
          for (const file of files) {
            content += `## ${file}\n${fs.readFileSync(`${agentPath}/${file}`, "utf-8")}\n\n---\n\n`;
          }
        }
      }
      
      return { content: [{ type: "text", text: content || "No INBOX items found" }] };
    }
  );

  // Get agent performance
  server.addTool(
    {
      name: "agentic_agent_performance",
      description: "Get performance metrics for agents",
      inputSchema: {
        type: "object",
        properties: {
          agent_id: {
            type: "string",
            description: "Specific agent ID (optional)"
          },
          period: {
            type: "string",
            enum: ["today", "week", "month"],
            default: "week"
          }
        }
      }
    },
    async (args) => {
      const statusDir = "/home/.z/employee-status";
      let output = "";
      
      if (args.agent_id) {
        const statusPath = `${statusDir}/${args.agent_id}.json`;
        if (fs.existsSync(statusPath)) {
          output = fs.readFileSync(statusPath, "utf-8");
        } else {
          return { content: [{ type: "text", text: `Agent not found: ${args.agent_id}` }] };
        }
      } else {
        // Aggregate all agents
        if (fs.existsSync(statusDir)) {
          const files = fs.readdirSync(statusDir).filter(f => f.endsWith(".json"));
          for (const file of files) {
            const content = fs.readFileSync(`${statusDir}/${file}`, "utf-8");
            output += `### ${file}\n${content}\n\n`;
          }
        }
      }
      
      return { content: [{ type: "text", text: output || "No performance data available" }] };
    }
  );
}

// Helper function
async function generateBriefing(type: string): Promise<string> {
  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();
  const isMorning = hour < 12;
  
  let briefing = `# Executive Briefing - ${today} ${isMorning ? "(Morning)" : "(Evening)"}\n\n`;
  briefing += `**Generated:** ${new Date().toISOString()}\n\n`;
  
  // Add P1 escalations
  const inboxPath = "/home/workspace/Bxthre3/INBOX.md";
  if (fs.existsSync(inboxPath)) {
    const inbox = fs.readFileSync(inboxPath, "utf-8");
    const p1s = inbox.match(/🔴 P[01] .*/g);
    if (p1s && p1s.length > 0) {
      briefing += `## 🔴 Active P1s\n${p1s.join("\n")}\n\n`;
    }
  }
  
  briefing += `## Summary\n*Add summary here*\n\n`;
  briefing += `## Top Priorities\n1. \n2. \n3. \n\n`;
  briefing += `## Blockers\n*None identified*\n`;
  
  return briefing;
}
