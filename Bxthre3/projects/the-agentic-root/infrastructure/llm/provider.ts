// LLM Provider
export const llmProvider = {
  generate: (prompt: string) => Promise.resolve({ text: 'LLM response' }),
  getStatus: () => 'connected'
};
