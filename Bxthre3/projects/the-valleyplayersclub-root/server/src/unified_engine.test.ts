/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { describe, it, expect } from 'bun:test';
import { processWager } from './engine/core';
import type { WagerResult } from './engine/types';

describe('Unified Core Engine Expansion', () => {
    const TEST_USER = 'test-player-123';

    it('should process a Coin Toss wager through the core pipeline', async () => {
        const result: WagerResult = await processWager(
            TEST_USER,
            'coin-toss',
            'skill',
            100,
            { prediction: 'HEADS' }
        );

        expect(result.gameCategory).toBe('skill');
        expect(result.state.outcome).toBeDefined();
        expect(['HEADS', 'TAILS']).toContain(result.state.outcome);
        
        if (result.state.outcome === 'HEADS') {
            expect(result.payout).toBe(200); // 2.0 multiplier
        } else {
            expect(result.payout).toBe(0);
        }
    });

    it('should process a Blackjack wager through the core pipeline', async () => {
        const result: WagerResult = await processWager(
            TEST_USER,
            'blackjack',
            'cards',
            100,
            { count: 10 } // Deal enough for hits
        );

        expect(result.gameCategory).toBe('cards');
        expect(result.state.dealt).toBeDefined();
        expect(Array.isArray(result.state.dealt)).toBe(true);
        expect(result.state.dealt.length).toBeGreaterThanOrEqual(4);
        
        // Payout should be one of: 0 (Loss), 100 (Push), 200 (Win), or 250 (Blackjack)
        expect([0, 100, 200, 250]).toContain(result.payout);
    });
});
