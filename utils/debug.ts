/**
 * Debug utilities for development
 * Provides helpful debugging tools that are automatically disabled in production
 */

import { isDevelopment } from './env';

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
 * Uses console.warn to comply with ESLint restrictions
 */
export function debugLog(message: string, ...args: readonly unknown[]): void {
  if (isDevelopment()) {
    console.warn(`${Colors.blue}[DEBUG]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Info level debug logging
 * Uses console.warn to comply with ESLint restrictions
 */
export function debugInfo(message: string, ...args: readonly unknown[]): void {
  if (isDevelopment()) {
    console.warn(`${Colors.cyan}[INFO]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Warning level debug logging
 */
export function debugWarn(message: string, ...args: readonly unknown[]): void {
  if (isDevelopment()) {
    console.warn(`${Colors.yellow}[WARN]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Error level debug logging with proper error type
 */
export function debugError(message: string, error?: Error | unknown): void {
  if (isDevelopment()) {
    if (error instanceof Error) {
      console.error(`${Colors.red}[ERROR]${Colors.reset} ${message}`, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error(`${Colors.red}[ERROR]${Colors.reset} ${message}`, error);
    }
  }
}

/**
 * Group debug messages together
 * Uses console.warn for grouping to comply with ESLint restrictions
 */
export function debugGroup(label: string, callback: () => void): void {
  if (isDevelopment()) {
    console.warn(`${Colors.magenta}[GROUP START]${Colors.reset} ${label}`);
    callback();
    console.warn(`${Colors.magenta}[GROUP END]${Colors.reset} ${label}`);
  }
}

/**
 * Time a function execution
 */
export function debugTime<T>(label: string, fn: () => T): T {
  if (isDevelopment()) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.warn(`${Colors.green}[TIME]${Colors.reset} ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return fn();
}

/**
 * Debug log an object with pretty formatting
 */
export function debugObject(label: string, obj: unknown): void {
  if (isDevelopment()) {
    console.warn(`${Colors.cyan}[OBJECT]${Colors.reset} ${label}:`, JSON.stringify(obj, null, 2));
  }
}

/**
 * Assert a condition in development
 */
export function debugAssert(condition: boolean, message: string): void {
  if (isDevelopment() && !condition) {
    console.error(`${Colors.red}[ASSERT FAILED]${Colors.reset} ${message}`);
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
