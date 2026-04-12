/**
 * War Room Tools - 4/5 Consensus Voting
 */

import { AgentOSServer } from "../server.js";
import * as fs from "fs";
import * as path from "path";

const WARROOM_PATH = "/home/workspace/Bxthre3/INBOX/departments/blue-ocean";

export function register(server: AgentOSServer) {
  // Submit proposal for voting
  server.addTool(
    {
      name: "agentic_warroom_submit",
      description: "Submit a proposal to the War Room for 4/5 consensus voting",
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Proposal title"
          },
          description: {
            type: "string",
            description: "Full proposal description"
          },
          proponent: {
            type: "string",
            description: "Agent or person submitting"
          },
          type: {
            type: "string",
            enum: ["strategy", "technical", "investment", "partnership", "other"],
            default: "other"
          }
        },
        required: ["title", "description"]
      }
    },
    async (args) => {
      const proposalId = `PROP-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      const proposal = `# War Room Proposal: ${args.title}
**ID:** ${proposalId}
**Proponent:** ${args.proponent || "MCP Client"}
**Type:** ${args.type || "other"}
**Status:** PENDING_VOTE
**Submitted:** ${timestamp}

## Description
${args.description}

## Votes
| Agent | Vote | Reasoning |
|-------|------|-----------|
| | | |

## Outcome
*Pending*
`;
      
      // Create proposal file
      const proposalDir = `${WARROOM_PATH}/proposals`;
      if (!fs.existsSync(proposalDir)) {
        fs.mkdirSync(proposalDir, { recursive: true });
      }
      fs.writeFileSync(`${proposalDir}/${proposalId}.md`, proposal);
      
      return { content: [{ type: "text", text: `Proposal submitted: ${proposalId}\n\n## ${args.title}\n\n${args.description}\n\nStatus: Pending 4/5 consensus vote` }] };
    }
  );

  // Cast vote
  server.addTool(
    {
      name: "agentic_warroom_vote",
      description: "Cast a vote on a War Room proposal",
      inputSchema: {
        type: "object",
        properties: {
          proposal_id: {
            type: "string",
            description: "Proposal ID (e.g., PROP-1234567890)"
          },
          vote: {
            type: "string",
            enum: ["APPROVE", "REJECT", "ABSTAIN"],
            description: "Your vote"
          },
          voter: {
            type: "string",
            description: "Agent or person casting vote"
          },
          reasoning: {
            type: "string",
            description: "Brief reasoning for vote"
          }
        },
        required: ["proposal_id", "vote", "voter"]
      }
    },
    async (args) => {
      const proposalDir = `${WARROOM_PATH}/proposals`;
      const proposalPath = `${proposalDir}/${args.proposal_id}.md`;
      
      if (!fs.existsSync(proposalPath)) {
        return { content: [{ type: "text", text: `Proposal not found: ${args.proposal_id}` }] };
      }
      
      let content = fs.readFileSync(proposalPath, "utf-8");
      
      // Update votes table
      const voteLine = `| ${args.voter} | ${args.vote} | ${args.reasoning || ""} |`;
      content = content.replace("| Agent | Vote | Reasoning |", `| Agent | Vote | Reasoning |\n${voteLine}`);
      
      // Count votes
      const approves = (content.match(/APPROVE/g) || []).length;
      const rejects = (content.match(/REJECT/g) || []).length;
      
      // Check consensus (4/5)
      if (approves >= 4) {
        content = content.replace("**Status:** PENDING_VOTE", "**Status:** APPROVED");
        content = content.replace("*Pending*", `*Approved ${new Date().toISOString()}*`);
      } else if (rejects >= 2) {
        content = content.replace("**Status:** PENDING_VOTE", "**Status:** REJECTED");
        content = content.replace("*Pending*", `*Rejected ${new Date().toISOString()}*`);
      }
      
      fs.writeFileSync(proposalPath, content);
      
      return { content: [{ type: "text", text: `Vote recorded: ${args.voter} → ${args.vote}\n\nProposal: ${args.proposal_id}\nCurrent tally: ${approves} approve, ${rejects} reject` }] };
    }
  );

  // Check proposal status
  server.addTool(
    {
      name: "agentic_warroom_status",
      description: "Check status of a War Room proposal",
      inputSchema: {
        type: "object",
        properties: {
          proposal_id: {
            type: "string",
            description: "Proposal ID"
          }
        },
        required: ["proposal_id"]
      }
    },
    async (args) => {
      const proposalDir = `${WARROOM_PATH}/proposals`;
      const proposalPath = `${proposalDir}/${args.proposal_id}.md`;
      
      if (!fs.existsSync(proposalPath)) {
        return { content: [{ type: "text", text: `Proposal not found: ${args.proposal_id}` }] };
      }
      
      const content = fs.readFileSync(proposalPath, "utf-8");
      return { content: [{ type: "text", text: content }] };
    }
  );

  // List pending proposals
  server.addTool(
    {
      name: "agentic_warroom_list",
      description: "List all War Room proposals",
      inputSchema: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["PENDING_VOTE", "APPROVED", "REJECTED"],
            description: "Filter by status"
          }
        }
      }
    },
    async (args) => {
      const proposalDir = `${WARROOM_PATH}/proposals`;
      
      if (!fs.existsSync(proposalDir)) {
        return { content: [{ type: "text", text: "No proposals in War Room" }] };
      }
      
      const files = fs.readdirSync(proposalDir).filter(f => f.endsWith(".md"));
      const proposals: string[] = [];
      
      for (const file of files) {
        const content = fs.readFileSync(`${proposalDir}/${file}`, "utf-8");
        const status = content.match(/\*\*Status:\*\* (\w+)/)?.[1];
        
        if (!args.status || status === args.status) {
          proposals.push(content);
        }
      }
      
      return { content: [{ type: "text", text: proposals.join("\n\n---\n\n") }] };
    }
  );
}
