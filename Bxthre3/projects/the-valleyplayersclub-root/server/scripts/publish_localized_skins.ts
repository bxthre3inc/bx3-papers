import { db, initDatabase } from '../src/db';
import fs from 'fs';
import path from 'path';

/**
 * PUBLISH LOCALIZED SKINS SCRIPT
 * Registers the 100 new localized skins in the 'games' table 
 * using the skn:id:dna:id format.
 */

const SKINS_PATH = path.join(process.cwd(), 'src/games/skins');

async function run() {
    console.log('📦 Publishing 100 Localized Skins to Database...');
    await initDatabase();

    const skinFiles = fs.readdirSync(SKINS_PATH);
    let count = 0;

    for (const file of skinFiles) {
        if (!file.endsWith('.json')) continue;
        const skinId = file.replace('.json', '');
        const skinData = JSON.parse(fs.readFileSync(path.join(SKINS_PATH, file), 'utf8'));
        
        // Construct the composite game ID for the new architecture
        const gameId = `skn:${skinId}:dna:${skinData.dnaId}`;

        // Create a minimal manifest for the DB entry (registry handles final merge)
        const manifest = {
            name: skinData.name,
            theme: skinData.theme,
            category: "slots",
            evaluatorType: skinData.dnaId.includes('lines') ? 'slots-lines' : 'slots-scatter'
        };

        await db.execute({
            sql: 'INSERT OR REPLACE INTO games (id, name, category, manifest, theme, status) VALUES (?, ?, ?, ?, ?, ?)',
            args: [
                gameId,
                skinData.name,
                'slots',
                JSON.stringify(manifest),
                skinData.theme,
                'live'
            ]
        });

        count++;
        if (count % 10 === 0) console.log(`   [${count}] Published ${skinData.name}`);
    }

    console.log(`✅ Successfully published ${count} localized skins.`);
}

run().catch(console.error);
