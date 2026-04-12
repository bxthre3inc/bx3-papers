/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface TelemetryEvent {
  userId: string;
  eventType: 'tap' | 'rage_click' | 'motion' | 'volume' | 'payday_inference' | 'movement' | 'biometric_proxy' | 'mobile_touch_start' | 'kinematics_spike';
  sessionId?: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface GameHealth {
  gameId: string;
  theoreticalRTP: number;
  actualRTP: number;
  variance: number;
  volatilityScore: 'low' | 'medium' | 'high' | 'extreme';
  activeSessions: number;
}

export class AnalyticsService {
  /**
   * Batch insert telemetry events for performance
   */
  static async logEvents(events: TelemetryEvent[]) {
    for (const event of events) {
      await db.execute({
        sql: 'INSERT INTO telemetry_events (id, user_id, event_type, session_id, payload, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
        args: [
          uuidv4(),
          event.userId,
          event.eventType,
          event.sessionId || null,
          JSON.stringify(event.payload),
          event.timestamp || new Date().toISOString()
        ]
      });
    }
    
    // Trigger lazy inference update
    if (events.length > 0 && events[0]?.userId) {
      this.updatePlayerInsights(events[0].userId);
    }
  }

  /**
   * Perform psychological inferencing (e.g., Behavioral Archetyping)
   */
  static async updatePlayerInsights(userId: string) {
    const events = await db.execute({
      sql: 'SELECT event_type, payload, timestamp FROM telemetry_events WHERE user_id = ? ORDER BY timestamp DESC LIMIT 200',
      args: [userId]
    });

    if (events.rows.length === 0) return;

    // 1. Calculate Metrics
    const rageClicks = events.rows.filter(e => e.event_type === 'rage_click').length;
    const movementEvents = events.rows.filter(e => e.event_type === 'movement');
    const kinematicsSpikes = events.rows.filter(e => e.event_type === 'kinematics_spike').length;
    
    let totalVelocity = 0;
    movementEvents.forEach((e) => {
      const p = JSON.parse(e.payload as string) as { velocityX?: number; velocityY?: number };
      totalVelocity += Math.sqrt(Math.pow(p.velocityX || 0, 2) + Math.pow(p.velocityY || 0, 2));
    });
    const avgVelocity = movementEvents.length > 0 ? totalVelocity / movementEvents.length : 0;

    // 2. Behavioral Archetyping
    let archetype = 'The Grinder'; // Default
    let paydayScore = 0.5;

    if (rageClicks > 5 || kinematicsSpikes > 3) {
      archetype = 'The Chaser (Tilt Detected)';
      paydayScore = 0.9; // Higher intent/aggression
    } else if (avgVelocity > 1.5) {
      archetype = 'Impulsive Explorer';
      paydayScore = 0.7;
    } else if (avgVelocity < 0.2 && movementEvents.length > 20) {
      archetype = 'The Strategist';
      paydayScore = 0.3;
    }

    // 3. Update insights table
    await db.execute({
      sql: `INSERT OR REPLACE INTO player_insights (user_id, payday_score, rage_click_count, avg_tap_speed, behavioral_archetype, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [userId, paydayScore, rageClicks, avgVelocity, archetype]
    });
  }

  /**
   * Get insights for a specific player
   */
  static async getPlayerInsights(userId: string) {
    const result = await db.execute({
      sql: 'SELECT * FROM player_insights WHERE user_id = ?',
      args: [userId]
    });
    return result.rows[0];
  }

  /**
   * Get Game Health (Real-time Math Performance)
   */
  static async getPortfolioHealth(): Promise<GameHealth[]> {
    const stats = await db.execute(`
      SELECT 
        game_id as gameId,
        SUM(CASE WHEN type = 'wager' THEN value ELSE 0 END) as totalWagered,
        SUM(CASE WHEN type = 'payout' THEN value ELSE 0 END) as totalPayout
      FROM analytics_events 
      GROUP BY game_id
    `);

    return (stats.rows || []).map((row: any) => {
      const actualRTP = row.totalWagered > 0 ? (row.totalPayout / row.totalWagered) * 100 : 0;
      const theoreticalRTP = 96; // Placeholder; this will eventually pull from D-DAP configs
      return {
        gameId: row.gameId,
        theoreticalRTP,
        actualRTP,
        variance: Math.abs(theoreticalRTP - actualRTP),
        volatilityScore: this.calculateVolatility(actualRTP, theoreticalRTP),
        activeSessions: 0 // Mock for now
      };
    });
  }

  private static calculateVolatility(actual: number, theoretical: number): 'low' | 'medium' | 'high' | 'extreme' {
    const diff = Math.abs(actual - theoretical);
    if (diff < 2) return 'low';
    if (diff < 5) return 'medium';
    if (diff < 10) return 'high';
    return 'extreme';
  }

  /**
   * Log Game Event for Math Analytics
   */
  static async logGameEvent(userId: string, type: 'wager' | 'payout', gameId: string, value: number) {
    await db.execute({
      sql: 'INSERT INTO analytics_events (user_id, type, game_id, value) VALUES (?, ?, ?, ?)',
      args: [userId, type, gameId, value]
    });
  }

  /**
   * Initialize Analytics Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        type TEXT NOT NULL, -- wager, payout
        game_id TEXT,
        value REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Legacy telemetry init (if needed)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        event_type TEXT,
        session_id TEXT,
        payload TEXT,
        timestamp TEXT
      )
    `);
  }
}
