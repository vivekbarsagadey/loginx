import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: ScreenTransitions.SLIDE_FROM_RIGHT,
        animationDuration: AnimationDurations.SCREEN_TRANSITION,
      }}
    />
  );
}
