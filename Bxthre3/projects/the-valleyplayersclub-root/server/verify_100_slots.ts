import { db, initDatabase } from './src/db';
import { processWager } from './src/engine/core';

async function run() {
    await initDatabase();

    // 1. Check game count
    const countRes = await db.execute("SELECT count(*) as count FROM games WHERE status='live'");
    const count = countRes.rows[0].count;
    console.log(`📊 Live Games in DB: ${count}`);

    // 2. Test a random 'slots-lines' game
    const linesGame = await db.execute("SELECT id FROM games WHERE manifest LIKE '%slots-lines%' LIMIT 1");
    const linesId = linesGame.rows[0].id as string;
    console.log(`🧪 Testing Line Game: ${linesId}`);
    
    const linesRes = await processWager("test-user", linesId, "slots", 10, {}, "standard");
    console.log(`   Result: Payout=${linesRes.payout}, Net=${linesRes.netResult}`);

    // 3. Test a random 'slots-scatter' game
    const scatterGame = await db.execute("SELECT id FROM games WHERE manifest LIKE '%slots-scatter%' LIMIT 1");
    const scatterId = scatterGame.rows[0].id as string;
    console.log(`🧪 Testing Scatter Game: ${scatterId}`);
    
    const scatterRes = await processWager("test-user", scatterId, "slots", 10, {}, "standard");
    console.log(`   Result: Payout=${scatterRes.payout}, Net=${scatterRes.netResult}`);

    console.log("✅ Verification Script Complete.");
}

run().catch(console.error);
