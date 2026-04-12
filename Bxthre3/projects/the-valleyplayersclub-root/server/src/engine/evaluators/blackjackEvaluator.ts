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
 * Math Evaluator for Blackjack
 * handles hand totaling, dealer hits, and payout determination.
 */
export class BlackjackEvaluator {
    private config: RuntimeConfig;

    constructor(config: RuntimeConfig) {
        this.config = config;
    }

    /**
     * Evaluates a Blackjack hand.
     * @param resultState { dealt } from DeckProcessor
     */
    calculate(resultState: GameResultState, wager: number): EvaluationResult {
        const { dealt } = resultState;
        if (!dealt || !Array.isArray(dealt)) throw new Error('Result state missing dealt cards');

        // Logic: First 2 cards player, next are dealer/potential hits
        const playerHand = [dealt[0], dealt[1]];
        const dealerHand = [dealt[2], dealt[3]];

        const playerTotal = this._getHandTotal(playerHand);
        let dealerTotal = this._getHandTotal(dealerHand);

        // Dealer Hitting Logic (Standard: Stand on 17)
        let pointer = 4;
        while (dealerTotal < 17 && pointer < dealt.length) {
            dealerHand.push(dealt[pointer]);
            dealerTotal = this._getHandTotal(dealerHand);
            pointer++;
        }

        let totalWin = 0;
        let resultLabel = 'LOSE';

        const playerBust = playerTotal > 21;
        const dealerBust = dealerTotal > 21;

        if (!playerBust) {
            if (dealerBust || playerTotal > dealerTotal) {
                const isBlackjack = playerHand.length === 2 && playerTotal === 21;
                const multiplier = isBlackjack ? Number(this.config.paytable?.blackjack || 2.5) : 2.0; 
                totalWin = wager * multiplier;
                resultLabel = isBlackjack ? 'BLACKJACK' : 'WIN';
            } else if (playerTotal === dealerTotal) {
                totalWin = wager;
                resultLabel = 'PUSH';
            }
        }

        const winningCombinations: WinningCombination[] = [{
            symbols: [`P:${playerTotal}`, `D:${dealerTotal}`, `RES:${resultLabel}`],
            matchCount: playerTotal,
            winAmount: totalWin
        }];

        return { totalWin, winningCombinations };
    }

    private _getHandTotal(cards: string[]): number {
        let total = 0;
        let aces = 0;

        for (const card of cards) {
            const val = card.slice(0, -1);
            if (val === 'A') {
                aces++;
                total += 11;
            } else if (['J', 'Q', 'K'].includes(val)) {
                total += 10;
            } else {
                total += parseInt(val);
            }
        }

        while (total > 21 && aces > 0) {
            total -= 10;
            aces--;
        }

        return total;
    }
}
