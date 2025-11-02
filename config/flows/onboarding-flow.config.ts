/**
 * Onboarding Flow Configuration
 *
 * Complete onboarding experience using the unified flow system.
 * Replaces the custom onboarding hook with a declarative flow config.
 */

import type { FlowConfig } from '@/types/flow';

/**
 * Complete Onboarding Flow Configuration
 */
export const onboardingFlowConfig: FlowConfig = {
  // Identity
  id: 'onboarding-flow',
  title: 'Welcome to LoginX',
  version: '1.0.0',
  description: 'Interactive onboarding experience for new users',

  // Visual
  progressIndicator: 'dots',
  showHeader: false,
  showSkip: true,

  // State management
  persistState: true,
  persistenceKey: 'onboarding_flow_state',
  autoSave: {
    enabled: true,
    interval: 10000, // Auto-save every 10 seconds
    storage: 'local',
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackFieldInteraction: false,
    trackValidationErrors: false,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true,
  },

  // Navigation
  navigation: {
    allowBack: true,
    confirmExit: false,
    swipeToNavigate: true,
  },

  // Steps
  steps: [
    // Step 1: Welcome
    {
      id: 'welcome',
      type: 'display',
      title: 'Welcome to LoginX',
      subtitle: 'Your complete authentication solution',
      variant: 'hero',
      skippable: true,
      content: [
        {
          icon: 'shield-checkmark',
          iconColor: '#007AFF',
          title: 'Secure Authentication',
          description: 'Industry-leading security with multiple authentication methods',
        },
        {
          icon: 'finger-print',
          iconColor: '#34C759',
          title: 'Biometric Support',
          description: 'Login with FaceID, TouchID, or fingerprint',
        },
        {
          icon: 'lock-closed',
          iconColor: '#FF9500',
          title: 'Two-Factor Authentication',
          description: 'Extra layer of security for your account',
        },
      ],
      primaryButton: {
        label: 'Get Started',
        action: 'next',
        haptic: 'light',
        style: 'primary',
      },
      animations: {
        enter: {
          type: 'spring',
          preset: 'bouncy',
        },
      },
    },

    // Step 2: Features
    {
      id: 'features',
      type: 'display',
      title: 'Powerful Features',
      subtitle: 'Everything you need in one place',
      variant: 'card',
      skippable: true,
      content: [
        {
          icon: 'mail',
          iconColor: '#007AFF',
          title: 'Email & Magic Links',
          description: 'Passwordless authentication via secure email links',
        },
        {
          icon: 'call',
          iconColor: '#34C759',
          title: 'Phone Authentication',
          description: 'Verify your identity with SMS codes',
        },
        {
          icon: 'logo-google',
          iconColor: '#EA4335',
          title: 'Social Sign-In',
          description: 'Login with Google, Apple, or other providers',
        },
        {
          icon: 'people',
          iconColor: '#5856D6',
          title: 'Multi-User Support',
          description: 'Manage multiple accounts seamlessly',
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

    // Step 3: Privacy
    {
      id: 'privacy',
      type: 'info',
      title: 'Your Privacy Matters',
      subtitle: 'How we protect your data',
      icon: 'shield-checkmark',
      skippable: true,
      content: `
# Privacy & Security

We take your privacy seriously. Here's how we protect your data:

## Data Encryption
All your data is encrypted both in transit and at rest using industry-standard encryption.

## No Tracking
We don't track your activity or sell your data to third parties.

## Local-First
Your data is stored locally on your device first, then synced securely to the cloud.

## GDPR Compliant
We comply with international privacy regulations including GDPR and CCPA.

## Your Control
You have complete control over your data with easy export and deletion options.
      `,
      scrollable: true,
      requireScrollToBottom: false,
      requireAcknowledgment: true,
      acknowledgmentText: 'I understand how my data is protected',
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

    // Step 4: Permissions
    {
      id: 'permissions',
      type: 'permission',
      title: 'App Permissions',
      subtitle: 'Grant permissions for the best experience',
      icon: 'key',
      skippable: true,
      permissions: ['notifications', 'camera', 'photos'],
      benefits: [
        {
          icon: 'notifications',
          title: 'Notifications',
          description: 'Get alerts for security events and account activity',
        },
        {
          icon: 'camera',
          title: 'Camera',
          description: 'Take photos for your profile or document verification',
        },
        {
          icon: 'images',
          title: 'Photo Library',
          description: 'Choose photos from your library for your profile',
        },
      ],
      primaryButton: {
        label: 'Grant Permissions',
        action: 'next',
        haptic: 'medium',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Skip for Now',
        action: 'skip',
        style: 'text',
      },
    },

    // Step 5: Notifications
    {
      id: 'notifications',
      type: 'selection',
      title: 'Notification Preferences',
      subtitle: 'Choose what you want to be notified about',
      icon: 'notifications',
      variant: 'list',
      skippable: true,
      multiple: true,
      options: [
        {
          id: 'security',
          title: 'Security Alerts',
          subtitle: 'Login attempts and security events',
          icon: 'shield-checkmark',
          iconColor: '#FF3B30',
          recommended: true,
        },
        {
          id: 'account',
          title: 'Account Activity',
          subtitle: 'Changes to your account settings',
          icon: 'person',
          iconColor: '#007AFF',
          recommended: true,
        },
        {
          id: 'features',
          title: 'New Features',
          subtitle: 'Updates and new capabilities',
          icon: 'sparkles',
          iconColor: '#5856D6',
        },
        {
          id: 'marketing',
          title: 'Tips & Recommendations',
          subtitle: 'Helpful tips to get the most out of LoginX',
          icon: 'bulb',
          iconColor: '#FF9500',
        },
      ],
      primaryButton: {
        label: 'Save Preferences',
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

    // Step 6: Biometric Authentication
    {
      id: 'biometric',
      type: 'action',
      title: 'Enable Biometric Login',
      subtitle: 'Use FaceID, TouchID, or fingerprint for quick and secure login',
      icon: 'finger-print',
      skippable: true,
      action: async () => {
        // This will be implemented in the actual component
        // For now, just simulate enabling biometrics
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true });
          }, 1000);
        });
      },
      loadingTitle: 'Setting up biometric authentication...',
      loadingSubtitle: 'This will only take a moment',
      successTitle: 'Biometric Login Enabled!',
      successSubtitle: 'You can now login with your fingerprint or face',
      successIcon: 'checkmark-circle',
      errorTitle: 'Setup Failed',
      errorSubtitle: 'Unable to enable biometric authentication',
      errorIcon: 'close-circle',
      retry: {
        enabled: true,
        maxAttempts: 3,
      },
      primaryButton: {
        label: 'Enable Biometrics',
        action: 'next',
        haptic: 'medium',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Skip for Now',
        action: 'skip',
        style: 'text',
      },
    },

    // Step 7: Tutorial
    {
      id: 'tutorial',
      type: 'display',
      title: 'How to Use LoginX',
      subtitle: 'Quick tips to get you started',
      variant: 'minimal',
      skippable: true,
      content: [
        {
          icon: 'log-in',
          iconColor: '#007AFF',
          title: 'Multiple Login Methods',
          description: 'Choose email, phone, social, or passwordless authentication',
        },
        {
          icon: 'shield',
          iconColor: '#34C759',
          title: 'Enable 2FA',
          description: 'Add an extra layer of security to your account in settings',
        },
        {
          icon: 'person-circle',
          iconColor: '#5856D6',
          title: 'Complete Your Profile',
          description: 'Add personal information and preferences in your profile',
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

    // Step 8: Personalization
    {
      id: 'personalize',
      type: 'selection',
      title: 'Personalize Your Experience',
      subtitle: 'Choose your preferred theme and language',
      icon: 'color-palette',
      variant: 'grid',
      skippable: true,
      multiple: false,
      columns: 2,
      options: [
        {
          id: 'light',
          title: 'Light Mode',
          icon: 'sunny',
          iconColor: '#FF9500',
        },
        {
          id: 'dark',
          title: 'Dark Mode',
          icon: 'moon',
          iconColor: '#5856D6',
        },
        {
          id: 'system',
          title: 'System Default',
          icon: 'phone-portrait',
          iconColor: '#007AFF',
          recommended: true,
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

    // Step 9: Profile Setup (Optional)
    {
      id: 'profile',
      type: 'form',
      title: 'Complete Your Profile',
      subtitle: 'Help us personalize your experience (Optional)',
      icon: 'person-circle',
      skippable: true,
      fields: [
        {
          name: 'displayName',
          label: 'Display Name',
          type: 'text',
          required: false,
          placeholder: 'How should we address you?',
          icon: 'person',
          autoCapitalize: 'words',
        },
        {
          name: 'bio',
          label: 'Bio',
          type: 'textarea',
          required: false,
          placeholder: 'Tell us about yourself...',
          multiline: true,
          numberOfLines: 3,
          maxLength: 200,
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
        haptic: 'light',
        style: 'primary',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
        style: 'text',
      },
    },

    // Step 10: Completion
    {
      id: 'completion',
      type: 'display',
      title: "You're All Set!",
      subtitle: 'Welcome to LoginX',
      variant: 'hero',
      skippable: false,
      content: [
        {
          icon: 'checkmark-circle',
          iconColor: '#34C759',
          title: 'Setup Complete',
          description: 'Your account is ready to use',
        },
        {
          icon: 'rocket',
          iconColor: '#007AFF',
          title: 'Start Exploring',
          description: 'Discover all the features LoginX has to offer',
        },
      ],
      primaryButton: {
        label: 'Get Started',
        action: 'complete',
        haptic: 'success',
        style: 'primary',
      },
      animations: {
        enter: {
          type: 'spring',
          preset: 'bouncy',
        },
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
      info: '#007AFF',
    },
    layout: {
      spacing: 24,
      padding: 20,
      borderRadius: 16,
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
      duration: 200,
    },
  },
};
