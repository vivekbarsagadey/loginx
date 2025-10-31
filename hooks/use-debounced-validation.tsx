import { useCallback, useEffect, useRef, useState } from 'react';

export interface DebouncedValidationOptions {
  /**
   * Debounce delay in milliseconds
   * @default 500
   */
  delay?: number;
  /**
   * Whether to validate immediately on first change
   * @default false
   */
  validateOnFirstChange?: boolean;
}

/**
 * Hook for debounced form field validation
 *
 * Delays validation until the user stops typing for a specified duration.
 * This provides a better user experience by not showing errors while actively typing.
 *
 * @param value - The field value to validate
 * @param validator - Validation function that returns error message or undefined if valid
 * @param options - Configuration options
 * @returns Validation state and methods
 *
 * @example
 * ```tsx
 * const { error, isValidating, validate } = useDebouncedValidation(
 *   email,
 *   (value) => {
 *     if (!value) return 'Email is required';
 *     if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
 *     return undefined;
 *   },
 *   { delay: 500 }
 * );
 * ```
 */
export function useDebouncedValidation<T>(value: T, validator: (value: T) => string | undefined | Promise<string | undefined>, options: DebouncedValidationOptions = {}) {
  const { delay = 500, validateOnFirstChange = false } = options;

  const [error, setError] = useState<string | undefined>(undefined);
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstChangeRef = useRef(true);

  const validate = useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await validator(value);
      setError(result);
      setHasValidated(true);
    } catch (_err) {
      setError('Validation error occurred');
    } finally {
      setIsValidating(false);
    }
  }, [value, validator]);

  useEffect(() => {
    // Skip validation on first render unless specified
    if (isFirstChangeRef.current && !validateOnFirstChange) {
      isFirstChangeRef.current = false;
      return;
    }

    // Clear unknown pending validation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule validation
    timeoutRef.current = setTimeout(() => {
      validate();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, validate, validateOnFirstChange]);

  const clearError = useCallback(() => {
    setError(undefined);
    setHasValidated(false);
  }, []);

  return {
    error,
    isValidating,
    hasValidated,
    isValid: !error && hasValidated,
    validate,
    clearError,
  };
}

/**
 * Hook for debounced async validation (e.g., checking username availability)
 *
 * @param value - The value to validate
 * @param asyncValidator - Async validation function
 * @param options - Configuration options
 * @returns Validation state and methods
 *
 * @example
 * ```tsx
 * const { error, isValidating } = useAsyncDebouncedValidation(
 *   username,
 *   async (value) => {
 *     const available = await checkUsernameAvailability(value);
 *     return available ? undefined : 'Username is already taken';
 *   }
 * );
 * ```
 */
export function useAsyncDebouncedValidation(value: string, asyncValidator: (value: string) => Promise<string | undefined>, options: DebouncedValidationOptions = {}) {
  return useDebouncedValidation(value, asyncValidator, options);
}

/**
 * Hook for validating multiple form fields with debouncing
 *
 * Useful for forms with multiple fields that need individual validation.
 *
 * @param fields - Object containing field values and validators
 * @param options - Configuration options
 * @returns Validation state for all fields
 *
 * @example
 * ```tsx
 * const validation = useMultiFieldDebouncedValidation({
 *   email: {
 *     value: email,
 *     validator: (v) => !v.includes('@') ? 'Invalid email' : undefined,
 *   },
 *   password: {
 *     value: password,
 *     validator: (v) => v.length < 8 ? 'Too short' : undefined,
 *   },
 * });
 *
 * // Access errors: validation.email.error, validation.password.error
 * ```
 */
export function useMultiFieldDebouncedValidation<T extends Record<string, { value: unknown; validator: (value: unknown) => string | undefined }>>(fields: T, options: DebouncedValidationOptions = {}) {
  type ValidationResult = ReturnType<typeof useDebouncedValidation<unknown>>;

  const validations = Object.entries(fields).reduce(
    (acc, [key, { value, validator }]) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const validation = useDebouncedValidation(value, validator, options);
      return { ...acc, [key]: validation };
    },
    {} as Record<keyof T, ValidationResult>
  );

  const isValid = Object.values(validations).every((v) => (v as ValidationResult).isValid);

  const hasErrors = Object.values(validations).some((v) => (v as ValidationResult).error);

  return {
    ...validations,
    isValid,
    hasErrors,
  };
}
