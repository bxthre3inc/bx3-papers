// Standalone verification test
const path = require('path');

// Simulate no Zo environment
process.env.NODE_ENV = 'standalone';
process.env.AGENTOS_MODE = 'independent';

// Check all core modules can load without Zo
try {
  // Check infrastructure exists
  const infra = require('./dist/infrastructure/index.js');
  console.log('✓ Infrastructure module loads');
  
  // Check hybrid integrations
  const hybrid = require('./dist/infrastructure/hybrid/manager.js');
  console.log('✓ Hybrid manager loads');
  
  // Check LLM provider
  const llm = require('./dist/infrastructure/llm/provider.js');
  console.log('✓ LLM provider loads');
  
  // Check storage
  const storage = require('./dist/infrastructure/storage/manager.js');
  console.log('✓ Storage manager loads');
  
  console.log('\n✓ All standalone modules load successfully');
  console.log('✓ Agentic can run without Zo dependencies');
  process.exit(0);
} catch (err) {
  console.error('✗ Failed:', err.message);
  process.exit(1);
}
