/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { RNGService } from '../rng';
import type { GameResultState } from '../types';

/**
 * Category Processor for Coin/Binary Games
 * Powers simple skill-based or binary outcomes.
 */
export class CoinProcessor {
    private rng: RNGService;

    constructor(_config: Record<string, unknown>, rng: RNGService) {
        this.rng = rng;
    }

    /**
     * Flips the coin/generates binary result.
     */
    async execute(): Promise<GameResultState> {
        // Core RNG call for binary choice (0 or 1)
        const result = await this.rng.getInt(0, 1);
        
        return {
            outcome: result === 0 ? 'HEADS' : 'TAILS',
            value: result
        };
    }
}
