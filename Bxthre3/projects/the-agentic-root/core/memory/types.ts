export interface MemoryNode {
  id: string;
  content: string;
  type: string;
  timestamp: string;
  agent: string;
  tags?: string[];
  source?: string;
  confidence?: number;
  relationships?: string[];
}

export interface MemoryEdge {
  id?: string;
  from: string;
  to: string;
  type: 'updates' | 'extends' | 'derives' | 'contradicts';
  timestamp: string;
}

export interface MemoryQuery {
  query: string;
  limit?: number;
  tags?: string[];
  since?: string;
  agents?: string[];
}

export interface MemoryGraph {
  nodes: Map<string, MemoryNode>;
  edges: Map<string, MemoryEdge>;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  preferences: Record<string, string>;
  timezone: string;
}

export interface QueryResult {
  node: MemoryNode;
  relevance: number;
  path: string[];
}
