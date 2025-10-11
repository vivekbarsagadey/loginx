import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export function RegistrationProgress({ currentStep, totalSteps, stepTitle }: RegistrationProgressProps) {
  const progressColor = useThemeColor({}, 'primary');
  const progressBgColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="caption" style={styles.progressText}>
        Step {currentStep + 1} of {totalSteps}
      </ThemedText>
      <View style={styles.progressBarContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                backgroundColor: index <= currentStep ? progressColor : progressBgColor,
              },
            ]}
          />
        ))}
      </View>
      <ThemedText type="body" style={[{ color: textColor }, styles.stepTitle]}>
        {stepTitle}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  progressText: {
    // Color will be set by ThemedText's 'caption' type
  },
  progressBarContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: BorderRadius.xs,
  },
  stepTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },
});
