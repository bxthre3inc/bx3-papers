/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { EventEmitter } from 'events';
import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';

export interface SyndicatePool {
  id: string;
  gameId: string;
  totalWagered: number;
  participants: string[];
  status: 'open' | 'active' | 'completed';
}

export interface JackpotState {
  currentValue: number;
  lastWinner?: string;
  lastWinAmount?: number;
}

export class SocialEngine {
  private static eventEmitter = new EventEmitter();
  private static jackpotValue: number = 50000; // Starting value
  private static incrementRate: number = 0.01; // 1% of wagers go to jackpot

  /**
   * Subscribe to live events
   */
  static onEvent(callback: (event: Record<string, unknown>) => void) {
    this.eventEmitter.on('live_event', callback);
  }

  /**
   * Get Current Global Jackpot State
   */
  static getJackpotState(): JackpotState {
    return {
      currentValue: Math.floor(this.jackpotValue),
    };
  }

  /**
   * Contribute to Jackpot
   */
  static contribute(amount: number) {
    this.jackpotValue += amount * this.incrementRate;
  }

  /**
   * Log a "Big Win" for the Live Feed
   */
  static async logBigWin(userId: string, gameId: string, winAmount: number) {
    if (winAmount < 1000) return; // Only log "Big Wins"

    const event = { userId, type: 'big_win', winAmount, gameId, timestamp: new Date().toISOString() };
    
    await db.execute({
      sql: 'INSERT INTO live_events (user_id, type, amount, metadata) VALUES (?, ?, ?, ?)',
      args: [userId, 'big_win', winAmount, JSON.stringify(event)]
    });

    this.eventEmitter.emit('live_event', event);
    
    return event;
  }

  /**
   * Log an Achievement Unlock for the Live Feed
   */
  static async logAchievement(userId: string, achievementId: string, rank: string) {
    const event = { userId, type: 'achievement_unlock', achievementId, rank, timestamp: new Date().toISOString() };

    await db.execute({
      sql: 'INSERT INTO live_events (user_id, type, amount, metadata) VALUES (?, ?, ?, ?)',
      args: [
        userId, 
        'achievement_unlock', 
        0, 
        JSON.stringify(event)
      ]
    });

    this.eventEmitter.emit('live_event', event);
    
    return event;
  }

  /**
   * Get Recent Live Feed Events
   */
  static async getLiveFeed(limit: number = 10) {
    const result = await db.execute({
      sql: 'SELECT user_id, type, amount, metadata, timestamp FROM live_events ORDER BY timestamp DESC LIMIT ?',
      args: [limit]
    });
    return result.rows;
  }

  /**
   * Trigger a Jackpot Win (Mock/Event based)
   */
  static async triggerJackpotWin(userId: string) {
    const winAmount = Math.floor(this.jackpotValue);
    this.jackpotValue = 50000; // Reset

    await db.execute({
      sql: 'INSERT INTO live_events (user_id, type, amount, metadata) VALUES (?, ?, ?, ?)',
      args: [userId, 'jackpot_win', winAmount, JSON.stringify({ isJackpot: true })]
    });

    return { userId, winAmount };
  }

  /**
   * Get Leaderboards (Time-scoped)
   */
  static async getLeaderboards(type: 'wins' | 'wagers' = 'wins', scope: 'lifetime' | 'weekly' | 'monthly' = 'lifetime', limit: number = 20) {
    let sql = '';
    let args: any[] = [limit];

    if (scope === 'lifetime') {
      const field = type === 'wins' ? 'total_wins' : 'total_wagered';
      sql = `SELECT user_id, ${field} as score FROM wallets ORDER BY ${field} DESC LIMIT ?`;
    } else {
      const dateFilter = scope === 'weekly' ? "date('now', '-7 days')" : "date('now', '-30 days')";
      sql = `
        SELECT user_id, SUM(amount) as score 
        FROM transactions 
        WHERE type = ? AND timestamp >= ${dateFilter}
        GROUP BY user_id 
        ORDER BY score DESC 
        LIMIT ?
      `;
      args = [type === 'wins' ? 'win' : 'wager', limit];
    }

    const result = await db.execute({ sql, args });
    return result.rows;
  }

  private static syndicatePools: Map<string, SyndicatePool> = new Map();

  /**
   * Create or Join a Syndicate Pool
   */
  static async joinSyndicate(poolId: string, userId: string, wager: number, gameId: string) {
    let pool = this.syndicatePools.get(poolId);
    
    if (!pool) {
      pool = {
        id: poolId,
        gameId,
        totalWagered: 0,
        participants: [],
        status: 'open'
      };
      this.syndicatePools.set(poolId, pool);
    }

    if (pool.status !== 'open') throw new Error('Pool is no longer accepting wagers');

    // Process Wager
    await WalletProcessor.processTransaction(userId, -wager, 'wager', `syndicate_${poolId}`);
    
    pool.totalWagered += wager;
    if (!pool.participants.includes(userId)) pool.participants.push(userId);
    
    return pool;
  }

  /**
   * Resolve a Syndicate Win
   */
  static async resolveSyndicate(poolId: string, totalWin: number) {
    const pool = this.syndicatePools.get(poolId);
    if (!pool) return;

    if (totalWin > 0) {
      const payoutPerParticipant = totalWin / pool.participants.length;
      for (const userId of pool.participants) {
        await WalletProcessor.processTransaction(userId, payoutPerParticipant, 'win', `syndicate_payout_${poolId}`);
      }
    }

    pool.status = 'completed';
    return { poolId, totalWin, participants: pool.participants.length };
  }

  /**
   * Initialize Social Tables
   */
  static async initTables() {
    // ... existing table init ...
  }
}
