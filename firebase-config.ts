// firebase-config.ts
import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, browserLocalPersistence, getAuth, initializeAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { connectFirestoreEmulator, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// ---- config from app.json/app.config.ts -> extra ----
const extra = (Constants.expoConfig?.extra as Record<string, string> | undefined) ?? (Constants.manifest?.extra as Record<string, string> | undefined);

// Validate required Firebase configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingFields = requiredFields.filter((field) => !extra?.[field]);

if (missingFields.length > 0) {
  console.error('[Firebase] Missing required configuration fields:', missingFields.join(', '));
  console.error('[Firebase] Please check your .env file and app.config.ts');
}

const firebaseConfig = {
  apiKey: extra?.apiKey,
  authDomain: extra?.authDomain,
  projectId: extra?.projectId,
  storageBucket: extra?.storageBucket,
  messagingSenderId: extra?.messagingSenderId,
  appId: extra?.appId,
};

// Log Firebase configuration in development (without exposing sensitive data)
if (__DEV__) {
  console.warn('[Firebase] Initializing with project:', firebaseConfig.projectId);
}

// ---- initialize (reuse if already created) ----
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ---- Auth ----
let auth: Auth;

if (Platform.OS === 'web') {
  // Web: keep users signed in (local persistence)
  auth = getAuth(app);
  // Optional: use session-only persistence instead with browserSessionPersistence
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // React Native: explicit in-memory persistence (no disk, no AsyncStorage)
  try {
    auth = initializeAuth(app, {
      persistence: inMemoryPersistence,
    });
  } catch {
    // guard for Fast Refresh / already-initialized
    auth = getAuth(app);
  }
}

export { auth };

// ---- Firestore with error handling and emulator support ----
let firestoreInstance: ReturnType<typeof getFirestore>;
let firestoreInitialized = false;

try {
  firestoreInstance = getFirestore(app);

  // Connect to Firestore emulator if enabled (development only)
  if (__DEV__ && process.env.USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(firestoreInstance, 'localhost', 8080);
      console.warn('[Firebase] Connected to Firestore emulator at localhost:8080');
    } catch (emulatorError) {
      console.warn('[Firebase] Failed to connect to emulator:', emulatorError);
    }
  }

  // Enable offline persistence for web
  if (Platform.OS === 'web') {
    // Try multi-tab persistence first, fall back to single-tab
    enableMultiTabIndexedDbPersistence(firestoreInstance)
      .then(() => {
        console.warn('[Firebase] Multi-tab offline persistence enabled');
        firestoreInitialized = true;
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled in one tab at a time
          console.warn('[Firebase] Multi-tab persistence failed, trying single-tab');
          return enableIndexedDbPersistence(firestoreInstance);
        } else if (err.code === 'unimplemented') {
          // The current browser doesn't support persistence
          console.warn('[Firebase] Offline persistence not supported in this browser');
        } else {
          console.error('[Firebase] Persistence error:', err);
        }
        firestoreInitialized = true;
      })
      .then(() => {
        if (!firestoreInitialized) {
          console.warn('[Firebase] Single-tab offline persistence enabled');
          firestoreInitialized = true;
        }
      })
      .catch((err) => {
        console.warn('[Firebase] Could not enable offline persistence:', err);
        firestoreInitialized = true;
      });
  } else {
    // Native platforms have built-in offline support
    firestoreInitialized = true;
    if (__DEV__) {
      console.warn('[Firebase] Native offline persistence enabled by default');
    }
  }

  // Monitor connection state in development
  if (__DEV__) {
    // Set up connection monitoring
    const checkConnection = () => {
      if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
        if (navigator.onLine) {
          console.warn('[Firebase] Network connection: ONLINE');
        } else {
          console.warn('[Firebase] Network connection: OFFLINE - Using cached data');
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.warn('[Firebase] Network connection restored');
      });
      window.addEventListener('offline', () => {
        console.warn('[Firebase] Network connection lost - Switching to offline mode');
      });
      checkConnection();
    }
  }
} catch (error) {
  console.error('[Firebase] Failed to initialize Firestore:', error);
  if (error instanceof Error) {
    console.error('[Firebase] Error details:', {
      message: error.message,
      stack: error.stack,
    });
  }
  // Re-throw to prevent app from continuing with broken Firestore
  throw new Error('Firebase Firestore initialization failed. Please check your configuration.');
}

export const firestore = firestoreInstance;

/**
 * Check if Firestore is properly initialized
 * @returns True if Firestore is ready to use
 */
export const isFirestoreReady = (): boolean => {
  return firestoreInitialized && firestoreInstance !== undefined;
};

/**
 * Get Firestore connection status
 * @returns Connection status information
 */
export const getFirestoreStatus = () => {
  return {
    initialized: firestoreInitialized,
    projectId: firebaseConfig.projectId,
    emulatorEnabled: __DEV__ && process.env.USE_FIREBASE_EMULATOR === 'true',
    platform: Platform.OS,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
};
