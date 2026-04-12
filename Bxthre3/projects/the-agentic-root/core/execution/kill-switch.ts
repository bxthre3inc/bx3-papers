// Kill Switches & Emergency Reversion
// Prevents autonomous actions that could cause harm
// Allows instant shutdown or rollback of autonomous mode

export enum KillSwitchLevel {
  NONE = 'none',           // Full manual control
  LOW = 'low',             // High-risk actions need approval
  MEDIUM = 'medium',       // Most actions need approval
  HIGH = 'high',           // All actions need approval
  LOCKDOWN = 'lockdown'    // No autonomous actions, freeze everything
}

export interface KillSwitchConfig {
  level: KillSwitchLevel;
  // What requires approval
  requiresApproval: {
    financial: boolean;      // Any money movement
    external: boolean;       // Emails, messages to external
    hiring: boolean;         // Employee changes
    deletion: boolean;       // Deleting data
    deployment: boolean;     // Deploying code
    grantSubmission: boolean; // Submitting grants
    legal: boolean;          // Legal documents
    social: boolean;         // Social media posts
  };
  // Per-employee autonomy levels
  employeeOverrides: Map<string, KillSwitchLevel>;
  // Auto-revert trigger conditions
  autoRevertTriggers: {
    financialLossThreshold: number;    // $ threshold
    reputationRiskScore: number;       // 0-100 score
    complianceViolationRisk: boolean;
    employeeBlockerRate: number;       // % of employees blocked
  };
}

class KillSwitchManager {
  private config: KillSwitchConfig;
  private auditLog: { action: string; timestamp: string; approved: boolean; by: string }[] = [];
  private revertSnapshots: Map<string, string> = new Map(); // key -> state snapshot

  constructor() {
    this.config = {
      level: KillSwitchLevel.MEDIUM,
      requiresApproval: {
        financial: true,
        external: true,
        hiring: true,
        deletion: true,
        deployment: true,
        grantSubmission: true,
        legal: true,
        social: true
      },
      employeeOverrides: new Map(),
      autoRevertTriggers: {
        financialLossThreshold: 10000,  // $10k
        reputationRiskScore: 70,        // 70% risk
        complianceViolationRisk: false,
        employeeBlockerRate: 0.5        // 50% blocked
      }
    };

    // Create initial snapshot
    this.createSnapshot('initial', 'System baseline established');
  }

  // Check if action requires approval
  requiresApproval(actionType: keyof KillSwitchConfig['requiresApproval']): boolean {
    return this.config.requiresApproval[actionType];
  }

  // Request approval for autonomous action
  async requestApproval(
    action: string,
    details: string,
    employeeId: string
  ): Promise<{ approved: boolean; reason?: string }> {
    const actionType = this.categorizeAction(action);
    
    if (!this.requiresApproval(actionType)) {
      return { approved: true };
    }

    // Check for employee override
    const override = this.config.employeeOverrides.get(employeeId);
    if (override && override === KillSwitchLevel.LOW) {
      return { approved: true };
    }

    // Log for audit
    this.auditLog.push({
      action: `${action}: ${details}`,
      timestamp: new Date().toISOString(),
      approved: false, // Pending
      by: employeeId
    });

    // In full autonomy mode, this would auto-approve within limits
    // For now, return pending (user must approve)
    return { 
      approved: false, 
      reason: `Requires ${actionType} approval` 
    };
  }

  // Categorize action type
  private categorizeAction(action: string): keyof KillSwitchConfig['requiresApproval'] {
    const lower = action.toLowerCase();
    if (lower.includes('financial') || lower.includes('payment') || lower.includes('budget')) return 'financial';
    if (lower.includes('email') || lower.includes('message') || lower.includes('external')) return 'external';
    if (lower.includes('hire') || lower.includes('fire') || lower.includes('employee')) return 'hiring';
    if (lower.includes('delete') || lower.includes('remove')) return 'deletion';
    if (lower.includes('deploy') || lower.includes('release')) return 'deployment';
    if (lower.includes('grant')) return 'grantSubmission';
    if (lower.includes('legal') || lower.includes('contract')) return 'legal';
    if (lower.includes('social') || lower.includes('post')) return 'social';
    return 'external'; // Default
  }

  // Set kill switch level
  setLevel(level: KillSwitchLevel): void {
    this.config.level = level;
    this.createSnapshot('level_change', `Kill switch set to ${level}`);
  }

  // Create snapshot for potential revert
  createSnapshot(key: string, description: string): void {
    const snapshot = {
      timestamp: new Date().toISOString(),
      description,
      config: { ...this.config },
      level: this.config.level
    };
    this.revertSnapshots.set(key, JSON.stringify(snapshot));
  }

  // Reversion to previous state
  revertTo(key: string): boolean {
    const snapshot = this.revertSnapshots.get(key);
    if (!snapshot) return false;

    try {
      const parsed = JSON.parse(snapshot);
      this.config = parsed.config;
      this.createSnapshot('post_revert', `Reverted to ${key}`);
      return true;
    } catch {
      return false;
    }
  }

  // Get list of snapshots
  getSnapshots(): { key: string; timestamp: string; description: string }[] {
    const snapshots: { key: string; timestamp: string; description: string }[] = [];
    
    for (const [key, value] of this.revertSnapshots) {
      try {
        const parsed = JSON.parse(value);
        snapshots.push({
          key,
          timestamp: parsed.timestamp,
          description: parsed.description
        });
      } catch {}
    }
    
    return snapshots.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Emergency lockdown
  emergencyLockdown(reason: string): void {
    this.config.level = KillSwitchLevel.LOCKDOWN;
    this.createSnapshot('emergency', `Emergency lockdown: ${reason}`);
    
    // Log all pending actions as cancelled
    this.auditLog = this.auditLog.map(log => ({
      ...log,
      approved: false,
      by: 'EMERGENCY_LOCKDOWN'
    }));
  }

  // Get audit log
  getAuditLog(): typeof this.auditLog {
    return [...this.auditLog];
  }

  // Get current status
  getStatus(): { level: KillSwitchLevel; pendingApprovals: number } {
    return {
      level: this.config.level,
      pendingApprovals: this.auditLog.filter(l => !l.approved).length
    };
  }
}

export const killSwitch = new KillSwitchManager();
