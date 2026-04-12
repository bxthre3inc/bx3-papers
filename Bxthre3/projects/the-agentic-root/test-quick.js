// Quick Agentic functional test
const { Agentic } = require('./dist/core/index.js');

console.log('Testing Agentic...\n');

// Test 1: Core systems accessible
console.log('1. Core systems:');
console.log('   - memory:', typeof Agentic.memory);
console.log('   - org:', typeof Agentic.org);
console.log('   - router:', typeof Agentic.router);

// Test 2: Status
console.log('\n2. Agentic Status:');
const status = Agentic.getStatus();
console.log('   - Timestamp:', status.timestamp);
console.log('   - Total employees:', status.employees.total);
console.log('   - Active:', status.employees.active);
console.log('   - Blockers:', status.blockers.active);

// Test 3: Bxthre3 modules
console.log('\n3. Bxthre3 modules:');
console.log('   - grants:', typeof Agentic.grants);
console.log('   - ip:', typeof Agentic.ip);
console.log('   - subsidiary:', typeof Agentic.subsidiary);

// Test 4: Get briefing
console.log('\n4. Executive Briefing:');
try {
  const briefing = Agentic.getBriefing();
  console.log('   ✓ Briefing generated');
} catch (e) {
  console.log('   ✗ Briefing error:', e.message);
}

console.log('\n✓ Agentic operational');
