/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import type { RuntimeConfig, GameResultState, WinningCombination } from '../types';

interface EvaluationResult {
    totalWin: number;
    winningCombinations: WinningCombination[];
}

/**
 * Math/Feature Profile Evaluator for Line-based Slots
 * Responsible for logic: Analyzing the generated 2D Symbol Matrix against 
 * predefined paylines and the current Tier's paytable.
 */
export class SlotsLineEvaluator {
    protected config: RuntimeConfig;

    /**
     * @param config The compiled Game Config (including Paytable and Features)
     */
    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    /**
     * Evaluates the matrix for winning line combinations
     * @param resultState { matrix, stops } from SlotProcessor
     * @param wager Total wager
     */
    calculate(resultState: GameResultState, wager: number): EvaluationResult {
        const matrix = resultState.matrix;
        if (!matrix) throw new Error('Result state missing matrix');

        const { paytable, paylines } = this.config;
        
        const lineBet = wager / paylines.length;
        
        let totalWin = 0;
        const winningCombinations: WinningCombination[] = [];

        paylines.forEach((linePositions: { row: number, col: number }[], lineIndex: number) => {
            const lineSymbols = linePositions.map(pos => matrix[pos.row]?.[pos.col] || 'BLANK');
            
            const evalResult = this._evaluateLine(lineSymbols, paytable);
            
            if (evalResult.winMultiplier > 0) {
                const lineWinAmt = lineBet * evalResult.winMultiplier;
                totalWin += lineWinAmt;
                
                winningCombinations.push({
                    lineId: lineIndex,
                    symbols: lineSymbols,
                    matchCount: evalResult.matchCount,
                    winAmount: lineWinAmt
                });
            }
        });

        return {
            totalWin,
            winningCombinations
        };
    }

    private _evaluateLine(lineSymbols: string[], paytable: Record<string, Record<string, number>>) {
        const firstSymbol = lineSymbols[0];
        let matchCount = 1;

        for (let i = 1; i < lineSymbols.length; i++) {
            if (lineSymbols[i] === firstSymbol || lineSymbols[i] === 'WILD') {
                matchCount++;
            } else {
                break;
            }
        }

        const symbolPayouts = paytable[firstSymbol] || {};
        const winMultiplier = symbolPayouts[matchCount.toString()] || 0;

        return {
            matchCount,
            winMultiplier
        };
    }
}
