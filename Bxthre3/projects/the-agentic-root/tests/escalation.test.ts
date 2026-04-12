import { escalationClock } from '../core/escalation/clock';
import { org } from '../core/hierarchy/org';

describe('Escalation Clock', () => {
  beforeEach(() => {
    // Clear any pre-existing blockers
    for (const b of escalationClock.getActive()) {
      escalationClock.resolve(b.id, 'test cleanup');
    }
  });

  test('registers blocker with 24h deadline', () => {
    const id = 'test-blocker-' + Date.now();
    const blocker = {
      id,
      employeeId: 'jordan-fundraising',
      description: 'Test blocker',
      blockingSince: new Date().toISOString(),
      severity: 'p1' as const,
      assignedManager: 'taylor',
      resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      peerHelpRequested: false,
      humanEscalationPending: false,
      attemptedResolutions: [],
      neededFromOthers: []
    };
    
    escalationClock.register(blocker);
    const active = escalationClock.getActive();
    
    expect(active).toHaveLength(1);
    expect(active[0].id).toMatch(/^test-blocker-/);
  });

  test('resolves blocker and archives', () => {
    // Register then immediately resolve a unique blocker
    const id = 'test-blocker-resolve-' + Date.now();
    const blocker = {
      id,
      employeeId: 'jordan-fundraising',
      description: 'Test resolver',
      blockingSince: new Date().toISOString(),
      severity: 'p1' as const,
      assignedManager: 'taylor',
      resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      peerHelpRequested: false,
      humanEscalationPending: false,
      attemptedResolutions: [],
      neededFromOthers: []
    };
    escalationClock.register(blocker);
    const resolved = escalationClock.resolve(id, 'Fixed by manager');
    expect(resolved).toBe(true);
    expect(escalationClock.getActive()).toHaveLength(0);
  });
});
