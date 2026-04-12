/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { test, expect } from "bun:test";
import { PaymentService } from "./services/PaymentService";
import { initDatabase } from "./db";
import { WalletProcessor } from "./engine/wallet";

test("Extended Payments: BTC and CashApp Flow", async () => {
  await initDatabase();
  await PaymentService.initTables();

  const userId = "extended-test-" + Date.now();

  // 1. Generate BTC Deposit
  const btc = await PaymentService.generateBitcoinDeposit(userId, 1000);
  expect(btc.address).toBeDefined();
  expect(btc.qrData).toContain("bitcoin:");
  expect(Number(btc.amount)).toBe(1000);

  // 2. Generate CashApp Deposit
  const cashapp = await PaymentService.generateCashAppDeposit(userId, 500);
  expect(cashapp.cashtag).toBe("$ValleyPlayersClub");
  expect(cashapp.qrData).toContain("cash.app");
  expect(Number(cashapp.amount)).toBe(500);

  // 3. Confirm BTC Payment (Mock)
  // We need to find the request ID from the DB
  const { db } = await import("./db");
  const requests = await db.execute({
    sql: "SELECT id FROM payment_requests WHERE user_id = ? AND type = ?",
    args: [userId, 'btc']
  });
  const requestId = requests.rows[0].id;

  const confirm = await PaymentService.confirmPayment(String(requestId), "mock-tx-hash");
  expect(confirm.success).toBe(true);

  // 4. Verify Wallet
  const wallet = await WalletProcessor.getWallet(userId);
  // Default 10000 + 1000 BTC deposit
  expect(Number(wallet.balances.cash)).toBe(11000);
});
