// Talent Lead — Recruitment & People Operations
// Activated: Series A, scaling team

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';

class TalentLead {
  private openRoles = new Map();
  private candidates = new Map();
  private pipelineMetrics = new Map();

  constructor() {
    this.startScanning();
  }

  private async scan(): Promise<void> {
    const staleRoles = await this.checkStaleRoles();
    for (const role of staleRoles) {
      if (role.staleDays > 30) {
        eventBus.publish(BXTHRE3_EVENTS.ROLE_STALE, 'talent', role, 'normal');
      }
    }
    const pipelineHealth = await this.checkPipelineHealth();
    if (pipelineHealth.conversionRate < 0.05) {
      eventBus.publish(BXTHRE3_EVENTS.PIPELINE_SLOW, 'talent', pipelineHealth, 'normal');
    }
  }

  async openRole(department: string, title: string, level: 'ic' | 'lead' | 'director'): Promise<string> {
    const roleId = `ROLE-${Date.now()}`;
    this.openRoles.set(roleId, { department, title, level, opened: new Date().toISOString(), status: 'open' });
    eventBus.publish(BXTHRE3_EVENTS.ROLE_OPENED, 'talent', { roleId, department, title }, 'normal');
    return roleId;
  }

  async sourceCandidate(roleId: string, source: 'linkedin' | 'referral' | 'inbound' | 'outreach'): Promise<string> {
    const candidateId = `CAND-${Date.now()}`;
    this.candidates.set(candidateId, { roleId, source, applied: new Date().toISOString(), stage: 'sourced' });
    this.pipelineMetrics.set(roleId, { ...(this.pipelineMetrics.get(roleId) || {}), sourced: (this.pipelineMetrics.get(roleId)?.sourced || 0) + 1 });
    return candidateId;
  }

  private startScanning(): void {
    setInterval(() => this.scan(), 60 * 60 * 1000);
  }

  private async checkStaleRoles(): Promise<any[]> { return []; }
  private async checkPipelineHealth(): Promise<any> { return { conversionRate: 0.08 }; }
}

export const talentLead = new TalentLead();