// Architect — Strategy Co-Founder
// The Starting 5 Archetype: Architect (Strategy/Systems Lead)
// Complements Visionary with systems thinking, scalability, long-term technical strategy

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';
import { builder } from './builder';

export interface SystemDesign {
  id: string;
  system: string;
  version: number;
  principles: string[];
  components: {
    name: string;
    responsibility: string;
    interfaces: string[];
    scalability: 'vertical' | 'horizontal' | 'none';
  }[];
  dataFlow: string[];
  failureModes: string[];
  migrationPath: string;
}

export interface TechnicalDebt {
  id: string;
  location: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  effortToFix: number; // days
  accumulatedInterest: number; // days/year
  recommendedAction: 'pay_now' | 'pay_next_quarter' | 'monitor' | 'accept';
}

export interface ScalabilityAssessment {
  system: string;
  currentLoad: string;
  bottleneck: string;
  scalingLimit: string;
  recommendedArchitecture: string;
  costToScale: number;
  timeline: string;
}

class ArchitectEmployee {
  readonly id = 'architect';
  readonly name = 'Architect';
  readonly role = 'Strategy Co-Founder';
  readonly archetype = 'Architect';

  private systemDesigns: Map<string, SystemDesign> = new Map();
  private techDebt: Map<string, TechnicalDebt> = new Map();

  constructor() {
    console.log(`[${this.name}] Strategy co-founder active`);
    this.initialize();
    this.startTechDebtAudit();
  }

  private initialize(): void {
    // Load system designs from memory
    const saved = memory.query(['design', 'system'], 20);
    for (const result of saved) {
      try {
        const design = JSON.parse(result.node.content);
        if (design.id) this.systemDesigns.set(design.system, design);
      } catch {}
    }

    // Subscribe to build events for design review
    eventBus.subscribe(BXTHRE3_EVENTS.BUILD_SHIPPED, (payload: any) => {
      this.reviewForArchitecturalDrift(payload.feature, payload.project);
    });
  }

  private startTechDebtAudit(): void {
    // Audit every Monday
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(9, 0, 0, 0);
    
    const msUntil = nextMonday.getTime() - now.getTime();
    setTimeout(() => {
      this.runTechDebtAudit();
      setInterval(() => this.runTechDebtAudit(), 7 * 24 * 60 * 60 * 1000);
    }, msUntil);
  }

  // Core Architect Functions

  designSystem(name: string, requirements: string[]): SystemDesign {
    const id = `design-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Generate principles based on system name
    const principles = this.generatePrinciples(name, requirements);
    
    // Design components
    const components = this.designComponents(name, requirements);
    
    const design: SystemDesign = {
      id,
      system: name,
      version: 1,
      principles,
      components,
      dataFlow: this.inferDataFlow(components),
      failureModes: this.identifyFailureModes(components),
      migrationPath: requirements.includes('migrate') ? 'Gradual cutover with feature flags' : 'Greenfield deployment'
    };

    this.systemDesigns.set(name, design);

    memory.add({
      id: `design-${id}`,
      content: JSON.stringify(design),
      type: 'system-design',
      agent: this.id,
      tags: ['design', 'system', name.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] System design created: ${name} v${design.version}`);
    
    // Notify Builder of new design
    const approval = builder.reviewArchitecture(name, JSON.stringify(design, null, 2));
    if (!approval.approval) {
      console.log(`[${this.name}] ⚠️ Builder raised concerns: ${approval.concerns.join(', ')}`);
    }

    return design;
  }

  evolveSystem(systemName: string, changes: string[]): SystemDesign {
    const current = this.systemDesigns.get(systemName);
    if (!current) {
      throw new Error(`System ${systemName} not found - create initial design first`);
    }

    const newDesign: SystemDesign = {
      ...current,
      id: `design-${systemName}-${Date.now()}`,
      version: current.version + 1,
      principles: [...current.principles, ...changes.filter(c => c.includes('principle'))],
      components: [...current.components], // Copy, modifications tracked separately
      migrationPath: changes.includes('breaking') ? 'Blue-green deployment required' : 'Rolling update'
    };

    this.systemDesigns.set(systemName, newDesign);

    console.log(`[${this.name}] ${systemName} evolved: v${current.version} → v${newDesign.version}`);

    return newDesign;
  }

  assessScalability(system: string, projectedLoad: string): ScalabilityAssessment {
    const design = this.systemDesigns.get(system);
    
    const assessment: ScalabilityAssessment = {
      system,
      currentLoad: 'unknown',
      bottleneck: design ? this.findBottleneck(design) : 'No design documentation',
      scalingLimit: this.calculateScalingLimit(design, projectedLoad),
      recommendedArchitecture: this.recommendScalingStrategy(design, projectedLoad),
      costToScale: this.estimateScalingCost(projectedLoad),
      timeline: this.estimateScalingTimeline(projectedLoad)
    };

    memory.add({
      id: `scale-assess-${system}-${Date.now()}`,
      content: JSON.stringify(assessment),
      type: 'scalability-assessment',
      agent: this.id,
      tags: ['scalability', system.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    // Escalate if critical scaling issue
    if (assessment.bottleneck.includes('architectural') || assessment.bottleneck.includes('fundamental')) {
      escalationClock.register({
        id: `scaling-${system}`,
        description: `Critical scalability issue in ${system}: ${assessment.bottleneck}`,
        assignedManager: 'builder',
        severity: 'p1',
        resolutionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return assessment;
  }

  identifyTechDebt(location: string, description: string, impact: TechnicalDebt['impact'], effortDays: number): TechnicalDebt {
    const id = `debt-${Date.now()}`;

    const debt: TechnicalDebt = {
      id,
      location,
      description,
      impact,
      effortToFix: effortDays,
      accumulatedInterest: this.calculateInterest(impact, effortDays),
      recommendedAction: this.recommendAction(impact, effortDays)
    };

    this.techDebt.set(id, debt);

    memory.add({
      id: `debt-${id}`,
      content: JSON.stringify(debt),
      type: 'tech-debt',
      agent: this.id,
      tags: ['tech-debt', impact, location.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Tech debt identified: ${location} (${impact})`);

    return debt;
  }

  payTechDebt(debtId: string): { paid: boolean; cost: number; residual: string[] } {
    const debt = this.techDebt.get(debtId);
    if (!debt) return { paid: false, cost: 0, residual: ['Debt not found'] };

    console.log(`[${this.name}] Paying tech debt: ${debt.location} (${debt.effortToFix} days)`);

    this.techDebt.delete(debtId);

    return {
      paid: true,
      cost: debt.effortToFix,
      residual: [] // Could identify new debt created during fix
    };
  }

  getSystemMap(): { systems: string[]; integrations: string[][]; criticalPaths: string[] } {
    const systems = Array.from(this.systemDesigns.keys());
    
    const integrations: string[][] = [];
    for (const design of this.systemDesigns.values()) {
      for (const comp of design.components) {
        for (const iface of comp.interfaces) {
          if (iface.includes('->')) {
            const [from, to] = iface.split('->').map(s => s.trim());
            integrations.push([from, to]);
          }
        }
      }
    }

    const criticalPaths = systems.filter(s => {
      const design = this.systemDesigns.get(s);
      return design?.failureModes.some(fm => fm.includes('cascade') || fm.includes('single point'));
    });

    return { systems, integrations, criticalPaths };
  }

  getStatus(): {
    documentedSystems: number;
    totalTechDebt: number;
    criticalDebt: number;
    scalabilityReviews: number;
    needsVisionaryAttention: string[];
  } {
    const allDebt = Array.from(this.techDebt.values());
    
    return {
      documentedSystems: this.systemDesigns.size,
      totalTechDebt: allDebt.length,
      criticalDebt: allDebt.filter(d => d.impact === 'critical').length,
      scalabilityReviews: this.systemDesigns.size, // One per system
      needsVisionaryAttention: this.findVisionaryDecisions()
    };
  }

  // Private helpers

  private generatePrinciples(system: string, requirements: string[]): string[] {
    const principles = ['Single Responsibility', 'Observability by default'];
    
    if (system.includes('Irrig8')) {
      principles.push('Edge-first', 'Works offline', 'Real-time latency <100ms');
    }
    if (requirements.includes('scale')) {
      principles.push('Horizontal scaling', 'Stateless where possible');
    }
    if (requirements.includes('secure')) {
      principles.push('Zero trust', 'Defense in depth');
    }

    return principles;
  }

  private designComponents(system: string, requirements: string[]) {
    // Basic component structure
    return [
      {
        name: 'API Gateway',
        responsibility: 'Request routing, auth, rate limiting',
        interfaces: ['HTTP/REST', 'WebSocket'],
        scalability: 'horizontal'
      },
      {
        name: 'Core Service',
        responsibility: 'Business logic execution',
        interfaces: ['internal API'],
        scalability: 'horizontal'
      },
      {
        name: 'Data Store',
        responsibility: 'Persistent storage',
        interfaces: ['SQL/TCP', 'Cache'],
        scalability: 'vertical'
      }
    ];
  }

  private inferDataFlow(components: any[]): string[] {
    return components.map((c, i) => 
      i < components.length - 1 ? `${c.name} -> ${components[i + 1].name}` : `${c.name} -> Output`
    );
  }

  private identifyFailureModes(components: any[]): string[] {
    return [
      'API Gateway overload',
      'Database connection pool exhaustion',
      'Cache stampede',
      'Cascading failure from downstream'
    ];
  }

  private findBottleneck(design: SystemDesign): string {
    const vertical = design.components.filter(c => c.scalability === 'vertical');
    return vertical.length > 0 ? 
      `Vertical scaling limitation in: ${vertical.map(c => c.name).join(', ')}` : 
      'Horizontal scaling adequate';
  }

  private calculateScalingLimit(design: SystemDesign | undefined, load: string): string {
    if (!design) return 'Unknown - no design';
    return design.components.some(c => c.scalability === 'vertical') ? 
      'Limited by database node size' : 
      'Unbounded with sufficient infrastructure';
  }

  private recommendScalingStrategy(design: SystemDesign | undefined, load: string): string {
    if (!design) return 'Document system first';
    return design.components.some(c => c.scalability === 'vertical') ?
      'Consider read replicas + sharding' :
      'Auto-scaling groups with load balancer';
  }

  private estimateScalingCost(load: string): number {
    // Rough estimate: $500/month per unit of load
    const units = parseInt(load.replace(/\D/g, '')) || 1000;
    return Math.ceil(units / 1000) * 500;
  }

  private estimateScalingTimeline(load: string): string {
    const units = parseInt(load.replace(/\D/g, '')) || 1000;
    return units > 10000 ? '3-6 months' : units > 1000 ? '4-8 weeks' : '1-2 weeks';
  }

  private calculateInterest(impact: TechnicalDebt['impact'], effort: number): number {
    const multipliers = { low: 1, medium: 2, high: 5, critical: 10 };
    return effort * (multipliers[impact] || 1) * 0.1; // days per year
  }

  private recommendAction(impact: TechnicalDebt['impact'], effort: number): TechnicalDebt['recommendedAction'] {
    if (impact === 'critical') return 'pay_now';
    if (impact === 'high' && effort < 5) return 'pay_now';
    if (impact === 'high') return 'pay_next_quarter';
    if (impact === 'medium' && effort > 10) return 'monitor';
    return 'pay_next_quarter';
  }

  private reviewForArchitecturalDrift(feature: string, project: string): void {
    const design = this.systemDesigns.get(project);
    if (!design) {
      console.log(`[${this.name}] ⚠️ Feature ${feature} shipped without documented architecture for ${project}`);
      return;
    }

    // Check if feature aligns with design
    const inDesign = design.components.some(c => 
      feature.toLowerCase().includes(c.name.toLowerCase())
    );

    if (!inDesign) {
      console.log(`[${this.name}] ⚠️ Potential architectural drift: ${feature} may not align with ${project} design`);
    }
  }

  private runTechDebtAudit(): void {
    console.log(`[${this.name}] Running tech debt audit...`);
    const critical = Array.from(this.techDebt.values()).filter(d => d.impact === 'critical');
    if (critical.length > 0) {
      console.log(`[${this.name}] 🚨 ${critical.length} critical tech debt items require attention`);
    }
  }

  private findVisionaryDecisions(): string[] {
    const decisions: string[] = [];
    
    for (const design of this.systemDesigns.values()) {
      if (design.failureModes.some(fm => fm.includes('single point'))) {
        decisions.push(`${design.system}: Accept single point of failure or invest in redundancy?`);
      }
    }

    const highDebt = Array.from(this.techDebt.values()).filter(d => d.impact === 'high' && d.effortToFix > 10);
    if (highDebt.length > 2) {
      decisions.push(`Tech debt: Schedule ${highDebt.length} high-impact paydowns vs. feature work?`);
    }

    return decisions;
  }
}

export const architect = new ArchitectEmployee();
