// Jordan — Sales/GTM Lead
// Scans for revenue work every 5 minutes

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';

const SCAN_INTERVAL = 5 * 60 * 1000; // 5 minutes

class Jordan {
  private scanTimer: ReturnType<typeof setInterval> | null = null;
  private backlog: any[] = [];

  constructor() {
    this.startScanning();
    console.log('[JORDAN] Revenue scanner active (5min interval)');
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
      console.log(`[JORDAN] Scanned: ${findings.length} items found`);
    }
  }

  private checkForWork(): any[] {
    const queries = [
      { tags: ['lead', 'stale'], limit: 10 },
      { tags: ['deal', 'negotiation'], limit: 5 },
      { tags: ['investor', 'response'], limit: 3 },
      { tags: ['term', 'sheet'], limit: 2 }
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
    if (content.includes('term sheet') || content.includes('term')) return 'term-sheet';
    if (content.includes('investor') || content.includes('vc')) return 'investor';
    if (content.includes('lead') && content.includes('stale')) return 'stale-lead';
    if (content.includes('deal') || content.includes('negotiation')) return 'deal';
    return 'general';
  }

  private prioritize(node: any): 'critical' | 'high' | 'normal' | 'low' {
    const content = node.content.toLowerCase();
    if (content.includes('term sheet') || content.includes('committed')) return 'critical';
    if (content.includes('investor') && content.includes('response')) return 'high';
    if (content.includes('stale lead') && content.includes('days')) return 'high';
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
    // Auto-nurture stale leads with standard playbook
    if (item.type === 'stale-lead' && item.priority === 'normal') {
      return true;
    }
    return false;
  }

  private autoResolve(item: any): void {
    console.log(`[JORDAN] Auto-resolved: ${item.type} (${item.id})`);
    
    memory.add({
      id: `jordan-resolution-${Date.now()}`,
      content: `Auto-resolved: ${item.type}`,
      type: 'resolution',
      agent:       tags: ['auto-resolved', item.type],
      timestamp: new Date().toISOString(),
      source:     });
  }

  private escalate(item: any): void {
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, {
      itemId: item.id,
      type: item.type,
      requiresVisionary: true,
      reason: 'Critical revenue opportunity requires founder decision'
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

export const jordan = new Jordan();