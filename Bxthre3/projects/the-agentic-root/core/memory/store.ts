// Supermemory Foundation — Storage Layer
// Phase 1 of Agentic 3.0 Implementation

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { MemoryNode, MemoryEdge, MemoryGraph, QueryResult } from './types';

const MEMORY_DIR = '/home/.z/agentic/memory';
const NODES_FILE = `${MEMORY_DIR}/nodes.json`;
const EDGES_FILE = `${MEMORY_DIR}/edges.json`;
const PROFILE_FILE = `${MEMORY_DIR}/profile.json`;

// Ensure directory exists
if (!existsSync(MEMORY_DIR)) {
  mkdirSync(MEMORY_DIR, { recursive: true });
}

class MemoryStore {
  private graph: MemoryGraph = {
    nodes: new Map(),
    edges: new Map()
  };
  private dirty = false;

  constructor() {
    this.load();
  }

  // Load from disk
  private load(): void {
    try {
      if (existsSync(NODES_FILE)) {
        const nodesData = JSON.parse(readFileSync(NODES_FILE, 'utf-8'));
        for (const [id, node] of Object.entries(nodesData)) {
          this.graph.nodes.set(id, node as MemoryNode);
        }
      }
      if (existsSync(EDGES_FILE)) {
        const edgesData = JSON.parse(readFileSync(EDGES_FILE, 'utf-8'));
        for (const [id, edge] of Object.entries(edgesData)) {
          this.graph.edges.set(id, edge as MemoryEdge);
        }
      }
    } catch (err) {
      console.error('Failed to load memory:', err);
    }
  }

  // Save to disk
  private save(): void {
    if (!this.dirty) return;
    
    const nodesObj: Record<string, MemoryNode> = {};
    const edgesObj: Record<string, MemoryEdge> = {};
    
    for (const [id, node] of this.graph.nodes) {
      nodesObj[id] = node;
    }
    for (const [id, edge] of this.graph.edges) {
      edgesObj[id] = edge;
    }
    
    writeFileSync(NODES_FILE, JSON.stringify(nodesObj, null, 2));
    writeFileSync(EDGES_FILE, JSON.stringify(edgesObj, null, 2));
    this.dirty = false;
  }

  // Add or update a memory node
  add(node: MemoryNode): void {
    this.graph.nodes.set(node.id, node);
    this.dirty = true;
    this.save();
  }

  // Create relationship between memories
  connect(edge: MemoryEdge): void {
    this.graph.edges.set(edge.id, edge);
    this.dirty = true;
    this.save();
  }

  // Simple keyword search (placeholder for embedding similarity)
  // Supports both: query(['keyword1', 'keyword2'], 10) and query({ tags: ['tag1'], limit: 50 })
  query(keywords: string[] | { tags?: string[]; limit?: number }, limit = 10): QueryResult[] {
    let keywordSet: Set<string>;
    let resultLimit: number;
    
    if (Array.isArray(keywords)) {
      keywordSet = new Set(keywords.map(k => k.toLowerCase()));
      resultLimit = limit;
    } else {
      // Object format - use tags as keywords if provided
      const tags = keywords.tags || [];
      keywordSet = new Set(tags.map(t => t.toLowerCase()));
      resultLimit = keywords.limit || limit;
    }
    
    const results: QueryResult[] = [];
    
    for (const [id, node] of this.graph.nodes) {
      // Search in content and tags
      const content = node.content.toLowerCase();
      const nodeTags = (node.tags || []).join(' ').toLowerCase();
      let matches = 0;
      
      for (const keyword of keywordSet) {
        if (content.includes(keyword) || nodeTags.includes(keyword)) matches++;
      }
      
      if (matches > 0) {
        results.push({
          node,
          relevance: matches / keywordSet.size * (node.confidence || 1.0),
          path: []
        });
      }
    }
    
    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, resultLimit);
  }

  // Get related memories via edges
  getRelated(nodeId: string, edgeType?: string): MemoryNode[] {
    const related: MemoryNode[] = [];
    
    for (const edge of this.graph.edges.values()) {
      if (edge.from === nodeId || edge.to === nodeId) {
        if (!edgeType || edge.type === edgeType) {
          const otherId = edge.from === nodeId ? edge.to : edge.from;
          const node = this.graph.nodes.get(otherId);
          if (node) related.push(node);
        }
      }
    }
    
    return related;
  }

  // Get recent memories
  getRecent(count = 20): MemoryNode[] {
    return Array.from(this.graph.nodes.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count);
  }

  // Get user profile
  getProfile(): any {
    try {
      if (existsSync(PROFILE_FILE)) {
        return JSON.parse(readFileSync(PROFILE_FILE, 'utf-8'));
      }
    } catch {
      // ignore
    }
    return null;
  }

  // Save user profile
  saveProfile(profile: any): void {
    writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
  }
}

export const memory = new MemoryStore();

export const userProfile = {
  get: () => memory.getProfile(),
  set: (profile: any) => memory.saveProfile(profile)
};
