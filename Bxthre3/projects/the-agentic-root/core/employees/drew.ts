// Drew — COO, Operations Lead
// Scans for ops work every 5 minutes

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';

const SCAN_INTERVAL = 5 * 60 * 1000; // 5 minutes

class Drew {
  private scanTimer: ReturnType<typeof setInterval> | null = null;
  private backlog: any[] = [];

  constructor() {
    this.startScanning();
    console.log('[DREW] Operations scanner active (5min interval)');
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
      console.log(`[DREW] Scanned: ${findings.length} items found`);
    }
  }

  private checkForWork(): any[] {
    const queries = [
      { tags: ['signature', 'pending'], limit: 5 },
      { tags: ['deadline', 'grant'], limit: 3 },
      { tags: ['burn', 'runway'], limit: 2 },
      { tags: ['legal', 'contract'], limit: 2 }
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
    if (content.includes('signature') || content.includes('sign')) return 'signature';
    if (content.includes('deadline') || content.includes('due')) return 'deadline';
    if (content.includes('burn') || content.includes('runway')) return 'financial';
    if (content.includes('legal') || content.includes('contract')) return 'legal';
    return 'general';
  }

  private prioritize(node: any): 'critical' | 'high' | 'normal' | 'low' {
    const content = node.content.toLowerCase();
    if (content.includes('estcp') && content.includes('deadline')) return 'critical';
    if (content.includes('signature') && content.includes('overdue')) return 'critical';
    if (content.includes('burn') && content.includes('critical')) return 'high';
    if (content.includes('deadline') && content.includes('days')) return 'high';
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
    
    eventBus.publish(BXTHRE3_EVENTS.WORK_FOUND, 'drew', {
      itemId: item.id,
      type: item.type,
      priority: item.priority
    }, item.priority === 'high' ? 'high' : 'normal');
  }

  private canAutoResolve(item: any): boolean {
    // Auto-remind about approaching deadlines
    if (item.type === 'deadline' && item.priority === 'normal') {
      return true; // Send reminder
    }
    return false;
  }

  private autoResolve(item: any): void {
    console.log(`[DREW] Auto-resolved: ${item.type} (${item.id})`);
    
    memory.add({
      id: `drew-resolution-${Date.now()}`,
      content: `Auto-resolved: ${item.type}`,
      type: 'resolution',
      agent: 'drew',
      tags: ['auto-resolved', item.type],
      timestamp: new Date().toISOString(),
      source: 'drew'
    });
  }

  private escalate(item: any): void {
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, 'drew', {
      itemId: item.id,
      type: item.type,
      requiresVisionary: true,
      reason: 'Critical ops blocker requires founder decision'
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

export const drew = new Drew();