// Scheduler — Functional task timing & execution
// Uses node-cron for actual scheduling

import * as cron from 'node-cron';

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string; // cron expression
  handler: () => void | Promise<void>;
  isRunning: boolean;
  job?: cron.ScheduledTask;
}

export class Scheduler {
  private tasks = new Map<string, ScheduledTask>();
  private isActive = false;

  // Core 12-hour briefings: 7:00 AM and 7:00 PM
  scheduleBriefings(handler: () => void | Promise<void>): string {
    return this.schedule('briefing-12h', '0 7,19 * * *', handler);
  }

  // Daily employee checks at 9:00 AM
  scheduleDailyCheck(name: string, handler: () => void | Promise<void>): string {
    return this.schedule(`daily-check-${name}`, '0 9 * * *', handler);
  }

  // Every-minute check for time-sensitive operations
  scheduleEveryMinute(name: string, handler: () => void | Promise<void>): string {
    return this.schedule(`minute-${name}`, '* * * * *', handler);
  }

  // Generic schedule method
  schedule(id: string, cronExpression: string, handler: () => void | Promise<void>): string {
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const task: ScheduledTask = {
      id,
      name: id,
      schedule: cronExpression,
      handler,
      isRunning: false
    };

    // Create cron job
    task.job = cron.schedule(cronExpression, async () => {
      console.log(`[Scheduler] Running task: ${id} at ${new Date().toISOString()}`);
      task.isRunning = true;
      try {
        await handler();
      } catch (err) {
        console.error(`[Scheduler] Task ${id} failed:`, err);
      } finally {
        task.isRunning = false;
      }
    }, {
      scheduled: false // Don't start immediately
    });

    this.tasks.set(id, task);
    console.log(`[Scheduler] Registered task: ${id} (${cronExpression})`);
    return id;
  }

  start(): void {
    if (this.isActive) return;
    
    for (const task of this.tasks.values()) {
      task.job?.start();
      console.log(`[Scheduler] Started task: ${task.id}`);
    }
    
    this.isActive = true;
    console.log(`[Scheduler] Active with ${this.tasks.size} tasks`);
  }

  stop(): void {
    for (const task of this.tasks.values()) {
      task.job?.stop();
      console.log(`[Scheduler] Stopped task: ${task.id}`);
    }
    this.isActive = false;
    console.log('[Scheduler] All tasks stopped');
  }

  getStatus() {
    const tasks = Array.from(this.tasks.values()).map(t => ({
      id: t.id,
      schedule: t.schedule,
      isRunning: t.isRunning,
      nextRun: t.job ? 'cron active' : 'no job'
    }));

    return {
      active: this.isActive,
      taskCount: this.tasks.size,
      tasks
    };
  }
}

export const scheduler = new Scheduler();
