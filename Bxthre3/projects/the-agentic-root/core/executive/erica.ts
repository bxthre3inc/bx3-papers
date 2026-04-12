// Erica — Executive Agent
// Dedicated to brodiblanco's 2× daily executive briefings
// Not generic UAO — personalized, strategic, proactive

import { EventEmitter } from 'events';
import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory, userProfile } from '../memory/store';

export interface ExecutiveBriefing {
  id: string;
  type: 'morning' | 'evening';
  timestamp: string;
  summary: {
    criticalItems: number;
    decisionsMade: number;
    decisionsPending: number;
    blockers: number;
    opportunities: number;
  };
  sections: {
    warRoom: WarRoomUpdate;
    departments: DepartmentUpdate[];
    strategic: StrategicUpdate;
    calendar: CalendarPreview;
    personal: PersonalUpdate;
  };
  actions: RecommendedAction[];
  readingTime: number; // minutes
}

interface WarRoomUpdate {
  proposalsApproved: number;
  proposalsRejected: number;
  pendingVotes: number;
  consensusReached: string[];
}

interface DepartmentUpdate {
  name: string;
  status: 'green' | 'yellow' | 'red';
  highlights: string[];
  blockers: string[];
  metrics: { tasksCompleted: number; avgResponse: number };
}

interface StrategicUpdate {
  marketShifts: string[];
  competitorMoves: string[];
  opportunities: string[];
  risks: string[];
}

interface CalendarPreview {
  upcoming: { time: string; title: string; type: string }[];
  conflicts: string[];
  prepNeeded: string[];
}

interface PersonalUpdate {
  energyLevel: string;
  decisionLoad: 'light' | 'moderate' | 'heavy';
  focusAreas: string[];
  wellbeing: string;
}

interface RecommendedAction {
  priority: 'now' | 'today' | 'this_week';
  action: string;
  context: string;
  timeEstimate: string;
  impact: 'high' | 'medium' | 'low';
}

export class Erica extends EventEmitter {
  private briefingHistory: ExecutiveBriefing[] = [];
  private readonly MAX_HISTORY = 30; // 15 days of 2× daily

  constructor() {
    super();
    this.setupSchedule();
  }

  private setupSchedule(): void {
    // Schedule 7 AM briefing
    this.scheduleBriefing('morning', 7, 0);
    
    // Schedule 7 PM briefing
    this.scheduleBriefing('evening', 19, 0);

    // Listen for critical events that trigger immediate briefing
    eventBus.subscribe('erica', [BXTHRE3_EVENTS.BLOCKER_ESCALATED]);
  }

  private scheduleBriefing(type: 'morning' | 'evening', hour: number, minute: number): void {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const msUntil = target.getTime() - now.getTime();
    
    setTimeout(() => {
      this.generateBriefing(type);
      this.scheduleBriefing(type, hour, minute); // Reschedule for next day
    }, msUntil);
  }

  // Generate executive briefing
  async generateBriefing(type: 'morning' | 'evening'): Promise<ExecutiveBriefing> {
    const briefing: ExecutiveBriefing = {
      id: `ERIC-${Date.now()}`,
      type,
      timestamp: new Date().toISOString(),
      summary: {
        criticalItems: 0,
        decisionsMade: 0,
        decisionsPending: 0,
        blockers: 0,
        opportunities: 0
      },
      sections: {
        warRoom: await this.compileWarRoomUpdate(),
        departments: await this.compileDepartmentUpdates(),
        strategic: await this.compileStrategicUpdate(),
        calendar: await this.compileCalendarPreview(),
        personal: await this.compilePersonalUpdate()
      },
      actions: [],
      readingTime: 0
    };

    // Calculate summary
    briefing.summary.criticalItems = this.countCriticalItems(briefing.sections);
    briefing.summary.decisionsMade = briefing.sections.warRoom.proposalsApproved + 
                                     briefing.sections.warRoom.proposalsRejected;
    briefing.summary.decisionsPending = briefing.sections.warRoom.pendingVotes;
    briefing.summary.blockers = this.countBlockers(briefing.sections.departments);
    briefing.summary.opportunities = briefing.sections.strategic.opportunities.length;

    // Generate recommended actions
    briefing.actions = this.generateActions(briefing);

    // Calculate reading time (2 min base + 30s per section)
    briefing.readingTime = 2 + (Object.keys(briefing.sections).length * 0.5);

    // Store history
    this.briefingHistory.push(briefing);
    if (this.briefingHistory.length > this.MAX_HISTORY) {
      this.briefingHistory.shift();
    }

    // Publish
    this.emit('briefingReady', briefing);
    eventBus.publish(BXTHRE3_EVENTS.DAILY_DIGEST_READY, 'erica', {
      type: 'executive_briefing',
      subtype: type,
      briefingId: briefing.id,
      readingTime: briefing.readingTime,
      criticalItems: briefing.summary.criticalItems
    });

    return briefing;
  }

  private async compileWarRoomUpdate(): Promise<WarRoomUpdate> {
    // Pull from war room system
    const proposals = []; // Would query warRoom.list()
    
    return {
      proposalsApproved: 0,
      proposalsRejected: 0,
      pendingVotes: 0,
      consensusReached: []
    };
  }

  private async compileDepartmentUpdates(): Promise<DepartmentUpdate[]> {
    // Pull from department router
    return [
      { name: 'Sales & IR', status: 'green', highlights: [], blockers: [], metrics: { tasksCompleted: 0, avgResponse: 0 } },
      { name: 'Engineering', status: 'green', highlights: [], blockers: [], metrics: { tasksCompleted: 0, avgResponse: 0 } },
      { name: 'Strategy', status: 'green', highlights: [], blockers: [], metrics: { tasksCompleted: 0, avgResponse: 0 } }
    ];
  }

  private async compileStrategicUpdate(): Promise<StrategicUpdate> {
    // Pull from monitors, external intelligence
    const recentAlerts = []; // Would query monitors.getAlerts()
    
    return {
      marketShifts: [],
      competitorMoves: [],
      opportunities: [],
      risks: []
    };
  }

  private async compileCalendarPreview(): Promise<CalendarPreview> {
    // Pull from calendar integration
    return {
      upcoming: [],
      conflicts: [],
      prepNeeded: []
    };
  }

  private async compilePersonalUpdate(): Promise<PersonalUpdate> {
    // Personalized based on your patterns
    const profile = userProfile.get();
    const recentDecisions = this.countRecentDecisions();
    
    return {
      energyLevel: 'high',
      decisionLoad: recentDecisions > 10 ? 'heavy' : recentDecisions > 5 ? 'moderate' : 'light',
      focusAreas: profile.priorities.slice(0, 3),
      wellbeing: 'optimal'
    };
  }

  private countCriticalItems(sections: ExecutiveBriefing['sections']): number {
    let count = 0;
    count += sections.warRoom.pendingVotes;
    count += sections.departments.filter(d => d.status === 'red').length;
    count += sections.strategic.risks.length;
    return count;
  }

  private countBlockers(departments: DepartmentUpdate[]): number {
    return departments.reduce((sum, d) => sum + d.blockers.length, 0);
  }

  private generateActions(briefing: ExecutiveBriefing): RecommendedAction[] {
    const actions: RecommendedAction[] = [];

    // Priority actions based on briefing content
    if (briefing.summary.blockers > 0) {
      actions.push({
        priority: 'now',
        action: `Review ${briefing.summary.blockers} department blockers`,
        context: 'Agents need your input to proceed',
        timeEstimate: '10 min',
        impact: 'high'
      });
    }

    if (briefing.sections.warRoom.pendingVotes > 0) {
      actions.push({
        priority: 'today',
        action: `Cast votes on ${briefing.sections.warRoom.pendingVotes} WAR ROOM proposals`,
        context: 'Consensus pending your input',
        timeEstimate: '15 min',
        impact: 'high'
      });
    }

    // Add strategic actions
    if (briefing.sections.strategic.opportunities.length > 0) {
      actions.push({
        priority: 'this_week',
        action: `Evaluate ${briefing.sections.strategic.opportunities.length} strategic opportunities`,
        context: 'Market conditions favorable',
        timeEstimate: '30 min',
        impact: 'medium'
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { now: 0, today: 1, this_week: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private countRecentDecisions(): number {
    // Count decisions in last 24h
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    return this.briefingHistory.filter(b => 
      new Date(b.timestamp).getTime() > cutoff
    ).reduce((sum, b) => sum + b.summary.decisionsMade, 0);
  }

  // Emergency briefing for critical events
  private triggerEmergencyBriefing(alert: any): void {
    this.emit('emergencyBriefing', {
      timestamp: new Date().toISOString(),
      severity: alert.severity,
      source: alert.source,
      message: alert.message,
      immediateAction: 'Review and respond'
    });
  }

  // Get briefing history
  getHistory(limit: number = 10): ExecutiveBriefing[] {
    return this.briefingHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get latest briefing
  getLatest(): ExecutiveBriefing | null {
    return this.briefingHistory[this.briefingHistory.length - 1] || null;
  }

  // Request manual briefing
  async requestManualBriefing(): Promise<ExecutiveBriefing> {
    const hour = new Date().getHours();
    const type = hour < 12 ? 'morning' : 'evening';
    return this.generateBriefing(type);
  }
}

export const erica = new Erica();
