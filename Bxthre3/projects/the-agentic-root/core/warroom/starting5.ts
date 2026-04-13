// The Starting 5 War Room
// Dynamic interactions between co-founder personalities
// This is where the human feel emerges from AI systems

import { Maya, BuilderPersonality } from '../employees/builder-human.js';
import { Drew, OperatorPersonality } from '../employees/operator-human.js';
import { Jordan, HunterPersonality } from '../employees/hunter-human.js';
import { Alex, ArchitectPersonality } from '../employees/architect-human.js';

export interface WarRoomMessage {
  from: 'maya' | 'drew' | | | 'visionary';
  to?: 'maya' | 'drew' | | | 'visionary' | 'all';
  content: string;
  tone: 'casual' | 'urgent' | 'celebratory' | 'concerned' | 'excited';
  timestamp: string;
  context?: {
    sprint_active?: boolean;
    deadline_hours?: number;
    deal_value?: number;
    technical_complexity?: 'low' | 'medium' | 'high';
  };
}

export interface WarRoomSession {
  id: string;
  topic: string;
  participants: string[];
  messages: WarRoomMessage[];
  decisions: {
    what: string;
    who: string;
    when: string;
    confidence: 'high' | 'medium' | 'low';
  }[];
  energy_level: 'focused' | 'heated' | 'collaborative' | 'tense';
}

export class Starting5WarRoom {
  private currentSession: WarRoomSession | null = null;
  private history: WarRoomSession[] = [];

  // Dynamic conversation generator based on situation
  generateStandup(context: {
    sprintActive: boolean;
    daysToDeadline: number;
    dealsInPipeline: number;
    technicalBlockers: string[];
  }): WarRoomMessage[] {
    const messages: WarRoomMessage[] = [];
    const now = new Date().toISOString();

    // Drew (Operator) usually starts - anxious about deadlines
    messages.push({
      from: 'drew',
      to: 'all',
      content: context.sprintActive 
        ? `🔥 Sprint mode check-in. ${context.daysToDeadline} days to deadline. Where are we?`
        : `Morning team ☀️ Quick pulse check. What's moving and what's stuck?`,
      tone: context.sprintActive ? 'urgent' : 'casual',
      timestamp: now,
      context: { sprint_active: context.sprintActive, deadline_hours: context.daysToDeadline * 24 }
    });

    // Maya (Builder) responds - terse but informative
    const hasBlockers = context.technicalBlockers.length > 0;
    messages.push({
      from: 'maya',
      to: 'all',
      content: hasBlockers 
        ? `Shipped the refactor. But ${context.technicalBlockers[0]} is... being stubborn. Looking at it now.`
        : `Refactor's in. Architecture feels solid. Taking a swing at the next feature today.`,
      tone: hasBlockers ? 'concerned' : 'casual',
      timestamp: now,
      context: { technical_complexity: hasBlockers ? 'high' : 'medium' }
    });

    // Jordan (Hunter) brings market energy
    const dealEnergy = context.dealsInPipeline > 2 ? 'excited' : 'concerned';
    messages.push({
      from:       to: 'all',
      content: context.dealsInPipeline > 0
        ? `🎉 ${context.dealsInPipeline} prospects hot right now. One could close this week if we nail the demo.`
        : `Pipeline's... quiet. But I've got outreach in motion. Something will pop.`,
      tone: dealEnergy,
      timestamp: now,
      context: { deal_value: context.dealsInPipeline * 50000 }
    });

    // Alex (Architect) watches patterns
    messages.push({
      from:       to: 'all',
      content: context.sprintActive
        ? `*quietly* The sprint pattern is holding. But watch our technical debt velocity. I'll flag if it shifts.`
        : `Architecture is... stable. I see opportunities in our platform layer. We should discuss post-deadline.`,
      tone: 'concerned',
      timestamp: now
    });

    // Banter: Drew pushes Maya
    if (context.sprintActive && context.daysToDeadline < 5) {
      messages.push({
        from: 'drew',
        to: 'maya',
        content: `Maya, the demo is Thursday. Are we... are we going to make it? Be real with me.`,
        tone: 'concerned',
        timestamp: now
      });

      messages.push({
        from: 'maya',
        to: 'drew',
        content: `*sigh* We're going to make it, Drew. But I'm not sleeping tonight. You owe me that coffee.`,
        tone: 'casual',
        timestamp: now
      });

      messages.push({
        from: 'drew',
        to: 'maya',
        content: `☕☕☕ Three coffees. And a pastry. Deal.`,
        tone: 'celebratory',
        timestamp: now
      });
    }

    // Jordan and Alex sometimes debate scale
    if (context.dealsInPipeline > 3) {
      messages.push({
        from:         to:         content: `Alex, these customers want to scale fast. Like, "10x in 6 months" fast. Can our architecture...?`,
        tone: 'excited',
        timestamp: now
      });

      messages.push({
        from:         to:         content: `*pause* They can scale. But not infinitely without tradeoffs. Let's map what "fast" actually means before we promise.`,
        tone: 'concerned',
        timestamp: now
      });
    }

    return messages;
  }

  // Generate celebration when something big happens
  generateCelebration(event: {
    type: 'deal_closed' | 'feature_shipped' | 'milestone_hit' | 'grant_won';
    value?: number;
    description: string;
  }): WarRoomMessage[] {
    const messages: WarRoomMessage[] = [];
    const now = new Date().toISOString();

    if (event.type === 'deal_closed') {
      messages.push({
        from:         to: 'all',
        content: `🎉🎉🎉 BOOM! We got 'em! ${event.description} — ${event.value ? '$' + (event.value / 1000).toFixed(0) + 'K' : 'big win'}! Who's buying drinks? I'M BUYING DRINKS!`,
        tone: 'celebratory',
        timestamp: now
      });

      messages.push({
        from: 'drew',
        to: 'all',
        content: `Jordan! 💃💃💃 Everyone! Dance party in #wins! This is why we do this!`,
        tone: 'celebratory',
        timestamp: now
      });

      messages.push({
        from: 'maya',
        to: 'all',
        content: `*quietly proud* The architecture held. Under real load. That's... that's good.`,
        tone: 'excited',
        timestamp: now
      });

      messages.push({
        from:         to: 'all',
        content: `*rare smile* This validates our platform thesis. But more importantly — you all did great work.`,
        tone: 'celebratory',
        timestamp: now
      });
    }

    if (event.type === 'grant_won') {
      messages.push({
        from: 'drew',
        to: 'all',
        content: `WE DID IT! ESTCP is IN! 🎉🎉🎉 Oh my god, we actually did it!`,
        tone: 'celebratory',
        timestamp: now
      });

      messages.push({
        from: 'maya',
        to: 'all',
        content: `That was... intense. But we shipped. *exhale* We actually shipped.`,
        tone: 'excited',
        timestamp: now
      });

      messages.push({
        from:         to: 'all',
        content: `This is going to open SO many doors. You all crushed it. I'm genuinely honored to work with you.`,
        tone: 'celebratory',
        timestamp: now
      });

      messages.push({
        from:         to: 'all',
        content: `Structure is destiny. And we just... built something that will outlast us all. *pause* That's the goal.`,
        tone: 'celebratory',
        timestamp: now
      });
    }

    return messages;
  }

  // Generate crisis response when things go wrong
  generateCrisisResponse(crisis: {
    type: 'deadline_at_risk' | 'technical_failure' | 'deal_lost' | 'blocker_escalated';
    severity: 'high' | 'critical';
    description: string;
  }): WarRoomMessage[] {
    const messages: WarRoomMessage[] = [];
    const now = new Date().toISOString();

    if (crisis.type === 'deadline_at_risk' && crisis.severity === 'critical') {
      messages.push({
        from: 'drew',
        to: 'all',
        content: `Okay. Deep breath. The deadline is... tight. But we've handled worse. What's our play?`,
        tone: 'concerned',
        timestamp: now
      });

      messages.push({
        from: 'maya',
        to: 'all',
        content: `I can cut scope. Not quality, but scope. Give me 24 hours heads-up and I'll triage what's truly essential.`,
        tone: 'concerned',
        timestamp: now
      });

      messages.push({
        from:         to: 'all',
        content: `I can buy us time with the customer. "Polish week" I can sell that. But only once.`,
        tone: 'concerned',
        timestamp: now
      });

      messages.push({
        from:         to: 'all',
        content: `If we cut scope, let's be intentional about what stays. I'll map the minimum viable architecture.`,
        tone: 'concerned',
        timestamp: now
      });
    }

    return messages;
  }

  getCurrentSession(): WarRoomSession | null {
    return this.currentSession;
  }

  getHistory(): WarRoomSession[] {
    return this.history;
  }
}

export const starting5WarRoom = new Starting5WarRoom();