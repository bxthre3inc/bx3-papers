export type EntityType = 'holding' | 'subsidiary' | 'project';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  parentId?: string;
  status: 'active' | 'wind_down' | 'divested';
  jurisdiction: string;
  taxId: string;
  employees: string[];
  createdAt: string;
}

export interface WorkContext {
  entityId: string;
  projectIds: string[];
  grantIds: string[];
  priority: 'subsidiary_first' | 'holding_first' | 'balanced';
}

export interface CrossEntityMetrics {
  totalEmployees: number;
  activeProjects: number;
  pendingGrants: number;
  sharedCosts: Record<string, number>;
}
