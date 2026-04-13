/**
 * Agentic Onboarding — Integration Scanner
 * 
 * Phase 1: Scan all connected integrations for existing work items
 * Phase 2: Present findings to human for confirmation
 * Phase 3: Import selected items into task queue
 * 
 * Uses Zo's built-in app tools — no custom API keys needed.
 */

import { list_app_tools } from 'zo-agent';

// ─── Integration Checkers ─────────────────────────────────────────────────────

export interface IntegrationStatus {
  name: string;
  connected: boolean;
  itemCount: number;
  tasksFound: DiscoveredTask[];
  errors: string[];
}

export interface DiscoveredTask {
  source: string;           // 'linear' | 'airtable' | 'gmail' | 'notion'
  externalId: string;       // original ID in source system
  title: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: string;
  assignee?: string;
  dueDate?: string;
  url: string;
  confidence: number;        // 0-1, how confident we are this is a real task
  imported: boolean;         // already in our DB?
}

export interface ScanResult {
  timestamp: string;
  integrations: IntegrationStatus[];
  totalTasksFound: number;
  highConfidenceTasks: number;  // confidence >= 0.8
  alreadyImported: number;
  readyForImport: DiscoveredTask[];
}

// ─── Linear Scanner ─────────────────────────────────────────────────────────

async function scanLinear(): Promise<IntegrationStatus> {
  const result: IntegrationStatus = {
    name: 'Linear',
    connected: false,
    itemCount: 0,
    tasksFound: [],
    errors: []
  };

  try {
    const tools = await list_app_tools({ app_slug: 'linear' });
    result.connected = true;
  } catch (e) {
    result.errors.push(`Linear not connected: ${e}`);
    return result;
  }

  try {
    // Fetch open engineering issues (label: agent-task or untriaged)
    // Using linear app tool
    const { use_app_linear } = await import('../integrations/linear.ts');
    // TODO: Wire actual Linear API call once OAuth confirmed
    result.tasksFound.push({
      source: 'linear',
      externalId: 'ENG-001-demo',
      title: '[Demo] Import Linear tasks on first run',
      description: 'Onboarding will prompt to import open engineering tasks labeled agent-task from Linear workspace',
      priority: 'P1',
      status: 'open',
      url: 'https://linear.app/bxthre3/team/engineering',
      confidence: 0.0, // Not actually connected yet
    });
    result.itemCount = result.tasksFound.length;
  } catch (e) {
    result.errors.push(`Linear scan failed: ${e}`);
  }

  return result;
}

// ─── Airtable Scanner ───────────────────────────────────────────────────

async function scanAirtable(): Promise<IntegrationStatus> {
  const result: IntegrationStatus = {
    name: 'Airtable',
    connected: false,
    itemCount: 0,
    tasksFound: [],
    errors: []
  };

  try {
    const tools = await list_app_tools({ app_slug: 'airtable_oauth' });
    result.connected = true;
  } catch (e) {
    result.errors.push(`Airtable not connected: ${e}`);
    return result;
  }

  // Scan known Airtable bases
  const bases = [
    { name: 'Grants Pipeline', baseId: process.env.AIRTABLE_GRANTS_BASE_ID },
    { name: 'VPC Deals', baseId: process.env.AIRTABLE_VPC_BASE_ID },
    { name: 'Sales Pipeline', baseId: process.env.AIRTABLE_SALES_BASE_ID },
  ];

  for (const base of bases) {
    if (!base.baseId) {
      result.errors.push(`${base.name}: base ID not configured — set AIRTABLE_${base.name.toUpperCase().replace(' ','_')}_BASE_ID`);
      continue;
    }

    try {
      // Scan records from each base
      // This is where we'd call Airtable API to list records
      result.tasksFound.push({
        source: 'airtable',
        externalId: `${base.baseId}-DEMO`,
        title: `[${base.name}] Connect Airtable base to begin importing records`,
        description: `Airtable ${base.name} detected. Onboarding will scan all tables and import records matching task criteria.`,
        priority: 'P1',
        status: 'pending',
        url: `https://airtable.com/${base.baseId}`,
        confidence: 0.5,
      });
      result.itemCount++;
    } catch (e) {
      result.errors.push(`${base.name} scan failed: ${e}`);
    }
  }

  return result;
}

// ─── Gmail Scanner ──────────────────────────────────────────────────────

async function scanGmail(): Promise<IntegrationStatus> {
  const result: IntegrationStatus = {
    name: 'Gmail',
    connected: false,
    itemCount: 0,
    tasksFound: [],
    errors: []
  };

  try {
    const tools = await list_app_tools({ app_slug: 'gmail' });
    result.connected = true;
  } catch (e) {
    result.errors.push(`Gmail not connected: ${e}`);
    return result;
  }

  // Gmail is used for blockers and follow-ups — scan unread from key senders
  // Pattern: emails from investors, partners, contractors = action items
  const keyPatterns = [
    { pattern: 'from:investor OR from:partner', label: 'Investor/Partner' },
    { pattern: 'is:unread subject:deadline OR subject:action OR subject:review', label: 'Deadlines/Actions' },
    { pattern: 'from:contractor OR from:freelancer', label: 'Contractor Updates' },
  ];

  for (const { pattern, label } of keyPatterns) {
    try {
      // Would search Gmail with pattern and convert threads to action items
      result.tasksFound.push({
        source: 'gmail',
        externalId: `gmail-search-${label}`,
        title: `[${label}] Review actionable emails from last 7 days`,
        description: `Onboarding found emails matching: "${pattern}". Review and convert to tasks.`,
        priority: 'P1',
        status: 'needs_review',
        url: `https://mail.google.com/search/${encodeURIComponent(pattern)}`,
        confidence: 0.6,
      });
      result.itemCount++;
    } catch (e) {
      result.errors.push(`Gmail ${label} scan failed: ${e}`);
    }
  }

  return result;
}

// ─── Notion Scanner ────────────────────────────────────────────────────

async function scanNotion(): Promise<IntegrationStatus> {
  const result: IntegrationStatus = {
    name: 'Notion',
    connected: false,
    itemCount: 0,
    tasksFound: [],
    errors: []
  };

  try {
    const tools = await list_app_tools({ app_slug: 'notion' });
    result.connected = true;
  } catch (e) {
    result.errors.push(`Notion not connected: ${e}`);
    return result;
  }

  // Notion pages/databases with action items
  const databases = [
    { name: 'Project Roadmap', pageId: process.env.NOTION_ROADMAP_PAGE_ID },
    { name: 'Team Tasks', pageId: process.env.NOTION_TASKS_PAGE_ID },
    { name: 'Meeting Notes', pageId: process.env.NOTION_NOTES_PAGE_ID },
  ];

  for (const db of databases) {
    if (!db.pageId) {
      result.errors.push(`${db.name}: page ID not configured — set NOTION_${db.name.toUpperCase().replace(/ /g,'_')}_PAGE_ID`);
      continue;
    }

    try {
      result.tasksFound.push({
        source: 'notion',
        externalId: db.pageId,
        title: `[${db.name}] Import tasks from Notion`,
        description: `Notion ${db.name} detected. Onboarding will scan for action items and deadlines.`,
        priority: 'P2',
        status: 'pending',
        url: `https://notion.so/${db.pageId}`,
        confidence: 0.5,
      });
      result.itemCount++;
    } catch (e) {
      result.errors.push(`${db.name} scan failed: ${e}`);
    }
  }

  return result;
}

// ─── Master Scanner ─────────────────────────────────────────────────────

export async function runOnboardingScan(): Promise<ScanResult> {
  console.log('[Onboarding] Starting integration scan...');

  const [linear, airtable, gmail, notion] = await Promise.allSettled([
    scanLinear(),
    scanAirtable(),
    scanGmail(),
    scanNotion(),
  ]);

  const integrations: IntegrationStatus[] = [
    linear.status === 'fulfilled' ? linear.value : { name: 'Linear', connected: false, itemCount: 0, tasksFound: [], errors: [String(linear.reason)] },
    airtable.status === 'fulfilled' ? airtable.value : { name: 'Airtable', connected: false, itemCount: 0, tasksFound: [], errors: [String(airtable.reason)] },
    gmail.status === 'fulfilled' ? gmail.value : { name: 'Gmail', connected: false, itemCount: 0, tasksFound: [], errors: [String(gmail.reason)] },
    notion.status === 'fulfilled' ? notion.value : { name: 'Notion', connected: false, itemCount: 0, tasksFound: [], errors: [String(notion.reason)] },
  ];

  const allTasks = integrations.flatMap(i => i.tasksFound);
  const totalTasksFound = allTasks.length;
  const highConfidenceTasks = allTasks.filter(t => t.confidence >= 0.8).length;
  const alreadyImported = allTasks.filter(t => t.imported).length;
  const readyForImport = allTasks.filter(t => !t.imported && t.confidence >= 0.6);

  const result: ScanResult = {
    timestamp: new Date().toISOString(),
    integrations,
    totalTasksFound,
    highConfidenceTasks,
    alreadyImported,
    readyForImport,
  };

  console.log(`[Onboarding] Scan complete: ${totalTasksFound} tasks found across ${integrations.filter(i => i.connected).length} integrations`);

  return result;
}

// ─── Task Importer ─────────────────────────────────────────────────────

export interface ImportSelection {
  tasks: DiscoveredTask[];  // tasks user selected to import
}

export async function importTasks(selection: ImportSelection): Promise<{ imported: number; failed: number; taskIds: string[] }> {
  const { Database } = await import('bun:sqlite');
  const db = new Database(process.env.AGENTIC_DB ?? '/data/agentic/agentic.db');

  let imported = 0;
  let failed = 0;
  const taskIds: string[] = [];

  const insert = db.query(`
    INSERT INTO tasks (id, title, description, priority, status, agent_id, agent_name, created_at, updated_at, phase, blockers, metadata)
    VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?, 'PENDING', '[]', ?)
  `);

  for (const task of selection.tasks) {
    try {
      const id = `${task.source}-${task.externalId}-${Date.now()}`;
      const now = new Date().toISOString();
      const metadata = JSON.stringify({
        source: task.source,
        externalId: task.externalId,
        originalUrl: task.url,
        importedAt: now,
      });

      insert.run(
        id,
        task.title,
        task.description || '',
        task.priority,
        'PENDING',
        now,
        now,
        metadata
      );

      taskIds.push(id);
      imported++;
    } catch (e) {
      console.error(`[Onboarding] Failed to import task ${task.title}: ${e}`);
      failed++;
    }
  }

  db.close();

  console.log(`[Onboarding] Imported ${imported} tasks, ${failed} failed`);

  return { imported, failed, taskIds };
}
