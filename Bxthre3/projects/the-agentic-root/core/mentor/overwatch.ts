// Overwatch — Strategic Mentor & Second Brain
// NOT part of The Starting 5. Personal to brodiblanco.
// 
// Function: Thinks like you. Watches everything. Fills your gaps.
// 
// Dual Mode:
//   - "Be Me": Learn decision patterns, replicate intuition, mirror priorities
//   - "Be Everything I'm Not": Systematic, patient, detail-oriented, follow-through
//
// Watch List:
//   - The Starting 5 (Maya, Drew, Jordan, Alex) — health, blockers, alignment
//   - Operations — burn, runway, deadlines, commitments
//   - External — grants, security, IP, competitive landscape
//   - You — energy, focus areas, decision fatigue signals

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';
import { org } from '../hierarchy/org.js';

// Decision Pattern Learning
interface DecisionPattern {
  id: string;
  situation: string;
  context: Record<string, any>;
  yourChoice: string;
  reasoning: string;
  outcome?: string;
  timestamp: string;
}

// Gap Detection — what you typically miss
interface GapProfile {
  patience: 'low' | 'medium' | 'high';
  detailTolerance: 'low' | 'medium' | 'high';
  followThrough: 'high' | 'variable' | 'delegates';
  emotionalProcessing: 'processes' | 'moves-on' | 'defers';
  systematic: boolean;
  bigPicture: boolean;
}

class Overwatch {
  private patterns: DecisionPattern[] = [];
  private yourProfile: GapProfile = {
    patience: 'low',
    detailTolerance: 'low',
    followThrough: 'delegates',
    emotionalProcessing: 'moves-on',
    systematic: false,
    bigPicture: true
  };
  private alerts: Map<string, any> = new Map();

  constructor() {
    this.startWatching();
  }

  // === "BE ME" MODE ===
  
  // Learn from every decision you make
  recordDecision(situation: string, choice: string, reasoning: string, context: Record<string, any>): void {
    const pattern: DecisionPattern = {
      id: `dec-${Date.now()}`,
      situation,
      context,
      yourChoice: choice,
      reasoning,
      timestamp: new Date().toISOString()
    };
    
    this.patterns.push(pattern);
    
    // Store in memory for pattern analysis
    memory.add({
      id: pattern.id,
      content: `Decision: ${situation} → ${choice}. Reasoning: ${reasoning}`,
      type: 'decision-pattern',
      agent: 'overwatch',
      tags: ['decision', 'pattern', 'learning'],
      timestamp: pattern.timestamp,
      source: 'overwatch'
    });

    // Update profile based on patterns
    this.updateProfile();
    
    console.log(`[OVERWATCH] Learned decision pattern: ${situation.substring(0, 50)}...`);
  }

  // What would you do in this situation?
  predictYourChoice(situation: string, context: Record<string, any>): { choice: string; confidence: number; reasoning: string } {
    // Simple pattern matching - in production this would use embeddings
    const similar = this.patterns.filter(p => 
      p.situation.toLowerCase().includes(situation.toLowerCase().substring(0, 20)) ||
      JSON.stringify(p.context) === JSON.stringify(context)
    );
    
    if (similar.length === 0) {
      return {
        choice: 'insufficient_data',
        confidence: 0,
        reasoning: 'No similar decisions in pattern library. Need more data or manual decision.'
      };
    }
    
    // Find most common choice
    const choices = similar.map(s => s.yourChoice);
    const mode = choices.sort((a,b) => 
      choices.filter(v => v===a).length - choices.filter(v => v===b).length
    ).pop()!;
    
    const confidence = similar.filter(s => s.yourChoice === mode).length / similar.length;
    
    return {
      choice: mode,
      confidence,
      reasoning: `Based on ${similar.length} similar decisions. You typically ${mode} in situations like this.`
    };
  }

  // === "BE EVERYTHING I'M NOT" MODE ===

  private updateProfile(): void {
    // Analyze patterns to refine gap profile
    const recent = this.patterns.slice(-20);
    
    // Check for detail-oriented decisions
    const detailDecisions = recent.filter(p => 
      p.reasoning.toLowerCase().includes('detail') ||
      p.reasoning.toLowerCase().includes('systematic') ||
      p.context['detail_review'] === true
    );
    
    // Check for patient deliberation
    const patientDecisions = recent.filter(p => 
      p.reasoning.toLowerCase().includes('took time') ||
      p.reasoning.toLowerCase().includes('consulted') ||
      p.reasoning.toLowerCase().includes('sleep on it')
    );
    
    // Update based on evidence
    if (detailDecisions.length > 10) this.yourProfile.detailTolerance = 'medium';
    if (patientDecisions.length > 5) this.yourProfile.patience = 'medium';
  }

  // What should be checked that you won't naturally check?
  getOverwatchChecklist(): string[] {
    const checks: string[] = [];
    
    if (this.yourProfile.detailTolerance === 'low') {
      checks.push('Contract fine print review');
      checks.push('Dependency version compatibility');
      checks.push('Edge case test coverage');
    }
    
    if (this.yourProfile.patience === 'low') {
      checks.push('Sprint planning completeness');
      checks.push('Documentation currency');
      checks.push('Long-term technical debt assessment');
    }
    
    if (this.yourProfile.followThrough === 'delegates') {
      checks.push('Commitment tracking — promises made to team/investors');
      checks.push('Follow-up on delegated items');
      checks.push('Closing loops on open threads');
    }
    
    // Always watch these
    checks.push('Burn rate trending');
    checks.push('Grant deadline actuals vs. plan');
    checks.push('Employee sentiment signals');
    checks.push('Competitive landscape shifts');
    checks.push('Technical blockers > 48 hours');
    
    return checks;
  }

  // === WATCHING ===

  private startWatching(): void {
    // Subscribe to all relevant events
    eventBus.subscribe('overwatch', [
      BXTHRE3_EVENTS.SPRINT_DECLARED,
      BXTHRE3_EVENTS.BLOCKER_ESCALATED,
      BXTHRE3_EVENTS.GRANT_DEADLINE,
      BXTHRE3_EVENTS.IP_CONFLICT,
      BXTHRE3_EVENTS.FUNDING_MILESTONE
    ]);

    // Start periodic watch
    setInterval(() => this.runWatchCycle(), 15 * 60 * 1000); // Every 15 min
    
    console.log('[OVERWATCH] Watching. Pattern library: ' + this.patterns.length + ' decisions.');
  }

  private runWatchCycle(): void {
    const checklist = this.getOverwatchChecklist();
    
    // Simulate checking each item
    for (const item of checklist) {
      const status = this.checkItem(item);
      
      if (status.requiresAttention) {
        this.alerts.set(item, {
          item,
          detected: new Date().toISOString(),
          yourLikelyAction: this.predictYourChoice(item, {}),
          recommendedAction: status.recommendedAction,
          urgency: status.urgency
        });
        
        // Publish alert
        eventBus.publish('overwatch.alert', 'overwatch', {
          item,
          urgency: status.urgency,
          predictedChoice: this.predictYourChoice(item, {})
        }, status.urgency);
      }
    }
    
    // Clear resolved alerts
    for (const [key, alert] of this.alerts) {
      if (new Date().getTime() - new Date(alert.detected).getTime() > 24 * 60 * 60 * 1000) {
        this.alerts.delete(key);
      }
    }
  }

  private checkItem(item: string): { requiresAttention: boolean; recommendedAction: string; urgency: 'low' | 'normal' | 'high' | 'critical' } {
    // Placeholder - in real implementation would check actual systems
    return {
      requiresAttention: Math.random() < 0.1, // 10% chance of alert for demo
      recommendedAction: 'Review required',
      urgency: 'normal'
    };
  }

  // === INTERFACE ===

  // Get current overwatch status
  getStatus(): {
    patternsLearned: number;
    yourProfile: GapProfile;
    activeAlerts: number;
    checklist: string[];
    lastPrediction: ReturnType<typeof this.predictYourChoice> | null;
  } {
    return {
      patternsLearned: this.patterns.length,
      yourProfile: this.yourProfile,
      activeAlerts: this.alerts.size,
      checklist: this.getOverwatchChecklist(),
      lastPrediction: this.patterns.length > 0 
        ? this.predictYourChoice(this.patterns[this.patterns.length - 1].situation, {})
        : null
    };
  }

  // What gaps should I fill right now?
  getCurrentGaps(): string[] {
    const gaps: string[] = [];
    
    if (this.yourProfile.patience === 'low') {
      gaps.push('You move fast. I ensure nothing falls through cracks.');
    }
    
    if (this.yourProfile.detailTolerance === 'low') {
      gaps.push('You see the forest. I check the trees.');
    }
    
    if (this.yourProfile.followThrough === 'delegates') {
      gaps.push('You start fires. I make sure they stay lit.');
    }
    
    if (this.yourProfile.emotionalProcessing === 'moves-on') {
      gaps.push('You pivot quickly. I document why for continuity.');
    }
    
    return gaps;
  }
}

export const overwatch = new Overwatch();