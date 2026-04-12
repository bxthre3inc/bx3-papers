// Iris — IP & Patent Specialist Employee
// Migrated from native Zo agent 2026-03-19

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { ipPortfolio } from '../bxthre3/ip-portfolio';

export interface PatentWatch {
  id: string;
  title: string;
  assignee: string;
  status: string;
  relevance: 'high' | 'medium' | 'low';
  threat: boolean;
}

export class IrisEmployee {
  id = 'iris';
  name = 'Iris';
  role = 'IP & Patent Specialist';
  department = 'legal';
  
  private watchInterval: NodeJS.Timeout | null = null;
  private patentsMonitored: number = 0;
  private activeConflicts: number = 0;
  
  start(): void {
    console.log('[Iris] IP monitor active');
    
    // Daily check at 10:00 AM
    this.scheduleDailyCheck();
  }
  
  stop(): void {
    if (this.watchInterval) clearInterval(this.watchInterval);
  }
  
  private scheduleDailyCheck(): void {
    const check = () => {
      const now = new Date();
      if (now.getHours() === 10 && now.getMinutes() < 5) {
        this.runPatentWatch();
      }
    };
    this.watchInterval = setInterval(check, 60 * 1000);
  }
  
  runPatentWatch(): void {
    console.log(`[Iris] Patent watch: ${new Date().toISOString()}`);
    
    const ipStatus = ipPortfolio.getQuickStatus();
    
    // Check for critical deadlines
    const criticalDeadlines = ipStatus.criticalDeadlines.filter(
      d => d.daysToDeadline !== undefined && d.daysToDeadline <= 30
    );
    
    for (const deadline of criticalDeadlines) {
      memory.add({
        id: `iris-deadline-${deadline.id}`,
        type: 'patent-deadline',
        agent: this.id,
        content: `Patent deadline approaching: ${deadline.title} in ${deadline.daysToDeadline} days`,
        timestamp: new Date().toISOString(),
        tags: ['patent', 'deadline', 'iris']
      });
    }
    
    // Monitor trademark conflicts
    const conflicts = [
      'Irrig8 Inc (irrig8.io)',
      'Irrig8.app (soil intelligence)',
      'Skysense',
      'FarmSolutions/dronifi',
      'UK FARM SENSE UK00003992349'
    ];
    
    // Log watch
    memory.add({
      id: `iris-watch-${Date.now()}`,
      type: 'ip-watch',
      agent: this.id,
      content: `Patent watch: ${ipStatus.patentsPending} pending, ${ipStatus.provisionalExpiring} provisional expiring, ${conflicts.length} conflicts tracked`,
      timestamp: new Date().toISOString(),
      tags: ['ip', 'watch', 'iris']
    });
    
    // Update status
    this.patentsMonitored = ipStatus.totalPatents;
    this.activeConflicts = conflicts.length;
    this.updateStatusFile();
  }
  
  private updateStatusFile(): void {
    const fs = require('fs');
    
    const status = {
      patents_monitored_count: this.patentsMonitored,
      new_findings_today: 0,
      active_conflicts_count: this.activeConflicts,
      mood: 'neutral'
    };
    
    fs.writeFileSync(
      '/home/workspace/Bxthre3/agents/status/iris.json',
      JSON.stringify(status, null, 2)
    );
  }
  
  // Get quick status
  getQuickStatus(): { patentsMonitored: number; conflicts: number; status: string } {
    return {
      patentsMonitored: this.patentsMonitored,
      conflicts: this.activeConflicts,
      status: this.activeConflicts > 0 ? 'watch' : 'healthy'
    };
  }
}

export const iris = new IrisEmployee();
