declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    AUTH_DOMAIN: string;
    PROJECT_ID: string;
    STORAGE_BUCKET: string;
    MESSAGING_SENDER_ID: string;
    APP_ID: string;
    MEASUREMENT_ID: string;
    EAS_PROJECT_ID: string;
    APP_NAME: string;
    APP_VERSION: string;
    APP_BUILD: string;
    API_BASE_URL: string;
    API_TIMEOUT: string;
    WS_URL: string;
    DB_NAME: string;
    DB_ENCRYPTION_KEY: string;
    CACHE_TTL: string;
    SENTRY_DSN: string;
    AMPLITUDE_KEY: string;
    GOOGLE_MAPS_API_KEY: string;
    EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: string;
  }
}
