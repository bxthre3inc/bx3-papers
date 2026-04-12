// Standup Protocol — Message Routing & Storage
// Phase 3 of Agentic 3.0 Implementation

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { StandupReport, Request, RequestResponse, Envelope, BlockerReport } from './types';
import { org } from '../hierarchy/org';

const COMMS_DIR = '/home/.z/agentic/comms';
const INBOX_DIR = `${COMMS_DIR}/inbox`;
const OUTBOX_DIR = `${COMMS_DIR}/outbox`;
const STANDUP_DIR = `${COMMS_DIR}/standups`;

// Ensure directories exist
[COMMS_DIR, INBOX_DIR, OUTBOX_DIR, STANDUP_DIR].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

class MessageRouter {
  // Send a standup report (employee → manager)
  submitStandup(employeeId: string, report: StandupReport): void {
    const employee = org.get(employeeId);
    if (!employee) throw new Error(`Employee ${employeeId} not found`);
    
    // Save to standup archive
    const standupFile = `${STANDUP_DIR}/${employeeId}_${report.timestamp}.json`;
    writeFileSync(standupFile, JSON.stringify(report, null, 2));
    
    // Route to manager's inbox
    if (employee.managerId) {
      const envelope: Envelope = {
        id: `STANDUP-${Date.now()}`,
        from: employeeId,
        to: employee.managerId,
        timestamp: report.timestamp,
        payload: report,
        read: false
      };
      this.deliverToInbox(envelope);
    }
    
    // Route outbox messages to colleagues
    for (const msg of report.outbox) {
      const outEnvelope: Envelope = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        from: employeeId,
        to: msg.to,
        timestamp: report.timestamp,
        payload: msg.content,
        read: false
      };
      this.deliverToInbox(outEnvelope);
    }
    
    // Update employee last standup time
    const emp = org.get(employeeId);
    if (emp) {
      emp.lastStandupAt = report.timestamp;
    }
  }
  
  // Create a blocker report (triggers escalation clock)
  reportBlocker(employeeId: string, blocker: Omit<BlockerReport, 'id' | 'resolutionDeadline'>): BlockerReport {
    const employee = org.get(employeeId);
    if (!employee) throw new Error(`Employee ${employeeId} not found`);
    
    const manager = org.getManager(employeeId);
    if (!manager) throw new Error(`No manager found for ${employeeId}`);
    
    const now = new Date();
    const deadline = new Date(now.getTime() + manager.escalationClockHours * 60 * 60 * 1000);
    
    const fullBlocker: BlockerReport = {
      ...blocker,
      id: `BLOCKER-${Date.now()}`,
      assignedManager: manager.id,
      resolutionDeadline: deadline.toISOString(),
      peerHelpRequested: false,
      humanEscalationPending: false,
      attemptedResolutions: [],
      neededFromOthers: []
    };
    
    // Deliver to manager's inbox immediately
    const envelope: Envelope = {
      id: fullBlocker.id,
      from: employeeId,
      to: manager.id,
      timestamp: now.toISOString(),
      payload: { msgType: 'blocker', ...fullBlocker } as any,
      read: false
    };
    this.deliverToInbox(envelope);
    
    return fullBlocker;
  }
  
  // Send a request to a colleague
  sendRequest(from: string, request: Request): string {
    const envelope: Envelope = {
      id: `REQ-${Date.now()}`,
      from,
      to: request.to,
      timestamp: new Date().toISOString(),
      payload: { msgType: 'request', ...request } as any,
      read: false
    };
    this.deliverToInbox(envelope);
    return envelope.id;
  }
  
  // Respond to a request
  respondToRequest(from: string, requestId: string, response: Omit<RequestResponse, 'msgType' | 'inReplyTo' | 'timestamp'>): void {
    const envelope: Envelope = {
      id: `RESP-${Date.now()}`,
      from,
      to: this.getSenderOf(requestId) || 'unknown',
      timestamp: new Date().toISOString(),
      payload: {
        msgType: 'response',
        inReplyTo: requestId,
        ...response
      } as any,
      read: false
    };
    this.deliverToInbox(envelope);
  }
  
  // Internal: deliver to recipient's inbox
  private deliverToInbox(envelope: Envelope): void {
    const inboxPath = `${INBOX_DIR}/${envelope.to}`;
    if (!existsSync(inboxPath)) {
      mkdirSync(inboxPath, { recursive: true });
    }
    
    const fileName = `${envelope.timestamp}_${envelope.id}.json`;
    writeFileSync(`${inboxPath}/${fileName}`, JSON.stringify(envelope, null, 2));
  }
  
  // Get sender of a message (for replies)
  private getSenderOf(messageId: string): string | null {
    // Search all inboxes for this message
    const employees = org.listAll();
    for (const emp of employees) {
      const inboxPath = `${INBOX_DIR}/${emp.id}`;
      if (!existsSync(inboxPath)) continue;
      
      const files = readdirSync(inboxPath);
      for (const file of files) {
        if (file.includes(messageId)) {
          const data = JSON.parse(readFileSync(`${inboxPath}/${file}`, 'utf-8'));
          return data.from;
        }
      }
    }
    return null;
  }
  
  // Get unread messages for an employee
  getInbox(employeeId: string, unreadOnly = false): Envelope[] {
    const inboxPath = `${INBOX_DIR}/${employeeId}`;
    if (!existsSync(inboxPath)) return [];
    
    const files = readdirSync(inboxPath);
    const messages: Envelope[] = [];
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const data = JSON.parse(readFileSync(`${inboxPath}/${file}`, 'utf-8'));
      if (!unreadOnly || !data.read) {
        messages.push(data);
      }
    }
    
    return messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  // Mark messages as read
  markRead(employeeId: string, messageId?: string): void {
    const inboxPath = `${INBOX_DIR}/${employeeId}`;
    if (!existsSync(inboxPath)) return;
    
    const files = readdirSync(inboxPath);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const path = `${inboxPath}/${file}`;
      const data = JSON.parse(readFileSync(path, 'utf-8'));
      
      if (!messageId || data.id === messageId) {
        data.read = true;
        writeFileSync(path, JSON.stringify(data, null, 2));
        if (messageId) break;
      }
    }
  }
  
  // Get latest standup for an employee
  getLatestStandup(employeeId: string): StandupReport | null {
    const files = readdirSync(STANDUP_DIR)
      .filter(f => f.startsWith(`${employeeId}_`) && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) return null;
    
    return JSON.parse(readFileSync(`${STANDUP_DIR}/${files[0]}`, 'utf-8'));
  }
  
  // Get all standups for an employee (recent first)
  getStandupHistory(employeeId: string, limit = 10): StandupReport[] {
    const files = readdirSync(STANDUP_DIR)
      .filter(f => f.startsWith(`${employeeId}_`) && f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, limit);
    
    return files.map(f => 
      JSON.parse(readFileSync(`${STANDUP_DIR}/${f}`, 'utf-8'))
    );
  }
}

export const router = new MessageRouter();
