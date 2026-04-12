/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

/**
 * Core Types for the Valley Players Club Game Engine
 */

export type GameCategory = 'slots' | 'cards' | 'skill' | 'crash';

export interface SymbolDefinition {
    id: string;
    name: string;
    icon?: string;
}

export interface Paytable {
    [symbolId: string]: {
        [matchCount: string]: number; // Match count -> Win multiplier (e.g., "3": 5)
    };
}

export interface PaylinePosition {
    row: number;
    col: number;
}

export type Payline = PaylinePosition[];

export interface GameManifest {
    name: string;
    theme: string;
    category: GameCategory;
    evaluatorType: string;
    [key: string]: any;
}

export interface SlotManifest extends GameManifest {
    reels: string[][];
    rows: number;
    paylines: Payline[];
}

export interface MathProfile {
    profileName: string;
    minBet: number;
    maxBet: number;
    paytable: Paytable;
    [key: string]: any;
}

export interface RuntimeConfig extends GameManifest, MathProfile {
    gameId: string;
}

export interface GameResultState {
    matrix?: string[][];
    stops?: number[];
    [key: string]: any; 
}

export interface WinningCombination {
    lineId?: number;
    symbols: string[];
    matchCount: number;
    winAmount: number;
}

export interface WagerResult {
    userId: string;
    gameId: string;
    tierUsed: string;
    wager: number;
    payout: number;
    netResult: number;
    gameCategory: GameCategory;
    state: GameResultState;
    winningCombinations: WinningCombination[];
    newBalance: number;
    achievements?: string[];
    provablyFair?: {
        serverSeedHash: string;
        clientSeed: string;
        nonce: number;
    };
}

export interface ActionPayload {
    [key: string]: string | number | boolean | object | any[]; // Refined from any
}
