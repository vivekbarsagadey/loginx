/**
 * Debug utilities for development
 * Provides helpful debugging tools that are automatically disabled in production
 */

import { isDevelopment } from './env';

/**
 * Colors for console output
 */
const Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Enhanced console.log that only works in development
 */
export function debugLog(message: string, ...args: any[]): void {
  if (isDevelopment()) {
    console.log(`${Colors.blue}[DEBUG]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Log info messages in development
 */
export function debugInfo(message: string, ...args: any[]): void {
  if (isDevelopment()) {
    console.log(`${Colors.cyan}[INFO]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Log warning messages in development
 */
export function debugWarn(message: string, ...args: any[]): void {
  if (isDevelopment()) {
    console.warn(`${Colors.yellow}[WARN]${Colors.reset} ${message}`, ...args);
  }
}

/**
 * Log error messages (works in all environments)
 */
export function debugError(message: string, error?: unknown): void {
  console.error(`${Colors.red}[ERROR]${Colors.reset} ${message}`, error);
}

/**
 * Log a group of related messages
 */
export function debugGroup(label: string, callback: () => void): void {
  if (isDevelopment()) {
    console.group(`${Colors.magenta}[GROUP]${Colors.reset} ${label}`);
    callback();
    console.groupEnd();
  }
}

/**
 * Measure execution time of a function
 */
export async function debugTime<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
  if (!isDevelopment()) {
    return fn();
  }

  const start = performance.now();
  console.time(label);

  try {
    const result = await fn();
    return result;
  } finally {
    console.timeEnd(label);
    const end = performance.now();
    console.log(`${Colors.green}[TIME]${Colors.reset} ${label}: ${(end - start).toFixed(2)}ms`);
  }
}

/**
 * Pretty print an object for debugging
 */
export function debugObject(label: string, obj: any): void {
  if (isDevelopment()) {
    console.log(`${Colors.cyan}[OBJECT]${Colors.reset} ${label}:`, JSON.stringify(obj, null, 2));
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
 * Create a debug instance with a namespace
 */
export function createDebugger(namespace: string) {
  return {
    log: (message: string, ...args: any[]) => debugLog(`[${namespace}] ${message}`, ...args),
    info: (message: string, ...args: any[]) => debugInfo(`[${namespace}] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => debugWarn(`[${namespace}] ${message}`, ...args),
    error: (message: string, error?: unknown) => debugError(`[${namespace}] ${message}`, error),
    group: (label: string, callback: () => void) => debugGroup(`[${namespace}] ${label}`, callback),
    time: <T>(label: string, fn: () => T | Promise<T>) => debugTime(`[${namespace}] ${label}`, fn),
    object: (label: string, obj: any) => debugObject(`[${namespace}] ${label}`, obj),
  };
}
