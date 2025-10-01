import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { AuthProvider, useAuth } from "@/hooks/use-auth-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/hooks/use-onboarding-provider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading: authLoading } = useAuth();
  const { onboardingCompleted, checkingOnboarding } = useOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || checkingOnboarding) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";

    if (!onboardingCompleted && !inOnboardingGroup) {
      router.replace("/onboarding");
    } else if (onboardingCompleted) {
      if (user && (inAuthGroup || inOnboardingGroup)) {
        router.replace("/(tabs)/index" as any);
      } else if (!user && !inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [
    user,
    segments,
    router,
    authLoading,
    onboardingCompleted,
    checkingOnboarding,
  ]);

  if (authLoading || checkingOnboarding) {
    return null; // Or a loading spinner
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <OnboardingProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <RootLayoutNav />
          </ThemeProvider>
        </OnboardingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
