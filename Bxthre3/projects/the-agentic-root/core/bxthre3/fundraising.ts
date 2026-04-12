// Bxthre3 Fundraising Pipeline Manager
// Investor relations, pipeline tracking, materials, communications

import { memory } from '../memory/store.js';
import { eventBus } from '../events/bus.js';
import { hybridGmail } from '../../infrastructure/integrations/gmail-hybrid.js';

export interface Investor {
  id: string;
  name: string;
  firm: string;
  type: 'angel' | 'seed' | 'vc' | 'strategic' | 'family_office';
  focus: string[]; // sectors
  checkSize: { min: number; max: number }; // in thousands
  stage: 'lead' | 'co-invest' | 'pass' | 'watching' | 'committed';
  priority: 'hot' | 'warm' | 'cold';
  lastContact: string;
  nextAction: string;
  nextActionDate?: string;
  materialsSent: string[];
  notes: string;
  introSource?: string;
}

export interface FundraiseRound {
  id: string;
  project: 'Irrig8' | 'Starting5' | 'ValleyPlayersClub' | 'Agentic' | 'Bxthre3';
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'growth';
  target: number; // in thousands
  raised: number;
  committed: number;
  status: 'preparing' | 'active' | 'closing' | 'closed' | 'paused';
  leadInvestor?: string;
  deadline?: string;
  useOfFunds: string[];
  keyMilestones: string[];
}

export class FundraisingManager {
  private investors: Map<string, Investor> = new Map();
  private activeRounds: Map<string, FundraiseRound> = new Map();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    // Target investors from Bxthre3 thesis
    const targetInvestors: Investor[] = [
      {
        id: 'spacex-cto',
        name: 'SpaceX Engineering Leadership',
        firm: 'SpaceX',
        type: 'strategic',
        focus: ['space', 'infrastructure', 'agriculture'],
        checkSize: { min: 100, max: 500 },
        stage: 'watching',
        priority: 'warm',
        lastContact: '2026-03-10',
        nextAction: 'Send Irrig8 one-pager after water data breakthrough',
        materialsSent: [],
        notes: 'Interested in precision agriculture for potential Mars applications'
      },
      {
        id: 'agtech-vc-1',
        name: 'AgTech Growth Fund',
        firm: 'AgTech Ventures',
        type: 'vc',
        focus: ['agriculture', 'water', 'climate'],
        checkSize: { min: 500, max: 2000 },
        stage: 'co-invest',
        priority: 'hot',
        lastContact: '2026-03-15',
        nextAction: 'Schedule Irrig8 demo after CSU pilot data',
        nextActionDate: '2026-03-25',
        materialsSent: ['Executive Summary', 'Financial Projections'],
        notes: 'Strong interest in water rights trading angle'
      }
    ];

    for (const i of targetInvestors) {
      this.investors.set(i.id, i);
    }

    // Active rounds
    this.activeRounds.set('irrig8-seed', {
      id: 'irrig8-seed',
      project: 'Irrig8',
      stage: 'seed',
      target: 500, // $500K
      raised: 0,
      committed: 150, // $150K soft committed
      status: 'active',
      deadline: '2026-04-30',
      useOfFunds: ['Patent conversion', 'MVP platform', '3-5 pilot customers'],
      keyMilestones: ['ESTCP submission', 'CSU pilot data', 'First paying customer']
    });

    // Load from memory
    const saved = memory.query({ tags: ['investor', 'fundraising'], limit: 100 });
    for (const m of saved) {
      try {
        const data = JSON.parse(m.node.content);
        if (data.id && data.firm) this.investors.set(data.id, data);
      } catch {}
    }
  }

  // Pipeline management
  getPipeline(): { hot: Investor[]; warm: Investor[]; cold: Investor[]; byStage: Record<string, number> } {
    const all = Array.from(this.investors.values());
    
    return {
      hot: all.filter(i => i.priority === 'hot').sort((a, b) => 
        new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()),
      warm: all.filter(i => i.priority === 'warm'),
      cold: all.filter(i => i.priority === 'cold'),
      byStage: {
        committed: all.filter(i => i.stage === 'committed').length,
        lead: all.filter(i => i.stage === 'lead').length,
        'co-invest': all.filter(i => i.stage === 'co-invest').length,
        watching: all.filter(i => i.stage === 'watching').length,
        pass: all.filter(i => i.stage === 'pass').length
      }
    };
  }

  getRoundStatus(roundId: string): FundraiseRound | undefined {
    return this.activeRounds.get(roundId);
  }

  // Action items
  getTodaysActions(): { investor: string; action: string; deadline?: string; priority: string }[] {
    const today = new Date().toISOString().split('T')[0];
    const actions: { investor: string; action: string; deadline?: string; priority: string }[] = [];

    for (const [id, investor] of this.investors) {
      if (investor.nextActionDate === today) {
        actions.push({
          investor: investor.name,
          action: investor.nextAction,
          deadline: investor.nextActionDate,
          priority: investor.priority
        });
      }
    }

    return actions.sort((a, b) => (a.priority === 'hot' ? -1 : 1));
  }

  // Materials tracking
  trackMaterialSent(investorId: string, material: string): void {
    const inv = this.investors.get(investorId);
    if (inv && !inv.materialsSent.includes(material)) {
      inv.materialsSent.push(material);
      inv.lastContact = new Date().toISOString();
    }
  }

  // Update after interaction
  logInteraction(investorId: string, notes: string, nextAction: string, nextDate?: string, stageChange?: Investor['stage']): void {
    const inv = this.investors.get(investorId);
    if (!inv) return;

    inv.notes += `\n${new Date().toISOString()}: ${notes}`;
    inv.nextAction = nextAction;
    inv.nextActionDate = nextDate;
    inv.lastContact = new Date().toISOString();
    if (stageChange) inv.stage = stageChange;

    // Persist
    memory.add({
      id: `investor-interaction-${investorId}-${Date.now()}`,
      content: JSON.stringify({ investorId, notes, nextAction, stageChange }),
      type: 'investor-interaction',
      agent: 'fundraising-manager',
      tags: ['investor', 'interaction', investorId],
      timestamp: new Date().toISOString(),
      source: 'fundraising-manager'
    });

    // Alert if committed
    if (stageChange === 'committed') {
      eventBus.publish('investor.committed', 'fundraising', { investor: inv }, 'critical');
    }
  }

  // Automatic investor matching
  findMatchingInvestors(project: string, focus: string[]): Investor[] {
    return Array.from(this.investors.values())
      .filter(i => i.stage !== 'pass')
      .filter(i => focus.some(f => i.focus.includes(f)))
      .sort((a, b) => (a.priority === 'hot' ? -1 : 1));
  }

  // Board-ready summary
  getBoardSummary(): { raised: number; committed: number; pipeline: string[] } {
    const rounds = Array.from(this.activeRounds.values());
    
    return {
      raised: rounds.reduce((sum, r) => sum + r.raised, 0),
      committed: rounds.reduce((sum, r) => sum + r.committed, 0),
      pipeline: this.getPipeline().hot.slice(0, 3).map(i => i.name)
    };
  }
}

export const fundraisingManager = new FundraisingManager();
