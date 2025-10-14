/**
 * @module utils/monitoring
 * @description Production monitoring utilities with Sentry integration
 * TASK-105 to TASK-110: Sentry integration, performance monitoring, custom events
 */

import * as Sentry from '@sentry/react-native';
import { reactNativeTracingIntegration, reactNavigationIntegration } from '@sentry/react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { createLogger } from './debug';

const logger = createLogger('Monitoring');

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  syncQueueSize: number;
  cacheHitRate: number;
  errorCount: number;
  avgResponseTime: number;
  memoryUsage: number;
  networkLatency: number;
}

/**
 * Security event types for audit logging
 */
export enum SecurityEventType {
  LOGIN = 'auth.login',
  LOGOUT = 'auth.logout',
  LOGIN_FAILED = 'auth.login_failed',
  PASSWORD_CHANGE = 'auth.password_change',
  PASSWORD_RESET = 'auth.password_reset',
  ACCOUNT_DELETION = 'auth.account_deletion',
  TWO_FACTOR_ENABLED = 'auth.2fa_enabled',
  TWO_FACTOR_DISABLED = 'auth.2fa_disabled',
  BIOMETRIC_ENABLED = 'auth.biometric_enabled',
  BIOMETRIC_DISABLED = 'auth.biometric_disabled',
  SECURITY_SETTINGS_CHANGED = 'auth.security_settings_changed',
}

/**
 * Initialize Sentry monitoring
 * TASK-105: Integrate Sentry SDK with React Native configuration
 */
export function initializeSentry(): void {
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    logger.warn('Sentry DSN not configured - monitoring disabled');
    return;
  }

  try {
    Sentry.init({
      dsn: sentryDsn,
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      // TASK-106: Configure error boundaries and automatic breadcrumb tracking
      enableNative: true,
      enableNativeCrashHandling: true,
      attachScreenshot: true,
      attachStacktrace: true,
      // TASK-108: Performance monitoring
      tracesSampleRate: __DEV__ ? 1.0 : 0.1,
      enableAutoPerformanceTracing: true,
      enableWatchdogTerminationTracking: Platform.OS === 'ios',
      // Environment configuration
      environment: __DEV__ ? 'development' : 'production',
      debug: __DEV__,
      release: `${Constants.expoConfig?.name}@${Constants.expoConfig?.version}`,
      dist: Constants.expoConfig?.android?.versionCode?.toString() || '1',
      // Integrations
      integrations: [reactNativeTracingIntegration(), reactNavigationIntegration()],
    });

    logger.log('Sentry monitoring initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry:', error);
  }
}

/**
 * Set user context for Sentry
 * TASK-107: Add custom Sentry context: user ID, session ID, device info
 */
export function setUserContext(userId: string, email?: string, displayName?: string): void {
  try {
    Sentry.setUser({
      id: userId,
      email,
      username: displayName,
    });

    // Add device context
    Sentry.setContext('device', {
      platform: Platform.OS,
      version: Platform.Version,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      osVersion: Device.osVersion,
      deviceType: Device.deviceType,
    });

    // Add app context
    Sentry.setContext('app', {
      name: Constants.expoConfig?.name,
      version: Constants.expoConfig?.version,
      buildNumber: Constants.expoConfig?.android?.versionCode,
      environment: __DEV__ ? 'development' : 'production',
    });

    logger.log('User context set successfully');
  } catch (error) {
    logger.error('Failed to set user context:', error);
  }
}

/**
 * Clear user context on logout
 */
export function clearUserContext(): void {
  try {
    Sentry.setUser(null);
    logger.log('User context cleared');
  } catch (error) {
    logger.error('Failed to clear user context:', error);
  }
}

/**
 * Track security-critical action
 * TASK-109: Create custom Sentry events for security-critical actions
 */
export function trackSecurityEvent(eventType: SecurityEventType, metadata?: Record<string, unknown>): void {
  try {
    Sentry.addBreadcrumb({
      category: 'security',
      message: eventType,
      level: 'info',
      data: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    });

    // Log to audit trail
    logger.log(`Security event: ${eventType}`, metadata);
  } catch (error) {
    logger.error('Failed to track security event:', error);
  }
}

/**
 * Capture error with context
 */
export function captureError(error: Error, context?: Record<string, unknown>): void {
  try {
    if (context) {
      Sentry.setContext('error_context', context);
    }
    Sentry.captureException(error);
    logger.error('Error captured:', { error, context });
  } catch (err) {
    logger.error('Failed to capture error:', err);
  }
}

/**
 * Track performance metric
 * TASK-108: Implement performance monitoring using React Native Performance API
 */
export function trackPerformance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
  try {
    // TODO: Update to Sentry v7 startSpan API
    // For now, just log the performance metric
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${operation}: ${duration}ms`,
      level: 'info',
      data: metadata,
    });

    logger.log(`Performance tracked: ${operation} (${duration}ms)`, metadata);
  } catch (error) {
    logger.error('Failed to track performance:', error);
  }
}

/**
 * Get current performance metrics
 * TASK-112: Create monitoring dashboard showing key metrics
 */
export async function getPerformanceMetrics(): Promise<PerformanceMetrics> {
  try {
    // Import cache utilities
    const { getCacheStats } = await import('./cache');
    const { getQueueStats } = await import('./local-first');

    const cacheStats = await getCacheStats();
    const queueStats = getQueueStats();

    return {
      syncQueueSize: queueStats.queueSize,
      cacheHitRate: Number(cacheStats.hitRate) || 0,
      errorCount: 0, // Would be tracked separately
      avgResponseTime: 0, // Would be calculated from transaction data
      memoryUsage: 0, // Would use performance.memory if available
      networkLatency: 0, // Would be measured from network calls
    };
  } catch (error) {
    logger.error('Failed to get performance metrics:', error);
    return {
      syncQueueSize: 0,
      cacheHitRate: 0,
      errorCount: 0,
      avgResponseTime: 0,
      memoryUsage: 0,
      networkLatency: 0,
    };
  }
}

/**
 * Set up Sentry alerts
 * TASK-110: Set up Sentry alerts for high error rates and critical errors
 */
export function configureSentryAlerts(): void {
  // This is configured in Sentry dashboard, but we can set up client-side thresholds
  const ERROR_RATE_THRESHOLD = 10; // errors per minute
  const errorCounts: number[] = [];

  const checkErrorRate = () => {
    const recentErrors = errorCounts.filter((timestamp) => Date.now() - timestamp < 60000).length;

    if (recentErrors > ERROR_RATE_THRESHOLD) {
      Sentry.captureMessage(`High error rate detected: ${recentErrors} errors in the last minute`, 'warning');
      logger.warn(`High error rate: ${recentErrors} errors/min`);
    }
  };

  // Check every 10 seconds
  setInterval(checkErrorRate, 10000);
}

/**
 * Start performance transaction
 */
export function startTransaction(name: string, operation: string) {
  try {
    // TODO: Update to Sentry v7 startSpan API
    // For now, return null and use addBreadcrumb instead
    Sentry.addBreadcrumb({
      category: 'transaction',
      message: `Started: ${name}`,
      level: 'info',
    });
    return null;
  } catch (error) {
    logger.error('Failed to start transaction:', error);
    return null;
  }
}

/**
 * Add breadcrumb for debugging
 * TASK-106: Automatic breadcrumb tracking
 */
export function addBreadcrumb(message: string, category: string, level: 'debug' | 'info' | 'warning' | 'error' = 'info', data?: Record<string, unknown>): void {
  try {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  } catch (error) {
    logger.error('Failed to add breadcrumb:', error);
  }
}
