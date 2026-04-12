/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { Reader } from '@maxmind/geoip2-node';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../logger';
import { db } from '../db';

// Local GeoLite2 Reader (No API Key required)
let geoReader: any = null;
const DB_PATH = path.join(process.cwd(), 'data', 'GeoLite2-City.mmdb');

const initGeoReader = async () => {
    try {
        if (!geoReader) {
            geoReader = await Reader.open(DB_PATH);
            logger.info("[GeoIP] Local GeoLite2 database initialized.");
        }
    } catch (err) {
        logger.warn(`[GeoIP] Local database NOT found at ${DB_PATH}. Falling back to mocks.`);
    }
};

initGeoReader();

const persona = process.env.PERSONA_API_KEY 
    ? new (require('persona'))({ apiKey: process.env.PERSONA_API_KEY }) 
    : null;

export interface KYCStatus {
  userId: string;
  status: 'unverified' | 'pending' | 'verified' | 'failed';
  verifiedAt?: string;
  rejectionReason?: string;
}

export class ComplianceService {
  /**
   * Check if a player is verified
   */
  static async getKYCStatus(userId: string): Promise<KYCStatus> {
    const result = await db.execute({
      sql: 'SELECT * FROM kyc_records WHERE user_id = ?',
      args: [userId]
    });

    if (result.rows.length === 0) {
      return { userId, status: 'unverified' };
    }

    const row = result.rows[0];
    if (!row) return { userId, status: 'unverified' };

    return {
      userId,
      status: row.status as KYCStatus['status'],
      verifiedAt: row.verified_at as string,
      rejectionReason: row.rejection_reason as string
    };
  }

  /**
   * Submit KYC verification (Supports both Persona and Manual Upload)
   */
  static async submitKYC(userId: string, imageData: string): Promise<KYCStatus> {
    logger.info({ userId, imageDataLength: imageData.length }, "[KYC] Processing submission");
    
    try {
        if (persona) {
            const inquiry = await (persona as any).inquiries.create({
              templateId: process.env.PERSONA_TEMPLATE_ID,
              referenceId: userId,
            });
            logger.info({ userId, inquiryId: inquiry.id }, "Persona Inquiry Created");
        } else {
            // Manual KYC Flow: Save image locally for admin review
            const uploadDir = path.join(process.cwd(), 'uploads', 'kyc');
            await fs.mkdir(uploadDir, { recursive: true });
            
            const fileName = `${userId}_${Date.now()}.jpg`;
            const filePath = path.join(uploadDir, fileName);
            
            // Assuming base64 data
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
            await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
            
            logger.info({ userId, filePath }, "Manual KYC Image Saved");
            
            await db.execute({
                sql: 'UPDATE kyc_records SET rejection_reason = ? WHERE user_id = ?',
                args: [`Local file: ${fileName}`, userId]
            });
        }

        const status: KYCStatus['status'] = 'pending';
        await db.execute({
          sql: 'INSERT OR REPLACE INTO kyc_records (user_id, status, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
          args: [userId, status]
        });

        return { userId, status };
    } catch (err: unknown) {
        const error = err as Error;
        logger.error(error, "KYC Submission Error");
        throw error;
    }
  }

  /**
   * Handle KYC Webhook (Terminal state notification from Persona/Jumio)
   */
  static async handleKYCWebhook(payload: { userId: string, status: string, reason?: string }) {
      const { userId, status, reason } = payload;
      const finalStatus = status === 'completed' ? 'verified' : 'failed';
      
      await db.execute({
        sql: 'UPDATE kyc_records SET status = ?, rejection_reason = ?, verified_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        args: [finalStatus, reason || null, userId]
      });
      
      logger.info({ userId, finalStatus }, "[KYC] User updated via webhook");
  }

  /**
   * Geo-blocking check (Supports local GeoLite2 and Browser GPS)
   */
  static async checkJurisdiction(ip: string, coords?: { lat: number, lon: number }): Promise<{ allowed: boolean; region?: string }> {
    // 1. Prioritize GPS coordinates if provided (Enhanced Security)
    if (coords) {
        logger.info({ coords }, "[Compliance] Checking jurisdiction via GPS");
        // Simplified bounding box check for Colorado (CO)
        const isCO = coords.lat >= 37.0 && coords.lat <= 41.0 && coords.lon >= -109.0 && coords.lon <= -102.0;
        return { allowed: isCO, region: isCO ? 'US-CO (GPS)' : 'Restricted (GPS)' };
    }

    // 2. Fallback to Local GeoLite2
    if (!geoReader) {
        logger.warn("[Compliance] GeoReader not initialized. Falling back to dev-pass.");
        return { allowed: process.env.NODE_ENV !== 'production', region: 'Mock-Fallback' };
    }

    try {
        const response = geoReader.city(ip);
        const country = response.country.isoCode;
        const state = response.subdivisions[0]?.isoCode;
        
        const ALLOWED_STATES = ['CO', 'NV', 'NJ'];
        const isAllowed = country === 'US' && ALLOWED_STATES.includes(state || '');

        return { allowed: isAllowed, region: `${country}-${state} (Local-DB)` };
    } catch (err: unknown) {
        logger.error(err, "GeoIP Local Error");
        return { allowed: process.env.NODE_ENV !== 'production', region: 'Error-Fallback' };
    }
  }

  /**
   * Self-exclusion logic
   */
  static async selfExclude(userId: string, untilDate: string) {
    await db.execute({
      sql: 'UPDATE wallets SET status = ? WHERE user_id = ?',
      args: ['self_excluded', userId]
    });
    
    await db.execute({
      sql: 'INSERT INTO compliance_logs (user_id, event, details) VALUES (?, ?, ?)',
      args: [userId, 'self_exclusion', `Excluded until ${untilDate}`]
    });
  }

  /**
   * Initialize compliance tables
   */
  static async initTables() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS kyc_records (
        user_id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        verified_at DATETIME,
        rejection_reason TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS compliance_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT NOT NULL,
        event TEXT NOT NULL,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
}
