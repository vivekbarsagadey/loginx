/**
 * Simple Onboarding Flow Template
 * 
 * A basic 3-step onboarding flow demonstrating the flow system
 */

import { FlowConfig } from '@/types/flow';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const simpleOnboardingFlow: FlowConfig = {
  id: 'simple-onboarding',
  title: 'Welcome to LoginX',
  version: '1.0',
  
  progressIndicator: 'dots',
  showHeader: true,
  showSkip: true,
  persistState: false,
  
  steps: [
    {
      id: 'welcome',
      type: 'display',
      title: 'Welcome to LoginX',
      subtitle: 'Secure authentication made simple',
      description: 'LoginX provides enterprise-grade security with a beautiful user experience.',
      skippable: false,
    },
    
    {
      id: 'features',
      type: 'display',
      title: 'Key Features',
      subtitle: 'Everything you need for secure authentication',
      content: [
        {
          icon: 'shield-checkmark',
          title: 'Multi-Factor Authentication',
          description: 'Add an extra layer of security with 2FA',
        },
        {
          icon: 'finger-print',
          title: 'Biometric Login',
          description: 'Use Face ID or fingerprint for quick access',
        },
        {
          icon: 'lock-closed',
          title: 'End-to-End Encryption',
          description: 'Your data is always encrypted and secure',
        },
      ],
      skippable: true,
    },
    
    {
      id: 'completion',
      type: 'display',
      title: "You're All Set!",
      subtitle: "Let's get started",
      description: 'Your account is ready. Tap below to start using LoginX.',
      primaryButton: {
        label: 'Get Started',
        action: 'complete',
      },
    },
  ],
  
  onComplete: async (data) => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    return { success: true };
  },
  
  analytics: {
    trackStepView: true,
    trackCompletion: true,
    trackAbandonment: true,
  },
};
