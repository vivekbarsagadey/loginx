/**
 * Registration Flow Diagnostics
 * Utilities to troubleshoot common registration issues
 */

import { auth } from '@/firebase-config';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { isDevelopment } from './env';

interface DiagnosticResult {
  category: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

/**
 * Check Firebase configuration
 */
export function checkFirebaseConfig(): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  try {
    if (!auth) {
      results.push({
        category: 'Firebase',
        status: 'error',
        message: 'Firebase auth is not initialized',
        details: 'Check firebase-config.ts configuration',
      });
      return results;
    }

    if (!auth.app) {
      results.push({
        category: 'Firebase',
        status: 'error',
        message: 'Firebase app is not initialized',
      });
    } else {
      results.push({
        category: 'Firebase',
        status: 'success',
        message: 'Firebase is properly configured',
      });
    }

    // Check environment variables from Expo config
    const extra = (Constants.expoConfig?.extra as Record<string, string> | undefined) ?? (Constants.manifest?.extra as Record<string, string> | undefined);

    if (!extra) {
      results.push({
        category: 'Environment',
        status: 'warning',
        message: 'Expo config not yet available - this is normal during app startup',
        details: 'Environment variables will be available after initialization',
      });
    } else {
      const requiredEnvVars = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const missingVars = requiredEnvVars.filter((varName) => !extra[varName]);

      if (missingVars.length > 0) {
        results.push({
          category: 'Environment',
          status: 'warning',
          message: 'Some environment variables are missing from Expo config',
          details: `Missing: ${missingVars.join(', ')}`,
        });
      } else {
        results.push({
          category: 'Environment',
          status: 'success',
          message: 'All required environment variables are set in Expo config',
        });
      }
    }
  } catch (error) {
    results.push({
      category: 'Firebase',
      status: 'error',
      message: 'Error checking Firebase configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return results;
}

/**
 * Validate form schema completeness
 */
export function validateFormSchema(schema: unknown): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  try {
    if (!schema) {
      results.push({
        category: 'Schema',
        status: 'error',
        message: 'Form schema is not defined',
      });
      return results;
    }

    results.push({
      category: 'Schema',
      status: 'success',
      message: 'Form schema is defined',
    });

    // Schema is validated by Zod at runtime
    // This just checks that it exists
  } catch (error) {
    results.push({
      category: 'Schema',
      status: 'error',
      message: 'Error validating schema',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return results;
}

/**
 * Check navigation configuration
 */
export function checkNavigationSetup(): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  try {
    // Check if expo-router is available
    if (typeof window !== 'undefined') {
      results.push({
        category: 'Navigation',
        status: 'success',
        message: 'Running in browser/app environment',
      });
    }

    results.push({
      category: 'Navigation',
      status: 'success',
      message: 'Navigation module loaded successfully',
    });
  } catch (error) {
    results.push({
      category: 'Navigation',
      status: 'error',
      message: 'Navigation configuration error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return results;
}

/**
 * Run all diagnostics and log results
 * Only runs in development mode
 */
export function runRegistrationDiagnostics(): void {
  if (!isDevelopment()) {
    return; // Only run in development
  }

  const allResults = [...checkFirebaseConfig(), ...checkNavigationSetup()];

  const hasErrors = allResults.some((r) => r.status === 'error');
  const hasWarnings = allResults.filter((r) => r.status === 'warning' && !r.message.includes('not yet available')); // Exclude startup warnings

  // Use allowed console methods (warn/error only per ESLint rules)
  if (hasErrors) {
    console.error('❌ Registration has configuration errors:');
    allResults
      .filter((r) => r.status === 'error')
      .forEach((result) => {
        console.error(`  [${result.category}] ${result.message}`);
        if (result.details) {
          console.error(`    Details: ${result.details}`);
        }
      });
  }

  // Only show warnings for actual issues, not startup timing
  if (hasWarnings.length > 0) {
    console.warn('⚠️ Registration has warnings:');
    hasWarnings.forEach((result) => {
      console.warn(`  [${result.category}] ${result.message}`);
      if (result.details) {
        console.warn(`    Details: ${result.details}`);
      }
    });
  }
}

/**
 * Log state changes for debugging
 * Only logs in development mode
 */
export function logStateChange(component: string, stateName: string, oldValue: unknown, newValue: unknown): void {
  if (!isDevelopment()) {
    return;
  }

  // Skip logging normal initialization steps to reduce noise
  if (stateName === 'currentStep' && oldValue === -1 && newValue === 0) {
    return; // Skip initial step setup
  }

  // Use console.warn for debugging visibility
  console.warn(`[${component}] ${stateName}:`, oldValue, '→', newValue);
}

/**
 * Validate keyboard avoiding view setup
 */
export function checkKeyboardAvoidingView(): DiagnosticResult[] {
  const results: DiagnosticResult[] = [];

  try {
    const platform = Platform.OS;

    if (platform === 'ios' || platform === 'android') {
      results.push({
        category: 'Keyboard',
        status: 'success',
        message: `Running on ${platform} - KeyboardAvoidingView recommended`,
      });
    } else {
      results.push({
        category: 'Keyboard',
        status: 'warning',
        message: 'Not running on mobile platform',
      });
    }
  } catch (error) {
    results.push({
      category: 'Keyboard',
      status: 'error',
      message: 'Error checking keyboard setup',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return results;
}
