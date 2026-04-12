// Pulse — Service Health Monitor Employee
// Migrated from native Zo agent 2026-03-19

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { escalationClock } from '../escalation/clock';

export interface ServiceCheck {
  name: string;
  url: string;
  port?: number;
  expectedStatus: number;
  timeout: number;
}

export interface ServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  lastCheck: string;
  responseTime?: number;
  error?: string;
}

export class PulseEmployee {
  id = 'pulse';
  name = 'Pulse';
  role = 'Service Monitor';
  department = 'engineering';
  
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 60 * 60 * 1000; // Hourly (corrected from aggressive checking)
  
  private serviceStatus: Map<string, ServiceStatus> = new Map();
  private alertHistory: { service: string; time: string; resolved: boolean }[] = [];
  
  // Only check the unified service as requested
  private services: ServiceCheck[] = [
    {
      name: 'unified_app',
      url: 'http://localhost:8000/health',
      expectedStatus: 200,
      timeout: 5000
    }
  ];
  
  start(): void {
    console.log('[Pulse] Service monitor active (checking unified service only)');
    
    // Run initial check
    this.runHealthCheck();
    
    // Schedule hourly checks
    this.checkInterval = setInterval(() => {
      this.runHealthCheck();
    }, this.CHECK_INTERVAL_MS);
  }
  
  stop(): void {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }
  
  async runHealthCheck(): Promise<void> {
    console.log(`[Pulse] Health check: ${new Date().toISOString()}`);
    
    const results: ServiceStatus[] = [];
    const http = require('http');
    
    for (const service of this.services) {
      const startTime = Date.now();
      
      try {
        const status = await this.checkService(service);
        results.push(status);
        
        // Detect state change
        const previous = this.serviceStatus.get(service.name);
        if (previous?.status !== status.status) {
          console.log(`[Pulse] State change: ${service.name} ${previous?.status || 'unknown'} → ${status.status}`);
          
          if (status.status === 'down') {
            // Alert on down
            escalationClock.register({
              id: `service-down-${service.name}`,
              type: 'service_outage',
              description: `${service.name} is down`,
              severity: 'p1',
              assignedAgent: this.id,
              assignedManager: 'drew',
              resolutionDeadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
              humanEscalationPending: true
            });
            
            eventBus.publish(BXTHRE3_EVENTS.ALERT_RAISED, 'pulse', {
              severity: 'high',
              service: service.name,
              status: 'down',
              error: status.error
            }, 'high');
          }
        }
        
        this.serviceStatus.set(service.name, status);
        
      } catch (err) {
        results.push({
          name: service.name,
          status: 'down',
          lastCheck: new Date().toISOString(),
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
    
    // Log status
    const up = results.filter(r => r.status === 'up').length;
    const down = results.filter(r => r.status === 'down').length;
    
    memory.add({
      id: `pulse-check-${Date.now()}`,
      type: 'health-check',
      agent: this.id,
      content: `Health check: ${up}/${results.length} services up`,
      timestamp: new Date().toISOString(),
      tags: ['health', 'monitor', 'pulse']
    });
    
    // Update status file
    this.updateStatusFile(results);
  }
  
  private checkService(service: ServiceCheck): Promise<ServiceStatus> {
    return new Promise((resolve) => {
      const http = require('http');
      const url = new URL(service.url);
      
      const options = {
        hostname: url.hostname,
        port: url.port || service.port || 80,
        path: url.pathname,
        method: 'GET',
        timeout: service.timeout
      };
      
      const req = http.request(options, (res: any) => {
        const status = res.statusCode === service.expectedStatus ? 'up' : 'degraded';
        
        resolve({
          name: service.name,
          status,
          lastCheck: new Date().toISOString(),
          responseTime: Date.now() // Would measure actual
        });
      });
      
      req.on('error', (err: Error) => {
        resolve({
          name: service.name,
          status: 'down',
          lastCheck: new Date().toISOString(),
          error: err.message
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({
          name: service.name,
          status: 'down',
          lastCheck: new Date().toISOString(),
          error: 'Timeout'
        });
      });
      
      req.end();
    });
  }
  
  private updateStatusFile(results: ServiceStatus[]): void {
    const fs = require('fs');
    
    const up = results.filter(r => r.status === 'up').length;
    const down = results.filter(r => r.status === 'down').length;
    
    const status = {
      employee: this.id,
      timestamp: new Date().toISOString(),
      status: down > 0 ? 'alert' : 'healthy',
      services_checked: results.length,
      services_up: up,
      services_down: down,
      active_alerts: results
        .filter(r => r.status === 'down')
        .map(r => ({
          service: r.name,
          status: r.status,
          issue: r.error || 'Service not responding',
          detected_at: r.lastCheck
        })),
      mood: down > 0 ? 'alert' : 'calm'
    };
    
    fs.writeFileSync(
      '/home/workspace/Bxthre3/agents/status/pulse.json',
      JSON.stringify(status, null, 2)
    );
  }
  
  // Get quick status
  getQuickStatus(): { healthy: boolean; up: number; down: number; total: number } {
    const statuses = Array.from(this.serviceStatus.values());
    const up = statuses.filter(s => s.status === 'up').length;
    const down = statuses.filter(s => s.status === 'down').length;
    
    return {
      healthy: down === 0,
      up,
      down,
      total: this.services.length
    };
  }
  
  // Manual trigger
  triggerImmediateCheck(): void {
    this.runHealthCheck();
  }
}

export const pulse = new PulseEmployee();
