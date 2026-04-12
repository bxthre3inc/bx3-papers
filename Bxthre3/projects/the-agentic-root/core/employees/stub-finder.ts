/**
 * Stub Finder — Agentic v2
 *
 * Role: Scan ALL Agentic codebases for stubs, mocks, fake data, empty implementations,
 * broken logic, non-compiling code, and orphaned features.
 *
 * When a stub is found → identify the responsible agent → file a code-change request.
 *
 * Scan targets:
 *   1. /home/workspace/Bxthre3/projects/the-agentic-project/core/
 *   2. /home/workspace/Bxthre3/shared/agentic/
 *   3. /home/workspace/Bxthre3/projects/the-agentic-native/app/src/main/kotlin/
 *
 * Run: daily via scheduler, or on-demand via stubFinder.run()
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Types ────────────────────────────────────────────────────────────────────

export type StubType =
  | 'HARDCODE_MOCK'    // Static fake data instead of live API
  | 'EMPTY_STUB'       // No-op or throws NotImplementedError
  | 'TODO_STUB'        // TODO/FIXME/STUB markers left in code
  | 'FAKE_DATA'        // Inline fake objects, names, IDs
  | 'HARDCODED_RESPONSE' // Hardcoded JSON replacing real API calls
  | 'NON_FUNCTIONAL'   // Defined but never imported/used
  | 'STALE_ORPHAN'     // Old Arkad employees still referenced post-merge
  | 'API_ROUTE_MISMATCH'; // Route says one thing, impl does another

export interface StubFinding {
  id: string;
  type: StubType;
  severity: 'P0' | 'P1' | 'P2';
  file: string;
  line?: number;
  description: string;
  evidence: string;
  responsibleAgent: string;
  fixRequired: string;
  autoFixable: boolean;
}

export interface CodeChangeRequest {
  id: string;
  findingId: string;
  toAgent: string;
  subject: string;
  body: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'pending' | 'filed' | 'resolved';
  filedAt?: string;
  resolvedAt?: string;
}

export interface StubFinderReport {
  timestamp: string;
  scansCompleted: string[];
  findings: StubFinding[];
  summary: {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    byAgent: Record<string, number>;
  };
  codeChangeRequests: CodeChangeRequest[];
}

// ─── Scan Targets ─────────────────────────────────────────────────────────────

const SCAN_TARGETS = [
  {
    path: '/home/workspace/Bxthre3/projects/the-agentic-project/core',
    description: 'Agentic core system',
  },
  {
    path: '/home/workspace/Bxthre3/shared/agentic',
    description: 'Shared agentic library',
  },
  {
    path: '/home/workspace/Bxthre3/projects/the-agentic-native/app/src/main/kotlin',
    description: 'Android native app',
  },
];

// ─── Known Fake / Stale IDs ──────────────────────────────────────────────────

const KNOWN_FAKE_IDS = new Set([
  // Android mock agents (ApiService.kt)
  'avery', 'remy', 'quinn', 'chronicler', 'architect', 'brand',
  'navigate', 'nexus', 'blueprint', 'palette', 'sync', 'vault', 'trace',
  // Stale Arkad 24-employee roster
  'jordan', 'alex', 'casey-lin', 'iris-park', 'quinn-taylor',
  'riley-kim', 'taylor-brooks', 'blake-rivera', 'sage-williams',
  'nico-anderson', 'quinn', 'riley', 'sage', 'nico', 'blake',
  'ira', 'skye', 'cameron',
]);

const CANONICAL_ROSTER = new Set([
  'brodiblanco', 'zoe', 'atlas', 'vance', 'pulse', 'sentinel',
  'iris', 'dev', 'sam', 'taylor', 'theo',
  'casey', 'raj', 'maya', 'drew',
  'irrig8', 'rain', 'vpc', 'trenchbabys',
]);

// ─── Responsible Agent ───────────────────────────────────────────────────────

function getResponsibleAgent(fp: string): string {
  const p = fp.toLowerCase();
  if (p.includes('android') || p.includes('kotlin')) return 'zoe';
  if (p.includes('shared/agentic')) return 'atlas';
  if (p.includes('hierarchy') || p.includes('org.ts')) return 'zoe';
  if (p.includes('escalation') || p.includes('sprint')) return 'atlas';
  if (p.includes('reporting') || p.includes('synthesizer')) return 'pulse';
  if (p.includes('events') || p.includes('bus')) return 'atlas';
  if (p.includes('memory')) return 'zoe';
  return 'zoe';
}

// ─── File Finder ──────────────────────────────────────────────────────────────

function findFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'build', '.git', 'dist', 'outputs', '.gradle'].includes(entry.name)) {
        results.push(...findFiles(full, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

// ─── Core Scanner ─────────────────────────────────────────────────────────────

function scanFile(fp: string, findings: StubFinding[]): void {
  let content: string;
  let lines: string[];
  try {
    content = fs.readFileSync(fp, 'utf-8');
    lines = content.split('\n');
  } catch { return; }

  const relPath = fp.replace('/home/workspace/', '');
  const responsible = getResponsibleAgent(fp);
  let idx = findings.length;

  // 1. FAKE AGENT IDs — skip for Kotlin files (they don't have fake IDs, just mock statuses)
  const isKotlin = fp.endsWith('.kt');
  if (!isKotlin) {
    for (const fakeId of KNOWN_FAKE_IDS) {
    const pat = new RegExp(/['"']/.source + fakeId + /['"']/.source + '\\s*[,:]');
    if (pat.test(content)) {
      const lineIdx = lines.findIndex(l => pat.test(l));
      findings.push({
        id: `stub-${++idx}`,
        type: 'HARDCODE_MOCK',
        severity: CANONICAL_ROSTER.has(fakeId) ? 'P0' : 'P1',
        file: relPath,
        line: lineIdx >= 0 ? lineIdx + 1 : undefined,
        description: `Fake/stale agent ID "${fakeId}" in code — not in canonical roster`,
        evidence: lineIdx >= 0 ? lines[lineIdx].trim().slice(0, 120) : '',
        responsibleAgent: responsible,
        fixRequired: `Remove "${fakeId}". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.`,
        autoFixable: true,
      });
    }
  }

  // 2. TODO / FIXME / STUB markers
  const todoPat = /\/\/\s*(TODO|FIXME|STUB|HACK|XXX|BUG|NOTE:.*implement)/i;
  for (let i = 0; i < lines.length; i++) {
    if (todoPat.test(lines[i])) {
      findings.push({
        id: `stub-${++idx}`,
        type: 'TODO_STUB',
        severity: 'P2',
        file: relPath,
        line: i + 1,
        description: `TODO/FIXME/STUB marker: "${lines[i].trim().slice(0, 80)}"`,
        evidence: lines[i].trim().slice(0, 200),
        responsibleAgent: responsible,
        fixRequired: `Implement the deferred work or remove the marker. Do not leave stub code in production.`,
        autoFixable: false,
      });
    }
  }

  // 3. Empty / no-op functions
  const emptyPatterns = [
    { p: /throw\s+new\s+Error\s*\(\s*['"]NotImplementedError['"]\s*\)/, d: 'throws NotImplementedError' },
    { p: /throw\s+new\s+Error\s*\(\s*['"]TODO/, d: 'throws TODO error' },
    { p: /:\s*void\s*{\s*}\s*;/, d: 'empty void method' },
    { p: /=>\s*{\s*}\s*;?\s*$/m, d: 'arrow function returning empty object' },
  ];
  for (const ep of emptyPatterns) {
    if (ep.p.test(content)) {
      findings.push({
        id: `stub-${++idx}`,
        type: 'EMPTY_STUB',
        severity: 'P1',
        file: relPath,
        description: `Empty/no-op: ${ep.d}`,
        evidence: content.match(ep.p)?.[0] ?? '',
        responsibleAgent: responsible,
        fixRequired: `Implement the function body or wire to real logic. Empty stubs are hidden bugs.`,
        autoFixable: false,
      });
    }
  }

  // 4. Hardcoded completion rates (fake performance metrics)
  if (/completionRate.*?0\.(?:9[0-9]|8[0-9]|7[0-6])/.test(content)) {
    findings.push({
      id: `stub-${++idx}`,
      type: 'FAKE_DATA',
      severity: 'P0',
      file: relPath,
      description: `Hardcoded fake completion rate metrics`,
      evidence: content.match(/COMPLETION_RATES[\s\S]{0,200}/)?.[0]?.slice(0, 300) ?? '',
      responsibleAgent: responsible,
      fixRequired: `Replace hardcoded completion rates with actual measured agent performance. brodiblanco flagged fake metrics as unacceptable.`,
      autoFixable: false,
    });
  }

  // 5. Android: fetchAgents returning static list (no live API call)
  if (fp.endsWith('.kt') && /fetchAgents\s*\(\s*\)\s*=\s*(?:listOf|mutableListOf)/.test(content)) {
    findings.push({
      id: `stub-${++idx}`,
      type: 'HARDCODED_RESPONSE',
      severity: 'P0',
      file: relPath,
      description: `fetchAgents() returns hardcoded static list — no live API call`,
      evidence: 'fetchAgents returns listOf(Agent(...)) with no HTTP request',
      responsibleAgent: 'zoe',
      fixRequired: `Replace with live API call: fetch("https://brodiblanco.zo.space/api/agentic/status").then(r => r.json()). brodiblanco: app is for him only — stub data not acceptable.`,
      autoFixable: false,
    });
  }

  // 6. Android mock statuses
  if (fp.endsWith('.kt')) {
    const fakeStatuses = ['awake_processing', 'standby', 'awakened', 'complete'];
    for (const s of fakeStatuses) {
      if (content.includes(`"${s}"`)) {
        findings.push({
          id: `stub-${++idx}`,
          type: 'HARDCODE_MOCK',
          severity: 'P1',
          file: relPath,
          description: `Android mock status string: "${s}"`,
          evidence: `Status "${s}" not in canonical types. Use: ACTIVE, IDLE, OFFLINE, ERROR`,
          responsibleAgent: 'zoe',
          fixRequired: `Replace "${s}" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR`,
          autoFixable: true,
        });
      }
    }
  }

  // 7. HARDCODED_MOCK: static SystemHealth / fake agent data
  if (fp.endsWith('.kt') && /SystemHealth\s*\(/.test(content)) {
    const fakeHealthMatch = content.match(/SystemHealth\s*\([^)]*\)/);
    if (fakeHealthMatch && !content.includes('fetch(')) {
      findings.push({
        id: `stub-${++idx}`,
        type: 'HARDCODED_RESPONSE',
        severity: 'P0',
        file: relPath,
        description: `SystemHealth returns hardcoded values — no live API`,
        evidence: fakeHealthMatch[0].slice(0, 200),
        responsibleAgent: 'zoe',
        fixRequired: `Replace hardcoded SystemHealth with live API call to /api/agentic/status`,
        autoFixable: false,
      });
    }
  }

  // 8. fetchDepts / fetchIntegrations / fetchEscalations / fetchStarting5 returning static lists
  if (fp.endsWith('.kt')) {
    const staticFetchMethods = ['fetchDepts', 'fetchIntegrations', 'fetchEscalations', 'fetchStarting5', 'fetchWorkQueue'];
    for (const method of staticFetchMethods) {
      if (new RegExp(`${method}\\s*\\(\\s*\\)\\s*=\\s*listOf`).test(content)) {
        findings.push({
          id: `stub-${++idx}`,
          type: 'HARDCODED_RESPONSE',
          severity: 'P0',
          file: relPath,
          description: `${method}() returns hardcoded static list — no live API call`,
          evidence: `${method} returns listOf(...) with no HTTP request`,
          responsibleAgent: 'zoe',
          fixRequired: `Replace ${method} with live API call to https://brodiblanco.zo.space/api/agentic/${method.replace('fetch','').toLowerCase()}`,
          autoFixable: false,
        });
      }
    }
  }
}


// ─── CCR Generator ────────────────────────────────────────────────────────────

function generateCCRs(findings: StubFinding[]): CodeChangeRequest[] {
  const byAgent: Record<string, StubFinding[]> = {};
  for (const f of findings) {
    if (!byAgent[f.responsibleAgent]) byAgent[f.responsibleAgent] = [];
    byAgent[f.responsibleAgent].push(f);
  }

  const ccrs: CodeChangeRequest[] = [];
  let ccrId = 1;

  for (const [agent, agentFindings] of Object.entries(byAgent)) {
    const p0s = agentFindings.filter(f => f.severity === 'P0');
    const p1s = agentFindings.filter(f => f.severity === 'P1');
    const p2s = agentFindings.filter(f => f.severity === 'P2');
    const files = [...new Set(agentFindings.map(f => f.file))];

    const priority: 'P0' | 'P1' | 'P2' =
      p0s.length > 0 ? 'P0' : p1s.length > 0 ? 'P1' : 'P2';

    const bodyLines = [
      `CODE CHANGE REQUEST — from Stub Finder`,
      ``,
      `Agent: ${agent}`,
      `Findings: ${agentFindings.length} total (${p0s.length} P0, ${p1s.length} P1, ${p2s.length} P2)`,
      `Files affected: ${files.join(', ')}`,
      ``,
      `FINDINGS:`,
      ...agentFindings.map((f, i) =>
        `  [${f.severity}] ${f.type} — ${f.file}${f.line ? ':' + f.line : ''}`
      ),
      ``,
      `REQUIRED CHANGES:`,
      ...agentFindings.map((f, i) =>
        `  ${i + 1}. ${f.description}`
      ),
      ``,
      `FIX DETAIL:`,
      ...agentFindings.map(f => `  File: ${f.file}${f.line ? ':' + f.line : ''}\n    Fix: ${f.fixRequired}`),
      ``,
      `Auto-fixable: ${agentFindings.filter(f => f.autoFixable).length} / ${agentFindings.length}`,
    ];

    ccrs.push({
      id: `ccr-${ccrId++}`,
      findingId: agentFindings.map(f => f.id).join(','),
      toAgent: agent,
      subject: `[${priority}] Stub Finder: ${p0s.length > 0 ? p0s.length + ' P0' : p1s.length > 0 ? p1s.length + ' P1' : p2s.length + ' P2'} code issues — fix required`,
      body: bodyLines.join('\n'),
      priority,
      status: 'pending',
    });
  }

  return ccrs;
}

// ─── INBOX Router ─────────────────────────────────────────────────────────────

function routeCCR(ccr: CodeChangeRequest): void {
  const agentInbox = '/home/workspace/Bxthre3/INBOX/agents/' + ccr.toAgent + '.md';
  const canonicalInbox = '/home/workspace/Bxthre3/INBOX.md';

  const prio = ccr.priority;
  const agent = ccr.toAgent;
  const ts2 = new Date().toLocaleString('en-US', { timeZone: 'America/Denver' });
  const subject = ccr.subject;
  const body = ccr.body;

  const entry = [
    '',
    '---',
    '## [CCR-' + prio + '] Stub Finder -> ' + agent + ' | ' + ts2,
    '',
    '**Subject:** ' + subject,
    '',
    body,
    '',
    '*Auto-generated by Stub Finder v2. P0 findings escalate to canonical INBOX.*',
    '',
  ].join('\n');

  try {
    fs.appendFileSync(agentInbox, entry);
    if (ccr.priority === 'P0') {
      fs.appendFileSync(canonicalInbox, entry);
    }
    ccr.status = 'filed';
    ccr.filedAt = new Date().toISOString();
  } catch (e) {
    console.error('[StubFinder] Failed to route CCR to ' + ccr.toAgent + ': ' + (e as Error).message);
  }
}