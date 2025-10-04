import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface Step {
  /** Step label */
  label: string;
  /** Optional description */
  description?: string;
  /** Step state */
  state?: 'incomplete' | 'active' | 'complete' | 'error';
}

export interface StepperProps {
  /** Array of steps */
  steps: Step[];
  /** Current active step index */
  activeStep: number;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Stepper({ steps, activeStep, orientation = 'horizontal', accessibilityLabel }: StepperProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const getStepColor = (index: number, step: Step) => {
    if (step.state === 'error') {
      return errorColor;
    }
    if (step.state === 'complete') {
      return successColor;
    }
    if (index === activeStep) {
      return primaryColor;
    }
    return borderColor;
  };

  return (
    <View
      style={[styles.container, orientation === 'vertical' ? styles.vertical : styles.horizontal]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `Stepper: Step ${activeStep + 1} of ${steps.length}`}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = step.state === 'complete' || index < activeStep;
        const stepColor = getStepColor(index, step);

        return (
          <View key={index} style={[styles.stepContainer, orientation === 'vertical' ? styles.stepVertical : styles.stepHorizontal]}>
            <View style={styles.stepIndicatorContainer}>
              <View
                style={[
                  styles.stepIndicator,
                  {
                    backgroundColor: isComplete || isActive ? stepColor : backgroundColor,
                    borderColor: stepColor,
                  },
                ]}
                accessible={true}
                accessibilityLabel={`Step ${index + 1}: ${step.label}`}
                accessibilityState={{ selected: isActive }}
              >
                <ThemedText
                  style={[
                    styles.stepNumber,
                    {
                      color: isComplete || isActive ? backgroundColor : stepColor,
                    },
                  ]}
                >
                  {isComplete ? '✓' : index + 1}
                </ThemedText>
              </View>

              {index < steps.length - 1 && (
                <View style={[styles.connector, orientation === 'vertical' ? styles.connectorVertical : styles.connectorHorizontal, { backgroundColor: isComplete ? stepColor : borderColor }]} />
              )}
            </View>

            <View style={styles.stepContent}>
              <ThemedText
                type="bodyBold"
                style={[
                  styles.stepLabel,
                  {
                    color: isActive ? primaryColor : textColor,
                  },
                ]}
              >
                {step.label}
              </ThemedText>
              {step.description && (
                <ThemedText type="caption" style={[styles.stepDescription, { color: textColor }]}>
                  {step.description}
                </ThemedText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  connector: {
    // Dynamic styles applied inline
  },
  connectorHorizontal: {
    height: 2,
    width: 40,
  },
  connectorVertical: {
    height: 40,
    width: 2,
  },
  container: {
    // Dynamic styles applied inline
  },
  horizontal: {
    flexDirection: 'row',
  },
  stepContainer: {
    // Dynamic styles applied inline
  },
  stepContent: {
    marginLeft: Spacing.sm,
  },
  stepDescription: {
    marginTop: Spacing.xs,
  },
  stepHorizontal: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  stepIndicator: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepLabel: {
    marginTop: Spacing.xs,
  },
  stepNumber: {
    fontWeight: '600',
  },
  stepVertical: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
});
