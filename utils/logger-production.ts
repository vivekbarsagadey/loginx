/**
 * Production-Safe Logger - TASK-002 (SEC-002)
 *
 * This logger provides:
 * 1. Environment-based log level filtering
 * 2. PII (Personally Identifiable Information) redaction
 * 3. Structured logging for easier analysis
 * 4. Safe error serialization
 * 5. Integration-ready for external logging services (Sentry, DataDog, etc.)
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/utils/logger-production';
 *
 * logger.debug('Debug message', { userId: '123' });
 * logger.info('User logged in', { email: 'user@example.com' }); // Email will be redacted
 * logger.warn('API rate limit approaching', { remaining: 10 });
 * logger.error('Authentication failed', { error });
 * ```
 *
 * @module logger-production
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

/**
 * Configuration for the logger
 */
interface LoggerConfig {
  /** Minimum log level to output (logs below this level are suppressed) */
  minLevel: LogLevel;
  /** Whether to redact PII from logs */
  redactPII: boolean;
  /** Whether to include timestamps */
  includeTimestamp: boolean;
  /** External logging service integration (optional) */
  externalLogger?: ExternalLogger;
}

/**
 * Interface for external logging services (Sentry, DataDog, etc.)
 */
interface ExternalLogger {
  debug?: (message: string, context?: Record<string, unknown>) => void;
  info?: (message: string, context?: Record<string, unknown>) => void;
  warn?: (message: string, context?: Record<string, unknown>) => void;
  error?: (message: string, _error?: Error, context?: Record<string, unknown>) => void;
}

/**
 * Structured log entry
 */
interface LogEntry {
  level: keyof typeof LogLevel;
  message: string;
  timestamp?: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * PII patterns to redact (emails, phone numbers, tokens, API keys, passwords)
 */
const PII_PATTERNS = [
  // Email addresses
  { pattern: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, replacement: '***@***.***' },

  // Phone numbers (various formats)
  { pattern: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)(\d{3}[-.\s]?\d{4})/g, replacement: '***-***-****' },

  // JWT tokens (Bearer tokens)
  { pattern: /Bearer\s+[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g, replacement: 'Bearer [REDACTED]' },

  // API keys (generic patterns)
  { pattern: /(?:api[_-]?key|apikey|api[_-]?secret)[\s:=]+['"]*([A-Za-z0-9_-]{20,})['"]/gi, replacement: 'api_key=[REDACTED]' },

  // Firebase UID patterns
  { pattern: /\b[A-Za-z0-9]{28}\b/g, replacement: '[UID-REDACTED]' },

  // Passwords in objects (case-insensitive)
  { pattern: /(?:password|passwd|pwd)[\s:=]+['"]*([^'"\s,}]+)['"]/gi, replacement: 'password=[REDACTED]' },

  // Credit card numbers (basic pattern)
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '****-****-****-****' },

  // Social security numbers (US format)
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '***-**-****' },
];

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  // Development: Show all logs, Production: Only warnings and errors
  minLevel: __DEV__ ? LogLevel.DEBUG : LogLevel.WARN,
  // Always redact PII in production, optional in development
  redactPII: !__DEV__,
  // Include timestamps in all environments
  includeTimestamp: true,
  // No external logger by default (can be configured later)
  externalLogger: undefined,
};

/**
 * Production-safe logger class
 */
class ProductionLogger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set external logging service (Sentry, DataDog, etc.)
   */
  setExternalLogger(externalLogger: ExternalLogger): void {
    this.config.externalLogger = externalLogger;
  }

  /**
   * Redact PII from a string
   */
  private redactPII(value: string): string {
    if (!this.config.redactPII) {
      return value;
    }

    let redacted = value;
    for (const { pattern, replacement } of PII_PATTERNS) {
      redacted = redacted.replace(pattern, replacement);
    }
    return redacted;
  }

  /**
   * Redact PII from unknown value (string, object, array)
   */
  private redactValue(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.redactPII(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.redactValue(item));
    }

    if (value && typeof value === 'object') {
      // Handle Error objects specially
      if (value instanceof Error) {
        return {
          name: value.name,
          message: this.redactPII(value.message),
          stack: this.config.redactPII ? '[REDACTED]' : value.stack,
        };
      }

      // Recursively redact object properties
      const redacted: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        redacted[key] = this.redactValue(val);
      }
      return redacted;
    }

    return value;
  }

  /**
   * Format a log entry
   */
  private formatLogEntry(entry: LogEntry): string {
    const parts: string[] = [];

    // Timestamp
    if (this.config.includeTimestamp && entry.timestamp) {
      parts.push(`[${entry.timestamp}]`);
    }

    // Log level
    parts.push(`[${entry.level}]`);

    // Message
    parts.push(entry.message);

    // Context (if unknown)
    if (entry.context) {
      parts.push(JSON.stringify(entry.context, null, 2));
    }

    // Error stack (if unknown)
    if (entry.error && entry.error.stack && !this.config.redactPII) {
      parts.push(`\nStack: ${entry.error.stack}`);
    }

    return parts.join(' ');
  }

  /**
   * Log a message at the specified level
   */
  private log(level: LogLevel, levelName: keyof typeof LogLevel, message: string, contextOrError?: Record<string, unknown> | Error): void {
    // Suppress logs below minimum level
    if (level < this.config.minLevel) {
      return;
    }

    // Prepare log entry
    let context: Record<string, unknown> | undefined;
    let error: Error | undefined;

    if (contextOrError instanceof Error) {
      error = contextOrError;
    } else {
      context = contextOrError;
    }

    // Redact PII
    const redactedMessage = this.redactPII(message);
    const redactedContext = context ? (this.redactValue(context) as Record<string, unknown>) : undefined;
    const redactedError = error ? (this.redactValue(error) as Error) : undefined;

    const entry: LogEntry = {
      level: levelName,
      message: redactedMessage,
      timestamp: this.config.includeTimestamp ? new Date().toISOString() : undefined,
      context: redactedContext,
      error: redactedError,
    };

    // Format and output to console
    const formattedMessage = this.formatLogEntry(entry);

    switch (level) {
      case LogLevel.DEBUG:
        // eslint-disable-next-line no-console
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        // eslint-disable-next-line no-console
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }

    // Send to external logger if configured
    if (this.config.externalLogger) {
      const externalContext: Record<string, unknown> = {
        ...(redactedContext || {}),
        timestamp: entry.timestamp,
      };

      switch (level) {
        case LogLevel.DEBUG:
          this.config.externalLogger.debug?.(redactedMessage, externalContext);
          break;
        case LogLevel.INFO:
          this.config.externalLogger.info?.(redactedMessage, externalContext);
          break;
        case LogLevel.WARN:
          this.config.externalLogger.warn?.(redactedMessage, externalContext);
          break;
        case LogLevel.ERROR:
          this.config.externalLogger.error?.(redactedMessage, redactedError, externalContext);
          break;
      }
    }
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, 'INFO', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, 'WARN', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, _errorOrContext?: Error | Record<string, unknown>): void {
    this.log(LogLevel.ERROR, 'ERROR', message, _errorOrContext);
  }
}

/**
 * Global logger instance
 */
export const logger = new ProductionLogger();

/**
 * Export types for external use
 */
export type { ExternalLogger, LogEntry, LoggerConfig };
