---
goal: "Organize existing custom hooks library with 100% backward compatibility, independence, and future package extraction"
version: 2.3
date_created: 2025-01-24
last_updated: 2025-10-18
owner: LoginX Development Team
status: "Planned"
tags: [feature, hooks, organization, refactor, backward-compatible, code-reduction, portable, standalone-package, expo, react-native, typescript]
---

# Enhanced Custom Hooks Library Organization Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)
![Backward Compatible](https://img.shields.io/badge/backward_compatible-100%25-green)
![Portable](https://img.shields.io/badge/portable-framework_agnostic-purple)
![Future Package](https://img.shields.io/badge/future-standalone_package-orange)

## Introduction

This implementation plan focuses on organizing existing hooks into logical folders and adding only essential missing hooks that complement what LoginX already has.

### 🎯 Primary Objectives (In Priority Order)

1. **🔒 Maintain 100% Backward Compatibility** - All existing imports must continue to work without ANY code changes anywhere in the application
2. **� Hook Independence & Portability** - Each hook must be self-contained, framework-agnostic (Expo-based), and easily testable in isolation
3. **♻️ Future Reusability** - Design hooks for extraction into a separate standalone package that can be used across multiple Expo projects
4. **�📉 Reduce Code Duplication** - Extract and consolidate duplicate logic across hooks (target: 20%+ reduction)
5. **📁 Improve Organization** - Organize hooks into logical categories for better maintainability and developer experience

### ⚠️ Critical Success Criteria

- ✅ **Zero breaking changes** - All existing imports like `@/hooks/use-auth-provider` must work exactly as before
- ✅ **Hook independence** - Each hook works standalone without project-specific dependencies
- ✅ **Easy testing** - Hooks can be tested in isolation without the entire LoginX project context
- ✅ **Portable design** - Hooks are ready for extraction into a separate reusable package for any Expo project
- ✅ **Code reduction achieved** - Measure and document LOC reduction through consolidation
- ✅ **No refactoring required** - Existing application code remains untouched
- ✅ **TypeScript compilation passes** - No type errors or missing exports

The goal is to improve the codebase structure without breaking any existing functionality or requiring extensive refactoring across the application.

### Current State Analysis

**Existing Hooks (31 hooks):**

- ✅ **Auth & Security**: use-auth-provider, use-biometric-auth, use-two-factor-auth, use-social-auth, use-security-settings, use-permissions
- ✅ **Registration**: use-registration-flow, use-registration-state, use-email-availability
- ✅ **Async & Loading**: use-async-operation, use-loading-state, use-async-error-handler
- ✅ **Performance**: use-optimized-callback (contains: useDeepCallback, useDebouncedCallback, useThrottledCallback, usePrevious, useUpdateEffect, useIsMounted, useBatchedState, useCallbackRef)
- ✅ **UI & Feedback**: use-dialog, use-alert, use-haptic-action, use-haptic-navigation, use-form-submit, use-auto-focus
- ✅ **Theme & i18n**: use-theme-context, use-theme-color, use-theme-colors, use-color-scheme, use-language, use-language-provider
- ✅ **Layout**: use-responsive (contains: useResponsive, useResponsiveSpacing, useDeviceCategory, useOrientation, useBreakpoint)
- ✅ **Network**: use-network-status, use-is-online
- ✅ **Accessibility**: use-accessibility
- ✅ **Notifications**: use-push-notifications, use-notification-count
- ✅ **Onboarding**: use-onboarding-provider

### Research Sources

- **usehooks-ts** (7.5k stars): TypeScript-first, tree-shakable, minimal hooks
- **react-use** (43.7k stars): Comprehensive collection with 100+ hooks
- **ahooks** (14.7k stars): High-quality hooks from Alibaba, production-tested
- **@uidotdev/usehooks**: Modern, server-safe React hooks

## 1. Requirements & Constraints

### Project Requirements

- **REQ-001**: **100% Backward Compatibility** - All existing imports (`@/hooks/use-*`) must continue to work without changes
- **REQ-002**: **Code Reduction Priority** - Identify and eliminate duplicate logic across hooks
- **REQ-003**: **Zero Breaking Changes** - No modifications to existing hook APIs or behavior
- **REQ-004**: **Hook Independence** - Each hook must be self-contained with no hard dependencies on LoginX-specific code
- **REQ-005**: **Framework Agnostic** - Hooks should work in any Expo-based React Native project, not just LoginX
- **REQ-006**: **Testability** - Hooks must be easily testable in isolation without requiring full project setup
- **REQ-007**: **Future Package Extraction** - Design hooks for eventual extraction into a standalone npm package
- **REQ-008**: All hooks must be TypeScript-first with explicit type definitions
- **REQ-009**: Hooks must support React Native and Expo environment
- **REQ-010**: Hooks should follow React Hooks rules and best practices
- **REQ-011**: Must integrate seamlessly with existing LoginX architecture (via adapters if needed)
- **REQ-012**: Hooks must be tree-shakable and performant (minimal bundle impact)
- **REQ-013**: Must support both light and dark themes (via configuration, not hard-coded)
- **REQ-014**: Hooks should handle offline-first scenarios where applicable
- **REQ-015**: Must follow accessibility guidelines
- **REQ-016**: **Zero Project-Specific Imports** - Avoid direct imports from `@/utils`, `@/constants`, etc. Use dependency injection or parameters instead

### Technical Constraints

- **CON-001**: **Backward Compatibility Lock** - All existing hook imports must work exactly as before
- **CON-002**: **Code Reduction Target** - Remove at least 20% duplicate code through consolidation
- **CON-003**: **Zero Breaking Changes** - No API modifications, signature changes, or behavior differences
- **CON-004**: **Hook Isolation** - No direct dependencies on LoginX-specific code; use adapters/configs for project integration
- **CON-005**: **Standalone Testing** - Each hook must be testable without requiring LoginX project context
- **CON-006**: Must work with React Native (no DOM-specific APIs unless polyfilled)
- **CON-007**: Must be compatible with Expo Router and navigation patterns (but not hard-coupled)
- **CON-008**: Maximum bundle size per hook: 5KB (gzipped) for portability
- **CON-009**: Hooks should accept configuration objects instead of importing from project-specific constants
- **CON-010**: External dependencies (Firebase, etc.) should be optional peer dependencies, not hard requirements

### Security Requirements

- **SEC-001**: Storage hooks must use secure storage for sensitive data
- **SEC-002**: Network hooks must validate and sanitize all inputs
- **SEC-003**: Authentication hooks must integrate with existing auth flow
- **SEC-004**: No sensitive data should be logged or exposed

### Development Guidelines

- **GUD-001**: Follow project's rule.instructions.md guidelines
- **GUD-002**: Implement proper error boundaries and error handling
- **GUD-003**: Include comprehensive JSDoc documentation
- **GUD-004**: Provide usage examples in examples directory
- **GUD-005**: Use existing constants from `constants/` directory

### Architectural Patterns

- **PAT-001**: Hooks should be pure and composable
- **PAT-002**: Side effects should be clearly isolated
- **PAT-003**: Use custom hooks to extract complex logic from components
- **PAT-004**: Implement proper cleanup in useEffect hooks
- **PAT-005**: Memoize expensive computations and callbacks

## 2. Hook Independence & Portability Strategy

### Core Principle: Framework-Agnostic, Self-Contained Hooks

Each hook must be designed to work independently in any Expo-based React Native project. This enables future extraction into a standalone package and makes hooks easily testable in isolation.

### Independence Guidelines

#### ❌ **Avoid (Project-Coupled)**

```typescript
// BAD: Hard-coded project imports
import { Colors } from "@/constants/theme";
import { sanitizeInput } from "@/utils/sanitize";
import { auth } from "@/firebase-config";

export function useAuth() {
  const colors = Colors.light; // Hard-coupled to project
  // ...
}
```

#### ✅ **Prefer (Portable Design)**

```typescript
// GOOD: Configuration via parameters or context
interface UseAuthConfig {
  firebaseAuth: Auth; // Injected dependency
  colors?: Record<string, string>; // Optional config
  sanitizer?: (input: string) => string; // Optional utility
}

export function useAuth(config: UseAuthConfig) {
  const { firebaseAuth, colors, sanitizer } = config;
  // Hook is now portable and testable
}
```

### Dependency Injection Pattern

For LoginX integration, create adapter files that inject project-specific dependencies:

```typescript
// hooks/adapters/use-auth-loginx.ts (LoginX-specific adapter)
import { auth } from "@/firebase-config";
import { Colors } from "@/constants/theme";
import { sanitizeInput } from "@/utils/sanitize";
import { useAuth as useAuthCore } from "@/hooks/auth/use-auth-provider";

export function useAuth() {
  return useAuthCore({
    firebaseAuth: auth,
    colors: Colors,
    sanitizer: sanitizeInput
  });
}
```

This allows:

1. **Core hook** (`use-auth-provider`) remains portable
2. **Adapter** (`use-auth-loginx`) handles LoginX integration
3. **Easy testing** of core hook with mock configs
4. **Future extraction** to separate package

### Testability Requirements

Every hook must be testable in isolation:

```typescript
// ✅ Easy to test - no project dependencies
describe("useToggle", () => {
  it("should toggle boolean value", () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current[0]).toBe(false);

    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
  });
});
```

### Package Extraction Readiness

Design hooks for future extraction into standalone package:

**Future Package Structure:**

```
@loginx/expo-hooks/
├── package.json
├── README.md
├── src/
│   ├── auth/
│   ├── async/
│   ├── ui/
│   ├── storage/
│   └── index.ts
└── examples/ (usage in different Expo projects)
```

**Package Characteristics:**

- Zero hard dependencies on external projects
- Peer dependencies for Expo modules (expo-haptics, expo-secure-store, etc.)
- Well-documented with usage examples
- TypeScript-first with complete type definitions
- Tree-shakable exports

## 3. Backward Compatibility Strategy

### Core Principle: Zero Breaking Changes

All existing imports must continue to work exactly as before. The main `hooks/index.ts` file will act as a compatibility layer by re-exporting all hooks from their new locations.

**Before (Current):**

```typescript
import { useAuth } from "@/hooks/use-auth-provider";
import { useTheme } from "@/hooks/use-theme-context";
import { useAsync } from "@/hooks/use-async-operation";
```

**After (Still Works):**

```typescript
// Old imports continue to work via main index.ts
import { useAuth } from "@/hooks/use-auth-provider";
import { useTheme } from "@/hooks/use-theme-context";
import { useAsync } from "@/hooks/use-async-operation";

// NEW: Category-based imports also available (optional)
import { useAuth } from "@/hooks/auth";
import { useTheme } from "@/hooks/theme";
import { useAsync } from "@/hooks/async";
```

### Main Index.ts Structure

```typescript
// hooks/index.ts - Compatibility layer
// Re-export everything for backward compatibility

// Auth hooks (maintain old paths)
export * from "./auth/use-auth-provider";
export * from "./auth/use-biometric-auth";
// ... all auth hooks

// Async hooks
export * from "./async/use-async-operation";
export * from "./async/use-loading-state";
// ... all async hooks

// Continue for all categories...
```

This ensures **100% backward compatibility** - no code changes required anywhere in the application.

## 3. Code Reduction Strategy

### Identified Duplicate Patterns

1. **Error Handling**: Similar try-catch patterns across async hooks
2. **Loading States**: Repetitive loading/error/success state management
3. **Haptic Feedback**: Duplicate haptic trigger code across UI hooks
4. **Type Guards**: Similar TypeScript type narrowing logic
5. **Cleanup Logic**: Repeated useEffect cleanup patterns

### Consolidation Approach

Extract shared utilities to `hooks/utils/` (internal, not exported):

- `hooks/utils/error-handler.ts` - Centralized error handling
- `hooks/utils/async-state.ts` - Reusable async state management
- `hooks/utils/haptic-helpers.ts` - Shared haptic utilities

**Expected Reduction**: 15-25% code reduction through eliminating duplicates.

## 4. Implementation Steps

### Implementation Phase 1: Folder Structure & Backward Compatible Migration

**GOAL-001**: Reorganize existing hooks into logical folders while maintaining 100% backward compatibility

| Task     | Description                                                                                          | Completed | Date       |
| -------- | ---------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Create folder structure: `hooks/{auth,async,ui,layout,device,theme,form,lifecycle,utility,adapters}` | ✅        | 2025-10-19 |
| TASK-002 | Move auth hooks to `hooks/auth/` (9 files including registration)                                    | ✅        | 2025-10-19 |
| TASK-003 | Move async hooks to `hooks/async/` (3 files)                                                         | ✅        | 2025-10-19 |
| TASK-004 | Move UI hooks to `hooks/ui/` (6 files)                                                               | ✅        | 2025-10-19 |
| TASK-005 | Move layout hooks to `hooks/layout/` (1 file with multiple exports)                                  | ✅        | 2025-10-19 |
| TASK-006 | Move device hooks to `hooks/device/` (2 files)                                                       | ✅        | 2025-10-19 |
| TASK-007 | Move theme hooks to `hooks/theme/` (6 files)                                                         | ✅        | 2025-10-19 |
| TASK-008 | Move lifecycle/performance hooks to `hooks/lifecycle/` (1 file)                                      | ✅        | 2025-10-19 |
| TASK-009 | Move utility hooks to `hooks/utility/` (remaining 4 files)                                           | ✅        | 2025-10-19 |
| TASK-010 | Create category index files with named exports (e.g., `hooks/auth/index.ts`)                         | ✅        | 2025-10-19 |
| TASK-011 | **NEW**: Create `hooks/adapters/` folder for LoginX-specific integrations                            | ✅        | 2025-10-19 |
| TASK-012 | **CRITICAL**: Update main `hooks/index.ts` to re-export ALL hooks maintaining old paths              | ✅        | 2025-10-19 |
| TASK-013 | Verify all existing imports `@/hooks/use-*` continue working without changes                         | ✅        | 2025-10-19 |

### Implementation Phase 2: Essential Missing State Hooks (Minimal Set)

**GOAL-002**: Add only critical missing state management hooks

| Task     | Description                                                                    | Completed | Date       |
| -------- | ------------------------------------------------------------------------------ | --------- | ---------- |
| TASK-013 | Implement `useToggle` in `hooks/utility/use-toggle.ts` - boolean toggle        | ✅        | 2025-10-19 |
| TASK-014 | Implement `useCounter` in `hooks/utility/use-counter.ts` - counter with bounds | ✅        | 2025-10-19 |
| TASK-015 | Implement `useList` in `hooks/utility/use-list.ts` - array helpers             | ✅        | 2025-10-19 |
| TASK-016 | Implement `useMap` in `hooks/utility/use-map.ts` - Map operations              | ✅        | 2025-10-19 |
| TASK-017 | Add exports to `hooks/utility/index.ts`                                        | ✅        | 2025-10-19 |

### Implementation Phase 3: Storage Hooks

**GOAL-003**: Add storage hooks for persistence

| Task     | Description                                                                       | Completed | Date       |
| -------- | --------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-018 | Implement `useLocalStorage` in `hooks/storage/use-local-storage.ts`               | ✅        | 2025-10-19 |
| TASK-019 | Implement `useSecureStorage` in `hooks/storage/use-secure-storage.ts`             | ✅        | 2025-10-19 |
| TASK-020 | Implement `useAsyncStorage` in `hooks/storage/use-async-storage.ts` (RN-specific) | ✅        | 2025-10-19 |
| TASK-021 | Create `hooks/storage/index.ts` with exports                                      | ✅        | 2025-10-19 |

### Implementation Phase 4: Timing & Scheduling Hooks

**GOAL-004**: Add timing utilities (most are already in use-optimized-callback)

| Task     | Description                                                                | Completed | Date       |
| -------- | -------------------------------------------------------------------------- | --------- | ---------- |
| TASK-022 | Extract `useDebouncedCallback` to `hooks/timing/use-debounced-callback.ts` | ✅        | 2025-10-19 |
| TASK-023 | Extract `useThrottledCallback` to `hooks/timing/use-throttled-callback.ts` | ✅        | 2025-10-19 |
| TASK-024 | Implement `useInterval` in `hooks/timing/use-interval.ts`                  | ✅        | 2025-10-19 |
| TASK-025 | Implement `useTimeout` in `hooks/timing/use-timeout.ts`                    | ✅        | 2025-10-19 |
| TASK-026 | Create `hooks/timing/index.ts` with exports                                | ✅        | 2025-10-19 |

### Implementation Phase 5: Enhanced UI Hooks

**GOAL-005**: Add missing UI interaction hooks

| Task     | Description                                                                 | Completed | Date |
| -------- | --------------------------------------------------------------------------- | --------- | ---- |
| TASK-027 | Implement `useClickOutside` in `hooks/ui/use-click-outside.ts` (RN gesture) |           |      |
| TASK-028 | Implement `useLongPress` in `hooks/ui/use-long-press.ts` (enhance existing) |           |      |
| TASK-029 | Implement `useKeyboard` in `hooks/ui/use-keyboard.ts` (RN keyboard events)  |           |      |
| TASK-030 | Update `hooks/ui/index.ts` with new exports                                 |           |      |

### Implementation Phase 6: Device & Lifecycle Hooks

**GOAL-006**: Add device-specific hooks

| Task     | Description                                                                               | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-031 | Implement `useAppState` in `hooks/device/use-app-state.ts` (foreground/background)        |           |      |
| TASK-032 | Implement `useBattery` in `hooks/device/use-battery.ts` (optional, expo-battery)          |           |      |
| TASK-033 | Implement `useGeolocation` in `hooks/device/use-geolocation.ts` (optional, expo-location) |           |      |
| TASK-034 | Extract lifecycle hooks from `use-optimized-callback` to `hooks/lifecycle/`               |           |      |
| TASK-035 | Update category index files                                                               |           |      |

### Implementation Phase 7: Documentation

**GOAL-007**: Document the new structure

| Task     | Description                                                 | Completed | Date |
| -------- | ----------------------------------------------------------- | --------- | ---- |
| TASK-036 | Create `docs/HOOKS_REFERENCE.md` with categorized hook list |           |      |
| TASK-037 | Add JSDoc to all hook files with usage examples             |           |      |
| TASK-038 | Update `docs/CONSTANTS_REFERENCE.md` with hooks section     |           |      |
| TASK-039 | Create migration guide if any breaking changes              |           |      |

### Implementation Phase 8: Hook Independence & Code Reduction

**GOAL-008**: Ensure hook independence, reduce code duplication, and prepare for package extraction

| Task     | Description                                                                    | Completed | Date |
| -------- | ------------------------------------------------------------------------------ | --------- | ---- |
| TASK-040 | **Audit hook dependencies** - Identify project-specific imports in each hook   |           |      |
| TASK-041 | **Remove hard-coded dependencies** - Replace with configuration parameters     |           |      |
| TASK-042 | **Create adapter files** - Build LoginX-specific adapters in `hooks/adapters/` |           |      |
| TASK-043 | **Audit duplicate logic** - Identify common patterns across hooks              |           |      |
| TASK-044 | **Extract shared utilities** - Create internal helper functions                |           |      |
| TASK-045 | **Consolidate error handling** - Use consistent error patterns                 |           |      |
| TASK-046 | **Measure code reduction** - Calculate LOC saved vs original                   |           |      |
| TASK-047 | **Test hook isolation** - Verify each hook works without project context       |           |      |
| TASK-048 | Run bundle size analysis per hook (target: <5KB each)                          |           |      |
| TASK-049 | Create standalone test examples for each hook                                  |           |      |
| TASK-050 | Document how to use hooks in other Expo projects                               |           |      |
| TASK-051 | Verify backward compatibility one final time                                   |           |      |

## 5. Future Package Extraction Vision

### Standalone Package: `@loginx/expo-hooks`

Once hooks are fully independent, they will be extracted into a standalone npm package that can be used across any Expo-based React Native project.

### Package Goals

- **🎯 Universal Expo Compatibility** - Works in any Expo project without modifications
- **📦 Zero Configuration** - Sensible defaults, optional configuration
- **🔌 Plug & Play** - Install and use immediately
- **📚 Well Documented** - Comprehensive docs with usage examples
- **🧪 Fully Tested** - Each hook has unit tests and examples
- **🌳 Tree-Shakable** - Import only what you need

### Example Usage in Different Projects

**Project A (E-commerce App):**

```typescript
import { useToggle, useCounter, useAsyncStorage } from "@loginx/expo-hooks";

function CartScreen() {
  const [isOpen, toggleCart] = useToggle(false);
  const [quantity, { increment, decrement }] = useCounter(1, { min: 1, max: 99 });
  const [cart, setCart] = useAsyncStorage("cart", []);

  // Works perfectly in any Expo app!
}
```

**Project B (Social Media App):**

```typescript
import { useDebounce, useKeyboard, useAppState } from "@loginx/expo-hooks";

function SearchScreen() {
  const debouncedSearch = useDebounce(searchQuery, 500);
  const { keyboardHeight } = useKeyboard();
  const appState = useAppState(); // 'active' | 'background'

  // Hooks are portable and reusable!
}
```

### Package Structure

```
@loginx/expo-hooks/
├── package.json
├── README.md
├── LICENSE
├── tsconfig.json
├── .npmignore
├── src/
│   ├── auth/           # Authentication hooks
│   ├── async/          # Async operation hooks
│   ├── ui/             # UI interaction hooks
│   ├── storage/        # Storage & persistence hooks
│   ├── timing/         # Timing & scheduling hooks
│   ├── device/         # Device API hooks
│   ├── lifecycle/      # Component lifecycle hooks
│   ├── utility/        # Utility state hooks
│   └── index.ts        # Main exports
├── dist/               # Compiled output
├── examples/
│   ├── basic-usage/
│   ├── with-typescript/
│   └── with-expo-router/
└── docs/
    ├── API.md
    ├── MIGRATION.md
    └── EXAMPLES.md
```

### package.json Structure

```json
{
  "name": "@loginx/expo-hooks",
  "version": "1.0.0",
  "description": "Production-ready React hooks for Expo projects",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": "github:loginx/expo-hooks",
  "keywords": ["expo", "react-native", "hooks", "react-hooks", "expo-hooks"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-native": ">=0.70.0",
    "expo": ">=49.0.0"
  },
  "peerDependenciesMeta": {
    "expo-haptics": { "optional": true },
    "expo-secure-store": { "optional": true },
    "@react-native-async-storage/async-storage": { "optional": true },
    "firebase": { "optional": true }
  }
}
```

### Installation & Usage

```bash
# Install core package
npm install @loginx/expo-hooks

# Install optional peer dependencies as needed
npx expo install expo-haptics expo-secure-store @react-native-async-storage/async-storage
```

### Migration Path for LoginX

1. **Phase 1**: Refactor hooks to be independent (current plan)
2. **Phase 2**: Test hooks in isolation
3. **Phase 3**: Create adapters for LoginX-specific integrations
4. **Phase 4**: Extract hooks to separate package
5. **Phase 5**: Publish to npm
6. **Phase 6**: Update LoginX to consume from package

This ensures LoginX continues working while hooks become universally reusable.

## 6. Alternatives

### Alternative Approaches Considered

- **ALT-001**: **Keep current flat structure (no folders)**
  - **Pros**: No breaking changes, simpler initially
  - **Cons**: Hard to navigate with 31+ hooks, poor developer experience
  - **Rejected**: Organization is essential for maintainability as project grows

- **ALT-002**: **Create all hooks from research libraries**
  - **Pros**: Comprehensive feature set, covers all use cases
  - **Cons**: 80+ hooks is overkill, increases bundle size, maintenance burden
  - **Rejected**: LoginX already has most essential hooks, only add what's missing

- **ALT-003**: **Don't extract hooks from use-optimized-callback**
  - **Pros**: Keeps code together, less files
  - **Cons**: Single file gets too large, harder to tree-shake
  - **Decision**: Extract to separate files for better organization and imports

- **ALT-004**: **Use third-party hook libraries directly**
  - **Pros**: Battle-tested, community supported
  - **Cons**: Web-focused, DOM dependencies, React Native incompatibilities
  - **Rejected**: Most libraries don't support React Native properly

- **ALT-005**: **Adopt TanStack Query for all async state**
  - **Pros**: Industry standard, powerful caching, excellent DX
  - **Cons**: Learning curve, heavyweight for simple use cases
  - **Decision**: Keep existing async hooks, consider TanStack Query for future complex data fetching needs

## 7. Dependencies

### External Dependencies (Existing)

- **DEP-001**: `@react-native-async-storage/async-storage` - ✅ Already installed, used for storage hooks
- **DEP-002**: `expo-secure-store` - ✅ Already installed, used for secure storage
- **DEP-003**: `react-native-reanimated` - ✅ Already installed, used for animations
- **DEP-004**: `expo-haptics` - ✅ Already installed, used for haptic feedback

### Optional External Dependencies (New)

- **DEP-005**: `expo-battery` - ⚠️ Optional, for `use-battery` hook
- **DEP-006**: `expo-location` - ⚠️ Optional, for `use-geolocation` hook
- **DEP-007**: `@react-native-clipboard/clipboard` - ⚠️ Optional, for clipboard operations

### Internal Dependencies

- **DEP-008**: Existing `utils/cache.ts` - Used by storage hooks
- **DEP-009**: Existing `utils/error.ts` - Error handling in async hooks
- **DEP-010**: Theme system from `constants/theme.ts` - Theme hooks
- **DEP-011**: Firebase integration from `firebase-config.ts` - Auth hooks
- **DEP-012**: Type definitions from `types/` directory - All hooks
- **DEP-013**: Existing hooks - Building blocks for new hooks

## 8. Files

### New Folder Structure

```
hooks/
├── auth/                  # Authentication & Security (7 hooks)
│   ├── use-auth-provider.tsx
│   ├── use-biometric-auth.tsx
│   ├── use-two-factor-auth.tsx
│   ├── use-social-auth.tsx
│   ├── use-security-settings.tsx
│   ├── use-permissions.tsx
│   ├── use-registration-flow.ts
│   ├── use-registration-state.ts
│   ├── use-email-availability.tsx
│   └── index.ts (exports all)
│
├── async/                 # Async Operations (3 existing + enhancements)
│   ├── use-async-operation.tsx
│   ├── use-loading-state.tsx
│   ├── use-async-error-handler.ts
│   └── index.ts
│
├── ui/                    # UI & Interactions (5 existing + 3 new)
│   ├── use-dialog.tsx
│   ├── use-alert.tsx
│   ├── use-haptic-action.tsx
│   ├── use-haptic-navigation.tsx
│   ├── use-auto-focus.tsx
│   ├── use-form-submit.tsx
│   ├── use-click-outside.ts (NEW)
│   ├── use-long-press.ts (NEW - enhance haptic)
│   ├── use-keyboard.ts (NEW - RN keyboard)
│   └── index.ts
│
├── layout/                # Responsive & Layout (1 file with multiple exports)
│   ├── use-responsive.tsx (contains 5 hooks)
│   └── index.ts
│
├── device/                # Device APIs (2 existing + 3 new)
│   ├── use-network-status.tsx
│   ├── use-accessibility.tsx
│   ├── use-app-state.ts (NEW)
│   ├── use-battery.ts (NEW - optional)
│   ├── use-geolocation.ts (NEW - optional)
│   └── index.ts
│
├── theme/                 # Theme & i18n (6 hooks)
│   ├── use-theme-context.tsx
│   ├── use-theme-color.ts
│   ├── use-theme-colors.ts
│   ├── use-color-scheme.ts
│   ├── use-language.tsx
│   ├── use-language-provider.tsx
│   └── index.ts
│
├── storage/               # Storage & Persistence (3 NEW)
│   ├── use-local-storage.ts (NEW)
│   ├── use-secure-storage.ts (NEW)
│   ├── use-async-storage.ts (NEW)
│   └── index.ts
│
├── timing/                # Timing & Scheduling (4 NEW - extract from optimized-callback)
│   ├── use-debounced-callback.ts
│   ├── use-throttled-callback.ts
│   ├── use-interval.ts (NEW)
│   ├── use-timeout.ts (NEW)
│   └── index.ts
│
├── lifecycle/             # Lifecycle & Performance (extract from optimized-callback)
│   ├── use-deep-callback.ts
│   ├── use-previous.ts
│   ├── use-update-effect.ts
│   ├── use-is-mounted.ts
│   ├── use-batched-state.ts
│   ├── use-callback-ref.ts
│   └── index.ts
│
├── utility/               # Utility Hooks (4 NEW + remaining)
│   ├── use-onboarding-provider.tsx
│   ├── use-push-notifications.tsx
│   ├── use-notification-count.tsx
│   ├── use-toggle.ts (NEW)
│   ├── use-counter.ts (NEW)
│   ├── use-list.ts (NEW)
│   ├── use-map.ts (NEW)
│   └── index.ts
│
└── index.ts               # Main export file (re-exports from all categories)
```

### New Files to Create (Only Essential)

**Storage Hooks (3 files):**

- **FILE-001**: `hooks/storage/use-local-storage.ts` - AsyncStorage wrapper
- **FILE-002**: `hooks/storage/use-secure-storage.ts` - SecureStore wrapper
- **FILE-003**: `hooks/storage/use-async-storage.ts` - Enhanced AsyncStorage with cache
- **FILE-004**: `hooks/storage/index.ts` - Export all storage hooks

**Utility State Hooks (4 files):**

- **FILE-005**: `hooks/utility/use-toggle.ts` - Boolean toggle
- **FILE-006**: `hooks/utility/use-counter.ts` - Counter with bounds
- **FILE-007**: `hooks/utility/use-list.ts` - Array helpers
- **FILE-008**: `hooks/utility/use-map.ts` - Map operations

**Timing Hooks (2 files - new):**

- **FILE-009**: `hooks/timing/use-interval.ts` - setInterval wrapper
- **FILE-010**: `hooks/timing/use-timeout.ts` - setTimeout wrapper

**UI Hooks (3 files):**

- **FILE-011**: `hooks/ui/use-click-outside.ts` - Click outside detection (RN)
- **FILE-012**: `hooks/ui/use-long-press.ts` - Enhanced long press
- **FILE-013**: `hooks/ui/use-keyboard.ts` - RN keyboard events

**Device Hooks (3 files):**

- **FILE-014**: `hooks/device/use-app-state.ts` - App state tracking
- **FILE-015**: `hooks/device/use-battery.ts` - Battery status (optional)
- **FILE-016**: `hooks/device/use-geolocation.ts` - Location tracking (optional)

**Category Index Files (10 files):**

- **FILE-017**: `hooks/auth/index.ts`
- **FILE-018**: `hooks/async/index.ts`
- **FILE-019**: `hooks/ui/index.ts`
- **FILE-020**: `hooks/layout/index.ts`
- **FILE-021**: `hooks/device/index.ts`
- **FILE-022**: `hooks/theme/index.ts`
- **FILE-023**: `hooks/storage/index.ts`
- **FILE-024**: `hooks/timing/index.ts`
- **FILE-025**: `hooks/lifecycle/index.ts`
- **FILE-026**: `hooks/utility/index.ts`

**Documentation Files (2 files):**

- **FILE-027**: `docs/HOOKS_REFERENCE.md` - Complete categorized hook reference
- **FILE-028**: `docs/HOOKS_MIGRATION.md` - Import path migration guide (if needed)

### Files to Move/Refactor

**Extract from use-optimized-callback.tsx to separate files:**

- `useDeepCallback` → `hooks/lifecycle/use-deep-callback.ts`
- `useDebouncedCallback` → `hooks/timing/use-debounced-callback.ts`
- `useThrottledCallback` → `hooks/timing/use-throttled-callback.ts`
- `usePrevious` → `hooks/lifecycle/use-previous.ts`
- `useUpdateEffect` → `hooks/lifecycle/use-update-effect.ts`
- `useIsMounted` → `hooks/lifecycle/use-is-mounted.ts`
- `useBatchedState` → `hooks/lifecycle/use-batched-state.ts`
- `useCallbackRef` → `hooks/lifecycle/use-callback-ref.ts`

### Files to Modify

- **FILE-030**: `hooks/index.ts` - Update to re-export from category folders
- **FILE-031**: `docs/CONSTANTS_REFERENCE.md` - Add hooks section
- **FILE-032**: `package.json` - Add optional dependencies (expo-battery, expo-location)
- **FILE-033**: `README.md` - Update with hooks organization info

## 9. Risks & Assumptions

### Risks

- **RISK-001**: **Breaking existing imports during reorganization**
  - **Mitigation**: Maintain ALL old import paths via barrel exports in main `hooks/index.ts`, verify with TypeScript compilation
  - **Impact**: CRITICAL - would break entire application
  - **Probability**: Very Low (with proper re-export strategy)
  - **Detection**: TypeScript errors will catch any missing exports immediately

- **RISK-002**: **Insufficient code reduction achieved**
  - **Mitigation**: Thorough audit of duplicate patterns, extract shared utilities early, measure LOC before/after
  - **Impact**: Low - goal not met but no harm done
  - **Probability**: Low (clear duplicates identified in use-optimized-callback)

- **RISK-003**: **Bundle size increase from new hooks**
  - **Mitigation**: Only add 15-16 essential hooks (not 80+), tree-shaking enabled, monitor bundle size
  - **Impact**: Medium - acceptable if under 30KB
  - **Probability**: Low (minimal additions)

- **RISK-004**: **React Native incompatibility with device hooks**
  - **Mitigation**: Test on iOS and Android, make device hooks optional, graceful fallbacks
  - **Impact**: Medium - only affects device category
  - **Probability**: Low (using Expo APIs)

- **RISK-005**: **Maintenance burden of fragmented structure**
  - **Mitigation**: Clear folder naming, category index files, comprehensive docs
  - **Impact**: Low - better organization actually reduces burden
  - **Probability**: Low

- **RISK-006**: **Performance issues with new hooks**
  - **Mitigation**: Follow patterns from existing well-tested hooks, benchmark performance
  - **Impact**: Medium - could affect UX
  - **Probability**: Low (following existing patterns)

### Assumptions

- **ASSUMPTION-001**: **Backward compatibility is non-negotiable** - All existing code must work without modifications
- **ASSUMPTION-002**: **Hook independence is achievable** - Existing hooks can be refactored to remove hard dependencies
- **ASSUMPTION-003**: **Code reduction is achievable** - At least 20% duplicate code can be eliminated
- **ASSUMPTION-004**: **Future package extraction is planned** - Hooks will eventually be published as standalone package
- **ASSUMPTION-005**: All 31 existing hooks are production-ready and their APIs are stable
- **ASSUMPTION-006**: TypeScript compilation will catch any breaking changes in import paths
- **ASSUMPTION-007**: React Native + Expo environment only (no web/DOM APIs)
- **ASSUMPTION-008**: Bundle size will reduce or stay neutral through code consolidation
- **ASSUMPTION-009**: External dependencies (Firebase, etc.) can be made optional via dependency injection
- **ASSUMPTION-010**: Adapter pattern will not significantly increase complexity
- **ASSUMPTION-011**: Offline-first architecture will be maintained

## 10. Related Specifications / Further Reading

### Official Documentation

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Native Hooks](https://reactnative.dev/docs/hooks)
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Expo SDK Documentation](https://docs.expo.dev/)

### Hook Libraries (Research References)

- [usehooks-ts](https://usehooks-ts.com/) - TypeScript hooks collection
- [react-use](https://github.com/streamich/react-use) - Comprehensive hooks library
- [ahooks](https://ahooks.js.org/) - React Hooks from Alibaba
- [@uidotdev/usehooks](https://usehooks.com/) - Modern React hooks
- [React Hook Form](https://react-hook-form.com/) - Performant forms
- [TanStack Query](https://tanstack.com/query/latest) - Async state management

### Internal Documentation

- `docs/AUTHENTICATION_GUIDE.md` - Authentication flows
- `docs/LOCAL_FIRST_IMPLEMENTATION.md` - Offline-first architecture
- `docs/CONSTANTS_REFERENCE.md` - Constants catalog
- `docs/DESIGN_SYSTEM.md` - Design tokens and components
- `.github/instructions/rule.instructions.md` - Development guidelines
- `.github/instructions/performance-optimization.instructions.md` - Performance best practices

### Best Practices Articles

- [React Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript with React Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks)
- [Testing React Hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)
- [Performance Optimization with Hooks](https://kentcdodds.com/blog/usememo-and-usecallback)

---

**Last Updated**: 2025-10-18
**Version**: 2.3
**Status**: Planned - Ready for Implementation

## Implementation Priorities

1. **Phase 1 (CRITICAL)**: Establish backward compatible folder structure with adapters
2. **Phase 8 (HIGH)**: Hook independence, code reduction, and isolation testing
3. **Phases 2-7 (MEDIUM)**: Add new essential hooks (designed as portable from start)
4. **Documentation (ONGOING)**: Update docs including standalone usage examples
5. **Future (PLANNED)**: Extract to `@loginx/expo-hooks` package

## Key Success Metrics

- ✅ **100% Backward Compatibility** - Zero breaking changes in LoginX
- ✅ **Hook Independence** - All hooks testable without project context
- ✅ **20%+ Code Reduction** - Measured LOC savings through consolidation
- ✅ **<5KB per Hook** - Bundle size target for portability
- ✅ **Package Ready** - Hooks designed for standalone npm package extraction

This plan provides a comprehensive roadmap for organizing and enhancing the custom hooks library tailored for LoginX's React Native and Expo environment. **The implementation prioritizes:**

1. **Backward compatibility** - All existing code continues working
2. **Hook independence** - Each hook is self-contained and portable
3. **Future reusability** - Designed for extraction into standalone package
4. **Code reduction** - Eliminate duplication through consolidation

Each phase builds upon the previous one, ensuring a stable, maintainable, and portable codebase without testing requirements or breaking changes. The hooks will eventually be extracted into `@loginx/expo-hooks` for use across any Expo-based React Native project.
