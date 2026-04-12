/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { logger } from '../index';

export interface PlayerStats {
  lifetimeWagered: number;
  lifetimeWins: number;
  biggestWin: number;
  favoriteGame: string;
  joinDate: string;
  rank: string;
}

export class ProfileService {
  /**
   * Get Deep Player Stats for Profile Page
   */
  static async getProfileStats(userId: string): Promise<PlayerStats> {
    // Atomic Upsert (Ensure profile exists)
    await db.execute({
      sql: 'INSERT OR IGNORE INTO user_profiles (user_id) VALUES (?)',
      args: [userId]
    });

    const profile = await db.execute({
      sql: 'SELECT * FROM user_profiles WHERE user_id = ?',
      args: [userId]
    });

    const row = profile.rows[0] as any;
    
    return {
      lifetimeWagered: row.lifetime_wagered || 0,
      lifetimeWins: row.lifetime_wins || 0,
      biggestWin: row.biggest_win || 0,
      favoriteGame: row.favorite_game || 'None',
      joinDate: row.created_at || new Date().toISOString(),
      rank: row.vip_rank || 'Bronze'
    };
  }

  /**
   * Add Friend
   */
  static async addFriend(userId: string, friendId: string) {
    await db.execute({
      sql: 'INSERT INTO user_friends (user_id, friend_id) VALUES (?, ?)',
      args: [userId, friendId]
    });
  }

  /**
   * Initialize Profile Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id TEXT PRIMARY KEY,
        lifetime_wagered INTEGER DEFAULT 0,
        lifetime_wins INTEGER DEFAULT 0,
        biggest_win INTEGER DEFAULT 0,
        favorite_game TEXT,
        vip_rank TEXT DEFAULT 'Bronze',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_friends (
        user_id TEXT NOT NULL,
        friend_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, friend_id)
      )
    `);
  }
}
