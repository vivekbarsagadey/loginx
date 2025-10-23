# LoginX Custom Hooks Reference

**Version**: 1.0.0  
**Last Updated**: October 19, 2025  
**Total Hooks**: 40+

---

## Table of Contents

1. [Authentication Hooks](#authentication-hooks)
2. [Async Hooks](#async-hooks)
3. [UI Hooks](#ui-hooks)
4. [Layout Hooks](#layout-hooks)
5. [Device Hooks](#device-hooks)
6. [Theme Hooks](#theme-hooks)
7. [Lifecycle Hooks](#lifecycle-hooks)
8. [Utility Hooks](#utility-hooks)
9. [Storage Hooks](#storage-hooks)
10. [Timing Hooks](#timing-hooks)

---

## Authentication Hooks

Located in `hooks/auth/`

### useAuthProvider

**Purpose**: Main authentication state management  
**Returns**: `{ user, loading, login, logout, register, updateProfile }`

```typescript
const { user, loading, login } = useAuthProvider();

if (loading) return <LoadingSpinner />;
if (!user) return <LoginScreen />;
```

### useEmailVerification

**Purpose**: Email verification flow management  
**Returns**: `{ sendVerification, resendVerification, isVerified, loading }`

```typescript
const { sendVerification, isVerified } = useEmailVerification();

if (!isVerified) {
  await sendVerification(user.email);
}
```

### usePhoneVerification

**Purpose**: Phone number verification with SMS  
**Returns**: `{ sendCode, verifyCode, loading, error }`

```typescript
const { sendCode, verifyCode } = usePhoneVerification();

await sendCode(phoneNumber);
await verifyCode(code);
```

### use2FAProvider

**Purpose**: Two-factor authentication management  
**Returns**: `{ is2FAEnabled, enable2FA, disable2FA, verify2FA }`

```typescript
const { enable2FA, verify2FA } = use2FAProvider();

const secret = await enable2FA();
await verify2FA(totpCode);
```

### useBiometric

**Purpose**: Biometric authentication (FaceID/TouchID/Fingerprint)  
**Returns**: `{ authenticate, isAvailable, biometricType }`

```typescript
const { authenticate, isAvailable } = useBiometric();

if (isAvailable) {
  const success = await authenticate();
}
```

### useSocialAuth

**Purpose**: Social authentication (Google, Apple)  
**Returns**: `{ signInWithGoogle, signInWithApple, loading }`

```typescript
const { signInWithGoogle } = useSocialAuth();

await signInWithGoogle();
```

### useRegistrationFlow

**Purpose**: Multi-step registration flow management  
**Returns**: `{ currentStep, nextStep, prevStep, completeStep, data }`

```typescript
const { currentStep, nextStep, data } = useRegistrationFlow();

await nextStep({ email, password });
```

---

## Async Hooks

Located in `hooks/async/`

### useAsync

**Purpose**: Generic async operation management  
**Returns**: `{ execute, loading, error, data }`

```typescript
const { execute, loading, data } = useAsync(fetchUserData);

useEffect(() => {
  execute(userId);
}, [userId]);
```

### useFetch

**Purpose**: HTTP fetch wrapper with caching  
**Returns**: `{ data, loading, error, refetch }`

```typescript
const { data, loading, refetch } = useFetch('/api/users');

<Button onPress={refetch} title="Refresh" />
```

### useInfiniteScroll

**Purpose**: Infinite scroll/pagination  
**Returns**: `{ data, loading, loadMore, hasMore }`

```typescript
const { data, loadMore, hasMore } = useInfiniteScroll(fetchPosts);

<FlatList
  data={data}
  onEndReached={hasMore ? loadMore : undefined}
/>
```

---

## UI Hooks

Located in `hooks/ui/`

### useClickOutside

**Purpose**: Detect taps outside component (RN)  
**Returns**: `RefObject<T>`

```typescript
const dropdownRef = useClickOutside<View>(() => {
  setIsOpen(false);
});

<View ref={dropdownRef}>
  <Dropdown visible={isOpen} />
</View>
```

### useLongPress

**Purpose**: Long press with haptic feedback  
**Returns**: `{ onPressIn, onPressOut }`

```typescript
const longPressHandlers = useLongPress({
  onLongPress: () => showContextMenu(item),
  hapticFeedback: 'medium',
});

<Pressable {...longPressHandlers}>
  <Text>Long press me</Text>
</Pressable>
```

### useKeyboard

**Purpose**: Keyboard state tracking (RN)  
**Returns**: `{ isVisible, height, duration, easing }`

```typescript
const { isVisible, height } = useKeyboard();

<View style={{ paddingBottom: isVisible ? height : 0 }}>
  <TextInput />
</View>
```

### useScrollToTop

**Purpose**: Scroll to top functionality  
**Returns**: `scrollToTop` function

```typescript
const scrollToTop = useScrollToTop(scrollViewRef);

<Button onPress={scrollToTop} title="Back to top" />
```

### usePullToRefresh

**Purpose**: Pull-to-refresh functionality  
**Returns**: `{ refreshing, onRefresh }`

```typescript
const { refreshing, onRefresh } = usePullToRefresh(fetchData);

<ScrollView refreshControl={
  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
} />
```

### useModal

**Purpose**: Modal state management  
**Returns**: `{ isVisible, open, close, toggle }`

```typescript
const { isVisible, open, close } = useModal();

<Button onPress={open} title="Open Modal" />
<Modal visible={isVisible} onClose={close} />
```

### useBottomSheet

**Purpose**: Bottom sheet management  
**Returns**: `{ isOpen, open, close, snapTo }`

```typescript
const { isOpen, open, snapTo } = useBottomSheet();

<Button onPress={() => open()} title="Open Sheet" />
```

### useSwipeGesture

**Purpose**: Swipe gesture detection  
**Returns**: `{ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }`

```typescript
const { onSwipeLeft, onSwipeRight } = useSwipeGesture();

<View onTouchEnd={onSwipeLeft}>
  <Card />
</View>
```

### useHapticFeedback

**Purpose**: Haptic feedback utilities  
**Returns**: `{ light, medium, heavy, success, warning, error }`

```typescript
const haptics = useHapticFeedback();

<Button onPress={() => {
  haptics.light();
  handlePress();
}} />
```

---

## Layout Hooks

Located in `hooks/layout/`

### useResponsive

**Purpose**: Responsive layout utilities  
**Returns**: `{ isPhone, isTablet, orientation, breakpoint, scale }`

```typescript
const { isPhone, isTablet, scale } = useResponsive();

<View style={{ padding: scale(16) }}>
  {isPhone ? <PhoneLayout /> : <TabletLayout />}
</View>
```

---

## Device Hooks

Located in `hooks/device/`

### useAppState

**Purpose**: App foreground/background tracking  
**Returns**: `AppStateStatus` ('active' | 'background' | 'inactive')

```typescript
const appState = useAppState({
  onForeground: () => refreshData(),
  onBackground: () => saveState(),
});

{appState === 'active' && <LiveData />}
```

### useBattery

**Purpose**: Battery level and charging state  
**Returns**: `{ level, charging, available }`

```typescript
const { level, charging, available } = useBattery();

{available && (
  <Text>Battery: {Math.round(level * 100)}%</Text>
)}
```

### useGeolocation

**Purpose**: Location tracking with permissions  
**Returns**: `{ location, loading, error, permission }`

```typescript
const { location, permission } = useGeolocation({
  watch: true,
  enableHighAccuracy: true,
});

{location && (
  <Text>{location.latitude}, {location.longitude}</Text>
)}
```

### useNetworkStatus

**Purpose**: Network connectivity monitoring  
**Returns**: `{ isConnected, type, isInternetReachable }`

```typescript
const { isConnected, type } = useNetworkStatus();

{!isConnected && <OfflineBanner />}
```

### useAccessibility

**Purpose**: Accessibility settings detection  
**Returns**: `{ screenReaderEnabled, reduceMotion, boldText }`

```typescript
const { screenReaderEnabled, reduceMotion } = useAccessibility();

{reduceMotion && <StaticView />}
{!reduceMotion && <AnimatedView />}
```

---

## Theme Hooks

Located in `hooks/theme/`

### useTheme

**Purpose**: Current theme access  
**Returns**: `{ theme, colors, isDark }`

```typescript
const { colors, isDark } = useTheme();

<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>
```

### useThemeProvider

**Purpose**: Theme management and switching  
**Returns**: `{ theme, setTheme, toggleTheme, systemTheme }`

```typescript
const { theme, setTheme, toggleTheme } = useThemeProvider();

<Button onPress={toggleTheme} title="Toggle Theme" />
<Button onPress={() => setTheme('dark')} title="Dark Mode" />
```

### useThemedStyles

**Purpose**: Theme-aware StyleSheet creation  
**Returns**: Themed styles object

```typescript
const styles = useThemedStyles((colors) => ({
  container: {
    backgroundColor: colors.background,
    borderColor: colors.border
  }
}));
```

### useSystemTheme

**Purpose**: System theme detection  
**Returns**: `'light' | 'dark'`

```typescript
const systemTheme = useSystemTheme();

// Auto-sync with system preferences
useEffect(() => {
  if (userPreference === "system") {
    setTheme(systemTheme);
  }
}, [systemTheme]);
```

### useColorScheme

**Purpose**: React Native color scheme hook wrapper  
**Returns**: `'light' | 'dark' | null`

```typescript
const colorScheme = useColorScheme();

const defaultTheme = colorScheme || "light";
```

---

## Lifecycle Hooks

Located in `hooks/lifecycle/`

### useDeepCallback

**Purpose**: Callback with deep dependency comparison  
**Returns**: Memoized callback

```typescript
const handleUpdate = useDeepCallback(
  (data) => {
    updateUser(data);
  },
  [complexObject]
);
```

### usePrevious

**Purpose**: Access previous value  
**Returns**: Previous value of any type

```typescript
const prevCount = usePrevious(count);

console.log(`Count changed from ${prevCount} to ${count}`);
```

### useUpdateEffect

**Purpose**: useEffect that skips first render  
**Returns**: void

```typescript
useUpdateEffect(() => {
  // Only runs on updates, not initial mount
  trackUserAction(action);
}, [action]);
```

### useIsMounted

**Purpose**: Check if component is mounted  
**Returns**: `() => boolean`

```typescript
const isMounted = useIsMounted();

const fetchData = async () => {
  const data = await api.fetch();
  if (isMounted()) {
    setData(data);
  }
};
```

### useBatchedState

**Purpose**: Batch multiple state updates  
**Returns**: `[state, batchUpdate]`

```typescript
const [state, batchUpdate] = useBatchedState({ a: 1, b: 2 });

batchUpdate({ a: 10, b: 20 }); // Single render
```

### useCallbackRef

**Purpose**: Stable callback ref  
**Returns**: Callback ref

```typescript
const handleClick = useCallbackRef((event) => {
  console.log(event);
});
```

---

## Utility Hooks

Located in `hooks/utility/`

### useToggle

**Purpose**: Boolean state toggle  
**Returns**: `[value, toggle, setValue]`

```typescript
const [isOpen, toggle, setIsOpen] = useToggle(false);

<Button onPress={toggle} title={isOpen ? "Close" : "Open"} />
<Button onPress={() => setIsOpen(true)} title="Force Open" />
```

### useCounter

**Purpose**: Counter with bounds  
**Returns**: `{ count, increment, decrement, set, reset, isMin, isMax }`

```typescript
const { count, increment, decrement, isMax } = useCounter({
  initial: 0,
  min: 0,
  max: 10,
});

<Button onPress={increment} disabled={isMax} title="+" />
<Text>{count}</Text>
<Button onPress={decrement} title="-" />
```

### useList

**Purpose**: Array manipulation utilities  
**Returns**: `{ list, push, pop, shift, unshift, removeAt, insertAt, ... }`

```typescript
const { list, push, removeAt, clear } = useList([1, 2, 3]);

<Button onPress={() => push(4)} title="Add" />
<Button onPress={() => removeAt(0)} title="Remove First" />
<Button onPress={clear} title="Clear All" />
```

### useMap

**Purpose**: Map data structure management  
**Returns**: `{ map, set, get, has, remove, clear, keys, values, entries, size }`

```typescript
const { map, set, get, remove, size } = useMap<string, User>();

<Button onPress={() => set('user1', userData)} title="Add User" />
<Text>Total: {size}</Text>
```

### useErrorHandler

**Purpose**: Error handling utilities  
**Returns**: `{ error, setError, clearError, handleError }`

```typescript
const { error, handleError } = useErrorHandler();

try {
  await riskyOperation();
} catch (err) {
  handleError(err);
}

{error && <ErrorBanner message={error.message} />}
```

### useNotificationCount

**Purpose**: Notification badge count  
**Returns**: `{ count, increment, decrement, reset }`

```typescript
const { count, increment } = useNotificationCount();

<Badge count={count} />
<Button onPress={increment} title="New Notification" />
```

### useOnboardingProvider

**Purpose**: Onboarding flow management  
**Returns**: `{ hasCompletedOnboarding, completeOnboarding, resetOnboarding }`

```typescript
const { hasCompletedOnboarding, completeOnboarding } = useOnboardingProvider();

if (!hasCompletedOnboarding) {
  return <OnboardingFlow onComplete={completeOnboarding} />;
}
```

### usePushNotifications

**Purpose**: Push notification registration  
**Returns**: `{ token, register, unregister, loading }`

```typescript
const { token, register } = usePushNotifications();

useEffect(() => {
  register();
}, []);
```

---

## Storage Hooks

Located in `hooks/storage/`

### useLocalStorage

**Purpose**: AsyncStorage wrapper with React state  
**Returns**: `[value, setValue, loading, error]`

```typescript
const [user, setUser, loading] = useLocalStorage<User>('user', null);

if (loading) return <LoadingSpinner />;

<Button onPress={() => setUser(userData)} title="Save User" />
```

### useSecureStorage

**Purpose**: SecureStore wrapper for encrypted storage  
**Returns**: `[value, setValue, loading, error]`

```typescript
const [token, setToken, loading] = useSecureStorage("auth_token", "");

await setToken(newToken); // Encrypted storage
```

### useAsyncStorage

**Purpose**: Enhanced AsyncStorage with caching and TTL  
**Returns**: `[value, setValue, loading, error, clear]`

```typescript
const [data, setData, loading, error, clear] = useAsyncStorage(
  'cached_data',
  null,
  { ttl: 3600000 } // 1 hour TTL
);

<Button onPress={clear} title="Clear Cache" />
```

---

## Timing Hooks

Located in `hooks/timing/`

### useDebouncedCallback

**Purpose**: Debounce callback execution  
**Returns**: Debounced callback

```typescript
const debouncedSearch = useDebouncedCallback((query) => {
  searchAPI(query);
}, 500);

<TextInput onChangeText={debouncedSearch} />
```

### useThrottledCallback

**Purpose**: Throttle callback execution  
**Returns**: Throttled callback

```typescript
const throttledScroll = useThrottledCallback((event) => {
  trackScroll(event);
}, 1000);

<ScrollView onScroll={throttledScroll} />
```

### useInterval

**Purpose**: Declarative setInterval  
**Returns**: `{ start, stop, restart, isRunning }`

```typescript
const { start, stop, isRunning } = useInterval(() => {
  refreshData();
}, 5000);

<Button onPress={isRunning ? stop : start} title={isRunning ? "Stop" : "Start"} />
```

### useTimeout

**Purpose**: Declarative setTimeout  
**Returns**: `{ start, cancel, reset, isPending, isComplete }`

```typescript
const { start, cancel, isPending } = useTimeout(() => {
  showMessage('Time is up!');
}, 3000);

<Button onPress={start} title="Start Timer" />
{isPending && <Button onPress={cancel} title="Cancel" />}
```

---

## Import Patterns

### Individual Hook Import

```typescript
import { useTheme } from "@/hooks/theme/use-theme";
import { useAsync } from "@/hooks/async/use-async";
```

### Category Import

```typescript
import { useTheme, useThemeProvider, useThemedStyles } from "@/hooks/theme";
import { useToggle, useCounter, useList, useMap } from "@/hooks/utility";
```

### Barrel Import (Backward Compatible)

```typescript
import { useTheme, useAsync, useToggle } from "@/hooks";
```

---

## TypeScript Types

All hooks are fully typed with TypeScript. Import types alongside hooks:

```typescript
import { useAsync } from "@/hooks/async";
import type { AsyncState } from "@/hooks/async";

import { useCounter } from "@/hooks/utility";
import type { UseCounterOptions, UseCounterReturn } from "@/hooks/utility";

import { useGeolocation } from "@/hooks/device";
import type { LocationCoordinates, GeolocationState, UseGeolocationOptions } from "@/hooks/device";
```

---

## Best Practices

### 1. Hook Naming Convention

- Hooks **must** start with `use` (React convention)
- Use descriptive names: `useTheme` not `useT`
- Category prefix for clarity: `useAuthProvider`, `useThemeProvider`

### 2. Dependency Management

```typescript
// ✅ Good - Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ Bad - Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // ESLint error
```

### 3. Cleanup Functions

```typescript
// ✅ Good - Always cleanup subscriptions
useEffect(() => {
  const subscription = eventEmitter.on("event", handler);
  return () => {
    subscription.remove();
  };
}, []);
```

### 4. Conditional Hook Execution

```typescript
// ❌ Bad - Hooks cannot be conditional
if (condition) {
  useEffect(() => {}, []); // Error!
}

// ✅ Good - Condition inside hook
useEffect(() => {
  if (condition) {
    // Do something
  }
}, [condition]);
```

### 5. Custom Hook Composition

```typescript
// ✅ Good - Compose hooks in custom hooks
function useUserData(userId: string) {
  const { data, loading } = useFetch(`/users/${userId}`);
  const [cached, setCached] = useLocalStorage(`user_${userId}`, null);

  useEffect(() => {
    if (data) {
      setCached(data);
    }
  }, [data]);

  return { data: data || cached, loading };
}
```

---

## Performance Tips

### 1. Memoization

```typescript
// Use useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for event handlers passed to children
const handlePress = useCallback(() => {
  doSomething(value);
}, [value]);
```

### 2. Avoid Over-fetching

```typescript
// ✅ Good - Conditional fetching
const { data } = useFetch("/api/data", {
  enabled: isAuthenticated
});

// ❌ Bad - Always fetching
const { data } = useFetch("/api/data");
```

### 3. Debounce/Throttle Heavy Operations

```typescript
// ✅ Good - Debounced search
const debouncedSearch = useDebouncedCallback(searchAPI, 500);

// ❌ Bad - Search on every keystroke
const handleChange = (text) => {
  searchAPI(text); // Too many requests!
};
```

---

## Troubleshooting

### Hook Rules Violation

**Error**: "Hooks can only be called inside the body of a function component"

**Solution**: Ensure hooks are called at the top level, not inside loops, conditions, or nested functions.

### Stale Closure

**Problem**: Hook callback uses old values

**Solution**: Include all dependencies in dependency array or use callback refs.

### Memory Leaks

**Problem**: Component updates after unmount

**Solution**: Always cleanup subscriptions and use mounted checks:

```typescript
const isMounted = useIsMounted();

const fetchData = async () => {
  const data = await api.fetch();
  if (isMounted()) {
    setData(data);
  }
};
```

### Infinite Loop

**Problem**: useEffect runs continuously

**Solution**: Check dependency array - avoid objects/arrays created inline:

```typescript
// ❌ Bad - Creates new object every render
useEffect(() => {
  fetchData({ id: userId });
}, [{ id: userId }]); // New object each time!

// ✅ Good - Primitive dependency
useEffect(() => {
  fetchData({ id: userId });
}, [userId]);
```

---

## Migration Guide

### From Class Components

**Before (Class Component)**:

```typescript
class MyComponent extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    // Fetch logic
  }

  render() {
    return <Text>{this.state.count}</Text>;
  }
}
```

**After (Functional Component with Hooks)**:

```typescript
function MyComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch logic
  };

  return <Text>{count}</Text>;
}
```

---

## Additional Resources

- **React Hooks Documentation**: https://react.dev/reference/react
- **React Native Hooks**: https://reactnative.dev/docs/hooks
- **Expo Hooks**: https://docs.expo.dev/versions/latest/sdk/overview/
- **Custom Hooks Guide**: https://react.dev/learn/reusing-logic-with-custom-hooks

---

_Last Updated: October 19, 2025_  
_Version: 1.0.0_  
_Maintained by: LoginX Team_
