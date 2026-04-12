interface RateLimit {
  agentId: string;
  windowStart: number;
  requests: number;
  maxRequests: number;
  windowMs: number;
}

interface CostTracker {
  agentId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  timestamp: string;
}

const limits: Map<string, RateLimit> = new Map();
const costs: CostTracker[] = [];

export class RateLimiter {
  // Per-agent rate limits
  private defaultLimits: Record<string, { maxRequests: number; windowMs: number }> = {
    'default': { maxRequests: 100, windowMs: 60 * 60 * 1000 }, // 100/hour
    'executive': { maxRequests: 500, windowMs: 60 * 60 * 1000 }, // 500/hour
    'manager': { maxRequests: 200, windowMs: 60 * 60 * 1000 }, // 200/hour
    'employee': { maxRequests: 100, windowMs: 60 * 60 * 1000 } // 100/hour
  };

  checkLimit(agentId: string, role: string = 'employee'): { allowed: boolean; remaining: number; resetAt: number } {
    const config = this.defaultLimits[role] || this.defaultLimits.default;
    const now = Date.now();
    
    let limit = limits.get(agentId);
    
    // Reset window if expired
    if (limit && now > limit.windowStart + limit.windowMs) {
      limit = undefined;
    }
    
    if (!limit) {
      limit = {
        agentId,
        windowStart: now,
        requests: 0,
        maxRequests: config.maxRequests,
        windowMs: config.windowMs
      };
    }
    
    const allowed = limit.requests < limit.maxRequests;
    
    if (allowed) {
      limit.requests++;
      limits.set(agentId, limit);
    }
    
    return {
      allowed,
      remaining: Math.max(0, limit.maxRequests - limit.requests),
      resetAt: limit.windowStart + limit.windowMs
    };
  }

  // Cost tracking per agent
  trackCost(agentId: string, model: string, tokensIn: number, tokensOut: number): void {
    // Pricing per 1K tokens (approximate)
    const pricing: Record<string, { in: number; out: number }> = {
      'gpt-4': { in: 0.03, out: 0.06 },
      'gpt-3.5': { in: 0.0015, out: 0.002 },
      'claude': { in: 0.008, out: 0.024 },
      'local': { in: 0, out: 0 }
    };
    
    const rate = pricing[model] || pricing.gpt-3.5;
    const costUsd = (tokensIn / 1000 * rate.in) + (tokensOut / 1000 * rate.out);
    
    costs.push({
      agentId,
      model,
      tokensIn,
      tokensOut,
      costUsd,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    while (costs.length > 0 && new Date(costs[0].timestamp).getTime() < cutoff) {
      costs.shift();
    }
  }

  getAgentCost(agentId: string, days = 30): { totalUsd: number; totalTokens: number; breakdown: Record<string, number> } {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const agentCosts = costs.filter(c => 
      c.agentId === agentId && new Date(c.timestamp).getTime() > cutoff
    );
    
    return {
      totalUsd: agentCosts.reduce((sum, c) => sum + c.costUsd, 0),
      totalTokens: agentCosts.reduce((sum, c) => sum + c.tokensIn + c.tokensOut, 0),
      breakdown: agentCosts.reduce((acc, c) => {
        acc[c.model] = (acc[c.model] || 0) + c.costUsd;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  getTotalCost(days = 30): { totalUsd: number; byAgent: Record<string, number> } {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentCosts = costs.filter(c => new Date(c.timestamp).getTime() > cutoff);
    
    return {
      totalUsd: recentCosts.reduce((sum, c) => sum + c.costUsd, 0),
      byAgent: recentCosts.reduce((acc, c) => {
        acc[c.agentId] = (acc[c.agentId] || 0) + c.costUsd;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const rateLimiter = new RateLimiter();
