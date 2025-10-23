# LoginX Hooks Architecture

## Overview

LoginX features a comprehensive custom hooks library with 70+ hooks organized into 13 categories. This document provides a complete architectural overview of the hooks system, explaining the design principles, organization strategy, and implementation patterns.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Hook Categories](#hook-categories)
- [Architecture Principles](#architecture-principles)
- [Hook Lifecycle](#hook-lifecycle)
- [Performance Considerations](#performance-considerations)
- [Testing Strategy](#testing-strategy)
- [Integration with LoginX](#integration-with-loginx)

## Design Philosophy

The LoginX hooks architecture follows these core principles:

### 1. **Single Responsibility Principle**

Each hook should do one thing and do it well. Complex functionality is composed from multiple focused hooks rather than creating monolithic hooks.

### 2. **Composability**

Hooks are designed to work together seamlessly. Higher-level hooks compose lower-level hooks to create powerful abstractions.

### 3. **Type Safety**

All hooks are written in TypeScript with explicit types for parameters, return values, and internal state.

### 4. **Performance First**

Hooks use proper memoization, optimize re-renders, and follow React's performance best practices.

### 5. **Developer Experience**

Clear naming conventions, comprehensive documentation, and intuitive APIs make hooks easy to discover and use.

## Hook Categories

The hooks library is organized into 13 categories based on functionality:

### 1. **Auth Hooks** (`hooks/auth/`)

Authentication and authorization related hooks.

- `useAuthProvider` - Main auth context provider
- `useAuth` - Access auth state and methods
- `useBiometricAuth` - Biometric authentication (Face ID, Touch ID, Fingerprint)
- `useTwoFactorAuth` - 2FA management
- `useSocialAuth` - Social authentication (Google, Apple)
- `useEmailAvailability` - Email availability checking
- `useRegistrationFlow` - Multi-step registration state management
- `useRegistrationState` - Registration form state

**Common Patterns:**

```typescript
// Auth state access
const { user, isAuthenticated, login, logout } = useAuth();

// Biometric authentication
const { authenticate, isAvailable, biometricType } = useBiometricAuth();
```

### 2. **Async Hooks** (`hooks/async/`)

Asynchronous operation management hooks.

- `useAsyncOperation` - Generic async operation handling
- `useAsyncErrorHandler` - Centralized async error handling
- `useAsyncRetry` - Retry logic for failed operations
- `useFetch` - Standardized API calls with loading/error states

**Common Patterns:**

```typescript
// Async operations with loading/error states
const { data, loading, error, execute } = useAsyncOperation(fetchData);

// Fetch with automatic retry
const { data, isLoading, refetch } = useFetch("/api/user", {
  retry: 3,
  retryDelay: 1000
});
```

### 3. **UI Hooks** (`hooks/ui/`)

User interface interaction hooks.

- `useHapticNavigation` - Navigation with haptic feedback
- `useHapticAction` - Button actions with haptic feedback
- `useAutoFocus` - Automatic input focus management
- `useDialog` - Dialog/modal management
- `useAlert` - Alert/notification management
- `useClickOutside` - Detect clicks outside elements
- `useLongPress` - Long press gesture detection
- `useKeyboard` - Keyboard visibility and height tracking

**Common Patterns:**

```typescript
// Haptic feedback on navigation
const navigateWithFeedback = useHapticNavigation();
navigateWithFeedback("/profile");

// Auto-focus first input
const { focusRef, focus } = useAutoFocus<TextInput>();
```

### 4. **Layout Hooks** (`hooks/layout/`)

Responsive design and layout hooks.

- `useResponsive` - Responsive design utilities
- `useBreakpoint` - Screen breakpoint detection
- `useOrientation` - Device orientation tracking
- `useDeviceCategory` - Device type detection (phone/tablet/desktop)
- `useResponsiveSpacing` - Dynamic spacing based on screen size
- `useMediaQuery` - Advanced responsive design queries

**Common Patterns:**

```typescript
// Responsive layout
const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

// Orientation-specific rendering
const { isPortrait, isLandscape } = useOrientation();
```

### 5. **Device Hooks** (`hooks/device/`)

Device API and hardware interaction hooks.

- `useAppState` - App state (active/background/inactive)
- `useBattery` - Battery status and level
- `useGeolocation` - Location tracking
- `useAccessibility` - Accessibility features (screen reader, font scaling)
- `useClipboard` - Clipboard operations
- `useShare` - Native share functionality

**Common Patterns:**

```typescript
// App state monitoring
const { appState, isActive, isBackground } = useAppState();

// Battery-aware features
const { level, isCharging, isLowPowerMode } = useBattery();
```

### 6. **Theme Hooks** (`hooks/theme/`)

Theming, styling, and internationalization hooks.

- `useThemeContext` - Theme provider context
- `useTheme` - Access current theme
- `useColorScheme` - System color scheme (light/dark)
- `useThemeColor` - Theme-aware color utilities
- `useLanguageProvider` - Language/i18n provider
- `useLanguage` - Access current language and translations
- `useLocalizedDate` - Date formatting with i18n

**Common Patterns:**

```typescript
// Theme access
const { theme, colors, isDark, toggleTheme } = useTheme();

// Internationalization
const { t, locale, changeLanguage } = useLanguage();
```

### 7. **Lifecycle Hooks** (`hooks/lifecycle/`)

React lifecycle optimization hooks.

- `useOptimizedCallback` - Memoized callbacks with deep comparison
- `useUpdateEffect` - Effect that skips initial mount
- `usePrevious` - Track previous value
- `useDeepCallback` - Callback with deep dependency comparison
- `useIsMounted` - Check if component is mounted
- `useBatchedState` - Batch multiple state updates
- `useCallbackRef` - Stable callback refs

**Common Patterns:**

```typescript
// Track previous value
const prevCount = usePrevious(count);

// Skip initial mount effect
useUpdateEffect(() => {
  fetchData();
}, [query]);
```

### 8. **Utility Hooks** (`hooks/utility/`)

General-purpose utility hooks.

- `useToggle` - Boolean toggle state
- `useCounter` - Counter state management
- `useList` - Array state management
- `useMap` - Object/Map state management
- `useForm` - Form validation and submission
- `useSearch` - Search with debouncing and filtering
- `useInfiniteScroll` - Pagination with infinite scroll
- `useErrorHandler` - Centralized error handling
- `useLoadingState` - Loading state management
- `usePushNotifications` - Push notification management
- `useNotificationCount` - Notification count tracking
- `useOnboardingProvider` - Onboarding flow management

**Common Patterns:**

```typescript
// Toggle state
const [isOpen, toggle, setIsOpen] = useToggle(false);

// List management
const [items, { push, remove, clear, update }] = useList<Item>([]);

// Form handling
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: "", password: "" },
  validate: validateLoginForm,
  onSubmit: handleLogin
});
```

### 9. **Storage Hooks** (`hooks/storage/`)

Data persistence hooks.

- `useAsyncStorage` - AsyncStorage wrapper with reactivity
- `useSecureStorage` - Secure storage for sensitive data
- `useLocalStorage` - Web localStorage (for web platform)

**Common Patterns:**

```typescript
// Persistent state
const [token, setToken] = useAsyncStorage("auth_token");

// Secure storage for sensitive data
const [credentials, setCredentials] = useSecureStorage("user_credentials");
```

### 10. **Timing Hooks** (`hooks/timing/`)

Time-based operation hooks.

- `useTimeout` - Declarative setTimeout wrapper
- `useInterval` - Declarative setInterval wrapper
- `useDebouncedCallback` - Debounced function execution
- `useThrottledCallback` - Throttled function execution

**Common Patterns:**

```typescript
// Delayed action
const { start, cancel } = useTimeout(() => {
  showToast("Welcome!");
}, 3000);

// Debounced search
const debouncedSearch = useDebouncedCallback((query) => {
  searchAPI(query);
}, 500);
```

### 11. **Network Hooks** (`hooks/network/`)

Network connectivity and status hooks.

- `useNetworkContext` - Network provider context
- `useNetwork` - Network status and connectivity
- `useNetworkStatus` - Network status monitoring

**Common Patterns:**

```typescript
// Network awareness
const { isConnected, isInternetReachable, connectionType } = useNetwork();

// Offline handling
if (!isConnected) {
  showOfflineMessage();
}
```

### 12. **Permissions Hooks** (`hooks/permissions/`)

System permissions management hooks.

- `usePermissions` - Request and check permissions
- `usePermissionsContext` - Permissions provider context

**Common Patterns:**

```typescript
// Permission checking
const { hasPermission, requestPermission } = usePermissions("camera");

if (!hasPermission) {
  await requestPermission();
}
```

### 13. **Settings Hooks** (`hooks/settings/`)

App settings and preferences hooks.

- `useSettingsContext` - Settings provider context
- `useSecuritySettings` - Security preferences management

**Common Patterns:**

```typescript
// Settings access
const { settings, updateSetting } = useSettings();

// Security settings
const { isBiometricEnabled, toggleBiometric } = useSecuritySettings();
```

## Architecture Principles

### Hook Composition Pattern

Complex hooks are built by composing simpler hooks:

```typescript
// Example: useAuth composes multiple lower-level hooks
export function useAuth() {
  const [user, setUser] = useAsyncStorage("user");
  const [loading, setLoading] = useToggle(true);
  const network = useNetwork();
  const { show: showError } = useAlert();

  // Implementation...

  return { user, loading, login, logout };
}
```

### Provider Pattern

Context-based hooks follow the provider pattern:

```typescript
// Provider component
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => ({
    user,
    setUser,
    // ... other values
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Consumer hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Custom Hook Pattern

Custom hooks follow a consistent pattern:

```typescript
export function useCustomHook(param: Type, options?: Options): ReturnType {
  // 1. State declarations
  const [state, setState] = useState<State>(initialState);

  // 2. Refs for stable references
  const savedCallback = useRef(callback);

  // 3. Derived values (memoized)
  const derived = useMemo(() => {
    return computeValue(state);
  }, [state]);

  // 4. Callbacks (memoized)
  const handleAction = useCallback(
    () => {
      // Implementation
    },
    [
      /* dependencies */
    ]
  );

  // 5. Effects
  useEffect(
    () => {
      // Side effects
      return () => {
        // Cleanup
      };
    },
    [
      /* dependencies */
    ]
  );

  // 6. Return values
  return {
    state,
    derived,
    handleAction
  };
}
```

## Hook Lifecycle

### Initialization Phase

1. Hook is called during component render
2. Initial state is set
3. Refs are created
4. Context is accessed (if applicable)

### Update Phase

1. Dependencies change
2. Memoized values are recalculated
3. Callbacks are recreated (if dependencies changed)
4. Effects run

### Cleanup Phase

1. Component unmounts or dependencies change
2. Effect cleanup functions run
3. Event listeners are removed
4. Timers are cleared
5. Subscriptions are cancelled

## Performance Considerations

### Memoization Strategy

1. **useMemo for expensive computations:**

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

2. **useCallback for stable function references:**

```typescript
const handleSubmit = useCallback(
  (data: FormData) => {
    submitForm(data);
  },
  [
    /* only include necessary dependencies */
  ]
);
```

3. **Refs for values that don't trigger re-renders:**

```typescript
const latestCallback = useRef(callback);
useEffect(() => {
  latestCallback.current = callback;
}, [callback]);
```

### Re-render Optimization

1. **Split context values to prevent unnecessary re-renders:**

```typescript
// Bad: Single context with all values
const value = { user, theme, settings, network };

// Good: Separate contexts
const authValue = useMemo(() => ({ user, login, logout }), [user]);
const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme]);
```

2. **Use React.memo for expensive child components:**

```typescript
const MemoizedComponent = React.memo(Component, (prev, next) => {
  return prev.data === next.data;
});
```

### Bundle Size Optimization

1. **Tree-shakable exports:**

```typescript
// hooks/index.ts
export { useAuth } from "./auth/use-auth-provider";
export { useTheme } from "./theme/use-theme-context";
// ... individual exports
```

2. **Lazy loading for heavy hooks:**

```typescript
const { useBiometricAuth } = await import("@/hooks/auth/use-biometric-auth");
```

## Testing Strategy

### Unit Testing

Each hook should have comprehensive unit tests:

```typescript
import { renderHook, act } from "@testing-library/react-native";
import { useToggle } from "@/hooks/utility/use-toggle";

describe("useToggle", () => {
  it("should toggle value", () => {
    const { result } = renderHook(() => useToggle(false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](); // toggle
    });

    expect(result.current[0]).toBe(true);
  });
});
```

### Integration Testing

Test hooks in context with other hooks:

```typescript
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <NetworkProvider>
      {children}
    </NetworkProvider>
  </AuthProvider>
);

it('should handle auth with network context', () => {
  const { result } = renderHook(() => {
    const auth = useAuth();
    const network = useNetwork();
    return { auth, network };
  }, { wrapper });

  // Test integration
});
```

## Integration with LoginX

### Provider Hierarchy

The app wraps components with providers in the correct order:

```typescript
// app/_layout.tsx
<AuthProvider>
  <NetworkProvider>
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <PermissionsProvider>
            {children}
          </PermissionsProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  </NetworkProvider>
</AuthProvider>
```

### Hook Discovery

Hooks are exported from category index files and the main index:

```typescript
// Import from category
import { useAuth } from "@/hooks/auth";

// Import from main index
import { useAuth, useTheme, useNetwork } from "@/hooks";
```

### Hook Dependencies

Some hooks depend on context providers being present:

```typescript
// ✅ Correct: Inside provider
<AuthProvider>
  <MyComponent /> {/* Can use useAuth */}
</AuthProvider>

// ❌ Wrong: Outside provider
<MyComponent /> {/* useAuth will throw error */}
```

## Best Practices

1. **Always provide TypeScript types for hook parameters and return values**
2. **Use meaningful names that clearly indicate what the hook does**
3. **Document complex hooks with JSDoc comments and examples**
4. **Test hooks thoroughly with unit and integration tests**
5. **Optimize performance with proper memoization**
6. **Follow React's rules of hooks (only call at top level)**
7. **Clean up side effects in effect cleanup functions**
8. **Provide sensible defaults for optional parameters**
9. **Throw descriptive errors when hooks are used incorrectly**
10. **Keep hooks focused and under 200 lines when possible**

## Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [LoginX Hooks Best Practices](/docs/HOOKS_BEST_PRACTICES.md)
- [LoginX Hooks Migration Guide](/docs/HOOKS_MIGRATION_GUIDE.md)
- [LoginX Hooks Reference](/docs/HOOKS_REFERENCE.md)
- [LoginX Implementation Status](/docs/IMPLEMENTATION_STATUS.md)

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Maintainer:** LoginX Development Team
