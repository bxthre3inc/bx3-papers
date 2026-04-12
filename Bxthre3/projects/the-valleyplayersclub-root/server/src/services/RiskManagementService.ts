/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { db } from '../db';
import { logger } from '../logger';

export class RiskManagementService {
    private static instance: RiskManagementService;
    
    private constructor() {}

    static getInstance(): RiskManagementService {
        if (!RiskManagementService.instance) {
            RiskManagementService.instance = new RiskManagementService();
        }
        return RiskManagementService.instance;
    }

    /**
     * Gets the current house bankroll reserve from the database.
     */
    async getHouseReserve(): Promise<number> {
        const result = await db.execute({
            sql: "SELECT key, value FROM system_configs WHERE key = 'house_bankroll_reserve'",
            args: []
        });
        
        const row = result.rows[0];
        if (!row) return 100.00; // Default fallback
        return parseFloat(row.value as string);
    }

    /**
     * Gets the maximum allowed payout per transaction.
     */
    async getPayoutCap(): Promise<number> {
        const result = await db.execute({
            sql: "SELECT value, key FROM system_configs WHERE key IN ('max_payout_cap', 'payout_cap_mode', 'house_bankroll_reserve')",
            args: []
        });
        
        const configs: Record<string, string> = {};
        result.rows.forEach(row => {
            configs[row.key as string] = row.value as string;
        });

        const capValue = parseFloat(configs['max_payout_cap'] || '80');
        const mode = configs['payout_cap_mode'] || 'strict';

        if (mode === 'strict') {
            return capValue;
        } else {
            // dynamic mode: cap is a percentage of total reserve
            const reserve = parseFloat(configs['house_bankroll_reserve'] || '100');
            return (capValue / 100) * reserve;
        }
    }

    /**
     * Validates if a wager is safe to accept given the current house bankroll.
     */
    async validateWager(wager: number): Promise<{ safe: boolean; error?: string }> {
        const reserve = await this.getHouseReserve();
        
        // If the potential win is way beyond our total reserve, it's a high risk.
        // Even with caps, we shouldn't encourage bets that will always be capped.
        if (wager > reserve * 0.5) {
            return { 
                safe: false, 
                error: `Wager too high for current house liquidity. Max recommended: ${reserve * 0.1}` 
            };
        }

        return { safe: true };
    }

    /**
     * Enforces the payout cap on a calculated win.
     */
    async enforcePayoutCap(potentialWin: number): Promise<{ finalPayout: number; capped: boolean }> {
        const cap = await this.getPayoutCap();
        
        if (potentialWin > cap) {
            logger.warn(`[RiskManagement] Payout capped: ${potentialWin} -> ${cap}`);
            return { finalPayout: cap, capped: true };
        }
        
        return { finalPayout: potentialWin, capped: false };
    }

    /**
     * Updates the house bankroll after a transaction.
     */
    async updateHouseBankroll(netChange: number): Promise<void> {
        // netChange is positive if house wins (player loses), negative if house loses (player wins)
        const currentReserve = await this.getHouseReserve();
        const newReserve = currentReserve + netChange;
        
        await db.execute({
            sql: "UPDATE system_configs SET value = ? WHERE key = 'house_bankroll_reserve'",
            args: [newReserve.toFixed(2)]
        });
        
        const verified = await this.getHouseReserve();
        logger.info(`[RiskManagement] Bankroll updated: ${currentReserve.toFixed(2)} -> ${verified.toFixed(2)} (change: ${netChange.toFixed(2)})`);
    }
}

export const riskService = RiskManagementService.getInstance();
