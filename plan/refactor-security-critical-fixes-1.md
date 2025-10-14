---
goal: Fix Critical Security and Architectural Issues in LoginX Authentication System
version: 1.0
date_created: 2025-10-14
last_updated: 2025-10-14
owner: Development Team
status: "Planned"
tags: ["security", "refactor", "bug", "architecture", "critical"]
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This implementation plan addresses 18 critical security vulnerabilities and architectural issues identified in the comprehensive code review of the LoginX authentication system. The plan prioritizes immediate security threats, followed by architectural improvements to ensure data integrity, prevent memory leaks, and establish production-ready error handling patterns.

**Severity Breakdown:**

- 🚨 Critical Security: 5 issues requiring immediate attention
- ⚠️ High-Priority Architectural: 5 issues affecting data integrity and performance
- ⚡ Medium-Priority: 5 issues affecting code quality and maintainability
- 📊 Code Quality: 3 issues requiring refactoring

**Estimated Timeline:** 2-3 weeks for critical issues, 4-6 weeks for complete resolution

## 1. Requirements & Constraints

### Security Requirements

- **SEC-001**: All Firebase configuration must fail fast if environment variables are missing
- **SEC-002**: Zero sensitive data (passwords, tokens, PII) in production logs
- **SEC-003**: Server-side rate limiting must be implemented for all authentication endpoints
- **SEC-004**: NoSQL injection prevention required for all Firestore operations
- **SEC-005**: All password validations must use centralized security policy
- **SEC-006**: Biometric re-authentication required for sensitive operations (password change, account deletion)
- **SEC-007**: All console.log statements must be removed from production builds
- **SEC-008**: PII redaction required in all logging systems

### Architectural Requirements

- **REQ-001**: All async operations must have proper error boundaries and user feedback
- **REQ-002**: Local-first sync must use optimistic locking with version control
- **REQ-003**: Network listeners must have proper cleanup to prevent memory leaks
- **REQ-004**: Firestore initialization must complete before first use
- **REQ-005**: Cache stampede protection required for all remote data fetching
- **REQ-006**: Offline sync queue must persist to AsyncStorage
- **REQ-007**: All critical initialization failures must show user-facing error messages

### Performance Requirements

- **PERF-001**: Request coalescing required for concurrent cache misses
- **PERF-002**: Stale-while-revalidate caching pattern for improved UX
- **PERF-003**: Component re-renders must be minimized through proper memoization

### Code Quality Requirements

- **QUA-001**: TypeScript strict mode must be enabled and all type errors resolved
- **QUA-002**: All public API functions must have JSDoc documentation
- **QUA-003**: Component files must not exceed 200 lines
- **QUA-004**: Maximum cyclomatic complexity of 10 per function
- **QUA-005**: Error handling patterns must be consistent across codebase

### Constraints

- **CON-001**: Must maintain backward compatibility with existing user data
- **CON-002**: Zero downtime deployment required
- **CON-003**: Must work on iOS, Android, and Web platforms
- **CON-004**: Firebase free tier limits must be respected
- **CON-005**: Bundle size increase must not exceed 50KB
- **CON-006**: Existing authentication flows must not be disrupted

### Guidelines

- **GUD-001**: Follow React Native best practices for hooks and context
- **GUD-002**: Adhere to SOLID principles for all new code
- **GUD-003**: Use defensive programming for all external API calls
- **GUD-004**: Implement graceful degradation for non-critical features
- **GUD-005**: Write atomic, idempotent operations for data mutations

### Patterns to Follow

- **PAT-001**: Error-first callback pattern for async operations
- **PAT-002**: Repository pattern for data access layer
- **PAT-003**: Circuit breaker pattern for external service calls
- **PAT-004**: Event sourcing for audit trail of security-critical operations
- **PAT-005**: Factory pattern for creating service instances with proper configuration

## 2. Implementation Steps

### Phase 1: Critical Security Fixes (Priority 1 - Week 1)

**GOAL-001**: Eliminate immediate security vulnerabilities that could lead to data breaches or system compromise

| Task     | Description                                                                                                                 | Completed | Date       |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Remove hardcoded Firebase config fallbacks in `firebase-config.ts` - Replace `\|\| 'missing-*'` with immediate error throws | ✅        | 2025-10-14 |
| TASK-002 | Create centralized logging utility in `utils/logger-production.ts` with PII redaction and environment-based filtering       | ✅        | 2025-10-14 |
| TASK-003 | Audit and replace all 24+ `console.log/warn/error` statements with production-safe logger                                   | ✅        | 2025-10-14 |
| TASK-004 | Fix network listener memory leak in `utils/network.ts` by ensuring unsubscribe is called on component unmount               | ✅        | 2025-10-14 |
| TASK-005 | Add error boundaries to all auth screens: login, register, forgot-password, verify-email, verify-phone                      | ✅        | 2025-10-14 |
| TASK-006 | Update `utils/config.ts` validateRequiredConfig to throw errors immediately in production when config missing               | ✅        | 2025-10-14 |
| TASK-007 | Remove sensitive data exposure in `utils/firestore-helpers.ts` error logs (lines 93, 126, 161, 196)                         | ✅        | 2025-10-14 |
| TASK-008 | Add rate limiting configuration constant in `constants/security.ts` with MAX_ATTEMPTS_PER_MINUTE = 5                        | ✅        | 2025-10-14 |

### Phase 2: Authentication Security Hardening (Priority 1 - Week 1)

**GOAL-002**: Implement server-side rate limiting and prevent brute force attacks on authentication endpoints

| Task     | Description                                                                                       | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-009 | Create Firebase Cloud Function `rateLimit` middleware in `functions/src/middleware/rate-limit.ts` | ✅        | 2025-10-14 |
| TASK-010 | Implement server-side rate limiting for `signInWithEmailAndPassword` using Firebase Functions     | ✅        | 2025-10-14 |
| TASK-011 | Implement server-side rate limiting for `createUserWithEmailAndPassword` registration endpoint    | ✅        | 2025-10-14 |
| TASK-012 | Add IP-based rate limiting using Firestore collections `rate_limits/{ip}/attempts`                | ✅        | 2025-10-14 |
| TASK-013 | Integrate Firebase App Check in `firebase-config.ts` for abuse prevention                         | 📋        |            |
| TASK-014 | Create `utils/auth-rate-limiter.ts` client-side helper to display rate limit errors gracefully    | ✅        | 2025-10-14 |
| TASK-015 | Update `app/(auth)/login.tsx` to handle HTTP 429 rate limit errors with user-friendly messages    | ✅        | 2025-10-14 |
| TASK-016 | Update Firestore Security Rules to enforce rate limits on auth-related collections                | ✅        | 2025-10-14 |

### Phase 3: Input Validation & Injection Prevention (Priority 1 - Week 1-2)

**GOAL-003**: Prevent NoSQL injection and strengthen input sanitization across all user inputs

| Task     | Description                                                                                                   | Completed | Date       |
| -------- | ------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-017 | Create `utils/nosql-injection-guard.ts` with validation patterns for Firestore queries                        | ✅        | 2025-10-14 |
| TASK-018 | Add NoSQL injection checks to `utils/sanitize.ts` sanitizeUserInput function                                  | ✅        | 2025-10-14 |
| TASK-019 | Audit all Firestore query operations in `utils/firestore-helpers.ts` for injection vulnerabilities            | ✅        | 2025-10-14 |
| TASK-020 | Create centralized password validation service in `utils/password-validator.ts` consolidating scattered regex | ✅        | 2025-10-14 |
| TASK-021 | Replace inline password validation in `app/(auth)/register/step-2.tsx` with centralized validator             | ✅        | 2025-10-14 |
| TASK-022 | Replace inline password validation in `app/security/change-password.tsx` with centralized validator           | ✅        | 2025-10-14 |
| TASK-023 | Replace inline password validation in `components/auth/login-form.tsx` with centralized validator             | ✅        | 2025-10-14 |
| TASK-024 | Update `constants/validation.ts` to remove duplicated password patterns, reference central validator          | ✅        | 2025-10-14 |

### Phase 4: Architectural Fixes - Race Conditions (Priority 2 - Week 2)

**GOAL-004**: Eliminate race conditions in local-first sync and ensure data consistency

| Task     | Description                                                                                        | Completed | Date       |
| -------- | -------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-025 | Add version field to all DataEntry types in `utils/local-first.ts` for optimistic locking          | ✅        | 2025-10-14 |
| TASK-026 | Implement distributed locking mechanism using Firestore transaction in `utils/distributed-lock.ts` | ✅        | 2025-10-14 |
| TASK-027 | Update `backgroundSync` function to use Firestore transactions for atomic updates                  | ✅        | 2025-10-14 |
| TASK-028 | Add conflict detection logic comparing local vs remote lastModified timestamps                     | ✅        | 2025-10-14 |
| TASK-029 | Create `utils/conflict-resolver.ts` UI component to handle sync conflicts with user choice         | ✅        | 2025-10-14 |
| TASK-030 | Implement retry logic with exponential backoff for failed sync operations                          | ✅        | 2025-10-14 |
| TASK-031 | Add sync operation mutex to prevent concurrent syncs of same key using Map-based locks             | ✅        | 2025-10-14 |
| TASK-032 | Update cache operations in `utils/cache.ts` to use atomic AsyncStorage operations                  | ✅        | 2025-10-14 |

### Phase 5: Memory Management & Cleanup (Priority 2 - Week 2)

**GOAL-005**: Fix memory leaks and ensure proper resource cleanup across the application

| Task     | Description                                                                                     | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-033 | Fix network listener cleanup in `app/_layout.tsx` by returning cleanup function from useEffect  | ✅        | 2025-10-14 |
| TASK-034 | Audit all useEffect hooks for missing cleanup functions (return statement)                      | ✅        | 2025-10-14 |
| TASK-035 | Fix cache eviction logic in `utils/cache.ts` to properly clean up persistent storage references | ✅        | 2025-10-14 |
| TASK-036 | Add unsubscribe pattern to `utils/local-first.ts` subscribeToData function                      | ✅        | 2025-10-14 |
| TASK-037 | Create `utils/cleanup-manager.ts` registry for tracking active subscriptions and timers         | ✅        | 2025-10-14 |
| TASK-038 | Implement weak references for cached data in memory-sensitive scenarios                         | ✅        | 2025-10-14 |
| TASK-039 | Add memory pressure monitoring using React Native's AppState events                             | ✅        | 2025-10-14 |
| TASK-040 | Create automated leak detection test suite using React DevTools Profiler API                    | ✅        | 2025-10-14 |

### Phase 6: Error Handling & User Feedback (Priority 2 - Week 2-3)

**GOAL-006**: Implement comprehensive error handling with graceful degradation and user-facing feedback

| Task     | Description                                                                                     | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-041 | Replace silent catch blocks in `app/_layout.tsx` initialization with user-facing error dialogs  |           |      |
| TASK-042 | Create `components/error/critical-error-screen.tsx` for unrecoverable initialization failures   |           |      |
| TASK-043 | Implement fallback mode in `utils/local-first.ts` when initialization fails (memory-only cache) |           |      |
| TASK-044 | Add retry UI component `components/error/retry-button.tsx` with exponential backoff display     |           |      |
| TASK-045 | Create error classification system in `utils/error-classifier.ts` (recoverable vs fatal)        |           |      |
| TASK-046 | Update `utils/error.ts` to include error recovery suggestions in user messages                  |           |      |
| TASK-047 | Implement error aggregation to prevent alert spam during cascading failures                     |           |      |
| TASK-048 | Add error boundary to `components/themed-scroll-view.tsx` for list rendering failures           |           |      |

### Phase 7: Cache Optimization & Stampede Prevention (Priority 2 - Week 3)

**GOAL-007**: Implement request coalescing and stale-while-revalidate to prevent cache stampede and improve performance

| Task     | Description                                                                                     | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-049 | Create `utils/request-deduplicator.ts` singleton to track in-flight requests                    |           |      |
| TASK-050 | Implement request coalescing in `utils/local-first.ts` getData function using Promise map       |           |      |
| TASK-051 | Add stale-while-revalidate pattern to cache.get - return stale data while fetching fresh        |           |      |
| TASK-052 | Create `utils/cache-strategy.ts` with configurable strategies (SWR, cache-first, network-first) |           |      |
| TASK-053 | Update cache eviction to preserve frequently accessed items using LFU (Least Frequently Used)   |           |      |
| TASK-054 | Add cache warming for critical data on app launch in `app/_layout.tsx`                          |           |      |
| TASK-055 | Implement intelligent cache preloading based on user navigation patterns                        |           |      |
| TASK-056 | Add cache hit/miss rate monitoring with adaptive strategy adjustment                            |           |      |

### Phase 8: Firestore Initialization Fix (Priority 2 - Week 3)

**GOAL-008**: Ensure Firestore is fully initialized with persistence before any operations are performed

| Task     | Description                                                                              | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-057 | Refactor `firebase-config.ts` to use async initialization pattern with Promise           |           |      |
| TASK-058 | Create `getFirestoreReady()` async function that resolves when persistence is configured |           |      |
| TASK-059 | Update all Firestore imports to use async getter instead of direct import                |           |      |
| TASK-060 | Add initialization timeout of 10 seconds with fallback to non-persistent mode            |           |      |
| TASK-061 | Create `utils/firestore-ready.ts` helper with loading state hook for components          |           |      |
| TASK-062 | Update `utils/firestore-helpers.ts` to await Firestore ready before operations           |           |      |
| TASK-063 | Add Firestore initialization status indicator in dev mode (footer component)             |           |      |
| TASK-064 | Implement graceful degradation if IndexedDB persistence fails (web only)                 |           |      |

### Phase 9: Offline Queue Persistence (Priority 3 - Week 3-4)

**GOAL-009**: Persist sync queue to AsyncStorage to prevent data loss on app restarts or crashes

| Task     | Description                                                                                    | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-065 | Create `SYNC_QUEUE_STORAGE_KEY` constant in `utils/local-first.ts`                             |           |      |
| TASK-066 | Implement `saveSyncQueue()` function to persist Map to AsyncStorage as JSON array              |           |      |
| TASK-067 | Implement `loadSyncQueue()` function to restore queue on app initialization                    |           |      |
| TASK-068 | Add queue persistence on every sync queue modification (debounced to prevent excessive writes) |           |      |
| TASK-069 | Create queue cleanup logic to remove successfully synced items from persistent storage         |           |      |
| TASK-070 | Add queue size monitoring and alerts when queue exceeds 100 items                              |           |      |
| TASK-071 | Implement queue prioritization - critical operations (auth, payment) sync first                |           |      |
| TASK-072 | Add queue recovery UI showing pending sync items count in settings screen                      |           |      |

### Phase 10: Biometric Re-authentication (Priority 3 - Week 4)

**GOAL-010**: Add biometric or password verification before executing sensitive operations

| Task     | Description                                                                       | Completed | Date |
| -------- | --------------------------------------------------------------------------------- | --------- | ---- |
| TASK-073 | Create `utils/re-authentication.ts` service with `requireAuth()` function         |           |      |
| TASK-074 | Add biometric prompt to `app/security/change-password.tsx` before password change |           |      |
| TASK-075 | Add biometric prompt to profile deletion flow in `app/profile/index.tsx`          |           |      |
| TASK-076 | Add biometric prompt to security settings changes in `app/security/index.tsx`     |           |      |
| TASK-077 | Create `components/security/re-auth-prompt.tsx` modal component                   |           |      |
| TASK-078 | Implement fallback to password input if biometric fails or unavailable            |           |      |
| TASK-079 | Add session timeout - require re-auth after 15 minutes of inactivity              |           |      |
| TASK-080 | Store last authentication timestamp in secure storage for timeout validation      |           |      |

### Phase 11: Code Quality - Component Refactoring (Priority 3 - Week 4-5)

**GOAL-011**: Break down large components into smaller, focused, testable units

| Task     | Description                                                                                 | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-081 | Extract registration form logic from `app/(auth)/register/index.tsx` into custom hook       |           |      |
| TASK-082 | Split `app/(auth)/login.tsx` into separate components: LoginForm, SocialAuth, BiometricAuth |           |      |
| TASK-083 | Create `hooks/use-registration-state.ts` to manage registration form state                  |           |      |
| TASK-084 | Extract validation logic from registration steps into `utils/registration-validator.ts`     |           |      |
| TASK-085 | Create separate components for each registration step instead of conditional rendering      |           |      |
| TASK-086 | Extract social auth UI from `hooks/use-social-auth.tsx` into presentational components      |           |      |
| TASK-087 | Refactor `components/auth/login-form.tsx` to use composition pattern with slots             |           |      |
| TASK-088 | Add Storybook stories for all refactored authentication components                          |           |      |

### Phase 12: TypeScript Strict Mode (Priority 3 - Week 5)

**GOAL-012**: Enable TypeScript strict mode and resolve all type errors for improved type safety

| Task     | Description                                                                  | Completed | Date |
| -------- | ---------------------------------------------------------------------------- | --------- | ---- |
| TASK-089 | Enable `"strict": true` in `tsconfig.json` and document baseline errors      |           |      |
| TASK-090 | Fix all `implicit any` errors in utils directory (estimated 50+ occurrences) |           |      |
| TASK-091 | Add explicit return types to all exported functions in hooks directory       |           |      |
| TASK-092 | Replace `any` types with proper generic types or `unknown` in error handlers |           |      |
| TASK-093 | Add null checks for all optional properties in components                    |           |      |
| TASK-094 | Create strict type definitions for Firebase Firestore document schemas       |           |      |
| TASK-095 | Update all async functions to properly type Promise return values            |           |      |
| TASK-096 | Add type guards for all runtime type checks using `is` predicates            |           |      |

### Phase 13: Documentation & JSDoc (Priority 3 - Week 5-6)

**GOAL-013**: Add comprehensive JSDoc documentation to all public APIs and utility functions

| Task     | Description                                                               | Completed | Date |
| -------- | ------------------------------------------------------------------------- | --------- | ---- |
| TASK-097 | Document all exported functions in `utils/` directory with JSDoc comments |           |      |
| TASK-098 | Add JSDoc to all custom hooks in `hooks/` directory with usage examples   |           |      |
| TASK-099 | Document all props interfaces in `components/` with @param descriptions   |           |      |
| TASK-100 | Create API documentation generator script using TypeDoc                   |           |      |
| TASK-101 | Add inline code examples to complex utility functions (cache, sync, auth) |           |      |
| TASK-102 | Document error types and recovery strategies in error handling utilities  |           |      |
| TASK-103 | Create architecture decision records (ADRs) for local-first sync strategy |           |      |
| TASK-104 | Generate API reference documentation in `docs/api/` directory             |           |      |

### Phase 14: Production Monitoring Setup (Priority 3 - Week 6)

**GOAL-014**: Integrate production error tracking, performance monitoring, and security auditing

| Task     | Description                                                                              | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-105 | Integrate Sentry SDK in `app/_layout.tsx` with React Native configuration                |           |      |
| TASK-106 | Configure Sentry error boundaries and automatic breadcrumb tracking                      |           |      |
| TASK-107 | Add custom Sentry context: user ID, session ID, device info                              |           |      |
| TASK-108 | Implement performance monitoring using React Native Performance API                      |           |      |
| TASK-109 | Create custom Sentry events for security-critical actions (login, password change)       |           |      |
| TASK-110 | Set up Sentry alerts for high error rates and critical errors                            |           |      |
| TASK-111 | Implement audit logging for authentication events to Firestore `audit_logs` collection   |           |      |
| TASK-112 | Create monitoring dashboard showing key metrics: sync queue size, cache hit rate, errors |           |      |

### Phase 15: Security Audit & Penetration Testing (Priority 4 - Week 6)

**GOAL-015**: Conduct comprehensive security audit and penetration testing of authentication flows

| Task     | Description                                                                | Completed | Date |
| -------- | -------------------------------------------------------------------------- | --------- | ---- |
| TASK-113 | Perform automated security scan using Snyk or similar tool on dependencies |           |      |
| TASK-114 | Manual code review of all authentication endpoints for vulnerabilities     |           |      |
| TASK-115 | Test SQL/NoSQL injection attempts on all user input fields                 |           |      |
| TASK-116 | Test rate limiting effectiveness with automated attack scripts             |           |      |
| TASK-117 | Verify secure storage encryption for biometric credentials and tokens      |           |      |
| TASK-118 | Test session management and timeout enforcement                            |           |      |
| TASK-119 | Verify HTTPS enforcement and certificate pinning (production)              |           |      |
| TASK-120 | Document security findings and create remediation tasks                    |           |      |

### Phase 16: Performance Testing & Optimization (Priority 4 - Week 6)

**GOAL-016**: Load test application with realistic data volumes and optimize bottlenecks

| Task     | Description                                                                | Completed | Date |
| -------- | -------------------------------------------------------------------------- | --------- | ---- |
| TASK-121 | Create performance test suite using Jest and React Native Testing Library  |           |      |
| TASK-122 | Load test sync operations with 1000+ pending items in queue                |           |      |
| TASK-123 | Memory profiling with Chrome DevTools to verify no leaks after refactoring |           |      |
| TASK-124 | Test app performance with 10,000+ cached items in AsyncStorage             |           |      |
| TASK-125 | Benchmark authentication flow latency (target: <2s for login)              |           |      |
| TASK-126 | Profile component render times using React DevTools Profiler               |           |      |
| TASK-127 | Optimize bundle size - analyze with `npx react-native-bundle-visualizer`   |           |      |
| TASK-128 | Document performance benchmarks and set up regression testing              |           |      |

## 3. Alternatives

### Alternative Approaches Considered

- **ALT-001**: **Use Redux for state management instead of Context API** - Rejected due to added complexity and bundle size. Context API with proper memoization is sufficient for this app's scale. Redux would add ~50KB to bundle and require extensive refactoring.

- **ALT-002**: **Implement custom offline sync instead of local-first architecture** - Rejected. Local-first provides better UX and aligns with modern app expectations. Custom solution would require 6+ months of development and testing.

- **ALT-003**: **Use Firebase Security Rules exclusively instead of input validation** - Rejected. Defense-in-depth requires both client-side validation and server-side rules. Client validation improves UX, server rules ensure security.

- **ALT-004**: **Replace AsyncStorage with SQLite for better performance** - Deferred to Phase 2. AsyncStorage is sufficient for current data volumes (<100MB). SQLite adds complexity and requires native modules.

- **ALT-005**: **Use React Query instead of custom cache implementation** - Considered but rejected. Custom cache is tailored for local-first offline sync. React Query is optimized for server-first architectures.

- **ALT-006**: **Implement GraphQL instead of REST/Firestore** - Rejected. Firebase provides excellent real-time capabilities and simpler authentication integration. GraphQL would require custom backend.

- **ALT-007**: **Use Zustand instead of Context for auth state** - Rejected. Context API is React standard and well-understood by team. Zustand would be overkill for single auth context.

- **ALT-008**: **Implement custom rate limiting library** - Rejected. Firebase Functions with Firestore provides battle-tested rate limiting. Custom implementation would be error-prone.

## 4. Dependencies

### External Dependencies

- **DEP-001**: **Firebase SDK** (firebase@^12.3.0) - Authentication, Firestore, Cloud Functions
- **DEP-002**: **@sentry/react-native** (~7.2.0) - Error tracking and performance monitoring
- **DEP-003**: **expo-local-authentication** (~17.0.7) - Biometric authentication
- **DEP-004**: **@react-native-async-storage/async-storage** (2.2.0) - Persistent storage
- **DEP-005**: **@react-native-community/netinfo** (^11.4.1) - Network status monitoring

### Internal Dependencies

- **DEP-006**: **Firebase Cloud Functions** - Must be deployed for server-side rate limiting (TASK-009 to TASK-016)
- **DEP-007**: **Firebase App Check** - Required for abuse prevention (TASK-013)
- **DEP-008**: **Firestore Security Rules** - Must be updated to enforce rate limits (TASK-016)
- **DEP-009**: **Updated environment variables** - Sentry DSN must be configured in `.env` (TASK-105)
- **DEP-010**: **TypeScript 5.9+** - Required for advanced type features in strict mode (TASK-089)

### Build Dependencies

- **DEP-011**: **EAS Build** - Required for production builds with Sentry integration
- **DEP-012**: **expo-dev-client** - Required for testing Firebase App Check locally
- **DEP-013**: **TypeDoc** - Required for API documentation generation (TASK-100)

### Testing Dependencies

- **DEP-014**: **Jest** - Unit and integration testing framework
- **DEP-015**: **React Native Testing Library** - Component testing
- **DEP-016**: **Detox** (optional) - E2E testing for authentication flows

## 5. Files

### Core Files to Modify

- **FILE-001**: `firebase-config.ts` - Remove config fallbacks, add async initialization (TASK-001, TASK-057-064)
- **FILE-002**: `utils/config.ts` - Strengthen validation, fail fast (TASK-006)
- **FILE-003**: `utils/network.ts` - Fix memory leak (TASK-004, TASK-033)
- **FILE-004**: `app/_layout.tsx` - Add error handling, cleanup (TASK-005, TASK-033, TASK-041)
- **FILE-005**: `utils/local-first.ts` - Race conditions, locking, queue persistence (TASK-025-032, TASK-065-072)
- **FILE-006**: `utils/cache.ts` - Stampede prevention, SWR pattern (TASK-032, TASK-049-056)
- **FILE-007**: `utils/error.ts` - Enhanced error classification (TASK-045-047)
- **FILE-008**: `utils/sanitize.ts` - NoSQL injection prevention (TASK-017-019)
- **FILE-009**: `utils/firestore-helpers.ts` - Injection guards, remove sensitive logging (TASK-007, TASK-019, TASK-062)
- **FILE-010**: `hooks/use-auth-provider.tsx` - Add re-authentication support (TASK-073)

### Authentication Files

- **FILE-011**: `app/(auth)/login.tsx` - Error boundaries, rate limit handling (TASK-005, TASK-015, TASK-082)
- **FILE-012**: `app/(auth)/register/index.tsx` - Refactor, extract logic (TASK-081, TASK-083-085)
- **FILE-013**: `app/(auth)/register/step-2.tsx` - Use centralized password validator (TASK-021)
- **FILE-014**: `components/auth/login-form.tsx` - Use centralized validator (TASK-023, TASK-087)
- **FILE-015**: `app/security/change-password.tsx` - Centralized validator, biometric auth (TASK-022, TASK-074)

### New Files to Create

- **FILE-016**: `utils/logger-production.ts` - Production-safe logging with PII redaction (TASK-002)
- **FILE-017**: `utils/nosql-injection-guard.ts` - NoSQL injection prevention (TASK-017)
- **FILE-018**: `utils/password-validator.ts` - Centralized password validation (TASK-020)
- **FILE-019**: `utils/distributed-lock.ts` - Distributed locking for sync (TASK-026)
- **FILE-020**: `utils/conflict-resolver.ts` - UI for sync conflicts (TASK-029)
- **FILE-021**: `utils/cleanup-manager.ts` - Subscription registry (TASK-037)
- **FILE-022**: `utils/request-deduplicator.ts` - Request coalescing (TASK-049)
- **FILE-023**: `utils/cache-strategy.ts` - Configurable cache strategies (TASK-052)
- **FILE-024**: `utils/firestore-ready.ts` - Firestore initialization helper (TASK-061)
- **FILE-025**: `utils/re-authentication.ts` - Biometric re-auth service (TASK-073)
- **FILE-026**: `components/error/critical-error-screen.tsx` - Fatal error UI (TASK-042)
- **FILE-027**: `components/error/retry-button.tsx` - Retry with backoff UI (TASK-044)
- **FILE-028**: `components/security/re-auth-prompt.tsx` - Re-auth modal (TASK-077)
- **FILE-029**: `functions/src/middleware/rate-limit.ts` - Server-side rate limiting (TASK-009)
- **FILE-030**: `constants/security.ts` - Security constants (TASK-008)

### Configuration Files

- **FILE-031**: `tsconfig.json` - Enable strict mode (TASK-089)
- **FILE-032**: `firestore.rules` - Add rate limiting rules (TASK-016)
- **FILE-033**: `.env` - Add Sentry DSN (TASK-105)
- **FILE-034**: `package.json` - Add Sentry, TypeDoc dependencies

### Documentation Files

- **FILE-035**: `docs/api/` - Generated API documentation (TASK-104)
- **FILE-036**: `docs/adr/001-local-first-sync.md` - Architecture decision record (TASK-103)
- **FILE-037**: `docs/security/penetration-test-results.md` - Security audit findings (TASK-120)
- **FILE-038**: `docs/performance/benchmarks.md` - Performance test results (TASK-128)

## 6. Testing

### Unit Tests

- **TEST-001**: `utils/nosql-injection-guard.test.ts` - Test injection prevention patterns
- **TEST-002**: `utils/password-validator.test.ts` - Test all password validation rules
- **TEST-003**: `utils/distributed-lock.test.ts` - Test lock acquisition and release
- **TEST-004**: `utils/request-deduplicator.test.ts` - Test request coalescing
- **TEST-005**: `utils/logger-production.test.ts` - Test PII redaction in logs
- **TEST-006**: `utils/cache-strategy.test.ts` - Test SWR and cache-first strategies
- **TEST-007**: `utils/re-authentication.test.ts` - Test biometric prompt flow

### Integration Tests

- **TEST-008**: `integration/auth-flow.test.ts` - Test complete login/register flow with rate limiting
- **TEST-009**: `integration/offline-sync.test.ts` - Test sync queue persistence and recovery
- **TEST-010**: `integration/conflict-resolution.test.ts` - Test sync conflict detection and resolution
- **TEST-011**: `integration/cache-stampede.test.ts` - Test request coalescing under load
- **TEST-012**: `integration/error-boundaries.test.ts` - Test error boundary recovery

### Component Tests

- **TEST-013**: `components/error/critical-error-screen.test.tsx` - Test error screen rendering
- **TEST-014**: `components/security/re-auth-prompt.test.tsx` - Test biometric prompt
- **TEST-015**: `components/error/retry-button.test.tsx` - Test retry with exponential backoff

### E2E Tests

- **TEST-016**: `e2e/auth-security.test.ts` - Test rate limiting, injection prevention
- **TEST-017**: `e2e/offline-functionality.test.ts` - Test app behavior in airplane mode
- **TEST-018**: `e2e/biometric-auth.test.ts` - Test biometric authentication flows

### Performance Tests

- **TEST-019**: `performance/sync-load.test.ts` - Test with 1000+ items in sync queue
- **TEST-020**: `performance/cache-performance.test.ts` - Test cache with 10,000+ items
- **TEST-021**: `performance/memory-leak.test.ts` - Test for memory leaks over extended use

### Security Tests

- **TEST-022**: `security/injection-attacks.test.ts` - Automated injection attack tests
- **TEST-023**: `security/rate-limiting.test.ts` - Test rate limit enforcement
- **TEST-024**: `security/auth-bypass.test.ts` - Test for authentication bypass vulnerabilities

## 7. Risks & Assumptions

### Critical Risks

- **RISK-001**: **Firebase free tier limits may be exceeded during rate limiting implementation** - Mitigation: Implement client-side throttling as first line of defense, server-side as backup. Monitor quota usage closely.

- **RISK-002**: **Breaking changes in strict mode TypeScript refactoring** - Mitigation: Incremental migration, extensive testing, feature flags for gradual rollout.

- **RISK-003**: **Data loss during sync queue persistence migration** - Mitigation: Implement atomic migration with rollback capability. Test extensively in staging with production data snapshots.

- **RISK-004**: **Performance degradation from additional locking and validation** - Mitigation: Benchmark all changes, implement caching aggressively, use profiling to identify bottlenecks.

- **RISK-005**: **User experience disruption from new error boundaries and retry flows** - Mitigation: A/B test error UI, collect user feedback, provide clear escape hatches.

- **RISK-006**: **Biometric re-authentication causing friction in user flows** - Mitigation: Smart timeout management, remember device option, clear communication of security benefits.

- **RISK-007**: **Incompatibility with older app versions during deployment** - Mitigation: Versioned API endpoints, graceful degradation, minimum app version enforcement.

- **RISK-008**: **Insufficient testing leading to production bugs** - Mitigation: Comprehensive test suite, staged rollout (10% → 50% → 100% users), automated regression testing.

### Operational Risks

- **RISK-009**: **Team bandwidth constraints delaying implementation** - Mitigation: Prioritize critical security fixes, defer code quality improvements if needed, consider external contractors.

- **RISK-010**: **Deployment complexity with Firebase Functions and rules** - Mitigation: Automated deployment scripts, staging environment mirroring production, rollback procedures.

### Technical Assumptions

- **ASSUMPTION-001**: **Firebase SDK performance is sufficient for rate limiting** - Firestore write operations are fast enough (<100ms) for rate limit checks not to add noticeable latency.

- **ASSUMPTION-002**: **AsyncStorage can handle increased write load from queue persistence** - AsyncStorage performance is adequate for debounced writes (max 1 write/second) without blocking UI.

- **ASSUMPTION-003**: **Users will accept biometric re-authentication for sensitive operations** - User research indicates security-conscious users prefer re-authentication over account compromise risk.

- **ASSUMPTION-004**: **Network conditions will not cause excessive sync queue buildup** - Most users have reliable connectivity; offline periods are typically <1 hour. Queue size monitoring will catch edge cases.

- **ASSUMPTION-005**: **TypeScript strict mode will not reveal fundamental architecture issues** - Codebase structure is sound; type errors are primarily missing annotations rather than logic errors.

- **ASSUMPTION-006**: **Sentry free tier is sufficient for production monitoring** - Expected error volume (<10,000 events/month) fits within free tier limits. Can upgrade if needed.

- **ASSUMPTION-007**: **Team has sufficient Firebase expertise** - Team members are familiar with Firestore, Security Rules, and Cloud Functions. External training not required.

- **ASSUMPTION-008**: **Existing user data is valid and won't break with new validation** - Historical data passes current validation rules; stricter validation applies only to new inputs.

### Business Assumptions

- **ASSUMPTION-009**: **Security improvements will not significantly impact user growth** - User acquisition is primarily driven by features; security improvements are table stakes, not differentiators.

- **ASSUMPTION-010**: **Timeline is acceptable to stakeholders** - 6-week timeline for complete implementation aligns with product roadmap and business goals.

## 8. Related Specifications / Further Reading

### Internal Documentation

- [LoginX Authentication Guide](../docs/AUTHENTICATION_GUIDE.md) - Comprehensive guide to authentication flows
- [Design System Documentation](../docs/DESIGN_SYSTEM.md) - UI/UX guidelines and component library
- [Local-First Implementation Guide](../docs/LOCAL_FIRST_IMPLEMENTATION.md) - Offline sync architecture
- [Security Best Practices](../SECURITY.md) - Security guidelines and threat model
- [Constants Reference](../docs/CONSTANTS_REFERENCE.md) - Application constants and configuration

### External Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/rules-and-auth) - Official Firebase security documentation
- [OWASP Mobile Security Testing Guide](https://owasp.org/www-project-mobile-security-testing-guide/) - Mobile app security standards
- [React Native Performance Optimization](https://reactnative.dev/docs/performance) - Official performance guide
- [TypeScript Strict Mode Guide](https://www.typescriptlang.org/tsconfig#strict) - TypeScript strict configuration
- [Firestore Data Modeling Best Practices](https://firebase.google.com/docs/firestore/manage-data/structure-data) - Data modeling guidelines
- [React Error Boundaries Documentation](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) - Error boundary patterns
- [Expo Security Considerations](https://docs.expo.dev/guides/security/) - Expo-specific security guidance
- [Sentry React Native Integration](https://docs.sentry.io/platforms/react-native/) - Error tracking setup
- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check) - Abuse prevention setup
- [NoSQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) - OWASP injection prevention guide

### Academic Papers & Industry Standards

- [Local-First Software Principles](https://www.inkandswitch.com/local-first/) - Foundational paper on offline-first architecture
- [CRDTs for Sync Conflict Resolution](https://crdt.tech/) - Conflict-free replicated data types
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/rfc6749) - Authentication protocol standards
- [PCI DSS Security Standards](https://www.pcisecuritystandards.org/) - Payment card industry security (if handling payments)

---

**Plan Review Checklist:**

- [ ] All critical security issues addressed in first 3 weeks
- [ ] Each task has clear completion criteria
- [ ] Dependencies are documented and manageable
- [ ] Testing strategy covers security, performance, and functionality
- [ ] Risks are identified with mitigation strategies
- [ ] Timeline is realistic given team capacity
- [ ] Backwards compatibility is maintained
- [ ] Documentation and monitoring are included
- [ ] Stakeholder approval obtained before implementation

**Next Steps:**

1. Review and approve implementation plan with team lead and security officer
2. Set up project tracking board with all tasks (Jira, GitHub Projects, etc.)
3. Allocate resources and assign task owners
4. Create staging environment mirroring production
5. Begin Phase 1 implementation (Critical Security Fixes)
