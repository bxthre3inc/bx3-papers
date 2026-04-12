/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

export type IntegrationType = 'deep' | 'shallow' | 'api';

export interface PartnerConfig {
  id: string;
  name: string;
  type: IntegrationType;
  baseUrl?: string;
  apiKey?: string;
  metadata?: Record<string, any>;
}

export interface PartnerSession {
  sessionId: string;
  playerId: string;
  partnerId: string;
  token: string;
  expiresAt: Date;
}

export abstract class BasePartnerIntegration {
  constructor(protected config: PartnerConfig) {}

  /**
   * Initialize a session for the player on the partner platform.
   */
  abstract createSession(playerId: string): Promise<PartnerSession>;

  /**
   * Sync balance (for 'deep' integrations).
   */
  abstract syncBalance(playerId: string): Promise<number>;

  /**
   * Log a transaction or event.
   */
  abstract logEvent(playerId: string, eventType: string, payload: any): Promise<void>;
}
