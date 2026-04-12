/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface TransactionResult {
  success: boolean;
  newBalance: number;
  transactionId?: string;
  error?: string;
}

export interface PlayerWallet {
  userId: string;
  balances: {
    cash: number;
    bonus: number;
  };
  xp: number;
  level: number;
  currency: string;
  updatedAt: string;
}

export class WalletProcessor {
  /**
   * Securely gets or creates a wallet for a user.
   */
  static async getWallet(userId: string): Promise<PlayerWallet> {
    const result = await db.execute({
      sql: 'SELECT balance, xp, level, currency, updated_at FROM wallets WHERE user_id = ?',
      args: [userId]
    });

    if (result.rows.length === 0) {
      const defaultBalance = 10000;
      await db.execute({
        sql: 'INSERT INTO wallets (user_id, balance, xp, level) VALUES (?, ?, 0, 1)',
        args: [userId, defaultBalance]
      });
      return {
        userId,
        balances: { cash: defaultBalance, bonus: 0 },
        currency: 'VLY',
        xp: 0,
        level: 1,
        updatedAt: new Date().toISOString()
      };
    }

    const row = result.rows[0];
    if (!row) throw new Error('Database integrity error: Wallet row missing');

    return {
      userId,
      balances: { cash: row.balance as number, bonus: 0 },
      currency: (row.currency as string) || 'VLY',
      xp: (row.xp as number) || 0,
      level: (row.level as number) || 1,
      updatedAt: row.updated_at as string
    };
  }

  /**
   * Atomically processes a wager or win with safety checks.
   */
  static async processTransaction(
    userId: string, 
    amount: number, 
    type: 'wager' | 'win' | 'deposit' | 'withdrawal' | 'bonus', 
    gameId?: string,
    referenceId?: string
  ): Promise<TransactionResult> {
    try {
      // 1. Check for exclusions
      const exclusionResult = await db.execute({
        sql: 'SELECT status, ends_at FROM player_exclusions WHERE user_id = ? AND (ends_at IS NULL OR ends_at > CURRENT_TIMESTAMP)',
        args: [userId]
      });

      if (exclusionResult.rows.length > 0) {
        const exclusion = exclusionResult.rows[0];
        return { success: false, newBalance: 0, error: `Account is ${exclusion.status}. Ends: ${exclusion.ends_at || 'Permanent'}` };
      }

      // 2. Performance deterministic safety checks
      if (type === 'deposit') {
        const limits = await db.execute({
          sql: 'SELECT daily_deposit_limit FROM player_limits WHERE user_id = ?',
          args: [userId]
        });
        
        if (limits.rows.length > 0 && limits.rows[0]?.daily_deposit_limit) {
          const limit = limits.rows[0].daily_deposit_limit as number;
          const todayDeposits = await db.execute({
            sql: "SELECT SUM(amount) as total FROM transactions WHERE user_id = ? AND type = 'deposit' AND timestamp >= date('now')",
            args: [userId]
          });
          const total = (todayDeposits.rows[0]?.total as number) || 0;
          if (total + amount > limit) {
            return { success: false, newBalance: 0, error: `Daily deposit limit of ${limit} exceeded` };
          }
        }
      }

      if (type === 'wager') {
        const limits = await db.execute({
          sql: 'SELECT daily_loss_limit FROM player_limits WHERE user_id = ?',
          args: [userId]
        });

        if (limits.rows.length > 0 && limits.rows[0]?.daily_loss_limit) {
          const limit = limits.rows[0].daily_loss_limit as number;
          // Calculate net loss today (wagers - wins)
          const todayStats = await db.execute({
            sql: "SELECT SUM(CASE WHEN type = 'wager' THEN amount ELSE 0 END) as wagers, SUM(CASE WHEN type = 'win' THEN amount ELSE 0 END) as wins FROM transactions WHERE user_id = ? AND timestamp >= date('now')",
            args: [userId]
          });
          const wagers = Math.abs((todayStats.rows[0]?.wagers as number) || 0);
          const wins = (todayStats.rows[0]?.wins as number) || 0;
          const netLoss = wagers - wins;

          if (netLoss + Math.abs(amount) > limit) {
             return { success: false, newBalance: 0, error: `Daily loss limit of ${limit} exceeded` };
          }
        }
      }

      const wallet = await this.getWallet(userId);
      const isDeduction = type === 'wager' || type === 'withdrawal';
      const currentBalance = wallet.balances.cash;
      
      if (isDeduction && currentBalance < Math.abs(amount)) {
        return { success: false, newBalance: currentBalance, error: 'Insufficient Funds' };
      }

      const newBalance = isDeduction ? currentBalance - Math.abs(amount) : currentBalance + Math.abs(amount);
      const transactionId = uuidv4();

      await db.batch([
        {
          sql: 'UPDATE wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
          args: [newBalance, userId]
        },
        {
          sql: 'INSERT INTO transactions (id, user_id, type, amount, game_id, reference_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
          args: [transactionId, userId, type, amount, gameId || 'system', referenceId || null]
        }
      ], "write");

      return { success: true, newBalance, transactionId };
    } catch (err) {
      console.error('Wallet Transaction Error:', err);
      return { success: false, newBalance: 0, error: 'Critical Wallet Error' };
    }
  }
}
