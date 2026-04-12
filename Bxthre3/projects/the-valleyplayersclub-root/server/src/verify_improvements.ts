/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 * Verification Script: Algorithm and Variability
 */

import { initDatabase, db } from './db';
import { processWager } from './engine/core';
import { RNGPersistenceService } from './services/RNGPersistenceService';

const TEST_USER = 'verify_test_user';
const ROUNDS = 500; // 500 rounds per profile for quick verification

async function runSimulation() {
    console.log('--- Starting Verification Simulation ---');
    await initDatabase();

    // 1. Setup Test User
    await db.execute({
        sql: 'INSERT OR IGNORE INTO wallets (user_id, balance) VALUES (?, ?)',
        args: [TEST_USER, 1000000]
    });

    const profiles = [
        { id: 'skn:slv-sandhill-crane-sighting:dna:standard-lines', name: 'Standard' },
        { id: 'skn:slv-sandhill-crane-sighting:dna:standard-lines-high', name: 'High Volatility' },
        { id: 'skn:slv-sandhill-crane-sighting:dna:standard-lines-low', name: 'Low Volatility' }
    ];

    for (const profile of profiles) {
        console.log(`\nSimulating Profile: ${profile.name} (${profile.id})`);
        let totalWagered = 0;
        let totalPaid = 0;
        let wins = 0;
        let maxWin = 0;

        for (let i = 0; i < ROUNDS; i++) {
            const result = await processWager(TEST_USER, profile.id, 'slots', 10, {});
            
            totalWagered += result.wager;
            totalPaid += result.payout;
            if (result.payout > 0) wins++;
            if (result.payout > maxWin) maxWin = result.payout;

            // Basic Provably Fair Check on first and last round
            if (i === 0 || i === ROUNDS - 1) {
                if (!result.provablyFair) {
                    throw new Error('Provably Fair data missing from result!');
                }
                console.log(`  [Round ${i+1}] PF Nonce: ${result.provablyFair.nonce}, Payout: ${result.payout}`);
            }
        }

        const rtp = (totalPaid / totalWagered) * 100;
        const hitRate = (wins / ROUNDS) * 100;

        console.log(`  Results for ${profile.name}:`);
        console.log(`    RTP: ${rtp.toFixed(2)}%`);
        console.log(`    Hit Rate: ${hitRate.toFixed(2)}%`);
        console.log(`    Max Win: ${maxWin}`);
    }

    console.log('\n--- Verification Complete ---');
    process.exit(0);
}

runSimulation().catch(err => {
    console.error('Simulation Failed:', err);
    process.exit(1);
});
