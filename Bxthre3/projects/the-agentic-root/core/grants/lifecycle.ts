// Grant Lifecycle Management
// Bxthre3-specific: ESTCP, NSF, USDA, DOE tracking

import { memory } from '../memory/store';
import { eventBus, BXTHRE3_EVENTS } from '../events/bus';

export type GrantAgency = 'ESTCP' | 'NSF' | 'USDA' | 'DOE' | 'ARPA-E' | 'State';
export type GrantStatus = 'identified' | 'research' | 'drafting' | 'review' | 'submitted' | 'awarded' | 'declined' | 'withdrawn';
export type GrantPriority = 'strategic' | 'tactical' | 'fill-funding';

export interface Grant {
  id: string;
  agency: GrantAgency;
  program: string;
  solicitationNumber?: string;
  title: string;
  description: string;
  
  // Financials
  amount: {
    min: number;
    max: number;
    requested?: number;
  };
  costShare?: number; // Percentage required
  
  // Timeline
  postedDate: string;
  dueDate: string;
  questionsDue?: string;
  
  // Status
  status: GrantStatus;
  priority: GrantPriority;
  
  // Auto-calculated
  daysUntilDue: number;
  priorityScore: number; // 0-100
  winProbability: number; // 0-100
  expectedValue: number; // amount * winProbability
  
  // Agent assignments
  assignments: {
    lead: string;        // Agent ID (Casey)
    writer?: string;     // Grant Writer Agent
    technical?: string;  // Maya/Drew
    finance?: string;    // Raj
    compliance?: string; // Legal review
  };
  
  // Documents
  documents: {
    narrative?: string;      // Path to draft
    budget?: string;           // Path to budget
    lettersOfSupport?: string[];
    technicalSpecs?: string;
    previousSubmissions?: string[];
  };
  
  // Tracking
  tasks: GrantTask[];
  history: GrantHistoryEntry[];
  
  // Sprint mode
  sprintThreshold: number; // Days before due (default: 14)
  sprintActive: boolean;
}

export interface GrantTask {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'complete' | 'blocked';
  blockerReason?: string;
}

export interface GrantHistoryEntry {
  timestamp: string;
  action: string;
  agent: string;
  details: string;
}

export interface GrantPipeline {
  active: Grant[];
  upcoming: Grant[];
  submitted: Grant[];
  awarded: Grant[];
  declined: Grant[];
  
  // Metrics
  totalPipelineValue: number;
  winRate: number;
  avgGrantSize: number;
  
  // Critical
  criticalDeadlines: Grant[]; // Due within sprintThreshold
}

export class GrantLifecycleManager {
  private grants = new Map<string, Grant>();
  private readonly DEFAULT_SPRINT_THRESHOLD = 14;
  private readonly CRITICAL_THRESHOLD = 7;

  addGrant(grant: Omit<Grant, 'id' | 'daysUntilDue' | 'priorityScore' | 'winProbability' | 'expectedValue' | 'sprintActive'>): Grant {
    const id = `grant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate derived fields
    const daysUntilDue = Math.ceil((new Date(grant.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const priorityScore = this.calculatePriorityScore(grant);
    const winProbability = this.calculateWinProbability(grant);
    const expectedValue = grant.amount.max * (winProbability / 100);
    
    const fullGrant: Grant = {
      ...grant,
      id,
      daysUntilDue,
      priorityScore,
      winProbability,
      expectedValue,
      sprintThreshold: grant.sprintThreshold || this.DEFAULT_SPRINT_THRESHOLD,
      sprintActive: false,
      status: grant.status || 'identified',
      tasks: grant.tasks || [],
      history: [{
        timestamp: new Date().toISOString(),
        action: 'created',
        agent: 'system',
        details: `Grant added to pipeline: ${grant.program}`
      }]
    };

    this.grants.set(id, fullGrant);
    
    // Store in memory for cross-reference
    memory.add({
      id: `grant-${id}`,
      content: `${grant.program} - ${grant.title}. Due ${grant.dueDate}. Amount $${grant.amount.max.toLocaleString()}`,
      tags: ['grant', grant.agency.toLowerCase(), grant.priority, `status:${grant.status}`],
      relationships: [],
      timestamp: new Date().toISOString()
    });

    // Check if this should trigger Sprint Mode
    this.checkSprintActivation(fullGrant);

    // Publish event
    eventBus.publish(BXTHRE3_EVENTS.GRANT_UPDATED, 'grant-lifecycle', { grant: id, action: 'created' });

    return fullGrant;
  }

  private calculatePriorityScore(grant: Partial<Grant>): number {
    let score = 50; // Base
    
    // Amount weight (bigger = higher priority)
    if (grant.amount) {
      if (grant.amount.max > 5000000) score += 20;
      else if (grant.amount.max > 1000000) score += 15;
      else if (grant.amount.max > 500000) score += 10;
      else if (grant.amount.max > 100000) score += 5;
    }
    
    // Strategic priority
    if (grant.priority === 'strategic') score += 15;
    else if (grant.priority === 'tactical') score += 5;
    
    // Urgency (closer deadline = higher priority, but only if positive)
    const daysUntil = Math.ceil((new Date(grant.dueDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil > 0 && daysUntil < 30) score += 10;
    if (daysUntil > 0 && daysUntil < 14) score += 10;
    
    return Math.min(100, score);
  }

  private calculateWinProbability(grant: Partial<Grant>): number {
    // Base probability by agency (historical)
    const agencyBase: Record<GrantAgency, number> = {
      'ESTCP': 25,    // Competitive
      'NSF': 15,      // Very competitive
      'USDA': 20,     // Moderate
      'DOE': 18,      // Competitive
      'ARPA-E': 12,   // Highly competitive
      'State': 35     // Less competitive
    };
    
    let prob = agencyBase[grant.agency!] || 20;
    
    // Adjust for track record (would query memory for previous submissions)
    const previousWins = memory.query({ 
      tags: ['grant', 'awarded', grant.agency!.toLowerCase()],
      limit: 5 
    });
    if (previousWins.length > 0) {
      prob += 10; // We've won before with this agency
    }
    
    return Math.min(100, prob);
  }

  private checkSprintActivation(grant: Grant): void {
    if (grant.daysUntilDue <= grant.sprintThreshold && grant.daysUntilDue > 0 && !grant.sprintActive) {
      grant.sprintActive = true;
      
      // Publish event for Sprint Mode activation
      eventBus.publish({
        type: BXTHRE3_EVENTS.SPRINT_AUTO_ACTIVATED,
        data: { 
          grant: grant.id,
          daysUntil: grant.daysUntilDue,
          priority: 'grant-deadline'
        },
        source: 'grant-lifecycle',
        priority: grant.daysUntilDue <= this.CRITICAL_THRESHOLD ? 'critical' : 'high'
      });

      // Add to grant history
      grant.history.push({
        timestamp: new Date().toISOString(),
        action: 'sprint-activated',
        agent: 'system',
        details: `Auto-activated Sprint Mode: ${grant.daysUntilDue} days until ${grant.program} deadline`
      });

      // Store in memory
      memory.add({
        id: `sprint-${grant.id}`,
        content: `Sprint Mode activated for ${grant.program}. Deadline: ${grant.dueDate}`,
        type: 'sprint',
        agent: 'grant-lifecycle',
        tags: ['sprint', 'grant', grant.agency.toLowerCase(), 'auto-activated'],
        timestamp: new Date().toISOString(),
        source: 'grant-lifecycle'
      });
    }
  }

  updateStatus(grantId: string, newStatus: GrantStatus, agent: string, notes?: string): Grant | null {
    const grant = this.grants.get(grantId);
    if (!grant) return null;

    const oldStatus = grant.status;
    grant.status = newStatus;
    
    grant.history.push({
      timestamp: new Date().toISOString(),
      action: `status-change:${oldStatus}->${newStatus}`,
      agent,
      details: notes || `Status changed from ${oldStatus} to ${newStatus}`
    });

    // Special handling for certain transitions
    if (newStatus === 'submitted') {
      grant.sprintActive = false; // Sprint complete
      
      // Celebrate
      eventBus.publish(
        BXTHRE3_EVENTS.GRANT_SUBMITTED,
        'grant-lifecycle',
        { grant: grantId, program: grant.program },
        'normal'
      );
    }

    if (newStatus === 'awarded') {
      eventBus.publish(
        BXTHRE3_EVENTS.GRANT_AWARDED,
        'grant-lifecycle',
        { 
          grant: grantId, 
          program: grant.program,
          amount: grant.amount.requested || grant.amount.max
        },
        'high'
      );
    }

    return grant;
  }

  getPipeline(): GrantPipeline {
    const all = Array.from(this.grants.values());
    
    return {
      active: all.filter(g => ['identified', 'research', 'drafting', 'review'].includes(g.status)),
      upcoming: all.filter(g => g.status === 'identified' && g.daysUntilDue > 30),
      submitted: all.filter(g => g.status === 'submitted'),
      awarded: all.filter(g => g.status === 'awarded'),
      declined: all.filter(g => g.status === 'declined'),
      
      totalPipelineValue: all.filter(g => g.status !== 'declined').reduce((sum, g) => sum + g.expectedValue, 0),
      winRate: all.filter(g => g.status === 'awarded').length / all.filter(g => ['awarded', 'declined'].includes(g.status)).length * 100 || 0,
      avgGrantSize: all.filter(g => g.status === 'awarded').reduce((sum, g) => sum + (g.amount.requested || g.amount.max), 0) / all.filter(g => g.status === 'awarded').length || 0,
      
      criticalDeadlines: all.filter(g => 
        g.sprintActive && 
        g.daysUntilDue <= this.CRITICAL_THRESHOLD && 
        g.daysUntilDue > 0
      ).sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    };
  }

  getCriticalBriefing(): string {
    const pipeline = this.getPipeline();
    
    if (pipeline.criticalDeadlines.length === 0) {
      return 'No critical grant deadlines. Next closest: ' + 
        (pipeline.active.find(g => g.daysUntilDue > 0)?.program || 'None');
    }

    const critical = pipeline.criticalDeadlines[0];
    const tasksBlocked = critical.tasks.filter(t => t.status === 'blocked').length;
    
    return `🚨 CRITICAL: ${critical.program} due in ${critical.daysUntilDue} days. ` +
           `Status: ${critical.status}. ` +
           `Sprint Mode: ${critical.sprintActive ? 'ACTIVE' : 'INACTIVE'}. ` +
           `Tasks blocked: ${tasksBlocked}/${critical.tasks.length}. ` +
           `Win probability: ${critical.winProbability}%. ` +
           `Expected value: $${critical.expectedValue.toLocaleString()}`;
  }

  // Auto-refresh daily (would be called by scheduler)
  refresh(): void {
    for (const grant of this.grants.values()) {
      // Recalculate daysUntilDue
      grant.daysUntilDue = Math.ceil((new Date(grant.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Check for deadline passed
      if (grant.daysUntilDue < 0 && grant.status === 'submitted') {
        // No action, waiting for decision
      }
      
      // Check sprint activation
      this.checkSprintActivation(grant);
    }
  }
}

export const grantManager = new GrantLifecycleManager();
