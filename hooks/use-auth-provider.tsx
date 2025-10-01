import { showError } from "@/utils/error";
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "../firebase-config";

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
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        // Handle auth state change errors
        console.error("[Auth] State change error:", error);
        setLoading(false);
        showError(error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Memoize signOut to prevent unnecessary re-renders
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("[Auth] Sign out error:", error);
      showError(error);
      throw error; // Re-throw so caller can handle if needed
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(
    () => ({ user, signOut, loading }),
    [user, signOut, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
