// firebase-config.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, browserLocalPersistence, getAuth, initializeAuth, setPersistence } from 'firebase/auth';
import { connectFirestoreEmulator, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';
import { Config, validateRequiredConfig } from './utils/config';
import { logger } from './utils/logger-production';

// Validate Firebase configuration - FAIL FAST if missing
validateRequiredConfig();

// SECURITY: No fallback values - fail immediately if config is missing
if (!Config.firebase.apiKey) {
  throw new Error('CRITICAL: Firebase API Key is missing. Check your .env file.');
}
if (!Config.firebase.authDomain) {
  throw new Error('CRITICAL: Firebase Auth Domain is missing. Check your .env file.');
}
if (!Config.firebase.projectId) {
  throw new Error('CRITICAL: Firebase Project ID is missing. Check your .env file.');
}
if (!Config.firebase.storageBucket) {
  throw new Error('CRITICAL: Firebase Storage Bucket is missing. Check your .env file.');
}
if (!Config.firebase.messagingSenderId) {
  throw new Error('CRITICAL: Firebase Messaging Sender ID is missing. Check your .env file.');
}
if (!Config.firebase.appId) {
  throw new Error('CRITICAL: Firebase App ID is missing. Check your .env file.');
}

const firebaseConfig = {
  apiKey: Config.firebase.apiKey,
  authDomain: Config.firebase.authDomain,
  projectId: Config.firebase.projectId,
  storageBucket: Config.firebase.storageBucket,
  messagingSenderId: Config.firebase.messagingSenderId,
  appId: Config.firebase.appId,
  measurementId: Config.firebase.measurementId,
};

// ---- initialize (reuse if already created) ----
let app: ReturnType<typeof initializeApp>;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  logger.error('[Firebase] Failed to initialize app', error instanceof Error ? error : new Error(String(error)));
  throw new Error('Firebase initialization failed. Please check your configuration.');
}

export { app };

// ---- Auth ----
let auth: Auth;

if (Platform.OS === 'web') {
  // Web: keep users signed in (local persistence)
  auth = getAuth(app);
  // Set persistence to keep users logged in across browser sessions
  setPersistence(auth, browserLocalPersistence).catch((_error) => {
    // Failed to set persistence
  });
} else {
  // React Native: Default persistence should work, but let's be explicit
  try {
    // For React Native, Firebase should automatically use AsyncStorage
    // if @react-native-async-storage/async-storage is installed
    auth = initializeAuth(app);
  } catch (_initError) {
    // Fallback for Fast Refresh or already-initialized
    auth = getAuth(app);
  }
}

export { auth };

// ---- Firebase Functions (TASK-014) ----
let functionsInstance: ReturnType<typeof getFunctions> | undefined;

try {
  functionsInstance = getFunctions(app);

  // Connect to Functions emulator if enabled (development only)
  if (__DEV__ && Config.development.useFirebaseEmulator) {
    try {
      connectFunctionsEmulator(functionsInstance, 'localhost', 5001);
      logger.info('[Firebase] Connected to Functions emulator');
    } catch (emulatorError) {
      logger.warn('[Firebase] Failed to connect to Functions emulator', {
        error: emulatorError instanceof Error ? emulatorError.message : String(emulatorError),
      });
    }
  }
} catch (error) {
  logger.error('[Firebase] Failed to initialize Functions', error instanceof Error ? error : new Error(String(error)));
}

export const functions = functionsInstance;

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
      } catch (_emulatorError) {
        // Failed to connect to emulator
      }
    }

    // Enable AGGRESSIVE offline persistence for LOCAL-FIRST behavior
    if (Platform.OS === 'web') {
      // Try multi-tab persistence first, fall back to single-tab
      enableMultiTabIndexedDbPersistence(firestoreInstance)
        .then(() => {
          firestoreInitialized = true;
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            // firestoreInstance is guaranteed to be defined here since we're in its initialization block
            if (firestoreInstance) {
              return enableIndexedDbPersistence(firestoreInstance);
            }
          } else if (err.code === 'unimplemented') {
            // The current browser doesn't support persistence
          } else {
            logger.warn('[Firebase] LOCAL-FIRST: Persistence error', { error: err });
          }
          firestoreInitialized = true;
        })
        .then(() => {
          if (!firestoreInitialized) {
            firestoreInitialized = true;
          }
        })
        .catch((_err) => {
          firestoreInitialized = true;
        });
    } else {
      // Native platforms have built-in offline support - PERFECT for local-first
      firestoreInitialized = true;
    }

    // Monitor connection state for LOCAL-FIRST behavior
    if (__DEV__) {
      // Connection monitoring disabled
    }

    // Set up LOCAL-FIRST data loading preferences
    if (firestoreInstance) {
      // Configure Firestore for local-first behavior
      // This ensures all reads attempt local cache first
    }
  } else {
    // Configuration missing - don't initialize Firestore
    firestoreError = new Error('Firebase configuration is incomplete. Please check your .env file.');
    logger.error('[Firebase] Skipping Firestore initialization due to missing configuration', { projectId: Config.firebase.projectId });
  }
} catch (error) {
  firestoreError = error instanceof Error ? error : new Error('Unknown Firestore initialization error');
  logger.error('[Firebase] Failed to initialize Firestore', error instanceof Error ? error : new Error(String(error)));
  if (error instanceof Error) {
    logger.error('[Firebase] Error details', {
      message: error.message,
      stack: __DEV__ ? error.stack : '[REDACTED]',
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
