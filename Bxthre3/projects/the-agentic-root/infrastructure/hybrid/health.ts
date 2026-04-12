interface HealthStatus {
  service: string;
  healthy: boolean;
  mode: 'direct' | 'fallback' | 'cached';
  lastCheck: string;
}

export class HealthMonitor {
  private checks: Map<string, HealthStatus> = new Map();

  recordCheck(service: string, healthy: boolean, mode: 'direct' | 'fallback' | 'cached'): void {
    this.checks.set(service, {
      service,
      healthy,
      mode,
      lastCheck: new Date().toISOString()
    });
  }

  getStatus(service?: string): HealthStatus | Map<string, HealthStatus> {
    if (service) {
      return this.checks.get(service) || {
        service,
        healthy: false,
        mode: 'offline',
        lastCheck: new Date().toISOString()
      };
    }
    return this.checks;
  }
}

export const healthMonitor = new HealthMonitor();
