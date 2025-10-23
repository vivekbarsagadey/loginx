import { AnimationDurations } from '@/constants/animation';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { ThemedText } from '../themed-text';

export type StepStatus = 'pending' | 'active' | 'completed';

export type StepIndicatorVariant = 'dots' | 'numbers' | 'horizontal';

export interface Step {
  /**
   * Step label/name
   */
  label: string;
  /**
   * Optional step description
   */
  description?: string;
  /**
   * Step status
   */
  status: StepStatus;
}

export interface StepIndicatorProps {
  /**
   * Array of steps
   */
  steps: Step[];
  /**
   * Current active step index (0-based)
   */
  currentStep: number;
  /**
   * Visual variant
   */
  variant?: StepIndicatorVariant;
  /**
   * Whether to allow clicking on steps to navigate
   * @default false
   */
  allowStepNavigation?: boolean;
  /**
   * Callback when a step is clicked
   */
  onStepPress?: (stepIndex: number) => void;
  /**
   * Estimated time remaining in minutes (optional)
   */
  estimatedTimeRemaining?: number;
  /**
   * Container style override
   */
  style?: ViewStyle;
}

/**
 * StepIndicator Component
 * 
 * Displays progress through a multi-step process with different visual variants.
 * 
 * @example Horizontal variant with step names
 * ```tsx
 * <StepIndicator
 *   variant="horizontal"
 *   steps={[
 *     { label: 'Account', status: 'completed' },
 *     { label: 'Profile', status: 'active' },
 *     { label: 'Verify', status: 'pending' },
 *   ]}
 *   currentStep={1}
 *   allowStepNavigation={true}
 *   onStepPress={(index) => navigateToStep(index)}
 * />
 * ```
 * 
 * @example Dots variant
 * ```tsx
 * <StepIndicator
 *   variant="dots"
 *   steps={steps}
 *   currentStep={2}
 *   estimatedTimeRemaining={5}
 * />
 * ```
 */
function StepIndicatorComponent({
  steps,
  currentStep,
  variant = 'horizontal',
  allowStepNavigation = false,
  onStepPress,
  estimatedTimeRemaining,
  style,
}: StepIndicatorProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text-muted');
  const successColor = useThemeColor({}, 'success');
  const surfaceColor = useThemeColor({}, 'surface');

  const handleStepPress = (index: number) => {
    if (allowStepNavigation && onStepPress) {
      onStepPress(index);
    }
  };

  if (variant === 'dots') {
    return (
      <View style={[styles.dotsContainer, style]}>
        <View style={styles.dotsRow}>
          {steps.map((step, index) => (
            <DotIndicator
              key={index}
              status={step.status}
              isActive={index === currentStep}
              onPress={() => handleStepPress(index)}
              allowPress={allowStepNavigation}
            />
          ))}
        </View>
        {estimatedTimeRemaining !== undefined && (
          <ThemedText type="caption" style={[styles.timeEstimate, { color: mutedTextColor }]}>
            About {estimatedTimeRemaining} min remaining
          </ThemedText>
        )}
      </View>
    );
  }

  if (variant === 'numbers') {
    return (
      <View style={[styles.numbersContainer, style]}>
        {steps.map((step, index) => (
          <NumberIndicator
            key={index}
            number={index + 1}
            label={step.label}
            status={step.status}
            isActive={index === currentStep}
            isLast={index === steps.length - 1}
            onPress={() => handleStepPress(index)}
            allowPress={allowStepNavigation}
          />
        ))}
      </View>
    );
  }

  // Horizontal variant (default)
  return (
    <View style={[styles.horizontalContainer, style]}>
      {steps.map((step, index) => (
        <HorizontalStepIndicator
          key={index}
          step={step}
          stepNumber={index + 1}
          isActive={index === currentStep}
          isLast={index === steps.length - 1}
          onPress={() => handleStepPress(index)}
          allowPress={allowStepNavigation}
        />
      ))}
      {estimatedTimeRemaining !== undefined && (
        <ThemedText type="caption" style={[styles.timeEstimate, { color: mutedTextColor }]}>
          ⏱️ About {estimatedTimeRemaining} min remaining
        </ThemedText>
      )}
    </View>
  );
}

export const StepIndicator = memo(StepIndicatorComponent);

// Dot Indicator Component
function DotIndicator({
  status,
  isActive,
  onPress,
  allowPress,
}: {
  status: StepStatus;
  isActive: boolean;
  onPress: () => void;
  allowPress: boolean;
}) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const mutedColor = useThemeColor({}, 'text-muted');

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (allowPress) {
      scale.value = withTiming(0.8, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      onPress();
    }
  };

  const dotColor =
    status === 'completed' ? successColor :
    isActive ? primaryColor :
    mutedColor;

  const dotSize = isActive ? 12 : 8;

  return (
    <Pressable onPress={handlePress} disabled={!allowPress}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotColor,
            width: dotSize,
            height: dotSize,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

// Number Indicator Component
function NumberIndicator({
  number,
  label,
  status,
  isActive,
  isLast,
  onPress,
  allowPress,
}: {
  number: number;
  label: string;
  status: StepStatus;
  isActive: boolean;
  isLast: boolean;
  onPress: () => void;
  allowPress: boolean;
}) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text-muted');
  const successColor = useThemeColor({}, 'success');
  const surfaceColor = useThemeColor({}, 'surface');

  const circleBgColor =
    status === 'completed' ? successColor :
    isActive ? primaryColor :
    surfaceColor;

  const circleTextColor =
    status === 'completed' || isActive ? '#FFFFFF' :
    mutedTextColor;

  return (
    <View style={styles.numberStep}>
      <Pressable onPress={onPress} disabled={!allowPress} style={styles.numberStepButton}>
        <View style={[styles.numberCircle, { backgroundColor: circleBgColor }]}>
          {status === 'completed' ? (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          ) : (
            <ThemedText type="body" style={{ color: circleTextColor, fontWeight: '600' }}>
              {number}
            </ThemedText>
          )}
        </View>
        <ThemedText
          type="caption"
          style={[
            styles.numberLabel,
            { color: isActive ? textColor : mutedTextColor },
          ]}
        >
          {label}
        </ThemedText>
      </Pressable>
      {!isLast && <View style={[styles.numberConnector, { backgroundColor: mutedTextColor }]} />}
    </View>
  );
}

// Horizontal Step Indicator Component
function HorizontalStepIndicator({
  step,
  stepNumber,
  isActive,
  isLast,
  onPress,
  allowPress,
}: {
  step: Step;
  stepNumber: number;
  isActive: boolean;
  isLast: boolean;
  onPress: () => void;
  allowPress: boolean;
}) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text-muted');
  const successColor = useThemeColor({}, 'success');

  const indicatorColor =
    step.status === 'completed' ? successColor :
    isActive ? primaryColor :
    mutedTextColor;

  return (
    <View style={styles.horizontalStep}>
      <Pressable onPress={onPress} disabled={!allowPress} style={styles.horizontalStepButton}>
        <View style={styles.horizontalStepHeader}>
          <View style={[styles.horizontalCircle, { backgroundColor: indicatorColor }]}>
            {step.status === 'completed' ? (
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            ) : (
              <ThemedText type="caption" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                {stepNumber}
              </ThemedText>
            )}
          </View>
          <View style={styles.horizontalStepText}>
            <ThemedText
              type="body"
              style={[
                styles.horizontalLabel,
                { color: isActive ? textColor : mutedTextColor },
              ]}
            >
              {step.label}
            </ThemedText>
            {step.description && (
              <ThemedText type="caption" style={{ color: mutedTextColor }}>
                {step.description}
              </ThemedText>
            )}
          </View>
        </View>
      </Pressable>
      {!isLast && (
        <View style={[styles.horizontalConnector, { backgroundColor: mutedTextColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Dots variant
  dotsContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    borderRadius: 6,
  },

  // Numbers variant
  numbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberStep: {
    flex: 1,
    alignItems: 'center',
  },
  numberStepButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  numberConnector: {
    height: 2,
    flex: 1,
    opacity: 0.3,
  },

  // Horizontal variant
  horizontalContainer: {
    gap: Spacing.md,
  },
  horizontalStep: {
    gap: Spacing.sm,
  },
  horizontalStepButton: {
    flex: 1,
  },
  horizontalStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  horizontalCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalStepText: {
    flex: 1,
    gap: Spacing.xs,
  },
  horizontalLabel: {
    fontWeight: '600',
  },
  horizontalConnector: {
    width: 2,
    height: 24,
    marginLeft: 15,
    opacity: 0.3,
  },

  // Common
  timeEstimate: {
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
