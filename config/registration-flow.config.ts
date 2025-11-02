/**
 * Registration Flow Configuration
 *
 * Defines the multi-step registration flow using the unified flow system.
 * This configuration replaces the custom step-by-step registration implementation.
 */

import type { FlowConfig } from '@/types/flow';
import { z } from 'zod';

/**
 * Registration Flow Configuration
 *
 * Multi-step user registration with:
 * - Personal information collection
 * - Account security setup
 * - Address information (optional)
 * - Phone verification (optional)
 */
export const registrationFlowConfig: FlowConfig = {
  // Identity
  id: 'registration',
  title: 'Create Account',
  version: '1.0.0',
  description: 'User registration flow with personal info, security, and verification',

  // Visual configuration
  progressIndicator: 'stepper',
  showHeader: true,
  showSkip: false,

  // Steps
  steps: [
    // Step 1: Personal Information
    {
      id: 'personal-info',
      type: 'form',
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      description: 'This information will be used to personalize your experience',
      icon: 'person',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          placeholder: 'John',
          autoCapitalize: 'words',
          validation: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          placeholder: 'Doe',
          autoCapitalize: 'words',
          validation: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
        },
        {
          name: 'photoURL',
          label: 'Profile Photo URL',
          type: 'url',
          optional: true,
          placeholder: 'https://example.com/photo.jpg',
          helperText: 'Optional: Enter URL to your profile photo',
        },
        {
          name: 'referralCode',
          label: 'Referral Code',
          type: 'text',
          optional: true,
          placeholder: 'ABCD1234',
          helperText: 'Optional: Enter a referral code if you have one',
          validation: z
            .string()
            .regex(/^[A-Z0-9]{6,12}$/, 'Referral code must be 6-12 alphanumeric characters')
            .optional()
            .or(z.literal('')),
        },
        {
          name: 'termsAccepted',
          label: 'I accept the Terms of Service and Privacy Policy',
          type: 'checkbox',
          required: true,
          links: [
            {
              text: 'Terms of Service',
              href: '/legal/terms',
              modal: true,
            },
            {
              text: 'Privacy Policy',
              href: '/legal/privacy',
              modal: true,
            },
          ],
          validation: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and privacy policy',
          }),
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
      },
      secondaryButton: {
        label: 'Cancel',
        action: 'back',
      },
    },

    // Step 2: Account Security
    {
      id: 'account-security',
      type: 'form',
      title: 'Account Security',
      subtitle: 'Set up your login credentials',
      description: 'Create a strong password to secure your account',
      icon: 'shield-checkmark',
      fields: [
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'john@example.com',
          autoCapitalize: 'none',
          helperText: "We'll send you a verification link",
          validation: z.string().email('Please enter a valid email address').max(254, 'Email is too long'),
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          placeholder: 'Enter a strong password',
          secure: true,
          helperText: 'Must be at least 8 characters with uppercase, lowercase, number, and special character',
          validation: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(128, 'Password is too long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password',
          required: true,
          placeholder: 'Re-enter your password',
          secure: true,
          helperText: 'Must match the password above',
        },
      ],
      validation: z
        .object({
          email: z.string().email(),
          password: z.string().min(8),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
      primaryButton: {
        label: 'Continue',
        action: 'next',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },

    // Step 3: Address Information (Optional)
    {
      id: 'address-info',
      type: 'form',
      title: 'Address',
      subtitle: 'Where are you located?',
      description: 'This information helps us provide better service (optional)',
      icon: 'location',
      skippable: true,
      fields: [
        {
          name: 'address',
          label: 'Street Address',
          type: 'text',
          optional: true,
          placeholder: '123 Main St',
          validation: z.string().max(200, 'Address is too long').optional().or(z.literal('')),
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          optional: true,
          placeholder: 'New York',
          validation: z.string().max(100, 'City name is too long').optional().or(z.literal('')),
        },
        {
          name: 'state',
          label: 'State / Province',
          type: 'text',
          optional: true,
          placeholder: 'NY',
          validation: z.string().max(100, 'State is too long').optional().or(z.literal('')),
        },
        {
          name: 'zipCode',
          label: 'ZIP / Postal Code',
          type: 'text',
          optional: true,
          placeholder: '10001',
          validation: z.string().max(10, 'ZIP code is too long').optional().or(z.literal('')),
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },

    // Step 4: Phone Verification (Optional)
    {
      id: 'phone-verification',
      type: 'form',
      title: 'Phone Verification',
      subtitle: 'Add your phone number',
      description: 'Optional: Add your phone for enhanced security and notifications',
      icon: 'call',
      skippable: true,
      fields: [
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'text',
          optional: true,
          placeholder: '+1 (555) 123-4567',
          helperText: 'Optional: Used for two-factor authentication',
          validation: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
        },
      ],
      primaryButton: {
        label: 'Complete Registration',
        action: 'complete',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },
  ],

  // Theme
  theme: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
    },
  },

  // Navigation
  navigation: {
    allowBack: true,
    confirmExit: true,
    exitMessage: 'Are you sure you want to cancel registration? Your progress will be lost.',
  },

  // State persistence
  persistState: true,
  persistenceKey: 'registration-flow-state',
  autoSave: {
    enabled: true,
    interval: 30000, // 30 seconds
    storage: 'local',
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackFieldInteraction: true,
    trackValidationErrors: true,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true,
  },

  // Handlers
  onComplete: async (data) => {
    console.log('Registration complete with data:', data);
    // Handle registration completion
    // This will be implemented in the actual registration screen
    return { success: true };
  },

  onAbandonment: async (data, currentStep) => {
    console.log('Registration abandoned at step:', currentStep, 'with data:', data);
    // Track abandonment analytics
  },

  onError: async (error, stepId) => {
    console.error('Registration error at step:', stepId, error);
    return { handled: true };
  },
};
