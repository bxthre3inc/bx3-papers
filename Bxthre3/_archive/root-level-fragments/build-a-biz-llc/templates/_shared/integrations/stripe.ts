// Stripe Payment Integration
// Build-A-Biz / Bxthre3 Inc

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripe: Stripe | null = null;

export async function initializeStripe(publishableKey: string): Promise<Stripe> {
  if (!stripe) {
    stripe = await loadStripe(publishableKey);
  }
  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }
  return stripe;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
): Promise<{ clientSecret: string }> {
  // In production, call your backend
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });
  return response.json();
}

export { stripe };
