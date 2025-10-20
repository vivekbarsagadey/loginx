/**
 * Centralized logging utility
 * Replaces console.log statements with proper logging
 * Integrates with monitoring services in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Format log message with timestamp and level
 */
const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

/**
 * Send logs to monitoring service (Sentry, LogRocket, etc.)
 * TODO: Implement actual monitoring service integration
 */
const sendToMonitoring = (_level: LogLevel, _message: string, _context?: LogContext): void => {
  // TODO: Integrate with Sentry or other monitoring service
  // Example:
  // if (!__DEV__ && _level === 'error') {
  //   Sentry.captureException(new Error(_message), { extra: _context });
  // }
};

export const logger = {
  /**
   * Log informational messages (development only)
   * @param message - Log message
   * @param context - Optional context data
   */
  info: (message: string, context?: LogContext): void => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(formatMessage('info', message), context || '');
    }
  },

  /**
   * Log warning messages (all environments)
   * @param message - Warning message
   * @param context - Optional context data
   */
  warn: (message: string, context?: LogContext): void => {
    console.warn(formatMessage('warn', message), context || '');
    sendToMonitoring('warn', message, context);
  },

  /**
   * Log error messages (all environments)
   * @param message - Error message
   * @param error - Error object or context data
   */
  error: (message: string, error?: unknown): void => {
    const errorContext: LogContext = {};

    if (error instanceof Error) {
      errorContext.message = error.message;
      errorContext.stack = error.stack;
      errorContext.name = error.name;
    } else if (error) {
      errorContext.error = error;
    }

    console.error(formatMessage('error', message), errorContext);
    sendToMonitoring('error', message, errorContext);
  },

  /**
   * Log debug messages (development only)
   * @param message - Debug message
   * @param context - Optional context data
   */
  debug: (message: string, context?: LogContext): void => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(formatMessage('debug', message), context || '');
    }
  },

  /**
   * Log with custom level
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context data
   */
  log: (level: LogLevel, message: string, context?: LogContext): void => {
    switch (level) {
      case 'info':
        logger.info(message, context);
        break;
      case 'warn':
        logger.warn(message, context);
        break;
      case 'error':
        logger.error(message, context);
        break;
      case 'debug':
        logger.debug(message, context);
        break;
    }
  },
};

/**
 * Performance logging utility
 */
export const perfLogger = {
  /**
   * Start performance measurement
   * @param label - Measurement label
   * @returns End function to stop measurement
   */
  start: (label: string) => {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;
      logger.debug(`[Performance] ${label}: ${duration}ms`);
      return duration;
    };
  },
};

export default logger;
