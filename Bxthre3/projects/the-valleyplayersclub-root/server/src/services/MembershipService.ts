/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';
import { logger } from '../index';

export interface MembershipTier {
  id: string;
  name: string;
  monthlyFee: number;
  rtpProfile: string;
}

export const MEMBERSHIP_TIERS: Record<string, MembershipTier> = {
  'gold': { id: 'gold', name: 'Gold Member', monthlyFee: 49, rtpProfile: 'vip' },
  'platinum': { id: 'platinum', name: 'Platinum Global', monthlyFee: 199, rtpProfile: 'vip' }
};

export class MembershipService {
  /**
   * Check if user has an active paid membership
   */
  static async getActiveMembership(userId: string) {
    const result = await db.execute({
      sql: "SELECT tier, expires_at FROM user_memberships WHERE user_id = ? AND status = 'active'",
      args: [userId]
    });

    if (result.rows.length === 0) return null;

    const row = result.rows[0] as unknown as { tier: string, expires_at: string };
    const expiry = new Date(row.expires_at);
    
    if (expiry < new Date()) {
      await this.expireMembership(userId);
      return null;
    }

    return MEMBERSHIP_TIERS[row.tier] || null;
  }

  /**
   * Purchase/Subscribe to a Tier
   */
  static async subscribe(userId: string, tierId: string) {
    const tier = MEMBERSHIP_TIERS[tierId];
    if (!tier) throw new Error('Invalid Membership Tier');

    // 1. Process Payment from Wallet
    const payment = await WalletProcessor.processTransaction(userId, -tier.monthlyFee, 'withdrawal', `subscription_${tierId}`);
    if (!payment.success) throw new Error('Insufficient funds for subscription');

    // 2. Update DB (30 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await db.execute({
      sql: `INSERT INTO user_memberships (user_id, tier, status, expires_at) 
            VALUES (?, ?, 'active', ?) 
            ON CONFLICT(user_id) DO UPDATE SET tier = ?, status = 'active', expires_at = ?`,
      args: [userId, tierId, expiryDate.toISOString(), tierId, expiryDate.toISOString()]
    });

    logger.info({ userId, tier: tierId }, 'Membership Subscribed');
    return { tier: tierId, expiresAt: expiryDate.toISOString() };
  }

  private static async expireMembership(userId: string) {
    await db.execute({
      sql: "UPDATE user_memberships SET status = 'expired' WHERE user_id = ?",
      args: [userId]
    });
    logger.info({ userId }, 'Membership Expired');
  }

  /**
   * Initialize Membership Tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_memberships (
        user_id TEXT PRIMARY KEY,
        tier TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}
