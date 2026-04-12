import { rateLimiter } from '../security/rate-limiter';

interface CostBreakdown {
  daily: { date: string; costUsd: number; tokens: number }[];
  byAgent: Record<string, { costUsd: number; percentage: number }>;
  byModel: Record<string, { costUsd: number; tokens: number }>;
  projections: {
    monthEnd: number;
    quarterEnd: number;
    yearEnd: number;
  };
  alerts: string[];
}

interface BudgetAlert {
  type: 'warning' | 'critical';
  message: string;
  threshold: number;
  current: number;
}

const BUDGET_LIMITS = {
  daily: 100,    // $100/day
  monthly: 2000, // $2000/month
  perAgent: 50   // $50/agent/month
};

export class CostDashboard {
  getBreakdown(days = 30): CostBreakdown {
    const total = rateLimiter.getTotalCost(days);
    
    // Calculate daily breakdown
    const daily: CostBreakdown['daily'] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // Would aggregate by day from cost history
      daily.push({
        date: date.toISOString().split('T')[0],
        costUsd: 0, // Would calculate from history
        tokens: 0
      });
    }
    
    // Calculate percentages
    const byAgent: CostBreakdown['byAgent'] = {};
    for (const [agentId, cost] of Object.entries(total.byAgent)) {
      byAgent[agentId] = {
        costUsd: cost,
        percentage: total.totalUsd > 0 ? (cost / total.totalUsd) * 100 : 0
      };
    }
    
    // Projections
    const dailyAvg = total.totalUsd / days;
    const projections = {
      monthEnd: dailyAvg * 30,
      quarterEnd: dailyAvg * 90,
      yearEnd: dailyAvg * 365
    };
    
    // Check alerts
    const alerts = this.checkAlerts(total.totalUsd, dailyAvg, byAgent);
    
    return {
      daily: daily.reverse(),
      byAgent,
      byModel: {}, // Would populate from rateLimiter
      projections,
      alerts
    };
  }

  private checkAlerts(
    totalCost: number,
    dailyAvg: number,
    byAgent: Record<string, { costUsd: number }>
  ): string[] {
    const alerts: string[] = [];
    
    // Daily budget check
    if (dailyAvg > BUDGET_LIMITS.daily) {
      alerts.push(`DAILY BUDGET EXCEEDED: $${dailyAvg.toFixed(2)} vs $${BUDGET_LIMITS.daily} limit`);
    } else if (dailyAvg > BUDGET_LIMITS.daily * 0.8) {
      alerts.push(`DAILY BUDGET WARNING: $${dailyAvg.toFixed(2)} approaching $${BUDGET_LIMITS.daily} limit`);
    }
    
    // Per-agent check
    for (const [agentId, data] of Object.entries(byAgent)) {
      if (data.costUsd > BUDGET_LIMITS.perAgent) {
        alerts.push(`AGENT BUDGET: ${agentId} exceeded $${BUDGET_LIMITS.perAgent} monthly limit`);
      }
    }
    
    return alerts;
  }

  generateReport(days = 30): string {
    const data = this.getBreakdown(days);
    
    let report = `\n📊 COST ANALYTICS (${days} days)\n`;
    report += `=${'='.repeat(40)}\n\n`;
    
    // Total
    const totalCost = Object.values(data.byAgent).reduce((sum, a) => sum + a.costUsd, 0);
    report += `💰 Total Cost: $${totalCost.toFixed(2)}\n`;
    report += `📈 Projected Monthly: $${data.projections.monthEnd.toFixed(2)}\n\n`;
    
    // Top spenders
    report += `🏆 Top Agent Costs:\n`;
    const sorted = Object.entries(data.byAgent)
      .sort((a, b) => b[1].costUsd - a[1].costUsd)
      .slice(0, 5);
    
    for (const [agent, data] of sorted) {
      report += `  • ${agent}: $${data.costUsd.toFixed(2)} (${data.percentage.toFixed(1)}%)\n`;
    }
    
    // Alerts
    if (data.alerts.length > 0) {
      report += `\n⚠️ ALERTS:\n`;
      for (const alert of data.alerts) {
        report += `  ${alert}\n`;
      }
    }
    
    return report;
  }

  // Budget recommendations
  getRecommendations(): string[] {
    const data = this.getBreakdown(30);
    const recommendations: string[] = [];
    
    // Find high-cost agents
    const expensive = Object.entries(data.byAgent)
      .filter(([_, d]) => d.costUsd > BUDGET_LIMITS.perAgent * 0.8)
      .map(([id]) => id);
    
    if (expensive.length > 0) {
      recommendations.push(`Review agent efficiency: ${expensive.join(', ')} approaching budget limits`);
    }
    
    // Model optimization
    recommendations.push('Consider using GPT-3.5 for non-critical tasks to reduce costs');
    
    // Caching
    recommendations.push('Enable response caching for repeated queries');
    
    return recommendations;
  }
}

export const costDashboard = new CostDashboard();
