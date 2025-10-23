import { auth } from '@/firebase-config';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';

export type EmailAvailability = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

interface UseEmailAvailabilityResult {
  status: EmailAvailability;
  message: string;
  checkEmail: (email: string) => void;
  reset: () => void;
}

/**
 * Hook to check if an email is available for registration
 * Uses debouncing to avoid excessive API calls
 *
 * @param debounceMs - Debounce delay in milliseconds (default: 800)
 * @returns Email availability status and check function
 */
export function useEmailAvailability(debounceMs = 800): UseEmailAvailabilityResult {
  const [status, setStatus] = useState<EmailAvailability>('idle');
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCheckedEmail = useRef<string>('');

  const reset = useCallback(() => {
    setStatus('idle');
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const checkEmailAvailability = useCallback(
    async (email: string) => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setStatus('idle');
        setMessage('');
        return;
      }

      // Don't check the same email twice in a row
      if (email === lastCheckedEmail.current && status !== 'idle') {
        return;
      }

      lastCheckedEmail.current = email;
      setStatus('checking');
      setMessage('Checking availability...');

      try {
        // Firebase method to check if email exists
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);

        if (signInMethods.length > 0) {
          // Email is already in use
          setStatus('unavailable');
          setMessage('This email is already registered');
        } else {
          // Email is available
          setStatus('available');
          setMessage('Email is available');
        }
      } catch (_error: unknown) {
        // Don't show error to user - fail silently
        // They'll get a proper error on submission if needed
        setStatus('error');
        setMessage('');
      }
    },
    [status]
  );

  const checkEmail = useCallback(
    (email: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Empty email - reset
      if (!email.trim()) {
        reset();
        return;
      }

      // Set checking status immediately for UI feedback
      setStatus('checking');
      setMessage('');

      // Debounce the actual API call
      timeoutRef.current = setTimeout(() => {
        checkEmailAvailability(email);
      }, debounceMs);
    },
    [debounceMs, checkEmailAvailability, reset]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    message,
    checkEmail,
    reset,
  };
}
