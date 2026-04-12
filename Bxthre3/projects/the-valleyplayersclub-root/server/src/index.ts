/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import { processWager } from './engine/core';
import { GameArchitect } from './engine/architect';
import { db, initDatabase } from './db';
import { OllamaManager } from './engine/ollamaManager';
import { WalletProcessor } from './engine/wallet';
import { PartnerIntegrationManager, MockPartnerIntegration } from './integrations/PartnerIntegrationManager';
import { GamificationService } from './services/GamificationService';
import { ComplianceService } from './services/ComplianceService';
import { PaymentService } from './services/PaymentService';
import { CashNetworkService } from './services/CashNetworkService';
import { PromotionService } from './services/PromotionService';
import { SocialEngine } from './services/SocialEngine';
import { PersonalizationService } from './services/PersonalizationService';
import { ProfileService } from './services/ProfileService';
import { CompetitionEngine } from './services/CompetitionEngine';
import { MembershipService } from './services/MembershipService';
import pino from 'pino';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './logger';

dotenv.config();

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-only-use-in-local';

// Simple Rate Limiter State
const rateLimits = new Map<string, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 1000;
const MAX_MESSAGES_PER_WINDOW = 10;

// 1. Initialize Partner Manager
const partnerManager = PartnerIntegrationManager.getInstance();

// Register a few demo partners
partnerManager.registerPartner('rsweeps', new MockPartnerIntegration({
    id: 'rsweeps',
    name: 'RSweeps',
    type: 'deep'
}));

partnerManager.registerPartner('fire-kirin', new MockPartnerIntegration({
    id: 'fire-kirin',
    name: 'Fire Kirin',
    type: 'api'
}));

// Initialize Services
await initDatabase();
await ComplianceService.initTables();
await PaymentService.initTables();
await CashNetworkService.initTables();
await PromotionService.initTables();
await SocialEngine.initTables();
await PersonalizationService.initTables();
await ProfileService.initTables();
await CompetitionEngine.initTables();
await MembershipService.initTables();
await OllamaManager.init();

// 2. Connect SocialEngine to WebSockets
SocialEngine.onEvent((event) => {
    server.publish('social_feed', JSON.stringify({
        type: 'social:live_event',
        data: event
    }));
});

const port = parseInt(process.env.PORT || '3001');

const server = Bun.serve<{ authToken: string; userId?: string }>({
    port,
    async fetch(req, server) {
        const url = new URL(req.url);
        
        // 1. Health Check (Public)
        if (url.pathname === '/health') {
            return new Response(JSON.stringify({ 
                status: 'alive', 
                environment: process.env.NODE_ENV || 'development',
                timestamp: new Date().toISOString() 
            }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        // 2. Apply Security Headers (Simplified for Bun.serve)
        const headers = new Headers({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        });

        if (process.env.NODE_ENV === 'production') {
            headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // 3. CORS Check
        const origin = req.headers.get('Origin');
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'https://vpc.zo.computer'];
        
        if (origin && !allowedOrigins.includes(origin)) {
            logger.warn({ origin }, "CORS blocked");
            return new Response("CORS Forbidden", { status: 403 });
        }
        if (origin) {
            headers.set('Access-Control-Allow-Origin', origin);
            headers.set('Access-Control-Allow-Credentials', 'true');
        }

        // 4. Authentication
        const authHeader = req.headers.get('Authorization');
        const token = url.searchParams.get('token') || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);
        
        let decoded: any = null;
        if (token) {
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch (err) {
                logger.warn({ token }, "Invalid JWT attempt");
                if (process.env.NODE_ENV === 'production') {
                    return new Response("Unauthorized", { status: 401, headers });
                }
            }
        }

        if (process.env.NODE_ENV === 'production' && (!token || !decoded)) {
           return new Response("Unauthorized", { status: 401, headers });
        }

        const success = server.upgrade(req, { 
            data: { 
                authToken: token || 'anonymous',
                userId: decoded?.userId || url.searchParams.get('userId') || undefined
            } 
        });
        
        if (success) return undefined;
        return new Response("Valley Players Club Edge Server (Bun) - Online");
    },
    websocket: {
        async open(ws) {
            logger.info({ userId: ws.data.userId }, `[+] Socket opened`);
            ws.subscribe('social_feed'); // Automatically join social feed
        },
        async message(ws, message) {
            const userId = ws.data.userId || 'anonymous';
            
            // Rate Limiting
            const now = Date.now();
            const limit = rateLimits.get(userId) || { count: 0, lastReset: now };
            if (now - limit.lastReset > RATE_LIMIT_WINDOW_MS) {
                limit.count = 0;
                limit.lastReset = now;
            }
            limit.count++;
            rateLimits.set(userId, limit);

            if (limit.count > MAX_MESSAGES_PER_WINDOW) {
                logger.warn({ userId }, "Rate limit exceeded");
                ws.send(JSON.stringify({ type: 'error', message: "Rate limit exceeded. Please slow down." }));
                return;
            }

            try {
                const payload = JSON.parse(message.toString());
                const { type, data } = payload;
                
                logger.debug({ type, userId: ws.data.userId }, "Incoming WS message");

                switch (type) {
                    case 'architect:design': {
                        const result = await GameArchitect.architect(data);
                        ws.send(JSON.stringify({ type: 'architect:preview', data: result }));
                        break;
                    }
                    case 'game:publish': {
                        const { manifest, id, category } = data;
                        await db.execute({
                          sql: 'INSERT OR REPLACE INTO games (id, name, category, manifest, theme) VALUES (?, ?, ?, ?, ?)',
                          args: [id, manifest.name, category, JSON.stringify(manifest), manifest.theme]
                        });
                        ws.send(JSON.stringify({ type: 'game:published', data: { id, status: 'live' } }));
                        break;
                    }
                    case 'balance:sync': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for balance sync");
                        const wallet = await WalletProcessor.getWallet(targetUserId);
                        ws.send(JSON.stringify({ 
                            type: 'balance:update', 
                            data: { 
                                balance: wallet.balances.cash,
                                xp: wallet.xp,
                                level: wallet.level
                            } 
                        }));
                        break;
                    }
                    case 'game:action': {
                        const { gameId, category, wager, actionPayload, userTier, userId: dataUserId } = data;
                        const targetUserId = dataUserId || ws.data.userId;
                        
                        if (!targetUserId) throw new Error("Missing userId for game action");

                        try {
                            const membership = await MembershipService.getActiveMembership(targetUserId);
                             const activeTier = membership ? membership.rtpProfile : (userTier || 'standard');
                             logger.info({ userId: targetUserId, gameId, category, activeTier }, "Processing Wager...");
                             const result = await processWager(
                                 targetUserId,
                                 gameId,
                                 category,
                                 wager,
                                 actionPayload,
                                 activeTier
                             );
                             logger.info({ userId: targetUserId, gameId, payout: result.payout }, "Wager Result");

                            ws.send(JSON.stringify({
                                type: 'game:result',
                                data: result
                            }));
                        } catch (e: unknown) {
                            const error = e as Error;
                            logger.error(error, "Wager processing error");
                            ws.send(JSON.stringify({ type: 'error', message: error.message }));
                        }
                        break;
                    }
                    case 'gamification:daily_spin': {
                        const targetUserId = (data as { userId: string }).userId || ws.data.userId;
                        const { execute } = data as { execute: boolean };
                        try {
                            if (!targetUserId) throw new Error("Missing userId for daily spin");
                            const result = await GamificationService.processDailySpin(targetUserId, execute);
                            ws.send(JSON.stringify({ type: 'gamification:daily_spin_result', data: result }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                        break;
                    }
                    case 'gamification:stats': {
                        const targetUserId = (data as { userId: string }).userId || ws.data.userId;
                        try {
                            if (!targetUserId) throw new Error("Missing userId for stats fetch");
                            const stats = await GamificationService.getPlayerStats(targetUserId);
                            ws.send(JSON.stringify({ type: 'gamification:stats_update', data: stats }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                        break;
                    }
                    case 'partner:session': {
                        const { partnerId, userId: dataUserId } = data as { partnerId: string, userId: string };
                        const targetUserId = dataUserId || ws.data.userId;
                        try {
                            if (!targetUserId) throw new Error("Missing userId for partner session");
                            const session = await partnerManager.createPartnerSession(partnerId, targetUserId);
                            ws.send(JSON.stringify({ type: 'partner:session_ready', data: session }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                        break;
                    }
                    case 'analytics:log': {
                        const { userId: dataUserId, events } = data;
                        const targetUserId = dataUserId || ws.data.userId;
                        const { AnalyticsService } = await import('./services/AnalyticsService');
                        await AnalyticsService.logEvents((events as any[]).map((e: any) => ({ ...e, userId: targetUserId || e.userId })));
                        break;
                    }
                    case 'analytics:fetch_dashboard': {
                        const { AnalyticsService } = await import('./services/AnalyticsService');
                        const heatmap = await AnalyticsService.getHeatmapData();
                        const clusters = await AnalyticsService.getPlayerClusters();
                        ws.send(JSON.stringify({ 
                            type: 'analytics:dashboard_data', 
                            data: { heatmap, clusters } 
                        }));
                        break;
                    }
                    case 'user:verify': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for KYC submission");
                        const result = await ComplianceService.submitKYC(targetUserId, data.imageData);
                        ws.send(JSON.stringify({ type: 'user:kyc_status', data: result }));
                        break;
                    }
                    case 'jurisdiction:check': {
                        const { coords } = data;
                        const ip = server.requestIP(ws)?.address || '127.0.0.1';
                        const result = await ComplianceService.checkJurisdiction(ip, coords);
                        ws.send(JSON.stringify({ type: 'jurisdiction:result', data: result }));
                        break;
                    }
                    case 'wallet:deposit': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for deposit");
                        let result;
                        if (data.type === 'fiat') {
                            result = await PaymentService.processFiatDeposit(targetUserId, data.amount, data.methodId);
                        } else {
                            result = await PaymentService.processCryptoDeposit(targetUserId, data.amount, data.currency);
                        }
                        ws.send(JSON.stringify({ type: 'wallet:deposit_result', data: result }));
                        break;
                    }
                    case 'cash:deposit_request': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for cash request");
                        const result = await CashNetworkService.createDepositRequest(targetUserId, data.amount);
                        ws.send(JSON.stringify({ type: 'cash:token_generated', data: result }));
                        break;
                    }
                    case 'payment:request_btc': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for BTC request");
                        const result = await PaymentService.generateBitcoinDeposit(targetUserId, data.amount);
                        ws.send(JSON.stringify({ type: 'payment:btc_ready', data: result }));
                        break;
                    }
                    case 'payment:request_cashapp': {
                        const targetUserId = data.userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for CashApp request");
                        const result = await PaymentService.generateCashAppDeposit(targetUserId, data.amount);
                        ws.send(JSON.stringify({ type: 'payment:cashapp_ready', data: result }));
                        break;
                    }
                    case 'promo:wheel_status': {
                        const targetUserId = data.userId || ws.data.userId;
                        const status = await PromotionService.getDailyWheelStatus(targetUserId);
                        ws.send(JSON.stringify({ type: 'promo:wheel_status', data: status }));
                        break;
                    }
                    case 'promo:spin_wheel': {
                        const targetUserId = data.userId || ws.data.userId;
                        const result = await PromotionService.spinDailyWheel(targetUserId);
                        ws.send(JSON.stringify({ type: 'promo:wheel_result', data: result }));
                        break;
                    }
                    case 'social:get_jackpot': {
                        ws.send(JSON.stringify({ type: 'social:jackpot_state', data: SocialEngine.getJackpotState() }));
                        break;
                    }
                    case 'social:get_feed': {
                        const feed = await SocialEngine.getLiveFeed(data.limit || 10);
                        ws.send(JSON.stringify({ type: 'social:live_feed', data: feed }));
                        break;
                    }
                    case 'lobby:get_personalized': {
                        const targetUserId = data.userId || ws.data.userId;
                        // Mock games list for ranking demonstration
                        const games = [
                            { id: 'slot-1', title: 'Dragon Gold', category: 'slots', volatility: 'high' },
                            { id: 'fish-1', title: 'Ocean King', category: 'arcade', volatility: 'medium' },
                            { id: 'slot-2', title: 'Lucky Cat', category: 'slots', volatility: 'low' }
                        ];
                        const ranked = await PersonalizationService.getPersonalizedLobby(targetUserId, games);
                        ws.send(JSON.stringify({ type: 'lobby:personalized_list', data: ranked }));
                        break;
                    }
                    case 'user:profile': {
                        const targetUserId = (data as { userId: string }).userId || ws.data.userId;
                        if (!targetUserId) throw new Error("Missing userId for profile fetch");
                        const profile = await ProfileService.getProfileStats(targetUserId);
                        ws.send(JSON.stringify({ type: 'user:profile_data', data: profile }));
                        break;
                    }
                    case 'user:add_friend': {
                        const { friendId } = data as { friendId: string };
                        if (!ws.data.userId) throw new Error("Unauthorized");
                        await ProfileService.addFriend(ws.data.userId, friendId);
                        ws.send(JSON.stringify({ type: 'user:friend_added', friendId }));
                        break;
                    }
                    case 'social:leaderboards': {
                        const { type: lbType, scope, limit } = data as { type: 'wins' | 'wagers', scope: any, limit: number };
                        const lb = await SocialEngine.getLeaderboards(lbType, scope, limit);
                        ws.send(JSON.stringify({ type: 'social:leaderboard_data', data: lb }));
                        break;
                    }
                    case 'competition:create_challenge': {
                        const { opponentId, wager, gameId } = data as { opponentId: string, wager: number, gameId: string };
                        if (!ws.data.userId) throw new Error("Unauthorized");
                        const challenge = await CompetitionEngine.createChallenge(ws.data.userId, opponentId, wager, gameId);
                        ws.send(JSON.stringify({ type: 'competition:challenge_created', data: challenge }));
                        break;
                    }
                    case 'membership:status': {
                        try {
                            const targetUserId = (data as { userId: string }).userId || ws.data.userId;
                            if (!targetUserId) throw new Error("Missing userId for membership fetch");
                            const membership = await MembershipService.getActiveMembership(targetUserId);
                            ws.send(JSON.stringify({ type: 'membership:status_update', data: membership }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                        break;
                    }
                    case 'membership:buy': {
                        try {
                            const { tierId } = data as { tierId: string };
                            if (!ws.data.userId) throw new Error("Unauthorized");
                            const result = await MembershipService.subscribe(ws.data.userId, tierId);
                            ws.send(JSON.stringify({ type: 'membership:purchase_success', data: result }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: err.message }));
                        }
                        break;
                    }
                    default:
                        logger.warn(`Unknown message type: ${type}`);
                }
            } catch (err) {
                logger.error(err, "WebSocket message error");
            }
        },
        async close(ws) {
            logger.info({ userId: ws.data.userId }, `[-] Socket closed`);
        },
    },
});

logger.info(`🚀 VPC Edge Server (Hardened) running at ${server.hostname}:${server.port}`);
