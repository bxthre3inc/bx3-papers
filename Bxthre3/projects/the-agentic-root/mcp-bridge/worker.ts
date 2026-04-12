/**
 * Agentic MCP Worker
 * 
 * Connects Agentic to the bridge, allowing Agentic agents to:
 * - Call Zo tools (integrations, files, web search, etc.)
 * - Access all Zo capabilities
 */

const BRIDGE_URL = process.env.BRIDGE_URL || "http://localhost:8888";
const AGENTOS_ID = process.env.AGENTOS_NODE_ID || `agentic-worker-${crypto.randomUUID().slice(0, 8)}`;
const POLL_INTERVAL = 5000; // 5 seconds

interface ToolCall {
  callId: string;
  tool: string;
  args: Record<string, unknown>;
}

async function pollForTasks(): Promise<ToolCall[]> {
  try {
    const res = await fetch(`${BRIDGE_URL}/poll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId: AGENTOS_ID })
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tasks || [];
  } catch {
    return [];
  }
}

async function executeTool(tool: string, args: any): Promise<any> {
  console.log(`[Worker] Executing: ${tool}`);
  try {
    const res = await fetch(`${BRIDGE_URL}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool, args })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function reportResult(callId: string, result: any): Promise<void> {
  try {
    await fetch(`${BRIDGE_URL}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callId, nodeId: AGENTOS_ID, result })
    });
  } catch {
    // Silent fail
  }
}

async function workerLoop(): Promise<void> {
  console.log(`[Agentic Worker] ${AGENTOS_ID} starting...`);
  console.log(`[Agentic Worker] Connected to bridge at ${BRIDGE_URL}`);
  
  while (true) {
    try {
      const tasks = await pollForTasks();
      for (const task of tasks) {
        const output = await executeTool(task.tool, task.args);
        await reportResult(task.callId, output);
      }
    } catch (e) {
      console.error("[Worker] Error:", e);
    }
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
}

// === DIRECT TOOL API ===
export async function callZoTool(tool: string, args: any = {}): Promise<any> {
  const res = await fetch(`${BRIDGE_URL}/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, args })
  });
  return await res.json();
}

// Convenience wrappers for common operations
export const zo = {
  ask: (question: string) => callZoTool("zo_ask", { question }),
  gmail: {
    read: (maxResults = 20) => callZoTool("zo_gmail_read", { maxResults }),
    send: (to: string, subject: string, body: string) => callZoTool("zo_gmail_send", { to, subject, body })
  },
  calendar: {
    list: (timeMin: string, timeMax: string) => callZoTool("zo_calendar_list", { timeMin, timeMax })
  },
  notion: {
    read: (blockId: string) => callZoTool("zo_notion_read", { blockId }),
    write: (parentId: string, markdown: string) => callZoTool("zo_notion_write", { parentId, markdown })
  },
  airtable: {
    list: (baseId: string, tableName: string) => callZoTool("zo_airtable_list", { baseId, tableName }),
    create: (baseId: string, tableName: string, fields: any) => callZoTool("zo_airtable_create", { baseId, tableName, fields })
  },
  linear: {
    list: () => callZoTool("zo_linear_list"),
    create: (title: string, description: string) => callZoTool("zo_linear_create", { title, description })
  },
  file: {
    read: (path: string) => callZoTool("zo_file_read", { path }),
    search: (query: string) => callZoTool("zo_file_search", { query })
  },
  web: {
    search: (query: string) => callZoTool("zo_web_search", { query })
  },
  sms: (message: string) => callZoTool("zo_sms_send", { message }),
  space: {
    list: () => callZoTool("zo_space_list")
  }
};

// Start worker if run directly
if (import.meta.main) {
  workerLoop();
}

export { workerLoop };
