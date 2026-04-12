// Agentic Time Tracking
// Real-time ETAs based on employee performance history

import { memory } from '../memory/store.js';

interface TaskEstimate {
  taskId: string;
  taskType: string;
  estimatedMinutes: number;
  confidence: number; // 0-1 based on historical data
  similarTasks: number; // How many similar tasks completed
  avgActualTime: number; // Historical average for this task type
}

interface ActiveTask {
  taskId: string;
  employeeId: string;
  startedAt: string;
  estimatedCompletion: string;
  currentBlockers: string[];
  percentComplete: number;
}

class AgenticTimeTracker {
  private activeTasks: Map<string, ActiveTask> = new Map();
  
  // Get estimate based on this employee's history
  async estimateTask(employeeId: string, taskDescription: string, taskType: string): Promise<TaskEstimate> {
    // Query this employee's history for similar tasks
    const history = await memory.query({
      tags: ['task-completed', employeeId, taskType],
      limit: 20
    });
    
    const similarTasks = history.length;
    
    if (similarTasks === 0) {
      // No history — use baseline estimates
      return {
        taskId: `task-${Date.now()}`,
        taskType,
        estimatedMinutes: this.baselineEstimate(taskType),
        confidence: 0.3,
        similarTasks: 0,
        avgActualTime: 0
      };
    }
    
    // Calculate average from historical tasks
    const times = history.map(h => {
      try {
        const data = JSON.parse(h.node.content);
        return data.actualMinutes || 0;
      } catch { return 0; }
    }).filter(t => t > 0);
    
    const avgActualTime = times.reduce((a, b) => a + b, 0) / times.length;
    const estimatedMinutes = avgActualTime * this.complexityMultiplier(taskDescription);
    
    return {
      taskId: `task-${Date.now()}`,
      taskType,
      estimatedMinutes: Math.round(estimatedMinutes),
      confidence: Math.min(0.95, similarTasks / 20), // More data = higher confidence
      similarTasks,
      avgActualTime: Math.round(avgActualTime)
    };
  }
  
  // Start tracking a task
  startTask(taskId: string, employeeId: string, estimate: TaskEstimate): void {
    const estimatedCompletion = new Date(Date.now() + estimate.estimatedMinutes * 60 * 1000);
    
    this.activeTasks.set(taskId, {
      taskId,
      employeeId,
      startedAt: new Date().toISOString(),
      estimatedCompletion: estimatedCompletion.toISOString(),
      currentBlockers: [],
      percentComplete: 0
    });
    
    console.log(`[TIME] ${employeeId} started ${taskId}: ETA ${estimate.estimatedMinutes}min (confidence: ${Math.round(estimate.confidence * 100)}%)`);
  }
  
  // Update progress
  updateProgress(taskId: string, percentComplete: number, blockers: string[] = []): void {
    const task = this.activeTasks.get(taskId);
    if (!task) return;
    
    task.percentComplete = percentComplete;
    task.currentBlockers = blockers;
    
    // Recalculate ETA based on progress rate
    if (percentComplete > 0) {
      const elapsed = Date.now() - new Date(task.startedAt).getTime();
      const rate = percentComplete / elapsed; // % per ms
      const remainingPercent = 100 - percentComplete;
      const remainingMs = remainingPercent / rate;
      
      task.estimatedCompletion = new Date(Date.now() + remainingMs).toISOString();
    }
    
    if (blockers.length > 0) {
      console.log(`[TIME] ${taskId} blocked: ${blockers.join(', ')}`);
    }
  }
  
  // Complete task and record actual time
  completeTask(taskId: string, outcome: string): void {
    const task = this.activeTasks.get(taskId);
    if (!task) return;
    
    const actualMinutes = Math.round((Date.now() - new Date(task.startedAt).getTime()) / 60000);
    
    // Store for future estimates
    memory.add({
      id: `task-completed-${taskId}`,
      content: JSON.stringify({
        taskId,
        employeeId: task.employeeId,
        actualMinutes,
        outcome,
        hadBlockers: task.currentBlockers.length > 0
      }),
      type: 'task-completed',
      agent: task.employeeId,
      tags: ['task-completed', task.employeeId, 'performance-data'],
      timestamp: new Date().toISOString(),
      source: 'time-tracker'
    });
    
    this.activeTasks.delete(taskId);
    
    console.log(`[TIME] ${taskId} completed in ${actualMinutes}min (estimated vs actual recorded)`);
  }
  
  // Real-time dashboard data
  getAllETAs(): Array<{
    taskId: string;
    employeeId: string;
    percentComplete: number;
    estimatedCompletion: string;
    minutesRemaining: number;
    blockers: string[];
    atRisk: boolean; // ETA slipped >20%
  }> {
    return Array.from(this.activeTasks.values()).map(t => {
      const minutesRemaining = Math.round((new Date(t.estimatedCompletion).getTime() - Date.now()) / 60000);
      const originalEstimate = new Date(t.startedAt).getTime() + (minutesRemaining * 60000);
      const atRisk = new Date(t.estimatedCompletion).getTime() > originalEstimate * 1.2;
      
      return {
        taskId: t.taskId,
        employeeId: t.employeeId,
        percentComplete: t.percentComplete,
        estimatedCompletion: t.estimatedCompletion,
        minutesRemaining,
        blockers: t.currentBlockers,
        atRisk
      };
    });
  }
  
  private baselineEstimate(taskType: string): number {
    const baselines: Record<string, number> = {
      'code-review': 30,
      'bug-fix': 120,
      'feature': 480,
      'documentation': 60,
      'meeting': 30,
      'research': 180,
      'grant-writing': 240,
      'investor-pitch': 120,
      'default': 120
    };
    return baselines[taskType] || baselines.default;
  }
  
  private complexityMultiplier(description: string): number {
    // Adjust based on keywords indicating complexity
    let multiplier = 1.0;
    if (description.includes('refactor')) multiplier *= 1.5;
    if (description.includes('integration')) multiplier *= 1.4;
    if (description.includes('quick')) multiplier *= 0.7;
    if (description.includes('simple')) multiplier *= 0.8;
    if (description.includes('complex')) multiplier *= 1.6;
    return multiplier;
  }
}

export const timeTracker = new AgenticTimeTracker();