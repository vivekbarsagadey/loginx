declare namespace NodeJS {
  interface ProcessEnv {
    // Firebase Configuration (Required)
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
    MEASUREMENT_ID: string;

    // Expo Configuration
    EAS_PROJECT_ID: string;

    // App Information
    APP_NAME: string;
    APP_VERSION: string;
    APP_BUILD: string;

    // Social Authentication
    GOOGLE_WEB_CLIENT_ID: string;
    GOOGLE_IOS_CLIENT_ID: string;
    GOOGLE_ANDROID_CLIENT_ID: string;

    // Apple Sign In (iOS)
    APPLE_TEAM_ID: string;
    APPLE_BUNDLE_ID: string;

    // Google Places API
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: string;

    // Firebase Functions
    FUNCTIONS_URL: string;
    FIREBASE_STORAGE_URL: string;

    // Backend API Configuration
    API_BASE_URL: string;
    API_TIMEOUT: string;
    WS_URL: string;

    // Database Configuration
    DB_NAME: string;
    DB_ENCRYPTION_KEY: string;
    CACHE_TTL: string;

    // Security & Encryption
    JWT_SECRET: string;
    AES_ENCRYPTION_KEY: string;

    // Feature Flags
    ENABLE_BIOMETRIC_AUTH: string;
    ENABLE_SOCIAL_LOGIN: string;
    ENABLE_EMAIL_VERIFICATION: string;
    ENABLE_PUSH_NOTIFICATIONS: string;
    ENABLE_ANALYTICS: string;

    // Authentication Method Feature Flags
    ENABLE_LOGIN_EMAIL_PASSWORD: string;
    ENABLE_LOGIN_EMAIL_MAGIC_LINK: string;
    ENABLE_LOGIN_EMAIL_OTP: string;
    ENABLE_LOGIN_PHONE_OTP: string;
    ENABLE_LOGIN_GOOGLE: string;
    ENABLE_LOGIN_APPLE: string;
    ENABLE_LOGIN_FACEBOOK: string;
    ENABLE_LOGIN_BIOMETRIC: string;
    ENABLE_LOGIN_TWO_FACTOR: string;
    ENABLE_FORGOT_PASSWORD: string;

    // Development Settings
    USE_FIREBASE_EMULATOR: string;
    DEBUG_MODE: string;
    LOG_LEVEL: string;

    // Analytics & Monitoring
    SENTRY_DSN: string;
    AMPLITUDE_KEY: string;
    GOOGLE_MAPS_API_KEY: string;
    MIXPANEL_TOKEN: string;

    // Email Service (Optional)
    SENDGRID_API_KEY: string;
    MAILGUN_API_KEY: string;

    // SMS Service (Optional)
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_PHONE_NUMBER: string;

    // Social Media APIs (Optional)
    FACEBOOK_APP_ID: string;
    TWITTER_API_KEY: string;
    LINKEDIN_CLIENT_ID: string;
  }
}
