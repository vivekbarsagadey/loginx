/**
 * Form state management hook
 * Provides comprehensive form handling with validation, submission, and error management
 */

import { useCallback, useState } from 'react';

export interface FieldValidation<T> {
  /** Validation function that returns error message or null if valid */
  validate?: (value: T[keyof T], values: T) => string | null | Promise<string | null>;
  /** Whether field is required */
  required?: boolean;
  /** Custom required message */
  requiredMessage?: string;
}

export interface UseFormOptions<T> {
  /** Initial form values */
  initialValues: T;
  /** Field-level validation rules */
  validations?: Partial<Record<keyof T, FieldValidation<T>>>;
  /** Form-level validation function */
  validate?: (values: T) => Record<string, string> | null | Promise<Record<string, string> | null>;
  /** Submit handler */
  onSubmit?: (values: T) => void | Promise<void>;
  /** Reset form after successful submission */
  resetOnSubmit?: boolean;
}

export interface UseFormReturn<T> {
  /** Current form values */
  values: T;
  /** Form errors (field name -> error message) */
  errors: Partial<Record<keyof T, string>>;
  /** Touched fields (field name -> boolean) */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Whether form has been submitted at least once */
  isSubmitted: boolean;
  /** Whether form is valid (no errors) */
  isValid: boolean;
  /** Whether form has unsaved changes */
  isDirty: boolean;
  /** Set value for a specific field */
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Set multiple field values at once */
  setValues: (values: Partial<T>) => void;
  /** Set error for a specific field */
  setError: <K extends keyof T>(field: K, error: string) => void;
  /** Set multiple errors at once */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  /** Mark a field as touched */
  setTouched: <K extends keyof T>(field: K, isTouched?: boolean) => void;
  /** Handle field change (combines setValue and setTouched) */
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;
  /** Handle field blur (marks as touched) */
  handleBlur: <K extends keyof T>(field: K) => () => void;
  /** Validate a specific field */
  validateField: <K extends keyof T>(field: K) => Promise<boolean>;
  /** Validate all fields */
  validateForm: () => Promise<boolean>;
  /** Submit the form */
  handleSubmit: () => Promise<void>;
  /** Reset form to initial values */
  reset: () => void;
  /** Clear all errors */
  clearErrors: () => void;
}

/**
 * Custom hook for form state management with validation
 *
 * @param options - Form configuration options
 * @returns Form state and handlers
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   validations: {
 *     email: {
 *       required: true,
 *       validate: (value) => {
 *         if (!value.includes('@')) return 'Invalid email';
 *         return null;
 *       }
 *     },
 *     password: {
 *       required: true,
 *       validate: (value) => {
 *         if (value.length < 8) return 'Password too short';
 *         return null;
 *       }
 *     }
 *   },
 *   onSubmit: async (values) => {
 *     await loginUser(values);
 *   }
 * });
 *
 * // In your component
 * <TextInput
 *   value={form.values.email}
 *   onChangeText={form.handleChange('email')}
 *   onBlur={form.handleBlur('email')}
 * />
 * {form.touched.email && form.errors.email && (
 *   <Text>{form.errors.email}</Text>
 * )}
 * ```
 */
export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>): UseFormReturn<T> {
  const { initialValues, validations = {}, validate, onSubmit, resetOnSubmit = false } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Check if form is dirty (has changes from initial values)
  const isDirty = Object.keys(values).some((key) => {
    const k = key as keyof T;
    return values[k] !== initialValues[k];
  });

  // Check if form is valid (no errors)
  const isValid = Object.keys(_errors).length === 0;

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    async <K extends keyof T>(field: K): Promise<boolean> => {
      const value = values[field];
      const fieldValidation = (validations as Partial<Record<keyof T, FieldValidation<T>>>)?.[field];

      // Check required
      if (fieldValidation?.required && (!value || (typeof value === 'string' && !value.trim()))) {
        const error = fieldValidation.requiredMessage || 'This field is required';
        setErrorsState((prev) => ({ ...prev, [field]: error }));
        return false;
      }

      // Run custom validation
      if (fieldValidation?.validate) {
        const error = await fieldValidation.validate(value, values);
        if (_error) {
          setErrorsState((prev) => ({ ...prev, [field]: error }));
          return false;
        }
      }

      // Clear error if validation passed
      setErrorsState((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      return true;
    },
    [values, validations]
  );

  /**
   * Validate all form fields
   */
  const validateForm = useCallback(async (): Promise<boolean> => {
    const fieldValidations = await Promise.all(Object.keys(values).map((key) => validateField(key as keyof T)));

    const allFieldsValid = fieldValidations.every((valid) => valid);

    // Run form-level validation
    if (validate && allFieldsValid) {
      const formErrors = await validate(values);
      if (formErrors && Object.keys(formErrors).length > 0) {
        setErrorsState(formErrors as Partial<Record<keyof T, string>>);
        return false;
      }
    }

    return allFieldsValid;
  }, [values, validateField, validate]);

  /**
   * Set value for a specific field
   */
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Set multiple values at once
   */
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  /**
   * Set error for a specific field
   */
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrorsState((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Set multiple errors at once
   */
  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrorsState(newErrors);
  }, []);

  /**
   * Mark a field as touched
   */
  const setTouched = useCallback(<K extends keyof T>(field: K, isTouched = true) => {
    setTouchedState((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  /**
   * Handle field change - combines setValue and validation
   */
  const handleChange = useCallback(
    <K extends keyof T>(field: K) =>
      (value: T[K]) => {
        setValue(field, value);
        // Validate on change if field was already touched or form was submitted
        if (touched[field] || isSubmitted) {
          // Use setTimeout to validate after state update
          setTimeout(() => validateField(field), 0);
        }
      },
    [setValue, validateField, touched, isSubmitted]
  );

  /**
   * Handle field blur - marks as touched and validates
   */
  const handleBlur = useCallback(
    <K extends keyof T>(field: K) =>
      () => {
        setTouched(field, true);
        validateField(field);
      },
    [setTouched, validateField]
  );

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouchedState({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Submit the form
   */
  const handleSubmit = useCallback(async () => {
    setIsSubmitted(true);
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      },
      {} as Partial<Record<keyof T, boolean>>
    );
    setTouchedState(allTouched);

    try {
      const isFormValid = await validateForm();

      if (!isFormValid) {
        return;
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      if (resetOnSubmit) {
        reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, resetOnSubmit, reset]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    clearErrors,
  };
}
