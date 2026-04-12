// Event Bus — Publish/Subscribe System

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs';

const EVENTS_DIR = '/data/agentic/events';

export interface Event {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'critical';
  processed: boolean;
  subscribers: string[];
}

export class EventBus {
  subscribe(agentId: string, eventTypes: string[] | string, callback?: (payload: any) => void): void {
    const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    console.log(`[EVENTS] ${agentId} subscribed to ${types.join(', ')}`);
    // In production: store callback and invoke when matching events published
  }

  publish(type: string, source: string, payload: Record<string, unknown>, priority: Event['priority'] = 'normal'): Event {
    const event: Event = {
      id: `evt-${Date.now()}`,
      type,
      source,
      timestamp: new Date().toISOString(),
      payload,
      priority,
      processed: false,
      subscribers: []
    };

    if (!existsSync(EVENTS_DIR)) mkdirSync(EVENTS_DIR, { recursive: true });
    writeFileSync(`${EVENTS_DIR}/${event.id}.json`, JSON.stringify(event, null, 2));

    return event;
  }

  getEventsForAgent(agentId: string): Event[] {
    return [];
  }
}

export const eventBus = new EventBus();

export const BXTHRE3_EVENTS = {
  // Grant events
  GRANT_DEADLINE: 'grant.deadline',
  GRANT_SUBMITTED: 'grant.submitted',
  GRANT_UPDATED: 'grant.updated',
  GRANT_AWARDED: 'grant.awarded',
  
  // IP events
  IP_CONFLICT: 'ip.conflict',
  IP_FILED: 'ip.filed',
  
  // Funding events
  FUNDING_MILESTONE: 'funding.milestone',
  
  // Sprint events
  SPRINT_DECLARED: 'sprint.declared',
  SPRINT_ACTIVATED: 'sprint.activated',
  SPRINT_AUTO_ACTIVATED: 'sprint.auto_activated',
  
  // Blocker events
  BLOCKER_ESCALATED: 'blocker.escalated',
  
  // Agent lifecycle
  AGENT_OFFBOARDED: 'agent.offboarded',
  
  // Digest
  DAILY_DIGEST_READY: 'digest.ready',
  
  // Build events
  BUILD_SHIPPED: 'build.shipped',
  
  // Deal events
  DEAL_CLOSED: 'deal.closed',
  
  // Grant deadline urgency
  GRANT_DEADLINE_URGENT: 'grant.deadline_urgent'
} as const;

// Type alias for event types
export type EventTypes = typeof BXTHRE3_EVENTS[keyof typeof BXTHRE3_EVENTS];
