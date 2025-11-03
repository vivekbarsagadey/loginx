/**
 * Registration Flow Configuration
 *
 * Complete multi-step registration flow using the unified flow system.
 * Replaces the custom registration hook with a declarative flow config.
 */

import type { FlowConfig } from '@/types/flow';
import { validatePassword } from '@/utils/password-validator';
import { z } from 'zod';

/**
 * Validation schemas for each registration step
 */

// Step 1: Personal Information
const step1Schema = z.object({
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
});

// Step 2: Account Security
const step2Schema = z
  .object({
    email: z.string().email('Please enter a valid email address.').max(254, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(128, 'Password is too long')
      .refine(
        (password: string) => {
          const result = validatePassword(password);
          return result.isValid;
        },
        {
          message: 'Password must contain uppercase, lowercase, number, and special character.',
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Step 3: Address (Optional)
const step3Schema = z.object({
  address: z.string().max(200, 'Address is too long').optional().or(z.literal('')),
  city: z.string().max(100, 'City is too long').optional().or(z.literal('')),
  state: z.string().max(100, 'State is too long').optional().or(z.literal('')),
  zipCode: z.string().max(10, 'Zip code is too long').optional().or(z.literal('')),
});

// Step 4: Phone Verification (Optional)
const step4Schema = z.object({
  phoneNumber: z.string().max(20, 'Phone number is too long').optional().or(z.literal('')),
});

/**
 * Complete Registration Flow Configuration
 */
export const registrationFlowConfig: FlowConfig = {
  // Identity
  id: 'registration-flow',
  title: 'Create Your Account',
  version: '1.0.0',
  description: 'Multi-step registration process with email verification',

  // Visual
  progressIndicator: 'stepper',
  showHeader: true,
  showSkip: false,

  // State management
  persistState: true,
  persistenceKey: 'registration_flow_state',
  autoSave: {
    enabled: true,
    interval: 5000, // Auto-save every 5 seconds
    storage: 'local',
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackFieldInteraction: true,
    trackValidationErrors: true,
    trackCompletion: true,
    trackAbandonment: true,
  },

  // Navigation
  navigation: {
    allowBack: true,
    confirmExit: true,
    exitMessage: 'Are you sure you want to cancel? Your progress will be lost.',
    swipeToNavigate: false,
  },

  // Steps
  steps: [
    // Step 1: Personal Information
    {
      id: 'personal-info',
      type: 'form',
      title: 'Personal Information',
      subtitle: 'Tell us a bit about yourself',
      icon: 'person',
      variant: 'standard',
      validation: step1Schema,
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          placeholder: 'John',
          icon: 'person',
          autoCapitalize: 'words',
          autoComplete: 'given-name',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          placeholder: 'Doe',
          icon: 'person',
          autoCapitalize: 'words',
          autoComplete: 'family-name',
        },
        {
          name: 'photoURL',
          label: 'Profile Photo (Optional)',
          type: 'image-upload',
          required: false,
          acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
          maxFileSize: 5 * 1024 * 1024, // 5MB
          helperText: 'Upload a profile photo to personalize your account',
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
        },
        {
          name: 'referralCode',
          label: 'Referral Code (Optional)',
          type: 'text',
          required: false,
          placeholder: 'ABC123XYZ',
          icon: 'gift',
          helperText: 'Have a referral code? Enter it here for special benefits',
          maxLength: 12,
          autoCapitalize: 'characters',
        },
      ],
      allowBack: false,
      primaryButton: {
        label: 'Continue',
        action: 'next',
        haptic: 'light',
        style: 'primary',
      },
      animations: {
        enter: {
          type: 'spring',
          preset: 'gentle',
        },
      },
    },

    // Step 2: Account Security
    {
      id: 'account-security',
      type: 'form',
      title: 'Account Security',
      subtitle: 'Secure your account with email and password',
      icon: 'lock-closed',
      variant: 'standard',
      validation: step2Schema,
      fields: [
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'john.doe@example.com',
          icon: 'mail',
          autoCapitalize: 'none',
          autoComplete: 'email',
          helperText: "We'll send a verification link to this email",
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          placeholder: '••••••••',
          icon: 'lock-closed',
          secure: true,
          showStrengthMeter: true,
          helperText: 'Minimum 8 characters with uppercase, lowercase, number, and special character',
          autoComplete: 'new-password',
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password',
          required: true,
          placeholder: '••••••••',
          icon: 'lock-closed',
          secure: true,
          helperText: 'Re-enter your password to confirm',
          autoComplete: 'new-password',
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
        haptic: 'light',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
        style: 'outlined',
      },
    },

    // Step 3: Address Information (Optional)
    {
      id: 'address-info',
      type: 'form',
      title: 'Address',
      subtitle: 'Where are you located? (Optional)',
      icon: 'location',
      variant: 'standard',
      validation: step3Schema,
      skippable: true,
      fields: [
        {
          name: 'address',
          label: 'Street Address',
          type: 'text',
          required: false,
          placeholder: '123 Main Street',
          icon: 'home',
          autoComplete: 'street-address',
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          required: false,
          placeholder: 'New York',
          icon: 'business',
          autoComplete: 'address-level2',
        },
        {
          name: 'state',
          label: 'State/Province',
          type: 'text',
          required: false,
          placeholder: 'NY',
          icon: 'map',
          autoComplete: 'address-level1',
        },
        {
          name: 'zipCode',
          label: 'ZIP/Postal Code',
          type: 'text',
          required: false,
          placeholder: '10001',
          icon: 'mail',
          autoComplete: 'postal-code',
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
        haptic: 'light',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
        style: 'outlined',
      },
    },

    // Step 4: Phone Verification (Optional)
    {
      id: 'phone-verification',
      type: 'form',
      title: 'Phone Verification',
      subtitle: 'Add your phone number for extra security (Optional)',
      icon: 'call',
      variant: 'standard',
      validation: step4Schema,
      skippable: true,
      fields: [
        {
          name: 'phoneNumber',
          label: 'Phone Number',
          type: 'phone',
          required: false,
          placeholder: '+1 (555) 123-4567',
          icon: 'call',
          helperText: 'Used for two-factor authentication and account recovery',
          countryCodePicker: true,
          autoComplete: 'tel',
        },
      ],
      primaryButton: {
        label: 'Complete Registration',
        action: 'complete',
        haptic: 'success',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
        style: 'outlined',
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
    layout: {
      spacing: 16,
      padding: 24,
      borderRadius: 12,
    },
  },

  // Animations
  animations: {
    stepTransition: {
      type: 'spring',
      preset: 'gentle',
      duration: 300,
    },
    progressIndicator: {
      type: 'timing',
      duration: 400,
    },
  },
};
