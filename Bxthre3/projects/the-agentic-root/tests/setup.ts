// Test setup
import { org } from '../core/hierarchy/org';
import { memory } from '../core/memory/store';

beforeAll(async () => {
  // Initialize clean test environment
  await memory.clear();
  org.reset();
});

afterEach(async () => {
  // Clean up after each test
  await memory.clear();
});

// Mock external APIs
jest.mock('../infrastructure/integrations/gmail-hybrid');
jest.mock('../infrastructure/integrations/calendar-hybrid');
