export interface HiringRequest {
  department: string;
  role: string;
  skills: string[];
  urgency: 'low' | 'normal' | 'high' | 'critical';
  budgetApproved: number;
}
export class HiringRecruiter {
  private monthlySpend = 0;
  private monthlyBudget = 10000;
  canHire(cost: number): boolean {
    return this.monthlySpend + cost <= this.monthlyBudget;
  }
  calculateCost(role: string): { hiring: number; monthly: number } {
    const costs: Record<string, { hiring: number; monthly: number }> = {
      employee: { hiring: 500, monthly: 200 },
      specialist: { hiring: 1000, monthly: 400 },
      manager: { hiring: 2000, monthly: 800 }
    };
    return costs[role] || costs.employee;
  }
  processHiring(request: HiringRequest): { approved: boolean; reason?: string; cost?: number } {
    const cost = this.calculateCost(request.role);
    if (!this.canHire(cost.hiring)) {
      return { approved: false, reason: 'Budget exceeded' };
    }
    if (request.budgetApproved < cost.monthly) {
      return { approved: false, reason: 'Insufficient budget approval' };
    }
    this.monthlySpend += cost.hiring;
    return { approved: true, cost: cost.hiring };
  }
}
export const hiringRecruiter = new HiringRecruiter();
