// Daemon — Functional process controller with employee management
// Agentic 3.1 — Full employee system including The Starting 5

import { casey } from '../employees/casey';
import { sentinel } from '../employees/sentinel';
import { pulse } from '../employees/pulse';
import { iris } from '../employees/iris';
import { scheduler } from '../scheduler/index';
import { synthesizer } from '../reporting/synthesizer';
import { gmailIntegration } from '../../integrations/gmail';
import { escalationClock } from '../escalation/clock';

// The Starting 5 — Co-Founder Archetypes
import { builder } from '../employees/builder';
import { operator } from '../employees/operator';
import { hunter } from '../employees/hunter';
import { architect } from '../employees/architect';

import * as fs from 'fs';
import * as path from 'path';

const PID_FILE = '/tmp/agentic.pid';
const STATUS_FILE = '/home/workspace/Bxthre3/agents/status/daemon.json';

export const daemon = {
  employees: {
    // Operational
    casey, sentinel, pulse, iris,
    // Co-Founders (The Starting 5 minus Visionary)
    builder, operator, hunter, architect
  },
  
  start: async () => {
    console.log('=== AGENTOS 3.1 STARTING ===');
    console.log('Visionary (you) + 4 co-founder archetypes + 4 ops employees');
    
    // Write PID file
    fs.writeFileSync(PID_FILE, process.pid.toString());
    
    // Initialize all employees
    Object.entries(daemon.employees).forEach(([id, emp]) => {
      console.log(`[${emp.name}] ${emp.role} initialized`);
      // Start employees that have start methods
      if (typeof emp.start === 'function') {
        emp.start();
      }
    });
    
    // Schedule 12-hour briefings (7am/7pm)
    scheduler.scheduleBriefings(async () => {
      console.log('[Scheduler] Running 12-hour briefing');
      const digest = synthesizer.generate();
      const formatted = synthesizer.format(digest);
      
      // Try to send via Gmail
      const userEmail = process.env.AGENTOS_USER_EMAIL || 'getirrig8@gmail.com';
      await gmailIntegration.sendEmail(
        userEmail,
        `Agentic Briefing — ${new Date().toLocaleDateString()}`,
        formatted,
        'Agentic'
      );
      
      // Also write to file
      const briefingFile = `/home/workspace/Bxthre3/agents/briefings/briefing-${Date.now()}.md`;
      fs.mkdirSync(path.dirname(briefingFile), { recursive: true });
      fs.writeFileSync(briefingFile, formatted);
    });
    
    // Schedule Casey's daily grant check at 9am
    scheduler.scheduleDailyCheck('casey', () => {
      console.log('[Scheduler] Running Casey daily check');
      if (typeof casey.runDailyCheck === 'function') {
        casey.runDailyCheck();
      }
    });
    
    // Schedule Pulse health check every minute
    scheduler.scheduleEveryMinute('pulse', () => {
      if (typeof pulse.checkAll === 'function') {
        pulse.checkAll();
      }
    });
    
    // Schedule escalation clock check every 5 minutes
    scheduler.schedule('escalation-check', '*/5 * * * *', () => {
      console.log('[Scheduler] Running escalation check');
      escalationClock.check();
    });
    
    // Start the scheduler
    scheduler.start();
    
    // Write daemon status
    updateDaemonStatus('running');
    
    console.log('\n=== AGENTOS 3.1 RUNNING ===');
    console.log('Employees: 8 active');
    console.log('Scheduler: Active with tasks');
    console.log('Next briefing: 7:00 AM or 7:00 PM');
    
    // Keep process alive
    return Promise.resolve();
  },
  
  stop: () => {
    console.log('[Daemon] Shutting down...');
    
    // Stop scheduler
    scheduler.stop();
    
    // Stop employees
    Object.entries(daemon.employees).forEach(([id, emp]) => {
      if (typeof emp.stop === 'function') {
        emp.stop();
      }
    });
    
    // Remove PID file
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
    
    updateDaemonStatus('stopped');
    console.log('Agentic daemon stopped');
  },
  
  getStatus: () => {
    const isRunning = fs.existsSync(PID_FILE);
    const schedulerStatus = scheduler.getStatus();
    
    return {
      status: isRunning ? 'running' : 'stopped',
      pid: isRunning ? fs.readFileSync(PID_FILE, 'utf-8') : null,
      totalEmployees: 8,
      cofounders: ['builder', 'operator', 'hunter', 'architect'],
      ops: ['casey', 'sentinel', 'pulse', 'iris'],
      visionary: 'brodiblanco',
      scheduler: schedulerStatus
    };
  }
};

function updateDaemonStatus(status: 'running' | 'stopped') {
  const daemonStatus = {
    timestamp: new Date().toISOString(),
    status,
    pid: process.pid,
    scheduler: scheduler.getStatus()
  };
  fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
  fs.writeFileSync(STATUS_FILE, JSON.stringify(daemonStatus, null, 2));
}

// Handle graceful shutdown
process.on('SIGTERM', () => daemon.stop());
process.on('SIGINT', () => daemon.stop());
