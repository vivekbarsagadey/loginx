# Screen Animations Implementation

## Overview

This document describes the smooth slide animations implemented for page-to-page
transitions throughout the app. All screen transitions now follow iOS HIG and
Material Design guidelines for a polished, professional feel.

## What Was Implemented

### 1. Animation Constants (`constants/animation.ts`)

Added comprehensive screen transition configuration:

```typescript
export const ScreenTransitions = {
  // Standard push/pop transitions
  SLIDE_FROM_RIGHT: "slide_from_right", // iOS default, feels natural
  SLIDE_FROM_LEFT: "slide_from_left",
  SLIDE_FROM_BOTTOM: "slide_from_bottom", // Good for modals

  // Other transitions
  FADE: "fade", // Subtle, good for tabs
  FADE_FROM_BOTTOM: "fade_from_bottom",
  FLIP: "flip",
  SIMPLE_PUSH: "simple_push",
  NONE: "none", // Instant, no animation

  // Default for the app
  DEFAULT: "slide_from_right",
  MODAL: "slide_from_bottom"
} as const;

export const ScreenPresentations = {
  CARD: "card",
  MODAL: "modal",
  TRANSPARENT_MODAL: "transparentModal",
  CONTAINED_MODAL: "containedModal",
  CONTAINED_TRANSPARENT_MODAL: "containedTransparentModal",
  FULLSCREEN_MODAL: "fullScreenModal"
} as const;
```

### 2. Updated Layout Files

All navigation layouts now use consistent animations:

#### Root Layout (`app/_layout.tsx`)

- **Default animation**: `slide_from_right` at 250ms
- **Tabs**: Fade animation for subtle transitions
- **Auth screens**: Slide from right
- **Modal screens**: Slide from bottom with modal presentation
- **Standard screens**: Slide from right

#### Auth Layout (`app/(auth)/_layout.tsx`)

- Smooth slide transitions for login/register flows
- 250ms duration for all screens

#### Tabs Layout (`app/(tabs)/_layout.tsx`)

- Fade animation for tab switches (150ms is built-in)
- Prevents jarring transitions between home, items, and settings

#### Feature Layouts

All feature-specific layouts now use consistent animations:

- `app/profile/_layout.tsx`
- `app/settings/_layout.tsx`
- `app/about/_layout.tsx`
- `app/legal/_layout.tsx`
- `app/examples/_layout.tsx`
- `app/security/_layout.tsx`
- `app/onboarding/_layout.tsx`
- `app/(auth)/register/_layout.tsx`

## Animation Behavior

### Standard Screens

```typescript
<Stack.Screen
  name="profile"
  options={{
    headerShown: false,
    animation: ScreenTransitions.SLIDE_FROM_RIGHT,
    animationDuration: AnimationDurations.SCREEN_TRANSITION, // 250ms
  }}
/>
```

**Effect**: Smooth slide from right when navigating forward, slide to right when
going back.

### Modal Screens

```typescript
<Stack.Screen
  name="feedback"
  options={{
    headerShown: false,
    animation: ScreenTransitions.MODAL,
    presentation: 'modal',
  }}
/>
```

**Effect**: Slides up from bottom like iOS modal, slides down when dismissed.

### Tab Navigation

```typescript
<Tabs
  screenOptions={{
    animation: 'fade',
  }}
>
```

**Effect**: Subtle fade when switching between tabs (home, items, settings).

## Animation Durations

Following the design guidelines, all animations use optimal durations:

| Animation Type      | Duration | Use Case                     |
| ------------------- | -------- | ---------------------------- |
| `SCREEN_TRANSITION` | 250ms    | Standard push/pop navigation |
| `TAB_SWITCH`        | 150ms    | Tab bar switches             |
| `MODAL_OPEN`        | 300ms    | Modal presentations          |
| `BUTTON_PRESS`      | 100ms    | Button feedback              |
| `FAST`              | 150ms    | Quick UI changes             |

## Design Principles Applied

### ✅ Consistency

- All screens use the same animation type and duration
- Predictable behavior builds user confidence

### ✅ Performance

- 250ms is optimal - fast enough to feel responsive, slow enough to be smooth
- Native animations run on UI thread at 60fps

### ✅ Platform Conventions

- iOS-style slide from right (natural for both iOS and Android)
- Bottom sheet modals for overlay content
- Fade for tab switches to avoid motion sickness

### ✅ Accessibility

- Respects "Reduce Motion" system settings (handled by React Navigation)
- Animations are meaningful, not decorative
- Fast enough that they don't slow down navigation

## Testing the Animations

1. **Standard Navigation**: Navigate between screens (e.g., Home → Settings →
   Theme)
   - Should see smooth slide from right
   - Back navigation slides to right

2. **Modal Navigation**: Open feedback or help screens
   - Should slide up from bottom
   - Dismiss slides down

3. **Tab Switches**: Tap different tabs at bottom
   - Should see subtle fade between tabs
   - No jarring transitions

4. **Multi-Step Flows**: Complete onboarding or registration
   - Each step transitions smoothly
   - Consistent animation throughout

## Future Enhancements

### Gesture Animations

Consider adding gesture-based transitions:

```typescript
import { GestureDetector, Gesture } from "react-native-gesture-handler";
```

### Custom Transitions

For special screens, can override with custom animations:

```typescript
<Stack.Screen
  name="special-screen"
  options={{
    animation: ScreenTransitions.FADE_FROM_BOTTOM,
  }}
/>
```

### Spring Physics

For more natural feel:

```typescript
import Animated, { withSpring } from "react-native-reanimated";

// Can be used for custom in-app animations
withSpring(value, {
  damping: 15,
  stiffness: 150
});
```

## Performance Tips

1. **Keep animations under 300ms** - Anything longer feels sluggish
2. **Use native driver when possible** - React Navigation does this
   automatically
3. **Avoid complex layouts during transitions** - Can cause dropped frames
4. **Test on low-end devices** - Animations should remain smooth

## Troubleshooting

### Animation feels jerky

- Check device performance (test on physical device)
- Ensure no heavy computations during transition
- Verify no console warnings/errors

### Animation too slow/fast

- Adjust `AnimationDurations.SCREEN_TRANSITION` in `constants/animation.ts`
- Recommended range: 200-300ms

### Different animation needed

- Change `animation` prop in layout's `screenOptions`
- Options: 'slide_from_right', 'slide_from_bottom', 'fade', 'none'

## References

- [Expo Router Navigation](https://docs.expo.dev/router/introduction/)
- [React Navigation Transitions](https://reactnavigation.org/docs/stack-navigator/#animations)
- [iOS HIG - Animation](https://developer.apple.com/design/human-interface-guidelines/patterns/animation)
- [Material Design - Motion](https://m3.material.io/styles/motion/overview)

---

**Last Updated**: October 5, 2025  
**Status**: ✅ Complete - All screens have smooth slide animations
