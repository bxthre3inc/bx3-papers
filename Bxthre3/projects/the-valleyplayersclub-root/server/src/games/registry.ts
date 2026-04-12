/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import path from 'path';
import type { RuntimeConfig, GameCategory } from '../engine/types';

class GameRegistry {
    private configs: Map<string, RuntimeConfig>;
    private baseDir: string;

    constructor() {
        this.configs = new Map();
        this.baseDir = path.join(import.meta.dir, 'configs');
    }

    /**
     * Loads a specific math profile for a game category
     * @param category e.g., 'slots'
     * @param gameId e.g., 'cyberSlots' or 'skn:slv-crane:dna:standard-scatter'
     * @param profileName e.g., 'standard'
     */
    async getGameConfig(category: GameCategory, gameId: string, profileName: string = 'standard'): Promise<RuntimeConfig> {
        const cacheKey = `${category}:${gameId}:${profileName}`;
        if (this.configs.has(cacheKey)) {
            return this.configs.get(cacheKey)!;
        }

        try {
            // Check if this is a DNA-Skin request
            if (gameId.startsWith('skn:')) {
                const parts = gameId.split(':');
                const skinId = parts[1];
                const dnaId = parts[3];

                // Load DNA
                const dnaPath = path.join(import.meta.dir, 'dna', `${dnaId}.json`);
                const dnaData = await Bun.file(dnaPath).text();
                const dna = JSON.parse(dnaData);

                // Load Skin
                const skinPath = path.join(import.meta.dir, 'skins', `${skinId}.json`);
                const skinData = await Bun.file(skinPath).text();
                const skin = JSON.parse(skinData);

                // Merge: Skin provides name/theme, DNA provides math/reels
                // We map symbols in DNA (S1, S2...) to symbols in Skin
                const symbolMap = skin.symbolMap || {};
                const mappedReels = dna.reels.map((reel: string[]) => 
                    reel.map((sym: string) => symbolMap[sym] || sym)
                );

                const mappedPaytable: any = {};
                Object.keys(dna.paytable).forEach(sym => {
                    mappedPaytable[symbolMap[sym] || sym] = dna.paytable[sym];
                });

                const runtimeConfig: RuntimeConfig = {
                    gameId,
                    name: skin.name,
                    theme: skin.theme,
                    category: category,
                    evaluatorType: dna.evaluatorType,
                    reels: mappedReels,
                    rows: dna.rows,
                    paylines: dna.paylines,
                    profileName: profileName,
                    minBet: skin.minBet || 1,
                    maxBet: skin.maxBet || 1000,
                    paytable: mappedPaytable,
                    ...dna.extraConfig // Any other features
                };

                this.configs.set(cacheKey, runtimeConfig);
                return runtimeConfig;
            }

            // Legacy Standalone Loading
            // Load Game Manifest (Layer 3)
            const manifestPath = path.join(this.baseDir, category, gameId, 'manifest.json');
            const manifestData = await Bun.file(manifestPath).text();
            const manifest = JSON.parse(manifestData);

            // Load Math Profile (Layer 4)
            const profilePath = path.join(this.baseDir, category, gameId, 'profiles', `${profileName}.json`);
            const profileData = await Bun.file(profilePath).text();
            const profile = JSON.parse(profileData);

            // Combine into the finalized "Runtime Config"
            const runtimeConfig: RuntimeConfig = {
                gameId,
                ...manifest,
                ...profile
            };

            this.configs.set(cacheKey, runtimeConfig);
            return runtimeConfig;

        } catch (error) {
            console.error(`[GameRegistry] Failed to load config for ${cacheKey}:`, error);
            throw new Error(`Game Config Not Found: ${cacheKey}`);
        }
    }
}

// Export singleton instance
export default new GameRegistry();
