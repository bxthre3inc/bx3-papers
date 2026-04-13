// Bxthre3 Subsidiary Coordination Manager
// Multi-entity: Irrig8, Starting5, ValleyPlayersClub, future entities

import { memory } from '../memory/store.js';
import { eventBus } from '../events/bus.js';

export interface Subsidiary {
  id: string;
  name: string;
  legalName: string;
  status: 'concept' | 'incorporated' | 'operating' | 'spun-out' | 'acquired' | 'wound-down';
  ceo: string; // employee id, or external if spun out
  manager: string; // holding company manager
  funding: {
    raised: number;
    committed: number;
    runwayMonths: number;
    nextRound?: string;
  };
  employees: string[]; // agent employee ids
  projects: string[];
  ip: string[]; // patent ids
  metrics: Record<string, number>;
  boardMeetings: { date: string; type: 'quarterly' | 'annual' | 'special'; status: 'scheduled' | 'completed' }[];
  holding: {
    ownershipPercent: number;
    boardSeats: number;
    votingRights: string;
  };
}

export interface CrossProjectDependency {
  from: string; // project id
  to: string;
  deliverable: string;
  deadline: string;
  status: 'waiting' | 'in-progress' | 'delivered' | 'blocked';
  impact: 'critical' | 'high' | 'normal';
}

export class SubsidiaryManager {
  private subsidiaries: Map<string, Subsidiary> = new Map();
  private dependencies: CrossProjectDependency[] = [];

  constructor() {
    this.loadSubsidiaries();
    this.startMonitoring();
  }

  private loadSubsidiaries(): void {
    // Irrig8 — first subsidiary
    this.subsidiaries.set('irrig8', {
      id: 'irrig8',
      name: 'Irrig8',
      legalName: 'Irrig8 Inc.',
      status: 'operating',
      ceo: 'brodiblanco', // Acting CEO until funded
      manager: 'raj', // VP Operations manages from Bxthre3
      funding: {
        raised: 0,
        committed: 150,
        runwayMonths: 3,
        nextRound: 'Seed $500K by April 30'
      },
      employees: ['casey', 'jordan-researcher', 'iris', 'drew', 'theo', 'avery-ops'],
      projects: ['estcp-fy2027', 'csu-pilot', 'san-luis-valley'],
      ip: ['irrig8-iot-water', 'irrig8-oracle'],
      metrics: {
        sensorsDeployed: 0,
        acresCovered: 0,
        pilotCustomers: 1,
        estcpProgress: 75 // percent
      },
      boardMeetings: [
        { date: '2026-03-20', type: 'special', status: 'scheduled' } // Pre-ESTCP review
      ],
      holding: {
        ownershipPercent: 100,
        boardSeats: 2,
        votingRights: 'full'
      }
    });

    // Starting5 — future spin-out
    this.subsidiaries.set('starting5', {
      id: 'starting5',
      name: 'Starting5',
      legalName: 'Starting5 Technologies Inc.',
      status: 'concept',
      ceo: 'tbd',
      manager: 'morgan',
      funding: {
        raised: 0,
        committed: 0,
        runwayMonths: 6 // Funded by Bxthre3 R&D
      },
      employees: ['morgan', 'jordan-dev'],
      projects: ['platform-mvp', 'agent-marketplace'],
      ip: ['arkad-digital-employee'],
      metrics: {
        betaUsers: 0,
        mrr: 0
      },
      boardMeetings: [],
      holding: {
        ownershipPercent: 100,
        boardSeats: 2,
        votingRights: 'full'
      }
    });

    // ValleyPlayersClub — existing, not spun out
    this.subsidiaries.set('valleyplayersclub', {
      id: 'valleyplayersclub',
      name: 'Valley Players Club',
      legalName: 'Valley Players Club LLC',
      status: 'operating',
      ceo: 'brodiblanco',
      manager: 'raj',
      funding: {
        raised: 0,
        committed: 0,
        runwayMonths: 12 // Self-sustaining
      },
      employees: [], // Shared resources
      projects: ['vpc-platform'],
      ip: [],
      metrics: {
        members: 150,
        monthlyRevenue: 3000
      },
      boardMeetings: [],
      holding: {
        ownershipPercent: 100,
        boardSeats: 1,
        votingRights: 'full'
      }
    });

    // Load from memory for any updates
    const saved = memory.query({ tags: ['subsidiary'], limit: 50 });
    for (const m of saved) {
      try {
        const s = JSON.parse(m.node.content);
        if (s.id) this.subsidiaries.set(s.id, s);
      } catch {}
    }
  }

  private startMonitoring(): void {
    // Check subsidiary health daily
    setInterval(() => this.checkHealth(), 24 * 60 * 60 * 1000);
  }

  private checkHealth(): void {
    for (const [id, sub] of this.subsidiaries) {
      // Alert if runway < 2 months
      if (sub.funding.runwayMonths <= 2) {
        eventBus.publish('subsidiary.runway-low', 'subsidiary', {
          subsidiary: id,
          runwayMonths: sub.funding.runwayMonths,
          action: 'Fundraising sprint required'
        }, 'critical');
      }

      // Check upcoming board meetings
      for (const meeting of sub.boardMeetings) {
        if (meeting.status === 'scheduled' && meeting.date) {
          const daysTo = Math.ceil((new Date(meeting.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysTo <= 3) {
            eventBus.publish('subsidiary.board-soon', 'subsidiary', {
              subsidiary: id,
              meeting: meeting.type,
              date: meeting.date,
              daysTo
            }, 'high');
          }
        }
      }
    }

    // Check cross-project dependencies
    for (const dep of this.dependencies) {
      if (dep.status === 'blocked' || (dep.status === 'waiting' && new Date(dep.deadline) < new Date())) {
        eventBus.publish('dependency.at-risk', 'subsidiary', dep, 'critical');
      }
    }
  }

  // Roll-up reporting
  getRollUp(): {
    summary: { entities: number; totalEmployees: number; combinedRunway: number; consolidatedRevenue: number };
    bySubsidiary: Record<string, { revenue: number; runway: number; status: string; keyMetric: string }>;
    crossDependencies: CrossProjectDependency[];
    holdingValue: number;
  } {
    const subs = Array.from(this.subsidiaries.values());
    
    const summary = {
      entities: subs.length,
      totalEmployees: subs.reduce((sum, s) => sum + s.employees.length, 0),
      combinedRunway: Math.min(...subs.map(s => s.funding.runwayMonths)),
      consolidatedRevenue: subs.reduce((sum, s) => sum + (s.metrics.monthlyRevenue || 0), 0) * 12
    };

    const bySubsidiary: Record<string, any> = {};
    for (const s of subs) {
      bySubsidiary[s.id] = {
        revenue: (s.metrics.monthlyRevenue || 0) * 12,
        runway: s.funding.runwayMonths,
        status: s.status,
        keyMetric: s.id === 'irrig8' ? `${s.metrics.estcpProgress}% ESTCP` : 
                   s.id === 'valleyplayersclub' ? `${s.metrics.members} members` : 'Pre-launch'
      };
    }

    // Simple valuation: $2M per operating subsidiary + IP value
    const holdingValue = subs.filter(s => s.status === 'operating').length * 2000 + 
                        subs.reduce((sum, s) => sum + s.ip.length * 500, 0);

    return {
      summary,
      bySubsidiary,
      crossDependencies: this.dependencies,
      holdingValue
    };
  }

  // Allocate resources across subsidiaries
  allocateEmployee(employeeId: string, fromSubsidiary: string, toSubsidiary: string, duration: string, reason: string): boolean {
    const from = this.subsidiaries.get(fromSubsidiary);
    const to = this.subsidiaries.get(toSubsidiary);
    
    if (!from || !to) return false;

    // Record the allocation
    eventBus.publish('subsidiary.resource-moved', 'subsidiary', {
      employeeId,
      from: fromSubsidiary,
      to: toSubsidiary,
      duration,
      reason
    }, 'normal');

    // Update tracking
    memory.add({
      id: `allocation-${Date.now()}`,
      content: `Employee ${employeeId} allocated from ${fromSubsidiary} to ${toSubsidiary} for ${duration}: ${reason}`,
      type: 'allocation',
      agent: 'subsidiary',
      tags: ['allocation', fromSubsidiary, toSubsidiary, employeeId],
      timestamp: new Date().toISOString(),
      source: 'subsidiary'
    });

    return true;
  }

  // Board meeting prep
  getBoardPacket(subsidiaryId: string, meetingDate: string): { financials: any; metrics: any; strategic: any; risks: string[] } {
    const sub = this.subsidiaries.get(subsidiaryId);
    if (!sub) throw new Error('Subsidiary not found');

    return {
      financials: {
        raised: sub.funding.raised,
        committed: sub.funding.committed,
        runway: sub.funding.runwayMonths,
        burn: sub.funding.raised / Math.max(1, 12 - sub.funding.runwayMonths)
      },
      metrics: sub.metrics,
      strategic: {
        milestones: sub.projects,
        ipPortfolio: sub.ip.length,
        nextRound: sub.funding.nextRound
      },
      risks: sub.funding.runwayMonths < 3 ? ['Runway critical'] : 
             sub.metrics.estcpProgress < 50 ? ['ESTCP behind'] : []
    };
  }

  addSubsidiary(subsidiary: Subsidiary): void {
    this.subsidiaries.set(subsidiary.id, subsidiary);
    
    memory.add({
      id: `subsidiary-${subsidiary.id}`,
      content: JSON.stringify(subsidiary),
      type: 'subsidiary',
      agent: 'subsidiary',
      tags: ['subsidiary', subsidiary.status, 'entity'],
      timestamp: new Date().toISOString(),
      source: 'subsidiary'
    });

    eventBus.publish('subsidiary.created', 'subsidiary', { subsidiary }, 'normal');
  }
}

export const subsidiaryManager = new SubsidiaryManager();
