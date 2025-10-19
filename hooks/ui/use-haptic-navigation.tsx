import * as Haptics from 'expo-haptics';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

interface NavigationOptions {
  /** Haptic feedback style */
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean;
  /** Navigation method */
  method?: 'push' | 'replace' | 'back';
}

/**
 * Custom hook that combines haptic feedback with router navigation
 * Provides consistent feedback when navigating between screens
 */
export function useHapticNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    async (path: Href | string, options: NavigationOptions = {}) => {
      const { hapticStyle = Haptics.ImpactFeedbackStyle.Light, enableHaptics = true, method = 'push' } = options;

      // Provide haptic feedback
      if (enableHaptics) {
        await Haptics.impactAsync(hapticStyle);
      }

      // Navigate using specified method
      switch (method) {
        case 'push':
          router.push(path as Href);
          break;
        case 'replace':
          router.replace(path as Href);
          break;
        case 'back':
          router.back();
          break;
      }
    },
    [router]
  );

  const push = useCallback(
    async (path: Href | string, enableHaptics = true) => {
      await navigate(path, { method: 'push', enableHaptics });
    },
    [navigate]
  );

  const replace = useCallback(
    async (path: Href | string, enableHaptics = true) => {
      await navigate(path, { method: 'replace', enableHaptics });
    },
    [navigate]
  );

  const back = useCallback(
    async (enableHaptics = true) => {
      if (enableHaptics) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.back();
    },
    [router]
  );

  return {
    /** Navigate with haptic feedback */
    navigate,
    /** Push to a route with haptic feedback */
    push,
    /** Replace current route with haptic feedback */
    replace,
    /** Go back with haptic feedback */
    back,
  };
}
