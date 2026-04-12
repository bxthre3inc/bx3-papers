// Agentic Minimal HTTP Server
// Provides status API and health checks

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3999;
const STATUS_FILE = '/home/workspace/Bxthre3/agents/status/daemon.json';

// Ensure status directory exists
fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });

// Default status
let daemonStatus = {
  timestamp: new Date().toISOString(),
  status: 'running',
  version: '3.1.0',
  employees: {
    total: 24,
    active: 24,
    cofounders: ['Vance', 'Maya', 'Drew', 'Jordan', 'Alex'],
    departments: ['Engineering', 'Operations', 'Revenue', 'Strategy']
  },
  scheduler: {
    active: true,
    tasks: ['12h-briefing', 'daily-check', 'health-check']
  },
  integrations: ['gmail', 'calendar', 'tasks', 'github', 'drive', 'supermemory', 'sms']
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  // Full status
  if (url.pathname === '/status' || url.pathname === '/') {
    daemonStatus.timestamp = new Date().toISOString();
    
    // Persist status
    fs.writeFileSync(STATUS_FILE, JSON.stringify(daemonStatus, null, 2));
    
    res.writeHead(200);
    res.end(JSON.stringify(daemonStatus, null, 2));
    return;
  }
  
  // Employees list
  if (url.pathname === '/employees') {
    res.writeHead(200);
    res.end(JSON.stringify({
      employees: [
        { id: 'vance', name: 'Vance', role: 'Founders Assistant', dept: 'Executive', status: 'active' },
        { id: 'maya', name: 'Maya Patel', role: 'CTO', dept: 'Engineering', status: 'active' },
        { id: 'drew', name: 'Drew Morrison', role: 'COO', dept: 'Operations', status: 'active' },
        { id: 'jordan', name: 'Jordan Reyes', role: 'Sales/GTM', dept: 'Revenue', status: 'active' },
        { id: 'alex', name: 'Alex Chen', role: 'Strategy', dept: 'Strategy', status: 'active' },
        { id: 'casey', name: 'Casey Lin', role: 'Frontend', dept: 'Engineering', status: 'active' },
        { id: 'iris', name: 'Iris Park', role: 'Backend', dept: 'Engineering', status: 'active' },
        { id: 'quinn', name: 'Quinn Taylor', role: 'Finance', dept: 'Operations', status: 'active' },
        { id: 'riley', name: 'Riley Kim', role: 'People Ops', dept: 'Operations', status: 'active' },
        { id: 'taylor', name: 'Taylor Brooks', role: 'Sales', dept: 'Revenue', status: 'active' },
        { id: 'blake', name: 'Blake Rivera', role: 'Partnerships', dept: 'Revenue', status: 'active' },
        { id: 'sage', name: 'Sage Williams', role: 'Research', dept: 'Strategy', status: 'active' },
        { id: 'nico', name: 'Nico Anderson', role: 'Decks', dept: 'Strategy', status: 'active' }
      ]
    }, null, 2));
    return;
  }
  
  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found', path: url.pathname }));
});

server.listen(PORT, () => {
  console.log(`🚀 Agentic HTTP Server running on port ${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`👥 Employees: http://localhost:${PORT}/employees`);
});

// Persist initial status
fs.writeFileSync(STATUS_FILE, JSON.stringify(daemonStatus, null, 2));

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  daemonStatus.status = 'stopped';
  daemonStatus.timestamp = new Date().toISOString();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(daemonStatus, null, 2));
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Interrupted');
  daemonStatus.status = 'stopped';
  daemonStatus.timestamp = new Date().toISOString();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(daemonStatus, null, 2));
  server.close(() => process.exit(0));
});