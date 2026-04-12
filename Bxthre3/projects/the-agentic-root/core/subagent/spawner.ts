// Sub-Agent Spawner
export interface SubAgent { id: string; status: string; }
export interface SpawnRequest { task: string; priority: string; }
export interface MergedResult { results: any[]; summary: string; }

export const spawner = {
  spawn: (req: SpawnRequest) => ({ id: 'sub-1', status: 'running' } as SubAgent),
  merge: (results: any[]) => ({ results, summary: 'Merged' } as MergedResult)
};
