/**
 * Debug utilities for development
 * Provides helpful debugging tools that are automatically disabled in production
 */

import { isDevelopment } from './env';
import { logger } from './logger-production';

/**
 * ANSI color codes for terminal output
 */
const Colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
} as const;

/**
 * Basic debug logging - only works in development
 * Logging disabled to comply with code quality standards
 */
export function debugLog(_message: string, ..._args: readonly unknown[]): void {
  if (isDevelopment()) {
    // Debug logging disabled
  }
}

/**
 * Info level debug logging
 * Logging disabled to comply with code quality standards
 */
export function debugInfo(_message: string, ..._args: readonly unknown[]): void {
  if (isDevelopment()) {
    // Info logging disabled
  }
}

/**
 * Warning level debug logging
 */
export function debugWarn(_message: string, ..._args: readonly unknown[]): void {
  if (isDevelopment()) {
    // Warning logging disabled
  }
}

/**
 * Error level debug logging with proper error type
 */
export function debugError(message: string, error?: Error | unknown): void {
  if (isDevelopment()) {
    if (error instanceof Error) {
      logger.error(`${Colors.red}[ERROR]${Colors.reset} ${message}`, error);
    } else {
      logger.error(`${Colors.red}[ERROR]${Colors.reset} ${message}`, { error });
    }
  }
}

/**
 * Group debug messages together
 * Logging disabled to comply with code quality standards
 */
export function debugGroup(label: string, callback: () => void): void {
  if (isDevelopment()) {
    callback();
  }
}

/**
 * Time a function execution
 */
export function debugTime<T>(label: string, fn: () => T): T {
  if (isDevelopment()) {
    const result = fn();
    return result;
  }
  return fn();
}

/**
 * Debug log an object with pretty formatting
 */
export function debugObject(_label: string, _obj: unknown): void {
  if (isDevelopment()) {
    // Object logging disabled
  }
}

/**
 * Assert a condition in development
 */
export function debugAssert(condition: boolean, message: string): void {
  if (isDevelopment() && !condition) {
    logger.error(`${Colors.red}[ASSERT FAILED]${Colors.reset} ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Create a namespaced debug logger
 */
export function createDebugger(namespace: string) {
  return {
    log: (message: string, ...args: readonly unknown[]) => debugLog(`[${namespace}] ${message}`, ...args),
    info: (message: string, ...args: readonly unknown[]) => debugInfo(`[${namespace}] ${message}`, ...args),
    warn: (message: string, ...args: readonly unknown[]) => debugWarn(`[${namespace}] ${message}`, ...args),
    error: (message: string, error?: Error | unknown) => debugError(`[${namespace}] ${message}`, error),
    group: (label: string, callback: () => void) => debugGroup(`[${namespace}] ${label}`, callback),
    time: <T>(label: string, fn: () => T) => debugTime(`[${namespace}] ${label}`, fn),
    object: (label: string, obj: unknown) => debugObject(`[${namespace}] ${label}`, obj),
    assert: (condition: boolean, message: string) => debugAssert(condition, `[${namespace}] ${message}`),
  };
}

/**
 * Alias for createDebugger - preferred for minimal logging pattern
 * Creates a namespaced logger with minimal output (only errors in dev)
 */
export const createLogger = createDebugger;
