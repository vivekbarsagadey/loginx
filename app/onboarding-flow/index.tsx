/**
 * Onboarding Screen - Flow System Implementation
 *
 * This is the new implementation using the unified flow system.
 * It replaces the custom FlatList-based onboarding implementation.
 */

import { FlowContainer } from '@/components/flow/flow-container';
import { onboardingFlowConfig } from '@/config/onboarding-flow.config';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { createLogger } from '@/utils/debug';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const logger = createLogger('Onboarding');

export default function OnboardingScreen() {
  const router = useRouter();
  const { setOnboardingCompleted } = useOnboarding();

  const handleComplete = async (data: Record<string, unknown>) => {
    logger.info('Onboarding complete with data:', Object.keys(data));
    
    // Store user preferences from personalization step
    if (data.personalize) {
      logger.info('User preferences:', data.personalize);
      // TODO: Store preferences in user profile
    }

    // Store profile data if provided
    if (data.displayName || data.avatar) {
      logger.info('Profile data:', { displayName: data.displayName, hasAvatar: !!data.avatar });
      // TODO: Store profile data
    }

    // Mark onboarding as completed
    setOnboardingCompleted(true);

    // Navigate to login
    router.replace('/(auth)/login');

    return { success: true };
  };

  const handleSkip = async (data: Record<string, unknown>) => {
    logger.info('Onboarding skipped with data:', Object.keys(data));
    
    // Mark onboarding as completed even when skipped
    setOnboardingCompleted(true);

    // Navigate to login
    router.replace('/(auth)/login');

    return { success: true };
  };

  const handleAbandonment = async (data: Record<string, unknown>, currentStep: string) => {
    logger.info('Onboarding abandoned at step:', currentStep, 'with data:', Object.keys(data));
    // Track abandonment analytics here if needed
  };

  const handleStepView = (stepId: string, data: Record<string, unknown>) => {
    logger.debug('Viewing step:', stepId, 'with data:', Object.keys(data));
    // Track step views for analytics
  };

  return (
    <FlowContainer
      flow={{
        ...onboardingFlowConfig,
        onComplete: handleComplete,
        onSkip: handleSkip,
        onAbandonment: handleAbandonment,
        onStepView: handleStepView,
      }}
      initialData={{}}
      containerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
