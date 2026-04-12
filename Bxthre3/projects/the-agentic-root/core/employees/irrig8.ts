/**
 * Irrig8 Field Agent — Agentic
 * 
 * Vertical: Irrig8 (precision agriculture OS)
 * Pilot: San Luis Valley Subdistrict 1 — June 2026
 * Partners: CSU, Subdistrict 1 water users
 * 
 * Owned by: Maya (Grant Strategist) with field ops from Taylor
 * Comms: Bxthre3/INBOX/agents/irrig8.md
 */

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';

export interface FieldReading {
  deviceId: string;
  timestamp: string;
  zone: string;
  soilMoisture: number;      // centibars
  soilTemp: number;          // celsius
  ambientTemp: number;        // celsius
  humidity: number;           // percent
  rainDetected: boolean;
  batteryLevel: number;       // percent
}

export interface IrrigationRecommendation {
  deviceId: string;
  zone: string;
  action: 'RUN' | 'HOLD' | 'MONITOR';
  reason: string;
  suggestedDuration?: number;  // minutes
  confidence: number;          // 0-1
  priority: 'low' | 'medium' | 'high' | 'critical';
  escalate: boolean;
}

class Irrig8FieldAgent {
  readonly id = 'irrig8';
  readonly name = 'Irrig8 Field Agent';
  readonly role = 'Field Operations Lead';
  readonly department = 'operations';
  readonly managerId = 'maya';

  private lastSync: string | null = null;
  private activeZones: Set<string> = new Set();
  private alertThreshold = {
    soilMoistureCritical: 200,  // centibars — very dry
    soilMoistureLow: 100,        // centibars — consider watering
    batteryLow: 20,             // percent
    tempFrost: 2,               // celsius
  };

  constructor() {
    console.log('[IRRIG8] Field agent initialized — San Luis Valley pilot');
    this.startFieldMonitoring();
    this.startWaterCourtWatch();
  }

  // === FIELD MONITORING ===

  private startFieldMonitoring(): void {
    // Check sensor data every 30 minutes
    setInterval(() => this.checkSensors(), 30 * 60 * 1000);
    // Initial check
    this.checkSensors();
    console.log('[IRRIG8] Field monitoring active — 30min interval');
  }

  private async checkSensors(): Promise<void> {
    const readings = await this.fetchSensorReadings();
    
    for (const reading of readings) {
      this.activeZones.add(reading.zone);
      const rec = this.evaluateReading(reading);
      
      if (rec.escalate) {
        this.escalate(rec);
      }
    }

    this.lastSync = new Date().toISOString();
    this.updateMemory();
  }

  private async fetchSensorReadings(): Promise<FieldReading[]> {
    // In production: query sensor API / TimescaleDB
    // For now: return simulated readings from memory
    const sensorNodes = memory.query(['sensor', 'field', 'irrig8'], 50);
    
    const readings: FieldReading[] = [];
    for (const node of sensorNodes) {
      try {
        readings.push(JSON.parse(node.node.content));
      } catch {
        // Skip non-JSON nodes
      }
    }
    
    return readings;
  }

  private evaluateReading(reading: FieldReading): IrrigationRecommendation {
    const { deviceId, zone, soilMoisture, batteryLevel, rainDetected } = reading;

    // Critical: very dry soil
    if (soilMoisture >= this.alertThreshold.soilMoistureCritical) {
      return {
        deviceId,
        zone,
        action: rainDetected ? 'MONITOR' : 'RUN',
        reason: `Soil moisture critically low (${soilMoisture}cb) — crop stress imminent`,
        suggestedDuration: rainDetected ? undefined : 120,
        confidence: 0.9,
        priority: 'critical',
        escalate: true,
      };
    }

    // Low moisture
    if (soilMoisture >= this.alertThreshold.soilMoistureLow) {
      return {
        deviceId,
        zone,
        action: rainDetected ? 'HOLD' : 'RUN',
        reason: `Soil moisture declining (${soilMoisture}cb) — recommend irrigation`,
        suggestedDuration: rainDetected ? undefined : 60,
        confidence: 0.75,
        priority: 'medium',
        escalate: false,
      };
    }

    // Adequate moisture
    return {
      deviceId,
      zone,
      action: 'HOLD',
      reason: `Soil moisture adequate (${soilMoisture}cb)`,
      confidence: 0.95,
      priority: 'low',
      escalate: false,
    };
  }

  private escalate(rec: IrrigationRecommendation): void {
    eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, this.id, {
      agent: this.id,
      type: 'irrigation-decision',
      deviceId: rec.deviceId,
      zone: rec.zone,
      action: rec.action,
      reason: rec.reason,
      priority: rec.priority,
    }, rec.priority === 'critical' ? 'critical' : 'high');

    memory.add({
      id: `irrig8-escalation-${Date.now()}`,
      type: 'field-escalation',
      agent: this.id,
      content: `[${rec.priority.toUpperCase()}] ${rec.zone}: ${rec.action} — ${rec.reason}`,
      timestamp: new Date().toISOString(),
      tags: ['irrig8', 'field', 'escalation', rec.priority],
      source: this.id,
    });
  }

  // === WATER COURT MONITORING ===

  private startWaterCourtWatch(): void {
    // Check water court dockets daily at 8 AM
    const check = () => {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() < 5) {
        this.checkWaterCourt();
      }
    };
    setInterval(check, 60 * 60 * 1000);
    console.log('[IRRIG8] Water court watch active');
  }

  private async checkWaterCourt(): Promise<void> {
    // In production: scrape Colorado Water Court docket
    // Check for:
    // - Rebuttal evidence deadlines (June 29, 2026 hearing)
    // - Expert witness requirements
    // - New case filings affecting San Luis Valley
    
    memory.add({
      id: `watercourt-watch-${Date.now()}`,
      type: 'water-court-watch',
      agent: this.id,
      content: `Water court check: ${this.activeZones.size} zones monitored`,
      timestamp: new Date().toISOString(),
      tags: ['water-court', 'irrig8', 'compliance'],
      source: this.id,
    });
  }

  // === MEMORY & STATUS ===

  private updateMemory(): void {
    memory.add({
      id: `irrig8-status-${Date.now()}`,
      type: 'field-status',
      agent: this.id,
      content: JSON.stringify({
        lastSync: this.lastSync,
        activeZones: [...this.activeZones],
        zonesMonitored: this.activeZones.size,
      }),
      timestamp: new Date().toISOString(),
      tags: ['irrig8', 'status', 'field'],
      source: this.id,
    });
  }

  getStatus(): {
    lastSync: string | null;
    zonesMonitored: number;
    active: boolean;
  } {
    return {
      lastSync: this.lastSync,
      zonesMonitored: this.activeZones.size,
      active: true,
    };
  }
}

export const irrig8 = new Irrig8FieldAgent();
export default irrig8;
