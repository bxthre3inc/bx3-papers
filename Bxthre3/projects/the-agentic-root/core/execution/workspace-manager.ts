// Multi-Tenant Workspace Manager
// Each project (Irrig8, VPC, etc.) gets own isolated workspace
// Shared services: Gmail, Calendar, Drive, Agentic core

export interface ProjectWorkspace {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  // Isolated per project
  tasks: string[];        // task IDs
  files: string[];         // file IDs  
  emails: string[];        // email thread IDs
  calendar: string[];      // event IDs
  employees: string[];     // employee IDs
  // Shared (read access)
  sharedTasks: string[];
  sharedFiles: string[];
  // Status
  activeEmployees: number;
  pendingTasks: number;
  lastActivity: string;
}

class WorkspaceManager {
  private workspaces: Map<string, ProjectWorkspace> = new Map();

  constructor() {
    this.initializeWorkspaces();
  }

  private initializeWorkspaces(): void {
    // Bxthre3 HQ — Shared services hub
    this.workspaces.set('bxthre3', {
      id: 'bxthre3',
      name: 'Bxthre3 Inc',
      slug: 'bxthre3',
      color: '#6366f1',
      icon: '🏢',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: ['brodiblanco', 'vance', 'maya', 'drew', 'jordan', 'alex'],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 6,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });

    // Irrig8 — Primary product
    this.workspaces.set('irrig8', {
      id: 'irrig8',
      name: 'Irrig8',
      slug: 'irrig8',
      color: '#22c55e',
      icon: '🌾',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: ['casey', 'iris', 'sage', 'nico'],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 4,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });

    // Valley Players Club — Gaming
    this.workspaces.set('vpc', {
      id: 'vpc',
      name: 'Valley Players Club',
      slug: 'vpc',
      color: '#f59e0b',
      icon: '🎰',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: [],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 0,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });

    // RAIN — Regulatory Intelligence
    this.workspaces.set('rain', {
      id: 'rain',
      name: 'RAIN',
      slug: 'rain',
      color: '#06b6d4',
      icon: '🌧️',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: [],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 0,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });

    // Starting5 — AI Co-Founders
    this.workspaces.set('starting5', {
      id: 'starting5',
      name: 'The Starting 5',
      slug: 'starting5',
      color: '#ec4899',
      icon: '⭐',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: ['maya', 'drew', 'jordan', 'alex'],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 4,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });

    // Android IDE — Mobile Development
    this.workspaces.set('android-ide', {
      id: 'android-ide',
      name: 'Android Native IDE',
      slug: 'android-ide',
      color: '#3b82f6',
      icon: '📱',
      tasks: [],
      files: [],
      emails: [],
      calendar: [],
      employees: [],
      sharedTasks: [],
      sharedFiles: [],
      activeEmployees: 0,
      pendingTasks: 0,
      lastActivity: new Date().toISOString()
    });
  }

  // Switch active workspace context
  switchTo(workspaceId: string): ProjectWorkspace | null {
    const ws = this.workspaces.get(workspaceId);
    if (ws) {
      ws.lastActivity = new Date().toISOString();
    }
    return ws || null;
  }

  // Get all workspaces for user
  getAll(): ProjectWorkspace[] {
    return Array.from(this.workspaces.values());
  }

  // Get workspace by ID
  get(id: string): ProjectWorkspace | null {
    return this.workspaces.get(id) || null;
  }

  // Share task/file between workspaces
  shareTo(sourceWs: string, targetWs: string, itemId: string, type: 'task' | 'file'): boolean {
    const source = this.workspaces.get(sourceWs);
    const target = this.workspaces.get(targetWs);
    
    if (!source || !target) return false;

    if (type === 'task') {
      source.tasks = source.tasks.filter(id => id !== itemId);
      target.sharedTasks.push(itemId);
    } else {
      source.files = source.files.filter(id => id !== itemId);
      target.sharedFiles.push(itemId);
    }
    
    source.lastActivity = new Date().toISOString();
    target.lastActivity = new Date().toISOString();
    
    return true;
  }

  // Get cross-workspace activity feed
  getActivityFeed(): { workspace: string; action: string; timestamp: string }[] {
    const activities: { workspace: string; action: string; timestamp: string }[] = [];
    
    for (const [id, ws] of this.workspaces) {
      if (ws.lastActivity) {
        activities.push({
          workspace: id,
          action: `Last activity ${ws.pendingTasks} pending tasks`,
          timestamp: ws.lastActivity
        });
      }
    }
    
    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  // Allocate employee to project
  allocateEmployee(employeeId: string, workspaceId: string): boolean {
    const ws = this.workspaces.get(workspaceId);
    if (!ws) return false;
    
    if (!ws.employees.includes(employeeId)) {
      ws.employees.push(employeeId);
      ws.activeEmployees = ws.employees.length;
      ws.lastActivity = new Date().toISOString();
    }
    return true;
  }
}

export const workspaceManager = new WorkspaceManager();
