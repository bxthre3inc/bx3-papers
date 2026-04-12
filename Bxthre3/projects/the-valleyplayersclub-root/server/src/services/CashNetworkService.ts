/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { WalletProcessor } from '../engine/wallet';

export interface CashPartner {
  id: string;
  name: string;
  location: string;
  commissionTier: 'bronze' | 'silver' | 'gold';
  balance: number;
}

export class CashNetworkService {
  /**
   * Register a new cash partner
   */
  static async registerPartner(partner: Omit<CashPartner, 'balance'>) {
    await db.execute({
      sql: 'INSERT INTO cash_partners (id, name, location, commission_tier) VALUES (?, ?, ?, ?)',
      args: [partner.id, partner.name, partner.location, partner.commissionTier]
    });
  }

  /**
   * Create a deposit request for a player (QR Code/Token generation)
   */
  static async createDepositRequest(userId: string, amount: number) {
    const token = `VPC-CASH-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    await db.execute({
      sql: 'INSERT INTO cash_deposit_requests (token, user_id, amount, status) VALUES (?, ?, ?, ?)',
      args: [token, userId, amount, 'pending']
    });

    return { token, amount };
  }

  /**
   * Partner confirms the cash deposit
   */
  static async confirmDeposit(partnerId: string, token: string) {
    const requestResult = await db.execute({
      sql: 'SELECT * FROM cash_deposit_requests WHERE token = ? AND status = ?',
      args: [token, 'pending']
    });

    if (requestResult.rows.length === 0) {
      throw new Error('Invalid or expired deposit token');
    }

    const request = requestResult.rows[0];
    const { user_id: userId, amount } = request;

    // 1. Credit player wallet
    const transactionId = `TXN-CASH-${Date.now()}`;
    await WalletProcessor.processTransaction(userId as string, amount as number, 'cash', 'cash_partner_deposit', transactionId);

    // 2. Calculate and log partner commission
    const partnerResult = await db.execute({
      sql: 'SELECT commission_tier FROM cash_partners WHERE id = ?',
      args: [partnerId]
    });
    
    const tier = partnerResult.rows[0]?.commission_tier || 'bronze';
    const rate = tier === 'gold' ? 0.02 : (tier === 'silver' ? 0.015 : 0.01);
    const commission = (amount as number) * rate;

    // 3. Mark request as completed
    await db.execute({
      sql: 'UPDATE cash_deposit_requests SET status = ?, processed_at = CURRENT_TIMESTAMP, partner_id = ? WHERE token = ?',
      args: ['completed', partnerId, token]
    });

    // 4. Log Partner commission
    await db.execute({
      sql: 'INSERT INTO partner_commissions (partner_id, transaction_id, amount, commission) VALUES (?, ?, ?, ?)',
      args: [partnerId, transactionId, amount, commission]
    });

    return { success: true, userId, amount, commission };
  }

  /**
   * Initialize cash network tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cash_partners (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        commission_tier TEXT DEFAULT 'bronze',
        balance INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS cash_deposit_requests (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL, -- pending, completed, cancelled
        partner_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        processed_at DATETIME
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS partner_commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        partner_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        commission REAL NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Seed a demo partner
    await db.execute(`
      INSERT OR IGNORE INTO cash_partners (id, name, location, commission_tier) 
      VALUES ('local-shop-1', 'Valley Corner Store', 'Phoenix, AZ', 'silver')
    `);
  }
}
