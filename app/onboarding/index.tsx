import { AnimationDurations, Colors } from '@/constants';
import { BorderRadius, Spacing, TouchTarget } from '@/constants/layout';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Dimensions, FlatList, Platform, Pressable, useColorScheme, View } from 'react-native';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BiometricSlide } from '@/components/onboarding/biometric-slide';
import { CompletionSlide } from '@/components/onboarding/completion-slide';
import { Features } from '@/components/onboarding/features';
import { NotificationSlide } from '@/components/onboarding/notification-slide';
import { Personalize } from '@/components/onboarding/personalize';
import { PrivacySlide } from '@/components/onboarding/privacy-slide';
import { ProfileSlide } from '@/components/onboarding/profile-slide';
import { TutorialSlide } from '@/components/onboarding/tutorial-slide';
import { WelcomeSlide } from '@/components/onboarding/welcome';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOnboarding } from '@/hooks/use-onboarding-provider';

const SLIDES = [
  { key: 'welcome' },
  { key: 'features' },
  { key: 'privacy' },
  { key: 'notifications' },
  { key: 'biometric' },
  { key: 'tutorials' },
  { key: 'personalize' },
  { key: 'profile' },
  { key: 'completion' },
];

export default function Onboarding() {
  const r = useRouter();
  const { setOnboardingCompleted, trackSlideCompletion, trackSlideStart, getLastIncompleteSlide, markRecoveryComplete, canSkipSlide } = useOnboarding();
  const [i, setI] = useState(0);
  const [slideTransitioning, setSlideTransitioning] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [isRecoveredSession, setIsRecoveredSession] = useState(false);
  const ref = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const { width } = Dimensions.get('window');
  const { top, bottom } = useSafeAreaInsets();

  // Enhanced Animation values
  const slideProgress = useSharedValue(0);
  const skipButtonOpacity = useSharedValue(1);
  const progressBarWidth = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const slideScale = useSharedValue(1);
  const slideOpacity = useSharedValue(1);
  const backgroundParallax = useSharedValue(0);

  // Parallax scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      backgroundParallax.value = event.contentOffset.x * 0.5;

      const slideIndex = Math.round(event.contentOffset.x / width);
      runOnJS(handleSlideChange)(slideIndex);
    },
  });

  // Handle slide change with enhanced tracking
  const handleSlideChange = useCallback(
    async (newIndex: number) => {
      if (newIndex !== i && newIndex >= 0 && newIndex < SLIDES.length) {
        setI(newIndex);
        const slideId = SLIDES[newIndex].key;
        await trackSlideStart(slideId);

        // Haptic feedback for slide changes
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Announce slide change for accessibility
        if (accessibilityEnabled) {
          AccessibilityInfo.announceForAccessibility(`${i18n.t('onb.accessibility.slideAnnouncement', { current: newIndex + 1, total: SLIDES.length })}`);
        }
      }
    },
    [i, trackSlideStart, accessibilityEnabled]
  );

  // Initialize accessibility and crash recovery
  useEffect(() => {
    const initializeAccessibility = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setAccessibilityEnabled(isEnabled);

      // Check for crash recovery
      const lastSlide = getLastIncompleteSlide();
      if (lastSlide) {
        const slideIndex = SLIDES.findIndex((s) => s.key === lastSlide);
        if (slideIndex > 0) {
          setI(slideIndex);
          setIsRecoveredSession(true);
          ref.current?.scrollToIndex({ index: slideIndex, animated: false });

          // Announce recovery
          if (isEnabled) {
            AccessibilityInfo.announceForAccessibility(i18n.t('onb.accessibility.sessionRecovered'));
          }
        }
      }
    };

    initializeAccessibility();
  }, [getLastIncompleteSlide]);

  // Update animations when slide changes with enhanced effects
  useEffect(() => {
    slideProgress.value = withSpring(i, { damping: 15, stiffness: 150 });
    progressBarWidth.value = withTiming((i / (SLIDES.length - 1)) * 100, { duration: 400 });

    // Enhanced slide transitions
    slideScale.value = withSpring(1, { damping: 20 });
    slideOpacity.value = withTiming(1, { duration: 200 });

    // Hide skip button on completion slide or non-skippable slides
    const currentSlide = SLIDES[i];
    if (i === SLIDES.length - 1 || !canSkipSlide(currentSlide?.key || '')) {
      skipButtonOpacity.value = withTiming(0, { duration: AnimationDurations.MEDIUM });
    } else {
      skipButtonOpacity.value = withTiming(1, { duration: AnimationDurations.MEDIUM });
    }

    // Mark recovery complete if this is a recovered session
    if (isRecoveredSession && i > 0) {
      markRecoveryComplete();
      setIsRecoveredSession(false);
    }
  }, [i, slideProgress, progressBarWidth, skipButtonOpacity, slideScale, slideOpacity, canSkipSlide, isRecoveredSession, markRecoveryComplete]);

  // Enhanced Animated styles with parallax and micro-interactions
  const skipButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skipButtonOpacity.value,
    transform: [
      {
        scale: interpolate(skipButtonOpacity.value, [0, 1], [0.8, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
    transform: [
      {
        scaleX: interpolate(progressBarWidth.value, [0, 100], [0.8, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const slideContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: slideScale.value }],
    opacity: slideOpacity.value,
  }));

  const next = async () => {
    if (slideTransitioning) {
      return;
    }

    setSlideTransitioning(true);

    // Haptic feedback for navigation
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Track completion of current slide with enhanced analytics
    const currentSlide = SLIDES[i];
    if (currentSlide) {
      await trackSlideCompletion(currentSlide.key);
    }

    // Enhanced transition animation
    slideOpacity.value = withTiming(0.7, { duration: AnimationDurations.FAST }, () => {
      slideOpacity.value = withTiming(1, { duration: AnimationDurations.NORMAL });
    });
    slideScale.value = withSpring(0.95, { damping: 15 }, () => {
      slideScale.value = withSpring(1, { damping: 20 });
    });

    if (i < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: i + 1, animated: true });
      // setI will be handled by scroll handler
    } else {
      // Final completion with enhanced feedback
      if (accessibilityEnabled) {
        AccessibilityInfo.announceForAccessibility(i18n.t('onb.accessibility.onboardingComplete'));
      }

      setOnboardingCompleted(true);
      r.replace('/(auth)/login');
    }

    // Reset transition state after animation
    setTimeout(() => setSlideTransitioning(false), 400);
  };
  const back = async () => {
    if (slideTransitioning || i <= 0) {
      return;
    }

    setSlideTransitioning(true);
    ref.current?.scrollToIndex({ index: i - 1, animated: true });
    setI(i - 1);

    setTimeout(() => setSlideTransitioning(false), 350);
  };

  const skip = async () => {
    setOnboardingCompleted(true);
    r.replace('/(auth)/login');
  };

  const render = ({ item }: { item: { key: string } }) => {
    switch (item.key) {
      case 'welcome':
        return <WelcomeSlide width={width} />;
      case 'features':
        return <Features />;
      case 'privacy':
        return <PrivacySlide width={width} onNext={next} />;
      case 'notifications':
        return <NotificationSlide width={width} onNext={next} onSkip={next} />;
      case 'biometric':
        return <BiometricSlide width={width} onNext={next} onSkip={next} />;
      case 'tutorials':
        return <TutorialSlide width={width} onNext={next} />;
      case 'personalize':
        return <Personalize width={width} />;
      case 'profile':
        return <ProfileSlide width={width} onNext={next} onSkip={next} />;
      case 'completion':
        return (
          <CompletionSlide
            width={width}
            onComplete={() => {
              setOnboardingCompleted(true);
              r.replace('/(auth)/login');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Animated.View style={[{ position: 'absolute', right: Spacing.md, top: top + Spacing.md, zIndex: 1 }, skipButtonAnimatedStyle]}>
        <Pressable onPress={skip} style={{ padding: Spacing.sm }}>
          <ThemedText type="muted">{i18n.t('onb.cta.skip')} </ThemedText>
        </Pressable>
      </Animated.View>

      <Animated.View style={[{ flex: 1 }, slideContainerStyle]}>
        <Animated.FlatList
          ref={ref}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s.key}
          renderItem={render}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="start"
          style={{ flex: 1 }}
          accessible={true}
          accessibilityRole="tablist"
          accessibilityLabel={i18n.t('onb.accessibility.slideContainer')}
          accessibilityHint={i18n.t('onb.accessibility.swipeHint')}
          // Enhanced performance props
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={5}
          initialNumToRender={2}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </Animated.View>

      <ThemedView style={{ paddingHorizontal: 16, paddingBottom: bottom + 16 }}>
        {/* Enhanced Progress Indicator with Accessibility */}
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              height: 4,
              backgroundColor: theme['border-strong'],
              borderRadius: 2,
              marginBottom: 12,
            }}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityLabel={i18n.t('onb.accessibility.progress', {
              current: i + 1,
              total: SLIDES.length,
            })}
            accessibilityValue={{
              min: 0,
              max: SLIDES.length,
              now: i + 1,
            }}
          >
            <Animated.View
              style={[
                {
                  height: '100%',
                  backgroundColor: theme.primary,
                  borderRadius: 2,
                },
                progressBarAnimatedStyle,
              ]}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }} accessible={true} accessibilityRole="tablist" accessibilityLabel={i18n.t('onb.accessibility.slideIndicators')}>
            {SLIDES.map((slide, idx) => {
              const isActive = idx === i;
              const isCompleted = idx < i;

              return (
                <Animated.View
                  key={idx}
                  style={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    borderRadius: isActive ? 6 : 4,
                    marginHorizontal: 4,
                    backgroundColor: isCompleted || isActive ? theme.primary : theme['border-strong'],
                    transform: [{ scale: isActive ? 1.2 : 1 }],
                  }}
                  accessible={true}
                  accessibilityRole="tab"
                  accessibilityLabel={i18n.t(`onb.${slide.key}.title`)}
                  accessibilityState={{
                    selected: isActive,
                    disabled: false,
                  }}
                />
              );
            })}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: Spacing.md }}>
          {i > 0 && (
            <Pressable
              onPress={back}
              style={{ height: TouchTarget.comfortable, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface, flex: 1 }}
            >
              <ThemedText style={{ fontWeight: '600' }}>{i18n.t('onb.cta.back')}</ThemedText>
            </Pressable>
          )}
          <Pressable
            onPress={next}
            style={{ height: TouchTarget.comfortable, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, flex: i > 0 ? 2 : 1 }}
          >
            <ThemedText type="inverse" style={{ fontWeight: '600' }}>
              {i < SLIDES.length - 1 ? i18n.t('onb.cta.next') : i18n.t('onb.cta.start')}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ThemedView>
  );
}
