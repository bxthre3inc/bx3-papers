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
      colleagues: ['drew', 'jordan', 'alex'],
      shifts: ['morning', 'afternoon'],
      skills: ['architecture', 'systems', 'rust', 'ai'],
      tools: ['github', 'vscode', 'terminal', 'docker'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/maya',
      outboxPath: '/data/agentic/outbox/maya',
      statusPath: '/data/agentic/status/maya',
      directReports: ['casey-lin', 'iris-park'],
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
      colleagues: ['maya', 'jordan', 'alex'],
      shifts: ['morning', 'afternoon'],
      skills: ['execution', 'process', 'logistics', 'hiring'],
      tools: ['notion', 'calendar', 'sheets'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/drew',
      outboxPath: '/data/agentic/outbox/drew',
      statusPath: '/data/agentic/status/drew',
      directReports: ['quinn-taylor', 'riley-kim'],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(drew.id, drew);

    const jordan: Manager = {
      id: 'jordan',
      name: 'Jordan Reyes',
      role: 'manager',
      department: 'revenue',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'alex'],
      shifts: ['morning', 'afternoon'],
      skills: ['sales', 'partnerships', 'negotiation', 'gtm'],
      tools: ['gmail', 'calendar', 'crm', 'slides'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/jordan',
      outboxPath: '/data/agentic/outbox/jordan',
      statusPath: '/data/agentic/status/jordan',
      directReports: ['taylor-brooks', 'blake-rivera'],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(jordan.id, jordan);

    const alex: Manager = {
      id: 'alex',
      name: 'Alex Chen',
      role: 'manager',
      department: 'strategy',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan'],
      shifts: ['morning', 'afternoon'],
      skills: ['strategy', 'research', 'systems', 'fundraising'],
      tools: ['notion', 'sheets', 'slides', 'chatgpt'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/alex',
      outboxPath: '/data/agentic/outbox/alex',
      statusPath: '/data/agentic/status/alex',
      directReports: ['sage-williams', 'nico-anderson'],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(alex.id, alex);

    // Department Leads — Full R&D Studio Structure
    const taylor: Manager = {
      id: 'taylor',
      name: 'Taylor Reed',
      role: 'manager',
      department: 'research',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'casey', 'quinn', 'riley', 'sage', 'nico', 'blake', 'ira', 'skye', 'cameron'],
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
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'quinn', 'riley', 'sage', 'nico', 'blake', 'ira', 'skye', 'cameron'],
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

    const quinn: Manager = {
      id: 'quinn',
      name: 'Quinn Martinez',
      role: 'manager',
      department: 'portfolio_ops',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'riley', 'sage', 'nico', 'blake', 'ira', 'skye', 'cameron'],
      shifts: ['morning', 'afternoon'],
      skills: ['shared_services', 'resource_allocation', 'subsidiary_coordination'],
      tools: ['sheets', 'notion', 'calendar', 'looker'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/quinn',
      outboxPath: '/data/agentic/outbox/quinn',
      statusPath: '/data/agentic/status/quinn',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(quinn.id, quinn);

    const riley: Manager = {
      id: 'riley',
      name: 'Riley Chen',
      role: 'manager',
      department: 'commercialization',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'sage', 'nico', 'blake', 'ira', 'skye', 'cameron'],
      shifts: ['morning', 'afternoon'],
      skills: ['gtm_strategy', 'customer_development', 'pivot_decisions'],
      tools: ['hubspot', 'mixpanel', 'slides', 'notion'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/riley',
      outboxPath: '/data/agentic/outbox/riley',
      statusPath: '/data/agentic/status/riley',
      directReports: [],
      escalationClockHours: 36,
      peerHelpThreshold: 34,
      sprintModeActive: false
    };
    this.chart.employees.set(riley.id, riley);

    const sage: Manager = {
      id: 'sage',
      name: 'Sage Okafor',
      role: 'manager',
      department: 'archive',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'nico', 'blake', 'ira', 'skye', 'cameron'],
      shifts: ['morning'],
      skills: ['knowledge_management', 'ip_documentation', 'technical_writing'],
      tools: ['notion', 'obsidian', 'github', 'loom'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/sage',
      outboxPath: '/data/agentic/outbox/sage',
      statusPath: '/data/agentic/status/sage',
      directReports: [],
      escalationClockHours: 48,
      peerHelpThreshold: 46,
      sprintModeActive: false
    };
    this.chart.employees.set(sage.id, sage);

    const nico: Manager = {
      id: 'nico',
      name: 'Nico Park',
      role: 'manager',
      department: 'finance',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'sage', 'blake', 'ira', 'skye', 'cameron'],
      shifts: ['morning', 'afternoon'],
      skills: ['financial_modeling', 'burn_analysis', 'fundraising_support'],
      tools: ['sheets', 'quickbooks', 'carta', 'notion'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/nico',
      outboxPath: '/data/agentic/outbox/nico',
      statusPath: '/data/agentic/status/nico',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(nico.id, nico);

    const blake: Manager = {
      id: 'blake',
      name: 'Blake Yamamoto',
      role: 'manager',
      department: 'legal',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'sage', 'nico', 'ira', 'skye', 'cameron'],
      shifts: ['morning'],
      skills: ['entity_formation', 'ip_protection', 'contract_review'],
      tools: ['clio', 'docusign', 'notion'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/blake',
      outboxPath: '/data/agentic/outbox/blake',
      statusPath: '/data/agentic/status/blake',
      directReports: [],
      escalationClockHours: 72,
      peerHelpThreshold: 70,
      sprintModeActive: false
    };
    this.chart.employees.set(blake.id, blake);

    const ira: Manager = {
      id: 'ira',
      name: 'Ira Bernstein',
      role: 'manager',
      department: 'investor_relations',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'sage', 'nico', 'blake', 'skye', 'cameron'],
      shifts: ['morning', 'afternoon'],
      skills: ['investor_comms', 'fundraising_pipeline', 'board_prep'],
      tools: ['crm', 'gmail', 'calendar', 'slides'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/ira',
      outboxPath: '/data/agentic/outbox/ira',
      statusPath: '/data/agentic/status/ira',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(ira.id, ira);

    const skye: Manager = {
      id: 'skye',
      name: 'Skye Nakamura',
      role: 'manager',
      department: 'intelligence',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'sage', 'nico', 'blake', 'ira', 'cameron'],
      shifts: ['continuous'],
      skills: ['competitive_intel', 'market_research', 'regulatory_monitoring'],
      tools: ['crunchbase', 'pitchbook', 'govtrack', 'perplexity'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/skye',
      outboxPath: '/data/agentic/outbox/skye',
      statusPath: '/data/agentic/status/skye',
      directReports: [],
      escalationClockHours: 24,
      peerHelpThreshold: 22,
      sprintModeActive: false
    };
    this.chart.employees.set(skye.id, skye);

    const cameron: Manager = {
      id: 'cameron',
      name: 'Cameron Foster',
      role: 'manager',
      department: 'infrastructure',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex', 'taylor', 'casey', 'quinn', 'riley', 'sage', 'nico', 'blake', 'ira', 'skye'],
      shifts: ['continuous'],
      skills: ['devops', 'security', 'platform_engineering'],
      tools: ['aws', 'terraform', 'datadog', 'github'],
      status: 'working',
      inboxPath: '/data/agentic/inbox/cameron',
      outboxPath: '/data/agentic/outbox/cameron',
      statusPath: '/data/agentic/status/cameron',
      directReports: [],
      escalationClockHours: 12,
      peerHelpThreshold: 10,
      sprintModeActive: false
    };
    this.chart.employees.set(cameron.id, cameron);

    // Vance — Founders Assistant (separate from Starting 5)
    const vance: Employee = {
      id: 'vance',
      name: 'Vance',
      role: 'employee',
      department: 'executive',
      managerId: 'brodiblanco',
      colleagues: ['maya', 'drew', 'jordan', 'alex'],
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
      id: 'casey-lin',
      name: 'Casey Lin',
      role: 'employee',
      department: 'engineering',
      managerId: 'maya',
      colleagues: ['iris-park'],
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
      id: 'iris-park',
      name: 'Iris Park',
      role: 'employee',
      department: 'engineering',
      managerId: 'maya',
      colleagues: ['casey-lin'],
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
      id: 'quinn-taylor',
      name: 'Quinn Taylor',
      role: 'employee',
      department: 'operations',
      managerId: 'drew',
      colleagues: ['riley-kim'],
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
      id: 'riley-kim',
      name: 'Riley Kim',
      role: 'employee',
      department: 'operations',
      managerId: 'drew',
      colleagues: ['quinn-taylor'],
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
      id: 'taylor-brooks',
      name: 'Taylor Brooks',
      role: 'employee',
      department: 'revenue',
      managerId: 'jordan',
      colleagues: ['blake-rivera'],
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
      id: 'blake-rivera',
      name: 'Blake Rivera',
      role: 'employee',
      department: 'revenue',
      managerId: 'jordan',
      colleagues: ['taylor-brooks'],
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
      id: 'sage-williams',
      name: 'Sage Williams',
      role: 'employee',
      department: 'strategy',
      managerId: 'alex',
      colleagues: ['nico-anderson'],
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
      id: 'nico-anderson',
      name: 'Nico Anderson',
      role: 'employee',
      department: 'strategy',
      managerId: 'alex',
      colleagues: ['sage-williams'],
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

  getEmployee(id: string): Employee | Manager | Executive | undefined {
    return this.chart.employees.get(id);
  }

  getDirectReports(managerId: string): Employee[] {
    const manager = this.chart.employees.get(managerId);
    if (!manager || manager.role !== 'manager') return [];
    return Array.from(this.chart.employees.values())
      .filter(e => e.managerId === managerId);
  }

  listAll(): (Employee | Manager | Executive)[] {
    return Array.from(this.chart.employees.values());
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
