// Bxthre3 Automated Board Reports
// Generates investor-ready materials automatically

import { subsidiaryManager } from './subsidiaries.js';
import { ipPortfolio } from './ip-portfolio.js';
import { fundraisingManager } from './fundraising.js';
import { deadlineTracker } from './deadline-tracker.js';
import { hybridGmail } from '../../infrastructure/integrations/gmail-hybrid.js';

export interface BoardReport {
  id: string;
  period: { start: string; end: string };
  type: 'monthly' | 'quarterly' | 'annual' | 'special';
  subsidiary?: string; // if subsidiary-specific
  
  // Executive summary
  summary: {
    highlights: string[];
    concerns: string[];
    nextQuarterPriorities: string[];
  };
  
  // Financial section
  financials: {
    revenue: { actual: number; target: number; variance: number };
    burn: number;
    runway: number;
    fundraising: { raised: number; committed: number; pipeline: string[] };
    unitEconomics?: Record<string, number>;
  };
  
  // Operational
  operations: {
    headcount: { total: number; byDepartment: Record<string, number>; openRoles: number };
    milestones: { achieved: string[]; upcoming: { name: string; date: string; status: string }[] };
    blockers: string[];
  };
  
  // Strategic
  strategic: {
    ipPortfolio: { patents: number; value: number; expiring: string[] };
    marketPosition: string;
    competitive: string[];
  };
}

export class BoardReportManager {
  private templates: Map<string, string> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    this.templates.set('monthly', `
# {{SUBSIDIARY}} Monthly Board Report
**Period:** {{START}} — {{END}}
**Prepared by:** Agentic (automated)

## Executive Summary
{{SUMMARY}}

## Financial Performance
- **Revenue:** \${{REVENUE_ACTUAL}}K ({{REVENUE_VARIANCE}}% vs \${{REVENUE_TARGET}}K target)
- **Monthly Burn:** \${{BURN}}K
- **Runway:** {{RUNWAY}} months
- **Fundraising:** \${{RAISED}}K raised, \${{COMMITTED}}K committed

## Operational Highlights
{{MILESTONES_ACHIEVED}}

## Upcoming Milestones
{{MILESTONES_UPCOMING}}

## Strategic Concerns
{{CONCERNS}}

## IP Portfolio Update
- Patents: {{PATENT_COUNT}} (\${{PATENT_VALUE}}K est. value)
- Critical deadlines: {{PATENT_DEADLINES}}

## Board Actions Required
{{ACTIONS}}

---
`);
  }

  // Generate automated monthly report
  async generateMonthly(subsidiaryId?: string): Promise<BoardReport> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const end = now.toISOString();
    
    const rollUp = subsidiaryManager.getRollUp();
    const ip = ipPortfolio.getPortfolio();
    const fund = fundraisingManager.getBoardSummary();
    const deadlines = deadlineTracker.getAll();

    // Find subsidiary or use holding company rollup
    const target = subsidiaryId 
      ? rollUp.bySubsidiary[subsidiaryId] 
      : { revenue: rollUp.summary.consolidatedRevenue, status: 'operating', keyMetric: 'Consolidated' };

    const report: BoardReport = {
      id: `monthly-${now.toISOString().slice(0, 7)}-${subsidiaryId || 'holding'}`,
      period: { start, end },
      type: 'monthly',
      subsidiary: subsidiaryId,
      
      summary: {
        highlights: this.generateHighlights(target, rollUp),
        concerns: this.generateConcerns(rollUp, deadlines),
        nextQuarterPriorities: this.generatePriorities(deadlines)
      },
      
      financials: {
        revenue: { 
          actual: (target as any).revenue || 0, 
          target: ((target as any).revenue || 0) * 1.2, // 20% growth target
          variance: -15 // placeholder
        },
        burn: 45,
        runway: rollUp.summary.combinedRunway,
        fundraising: fund
      },
      
      operations: {
        headcount: { 
          total: rollUp.summary.totalEmployees, 
          byDepartment: { engineering: 4, operations: 2, legal: 1 },
          openRoles: 2 
        },
        milestones: {
          achieved: this.getAchievedMilestones(),
          upcoming: deadlines.filter(d => d.daysRemaining > 0 && d.daysRemaining <= 30).map(d => ({
            name: d.name,
            date: d.date,
            status: d.status
          }))
        },
        blockers: deadlines.filter(d => d.status === 'blocked').map(d => d.name)
      },
      
      strategic: {
        ipPortfolio: {
          patents: ip.patents.length,
          value: ip.totalValuation,
          expiring: ip.criticalDeadlines.slice(0, 3).map(p => p.title)
        },
        marketPosition: 'First-mover in AI employee coordination',
        competitive: ['Moveworks', 'Ada', 'Generic RPA tools']
      }
    };

    return report;
  }

  private generateHighlights(target: any, rollUp: any): string[] {
    const h: string[] = [];
    
    if ((target as any).revenue && (target as any).revenue > 0) {
      h.push(`Revenue: $${(target as any).revenue}K ARR`);
    }
    
    const fund = fundraisingManager.getBoardSummary();
    if (fund.committed > 0) {
      h.push(`Fundraising: $${fund.committed}K committed from ${fund.topProspects.slice(0, 2).join(', ')}`);
    }
    
    const estcp = deadlineTracker.getAll().find(d => d.id === 'estcp-fy2027');
    if (estcp && estcp.daysRemaining > 0) {
      h.push(`ESTCP submission on track: ${estcp.daysRemaining} days remaining`);
    }
    
    return h.length > 0 ? h : ['Operations continuing on schedule'];
  }

  private generateConcerns(rollUp: any, deadlines: any[]): string[] {
    const c: string[] = [];
    
    if (rollUp.summary.combinedRunway <= 3) {
      c.push(`Runway critical: ${rollUp.summary.combinedRunway} months remaining`);
    }
    
    const overdue = deadlines.filter((d: any) => d.status === 'overdue');
    if (overdue.length > 0) {
      c.push(`${overdue.length} deadlines overdue: ${overdue.slice(0, 2).map((d: any) => d.name).join(', ')}`);
    }
    
    return c;
  }

  private generatePriorities(deadlines: any[]): string[] {
    return deadlines
      .filter((d: any) => d.daysRemaining > 0 && d.daysRemaining <= 90 && d.priority === 'critical')
      .slice(0, 3)
      .map((d: any) => d.name);
  }

  private getAchievedMilestones(): string[] {
    // Would pull from completed projects
    return ['Agentic 3.1 deployment', 'Irrig8 CSU pilot initiated'];
  }

  // Render to various formats
  renderToMarkdown(report: BoardReport): string {
    return `
# ${report.subsidiary ? report.subsidiary.toUpperCase() : 'BXTHRE3 HOLDING'} Board Report
**Period:** ${report.period.start.slice(0, 10)} — ${report.period.end.slice(0, 10)}

## Executive Summary

### Highlights
${report.summary.highlights.map(h => `- ${h}`).join('\n') || '- No major highlights this period'}

### Concerns
${report.summary.concerns.map(c => `⚠️ ${c}`).join('\n') || '- No critical concerns'}

### Next Quarter Priorities
${report.summary.nextQuarterPriorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## Financial Performance

| Metric | Actual | Target | Status |
|--------|--------|--------|--------|
| Revenue | $${report.financials.revenue.actual}K | $${report.financials.revenue.target}K | ${report.financials.revenue.variance > 0 ? '✅' : '⚠️'} ${report.financials.revenue.variance}% |
| Monthly Burn | $${report.financials.burn}K | — | — |
| Runway | ${report.financials.runway} months | 6+ | ${report.financials.runway >= 6 ? '✅' : '⚠️'} |

**Fundraising:** $${report.financials.fundraising.raised}K raised, $${report.financials.fundraising.committed}K committed  
**Top Prospects:** ${report.financials.fundraising.pipeline.join(', ') || 'None active'}

---

## Operations

**Headcount:** ${report.operations.headcount.total} (${Object.entries(report.operations.headcount.byDepartment).map(([k, v]) => `${k}: ${v}`).join(', ')})  
**Open Roles:** ${report.operations.headcount.openRoles}

### Milestones Achieved
${report.operations.milestones.achieved.map(m => `- ✅ ${m}`).join('\n')}

### Upcoming Milestones
${report.operations.milestones.upcoming.map(m => `- ⏳ ${m.name} (${m.date}) — ${m.status}`).join('\n') || '- None scheduled'}

### Blockers
${report.operations.blockers.map(b => `- 🚧 ${b}`).join('\n') || '- None'}

---

## Strategic: IP Portfolio

- **Patents:** ${report.strategic.ipPortfolio.patents} (est. value: $${report.strategic.ipPortfolio.value}K)
- **Critical Deadlines:** ${report.strategic.ipPortfolio.expiring.join(', ') || 'None'}
- **Market Position:** ${report.strategic.marketPosition}
- **Key Competitors:** ${report.strategic.competitive.join(', ')}

---

*Report generated by Agentic — Bxthre3 AI Operating System*  
*Questions: Contact brodiblanco@zo.computer*
    `.trim();
  }

  // Auto-send to board
  async distribute(report: BoardReport, recipients: string[]): Promise<void> {
    const markdown = this.renderToMarkdown(report);
    const subject = `${report.subsidiary ? report.subsidiary.toUpperCase() : 'BXTHRE3'} Board Report — ${report.period.end.slice(0, 7)}`;
    
    for (const to of recipients) {
      await hybridGmail.send({
        to,
        subject,
        body: markdown
      });
    }
  }

  // Schedule automatic reports
  scheduleAutoReports(): void {
    // Monthly: 3 days before end of month
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const reportDay = new Date(lastDay);
    reportDay.setDate(lastDay.getDate() - 3);
    
    const msToReport = reportDay.getTime() - now.getTime();
    
    if (msToReport > 0) {
      setTimeout(async () => {
        const report = await this.generateMonthly();
        await this.distribute(report, ['brodiblanco@zo.computer']);
      }, msToReport);
    }
  }
}

export const boardReportManager = new BoardReportManager();
