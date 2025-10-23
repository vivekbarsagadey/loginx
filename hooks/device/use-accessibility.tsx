import { Colors } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isHighContrastEnabled: boolean;
  isBoldTextEnabled: boolean;
  preferredContentSizeCategory: string | null;
}

/**
 * Hook to manage accessibility settings and states
 * Provides real-time updates when accessibility settings change
 */
export function useAccessibility(): AccessibilityState {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isHighContrastEnabled: false,
    isBoldTextEnabled: false,
    preferredContentSizeCategory: null,
  });

  useEffect(() => {
    const initializeAccessibility = async () => {
      try {
        const [screenReader, reduceMotion, reduceTransparency, highContrast, boldText] = await Promise.all([
          AccessibilityInfo.isScreenReaderEnabled(),
          Platform.OS === 'ios' ? AccessibilityInfo.isReduceMotionEnabled() : Promise.resolve(false),
          Platform.OS === 'ios' ? AccessibilityInfo.isReduceTransparencyEnabled() : Promise.resolve(false),
          Platform.OS === 'android' ? AccessibilityInfo.isHighTextContrastEnabled() : Promise.resolve(false),
          Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : Promise.resolve(false),
        ]);

        setAccessibilityState({
          isScreenReaderEnabled: screenReader,
          isReduceMotionEnabled: reduceMotion,
          isReduceTransparencyEnabled: reduceTransparency,
          isHighContrastEnabled: highContrast,
          isBoldTextEnabled: boldText,
          preferredContentSizeCategory: null,
        });
      } catch (error: unknown) {
        // Silently fail - not critical for app functionality
      }
    };

    initializeAccessibility();

    // Set up listeners for accessibility changes
    const listeners: { remove: () => void }[] = [];

    // Screen reader changes
    const screenReaderListener = AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
      setAccessibilityState((prev) => ({ ...prev, isScreenReaderEnabled: isEnabled }));
    });
    listeners.push(screenReaderListener);

    // iOS-specific listeners
    if (Platform.OS === 'ios') {
      const reduceMotionListener = AccessibilityInfo.addEventListener('reduceMotionChanged', (isEnabled) => {
        setAccessibilityState((prev) => ({ ...prev, isReduceMotionEnabled: isEnabled }));
      });
      listeners.push(reduceMotionListener);

      const reduceTransparencyListener = AccessibilityInfo.addEventListener('reduceTransparencyChanged', (isEnabled) => {
        setAccessibilityState((prev) => ({ ...prev, isReduceTransparencyEnabled: isEnabled }));
      });
      listeners.push(reduceTransparencyListener);

      const boldTextListener = AccessibilityInfo.addEventListener('boldTextChanged', (isEnabled) => {
        setAccessibilityState((prev) => ({ ...prev, isBoldTextEnabled: isEnabled }));
      });
      listeners.push(boldTextListener);
    }

    // Android-specific listeners
    if (Platform.OS === 'android') {
      const highContrastListener = AccessibilityInfo.addEventListener('highTextContrastChanged', (isEnabled) => {
        setAccessibilityState((prev) => ({ ...prev, isHighContrastEnabled: isEnabled }));
      });
      listeners.push(highContrastListener);
    }

    // Cleanup function
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  return accessibilityState;
}

/**
 * Utility functions for accessibility-aware UI adjustments
 */
export const AccessibilityUtils = {
  /**
   * Get adjusted animation duration based on reduce motion preference
   */
  getAnimationDuration: (baseDuration: number, reduceMotion: boolean): number => {
    return reduceMotion ? 0 : baseDuration;
  },

  /**
   * Get adjusted font size based on content size category
   */
  getAdjustedFontSize: (baseFontSize: number, contentSizeCategory: string | null): number => {
    if (!contentSizeCategory || Platform.OS !== 'ios') {
      return baseFontSize;
    }

    const scalingFactors: Record<string, number> = {
      UICTContentSizeCategoryXS: 0.8,
      UICTContentSizeCategoryS: 0.9,
      UICTContentSizeCategoryM: 1.0,
      UICTContentSizeCategoryL: 1.15,
      UICTContentSizeCategoryXL: 1.3,
      UICTContentSizeCategoryXXL: 1.5,
      UICTContentSizeCategoryXXXL: 1.7,
      UICTContentSizeCategoryAccessibilityM: 2.0,
      UICTContentSizeCategoryAccessibilityL: 2.3,
      UICTContentSizeCategoryAccessibilityXL: 2.7,
      UICTContentSizeCategoryAccessibilityXXL: 3.2,
      UICTContentSizeCategoryAccessibilityXXXL: 3.8,
    };

    const scaleFactor = scalingFactors[contentSizeCategory] || 1.0;
    return Math.round(baseFontSize * scaleFactor);
  },

  /**
   * Get high contrast colors if needed
   * Uses theme colors instead of hardcoded values for consistency
   */
  getContrastAwareColors: (normalColors: { background: string; text: string }, isHighContrast: boolean) => {
    if (!isHighContrast) {
      return normalColors;
    }

    // Return high contrast alternatives using theme colors
    // Light mode has white background and black text
    // Dark mode has black background and white text
    const isLightBackground = normalColors.background === Colors.light.bg;

    return {
      background: isLightBackground ? Colors.light.bg : Colors.dark.bg,
      text: isLightBackground ? Colors.light.text : Colors.dark.text,
    };
  },

  /**
   * Announce content to screen readers
   */
  announceForScreenReader: (message: string, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(message);
      }, delay);
    } else {
      AccessibilityInfo.announceForAccessibility(message);
    }
  },

  /**
   * Check if an element should be focusable
   */
  shouldBeFocusable: (isInteractive: boolean, isScreenReaderEnabled: boolean): boolean => {
    return isInteractive || isScreenReaderEnabled;
  },

  /**
   * Get appropriate touch target size
   */
  getTouchTargetSize: (baseSize: number): number => {
    // Ensure minimum 44pt touch targets as per iOS HIG and Android guidelines
    return Math.max(baseSize, 44);
  },
};

/**
 * Higher-order component to provide accessibility context
 */
export interface AccessibilityAwareProps {
  accessibility: AccessibilityState;
}

export function withAccessibility<P extends object>(Component: React.ComponentType<P & AccessibilityAwareProps>): React.ComponentType<P> {
  return function AccessibilityAwareComponent(props: P) {
    const accessibility = useAccessibility();
    return <Component {...props} accessibility={accessibility} />;
  };
}

/**
 * Constants for accessibility testing
 */
export const AccessibilityTestIds = {
  ONBOARDING_SLIDE: 'onboarding-slide',
  ONBOARDING_PROGRESS: 'onboarding-progress',
  ONBOARDING_NEXT_BUTTON: 'onboarding-next-button',
  ONBOARDING_BACK_BUTTON: 'onboarding-back-button',
  ONBOARDING_SKIP_BUTTON: 'onboarding-skip-button',
  BIOMETRIC_SETUP_BUTTON: 'biometric-setup-button',
  NOTIFICATION_PERMISSION_BUTTON: 'notification-permission-button',
  THEME_SELECTOR: 'theme-selector',
  LANGUAGE_SELECTOR: 'language-selector',
} as const;
