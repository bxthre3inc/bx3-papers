/**
 * VPC — Valley Players Club Agent — Agentic
 * 
 * Vertical: Valley Players Club (sweepstakes gaming + cash-in-person)
 * Status: Live platform (vpc-brodiblanco.zocomputer.io)
 * 
 * Owned by: Drew (Sales / BizDev) with compliance from Raj
 * Comms: Bxthre3/INBOX/agents/vpc.md
 */

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';

export interface VpcMetrics {
  activeUsers: number;
  gamesPlayed24h: number;
  revenue24h: number;
  pendingWithdrawals: number;
  kycQueueSize: number;
  supportTicketsOpen: number;
}

class VpcAgent {
  readonly id = 'vpc';
  readonly name = 'VPC Agent';
  readonly role = 'Gaming Operations Lead';
  readonly department = 'operations';
  readonly managerId = 'drew';

  private healthInterval: NodeJS.Timeout | null = null;
  private lastHealthCheck: string | null = null;

  constructor() {
    console.log('[VPC] Gaming operations agent active');
    this.startHealthMonitor();
  }

  // === PLATFORM HEALTH ===

  private startHealthMonitor(): void {
    // Check every 15 minutes
    this.healthInterval = setInterval(() => this.runHealthCheck(), 15 * 60 * 1000);
    this.runHealthCheck();
    console.log('[VPC] Health monitor active — 15min interval');
  }

  private async runHealthCheck(): Promise<void> {
    const metrics = await this.fetchMetrics();

    // Check for critical issues
    if (metrics.pendingWithdrawals > 10) {
      this.alert('high-withdrawals', `⚠️ ${metrics.pendingWithdrawals} pending withdrawals — check payout queue`);
    }

    if (metrics.kycQueueSize > 25) {
      this.alert('kyc-backlog', `⚠️ KYC queue backlog: ${metrics.kycQueueSize} pending`);
    }

    if (metrics.supportTicketsOpen > 20) {
      this.alert('support-load', `⚠️ Support load elevated: ${metrics.supportTicketsOpen} open tickets`);
    }

    this.lastHealthCheck = new Date().toISOString();
    this.updateMemory(metrics);
  }

  private async fetchMetrics(): Promise<VpcMetrics> {
    // In production: query VPC database
    // vpc.db at the-valleyplayersclub-project/vpc.db
    return {
      activeUsers: 0,
      gamesPlayed24h: 0,
      revenue24h: 0,
      pendingWithdrawals: 0,
      kycQueueSize: 0,
      supportTicketsOpen: 0,
    };
  }

  private alert(type: string, message: string): void {
    memory.add({
      id: `vpc-alert-${Date.now()}`,
      type: 'platform-alert',
      agent: this.id,
      content: message,
      timestamp: new Date().toISOString(),
      tags: ['vpc', 'alert', type],
      source: this.id,
    });

    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, this.id, {
      agent: this.id,
      type: 'vpc-alert',
      alertType: type,
      message,
    }, 'high');
  }

  private updateMemory(metrics: VpcMetrics): void {
    memory.add({
      id: `vpc-metrics-${Date.now()}`,
      type: 'platform-metrics',
      agent: this.id,
      content: JSON.stringify(metrics),
      timestamp: new Date().toISOString(),
      tags: ['vpc', 'metrics', 'operations'],
      source: this.id,
    });
  }

  // === STATUS ===

  getStatus(): { lastCheck: string | null; healthy: boolean } {
    return {
      lastCheck: this.lastHealthCheck,
      healthy: true,
    };
  }
}

export const vpcAgent = new VpcAgent();
export default vpcAgent;
