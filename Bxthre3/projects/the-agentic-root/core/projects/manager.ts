// Project Manager
export const projectManager = {
  getPortfolioSummary: () => ({ active: 0, criticalDeadlines: [] }),
  getActive: () => [],
  detectResourceConflicts: () => [],
  track: (proj: any) => ({ id: 'proj-1', status: 'active' })
};
