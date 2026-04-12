// Bxthre3 IP Portfolio Manager
// Tracks 28 patents, filings, deadlines, strategy

import { memory } from '../memory/store.js';
import { eventBus } from '../events/bus.js';
import { subsidiaryManager } from './subsidiaries.js';

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  assignee: 'Bxthre3 Inc.' | 'Irrig8 Inc.' | string;
  status: 'concept' | 'provisional' | 'pending' | 'granted' | 'abandoned';
  priorityDate?: string;
  filingDate?: string;
  provisionalExpiry?: string; // 12 months from provisional
  claims: number;
  jurisdiction: ('US' | 'PCT' | 'CN' | 'EU')[];
  technology: string;
  products: string[];
  valuation: number; // estimated value in $K
  nextAction: string;
  nextDeadline?: string;
  daysToDeadline?: number;
}

export class IPPortfolioManager {
  private patents: Map<string, Patent> = new Map();

  constructor() {
    this.loadPortfolio();
    this.startMonitoring();
  }

  private loadPortfolio(): void {
    // Core Bxthre3 patents (from Patent Architecture)
    const corePatents: Patent[] = [
      {
        id: 'arkad-digital-employee',
        title: 'Digital Employee Operating System with Temporal Escalation',
        inventors: ['brodiblanco'],
        assignee: 'Bxthre3 Inc.',
        status: 'provisional',
        priorityDate: '2026-03-14',
        filingDate: '2026-03-14',
        provisionalExpiry: '2027-03-14',
        claims: 3,
        jurisdiction: ['US'],
        technology: 'AI Agent Coordination',
        products: ['Agentic', 'Starting5'],
        valuation: 2500,
        nextAction: 'Convert to non-provisional',
        nextDeadline: '2026-04-14', // 30 days before expiry for safety
        daysToDeadline: 28
      },
      {
        id: 'irrig8-iot-water',
        title: 'High-Resolution Agricultural Water Rights Trading Platform',
        inventors: ['brodiblanco', 'Irrig8 Team'],
        assignee: 'Irrig8 Inc.',
        status: 'concept',
        claims: 5,
        jurisdiction: ['US'],
        technology: 'Water Rights + Blockchain',
        products: ['Irrig8'],
        valuation: 5000,
        nextAction: 'Draft provisional filing',
        nextDeadline: '2026-06-01'
      }
    ];

    for (const p of corePatents) {
      this.patents.set(p.id, p);
    }

    // Load additional patents from memory
    const saved = memory.query({ tags: ['patent', 'ip'], limit: 100 });
    for (const m of saved) {
      try {
        const p = JSON.parse(m.node.content);
        if (p.id) this.patents.set(p.id, p);
      } catch {}
    }
  }

  private startMonitoring(): void {
    // Check deadlines weekly, but daily for imminent ones
    setInterval(() => this.checkDeadlines(), 24 * 60 * 60 * 1000);
    setTimeout(() => this.checkDeadlines(), 10000);
  }

  private checkDeadlines(): void {
    for (const [id, patent] of this.patents) {
      if (!patent.nextDeadline) continue;
      
      const daysTo = this.calculateDaysTo(patent.nextDeadline);
      patent.daysToDeadline = daysTo;

      // Critical: 30 days before provisional expiry
      if (daysTo <= 30 && patent.status === 'provisional') {
        eventBus.publish('ip.provisional-expiring', 'ip-portfolio', {
          patentId: id,
          title: patent.title,
          daysToExpiry: daysTo,
          action: patent.nextAction
        }, 'critical');
      }

      // General deadline alerts
      if (daysTo <= 7) {
        eventBus.publish('ip.deadline-approaching', 'ip-portfolio', {
          patentId: id,
          title: patent.title,
          daysToDeadline: daysTo,
          nextAction: patent.nextAction
        }, 'high');
      }
    }
  }

  private calculateDaysTo(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Portfolio analytics
  getPortfolio(): { patents: Patent[]; byStatus: Record<string, number>; totalValuation: number; criticalDeadlines: Patent[] } {
    const patents = Array.from(this.patents.values());
    const byStatus: Record<string, number> = {};
    let totalValuation = 0;
    
    for (const p of patents) {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
      totalValuation += p.valuation;
    }

    const criticalDeadlines = patents
      .filter(p => p.daysToDeadline !== undefined && p.daysToDeadline <= 30)
      .sort((a, b) => (a.daysToDeadline || 999) - (b.daysToDeadline || 999));

    return { patents, byStatus, totalValuation, criticalDeadlines };
  }

  getByAssignee(assignee: string): Patent[] {
    return Array.from(this.patents.values())
      .filter(p => p.assignee === assignee);
  }

  getByTechnology(tech: string): Patent[] {
    return Array.from(this.patents.values())
      .filter(p => p.technology.toLowerCase().includes(tech.toLowerCase()));
  }

  // Strategic functions
  getSubsidiaryIPBreakdown(): Record<string, { patents: number; valuation: number; nextDeadline?: string }> {
    const breakdown: Record<string, any> = {};
    
    for (const [id, p] of this.patents) {
      if (!breakdown[p.assignee]) {
        breakdown[p.assignee] = { patents: 0, valuation: 0, nextDeadline: undefined };
      }
      breakdown[p.assignee].patents++;
      breakdown[p.assignee].valuation += p.valuation;
      
      if (p.nextDeadline && (!breakdown[p.assignee].nextDeadline || p.nextDeadline < breakdown[p.assignee].nextDeadline)) {
        breakdown[p.assignee].nextDeadline = p.nextDeadline;
      }
    }

    return breakdown;
  }

  addPatent(patent: Omit<Patent, 'daysToDeadline'>): void {
    const full: Patent = {
      ...patent,
      daysToDeadline: patent.nextDeadline ? this.calculateDaysTo(patent.nextDeadline) : undefined
    };
    
    this.patents.set(patent.id, full);
    
    memory.add({
      id: `patent-${patent.id}`,
      content: JSON.stringify(full),
      type: 'patent',
      agent: 'ip-portfolio',
      tags: ['patent', 'ip', patent.status, patent.assignee],
      timestamp: new Date().toISOString(),
      source: 'ip-portfolio'
    });

    eventBus.publish('ip.patent-added', 'ip-portfolio', { patent: full }, 'normal');
  }

  updateStatus(id: string, status: Patent['status'], nextAction?: string): boolean {
    const p = this.patents.get(id);
    if (!p) return false;
    
    p.status = status;
    if (nextAction) p.nextAction = nextAction;
    p.daysToDeadline = p.nextDeadline ? this.calculateDaysTo(p.nextDeadline) : undefined;
    
    return true;
  }

  // Cross-subsidiary patent strategy
  recommendFilingStrategy(product: string, technology: string): { jurisdiction: string[]; priority: string; estimatedCost: number; timeline: string } {
    // Based on Bxthre3's strategy
    return {
      jurisdiction: ['US', 'PCT'],
      priority: product === 'Irrig8' ? 'High (water rights = strategic)' : 'Medium',
      estimatedCost: 15000 + 5000 + 3000, // US provisional + PCT + attorney
      timeline: 'Provisional: Immediate | PCT: 12 months'
    };
  }

  // Quick status for dashboards
  getQuickStatus(): {
    totalPatents: number;
    patentsPending: number;
    provisionalExpiring: Patent[];
    criticalDeadlines: Patent[];
    byStatus: Record<string, number>;
  } {
    const all = Array.from(this.patents.values());
    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    const byStatus: Record<string, number> = {};
    for (const p of all) {
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    }

    return {
      totalPatents: all.length,
      patentsPending: all.filter(p => p.status === 'pending').length,
      provisionalExpiring: all.filter(p => {
        if (!p.provisionalExpiry) return false;
        const expiry = new Date(p.provisionalExpiry).getTime();
        return expiry - now.getTime() < thirtyDays && expiry > now.getTime();
      }),
      criticalDeadlines: all.filter(p => {
        if (!p.nextDeadline) return false;
        const deadline = new Date(p.nextDeadline).getTime();
        return deadline - now.getTime() < thirtyDays && deadline > now.getTime();
      }),
      byStatus
    };
  }
}

export const ipPortfolio = new IPPortfolioManager();
