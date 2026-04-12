/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 * Component: Engine / Evaluators / Sticky Wilds
 */

import type { RuntimeConfig, GameResultState } from '../types';
import { SlotsLineEvaluator } from './slotsLineEvaluator';

export class StickyWildsEvaluator extends SlotsLineEvaluator {
    constructor(config: RuntimeConfig) {
        super(config);
    }

    override calculate(state: GameResultState, wager: number): any {
        const baseResult = super.calculate(state, wager);
        
        // Check for bonus trigger (3+ Scatters or similar logic)
        const matrix = state.matrix;
        if (!matrix) return baseResult;

        let scatterCount = 0;
        matrix.forEach(row => row.forEach(sym => {
            if (sym === 'S1') scatterCount++;
        }));

        const bonusTriggered = scatterCount >= (this.config.extraConfig?.bonusTriggerCount || 3);
        
        if (bonusTriggered) {
            return {
                ...baseResult,
                bonusTriggered: true,
                bonusSpins: this.config.extraConfig?.bonusSpins || 10,
                visualData: {
                    animationKey: 'sticky-wild-trigger'
                }
            };
        }

        return baseResult;
    }
}
