// Casey — Grant Coordinator Employee
// Migrated from native Zo agent 2026-03-19

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';
import { grantManager } from '../grants/manager';

export interface GrantStatus {
  name: string;
  deadline: string;
  daysLeft: number;
  amount: string;
  status: 'identified' | 'research' | 'drafting' | 'review' | 'submitted' | 'awarded' | 'declined';
  blockers: { id: string; description: string; resolved: boolean }[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PipelineOpportunity {
  source: string;
  program: string;
  deadline: string;
  amount: string;
  fit: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'MONITORING' | 'EVALUATING' | 'NEW_DISCOVERY';
}

export class CaseyEmployee {
  id = 'casey';
  name = 'Casey';
  role = 'Grant Coordinator';
  department = 'investor_relations';
  
  private checkInterval: NodeJS.Timeout | null = null;
  
  start(): void {
    console.log('[Casey] Grant coordinator active');
    
    // Daily check at 9:00 AM
    this.scheduleDailyCheck();
    
    // T-5 escalation watch for ESTCP (March 21)
    this.scheduleEscalationWatch();
  }
  
  stop(): void {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }
  
  private scheduleDailyCheck(): void {
    const check = () => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() < 5) {
        this.runDailyCheck();
      }
    };
    this.checkInterval = setInterval(check, 60 * 1000); // Check every minute
  }
  
  private scheduleEscalationWatch(): void {
    // T-5 watch: March 21 for March 26 deadline
    const march21 = new Date('2026-03-21T09:00:00Z');
    const now = new Date();
    
    if (now < march21) {
      const msUntil = march21.getTime() - now.getTime();
      setTimeout(() => {
        this.triggerT5Escalation();
      }, msUntil);
    }
  }
  
  runDailyCheck(): void {
    console.log(`[Casey] Daily grant check: ${new Date().toISOString()}`);
    
    const activeGrants = this.getActiveGrants();
    const pipeline = this.getPipeline();
    
    // Check for deadline warnings
    for (const grant of activeGrants) {
      if (grant.daysLeft <= 5 && grant.daysLeft > 0) {
        escalationClock.register({
          id: `grant-deadline-${grant.name}`,
          type: 'grant_deadline',
          description: `${grant.name} deadline in ${grant.daysLeft} days`,
          severity: grant.daysLeft <= 2 ? 'p0' : 'p1',
          assignedAgent: this.id,
          assignedManager: 'taylor',
          resolutionDeadline: grant.deadline,
          humanEscalationPending: grant.daysLeft <= 2
        });
      }
    }
    
    // Log status
    memory.add({
      id: `casey-check-${Date.now()}`,
      type: 'grant-check',
      agent: this.id,
      content: `Daily check: ${activeGrants.length} active grants, ${pipeline.length} pipeline opportunities`,
      timestamp: new Date().toISOString(),
      tags: ['grant', 'daily-check', 'casey']
    });
    
    // Publish update
    eventBus.publish(BXTHRE3_EVENTS.GRANT_UPDATED, 'casey', {
      activeGrants: activeGrants.length,
      urgentDeadlines: activeGrants.filter(g => g.daysLeft <= 5).length
    }, 'normal');
    
    // Update status file
    this.updateStatusFile(activeGrants, pipeline);
  }
  
  private triggerT5Escalation(): void {
    console.log('[Casey] T-5 escalation triggered for ESTCP');
    
    eventBus.publish(BXTHRE3_EVENTS.SPRINT_AUTO_ACTIVATED, 'casey', {
      reason: 'ESTCP grant deadline T-5',
      deadline: '2026-03-26',
      project: 'ESTCP FY 2027'
    }, 'critical');
  }
  
  getActiveGrants(): GrantStatus[] {
    // Load from grantManager
    const grants = grantManager.listActive();
    return grants.map(g => ({
      name: g.program,
      deadline: g.dueDate,
      daysLeft: g.daysUntilDue,
      amount: `$${g.amount.max.toLocaleString()}`,
      status: g.status,
      blockers: [], // Would check blocker system
      confidence: g.winProbability > 70 ? 'HIGH' : g.winProbability > 40 ? 'MEDIUM' : 'LOW'
    }));
  }
  
  getPipeline(): PipelineOpportunity[] {
    // Return tracked opportunities
    return [
      {
        source: 'USDA NIFA',
        program: 'AFRI Rapid Response Grants',
        deadline: 'OPEN (rolling)',
        amount: 'Up to $500,000',
        fit: 'MEDIUM',
        status: 'MONITORING'
      },
      {
        source: 'USDA NIFA',
        program: 'AFRI Strengthening Agricultural Systems',
        deadline: 'OPEN',
        amount: '$140M available',
        fit: 'HIGH',
        status: 'MONITORING'
      }
    ];
  }
  
  private updateStatusFile(active: GrantStatus[], pipeline: PipelineOpportunity[]): void {
    const fs = require('fs');
    const status = {
      employee: this.id,
      role: this.role,
      organization: 'Bxthre3/Irrig8',
      last_updated: new Date().toISOString(),
      active_grants: active,
      pipeline_opportunities: pipeline,
      escalation_flags: active.filter(g => g.daysLeft <= 2).map(g => ({
        grant: g.name,
        days_left: g.daysLeft,
        severity: g.daysLeft <= 1 ? 'CRITICAL' : 'WARNING'
      })),
      next_check: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    fs.writeFileSync(
      '/home/workspace/Bxthre3/agents/status/casey.json',
      JSON.stringify(status, null, 2)
    );
  }
  
  // Get quick status for dashboards
  getQuickStatus(): { activeGrants: number; urgent: number; nextDeadline: string | null } {
    const active = this.getActiveGrants();
    const urgent = active.filter(g => g.daysLeft <= 5);
    const next = active.sort((a, b) => a.daysLeft - b.daysLeft)[0];
    
    return {
      activeGrants: active.length,
      urgent: urgent.length,
      nextDeadline: next?.deadline || null
    };
  }
}

export const casey = new CaseyEmployee();
