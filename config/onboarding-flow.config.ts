/**
 * Onboarding Flow Configuration
 *
 * Defines the multi-step onboarding flow using the unified flow system.
 * This configuration replaces the custom FlatList-based onboarding implementation.
 */

import type { FlowConfig } from '@/types/flow';

/**
 * Onboarding Flow Configuration
 *
 * Multi-step onboarding experience with:
 * - Welcome and feature highlights
 * - Privacy and permissions education
 * - Optional personalization
 * - Account setup
 */
export const onboardingFlowConfig: FlowConfig = {
  // Identity
  id: 'onboarding',
  title: 'Welcome to LoginX',
  version: '1.0.0',
  description: 'User onboarding flow with feature introduction and setup',

  // Visual configuration
  progressIndicator: 'dots',
  showHeader: false,
  showSkip: true,

  // Steps
  steps: [
    // Step 1: Welcome
    {
      id: 'welcome',
      type: 'display',
      title: 'Welcome to LoginX',
      subtitle: 'Your secure authentication platform',
      description: 'Experience seamless and secure authentication for all your needs',
      icon: 'rocket',
      iconColor: '#007AFF',
      variant: 'hero',
      image: require('@/assets/images/onboarding/welcome.png'),
      primaryButton: {
        label: "Let's Start",
        action: 'next',
      },
    },

    // Step 2: Features Overview
    {
      id: 'features',
      type: 'display',
      title: 'Powerful Features',
      subtitle: 'Everything you need for secure authentication',
      icon: 'sparkles',
      variant: 'card',
      content: [
        {
          icon: 'shield-checkmark',
          iconColor: '#34C759',
          title: 'Secure Authentication',
          description: 'Enterprise-grade security with multi-factor authentication',
        },
        {
          icon: 'finger-print',
          iconColor: '#007AFF',
          title: 'Biometric Login',
          description: 'Quick and secure access with Face ID or Touch ID',
        },
        {
          icon: 'sync',
          iconColor: '#5856D6',
          title: 'Cross-Platform Sync',
          description: 'Access your account seamlessly across all devices',
        },
        {
          icon: 'lock-closed',
          iconColor: '#FF9500',
          title: 'Privacy First',
          description: 'Your data is encrypted and never shared without permission',
        },
      ],
      primaryButton: {
        label: 'Next',
        action: 'next',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },

    // Step 3: Privacy
    {
      id: 'privacy',
      type: 'info',
      title: 'Your Privacy Matters',
      subtitle: 'How we protect your data',
      icon: 'shield',
      iconColor: '#34C759',
      content: `# Privacy Policy Highlights

## Data Protection
- All data is encrypted at rest and in transit
- We use industry-standard security protocols
- Your personal information is never sold to third parties

## Your Control
- Manage your privacy settings anytime
- Delete your data whenever you want
- Control what information is shared

## Transparency
- Clear privacy policy with no hidden terms
- Regular security audits and updates
- Open communication about data practices`,
      scrollable: true,
      requireScrollToBottom: true,
      requireAcknowledgment: true,
      acknowledgmentText: 'I have read and understand the privacy policy',
      primaryButton: {
        label: 'I Understand',
        action: 'next',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },

    // Step 4: Permissions
    {
      id: 'permissions',
      type: 'permission',
      title: 'Enable Permissions',
      subtitle: 'For the best experience',
      description: 'We need a few permissions to provide you with all features',
      icon: 'settings',
      skippable: true,
      permissions: ['notifications', 'camera', 'location'],
      benefits: [
        {
          icon: 'notifications',
          title: 'Notifications',
          description: 'Stay informed about security alerts and important updates',
        },
        {
          icon: 'camera',
          title: 'Camera',
          description: 'Scan QR codes for quick login and setup',
        },
        {
          icon: 'location',
          title: 'Location',
          description: 'Enhance security with location-based authentication',
        },
      ],
      primaryButton: {
        label: 'Grant Permissions',
        action: 'next',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
      },
    },

    // Step 5: Notifications
    {
      id: 'notifications',
      type: 'display',
      title: 'Stay Informed',
      subtitle: 'Get notified about important updates',
      icon: 'notifications',
      iconColor: '#FF9500',
      variant: 'card',
      content: [
        {
          icon: 'shield-checkmark',
          iconColor: '#FF3B30',
          title: 'Security Alerts',
          description: 'Instant notifications for suspicious activity',
        },
        {
          icon: 'mail',
          iconColor: '#007AFF',
          title: 'Account Updates',
          description: 'Important changes to your account',
        },
        {
          icon: 'trophy',
          iconColor: '#FFD700',
          title: 'Tips & Tricks',
          description: 'Learn how to get the most out of LoginX',
        },
      ],
      skippable: true,
      primaryButton: {
        label: 'Enable Notifications',
        action: 'next',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
      },
    },

    // Step 6: Biometric Authentication
    {
      id: 'biometric',
      type: 'display',
      title: 'Quick & Secure Login',
      subtitle: 'Enable biometric authentication',
      description: 'Use Face ID or Touch ID for faster, more secure access',
      icon: 'finger-print',
      iconColor: '#5856D6',
      variant: 'hero',
      image: require('@/assets/images/onboarding/biometric.png'),
      skippable: true,
      primaryButton: {
        label: 'Enable Biometric',
        action: 'next',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
      },
    },

    // Step 7: Tutorials
    {
      id: 'tutorials',
      type: 'display',
      title: 'Quick Tips',
      subtitle: 'Get started quickly',
      icon: 'book',
      variant: 'card',
      content: [
        {
          icon: 'key',
          title: 'Secure Passwords',
          description: 'Use strong, unique passwords for each account',
        },
        {
          icon: 'lock-closed',
          title: 'Two-Factor Auth',
          description: 'Add an extra layer of security to your account',
        },
        {
          icon: 'refresh',
          title: 'Regular Updates',
          description: 'Keep your app updated for the latest security features',
        },
      ],
      primaryButton: {
        label: 'Got It',
        action: 'next',
      },
      secondaryButton: {
        label: 'Back',
        action: 'back',
      },
    },

    // Step 8: Personalization
    {
      id: 'personalize',
      type: 'selection',
      title: 'Personalize Your Experience',
      subtitle: 'Choose your preferences',
      description: 'Select the topics you care about most',
      icon: 'color-palette',
      variant: 'cards',
      multiple: true,
      skippable: true,
      options: [
        {
          id: 'security',
          title: 'Security',
          subtitle: 'Stay up to date on security best practices',
          icon: 'shield-checkmark',
          iconColor: '#34C759',
        },
        {
          id: 'productivity',
          title: 'Productivity',
          subtitle: 'Tips to work smarter, not harder',
          icon: 'trending-up',
          iconColor: '#007AFF',
        },
        {
          id: 'updates',
          title: 'Product Updates',
          subtitle: 'Be the first to know about new features',
          icon: 'rocket',
          iconColor: '#5856D6',
        },
        {
          id: 'tips',
          title: 'Tips & Tricks',
          subtitle: 'Get the most out of LoginX',
          icon: 'bulb',
          iconColor: '#FFD700',
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
      },
    },

    // Step 9: Profile Setup
    {
      id: 'profile',
      type: 'form',
      title: 'Complete Your Profile',
      subtitle: 'Add a personal touch',
      description: 'Help us personalize your experience',
      icon: 'person',
      skippable: true,
      fields: [
        {
          name: 'displayName',
          label: 'Display Name',
          type: 'text',
          optional: true,
          placeholder: 'How should we call you?',
          autoCapitalize: 'words',
        },
        {
          name: 'avatar',
          label: 'Profile Picture',
          type: 'image-upload',
          optional: true,
          placeholder: 'Upload a profile picture',
          acceptedFormats: ['image/jpeg', 'image/png'],
          maxFileSize: 5 * 1024 * 1024, // 5MB
        },
      ],
      primaryButton: {
        label: 'Continue',
        action: 'next',
      },
      secondaryButton: {
        label: 'Skip',
        action: 'skip',
      },
    },

    // Step 10: Completion
    {
      id: 'completion',
      type: 'display',
      title: "You're All Set!",
      subtitle: 'Welcome to LoginX',
      description: 'Your account is ready. Start exploring now!',
      icon: 'checkmark-circle',
      iconColor: '#34C759',
      variant: 'hero',
      image: require('@/assets/images/onboarding/completion.png'),
      primaryButton: {
        label: "Let's Go!",
        action: 'complete',
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
    animations: {
      entrance: 'fadeInUp',
      exit: 'fadeOutDown',
    },
  },

  // Animations
  animations: {
    stepTransition: {
      type: 'spring',
      preset: 'smooth',
    },
    elements: {
      stagger: true,
      staggerDelay: 100,
    },
  },

  // Navigation
  navigation: {
    allowBack: true,
    confirmExit: false,
    swipeToNavigate: true,
  },

  // State persistence
  persistState: true,
  persistenceKey: 'onboarding-flow-state',
  autoSave: {
    enabled: true,
    interval: 30000, // 30 seconds
    storage: 'local',
  },

  // Analytics
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true,
    trackSkips: true,
  },

  // Handlers
  onComplete: async (data) => {
    console.log('Onboarding complete with data:', data);
    // Mark onboarding as completed
    return { success: true };
  },

  onSkip: async (data) => {
    console.log('Onboarding skipped with data:', data);
    return { success: true };
  },

  onAbandonment: async (data, currentStep) => {
    console.log('Onboarding abandoned at step:', currentStep, 'with data:', data);
    // Track abandonment analytics
  },
};
