import { SlotsLineEvaluator } from './slotsLineEvaluator';
import { CrashEvaluator } from './crashEvaluator';
import { ScatterEvaluator } from './scatterEvaluator';
import { CoinEvaluator } from './coinEvaluator';
import { BlackjackEvaluator } from './blackjackEvaluator';
import { MegawaysEvaluator } from './megawaysEvaluator';
import { StickyWildsEvaluator } from './stickyWildsEvaluator';
import type { RuntimeConfig } from '../types';

export type EvaluatorConstructor = new (config: RuntimeConfig) => { 
    calculate: (state: any, wager: number, payload: any) => any 
};

class EvaluatorRegistry {
    private registry: Map<string, EvaluatorConstructor> = new Map();

    constructor() {
        // Register core evaluators
        this.register('slots-lines', SlotsLineEvaluator);
        this.register('crash-standard', CrashEvaluator);
        this.register('slots-scatter', ScatterEvaluator);
        this.register('coin-toss', CoinEvaluator as any);
        this.register('blackjack-single', BlackjackEvaluator as any);
        this.register('slots-megaways', MegawaysEvaluator as any);
        this.register('slots-sticky-wilds', StickyWildsEvaluator as any);
    }

    register(type: string, evaluator: EvaluatorConstructor) {
        this.registry.set(type, evaluator);
    }

    get(type: string): EvaluatorConstructor {
        const evaluator = this.registry.get(type);
        if (!evaluator) {
            throw new Error(`Evaluator not found: ${type}`);
        }
        return evaluator;
    }

    has(type: string): boolean {
        return this.registry.has(type);
    }
}

export const evaluatorRegistry = new EvaluatorRegistry();
