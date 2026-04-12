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
 * Math Evaluator for Crash Games
 * Responsible for checking if the user cashed out BEFORE the crash point.
 */
export class CrashEvaluator {
    private config: RuntimeConfig;

    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    /**
     * Calculates the result of a Crash wager.
     * @param resultState { crashPoint } from CrashProcessor
     * @param wager The user's bet
     * @param payload { cashoutMultiplier } The point at which the user cashed out
     */
    calculate(resultState: GameResultState, wager: number, payload: ActionPayload): EvaluationResult {
        const { crashPoint } = resultState;
        const cashoutMultiplier = Number(payload.cashoutMultiplier) || 1.0;
        
        if (crashPoint === undefined) throw new Error('Result state missing crash point');

        let totalWin = 0;
        const winningCombinations: WinningCombination[] = [];

        // Win condition: User cashed out at or below the crash point
        // NOTE: If crashPoint is 0 (instant crash), user always loses.
        if (crashPoint > 0 && cashoutMultiplier <= crashPoint) {
            totalWin = wager * cashoutMultiplier;
            
            winningCombinations.push({
                symbols: [`CRASH_${crashPoint}`, `CASHOUT_${cashoutMultiplier}`],
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
