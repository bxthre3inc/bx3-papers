// Physical World Integration
// Connects Agentic to real-world sensors, actuators, and IoT devices
// Primary use case: Irrig8 irrigation control

export interface Sensor {
  id: string;
  name: string;
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'flow_meter' | 'pressure' | 'weather';
  location: string;
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'error';
  lastReading: string;
  batteryLevel?: number;
}

export interface Actuator {
  id: string;
  name: string;
  type: 'valve' | 'pump' | 'sprinkler' | 'motor';
  location: string;
  status: 'on' | 'off' | 'error';
  controlledBy: string; // automation rule ID
  manualOverride: boolean;
  lastAction: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'threshold' | 'schedule' | 'event' | 'manual';
    sensorId?: string;
    condition?: { field: string; operator: string; value: number };
    schedule?: string;
  };
  actions: {
    type: 'turn_on' | 'turn_off' | 'adjust' | 'notify';
    actuatorId?: string;
    value?: number;
    message?: string;
  }[];
  enabled: boolean;
  lastTriggered?: string;
  log: { timestamp: string; result: string }[];
}

export interface FieldZone {
  id: string;
  name: string;
  acreage: number;
  sensors: string[];      // sensor IDs
  actuators: string[];    // actuator IDs
  currentStatus: 'optimal' | 'warning' | 'critical';
  recommendations: string[];
}

class PhysicalWorldIntegration {
  private sensors: Map<string, Sensor> = new Map();
  private actuators: Map<string, Actuator> = new Map();
  private rules: Map<string, AutomationRule> = new Map();
  private zones: Map<string, FieldZone> = new Map();

  constructor() {
    this.initializeIrrig8Demo();
  }

  private initializeIrrig8Demo(): void {
    // Demo field zones for San Luis Valley
    const zone1: FieldZone = {
      id: 'zone-1',
      name: 'North Field - Pivot 1',
      acreage: 130,
      sensors: ['sm-n1-1', 'sm-n1-2', 'fl-n1-1', 'tmp-n1-1'],
      actuators: ['valve-n1-1', 'pump-n1-1'],
      currentStatus: 'optimal',
      recommendations: ['Maintain current irrigation schedule']
    };
    this.zones.set('zone-1', zone1);

    const zone2: FieldZone = {
      id: 'zone-2',
      name: 'South Field - Pivot 2',
      acreage: 95,
      sensors: ['sm-s2-1', 'sm-s2-2', 'fl-s2-1'],
      actuators: ['valve-s2-1'],
      currentStatus: 'warning',
      recommendations: ['Soil moisture dropping - consider early irrigation cycle']
    };
    this.zones.set('zone-2', zone2);

    // Sensors
    const sensors: Sensor[] = [
      {
        id: 'sm-n1-1',
        name: 'Soil Moisture N1-1',
        type: 'soil_moisture',
        location: 'North Field - 25% in from edge',
        value: 42,
        unit: '%',
        status: 'online',
        lastReading: new Date().toISOString(),
        batteryLevel: 87
      },
      {
        id: 'sm-n1-2',
        name: 'Soil Moisture N1-2',
        type: 'soil_moisture',
        location: 'North Field - center',
        value: 38,
        unit: '%',
        status: 'online',
        lastReading: new Date().toISOString(),
        batteryLevel: 82
      },
      {
        id: 'fl-n1-1',
        name: 'Flow Meter N1-1',
        type: 'flow_meter',
        location: 'North Field - pump station',
        value: 245,
        unit: 'GPM',
        status: 'online',
        lastReading: new Date().toISOString()
      },
      {
        id: 'sm-s2-1',
        name: 'Soil Moisture S2-1',
        type: 'soil_moisture',
        location: 'South Field - dry corner',
        value: 28,
        unit: '%',
        status: 'online',
        lastReading: new Date().toISOString(),
        batteryLevel: 65
      }
    ];
    sensors.forEach(s => this.sensors.set(s.id, s));

    // Actuators
    const actuators: Actuator[] = [
      {
        id: 'valve-n1-1',
        name: 'Main Valve N1',
        type: 'valve',
        location: 'North Field entry',
        status: 'on',
        controlledBy: 'rule-1',
        manualOverride: false,
        lastAction: new Date().toISOString()
      },
      {
        id: 'pump-n1-1',
        name: 'Center Pivot Pump N1',
        type: 'pump',
        location: 'Pump station',
        status: 'on',
        controlledBy: 'rule-1',
        manualOverride: false,
        lastAction: new Date().toISOString()
      }
    ];
    actuators.forEach(a => this.actuators.set(a.id, a));

    // Automation rules
    const rules: AutomationRule[] = [
      {
        id: 'rule-1',
        name: 'Auto Irrigation - Low Moisture',
        trigger: {
          type: 'threshold',
          sensorId: 'sm-n1-1',
          condition: { field: 'value', operator: '<', value: 35 }
        },
        actions: [
          { type: 'turn_on', actuatorId: 'valve-n1-1' },
          { type: 'turn_on', actuatorId: 'pump-n1-1' },
          { type: 'notify', message: 'Auto-irrigation triggered for North Field' }
        ],
        enabled: true,
        log: []
      },
      {
        id: 'rule-2',
        name: 'Frost Protection',
        trigger: {
          type: 'threshold',
          sensorId: 'tmp-n1-1',
          condition: { field: 'value', operator: '<', value: 32 }
        },
        actions: [
          { type: 'notify', message: 'FROST WARNING - Temperature below 32°F' }
        ],
        enabled: true,
        log: []
      }
    ];
    rules.forEach(r => this.rules.set(r.id, r));
  }

  // Get all zones with current status
  getZones(): FieldZone[] {
    return Array.from(this.zones.values());
  }

  // Get zone by ID with full details
  getZone(zoneId: string): FieldZone | null {
    const zone = this.zones.get(zoneId);
    if (!zone) return null;

    return {
      ...zone,
      sensors: Array.from(this.sensors.values()).filter(s => zone.sensors.includes(s.id)),
      actuators: Array.from(this.actuators.values()).filter(a => zone.actuators.includes(a.id))
    };
  }

  // Get all sensors
  getSensors(): Sensor[] {
    return Array.from(this.sensors.values());
  }

  // Get sensor by ID
  getSensor(sensorId: string): Sensor | null {
    return this.sensors.get(sensorId) || null;
  }

  // Simulate sensor reading (in production: read from actual hardware)
  updateSensorReading(sensorId: string, value: number): boolean {
    const sensor = this.sensors.get(sensorId);
    if (!sensor) return false;

    sensor.value = value;
    sensor.lastReading = new Date().toISOString();

    // Check automation rules
    this.evaluateRules(sensorId, value);

    return true;
  }

  // Evaluate automation rules
  private evaluateRules(sensorId: string, value: number): void {
    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.trigger.type !== 'threshold') continue;
      if (rule.trigger.sensorId !== sensorId) continue;

      const condition = rule.trigger.condition;
      if (!condition) continue;

      let triggered = false;
      switch (condition.operator) {
        case '<':
          triggered = value < condition.value;
          break;
        case '>':
          triggered = value > condition.value;
          break;
        case '=':
          triggered = value === condition.value;
          break;
      }

      if (triggered) {
        this.executeRule(rule);
      }
    }
  }

  // Execute automation rule
  private executeRule(rule: AutomationRule): void {
    rule.lastTriggered = new Date().toISOString();

    for (const action of rule.actions) {
      switch (action.type) {
        case 'turn_on':
        case 'turn_off':
          if (action.actuatorId) {
            const actuator = this.actuators.get(action.actuatorId);
            if (actuator && !actuator.manualOverride) {
              actuator.status = action.type === 'turn_on' ? 'on' : 'off';
              actuator.lastAction = new Date().toISOString();
            }
          }
          break;
        case 'notify':
          // Would send alert via email/SMS
          console.log(`[PHYSICAL] Alert: ${action.message}`);
          break;
      }
    }

    rule.log.push({
      timestamp: new Date().toISOString(),
      result: `Triggered: ${rule.actions.map(a => a.type).join(', ')}`
    });
  }

  // Manual control override
  setActuator(actuatorId: string, state: 'on' | 'off', manual = true): boolean {
    const actuator = this.actuators.get(actuatorId);
    if (!actuator) return false;

    actuator.status = state;
    actuator.manualOverride = manual;
    actuator.lastAction = new Date().toISOString();

    return true;
  }

  // Get actuator by ID
  getActuator(actuatorId: string): Actuator | null {
    return this.actuators.get(actuatorId) || null;
  }

  // Get all rules
  getRules(): AutomationRule[] {
    return Array.from(this.rules.values());
  }

  // Enable/disable rule
  setRule(ruleId: string, enabled: boolean): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;
    rule.enabled = enabled;
    return true;
  }

  // Create new automation rule
  createRule(rule: Omit<AutomationRule, 'id' | 'log'>): AutomationRule {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      log: []
    };
    this.rules.set(newRule.id, newRule);
    return newRule;
  }

  // Get dashboard summary
  getDashboardSummary(): {
    totalZones: number;
    optimalZones: number;
    warningZones: number;
    criticalZones: number;
    onlineSensors: number;
    offlineSensors: number;
    activeActuators: number;
    pendingRules: number;
  } {
    const zones = Array.from(this.zones.values());
    const sensors = Array.from(this.sensors.values());
    const actuators = Array.from(this.actuators.values());

    return {
      totalZones: zones.length,
      optimalZones: zones.filter(z => z.currentStatus === 'optimal').length,
      warningZones: zones.filter(z => z.currentStatus === 'warning').length,
      criticalZones: zones.filter(z => z.currentStatus === 'critical').length,
      onlineSensors: sensors.filter(s => s.status === 'online').length,
      offlineSensors: sensors.filter(s => s.status !== 'online').length,
      activeActuators: actuators.filter(a => a.status === 'on').length,
      pendingRules: this.rules.filter(r => r.enabled && !r.lastTriggered).length
    };
  }
}

export const physicalWorld = new PhysicalWorldIntegration();
