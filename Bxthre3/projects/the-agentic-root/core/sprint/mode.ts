// Sprint Mode — Deadline-Critical Resource Reallocation
// Phase 6 of Agentic 3.0 Implementation

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { org, Organization } from '../hierarchy/org';
import { Manager, Employee } from '../hierarchy/types';
import { router } from '../protocol/messaging';
import { memory } from '../memory/store';

const SPRINT_DIR = '/home/.z/agentic/sprint';
const ACTIVE_FILE = `${SPRINT_DIR}/active.json`;
const HISTORY_FILE = `${SPRINT_DIR}/history.json`;

if (!existsSync(SPRINT_DIR)) mkdirSync(SPRINT_DIR, { recursive: true });

export interface Sprint {
  id: string;
  name: string;
  project: string; // e.g., "ESTCP Grant", "Series A"
  deadline: string;
  declaredBy: string; // manager id
  declaredAt: string;
  
  // Authority elevation
  primaryManager: string;
  elevatedManagers: string[];
  
  // Peer objection window
  objectionWindowEnds: string;
  objections: SprintObjection[];
  
  // Resource shifts
  reassignments: Reassignment[];
  
  // Status
  status: 'objection_window' | 'active' | 'completed' | 'cancelled';
  endedAt?: string;
  
  // Auto-expire
  autoExpiresAt: string;
}

export interface SprintObjection {
  fromManager: string;
  reason: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Reassignment {
  employeeId: string;
  fromProject: string;
  toProject: string;
  approved: boolean;
  effectiveAt: string;
}

class SprintMode {
  private active: Sprint | null = null;
  private history: Sprint[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    if (existsSync(ACTIVE_FILE)) {
      try {
        this.active = JSON.parse(readFileSync(ACTIVE_FILE, 'utf-8'));
      } catch {}
    }
    if (existsSync(HISTORY_FILE)) {
      try {
        this.history = JSON.parse(readFileSync(HISTORY_FILE, 'utf-8'));
      } catch {}
    }
  }

  private save(): void {
    if (this.active) {
      writeFileSync(ACTIVE_FILE, JSON.stringify(this.active, null, 2));
    } else {
      // Remove active file if no sprint
      try { 
        if (existsSync(ACTIVE_FILE)) {
          const fs = require('fs');
          fs.unlinkSync(ACTIVE_FILE);
        }
      } catch {}
    }
    writeFileSync(HISTORY_FILE, JSON.stringify(this.history, null, 2));
  }

  // Declare sprint mode (manager with deadline-critical project)
  declare(
    managerId: string,
    name: string,
    project: string,
    deadline: string,
    neededResources: { employeeId: string; fromProject: string; reason: string }[]
  ): Sprint | null {
    const manager = org.get(managerId);
    if (!manager || manager.role !== 'manager') {
      throw new Error('Only managers can declare sprint mode');
    }

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const hoursUntil = (deadlineDate.getTime() - now.getTime()) / 1000 / 60 / 60;

    // Sprint mode only for deadlines within 14 days
    if (hoursUntil > 14 * 24 || hoursUntil < 0) {
      throw new Error('Sprint mode only valid for deadlines within 14 days');
    }

    // Build objection window (4 hours)
    const objectionWindowEnds = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const autoExpiresAt = new Date(deadlineDate.getTime() + 24 * 60 * 60 * 1000);

    // Build reassignments
    const reassignments: Reassignment[] = neededResources.map(r => ({
      employeeId: r.employeeId,
      fromProject: r.fromProject,
      toProject: project,
      approved: false, // pending objection window
      effectiveAt: objectionWindowEnds.toISOString()
    }));

    const sprint: Sprint = {
      id: `SPRINT-${Date.now()}`,
      name,
      project,
      deadline,
      declaredBy: managerId,
      declaredAt: now.toISOString(),
      primaryManager: managerId,
      elevatedManagers: [managerId],
      objectionWindowEnds: objectionWindowEnds.toISOString(),
      objections: [],
      reassignments,
      status: 'objection_window',
      autoExpiresAt: autoExpiresAt.toISOString()
    };

    this.active = sprint;
    this.save();

    // Notify peer managers
    this.notifyPeers(sprint, manager as Manager);

    // Log
    memory.add({
      id: sprint.id,
      content: `Sprint mode declared: ${name} for ${project}, deadline ${deadline}. Resources requested: ${neededResources.length}`,
      timestamp: now.toISOString(),
      source: 'sprint_mode',
      confidence: 1.0
    });

    return sprint;
  }

  // Peer manager files an objection
  object(sprintId: string, managerId: string, reason: string): boolean {
    if (!this.active || this.active.id !== sprintId) return false;
    if (this.active.status !== 'objection_window') return false;

    // Can't object if window closed
    if (new Date() > new Date(this.active.objectionWindowEnds)) return false;

    // Can't object to own sprint
    if (this.active.primaryManager === managerId) return false;

    this.active.objections.push({
      fromManager: managerId,
      reason,
      timestamp: new Date().toISOString(),
      acknowledged: false
    });

    this.save();

    // Notify primary manager
    router.sendRequest('system', {
      to: this.active.primaryManager,
      action: 'review_sprint_objection',
      deadline: this.active.objectionWindowEnds,
      context: {
        sprintId,
        objectingManager: managerId,
        reason,
        requiresHumanDecision: true
      },
      priority: 'high'
    });

    return true;
  }

  // Check and transition from objection window to active
  check(): Sprint | null {
    if (!this.active) return null;

    const now = new Date();
    const sprint = this.active;

    // Objection window ended, no objections → activate
    if (sprint.status === 'objection_window' && now > new Date(sprint.objectionWindowEnds)) {
      if (sprint.objections.length === 0) {
        // Auto-approve all reassignments
        sprint.reassignments.forEach(r => r.approved = true);
        sprint.status = 'active';

        // Elevate authority for primary manager
        const manager = org.get(sprint.primaryManager) as Manager;
        if (manager) {
          manager.sprintModeActive = true;
        }

        // Notify
        this.notifyActivation(sprint);

        memory.add({
          id: `${sprint.id}-activated`,
          content: `Sprint mode activated: ${sprint.name}. ${sprint.reassignments.length} resources reallocated.`,
          timestamp: now.toISOString(),
          source: 'sprint_mode',
          confidence: 1.0
        });
      } else {
        // Has objections → requires human resolution
        sprint.status = 'active'; // Still active, but with objections noted
        this.notifyHumanRequired(sprint);
      }

      this.save();
    }

    // Auto-expire after deadline + 24h
    if (sprint.status === 'active' && now > new Date(sprint.autoExpiresAt)) {
      this.end(sprint.id, 'auto_expired');
    }

    return this.active;
  }

  // End sprint mode
  end(sprintId: string, reason: 'completed' | 'cancelled' | 'auto_expired'): Sprint | null {
    if (!this.active || this.active.id !== sprintId) return null;

    const sprint = this.active;
    sprint.status = reason === 'completed' ? 'completed' : 'cancelled';
    sprint.endedAt = new Date().toISOString();

    // Revert authority elevation
    const manager = org.get(sprint.primaryManager) as Manager;
    if (manager) {
      manager.sprintModeActive = false;
    }

    // Move to history
    this.history.unshift(sprint);
    this.active = null;
    this.save();

    // Notify
    this.notifyEnd(sprint, reason);

    memory.add({
      id: `${sprintId}-ended`,
      content: `Sprint mode ended: ${sprint.name} (${reason}). Post-sprint review recommended.`,
      timestamp: new Date().toISOString(),
      source: 'sprint_mode',
      confidence: 1.0
    });

    return sprint;
  }

  // Get active sprint
  getActive(): Sprint | null {
    return this.active;
  }

  // Check if sprint mode is currently active
  isActive(): boolean {
    return !!this.active;
  }

  // Get history
  getHistory(limit = 10): Sprint[] {
    return this.history.slice(0, limit);
  }

  // Is a specific employee currently in sprint mode?
  isEmployeeInSprint(employeeId: string): boolean {
    if (!this.active) return false;
    return this.active.reassignments.some(r => r.employeeId === employeeId && r.approved);
  }

  private notifyPeers(sprint: Sprint, declaringManager: Manager): void {
    const peers = declaringManager.colleagues
      .map(id => org.get(id))
      .filter(e => e?.role === 'manager');

    for (const peer of peers) {
      if (!peer) continue;
      router.sendRequest('system', {
        to: peer.id,
        action: 'review_sprint_declaration',
        deadline: sprint.objectionWindowEnds,
        context: {
          sprintId: sprint.id,
          declaringManager: declaringManager.id,
          project: sprint.project,
          deadline: sprint.deadline,
          resourcesRequested: sprint.reassignments.map(r => ({
            employee: r.employeeId,
            from: r.fromProject
          })),
          canObject: true
        },
        priority: 'high'
      });
    }
  }

  private notifyActivation(sprint: Sprint): void {
    for (const r of sprint.reassignments) {
      const emp = org.get(r.employeeId);
      if (!emp) continue;

      router.sendRequest('system', {
        to: r.employeeId,
        action: 'sprint_reassignment',
        deadline: sprint.deadline,
        context: {
          fromProject: r.fromProject,
          toProject: r.toProject,
          sprintName: sprint.name,
          priority: 'sprint'
        },
        priority: 'critical'
      });
    }
  }

  private notifyHumanRequired(sprint: Sprint): void {
    const executive = org.getExecutive();
    
    // This would escalate to UAO for human decision
    console.log(`[${new Date().toISOString()}] [SPRINT] Objections filed for ${sprint.name}. Human review required.`);
  }

  private notifyEnd(sprint: Sprint, reason: string): void {
    // Notify all involved
    for (const r of sprint.reassignments) {
      router.sendRequest('system', {
        to: r.employeeId,
        action: 'sprint_ended',
        deadline: new Date().toISOString(),
        context: {
          sprintName: sprint.name,
          reason,
          returnTo: r.fromProject
        },
        priority: 'normal'
      });
    }
  }
}

export const sprintMode = new SprintMode();
