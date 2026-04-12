// Grant Lifecycle Manager
export const grantManager = {
  getCriticalBriefing: () => 'No critical grants',
  getActive: () => [],
  track: (grant: any) => ({ id: 'grant-1', status: 'tracking' })
};
