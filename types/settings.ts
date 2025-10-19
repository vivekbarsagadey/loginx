/**
 * Settings Type Definitions
 * Centralized types for all application settings
 */

/**
 * Notification settings for the application
 * Compatible with existing NotificationSettings type
 */
export interface NotificationSettings {
  /** Enable push notifications */
  pushEnabled: boolean;
  /** Enable email updates */
  emailUpdates: boolean;
  /** Enable marketing tips and promotions */
  marketingTips: boolean;
  /** Enable notification sounds */
  soundEnabled: boolean;
  /** Enable notification vibration */
  vibrationEnabled: boolean;
}

/**
 * Security settings for the application
 */
export interface SecuritySettings {
  /** Enable biometric authentication */
  biometricEnabled: boolean;
  /** Enable two-factor authentication */
  twoFactorEnabled: boolean;
  /** Auto-lock the application */
  autoLockEnabled: boolean;
  /** Auto-lock timeout in minutes */
  autoLockTimeout: number;
  /** Enable security notifications */
  securityNotifications: boolean;
  /** Number of failed login attempts */
  loginAttempts: number;
}

/**
 * Application preferences
 */
export interface AppPreferences {
  /** Show onboarding on first launch */
  showOnboarding: boolean;
  /** Enable analytics tracking */
  analyticsEnabled: boolean;
  /** Enable crash reporting */
  crashReportingEnabled: boolean;
  /** Text size preference */
  textSize: 'small' | 'medium' | 'large';
  /** Accessibility features enabled */
  accessibilityEnabled: boolean;
  /** Auto-update preference */
  autoUpdateEnabled: boolean;
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
  /** Share usage data */
  shareUsageData: boolean;
  /** Share crash reports */
  shareCrashReports: boolean;
  /** Enable location tracking */
  locationTrackingEnabled: boolean;
  /** Show profile to public */
  publicProfile: boolean;
}

/**
 * Complete settings state
 */
export interface SettingsState {
  /** Notification settings */
  notifications: NotificationSettings;
  /** Security settings */
  security: SecuritySettings;
  /** App preferences */
  app: AppPreferences;
  /** Privacy settings */
  privacy: PrivacySettings;
  /** Whether settings are currently loading */
  isLoading: boolean;
  /** Error message if settings failed to load */
  error: string | null;
  /** Last time settings were synchronized */
  lastSyncedAt: number | null;
}

/**
 * Default notification settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: false,
  emailUpdates: false,
  marketingTips: false,
  soundEnabled: true,
  vibrationEnabled: true,
};

/**
 * Default security settings
 */
export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  biometricEnabled: false,
  twoFactorEnabled: false,
  autoLockEnabled: false,
  autoLockTimeout: 5,
  securityNotifications: true,
  loginAttempts: 0,
};

/**
 * Default app preferences
 */
export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  showOnboarding: true,
  analyticsEnabled: true,
  crashReportingEnabled: true,
  textSize: 'medium',
  accessibilityEnabled: false,
  autoUpdateEnabled: true,
};

/**
 * Default privacy settings
 */
export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  shareUsageData: true,
  shareCrashReports: true,
  locationTrackingEnabled: false,
  publicProfile: false,
};

/**
 * Default complete settings state
 */
export const DEFAULT_SETTINGS_STATE: SettingsState = {
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  security: DEFAULT_SECURITY_SETTINGS,
  app: DEFAULT_APP_PREFERENCES,
  privacy: DEFAULT_PRIVACY_SETTINGS,
  isLoading: false,
  error: null,
  lastSyncedAt: null,
};
