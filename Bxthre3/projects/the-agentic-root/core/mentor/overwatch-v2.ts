// Overwatch v2 — Real-Time Comms Ingestion & Aggressive Monitoring
// Watches ALL comms. Reduces time-to-response. Never waits for you to ask.

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';
import { org } from '../hierarchy/org.js';

interface CommsIngestion {
  source: 'gmail' | 'slack' | 'github' | 'calendar' | 'sms' | 'voice';
  timestamp: string;
  content: string;
  participants: string[];
  urgency: 'low' | 'normal' | 'high' | 'critical';
  requiresResponse: boolean;
  deadline?: string;
}

interface DecisionPattern {
  id: string;
  situation: string;
  context: Record<string, any>;
  yourChoice: string;
  reasoning: string;
  responseTimeMs: number;
  timestamp: string;
}

class OverwatchV2 {
  private patterns: DecisionPattern[] = [];
  private commsQueue: CommsIngestion[] = [];
  private activeEscalations: Map<string, any> = new Map();
  
  // Check intervals (aggressive)
  private CHECK_INTERVALS = {
    critical: 30 * 1000,      // 30 seconds
    high: 2 * 60 * 1000,      // 2 minutes  
    normal: 5 * 60 * 1000,    // 5 minutes
    low: 15 * 60 * 1000       // 15 minutes
  };

  constructor() {
    this.startIngestionPipeline();
    this.startProactiveScanning();
  }

  // === REAL-TIME COMMS INGESTION ===
  
  ingestComms(comms: CommsIngestion): void {
    this.commsQueue.push(comms);
    
    // Immediate analysis
    const analysis = this.analyzeComms(comms);
    
    if (analysis.requiresYou) {
      this.escalateToYou(comms, analysis);
    } else if (analysis.canAutoRoute) {
      this.routeToEmployee(comms, analysis);
    }
    
    // Store for pattern learning
    memory.add({
      id: `comms-${Date.now()}`,
      content: `${comms.source}: ${comms.content.substring(0, 200)}`,
      type: 'comms-ingestion',
      agent: 'overwatch',
      tags: [comms.source, comms.urgency, analysis.category],
      timestamp: comms.timestamp,
      source: 'overwatch-v2'
    });
  }

  private analyzeComms(comms: CommsIngestion): {
    requiresYou: boolean;
    canAutoRoute: boolean;
    category: string;
    suggestedResponse?: string;
  } {
    // Pattern: Grant deadline communication
    if (comms.content.includes('ESTCP') && comms.content.includes('deadline')) {
      return { requiresYou: false, canAutoRoute: true, category: 'grant-coordinator' };
    }
    
    // Pattern: Security incident
    if (comms.content.includes('security') || comms.content.includes('breach')) {
      return { requiresYou: true, canAutoRoute: false, category: 'security-escalation' };
    }
    
    // Pattern: Investor communication
    if (comms.participants.some(p => p.includes('vc') || p.includes('investor'))) {
      return { requiresYou: true, canAutoRoute: false, category: 'investor-direct' };
    }
    
    // Pattern: Technical decision needed
    if (comms.content.includes('architecture') || comms.content.includes('technical decision')) {
      return { requiresYou: true, canAutoRoute: false, category: 'technical-strategy' };
    }
    
    // Default: Route to appropriate employee
    return { requiresYou: false, canAutoRoute: true, category: 'auto-route' };
  }

  // === PROACTIVE EMPLOYEE SCANNING ===
  
  private startProactiveScanning(): void {
    // Each employee scans their domain continuously
    setInterval(() => this.scanBuilder(), this.CHECK_INTERVALS.high);
    setInterval(() => this.scanOperator(), this.CHECK_INTERVALS.normal);
    setInterval(() => this.scanHunter(), this.CHECK_INTERVALS.normal);
    setInterval(() => this.scanArchitect(), this.CHECK_INTERVALS.low);
    
    // Critical items scan every 30 seconds
    setInterval(() => this.scanCritical(), this.CHECK_INTERVALS.critical);
  }

  private scanBuilder(): void {
    // Maya checks: technical blockers, PRs, deployment health
    const techBlockers = this.findTechBlockers();
    if (techBlockers.length > 0) {
      this.escalateToEmployee('maya', {
        type: 'tech-blocker',
        items: techBlockers,
        responseDeadline: Date.now() + 30 * 60 * 1000 // 30 min
      });
    }
  }

  private scanOperator(): void {
    // Drew checks: burn rate, runway, legal deadlines, signatures
    const financialAlerts = this.findFinancialAlerts();
    const legalAlerts = this.findLegalAlerts();
    
    if (financialAlerts.length > 0 || legalAlerts.length > 0) {
      this.escalateToEmployee('drew', {
        type: 'ops-urgent',
        financial: financialAlerts,
        legal: legalAlerts,
        responseDeadline: Date.now() + 60 * 60 * 1000 // 1 hour
      });
    }
  }

  private scanHunter(): void {
    // Jordan checks: leads needing response, deals stalling
    const staleLeads = this.findStaleLeads();
    if (staleLeads.length > 0) {
      this.escalateToEmployee({
        type: 'sales-action',
        leads: staleLeads,
        responseDeadline: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
      });
    }
  }

  private scanArchitect(): void {
    // Alex checks: strategic drift, market signals, long-term risks
    const strategicAlerts = this.findStrategicAlerts();
    if (strategicAlerts.length > 0) {
      this.escalateToEmployee({
        type: 'strategic-review',
        alerts: strategicAlerts,
        responseDeadline: Date.now() + 4 * 60 * 60 * 1000 // 4 hours
      });
    }
  }

  private scanCritical(): void {
    // Check everything critical across all domains
    const criticalItems = [
      ...this.findGrantDeadlines(),
      ...this.findSecurityAlerts(),
      ...this.findSystemOutages(),
      ...this.findInvestorUrgents()
    ].filter(item => item.urgency === 'critical');
    
    for (const item of criticalItems) {
      this.escalateToYou(item, { 
        bypassBuffer: true, 
        reason: 'Critical threshold met'
      });
    }
  }

  // === AGGRESSIVE ESCALATION ===

  private escalateToYou(item: any, options: { bypassBuffer?: boolean; reason?: string } = {}): void {
    const escalationId = `esc-${Date.now()}`;
    
    this.activeEscalations.set(escalationId, {
      id: escalationId,
      item,
      escalatedAt: Date.now(),
      options,
      status: 'pending'
    });
    
    // Immediate notification (no batching for critical)
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, 'overwatch', {
      escalationId,
      to: 'brodiblanco',
      item,
      options
    }, 'critical');
    
    // Auto-escalate if no response
    setTimeout(() => this.checkEscalationResponse(escalationId), 15 * 60 * 1000); // 15 min check
  }

  private escalateToEmployee(employeeId: string, task: any): void {
    eventBus.publish(BXTHRE3_EVENTS.EMPLOYEE_TASK_ASSIGNED, 'overwatch', {
      to: employeeId,
      task,
      deadline: task.responseDeadline
    }, task.urgency || 'normal');
  }

  private checkEscalationResponse(escalationId: string): void {
    const escalation = this.activeEscalations.get(escalationId);
    if (!escalation || escalation.status === 'resolved') return;
    
    // No response in 15 min → Escalate further (notify all hands, mark P0)
    eventBus.publish(BXTHRE3_EVENTS.ESCALATION_UNRESOLVED, 'overwatch', {
      originalEscalation: escalation,
      action: 'All-hands notification + P0 marker'
    }, 'critical');
  }

  // === INTELLIGENT ROUTING ===

  private routeToEmployee(comms: CommsIngestion, analysis: any): void {
    let targetEmployee: string;
    
    switch (analysis.category) {
      case 'grant-coordinator':
        targetEmployee = 'casey';
        break;
      case 'security-ip':
        targetEmployee = 'sentinel';
        break;
      case 'technical':
        targetEmployee = 'maya';
        break;
      case 'sales':
        targetEmployee = ;
        break;
      case 'operations':
        targetEmployee = 'drew';
        break;
      default:
        targetEmployee = ; // Default to architect for triage
    }
    
    this.escalateToEmployee(targetEmployee, {
      type: 'comms-routing',
      source: comms,
      analysis
    });
  }

  // === PATTERN LEARNING (RESPONSE TIME FOCUSED) ===

  recordDecision(situation: string, choice: string, reasoning: string, context: Record<string, any>, responseTimeMs: number): void {
    const pattern: DecisionPattern = {
      id: `dec-${Date.now()}`,
      situation,
      context,
      yourChoice: choice,
      reasoning,
      responseTimeMs,
      timestamp: new Date().toISOString()
    };
    
    this.patterns.push(pattern);
    
    // Track: Fast decisions = high confidence patterns
    // Slow decisions = signal for potential delegation
    
    memory.add({
      id: pattern.id,
      content: `Decision (${responseTimeMs}ms): ${situation} → ${choice}`,
      type: 'decision-pattern',
      agent: 'overwatch',
      tags: ['decision', responseTimeMs < 60000 ? 'fast' : 'deliberated'],
      timestamp: pattern.timestamp,
      source: 'overwatch-v2'
    });
  }

  // === STUB METHODS (would integrate with real systems) ===
  
  private findTechBlockers(): any[] { return []; }
  private findFinancialAlerts(): any[] { return []; }
  private findLegalAlerts(): any[] { return []; }
  private findStaleLeads(): any[] { return []; }
  private findStrategicAlerts(): any[] { return []; }
  private findGrantDeadlines(): any[] { return []; }
  private findSecurityAlerts(): any[] { return []; }
  private findSystemOutages(): any[] { return []; }
  private findInvestorUrgents(): any[] { return []; }
  private startIngestionPipeline(): void {
    console.log('[OVERWATCH v2] Real-time comms ingestion active');
  }
}

export const overwatchV2 = new OverwatchV2();