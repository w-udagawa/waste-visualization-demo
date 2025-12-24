/**
 * Simple Logger for Production
 */

export const logger = {
  info: (message: string, data?: Record<string, unknown>) => {
    console.log(`[INFO] ${message}`, data ?? '');
  },
  error: (message: string, error?: Error, data?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, error?.message ?? '', data ?? '');
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, data ?? '');
  },
};
