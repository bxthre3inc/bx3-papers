// Standup Protocol — Machine-to-Machine Communication

export interface StandupMessage {
  msgType: 'standup' | 'blocker' | 'request' | 'response';
  employeeId: string;
  timestamp: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
}

export interface StandupReport extends StandupMessage {
  msgType: 'standup';
  accomplishments: Accomplishment[];
  blockers: BlockerReport[];
  requests: Request[];
  outbox: OutgoingMessage[];
}

export interface Accomplishment {
  taskId: string;
  description: string;
  evidence: string[];
  complete: boolean;
}

export interface BlockerReport {
  id: string;
  employeeId: string;
  description: string;
  blockingSince: string;
  severity: 'p0' | 'p1' | 'p2' | 'p3';
  assignedManager: string;
  resolutionDeadline: string;
  peerHelpRequested: boolean;
  humanEscalationPending: boolean;
  attemptedResolutions: string[];
  neededFromOthers: string[];
}

export interface Request {
  to: string;
  action: string;
  deadline: string;
  context: Record<string, any>;
  priority: 'critical' | 'high' | 'normal' | 'low';
}

export interface OutgoingMessage {
  to: string;
  msgType: 'standup' | 'blocker' | 'request' | 'response';
  content: any;
}

export interface RequestResponse extends StandupMessage {
  msgType: 'response';
  inReplyTo: string;
  status: 'accepted' | 'declined' | 'partial';
  result?: any;
  reason?: string;
}

export interface Envelope {
  id: string;
  from: string;
  to: string;
  timestamp: string;
  payload: StandupReport | Request | RequestResponse;
  read: boolean;
}
