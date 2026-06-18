import { config } from '../config';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

/**
 * Logger with levels
 */
export const logger = {
  info: (msg: string, data?: any) => {
    if (['info', 'debug'].includes(config.LOG_LEVEL)) {
      console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data ?? '');
    }
  },

  error: (msg: string, error?: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, message ?? '');
  },

  warn: (msg: string, data?: any) => {
    if (['info', 'warn', 'debug'].includes(config.LOG_LEVEL)) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data ?? '');
    }
  },

  debug: (msg: string, data?: any) => {
    if (config.LOG_LEVEL === 'debug') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data ?? '');
    }
  }
};

export type Logger = typeof logger;
export type LoggerLevel = LogLevel;
