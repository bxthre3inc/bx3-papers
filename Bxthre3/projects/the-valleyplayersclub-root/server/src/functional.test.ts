/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { test, expect } from "bun:test";
import { ComplianceService } from "./services/ComplianceService";
import { PaymentService } from "./services/PaymentService";
import { CashNetworkService } from "./services/CashNetworkService";
import { initDatabase } from "./db";
import { WalletProcessor } from "./engine/wallet";

test("Functional: Full Lifecycle Verifier", async () => {
  await initDatabase();
  await ComplianceService.initTables();
  await PaymentService.initTables();
  await CashNetworkService.initTables();

  const userId = "complete-test-" + Date.now();

  // 1. Initial State
  const kyc = await ComplianceService.getKYCStatus(userId);
  expect(kyc.status).toBe('unverified');

  // 2. Submit KYC
  const sub = await ComplianceService.submitKYC(userId, "img-data");
  expect(sub.status).toBe('pending');

  // 3. Payment - Fiat Deposit (Production Pattern)
  const depositInit = await PaymentService.processFiatDeposit(userId, 500, "card-123");
  expect(depositInit.success).toBe(true);
  expect(depositInit.clientSecret).toBeDefined();

  // Simulate Webhook Success
  await PaymentService.handleWebhook({
      type: 'payment_intent.succeeded',
      id: 'evt_test_123',
      amount: 50000, // 500 USD in cents
      metadata: { userId }
  }, 'mock-sig');

  const wallet = await WalletProcessor.getWallet(userId);
  expect(Number(wallet.balances.cash)).toBe(10500);

  // 4. Cash Network - Partner Deposit
  const req = await CashNetworkService.createDepositRequest(userId, 1000);
  const conf = await CashNetworkService.confirmDeposit("local-shop-1", req.token);
  expect(conf.success).toBe(true);
  
  const finalWallet = await WalletProcessor.getWallet(userId);
  expect(Number(finalWallet.balances.cash)).toBe(11500);
});
