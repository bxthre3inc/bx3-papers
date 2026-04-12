/**
 * MODULAR DAP > Module: E-DAP
 * Project: Valley Players Club
 */

import pino from 'pino';
import * as dotenv from 'dotenv';

dotenv.config();

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});
