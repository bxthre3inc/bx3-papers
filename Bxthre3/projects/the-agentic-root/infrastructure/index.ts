// Infrastructure exports
export { secrets, SecretsManager } from './config/secrets.js';
export { storage, StorageManager } from './storage/manager.js';
export { directGmail, DirectGmailIntegration } from './integrations/direct-gmail.js';
export { directCalendar, DirectCalendarIntegration } from './integrations/direct-calendar.js';
export { directGitHub, DirectGitHubIntegration } from './integrations/direct-github.js';
export { hybridGmail, GmailHybridIntegration } from './integrations/gmail-hybrid.js';
export { hybridCalendar, CalendarHybridIntegration } from './integrations/calendar-hybrid.js';
export { hybridManager, HybridIntegrationManager } from './hybrid/manager.js';
export { healthMonitor, HealthMonitor } from './hybrid/health.js';
export { decoupledRuntime, DecoupledRuntime } from './runtime/decoupled.js';
