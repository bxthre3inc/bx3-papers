import { Hono } from "hono";
import { cors } from "hono/cors";

const PORT = parseInt(process.env.BRIDGE_PORT || "8888");
const ZO_API = process.env.ZO_API_ENDPOINT || "http://localhost:3099";
const AGENTOS_API = process.env.AGENTOS_API_ENDPOINT || "http://localhost:9999";
const BRIDGE_SECRET = process.env.BRIDGE_SECRET || "dev-bridge-secret";

async function callZoAPI(input: string): Promise<any> {
  const response = await fetch(`${ZO_API}/zo/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  });
  const data = await response.json();
  return data.output || data;
}

async function callAgentOS(endpoint: string, method = "GET", body?: any): Promise<any> {
  const headers: any = { "X-Mesh-Token": BRIDGE_SECRET };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${AGENTOS_API}${endpoint}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined
  });
  return res.ok ? await res.json() : { error: res.statusText, status: res.status };
}

const zoTools: Record<string, (args: any) => Promise<any>> = {
  "zo_ask": async ({ question }) => await callZoAPI(question),
  "zo_gmail_read": async ({ maxResults = 20 }) => await callZoAPI(`Read last ${maxResults} Gmail emails`),
  "zo_gmail_send": async ({ to, subject, body }) => await callZoAPI(`Send email to ${to}: ${subject} - ${body}`),
  "zo_calendar_list": async ({ timeMin, timeMax }) => await callZoAPI(`List calendar from ${timeMin} to ${timeMax}`),
  "zo_notion_read": async ({ blockId }) => await callZoAPI(`Read Notion ${blockId}`),
  "zo_airtable_list": async ({ baseId, tableName }) => await callZoAPI(`List Airtable ${baseId}/${tableName}`),
  "zo_linear_list": async () => await callZoAPI("List Linear issues"),
  "zo_file_read": async ({ path }) => await callZoAPI(`Read file ${path}`),
  "zo_file_search": async ({ query }) => await callZoAPI(`Search files for ${query}`),
  "zo_web_search": async ({ query }) => await callZoAPI(`Search web ${query}`),
  "zo_automation_list": async () => await callZoAPI("List scheduled agents"),
  "zo_sms_send": async ({ message }) => await callZoAPI(`SMS brodiblanco: ${message}`),
  "zo_space_list": async () => await callZoAPI("List zo.space routes")
};

const agenticTools: Record<string, (args: any) => Promise<any>> = {
  "agentic_list_agents": async () => await callAgentOS("/agents"),
  "agentic_get_status": async () => await callAgentOS("/status"),
  "agentic_inbox_list": async () => await callAgentOS("/inbox"),
  "agentic_inbox_add": async (args) => await callAgentOS("/tasks/submit", "POST", { type: "inbox.process", payload: args }),
  "agentic_task_create": async ({ type, payload }) => await callAgentOS("/tasks/submit", "POST", { type, payload })
};

const app = new Hono();
app.use("*", cors());

app.get("/health", () => new Response("OK"));
app.get("/tools", () => Response.json({ zo_tools: Object.keys(zoTools), agentic_tools: Object.keys(agenticTools) }));

app.post("/call", async (c) => {
  const { tool, args = {} } = await c.req.json();
  const allTools = { ...zoTools, ...agenticTools };
  const handler = allTools[tool];
  if (!handler) return c.json({ success: false, error: `Unknown tool: ${tool}` }, 404);
  try {
    const result = await handler(args);
    return c.json({ success: true, result, tool });
  } catch (e: any) {
    return c.json({ success: false, error: e.message, tool });
  }
});

console.log(`[Agentic↔Zo] Bridge on :${PORT}`);
Bun.serve({ fetch: app.fetch, port: PORT });
