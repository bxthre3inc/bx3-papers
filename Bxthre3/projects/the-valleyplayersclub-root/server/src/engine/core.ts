/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { RNGService } from './rng';
import registry from '../games/registry';
import type { RuntimeConfig, GameCategory, ActionPayload, WagerResult } from './types';
import { GamificationService } from '../services/GamificationService';
import { AnalyticsService } from '../services/AnalyticsService';
import { riskService } from '../services/RiskManagementService';

// Processors (Category Level Physics)
import { SlotProcessor } from './processors/slotProcessor';
import { CrashProcessor } from './processors/crashProcessor';
import { DeckProcessor } from './processors/deckProcessor';
import { CoinProcessor } from './processors/coinProcessor';

import { evaluatorRegistry } from './evaluators/registry';

const PROCESSORS: Record<string, new (config: RuntimeConfig, rng: RNGService) => { execute: (payload: ActionPayload) => Promise<any> }> = {
    'slots': SlotProcessor as any,
    'crash': CrashProcessor as any,
    'cards': DeckProcessor as any,
    'skill': CoinProcessor as any,
};

/**
 * Universal Game Calculation Pipeline
 * 
 * @param userId - The user making the wager
 * @param gameId - e.g., 'cyberSlots' 
 * @param category - e.g., 'slots'
 * @param wager - Bet amount
 * @param actionPayload - Game specific inputs
 * @param userTier - Used to lookup Math Profile
 */
export async function processWager(
    userId: string, 
    gameId: string, 
    category: GameCategory, 
    wager: number, 
    actionPayload: ActionPayload, 
    userTier: string = 'standard'
): Promise<WagerResult> {
    // 1. Fetch Configuration Stack
    const config = await registry.getGameConfig(category, gameId, userTier);

    if (wager < config.minBet || wager > config.maxBet) {
        throw new Error(`Invalid wager amount: ${wager}. Allowed range: ${config.minBet} - ${config.maxBet}`);
    }

    // 2.5 Risk Management Check
    const riskCheck = await riskService.validateWager(wager);
    if (!riskCheck.safe) {
        throw new Error(riskCheck.error || 'Wager rejected by Risk Management');
    }

    // 3. Request Randomness (Persistent & Provably Fair)
    const { RNGPersistenceService } = await import('../services/RNGPersistenceService');
    const rngData = await RNGPersistenceService.getRNGData(userId);
    
    const rng = new RNGService(
        rngData.serverSeed, 
        rngData.clientSeed, 
        rngData.nonce,
        async (newNonce) => {
            // This callback is triggered if RNGService runs out of entropy and needs a fresh hash
            await RNGPersistenceService.incrementNonce(userId);
        }
    );
    await rng.init();

    // 4. Run Category Physics Processor
    const ProcessorClass = PROCESSORS[category];
    if (!ProcessorClass) throw new Error(`Unknown Category Processor: ${category}`);
    
    // 5. Debit Wager from Wallet
    const WalletProcessor = (await import('./wallet')).WalletProcessor;
    const debitResult = await WalletProcessor.processTransaction(userId, wager, 'wager', gameId);
    if (!debitResult.success) {
        throw new Error(debitResult.error || 'Transaction Failed');
    }

    const processor = new ProcessorClass(config as any, rng);
    const gameResultState = await processor.execute(actionPayload);

    // 6. Run Math Feature Evaluator
    const EvaluatorClass = evaluatorRegistry.get(config.evaluatorType);
    
    const evaluator = new EvaluatorClass(config);
    const evaluation = evaluator.calculate(gameResultState, wager, actionPayload);

    // 6.5 Enforce Payout Cap & Update House Bankroll
    const { finalPayout, capped } = await riskService.enforcePayoutCap(evaluation.totalWin);
    const netResultForHouse = wager - finalPayout;
    await riskService.updateHouseBankroll(netResultForHouse);

    // Update evaluation with capped payout
    evaluation.totalWin = finalPayout;

    // 7. Credit Win to Wallet (if applicable)
    let creditResult;
    if (evaluation.totalWin > 0) {
        creditResult = await WalletProcessor.processTransaction(userId, evaluation.totalWin, 'win', gameId, debitResult.transactionId);
    }

    // 8. Award XP and Log Analytics
    await GamificationService.addXP(userId, Math.max(10, Math.floor(wager / 10)));
    await AnalyticsService.logGameEvent(userId, 'wager', gameId, wager);
    if (evaluation.totalWin > 0) {
        await AnalyticsService.logGameEvent(userId, 'payout', gameId, evaluation.totalWin);
    }

    // 9. Automated Achievement Check
    const unlockedAchievements = await GamificationService.checkAchievements(userId, {
        wager,
        payout: evaluation.totalWin,
        gameCategory: category
    });

    // 10. Increment Nonce for next round to ensure freshness
    await (await import('../services/RNGPersistenceService')).RNGPersistenceService.incrementNonce(userId);

    // 11. Return Final Payload
    return {
        userId,
        gameId,
        tierUsed: userTier,
        wager,
        payout: evaluation.totalWin,
        netResult: evaluation.totalWin - wager,
        gameCategory: category,
        state: gameResultState,
        winningCombinations: evaluation.winningCombinations,
        newBalance: creditResult?.newBalance ?? debitResult.newBalance,
        achievements: unlockedAchievements.length > 0 ? unlockedAchievements : undefined,
        provablyFair: {
            serverSeedHash: rngData.hashedServerSeed,
            clientSeed: rngData.clientSeed,
            nonce: rngData.nonce
        }
    };
}
