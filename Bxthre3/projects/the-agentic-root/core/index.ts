// Agentic 3.0 — Core Integration
// Phase 8 of Agentic 3.0 Implementation
// This is the unified export of all Agentic capabilities

// Phase 1: Supermemory Foundation
import { memory, userProfile } from './memory/store';
export { memory, userProfile };
export type { MemoryNode, MemoryEdge, QueryResult, UserProfile } from './memory/types';

// Phase 2: Employee Hierarchy
import { org } from './hierarchy/org';
export { org };
export type { 
  Employee, 
  Manager, 
  Executive, 
  EmployeeRole, 
  Department, 
  Shift,
  Blocker 
} from './hierarchy/types';

// Phase 3: Standup Protocol
import { router } from './protocol/messaging';
export { router };
export type { 
  StandupMessage, 
  StandupReport, 
  Accomplishment, 
  BlockerReport, 
  Request,
  Envelope 
} from './protocol/types';

// Phase 4: Escalation Clock
import { escalationClock } from './escalation/clock';
export { escalationClock };

// Phase 5: 12-Hour Reporting
import { synthesizer } from './reporting/synthesizer';
export { synthesizer };
export type { DailyDigest, AgentSummary, DepartmentSummary } from './reporting/synthesizer';

// Phase 6: Sprint Mode
import { sprintMode } from './sprint/mode';
export { sprintMode };
export type { Sprint, SprintObjection, Reassignment } from './sprint/mode';

// Types needed for static properties
import type { ActiveBlocker, EscalationAction } from './escalation/clock';
import type { Sprint } from './sprint/mode';
import type { MergedResult } from './subagent/spawner';

// Phase 7: Sub-Agent System
import { spawner } from './subagent/spawner';
export { spawner };
export type { SubAgent, SpawnRequest, MergedResult } from './subagent/spawner';

// Legacy Phase: Proposal System (from Agentic 2.0)
export { 
  loadConfig, 
  saveConfig, 
  enableTrainingWheels, 
  disableTrainingWheels,
  getCriticalityForFile,
  shouldRequireApproval,
  canAutoExecute
} from './config-loader';
export type { Config } from './config-loader';

export {
  createProposal,
  loadProposal,
  listProposals,
  approveProposal,
  rejectProposal,
  executeProposal,
  generateDiff
} from './proposal-system';
export type { Proposal, FileChange } from './proposal-system';

// Live
export { EventBus } from './events/bus';

export { agentRuntime } from './runtime/agent-runtime';
export { daemon } from './runtime/daemon';

// Decoupled Infrastructure
export { llmProvider } from '../infrastructure/llm/provider';
export { storage } from '../infrastructure/storage/manager';
export { secrets } from '../infrastructure/config/secrets';
export { decoupledRuntime } from '../infrastructure/runtime/decoupled';

// Live Integrations
export { gmailIntegration } from '../integrations/gmail';
export { calendarIntegration } from '../integrations/calendar';
export { githubIntegration } from '../integrations/github';

// Hybrid Architecture
export { zoBridge } from './hybrid/zobridge';
export { engine } from './hybrid/engine';
export { localIntelligence } from './hybrid/local-intelligence';

// Employees (mi

// Architecture Components (imported for Agentic class)
import { warRoom } from './warroom/consensus';
import { monitors } from './monitors/index';
import { riskScorer } from './risk/scorer';
import { departmentRouter } from './departments/router';
import { erica } from './bxthre3/executive-briefing';
import { scheduler } from './scheduler/index';

// Gaps & Managers (imported for Agentic class)
import { eventBus } from './events/bus';
import { snapshotManager } from './snapshot/manager';
import { conflictResolver } from './conflict/resolver';
import { knowledgeTransfer } from './transfer/manager';

// 3.x Managers (imported for Agentic class)
import { subsidiaryManager } from './subsidiary/manager';
import { projectManager } from './projects/manager';
import { grantManager } from './grants/manager';
import { ipManager } from './ip/manager';

// Value imports for static properties (these were only exported, not imported)
import { agentRuntime } from './runtime/agent-runtime';
import { daemon } from './runtime/daemon';
import { llmProvider } from '../infrastructure/llm/provider';
import { storage } from '../infrastructure/storage/manager';
import { secrets } from '../infrastructure/config/secrets';
import { decoupledRuntime } from '../infrastructure/runtime/decoupled';
import { zoBridge } from './hybrid/zobridge';
import { localIntelligence } from './hybrid/local-intelligence';

// Agentic 3.0 Main Interface
export class Agentic {
  // Core systems - lazy getters to avoid init order issues
  static get memory() { return memory; }
  static get org() { return org; }
  static get router() { return router; }
  static get escalation() { return escalationClock; }
  static get synthesizer() { return synthesizer; }
  static get sprint() { return sprintMode; }
  static get spawner() { return spawner; }

  // Architecture Components
  static get warRoom() { return warRoom; }
  static get monitors() { return monitors; }
  static get riskScorer() { return riskScorer; }
  static get departments() { return departmentRouter; }
  static get erica() { return erica; }

  // Scheduler
  static get scheduler() { return scheduler; }

  // Runtime
  static get runtime() { return agentRuntime; }
  static get daemon() { return daemon; }

  // Decoupled mode
  static get llm() { return llmProvider; }
  static get storage() { return storage; }
  static get secrets() { return secrets; }

  // Hybrid Architecture
  static get zo() { return zoBridge; }
  static get engine() { return engine; }
  static get localAI() { return localIntelligence; }

  static async start(): Promise<void> {
    return daemon.start();
  }

  static async startDecoupled(): Promise<void> {
    return decoupledRuntime.start();
  }

  static async startHybrid(): Promise<void> {
    return engine.start();
  }

  static stop(): void {
    daemon.stop();
  }

  static getSchedulerStatus() {
    return scheduler.getStatus();
  }

  // Convenience methods
  static async dailyDigest() {
    const digest = synthesizer.generate();
    return {
      data: digest,
      formatted: synthesizer.format(digest)
    };
  }

  static async checkEscalations() {
    return escalationClock.check();
  }

  static async checkSprint() {
    return sprintMode.check();
  }

  static getStatus(): AgentOSStatus {
    const employees = org.listAll();
    const activeBlockers = escalationClock.getActive();
    const sprint = sprintMode.getActive();
    const now = new Date();

    return {
      timestamp: now.toISOString(),
      employees: {
        total: employees.length,
        byRole: {
          executive: employees.filter(e => e.role === 'executive').length,
          manager: employees.filter(e => e.role === 'manager').length,
          employee: employees.filter(e => e.role === 'employee').length
        },
        active: employees.filter(e => e.status === 'working').length,
        blocked: employees.filter(e => e.status === 'blocked').length
      },
      blockers: {
        active: activeBlockers.length,
        escalatedToHuman: activeBlockers.filter(b => b.humanEscalationPending).length,
        bySeverity: {
          p0: activeBlockers.filter(b => b.severity === 'p0').length,
          p1: activeBlockers.filter(b => b.severity === 'p1').length,
          p2: activeBlockers.filter(b => b.severity === 'p2').length,
          p3: activeBlockers.filter(b => b.severity === 'p3').length
        }
      },
      sprint: sprint ? {
        active: true,
        name: sprint.name,
        project: sprint.project,
        deadline: sprint.deadline,
        status: sprint.status
      } : { active: false }
    };
  }

  // Gap 1: Event Bus
  static publishEvent(type: string, source: string, payload: Record<string, unknown>, priority?: 'low' | 'normal' | 'high' | 'critical') {
    return eventBus.publish(type, source, payload, priority);
  }

  static subscribeToEvents(agentId: string, eventTypes: string[]) {
    return eventBus.subscribe(agentId, eventTypes);
  }

  // Gap 2: Snapshots
  static createSnapshot(label: string, description: string) {
    return snapshotManager.create(label, description);
  }

  static rollbackTo(snapshotId: string) {
    return snapshotManager.rollback(snapshotId);
  }

  static listSnapshots() {
    return snapshotManager.list();
  }

  // Gap 3: Conflict Resolution
  static detectConflict(type: 'proposal' | 'priority' | 'resource' | 'facts' | 'strategy', agentA: string, agentB: string, context: string, posA: string, posB: string) {
    return conflictResolver.detectConflict(type, agentA, agentB, context, posA, posB);
  }

  static mediateConflict(conflictId: string, mediatorId: string, resolution: string, winner: 'agentA' | 'agentB' | 'compromise' | 'both-rejected') {
    return conflictResolver.mediate(conflictId, mediatorId, resolution, winner);
  }

  // Gap 4: Knowledge Transfer
  static initiateTransfer(fromAgentId: string, toAgentId: string | undefined, reason: 'departure' | 'reassignment' | 'scale-up' | 'restructure', urgency: 'low' | 'normal' | 'high' | 'critical') {
    return knowledgeTransfer.initiateTransfer({ fromAgentId, toAgentId, reason, urgency });
  }

  static offboardAgent(agentId: string, reason: string) {
    return knowledgeTransfer.offboard(agentId, reason);
  }

  // 3.1: Subsidiary-Aware
  static get subsidiary() { return subsidiaryManager; }

  // 3.2: Project-Centric
  static get projects() { return projectManager; }

  // 3.3: Grant Lifecycle
  static get grants() { return grantManager; }

  // 3.4: IP Portfolio
  static get ip() { return ipManager; }

  // 3.5: Capacity Intelligence
  static get capacity() {
    return {
      detectConflicts: () => projectManager.detectResourceConflicts(),
      getOverallocation: () => {
        const conflicts = projectManager.detectResourceConflicts();
        return conflicts.filter(c => c.severity === 'critical');
      }
    };
  }

  // 3.6: Executive Briefing (Erica enhanced)
  static getBriefing(): string {
    const grantBriefing = grantManager.getCriticalBriefing();
    const ipBriefing = ipManager.getCriticalBriefing();
    const portfolio = projectManager.getPortfolioSummary();
    const conflicts = projectManager.detectResourceConflicts();

    return `
=== Bxthre3 Executive Briefing ===
${new Date().toLocaleString()}

🎯 PROJECTS: ${portfolio.active} active, ${portfolio.criticalDeadlines.length} critical deadlines

💰 GRANTS:
${grantBriefing}

🔒 IP:
${ipBriefing}

⚠️ CAPACITY:
${conflicts.length > 0 ? conflicts.map(c => `- ${c.agent}: ${c.suggestedAction}`).join('\n') : 'No overallocation detected'}

📊 NEXT ACTIONS:
${portfolio.criticalDeadlines.map(d => `- ${d.name}: due ${d.deadline}`).join('\n') || 'No immediate deadlines'}
`;
  }
}

interface AgentOSStatus {
  timestamp: string;
  employees: {
    total: number;
    byRole: Record<string, number>;
    active: number;
    blocked: number;
  };
  blockers: {
    active: number;
    escalatedToHuman: number;
    bySeverity: Record<string, number>;
  };
  sprint: {
    active: boolean;
    name?: string;
    project?: string;
    deadline?: string;
    status?: string;
  };
}

export default Agentic;

// Bxthre3-specific optimizations
export { deadlineTracker, ipPortfolio, fundraisingManager, subsidiaryManager, dashboardManager, boardReportManager } from './bxthre3/index';

// Orchestration exports
export { contextSharder, ContextShard } from './orchestrator/context';
export { personaEngine, AgentPersona } from './personas/engine';
export { hiringRecruiter, HiringRequest } from './hiring/recruiter';
export { performanceTracker, PerformanceMetrics } from './performance/tracker';
export { masterOrchestrator, Dimension, ShardConfig } from './orchestrator/master';

// Human-readable improvements
export { notifications } from './notifications/manager';
export { auditor } from './audit/trail';
export { budget } from './budget/tracker';
export { emergency } from './emergency/override';
export { training } from './training/onboard';
export { chat } from './collaboration/chat';
export { compliance } from './compliance/logger';
export { analytics } from './analytics/predictive';

// Onboarding, Goals, Drift
export { onboarding } from './onboarding/system';
export { strategy } from './goals/strategy';
export { driftGuardian } from './drift/guardian';

// Security & Monitoring
export { secretRotation, SecretRotation } from "./security/rotation";
export { rateLimiter, RateLimiter } from "./security/rate-limiter";
export { backupManager, BackupManager } from "./snapshot/backup";
export { abTesting, ABTestingFramework } from "./analytics/ab-testing";
export { costDashboard, CostDashboard } from "./analytics/cost-dashboard";
export { voiceInterface, VoiceInterface } from "./voice/interface";
