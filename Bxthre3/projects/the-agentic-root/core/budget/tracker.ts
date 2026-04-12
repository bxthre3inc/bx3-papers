export class BudgetTracker {
  private budgets = new Map();
  setBudget(category: string, amount: number) {
    this.budgets.set(category, { allocated: amount, spent: 0, remaining: amount });
  }
  spend(category: string, amount: number) {
    const b = this.budgets.get(category);
    if (b) { b.spent += amount; b.remaining -= amount; }
  }
  getStatus(): string {
    const total = Array.from(this.budgets.values()).reduce((s, b) => s + b.spent, 0);
    return `$${total} spent across ${this.budgets.size} categories`;
  }
}
export const budget = new BudgetTracker();
