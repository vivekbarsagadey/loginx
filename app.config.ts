import 'dotenv/config';

// Validate required environment variables
const requiredEnvVars = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'MESSAGING_SENDER_ID', 'APP_ID'];

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
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      package: 'com.whizit.loginx',
      minSdkVersion: 26,
      versionCode: parseInt(process.env.APP_BUILD || '100'),
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
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: '524907f3-68cc-42d8-9b78-3561e304156d',
      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      appName: process.env.APP_NAME || 'loginx',
      appVersion: process.env.APP_VERSION || '1.0.0',
      appBuild: process.env.APP_BUILD || '100',
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.myapp.com',
      apiTimeout: process.env.API_TIMEOUT || '10000',
      wsUrl: process.env.WS_URL || 'wss://ws.myapp.com',
      dbName: process.env.DB_NAME || 'login-x-db',
      dbEncryptionKey: process.env.DB_ENCRYPTION_KEY,
      cacheTtl: process.env.CACHE_TTL || '3600',
      sentryDsn: process.env.SENTRY_DSN,
      amplitudeKey: process.env.AMPLITUDE_KEY,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};
