import { AnimationDurations } from '@/constants';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface TutorialSlideProps {
  width: number;
  onNext?: () => void;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  steps: string[];
  interactive: boolean;
}

export const TutorialSlide = ({ width, onNext }: TutorialSlideProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const borderStrongColor = useThemeColor({}, 'border-strong');
  const backgroundColor = useThemeColor({}, 'bg');
  const { trackSlideCompletion } = useOnboarding();

  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  // Animation values
  const demoScale = useSharedValue(1);
  const demoOpacity = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  const tutorials: Tutorial[] = [
    {
      id: 'biometric-login',
      title: i18n.t('onb.tutorials.biometric.title'),
      description: i18n.t('onb.tutorials.biometric.description'),
      icon: 'finger-print',
      steps: i18n.t('onb.tutorials.biometric.steps', { returnObjects: true }) as string[],
      interactive: true,
    },
    {
      id: 'theme-switch',
      title: i18n.t('onb.tutorials.theme.title'),
      description: i18n.t('onb.tutorials.theme.description'),
      icon: 'color-palette',
      steps: i18n.t('onb.tutorials.theme.steps', { returnObjects: true }) as string[],
      interactive: true,
    },
    {
      id: 'security-settings',
      title: i18n.t('onb.tutorials.security.title'),
      description: i18n.t('onb.tutorials.security.description'),
      icon: 'shield-checkmark',
      steps: i18n.t('onb.tutorials.security.steps', { returnObjects: true }) as string[],
      interactive: false,
    },
    {
      id: 'profile-management',
      title: i18n.t('onb.tutorials.profile.title'),
      description: i18n.t('onb.tutorials.profile.description'),
      icon: 'person-circle',
      steps: i18n.t('onb.tutorials.profile.steps', { returnObjects: true }) as string[],
      interactive: false,
    },
  ];

  const currentTut = tutorials[currentTutorial];

  const demoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: demoScale.value }],
    opacity: demoOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const playDemo = useCallback(async () => {
    if (isPlayingDemo || !currentTut.interactive) {
      return;
    }

    setIsPlayingDemo(true);

    // Demo animation sequence
    demoScale.value = withSpring(0.95, { damping: 15 });
    demoOpacity.value = withTiming(0.8, { duration: 200 });

    // Progress animation
    progressWidth.value = withTiming(100, { duration: 2000 }, (finished) => {
      if (finished) {
        runOnJS(() => {
          // Mark tutorial as completed
          const newCompleted = new Set(completedTutorials);
          newCompleted.add(currentTut.id);
          setCompletedTutorials(newCompleted);
          setIsPlayingDemo(false);

          // Reset animations
          demoScale.value = withSpring(1);
          demoOpacity.value = withTiming(1, { duration: AnimationDurations.NORMAL });
          progressWidth.value = 0;
        })();
      }
    });
  }, [isPlayingDemo, currentTut, completedTutorials, demoScale, demoOpacity, progressWidth]);

  const handleNext = useCallback(async () => {
    if (currentTutorial < tutorials.length - 1) {
      setCurrentTutorial(currentTutorial + 1);
      progressWidth.value = 0;
    } else {
      // All tutorials completed
      await trackSlideCompletion('tutorials');
      onNext?.();
    }
  }, [currentTutorial, tutorials.length, onNext, trackSlideCompletion, progressWidth]);

  const handleSkipTutorial = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const isCurrentCompleted = completedTutorials.has(currentTut.id);
  const canProceed = isCurrentCompleted || !currentTut.interactive;

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="h1" style={styles.title}>
            {i18n.t('onb.tutorials.title')}
          </ThemedText>

          <ThemedText type="body" style={styles.subtitle}>
            {i18n.t('onb.tutorials.subtitle')}
          </ThemedText>

          {/* Tutorial Progress */}
          <ThemedView style={styles.tutorialProgress}>
            <ThemedText type="caption" style={styles.progressText}>
              {currentTutorial + 1} {i18n.t('onb.tutorials.of')} {tutorials.length}
            </ThemedText>
            <ThemedView style={[styles.progressTrack, { backgroundColor: `${primaryColor}20` }]}>
              <ThemedView
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: primaryColor,
                    width: `${((currentTutorial + 1) / tutorials.length) * 100}%`,
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.tutorialCard}>
          {/* Tutorial Icon and Info */}
          <ThemedView style={styles.tutorialHeader}>
            <ThemedView style={[styles.tutorialIcon, { backgroundColor: `${primaryColor}20` }]}>
              <Ionicons name={currentTut.icon} size={32} color={primaryColor} />
            </ThemedView>

            <ThemedView style={styles.tutorialInfo}>
              <ThemedText type="h2" style={styles.tutorialTitle}>
                {currentTut.title}
              </ThemedText>
              <ThemedText type="body" style={styles.tutorialDescription}>
                {currentTut.description}
              </ThemedText>
            </ThemedView>

            {isCurrentCompleted && (
              <ThemedView style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={successColor} />
              </ThemedView>
            )}
          </ThemedView>

          {/* Interactive Demo Area */}
          {currentTut.interactive && (
            <ThemedView style={styles.demoSection}>
              <ThemedText type="h3" style={styles.demoTitle}>
                {i18n.t('onb.tutorials.tryItOut')}
              </ThemedText>

              <Pressable onPress={playDemo} disabled={isPlayingDemo} style={[styles.demoArea, { borderColor: borderColor }]}>
                <Animated.View style={[styles.demoContent, demoAnimatedStyle]}>
                  <Ionicons name={currentTut.icon} size={48} color={isPlayingDemo ? primaryColor : textMutedColor} />
                  <ThemedText type="body" style={[styles.demoText, { color: isPlayingDemo ? primaryColor : textMutedColor }]}>
                    {isPlayingDemo ? i18n.t('onb.tutorials.running') : i18n.t('onb.tutorials.tapToTry')}
                  </ThemedText>
                </Animated.View>

                {/* Progress Bar for Demo */}
                {isPlayingDemo && (
                  <ThemedView style={styles.demoProgress}>
                    <ThemedView style={[styles.demoProgressTrack, { backgroundColor: `${primaryColor}20` }]}>
                      <Animated.View style={[styles.demoProgressBar, { backgroundColor: primaryColor }, progressAnimatedStyle]} />
                    </ThemedView>
                  </ThemedView>
                )}
              </Pressable>
            </ThemedView>
          )}

          {/* Tutorial Steps */}
          <ThemedView style={styles.stepsSection}>
            <ThemedText type="h3" style={styles.stepsTitle}>
              {i18n.t('onb.tutorials.howItWorks')}
            </ThemedText>

            {currentTut.steps.map((step, index) => (
              <ThemedView key={index} style={styles.stepItem}>
                <ThemedView style={[styles.stepNumber, { backgroundColor: primaryColor }]}>
                  <ThemedText type="caption" style={[styles.stepNumberText, { color: backgroundColor }]}>
                    {index + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedText type="body" style={styles.stepText}>
                  {step}
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Navigation Controls */}
      <ThemedView style={styles.footer}>
        <ThemedView style={styles.tutorialNav}>
          {tutorials.map((_, index) => (
            <ThemedView
              key={index}
              style={[
                styles.navDot,
                {
                  backgroundColor: index === currentTutorial ? primaryColor : index < currentTutorial ? successColor : borderStrongColor,
                },
              ]}
            />
          ))}
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <ThemedButton title={i18n.t('onb.tutorials.skip')} onPress={handleSkipTutorial} variant="secondary" style={styles.skipButton} />

          <ThemedButton
            title={currentTutorial === tutorials.length - 1 ? i18n.t('onb.cta.next') : i18n.t('onb.tutorials.nextTutorial')}
            onPress={handleNext}
            disabled={!canProceed && currentTut.interactive}
            style={styles.nextButton}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontWeight: Typography.h1.fontWeight,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.lg,
  },
  tutorialProgress: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: {
    marginBottom: 8,
    opacity: 0.7,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: BorderRadius.xs,
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  tutorialCard: {
    marginBottom: Spacing.lg,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  tutorialIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tutorialInfo: {
    flex: 1,
  },
  tutorialTitle: {
    marginBottom: Spacing.xs,
    fontWeight: Typography.h2.fontWeight,
  },
  tutorialDescription: {
    lineHeight: Typography.caption.lineHeight,
    opacity: 0.8,
  },
  completedBadge: {
    marginLeft: 8,
  },
  demoSection: {
    marginBottom: Spacing.lg,
  },
  demoTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.h3.fontWeight,
  },
  demoArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    maxHeight: 180,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  demoContent: {
    alignItems: 'center',
  },
  demoText: {
    marginTop: Spacing.sm,
    textAlign: 'center',
    fontWeight: Typography.body.fontWeight,
  },
  demoProgress: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
  },
  demoProgressTrack: {
    height: 2,
    borderRadius: BorderRadius.xs,
  },
  demoProgressBar: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  stepsSection: {},
  stepsTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.h3.fontWeight,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
  },
  stepText: {
    flex: 1,
    lineHeight: Typography.caption.lineHeight,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  tutorialNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
