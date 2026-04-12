/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { RNGService } from '../rng';
import type { ActionPayload, GameResultState } from '../types';

/**
 * Category Processor for Crash Games
 * Responsible for calculating the Crash Point based on house edge and RNG.
 */
export class CrashProcessor {
    private rng: RNGService;
    private houseEdge: number = 0.03; // Default 3% house edge

    constructor(config: any, rng: RNGService) {
        this.rng = rng;
        if (config.houseEdge !== undefined) this.houseEdge = config.houseEdge;
    }

    /**
     * Determines the 'multiplier' at which the game crashes.
     * Formula: 0.99 / (1 - X) where X is a random float [0, 1)
     * This creates a curve where lower multipliers are common and higher are rare.
     */
    async execute(_payload: ActionPayload = {}): Promise<GameResultState> {
        const float = await this.rng.getFloat();
        
        // Anti-Cheat / Sustainability Guard: 
        // 1 in 33 games (3% edge) crashes at 0x immediately.
        if (float < this.houseEdge) {
            return { crashPoint: 0 };
        }

        // Standard Crash Formula
        const crashPoint = Math.floor(99 / (1 - float)) / 100;
        
        return {
            crashPoint: Math.max(1, crashPoint)
        };
    }
}
