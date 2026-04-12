import { readFileSync, writeFileSync } from "fs";

const CONFIG_PATH = "/home/workspace/Bxthre3/agentic/settings/config.json";

export interface Config {
  version: string;
  safety: {
    trainingWheelsMode: boolean;
    dryRunMode: boolean;
    maxAutoRiskScore: number;
    requireApprovalAboveLines: number;
    requireApprovalIfDeletes: boolean;
    requireApprovalIfModifies: string[];
  };
  proposals: {
    autoCreateForRiskBelow: number;
    autoApproveIfRiskBelow: number;
    expireAfterHours: number;
    maxPendingProposals: number;
  };
  criticality: {
    levels: Record<string, number>;
    rules: Array<{
      pattern: string;
      level: string;
      reason: string;
    }>;
  };
  notifications: Record<string, boolean>;
  audit: {
    logAllActions: boolean;
    logDryRuns: boolean;
    retentionDays: number;
    includeDiffs: boolean;
  };
}

let cachedConfig: Config | null = null;

export function loadConfig(): Config {
  if (cachedConfig) return cachedConfig;
  
  try {
    const data = readFileSync(CONFIG_PATH, "utf-8");
    cachedConfig = JSON.parse(data);
    return cachedConfig!;
  } catch {
    throw new Error(`Failed to load config from ${CONFIG_PATH}`);
  }
}

export function saveConfig(config: Config): void {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  cachedConfig = config;
}

export function isTrainingWheelsEnabled(): boolean {
  return loadConfig().safety.trainingWheelsMode;
}

export function enableTrainingWheels(): void {
  const config = loadConfig();
  config.safety.trainingWheelsMode = true;
  config.safety.dryRunMode = true;
  saveConfig(config);
}

export function disableTrainingWheels(): void {
  const config = loadConfig();
  config.safety.trainingWheelsMode = false;
  config.safety.dryRunMode = false;
  saveConfig(config);
}

export function getCriticalityForFile(filePath: string): { level: string; score: number; reason: string } {
  const config = loadConfig();
  const filename = filePath.split("/").pop() || "";
  
  for (const rule of config.criticality.rules) {
    const pattern = rule.pattern
      .replace(/\./g, "\\.")
      .replace(/\*/g, ".*");
    const regex = new RegExp(pattern, "i");
    
    if (regex.test(filename) || regex.test(filePath)) {
      const score = config.criticality.levels[rule.level] || 50;
      return { level: rule.level, score, reason: rule.reason };
    }
  }
  
  return { level: "MEDIUM", score: 40, reason: "Default" };
}

export function shouldRequireApproval(filePath: string, linesChanged: number, isDeletion: boolean): boolean {
  const config = loadConfig();
  const criticality = getCriticalityForFile(filePath);
  
  // Critical files always require approval
  if (criticality.level === "CRITICAL") return true;
  
  // Large changes require approval
  if (linesChanged > config.safety.requireApprovalAboveLines) return true;
  
  // Deletions require approval
  if (isDeletion && config.safety.requireApprovalIfDeletes) return true;
  
  // Pattern matches require approval
  for (const pattern of config.safety.requireApprovalIfModifies) {
    const regex = new RegExp(pattern.replace(/\./g, "\\.").replace(/\*/g, ".*"), "i");
    if (regex.test(filePath)) return true;
  }
  
  return false;
}

export function canAutoExecute(riskScore: number): boolean {
  const config = loadConfig();
  return !config.safety.trainingWheelsMode && 
         !config.safety.dryRunMode && 
         riskScore <= config.safety.maxAutoRiskScore;
}
