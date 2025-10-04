import { clearAuthState, saveAuthState } from '@/utils/auth-persistence';
import { debugError, debugLog } from '@/utils/debug';
import { showError } from '@/utils/error';
import { applyPendingProfileData, clearPendingProfileData } from '@/utils/pending-profile';
import { clearSecureStorage } from '@/utils/secure-storage';
import { signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase-config';

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
            const applied = await applyPendingProfileData(user);
            if (applied) {
              debugLog('[Auth] Applied pending profile data from onboarding');
            }
          } catch (error) {
            console.error('[Auth] Failed to apply pending profile data:', error);
            // Don't fail authentication for profile data issues
          }

          // Save authentication state for persistence
          try {
            await saveAuthState(user);
            debugLog('[Auth] ✅ PERSISTENCE: Auth state saved successfully');
          } catch (persistError) {
            debugError('[Auth] Failed to save auth state for persistence', persistError);
            // Don't fail authentication for persistence issues
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
        await clearPendingProfileData();
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

      debugLog('[Auth] Logout completed successfully');
    } catch (error) {
      debugError('[Auth] Sign out error', error);
      showError(error);
      throw error; // Re-throw so caller can handle if needed
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({ user, signOut, loading }), [user, signOut, loading]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
