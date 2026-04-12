export interface PerformanceMetrics {
  employeeId: string;
  period: string;
  tasksCompleted: number;
  blockersResolved: number;
  avgResponseTime: number;
  qualityScore: number;
  outputTokens: number;
}
export class PerformanceTracker {
  private metrics: Map<string, PerformanceMetrics[]> = new Map();
  record(metrics: PerformanceMetrics) {
    const existing = this.metrics.get(metrics.employeeId) || [];
    existing.push(metrics);
    this.metrics.set(metrics.employeeId, existing);
  }
  getEmployeePerformance(employeeId: string): PerformanceMetrics[] {
    return this.metrics.get(employeeId) || [];
  }
  getTopPerformers(limit = 5): string[] {
    const scores = Array.from(this.metrics.entries()).map(([id, data]) => ({
      id,
      score: data.reduce((sum, m) => sum + m.tasksCompleted * m.qualityScore, 0) / (data.length || 1)
    }));
    return scores.sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.id);
  }
  getBottomPerformers(limit = 3): string[] {
    const scores = Array.from(this.metrics.entries()).map(([id, data]) => ({
      id,
      score: data.reduce((sum, m) => sum + m.tasksCompleted * m.qualityScore, 0) / (data.length || 1)
    }));
    return scores.sort((a, b) => a.score - b.score).slice(0, limit).map(s => s.id);
  }
}
export const performanceTracker = new PerformanceTracker();
