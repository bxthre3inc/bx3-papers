/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { logger } from '../index';

export class PersonalizationService {
  /**
   * Get Personalized Lobby Ranking
   * This uses player telemetry + Ollama (mocked) to sort games.
   */
  static async getPersonalizedLobby(userId: string, availableGames: any[]) {
    try {
      // 1. Fetch player telemetry digest
      const playerInsights = await db.execute({
        sql: 'SELECT risk_profile, preferred_categories FROM player_insights WHERE user_id = ?',
        args: [userId]
      });

      if (playerInsights.rows.length === 0) {
        return availableGames; // Return default if no insights
      }

      const row = playerInsights.rows[0] as any;
      if (!row) return availableGames;

      const risk = row.risk_profile;
      const prefs = row.preferred_categories;
      const categories = JSON.parse(prefs as string || '[]');

      // 2. Mock Ollama Personalization Logic
      // In production, you'd send a prompt like:
      // "Given player with risk profile X and categories Y, rank these games Z"
      
      const rankedGames = availableGames.map(game => {
        let score = 0;
        
        // Boost if category matches preferences
        if (categories.includes(game.category)) score += 10;
        
        // Boost based on risk profile
        if (risk === 'high' && game.volatility === 'high') score += 5;
        if (risk === 'low' && game.volatility === 'low') score += 5;

        return { ...game, personalizationScore: score };
      });

      return rankedGames.sort((a, b) => b.personalizationScore - a.personalizationScore);
      
    } catch (err: any) {
      logger.error({ err }, 'Personalization Error');
      return availableGames;
    }
  }

  /**
   * Record Interaction for AI Learning
   */
  static async recordInteraction(userId: string, gameId: string, action: 'view' | 'click' | 'play') {
    await db.execute({
      sql: 'INSERT INTO interaction_logs (user_id, game_id, action) VALUES (?, ?, ?)',
      args: [userId, gameId, action]
    });
  }

  /**
   * Initialize Personalization Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS interaction_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}
