// Master Orchestrator — Unified Agentic Core
// Brings together: Work Gen, Autonomy, Multi-Tenant, Payments, Physical World

import { workspaceManager } from './workspace-manager';
import { killSwitch, KillSwitchLevel } from './kill-switch';
import { cryptoRails } from './crypto-rails';
import { physicalWorld } from './physical-world';
import { workGenerator } from './work-generator';

export interface AgentOSCore {
  // Workspaces
  workspaces: typeof workspaceManager;
  
  // Safety
  killSwitch: typeof killSwitch;
  
  // Financial
  payments: typeof cryptoRails;
  
  // Physical
  physical: typeof physicalWorld;
  
  // Work
  work: typeof workGenerator;
  
  // Status
  status: () => AgentOSStatus;
}

export interface AgentOSStatus {
  uptime: string;
  activeWorkspace: string;
  autonomyLevel: KillSwitchLevel;
  pendingApprovals: number;
  workspaces: number;
  employees: number;
  tasks: number;
  paymentsConnected: boolean;
  physicalConnected: boolean;
  integrations: {
    gmail: boolean;
    calendar: boolean;
    tasks: boolean;
    github: boolean;
    sms: boolean;
    crypto: boolean;
    sensors: boolean;
  };
}

class MasterOrchestrator implements AgentOSCore {
  private startTime: Date;
  
  workspaces = workspaceManager;
  killSwitch = killSwitch;
  payments = cryptoRails;
  physical = physicalWorld;
  work = workGenerator;

  constructor() {
    this.startTime = new Date();
  }

  status(): AgentOSStatus {
    const killSwitchStatus = killSwitch.getStatus();
    
    return {
      uptime: this.getUptime(),
      activeWorkspace: 'bxthre3',
      autonomyLevel: killSwitchStatus.level,
      pendingApprovals: killSwitchStatus.pendingApprovals,
      workspaces: workspaceManager.getAll().length,
      employees: 14,
      tasks: workGenerator.getStats().totalTasks,
      paymentsConnected: true,
      physicalConnected: true,
      integrations: {
        gmail: true,
        calendar: true,
        tasks: true,
        github: true,
        sms: true,
        crypto: true,
        sensors: true
      }
    };
  }

  private getUptime(): string {
    const now = new Date();
    const diff = now.getTime() - this.startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  // Full status report for dashboard
  getFullReport(): {
    status: AgentOSStatus;
    workspaces: ReturnType<typeof workspaceManager.getAll>;
    payments: ReturnType<typeof cryptoRails.getSummary>;
    physical: ReturnType<typeof physicalWorld.getDashboardSummary>;
    tasks: ReturnType<typeof workGenerator.getStats>;
    snapshots: ReturnType<typeof killSwitch.getSnapshots>;
  } {
    return {
      status: this.status(),
      workspaces: workspaceManager.getAll(),
      payments: cryptoRails.getSummary(),
      physical: physicalWorld.getDashboardSummary(),
      tasks: workGenerator.getStats(),
      snapshots: killSwitch.getSnapshots()
    };
  }
}

export const agentOSCore = new MasterOrchestrator();
