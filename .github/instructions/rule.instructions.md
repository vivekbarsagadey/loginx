---
applyTo: "**"
---

# Project Development Guidelines

## Table of Contents

1. [TypeScript Guidelines](#typescript-guidelines)
2. [React & React Native Guidelines](#react--react-native-guidelines)
3. [Expo Guidelines](#expo-guidelines)
4. [Component Architecture](#component-architecture)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [Code Style & Formatting](#code-style--formatting)
7. [State Management](#state-management)
8. [Performance Guidelines](#performance-guidelines)
9. [Accessibility](#accessibility)
10. [Testing](#testing)
11. [Security](#security)

---

## TypeScript Guidelines

### Type Safety

- **Always use explicit types** for function parameters and return values
- **Never use `any`** - use `unknown` if type is truly unknown, then narrow it
- **Use interfaces for objects** and types for unions/intersections
- **Leverage utility types**: `Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>`,
  `Record<K, V>`
- **Use const assertions** for literal types: `as const`

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  displayName: string | null;
}

function getUser(userId: string): Promise<User | null> {
  // implementation
}

// ❌ Bad
function getUser(userId: any): Promise<any> {
  // implementation
}
```

### Type Organization

- Keep types in `types/` directory or co-located with components
- Export types from index files for easy imports
- Use discriminated unions for complex state

```typescript
// ✅ Good - Discriminated Union
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

### Generics

- Use generics for reusable components and hooks
- Name generic types descriptively: `TData`, `TError`, `TContext`

```typescript
// ✅ Good
function useAsync<TData, TError = Error>() {
  // implementation
}
```

---

## React & React Native Guidelines

### Component Structure

- **Functional components only** - no class components
- **Use TypeScript for all components**
- **Props interface naming**: `ComponentNameProps`
- **Default exports** for screens, named exports for reusable components

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled
}: ButtonProps) {
  // implementation
}
```

### Hooks Rules

- **Follow React hooks rules** - only call at top level
- **Custom hooks must start with `use`**
- **Extract complex logic into custom hooks**
- **Use dependency arrays correctly** in `useEffect`, `useCallback`, `useMemo`

```typescript
// ✅ Good - Custom Hook
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []); // Empty array - runs once

  return { user, loading };
}
```

### Component Best Practices

- **Keep components small** - under 200 lines
- **Single responsibility** - one component, one job
- **Use composition over prop drilling**
- **Memoize expensive computations** with `useMemo`
- **Memoize callbacks** passed to child components with `useCallback`
- **Use `React.memo`** for expensive pure components

```typescript
// ✅ Good - Memoization
const MemoizedItem = React.memo(({ item, onPress }: ItemProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>...</TouchableOpacity>
  );
});

// Parent component
const handlePress = useCallback((id: string) => {
  // handle press
}, []);
```

### Conditional Rendering

- **Use early returns** for conditional rendering
- **Avoid nested ternaries** - extract to variables or components

```typescript
// ✅ Good
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return <EmptyState />;
  }

  return <ProfileContent user={user} />;
}

// ❌ Bad - Nested ternary
{
  user ? user.verified ? <Verified /> : <Unverified /> : <Loading />;
}
```

---

## Expo Guidelines

### Project Structure

- Use **file-based routing** with Expo Router
- Organize by **feature**, not by type
- Keep **route files minimal** - extract logic to components/hooks

```
app/
  (auth)/          # Auth group
    login.tsx
    register.tsx
  (tabs)/          # Tab navigation
    index.tsx
    settings.tsx
  _layout.tsx      # Root layout
```

### Navigation

- **Use typed routes** from `expo-router`
- **Use `useRouter` hook** for navigation
- **Implement proper back handling** with `router.back()`

```typescript
// ✅ Good
import { useRouter } from "expo-router";

function LoginScreen() {
  const router = useRouter();

  const handleLogin = async () => {
    await login();
    router.replace("/(tabs)");
  };
}
```

### Assets & Resources

- **Use `expo-asset`** for bundling assets
- **Optimize images** before adding to project
- **Use vector icons** from `@expo/vector-icons`
- **Keep fonts in `assets/fonts/`**

### Environment Variables

- **Use `.env` files** for configuration
- **Never commit secrets** - use `.env.local`
- **Type environment variables** in `env.d.ts`

```typescript
// env.d.ts
declare module "@env" {
  export const API_URL: string;
  export const FIREBASE_API_KEY: string;
}
```

### Updates & Builds

- **Use EAS Build** for production builds
- **Configure `eas.json`** properly
- **Test on both platforms** before release

---

## Component Architecture

### Themed Components

- **Always use themed components** from `components/themed-*`
- **Support both light and dark modes**
- **Use theme colors** from `constants/theme.ts`

```typescript
// ✅ Good
import { ThemedView, ThemedText } from "@/components/themed-view";

function MyScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">Hello</ThemedText>
    </ThemedView>
  );
}
```

### Component Organization

```
components/
  ui/               # Generic UI components
    button.tsx
    input.tsx
  themed-*.tsx      # Themed wrappers
  navigation/       # Navigation-specific
  brand/           # Brand elements (logo, etc.)
  [feature]/       # Feature-specific components
```

### Props Pattern

- **Use interfaces for props**
- **Destructure props in signature**
- **Provide sensible defaults**
- **Document complex props with JSDoc**

```typescript
interface CardProps {
  /** Card title displayed at the top */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Card press handler */
  onPress?: () => void;
  /** Elevation level: 0-5 */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

export function Card({ title, subtitle, onPress, elevation = 1 }: CardProps) {
  // implementation
}
```

---

## UI/UX Guidelines

### Core Design Principles (2025)

#### Universal Principles

1. **User-Centricity** - Prioritize user needs, behaviors, and mental models
   - Design should feel natural and effortless
   - Understand your audience demographics and usage patterns
   - Consider tech-savviness, cultural preferences, and context of use

2. **Clarity and Simplicity** - Interfaces must be clean and free from clutter
   - Every element should have a purpose
   - Use whitespace effectively to let content breathe
   - Avoid overwhelming users with too many elements simultaneously

3. **Consistency and Familiarity** - Maintain uniform experience across all
   screens
   - Follow platform conventions (iOS HIG, Android Material Design)
   - Use standard gestures and navigation patterns
   - Consistent visual design creates user confidence

4. **Performance and Responsiveness** - Apps must be fast and fluid
   - Target 60fps for all animations and interactions
   - Provide instant feedback for user actions
   - Micro-interactions should feel alive and responsive

5. **Accessibility First** - Design for all users from the start
   - Support dynamic type sizing and high contrast
   - Ensure VoiceOver/TalkBack compatibility
   - Not an optional feature but a core design pillar

6. **Adaptability** - Design for various screen sizes and orientations
   - Support foldables, tablets, and different device sizes
   - Responsive layouts that gracefully adjust
   - Test on multiple device form factors

### Platform-Specific Design

#### iOS (Human Interface Guidelines)

- **Philosophy**: Deference, Clarity, Depth
- **Visual Style**: Clean, minimalistic with ample whitespace
- **Typography**: San Francisco font family
- **Navigation**: Bottom tab bars (3-5 items), navigation bars at top
- **Animations**: Simple, elegant (fade-ins, slides)
- **Icons**: Rounded square icons with consistent styling
- **Gestures**: Swipe for navigation, pull-to-refresh
- **Back Button**: System-provided gesture (swipe from left edge)

#### Android (Material Design)

- **Philosophy**: Bold, graphic, intentional
- **Visual Style**: Vibrant colors, elevation shadows
- **Typography**: Roboto font family with bold hierarchy
- **Navigation**: Bottom navigation, navigation drawer for secondary options
- **Animations**: Ripple effects, meaningful motion
- **Icons**: Flat, geometric with clear meaning
- **Gestures**: Varied gesture-based interactions
- **Back Button**: On-screen back button or gesture

```typescript
// ✅ Good - Platform-specific styles
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: Platform.select({
      ios: 10, // Rounded corners on iOS
      android: 4 // Less rounded on Android
    }),
    elevation: Platform.select({
      ios: 0, // No elevation on iOS
      android: 2 // Elevation shadow on Android
    }),
    shadowOpacity: Platform.select({
      ios: 0.2, // Shadow on iOS
      android: 0 // Use elevation on Android
    })
  }
});
```

### Layout & Spacing

#### Spacing System

- **8px base unit** - Use multiples of 8 (8, 16, 24, 32, 40, 48, 64)
- **Consistent spacing** creates visual rhythm and hierarchy
- **Component spacing**:
  - Tight: 4-8px (related items)
  - Standard: 16px (most UI elements)
  - Comfortable: 24-32px (section separators)
  - Loose: 40-48px (major sections)

#### Responsive Design

- **Breakpoints** - Define for small, medium, large screens
- **Flexible layouts** - Use Flexbox for adaptive designs
- **Test on real devices** - Various screen sizes and orientations
- **Screen dimensions** - Consider both portrait and landscape
- **Safe areas** - Always respect notches, status bars, home indicators

#### One-Handed Use & Reachability

- **Thumb-friendly zones** - Place important elements in lower half
- **Touch targets** - Minimum 44x44 points (iOS) / 48x48dp (Android)
- **Spacing between targets** - Minimum 8px to prevent mis-taps
- **Primary actions** - Within easy thumb reach (bottom third)
- **Secondary actions** - Upper portions acceptable

```typescript
// ✅ Good - Consistent spacing with safe areas
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16, // Standard spacing
    gap: 8, // Tight spacing between children
  },
  section: {
    marginBottom: 24, // Comfortable spacing
  },
  majorSection: {
    marginBottom: 40, // Loose spacing
  },
  // Thumb-friendly button placement
  primaryButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    minHeight: 48, // Adequate touch target
  },
});
```

### Typography

#### Type Hierarchy

- **Use semantic text types**: `title`, `subtitle`, `body`, `caption`, `label`
- **Establish clear hierarchy** - Guide user attention with font sizes
- **Limit font families** - 1-2 families maximum for consistency
- **Font weights** - Use 2-3 weights (Regular 400, Medium 500, Bold 700)
- **Readable line heights** - 1.4-1.6 for body text, 1.2-1.3 for headings

#### Type Scale (Recommended)

- **Display**: 32-40px - Hero/landing screens
- **Title**: 24-28px - Page titles
- **Heading**: 20-22px - Section headers
- **Subheading**: 16-18px - Subsection headers
- **Body**: 14-16px - Main content
- **Caption**: 12-14px - Supporting text
- **Label**: 10-12px - Form labels, metadata

#### Legibility Best Practices

- **Font size minimum**: 16px for body text (mobile)
- **Line length**: 50-75 characters optimal for readability
- **Letter spacing**: Adjust for all-caps or small text
- **Dynamic Type**: Support iOS Dynamic Type and Android font scaling
- **Text contrast**: Minimum 4.5:1 for normal text, 3:1 for large text

```typescript
// ✅ Good - Complete typography system
<ThemedText type="display">Welcome</ThemedText>
<ThemedText type="title">Main Title</ThemedText>
<ThemedText type="heading">Section Header</ThemedText>
<ThemedText type="subtitle">Subtitle Text</ThemedText>
<ThemedText type="body">Body content goes here with good readability</ThemedText>
<ThemedText type="caption">Supporting information</ThemedText>
<ThemedText type="label">Form Label</ThemedText>

// Support Dynamic Type
import { useWindowDimensions, PixelRatio } from 'react-native';

const { fontScale } = useWindowDimensions();
const adjustedFontSize = 16 * Math.min(fontScale, 1.3); // Cap at 1.3x
```

### Colors & Visual Design

#### Color System

- **Use theme colors** - Never hardcode color values
- **Semantic color naming** - Name by purpose, not appearance
  - Primary, Secondary, Accent
  - Success, Warning, Error, Info
  - Background, Surface, Text
- **Color palette** - 5-7 colors maximum
- **60-30-10 rule** - 60% dominant, 30% secondary, 10% accent

#### Contrast & Accessibility

- **WCAG AA minimum**:
  - Normal text: 4.5:1 contrast ratio
  - Large text (18pt+): 3:1 contrast ratio
  - UI components: 3:1 contrast ratio
- **WCAG AAA recommended**:
  - Normal text: 7:1 contrast ratio
  - Large text: 4.5:1 contrast ratio
- **Test in both themes** - Light and dark mode
- **Color blindness** - Don't rely on color alone to convey information

#### Dark Mode Guidelines

- **True blacks** (#000000) can cause eye strain - use dark grays (#121212)
- **Reduce elevation shadows** - Use lighter surfaces for hierarchy
- **Desaturate colors** - Vibrant colors appear too bright
- **Test readability** - Ensure sufficient contrast in dark theme
- **Respect system preference** - Auto-switch based on user settings

#### Using Color for Meaning

- **Red**: Errors, destructive actions, alerts
- **Green**: Success, confirmation, positive actions
- **Yellow/Orange**: Warnings, caution
- **Blue**: Information, links, primary actions
- **Gray**: Disabled states, secondary information

```typescript
// ✅ Good - Complete color system
import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useColorScheme } from "react-native";

function MyComponent() {
  const theme = useTheme();
  const systemTheme = useColorScheme(); // 'light' | 'dark'
  const colors = Colors[theme];

  return (
    <View style={{ backgroundColor: colors.background }}>
      <ThemedText style={{ color: colors.text }}>Primary Text</ThemedText>
      <ThemedText style={{ color: colors.textSecondary }}>
        Secondary Text
      </ThemedText>

      {/* Semantic colors */}
      <View style={{ backgroundColor: colors.error }}>
        <ThemedText style={{ color: colors.onError }}>Error</ThemedText>
      </View>
      <View style={{ backgroundColor: colors.success }}>
        <ThemedText style={{ color: colors.onSuccess }}>Success</ThemedText>
      </View>
    </View>
  );
}

// ❌ Bad - Hardcoded colors
<View style={{ backgroundColor: "#FF0000" }}>
  {" "}
  {/* Don't do this */}
  <Text style={{ color: "#FFFFFF" }}>Error</Text>
</View>;
```

### Interactive Elements & Feedback

#### Touch Targets

- **Minimum size**: 44x44 points (iOS) / 48x48dp (Android)
- **Spacing**: Minimum 8px between adjacent targets
- **Visual padding**: Make entire area tappable, not just text/icon
- **Hit slop**: Use `hitSlop` prop to extend tappable area beyond visual bounds

#### Visual Feedback States

1. **Default** - Normal state
2. **Hover** - Desktop/tablet (if applicable)
3. **Pressed** - Active press state (opacity, scale, or color change)
4. **Focused** - Keyboard/accessibility focus
5. **Disabled** - Reduced opacity, desaturated colors
6. **Loading** - Spinner or progress indicator

#### Haptic Feedback

- **Use sparingly** - Only for meaningful interactions
- **Match intensity** - Light for selections, medium for actions, heavy for
  errors
- **Success actions** - Light impact
- **Destructive actions** - Heavy impact (warning)
- **Notifications** - Success, warning, or error notifications
- **Respect user settings** - Some users disable haptics

#### Gesture Support

- **Common gestures**:
  - Tap - Primary action
  - Long press - Secondary actions/context menu
  - Swipe - Navigation, delete, refresh
  - Pinch - Zoom (images, maps)
  - Double tap - Quick action (like, zoom)
- **Provide visual cues** - Show that elements are swipeable
- **Gesture conflicts** - Avoid overlapping gesture zones

```typescript
// ✅ Good - Complete interactive feedback
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";

function InteractiveButton({ onPress, disabled, destructive }: ButtonProps) {
  const handlePress = async () => {
    // Haptic feedback before action
    if (destructive) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Extended tap area
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <ThemedText
          style={[styles.buttonText, pressed && styles.buttonTextPressed]}
        >
          {loading ? <ActivityIndicator /> : "Press Me"}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48, // Adequate touch target
    minWidth: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7, // Visual feedback
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.4, // Disabled state
  },
});
```

### Loading States & Empty States

#### Loading Strategies

1. **Spinner** - Simple, quick loads (<2 seconds)
2. **Skeleton screens** - Initial page loads, content preview
3. **Progress bars** - File uploads, downloads, multi-step processes
4. **Shimmer effect** - Modern, polished loading state
5. **Optimistic updates** - Show result immediately, sync in background
6. **Pull-to-refresh** - User-initiated reload

#### Loading Best Practices

- **Show immediately** - Display loading state within 100ms
- **Contextual loading** - Load only relevant sections, not entire screen
- **Estimated time** - Show time remaining for long operations
- **Cancel option** - Let users cancel long operations
- **Preserve context** - Don't lose user's place while loading
- **Timeout handling** - Show error if takes too long

#### Empty States

- **Meaningful illustration** - Help users understand why it's empty
- **Clear message** - Explain why there's no content
- **Call to action** - Guide users on next steps
- **Encouraging tone** - Positive, helpful messaging

```typescript
// ✅ Good - Complete loading and empty states
function DataList() {
  const { data, loading, error, refetch } = useData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Initial loading state - Skeleton
  if (loading && !data) {
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonItem key={i} />
        ))}
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        illustration="error"
        message="Oops! Something went wrong"
        description="We couldn't load your data. Please try again."
        actionLabel="Try Again"
      />
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        illustration="empty-box"
        title="No items yet"
        description="When you add items, they'll appear here."
        actionLabel="Add Your First Item"
        onAction={handleAddItem}
      />
    );
  }

  // Data with pull-to-refresh
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ListItem item={item} />}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      }
      // Show skeleton while refreshing in background
      ListHeaderComponent={refreshing ? <SkeletonItem /> : null}
    />
  );
}

// ✅ Good - Skeleton component
function SkeletonItem() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View style={[styles.skeletonAvatar, animatedStyle]} />
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonTitle, animatedStyle]} />
        <Animated.View style={[styles.skeletonText, animatedStyle]} />
      </View>
    </View>
  );
}

// ✅ Good - Optimistic update
function LikeButton({ postId, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [optimistic, setOptimistic] = useState(false);

  const handleLike = async () => {
    // Optimistic update - show immediately
    setLiked(!liked);
    setOptimistic(true);

    try {
      await likePost(postId);
    } catch (error) {
      // Revert on error
      setLiked(liked);
      showToast("Failed to like post");
    } finally {
      setOptimistic(false);
    }
  };

  return (
    <Pressable onPress={handleLike}>
      <Icon
        name={liked ? "heart" : "heart-outline"}
        color={liked ? colors.error : colors.text}
        style={{ opacity: optimistic ? 0.6 : 1 }}
      />
    </Pressable>
  );
}

// ✅ Good - Progress indicator for upload
function UploadProgress({ progress }: { progress: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 300 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <ThemedText type="caption">{Math.round(progress)}%</ThemedText>
    </View>
  );
}
```

### Error Handling

- **User-friendly messages** - no technical jargon
- **Actionable errors** - suggest next steps
- **Error boundaries** - catch and handle React errors

```typescript
// ✅ Good - User-friendly error
"We couldn't connect to the server. Please check your internet connection and try again.";

// ❌ Bad - Technical error
"Error: Network request failed at line 42";
```

### Forms & Validation (13 Best Practices)

#### Form Design Principles

1. **Choose the best input type** - Use appropriate keyboard types and pickers
2. **Place labels close to inputs** - Clear association, above or inside input
3. **Use clear, jargon-free labels** - Plain language everyone understands
4. **Highlight mandatory fields** - Use asterisk (\*) or "Required" label
5. **Auto-complete and suggestions** - Save time, prevent user errors
6. **Provide helpful constraints** - Character limits, format examples
7. **Just-in-time validation** - Validate as users complete each field
8. **Progress indicators** - Show steps in multi-step forms
9. **Forgive typos** - Auto-correct common format errors (phone, email)
10. **Pre-populate fields** - Use known data when available
11. **Highlight errors clearly** - Use color, icon, and text
12. **Helpful error messages** - Explain what's wrong and how to fix
13. **Keep errors visible** - Don't hide errors in modals or far from field

#### Inline Validation

- **Validate after blur** - Not while user is still typing (annoying)
- **Indicate success** - Green checkmark for complex fields
- **Immediate feedback** - For username availability, password strength
- **Proximity** - Error messages directly below/above the field
- **Multiple indicators** - Icon + color + text message
- **Plain language** - "Email address is required" not "Field cannot be empty"

#### Input Types & Keyboards

```typescript
// ✅ Good - Appropriate input types
<TextInput
  keyboardType="email-address"    // Email keyboard
  autoCapitalize="none"
  autoComplete="email"
  textContentType="emailAddress"
/>

<TextInput
  keyboardType="number-pad"       // Numeric keyboard
  autoComplete="tel"
  textContentType="telephoneNumber"
/>

<TextInput
  keyboardType="default"
  autoCapitalize="words"          // Capitalize names
  textContentType="name"
/>

<TextInput
  secureTextEntry                 // Password field
  autoComplete="password"
  textContentType="password"
/>
```

#### Validation Example

```typescript
// ✅ Good - Complete form validation with best practices
import { useState } from "react";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const validateEmail = (value: string) => {
    setEmail(value);

    // Don't validate empty field until blur
    if (!value) {
      setEmailError("");
      setEmailValid(false);
      return;
    }

    // Validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address (example@domain.com)");
      setEmailValid(false);
    } else {
      setEmailError("");
      setEmailValid(true);
    }
  };

  return (
    <View style={styles.form}>
      {/* Helper text before input */}
      <ThemedText type="caption" style={styles.helperText}>
        We'll use this to send you login codes
      </ThemedText>

      <ThemedTextInput
        label="Email Address *"
        value={email}
        onChangeText={setEmail}
        onBlur={() => validateEmail(email)} // Validate on blur
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        error={emailError}
        success={emailValid}
        leftIcon={emailValid ? "checkmark-circle" : undefined}
        rightIcon={emailError ? "alert-circle" : undefined}
      />

      {/* Error message close to field */}
      {emailError && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={colors.error} />
          <ThemedText style={styles.errorText}>{emailError}</ThemedText>
        </View>
      )}

      {/* Success indicator */}
      {emailValid && (
        <View style={styles.successContainer}>
          <Icon name="checkmark-circle" size={16} color={colors.success} />
          <ThemedText style={styles.successText}>Looks good!</ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
  helperText: {
    marginBottom: 4,
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
  },
});
```

#### Multi-Step Forms

- **Progress indicator** - Show current step and total steps
- **Back navigation** - Allow users to go back and review
- **Save progress** - Don't lose data if user leaves
- **Review screen** - Let users confirm before submitting
- **Progressive disclosure** - Show complexity gradually

```typescript
// ✅ Good - Multi-step form with progress
<View style={styles.container}>
  {/* Progress indicator */}
  <View style={styles.progressBar}>
    <ThemedText type="caption">
      Step {currentStep} of {totalSteps}
    </ThemedText>
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${(currentStep / totalSteps) * 100}%` },
        ]}
      />
    </View>
  </View>

  {/* Current step content */}
  {renderStep(currentStep)}

  {/* Navigation buttons */}
  <View style={styles.navigation}>
    {currentStep > 1 && (
      <Button title="Back" onPress={handleBack} variant="secondary" />
    )}
    <Button
      title={currentStep === totalSteps ? "Submit" : "Continue"}
      onPress={handleNext}
      disabled={!isStepValid}
    />
  </View>
</View>
```

### Animations & Motion

#### Animation Principles

- **Purpose-driven** - Every animation should have a reason
- **Subtle and quick** - Don't slow down user interactions
- **Consistent timing** - Use same duration for similar animations
- **Natural motion** - Spring physics feel more organic
- **Respect preferences** - Honor system "reduce motion" settings

#### Timing Guidelines

- **Micro-interactions**: 100-200ms (button presses, toggles)
- **UI transitions**: 200-300ms (screen changes, modals)
- **Complex animations**: 300-500ms (elaborate transitions)
- **Feedback animations**: 150-200ms (success/error states)
- **Never exceed**: 500ms (users perceive delay)

#### Animation Types

1. **Fade** - Subtle appearance/disappearance
2. **Slide** - Screen transitions, drawers
3. **Scale** - Button presses, modal appearance
4. **Spring** - Natural bouncy feel
5. **Rotation** - Loading spinners, menu toggles
6. **Morphing** - Shape transitions

#### Performance

- **Use `react-native-reanimated`** - Runs on UI thread (60fps guaranteed)
- **Avoid JS animations** - Can drop frames on slow devices
- **Optimize heavy views** - Use `removeClippedSubviews`
- **Native driver** - Enable when possible: `useNativeDriver: true`

```typescript
// ✅ Good - Performant animations with accessibility
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "react-native-reanimated";

function AnimatedScreen() {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  // Respect reduced motion preference
  const animationConfig = reducedMotion
    ? { duration: 0 } // Instant
    : { duration: 200 };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // Spring animation for natural feel
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });

    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);
  };

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(200)}
      exiting={reducedMotion ? undefined : FadeOut.duration(200)}
    >
      <Animated.View style={animatedStyle}>
        <Pressable onPress={handlePress}>
          <ThemedText>Press me</ThemedText>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ✅ Good - Screen transitions
import { Stack } from "expo-router";

<Stack
  screenOptions={{
    animation: "slide_from_right", // iOS style
    animationDuration: 250,
    // or 'fade', 'slide_from_bottom', 'none'
  }}
/>;

// ✅ Good - Loading animation
import { ActivityIndicator } from "react-native";

<ActivityIndicator size="large" color={colors.primary} animating={loading} />;

// ✅ Good - Skeleton loading
function SkeletonLoader() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1, // Infinite
      true // Reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, animatedStyle]} />;
}
```

#### Gesture Animations

```typescript
// ✅ Good - Swipe to delete with gesture
import {
  GestureDetector,
  Gesture,
  runOnJS,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

function SwipeableItem({ onDelete }: { onDelete: () => void }) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = Math.max(-80, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX < -50) {
        translateX.value = withSpring(-80);
      } else {
        translateX.value = withSpring(0);
      }

      if (event.translationX < -150) {
        runOnJS(onDelete)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View>
      <View style={styles.deleteAction}>
        <Icon name="trash" color="white" />
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.item, animatedStyle]}>
          <ThemedText>Swipe to delete</ThemedText>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

---

## Code Style & Formatting

### Naming Conventions

- **Components**: PascalCase - `UserProfile`, `LoginButton`
- **Functions/Variables**: camelCase - `getUserData`, `isLoading`
- **Constants**: UPPER_SNAKE_CASE - `API_URL`, `MAX_RETRY_COUNT`
- **Types/Interfaces**: PascalCase - `User`, `ApiResponse`
- **Files**: kebab-case - `user-profile.tsx`, `login-button.tsx`

### File Organization

```typescript
// 1. Imports - grouped and sorted
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Component
export function Component({}: ComponentProps) {
  // 3a. Hooks
  const router = useRouter();
  const [state, setState] = useState();

  // 3b. Derived values
  const computed = useMemo(() => {}, []);

  // 3c. Event handlers
  const handlePress = useCallback(() => {}, []);

  // 3d. Effects
  useEffect(() => {}, []);

  // 3e. Render
  return <View />;
}

// 4. Styles
const styles = StyleSheet.create({
  // ...
});
```

### Comments & Documentation

- **Use JSDoc** for public APIs
- **Explain why**, not what - code should be self-documenting
- **TODO comments** - include name and date

```typescript
/**
 * Authenticates user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns User object if successful, null otherwise
 * @throws {AuthError} If credentials are invalid
 */
async function login(email: string, password: string): Promise<User | null> {
  // TODO(vivek, 2025-10-15): Add biometric auth support
  // We cache the session to avoid unnecessary API calls
  const cached = await getCachedSession();
  if (cached) return cached;

  return await apiLogin(email, password);
}
```

### Import Organization

```typescript
// 1. React & React Native
import React from "react";
import { View, Text } from "react-native";

// 2. Third-party libraries
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

// 3. Absolute imports - components
import { ThemedView } from "@/components/themed-view";

// 4. Absolute imports - hooks, utils, types
import { useAuth } from "@/hooks/use-auth-provider";
import { sanitizeInput } from "@/utils/sanitize";
import type { User } from "@/types/user";

// 5. Relative imports
import { LocalComponent } from "./local-component";
```

---

## State Management

### Local State

- **Use `useState`** for component-local state
- **Keep state close** to where it's used
- **Lift state up** only when necessary

### Context

- **Use Context** for app-wide state (auth, theme, i18n)
- **Split contexts** by concern - don't create god contexts
- **Memoize context values**

```typescript
// ✅ Good - Memoized context
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Async State

- **Use custom hooks** for async operations
- **Handle all states**: idle, loading, success, error
- **Implement retry logic** for failed requests

```typescript
// ✅ Good - Complete async state handling
function useAsyncOperation<T>() {
  const [state, setState] = useState<AsyncState<T>>({ status: "idle" });

  const execute = async (operation: () => Promise<T>) => {
    setState({ status: "loading" });
    try {
      const data = await operation();
      setState({ status: "success", data });
    } catch (error) {
      setState({ status: "error", error: error as Error });
    }
  };

  return { state, execute };
}
```

---

## Performance Guidelines

### Optimization Techniques

1. **Memoization** - Use `React.memo`, `useMemo`, `useCallback`
2. **Lazy loading** - Code splitting with dynamic imports
3. **List optimization** - Use `FlatList` with `keyExtractor` and
   `getItemLayout`
4. **Image optimization** - Compress images, use appropriate formats
5. **Avoid inline functions** - In render or as props

### FlatList Best Practices

```typescript
// ✅ Good
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem} // Stable reference
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Bundle Size

- **Use `expo-font`** instead of custom font imports
- **Tree shake** unused code
- **Analyze bundle** with `expo-dev-client`

---

## Accessibility

### Requirements

- **All interactive elements** must have accessibility labels
- **Images** need `accessibilityLabel` or be marked as decorative
- **Forms** must have proper labels and hints
- **Focus order** must be logical

```typescript
// ✅ Good
<TouchableOpacity
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Submit form"
  accessibilityHint="Submits your registration information"
>
  <Text>Submit</Text>
</TouchableOpacity>
```

### Testing

- **Test with VoiceOver** (iOS) and **TalkBack** (Android)
- **Test keyboard navigation**
- **Verify color contrast**

---

## Testing

### Test Structure

```typescript
describe("LoginScreen", () => {
  it("should display email and password inputs", () => {
    // Arrange
    const { getByPlaceholderText } = render(<LoginScreen />);

    // Act
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    // Assert
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });
});
```

### Coverage Goals

- **Critical paths**: 100% (auth, payments)
- **Business logic**: 80%
- **UI components**: 60%

---

## Security

### Authentication

- **Never store plain passwords**
- **Use secure storage** for tokens
- **Implement session timeout**
- **Validate on both client and server**

### Data Sanitization

- **Sanitize user inputs** - use `utils/sanitize.ts`
- **Validate data shapes** - use TypeScript + runtime validation
- **Escape HTML** if rendering user content

### API Communication

- **Use HTTPS only**
- **Validate certificates**
- **Handle sensitive data properly**
- **Implement rate limiting**

```typescript
// ✅ Good - Input sanitization
import { sanitizeInput } from "@/utils/sanitize";

const handleSubmit = (rawInput: string) => {
  const sanitized = sanitizeInput(rawInput);
  // proceed with sanitized input
};
```

---

## Best Practices to Adopt

### Core Principles

1. **Never commit secrets** - Use environment variables only
   - Store sensitive data in `.env.local` (never committed)
   - Use `expo-secure-store` for client-side secrets
   - Validate all environment variables at startup
2. **Error boundaries** - Wrap major sections of your app
   - Implement error boundaries around route groups
   - Provide user-friendly fallback UI
   - Log errors to monitoring service (e.g., Sentry)
3. **Logging strategy** - Log everything in development, only errors in
   production
   - Use `utils/debug.ts` for conditional logging
   - Never log sensitive user data
   - Include context in error logs (user ID, action, timestamp)
4. **Type everything** - Avoid `any`, use `unknown` for errors
   - Use `unknown` and narrow types with type guards
   - Leverage TypeScript strict mode
   - Create explicit types for all API responses
5. **Document public APIs** - Add JSDoc to exported functions
   - Include param descriptions and return types
   - Document thrown errors
   - Provide usage examples for complex functions
6. **Semantic versioning** - Follow semver for releases
   - Major: Breaking changes
   - Minor: New features (backward compatible)
   - Patch: Bug fixes

```typescript
// ✅ Good - Following best practices
/**
 * Fetches user profile data from the API
 * @param userId - The unique identifier for the user
 * @returns User profile data or null if not found
 * @throws {NetworkError} If the network request fails
 * @throws {AuthError} If the user is not authenticated
 * @example
 * const profile = await getUserProfile('user-123');
 * if (profile) {
 *   console.log(profile.displayName);
 * }
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof NetworkError) {
      logError("Failed to fetch user profile", { userId, error });
      throw error;
    }
    throw new UnexpectedError("Unknown error occurred", { cause: error });
  }
}
```

---

## Quick Reference Checklist

### Before Committing

- [ ] TypeScript types are explicit and correct
- [ ] No `any` types used
- [ ] Components are properly memoized if needed
- [ ] Accessibility labels added
- [ ] Loading and error states handled
- [ ] Dark mode tested
- [ ] Code follows naming conventions
- [ ] Imports are organized
- [ ] No console.logs in production code
- [ ] No secrets or sensitive data committed
- [ ] Performance optimizations applied
- [ ] Public APIs have JSDoc documentation

### Before PR

- [ ] All tests pass
- [ ] No ESLint errors
- [ ] Tested on iOS and Android
- [ ] Accessibility tested
- [ ] Error cases tested
- [ ] Documentation updated
- [ ] Screenshots added if UI changes

---

## Resources

### Official Documentation

- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

### Design Systems

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

_Last updated: October 2, 2025_
