/**
 * TASK-061: Firestore Ready Helper
 * Provides hooks and utilities to check Firestore initialization status
 * Ensures components wait for Firestore to be ready before operations
 */

import { isFirestoreReady } from '@/firebase-config';
import { useEffect, useState } from 'react';
import { debugLog, debugWarn } from './debug';

/**
 * Firestore ready state
 */
export interface FirestoreReadyState {
  /** Is Firestore initialized and ready to use? */
  ready: boolean;
  /** Is initialization still in progress? */
  loading: boolean;
  /** Error if initialization failed */
  error: Error | null;
}

/**
 * Global listeners for Firestore ready state changes
 */
type ReadyListener = (ready: boolean) => void;
const readyListeners = new Set<ReadyListener>();

let firestoreReadyState: FirestoreReadyState = {
  ready: false,
  loading: true,
  error: null,
};

/**
 * Initialize Firestore ready monitoring
 * Should be called once during app initialization
 */
export function initializeFirestoreMonitoring(): void {
  debugLog('[FirestoreReady] Initializing Firestore monitoring...');

  // Check current state
  const ready = isFirestoreReady();
  updateReadyState({ ready, loading: !ready, error: null });

  if (ready) {
    debugLog('[FirestoreReady] ✅ Firestore is ready');
    return;
  }

  // Poll for readiness with exponential backoff
  let attempt = 0;
  const maxAttempts = 10;
  const initialDelay = 100;
  const maxDelay = 5000;

  const checkReady = () => {
    attempt++;
    const ready = isFirestoreReady();

    if (ready) {
      debugLog('[FirestoreReady] ✅ Firestore became ready');
      updateReadyState({ ready: true, loading: false, error: null });
      return;
    }

    if (attempt >= maxAttempts) {
      const error = new Error('Firestore initialization timeout');
      debugWarn('[FirestoreReady] ❌ Firestore initialization timed out', error);
      updateReadyState({ ready: false, loading: false, error });
      return;
    }

    // Calculate next delay with exponential backoff
    const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
    debugLog(`[FirestoreReady] ⏳ Firestore not ready, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
    setTimeout(checkReady, delay);
  };

  // Start checking
  checkReady();
}

/**
 * Update Firestore ready state and notify listeners
 */
function updateReadyState(newState: Partial<FirestoreReadyState>): void {
  const oldReady = firestoreReadyState.ready;
  firestoreReadyState = { ...firestoreReadyState, ...newState };

  // Notify listeners if ready state changed
  if (oldReady !== firestoreReadyState.ready) {
    debugLog(`[FirestoreReady] State changed: ready=${firestoreReadyState.ready}`);
    readyListeners.forEach((listener) => {
      try {
        listener(firestoreReadyState.ready);
      } catch (error) {
        debugWarn('[FirestoreReady] Listener error', error);
      }
    });
  }
}

/**
 * Subscribe to Firestore ready state changes
 */
export function subscribeToFirestoreReady(listener: ReadyListener): () => void {
  readyListeners.add(listener);
  return () => readyListeners.delete(listener);
}

/**
 * Get current Firestore ready state
 */
export function getFirestoreReadyState(): FirestoreReadyState {
  return { ...firestoreReadyState };
}

/**
 * React hook to get Firestore ready state
 * Components can use this to wait for Firestore before performing operations
 */
export function useFirestoreReady(): FirestoreReadyState {
  const [state, setState] = useState<FirestoreReadyState>(() => getFirestoreReadyState());

  useEffect(() => {
    // Update state immediately
    setState(getFirestoreReadyState());

    // Subscribe to changes
    const unsubscribe = subscribeToFirestoreReady((ready) => {
      setState((prev) => ({ ...prev, ready, loading: false }));
    });

    return unsubscribe;
  }, []);

  return state;
}

/**
 * Wait for Firestore to be ready
 * Returns a promise that resolves when Firestore is ready or rejects on timeout
 */
export function waitForFirestore(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already ready
    if (firestoreReadyState.ready) {
      resolve();
      return;
    }

    // Check if initialization failed
    if (firestoreReadyState.error && !firestoreReadyState.loading) {
      reject(firestoreReadyState.error);
      return;
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error(`Firestore ready timeout after ${timeout}ms`));
    }, timeout);

    // Subscribe to ready state
    const unsubscribe = subscribeToFirestoreReady((ready) => {
      if (ready) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve();
      }
    });
  });
}

/**
 * Execute a function only when Firestore is ready
 * If Firestore is not ready, the function will be queued and executed when ready
 */
export async function whenFirestoreReady<T>(fn: () => Promise<T> | T, options: { timeout?: number; fallback?: () => T } = {}): Promise<T> {
  const { timeout = 10000, fallback } = options;

  try {
    await waitForFirestore(timeout);
    return await fn();
  } catch (error) {
    debugWarn('[FirestoreReady] Operation failed, Firestore not ready', error);

    // Use fallback if provided
    if (fallback) {
      debugLog('[FirestoreReady] Using fallback');
      return fallback();
    }

    throw error;
  }
}
