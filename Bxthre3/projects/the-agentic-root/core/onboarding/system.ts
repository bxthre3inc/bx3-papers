// Unified Onboarding — Humans + Agents
// Same process, different depth based on type

export type EmployeeType = 'human' | 'agentic';
export type RoleLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface OnboardingPlan {
  employeeId: string;
  name: string;
  type: EmployeeType;
  role: string;
  department: string;
  managerId: string;
  startDate: string;
  
  // Phase tracking
  phases: OnboardingPhase[];
  currentPhase: number;
  
  // Completion
  completedTasks: string[];
  requiredTasks: string[];
  
  // Checkpoints
  day1Check: boolean;
  week1Check: boolean;
  month1Check: boolean;
  
  // Status
  status: 'active' | 'complete' | 'extended' | 'at_risk';
}

export interface OnboardingPhase {
  name: string;
  duration: string; // "day1", "week1", "month1", "ongoing"
  tasks: OnboardingTask[];
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  requiredFor: EmployeeType[];
  autoCompletable: boolean;
  completedAt?: string;
  verifiedBy?: string;
}

export class OnboardingSystem {
  private plans = new Map<string, OnboardingPlan>();
  
  // Create onboarding plan based on employee type
  createPlan(employeeId: string, name: string, type: EmployeeType, role: string, department: string, managerId: string): OnboardingPlan {
    const plan: OnboardingPlan = {
      employeeId,
      name,
      type,
      role,
      department,
      managerId,
      startDate: new Date().toISOString(),
      phases: this.generatePhases(type, role),
      currentPhase: 0,
      completedTasks: [],
      requiredTasks: [],
      day1Check: false,
      week1Check: false,
      month1Check: false,
      status: 'active'
    };
    
    this.plans.set(employeeId, plan);
    return plan;
  }
  
  private generatePhases(type: EmployeeType, role: string): OnboardingPhase[] {
    const isAgent = type === 'agentic';
    
    return [
      {
        name: 'Day 1 — Foundation',
        duration: 'day1',
        tasks: [
          { id: 'welcome', title: 'Welcome & Introduction', description: 'Meet your manager and team', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'access', title: 'System Access Setup', description: 'Get credentials and permissions', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'handbook', title: 'Read Employee Handbook', description: 'Company values, policies, procedures', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'buddy', title: 'Assign Onboarding Buddy', description: 'Peer support for first month', requiredFor: ['human'], autoCompletable: false },
          { id: 'tools', title: 'Tool Training', description: 'Learn required tools and systems', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'first_task', title: 'Complete First Task', description: 'Small win to build confidence', requiredFor: ['human', 'agentic'], autoCompletable: false }
        ]
      },
      {
        name: 'Week 1 — Integration',
        duration: 'week1',
        tasks: [
          { id: 'team_meetings', title: 'Attend Team Meetings', description: 'Observe and participate', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'processes', title: 'Learn Team Processes', description: 'How work flows in your team', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'stakeholders', title: 'Meet Key Stakeholders', description: 'Cross-functional relationships', requiredFor: ['human'], autoCompletable: false },
          { id: 'project_brief', title: 'Current Project Briefing', description: 'Understand active work', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'goals', title: 'Set 30/60/90 Day Goals', description: 'Align with manager on expectations', requiredFor: ['human', 'agentic'], autoCompletable: isAgent }
        ]
      },
      {
        name: 'Month 1 — Autonomy',
        duration: 'month1',
        tasks: [
          { id: 'independent_work', title: 'Independent Work', description: 'Own tasks with minimal oversight', requiredFor: ['human', 'agentic'], autoCompletable: false },
          { id: 'feedback', title: 'First Feedback Session', description: 'Manager 1:1 on progress', requiredFor: ['human'], autoCompletable: false },
          { id: 'improvements', title: 'Suggest Improvements', description: 'Fresh eyes on processes', requiredFor: ['human', 'agentic'], autoCompletable: false },
          { id: 'knowledge_base', title: 'Contribute to Knowledge Base', description: 'Document learnings for next hire', requiredFor: ['human'], autoCompletable: false },
          { id: 'certification', title: 'Role Certification', description: 'Demonstrate competency', requiredFor: ['human', 'agentic'], autoCompletable: isAgent }
        ]
      },
      {
        name: 'Ongoing — Growth',
        duration: 'ongoing',
        tasks: [
          { id: 'continuous_learning', title: 'Continuous Learning', description: 'Stay current in domain', requiredFor: ['human', 'agentic'], autoCompletable: isAgent },
          { id: 'mentorship', title: 'Provide Mentorship', description: 'Help newer employees', requiredFor: ['human'], autoCompletable: false },
          { id: 'innovation', title: 'Innovation Projects', description: 'Contribute to company evolution', requiredFor: ['human', 'agentic'], autoCompletable: false }
        ]
      }
    ];
  }
  
  // Complete a task (human verifies, agents auto-complete if possible)
  completeTask(employeeId: string, taskId: string, verifiedBy?: string): boolean {
    const plan = this.plans.get(employeeId);
    if (!plan) return false;
    
    for (const phase of plan.phases) {
      const task = phase.tasks.find(t => t.id === taskId);
      if (task && plan.type === 'agentic' && task.autoCompletable) {
        task.completedAt = new Date().toISOString();
        plan.completedTasks.push(taskId);
        
        // Auto-advance phase if all tasks done
        this.checkPhaseAdvancement(plan);
        return true;
      } else if (task && verifiedBy) {
        task.completedAt = new Date().toISOString();
        task.verifiedBy = verifiedBy;
        plan.completedTasks.push(taskId);
        this.checkPhaseAdvancement(plan);
        return true;
      }
    }
    return false;
  }
  
  private checkPhaseAdvancement(plan: OnboardingPlan): void {
    const currentPhase = plan.phases[plan.currentPhase];
    const allDone = currentPhase.tasks
      .filter(t => t.requiredFor.includes(plan.type))
      .every(t => t.completedAt);
    
    if (allDone && plan.currentPhase < plan.phases.length - 1) {
      plan.currentPhase++;
      
      // Log milestone
      console.log(`🎉 ${plan.name} completed Phase ${plan.currentPhase}: ${currentPhase.name}`);
    }
  }
  
  // Get progress for dashboard
  getProgress(employeeId: string): { percent: number; currentPhase: string; nextTask: string; atRisk: boolean } | null {
    const plan = this.plans.get(employeeId);
    if (!plan) return null;
    
    const totalRequired = plan.phases.reduce((sum, p) => 
      sum + p.tasks.filter(t => t.requiredFor.includes(plan.type)).length, 0);
    const completed = plan.completedTasks.length;
    const percent = Math.round((completed / totalRequired) * 100);
    
    const currentPhase = plan.phases[plan.currentPhase];
    const nextIncomplete = currentPhase.tasks
      .filter(t => t.requiredFor.includes(plan.type))
      .find(t => !t.completedAt);
    
    // Check if at risk (stalled > 3 days in same phase)
    const atRisk = this.checkAtRisk(plan);
    
    return {
      percent,
      currentPhase: currentPhase.name,
      nextTask: nextIncomplete?.title || 'All tasks complete!',
      atRisk
    };
  }
  
  private checkAtRisk(plan: OnboardingPlan): boolean {
    const currentPhase = plan.phases[plan.currentPhase];
    const lastCompleted = currentPhase.tasks
      .filter(t => t.completedAt)
      .map(t => new Date(t.completedAt!))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    
    if (!lastCompleted) return false;
    
    const daysSince = (Date.now() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 3 && plan.currentPhase < plan.phases.length - 1;
  }
  
  // Manager dashboard view
  getManagerDashboard(managerId: string): { 
    totalOnboarding: number; 
    atRisk: string[]; 
    recentlyCompleted: string[] 
  } {
    const managed = Array.from(this.plans.values())
      .filter(p => p.managerId === managerId);
    
    return {
      totalOnboarding: managed.length,
      atRisk: managed.filter(p => this.checkAtRisk(p)).map(p => p.name),
      recentlyCompleted: managed
        .filter(p => p.currentPhase === p.phases.length - 1)
        .map(p => p.name)
    };
  }
}

export const onboarding = new OnboardingSystem();
