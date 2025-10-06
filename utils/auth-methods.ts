/**
 * Authentication Methods Configuration
 * Centralized utility to check which authentication methods are enabled
 * Controls the availability of different login/registration methods
 */

import { Config } from './config';

/**
 * Available authentication methods
 */
export enum AuthMethod {
  EMAIL_PASSWORD = 'emailPassword',
  EMAIL_MAGIC_LINK = 'emailMagicLink',
  EMAIL_OTP = 'emailOtp',
  PHONE_OTP = 'phoneOtp',
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  BIOMETRIC = 'biometric',
  TWO_FACTOR = 'twoFactor',
}

/**
 * Check if a specific authentication method is enabled
 * @param method - The authentication method to check
 * @returns true if the method is enabled, false otherwise
 */
export const isAuthMethodEnabled = (method: AuthMethod): boolean => {
  return Config.authMethods[method] === true;
};

/**
 * Get all enabled authentication methods
 * @returns Array of enabled authentication method names
 */
export const getEnabledAuthMethods = (): AuthMethod[] => {
  return Object.entries(Config.authMethods)
    .filter(([_, enabled]) => enabled === true)
    .map(([method]) => method as AuthMethod);
};

/**
 * Check if at least one email-based authentication method is enabled
 * @returns true if any email method is enabled
 */
export const hasEmailAuthMethod = (): boolean => {
  return isAuthMethodEnabled(AuthMethod.EMAIL_PASSWORD) || isAuthMethodEnabled(AuthMethod.EMAIL_MAGIC_LINK) || isAuthMethodEnabled(AuthMethod.EMAIL_OTP);
};

/**
 * Check if at least one social authentication method is enabled
 * @returns true if any social method is enabled
 */
export const hasSocialAuthMethod = (): boolean => {
  return isAuthMethodEnabled(AuthMethod.GOOGLE) || isAuthMethodEnabled(AuthMethod.APPLE) || isAuthMethodEnabled(AuthMethod.FACEBOOK);
};

/**
 * Get count of enabled authentication methods
 * @returns Number of enabled methods
 */
export const getEnabledAuthMethodsCount = (): number => {
  return getEnabledAuthMethods().length;
};

/**
 * Get user-friendly names for authentication methods
 */
export const getAuthMethodLabel = (method: AuthMethod): string => {
  const labels: Record<AuthMethod, string> = {
    [AuthMethod.EMAIL_PASSWORD]: 'Email & Password',
    [AuthMethod.EMAIL_MAGIC_LINK]: 'Email Magic Link',
    [AuthMethod.EMAIL_OTP]: 'Email OTP',
    [AuthMethod.PHONE_OTP]: 'Phone OTP',
    [AuthMethod.GOOGLE]: 'Google Sign-In',
    [AuthMethod.APPLE]: 'Apple Sign-In',
    [AuthMethod.FACEBOOK]: 'Facebook Sign-In',
    [AuthMethod.BIOMETRIC]: 'Biometric (Face ID/Touch ID)',
    [AuthMethod.TWO_FACTOR]: 'Two-Factor Authentication',
  };
  return labels[method];
};

/**
 * Validate that at least one authentication method is enabled
 * Throws error if no methods are available
 */
export const validateAuthMethodsConfig = (): void => {
  const enabledCount = getEnabledAuthMethodsCount();

  if (enabledCount === 0) {
    throw new Error('Configuration Error: No authentication methods are enabled. ' + 'Please enable at least one authentication method in your environment configuration.');
  }

  // Log enabled methods in development
  if (__DEV__) {
    const enabledMethods = getEnabledAuthMethods();
    console.log(`[Auth Config] ${enabledCount} authentication method(s) enabled:`, enabledMethods.map(getAuthMethodLabel).join(', '));
  }
};

/**
 * Check if a specific social provider is enabled and configured
 * @param provider - Social provider to check
 * @returns true if enabled and has required configuration
 */
export const isSocialProviderReady = (provider: 'google' | 'apple' | 'facebook'): boolean => {
  const methodMap = {
    google: AuthMethod.GOOGLE,
    apple: AuthMethod.APPLE,
    facebook: AuthMethod.FACEBOOK,
  };

  if (!isAuthMethodEnabled(methodMap[provider])) {
    return false;
  }

  // Check if required configuration is present
  switch (provider) {
    case 'google':
      return !!(Config.social.googleWebClientId || Config.social.googleIosClientId || Config.social.googleAndroidClientId);
    case 'apple':
      return !!(Config.social.appleTeamId || Config.social.appleBundleId);
    case 'facebook':
      return !!Config.services.facebookAppId;
    default:
      return false;
  }
};

// Validate on import in development
if (__DEV__) {
  validateAuthMethodsConfig();
}
