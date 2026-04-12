// Escalation Clock — Temporal Blocker Resolution

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { BlockerReport } from '../protocol/types';
import { org, Employee, Manager } from '../hierarchy/org';

const BLOCKER_DIR = '/data/agentic/blockers';
const ACTIVE_FILE = `${BLOCKER_DIR}/active.json`;
const HISTORY_DIR = `${BLOCKER_DIR}/history`;

if (!existsSync(BLOCKER_DIR)) mkdirSync(BLOCKER_DIR, { recursive: true });
if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });

export interface ActiveBlocker extends BlockerReport {
  notifiedPeerHelp: boolean;
  notifiedHumanEscalation: boolean;
}

class EscalationClock {
  private active: Map<string, ActiveBlocker> = new Map();

  constructor() {
    this.load();
  }

  private load(): void {
    if (!existsSync(ACTIVE_FILE)) return;
    try {
      const data = JSON.parse(readFileSync(ACTIVE_FILE, 'utf-8'));
      for (const [id, blocker] of Object.entries(data)) {
        this.active.set(id, blocker as ActiveBlocker);
      }
    } catch {}
  }

  private save(): void {
    const obj: Record<string, ActiveBlocker> = {};
    for (const [id, blocker] of this.active) {
      obj[id] = blocker;
    }
    writeFileSync(ACTIVE_FILE, JSON.stringify(obj, null, 2));
  }

  register(blocker: BlockerReport): void {
    const active: ActiveBlocker = {
      ...blocker,
      notifiedPeerHelp: false,
      notifiedHumanEscalation: false
    };
    this.active.set(blocker.id, active);
    this.save();
    console.log(`[ESCALATION] Blocker ${blocker.id} registered`);
  }

  resolve(blockerId: string, resolution: string): boolean {
    const blocker = this.active.get(blockerId);
    if (!blocker) return false;

    const resolved = { ...blocker, resolvedAt: new Date().toISOString(), resolution };
    writeFileSync(`${HISTORY_DIR}/${blockerId}_resolved.json`, JSON.stringify(resolved, null, 2));
    this.active.delete(blockerId);
    this.save();
    return true;
  }

  check(): EscalationAction[] {
    const now = new Date();
    const actions: EscalationAction[] = [];

    for (const [id, blocker] of this.active) {
      const deadline = new Date(blocker.resolutionDeadline);
      const peerHelpTime = new Date(deadline.getTime() - 2 * 60 * 60 * 1000);
      const manager = org.getEmployee(blocker.assignedManager);

      if (!manager || manager.role !== 'manager') continue;
      const mgr = manager as Manager;

      if (now >= peerHelpTime && !blocker.notifiedPeerHelp) {
        blocker.notifiedPeerHelp = true;
        actions.push({ type: 'peer_help', blockerId: id, employeeId: blocker.employeeId, managerId: mgr.id });
      }

      if (now >= deadline && !blocker.notifiedHumanEscalation) {
        blocker.notifiedHumanEscalation = true;
        actions.push({ type: 'human_escalation', blockerId: id, employeeId: blocker.employeeId, managerId: mgr.id, humanId: 'brodiblanco' });
      }
    }

    this.save();
    return actions;
  }

  getActive(): ActiveBlocker[] {
    return Array.from(this.active.values());
  }

  private countBySeverity(severity: string): number {
    return Array.from(this.active.values()).filter(b => b.severity === severity).length;
  }
}

export interface EscalationAction {
  type: 'peer_help' | 'human_escalation';
  blockerId: string;
  employeeId: string;
  managerId: string;
  humanId?: string;
}

export const escalationClock = new EscalationClock();
