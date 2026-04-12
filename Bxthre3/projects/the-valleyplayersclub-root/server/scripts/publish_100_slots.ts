import { db, initDatabase } from '../src/db';
import fs from 'fs';
import path from 'path';

/**
 * PUBLISH GENERATED SLOTS SCRIPT
 * Reads the generated manifests and inserts them into the 'games' table.
 */

const CONFIG_PATH = path.join(process.cwd(), 'src/games/configs/slots');

async function run() {
    console.log('📦 Publishing 100 Slot Themes to Database...');
    await initDatabase();

    const gameDirs = fs.readdirSync(CONFIG_PATH);
    let count = 0;

    for (const dirName of gameDirs) {
        const manifestPath = path.join(CONFIG_PATH, dirName, 'manifest.json');
        if (!fs.existsSync(manifestPath)) continue;

        try {
            const manifestData = fs.readFileSync(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestData);

            await db.execute({
                sql: 'INSERT OR REPLACE INTO games (id, name, category, manifest, theme, status) VALUES (?, ?, ?, ?, ?, ?)',
                args: [
                    dirName,
                    manifest.name,
                    'slots',
                    manifestData,
                    manifest.theme,
                    'live'
                ]
            });

            count++;
            if (count % 10 === 0) console.log(`   [${count}] Published ${manifest.name}`);
        } catch (err) {
            console.error(`Failed to publish ${dirName}:`, err);
        }
    }

    console.log(`✅ Successfully published ${count} games to the 'games' table.`);
}

run().catch(console.error);
