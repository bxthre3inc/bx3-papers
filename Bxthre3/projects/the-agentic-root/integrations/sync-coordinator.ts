// Sync Coordinator
// Runs all integrations periodically. Core systems = standalone.

import { GmailSync } from './gmail-sync';
import { GitHubSync } from './github-sync';
import { CalendarSync } from './calendar-sync';

export class SyncCoordinator {
  private gmail = new GmailSync();
  private github = new GitHubSync();
  private calendar = new CalendarSync();

  async runAll(): Promise<void> {
    // Pull: External → Agentic
    await this.safeRun('Gmail', () => this.gmail.pull());
    await this.safeRun('GitHub', () => this.github.pull());
    await this.safeRun('Calendar', () => this.calendar.pull());

    // Push: Agentic → External
    await this.safeRun('Gmail', () => this.gmail.push());
    await this.safeRun('GitHub', () => this.github.push());
    await this.safeRun('Calendar', () => this.calendar.push());
  }

  private async safeRun(name: string, fn: () => Promise<void>): Promise<void> {
    try {
      await fn();
      console.log(`[SYNC] ${name} ✓`);
    } catch (err) {
      console.log(`[SYNC] ${name} ✗ (Agentic continues)`);
      // Log but don't stop — core systems run regardless
    }
  }
}

export const syncCoordinator = new SyncCoordinator();
