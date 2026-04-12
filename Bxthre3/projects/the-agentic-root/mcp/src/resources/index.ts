/**
 * Agentic Resources - Read-only data access
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";

const ROSTER_PATH = "/home/.z/employee-status/EMPLOYEE_ROSTER.md";
const AGENTS_PATH = "/home/workspace/Bxthre3/AGENTS.md";
const INBOX_PATH = "/home/workspace/Bxthre3/INBOX.md";
const MANIFEST_PATH = "/home/workspace/Bxthre3/PROJECT_MANIFEST.md";
const PATTERNS_PATH = "/home/.z/supermemory/patterns.md";
const SUPERMEMORY_PATH = "/home/.z/supermemory";

export function registerAllResources(server: AgentOSServer) {
  // Agent roster
  server.addResource({
    uri: "agent://roster",
    name: "Employee Roster",
    description: "Complete roster of human and AI agents",
    mimeType: "text/markdown",
    text: fs.existsSync(ROSTER_PATH) ? fs.readFileSync(ROSTER_PATH, "utf-8") : "Roster not found"
  });

  // Workspace memory
  server.addResource({
    uri: "memory://workspace",
    name: "Workspace Memory",
    description: "AGENTS.md routing index",
    mimeType: "text/markdown",
    text: fs.existsSync(AGENTS_PATH) ? fs.readFileSync(AGENTS_PATH, "utf-8") : "AGENTS.md not found"
  });

  // Patterns
  server.addResource({
    uri: "memory://patterns",
    name: "Supermemory Patterns",
    description: "Stored patterns, observations, and decisions",
    mimeType: "text/markdown",
    text: fs.existsSync(PATTERNS_PATH) ? fs.readFileSync(PATTERNS_PATH, "utf-8") : "No patterns stored"
  });

  // Canonical INBOX
  server.addResource({
    uri: "inbox://canonical",
    name: "Canonical INBOX",
    description: "P0/P1 escalations (goes to brodiblanco)",
    mimeType: "text/markdown",
    text: fs.existsSync(INBOX_PATH) ? fs.readFileSync(INBOX_PATH, "utf-8") : "INBOX empty"
  });

  // Project manifest
  server.addResource({
    uri: "project://manifest",
    name: "Project Manifest",
    description: "All projects and their status",
    mimeType: "text/markdown",
    text: fs.existsSync(MANIFEST_PATH) ? fs.readFileSync(MANIFEST_PATH, "utf-8") : "Manifest not found"
  });

  // Departments index
  server.addResource({
    uri: "department://list",
    name: "Department Index",
    description: "All Agentic departments",
    mimeType: "text/markdown",
    get text() {
      const deptPath = "/home/workspace/Bxthre3/INBOX/departments";
      if (!fs.existsSync(deptPath)) return "No departments configured";
      const depts = fs.readdirSync(deptPath).filter(f => f.endsWith(".md")).map(f => f.replace(".md", ""));
      return `## Departments\n\n${depts.map(d => `- ${d}`).join("\n")}`;
    }
  });

  // Recent sprints
  server.addResource({
    uri: "sprint://current",
    name: "Current Sprint",
    description: "Most recent sprint report",
    mimeType: "text/markdown",
    get text() {
      const sprintsPath = "/home/workspace/Bxthre3/sprints";
      if (!fs.existsSync(sprintsPath)) return "No sprints found";
      const dirs = fs.readdirSync(sprintsPath).sort().reverse();
      for (const dir of dirs) {
        const reportPath = `${sprintsPath}/${dir}/engineering-report.md`;
        if (fs.existsSync(reportPath)) {
          return fs.readFileSync(reportPath, "utf-8");
        }
      }
      return "No current sprint report";
    }
  });

  // War room proposals
  server.addResource({
    uri: "warroom://proposals",
    name: "War Room Proposals",
    description: "Pending consensus proposals",
    mimeType: "text/markdown",
    get text() {
      const proposalsPath = "/home/workspace/Bxthre3/INBOX/departments/blue-ocean/proposals";
      if (!fs.existsSync(proposalsPath)) return "No proposals in War Room";
      const files = fs.readdirSync(proposalsPath).filter(f => f.endsWith(".md"));
      const proposals = files.map(f => fs.readFileSync(`${proposalsPath}/${f}`, "utf-8"));
      return proposals.join("\n\n---\n\n");
    }
  });

  // Grant pipeline summary
  server.addResource({
    uri: "grant://pipeline",
    name: "Grant Pipeline",
    description: "Grant opportunities summary",
    mimeType: "text/markdown",
    get text() {
      const pipelinePath = "/home/workspace/Bxthre3/grants/pipeline.csv";
      if (!fs.existsSync(pipelinePath)) return "No grant pipeline found";
      const csv = fs.readFileSync(pipelinePath, "utf-8");
      return `## Grant Pipeline\n\n\`\`\`\n${csv.substring(0, 2000)}...\n\`\`\``;
    }
  });

  // Deadlines
  server.addResource({
    uri: "deadline://upcoming",
    name: "Upcoming Deadlines",
    description: "Tracked deadlines",
    mimeType: "text/markdown",
    get text() {
      const deadlinePath = "/home/workspace/Bxthre3/tasks/DEADLINES.md";
      if (!fs.existsSync(deadlinePath)) return "No deadlines tracked";
      return fs.readFileSync(deadlinePath, "utf-8");
    }
  });

  // Individual agent status (dynamic)
  const statusDir = "/home/.z/employee-status";
  if (fs.existsSync(statusDir)) {
    const files = fs.readdirSync(statusDir).filter(f => f.endsWith(".json"));
    for (const file of files) {
      const agentId = file.replace(".json", "");
      server.addResource({
        uri: `agent://status/${agentId}`,
        name: `${agentId} Status`,
        description: `Status for agent ${agentId}`,
        mimeType: "application/json",
        get text() {
          return fs.readFileSync(`${statusDir}/${file}`, "utf-8");
        }
      });
    }
  }

  // Department INBOXes (dynamic)
  const deptPath = "/home/workspace/Bxthre3/INBOX/departments";
  if (fs.existsSync(deptPath)) {
    const files = fs.readdirSync(deptPath).filter(f => f.endsWith(".md"));
    for (const file of files) {
      const deptName = file.replace(".md", "");
      server.addResource({
        uri: `inbox://department/${deptName}`,
        name: `${deptName} INBOX`,
        description: `INBOX for ${deptName} department`,
        mimeType: "text/markdown",
        get text() {
          return fs.readFileSync(`${deptPath}/${file}`, "utf-8");
        }
      });
    }
  }

  // Project directories (dynamic)
  const projectsPath = "/home/workspace/Bxthre3/projects";
  if (fs.existsSync(projectsPath)) {
    const dirs = fs.readdirSync(projectsPath).filter(f => 
      fs.statSync(`${projectsPath}/${f}`).isDirectory()
    );
    for (const dir of dirs) {
      server.addResource({
        uri: `project://${dir}`,
        name: `${dir} Project`,
        description: `Project: ${dir}`,
        mimeType: "text/markdown",
        get text() {
          const readmePath = `${projectsPath}/${dir}/README.md`;
          if (fs.existsSync(readmePath)) {
            return fs.readFileSync(readmePath, "utf-8");
          }
          return `No README for ${dir}`;
        }
      });
    }
  }
}
