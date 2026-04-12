/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { RNGService } from '../rng';
import type { ActionPayload, GameResultState } from '../types';

/**
 * Category Processor for Card Games
 * Responsible for deck management, shuffling, and dealing.
 */
export class DeckProcessor {
    private rng: RNGService;
    private deckCount: number = 1;

    constructor(config: any, rng: RNGService) {
        this.rng = rng;
        if (config.deckCount) this.deckCount = config.deckCount;
    }

    /**
     * Shuffles and deals cards based on action payload.
     */
    async execute(payload: ActionPayload = {}): Promise<GameResultState> {
        const count = Number(payload.count) || 1;
        const deck = this._generateDeck();
        const dealt: string[] = [];

        for (let i = 0; i < count; i++) {
            const index = await this.rng.getInt(0, deck.length - 1);
            dealt.push(deck.splice(index, 1)[0]);
        }

        return {
            dealt,
            remaining: deck.length
        };
    }

    private _generateDeck(): string[] {
        const suits = ['H', 'D', 'C', 'S'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck: string[] = [];

        for (let d = 0; d < this.deckCount; d++) {
            suits.forEach(s => values.forEach(v => deck.push(`${v}${s}`)));
        }

        return deck;
    }
}
