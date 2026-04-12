/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';

export interface Challenge {
  id: string;
  creatorId: string;
  opponentId: string;
  wager: number;
  gameId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  creatorScore: number;
  opponentScore: number;
}

export class CompetitionEngine {
  private static activeChallenges: Map<string, Challenge> = new Map();

  /**
   * Create 1v1 Wager Challenge
   */
  static async createChallenge(creatorId: string, opponentId: string, wager: number, gameId: string) {
    const challengeId = crypto.randomUUID();
    const challenge: Challenge = {
      id: challengeId,
      creatorId,
      opponentId,
      wager,
      gameId,
      status: 'pending',
      creatorScore: 0,
      opponentScore: 0
    };

    // Lock wagers
    await WalletProcessor.processTransaction(creatorId, -wager, 'wager', `challenge_lock_${challengeId}`);
    
    this.activeChallenges.set(challengeId, challenge);
    return challenge;
  }

  /**
   * Accept Challenge
   */
  static async acceptChallenge(challengeId: string, opponentId: string) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge || challenge.opponentId !== opponentId) throw new Error('Challenge not found');

    await WalletProcessor.processTransaction(opponentId, -challenge.wager, 'wager', `challenge_accept_${challengeId}`);
    challenge.status = 'active';
    return challenge;
  }

  /**
   * Update Challenge Score (Mock for simulation)
   */
  static updateScore(challengeId: string, userId: string, score: number) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) return;

    if (challenge.creatorId === userId) challenge.creatorScore += score;
    if (challenge.opponentId === userId) challenge.opponentScore += score;

    if (challenge.status === 'active' && this.isChallengeFinished(challenge)) {
      this.completeChallenge(challengeId);
    }
  }

  private static isChallengeFinished(challenge: Challenge) {
    // Logic for ending (e.g., time limit or max spins)
    return false; // For now manual completion or time-based
  }

  /**
   * Complete Challenge and Distribute Prize
   */
  static async completeChallenge(challengeId: string) {
    const existing = this.activeChallenges.get(challengeId);
    if (!existing) return;

    const winnerId = existing.creatorScore > existing.opponentScore ? existing.creatorId : existing.opponentId;
    const totalPrize = existing.wager * 1.9; // 5% house edge

    await WalletProcessor.processTransaction(winnerId, totalPrize, 'win', `challenge_win_${challengeId}`);
    existing.status = 'completed';
    
    // Log to DB
    await db.execute({
      sql: 'INSERT INTO competition_history (challenge_id, winner_id, prize) VALUES (?, ?, ?)',
      args: [challengeId, winnerId, totalPrize]
    });
  }

  /**
   * Initialize Competition Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS competition_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        challenge_id TEXT NOT NULL,
        winner_id TEXT NOT NULL,
        prize INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}
