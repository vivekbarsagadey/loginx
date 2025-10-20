/**
 * Flow Navigation Component
 *
 * Handles flow navigation buttons (back, next, skip)
 */

import { ThemedButton } from '@/components/themed-button';
import { type BaseStepConfig } from '@/types/flow';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface FlowNavigationProps {
  canGoBack: boolean;
  canGoNext: boolean;
  canSkip: boolean;
  showSkip?: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  primaryButton?: BaseStepConfig['primaryButton'];
  secondaryButton?: BaseStepConfig['secondaryButton'];
  style?: ViewStyle;
}

export function FlowNavigation({
  canGoBack,
  canGoNext: _canGoNext,
  canSkip,
  showSkip,
  isFirstStep,
  isLastStep,
  loading,
  onBack,
  onNext,
  onSkip,
  primaryButton,
  secondaryButton,
  style,
}: FlowNavigationProps) {
  const handlePrimaryAction = () => {
    if (primaryButton?.action === 'complete' || isLastStep) {
      onNext(); // This will trigger complete in the engine
    } else if (primaryButton?.action === 'skip') {
      onSkip();
    } else if (typeof primaryButton?.action === 'function') {
      primaryButton.action({});
    } else {
      onNext();
    }
  };

  const handleSecondaryAction = () => {
    if (secondaryButton?.action === 'back') {
      onBack();
    } else if (secondaryButton?.action === 'skip') {
      onSkip();
    } else if (typeof secondaryButton?.action === 'function') {
      secondaryButton.action({});
    } else {
      onBack();
    }
  };

  const primaryLabel = primaryButton?.label || (isLastStep ? 'Complete' : 'Continue');
  const secondaryLabel = secondaryButton?.label || 'Back';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.buttonContainer}>
        {/* Back/Secondary Button */}
        {!isFirstStep && canGoBack && <ThemedButton onPress={handleSecondaryAction} title={secondaryLabel} variant="secondary" style={styles.button} disabled={loading} />}

        {/* Skip Button */}
        {showSkip && canSkip && <ThemedButton onPress={onSkip} title="Skip" variant="tertiary" style={styles.button} disabled={loading} />}

        {/* Next/Primary Button */}
        <ThemedButton
          onPress={handlePrimaryAction}
          title={primaryLabel}
          variant="primary"
          style={[styles.button, styles.primaryButton]}
          loading={loading || primaryButton?.loading}
          disabled={typeof primaryButton?.disabled === 'boolean' ? primaryButton.disabled : false || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    minWidth: 120,
  },
});
