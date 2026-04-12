// Operator — Execution Co-Founder
// The Starting 5 Archetype: Operator (COO/Execution Lead)
// Complements Visionary with ops, deadlines, coordination, getting things done

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';
import { grantManager, Grant } from '../grants/lifecycle';

export interface OperationalPlan {
  id: string;
  objective: string;
  quarters: {
    q1: string[];
    q2: string[];
    q3: string[];
    q4: string[];
  };
  resources: {
    budget: number;
    headcount: number;
    keyHires: string[];
  };
  risks: string[];
  contingencies: Record<string, string>;
}

export interface DeadlineTracking {
  id: string;
  name: string;
  date: string;
  owner: string;
  priority: 'p0' | 'p1' | 'p2' | 'p3';
  status: 'on_track' | 'at_risk' | 'missed' | 'completed';
  blockers: string[];
  daysRemaining: number;
}

class OperatorEmployee {
  readonly id = 'operator';
  readonly name = 'Operator';
  readonly role = 'Execution Co-Founder';
  readonly archetype = 'Operator';

  private activePlans: Map<string, OperationalPlan> = new Map();
  private trackedDeadlines: Map<string, DeadlineTracking> = new Map();

  constructor() {
    console.log(`[${this.name}] Execution co-founder active`);
    this.initialize();
    this.startDeadlineWatch();
  }

  private initialize(): void {
    // Load operational plans
    const saved = memory.query(['plan', 'operational'], 10);
    for (const result of saved) {
      try {
        const plan = JSON.parse(result.node.content);
        if (plan.id) this.activePlans.set(plan.id, plan);
      } catch {}
    }

    // Subscribe to critical events
    eventBus.subscribe(BXTHRE3_EVENTS.GRANT_DEADLINE_URGENT, () => {
      this.escalateToSprintMode('Grant submission critical path');
    });
  }

  private startDeadlineWatch(): void {
    // Check deadlines every hour
    setInterval(() => this.checkAllDeadlines(), 60 * 60 * 1000);
    
    // Initial check
    this.checkAllDeadlines();
  }

  // Core Operator Functions

  createOperationalPlan(objective: string, timelineMonths: number): OperationalPlan {
    const id = `plan-${Date.now()}`;
    
    const plan: OperationalPlan = {
      id,
      objective,
      quarters: {
        q1: [],
        q2: [],
        q3: [],
        q4: []
      },
      resources: {
        budget: 0,
        headcount: 0,
        keyHires: []
      },
      risks: [],
      contingencies: {}
    };

    // Distribute objectives across quarters
    const quarterMonths = Math.ceil(timelineMonths / 4);
    plan.quarters.q1.push('Foundation & team assembly');
    plan.quarters.q2.push('Core product development');
    if (timelineMonths > 6) plan.quarters.q3.push('Market validation');
    if (timelineMonths > 9) plan.quarters.q4.push('Scale preparation');

    this.activePlans.set(id, plan);

    memory.add({
      id: `plan-${id}`,
      content: JSON.stringify(plan),
      type: 'operational-plan',
      agent: this.id,
      tags: ['plan', 'operational', objective.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Operational plan created: ${objective}`);
    
    return plan;
  }

  trackDeadline(name: string, date: string, owner: string, priority: 'p0' | 'p1' | 'p2' | 'p3' = 'p1'): DeadlineTracking {
    const id = `deadline-${Date.now()}`;
    const daysRemaining = this.calculateDaysRemaining(date);

    const deadline: DeadlineTracking = {
      id,
      name,
      date,
      owner,
      priority,
      status: daysRemaining < 3 ? 'at_risk' : 'on_track',
      blockers: [],
      daysRemaining
    };

    this.trackedDeadlines.set(id, deadline);

    memory.add({
      id: `deadline-${id}`,
      content: JSON.stringify(deadline),
      type: 'deadline',
      agent: this.id,
      tags: ['deadline', priority, owner],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    // Auto-escalate if P0 and < 7 days
    if (priority === 'p0' && daysRemaining < 7) {
      escalationClock.register({
        id: `escalation-${id}`,
        description: `P0 deadline approaching: ${name} (${daysRemaining} days)`,
        assignedManager: owner,
        severity: 'p0',
        resolutionDeadline: date
      });
    }

    return deadline;
  }

  escalateToSprintMode(reason: string): void {
    console.log(`[${this.name}] 🚨 Escalating to Sprint Mode: ${reason}`);
    
    eventBus.publish(BXTHRE3_EVENTS.SPRINT_DECLARED, {
      name: `Sprint: ${reason}`,
      reason,
      declaredBy: this.id,
      timestamp: new Date().toISOString()
    });

    // Notify all managers
    const managers = org.listAll().filter(e => e.role === 'manager');
    for (const manager of managers) {
      console.log(`[${this.name}] Notified ${manager.name} of sprint escalation`);
    }
  }

  coordinateHandoff(from: string, to: string, deliverable: string): { success: boolean; notes: string } {
    const handoffId = `handoff-${Date.now()}`;
    
    memory.add({
      id: handoffId,
      content: `Handoff: ${deliverable} from ${from} to ${to}`,
      type: 'handoff',
      agent: this.id,
      tags: ['handoff', from, to],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Coordinated handoff: ${from} → ${to} (${deliverable})`);

    return {
      success: true,
      notes: `Handoff ${handoffId} logged. Follow-up recommended within 24h.`
    };
  }

  resolveResourceConflict(requests: { employee: string; project: string; hours: number }[]): { allocation: Record<string, string>; conflicts: string[] } {
    const allocation: Record<string, string> = {};
    const conflicts: string[] = [];

    // Simple allocation strategy: first-come, prioritized by grant deadlines
    const sorted = requests.sort((a, b) => {
      const aGrant = grantManager.getAll().find(g => a.project.includes(g.program));
      const bGrant = grantManager.getAll().find(g => b.project.includes(g.program));
      return (aGrant?.daysUntilDue || 999) - (bGrant?.daysUntilDue || 999);
    });

    for (const req of sorted) {
      if (!allocation[req.employee]) {
        allocation[req.employee] = req.project;
      } else {
        conflicts.push(`${req.employee} double-booked: ${allocation[req.employee]} vs ${req.project}`);
      }
    }

    return { allocation, conflicts };
  }

  getStatus(): { 
    activePlans: number; 
    trackedDeadlines: number; 
    atRisk: number; 
    p0Deadlines: DeadlineTracking[];
  } {
    const allDeadlines = Array.from(this.trackedDeadlines.values());
    
    return {
      activePlans: this.activePlans.size,
      trackedDeadlines: allDeadlines.length,
      atRisk: allDeadlines.filter(d => d.status === 'at_risk').length,
      p0Deadlines: allDeadlines.filter(d => d.priority === 'p0')
    };
  }

  // Private helpers

  private checkAllDeadlines(): void {
    for (const [id, deadline] of this.trackedDeadlines) {
      const daysRemaining = this.calculateDaysRemaining(deadline.date);
      
      if (daysRemaining !== deadline.daysRemaining) {
        deadline.daysRemaining = daysRemaining;
        
        // Update status
        if (daysRemaining < 0) deadline.status = 'missed';
        else if (daysRemaining < 3) deadline.status = 'at_risk';
        else if (daysRemaining === 0) {
          deadline.status = 'completed';
          console.log(`[${this.name}] ✅ Deadline completed: ${deadline.name}`);
        }

        // Re-escalate if still at risk
        if (deadline.priority === 'p0' && daysRemaining < 3 && daysRemaining >= 0) {
          console.log(`[${this.name}] 🚨 P0 deadline at risk: ${deadline.name} (${daysRemaining} days)`);
        }
      }
    }
  }

  private calculateDaysRemaining(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export const operator = new OperatorEmployee();
