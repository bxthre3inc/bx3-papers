// Bxthre3 Deadline Tracker
// Critical for ESTCP (March 26) and all grant deadlines

import { memory } from '../memory/store.js';
import { eventBus } from '../events/bus.js';
import { hybridGmail } from '../../infrastructure/integrations/gmail-hybrid.js';
import { hybridCalendar } from '../../infrastructure/integrations/calendar-hybrid.js';

export interface Deadline {
  id: string;
  name: string;
  date: string;
  daysRemaining: number;
  priority: 'critical' | 'high' | 'normal';
  project: 'Irrig8' | 'Starting5' | 'ValleyPlayersClub' | 'Bxthre3';
  type: 'grant' | 'patent' | 'investor' | 'milestone' | 'legal';
  status: 'on-track' | 'at-risk' | 'blocked' | 'overdue';
  deliverables: string[];
  assignedAgents: string[];
  lastUpdate: string;
}

export class DeadlineTracker {
  private deadlines: Map<string, Deadline> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadDeadlines();
    this.startMonitoring();
  }

  private loadDeadlines(): void {
    // Critical ESTCP deadline
    this.deadlines.set('estcp-fy2027', {
      id: 'estcp-fy2027',
      name: 'ESTCP FY 2027 Full Proposal',
      date: '2026-03-26',
      daysRemaining: this.calculateDaysRemaining('2026-03-26'),
      priority: 'critical',
      project: 'Irrig8',
      type: 'grant',
      status: 'at-risk',
      deliverables: ['Technical Proposal', 'Budget Justification', 'Letters of Support', 'Environmental Review'],
      assignedAgents: ['casey', 'jordan-researcher', 'iris', 'drew'],
      lastUpdate: new Date().toISOString()
    });

    // Patent conversion deadlines
    this.deadlines.set('patent-conversion', {
      id: 'patent-conversion',
      name: 'Digital Employee OS Patent (Arkad) — Convert Provisional',
      date: '2026-04-14',
      daysRemaining: this.calculateDaysRemaining('2026-04-14'),
      priority: 'critical',
      project: 'Bxthre3',
      type: 'patent',
      status: 'on-track',
      deliverables: ['Non-provisional filing', 'Prior art search', 'Claims draft'],
      assignedAgents: ['iris', 'maya'],
      lastUpdate: new Date().toISOString()
    });

    // Additional deadlines loaded from memory
    const saved = memory.query({ tags: ['deadline', 'active'], limit: 50 });
    for (const m of saved) {
      try {
        const d = JSON.parse(m.node.content);
        if (d.id && d.date) this.deadlines.set(d.id, d);
      } catch {}
    }
  }

  private calculateDaysRemaining(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private startMonitoring(): void {
    // Check deadlines every 6 hours
    this.checkInterval = setInterval(() => this.checkDeadlines(), 6 * 60 * 60 * 1000);
    
    // Initial check
    setTimeout(() => this.checkDeadlines(), 5000);
  }

  private checkDeadlines(): void {
    const now = new Date().toISOString();
    
    for (const [id, deadline] of this.deadlines) {
      // Recalculate days remaining
      deadline.daysRemaining = this.calculateDaysRemaining(deadline.date);
      deadline.lastUpdate = now;

      // Critical alerts
      if (deadline.daysRemaining <= 3 && deadline.status !== 'overdue') {
        eventBus.publish('deadline.critical', 'deadline-tracker', {
          deadlineId: id,
          name: deadline.name,
          daysRemaining: deadline.daysRemaining,
          deliverables: deadline.deliverables,
          assignedAgents: deadline.assignedAgents
        }, 'critical');

        // Alert via email for ESTCP
        if (id === 'estcp-fy2027' && deadline.daysRemaining <= 1) {
          this.sendESTCPCriticalAlert(deadline);
        }
      }

      // Sprint mode for final push
      if (deadline.daysRemaining <= 2 && !deadline.assignedAgents.includes('sprint-active')) {
        this.activateSprintMode(deadline);
      }

      // Overdue
      if (deadline.daysRemaining < 0 && deadline.status !== 'overdue') {
        deadline.status = 'overdue';
        eventBus.publish('deadline.overdue', 'deadline-tracker', { deadline }, 'critical');
      }
    }
  }

  private sendESTCPCriticalAlert(deadline: Deadline): void {
    const subject = `🚨 ESTCP DEADLINE: ${deadline.daysRemaining} days remaining`;
    const body = `
CRITICAL: ESTCP FY 2027 proposal due ${deadline.date}

Days remaining: ${deadline.daysRemaining}
Status: ${deadline.status}
Deliverables pending: ${deadline.deliverables.filter(d => !d.includes('COMPLETE')).join(', ')}
Assigned agents: ${deadline.assignedAgents.join(', ')}

ACTION REQUIRED: Review with brodiblanco immediately.
    `.trim();

    hybridGmail.send({
      to: 'brodiblanco@zo.computer',
      subject,
      body
    }).catch(() => {});
  }

  private activateSprintMode(deadline: Deadline): void {
    eventBus.publish('sprint.activate', 'deadline-tracker', {
      deadlineId: deadline.id,
      name: deadline.name,
      deadline: deadline.date,
      agents: deadline.assignedAgents
    }, 'critical');

    // Add sprint indicator
    deadline.assignedAgents.push('sprint-active');
  }

  // Public API
  getAll(): Deadline[] {
    return Array.from(this.deadlines.values())
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  getCritical(): Deadline[] {
    return this.getAll().filter(d => d.priority === 'critical' && d.daysRemaining <= 7);
  }

  getForProject(project: string): Deadline[] {
    return this.getAll().filter(d => d.project === project);
  }

  addDeadline(deadline: Omit<Deadline, 'daysRemaining' | 'lastUpdate'>): void {
    const full: Deadline = {
      ...deadline,
      daysRemaining: this.calculateDaysRemaining(deadline.date),
      lastUpdate: new Date().toISOString()
    };
    this.deadlines.set(deadline.id, full);
    
    memory.add({
      id: `deadline-${deadline.id}`,
      content: JSON.stringify(full),
      type: 'deadline',
      agent: 'deadline-tracker',
      tags: ['deadline', 'active', deadline.project, deadline.type],
      timestamp: new Date().toISOString(),
      source: 'deadline-tracker'
    });
  }

  updateStatus(id: string, status: Deadline['status']): boolean {
    const d = this.deadlines.get(id);
    if (!d) return false;
    d.status = status;
    d.lastUpdate = new Date().toISOString();
    return true;
  }

  getDashboard(): { critical: number; atRisk: number; onTrack: number; overdue: number } {
    const all = this.getAll();
    return {
      critical: all.filter(d => d.priority === 'critical').length,
      atRisk: all.filter(d => d.status === 'at-risk').length,
      onTrack: all.filter(d => d.status === 'on-track').length,
      overdue: all.filter(d => d.status === 'overdue').length
    };
  }

  stop(): void {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }
}

export const deadlineTracker = new DeadlineTracker();
