// firebase-config.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, browserLocalPersistence, getAuth, initializeAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { connectFirestoreEmulator, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import { Config, validateRequiredConfig } from './utils/config';

// Validate Firebase configuration
validateRequiredConfig();

const firebaseConfig = {
  apiKey: Config.firebase.apiKey || 'missing-api-key',
  authDomain: Config.firebase.authDomain || 'missing-auth-domain',
  projectId: Config.firebase.projectId || 'missing-project-id',
  storageBucket: Config.firebase.storageBucket || 'missing-storage-bucket',
  messagingSenderId: Config.firebase.messagingSenderId || 'missing-sender-id',
  appId: Config.firebase.appId || 'missing-app-id',
  measurementId: Config.firebase.measurementId,
};

// Log Firebase configuration in development (without exposing sensitive data)
if (__DEV__) {
  console.warn('[Firebase] Initializing with project:', Config.firebase.projectId);
}

// ---- initialize (reuse if already created) ----
let app: ReturnType<typeof initializeApp>;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error('[Firebase] Failed to initialize app:', error);
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

export { app };

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
let firestoreInstance: ReturnType<typeof getFirestore> | undefined;
let firestoreInitialized = false;
let firestoreError: Error | null = null;

try {
  if (Config.firebase.projectId && Config.firebase.projectId !== 'missing-project-id') {
    firestoreInstance = getFirestore(app);

    // Connect to Firestore emulator if enabled (development only)
    if (__DEV__ && Config.development.useFirebaseEmulator) {
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
            return enableIndexedDbPersistence(firestoreInstance!);
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

      // Only set up window event listeners on web platform
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.addEventListener('online', () => {
          console.warn('[Firebase] Network connection restored');
        });
        window.addEventListener('offline', () => {
          console.warn('[Firebase] Network connection lost - Switching to offline mode');
        });
      }

      checkConnection();
    }
  } else {
    // Configuration missing - don't initialize Firestore
    firestoreError = new Error('Firebase configuration is incomplete. Please check your .env file.');
    console.error('[Firebase] Skipping Firestore initialization due to missing configuration');
  }
} catch (error) {
  firestoreError = error instanceof Error ? error : new Error('Unknown Firestore initialization error');
  console.error('[Firebase] Failed to initialize Firestore:', error);
  if (error instanceof Error) {
    console.error('[Firebase] Error details:', {
      message: error.message,
      stack: error.stack,
    });
  }

  // In development, don't crash - let the app show a proper error screen
  if (!__DEV__) {
    throw new Error('Firebase Firestore initialization failed. Please check your configuration.');
  }
}

// Export firestore instance - will be undefined if initialization failed
export const firestore = firestoreInstance as ReturnType<typeof getFirestore>;

/**
 * Get the Firestore initialization error if one occurred
 * @returns Error object or null if no error
 */
export const getFirestoreError = (): Error | null => {
  return firestoreError;
};

/**
 * Check if Firestore is properly initialized
 * @returns True if Firestore is ready to use
 */
export const isFirestoreReady = (): boolean => {
  return firestoreInitialized && firestoreInstance !== undefined && firestoreError === null;
};

/**
 * Get Firestore connection status
 * @returns Connection status information
 */
export const getFirestoreStatus = () => {
  return {
    initialized: firestoreInitialized,
    projectId: firebaseConfig.projectId,
    emulatorEnabled: Config.development.useFirebaseEmulator,
    platform: Platform.OS,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
};
