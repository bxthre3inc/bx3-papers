// IP Portfolio Management
// Patent-native tracking for Bxthre3 & subsidiaries

import { memory } from '../memory/store';
import { eventBus, BXTHRE3_EVENTS } from '../events/bus';

export type PatentStatus = 'ideation' | 'provisional' | 'full' | 'granted' | 'licensed' | 'abandoned';
export type PatentPriority = 'strategic' | 'defensive' | 'revenue' | 'future';

export interface Patent {
  id: string;
  title: string;
  description: string;
  
  // Ownership
  entity: string; // Bxthre3 Inc, Irrig8 Inc, etc.
  inventors: string[];
  
  // Classification
  status: PatentStatus;
  priority: PatentPriority;
  
  // Filing dates
  provisionalFiled?: string;
  provisionalExpires?: string; // Auto-calculated: +12 months
  fullFiled?: string;
  granted?: string;
  patentNumber?: string;
  
  // Auto-calculated
  daysUntilProvisionalExpiry: number | null;
  
  // Maintenance
  maintenanceFees: MaintenanceFee[];
  nextMaintenanceDue?: string;
  
  // Value
  licensingRevenue: number;
  licensingDeals: LicenseDeal[];
  blockingCompetitors: string[];
  
  // Agent assignment
  agent: string; // Iris — IP Specialist
  attorney?: string; // External counsel
  
  // Documents
  documents: {
    provisional?: string;
    fullApplication?: string;
    drawings?: string[];
    claims?: string;
    priorArt?: string[];
  };
  
  // History
  history: PatentHistoryEntry[];
}

export interface MaintenanceFee {
  year: number;
  dueDate: string;
  amount: number;
  paid: boolean;
  paidDate?: string;
}

export interface LicenseDeal {
  id: string;
  licensee: string;
  startDate: string;
  endDate?: string;
  revenue: number;
  terms: string;
  status: 'active' | 'expired' | 'terminated';
}

export interface PatentHistoryEntry {
  timestamp: string;
  action: string;
  agent: string;
  details: string;
}

export interface IPPortfolio {
  patents: Patent[];
  
  // By entity (for subsidiary isolation)
  byEntity: Record<string, Patent[]>;
  
  // By status
  byStatus: Record<PatentStatus, number>;
  
  // Critical dates
  upcomingDeadlines: {
    provisionalExpiring: Patent[];
    maintenanceDue: Patent[];
    fullFilingDue: Patent[];
  };
  
  // Value
  totalLicensingRevenue: number;
  portfolioValue: number;
  
  // Strategy
  competitorsBlocked: string[];
  licensingOpportunities: string[];
}

export class IPPortfolioManager {
  private patents = new Map<string, Patent>();

  addPatent(patent: Omit<Patent, 'id' | 'daysUntilProvisionalExpiry' | 'history'>): Patent {
    const id = `patent-${Date.now()}`;
    
    // Calculate days until provisional expires (if applicable)
    let daysUntilProvisionalExpiry: number | null = null;
    if (patent.provisionalExpires) {
      daysUntilProvisionalExpiry = Math.ceil(
        (new Date(patent.provisionalExpires).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
    }

    const fullPatent: Patent = {
      ...patent,
      id,
      daysUntilProvisionalExpiry,
      history: [{
        timestamp: new Date().toISOString(),
        action: 'created',
        agent: patent.agent,
        details: `Patent added to portfolio: ${patent.title}`
      }]
    };

    this.patents.set(id, fullPatent);
    
    // Store in memory (entity-scoped)
    memory.add({
      id: `ip-${id}`,
      content: `${patent.title} — ${patent.status}. Entity: ${patent.entity}`,
      tags: ['patent', patent.status, patent.entity.toLowerCase().replace(/\s+/g, '-')],
      relationships: [],
      timestamp: new Date().toISOString()
    });

    // Check for critical deadline
    if (daysUntilProvisionalExpiry !== null && daysUntilProvisionalExpiry <= 30 && daysUntilProvisionalExpiry > 0) {
      eventBus.publish({
        type: BXTHRE3_EVENTS.PATENT_DEADLINE,
        data: { 
          patent: id,
          daysUntil: daysUntilProvisionalExpiry,
          type: 'provisional-expiry'
        },
        source: 'ip-portfolio',
        priority: daysUntilProvisionalExpiry <= 7 ? 'critical' : 'high'
      });
    }

    return fullPatent;
  }

  updateStatus(patentId: string, newStatus: PatentStatus, agent: string, notes?: string): Patent | null {
    const patent = this.patents.get(patentId);
    if (!patent) return null;

    const oldStatus = patent.status;
    patent.status = newStatus;
    
    patent.history.push({
      timestamp: new Date().toISOString(),
      action: `status:${oldStatus}->${newStatus}`,
      agent,
      details: notes || `Status updated to ${newStatus}`
    });

    if (newStatus === 'granted') {
      eventBus.publish({
        type: BXTHRE3_EVENTS.PATENT_GRANTED,
        data: { patent: patentId, number: patent.patentNumber },
        source: 'ip-portfolio',
        priority: 'high'
      });
    }

    return patent;
  }

  getPortfolio(entity?: string): IPPortfolio {
    const all = Array.from(this.patents.values());
    const patents = entity ? all.filter(p => p.entity === entity) : all;
    
    const byStatus: Record<PatentStatus, number> = {
      'ideation': 0, 'provisional': 0, 'full': 0, 
      'granted': 0, 'licensed': 0, 'abandoned': 0
    };
    patents.forEach(p => byStatus[p.status]++);

    return {
      patents,
      byEntity: this.groupByEntity(all),
      byStatus,
      upcomingDeadlines: {
        provisionalExpiring: patents.filter(p => 
          p.daysUntilProvisionalExpiry !== null && 
          p.daysUntilProvisionalExpiry <= 60 && 
          p.daysUntilProvisionalExpiry > 0
        ).sort((a, b) => (a.daysUntilProvisionalExpiry || 0) - (b.daysUntilProvisionalExpiry || 0)),
        maintenanceDue: patents.filter(p => {
          if (!p.nextMaintenanceDue) return false;
          const days = Math.ceil((new Date(p.nextMaintenanceDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return days <= 90 && days > 0;
        }),
        fullFilingDue: patents.filter(p => 
          p.status === 'provisional' && 
          p.daysUntilProvisionalExpiry !== null && 
          p.daysUntilProvisionalExpiry <= 90 && 
          p.daysUntilProvisionalExpiry > 0
        )
      },
      totalLicensingRevenue: patents.reduce((sum, p) => sum + p.licensingRevenue, 0),
      portfolioValue: this.calculatePortfolioValue(patents),
      competitorsBlocked: [...new Set(patents.flatMap(p => p.blockingCompetitors))],
      licensingOpportunities: patents
        .filter(p => p.status === 'granted' && p.licensingDeals.length === 0)
        .map(p => p.title)
    };
  }

  private groupByEntity(patents: Patent[]): Record<string, Patent[]> {
    const grouped: Record<string, Patent[]> = {};
    for (const p of patents) {
      if (!grouped[p.entity]) grouped[p.entity] = [];
      grouped[p.entity].push(p);
    }
    return grouped;
  }

  private calculatePortfolioValue(patents: Patent[]): number {
    // Simplified valuation
    let value = 0;
    for (const p of patents) {
      // Granted patents worth more
      if (p.status === 'granted') value += 500000;
      else if (p.status === 'full') value += 250000;
      else if (p.status === 'provisional') value += 50000;
      
      // Licensing revenue
      value += p.licensingRevenue;
    }
    return value;
  }

  getCriticalBriefing(): string {
    const portfolio = this.getPortfolio();
    const { provisionalExpiring, maintenanceDue, fullFilingDue } = portfolio.upcomingDeadlines;
    
    let briefing = '';
    
    if (provisionalExpiring.length > 0) {
      const closest = provisionalExpiring[0];
      briefing += `⚠️ Provisional expires: ${closest.title} (${closest.entity}) in ${closest.daysUntilProvisionalExpiry} days\n`;
    }
    
    if (fullFilingDue.length > 0) {
      briefing += `📄 Full filing due: ${fullFilingDue.length} patents need conversion\n`;
    }
    
    if (maintenanceDue.length > 0) {
      briefing += `💰 Maintenance fees: ${maintenanceDue.length} patents due\n`;
    }
    
    briefing += `\nPortfolio: ${portfolio.patents.length} patents, $${portfolio.portfolioValue.toLocaleString()} value`;
    
    return briefing || 'No critical IP deadlines';
  }

  // Daily refresh
  refresh(): void {
    for (const patent of this.patents.values()) {
      if (patent.provisionalExpires) {
        patent.daysUntilProvisionalExpiry = Math.ceil(
          (new Date(patent.provisionalExpires).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        
        // Alert if critical
        if (patent.daysUntilProvisionalExpiry === 30 || patent.daysUntilProvisionalExpiry === 7) {
          eventBus.publish({
            type: BXTHRE3_EVENTS.PATENT_DEADLINE,
            data: { 
              patent: patent.id,
              daysUntil: patent.daysUntilProvisionalExpiry,
              type: 'provisional-expiry-warning'
            },
            source: 'ip-portfolio',
            priority: patent.daysUntilProvisionalExpiry <= 7 ? 'critical' : 'high'
          });
        }
      }
    }
  }
}

export const ipManager = new IPPortfolioManager();
