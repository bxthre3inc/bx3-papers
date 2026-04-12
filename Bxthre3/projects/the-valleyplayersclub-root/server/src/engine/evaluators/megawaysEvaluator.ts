/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 * Component: Engine / Evaluators / Megaways
 */

import type { RuntimeConfig, WinningCombination } from '../types';

export class MegawaysEvaluator {
    private config: RuntimeConfig;

    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    calculate(state: { matrix: string[][] }, wager: number) {
        const matrix: string[][] = state.matrix;
        if (!matrix || matrix.length === 0) return { totalWin: 0, winningCombinations: [] };

        const symbolWays: Record<string, number[]> = {};
        const colCount = matrix[0]?.length || 0;
        
        // Count symbols in each reel
        for (let colIndex = 0; colIndex < colCount; colIndex++) {
            const reelCount: Record<string, number> = {};
            matrix.forEach(row => {
                const sym = row[colIndex];
                if (sym && sym !== 'BLANK') {
                    reelCount[sym] = (reelCount[sym] || 0) + 1;
                }
            });

            // Map to symbolWays
            Object.entries(reelCount).forEach(([sym, count]) => {
                if (!symbolWays[sym]) symbolWays[sym] = new Array(colCount).fill(0);
                symbolWays[sym][colIndex] = count;
            });
            
            // Handle WILD (adds to all symbols)
            if (reelCount['WILD']) {
                Object.keys(symbolWays).forEach(sym => {
                    if (sym !== 'WILD') {
                        if (!symbolWays[sym]) symbolWays[sym] = new Array(colCount).fill(0);
                        symbolWays[sym][colIndex] += reelCount['WILD'];
                    }
                });
            }
        }

        const winningCombinations: WinningCombination[] = [];
        let totalWin = 0;

        Object.entries(symbolWays).forEach(([sym, ways]) => {
            if (sym === 'WILD' || sym === 'BLANK') return;

            let matchCount = 0;
            let multiplier = 1;
            for (let i = 0; i < ways.length; i++) {
                if (ways[i] > 0) {
                    matchCount++;
                    multiplier *= ways[i];
                } else {
                    break;
                }
            }

            const payoutConfig = this.config.paytable[sym];
            if (payoutConfig && payoutConfig[matchCount.toString()]) {
                const baseWin = payoutConfig[matchCount.toString()] * wager;
                const finalWin = baseWin * multiplier;
                
                totalWin += Math.floor(finalWin);
                winningCombinations.push({
                    symbols: new Array(matchCount).fill(sym),
                    matchCount,
                    winAmount: Math.floor(finalWin)
                });
            }
        });

        return { totalWin, winningCombinations };
    }
}
