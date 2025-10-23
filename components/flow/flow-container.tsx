/**
 * Flow Container Component
 *
 * Main container component that orchestrates the entire flow experience.
 * Manages state, navigation, rendering, and provides context to child components.
 */

import { ThemedView } from '@/components/themed-view';
import { FlowContext } from '@/hooks/use-flow-context';
import { useFlowEngine } from '@/hooks/use-flow-engine';
import type { FlowContainerProps } from '@/types/flow';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { FlowHeader } from './flow-header';
import { FlowNavigation } from './flow-navigation';
import { FlowProgress } from './flow-progress';
import { FlowStepWrapper } from './flow-step-wrapper';

/**
 * FlowContainer - Main component for rendering multi-step flows
 *
 * @example
 * ```tsx
 * <FlowContainer
 *   flow={onboardingFlow}
 *   onComplete={() => router.replace('/(tabs)')}
 * />
 * ```
 */
export function FlowContainer({
  flow,
  onComplete,
  onSkip,
  onAbandonment,
  theme,
  userPreferences = {},
  brandId,
  onExperimentView: _onExperimentView,
  initialData,
  resumeState,
  containerStyle,
  headerStyle,
  navigationStyle,
}: FlowContainerProps) {
  const [isReady, setIsReady] = useState(false);

  // Initialize flow engine with configuration
  const context = useFlowEngine(flow, {
    initialData,
    resumeState,
    enableAnalytics: flow.analytics !== undefined,
    enablePersistence: flow.persistState ?? false,
    onComplete,
    onSkip,
    onAbandonment,
  });

  // Load saved state on mount if persistence is enabled
  useEffect(() => {
    async function loadSavedState() {
      if (flow.persistState && !resumeState) {
        try {
          const savedState = await context.loadState();
          if (savedState) {
            // State will be loaded by useFlowEngine if resumeState is provided
            // For now, we just check if state exists
          }
        } catch (_error: unknown) {
          console.error('Failed to load saved state:', _error);
        }
      }
      setIsReady(true);
    }

    loadSavedState();
  }, [flow.persistState, resumeState, context]);

  if (!isReady) {
    // TODO: Show loading state while loading saved state
    return null;
  }

  return (
    <FlowContext.Provider value={context}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <ThemedView style={[styles.content, containerStyle]}>
            {/* Header (optional) */}
            {flow.showHeader !== false && (
              <FlowHeader
                title={flow.title}
                onClose={() => {
                  // TODO: Handle flow exit with confirmation if needed
                  if (flow.navigation?.confirmExit) {
                    // Show confirmation dialog
                  }
                  onAbandonment?.(context.state.data, context.currentStep.id);
                }}
                style={headerStyle}
              />
            )}

            {/* Progress Indicator */}
            {flow.progressIndicator !== 'none' && (
              <FlowProgress
                type={flow.progressIndicator}
                currentStep={context.state.currentStepIndex}
                totalSteps={context.state.totalSteps}
                completedSteps={context.state.completedSteps}
                steps={flow.steps}
              />
            )}

            {/* Current Step */}
            <FlowStepWrapper step={context.currentStep} data={context.state.data} onUpdate={context.updateData} theme={theme} userPreferences={userPreferences} brandId={brandId} />

            {/* Navigation Controls */}
            <FlowNavigation
              canGoBack={context.canGoBack}
              canGoNext={context.canGoNext}
              canSkip={context.canSkip}
              showSkip={flow.showSkip}
              isFirstStep={context.isFirstStep}
              isLastStep={context.isLastStep}
              loading={context.state.loading}
              onBack={context.previous}
              onNext={context.next}
              onSkip={context.skip}
              primaryButton={context.currentStep.primaryButton}
              secondaryButton={context.currentStep.secondaryButton}
              style={navigationStyle}
            />
          </ThemedView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </FlowContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
