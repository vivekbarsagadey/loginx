/**
 * Configuration utilities for accessing environment variables
 * Provides typed access to configuration values from Expo Constants
 */
import Constants from 'expo-constants';

// Get the extra config from Expo Constants
const extra = (Constants.expoConfig?.extra as Record<string, unknown> | undefined) ?? {};

/**
 * Configuration object with typed access to all environment variables
 */
export const Config = {
  // Firebase Configuration
  firebase: {
    apiKey: extra.apiKey as string,
    authDomain: extra.authDomain as string,
    projectId: extra.projectId as string,
    storageBucket: extra.storageBucket as string,
    messagingSenderId: extra.messagingSenderId as string,
    appId: extra.appId as string,
    measurementId: extra.measurementId as string,
  },

  // App Information
  app: {
    name: (extra.appName as string) || 'LoginX',
    version: (extra.appVersion as string) || '1.0.0',
    build: (extra.appBuild as string) || '100',
  },

  // Social Authentication
  social: {
    googleWebClientId: extra.googleWebClientId as string,
    googleIosClientId: extra.googleIosClientId as string,
    googleAndroidClientId: extra.googleAndroidClientId as string,
    appleTeamId: extra.appleTeamId as string,
    appleBundleId: (extra.appleBundleId as string) || 'com.whizit.loginx',
    androidPackageName: (extra.androidPackageName as string) || 'com.whizit.loginx',
  },

  // Firebase Functions
  functions: {
    url: extra.functionsUrl as string,
    storageUrl: extra.firebaseStorageUrl as string,
  },

  // API Configuration
  api: {
    baseUrl: (extra.apiBaseUrl as string) || 'https://api.myapp.com',
    timeout: parseInt((extra.apiTimeout as string) || '10000'),
    wsUrl: (extra.wsUrl as string) || 'wss://ws.myapp.com',
  },

  // Database Configuration
  database: {
    name: (extra.dbName as string) || 'login-x-db',
    encryptionKey: extra.dbEncryptionKey as string,
    cacheTtl: parseInt((extra.cacheTtl as string) || '3600'),
  },

  // Security & Encryption
  // NOTE: Removed jwtSecret and aesEncryptionKey from client-side config
  // Firebase Auth handles JWT tokens automatically (no custom JWT needed)
  // expo-secure-store provides hardware-backed encryption (no custom AES key needed)
  // If custom encryption is required, implement server-side only (Firebase Functions)
  security: {},

  // Feature Flags
  features: {
    biometricAuth: (extra.enableBiometricAuth as boolean) ?? true,
    socialLogin: (extra.enableSocialLogin as boolean) ?? true,
    emailVerification: (extra.enableEmailVerification as boolean) ?? true,
    pushNotifications: (extra.enablePushNotifications as boolean) ?? false,
    analytics: (extra.enableAnalytics as boolean) ?? false,
  },

  // Authentication Methods - Control which login methods are available
  authMethods: {
    emailPassword: (extra.enableLoginEmailPassword as boolean) ?? true,
    emailMagicLink: (extra.enableLoginEmailMagicLink as boolean) ?? true,
    emailOtp: (extra.enableLoginEmailOtp as boolean) ?? true,
    phoneOtp: (extra.enableLoginPhoneOtp as boolean) ?? true,
    google: (extra.enableLoginGoogle as boolean) ?? true,
    apple: (extra.enableLoginApple as boolean) ?? true,
    facebook: (extra.enableLoginFacebook as boolean) ?? false, // Default disabled until setup
    biometric: (extra.enableLoginBiometric as boolean) ?? true,
    twoFactor: (extra.enableLoginTwoFactor as boolean) ?? true,
    forgotPassword: (extra.enableForgotPassword as boolean) ?? true,
  },

  // Development Settings
  development: {
    useFirebaseEmulator: (extra.useFirebaseEmulator as boolean) ?? false,
    debugMode: (extra.debugMode as boolean) ?? __DEV__,
    logLevel: ((extra.logLevel as string) || 'debug') as 'debug' | 'info' | 'warn' | 'error',
  },

  // Analytics & Monitoring
  analytics: {
    sentryDsn: extra.sentryDsn as string,
    amplitudeKey: extra.amplitudeKey as string,
    mixpanelToken: extra.mixpanelToken as string,
  },

  // External Services
  services: {
    googleMapsApiKey: extra.googleMapsApiKey as string,
    sendgridApiKey: extra.sendgridApiKey as string,
    mailgunApiKey: extra.mailgunApiKey as string,
    twilioAccountSid: extra.twilioAccountSid as string,
    twilioAuthToken: extra.twilioAuthToken as string,
    twilioPhoneNumber: extra.twilioPhoneNumber as string,
    facebookAppId: extra.facebookAppId as string,
    twitterApiKey: extra.twitterApiKey as string,
    linkedinClientId: extra.linkedinClientId as string,
  },
};

/**
 * Check if a required configuration value is missing
 */
export const isConfigMissing = (value: string | undefined | null): boolean => {
  return !value || value === '' || value === 'undefined' || value === 'null';
};

/**
 * Get configuration value with fallback
 */
export const getConfigValue = <T>(value: T | undefined | null, fallback: T): T => {
  return value !== undefined && value !== null ? value : fallback;
};

/**
 * Validate that required configuration is present
 */
export const validateRequiredConfig = (): void => {
  const requiredFields = [
    { key: 'Firebase API Key', value: Config.firebase.apiKey },
    { key: 'Firebase Auth Domain', value: Config.firebase.authDomain },
    { key: 'Firebase Project ID', value: Config.firebase.projectId },
    { key: 'Firebase Storage Bucket', value: Config.firebase.storageBucket },
    { key: 'Firebase Messaging Sender ID', value: Config.firebase.messagingSenderId },
    { key: 'Firebase App ID', value: Config.firebase.appId },
  ];

  const missingFields = requiredFields.filter((field) => isConfigMissing(field.value));

  if (missingFields.length > 0) {
    const missingList = missingFields.map((field) => field.key).join(', ');
    const errorMessage = `CRITICAL: Missing required Firebase configuration: ${missingList}. Please check your .env file and ensure all Firebase credentials are properly configured.`;

    // SECURITY: Fail fast in all environments (development and production)
    throw new Error(errorMessage);
  }
};

/**
 * Log configuration status (development only)
 */
export const logConfigStatus = (): void => {
  if (!__DEV__) {
    return;
  }

  // Configuration logging disabled
};

// Validate configuration on import in development
if (__DEV__) {
  validateRequiredConfig();
  logConfigStatus();
}
