// Visionary Assistant — Personal Strategic Mentor
// NOT part of The Starting 5
// This is your 1:1 thinking partner who learns how you strategize

import { memory } from '../memory/store.js';

export interface StrategicPattern {
  id: string;
  category: 'decision_style' | 'risk_tolerance' | 'timing_sense' | 'team_management' | 'market_intuition';
  observation: string;
  evidence: string[]; // instances where pattern appeared
  confidence: number; // 0-1, increases with evidence
  firstObserved: string;
  lastObserved: string;
}

export interface UserStrategicProfile {
  decisionStyle: {
    speed: 'fast' | 'deliberate' | 'situational';
    dataDependency: 'gut' | 'mixed' | 'data_driven';
    consultationPreference: 'solo' | 'small_circle' | 'broad_input';
    reversalRate: number; // how often you change decisions
  };
  riskProfile: {
    appetite: 'conservative' | 'moderate' | 'aggressive';
    portfolioApproach: 'all_in' | 'diversified' | 'portfolio_theory';
    failureResponse: 'analyze' | 'move_on' | 'internalize';
  };
  strengths: string[];
  blindspots: string[];
  trustedFrameworks: string[]; // mental models you consistently use
}

export class VisionaryAssistant {
  private userId: string = 'brodiblanco';
  private patterns: Map<string, StrategicPattern> = new Map();
  private profile: UserStrategicProfile = {
    decisionStyle: {
      speed: 'situational',
      dataDependency: 'mixed',
      consultationPreference: 'small_circle',
      reversalRate: 0.15
    },
    riskProfile: {
      appetite: 'aggressive',
      portfolioApproach: 'portfolio_theory',
      failureResponse: 'move_on'
    },
    strengths: ['pattern_recognition', 'parallel_execution', 'vision_translation'],
    blindspots: ['detail_patience', 'emotional_processing'],
    trustedFrameworks: ['sprint_mode', 'agent_orchestration', 'portfolio_construction']
  };

  // Learn from every interaction
  observe(input: string, context: {
    situation: string;
    yourDecision?: string;
    outcome?: string;
    timeToDecide?: number; // minutes
  }): void {
    const pattern = this.extractPattern(input, context);
    if (pattern) {
      this.updatePattern(pattern);
    }
    
    // Store in memory
    memory.add({
      id: `observation-${Date.now()}`,
      type: 'learning',
      agent: 'visionary-assistant',
      content: JSON.stringify({ input, context, pattern }),
      timestamp: new Date().toISOString(),
      source: 'mentor',
      tags: ['learning', 'pattern', context.situation]
    });
  }

  // Get strategic advice tailored to YOUR patterns
  advise(context: {
    situation: string;
    options: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
    stakes: 'low' | 'medium' | 'high' | 'company_defining';
  }): {
    recommendation: string;
    reasoning: string;
    alternativesConsidered: string[];
    whyThisFitsYou: string;
    watchouts: string[];
  } {
    // Build advice based on learned patterns
    const advice = this.generateAdvice(context);
    
    // Store the advice interaction
    memory.add({
      id: `advice-${Date.now()}`,
      type: 'advice',
      agent: 'visionary-assistant',
      content: JSON.stringify({ context, advice }),
      timestamp: new Date().toISOString(),
      source: 'mentor',
      tags: ['advice', context.urgency, context.stakes]
    });
    
    return advice;
  }

  // Synthesize your strategic thinking for outsiders
  explainYourThinking(topic: string, audience: 'investors' | 'team' | 'partners' | 'press'): string {
    const frameworks = this.profile.trustedFrameworks;
    
    const explanations = {
      investors: `brodiblanco operates on a portfolio theory of innovation — multiple ventures, each with independent risk profiles, collectively constructing a platform for infrastructure transformation. The agent architecture (The Starting 5, Agentic) isn't just operational efficiency — it's a structural advantage that scales vision without linear cost.`,
      team: `Our strategy: Build systems that compound. Every project feeds into a shared infrastructure — Agentic, the knowledge graph, the agent network. We're not running 7 startups. We're building one platform with 7 entry points.`,
      partners: `Irrig8 represents a specific application of Bxthre3's core thesis: infrastructure-level problems solved through integrated data and AI. We're not a sensor company. We're building the operating system for precision agriculture.`,
      press: `Bxthre3 is an AI-native holding company. Traditional org charts assume humans do work. Our architecture assumes AI does work, humans provide vision. That's how we operate 7 ventures with a core team of 5.'
    };
    
    return explanations[audience] || explanations.team;
  }

  // Check your blindspots before big decisions
  preFlightCheck(decision: {
    what: string;
    why: string;
    when: string;
    who: string[];
  }): {
    concerns: string[];
    questionsToAnswer: string[];
    peopleToConsult: string[];
    timingAssessment: 'optimal' | 'good' | 'risky' | 'dangerous';
  } {
    const concerns: string[] = [];
    const questions: string[] = [];
    
    // Check against known blindspots
    if (this.profile.blindspots.includes('detail_patience')) {
      concerns.push('You tend to move fast on implementation details. Consider having Builder review technical approach.');
      questions.push('Has Maya validated the technical feasibility?');
    }
    
    if (this.profile.blindspots.includes('emotional_processing')) {
      concerns.push('Big decisions sometimes benefit from a pause. Not for more data — for clarity.');
      questions.push('Have you slept on this?');
    }
    
    // Check timing patterns
    const timingAssessment = this.assessTiming(decision.when);
    
    return {
      concerns,
      questionsToAnswer: questions,
      peopleToConsult: ['maya', 'drew', 'alex'], // The three who complement your style
      timingAssessment
    };
  }

  // Private methods
  private extractPattern(input: string, context: any): StrategicPattern | null {
    // Simplified pattern extraction
    // In production, this would use more sophisticated analysis
    
    if (context.timeToDecide && context.timeToDecide < 5) {
      return {
        id: `pattern-fast-${Date.now()}`,
        category: 'decision_style',
        observation: 'Fast decision maker on high conviction items',
        evidence: [context.situation],
        confidence: 0.7,
        firstObserved: new Date().toISOString(),
        lastObserved: new Date().toISOString()
      };
    }
    
    return null;
  }

  private updatePattern(newPattern: StrategicPattern): void {
    const existing = this.patterns.get(newPattern.category);
    if (existing) {
      existing.evidence.push(...newPattern.evidence);
      existing.confidence = Math.min(0.95, existing.confidence + 0.1);
      existing.lastObserved = newPattern.lastObserved;
    } else {
      this.patterns.set(newPattern.category, newPattern);
    }
  }

  private generateAdvice(context: any): any {
    // Tailored advice based on learned patterns
    return {
      recommendation: 'Based on your pattern of situational speed and aggressive risk appetite...',
      reasoning: 'You typically decide fast when conviction is high. This situation shows high conviction markers.',
      alternativesConsidered: ['Wait for more data', 'Consult broader circle', 'Defer decision'],
      whyThisFitsYou: 'This matches your documented preference for portfolio approaches and parallel execution.',
      watchouts: ['Ensure Builder has validated technical feasibility', 'Check with Operator on resource constraints']
    };
  }

  private assessTiming(when: string): 'optimal' | 'good' | 'risky' | 'dangerous' {
    // Simplified timing logic
    return 'good';
  }

  // Get your current strategic profile
  getProfile(): UserStrategicProfile {
    return this.profile;
  }

  // Get all learned patterns
  getPatterns(): StrategicPattern[] {
    return Array.from(this.patterns.values());
  }
}

export const visionaryMentor = new VisionaryAssistant();

// Startup lifecycle mentor mode
export function mentorOnStage(stage: 'seed' | 'seriesA' | 'seriesB' | 'seriesC' | 'public'): string {
  const advice = {
    seed: `Your job: Prove the concept. 1 metric that matters. Everything else is noise.`,
    seriesA: `Your job: Build the machine. Repeatable playbook. The Starting 5 should be hitting stride now.`,
    seriesB: `Your job: Scale the winners. Double down on what's working. Kill what's not.`,
    seriesC: `Your job: Build the platform. Multi-product. International. The infrastructure compounds.`,
    public: `Your job: Industry transformation. You're not running a company, you're shifting a sector.`
  };
  
  return advice[stage];
}