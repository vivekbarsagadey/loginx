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
} catch (_error: unknown) {
  logger.error('[Firebase] Failed to initialize app', _error instanceof Error ? _error : new Error(String(_error)));
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
} catch (_error: unknown) {
  logger.error('[Firebase] Failed to initialize Functions', _error instanceof Error ? _error : new Error(String(_error)));
}

export const functions = functionsInstance;

// ---- Firestore with ASYNC initialization (TASK-057, TASK-058, TASK-059, TASK-060) ----
let firestoreInstance: ReturnType<typeof getFirestore> | undefined;
let firestoreInitialized = false;
let firestoreInitializing = false;
let firestoreError: Error | null = null;
let initializationPromise: Promise<void> | null = null;

// TASK-058: Initialization timeout (10 seconds)
const FIRESTORE_INIT_TIMEOUT = 10000;

/**
 * TASK-057: Initialize Firestore asynchronously with timeout handling
 * Returns a promise that resolves when Firestore is ready or times out
 */
export const initializeFirestore = async (): Promise<void> => {
  // If already initialized or initializing, return existing promise
  if (firestoreInitialized) {
    return Promise.resolve();
  }
  if (firestoreInitializing && initializationPromise) {
    return initializationPromise;
  }

  firestoreInitializing = true;

  initializationPromise = new Promise<void>((resolve, reject) => {
    // TASK-058: Set timeout for initialization
    const timeoutId = setTimeout(() => {
      if (!firestoreInitialized) {
        const timeoutError = new Error(`Firestore initialization timed out after ${FIRESTORE_INIT_TIMEOUT}ms`);
        firestoreError = timeoutError;
        firestoreInitializing = false;
        logger.error('[Firebase] Firestore initialization timeout', timeoutError);
        reject(timeoutError);
      }
    }, FIRESTORE_INIT_TIMEOUT);

    try {
      if (!Config.firebase.projectId || Config.firebase.projectId === 'missing-project-id') {
        clearTimeout(timeoutId);
        const configError = new Error('Firebase configuration is incomplete. Please check your .env file.');
        firestoreError = configError;
        firestoreInitializing = false;
        logger.error('[Firebase] Skipping Firestore initialization due to missing configuration', { projectId: Config.firebase.projectId });
        reject(configError);
        return;
      }

      // Initialize Firestore instance
      firestoreInstance = getFirestore(app);

      // Connect to Firestore emulator if enabled (development only)
      if (__DEV__ && Config.development.useFirebaseEmulator) {
        try {
          connectFirestoreEmulator(firestoreInstance, 'localhost', 8080);
          logger.info('[Firebase] Connected to Firestore emulator');
        } catch (emulatorError) {
          logger.warn('[Firebase] Failed to connect to Firestore emulator', {
            error: emulatorError instanceof Error ? emulatorError.message : String(emulatorError),
          });
        }
      }

      // Enable AGGRESSIVE offline persistence for LOCAL-FIRST behavior
      if (Platform.OS === 'web') {
        // Try multi-tab persistence first, fall back to single-tab
        enableMultiTabIndexedDbPersistence(firestoreInstance)
          .then(() => {
            clearTimeout(timeoutId);
            firestoreInitialized = true;
            firestoreInitializing = false;
            logger.info('[Firebase] Firestore initialized with multi-tab persistence');
            resolve();
          })
          .catch((err) => {
            if (err.code === 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled in one tab at a time
              if (firestoreInstance) {
                return enableIndexedDbPersistence(firestoreInstance).then(() => {
                  clearTimeout(timeoutId);
                  firestoreInitialized = true;
                  firestoreInitializing = false;
                  logger.info('[Firebase] Firestore initialized with single-tab persistence');
                  resolve();
                });
              }
            } else if (err.code === 'unimplemented') {
              // The current browser doesn't support persistence
              clearTimeout(timeoutId);
              firestoreInitialized = true;
              firestoreInitializing = false;
              logger.warn('[Firebase] Persistence not supported, continuing without offline cache');
              resolve();
            } else {
              logger.warn('[Firebase] LOCAL-FIRST: Persistence error', { error: err });
              clearTimeout(timeoutId);
              firestoreInitialized = true;
              firestoreInitializing = false;
              resolve();
            }
            return undefined;
          })
          .catch((fallbackErr) => {
            logger.warn('[Firebase] Failed to enable persistence', fallbackErr);
            clearTimeout(timeoutId);
            firestoreInitialized = true;
            firestoreInitializing = false;
            resolve();
          });
      } else {
        // Native platforms have built-in offline support - PERFECT for local-first
        clearTimeout(timeoutId);
        firestoreInitialized = true;
        firestoreInitializing = false;
        logger.info('[Firebase] Firestore initialized with native offline support');
        resolve();
      }
    } catch (_error: unknown) {
      clearTimeout(timeoutId);
      firestoreError = _error instanceof Error ? _error : new Error('Unknown Firestore initialization _error');
      firestoreInitializing = false;
      logger.error('[Firebase] Failed to initialize Firestore', _error instanceof Error ? _error : new Error(String(_error)));
      if (_error instanceof Error) {
        logger.error('[Firebase] Error details', {
          message: _error.message,
          stack: __DEV__ ? _error.stack : '[REDACTED]',
        });
      }

      // TASK-059: In development, don't crash - graceful degradation
      if (__DEV__) {
        logger.warn('[Firebase] Continuing without Firestore in development mode');
        resolve(); // Resolve anyway in dev mode
      } else {
        reject(firestoreError);
      }
    }
  });

  return initializationPromise;
};

// TASK-060: Export firestore instance with lazy initialization
// Access will trigger initialization if not already started
export const getFirestoreInstance = (): ReturnType<typeof getFirestore> | undefined => {
  // Start initialization if not already started
  if (!firestoreInitialized && !firestoreInitializing) {
    initializeFirestore().catch((_error) => {
      logger.error('[Firebase] Auto-initialization failed', _error);
    });
  }
  return firestoreInstance;
};

// Export firestore instance - will be undefined if initialization hasn't completed
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
