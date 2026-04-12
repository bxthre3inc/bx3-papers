// Secrets Manager
export const secrets = {
  get: (name: string) => process.env[name] || null,
  set: (name: string, value: string) => true
};
