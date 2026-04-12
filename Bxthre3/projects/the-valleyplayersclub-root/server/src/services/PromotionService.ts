/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';

export interface VIPLevel {
  name: string;
  minXP: number;
  multiplier: number;
  color: string;
}

export const VIP_LEVELS: VIPLevel[] = [
  { name: 'Bronze', minXP: 0, multiplier: 1.0, color: '#cd7f32' },
  { name: 'Silver', minXP: 5000, multiplier: 1.1, color: '#c0c0c0' },
  { name: 'Gold', minXP: 25000, multiplier: 1.25, color: '#ffd700' },
  { name: 'Platinum', minXP: 100000, multiplier: 1.5, color: '#e5e4e2' }
];

export const REWARD_LADDER = [
  { day: 1, amount: 100, type: 'bonus', label: 'Day 1 Bonus' },
  { day: 2, amount: 200, type: 'bonus', label: 'Day 2 Bonus' },
  { day: 3, amount: 500, type: 'bonus', label: 'Day 3 Bonus' },
  { day: 4, amount: 1000, type: 'bonus', label: 'Day 4 Bonus' },
  { day: 5, amount: 2500, type: 'bonus', label: 'Day 5 Bonus' },
  { day: 6, amount: 5000, type: 'bonus', label: 'Day 6 Mega Bonus' },
  { day: 7, amount: 1, type: 'golden_spin', label: 'Lucky Day 7 Golden Spin' }
];

export class PromotionService {
  /**
   * Get Daily Wheel & Login Status for User
   */
  static async getDailyStatus(userId: string) {
    const result = await db.execute({
      sql: 'SELECT last_login_at, login_streak, last_spin_at FROM user_promos WHERE user_id = ?',
      args: [userId]
    });

    const now = new Date();
    if (result.rows.length === 0) {
      return { 
        canSpin: true, 
        canClaimLogin: true, 
        currentStreak: 0,
        nextReward: REWARD_LADDER[0]
      };
    }

    const row = result.rows[0] as unknown as { last_login_at: string, login_streak: number, last_spin_at: string };
    const lastLogin = row.last_login_at ? new Date(row.last_login_at) : null;
    const lastSpin = row.last_spin_at ? new Date(row.last_spin_at) : null;
    
    const diffHoursLogin = lastLogin ? (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60) : 25;
    const diffHoursSpin = lastSpin ? (now.getTime() - lastSpin.getTime()) / (1000 * 60 * 60) : 25;

    let streak = row.login_streak || 0;
    if (diffHoursLogin > 48) {
      streak = 0; // Reset streak if missed more than 1 day
    }

    return {
      canClaimLogin: diffHoursLogin >= 24,
      canSpin: diffHoursSpin >= 24,
      currentStreak: streak,
      nextReward: REWARD_LADDER[streak % 7]
    };
  }

  /**
   * Claim the Daily Login Reward
   */
  static async claimDailyLogin(userId: string) {
    const status = await this.getDailyStatus(userId);
    if (!status.canClaimLogin) throw new Error('Daily reward already claimed');

    const reward = status.nextReward;
    if (!reward) throw new Error('Reward data missing');
    const newStreak = status.currentStreak + 1;

    // Award Reward
    await WalletProcessor.processTransaction(userId, reward.amount, reward.type === 'golden_spin' ? 'bonus' : 'bonus', 'daily-login-ladder');
    
    await db.execute({
      sql: `INSERT INTO user_promos (user_id, last_login_at, login_streak) 
            VALUES (?, CURRENT_TIMESTAMP, ?) 
            ON CONFLICT(user_id) DO UPDATE SET last_login_at = CURRENT_TIMESTAMP, login_streak = ?`,
      args: [userId, newStreak, newStreak]
    });

    return { reward, newStreak };
  }

  /**
   * Calculate VIP Level and Multiplier
   */
  static getVIPLevel(xp: number): VIPLevel {
    const level = [...VIP_LEVELS].reverse().find(l => xp >= l.minXP);
    return level || (VIP_LEVELS[0] as VIPLevel);
  }

  /**
   * Get Global XP Multiplier (Happy Hour + Admin Overrides)
   */
  static async getGlobalXPMultiplier(): Promise<number> {
    let multiplier = 1.0;

    // Check for Happy Hour (e.g., 6PM - 8PM Server Time)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 18 && hour < 20) {
      console.log('[HAPPY HOUR] 2x XP Multiplier Active!');
      multiplier *= 2.0;
    }

    // Check for dynamic admin override in DB
    const override = await db.execute({
      sql: "SELECT value FROM system_configs WHERE key = 'xp_multiplier_override'",
      args: []
    });

    if (override.rows.length > 0) {
      const val = parseFloat(override.rows[0]?.value as string);
      if (!isNaN(val) && val > 0) multiplier *= val;
    }

    return multiplier;
  }

  /**
   * Initialize Promotion Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_promos (
        user_id TEXT PRIMARY KEY,
        last_login_at DATETIME,
        last_spin_at DATETIME,
        login_streak INTEGER DEFAULT 0,
        total_prizes INTEGER DEFAULT 0
      )
    `);
  }
}
