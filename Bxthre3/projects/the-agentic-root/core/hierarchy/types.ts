// Employee Hierarchy — Types
// Phase 2 of Agentic 3.0 Implementation

export type EmployeeRole = 'employee' | 'manager' | 'executive';
export type Department = 'engineering' | 'operations' | 'investor_relations' | 'legal' | 'finance' | 'revenue' | 'strategy' | 'executive' | 'research' | 'product';
export type Shift = 'morning' | 'afternoon' | 'evening' | 'continuous';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  department: Department;
  managerId: string | null; // null for executives
  colleagues: string[]; // peer employee ids
  shifts: Shift[];
  
  // Capabilities
  skills: string[];
  tools: string[];
  
  // State
  status: 'idle' | 'working' | 'blocked' | 'off' | 'monitoring';
  currentTask?: string;
  lastStandupAt?: string;
  
  // Communication
  inboxPath: string;
  outboxPath: string;
  statusPath: string;
}

export interface Manager extends Employee {
  role: 'manager';
  directReports: string[]; // employee ids
  
  // Escalation settings
  escalationClockHours: number; // default: 24
  peerHelpThreshold: number; // hours before requesting peer help (default: 22)
  
  // Sprint mode
  sprintModeActive: boolean;
  sprintModeExpiresAt?: string;
}

export interface Executive extends Employee {
  role: 'executive';
  manages: Department[];
}

export interface OrgChart {
  employees: Map<string, Employee>;
  root: string; // executive id (brodiblanco)
}

// Blocker escalation state
export interface Blocker {
  id: string;
  employeeId: string;
  description: string;
  severity: 'p0' | 'p1' | 'p2' | 'p3';
  blockingSince: string;
  assignedManager: string;
  
  // Escalation clock
  resolutionDeadline: string; // T+24h
  peerHelpRequested: boolean;
  humanEscalationPending: boolean;
  
  // Resolution
  resolvedAt?: string;
  resolution?: string;
}
