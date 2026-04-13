// Alex — Strategy Lead
// Scans for strategic work every 15 minutes

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';

const SCAN_INTERVAL = 15 * 60 * 1000; // 15 minutes

class Alex {
  private scanTimer: ReturnType<typeof setInterval> | null = null;
  private backlog: any[] = [];

  constructor() {
    this.startScanning();
    console.log('[ALEX] Strategy scanner active (15min interval)');
  }

  private startScanning(): void {
    this.scan();
    this.scanTimer = setInterval(() => this.scan(), SCAN_INTERVAL);
  }

  private scan(): void {
    const findings = this.checkForWork();
    
    for (const item of findings) {
      this.process(item);
    }
    
    if (findings.length > 0) {
      console.log(`[ALEX] Scanned: ${findings.length} items found`);
    }
  }

  private checkForWork(): any[] {
    const queries = [
      { tags: ['market', 'shift'], limit: 5 },
      { tags: ['competitor', 'move'], limit: 3 },
      { tags: ['pattern', 'strategic'], limit: 5 },
      { tags: ['regulatory', 'change'], limit: 2 }
    ];
    
    const results: any[] = [];
    
    for (const query of queries) {
      const found = memory.query(query);
      results.push(...found.map(m => ({
        id: m.node.id,
        type: this.categorize(m.node),
        priority: this.prioritize(m.node),
        data: m.node
      })));
    }
    
    return results.sort((a, b) => {
      const pA = a.priority === 'critical' ? 4 : a.priority === 'high' ? 3 : a.priority === 'normal' ? 2 : 1;
      const pB = b.priority === 'critical' ? 4 : b.priority === 'high' ? 3 : b.priority === 'normal' ? 2 : 1;
      return pB - pA;
    });
  }

  private categorize(node: any): string {
    const content = node.content.toLowerCase();
    if (content.includes('market') || content.includes('shift')) return 'market-shift';
    if (content.includes('competitor') || content.includes('competitive')) return 'competitor';
    if (content.includes('pattern') || content.includes('systemic')) return 'pattern';
    if (content.includes('regulatory') || content.includes('compliance')) return 'regulatory';
    return 'general';
  }

  private prioritize(node: any): 'critical' | 'high' | 'normal' | 'low' {
    const content = node.content.toLowerCase();
    if (content.includes('existential') || content.includes('threat')) return 'critical';
    if (content.includes('market') && content.includes('shift')) return 'high';
    if (content.includes('competitor') && content.includes('major')) return 'high';
    return 'normal';
  }

  private process(item: any): void {
    if (item.priority === 'critical') {
      this.escalate(item);
      return;
    }
    
    if (this.canAutoResolve(item)) {
      this.autoResolve(item);
      return;
    }
    
    this.backlog.push(item);
    
    eventBus.publish(BXTHRE3_EVENTS.WORK_FOUND, {
      itemId: item.id,
      type: item.type,
      priority: item.priority
    }, item.priority === 'high' ? 'high' : 'normal');
  }

  private canAutoResolve(item: any): boolean {
    // Strategic items rarely auto-resolve
    return false;
  }

  private autoResolve(item: any): void {
    console.log(`[ALEX] Auto-resolved: ${item.type} (${item.id})`);
  }

  private escalate(item: any): void {
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, {
      itemId: item.id,
      type: item.type,
      requiresVisionary: true,
      reason: 'Critical strategic insight requires founder decision'
    }, 'critical');
  }

  getStatus(): { scanning: boolean; interval: number; backlogSize: number } {
    return {
      scanning: this.scanTimer !== null,
      interval: SCAN_INTERVAL,
      backlogSize: this.backlog.length
    };
  }

  getBacklog(): any[] {
    return this.backlog;
  }
}

export const alex = new Alex();