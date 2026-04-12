// Builder — Technical Co-Founder
// The Starting 5 Archetype: Builder (CTO/Engineering Lead)
// Complements Visionary with shipping, architecture, technical decisions

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';

export interface TechnicalDecision {
  id: string;
  topic: string;
  options: string[];
  recommendation: string;
  reasoning: string;
  confidence: number; // 0-100
  needsVisionaryInput: boolean;
  estimatedImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface BuildSprint {
  id: string;
  name: string;
  project: string;
  milestone: string;
  deliverables: string[];
  deadline: string;
  status: 'planning' | 'building' | 'review' | 'shipped';
  blockers: string[];
}

class BuilderEmployee {
  readonly id = 'builder';
  readonly name = 'Builder';
  readonly role = 'Technical Co-Founder';
  readonly archetype = 'Builder';
  
  private activeSprints: Map<string, BuildSprint> = new Map();
  private pendingDecisions: Map<string, TechnicalDecision> = new Map();

  constructor() {
    console.log(`[${this.name}] Technical co-founder active`);
    this.initialize();
  }

  private initialize(): void {
    // Load active sprints from memory
    const saved = memory.query(['sprint', 'building'], 20);
    for (const result of saved) {
      try {
        const sprint = JSON.parse(result.node.content);
        if (sprint.id && sprint.status !== 'shipped') {
          this.activeSprints.set(sprint.id, sprint);
        }
      } catch {}
    }

    // Subscribe to build events
    eventBus.subscribe(BXTHRE3_EVENTS.SPRINT_DECLARED, (payload: any) => {
      if (payload.sprint?.project?.includes('Irrig8') || 
          payload.sprint?.project?.includes('ESTCP')) {
        this.allocateBuildResources(payload.sprint);
      }
    });
  }

  // Core Builder Functions
  
  makeTechnicalDecision(topic: string, options: string[], context: string): TechnicalDecision {
    const id = `tech-dec-${Date.now()}`;
    
    // Analyze options
    const analysis = this.analyzeOptions(options, context);
    
    const decision: TechnicalDecision = {
      id,
      topic,
      options,
      recommendation: analysis.recommendation,
      reasoning: analysis.reasoning,
      confidence: analysis.confidence,
      needsVisionaryInput: analysis.confidence < 70 || analysis.impact === 'critical',
      estimatedImpact: analysis.impact
    };

    this.pendingDecisions.set(id, decision);
    
    // Store in memory
    memory.add({
      id: `decision-${id}`,
      content: JSON.stringify(decision),
      type: 'technical-decision',
      agent: this.id,
      tags: ['decision', 'technical', topic.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    // Escalate to Visionary if needed
    if (decision.needsVisionaryInput) {
      escalationClock.register({
        id: `escalation-${id}`,
        description: `Technical decision needs Visionary input: ${topic}`,
        assignedManager: 'brodiblanco',
        severity: 'p1',
        resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      eventBus.publish(BXTHRE3_EVENTS.BLOCKER_ESCALATED, {
        decisionId: id,
        topic,
        reason: 'Low confidence or critical impact - needs Visionary alignment'
      });
    }

    return decision;
  }

  startBuildSprint(project: string, milestone: string, deliverables: string[], weeks: number): BuildSprint {
    const id = `build-${Date.now()}`;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + weeks * 7);

    const sprint: BuildSprint = {
      id,
      name: `${project}: ${milestone}`,
      project,
      milestone,
      deliverables,
      deadline: deadline.toISOString(),
      status: 'planning',
      blockers: []
    };

    this.activeSprints.set(id, sprint);

    memory.add({
      id: `sprint-${id}`,
      content: JSON.stringify(sprint),
      type: 'build-sprint',
      agent: this.id,
      tags: ['sprint', 'building', project.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    console.log(`[${this.name}] Build sprint started: ${sprint.name}`);
    
    return sprint;
  }

  reviewArchitecture(system: string, proposedDesign: string): { approval: boolean; feedback: string[]; concerns: string[] } {
    const feedback: string[] = [];
    const concerns: string[] = [];

    // Builder's review criteria
    if (!proposedDesign.includes('scalability')) {
      concerns.push('No clear scalability strategy defined');
    }
    if (!proposedDesign.includes('monitoring') && !proposedDesign.includes('observability')) {
      concerns.push('Missing observability/monitoring plan');
    }
    if (system === 'Irrig8' && !proposedDesign.includes('edge')) {
      concerns.push('Irrig8 requires edge-first architecture consideration');
    }

    // Approval threshold
    const approval = concerns.length <= 1;

    if (approval) {
      feedback.push('Architecture approved with minor revisions');
      feedback.push('Proceed to implementation phase');
    } else {
      feedback.push('Architecture needs revision before implementation');
    }

    return { approval, feedback, concerns };
  }

  shipFeature(featureId: string): { shipped: boolean; announcement: string } {
    const sprint = Array.from(this.activeSprints.values())
      .find(s => s.deliverables.includes(featureId));

    if (!sprint) {
      return { shipped: false, announcement: 'Feature not found in active sprints' };
    }

    sprint.status = 'shipped';
    
    memory.add({
      id: `shipped-${featureId}`,
      content: `Feature ${featureId} shipped as part of ${sprint.name}`,
      type: 'shipment',
      agent: this.id,
      tags: ['shipped', sprint.project.toLowerCase()],
      timestamp: new Date().toISOString(),
      source: this.id
    });

    eventBus.publish(BXTHRE3_EVENTS.BUILD_SHIPPED, {
      feature: featureId,
      sprint: sprint.id,
      project: sprint.project
    });

    return {
      shipped: true,
      announcement: `🚀 ${featureId} shipped in ${sprint.project}`
    };
  }

  getStatus(): { activeSprints: number; pendingDecisions: number; readyToShip: string[] } {
    const readyToShip = Array.from(this.activeSprints.values())
      .filter(s => s.status === 'review')
      .flatMap(s => s.deliverables);

    return {
      activeSprints: this.activeSprints.size,
      pendingDecisions: this.pendingDecisions.size,
      readyToShip
    };
  }

  // Private helpers
  
  private analyzeOptions(options: string[], context: string): { recommendation: string; reasoning: string; confidence: number; impact: 'low' | 'medium' | 'high' | 'critical' } {
    // Placeholder for AI-powered analysis
    // In production, this would use LLM to evaluate options
    const recommendation = options[0]; // Default to first option
    const reasoning = `Based on context: ${context.slice(0, 100)}... Selected ${recommendation} as primary option.`;
    const confidence = 75;
    const impact: 'low' | 'medium' | 'high' | 'critical' = context.includes('core') ? 'high' : 'medium';

    return { recommendation, reasoning, confidence, impact };
  }

  private allocateBuildResources(sprint: any): void {
    console.log(`[${this.name}] Allocating build resources for ${sprint.name}`);
    // Resource allocation logic
  }
}

export const builder = new BuilderEmployee();
