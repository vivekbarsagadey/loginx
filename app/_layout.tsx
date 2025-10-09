import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import i18n from '@/i18n';

import { ErrorBoundary } from '@/components/error-boundary';
import { GlobalDialogProvider } from '@/components/global-dialog-provider';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Routes } from '@/constants/routes';
import { AuthProvider, useAuth } from '@/hooks/use-auth-provider';
import { LanguageProvider } from '@/hooks/use-language-provider';
import { OnboardingProvider, useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '@/hooks/use-theme-context';
import { initializeAdaptiveCache } from '@/utils/adaptive-cache';
import { initializeLocalFirst } from '@/utils/local-first';
import { initializeNetworkMonitoring } from '@/utils/network';
import { enableLayoutAnimations, logPerformanceMetrics } from '@/utils/performance';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, checkingOnboarding } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'bg-elevated');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
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

  if (authLoading || checkingOnboarding) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {/* Offline Indicator - shown at top of all screens */}
      <OfflineIndicator />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor,
          },
          headerTintColor: textColor,
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

function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useThemeContext();

  // Map resolved theme to React Navigation theme
  const isDark = resolvedTheme.includes('dark') || resolvedTheme === 'dark';

  return <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>{children}</ThemeProvider>;
}

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
      initializeAdaptiveCache().catch((error) => {
        console.error('Failed to initialize adaptive cache:', error);
      });

      // Initialize network monitoring
      const networkUnsubscribe = initializeNetworkMonitoring();

      // Initialize LOCAL-FIRST system
      initializeLocalFirst().catch((error) => {
        console.error('Failed to initialize LOCAL-FIRST system:', error);
      });

      // Cleanup on unmount
      return () => {
        networkUnsubscribe();
      };
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <CustomThemeProvider>
        <LanguageProvider>
          <GlobalDialogProvider>
            <AuthProvider>
              <OnboardingProvider>
                <NavigationThemeProvider>
                  <RootLayoutNav />
                </NavigationThemeProvider>
              </OnboardingProvider>
            </AuthProvider>
          </GlobalDialogProvider>
        </LanguageProvider>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
}
