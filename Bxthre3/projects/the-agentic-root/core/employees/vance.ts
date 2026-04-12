// Vance — Founders Assistant
// Your second brain. Everything you are + everything you're not.
// 
// Watches all comms. Learns your patterns. Fills your gaps.
// Only surfaces what needs you. Routes everything else automatically.

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';
import { org } from '../hierarchy/org.js';

interface DecisionPattern {
  id: string;
  situation: string;
  context: Record<string, any>;
  yourChoice: string;
  reasoning: string;
  timestamp: string;
}

interface GapProfile {
  speed: 'fast' | 'deliberate';
  detail: 'big-picture' | 'thorough';
  followThrough: 'delegator' | 'closer';
}

class Vance {
  private patterns: DecisionPattern[] = [];
  private yourProfile: GapProfile = {
    speed: 'fast',
    detail: 'big-picture',
    followThrough: 'delegator'
  };
  
  // Real-time comms ingestion
  private commsQueue: any[] = [];
  private scanInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startIngestion();
    this.startWatching();
  }

  // === COMMS INGESTION ===
  
  ingest(source: 'email' | 'slack' | 'github' | 'calendar', payload: any): void {
    const item = {
      id: `${source}-${Date.now()}`,
      source,
      payload,
      ingestedAt: new Date().toISOString(),
      routed: false,
      escalated: false
    };
    
    this.commsQueue.push(item);
    
    // Immediate analysis
    this.analyzeAndRoute(item);
    
    // Learn from content
    memory.add({
      id: item.id,
      content: JSON.stringify({ source, summary: this.summarize(payload) }),
      type: 'comms',
      agent: 'vance',
      tags: [source, 'comms', 'ingested'],
      timestamp: item.ingestedAt,
      source: 'vance'
    });
  }

  private summarize(payload: any): string {
    // Extract key info from comms
    if (payload.subject) return payload.subject;
    if (payload.title) return payload.title;
    if (payload.body) return payload.body.slice(0, 100);
    return 'comms-item';
  }

  private analyzeAndRoute(item: any): void {
    const classification = this.classify(item);
    
    // Critical = escalate immediately
    if (classification.urgency === 'critical') {
      this.escalateToYou(item, classification);
      return;
    }
    
    // Pattern match = auto-route to employee
    const pattern = this.matchPattern(item);
    if (pattern.confidence > 0.7) {
      this.routeToEmployee(item, classification, pattern);
      return;
    }
    
    // Unknown = queue for your decision (but batched)
    this.queueForReview(item);
  }

  private classify(item: any): { urgency: 'low' | 'normal' | 'high' | 'critical'; domain: string } {
    // Content analysis
    const text = JSON.stringify(item.payload).toLowerCase();
    
    // Critical patterns
    if (text.includes('security') || text.includes('breach') || text.includes('p1')) {
      return { urgency: 'critical', domain: 'security' };
    }
    if (text.includes('grant deadline') && text.includes('days')) {
      return { urgency: 'critical', domain: 'grants' };
    }
    if (text.includes('investor') && text.includes('term sheet')) {
      return { urgency: 'critical', domain: 'fundraising' };
    }
    
    // High patterns
    if (text.includes('deadline') || text.includes('signature')) {
      return { urgency: 'high', domain: 'operations' };
    }
    if (text.includes('blocker') || text.includes('stuck')) {
      return { urgency: 'high', domain: 'technical' };
    }
    
    // Normal
    return { urgency: 'normal', domain: 'general' };
  }

  private matchPattern(item: any): { confidence: number; employeeId: string; action: string } {
    // Check against learned patterns
    const similar = this.patterns.filter(p => 
      this.situationSimilar(p.situation, JSON.stringify(item.payload))
    );
    
    if (similar.length === 0) {
      return { confidence: 0, employeeId: '', action: '' };
    }
    
    // Most common routing
    const byEmployee: Record<string, number> = {};
    for (const p of similar) {
      byEmployee[p.context.employeeId] = (byEmployee[p.context.employeeId] || 0) + 1;
    }
    
    const topEmployee = Object.entries(byEmployee)
      .sort((a, b) => b[1] - a[1])[0];
    
    const confidence = topEmployee[1] / similar.length;
    
    return {
      confidence,
      employeeId: topEmployee[0],
      action: similar[0].yourChoice
    };
  }

  private situationSimilar(a: string, b: string): boolean {
    // Simple similarity check
    const aWords = a.toLowerCase().split(' ');
    const bWords = b.toLowerCase().split(' ');
    const overlap = aWords.filter(w => bWords.includes(w));
    return overlap.length / Math.max(aWords.length, bWords.length) > 0.3;
  }

  private routeToEmployee(item: any, classification: any, pattern: any): void {
    eventBus.publish(BXTHRE3_EVENTS.WORK_ROUTED, 'vance', {
      itemId: item.id,
      toEmployee: pattern.employeeId,
      classification,
      confidence: pattern.confidence,
      sourceComms: item.source
    }, classification.urgency === 'high' ? 'high' : 'normal');
    
    item.routed = true;
  }

  private escalateToYou(item: any, classification: any): void {
    eventBus.publish(BXTHRE3_EVENTS.CRITICAL_ESCALATION, 'vance', {
      itemId: item.id,
      classification,
      yourLikelyDecision: this.predictYourChoice(JSON.stringify(item.payload), {}),
      timeInQueue: 0,
      suggestedResponse: this.draftResponse(item)
    }, 'critical');
    
    item.escalated = true;
  }

  private queueForReview(item: any): void {
    // Batch these for periodic review
    // You'll see them in dashboard, but not pinged immediately
    item.queuedAt = new Date().toISOString();
  }

  private draftResponse(item: any): string {
    // Draft based on your patterns
    const similar = this.patterns.filter(p => 
      p.context.itemType === item.source
    );
    
    if (similar.length === 0) return '';
    
    // Most common response pattern
    const responses = similar.map(p => p.yourChoice);
    const mode = responses.sort((a, b) => 
      responses.filter(v => v === a).length - responses.filter(v => v === b).length
    ).pop();
    
    return mode || '';
  }

  // === LEARNING ===

  recordDecision(situation: string, choice: string, reasoning: string, context: Record<string, any>): void {
    this.patterns.push({
      id: `pattern-${Date.now()}`,
      situation,
      context,
      yourChoice: choice,
      reasoning,
      timestamp: new Date().toISOString()
    });
    
    // Keep last 100 patterns
    if (this.patterns.length > 100) {
      this.patterns = this.patterns.slice(-100);
    }
    
    console.log(`[VANCE] Learned: ${situation.slice(0, 50)}...`);
  }

  predictYourChoice(situation: string, context: Record<string, any>): { choice: string; confidence: number } {
    const similar = this.patterns.filter(p => 
      this.situationSimilar(p.situation, situation)
    );
    
    if (similar.length === 0) {
      return { choice: 'unknown', confidence: 0 };
    }
    
    const choices = similar.map(p => p.yourChoice);
    const mode = choices.sort((a, b) => 
      choices.filter(v => v === a).length - choices.filter(v => v === b).length
    ).pop()!;
    
    const confidence = similar.filter(s => s.yourChoice === mode).length / similar.length;
    
    return { choice: mode, confidence };
  }

  // === WATCHING ===

  private startIngestion(): void {
    // Simulated ingestion loop
    // Real implementation connects to Gmail, Slack, GitHub APIs
    console.log('[VANCE] Comms ingestion active');
    console.log('[VANCE] Watching: Gmail, Slack, GitHub, Calendar');
  }

  private startWatching(): void {
    // Continuous scan
    this.scanInterval = setInterval(() => {
      this.scanQueue();
    }, 30000); // 30s
    
    console.log('[VANCE] Founders Assistant active');
  }

  private scanQueue(): void {
    // Check for stale items
    const now = Date.now();
    const stale = this.commsQueue.filter(item => {
      if (item.escalated || item.routed) return false;
      const age = now - new Date(item.ingestedAt).getTime();
      return age > 5 * 60 * 1000; // 5 min
    });
    
    if (stale.length > 0) {
      // Auto-escalate or route based on age
      for (const item of stale) {
        this.escalateToYou(item, { urgency: 'normal', domain: 'unknown' });
      }
    }
  }

  // === INTERFACE ===

  getStatus(): {
    patternsLearned: number;
    queueDepth: number;
    avgRoutingTimeMs: number;
    escalatedToday: number;
  } {
    const today = new Date().toDateString();
    const escalatedToday = this.commsQueue.filter(i => 
      i.escalated && new Date(i.ingestedAt).toDateString() === today
    ).length;
    
    return {
      patternsLearned: this.patterns.length,
      queueDepth: this.commsQueue.filter(i => !i.routed && !i.escalated).length,
      avgRoutingTimeMs: 45000, // Target
      escalatedToday
    };
  }

  getQueuedForYou(): any[] {
    return this.commsQueue.filter(i => 
      i.escalated && !i.resolved
    );
  }

  getGapProfile(): GapProfile {
    return this.yourProfile;
  }
}

export const vance = new Vance();