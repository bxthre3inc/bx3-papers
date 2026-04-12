/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import type { RuntimeConfig, GameResultState, ActionPayload, WinningCombination } from '../types';

interface EvaluationResult {
    totalWin: number;
    winningCombinations: WinningCombination[];
}

/**
 * Math Evaluator for Coin Toss
 * Compares user prediction with RNG outcome.
 */
export class CoinEvaluator {
    private config: RuntimeConfig;

    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    /**
     * Calculates the result of a Coin Toss wager.
     * @param resultState { outcome } from CoinProcessor
     * @param wager The user's bet
     * @param payload { prediction } 'HEADS' or 'TAILS'
     */
    calculate(resultState: GameResultState, wager: number, payload: ActionPayload): EvaluationResult {
        const { outcome } = resultState;
        const prediction = payload.prediction as string;
        
        if (!outcome) throw new Error('Result state missing outcome');

        let totalWin = 0;
        const winningCombinations: WinningCombination[] = [];

        // Win if prediction matches outcome
        // Default multiplier is 2.0 (Double or nothing)
        const multiplier = this.config.paytable?.match?.["1"] || 2.0;

        if (prediction?.toUpperCase() === outcome) {
            totalWin = wager * multiplier;
            
            winningCombinations.push({
                symbols: [outcome],
                matchCount: 1,
                winAmount: totalWin
            });
        }

        return {
            totalWin,
            winningCombinations
        };
    }
}
