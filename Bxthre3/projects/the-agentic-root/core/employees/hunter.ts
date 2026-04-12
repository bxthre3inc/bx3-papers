// Hunter — Revenue Co-Founder  
// The Starting 5 Archetype: Hunter (Sales/GTM Lead)
// Complements Visionary with customers, revenue, partnerships, market capture

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';

export interface CustomerOpportunity {
  id: string;
  company: string;
  contact: string;
  title: string;
  product: string; // 'Irrig8', 'Starting5', 'RAIN', etc.
  stage: 'prospecting' | 'qualified' | 'pilot' | 'negotiation' | 'closed_won' | 'closed_lost';
  dealSize: number; // in $K
  probability: number; // 0-100
  expectedClose: string;
  nextAction: string;
  nextActionDate: string;
  source: 'inbound' | 'outbound' | 'referral' | 'partner' | 'event';
}

export interface Partnership {
  id: string;
  partner: string;
  type: 'distribution' | 'integration' | 'co_sell' | 'reseller' | 'strategic';
  status: 'discussing' | 'term_sheet' | 'signed' | 'active' | 'ended';
  value: number;
  contact: string;
  milestones: string[];
}

class HunterEmployee {
  readonly id = 'hunter';
  readonly name = 'Hunter';
  readonly role = 'Revenue Co-Founder';
  readonly archetype = 'Hunter';

  private pipeline: Map<string, CustomerOpportunity> = new Map();
  private partnerships: Map<string, Partnership> = new Map();
  private monthlyTarget: number = 100; // $100K default

  constructor() {
    console.log(`[${this.name}] Revenue co-founder active`);
    this.initialize();
    this.startPipelineReview();
  }

  private initialize(): void {
    // Load pipeline from memory
    const saved = memory.query(['opportunity', 'customer'], 50);
    for (const result of saved) {
      try {
        const opp = JSON.parse(result.node.content);
        if (opp.id && opp.company) this.pipeline.set(opp.id, opp);
      } catch {}
    }

    // Subscribe to product ship events
    eventBus.subscribe(BXTHRE3_EVENTS.BUILD_SHIPPED, (payload: any) => {
      this.announceProductToPipeline(payload.feature, payload.project);
    });
  }

  private startPipelineReview(): void {
    // Review pipeline every 4 hours
    setInterval(() => this.reviewPipeline(), 4 * 60 * 60 * 1000);
  }

  // Core Hunter Functions

  addOpportunity(company: string, contact: string, product: string, dealSize: number, source: CustomerOpportunity['source']): CustomerOpportunity {
    const id = `opp-${Date.now()}`;
    
    const opp: CustomerOpportunity = {
      id,
      company,
      contact,
      title: 'Unknown',
      product,
      stage: 'prospecting',
      dealSize,
      probability: 20,
      expectedClose: this.defaultCloseDate(90),
      nextAction: 'Schedule discovery call',
      nextActionDate: this.defaultCloseDate(7),
      source
    };

    this.pipeline.set(id, opp);

    memory.add({
      id: `opp-${id}`,
      content: JSON.stringify(opp),
      type: 'opportunity',
      agent: this.id,
      tags: ['opportunity', product.toLowerCase(), source, 'prospecting'],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Opportunity added: ${company} (${product}, $${dealSize}K)`);

    return opp;
  }

  advanceOpportunity(oppId: string, newStage: CustomerOpportunity['stage'], notes: string): { success: boolean; nextAction: string } {
    const opp = this.pipeline.get(oppId);
    if (!opp) return { success: false, nextAction: 'Opportunity not found' };

    const oldStage = opp.stage;
    opp.stage = newStage;

    // Update probability based on stage
    const stageProb: Record<string, number> = {
      prospecting: 20,
      qualified: 40,
      pilot: 60,
      negotiation: 80,
      closed_won: 100,
      closed_lost: 0
    };
    opp.probability = stageProb[newStage] || opp.probability;

    // Set next actions based on stage
    const stageActions: Record<string, string> = {
      qualified: 'Send technical deep-dive + case studies',
      pilot: 'Coordinate pilot setup with Builder',
      negotiation: 'Prepare term sheet, involve Operator',
      closed_won: 'Schedule onboarding, handoff to Customer Success'
    };
    opp.nextAction = stageActions[newStage] || 'Update CRM, schedule follow-up';
    opp.nextActionDate = this.defaultCloseDate(newStage === 'closed_won' ? 1 : 14);

    console.log(`[${this.name}] ${opp.company}: ${oldStage} → ${newStage}`);

    // Special handling for closed won
    if (newStage === 'closed_won') {
      eventBus.publish(BXTHRE3_EVENTS.DEAL_CLOSED, {
        company: opp.company,
        product: opp.product,
        dealSize: opp.dealSize,
        source: opp.source
      });

      // Escalate if major deal
      if (opp.dealSize > 500) {
        escalationClock.register({
          id: `major-deal-${oppId}`,
          description: `Major deal closed: ${opp.company} ($${opp.dealSize}K). Post-sale execution critical.`,
          assignedManager: 'operator',
          severity: 'p1',
          resolutionDeadline: this.defaultCloseDate(7)
        });
      }
    }

    return { success: true, nextAction: opp.nextAction };
  }

  startPartnershipDiscussion(partner: string, type: Partnership['type'], contact: string): Partnership {
    const id = `partner-${Date.now()}`;
    
    const partnership: Partnership = {
      id,
      partner,
      type,
      status: 'discussing',
      value: 0,
      contact,
      milestones: ['Initial discussion', 'Term exploration', 'Internal alignment']
    };

    this.partnerships.set(id, partnership);

    memory.add({
      id: `partner-${id}`,
      content: JSON.stringify(partnership),
      type: 'partnership',
      agent: this.id,
      tags: ['partnership', type, partner.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Partnership started: ${partner} (${type})`);

    return partnership;
  }

  generateQuarterlyForecast(): { 
    pipeline: number; 
    weighted: number; 
    closed: number; 
    gapToTarget: number;
    recommendations: string[];
  } {
    const opportunities = Array.from(this.pipeline.values());
    
    const pipeline = opportunities.reduce((sum, o) => sum + o.dealSize, 0);
    const weighted = opportunities.reduce((sum, o) => sum + (o.dealSize * o.probability / 100), 0);
    const closed = opportunities.filter(o => o.stage === 'closed_won').reduce((sum, o) => sum + o.dealSize, 0);
    
    const quarterlyTarget = this.monthlyTarget * 3;
    const gapToTarget = quarterlyTarget - closed - weighted;

    const recommendations: string[] = [];
    
    if (gapToTarget > 0) {
      recommendations.push(`Need ${Math.ceil(gapToTarget)}K more weighted pipeline to hit Q target`);
    }
    
    const stalled = opportunities.filter(o => o.stage === 'negotiation' && o.probability < 90);
    if (stalled.length > 0) {
      recommendations.push(`${stalled.length} deals stuck in negotiation - consider executive involvement`);
    }

    const qualified = opportunities.filter(o => o.stage === 'qualified').length;
    if (qualified < 3) {
      recommendations.push('Pipeline thin at top of funnel - increase prospecting');
    }

    return { pipeline, weighted, closed, gapToTarget, recommendations };
  }

  getWarRoomBrief(): { 
    urgent: CustomerOpportunity[]; 
    closingThisWeek: CustomerOpportunity[];
    needsVisionary: CustomerOpportunity[];
    totalPipeline: number;
  } {
    const opportunities = Array.from(this.pipeline.values());
    const now = new Date();

    const urgent = opportunities.filter(o => {
      const daysToClose = Math.ceil((new Date(o.expectedClose).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysToClose < 14 && o.stage !== 'closed_won' && o.stage !== 'closed_lost';
    });

    const closingThisWeek = urgent.filter(o => {
      const daysToClose = Math.ceil((new Date(o.expectedClose).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysToClose < 7;
    });

    const needsVisionary = opportunities.filter(o => 
      o.dealSize > 1000 && o.stage === 'negotiation'
    );

    return {
      urgent,
      closingThisWeek,
      needsVisionary,
      totalPipeline: opportunities.length
    };
  }

  getStatus(): {
    pipelineCount: number;
    weightedPipeline: number;
    closedThisMonth: number;
    activePartnerships: number;
  } {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const opportunities = Array.from(this.pipeline.values());
    
    return {
      pipelineCount: opportunities.filter(o => o.stage !== 'closed_won' && o.stage !== 'closed_lost').length,
      weightedPipeline: opportunities.reduce((sum, o) => sum + (o.dealSize * o.probability / 100), 0),
      closedThisMonth: opportunities
        .filter(o => o.stage === 'closed_won' && new Date(o.expectedClose) >= monthStart)
        .reduce((sum, o) => sum + o.dealSize, 0),
      activePartnerships: Array.from(this.partnerships.values()).filter(p => p.status === 'active').length
    };
  }

  // Private helpers

  private announceProductToPipeline(feature: string, project: string): void {
    const relevant = Array.from(this.pipeline.values())
      .filter(o => o.product === project && o.stage === 'qualified');

    for (const opp of relevant) {
      opp.nextAction = `New feature available: ${feature} - schedule demo`;
      console.log(`[${this.name}] Notified ${opp.company} of new ${feature}`);
    }
  }

  private reviewPipeline(): void {
    console.log(`[${this.name}] Pipeline review: ${this.pipeline.size} opportunities`);
    
    const brief = this.getWarRoomBrief();
    if (brief.urgent.length > 0) {
      console.log(`[${this.name}] ${brief.urgent.length} urgent deals requiring attention`);
    }
  }

  private defaultCloseDate(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  }
}

export const hunter = new HunterEmployee();
