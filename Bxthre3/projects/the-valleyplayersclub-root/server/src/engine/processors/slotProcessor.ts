/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import type { RNGService } from '../rng';
import type { SlotManifest, GameResultState, ActionPayload } from '../types';

/**
 * Category Processor for Slots
 * Responsible for physics: Stopping N reels based on RNG to create a matrix.
 */
export class SlotProcessor {
    private config: SlotManifest;
    private rng: RNGService;

    /**
     * @param config The compiled Game Config
     * @param rng The deterministic RNG instance
     */
    constructor(config: SlotManifest, rng: RNGService) {
        this.config = config;
        this.rng = rng;
    }

    /**
     * Executes the slot physics (stopping reels)
     * @param _payload e.g., { activeLines: 5 } (unused for now)
     * @returns The generated 2D Symbol Matrix and reel stops
     */
    async execute(_payload: ActionPayload = {}): Promise<GameResultState> {
        const { reels, rows } = this.config;
        
        const stops: number[] = [];
        const matrix: string[][] = []; // Rows[Columns[Symbols]]

        // Initialize empty matrix [rows][cols]
        for (let r = 0; r < rows; r++) {
            matrix[r] = [];
        }

        // Generate stops and populate the visible matrix
        for (let currReel = 0; currReel < reels.length; currReel++) {
            const strip = reels[currReel];
            
            // Randomly select a stopping index on this reel
            const stopIndex = await this.rng.getInt(0, strip.length - 1);
            stops.push(stopIndex);

            // Populate the 'rows' worth of symbols from that stop index
            for (let r = 0; r < rows; r++) {
                // If we reach the end of the strip, wrap around to the beginning
                const symbolIndex = (stopIndex + r) % strip.length;
                matrix[r][currReel] = strip[symbolIndex];
            }
        }

        return {
            matrix,
            stops
        };
    }
}
