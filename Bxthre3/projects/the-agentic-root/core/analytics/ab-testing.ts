interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  variants: Variant[];
  status: 'draft' | 'running' | 'completed' | 'stopped';
  startDate?: string;
  endDate?: string;
  sampleSize: number;
  winner?: string;
}

interface Variant {
  id: string;
  name: string;
  config: Record<string, any>;
  assignments: number;
  outcomes: {
    success: number;
    failure: number;
    duration: number[];
  };
}

const experiments: Map<string, Experiment> = new Map();

export class ABTestingFramework {
  createExperiment(
    name: string,
    hypothesis: string,
    variants: Omit<Variant, 'assignments' | 'outcomes'>[],
    sampleSize = 100
  ): string {
    const id = `exp-${Date.now()}`;
    
    experiments.set(id, {
      id,
      name,
      hypothesis,
      variants: variants.map(v => ({
        ...v,
        assignments: 0,
        outcomes: { success: 0, failure: 0, duration: [] }
      })),
      status: 'draft',
      sampleSize
    });
    
    console.log(`[A/B] Experiment created: ${name} (${variants.length} variants)`);
    return id;
  }

  startExperiment(id: string): boolean {
    const exp = experiments.get(id);
    if (!exp) return false;
    
    exp.status = 'running';
    exp.startDate = new Date().toISOString();
    console.log(`[A/B] Started: ${exp.name}`);
    return true;
  }

  // Assign agent to variant (round-robin)
  assignVariant(expId: string, agentId: string): Variant | null {
    const exp = experiments.get(expId);
    if (!exp || exp.status !== 'running') return null;
    
    // Find variant with fewest assignments
    const variant = exp.variants.reduce((min, v) => 
      v.assignments < min.assignments ? v : min
    );
    
    variant.assignments++;
    
    // Log assignment
    console.log(`[A/B] Agent ${agentId} assigned to ${variant.name}`);
    
    return variant;
  }

  recordOutcome(
    expId: string,
    variantId: string,
    success: boolean,
    durationMs: number
  ): void {
    const exp = experiments.get(expId);
    if (!exp) return;
    
    const variant = exp.variants.find(v => v.id === variantId);
    if (!variant) return;
    
    if (success) {
      variant.outcomes.success++;
    } else {
      variant.outcomes.failure++;
    }
    variant.outcomes.duration.push(durationMs);
    
    // Check if experiment complete
    const totalAssignments = exp.variants.reduce((sum, v) => sum + v.assignments, 0);
    if (totalAssignments >= exp.sampleSize) {
      this.completeExperiment(expId);
    }
  }

  completeExperiment(id: string): void {
    const exp = experiments.get(id);
    if (!exp) return;
    
    exp.status = 'completed';
    exp.endDate = new Date().toISOString();
    
    // Determine winner (highest success rate)
    const winner = exp.variants.reduce((best, v) => {
      const successRate = v.outcomes.success / (v.outcomes.success + v.outcomes.failure);
      const bestRate = best.outcomes.success / (best.outcomes.success + best.outcomes.failure);
      return successRate > bestRate ? v : best;
    });
    
    exp.winner = winner.id;
    
    console.log(`[A/B] Complete: ${exp.name} - Winner: ${winner.name}`);
    console.log(`[A/B] Results:`, this.getResults(id));
  }

  getResults(id: string): Record<string, { successRate: number; avgDuration: number }> | null {
    const exp = experiments.get(id);
    if (!exp) return null;
    
    const results: Record<string, { successRate: number; avgDuration: number }> = {};
    
    for (const v of exp.variants) {
      const total = v.outcomes.success + v.outcomes.failure;
      results[v.name] = {
        successRate: total > 0 ? v.outcomes.success / total : 0,
        avgDuration: v.outcomes.duration.length > 0
          ? v.outcomes.duration.reduce((a, b) => a + b, 0) / v.outcomes.duration.length
          : 0
      };
    }
    
    return results;
  }

  listExperiments(): Experiment[] {
    return Array.from(experiments.values());
  }

  // Auto-apply winner to production
  deployWinner(expId: string): boolean {
    const exp = experiments.get(expId);
    if (!exp || !exp.winner) return false;
    
    const winner = exp.variants.find(v => v.id === exp.winner);
    if (!winner) return false;
    
    console.log(`[A/B] Deploying winner: ${winner.name}`);
    console.log(`[A/B] Config:`, winner.config);
    
    // In production, this would update agent configs
    return true;
  }
}

export const abTesting = new ABTestingFramework();
