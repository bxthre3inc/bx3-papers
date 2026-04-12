/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';
import type { WagerResult } from '../engine/types';
import { SocialEngine } from './SocialEngine';
import { PromotionService } from './PromotionService';
import { AnalyticsService } from './AnalyticsService';

export interface DailySpinResult {
  eligible: boolean;
  reward?: {
    type: 'cash' | 'bonus' | 'xp';
    amount: number;
    label: string;
  };
  nextSpinAt?: Date;
  error?: string;
}

export interface PlayerProgress {
  userId: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export class GamificationService {
  private static XP_PER_LEVEL = 1000;
  private static LEVEL_UP_REWARD = 500;

  /**
   * Check if user is eligible for a daily spin and execute it if requested.
   */
  static async processDailySpin(userId: string, execute: boolean = false): Promise<DailySpinResult> {
    const result = await db.execute({
      sql: 'SELECT last_spin_at, spin_count FROM daily_spins WHERE user_id = ?',
      args: [userId]
    });

    const now = new Date();
    let spinCount = 0;

    if (result && result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      if (row) {
        spinCount = (row.spin_count as number) || 0;
        if (row.last_spin_at) {
          const lastSpin = new Date(row.last_spin_at as string);
          const diff = now.getTime() - lastSpin.getTime();
          const hours24 = 24 * 60 * 60 * 1000;

          if (diff < hours24) {
            return {
              eligible: false,
              nextSpinAt: new Date(lastSpin.getTime() + hours24)
            };
          }
        }
      }
    }

    if (!execute) return { eligible: true };

    // Execute Spin Logic - Fetch weighted rewards from DB
    const rewardsResult = await db.execute('SELECT type, amount, weight, label FROM spin_rewards WHERE is_active = 1');
    const rewards = rewardsResult.rows as unknown as { type: string, amount: number, weight: number, label: string }[];
    
    if (rewards.length === 0) throw new Error('No active rewards configured');

    const totalWeight = rewards.reduce((sum, r) => sum + (r.weight || 0), 0);
    let random = Math.random() * totalWeight;
    let reward = rewards[0];

    for (const r of rewards) {
      if (random < r.weight) {
        reward = r;
        break;
      }
      random -= r.weight;
    }

    const newSpinCount = spinCount + 1;

    await db.execute({
      sql: 'INSERT OR REPLACE INTO daily_spins (user_id, last_spin_at, spin_count) VALUES (?, CURRENT_TIMESTAMP, ?)',
      args: [userId, newSpinCount]
    });

    if (reward && (reward.type === 'cash' || reward.type === 'bonus')) {
      await WalletProcessor.processTransaction(userId, reward.amount, 'bonus', 'daily_wheel');
    } else if (reward && reward.type === 'xp') {
      await this.addXP(userId, reward.amount);
    }

    // Trigger Daily Spinner Achievement
    if (newSpinCount >= 5) {
      await this.unlockAchievement(userId, 'daily_spinner');
    }

    return {
      eligible: true,
      reward: reward as unknown as DailySpinResult['reward'],
      nextSpinAt: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    };
  }

  /**
   * Awards XP to a user and handles level-up rewards
   */
  static async addXP(userId: string, amount: number): Promise<{ xp: number, level: number, leveledUp: boolean }> {
    const wallet = await db.execute({
      sql: 'SELECT xp, level FROM wallets WHERE user_id = ?',
      args: [userId]
    });

    if (wallet.rows.length === 0) throw new Error('User not found');

    const row = wallet.rows[0] as unknown as { xp: number, level: number };
    if (!row) throw new Error('User data corrupted');
    
    const baseXP = amount;
    const happyHourMultiplier = await PromotionService.getGlobalXPMultiplier();
    
    // Archetype Boost
    const insights = await AnalyticsService.getPlayerInsights(userId);
    let behavioralMultiplier = 1.0;
    if (insights) {
      if (insights.behavioral_archetype === 'The Strategist') behavioralMultiplier = 1.2;
      if (insights.behavioral_archetype === 'Impulsive Explorer') behavioralMultiplier = 1.1;
    }

    const finalXP = Math.floor(baseXP * happyHourMultiplier * behavioralMultiplier);

    const currentXP = ((row.xp as number) || 0) + finalXP;
    let currentLevel = (row.level as number) || 1;
    let leveledUp = false;

    // Dynamic XP Curve: XP_REQUIRED = 1000 * (1.15 ^ (LEVEL - 1))
    // To find level for given XP, we solve for LEVEL:
    // XP = sum(1000 * 1.15^i) for i from 0 to LEVEL-2
    // For simplicity in MVP, we calculate the required XP for the NEXT level
    const getXPForLevel = (level: number) => {
      let total = 0;
      for (let i = 0; i < level - 1; i++) {
        total += Math.floor(1000 * Math.pow(1.15, i));
      }
      return total;
    };

    let newLevel = currentLevel;
    while (currentXP >= getXPForLevel(newLevel + 1)) {
      newLevel++;
    }

    if (newLevel > currentLevel) {
      leveledUp = true;
      currentLevel = newLevel;
      console.log(`[LEVEL UP] User ${userId} reached Level ${currentLevel} (XP Boost: ${happyHourMultiplier}x)`);
      
      // Grant level up rewards (500 Bonus VLY per level)
      await WalletProcessor.processTransaction(userId, 500, 'bonus', 'system', 'level-up-reward');

      // Check level-based achievements
      if (currentLevel >= 50) await this.unlockAchievement(userId, 'level_up_50');
      else if (currentLevel >= 20) await this.unlockAchievement(userId, 'level_up_20');
      else if (currentLevel >= 10) await this.unlockAchievement(userId, 'level_up_10');
      else if (currentLevel >= 5) await this.unlockAchievement(userId, 'level_up_5');
    }

    await db.execute({
      sql: 'UPDATE wallets SET xp = ?, level = ? WHERE user_id = ?',
      args: [currentXP, currentLevel, userId]
    });

    return { xp: currentXP, level: currentLevel, leveledUp };
  }

  /**
   * Automated Achievement Automated Check
   */
  static async checkAchievements(userId: string, gameResult: Partial<WagerResult>): Promise<string[]> {
    const unlocked: string[] = [];
    
    // 1. Fetch current player stats
    const walletResult = await db.execute({
      sql: 'SELECT total_wagered, total_wins, total_spins, current_win_streak, current_loss_streak, last_play_at, login_streak FROM wallets WHERE user_id = ?',
      args: [userId]
    });
    
    if (walletResult.rows.length === 0) return [];
    const wallet = walletResult.rows[0] as unknown as { 
      total_wagered: number, 
      total_wins: number, 
      total_spins: number,
      current_win_streak: number,
      current_loss_streak: number,
      last_play_at: string,
      login_streak: number
    };
    
    // 2. Update Stats
    const wager = gameResult.wager || 0;
    const payout = gameResult.payout || 0;
    const isWin = payout > 0;
    const isSlot = gameResult.gameCategory === 'slots';
    
    const newTotalWagered = (wallet.total_wagered || 0) + wager;
    const newTotalWins = (wallet.total_wins || 0) + (isWin ? 1 : 0);
    const newTotalSpins = (wallet.total_spins || 0) + (isSlot ? 1 : 0);
    
    const newWinStreak = isWin ? (wallet.current_win_streak || 0) + 1 : 0;
    const newLossStreak = !isWin ? (wallet.current_loss_streak || 0) + 1 : 0;
    
    // Login / Daily Streak Logic
    const now = new Date();
    const lastPlay = wallet.last_play_at ? new Date(wallet.last_play_at) : null;
    let newLoginStreak = wallet.login_streak || 1;
    
    if (lastPlay) {
      const diffDays = Math.floor((now.getTime() - lastPlay.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newLoginStreak += 1;
      } else if (diffDays > 1) {
        newLoginStreak = 1;
      }
    }

    await db.execute({
      sql: `UPDATE wallets SET 
            total_wagered = ?, 
            total_wins = ?, 
            total_spins = ?, 
            current_win_streak = ?, 
            current_loss_streak = ?, 
            last_play_at = CURRENT_TIMESTAMP, 
            login_streak = ? 
            WHERE user_id = ?`,
      args: [newTotalWagered, newTotalWins, newTotalSpins, newWinStreak, newLossStreak, newLoginStreak, userId]
    });
    
    // 3. Evaluate Rules
    // --- Mega-Achievement Tiers ---
    const checkTiered = async (statValue: number, tiers: number[], baseId: string) => {
      if (!tiers) return;
      const tierLevels = ['bronze', 'silver', 'gold', 'platinum'];
      for (let i = tiers.length - 1; i >= 0; i--) {
        if (statValue >= tiers[i]) {
          const rank = tierLevels[i];
          const achievementId = `${baseId}_${rank}`;
          if (await this.unlockAchievement(userId, achievementId)) {
            unlocked.push(achievementId);
            // Broadcast major unlocks (Gold/Platinum)
            if (i >= 2 && rank) { 
               await SocialEngine.logAchievement(userId, achievementId, rank);
            }
          }
          break; // Only unlock the highest tier
        }
      }
    };

    await checkTiered(newTotalSpins, [100, 1000, 10000, 100000], 'slot_master');
    await checkTiered(newTotalWagered, [1000, 10000, 100000, 1000000], 'whale_watcher');
    await checkTiered(newLoginStreak, [3, 7, 30, 365], 'daily_warrior');

    return unlocked;
  }

  /**
   * Unlock an achievement for a player.
   */
  static async unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      // Check if already unlocked
      const existing = await db.execute({
        sql: 'SELECT 1 FROM player_achievements WHERE user_id = ? AND achievement_id = ?',
        args: [userId, achievementId]
      });

      if (existing.rows.length > 0) return false;

      // Fetch achievement details
      const achievement = await db.execute({
        sql: 'SELECT name, xp_reward, reward_amount FROM achievements WHERE id = ?',
        args: [achievementId]
      });

      if (achievement.rows.length === 0) return false;

      const achievementRow = achievement.rows[0] as unknown as { name: string, xp_reward: number, reward_amount: number };
      const xp_reward = achievementRow.xp_reward || 0;
      const reward_amount = achievementRow.reward_amount || 0;

      await db.execute({
        sql: 'INSERT INTO player_achievements (user_id, achievement_id) VALUES (?, ?)',
        args: [userId, achievementId]
      });

      console.log(`[🏆 ACHIEVEMENT] User ${userId} unlocked: ${achievementRow.name}`);

      if (xp_reward > 0) await this.addXP(userId, xp_reward);
      if (reward_amount > 0) {
        await WalletProcessor.processTransaction(userId, reward_amount, 'bonus', `achievement_${achievementId}`);
      }

      return true;
    } catch (e) {
      console.error('Achievement Unlock Error:', e);
      return false;
    }
  }

  /**
   * Get player progress and achievements.
   */
  static async getPlayerStats(userId: string) {
    const progress = await db.execute({
      sql: 'SELECT xp, level, total_wagered, total_wins, total_spins, current_win_streak, current_loss_streak, login_streak, last_play_at FROM wallets WHERE user_id = ?',
      args: [userId]
    });

    const achievements = await db.execute({
        sql: `
            SELECT a.*, pa.unlocked_at 
            FROM achievements a
            LEFT JOIN player_achievements pa ON a.id = pa.achievement_id AND pa.user_id = ?
        `,
        args: [userId]
    });

    return {
      progress: progress.rows[0],
      achievements: achievements.rows
    };
  }
}
