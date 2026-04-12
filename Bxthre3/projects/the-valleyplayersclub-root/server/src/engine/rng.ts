/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

/**
 * RNG Service for Deterministic Game Outcomes
 * Generates provably fair random numbers based on server seed, client seed, and nonce.
 * Utilizes the native Web Crypto API (supported by Bun, Deno, Cloudflare Workers, and modern browsers).
 */
export class RNGService {
    private serverSeed: string;
    private clientSeed: string;
    private nonce: number;
    private currentHash: string;
    private cursor: number;
    private onNonceIncrement?: (newNonce: number) => Promise<void>;

    constructor(serverSeed?: string, clientSeed?: string, nonce?: number, onNonceIncrement?: (newNonce: number) => Promise<void>) {
        // Fallback to Web Crypto randomUUID() if no server seed provided
        this.serverSeed = serverSeed || crypto.randomUUID();
        this.clientSeed = clientSeed || 'default_client_seed';
        this.nonce = nonce || 0;
        this.currentHash = '';
        this.cursor = 0;
        this.onNonceIncrement = onNonceIncrement;
    }

    /**
     * Initializes the first hash. Must be called immediately after instantiation 
     * if awaiting async WebCrypto operations.
     */
    async init(): Promise<void> {
        this.currentHash = await this._generateHash();
        this.cursor = 0;
    }

    /**
     * Generates an HMAC-SHA256 hash using the Web Crypto API
     */
    private async _generateHash(): Promise<string> {
        const message = `${this.clientSeed}:${this.nonce}`;
        const encoder = new TextEncoder();
        
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(this.serverSeed),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(message)
        );

        // Convert ArrayBuffer to Hex String
        const hashArray = Array.from(new Uint8Array(signature));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Gets the next 4 bytes (8 hex chars) from the hash and converts to a float [0, 1)
     */
    async getFloat(): Promise<number> {
        // If we haven't initialized or if we run out of hash entropy
        if (!this.currentHash || this.cursor >= 64 - 8) { 
            this.nonce++;
            if (this.onNonceIncrement) {
                await this.onNonceIncrement(this.nonce);
            }
            this.currentHash = await this._generateHash();
            this.cursor = 0;
        }

        const hexSubset = this.currentHash.substring(this.cursor, this.cursor + 8);
        this.cursor += 8;

        const intValue = parseInt(hexSubset, 16);
        return intValue / 4294967296; // Divide by 2^32
    }

    /**
     * Gets a random integer between min and max (inclusive)
     */
    async getInt(min: number, max: number): Promise<number> {
        const float = await this.getFloat();
        return Math.floor(float * (max - min + 1)) + min;
    }

    /**
     * Randomly picks an element from an array
     */
    async pick<T>(array: T[]): Promise<T> {
        const index = await this.getInt(0, array.length - 1);
        return array[index];
    }
}
