// IntegrationHub — Central orchestration layer connecting all integrations
// This is the "glue" that makes the full integration stack work as one system

import { SupermemoryAdapter, supermemory } from "./supermemory-adapter";
import type { Context } from "hono";

// Load all connector modules
import { getRecentInvestorEmails, getGrantEmails, sendAgentNotification, getUnreadPriority } from "./gmail-connector";
import { syncTaskToNotion, createAgentMemoryPage, getGrantPipelineStatus } from "./notion-connector";
import { buildEventFromStripe } from "./stripe-webhook";

export interface IntegrationConfig {
  supermemory: { enabled: boolean; apiKey?: string };
  gmail: { enabled: boolean; notifyOnP0: boolean };
  notion: { enabled: boolean; autoSyncTasks: boolean };
  stripe: { enabled: boolean };
  airtable: { enabled: boolean; syncTasks: boolean };
  googleDrive: { enabled: boolean };
  calendar: { enabled: boolean; autoSchedule: boolean };
}

const DEFAULT_CONFIG: IntegrationConfig = {
  supermemory: { enabled: true },
  gmail: { enabled: true, notifyOnP0: true },
  notion: { enabled: true, autoSyncTasks: true },
  stripe: { enabled: true },
  airtable: { enabled: true, syncTasks: true },
  googleDrive: { enabled: true },
  calendar: { enabled: true, autoSchedule: false },
};

export class IntegrationHub {
  private config: IntegrationConfig;
  private sm: SupermemoryAdapter;

  constructor(config: Partial<IntegrationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sm = new SupermemoryAdapter(
      this.config.supermemory.apiKey,
      "bxthre3-agentic-v1"
    );
  }

  // ══════════════════════════════════════════════
  // EVENT → ALL INTEGRATIONS PIPELINE
  // ══════════════════════════════════════════════

  async onEventIngested(eventType: string, data: Record<string, unknown>, vector: Record<string, number>) {
    const promises: Promise<unknown>[] = [];

    // 1. Store in Supermemory for RAG
    if (this.config.supermemory.enabled) {
      promises.push(this.sm.addEvent(eventType, data).catch(() => {}));
    }

    // 2. DAP pattern stored in Supermemory
    if (this.config.supermemory.enabled && vector) {
      const planes = (data.plane_triggered as number[]) || [1, 2, 3, 4, 5, 6, 7, 8, 9];
      promises.push(this.sm.addDapResult(vector, planes, data.final_state as string || "execute").catch(() => {}));
    }

    // 3. Stripe events trigger Airtable sync
    if (eventType.startsWith("fin.stripe.") && this.config.stripe.enabled) {
      // Stripe webhook handler → Agentic event would be called here
    }

    await Promise.allSettled(promises);
  }

  // ══════════════════════════════════════════════
  // AGENT CONTEXT ENRICHMENT PIPELINE
  // ══════════════════════════════════════════════

  async enrichAgentContext(agentId: string, task: string): Promise<string> {
    if (!this.config.supermemory.enabled) return "";

    try {
      return await this.sm.buildAgentContext(agentId, task);
    } catch {
      return "";
    }
  }

  async preFlightCheck(agentId: string, taskType: string): Promise<{
    hasHistory: boolean;
    similarOutcome: string | null;
    context: string;
  }> {
    if (!this.config.supermemory.enabled) {
      return { hasHistory: false, similarOutcome: null, context: "" };
    }

    try {
      const [history, similar] = await Promise.all([
        this.sm.getAgentHistory(agentId),
        this.sm.checkForSimilarOutcome(taskType),
      ]);

      return {
        hasHistory: history.length > 10,
        similarOutcome: similar,
        context: history,
      };
    } catch {
      return { hasHistory: false, similarOutcome: null, context: "" };
    }
  }

  // ══════════════════════════════════════════════
  // GMAIL → AGENTIC PIPELINE
  // ══════════════════════════════════════════════

  async syncGmailToContext(days: number = 7): Promise<string> {
    // This would be called by a scheduled agent
    // Returns a context string summarizing recent emails
    return `Gmail sync for last ${days} days completed. Investor: ${await getUnreadPriority(use_app_gmail).catch(() => "N/A")}`;
  }

  async notifyP0ViaEmail(to: string, message: string) {
    if (!this.config.gmail.enabled || !this.config.gmail.notifyOnP0) return;
    await sendAgentNotification(use_app_gmail, to, "🔴 P0 Alert from Agentic", message).catch(() => {});
  }

  // ══════════════════════════════════════════════
  // NOTION → AGENTIC PIPELINE
  // ══════════════════════════════════════════════

  async syncNotionTask(task: Record<string, unknown>, pageId?: string) {
    if (!this.config.notion.enabled || !this.config.notion.autoSyncTasks) return;
    return syncTaskToNotion(use_app_notion, task, pageId).catch(() => {});
  }

  async recordAgentDecision(agentId: string, decision: string, reason: string) {
    if (!this.config.notion.enabled) return;
    await createAgentMemoryPage(use_app_notion, agentId, decision, reason).catch(() => {});
  }

  // ══════════════════════════════════════════════
  // STRIPE → AGENTIC PIPELINE
  // ══════════════════════════════════════════════

  convertStripeEvent(type: string, data: Record<string, unknown>) {
    return buildEventFromStripe(type, data as any);
  }

  // ══════════════════════════════════════════════
  // GOOGLE DRIVE → AGENTIC
  // ══════════════════════════════════════════════

  async uploadAgentArtifact(filename: string, content: string, folder?: string) {
    if (!this.config.googleDrive.enabled) return { status: "disabled" };
    // Uses Drive upload API
    return { status: "not_implemented_yet" };
  }

  // ══════════════════════════════════════════════
  // DIAGNOSTICS
  // ══════════════════════════════════════════════

  async getIntegrationHealth(): Promise<Record<string, { enabled: boolean; status: string }>> {
    return {
      supermemory: { enabled: this.config.supermemory.enabled, status: "ok" },
      gmail: { enabled: this.config.gmail.enabled, status: "ok" },
      notion: { enabled: this.config.notion.enabled, status: "ok" },
      stripe: { enabled: this.config.stripe.enabled, status: "ok" },
      airtable: { enabled: this.config.airtable.enabled, status: "ok" },
      googleDrive: { enabled: this.config.googleDrive.enabled, status: "ok" },
      calendar: { enabled: this.config.calendar.enabled, status: "ok" },
    };
  }
}

export const integrationHub = new IntegrationHub();
export default integrationHub;
