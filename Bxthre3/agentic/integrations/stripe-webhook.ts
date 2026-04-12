// StripeWebhookHandler — Agentic event generator from Stripe events
// Converts payment events into Agentic events with DAP evaluation

import type { Context } from "hono";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";

export interface StripeContext {
  customer_email?: string;
  amount_cents?: number;
  currency?: string;
  status?: string;
  metadata?: Record<string, string>;
}

export function buildEventFromStripe(type: string, data: StripeContext) {
  const amount = data.amount_cents || 0;
  return {
    event_type: `fin.stripe.${type}`,
    tier_source: 1,
    vector: {
      t: Date.now(),
      s_x: 0, s_y: 0,
      z_negative: 0,
      z_positive: amount > 10000 ? 0.9 : amount > 1000 ? 0.5 : 0.1,
      c: 0.99, // Stripe data is high confidence
      l: "COMPLIANT",
      v_f: amount > 50000 ? 0.9 : 0.5,
      e: amount,
      g: "APPROVED",
    },
    execution: { plane_triggered: [1, 2, 4, 5, 7, 9] },
    metadata: {
      correlation_id: `stripe-${type}-${Date.now()}`,
      session_id: data.customer_email || "unknown",
    },
  };
}

export async function handlePaymentSucceeded(data: StripeContext) {
  return buildEventFromStripe("payment_succeeded", data);
}

export async function handleSubscriptionCreated(data: StripeContext) {
  return buildEventFromStripe("subscription_created", data);
}

export async function handleChargeFailed(data: StripeContext) {
  return buildEventFromStripe("charge_failed", { ...data, z_positive: 0.95 });
}
