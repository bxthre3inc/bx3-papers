/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 * Component: Engine / Evaluators / Bonus Contract
 * 
 * This interface defines the contract for pluggable bonus logic.
 * Any unique game mechanic (Free Spins, Multipliers, Pick-em) 
 * should implement this contract to be defensible and modular.
 */

import type { GameState, SymbolOutcome } from '../types';

export interface BonusResult {
    triggerType: string;
    multiplier: number;
    extraSpins: number;
    bonusState: any;
    visualData: {
        animationKey: string;
        highlightSymbols: number[][]; // [row, col]
    };
}

export interface IBonusEvaluator {
    id: string;
    version: string;
    
    /**
     * Determines if a bonus was triggered and calculates the result.
     * @param matrix The symbol matrix from the spin
     * @param paytable The game's paytable
     * @param currentState Current game state (to handle cumulative bonuses)
     */
    evaluate(
        matrix: string[][], 
        paytable: Record<string, any>,
        currentState?: GameState
    ): BonusResult | null;

    /**
     * Optional: Logic to handle ongoing bonus states (e.g. nested free spins)
     */
    processBonusAction?(
        actionType: string,
        payload: any,
        currentState: GameState
    ): Promise<BonusResult>;
}
