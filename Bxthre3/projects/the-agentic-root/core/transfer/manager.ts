// Knowledge Transfer Manager
export const knowledgeTransfer = {
  initiateTransfer: (opts: any) => ({ id: 'xfer-1', status: 'initiated' }),
  offboard: (agentId: string, reason: string) => ({ offboarded: true })
};
