/**
 * RAIN — Regulatory Intelligence Agent — Agentic
 * 
 * Vertical: RAIN (Regulatory Arbitrage Intelligence Network)
 * Monitors: SEC/CFTC crypto guidance, Dodd-Frank, ESG mandates, 
 *            Colorado River/water law, agricultural regulation
 * Run: Daily at 7:00 AM MT
 * 
 * Owned by: Maya (Regulatory Strategy)
 * Comms: Bxthre3/INBOX/agents/rain.md
 */

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';

export interface IntelligenceItem {
  id: string;
  category: 'crypto' | 'water' | 'bank-regulation' | 'esg' | 'agriculture' | 'hedge-funds';
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  date: string;
  relevance: 'high' | 'medium' | 'low';
  arbitrageImplication?: string;
  verified: boolean;
}

class RainAgent {
  readonly id = 'rain';
  readonly name = 'RAIN';
  readonly role = 'Regulatory Intelligence Lead';
  readonly department = 'strategy';
  readonly managerId = 'maya';

  private watchList = {
    crypto: [
      'SEC crypto guidance',
      'CFTC digital commodities',
      'stablecoin regulation',
      'crypto staking ETPs',
    ],
    water: [
      'Colorado River crisis',
      'San Luis Valley water rights',
      'Colorado Water Court',
      'subdistrict 1',
    ],
    bankReg: [
      'Dodd-Frank',
      'bank capital rules',
      'Fed OCC FDIC proposals',
    ],
    esg: [
      'California SB 253',
      'SEC climate disclosure',
      'ESG reporting mandates',
    ],
    agriculture: [
      'EPA deregulation',
      'USDA grants',
      'ESTCP',
      'Colorado agriculture',
    ],
  };

  private lastBrief: string | null = null;
  private briefCount = 0;

  constructor() {
    console.log('[RAIN] Regulatory intelligence active');
    this.startDailyBrief();
  }

  // === DAILY BRIEF ===

  private startDailyBrief(): void {
    // Run at 7:00 AM MT Mon-Fri
    const check = () => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Denver', hour: 'numeric', hour12: false }));
      if (hour === 7 && now.getMinutes() < 5) {
        this.runDailyBrief();
      }
    };
    setInterval(check, 60 * 60 * 1000);
    console.log('[RAIN] Daily brief scheduled — 7:00 AM MT');
  }

  async runDailyBrief(): Promise<IntelligenceItem[]> {
    console.log('[RAIN] Running daily intelligence brief...');
    this.briefCount++;
    
    const items = await this.scanAllSources();
    
    // Store in memory
    memory.add({
      id: `rain-brief-${Date.now()}`,
      type: 'intelligence-brief',
      agent: this.id,
      content: JSON.stringify({ items, date: new Date().toISOString() }),
      timestamp: new Date().toISOString(),
      tags: ['rain', 'intelligence', 'daily-brief'],
      source: this.id,
    });

    // Categorize and route
    const highPriority = items.filter(i => i.relevance === 'high');
    for (const item of highPriority) {
      if (item.arbitrageImplication) {
        this.routeToMaya(item);
      }
    }

    // Check water court specifically (June 29 hearing)
    this.checkWaterCourtDeadline();

    this.lastBrief = new Date().toISOString();
    return items;
  }

  private async scanAllSources(): Promise<IntelligenceItem[]> {
    const items: IntelligenceItem[] = [];
    
    // Web search for each category
    const queries = [
      { q: 'SEC CFTC crypto guidance 2026', cat: 'crypto' as const },
      { q: 'Colorado River water crisis 2026', cat: 'water' as const },
      { q: 'bank capital rule changes 2026', cat: 'bank-regulation' as const },
      { q: 'California SB 253 ESG agriculture 2026', cat: 'esg' as const },
      { q: 'EPA agriculture deregulation 2026', cat: 'agriculture' as const },
    ];

    for (const { q, cat } of queries) {
      try {
        // In production: use web_research with category filter
        const result = await this.searchIntelligence(q, cat);
        items.push(...result);
      } catch (e) {
        console.log(`[RAIN] Search failed for ${cat}: ${e}`);
      }
    }

    return items;
  }

  private async searchIntelligence(
    query: string,
    category: IntelligenceItem['category']
  ): Promise<IntelligenceItem[]> {
    // Placeholder — in production wire to web_research
    // Returns: IntelligenceItem[]
    return [];
  }

  // === WATER COURT (CRITICAL — June 29 hearing) ===

  private checkWaterCourtDeadline(): void {
    const hearingDate = new Date('2026-06-29');
    const now = new Date();
    const daysRemaining = Math.ceil((hearingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 30 && daysRemaining > 0) {
      memory.add({
        id: `rain-watercourt-alert-${Date.now()}`,
        type: 'critical-deadline',
        agent: this.id,
        content: `Water Court Hearing: ${daysRemaining} days remaining (June 29, 2026). Expert witness + calibration data required.`,
        timestamp: new Date().toISOString(),
        tags: ['water-court', 'critical', 'deadline', 'irrig8'],
        source: this.id,
      });

      eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, this.id, {
        agent: this.id,
        type: 'water-court-deadline',
        daysRemaining,
        hearingDate: '2026-06-29',
        action: 'Expert witness + field calibration data needed',
        priority: daysRemaining <= 14 ? 'critical' : 'high',
      }, daysRemaining <= 14 ? 'critical' : 'high');
    }
  }

  private routeToMaya(item: IntelligenceItem): void {
    memory.add({
      id: `rain-routed-${item.id}`,
      type: 'arbitrage-intelligence',
      agent: this.id,
      content: `[${item.category.toUpperCase()}] ${item.title}: ${item.arbitrageImplication}`,
      timestamp: new Date().toISOString(),
      tags: ['rain', 'arbitrage', item.category, 'maya'],
      source: this.id,
    });
  }

  // === STATUS ===

  getStatus(): { lastBrief: string | null; briefsRun: number; active: boolean } {
    return {
      lastBrief: this.lastBrief,
      briefsRun: this.briefCount,
      active: true,
    };
  }
}

export const rain = new RainAgent();
export default rain;
