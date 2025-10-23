import { auth } from '@/firebase-config';
import { clearAuthState, saveAuthState } from '@/utils/auth-persistence';
import { debugError, debugLog } from '@/utils/debug';
import { showError } from '@/utils/error';
import { applyPendingProfileData, clearPendingProfile } from '@/utils/pending-profile';
import { clearAuthTimestamp, saveAuthTimestamp } from '@/utils/re-authentication'; // TASK-079/080: Import session timeout functions
import { clearSecureStorage } from '@/utils/secure-storage';
import { signOut as firebaseSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
  loading: true,
});

/**
 * Hook to access authentication context
 * @returns Authentication context with user, signOut, and loading state
 */
export function useAuth(): AuthContextType {
  return React.useContext(AuthContext);
}

/**
 * Authentication provider component
 * Manages user authentication state and provides auth context
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debugLog('[Auth] Setting up auth state listener...');

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        debugLog('[Auth] Auth state changed:', user ? `User: ${user.uid}` : 'No user');

        if (user) {
          // Apply any pending profile data from onboarding
          try {
            await applyPendingProfileData(user);
          } catch (error: unknown) {
            // Silently fail - profile can be updated later
          }

          // Save authentication state for persistence
          try {
            await saveAuthState(user);
            debugLog('[Auth] ✅ PERSISTENCE: Auth state saved successfully');
          } catch (persistError) {
            debugError('[Auth] Failed to save auth state for persistence', persistError);
            // Don't fail authentication for persistence issues
          }

          // TASK-079/080: Save authentication timestamp for session tracking
          try {
            await saveAuthTimestamp();
            debugLog('[Auth] ✅ SESSION: Auth timestamp saved');
          } catch (timestampError) {
            debugError('[Auth] Failed to save auth timestamp', timestampError);
            // Don't fail authentication for timestamp issues
          }

          debugLog('[Auth] User authenticated successfully');
        } else {
          debugLog('[Auth] User signed out or not authenticated');

          // Clear authentication state on logout
          try {
            await saveAuthState(null);
            debugLog('[Auth] ✅ PERSISTENCE: Auth state cleared');
          } catch (persistError) {
            debugError('[Auth] Failed to clear auth state', persistError);
          }

          // TASK-079/080: Clear authentication timestamp on logout
          try {
            await clearAuthTimestamp();
            debugLog('[Auth] ✅ SESSION: Auth timestamp cleared');
          } catch (timestampError) {
            debugError('[Auth] Failed to clear auth timestamp', timestampError);
          }
        }

        setUser(user);
        setLoading(false);
      },
      (error) => {
        // Handle auth state change errors
        debugError('[Auth] State change error', error);
        setLoading(false);
        showError(error);
      }
    );

    return () => {
      debugLog('[Auth] Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Memoize signOut to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    try {
      debugLog('[Auth] Starting logout process...');

      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear all secure storage on logout for security
      try {
        await clearSecureStorage();
        debugLog('[Auth] Cleared secure storage on logout');
      } catch (storageError) {
        debugError('[Auth] Failed to clear secure storage on logout', storageError);
        // Don't fail logout if storage clearing fails
      }

      // Clear any pending profile data on logout
      try {
        await clearPendingProfile();
        debugLog('[Auth] Cleared pending profile data on logout');
      } catch (profileError) {
        debugError('[Auth] Failed to clear pending profile data on logout', profileError);
        // Don't fail logout if profile clearing fails
      }

      // Clear authentication persistence
      try {
        await clearAuthState();
        debugLog('[Auth] ✅ PERSISTENCE: Cleared auth persistence on logout');
      } catch (persistError) {
        debugError('[Auth] Failed to clear auth persistence on logout', persistError);
        // Don't fail logout if persistence clearing fails
      }

      // TASK-079/080: Clear authentication timestamp on logout
      try {
        await clearAuthTimestamp();
        debugLog('[Auth] ✅ SESSION: Cleared auth timestamp on logout');
      } catch (timestampError) {
        debugError('[Auth] Failed to clear auth timestamp on logout', timestampError);
        // Don't fail logout if timestamp clearing fails
      }

      debugLog('[Auth] Logout completed successfully');
    } catch (error: unknown) {
      debugError('[Auth] Sign out error', error);
      showError(error);
      throw error; // Re-throw so caller can handle if needed
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({ user, signOut, loading }), [user, signOut, loading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
