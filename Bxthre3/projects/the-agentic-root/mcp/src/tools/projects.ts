/**
 * Project & Department Tools
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";

const PROJECTS_PATH = "/home/workspace/Bxthre3/projects";
const MANIFEST_PATH = "/home/workspace/Bxthre3/PROJECT_MANIFEST.md";
const DEPT_INBOX_PATH = "/home/workspace/Bxthre3/INBOX/departments";

export function register(server: AgentOSServer) {
  // List all projects
  server.addTool(
    {
      name: "agentic_list_projects",
      description: "List all projects with their current status",
      inputSchema: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["active", "standby", "planning", "paused"], description: "Filter by status" }
        }
      }
    },
    async () => {
      let manifest = "";
      if (fs.existsSync(MANIFEST_PATH)) {
        manifest = fs.readFileSync(MANIFEST_PATH, "utf-8");
      }
      
      const projects: string[] = [];
      if (fs.existsSync(PROJECTS_PATH)) {
        const dirs = fs.readdirSync(PROJECTS_PATH);
        for (const dir of dirs) {
          if (fs.statSync(`${PROJECTS_PATH}/${dir}`).isDirectory()) {
            const readmePath = `${PROJECTS_PATH}/${dir}/README.md`;
            if (fs.existsSync(readmePath)) {
              const readme = fs.readFileSync(readmePath, "utf-8").substring(0, 500);
              projects.push(`## ${dir}\n${readme}...`);
            }
          }
        }
      }
      
      return { content: [{ type: "text", text: `## Project Manifest\n\n${manifest}\n\n## Project Directories\n\n${projects.join("\n\n---\n\n")}` }] };
    }
  );

  // Get specific project status
  server.addTool(
    {
      name: "agentic_get_project_status",
      description: "Get detailed status for a specific project",
      inputSchema: {
        type: "object",
        properties: {
          project_name: { type: "string", description: "Project name" }
        },
        required: ["project_name"]
      }
    },
    async (args) => {
      const projectPath = `${PROJECTS_PATH}/${args.project_name}`;
      
      if (!fs.existsSync(projectPath)) {
        return { content: [{ type: "text", text: `Project not found: ${args.project_name}` }] };
      }
      
      const files = fs.readdirSync(projectPath);
      const details: string[] = [];
      
      for (const file of ["README.md", "AGENTS.md", "STATUS.md"]) {
        if (files.includes(file)) {
          const content = fs.readFileSync(`${projectPath}/${file}`, "utf-8");
          details.push(`### ${file}\n${content}`);
        }
      }
      
      return { content: [{ type: "text", text: details.join("\n\n---\n\n") || "No details available" }] };
    }
  );

  // Get department status
  server.addTool(
    {
      name: "agentic_get_department_status",
      description: "Get status for a specific department",
      inputSchema: {
        type: "object",
        properties: {
          department: { type: "string", description: "Department name" }
        },
        required: ["department"]
      }
    },
    async (args) => {
      const deptPath = `${DEPT_INBOX_PATH}/${args.department}.md`;
      
      if (fs.existsSync(deptPath)) {
        const content = fs.readFileSync(deptPath, "utf-8");
        return { content: [{ type: "text", text: content }] };
      }
      
      if (!fs.existsSync(DEPT_INBOX_PATH)) {
        return { content: [{ type: "text", text: "No departments configured" }] };
      }
      
      const depts = fs.readdirSync(DEPT_INBOX_PATH).filter(f => f.endsWith(".md"));
      return { content: [{ type: "text", text: `Available departments:\n${depts.join("\n")}` }] };
    }
  );

  // Assign work to department
  server.addTool(
    {
      name: "agentic_assign_to_department",
      description: "Assign a task or work item to a department INBOX",
      inputSchema: {
        type: "object",
        properties: {
          department: { type: "string", description: "Target department" },
          work_item: { type: "string", description: "Work item description" },
          priority: { type: "string", enum: ["P1", "P2", "P3"], default: "P2" },
          from_agent: { type: "string", description: "Requesting agent" }
        },
        required: ["department", "work_item"]
      }
    },
    async (args) => {
      const deptPath = `${DEPT_INBOX_PATH}/${args.department}.md`;
      const deptName = args.department as string;
      const entry = `\n## 📋 Work Item\n**Priority:** ${args.priority || "P2"}\n**From:** ${args.from_agent || "MCP Client"}\n**Time:** ${new Date().toISOString()}\n\n${args.work_item}\n`;
      
      if (fs.existsSync(deptPath)) {
        fs.appendFileSync(deptPath, entry);
      } else {
        fs.writeFileSync(deptPath, `# ${deptName.toUpperCase()} Department\n${entry}`);
      }
      
      return { content: [{ type: "text", text: `Assigned to ${deptName} (${args.priority || "P2"}):\n\n${args.work_item}` }] };
    }
  );

  // List all departments
  server.addTool(
    {
      name: "agentic_list_departments",
      description: "List all Agentic departments",
      inputSchema: {
        type: "object",
        properties: {}
      }
    },
    async () => {
      if (!fs.existsSync(DEPT_INBOX_PATH)) {
        return { content: [{ type: "text", text: "No departments configured" }] };
      }
      
      const depts = fs.readdirSync(DEPT_INBOX_PATH).filter(f => f.endsWith(".md")).map(f => f.replace(".md", ""));
      return { content: [{ type: "text", text: `## Agentic Departments\n\n${depts.map(d => `- ${d}`).join("\n")}` }] };
    }
  );
}
