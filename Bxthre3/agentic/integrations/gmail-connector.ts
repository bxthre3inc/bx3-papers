// GmailConnector — Agentic ↔ Gmail Integration
// Wires Gmail into Agentic's Truth Gate + context enrichment

import type { Context } from "hono";

// Label mapping: investor category → Gmail label
const LABEL_MAP: Record<string, string> = {
  INVESTOR: "INBOX",
  GRANT: "INBOX",
  OPERATIONS: "INBOX",
  VPC: "INBOX",
  IRRIG8: "INBOX",
};

export async function getRecentInvestorEmails(bxthre3inc: any, days: number = 7) {
  const query = `after:${new Date(Date.now() - days * 86400000).toISOString().split("T")[0]} (investor OR funding OR equity OR partnership)`;
  return bxthre3inc("gmail-find-email", {
    configured_props: { q: query, maxResults: 20, withTextPayload: true },
    email: "bxthre3inc@gmail.com",
  });
}

export async function getGrantEmails(bxthre3inc: any, days: number = 30) {
  const query = `after:${new Date(Date.now() - days * 86400000).toISOString().split("T")[0]} (grant OR SBIR OR USDA OR water court)`;
  return bxthre3inc("gmail-find-email", {
    configured_props: { q: query, maxResults: 10, withTextPayload: true },
    email: "bxthre3inc@gmail.com",
  });
}

export async function autoLabelEmail(bxthre3inc: any, messageId: string, category: string) {
  // Label assignment based on category detection
  const labelId = LABEL_MAP[category] || "INBOX";
  // Note: need actual label IDs - this creates dynamic labeling
  return bxthre3inc("gmail-add-label-to-email", {
    configured_props: { message: messageId, addLabelIds: [labelId] },
    email: "bxthre3inc@gmail.com",
  });
}

export async function sendAgentNotification(bxthre3inc: any, to: string, subject: string, body: string) {
  return bxthre3inc("gmail-send-email", {
    configured_props: { to, subject, body, bodyType: "plaintext" },
    email: "bxthre3inc@gmail.com",
  });
}

export async function getUnreadPriority(bxthre3inc: any) {
  return bxthre3inc("gmail-find-email", {
    configured_props: { q: "is:unread (investor OR urgent OR P1 OR P2)", maxResults: 10 },
    email: "bxthre3inc@gmail.com",
  });
}
