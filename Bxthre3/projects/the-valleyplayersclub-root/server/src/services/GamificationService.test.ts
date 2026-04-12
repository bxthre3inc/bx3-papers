/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { test, expect, describe, beforeAll } from "bun:test";
import { GamificationService } from "./GamificationService";
import { SocialEngine } from "./SocialEngine";
import { PromotionService } from "./PromotionService";
import { AnalyticsService } from "./AnalyticsService";
import { initDatabase, db } from "../db";

describe("GamificationService & XP Mechanics", () => {
  const testUserId = "test-user-" + Date.now();

  beforeAll(async () => {
    await initDatabase();
    await db.execute(`
      INSERT OR IGNORE INTO wallets (user_id, xp, level, total_wagered, total_wins, total_spins)
      VALUES (?, 0, 1, 0, 0, 0)
    `, [testUserId]);
    
    // Ensure system_configs exists or mock it
    await db.execute(`
      CREATE TABLE IF NOT EXISTS system_configs (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS live_events (
        user_id TEXT,
        type TEXT,
        amount INTEGER,
        metadata TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  test("XP Calculation with Multipliers", async () => {
    // 1. Base XP
    const initialXP = 0;
    const addedXP = 100;
    
    // Force Happy Hour by mocking PromotionService? 
    // Or just test the default 1.0x if it's not Happy Hour now.
    const multiplier = await PromotionService.getGlobalXPMultiplier();
    const result = await GamificationService.addXP(testUserId, addedXP);
    
    expect(result.xp).toBe(initialXP + Math.floor(addedXP * multiplier));
  });

  test("Major Achievement Social Broadcast", async () => {
    // Mock enough spins to trigger a Gold achievement (10,000 spins)
    await db.execute(`UPDATE wallets SET total_spins = 9999 WHERE user_id = ?`, [testUserId]);
    
    // Mock the achievement 'slot_master_gold' in the achievements table if it doesn't exist
    await db.execute(`
      INSERT OR IGNORE INTO achievements (id, name, description, xp_reward, reward_amount) 
      VALUES ('slot_master_gold', 'Slot Master Gold', 'Spin 10k times', 1000, 1000)
    `);

    const unlocked = await GamificationService.checkAchievements(testUserId, { 
      gameCategory: 'slots',
      wager: 10,
      payout: 0
    });

    expect(unlocked).toContain('slot_master_gold');

    // Verify Social Broadcast
    const feed = await SocialEngine.getLiveFeed(5);
    const achievementEvent = (feed as any[]).find(e => e.type === 'achievement_unlock');
    
    expect(achievementEvent).toBeDefined();
    const metadata = JSON.parse(achievementEvent.metadata);
    expect(metadata.achievementId).toBe('slot_master_gold');
    expect(metadata.rank).toBe('gold');
  });

  test("Behavioral Archetype XP Boost", async () => {
    // Mock user as 'The Strategist' (1.2x boost)
    await db.execute(`
      INSERT OR REPLACE INTO player_insights (user_id, behavioral_archetype, payday_score, updated_at)
      VALUES (?, 'The Strategist', 0.3, CURRENT_TIMESTAMP)
    `, [testUserId]);

    const initialResult = await db.execute({
      sql: 'SELECT xp FROM wallets WHERE user_id = ?',
      args: [testUserId]
    });
    const startXP = (initialResult.rows[0]?.xp as number) || 0;
    
    const addedXP = 100;
    const result = await GamificationService.addXP(testUserId, addedXP);
    
    // Expected = 100 * 1.0 (Happy Hour 1x) * 1.2 (Strategist) = 120
    expect(result.xp).toBe(startXP + 120);
  });

  test("Real-time Social Event Emission", async () => {
    let capturedEvent: any = null;
    SocialEngine.onEvent((ev) => {
      capturedEvent = ev;
    });

    await SocialEngine.logBigWin(testUserId, 'test_game', 5000);
    
    expect(capturedEvent).toBeDefined();
    expect(capturedEvent.type).toBe('big_win');
    expect(capturedEvent.winAmount).toBe(5000);
  });
});
