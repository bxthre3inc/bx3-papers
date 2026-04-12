// Maya — CTO, Engineering Lead
// Scans for technical work every 2 minutes

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';

const SCAN_INTERVAL = 2 * 60 * 1000; // 2 minutes

class Maya {
  private scanTimer: ReturnType<typeof setInterval> | null = null;
  private backlog: any[] = [];

  constructor() {
    this.startScanning();
    console.log('[MAYA] Engineering scanner active (2min interval)');
  }

  private startScanning(): void {
    // Immediate first scan
    this.scan();
    
    // Recurring scans
    this.scanTimer = setInterval(() => this.scan(), SCAN_INTERVAL);
  }

  private scan(): void {
    const findings = this.checkForWork();
    
    for (const item of findings) {
      this.process(item);
    }
    
    if (findings.length > 0) {
      console.log(`[MAYA] Scanned: ${findings.length} items found`);
    }
  }

  private checkForWork(): any[] {
    // Query for technical work
    const queries = [
      { tags: ['github', 'pr', 'review'], limit: 5 },
      { tags: ['blocker', 'technical'], limit: 3 },
      { tags: ['deploy', 'failed'], limit: 2 },
      { tags: ['vulnerability', 'security'], limit: 2 }
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
    
    // Sort by priority
    return results.sort((a, b) => {
      const pA = a.priority === 'critical' ? 4 : a.priority === 'high' ? 3 : a.priority === 'normal' ? 2 : 1;
      const pB = b.priority === 'critical' ? 4 : b.priority === 'high' ? 3 : b.priority === 'normal' ? 2 : 1;
      return pB - pA;
    });
  }

  private categorize(node: any): string {
    const content = node.content.toLowerCase();
    if (content.includes('pr') || content.includes('review')) return 'code-review';
    if (content.includes('deploy') || content.includes('release')) return 'deployment';
    if (content.includes('blocker') || content.includes('bug')) return 'blocker';
    if (content.includes('vulnerability') || content.includes('security')) return 'security';
    return 'general';
  }

  private prioritize(node: any): 'critical' | 'high' | 'normal' | 'low' {
    const content = node.content.toLowerCase();
    if (content.includes('p0') || content.includes('critical') || content.includes('outage')) return 'critical';
    if (content.includes('blocker') || content.includes('deploy failed')) return 'high';
    if (content.includes('review') || content.includes('pr')) return 'normal';
    return 'low';
  }

  private process(item: any): void {
    // Auto-process or escalate
    if (item.priority === 'critical') {
      this.escalate(item);
      return;
    }
    
    if (this.canAutoResolve(item)) {
      this.autoResolve(item);
      return;
    }
    
    // Add to personal backlog
    this.backlog.push(item);
    
    // Publish work found event
    eventBus.publish(BXTHRE3_EVENTS.WORK_FOUND, 'maya', {
      itemId: item.id,
      type: item.type,
      priority: item.priority
    }, item.priority === 'high' ? 'high' : 'normal');
  }

  private canAutoResolve(item: any): boolean {
    // Auto-resolve known patterns
    if (item.type === 'code-review' && !item.data.content.includes('critical')) {
      return true; // Approve non-critical PRs
    }
    return false;
  }

  private autoResolve(item: any): void {
    console.log(`[MAYA] Auto-resolved: ${item.type} (${item.id})`);
    
    memory.add({
      id: `maya-resolution-${Date.now()}`,
      content: `Auto-resolved: ${item.type}`,
      type: 'resolution',
      agent: 'maya',
      tags: ['auto-resolved', item.type],
      timestamp: new Date().toISOString(),
      source: 'maya'
    });
  }

  private escalate(item: any): void {
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, 'maya', {
      itemId: item.id,
      type: item.type,
      requiresVisionary: true,
      reason: 'Critical technical blocker requires founder decision'
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

export const maya = new Maya();