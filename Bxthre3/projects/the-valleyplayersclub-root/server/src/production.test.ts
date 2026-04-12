/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { test, expect } from "bun:test";
import { db, initDatabase } from "./db";

test("Database initialization and indexes", async () => {
  await initDatabase();
  
  // Check if games table exists
  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='games'");
  expect(tables.rows.length).toBe(1);

  // Check if indexes exist
  const indexes = await db.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'");
  expect(indexes.rows.length).toBeGreaterThanOrEqual(5);
});

test("Wallet creation and XP logic", async () => {
  const userId = "test-user-" + Date.now();
  
  // Initialize wallet
  await db.execute({
    sql: "INSERT INTO wallets (user_id, balance, xp, level) VALUES (?, ?, ?, ?)",
    args: [userId, 1000, 0, 1]
  });

  const wallet = await db.execute({
    sql: "SELECT * FROM wallets WHERE user_id = ?",
    args: [userId]
  });
  
  expect(wallet.rows[0].user_id).toBe(userId);
  expect(Number(wallet.rows[0].balance)).toBe(1000);
});
