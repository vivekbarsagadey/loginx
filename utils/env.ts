/**
 * Environment variable utilities with type safety
 * Provides safe access to environment variables with validation
 */

/**
 * Get an environment variable with type safety
 * Throws an error if the variable is not set in production
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const env = process.env as Record<string, string | undefined>;
  const value = env[key];

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    // In production, we should fail fast if required env vars are missing
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }

    // In development, warn but don't crash
    console.warn(`⚠️  Missing environment variable: ${key}`);
    return '';
  }

  return value;
}

/**
 * Get a required environment variable
 * Always throws if not set, regardless of environment
 */
export function getRequiredEnvVar(key: string): string {
  const env = process.env as Record<string, string | undefined>;
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || __DEV__;
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' && !__DEV__;
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get the current environment name
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  if (isTest()) {
    return 'test';
  }
  if (isProduction()) {
    return 'production';
  }
  return 'development';
}

/**
 * Google Places API Key (optional)
 * Used for address autocomplete in registration
 */
export const GOOGLE_PLACES_API_KEY = getEnvVar('EXPO_PUBLIC_GOOGLE_PLACES_API_KEY', '');
