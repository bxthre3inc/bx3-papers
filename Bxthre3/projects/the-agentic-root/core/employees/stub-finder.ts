/**
 * Stub Finder -- Agentic v2
 * Scans ALL Agentic codebases for stubs, mocks, fake data, empty implementations.
 */

import * as fs from 'fs';
import * as path from 'path';

export type StubType = 'HARDCODE_MOCK' | 'EMPTY_STUB' | 'TODO_STUB' | 'FAKE_DATA' | 'HARDCODED_RESPONSE';

export interface StubFinding {
  id: string; type: StubType; severity: 'P0' | 'P1' | 'P2';
  file: string; line?: number; description: string; evidence: string;
  responsibleAgent: string; fixRequired: string; autoFixable: boolean;
}

export interface CodeChangeRequest {
  id: string; findingId: string; toAgent: string; subject: string;
  body: string; priority: 'P0' | 'P1' | 'P2';
  status: 'pending' | 'filed' | 'resolved'; filedAt?: string; resolvedAt?: string;
}

export interface StubFinderReport {
  timestamp: string; scansCompleted: string[]; findings: StubFinding[];
  summary: { total: number; byType: Record<string,number>; bySeverity: Record<string,number>; byAgent: Record<string,number> };
  codeChangeRequests: CodeChangeRequest[];
}

const SCAN_TARGETS = [
  { path: '/home/workspace/Bxthre3/projects/the-agentic-root/core', description: 'Agentic core system' },
  { path: '/home/workspace/Bxthre3/shared/agentic/core/hierarchy', description: 'Shared agentic library' },
  { path: '/home/workspace/Bxthre3/projects/the-agentic-android/app/src/main/kotlin', description: 'Android native app' },
];

const KNOWN_FAKE_IDS: string[] = []; // populated by scanner

const CANONICAL_ROSTER = new Set([
  'brodiblanco','zoe','atlas','vance','pulse','sentinel',
  'iris','dev','sam','taylor','theo','casey','raj','maya','drew',
  'irrig8','rain','vpc','trenchbabys',
]);

function getResponsibleAgent(fp: string): string {
  const p = fp.toLowerCase();
  if (p.includes('android') || p.includes('kotlin')) return 'zoe';
  if (p.includes('shared/agentic')) return 'atlas';
  if (p.includes('hierarchy') || p.includes('org.ts')) return 'zoe';
  if (p.includes('escalation') || p.includes('sprint')) return 'atlas';
  if (p.includes('reporting') || p.includes('synthesizer')) return 'pulse';
  if (p.includes('events') || p.includes('bus')) return 'atlas';
  return 'zoe';
}

function findFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules','build','.git','dist','outputs','.gradle'].includes(entry.name)) {
        results.push(...findFiles(full, extensions));
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

function scanFile(fp: string, findings: StubFinding[]): void {
  let content: string; let lines: string[];
  try {
    content = fs.readFileSync(fp, 'utf-8');
    lines = content.split('\n');
  } catch { return; }
  const relPath = fp.replace('/home/workspace/', '');
  const responsible = getResponsibleAgent(fp);
  let idx = findings.length;
  const isKotlin = fp.endsWith('.kt');
  
  if (!isKotlin) {
    for (const fakeId of KNOWN_FAKE_IDS) {
      const pat = new RegExp('["\']' + fakeId + '["\']' + '\\s*[,:]');
      if (pat.test(content)) {
        const lineIdx = lines.findIndex(l => pat.test(l));
        findings.push({
          id: 'stub-' + (++idx), type: 'HARDCODE_MOCK',
          severity: CANONICAL_ROSTER.has(fakeId) ? 'P0' : 'P1',
          file: relPath, line: lineIdx >= 0 ? lineIdx + 1 : undefined,
          description: 'Fake/stale agent ID "' + fakeId + '" in code -- not in canonical roster',
          evidence: lineIdx >= 0 ? lines[lineIdx].trim().slice(0, 120) : '',
          responsibleAgent: responsible,
          fixRequired: 'Remove "' + fakeId + '". Canonical roster: brodiblanco, zoe, atlas, vance, pulse, sentinel, iris, dev, sam, taylor, theo, casey, raj, maya, drew, irrig8, rain, vpc, trenchbabys.',
          autoFixable: true,
        });
      }
    }
  }
  
  const todoPat = /\/\/\s*(TODO|FIXME|HACK|XXX|BUG)\s*[:].*/i;
  for (let i = 0; i < lines.length; i++) {
    if (todoPat.test(lines[i])) {
      findings.push({
        id: 'stub-' + (++idx), type: 'TODO_STUB', severity: 'P2',
        file: relPath, line: i + 1,
        description: 'TODO/FIXME/STUB marker: "' + lines[i].trim().slice(0, 80) + '"',
        evidence: lines[i].trim().slice(0, 200),
        responsibleAgent: responsible,
        fixRequired: 'Implement the deferred work or remove the marker.',
        autoFixable: false,
      });
    }
  }
  
  const emptyPatterns = [
    { p: /throw\s+new\s+Error\s*\(\s*['"]NotImplementedError['"]\s*\)/, d: 'throws NotImplementedError' },
    { p: /throw\s+new\s+Error\s*\(\s*['"]TODO/, d: 'throws TODO error' },
    { p: /:\s*void\s*{\s*}\s*;/, d: 'empty void method' },
  ];
  for (const ep of emptyPatterns) {
    if (ep.p.test(content)) {
      findings.push({
        id: 'stub-' + (++idx), type: 'EMPTY_STUB', severity: 'P1',
        file: relPath,
        description: 'Empty/no-op: ' + ep.d,
        evidence: content.match(ep.p)?.[0] ?? '',
        responsibleAgent: responsible,
        fixRequired: 'Implement the function body. Empty stubs are hidden bugs.',
        autoFixable: false,
      });
    }
  }
  
  if (/completionRate.*?0\.[789][0-9]/.test(content)) {
    findings.push({
      id: 'stub-' + (++idx), type: 'FAKE_DATA', severity: 'P0',
      file: relPath,
      description: 'Hardcoded fake completion rate metrics',
      evidence: content.match(/COMPLETION_RATES[\s\S]{0,200}/)?.[0]?.slice(0, 300) ?? '',
      responsibleAgent: responsible,
      fixRequired: 'Replace hardcoded completion rates with actual measured agent performance.',
      autoFixable: false,
    });
  }
  
  if (isKotlin && /fetchAgents\s*\(\s*\)\s*=\s*(?:listOf|mutableListOf)/.test(content)) {
    findings.push({
      id: 'stub-' + (++idx), type: 'HARDCODED_RESPONSE', severity: 'P0',
      file: relPath,
      description: 'fetchAgents() returns hardcoded static list -- no live API call',
      evidence: 'fetchAgents returns listOf(...) with no HTTP request',
      responsibleAgent: 'zoe',
      fixRequired: 'Replace with live API call to https://brodiblanco.zo.space/api/agentic/status',
      autoFixable: false,
    });
  }
  
  if (isKotlin) {
    const fakeStatuses = ['awake_processing','standby','awakened','complete'];
    for (const s of fakeStatuses) {
      if (content.includes('"' + s + '"')) {
        findings.push({
          id: 'stub-' + (++idx), type: 'HARDCODE_MOCK', severity: 'P1',
          file: relPath,
          description: 'Android mock status string: "' + s + '"',
          evidence: 'Status "' + s + '" not in canonical types. Use: ACTIVE, IDLE, OFFLINE, ERROR',
          responsibleAgent: 'zoe',
          fixRequired: 'Replace "' + s + '" with canonical statuses: ACTIVE, IDLE, OFFLINE, ERROR',
          autoFixable: true,
        });
      }
    }
  }
  
  if (isKotlin && /SystemHealth\s*\(/.test(content)) {
    const m = content.match(/SystemHealth\s*\([^)]*\)/);
    if (m && !content.includes('fetch(')) {
      findings.push({
        id: 'stub-' + (++idx), type: 'HARDCODED_RESPONSE', severity: 'P0',
        file: relPath,
        description: 'SystemHealth returns hardcoded values -- no live API',
        evidence: m[0].slice(0, 200),
        responsibleAgent: 'zoe',
        fixRequired: 'Replace hardcoded SystemHealth with live API call to /api/agentic/status',
        autoFixable: false,
      });
    }
  }
  
  if (isKotlin) {
    const staticMethods = ['fetchDepts','fetchIntegrations','fetchEscalations','fetchStarting5','fetchWorkQueue'];
    for (const method of staticMethods) {
      if (new RegExp(method + '\\s*\\(\\s*\\)\\s*=\\s*listOf').test(content)) {
        findings.push({
          id: 'stub-' + (++idx), type: 'HARDCODED_RESPONSE', severity: 'P0',
          file: relPath,
          description: method + '() returns hardcoded static list -- no live API call',
          evidence: method + ' returns listOf(...) with no HTTP request',
          responsibleAgent: 'zoe',
          fixRequired: 'Replace ' + method + ' with live API call to /api/agentic/' + method.replace('fetch','').toLowerCase(),
          autoFixable: false,
        });
      }
    }
  }
}

function generateCCRs(findings: StubFinding[]): CodeChangeRequest[] {
  const byAgent: Record<string, StubFinding[]> = {};
  for (const f of findings) {
    if (!byAgent[f.responsibleAgent]) byAgent[f.responsibleAgent] = [];
    byAgent[f.responsibleAgent].push(f);
  }
  const ccrs: CodeChangeRequest[] = [];
  let ccrId = 1;
  for (const [agent, agFindings] of Object.entries(byAgent)) {
    const p0s = agFindings.filter(f => f.severity === 'P0');
    const p1s = agFindings.filter(f => f.severity === 'P1');
    const p2s = agFindings.filter(f => f.severity === 'P2');
    const files = [...new Set(agFindings.map(f => f.file))];
    const priority: 'P0' | 'P1' | 'P2' = p0s.length > 0 ? 'P0' : p1s.length > 0 ? 'P1' : 'P2';
    const bodyLines = [
      'CODE CHANGE REQUEST -- from Stub Finder', '',
      'Agent: ' + agent,
      'Findings: ' + agFindings.length + ' total (' + p0s.length + ' P0, ' + p1s.length + ' P1, ' + p2s.length + ' P2)',
      'Files affected: ' + files.join(', '), '',
      'FINDINGS:',
      ...agFindings.map((f, i) => '  [' + f.severity + '] ' + f.type + ' -- ' + f.file + (f.line ? ':' + f.line : '')),
      '', 'REQUIRED CHANGES:',
      ...agFindings.map((f, i) => '  ' + (i+1) + '. ' + f.description),
      '', 'FIX DETAIL:',
      ...agFindings.map(f => '  File: ' + f.file + (f.line ? ':' + f.line : '') + '\n    Fix: ' + f.fixRequired),
      '', 'Auto-fixable: ' + agFindings.filter(f => f.autoFixable).length + ' / ' + agFindings.length,
    ];
    ccrs.push({
      id: 'ccr-' + ccrId++,
      findingId: agFindings.map(f => f.id).join(','),
      toAgent: agent,
      subject: '[' + priority + '] Stub Finder: ' + (p0s.length > 0 ? p0s.length + ' P0' : p1s.length > 0 ? p1s.length + ' P1' : p2s.length + ' P2') + ' code issues -- fix required',
      body: bodyLines.join('\n'),
      priority,
      status: 'pending',
    });
  }
  return ccrs;
}

function routeCCR(ccr: CodeChangeRequest): void {
  const agentInbox = '/home/workspace/Bxthre3/INBOX/agents/' + ccr.toAgent + '.md';
  const canonicalInbox = '/home/workspace/Bxthre3/INBOX.md';
  const entry = [
    '', '---',
    '## [CCR-' + ccr.priority + '] Stub Finder -> ' + ccr.toAgent + ' | ' + new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }),
    '', '**Subject:** ' + ccr.subject, '', ccr.body, '',
    '*Auto-generated by Stub Finder v2. P0 findings escalate to canonical INBOX.*', '',
  ].join('\n');
  try {
    fs.appendFileSync(agentInbox, entry);
    if (ccr.priority === 'P0') fs.appendFileSync(canonicalInbox, entry);
    ccr.status = 'filed';
    ccr.filedAt = new Date().toISOString();
  } catch (e) {
    console.error('[StubFinder] Failed to route CCR to ' + ccr.toAgent + ': ' + (e as Error).message);
  }
}

export const stubFinder = {
  scan(targetPaths?: typeof SCAN_TARGETS): StubFinderReport {
    const targets = targetPaths ?? SCAN_TARGETS;
    const findings: StubFinding[] = [];
    for (const target of targets) {
      const files = findFiles(target.path, ['.ts', '.tsx', '.kt', '.java', '.py']);
      for (const fp of files) scanFile(fp, findings);
    }
    const ccrs = generateCCRs(findings);
    for (const ccr of ccrs) routeCCR(ccr);
    const byType: Record<string,number> = {};
    const bySeverity: Record<string,number> = {};
    const byAgent: Record<string,number> = {};
    for (const f of findings) {
      byType[f.type] = (byType[f.type] || 0) + 1;
      bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
      byAgent[f.responsibleAgent] = (byAgent[f.responsibleAgent] || 0) + 1;
    }
    return {
      timestamp: new Date().toISOString(),
      scansCompleted: targets.map(t => t.description),
      findings,
      summary: { total: findings.length, byType, bySeverity, byAgent },
      codeChangeRequests: ccrs,
    };
  },
  run() {
    const report = this.scan();
    console.log('[StubFinder] Scan complete: ' + report.summary.total + ' findings');
    return report;
  },
};

if (process.argv[1]?.includes('stub-finder')) {
  const report = stubFinder.run();
  console.log(JSON.stringify(report.summary, null, 2));
}
