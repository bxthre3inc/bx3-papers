/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import crypto from 'crypto';

export interface RNGSeedData {
    userId: string;
    serverSeed: string;
    clientSeed: string;
    hashedServerSeed: string;
    nonce: number;
}

export class RNGPersistenceService {
    /**
     * Fetches current RNG data for a user or creates a new entry if none exists.
     */
    static async getRNGData(userId: string): Promise<RNGSeedData> {
        const result = await db.execute({
            sql: 'SELECT * FROM rng_seeds WHERE user_id = ?',
            args: [userId]
        });

        if (result.rows.length === 0) {
            return await this.rotateServerSeed(userId, 'default_client_seed');
        }

        const row = result.rows[0] as any;
        return {
            userId: row.user_id,
            serverSeed: row.server_seed,
            clientSeed: row.client_seed,
            hashedServerSeed: row.hashed_server_seed,
            nonce: row.nonce
        };
    }

    /**
     * Increments the nonce for a user in the database.
     */
    static async incrementNonce(userId: string): Promise<number> {
        const result = await db.execute({
            sql: 'UPDATE rng_seeds SET nonce = nonce + 1 WHERE user_id = ? RETURNING nonce',
            args: [userId]
        });
        
        if (result.rows.length === 0) {
            throw new Error(`Failed to increment nonce for user ${userId}`);
        }
        
        return (result.rows[0] as any).nonce;
    }

    /**
     * Rotates the server seed and resets nonce.
     */
    static async rotateServerSeed(userId: string, clientSeed: string): Promise<RNGSeedData> {
        const newServerSeed = crypto.randomBytes(32).toString('hex');
        const hashedServerSeed = crypto.createHash('sha256').update(newServerSeed).digest('hex');
        
        await db.execute({
            sql: `
                INSERT INTO rng_seeds (user_id, server_seed, client_seed, hashed_server_seed, nonce)
                VALUES (?, ?, ?, ?, 0)
                ON CONFLICT(user_id) DO UPDATE SET
                    server_seed = excluded.server_seed,
                    client_seed = excluded.client_seed,
                    hashed_server_seed = excluded.hashed_server_seed,
                    nonce = 0,
                    updated_at = CURRENT_TIMESTAMP
            `,
            args: [userId, newServerSeed, clientSeed, hashedServerSeed]
        });

        return {
            userId,
            serverSeed: newServerSeed,
            clientSeed,
            hashedServerSeed,
            nonce: 0
        };
    }

    /**
     * Update client seed manually.
     */
    static async updateClientSeed(userId: string, clientSeed: string): Promise<void> {
        await db.execute({
            sql: 'UPDATE rng_seeds SET client_seed = ?, nonce = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            args: [clientSeed, userId]
        });
    }
}
