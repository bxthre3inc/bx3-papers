// Simple employee API — serves real org.ts data
// No mocks, no fallbacks

import { org } from './core/hierarchy/org.js';

export function getEmployees() {
  return org.listAll().map(emp => ({
    id: emp.id,
    name: emp.name,
    role: emp.role,
    department: emp.department,
    skills: emp.skills,
    tools: emp.tools,
    status: emp.status,
    colleagues: emp.colleagues,
    supermemoryBucket: `${emp.id}-bxthre3`
  }));
}

export function getStartingFive() {
  const startingFiveIds = ['maya', 'drew', 'jordan', 'alex', 'vance'];
  return startingFiveIds
    .map(id => org.getEmployee(id))
    .filter(Boolean)
    .map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role === 'manager' ? 'Co-Founder' : 'Founders Assistant',
      department: emp.department,
      skills: emp.skills,
      tools: emp.tools,
      status: emp.status,
      archetype: getArchetype(emp.id),
      supermemoryBucket: `${emp.id}-bxthre3`
    }));
}

function getArchetype(id: string): string {
  const archetypes: Record<string, string> = {
    maya: 'Builder — Technical co-founder',
    drew: 'Operator — Execution co-founder', 
    jordan: 'Hunter — Revenue co-founder',
    alex: 'Architect — Strategy co-founder',
    vance: 'Visionary Assistant — Your second brain'
  };
  return archetypes[id] || 'Team Member';
}

export function getSupportStaff() {
  const supportIds = ['casey', 'iris', 'quinn', 'riley', 'taylor-emp', 'blake', 'sage', 'nico'];
  return supportIds
    .map(id => org.getEmployee(id))
    .filter(Boolean)
    .map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      skills: emp.skills,
      tools: emp.tools,
      status: emp.status,
      manager: org.getEmployee(emp.managerId || '')?.name || 'Unknown',
      supermemoryBucket: `${emp.id}-bxthre3`
    }));
}

// Export full org for API
export const employeeAPI = {
  getAll: getEmployees,
  getStartingFive,
  getSupportStaff,
  getById: (id: string) => {
    const emp = org.getEmployee(id);
    if (!emp) return null;
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      skills: emp.skills,
      tools: emp.tools,
      status: emp.status,
      colleagues: emp.colleagues,
      supermemoryBucket: `${emp.id}-bxthre3`,
      inboxPath: emp.inboxPath,
      outboxPath: emp.outboxPath,
      statusPath: emp.statusPath
    };
  }
};
