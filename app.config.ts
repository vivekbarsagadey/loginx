import 'dotenv/config';

// Validate required environment variables
const requiredEnvVars = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID', 'MEASUREMENT_ID', 'EAS_PROJECT_ID'];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}\n` + 'Please check your .env file and ensure all Firebase credentials are set.');
}

export default {
  expo: {
    name: process.env.APP_NAME || 'loginx',
    slug: 'loginx',
    version: process.env.APP_VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'loginx',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      buildNumber: process.env.APP_BUILD || '100',
      bundleIdentifier: process.env.APPLE_BUNDLE_ID || 'com.whizit.loginx',
      infoPlist: {
        NSCameraUsageDescription: 'This app requires access to your camera to take photos for your profile and other features.',
        NSPhotoLibraryUsageDescription: 'This app requires access to your photo library to select photos for your profile and other features.',
        NSPhotoLibraryAddUsageDescription: 'This app requires permission to save photos to your photo library.',
        NSLocationWhenInUseUsageDescription: 'This app requires access to your location to provide location-based features and personalized experiences.',
        NSLocationAlwaysUsageDescription: 'This app requires access to your location to provide location-based features even when the app is in the background.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'This app requires access to your location to provide location-based features.',
        NSMicrophoneUsageDescription: 'This app requires access to your microphone for voice features.',
        NSContactsUsageDescription: 'This app requires access to your contacts to help you connect with friends.',
        NSCalendarsUsageDescription: 'This app requires access to your calendar to schedule events.',
        NSRemindersUsageDescription: 'This app requires access to your reminders to help manage tasks.',
      },
    },
    android: {
      adaptiveIcon: {
        // NOTE: Build-time color - matches Colors.light.bg from theme.ts (#E6F4FE is a light blue tint)
        // This is a build configuration and cannot dynamically reference runtime theme values
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      package: 'com.whizit.loginx',
      minSdkVersion: 26,
      versionCode: parseInt(process.env.APP_BUILD || '100'),
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'READ_MEDIA_IMAGES',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'RECORD_AUDIO',
        'READ_CONTACTS',
        'WRITE_CONTACTS',
        'READ_CALENDAR',
        'WRITE_CALENDAR',
      ],
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          // NOTE: Build-time colors - match Colors.light.bg and Colors.dark.bg from theme.ts
          // Splash screen is displayed before app loads, so cannot use runtime theme values
          backgroundColor: '#ffffff', // Colors.light.bg
          dark: {
            backgroundColor: '#000000', // Approximates Colors.dark.bg (#0B1220)
          },
        },
      ],
      'expo-localization',
      'expo-web-browser',
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
      // Firebase Configuration
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,

      // App Information
      appName: process.env.APP_NAME || 'loginx',
      appVersion: process.env.APP_VERSION || '1.0.0',
      appBuild: process.env.APP_BUILD || '100',

      // Social Authentication
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      appleTeamId: process.env.APPLE_TEAM_ID,
      appleBundleId: process.env.APPLE_BUNDLE_ID || 'com.whizit.loginx',
      androidPackageName: 'com.whizit.loginx',

      // Firebase Functions
      functionsUrl: process.env.FUNCTIONS_URL,
      firebaseStorageUrl: process.env.FIREBASE_STORAGE_URL,

      // Backend API Configuration
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.loginx.whizit.com',
      apiTimeout: process.env.API_TIMEOUT || '10000',
      wsUrl: process.env.WS_URL || 'wss://ws.loginx.whizit.com',

      // Database Configuration
      dbName: process.env.DB_NAME || 'login-x-db',
      dbEncryptionKey: process.env.DB_ENCRYPTION_KEY,
      cacheTtl: process.env.CACHE_TTL || '3600',

      // Security & Encryption
      // Note: JWT and AES encryption are handled by Firebase Auth and expo-secure-store
      // Firebase Auth automatically generates and manages JWT tokens
      // expo-secure-store provides hardware-backed encryption (no custom AES key needed)
      // If custom encryption is needed, implement server-side only (Firebase Functions)

      // Feature Flags
      enableBiometricAuth: process.env.ENABLE_BIOMETRIC_AUTH === 'true',
      enableSocialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
      enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION !== 'false',
      enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
      enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',

      // Authentication Method Feature Flags
      enableLoginEmailPassword: process.env.ENABLE_LOGIN_EMAIL_PASSWORD !== 'false',
      enableLoginEmailMagicLink: process.env.ENABLE_LOGIN_EMAIL_MAGIC_LINK !== 'false',
      enableLoginEmailOtp: process.env.ENABLE_LOGIN_EMAIL_OTP !== 'false',
      enableLoginPhoneOtp: process.env.ENABLE_LOGIN_PHONE_OTP !== 'false',
      enableLoginGoogle: process.env.ENABLE_LOGIN_GOOGLE !== 'false',
      enableLoginApple: process.env.ENABLE_LOGIN_APPLE !== 'false',
      enableLoginFacebook: process.env.ENABLE_LOGIN_FACEBOOK === 'true',
      enableLoginBiometric: process.env.ENABLE_LOGIN_BIOMETRIC !== 'false',
      enableLoginTwoFactor: process.env.ENABLE_LOGIN_TWO_FACTOR !== 'false',
      enableForgotPassword: process.env.ENABLE_FORGOT_PASSWORD !== 'false',

      // Development Settings
      useFirebaseEmulator: process.env.USE_FIREBASE_EMULATOR === 'true',
      debugMode: process.env.DEBUG_MODE !== 'false',
      logLevel: process.env.LOG_LEVEL || 'debug',

      // Analytics & Monitoring
      sentryDsn: process.env.SENTRY_DSN,
      amplitudeKey: process.env.AMPLITUDE_KEY,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      mixpanelToken: process.env.MIXPANEL_TOKEN,

      // External Services
      sendgridApiKey: process.env.SENDGRID_API_KEY,
      mailgunApiKey: process.env.MAILGUN_API_KEY,
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      facebookAppId: process.env.FACEBOOK_APP_ID,
      twitterApiKey: process.env.TWITTER_API_KEY,
      linkedinClientId: process.env.LINKEDIN_CLIENT_ID,
    },
  },
};
