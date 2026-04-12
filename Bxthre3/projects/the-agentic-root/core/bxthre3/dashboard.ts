// Bxthre3 Real-Time Executive Dashboard
// brodiblanco's single-pane view across all operations

import { deadlineTracker } from './deadline-tracker.js';
import { ipPortfolio } from './ip-portfolio.js';
import { fundraisingManager } from './fundraising.js';
import { subsidiaryManager } from './subsidiaries.js';
import { org } from '../hierarchy/org.js';
import { escalationClock } from '../escalation/clock.js';
import { sprintMode } from '../sprint/mode.js';

export interface DashboardView {
  timestamp: string;
  
  // Critical alerts (top of mind)
  critical: {
    deadlines: { name: string; days: number; status: string }[];
    blockers: { id: string; description: string; employee: string; hoursLeft: number }[];
    escalations: { to: string; reason: string; time: string }[];
  };
  
  // Financial snapshot
  financials: {
    runway: { months: number; criticalEntities: string[] };
    fundraising: { raised: number; committed: number; pipeline: string[] };
    burn: number; // monthly $K
    consolidatedRevenue: number;
  };
  
  // Operational health
  operations: {
    activeEmployees: number;
    working: number;
    blocked: number;
    standupsToday: number;
    sprintsActive: number;
  };
  
  // IP & Strategy
  intellectualProperty: {
    patentsPending: number;
    provisionalExpiring: { title: string; days: number }[];
    portfolioValue: number;
  };
  
  // Subsidiaries
  entities: {
    id: string;
    status: string;
    keyMetric: string;
    alert?: string;
  }[];
  
  // Today's actions for brodiblanco
  yourActions: {
    type: 'decision' | 'review' | 'meeting' | 'approval';
    item: string;
    deadline: string;
    context: string;
  }[];
}

export class DashboardManager {
  private currentView: DashboardView | null = null;
  private refreshInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startAutoRefresh();
  }

  private startAutoRefresh(): void {
    // Refresh every 5 minutes
    this.refreshInterval = setInterval(() => this.refresh(), 5 * 60 * 1000);
    // Initial refresh
    setTimeout(() => this.refresh(), 2000);
  }

  refresh(): DashboardView {
    const employees = org.listAll();
    const blockers = escalationClock.getActive();
    const rollUp = subsidiaryManager.getRollUp();
    const fundStatus = fundraisingManager.getBoardSummary();
    const ipStatus = ipPortfolio.getPortfolio();

    this.currentView = {
      timestamp: new Date().toISOString(),
      
      critical: {
        deadlines: deadlineTracker.getCritical().slice(0, 3).map(d => ({
          name: d.name,
          days: d.daysRemaining,
          status: d.status
        })),
        blockers: blockers.slice(0, 3).map(b => ({
          id: b.id.slice(0, 8),
          description: b.description.slice(0, 50),
          employee: b.employeeId,
          hoursLeft: Math.max(0, Math.floor((new Date(b.resolutionDeadline).getTime() - Date.now()) / (1000 * 60 * 60)))
        })),
        escalations: blockers.filter(b => b.humanEscalationPending).map(b => ({
          to: 'brodiblanco',
          reason: b.description.slice(0, 40),
          time: b.resolutionDeadline
        }))
      },
      
      financials: {
        runway: { months: rollUp.summary.combinedRunway, criticalEntities: [] },
        fundraising: fundStatus,
        burn: 45, // $45K/month estimated burn
        consolidatedRevenue: rollUp.summary.consolidatedRevenue
      },
      
      operations: {
        activeEmployees: employees.filter(e => e.status === 'working').length,
        working: employees.filter(e => e.status === 'working').length,
        blocked: employees.filter(e => e.status === 'blocked').length,
        standupsToday: 0, // Would count from files
        sprintsActive: sprintMode.isActive() ? 1 : 0
      },
      
      intellectualProperty: {
        patentsPending: ipStatus.byStatus['provisional'] || 0 + ipStatus.byStatus['pending'] || 0,
        provisionalExpiring: ipStatus.criticalDeadlines.slice(0, 2).map(p => ({
          title: p.title.slice(0, 40),
          days: p.daysToDeadline || 999
        })),
        portfolioValue: ipStatus.totalValuation
      },
      
      entities: Object.entries(rollUp.bySubsidiary).map(([id, data]) => ({
        id,
        status: data.status,
        keyMetric: data.keyMetric,
        alert: data.runway < 3 ? 'Low runway' : undefined
      })),
      
      yourActions: this.generateActionItems()
    };

    return this.currentView;
  }

  private generateActionItems(): DashboardView['yourActions'] {
    const actions: DashboardView['yourActions'] = [];
    
    // Check for human escalations
    const escalations = escalationClock.getActive().filter(b => b.humanEscalationPending);
    for (const e of escalations) {
      actions.push({
        type: 'decision',
        item: `Resolve blocker: ${e.description.slice(0, 30)}`,
        deadline: 'Immediate',
        context: `Employee ${e.employeeId} blocked, manager ${e.assignedManager} escalated`
      });
    }

    // Check ESTCP specifically
    const estcp = deadlineTracker.getAll().find(d => d.id === 'estcp-fy2027');
    if (estcp && estcp.daysRemaining <= 3) {
      actions.push({
        type: 'review',
        item: 'Final ESTCP proposal review',
        deadline: `${estcp.daysRemaining} days`,
        context: 'Grant deadline March 26 — technical proposal, budget, letters'
      });
    }

    // Patent conversion
    const arkad = ipPortfolio.getPortfolio().criticalDeadlines.find(p => p.id === 'arkad-digital-employee');
    if (arkad && arkad.daysToDeadline && arkad.daysToDeadline <= 30) {
      actions.push({
        type: 'approval',
        item: 'Approve Arkad patent conversion',
        deadline: `${arkad.daysToDeadline} days`,
        context: `Provisional expires ${arkad.provisionalExpiry}, needs non-provisional filing`
      });
    }

    // Investor hot leads
    const hot = fundraisingManager.getPipeline().hot.slice(0, 2);
    for (const h of hot) {
      actions.push({
        type: 'meeting',
        item: `Follow up with ${h.name}`,
        deadline: h.nextActionDate || 'This week',
        context: `${h.stage} stage, ${h.checkSize.max}K check size, focus: ${h.focus.join(', ')}`
      });
    }

    return actions.sort((a, b) => (a.deadline === 'Immediate' ? -1 : 1)).slice(0, 5);
  }

  getCurrent(): DashboardView | null {
    return this.currentView;
  }

  getQuickView(): string {
    if (!this.currentView) this.refresh();
    const v = this.currentView!;
    
    return `
╔══════════════════════════════════════════════════════════════╗
║  BXTHRE3 EXECUTIVE DASHBOARD — ${new Date().toLocaleDateString()}                   ║
╠══════════════════════════════════════════════════════════════╣
║  🚨 CRITICAL (${v.critical.deadlines.length} deadlines, ${v.critical.blockers.length} blockers)                    ║
║  ${v.critical.deadlines.slice(0, 2).map(d => `• ${d.name}: ${d.days} days [${d.status}]`).join('\n║  ') || 'None'}                              ║
╠══════════════════════════════════════════════════════════════╣
║  💰 FINANCIALS                                               ║
║  Runway: ${v.financials.runway.months} months | Raised: $${v.financials.fundraising.raised}K + $${v.financials.fundraising.committed}K committed | Burn: $${v.financials.burn}K/mo  ║
╠══════════════════════════════════════════════════════════════╣
║  📊 OPERATIONS (${v.operations.activeEmployees} active)                                    ║
║  Working: ${v.operations.working} | Blocked: ${v.operations.blocked} | Sprints: ${v.operations.sprintsActive}                       ║
╠══════════════════════════════════════════════════════════════╣
║  🎯 YOUR TOP ACTIONS                                         ║
║  ${v.yourActions.slice(0, 3).map((a, i) => `${i + 1}. [${a.type.toUpperCase()}] ${a.item} (${a.deadline})`).join('\n║  ')} ║
╚══════════════════════════════════════════════════════════════╝
    `.trim();
  }

  stop(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }
}

export const dashboardManager = new DashboardManager();
