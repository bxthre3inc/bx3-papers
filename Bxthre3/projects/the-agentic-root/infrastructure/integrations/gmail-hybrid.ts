// Gmail Hybrid Integration
export const hybridGmail = {
  send: (opts: { to: string; subject: string; body: string }) => Promise.resolve({ sent: true }),
  getUnread: () => Promise.resolve([]),
  getStatus: () => 'connected'
};

export const gmailIntegration = hybridGmail;
