// 7-Day Autonomy Mode
// Company runs 1 week without founder input

import { eventBus, BXTHRE3_EVENTS } from '../events/bus.js';
import { memory } from '../memory/store.js';

class SevenDayAutonomy {
  private active = false;
  
  // Delegation thresholds (pre-approved)
  private spendingLimits = {
    maya: 500,      // $500 engineering tools/services
    drew: 1000,     // $1K ops/legal admin
    jordan: 2000,   // $2K sales/travel
    alex: 500       // $500 research/tools
  };
  
  // Decision trees (pre-approved scenarios)
  private autoDecisions = [
    {
      scenario: 'Grant deadline within 48h',
      action: 'Auto-activate sprint mode',
      notify: 'founder_on_complete'
    },
    {
      scenario: 'Security vulnerability detected',
      action: 'Auto-patch if <4h fix, else escalate',
      notify: 'immediate'
    },
    {
      scenario: 'Investor asks for meeting',
      action: 'Auto-schedule via Calendly link',
      notify: 'daily_digest'
    },
    {
      scenario: 'Vendor invoice <$500',
      action: 'Auto-pay if budget available',
      notify: 'weekly_summary'
    },
    {
      scenario: 'Feature request from pilot customer',
      action: 'Queue for next sprint, notify customer',
      notify: 'daily_digest'
    }
  ];

  activate(): void {
    this.active = true;
    console.log('[AUTONOMY] 7-day mode activated');
    console.log('[AUTONOMY] Pre-approved spending:', this.spendingLimits);
    console.log('[AUTONOMY] Auto-decision scenarios:', this.autoDecisions.length);
    
    // Notify all employees
    eventBus.publish(BXTHRE3_EVENTS.AUTONOMY_ACTIVATED, 'autonomy', {
      duration: '7 days',
      spendingLimits: this.spendingLimits,
      autoDecisions: this.autoDecisions
    }, 'high');
    
    // Start daily check-ins (instead of immediate escalations)
    this.startDailyCheckIns();
  }
  
  private startDailyCheckIns(): void {
    // Every 24h: summary to founder, not individual escalations
    setInterval(() => {
      const summary = this.generateDailySummary();
      eventBus.publish(BXTHRE3_EVENTS.DAILY_AUTONOMY_SUMMARY, 'autonomy', summary, 'normal');
    }, 24 * 60 * 60 * 1000);
  }
  
  private generateDailySummary(): {
    decisionsMade: number;
    spendAuthorized: number;
    escalationsDeferred: number;
    founderAttentionRequired: string[];
  } {
    return {
      decisionsMade: 0, // Would track actual decisions
      spendAuthorized: 0,
      escalationsDeferred: 0,
      founderAttentionRequired: []
    };
  }
  
  canSpend(employee: string, amount: number): boolean {
    const limit = this.spendingLimits[employee as keyof typeof this.spendingLimits] || 0;
    return this.active && amount <= limit;
  }
  
  shouldEscalate(issue: string): boolean {
    if (!this.active) return true; // Normal mode: escalate everything
    
    // Check if scenario matches auto-decision
    const auto = this.autoDecisions.find(d => issue.includes(d.scenario));
    if (auto) {
      console.log(`[AUTONOMY] Auto-handling: ${auto.action}`);
      return false; // Don't escalate, handle automatically
    }
    
    // True escalations only for:
    // - Strategic pivots
    // - Legal risk
    // - Founder relationships (key investors, partners)
    // - Budget overruns >$1000
    const trueEscalations = [
      'pivot',
      'lawsuit',
      'key investor',
      'co-founder conflict',
      'budget overrun 1000'
    ];
    
    return trueEscalations.some(e => issue.toLowerCase().includes(e));
  }
  
  getStatus(): {
    active: boolean;
    daysRemaining: number;
    spendingUsed: Record<string, number>;
    decisionsMadeToday: number;
  } {
    return {
      active: this.active,
      daysRemaining: this.active ? 7 : 0,
      spendingUsed: {}, // Track actual spend
      decisionsMadeToday: 0
    };
  }
}

export const sevenDayAutonomy = new SevenDayAutonomy();