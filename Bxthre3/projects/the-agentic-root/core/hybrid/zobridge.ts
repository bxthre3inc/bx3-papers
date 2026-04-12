// Zo Bridge — Hybrid coordination
export const zoBridge = {
  connect: () => ({ status: 'connected' }),
  disconnect: () => ({ status: 'disconnected' }),
  query: (q: string) => Promise.resolve({ result: null })
};
