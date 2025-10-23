import { FirestoreStatusIndicator } from '@/components/dev/firestore-status-indicator';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { memo, useCallback, useEffect, useMemo } from 'react';

import i18n from '@/i18n';

import { ErrorBoundary } from '@/components/error-boundary';
import { GlobalDialogProvider } from '@/components/global-dialog-provider';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Routes } from '@/constants/routes';
import { NetworkProvider } from '@/hooks/network/use-network-context';
import { PermissionsProvider } from '@/hooks/permissions/use-permissions-context';
import { SettingsProvider } from '@/hooks/settings/use-settings-context';
import { AuthProvider, useAuth } from '@/hooks/use-auth-provider';
import { LanguageProvider } from '@/hooks/use-language-provider';
import { OnboardingProvider, useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '@/hooks/use-theme-context';
import { initializeAdaptiveCache } from '@/utils/adaptive-cache';
import { createLogger } from '@/utils/debug';
import { getErrorInfo, showError } from '@/utils/error';
import { classifyError } from '@/utils/error-classifier';
import { initializeLocalFirst } from '@/utils/local-first';
import { initializeSentry } from '@/utils/monitoring';
import { initializeNetworkMonitoring } from '@/utils/network';
import { enableLayoutAnimations, logPerformanceMetrics } from '@/utils/performance';

const logger = createLogger('RootLayout');

// TASK-105: Initialize Sentry monitoring early
initializeSentry();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, checkingOnboarding } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();
  const colors = useThemeColors();

  // Memoize navigation logic for performance
  const handleNavigation = useCallback(() => {
    if (authLoading || checkingOnboarding) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!onboardingCompleted && !inOnboardingGroup) {
      router.replace(Routes.ONBOARDING.INDEX);
    } else if (onboardingCompleted) {
      if (user && (inAuthGroup || inOnboardingGroup)) {
        router.replace(Routes.TABS.HOME);
      } else if (!user && !inAuthGroup) {
        router.replace(Routes.AUTH.LOGIN);
      }
    }
  }, [user, segments, router, authLoading, onboardingCompleted, checkingOnboarding]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  if (authLoading || checkingOnboarding) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {/* Offline Indicator - shown at top of all screens */}
      <OfflineIndicator />

      {/* TASK-063: Dev mode Firestore status indicator */}
      <FirestoreStatusIndicator />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors['bg-elevated'],
          },
          headerTintColor: colors.text,
          animation: ScreenTransitions.DEFAULT,
          animationDuration: AnimationDurations.SCREEN_TRANSITION,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: ScreenTransitions.FADE,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />

        {/* Modal and auxiliary screens - headers handled by their own layouts */}
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="examples"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="security"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="legal"
          options={{
            headerShown: false,
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />

        {/* Single modal screens - use bottom slide for modal feel */}
        <Stack.Screen
          name="modal"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.modal'),
            animation: ScreenTransitions.MODAL,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="feedback"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.feedback'),
            animation: ScreenTransitions.MODAL,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="help"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.help'),
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.privacy'),
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="support"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.support'),
            animation: ScreenTransitions.SLIDE_FROM_RIGHT,
          }}
        />
        <Stack.Screen
          name="rate-app"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.rateApp'),
            animation: ScreenTransitions.MODAL,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="report-issue"
          options={{
            headerShown: true,
            title: i18n.t('navigation.titles.reportIssue'),
            animation: ScreenTransitions.MODAL,
            presentation: 'modal',
          }}
        />

        <Stack.Screen
          name="+not-found"
          options={{
            title: i18n.t('navigation.titles.notFound'),
            animation: ScreenTransitions.FADE,
          }}
        />
      </Stack>
    </>
  );
}

const NavigationThemeProvider = memo(({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useThemeContext();

  // Memoize theme calculation
  const navigationTheme = useMemo(() => {
    const isDark = resolvedTheme.includes('dark') || resolvedTheme === 'dark';
    return isDark ? DarkTheme : DefaultTheme;
  }, [resolvedTheme]);

  return <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>;
});
NavigationThemeProvider.displayName = 'NavigationThemeProvider';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Enable Android layout animations
      enableLayoutAnimations();

      // Log architecture info (development only)
      logPerformanceMetrics();

      // Initialize adaptive cache manager FIRST (determines cache size)
      initializeAdaptiveCache().catch((_error) => {
        logger._error('Failed to initialize adaptive cache:', _error);
        // TASK-041: Show user-facing _error dialog
        const errorInfo = getErrorInfo(_error);
        showError(`${errorInfo.title}: ${errorInfo.message}`);
      });

      // Initialize network monitoring
      const networkUnsubscribe = initializeNetworkMonitoring();

      // Initialize LOCAL-FIRST system
      initializeLocalFirst().catch((_error) => {
        logger._error('Failed to initialize LOCAL-FIRST system:', _error);
        // TASK-041: Show user-facing _error dialog with retry option
        const classified = classifyError(_error);
        showError(`Initialization Error: ${classified.userMessage}`);
        // Note: Retry functionality would need to be implemented in the global dialog
        if (classified.retryable) {
          logger.info('Error is retryable - user should restart app');
        }
      });

      // TASK-054: Warm cache with critical data on app launch
      // Fire-and-forget - don't block app initialization
      (async () => {
        try {
          const { warmCache } = await import('@/utils/cache');
          await warmCache([
            'settings:app', // App-level settings
            'settings:user', // User preferences
            'theme:current', // Current theme selection
            'language:current', // Current language
          ]);
        } catch (_error: unknown) {
          logger.warn('Cache warming failed:', _error);
        }
      })();

      // TASK-063: Initialize Firestore asynchronously (non-blocking)
      // Fire-and-forget - app can continue without Firestore
      (async () => {
        try {
          const { initializeFirestore } = await import('@/firebase-config');
          await initializeFirestore();
          logger.log('Firestore initialized successfully');
        } catch (_error: unknown) {
          logger.warn('Firestore initialization failed:', _error);
          // App continues - local-first architecture handles offline
        }
      })();

      // TASK-033: Cleanup on unmount - properly return cleanup function
      return () => {
        logger.log('Cleaning up app resources...');
        networkUnsubscribe();
      };
    }

    // TASK-033: Return undefined when not loaded (no cleanup needed yet)
    return undefined;
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <LanguageProvider>
          <GlobalDialogProvider>
            <NetworkProvider>
              <PermissionsProvider>
                <SettingsProvider>
                  <AuthProvider>
                    <OnboardingProvider>
                      <NavigationThemeProvider>
                        <RootLayoutNav />
                      </NavigationThemeProvider>
                    </OnboardingProvider>
                  </AuthProvider>
                </SettingsProvider>
              </PermissionsProvider>
            </NetworkProvider>
          </GlobalDialogProvider>
        </LanguageProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}
