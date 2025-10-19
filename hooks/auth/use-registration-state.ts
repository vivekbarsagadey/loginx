/**
 * TASK-081/083: Registration State Management Hook
 * Manages multi-step registration form state, validation, and submission logic
 *
 * @module hooks/use-registration-state
 * @see {@link https://react-hook-form.com/docs React Hook Form Documentation}
 */

import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, type Auth, type User } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * Dependencies interface for external utilities
 * Allows the hook to work independently by injecting required functions
 */
export interface UseRegistrationStateDependencies {
  /** Firebase Auth instance */
  auth: Auth;
  /** Function to validate password strength */
  validatePassword: (password: string) => { isValid: boolean; errors: string[] };
  /** Function to sanitize email input */
  sanitizeEmail: (email: string) => string;
  /** Function to sanitize general user input */
  sanitizeUserInput: (input: string, maxLength: number) => string;
  /** Function to create user profile in database */
  createUserProfile: (userId: string, profileData: any) => Promise<void>;
  /** Function to show error messages to user */
  showError: (error: unknown) => void;
  /** Optional logger for debugging */
  logger?: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
}

/**
 * Zod schema factory for registration form validation
 * Accepts validatePassword function to maintain independence
 */
export const createRegistrationSchema = (validatePassword: (password: string) => { isValid: boolean; errors: string[] }) =>
  z
    .object({
      firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
      lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
      photoURL: z.string().optional().or(z.literal('')),
      termsAccepted: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and privacy policy',
      }),
      referralCode: z
        .string()
        .regex(/^[A-Z0-9]{6,12}$/, 'Referral code must be 6-12 alphanumeric characters')
        .optional()
        .or(z.literal('')),
      email: z.string().email('Please enter a valid email address.').max(254, 'Email is too long'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(128, 'Password is too long')
        .refine(
          (password) => {
            const result = validatePassword(password);
            return result.isValid;
          },
          (password) => {
            const result = validatePassword(password);
            return { message: result.errors[0] || 'Password does not meet requirements.' };
          }
        ),
      confirmPassword: z.string(),
      address: z.string().max(200, 'Address is too long').optional().or(z.literal('')),
      city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
      state: z.string().max(100, 'State is too long').optional().or(z.literal('')),
      zipCode: z.string().max(10, 'Zip code is too long').optional().or(z.literal('')),
      phoneNumber: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

/**
 * Type definition for registration form data
 */
export type RegistrationFormData = z.infer<ReturnType<typeof createRegistrationSchema>>;

/**
 * Registration step configuration
 * Defines the structure and fields for each step in the registration flow
 */
export interface RegistrationStep {
  /** Unique identifier for the step */
  id: string;
  /** Display title for the step */
  title: string;
  /** Form fields included in this step */
  fields: (keyof RegistrationFormData)[];
}

/**
 * Default registration steps configuration
 * Can be customized based on application requirements
 */
export const DEFAULT_REGISTRATION_STEPS: RegistrationStep[] = [
  {
    id: 'step-1',
    title: 'Personal Information',
    fields: ['firstName', 'lastName', 'photoURL', 'termsAccepted', 'referralCode'],
  },
  {
    id: 'step-2',
    title: 'Account Security',
    fields: ['email', 'password', 'confirmPassword'],
  },
  {
    id: 'step-3',
    title: 'Address',
    fields: ['address', 'city', 'state', 'zipCode'],
  },
  {
    id: 'step-4',
    title: 'Phone Verification',
    fields: ['phoneNumber'],
  },
];

/**
 * Options for configuring the registration state hook
 */
export interface UseRegistrationStateOptions {
  /** Custom registration steps (optional) */
  steps?: RegistrationStep[];
  /** Callback fired on successful registration */
  onSuccess?: (userId: string, hasPhoneNumber: boolean) => void;
  /** Callback fired on registration error */
  onError?: (error: Error) => void;
  /** Required dependencies for independent operation */
  dependencies?: UseRegistrationStateDependencies;
}

/**
 * Custom hook for managing multi-step registration form state
 *
 * Provides:
 * - Form validation with Zod schema
 * - Step navigation (next, previous, jump to step)
 * - Submission handling with Firebase authentication
 * - User profile creation in Firestore
 * - Automatic rollback on profile creation failure
 * - Haptic feedback for user actions
 *
 * This hook supports two modes:
 * 1. **Independent mode**: Pass dependencies via options.dependencies (portable)
 * 2. **LoginX mode**: Uses project utilities automatically (backward compatible)
 *
 * @param options Configuration options for the hook
 * @returns Registration state and control functions
 *
 * @example
 * ```tsx
 * // LoginX mode (automatic dependency injection)
 * const registration = useRegistrationState({
 *   onSuccess: (userId, hasPhone) => {
 *     router.push(hasPhone ? '/(auth)/verify-phone' : '/(tabs)');
 *   },
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Independent mode (manual dependency injection)
 * const registration = useRegistrationState({
 *   dependencies: {
 *     auth: firebaseAuth,
 *     validatePassword: myPasswordValidator,
 *     sanitizeEmail: mySanitizer,
 *     sanitizeUserInput: myInputSanitizer,
 *     createUserProfile: myProfileCreator,
 *     showError: myErrorHandler,
 *     logger: myLogger,
 *   },
 *   onSuccess: (userId) => console.log('Success!', userId),
 * });
 * ```
 */
export function useRegistrationState(options: UseRegistrationStateOptions = {}) {
  const { steps = DEFAULT_REGISTRATION_STEPS, onSuccess, onError, dependencies } = options;

  // Lazy load LoginX dependencies if not provided (backward compatibility)
  const getDependencies = (): UseRegistrationStateDependencies => {
    if (dependencies) {
      return dependencies;
    }

    // Import LoginX utilities only when needed
    const { createUserProfile } = require('@/actions/user.action');
    const { auth } = require('@/firebase-config');
    const { createLogger } = require('@/utils/debug');
    const { showError } = require('@/utils/error');
    const { validatePassword } = require('@/utils/password-validator');
    const { sanitizeEmail, sanitizeUserInput } = require('@/utils/sanitize');

    return {
      auth,
      validatePassword,
      sanitizeEmail,
      sanitizeUserInput,
      createUserProfile,
      showError,
      logger: createLogger('RegistrationState'),
    };
  };

  const deps = getDependencies();
  const logger = deps.logger || { log: () => {}, warn: () => {}, error: () => {} };

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * React Hook Form instance with Zod validation
   */
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(createRegistrationSchema(deps.validatePassword)),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      photoURL: '',
      termsAccepted: false,
      referralCode: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
    },
  });

  const { handleSubmit: hookFormSubmit, trigger } = form;

  /**
   * Navigate to the next step
   * Validates current step fields before proceeding
   */
  const goNext = async () => {
    const currentFields = steps[currentStep]?.fields || [];
    const isValid = await trigger(currentFields as any);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  /**
   * Navigate to the previous step
   */
  const goPrev = async () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  /**
   * Jump to a specific step
   * @param step Step index to navigate to
   */
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  /**
   * Handle registration form submission
   * Creates Firebase user, sends verification email, and creates Firestore profile
   *
   * @param data Validated form data
   */
  const onSubmit = async (data: RegistrationFormData) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all user inputs before submission
      const sanitizedData = {
        firstName: deps.sanitizeUserInput(data.firstName, 50),
        lastName: deps.sanitizeUserInput(data.lastName, 50),
        photoURL: data.photoURL || '',
        termsAccepted: data.termsAccepted,
        termsAcceptedAt: new Date().toISOString(),
        referralCode: data.referralCode ? deps.sanitizeUserInput(data.referralCode, 12) : '',
        email: deps.sanitizeEmail(data.email),
        password: data.password,
        address: data.address ? deps.sanitizeUserInput(data.address, 200) : '',
        city: data.city ? deps.sanitizeUserInput(data.city, 100) : '',
        state: data.state ? deps.sanitizeUserInput(data.state, 100) : '',
        zipCode: data.zipCode ? deps.sanitizeUserInput(data.zipCode, 10) : '',
        phoneNumber: data.phoneNumber ? deps.sanitizeUserInput(data.phoneNumber, 20) : '',
      };

      logger.log('Creating user account...', { email: sanitizedData.email });

      // Step 1: Create user account
      const { user } = await createUserWithEmailAndPassword(deps.auth, sanitizedData.email, sanitizedData.password);

      logger.log('User account created', { uid: user.uid });

      // Step 2: Send email verification
      try {
        await sendEmailVerification(user);
        logger.log('Verification email sent');
      } catch (verificationError) {
        logger.warn('Failed to send verification email:', verificationError);
        // Continue even if email verification fails
      }

      // Step 3: Create user profile in Firestore
      try {
        await deps.createUserProfile(user.uid, {
          displayName: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
          email: sanitizedData.email,
          age: 0,
          photoURL: sanitizedData.photoURL,
          pushEnabled: false,
          emailUpdates: false,
          marketingTips: false,
          address: sanitizedData.address,
          city: sanitizedData.city,
          state: sanitizedData.state,
          zipCode: sanitizedData.zipCode,
          referralCode: sanitizedData.referralCode,
          termsAcceptedAt: sanitizedData.termsAcceptedAt,
        });

        logger.log('User profile created successfully');
      } catch (profileError) {
        logger.error('Failed to create user profile:', profileError);

        // Rollback: Delete the Firebase user if profile creation fails
        try {
          await deleteUser(user);
          logger.log('User account rolled back due to profile creation failure');
          throw new Error('Failed to create user profile. Please try again.');
        } catch (deleteError) {
          logger.error('Failed to rollback user creation:', deleteError);
          throw new Error('Registration failed. Please contact support if you cannot log in.');
        }
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      logger.log('Registration completed successfully');

      // Call success callback
      const hasPhoneNumber = Boolean(sanitizedData.phoneNumber && sanitizedData.phoneNumber.trim());
      onSuccess?.(user.uid, hasPhoneNumber);
    } catch (error) {
      logger.error('Registration error:', error);

      if (error instanceof Error) {
        onError?.(error);
      }

      deps.showError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Create the submit handler
   */
  const handleSubmit = hookFormSubmit(onSubmit);

  return {
    /** React Hook Form instance */
    form,
    /** Current step index (0-based) */
    currentStep,
    /** Total number of steps */
    totalSteps: steps.length,
    /** Current step configuration */
    currentStepConfig: steps[currentStep],
    /** Whether currently on the first step */
    isFirstStep: currentStep === 0,
    /** Whether currently on the last step */
    isLastStep: currentStep === steps.length - 1,
    /** Whether form is being submitted */
    isSubmitting,
    /** Navigate to next step */
    goNext,
    /** Navigate to previous step */
    goPrev,
    /** Jump to specific step */
    goToStep,
    /** Set current step directly */
    setCurrentStep,
    /** Form submission handler */
    handleSubmit,
    /** All registration steps */
    steps,
  };
}
