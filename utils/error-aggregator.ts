/**
 * TASK-047: Error Aggregator
 * Prevents alert spam during cascading failures
 * Aggregates errors in time windows and shows single consolidated message
 */

import i18n from '@/i18n';
import { debugLog, debugWarn } from './debug';
import { type ClassifiedError, classifyError } from './error-classifier';

interface AggregatedError {
  errors: ClassifiedError[];
  count: number;
  firstOccurred: number;
  lastOccurred: number;
}

/**
 * Aggregation window in milliseconds
 * Errors within this window are grouped together
 */
const AGGREGATION_WINDOW = 1000; // 1 second

/**
 * Maximum errors to track per window
 */
const MAX_ERRORS_PER_WINDOW = 10;

/**
 * Minimum time between showing aggregated errors
 */
const MIN_DISPLAY_INTERVAL = 3000; // 3 seconds

/**
 * Current aggregation state
 */
let currentAggregation: AggregatedError | null = null;
let lastDisplayTime = 0;
let aggregationTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Callback for displaying aggregated errors
 */
type ErrorDisplayCallback = (message: string, details?: string[]) => void;
let errorDisplayCallback: ErrorDisplayCallback | null = null;

/**
 * Set callback for displaying errors
 */
export function setErrorDisplayCallback(callback: ErrorDisplayCallback): void {
  errorDisplayCallback = callback;
  debugLog('[ErrorAggregator] Display callback set');
}

/**
 * Add error to aggregation
 */
export function addError(error: unknown): void {
  const classified = classifyError(error);
  const now = Date.now();

  // Initialize aggregation if needed
  if (!currentAggregation) {
    currentAggregation = {
      errors: [],
      count: 0,
      firstOccurred: now,
      lastOccurred: now,
    };
  }

  // Add error to aggregation
  if (currentAggregation.errors.length < MAX_ERRORS_PER_WINDOW) {
    currentAggregation.errors.push(classified);
  }
  currentAggregation.count++;
  currentAggregation.lastOccurred = now;

  debugLog(`[ErrorAggregator] Added error (${currentAggregation.count} total):`, classified.userMessage);

  // Clear existing timeout
  if (aggregationTimeoutId) {
    clearTimeout(aggregationTimeoutId);
  }

  // Set timeout to display after aggregation window
  aggregationTimeoutId = setTimeout(() => {
    displayAggregatedErrors();
  }, AGGREGATION_WINDOW);
}

/**
 * Display aggregated errors
 */
function displayAggregatedErrors(): void {
  if (!currentAggregation || currentAggregation.count === 0) {
    return;
  }

  const now = Date.now();
  const timeSinceLastDisplay = now - lastDisplayTime;

  // Throttle display to prevent spam
  if (timeSinceLastDisplay < MIN_DISPLAY_INTERVAL) {
    debugLog(`[ErrorAggregator] Throttling display (${timeSinceLastDisplay}ms since last)`);
    // Reschedule for later
    aggregationTimeoutId = setTimeout(() => {
      displayAggregatedErrors();
    }, MIN_DISPLAY_INTERVAL - timeSinceLastDisplay);
    return;
  }

  const { errors, count } = currentAggregation;

  // Build message
  let message: string;
  const details: string[] = [];

  if (count === 1) {
    // Single error - show full message
    message = errors[0].userMessage;
    if (errors[0].recoverySuggestions.length > 0) {
      details.push(...errors[0].recoverySuggestions);
    }
  } else {
    // Multiple errors - show aggregated message
    message = i18n.t('errors.multipleErrors', { count }) || `${count} errors occurred`;

    // Group errors by category
    const errorsByCategory = new Map<string, ClassifiedError[]>();
    for (const error of errors) {
      const existing = errorsByCategory.get(error.category) || [];
      existing.push(error);
      errorsByCategory.set(error.category, existing);
    }

    // Add category summaries
    for (const [category, categoryErrors] of errorsByCategory.entries()) {
      details.push(`${category}: ${categoryErrors.length} error(s)`);
    }

    // Add recovery suggestions from most severe error
    const mostSevere = errors.reduce((prev, curr) => {
      const severityOrder = { fatal: 0, recoverable: 1, warning: 2, info: 3 };
      return severityOrder[curr.severity] < severityOrder[prev.severity] ? curr : prev;
    });

    if (mostSevere.recoverySuggestions.length > 0) {
      details.push('', 'Suggested actions:');
      details.push(...mostSevere.recoverySuggestions);
    }
  }

  debugLog(`[ErrorAggregator] Displaying aggregated errors:`, message);

  // Display via callback
  if (errorDisplayCallback) {
    errorDisplayCallback(message, details);
  } else {
    debugWarn('[ErrorAggregator] No display callback set, errors not shown to user');
  }

  // Reset aggregation
  currentAggregation = null;
  aggregationTimeoutId = null;
  lastDisplayTime = now;
}

/**
 * Clear current aggregation
 */
export function clearAggregation(): void {
  if (aggregationTimeoutId) {
    clearTimeout(aggregationTimeoutId);
    aggregationTimeoutId = null;
  }
  currentAggregation = null;
  debugLog('[ErrorAggregator] Aggregation cleared');
}

/**
 * Get current aggregation statistics
 */
export function getAggregationStats(): {
  hasErrors: boolean;
  errorCount: number;
  timeWindow: number;
} {
  if (!currentAggregation) {
    return {
      hasErrors: false,
      errorCount: 0,
      timeWindow: 0,
    };
  }

  return {
    hasErrors: true,
    errorCount: currentAggregation.count,
    timeWindow: currentAggregation.lastOccurred - currentAggregation.firstOccurred,
  };
}
