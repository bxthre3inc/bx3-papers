import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { loadConfig, getCriticalityForFile, shouldRequireApproval } from "./config-loader";

const PROPOSALS_DIR = "/home/workspace/Bxthre3/agentic/proposals";

export interface FileChange {
  path: string;
  originalContent: string | null;
  proposedContent: string;
  linesAdded: number;
  linesRemoved: number;
}

export interface Proposal {
  id: string;
  agent: string;
  timestamp: string;
  title: string;
  description: string;
  changes: FileChange[];
  riskScore: number;
  criticalityScore: number;
  status: "pending" | "approved" | "rejected" | "expired" | "executed";
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  executedAt?: string;
  dryRunResult?: {
    success: boolean;
    output: string;
    errors: string[];
  };
}

// Ensure proposals directory exists
if (!existsSync(PROPOSALS_DIR)) {
  mkdirSync(PROPOSALS_DIR, { recursive: true });
}

function generateProposalId(): string {
  return `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createProposal(
  agent: string,
  title: string,
  description: string,
  changes: FileChange[]
): Proposal {
  const config = loadConfig();
  
  // Calculate risk score
  const maxRisk = Math.max(...changes.map(c => {
    const criticality = getCriticalityForFile(c.path);
    const sizeRisk = Math.min((c.linesAdded + c.linesRemoved) / 10, 30);
    return criticality.score + sizeRisk;
  }));
  
  const criticalityScore = Math.max(...changes.map(c => 
    getCriticalityForFile(c.path).score
  ));
  
  const proposal: Proposal = {
    id: generateProposalId(),
    agent,
    timestamp: new Date().toISOString(),
    title,
    description,
    changes,
    riskScore: Math.round(maxRisk),
    criticalityScore,
    status: "pending"
  };
  
  // Run dry-run simulation
  proposal.dryRunResult = simulateExecution(proposal);
  
  // Save proposal
  saveProposal(proposal);
  
  // Check if auto-approvable
  if (proposal.riskScore <= config.proposals.autoApproveIfRiskBelow) {
    if (!config.safety.trainingWheelsMode) {
      executeProposal(proposal.id, "system-auto");
      return { ...proposal, status: "executed" };
    }
  }
  
  // Notify user
  notifyUser(proposal);
  
  return proposal;
}

function saveProposal(proposal: Proposal): void {
  const path = `${PROPOSALS_DIR}/${proposal.id}.json`;
  writeFileSync(path, JSON.stringify(proposal, null, 2));
}

export function loadProposal(id: string): Proposal | null {
  const path = `${PROPOSALS_DIR}/${id}.json`;
  if (!existsSync(path)) return null;
  
  try {
    const data = readFileSync(path, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function listProposals(status?: string): Proposal[] {
  const files = existsSync(PROPOSALS_DIR) 
    ? require("fs").readdirSync(PROPOSALS_DIR).filter((f: string) => f.endsWith(".json"))
    : [];
  
  const proposals: Proposal[] = [];
  for (const file of files) {
    try {
      const data = readFileSync(`${PROPOSALS_DIR}/${file}`, "utf-8");
      const proposal = JSON.parse(data);
      if (!status || proposal.status === status) {
        proposals.push(proposal);
      }
    } catch {
      // Skip corrupted files
    }
  }
  
  return proposals.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function approveProposal(id: string, approvedBy: string): boolean {
  const proposal = loadProposal(id);
  if (!proposal || proposal.status !== "pending") return false;
  
  proposal.status = "approved";
  proposal.approvedBy = approvedBy;
  proposal.approvedAt = new Date().toISOString();
  
  saveProposal(proposal);
  
  // Execute if not in training wheels
  const config = loadConfig();
  if (!config.safety.trainingWheelsMode && !config.safety.dryRunMode) {
    executeProposal(id, approvedBy);
  }
  
  return true;
}

export function rejectProposal(id: string, rejectedBy: string, reason: string): boolean {
  const proposal = loadProposal(id);
  if (!proposal || proposal.status !== "pending") return false;
  
  proposal.status = "rejected";
  proposal.rejectedBy = rejectedBy;
  proposal.rejectedAt = new Date().toISOString();
  proposal.rejectionReason = reason;
  
  saveProposal(proposal);
  return true;
}

export function executeProposal(id: string, executedBy: string): boolean {
  const proposal = loadProposal(id);
  if (!proposal) return false;
  
  // Execute each change
  const errors: string[] = [];
  for (const change of proposal.changes) {
    try {
      const dir = change.path.split("/").slice(0, -1).join("/");
      if (dir && !existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(change.path, change.proposedContent);
    } catch (err) {
      errors.push(`Failed to write ${change.path}: ${err}`);
    }
  }
  
  proposal.status = errors.length > 0 ? "pending" : "executed";
  proposal.executedAt = new Date().toISOString();
  
  saveProposal(proposal);
  return errors.length === 0;
}

function simulateExecution(proposal: Proposal): { success: boolean; output: string; errors: string[] } {
  const errors: string[] = [];
  
  for (const change of proposal.changes) {
    // Check if file is protected
    if (shouldRequireApproval(change.path, change.linesAdded + change.linesRemoved, change.originalContent === null)) {
      errors.push(`${change.path}: Requires approval (protected file)`);
    }
    
    // Check if directory exists for new files
    if (change.originalContent === null) {
      const dir = change.path.split("/").slice(0, -1).join("/");
      if (dir && !existsSync(dir)) {
        errors.push(`${change.path}: Parent directory doesn't exist (will be created)`);
      }
    }
  }
  
  return {
    success: errors.length === 0,
    output: `Dry-run: ${proposal.changes.length} files would be modified`,
    errors
  };
}

function notifyUser(proposal: Proposal): void {
  const config = loadConfig();
  if (!config.notifications.onProposalCreated) return;
  
  // Log to inbox
  const timestamp = new Date().toISOString();
  const lines = proposal.changes.reduce((sum, c) => sum + c.linesAdded + c.linesRemoved, 0);
  
  console.log(`[${timestamp}] [${proposal.agent}] [PROPOSAL-${proposal.status.toUpperCase()}] ${proposal.title}`);
  console.log(`  Risk: ${proposal.riskScore}/100 | Criticality: ${proposal.criticalityScore}/100 | Files: ${proposal.changes.length} | Lines: ${lines}`);
  console.log(`  View: https://brodiblanco.zo.space/agentic/proposals/${proposal.id}`);
  console.log(`  Approve: https://brodiblanco.zo.space/agentic/api/proposals/${proposal.id}/approve`);
}

export function generateDiff(proposal: Proposal): string {
  let diff = `Proposal ${proposal.id} - ${proposal.title}\n`;
  diff += `Agent: ${proposal.agent} | Risk: ${proposal.riskScore}/100\n`;
  diff += `Status: ${proposal.status.toUpperCase()}\n\n`;
  
  for (const change of proposal.changes) {
    diff += `=== ${change.path} ===\n`;
    if (change.originalContent === null) {
      diff += "+++ New file\n";
      diff += change.proposedContent.split("\n").map(l => `+ ${l}`).join("\n");
    } else {
      diff += "--- Original\n";
      diff += change.originalContent.split("\n").map(l => `- ${l}`).join("\n");
      diff += "\n+++ Proposed\n";
      diff += change.proposedContent.split("\n").map(l => `+ ${l}`).join("\n");
    }
    diff += "\n\n";
  }
  
  return diff;
}
