import { hybridGmail } from '../integrations/gmail-hybrid.js';
import { hybridCalendar } from '../integrations/calendar-hybrid.js';

interface IntegrationStatus {
  mode: 'direct' | 'fallback' | 'offline';
  healthy: boolean;
  lastError?: string;
}

export class HybridIntegrationManager {
  private status: Map<string, IntegrationStatus> = new Map();

  getStatus(integration: string): IntegrationStatus | undefined {
    return this.status.get(integration);
  }

  setStatus(integration: string, status: IntegrationStatus): void {
    this.status.set(integration, status);
  }

  async checkAll(): Promise<Record<string, IntegrationStatus>> {
    return Object.fromEntries(this.status);
  }
}

export const hybridManager = new HybridIntegrationManager();
