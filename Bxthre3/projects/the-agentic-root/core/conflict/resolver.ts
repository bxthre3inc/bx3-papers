// Conflict Resolver
export const conflictResolver = {
  detectConflict: (type: string, a: string, b: string, ctx: string, posA: string, posB: string) => ({ id: 'conf-1', type }),
  mediate: (id: string, mediator: string, resolution: string, winner: string) => ({ resolved: true })
};
