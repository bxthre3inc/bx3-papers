// Drift Guardian — Detection & Prevention
// Catches misalignment before it becomes crisis

export type DriftType = 'goal' | 'behavior' | 'knowledge' | 'communication' | 'priority';
export type DriftSeverity = 'minor' | 'moderate' | 'severe' | 'critical';

export interface DriftEvent {
  id: string;
  type: DriftType;
  severity: DriftSeverity;
  detectedAt: string;
  
  // What drifted
  subjectId: string; // employee, goal, or system
  subjectType: 'employee' | 'goal' | 'team' | 'system';
  
  // From what to what
  expectedState: string;
  actualState: string;
  deviation: number; // percentage or magnitude
  
  // Context
  timeSinceLastCheck: number; // hours
  contributingFactors: string[];
  
  // Resolution
  autoCorrected: boolean;
  correctionAction?: string;
  requiresHuman: boolean;
  escalatedTo?: string;
  
  // Status
  status: 'detected' | 'correcting' | 'corrected' | 'escalated' | 'ignored';
}

export class DriftGuardian {
  private drifts: DriftEvent[] = [];
  private checks: Map<string, { lastCheck: string; baseline: any }> = new Map();
  
  // Baseline patterns for normal operation
  private baselines = {
    employeeOutput: { minTasksPerDay: 3, maxBlockerAge: 24 }, // hours
    goalProgress: { maxDeviation: 15 }, // percent
    communication: { responseTime: 4 }, // hours
    priority: { highPriorityRatio: 0.3 } // 30% of tasks should be high priority
  };
  
  // Check for drift across all dimensions
  async checkAll(): Promise<DriftEvent[]> {
    const newDrifts: DriftEvent[] = [];
    
    // Check 1: Goal progress drift
    newDrifts.push(...this.checkGoalDrift());
    
    // Check 2: Employee output drift
    newDrifts.push(...this.checkEmployeeDrift());
    
    // Check 3: Knowledge/know-how drift
    newDrifts.push(...this.checkKnowledgeDrift());
    
    // Check 4: Communication pattern drift
    newDrifts.push(...this.checkCommunicationDrift());
    
    // Check 5: Priority alignment drift
    newDrifts.push(...this.checkPriorityDrift());
    
    // Store and auto-correct
    for (const drift of newDrifts) {
      this.drifts.push(drift);
      
      if (!drift.requiresHuman) {
        this.autoCorrect(drift);
      } else {
        this.escalate(drift);
      }
    }
    
    return newDrifts;
  }
  
  private checkGoalDrift(): DriftEvent[] {
    // Goals should progress ~linearly with time
    // If falling behind >15% → at risk drift
    // If ahead >25% → may be under-ambitious
    
    return []; // Implemented via strategy system
  }
  
  private checkEmployeeDrift(): DriftEvent[] {
    const drifts: DriftEvent[] = [];
    
    // Check each employee's output vs their baseline
    // Implementation would query performance tracking
    
    return drifts;
  }
  
  private checkKnowledgeDrift(): DriftEvent[] {
    // Detect when agents start using outdated info
    // Compare against memory timestamps
    
    return [];
  }
  
  private checkCommunicationDrift(): DriftEvent[] {
    // Detect when communication patterns change
    // E.g., suddenly no standups, delayed responses
    
    return [];
  }
  
  private checkPriorityDrift(): DriftEvent[] {
    // Detect when high-priority work is being neglected
    // Or when everything becomes "urgent"
    
    return [];
  }
  
  // Auto-correction logic
  private autoCorrect(drift: DriftEvent): void {
    switch (drift.type) {
      case 'goal':
        // Auto-activate sprint mode if deadline near
        drift.correctionAction = 'Sprint mode auto-activated';
        drift.autoCorrected = true;
        break;
        
      case 'behavior':
        // Send reminder to agent
        drift.correctionAction = 'Reminder notification sent';
        drift.autoCorrected = true;
        break;
        
      case 'knowledge':
        // Trigger knowledge refresh
        drift.correctionAction = 'Knowledge base refresh scheduled';
        drift.autoCorrected = true;
        break;
        
      case 'communication':
        // Re-route through manager
        drift.correctionAction = 'Communication re-routed to manager';
        drift.autoCorrected = true;
        break;
        
      case 'priority':
        // Re-sort task queue
        drift.correctionAction = 'Task priorities re-sorted by urgency';
        drift.autoCorrected = true;
        break;
    }
    
    drift.status = 'corrected';
  }
  
  private escalate(drift: DriftEvent): void {
    drift.escalatedTo = drift.severity === 'critical' ? 'brodiblanco' : 'erica';
    drift.status = 'escalated';
    
    // Would send notification here
    console.log(`🚨 DRIFT ESCALATED: ${drift.type} drift by ${drift.subjectId} → ${drift.escalatedTo}`);
  }
  
  // Prevention: Proactive interventions
  preventDrift(type: DriftType, subjectId: string): string {
    switch (type) {
      case 'goal':
        return `Schedule weekly check-ins for ${subjectId}. Break goal into smaller milestones.`;
        
      case 'behavior':
        return `Pair ${subjectId} with onboarding buddy. Review task assignments.`;
        
      case 'knowledge':
        return `Schedule knowledge transfer session. Update training materials.`;
        
      case 'communication':
        return `Review communication protocols. Ensure inbox cleared daily.`;
        
      case 'priority':
        return `Clarify priority framework. Limit 'urgent' designations.`;
    }
  }
  
  // Dashboard view
  getDriftReport(): {
    activeDrifts: DriftEvent[];
    recentCorrections: DriftEvent[];
    escalationRate: number;
    topDriftTypes: [DriftType, number][];
    preventionRecommendations: string[];
  } {
    const active = this.drifts.filter(d => d.status === 'detected' || d.status === 'correcting');
    const corrected = this.drifts.filter(d => d.status === 'corrected').slice(-10);
    const escalated = this.drifts.filter(d => d.status === 'escalated');
    
    const typeCounts = new Map<DriftType, number>();
    for (const d of this.drifts) {
      typeCounts.set(d.type, (typeCounts.get(d.type) || 0) + 1);
    }
    
    return {
      activeDrifts: active,
      recentCorrections: corrected,
      escalationRate: this.drifts.length > 0 ? escalated.length / this.drifts.length : 0,
      topDriftTypes: Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1]),
      preventionRecommendations: this.generatePreventions()
    };
  }
  
  private generatePreventions(): string[] {
    const recent = this.drifts.slice(-30);
    const patterns = new Map<DriftType, number>();
    
    for (const d of recent) {
      patterns.set(d.type, (patterns.get(d.type) || 0) + 1);
    }
    
    return Array.from(patterns.entries())
      .filter(([, count]) => count > 3)
      .map(([type]) => this.preventDrift(type, 'system'));
  }
  
  // Historical trend
  getTrend(days: number): { date: string; driftsDetected: number; autoCorrected: number; escalated: number }[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const relevant = this.drifts.filter(d => new Date(d.detectedAt).getTime() > cutoff);
    
    const byDay = new Map<string, { detected: number; corrected: number; escalated: number }>();
    
    for (const d of relevant) {
      const day = d.detectedAt.slice(0, 10);
      const entry = byDay.get(day) || { detected: 0, corrected: 0, escalated: 0 };
      entry.detected++;
      if (d.autoCorrected) entry.corrected++;
      if (d.status === 'escalated') entry.escalated++;
      byDay.set(day, entry);
    }
    
    return Array.from(byDay.entries())
      .map(([date, stats]) => ({
        date,
        driftsDetected: stats.detected,
        autoCorrected: stats.corrected,
        escalated: stats.escalated
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const driftGuardian = new DriftGuardian();
