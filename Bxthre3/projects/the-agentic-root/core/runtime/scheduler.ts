// 12-Hour Cycle Scheduler
// Triggers all employee executions at 5:30 AM/PM

import { org } from '../hierarchy/org.js';
import { eventBus } from '../events/bus.js';
import { memory } from '../memory/store.js';
import { router } from '../protocol/messaging.js';
import { synthesizer } from '../reporting/synthesizer.js';
import { erica } from '../executive/erica.js';
import { Sprint } from '../sprint/mode.js';

export class CycleScheduler {
  private isRunning = false;
  private lastRun?: Date;
  private nextRun?: Date;

  async start(): Promise<void> {
    this.isRunning = true;
    this.log('Starting 12-hour cycle scheduler');
    await this.triggerCycle();
    
    this.scheduleNext();
  }

  private scheduleNext(): void {
    const now = new Date();
    const next = new Date(now);
    next.setHours(now.getHours() < 17 ? 17 : 5, 30, 0, 0);
    if (now.getHours() >= 17) {
      next.setDate(next.getDate() + 1);
    }
    
    this.nextRun = next;
    const msUntil = next.getTime() - now.getTime();
    this.log(`Next cycle: ${next.toISOString()}`);
    
    setTimeout(() => {
      this.triggerCycle().then(() => this.scheduleNext());
    }, msUntil);
  }

  private async triggerCycle(): Promise<void> {
    this.lastRun = new Date();
    this.log('=== 12-HOUR CYCLE STARTING ===');
    
    const employees = org.listAll().filter(e => e.role === 'employee');
    this.log(`Running ${employees.length} employees`);
    
    for (const emp of employees) {
      eventBus.publish('employee.run', emp.id, {
        timestamp: new Date().toISOString()
      });
    }
    
    const briefing = synthesizer.generate();
    erica.receiveBriefing({
      type: new Date().getHours() < 12 ? 'overnight' : 'daytime',
      content: synthesizer.format(briefing),
      timestamp: new Date().toISOString()
    });
    
    this.log('=== CYCLE COMPLETE ===');
  }

  private log(msg: string): void {
    console.log(`[SCHEDULER] ${new Date().toISOString()} ${msg}`);
  }

  getStatus(): { running: boolean; lastRun?: string; nextRun?: string } {
    return {
      running: this.isRunning,
      lastRun: this.lastRun?.toISOString(),
      nextRun: this.nextRun?.toISOString()
    };
  }
}

export const scheduler = new CycleScheduler();
