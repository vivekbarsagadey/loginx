---
goal: Refactor LoginX State Management with Proper Context Architecture
version: 1.0
date_created: 2025-01-19
last_updated: 2025-01-19
owner: LoginX Team
status: "Planned"
tags: ["architecture", "refactor", "state-management", "context", "performance"]
---

# Context Architecture Refactoring Implementation Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

## Introduction

This plan addresses the identified gaps in LoginX's state management architecture. Currently, the app uses inconsistent patterns:

- Some state managed via Context (Theme, Auth, Language, Onboarding)
- Most state managed via local `useState` in individual screens
- No centralized state for Settings, Permissions, or Network status
- Duplicated data fetching logic across components
- Stale data visible to users after changes

**Goal:** Establish a cohesive, performant Context architecture that provides:

1. Single source of truth for all app-wide state
2. Immediate synchronization across all screens
3. Better developer experience with consistent patterns
4. Improved user experience with no stale data
5. Performance optimization through proper memoization

## 1. Requirements & Constraints

### Functional Requirements

- **REQ-001**: All app-wide state must be immediately synchronized across screens
- **REQ-002**: Settings changes must reflect instantly in all consuming components
- **REQ-003**: Network status must be globally accessible without prop drilling
- **REQ-004**: Security settings must have single source of truth
- **REQ-005**: Permission states must be centrally managed
- **REQ-006**: All Contexts must integrate with existing local-first architecture
- **REQ-007**: Backward compatibility during migration period

### Technical Requirements

- **REQ-008**: Context values must be properly memoized to prevent unnecessary re-renders
- **REQ-009**: Storage operations must be async and non-blocking
- **REQ-010**: All Contexts must support optimistic updates for better UX
- **REQ-011**: Error handling must be consistent across all Contexts
- **REQ-012**: TypeScript types must be exhaustive and type-safe
- **REQ-013**: All state updates must be logged for debugging (dev mode only)

### Performance Constraints

- **CON-001**: Context updates must not cause frame drops (maintain 60 FPS)
- **CON-002**: Initial app load time must not increase by more than 50ms
- **CON-003**: Storage operations must be batched to minimize I/O
- **CON-004**: Re-renders must be limited to components actually using changed state

### Security Constraints

- **SEC-001**: Sensitive settings (biometric, 2FA) must use secure storage
- **SEC-002**: Settings sync to Firestore must respect authentication state
- **SEC-003**: No sensitive data in console logs (production mode)

### Architecture Guidelines

- **GUD-001**: Follow existing Context pattern (Provider + custom hook)
- **GUD-002**: Maintain consistency with ThemeContext and AuthContext patterns
- **GUD-003**: Use local-first architecture (AsyncStorage → Firestore)
- **GUD-004**: Implement proper cleanup in useEffect hooks
- **GUD-005**: Document all Context APIs with JSDoc
- **GUD-006**: Write unit tests for all Context logic

### Design Patterns to Follow

- **PAT-001**: Context + Custom Hook pattern (like `useAuth()`)
- **PAT-002**: Memoized context values with `useMemo`
- **PAT-003**: Memoized callbacks with `useCallback`
- **PAT-004**: Error boundaries around Context consumers
- **PAT-005**: Loading states for async operations
- **PAT-006**: Optimistic updates with rollback on error

## 2. Implementation Steps

### Phase 1: Foundation & Analysis

**GOAL-001**: Audit existing state management and prepare infrastructure

| Task     | Description                                                        | Completed | Date |
| -------- | ------------------------------------------------------------------ | --------- | ---- |
| TASK-001 | Audit all screens using `useState` for settings/preferences        |           |      |
| TASK-002 | Document current data flow for settings (fetch → display → update) |           |      |
| TASK-003 | Identify all components that would benefit from SettingsContext    |           |      |
| TASK-004 | Create types file: `types/settings.ts` for all settings types      |           |      |
| TASK-005 | Create types file: `types/network.ts` for network status types     |           |      |
| TASK-006 | Create types file: `types/permissions.ts` for permission types     |           |      |
| TASK-007 | Add Context documentation to project guidelines                    |           |      |

### Phase 2: SettingsProvider Implementation

**GOAL-002**: Create centralized SettingsContext to replace scattered useState

| Task     | Description                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------- | --------- | ---- |
| TASK-008 | Create `hooks/settings/use-settings-context.tsx`                          |           |      |
| TASK-009 | Define SettingsState interface (notifications, security, app preferences) |           |      |
| TASK-010 | Implement SettingsProvider with AsyncStorage integration                  |           |      |
| TASK-011 | Add optimistic updates for settings changes                               |           |      |
| TASK-012 | Implement Firestore sync for authenticated users                          |           |      |
| TASK-013 | Add error handling and retry logic                                        |           |      |
| TASK-014 | Create `useSettings()` custom hook                                        |           |      |
| TASK-015 | Add loading states and error states                                       |           |      |
| TASK-016 | Implement settings cache warming on app launch                            |           |      |
| TASK-017 | Add debug logging for settings changes (dev mode)                         |           |      |
| TASK-018 | Write unit tests for SettingsProvider                                     |           |      |
| TASK-019 | Add SettingsProvider to app/\_layout.tsx                                  |           |      |

### Phase 3: NetworkProvider Implementation

**GOAL-003**: Create NetworkContext for global network status management

| Task     | Description                                                                      | Completed | Date |
| -------- | -------------------------------------------------------------------------------- | --------- | ---- |
| TASK-020 | Create `hooks/network/use-network-context.tsx`                                   |           |      |
| TASK-021 | Define NetworkState interface (isConnected, connectionType, isInternetReachable) |           |      |
| TASK-022 | Wrap existing `initializeNetworkMonitoring()` in Context                         |           |      |
| TASK-023 | Add sync queue status to NetworkContext                                          |           |      |
| TASK-024 | Implement network quality indicators                                             |           |      |
| TASK-025 | Create `useNetwork()` custom hook                                                |           |      |
| TASK-026 | Add network change event listeners                                               |           |      |
| TASK-027 | Integrate with existing OfflineIndicator component                               |           |      |
| TASK-028 | Write unit tests for NetworkProvider                                             |           |      |
| TASK-029 | Add NetworkProvider to app/\_layout.tsx                                          |           |      |

### Phase 4: Security & Permissions Consolidation

**GOAL-004**: Centralize security settings and permissions in dedicated Contexts

| Task     | Description                                                                | Completed | Date |
| -------- | -------------------------------------------------------------------------- | --------- | ---- |
| TASK-030 | Refactor `useSecuritySettings()` to use SettingsContext                    |           |      |
| TASK-031 | Create `hooks/permissions/use-permissions-context.tsx`                     |           |      |
| TASK-032 | Define PermissionsState interface (camera, media, location, notifications) |           |      |
| TASK-033 | Implement PermissionsProvider with real-time permission checking           |           |      |
| TASK-034 | Add permission request handlers to Context                                 |           |      |
| TASK-035 | Create `usePermissions()` custom hook                                      |           |      |
| TASK-036 | Migrate existing `usePermissions()` logic to Context                       |           |      |
| TASK-037 | Write unit tests for PermissionsProvider                                   |           |      |
| TASK-038 | Add PermissionsProvider to app/\_layout.tsx                                |           |      |

### Phase 5: Migration - Settings Screens

**GOAL-005**: Migrate existing settings screens to use new SettingsContext

| Task     | Description                                                              | Completed | Date |
| -------- | ------------------------------------------------------------------------ | --------- | ---- |
| TASK-039 | Migrate `app/settings/notifications.tsx` to use SettingsContext          |           |      |
| TASK-040 | Remove local useState from notifications screen                          |           |      |
| TASK-041 | Migrate `app/(tabs)/settings.tsx` to use SettingsContext                 |           |      |
| TASK-042 | Migrate `app/security/*` screens to use SettingsContext                  |           |      |
| TASK-043 | Update NotificationPreferencesCard to use SettingsContext                |           |      |
| TASK-044 | Test cross-screen synchronization (change in Settings → reflect in Home) |           |      |
| TASK-045 | Remove redundant data fetching logic from migrated screens               |           |      |

### Phase 6: Migration - Permission Screens

**GOAL-006**: Migrate permission-related screens to use PermissionsContext

| Task     | Description                                                      | Completed | Date |
| -------- | ---------------------------------------------------------------- | --------- | ---- |
| TASK-046 | Migrate `app/settings/permissions.tsx` to use PermissionsContext |           |      |
| TASK-047 | Migrate onboarding permission slides to use PermissionsContext   |           |      |
| TASK-048 | Remove local useState from permission screens                    |           |      |
| TASK-049 | Test permission flow (request → grant → update UI instantly)     |           |      |

### Phase 7: OnboardingProvider Refactoring

**GOAL-007**: Optimize OnboardingProvider to reduce bundle size and runtime overhead

| Task     | Description                                                     | Completed | Date |
| -------- | --------------------------------------------------------------- | --------- | ---- |
| TASK-050 | Analyze OnboardingProvider usage patterns                       |           |      |
| TASK-051 | Decision: Keep minimal completion tracking OR remove entirely   |           |      |
| TASK-052 | Option A: Implement lazy loading (only mount during onboarding) |           |      |
| TASK-053 | Option B: Move analytics to separate module (not in Context)    |           |      |
| TASK-054 | Option C: Remove OnboardingProvider, use local state in screens |           |      |
| TASK-055 | Implement chosen optimization strategy                          |           |      |
| TASK-056 | Test onboarding flow with new implementation                    |           |      |
| TASK-057 | Update documentation for onboarding state management            |           |      |

### Phase 8: Performance Optimization

**GOAL-008**: Ensure all Contexts are optimized and don't cause performance regressions

| Task     | Description                                                    | Completed | Date |
| -------- | -------------------------------------------------------------- | --------- | ---- |
| TASK-058 | Profile app with React DevTools Profiler (before optimization) |           |      |
| TASK-059 | Ensure all Context values are memoized with `useMemo`          |           |      |
| TASK-060 | Ensure all callbacks are memoized with `useCallback`           |           |      |
| TASK-061 | Implement Context selectors to prevent unnecessary re-renders  |           |      |
| TASK-062 | Add React.memo to expensive components consuming Contexts      |           |      |
| TASK-063 | Profile app with React DevTools Profiler (after optimization)  |           |      |
| TASK-064 | Compare FPS metrics (before vs after)                          |           |      |
| TASK-065 | Benchmark app launch time (before vs after)                    |           |      |
| TASK-066 | Document performance optimization patterns                     |           |      |

### Phase 9: Testing & Quality Assurance

**GOAL-009**: Comprehensive testing of all new Contexts and migrated screens

| Task     | Description                                              | Completed | Date |
| -------- | -------------------------------------------------------- | --------- | ---- |
| TASK-067 | Write unit tests for SettingsProvider (80%+ coverage)    |           |      |
| TASK-068 | Write unit tests for NetworkProvider (80%+ coverage)     |           |      |
| TASK-069 | Write unit tests for PermissionsProvider (80%+ coverage) |           |      |
| TASK-070 | Write integration tests for cross-screen synchronization |           |      |
| TASK-071 | Test offline scenarios (settings change while offline)   |           |      |
| TASK-072 | Test Firestore sync scenarios (conflict resolution)      |           |      |
| TASK-073 | Test error handling (storage failures, network errors)   |           |      |
| TASK-074 | Test on low-end devices (performance validation)         |           |      |
| TASK-075 | Manual QA testing on iOS and Android                     |           |      |

### Phase 10: Documentation & Cleanup

**GOAL-010**: Complete documentation and remove deprecated code

| Task     | Description                                                                | Completed | Date |
| -------- | -------------------------------------------------------------------------- | --------- | ---- |
| TASK-076 | Update project README with Context architecture overview                   |           |      |
| TASK-077 | Create `docs/CONTEXT_ARCHITECTURE.md` documentation                        |           |      |
| TASK-078 | Document migration patterns for future developers                          |           |      |
| TASK-079 | Add JSDoc comments to all Context APIs                                     |           |      |
| TASK-080 | Remove deprecated `useState` patterns from codebase                        |           |      |
| TASK-081 | Remove redundant utility functions replaced by Contexts                    |           |      |
| TASK-082 | Update `.github/instructions/rule.instructions.md` with Context guidelines |           |      |
| TASK-083 | Create examples in `app/examples/` demonstrating Context usage             |           |      |
| TASK-084 | Record demo video showing cross-screen synchronization                     |           |      |

## 3. Alternatives

### Alternative Approaches Considered

- **ALT-001**: Use Zustand or Jotai external state library
  - **Pros**: Better performance optimization, simpler API, smaller bundle
  - **Cons**: Additional dependency, learning curve, different from existing patterns
  - **Decision**: Not chosen - Context is sufficient for LoginX's needs and maintains consistency

- **ALT-002**: Implement singleton pattern with custom hooks (shared state without Context)
  - **Pros**: No Context overhead, simpler implementation
  - **Cons**: Not React-like, harder to test, no integration with React lifecycle
  - **Decision**: Not chosen - Goes against React principles

- **ALT-003**: Keep current useState pattern with refetch on screen focus
  - **Pros**: Zero refactoring, simple to understand
  - **Cons**: Stale data UX issues, duplicated fetch logic, poor DX
  - **Decision**: Not chosen - Does not solve the core problem

- **ALT-004**: One giant AppStateContext combining all state
  - **Pros**: Single Context to manage, simpler provider tree
  - **Cons**: Every state change re-renders all consumers, poor separation of concerns
  - **Decision**: Not chosen - Performance issues, not modular

- **ALT-005**: Redux or Redux Toolkit
  - **Pros**: Industry standard, excellent DevTools, time-travel debugging
  - **Cons**: Heavy boilerplate, overkill for this app's complexity, large bundle size
  - **Decision**: Not chosen - Too complex for LoginX's needs

## 4. Dependencies

### Internal Dependencies

- **DEP-001**: Existing `utils/local-first.ts` (storage layer)
- **DEP-002**: Existing `utils/auth-persistence.ts` (secure storage)
- **DEP-003**: Existing `firebase-config.ts` (Firestore integration)
- **DEP-004**: Existing `utils/network.ts` (network monitoring)
- **DEP-005**: Existing `utils/cache.ts` (cache warming)
- **DEP-006**: Existing `utils/debug.ts` (logging)
- **DEP-007**: ThemeContext pattern (reference implementation)
- **DEP-008**: AuthContext pattern (reference implementation)

### External Dependencies

- **DEP-009**: `@react-native-async-storage/async-storage` (already installed)
- **DEP-010**: `@react-native-community/netinfo` (already installed)
- **DEP-011**: `firebase/firestore` (already installed)
- **DEP-012**: `react` hooks (useState, useEffect, useMemo, useCallback, useContext)

### Breaking Changes

- **DEP-013**: Screens using old `useSecuritySettings()` pattern will need migration
- **DEP-014**: Components directly importing settings utilities will need updates
- **DEP-015**: Custom hooks that fetch settings will be deprecated

## 5. Files

### New Files to Create

- **FILE-001**: `hooks/settings/use-settings-context.tsx` - SettingsProvider implementation
- **FILE-002**: `hooks/network/use-network-context.tsx` - NetworkProvider implementation
- **FILE-003**: `hooks/permissions/use-permissions-context.tsx` - PermissionsProvider implementation
- **FILE-004**: `types/settings.ts` - Settings type definitions
- **FILE-005**: `types/network.ts` - Network status type definitions
- **FILE-006**: `types/permissions.ts` - Permissions type definitions
- **FILE-007**: `docs/CONTEXT_ARCHITECTURE.md` - Context architecture documentation
- **FILE-008**: `tests/hooks/settings/use-settings-context.test.tsx` - Settings Context tests
- **FILE-009**: `tests/hooks/network/use-network-context.test.tsx` - Network Context tests
- **FILE-010**: `tests/hooks/permissions/use-permissions-context.test.tsx` - Permissions Context tests
- **FILE-011**: `app/examples/context-demo.tsx` - Example demonstrating Context usage

### Files to Modify

- **FILE-012**: `app/_layout.tsx` - Add new Context providers
- **FILE-013**: `app/settings/notifications.tsx` - Migrate to SettingsContext
- **FILE-014**: `app/(tabs)/settings.tsx` - Migrate to SettingsContext
- **FILE-015**: `app/settings/permissions.tsx` - Migrate to PermissionsContext
- **FILE-016**: `app/security/*` - Migrate security screens to SettingsContext
- **FILE-017**: `components/organisms/notification-preferences-card.tsx` - Use SettingsContext
- **FILE-018**: `components/ui/offline-indicator.tsx` - Use NetworkContext
- **FILE-019**: `hooks/auth/use-security-settings.tsx` - Refactor to use SettingsContext
- **FILE-020**: `hooks/auth/use-permissions.tsx` - Deprecate in favor of PermissionsContext
- **FILE-021**: `.github/instructions/rule.instructions.md` - Add Context guidelines

### Files to Remove/Deprecate

- **FILE-022**: Redundant settings utility functions (moved to Context)
- **FILE-023**: Duplicate permission checking logic (consolidated in PermissionsContext)
- **FILE-024**: Old onboarding analytics tracking (if removing OnboardingProvider)

## 6. Testing

### Unit Tests

- **TEST-001**: SettingsProvider initializes with default values
- **TEST-002**: SettingsProvider loads persisted settings from AsyncStorage
- **TEST-003**: Settings updates are persisted to AsyncStorage
- **TEST-004**: Settings updates sync to Firestore when authenticated
- **TEST-005**: Optimistic updates work correctly (immediate UI update)
- **TEST-006**: Error handling rolls back optimistic updates on failure
- **TEST-007**: NetworkProvider reports correct connection status
- **TEST-008**: NetworkProvider listens to network state changes
- **TEST-009**: PermissionsProvider tracks permission states accurately
- **TEST-010**: Permission requests update Context state immediately
- **TEST-011**: All Context values are properly memoized
- **TEST-012**: All callbacks are properly memoized
- **TEST-013**: Context providers don't cause memory leaks

### Integration Tests

- **TEST-014**: Settings change on Settings screen reflects on Home screen instantly
- **TEST-015**: Theme change updates all consuming components
- **TEST-016**: Network status change updates OfflineIndicator
- **TEST-017**: Permission grant updates all components showing permission status
- **TEST-018**: Offline settings changes sync when network reconnects
- **TEST-019**: Multiple screens can update settings concurrently without conflicts

### Performance Tests

- **TEST-020**: App launch time is within acceptable range (< 2 seconds)
- **TEST-021**: Settings update doesn't drop frames (60 FPS maintained)
- **TEST-022**: Large number of Context consumers doesn't degrade performance
- **TEST-023**: Memory usage remains stable over extended app usage

### Manual Testing Checklist

- **TEST-024**: Test on iOS low-end device (iPhone SE)
- **TEST-025**: Test on Android low-end device
- **TEST-026**: Test offline scenario (airplane mode)
- **TEST-027**: Test rapid settings changes (stress test)
- **TEST-028**: Test app backgrounding and foregrounding
- **TEST-029**: Test after fresh install (no persisted data)
- **TEST-030**: Test after app update (migration from old state structure)

## 7. Risks & Assumptions

### Technical Risks

- **RISK-001**: Context re-renders may cause performance issues on low-end devices
  - **Mitigation**: Implement proper memoization, use React.memo, profile regularly
  - **Severity**: Medium
  - **Likelihood**: Low

- **RISK-002**: Migration may introduce bugs in existing screens
  - **Mitigation**: Incremental migration, thorough testing, coexistence period
  - **Severity**: High
  - **Likelihood**: Medium

- **RISK-003**: Storage layer failures may cause data loss
  - **Mitigation**: Implement retry logic, error boundaries, fallback values
  - **Severity**: High
  - **Likelihood**: Low

- **RISK-004**: Firestore sync conflicts may cause data inconsistency
  - **Mitigation**: Implement last-write-wins or custom conflict resolution
  - **Severity**: Medium
  - **Likelihood**: Medium

- **RISK-005**: Large number of Contexts may increase bundle size
  - **Mitigation**: Lazy load non-critical Contexts, code-split where possible
  - **Severity**: Low
  - **Likelihood**: Low

### Product Risks

- **RISK-006**: Breaking changes may disrupt active development
  - **Mitigation**: Coordinate with team, feature freeze during migration
  - **Severity**: Medium
  - **Likelihood**: Medium

- **RISK-007**: Users may experience bugs during migration period
  - **Mitigation**: Thorough QA, staged rollout, rollback plan
  - **Severity**: High
  - **Likelihood**: Low

### Assumptions

- **ASSUMPTION-001**: React Context performance is sufficient for LoginX's scale
- **ASSUMPTION-002**: Settings don't change more than 10-20 times per user session
- **ASSUMPTION-003**: AsyncStorage read/write operations are fast enough (< 50ms)
- **ASSUMPTION-004**: Firestore has reliable connectivity for most users
- **ASSUMPTION-005**: Current local-first architecture is stable and won't change
- **ASSUMPTION-006**: Team has capacity for 1-2 weeks of focused refactoring
- **ASSUMPTION-007**: No major feature launches during migration period

## 8. Related Specifications / Further Reading

### Internal Documentation

- [LoginX Architecture Guidelines](/.github/instructions/rule.instructions.md)
- [React Development Standards](/.github/instructions/reactjs.instructions.md)
- [Performance Optimization Guide](/.github/instructions/performance-optimization.instructions.md)
- [Local-First Implementation](../docs/LOCAL_FIRST_IMPLEMENTATION.md)

### External References

- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Context Performance Pitfalls](https://kentcdodds.com/blog/how-to-use-react-context-effectively)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

**Next Steps:**

1. Review and approve this plan
2. Set up development branch: `feature/context-architecture`
3. Begin Phase 1: Foundation & Analysis
4. Schedule regular progress reviews (daily standups during migration)
5. Plan rollback strategy if issues arise

**Estimated Timeline:**

- Phase 1-2: 3 days (SettingsProvider)
- Phase 3: 1 day (NetworkProvider)
- Phase 4: 2 days (Security & Permissions)
- Phase 5-6: 3 days (Migration)
- Phase 7: 1 day (Onboarding optimization)
- Phase 8-9: 2 days (Performance & Testing)
- Phase 10: 1 day (Documentation)

**Total: \~2 weeks of focused development**
