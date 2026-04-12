export interface Decision {
  id: string;
  agent: string;
  timestamp: string;
  decision: string;
  options: string[];
  chosen: string;
  reasoning: string;
  confidence: number;
  alternativesConsidered: string[];
  wouldChangeIf: string;
}

export class DecisionAuditor {
  private log: Decision[] = [];

  record(agentId: string, decision: string, options: string[], chosen: string, reasoning: string): Decision {
    const entry: Decision = {
      id: `dec-${Date.now()}`,
      agent: agentId,
      timestamp: new Date().toISOString(),
      decision,
      options,
      chosen,
      reasoning,
      confidence: this.calculateConfidence(reasoning),
      alternativesConsidered: options.filter(o => o !== chosen),
      wouldChangeIf: this.extractConditions(reasoning)
    };
    this.log.push(entry);
    return entry;
  }

  private calculateConfidence(reasoning: string): number {
    const indicators = ['certain', 'clear', 'definite', 'confident'];
    const doubts = ['uncertain', 'maybe', 'possibly', 'unclear'];
    const score = indicators.filter(i => reasoning.toLowerCase().includes(i)).length -
                  doubts.filter(d => reasoning.toLowerCase().includes(d)).length;
    return Math.max(0.5, Math.min(1.0, 0.7 + score * 0.1));
  }

  private extractConditions(reasoning: string): string {
    const match = reasoning.match(/if\s+(.+?)(?:,|\.|$)/i);
    return match ? match[1] : 'No specific conditions identified';
  }

  explain(decisionId: string): string {
    const d = this.log.find(x => x.id === decisionId);
    if (!d) return 'Decision not found';
    return `${d.agent} chose "${d.chosen}" with ${Math.round(d.confidence * 100)}% confidence.\n` +
           `Reasoning: ${d.reasoning}\n` +
           `Would change if: ${d.wouldChangeIf}`;
  }

  reviewAgentDecisions(agentId: string): string {
    const decisions = this.log.filter(d => d.agent === agentId);
    const avgConfidence = decisions.reduce((s, d) => s + d.confidence, 0) / decisions.length;
    return `${agentId} made ${decisions.length} decisions with ${Math.round(avgConfidence * 100)}% average confidence.`;
  }
}

export const auditor = new DecisionAuditor();
