import { writeFileSync, existsSync, mkdirSync } from 'fs';

const ORG_DIR = '/data/agentic/org';
const CHART_FILE = `${ORG_DIR}/chart.json`;

if (!existsSync(ORG_DIR)) mkdirSync(ORG_DIR, { recursive: true });

class Organization {
  constructor() {
    this.chart = { employees: new Map(), root: 'brodiblanco' };
    this._defaults = null;
  }

  _buildDefaults() {
    const employees = new Map();

    const make = (id, name, role, dept, managerId, status, skills, tools, colleagues, extra = {}) => ({
      id, name, role, department: dept, managerId,
      colleagues: colleagues || [], shifts: ['continuous'],
      skills: skills || [], tools: tools || ['all'],
      status, inboxPath: `/data/agentic/inbox/${id}`, outboxPath: `/data/agentic/outbox/${id}`, statusPath: `/data/agentic/status/${id}`,
      ...extra
    });

    // brodiblanco — CEO
    employees.set('brodiblanco', make('brodiblanco','Jeremy Beebe','executive','engineering',null,'working',['strategy','vision','execution'],['zo','terminal','all'],[]));

    // Executive layer
    employees.set('zoe', make('zoe','Zoe Patel','manager','executive','brodiblanco','working',['orchestration','strategy','agentic','leadership'],['zo','notion','gmail','calendar'],['atlas','vance','iris','maya']));
    employees.set('atlas', make('atlas','Atlas','manager','operations','brodiblanco','working',['operations','execution','coordination'],['zo','notion','calendar'],['zoe','vance','pulse','sentinel']));
    employees.set('vance', make('vance','Vance','employee','executive','brodiblanco','monitoring',['pattern_learning','gap_detection','decision_mirroring','continuity'],['all','supermemory','event_bus'],['zoe','atlas']));

    // Operations
    employees.set('pulse', make('pulse','Pulse','employee','operations','atlas','working',['people_ops','hr','workforce'],['zo','notion','gmail'],['sentinel','iris']));
    employees.set('sentinel', make('sentinel','Sentinel','employee','operations','atlas','monitoring',['monitoring','health_checks','alerting'],['zo','terminal','all'],['pulse','iris']));

    // Engineering
    employees.set('iris', make('iris','Iris Park','manager','engineering','zoe','working',['engineering_lead','architecture','product'],['zo','github','vscode','terminal'],['dev','sam','taylor','theo']));
    employees.set('dev', make('dev','Dev','employee','engineering','iris','working',['backend','python','node','postgres'],['github','vscode','docker'],['sam','taylor','theo']));
    employees.set('sam', make('sam','Sam','employee','engineering','iris','working',['data_analysis','analytics','sql'],['zo','sheets','looker'],['dev','taylor','theo']));
    employees.set('taylor', make('taylor','Taylor Reed','manager','engineering','iris','working',['security','appsec','platform'],['zo','vault','terminal'],['dev','sam','theo']));
    employees.set('theo', make('theo','Theo','employee','engineering','iris','idle',['devops','aws','infrastructure'],['zo','terraform','github'],['dev','sam','taylor']));

    // Marketing
    employees.set('casey', make('casey','Casey Wu','manager','marketing','brodiblanco','working',['marketing','brand','demand_gen'],['zo','gmail','calendar','slides'],['maya','raj','drew']));

    // Grants
    employees.set('maya', make('maya','Maya Patel','manager','grants','brodiblanco','working',['grant_strategy','sbir','fundraising','compliance'],['zo','notion','gmail'],['casey','raj','drew']));

    // Legal
    employees.set('raj', make('raj','Raj','manager','legal','brodiblanco','idle',['legal','compliance','contracts','regulatory'],['zo','clio','docusign'],['maya','casey','drew']));

    // Sales
    employees.set('drew', make('drew','Drew Morrison','manager','sales','brodiblanco','idle',['sales','partnerships','revenue','gtm'],['zo','crm','gmail','calendar'],['casey','maya','raj']));

    // Vertical agents
    employees.set('irrig8', make('irrig8','Irrig8 Field Agent','employee','operations','atlas','working',['irrigation','slv_operations','sensor_deployment','water_management'],['zo','terminal','sensors'],['pulse','sentinel']));
    employees.set('rain', make('rain','RAIN','employee','strategy','brodiblanco','working',['regulatory','water_rights','compliance','intelligence'],['zo','govtrack','gmail'],['maya','raj']));
    employees.set('vpc', make('vpc','VPC Agent','employee','operations','atlas','working',['gaming','sweepstakes','kyc','customer_ops'],['zo','gmail','calendar'],['drew','casey']));
    employees.set('trenchbabys', make('trenchbabys','Trenchbabys Agent','employee','sales','drew','idle',['retail','ecommerce','merchandise','events'],['zo','gmail','calendar'],['drew','casey']));

    return employees;
  }

  get _defaultEmployees() {
    if (!this._defaults) this._defaults = this._buildDefaults();
    return this._defaults;
  }

  addEmployee(emp) {
    this.chart.employees.set(emp.id, emp);
    this._save();
  }

  getEmployee(id) {
    return this.chart.employees.get(id) || this._defaultEmployees.get(id);
  }

  getDirectReports(managerId) {
    const out = [];
    const all = this._all();
    for (const e of all) { if (e.managerId === managerId) out.push(e); }
    return out;
  }

  _all() {
    const seen = new Set();
    const out = [];
    for (const [id, emp] of this.chart.employees) { seen.add(id); out.push(emp); }
    for (const [id, emp] of this._defaultEmployees) { if (!seen.has(id)) out.push(emp); }
    return out;
  }

  listAll() { return this._all(); }

  getTeammates(empId) {
    const emp = this.getEmployee(empId);
    return emp ? emp.colleagues : [];
  }

  _save() {
    const obj = {};
    for (const [id, emp] of this.chart.employees) obj[id] = emp;
    writeFileSync(CHART_FILE, JSON.stringify({ root: this.chart.root, employees: obj }, null, 2));
  }
}

export const org = new Organization();