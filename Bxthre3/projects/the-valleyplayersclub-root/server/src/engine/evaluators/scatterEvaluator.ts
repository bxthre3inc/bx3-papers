/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import type { RuntimeConfig, GameResultState, EvaluationResult, WinningCombination } from '../types';

/**
 * Scatter/Cluster Evaluator for Slots
 * Responsible for logic where symbols win regardless of line position (e.g. 8+ identical symbols anywhere).
 */
export class ScatterEvaluator {
    private config: RuntimeConfig;

    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    /**
     * Evaluates the matrix for scatter/cluster combinations.
     */
    calculate(resultState: GameResultState, wager: number): any {
        const matrix = resultState.matrix;
        if (!matrix) throw new Error('Result state missing matrix');

        const { paytable } = this.config;
        
        let totalWin = 0;
        const winningCombinations: WinningCombination[] = [];

        // 1. Flatten Matrix to count total occurrences of each symbol
        const counts: Record<string, number> = {};
        let wildCount = 0;

        matrix.forEach(row => {
            row.forEach(symbol => {
                if (symbol === 'WILD') {
                    wildCount++;
                } else if (symbol !== 'BLANK') {
                    counts[symbol] = (counts[symbol] || 0) + 1;
                }
            });
        });

        // 2. Evaluate each symbol found
        Object.keys(counts).forEach(symbol => {
            const totalMatch = counts[symbol] + wildCount;
            const symbolPayouts = paytable[symbol] || {};
            
            // Find highest match multiplier defined in paytable
            const availableMatches = Object.keys(symbolPayouts).map(Number).filter(n => n <= totalMatch);
            if (availableMatches.length > 0) {
                const bestMatch = Math.max(...availableMatches);
                const winMultiplier = symbolPayouts[bestMatch.toString()] || 0;
                
                if (winMultiplier > 0) {
                    const winAmt = wager * winMultiplier;
                    totalWin += winAmt;
                    
                    winningCombinations.push({
                        symbols: [symbol],
                        matchCount: totalMatch,
                        winAmount: winAmt
                    });
                }
            }
        });

        return {
            totalWin,
            winningCombinations
        };
    }
}
