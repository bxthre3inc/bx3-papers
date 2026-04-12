// Agentic Daemon v2 — Full Scanning System
// Vance + The Starting 5 (all scanning, none waiting)

import { vance } from '../mentor/vance.js';
import { maya } from '../employees/maya.js';
import { drew } from '../employees/drew.js';
import { jordan } from '../employees/jordan.js';
import { alex } from '../employees/alex.js';

class DaemonV2 {
  private running = false;

  async start(): Promise<void> {
    console.log('═══════════════════════════════════════');
    console.log('  AGENTOS v2 — SCANNING SYSTEM ACTIVE');
    console.log('═══════════════════════════════════════\n');

    // Initialize all employees (they auto-scan)
    console.log('[VANCE] Founders Assistant initialized');
    console.log('        Comms ingestion: Gmail, Slack, GitHub, Calendar');
    console.log('        Learning mode: Active\n');

    console.log('[MAYA]  Engineering Lead initialized');
    console.log('        Scan interval: 2 minutes');
    console.log('        Checks: PRs, blockers, deployments, security\n');

    console.log('[DREW]  Operations Lead initialized');
    console.log('        Scan interval: 5 minutes');
    console.log('        Checks: Signatures, deadlines, burn, legal\n');

    console.log('[JORDAN] Revenue Lead initialized');
    console.log('        Scan interval: 5 minutes');
    console.log('        Checks: Leads, deals, investors, term sheets\n');

    console.log('[ALEX]  Strategy Lead initialized');
    console.log('        Scan interval: 15 minutes');
    console.log('        Checks: Market shifts, competitors, patterns\n');

    console.log('═══════════════════════════════════════');
    console.log('  All employees scanning. Nothing waits.');
    console.log('═══════════════════════════════════════');

    this.running = true;
  }

  getStatus(): {
    running: boolean;
    vance: ReturnType<typeof vance.getStatus>;
    maya: ReturnType<typeof maya.getStatus>;
    drew: ReturnType<typeof drew.getStatus>;
    jordan: ReturnType<typeof jordan.getStatus>;
    alex: ReturnType<typeof alex.getStatus>;
  } {
    return {
      running: this.running,
      vance: vance.getStatus(),
      maya: maya.getStatus(),
      drew: drew.getStatus(),
      jordan: jordan.getStatus(),
      alex: alex.getStatus()
    };
  }
}

export const daemon = new DaemonV2();