// Long-Term Goals & Direction System
// Cascades from company vision to daily tasks

export type GoalHorizon = 'vision' | '3year' | 'annual' | 'quarterly' | 'monthly' | 'weekly';
export type GoalStatus = 'on_track' | 'at_risk' | 'off_track' | 'blocked' | 'complete';

export interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  horizon: GoalHorizon;
  
  // Hierarchy
  parentId?: string;
  childrenIds: string[];
  
  // Ownership
  ownerId: string; // employee or department
  contributors: string[];
  
  // Metrics
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  
  // Timeline
  startDate: string;
  targetDate: string;
  milestones: Milestone[];
  
  // Status
  status: GoalStatus;
  lastUpdated: string;
  progressPercent: number;
  
  // Alignment
  alignedWith: string[]; // other goal IDs this supports
  conflictsWith: string[]; // other goals this might conflict
  
  // Drift detection
  driftAlertThreshold: number; // % deviation that triggers alert
  lastDriftCheck: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completedAt?: string;
  requiredForGoal: boolean;
}

export class StrategySystem {
  private goals = new Map<string, StrategicGoal>();
  private driftThreshold = 0.15; // 15% deviation triggers alert
  
  // Create goal cascade from vision
  createGoal(goal: Omit<StrategicGoal, 'childrenIds' | 'progressPercent' | 'status' | 'lastUpdated' | 'lastDriftCheck'>): StrategicGoal {
    const fullGoal: StrategicGoal = {
      ...goal,
      childrenIds: [],
      progressPercent: 0,
      status: 'on_track',
      lastUpdated: new Date().toISOString(),
      lastDriftCheck: new Date().toISOString()
    };
    
    this.goals.set(fullGoal.id, fullGoal);
    
    // Link to parent if exists
    if (fullGoal.parentId) {
      const parent = this.goals.get(fullGoal.parentId);
      if (parent) {
        parent.childrenIds.push(fullGoal.id);
      }
    }
    
    return fullGoal;
  }
  
  // Bxthre3 default goal cascade
  initializeBxthre3Goals(): void {
    // Vision level
    this.createGoal({
      id: 'vision-bxthre3',
      title: 'Build Bxthre3 into leading AI-native R&D holding company',
      description: 'Create category-defining companies in Infrastructure, Agronomics, Recycling, Robotics',
      horizon: 'vision',
      ownerId: 'brodiblanco',
      contributors: [],
      targetMetric: 'Combined portfolio valuation',
      currentValue: 5, // $5M current
      targetValue: 1000, // $1B target
      unit: '$M',
      startDate: '2026-01-01',
      targetDate: '2031-12-31',
      milestones: [],
      alignedWith: [],
      conflictsWith: [],
      driftAlertThreshold: 20
    });
    
    // 3-year: Irrig8 path to $100M
    this.createGoal({
      id: '3yr-irrig8',
      title: 'Irrig8 reaches $100M valuation with DoD contract',
      description: 'Secure ESTCP grant, prove ROI, scale to 500+ acres',
      horizon: '3year',
      parentId: 'vision-bxthre3',
      ownerId: 'maya',
      contributors: ['iris', 'drew', 'theo'],
      targetMetric: 'Irrig8 valuation',
      currentValue: 0,
      targetValue: 100,
      unit: '$M',
      startDate: '2026-01-01',
      targetDate: '2029-03-31',
      milestones: [
        { id: 'm1', title: 'ESTCP Grant Won', targetDate: '2026-04-30', requiredForGoal: true },
        { id: 'm2', title: '100 Acres Deployed', targetDate: '2026-09-30', requiredForGoal: true },
        { id: 'm3', title: 'Series A Closed', targetDate: '2027-06-30', requiredForGoal: true },
        { id: 'm4', title: '500 Acres + DoD Contract', targetDate: '2028-12-31', requiredForGoal: true }
      ],
      alignedWith: [],
      conflictsWith: [],
      driftAlertThreshold: 15
    });
    
    // Annual: 2026 objectives
    this.createGoal({
      id: 'annual-2026',
      title: '2026: Prove Product-Market Fit & Secure Non-Dilutive Funding',
      description: 'Win ESTCP, achieve 50% farmer retention, raise $2M seed',
      horizon: 'annual',
      parentId: '3yr-irrig8',
      ownerId: 'brodiblanco',
      contributors: ['casey', 'taylor', 'maya'],
      targetMetric: 'Non-dilutive funding + active acres',
      currentValue: 0,
      targetValue: 2500, // $2.5M estcp + $2M seed = 4500, using acres metric
      unit: 'composite',
      startDate: '2026-01-01',
      targetDate: '2026-12-31',
      milestones: [
        { id: 'q1-estcp', title: 'ESTCP Submitted & Under Review', targetDate: '2026-03-26', requiredForGoal: true },
        { id: 'q1-seed', title: 'Seed Term Sheet Signed', targetDate: '2026-04-30', requiredForGoal: false },
        { id: 'q2-deploy', title: '50 Acres Active', targetDate: '2026-06-30', requiredForGoal: true },
        { id: 'q3-retention', title: '75% Retention Rate', targetDate: '2026-09-30', requiredForGoal: true }
      ],
      alignedWith: ['ip-2026', 'starting5-2026'],
      conflictsWith: [],
      driftAlertThreshold: 10
    });
  }
  
  // Progress update with drift detection
  updateProgress(goalId: string, newValue: number, note?: string): { status: GoalStatus; driftDetected: boolean; actionRequired: string } {
    const goal = this.goals.get(goalId);
    if (!goal) {
      return { status: 'off_track', driftDetected: true, actionRequired: 'Goal not found' };
    }
    
    goal.currentValue = newValue;
    goal.lastUpdated = new Date().toISOString();
    
    // Calculate expected progress based on time elapsed
    const start = new Date(goal.startDate).getTime();
    const target = new Date(goal.targetDate).getTime();
    const now = Date.now();
    const timeElapsed = now - start;
    const totalDuration = target - start;
    const timePercent = timeElapsed / totalDuration;
    
    const valuePercent = (newValue - goal.currentValue) / (goal.targetValue - goal.currentValue);
    goal.progressPercent = Math.round(valuePercent * 100);
    
    // Drift detection
    const expectedProgress = timePercent * 100;
    const deviation = goal.progressPercent - expectedProgress;
    const driftDetected = Math.abs(deviation) > (goal.driftAlertThreshold * 100);
    
    // Determine status
    if (goal.progressPercent >= 100) {
      goal.status = 'complete';
    } else if (driftDetected && deviation < 0) {
      goal.status = 'at_risk';
    } else if (driftDetected && deviation > 0) {
      goal.status = 'on_track'; // Ahead of schedule
    } else {
      goal.status = 'on_track';
    }
    
    goal.lastDriftCheck = new Date().toISOString();
    
    return {
      status: goal.status,
      driftDetected,
      actionRequired: driftDetected 
        ? `${goal.title} is ${Math.abs(deviation).toFixed(1)}% ${deviation > 0 ? 'ahead' : 'behind'}. ${note || ''}`
        : 'On track'
    };
  }
  
  // Get cascade view (child goals)
  getCascade(goalId: string): StrategicGoal[] {
    const parent = this.goals.get(goalId);
    if (!parent) return [];
    
    return parent.childrenIds
      .map(id => this.goals.get(id))
      .filter((g): g is StrategicGoal => !!g);
  }
  
  // Dashboard for any employee
  getMyGoals(employeeId: string): StrategicGoal[] {
    return Array.from(this.goals.values())
      .filter(g => g.ownerId === employeeId || g.contributors.includes(employeeId));
  }
  
  // Executive dashboard
  getExecutiveDashboard(): {
    horizon: GoalHorizon;
    goals: StrategicGoal[];
    onTrack: number;
    atRisk: number;
    offTrack: number;
    blocked: number;
    criticalActions: string[];
  }[] {
    const horizons: GoalHorizon[] = ['vision', '3year', 'annual', 'quarterly', 'monthly'];
    
    return horizons.map(h => {
      const goals = Array.from(this.goals.values()).filter(g => g.horizon === h);
      
      return {
        horizon: h,
        goals,
        onTrack: goals.filter(g => g.status === 'on_track').length,
        atRisk: goals.filter(g => g.status === 'at_risk').length,
        offTrack: goals.filter(g => g.status === 'off_track').length,
        blocked: goals.filter(g => g.status === 'blocked').length,
        criticalActions: goals
          .filter(g => g.status === 'at_risk' || g.status === 'off_track')
          .map(g => `${g.title}: ${g.status}`)
      };
    });
  }
}

export const strategy = new StrategySystem();
