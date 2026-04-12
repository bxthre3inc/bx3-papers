// 12-Hour Reporting — UAO Synthesis
// Phase 5 of Agentic 3.0 Implementation

import { org } from '../hierarchy/org';
import { router } from '../protocol/messaging';
import { escalationClock } from '../escalation/clock';
import { memory } from '../memory/store';
import { StandupReport, BlockerReport } from '../protocol/types';

export interface AgentSummary {
  agentId: string;
  name: string;
  status: string;
  accomplishments: string[];
  blockers: BlockerReport[];
  requestsPending: number;
  urgency: 'normal' | 'high' | 'critical';
}

export interface DepartmentSummary {
  department: string;
  manager: string;
  activeEmployees: number;
  completedTasks: number;
  activeBlockers: number;
  urgency: 'normal' | 'high' | 'critical';
}

export interface DailyDigest {
  period: 'overnight' | 'daytime';
  startTime: string;
  endTime: string;
  timestamp: string;
  
  executive: {
    totalAgents: number;
    activeNow: number;
    blocked: number;
    needingAttention: number;
  };
  
  departments: DepartmentSummary[];
  agents: AgentSummary[];
  
  critical: {
    escalatedBlockers: BlockerReport[];
    sprintModeActive: boolean;
    upcomingDeadlines: { task: string; deadline: string; owner: string }[];
  };
  
  summary: string; // Natural language synthesis
}

class ReportSynthesizer {
  private lastReportTime: Date | null = null;

  // Run the synthesis cycle (called at 7am and 7pm)
  generate(): DailyDigest {
    const now = new Date();
    const period = this.determinePeriod(now);
    
    // Collect all agent standups from reporting period
    const agents = org.listAll().filter(e => e.role !== 'executive');
    const agentSummaries: AgentSummary[] = [];
    
    for (const agent of agents) {
      const standup = router.getLatestStandup(agent.id);
      const inbox = router.getInbox(agent.id, true);
      const blockers = standup?.blockers || [];
      
      // Determine urgency
      let urgency: AgentSummary['urgency'] = 'normal';
      if (blockers.some(b => b.severity === 'p0')) urgency = 'critical';
      else if (blockers.some(b => b.severity === 'p1')) urgency = 'high';
      else if (inbox.length > 5) urgency = 'high';
      
      agentSummaries.push({
        agentId: agent.id,
        name: agent.name,
        status: agent.status,
        accomplishments: standup?.accomplishments.map(a => a.description) || [],
        blockers,
        requestsPending: inbox.filter(m => 
          (m.payload as any).msgType === 'request'
        ).length,
        urgency
      });
    }

    // Department rollups
    const departments: DepartmentSummary[] = [];
    const depts = ['engineering', 'operations', 'investor_relations'] as const;
    
    for (const dept of depts) {
      const deptAgents = agents.filter(a => a.department === dept);
      const manager = deptAgents.find(a => a.role === 'manager');
      const deptBlockers = agentSummaries
        .filter(a => deptAgents.some(da => da.id === a.agentId))
        .flatMap(a => a.blockers);
      
      let urgency: DepartmentSummary['urgency'] = 'normal';
      if (deptBlockers.some(b => b.severity === 'p0')) urgency = 'critical';
      else if (deptBlockers.some(b => b.severity === 'p1')) urgency = 'high';
      
      departments.push({
        department: dept,
        manager: manager?.name || 'Unassigned',
        activeEmployees: deptAgents.filter(a => a.status === 'working').length,
        completedTasks: agentSummaries
          .filter(a => deptAgents.some(da => da.id === a.agentId))
          .reduce((sum, a) => sum + a.accomplishments.length, 0),
        activeBlockers: deptBlockers.length,
        urgency
      });
    }

    // Executive summary stats
    const activeBlockers = escalationClock.getActive();
    const escalatedToHuman = activeBlockers.filter(b => b.humanEscalationPending);
    
    // Check sprint mode
    const sprintActive = agents.some(a => 
      a.role === 'manager' && (a as any).sprintModeActive
    );

    // Build the digest
    const digest: DailyDigest = {
      period,
      startTime: this.getPeriodStart(now, period).toISOString(),
      endTime: now.toISOString(),
      timestamp: now.toISOString(),
      
      executive: {
        totalAgents: agents.length,
        activeNow: agents.filter(a => a.status === 'working').length,
        blocked: agents.filter(a => a.status === 'blocked').length,
        needingAttention: agentSummaries.filter(a => a.urgency !== 'normal').length
      },
      
      departments,
      agents: agentSummaries,
      
      critical: {
        escalatedBlockers: escalatedToHuman,
        sprintModeActive: sprintActive,
        upcomingDeadlines: this.extractDeadlines(agentSummaries)
      },
      
      summary: this.generateNarrative(agentSummaries, departments, escalatedToHuman)
    };

    this.lastReportTime = now;
    
    // Store in memory
    memory.add({
      id: `report-${now.toISOString()}`,
      content: `Daily digest generated: ${digest.summary}`,
      type: 'report',
      timestamp: now.toISOString(),
      agent: 'synthesizer',
      source: 'synthesizer',
      confidence: 1.0
    });

    return digest;
  }

  // Generate natural language summary
  private generateNarrative(
    agents: AgentSummary[],
    departments: DepartmentSummary[],
    escalated: BlockerReport[]
  ): string {
    const parts: string[] = [];
    
    // High-level summary
    const working = agents.filter(a => a.status === 'working').length;
    const blocked = agents.filter(a => a.status === 'blocked' || a.blockers.length > 0).length;
    parts.push(`${working} agents active, ${blocked} blocked.`);
    
    // Department highlights
    const criticalDept = departments.find(d => d.urgency === 'critical');
    const highDept = departments.find(d => d.urgency === 'high');
    
    if (criticalDept) {
      parts.push(`${criticalDept.department} has critical blockers requiring immediate attention.`);
    } else if (highDept) {
      parts.push(`${highDept.department} has high-priority items pending.`);
    }
    
    // Escalations
    if (escalated.length > 0) {
      parts.push(`${escalated.length} blockers escalated to you for resolution.`);
    }
    
    // Accomplishments
    const totalAccomplishments = agents.reduce((sum, a) => sum + a.accomplishments.length, 0);
    if (totalAccomplishments > 0) {
      parts.push(`${totalAccomplishments} tasks completed across all departments.`);
    }
    
    return parts.join(' ');
  }

  private determinePeriod(now: Date): 'overnight' | 'daytime' {
    const hour = now.getHours();
    return hour < 12 ? 'overnight' : 'daytime';
  }

  private getPeriodStart(now: Date, period: 'overnight' | 'daytime'): Date {
    const start = new Date(now);
    if (period === 'overnight') {
      // 7pm yesterday
      start.setDate(start.getDate() - 1);
      start.setHours(19, 0, 0, 0);
    } else {
      // 7am today
      start.setHours(7, 0, 0, 0);
    }
    return start;
  }

  private extractDeadlines(agents: AgentSummary[]): DailyDigest['critical']['upcomingDeadlines'] {
    const deadlines: DailyDigest['critical']['upcomingDeadlines'] = [];
    
    for (const agent of agents) {
      for (const blocker of agent.blockers) {
        const deadline = new Date(blocker.resolutionDeadline);
        const hoursUntil = (deadline.getTime() - Date.now()) / 1000 / 60 / 60;
        
        if (hoursUntil > 0 && hoursUntil < 48) {
          deadlines.push({
            task: blocker.description,
            deadline: blocker.resolutionDeadline,
            owner: agent.name
          });
        }
      }
    }
    
    return deadlines.sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  }

  // Format digest for display (console, email, etc.)
  format(digest: DailyDigest): string {
    const lines: string[] = [];
    
    lines.push(`═══ AGENTOS DAILY DIGEST ═══`);
    lines.push(`Period: ${digest.period.toUpperCase()} (${new Date(digest.startTime).toLocaleTimeString()} → ${new Date(digest.endTime).toLocaleTimeString()})`);
    lines.push('');
    
    lines.push(`📊 SUMMARY`);
    lines.push(digest.summary);
    lines.push('');
    
    if (digest.critical.escalatedBlockers.length > 0) {
      lines.push(`🚨 ESCALATED TO YOU`);
      for (const blocker of digest.critical.escalatedBlockers) {
        lines.push(`  • [${blocker.severity}] ${blocker.description} (via ${org.get(blocker.assignedManager)?.name})`);
      }
      lines.push('');
    }
    
    if (digest.critical.sprintModeActive) {
      lines.push(`⚡ SPRINT MODE ACTIVE — Resource priority elevated for deadline project`);
      lines.push('');
    }
    
    lines.push(`👥 BY DEPARTMENT`);
    for (const dept of digest.departments) {
      const icon = dept.urgency === 'critical' ? '🔴' : dept.urgency === 'high' ? '🟡' : '🟢';
      lines.push(`  ${icon} ${dept.department}: ${dept.activeEmployees} active, ${dept.activeBlockers} blockers (${dept.manager})`);
    }
    lines.push('');
    
    lines.push(`📈 AGENT STATUS`);
    for (const agent of digest.agents) {
      const icon = agent.urgency === 'critical' ? '🔴' : agent.urgency === 'high' ? '🟡' : '⚪';
      const status = agent.blockers.length > 0 ? `blocked (${agent.blockers.length})` : agent.status;
      lines.push(`  ${icon} ${agent.name}: ${status} | ${agent.accomplishments.length} done | ${agent.requestsPending} pending`);
    }
    
    return lines.join('\n');
  }

  // Should we run now? (for scheduler)
  shouldRun(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Run at 7:00 AM and 7:00 PM
    return (hour === 7 || hour === 19) && minute < 5;
  }
}

export const synthesizer = new ReportSynthesizer();
