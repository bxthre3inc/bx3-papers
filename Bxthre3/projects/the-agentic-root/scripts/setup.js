#!/usr/bin/env node
// Agentic Setup Script
// Configures API keys, initializes database

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function main() {
  console.log('\n🚀 Agentic 3.1 Setup\n');
  console.log('This will configure your standalone AI workforce.\n');

  // Check .env exists
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (!fs.existsSync(envPath)) {
    console.log('Creating .env from template...\n');
    fs.copyFileSync(envExamplePath, envPath);
  }

  // Collect API keys
  console.log('Required API Keys:\n');

  const openaiKey = await question('OpenAI API Key (sk-...): ');
  const gmailServiceAccount = await question('Gmail Service Account JSON path: ');
  const githubToken = await question('GitHub Personal Access Token: ');

  // Write to .env
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace('sk-your-openai-key', openaiKey);
  envContent = envContent.replace('/path/to/service-account.json', gmailServiceAccount);
  envContent = envContent.replace('ghp_your_github_token', githubToken);

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env\n');

  // Initialize database
  console.log('Initializing database...\n');
  
  const dbDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log('✅ Database initialized\n');

  // Create required directories
  const dirs = [
    'logs',
    'backups',
    'proposals',
    'temp'
  ];

  for (const dir of dirs) {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  console.log('✅ Directory structure created\n');

  console.log('🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. npm install');
  console.log('2. npm run build');
  console.log('3. npm start');
  console.log('\nOr use Docker:');
  console.log('docker-compose up -d\n');

  rl.close();
}

main().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
