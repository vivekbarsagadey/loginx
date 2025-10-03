/**
 * Firebase and Firestore constants
 * Centralized collection names and configuration
 */

export const FirebaseCollections = {
  USERS: 'users',
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
  FEEDBACK: 'feedback',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
} as const;

export const FirebaseConfig = {
  // Emulator settings
  EMULATOR_HOST: 'localhost',
  AUTH_EMULATOR_PORT: 9099,
  FIRESTORE_EMULATOR_PORT: 8080,
  STORAGE_EMULATOR_PORT: 9199,
  FUNCTIONS_EMULATOR_PORT: 5001,

  // Timeout settings
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  RETRY_TIMEOUT: 30000, // 30 seconds

  // Batch sizes
  MAX_BATCH_SIZE: 500,
  MAX_COMPOUND_QUERIES: 10,
} as const;

export const FirestoreErrors = {
  PERMISSION_DENIED: 'permission-denied',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  ABORTED: 'aborted',
  OUT_OF_RANGE: 'out-of-range',
  UNIMPLEMENTED: 'unimplemented',
  INTERNAL: 'internal',
  UNAVAILABLE: 'unavailable',
  DATA_LOSS: 'data-loss',
  UNAUTHENTICATED: 'unauthenticated',
} as const;
