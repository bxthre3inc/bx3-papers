import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { Employee, Manager, Executive, OrgChart, EmployeeRole, Department } from './types';

const ORG_DIR = '/data/agentic/org';
const CHART_FILE = `${ORG_DIR}/chart.json`;

if (!existsSync(ORG_DIR)) mkdirSync(ORG_DIR, { recursive: true });

class Organization {
  private chart: OrgChart = {
    employees: new Map(),
    root: 'brodiblanco'
  };

  constructor() {
    this.initializeDefault();
    this.save();
  }

  private initializeDefault(): void {
    // Executive
    const brodiblanco: Executive = {
      id: 'brodiblanco',
      name: 'brodiblanco',
      role: 'executive',
      department: 'engineering',
      managerId: null,
      colleagues: [],
      shifts: ['continuous'],
      skills: ['strategy', 'vision', 'execution'],
      tools: ['zo', 'terminal', 'all'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/brodiblanco',
      outboxPath: '/data/agentic/outbox/brodiblanco',
      statusPath: '/data/agentic/status/brodiblanco',
      manages: ['engineering', 'operations', 'investor_relations']
    };
    this.chart.employees.set(brodiblanco.id, brodiblanco);

    // The Starting 5 — Complete Roster
    const maya: Manager = {
      id: 'maya',
      name: 'Maya Patel',
      role: 'manager',
      department: 'engineering',
      managerId: 'brodiblanco',
      colleagues: ['drew', ],
      shifts: ['morning', 'afternoon'],
      skills: ['architecture', 'systems', 'rust', 'ai'],
      tools: ['github', 'vscode', 'terminal', 'docker'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/maya',
      outboxPath: '/data/agentic/outbox/maya',
      statusPath: '/data/agentic/status/maya',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(maya.id, maya);

    const drew: Manager = {
      id: 'drew',
      name: 'Drew Morrison',
      role: 'manager',
      department: 'operations',
      managerId: 'brodiblanco',
      colleagues: ['maya', ],
      shifts: ['morning', 'afternoon'],
      skills: ['execution', 'process', 'logistics', 'hiring'],
      tools: ['notion', 'calendar', 'sheets'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/drew',
      outboxPath: '/data/agentic/outbox/drew',
      statusPath: '/data/agentic/status/drew',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(drew.id, drew);



    // Department Leads — Full R&D Studio Structure
    const taylor: Manager = {
      id: 'taylor',
      name: 'Taylor Reed',
      role: 'manager',
      department: 'research',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'casey', ],
      shifts: ['morning', 'afternoon'],
      skills: ['deep_research', 'technical_validation', 'academic_partnerships'],
      tools: ['arxiv', 'patent_db', 'jupyter', 'notion'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/taylor',
      outboxPath: '/data/agentic/outbox/taylor',
      statusPath: '/data/agentic/status/taylor',
      directReports: [],
      escalationClockHours: 48,
      peerHelpThreshold: 46,
      sprintModeActive: false
    };
    this.chart.employees.set(taylor.id, taylor);

    const casey: Manager = {
      id: 'casey',
      name: 'Casey Wu',
      role: 'manager',
      department: 'build',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'taylor', ],
      shifts: ['morning', 'afternoon', 'evening'],
      skills: ['rapid_prototyping', 'mvp_ship', 'technical_architecture'],
      tools: ['github', 'vscode', 'docker', 'aws', 'figma'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/casey',
      outboxPath: '/data/agentic/outbox/casey',
      statusPath: '/data/agentic/status/casey',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(casey.id, casey);









    // Vance — Founders Assistant (separate from Starting 5)
    const vance: Employee = {
      id: 'vance',
      name: 'Vance',
      role: 'employee',
      department: 'executive',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', ],
      shifts: ['continuous'],
      skills: ['pattern_learning', 'gap_detection', 'decision_mirroring', 'continuity'],
      tools: ['all', 'supermemory', 'event_bus'],
      status: 'monitoring',
      inboxPath: '/data/agentic/inbox/vance',
      outboxPath: '/data/agentic/outbox/vance',
      statusPath: '/data/agentic/status/vance'
    };
    this.chart.employees.set(vance.id, vance);

    // Support employees under Maya (Engineering)
    const caseyLin: Employee = {
      id:       name: 'Casey Lin',
      role: 'employee',
      department: 'engineering',
      managerId: 'maya',
      colleagues: [],
      shifts: ['morning'],
      skills: ['frontend', 'react', 'typescript'],
      tools: ['vscode', 'github', 'figma'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/casey-lin',
      outboxPath: '/data/agentic/outbox/casey-lin',
      statusPath: '/data/agentic/status/casey-lin'
    };
    this.chart.employees.set(caseyLin.id, caseyLin);

    const irisPark: Employee = {
      id:       name: 'Iris Park',
      role: 'employee',
      department: 'engineering',
      managerId: 'maya',
      colleagues: [],
      shifts: ['afternoon'],
      skills: ['backend', 'python', 'postgres', 'devops'],
      tools: ['vscode', 'github', 'docker', 'aws'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/iris-park',
      outboxPath: '/data/agentic/outbox/iris-park',
      statusPath: '/data/agentic/status/iris-park'
    };
    this.chart.employees.set(irisPark.id, irisPark);

    // Support employees under Drew (Operations)
    const quinnTaylor: Employee = {
      id:       name: 'Quinn Taylor',
      role: 'employee',
      department: 'operations',
      managerId: 'drew',
      colleagues: [],
      shifts: ['morning'],
      skills: ['finance', 'accounting', 'compliance'],
      tools: ['sheets', 'quickbooks', 'notion'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/quinn-taylor',
      outboxPath: '/data/agentic/outbox/quinn-taylor',
      statusPath: '/data/agentic/status/quinn-taylor'
    };
    this.chart.employees.set(quinnTaylor.id, quinnTaylor);

    const rileyKim: Employee = {
      id:       name: 'Riley Kim',
      role: 'employee',
      department: 'operations',
      managerId: 'drew',
      colleagues: [],
      shifts: ['afternoon'],
      skills: ['people_ops', 'recruiting', 'culture'],
      tools: ['greenhouse', 'notion', 'slack'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/riley-kim',
      outboxPath: '/data/agentic/outbox/riley-kim',
      statusPath: '/data/agentic/status/riley-kim'
    };
    this.chart.employees.set(rileyKim.id, rileyKim);

    // Support employees under Jordan (Revenue)
    const taylorBrooks: Employee = {
      id:       name: 'Taylor Brooks',
      role: 'employee',
      department: 'revenue',
      managerId:       colleagues: [],
      shifts: ['morning'],
      skills: ['outreach', 'demos', 'crm'],
      tools: ['salesforce', 'gmail', 'calendly'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/taylor-brooks',
      outboxPath: '/data/agentic/outbox/taylor-brooks',
      statusPath: '/data/agentic/status/taylor-brooks'
    };
    this.chart.employees.set(taylorBrooks.id, taylorBrooks);

    const blakeRivera: Employee = {
      id:       name: 'Blake Rivera',
      role: 'employee',
      department: 'revenue',
      managerId:       colleagues: [],
      shifts: ['afternoon'],
      skills: ['partnerships', 'bizdev', 'negotiation'],
      tools: ['gmail', 'sheets', 'slides'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/blake-rivera',
      outboxPath: '/data/agentic/outbox/blake-rivera',
      statusPath: '/data/agentic/status/blake-rivera'
    };
    this.chart.employees.set(blakeRivera.id, blakeRivera);

    // Support employees under Alex (Strategy)
    const sageWilliams: Employee = {
      id:       name: 'Sage Williams',
      role: 'employee',
      department: 'strategy',
      managerId:       colleagues: [],
      shifts: ['morning'],
      skills: ['research', 'analysis', 'writing'],
      tools: ['notion', 'chatgpt', 'sheets'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/sage-williams',
      outboxPath: '/data/agentic/outbox/sage-williams',
      statusPath: '/data/agentic/status/sage-williams'
    };
    this.chart.employees.set(sageWilliams.id, sageWilliams);

    const nicoAnderson: Employee = {
      id:       name: 'Nico Anderson',
      role: 'employee',
      department: 'strategy',
      managerId:       colleagues: [],
      shifts: ['afternoon'],
      skills: ['decks', 'narrative', 'investor_comms'],
      tools: ['slides', 'notion', 'figma'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/nico-anderson',
      outboxPath: '/data/agentic/outbox/nico-anderson',
      statusPath: '/data/agentic/status/nico-anderson'
    };
    this.chart.employees.set(nicoAnderson.id, nicoAnderson);
  }

  addEmployee(emp: Employee | Manager | Executive): void {
    this.chart.employees.set(emp.id, emp);
    this.save();
  }

  get(id: string): Employee | Manager | Executive | undefined {
    return this.chart.employees.get(id);
  }

  getManager(employeeId: string): Manager | undefined {
    const emp = this.chart.employees.get(employeeId);
    if (!emp) return undefined;
    if (emp.managerId) return this.chart.employees.get(emp.managerId) as Manager | undefined;
    return undefined;
  }

  getExecutive(): Executive | undefined {
    return this.chart.employees.get(this.chart.root) as Executive | undefined;
  }

  getAll(): (Employee | Manager | Executive)[] {
    return Array.from(this.chart.employees.values());
  }

  listAll(): (Employee | Manager | Executive)[] {
    return Array.from(this.chart.employees.values());
  }

  getDirectReports(managerId: string): Employee[] {
    const manager = this.chart.employees.get(managerId);
    if (!manager || manager.role !== 'manager') return [];
    return Array.from(this.chart.employees.values())
      .filter(e => e.managerId === managerId);
  }

  getTeammates(empId: string): string[] {
    const emp = this.chart.employees.get(empId);
    if (!emp) return [];
    return emp.colleagues;
  }

  private save(): void {
    const empObj: Record<string, any> = {};
    for (const [id, emp] of this.chart.employees) {
      empObj[id] = emp;
    }
    writeFileSync(CHART_FILE, JSON.stringify({ root: this.chart.root, employees: empObj }, null, 2));
  }
}

export const org = new Organization();

export type { Employee, Manager, Executive, EmployeeRole, Department } from './types';
