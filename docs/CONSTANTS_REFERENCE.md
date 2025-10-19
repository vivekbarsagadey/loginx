# Constants Reference Guide

This document provides a comprehensive list of all constants used throughout the
LoginX application and their purposes. All constants are organized by category
in the `constants/` folder for better maintainability and consistency.

## Implementation Status

All constants files have been implemented and are ready for use:

- ✅ **Accessibility Constants** - Fully implemented
- ✅ **Animation Constants** - Fully implemented
- ✅ **API Constants** - Fully implemented
- ✅ **Cache Constants** - Fully implemented
- ✅ **Firebase Constants** - Fully implemented
- ✅ **Route Constants** - Fully implemented
- ✅ **Security Constants** - Fully implemented
- ✅ **Storage Constants** - Fully implemented
- ✅ **Theme Constants** - Fully implemented
- ✅ **Validation Constants** - Fully implemented

## Table of Contents

1. [Accessibility Constants ✅](#accessibility-constants-)
2. [Animation Constants ✅](#animation-constants-)
3. [API Constants ✅](#api-constants-)
4. [Cache Constants ✅](#cache-constants-)
5. [Firebase Constants ✅](#firebase-constants-)
6. [Route Constants ✅](#route-constants-)
7. [Security Constants ✅](#security-constants-)
8. [Storage Constants ✅](#storage-constants-)
9. [Theme Constants ✅](#theme-constants-)
10. [Validation Constants ✅](#validation-constants-)
11. [**Hooks Reference** 🆕](#hooks-reference-)

---

## Accessibility Constants ✅

**File:** `constants/accessibility.ts` ✅ **Implemented**

### AccessibilityRoles ✅

Standard accessibility roles for React Native components to ensure proper screen
reader support.

| Status | Constant       | Value         | Purpose                     |
| ------ | -------------- | ------------- | --------------------------- |
| ✅     | `BUTTON`       | 'button'      | Interactive button elements |
| ✅     | `LINK`         | 'link'        | Navigation links            |
| ✅     | `TEXT`         | 'text'        | Static text content         |
| ✅     | `HEADER`       | 'header'      | Section headers             |
| ✅     | `IMAGE`        | 'image'       | Image elements              |
| ✅     | `IMAGE_BUTTON` | 'imagebutton' | Clickable images            |
| ✅     | `SEARCH`       | 'search'      | Search input fields         |
| ✅     | `ADJUSTABLE`   | 'adjustable'  | Slider/adjustable controls  |
| ✅     | `SWITCH`       | 'switch'      | Toggle switches             |
| ✅     | `TAB`          | 'tab'         | Tab navigation items        |
| ✅     | `RADIO`        | 'radio'       | Radio button inputs         |
| ✅     | `CHECKBOX`     | 'checkbox'    | Checkbox inputs             |
| ✅     | `MENU`         | 'menu'        | Menu containers             |
| ✅     | `MENU_ITEM`    | 'menuitem'    | Individual menu items       |
| ✅     | `PROGRESS_BAR` | 'progressbar' | Progress indicators         |
| ✅     | `SLIDER`       | 'slider'      | Range sliders               |
| ✅     | `SPINBUTTON`   | 'spinbutton'  | Numeric spinners            |
| ✅     | `SUMMARY`      | 'summary'     | Summary content             |
| ✅     | `TOOLBAR`      | 'toolbar'     | Toolbar containers          |

### AccessibilityStates ✅

Common accessibility state configurations for interactive elements.

| Status | Constant   | Value              | Purpose                    |
| ------ | ---------- | ------------------ | -------------------------- |
| ✅     | `DISABLED` | { disabled: true } | Disabled element state     |
| ✅     | `SELECTED` | { selected: true } | Selected element state     |
| ✅     | `CHECKED`  | { checked: true }  | Checked element state      |
| ✅     | `BUSY`     | { busy: true }     | Loading/busy state         |
| ✅     | `EXPANDED` | { expanded: true } | Expanded collapsible state |

### AccessibilityHints ✅

Standard accessibility hints to provide context for screen reader users.

| Status | Constant     | Value                    | Purpose                   |
| ------ | ------------ | ------------------------ | ------------------------- |
| ✅     | `BUTTON_TAP` | 'Double tap to activate' | General button activation |
| ✅     | `LINK_TAP`   | 'Double tap to open'     | Navigation links          |
| ✅     | `INPUT_EDIT` | 'Double tap to edit'     | Editable input fields     |
| ✅     | `TOGGLE`     | 'Double tap to toggle'   | Switch/toggle controls    |
| ✅     | `NAVIGATE`   | 'Double tap to navigate' | Navigation elements       |
| ✅     | `CLOSE`      | 'Double tap to close'    | Close/dismiss actions     |
| ✅     | `BACK`       | 'Double tap to go back'  | Back navigation           |
| ✅     | `SUBMIT`     | 'Double tap to submit'   | Form submission           |
| ✅     | `CANCEL`     | 'Double tap to cancel'   | Cancel actions            |

---

## Animation Constants ✅

**File:** `constants/animation.ts` ✅ **Implemented**

### AnimationDurations ✅

Consistent animation timing for smooth user experience (values in milliseconds).

| Status | Category               | Constant            | Value | Purpose                   |
| ------ | ---------------------- | ------------------- | ----- | ------------------------- |
| ✅     | **Micro-interactions** | `INSTANT`           | 0     | No animation              |
| ✅     |                        | `VERY_FAST`         | 100   | Instant feedback          |
| ✅     |                        | `FAST`              | 150   | Quick responses           |
| ✅     |                        | `NORMAL`            | 200   | Standard interactions     |
| ✅     |                        | `MEDIUM`            | 300   | Moderate transitions      |
| ✅     |                        | `SLOW`              | 500   | Deliberate animations     |
| ✅     |                        | `VERY_SLOW`         | 800   | Emphasis animations       |
| ✅     | **Specific**           | `BUTTON_PRESS`      | 100   | Button press feedback     |
| ✅     |                        | `TOAST_SHOW`        | 200   | Toast message appearance  |
| ✅     |                        | `MODAL_OPEN`        | 300   | Modal/dialog opening      |
| ✅     |                        | `SCREEN_TRANSITION` | 250   | Screen navigation         |
| ✅     |                        | `TAB_SWITCH`        | 150   | Tab switching             |
| ✅     |                        | `LOADING_FADE`      | 200   | Loading state changes     |
| ✅     | **Long**               | `SKELETON_SHIMMER`  | 1500  | Skeleton loading effect   |
| ✅     |                        | `PULL_REFRESH`      | 400   | Pull-to-refresh animation |
| ✅     |                        | `SWIPE_ACTION`      | 200   | Swipe gesture feedback    |

### EasingCurves ✅

Animation easing functions for natural motion feel.

| Status | Constant        | Value                           | Purpose                           |
| ------ | --------------- | ------------------------------- | --------------------------------- |
| ✅     | `LINEAR`        | 'linear'                        | Constant speed animation          |
| ✅     | `EASE`          | 'ease'                          | Natural acceleration/deceleration |
| ✅     | `EASE_IN`       | 'easeIn'                        | Slow start, fast end              |
| ✅     | `EASE_OUT`      | 'easeOut'                       | Fast start, slow end              |
| ✅     | `EASE_IN_OUT`   | 'easeInOut'                     | Slow start and end                |
| ✅     | `SPRING_CONFIG` | { damping: 15, stiffness: 150 } | Standard spring animation         |
| ✅     | `SMOOTH_SPRING` | { damping: 20, stiffness: 100 } | Gentle spring animation           |
| ✅     | `BOUNCY_SPRING` | { damping: 10, stiffness: 200 } | Bouncy spring animation           |

### UIConstants ✅

User interface layout and design constants following 8px grid system.

| Status | Category          | Constant                   | Value | Purpose                           |
| ------ | ----------------- | -------------------------- | ----- | --------------------------------- |
| ✅     | **Spacing**       | `SPACING_XS`               | 4     | Extra small spacing               |
| ✅     |                   | `SPACING_SM`               | 8     | Small spacing                     |
| ✅     |                   | `SPACING_MD`               | 16    | Medium spacing (standard)         |
| ✅     |                   | `SPACING_LG`               | 24    | Large spacing                     |
| ✅     |                   | `SPACING_XL`               | 32    | Extra large spacing               |
| ✅     |                   | `SPACING_XXL`              | 40    | Double extra large                |
| ✅     |                   | `SPACING_XXXL`             | 48    | Triple extra large                |
| ✅     | **Border Radius** | `BORDER_RADIUS_SM`         | 4     | Small corner radius               |
| ✅     |                   | `BORDER_RADIUS_MD`         | 8     | Medium corner radius              |
| ✅     |                   | `BORDER_RADIUS_LG`         | 12    | Large corner radius               |
| ✅     |                   | `BORDER_RADIUS_XL`         | 16    | Extra large radius                |
| ✅     |                   | `BORDER_RADIUS_FULL`       | 9999  | Fully rounded (circles)           |
| ✅     | **Touch Targets** | `MIN_TOUCH_TARGET`         | 44    | Minimum touch area (iOS HIG)      |
| ✅     |                   | `COMFORTABLE_TOUCH_TARGET` | 48    | Comfortable touch area (Material) |
| ✅     | **Z-Index**       | `Z_INDEX_MODAL`            | 1000  | Modal dialogs                     |
| ✅     |                   | `Z_INDEX_TOAST`            | 2000  | Toast notifications               |
| ✅     |                   | `Z_INDEX_TOOLTIP`          | 3000  | Tooltips and popovers             |
| ✅     |                   | `Z_INDEX_LOADING`          | 4000  | Loading overlays                  |
| ✅     | **Shadows**       | `SHADOW_LIGHT`             | 2     | Subtle elevation                  |
| ✅     |                   | `SHADOW_MEDIUM`            | 4     | Standard elevation                |
| ✅     |                   | `SHADOW_HEAVY`             | 8     | Prominent elevation               |
| ✅     |                   | `SHADOW_MAX`               | 16    | Maximum elevation                 |

### HapticPatterns ✅

Haptic feedback patterns for tactile user interaction.

| Status | Constant    | Value       | Purpose                           |
| ------ | ----------- | ----------- | --------------------------------- |
| ✅     | `LIGHT`     | 'light'     | Subtle feedback (selections)      |
| ✅     | `MEDIUM`    | 'medium'    | Standard feedback (actions)       |
| ✅     | `HEAVY`     | 'heavy'     | Strong feedback (errors/warnings) |
| ✅     | `SUCCESS`   | 'success'   | Success confirmation              |
| ✅     | `WARNING`   | 'warning'   | Warning notification              |
| ✅     | `ERROR`     | 'error'     | Error notification                |
| ✅     | `SELECTION` | 'selection' | Item selection feedback           |

---

## API Constants ✅

**File:** `constants/api.ts` ✅ **Implemented**

### ApiConstants ✅

Network and API configuration constants for consistent behavior.

| Status | Category        | Constant                     | Value    | Purpose                        |
| ------ | --------------- | ---------------------------- | -------- | ------------------------------ |
| ✅     | **Timeouts**    | `DEFAULT_TIMEOUT`            | 10000    | Standard API timeout (10s)     |
| ✅     |                 | `UPLOAD_TIMEOUT`             | 30000    | File upload timeout (30s)      |
| ✅     |                 | `DOWNLOAD_TIMEOUT`           | 60000    | File download timeout (60s)    |
| ✅     |                 | `WEBSOCKET_TIMEOUT`          | 5000     | WebSocket connection timeout   |
| ✅     | **Retry**       | `MAX_RETRIES`                | 3        | Maximum retry attempts         |
| ✅     |                 | `INITIAL_DELAY`              | 1000     | Initial retry delay (1s)       |
| ✅     |                 | `MAX_DELAY`                  | 10000    | Maximum retry delay (10s)      |
| ✅     |                 | `BACKOFF_MULTIPLIER`         | 2        | Exponential backoff multiplier |
| ✅     | **HTTP Status** | `HTTP_OK`                    | 200      | Success response               |
| ✅     |                 | `HTTP_CREATED`               | 201      | Resource created               |
| ✅     |                 | `HTTP_BAD_REQUEST`           | 400      | Client error                   |
| ✅     |                 | `HTTP_UNAUTHORIZED`          | 401      | Authentication required        |
| ✅     |                 | `HTTP_FORBIDDEN`             | 403      | Access denied                  |
| ✅     |                 | `HTTP_NOT_FOUND`             | 404      | Resource not found             |
| ✅     |                 | `HTTP_INTERNAL_SERVER_ERROR` | 500      | Server error                   |
| ✅     | **Limits**      | `MAX_UPLOAD_SIZE`            | 10485760 | Max upload size (10MB)         |
| ✅     |                 | `MAX_CONCURRENT_REQUESTS`    | 5        | Concurrent request limit       |

### ApiEndpoints ✅

Centralized API endpoint paths to prevent typos and maintain consistency.

| Status | Category     | Constant          | Value                        | Purpose                 |
| ------ | ------------ | ----------------- | ---------------------------- | ----------------------- |
| ✅     | **Auth**     | `LOGIN`           | '/auth/login'                | User login              |
| ✅     |              | `REGISTER`        | '/auth/register'             | User registration       |
| ✅     |              | `LOGOUT`          | '/auth/logout'               | User logout             |
| ✅     |              | `REFRESH`         | '/auth/refresh'              | Token refresh           |
| ✅     |              | `FORGOT_PASSWORD` | '/auth/forgot-password'      | Password reset request  |
| ✅     |              | `RESET_PASSWORD`  | '/auth/reset-password'       | Password reset          |
| ✅     |              | `VERIFY_EMAIL`    | '/auth/verify-email'         | Email verification      |
| ✅     |              | `VERIFY_PHONE`    | '/auth/verify-phone'         | Phone verification      |
| ✅     | **User**     | `USER_PROFILE`    | '/user/profile'              | User profile management |
| ✅     |              | `USER_SETTINGS`   | '/user/settings'             | User preferences        |
| ✅     |              | `USER_SESSIONS`   | '/user/sessions'             | Active sessions         |
| ✅     |              | `USER_DELETE`     | '/user/delete'               | Account deletion        |
| ✅     | **Security** | `ENABLE_2FA`      | '/security/2fa/enable'       | Enable two-factor auth  |
| ✅     |              | `DISABLE_2FA`     | '/security/2fa/disable'      | Disable two-factor auth |
| ✅     |              | `VERIFY_2FA`      | '/security/2fa/verify'       | Verify 2FA code         |
| ✅     |              | `BACKUP_CODES`    | '/security/2fa/backup-codes' | 2FA backup codes        |
| ✅     | **Misc**     | `FEEDBACK`        | '/feedback'                  | User feedback           |
| ✅     |              | `SUPPORT`         | '/support'                   | Support requests        |
| ✅     |              | `HEALTH_CHECK`    | '/health'                    | Service health check    |

---

## Cache Constants ✅

**File:** `constants/cache.ts` ✅ **Implemented**

### CacheConstants ✅

Cache configuration for optimal performance and memory usage.

| Status | Category      | Constant              | Value            | Purpose                        |
| ------ | ------------- | --------------------- | ---------------- | ------------------------------ |
| ✅     | **Durations** | `DEFAULT_DURATION`    | 300000           | Standard cache duration (5min) |
| ✅     |               | `SHORT_DURATION`      | 60000            | Short-lived cache (1min)       |
| ✅     |               | `MEDIUM_DURATION`     | 900000           | Medium cache duration (15min)  |
| ✅     |               | `LONG_DURATION`       | 3600000          | Long cache duration (1hr)      |
| ✅     |               | `PERSISTENT_DURATION` | 86400000         | Persistent cache (24hr)        |
| ✅     | **Limits**    | `MAX_ENTRIES`         | 1000             | Maximum cache entries          |
| ✅     |               | `MAX_MEMORY_SIZE`     | 52428800         | Max memory usage (50MB)        |
| ✅     | **Prefixes**  | `USER_PREFIX`         | 'user-'          | User-related cache keys        |
| ✅     |               | `PROFILE_PREFIX`      | 'user-profile-'  | User profile cache             |
| ✅     |               | `SETTINGS_PREFIX`     | 'user-settings-' | User settings cache            |
| ✅     |               | `SESSION_PREFIX`      | 'session-'       | Session cache                  |
| ✅     |               | `API_PREFIX`          | 'api-'           | API response cache             |

### CacheKeys ✅

Predefined cache keys for consistent caching across the app.

| Status | Constant              | Value                 | Purpose                      |
| ------ | --------------------- | --------------------- | ---------------------------- |
| ✅     | `USER_PROFILE`        | 'user-profile'        | Current user profile data    |
| ✅     | `USER_SETTINGS`       | 'user-settings'       | User preference settings     |
| ✅     | `APP_SETTINGS`        | 'app-settings'        | Application settings         |
| ✅     | `THEME_PREFERENCE`    | 'theme-preference'    | Theme selection cache        |
| ✅     | `LANGUAGE_PREFERENCE` | 'language-preference' | Language selection cache     |
| ✅     | `ONBOARDING_STATUS`   | 'onboarding-status'   | Onboarding completion status |
| ✅     | `BIOMETRIC_STATUS`    | 'biometric-status'    | Biometric availability cache |
| ✅     | `TWO_FA_STATUS`       | '2fa-status'          | Two-factor auth status cache |

---

## Firebase Constants ✅

**File:** `constants/firebase.ts` ✅ **Implemented**

### FirebaseCollections ✅

Firestore collection names to prevent typos and maintain consistency.

| Status | Constant        | Value           | Purpose                     |
| ------ | --------------- | --------------- | --------------------------- |
| ✅     | `USERS`         | 'users'         | User profile documents      |
| ✅     | `SETTINGS`      | 'settings'      | User settings documents     |
| ✅     | `SESSIONS`      | 'sessions'      | Active session documents    |
| ✅     | `FEEDBACK`      | 'feedback'      | User feedback collection    |
| ✅     | `ANALYTICS`     | 'analytics'     | Analytics events collection |
| ✅     | `NOTIFICATIONS` | 'notifications' | Notification history        |

### FirebaseConfig ✅

Firebase service configuration and limits.

| Status | Category     | Constant                  | Value       | Purpose                       |
| ------ | ------------ | ------------------------- | ----------- | ----------------------------- |
| ✅     | **Emulator** | `EMULATOR_HOST`           | 'localhost' | Local development host        |
| ✅     |              | `AUTH_EMULATOR_PORT`      | 9099        | Auth emulator port            |
| ✅     |              | `FIRESTORE_EMULATOR_PORT` | 8080        | Firestore emulator port       |
| ✅     |              | `STORAGE_EMULATOR_PORT`   | 9199        | Storage emulator port         |
| ✅     |              | `FUNCTIONS_EMULATOR_PORT` | 5001        | Functions emulator port       |
| ✅     | **Timeouts** | `CONNECTION_TIMEOUT`      | 10000       | Connection timeout (10s)      |
| ✅     |              | `RETRY_TIMEOUT`           | 30000       | Retry timeout (30s)           |
| ✅     | **Limits**   | `MAX_BATCH_SIZE`          | 500         | Maximum batch operation size  |
| ✅     |              | `MAX_COMPOUND_QUERIES`    | 10          | Max compound query conditions |

### FirestoreErrors ✅

Firestore error codes for proper error handling.

| Status | Constant              | Value                 | Purpose                       |
| ------ | --------------------- | --------------------- | ----------------------------- |
| ✅     | `PERMISSION_DENIED`   | 'permission-denied'   | Insufficient permissions      |
| ✅     | `NOT_FOUND`           | 'not-found'           | Document/collection not found |
| ✅     | `ALREADY_EXISTS`      | 'already-exists'      | Document already exists       |
| ✅     | `RESOURCE_EXHAUSTED`  | 'resource-exhausted'  | Quota exceeded                |
| ✅     | `FAILED_PRECONDITION` | 'failed-precondition' | Precondition failed           |
| ✅     | `ABORTED`             | 'aborted'             | Transaction aborted           |
| ✅     | `OUT_OF_RANGE`        | 'out-of-range'        | Value out of valid range      |
| ✅     | `UNIMPLEMENTED`       | 'unimplemented'       | Feature not implemented       |
| ✅     | `INTERNAL`            | 'internal'            | Internal server error         |
| ✅     | `UNAVAILABLE`         | 'unavailable'         | Service unavailable           |
| ✅     | `DATA_LOSS`           | 'data-loss'           | Unrecoverable data loss       |
| ✅     | `UNAUTHENTICATED`     | 'unauthenticated'     | Authentication required       |

---

## Route Constants ✅

**File:** `constants/routes.ts` ✅ **Implemented**

### Routes ✅

Application route paths organized by feature for consistent navigation.

| Status | Category       | Constant                   | Value                       | Purpose                |
| ------ | -------------- | -------------------------- | --------------------------- | ---------------------- |
| ✅     | **Auth**       | `AUTH.WELCOME`             | '/(auth)/welcome'           | Welcome/landing screen |
| ✅     |                | `AUTH.LOGIN`               | '/(auth)/login'             | Login screen           |
| ✅     |                | `AUTH.REGISTER`            | '/(auth)/register'          | Registration screen    |
| ✅     |                | `AUTH.REGISTER_STEP_1`     | '/(auth)/register/step-1'   | Registration step 1    |
| ✅     |                | `AUTH.REGISTER_STEP_2`     | '/(auth)/register/step-2'   | Registration step 2    |
| ✅     |                | `AUTH.REGISTER_STEP_3`     | '/(auth)/register/step-3'   | Registration step 3    |
| ✅     |                | `AUTH.FORGOT_PASSWORD`     | '/(auth)/forgot-password'   | Password recovery      |
| ✅     |                | `AUTH.VERIFY_EMAIL`        | '/(auth)/verify-email'      | Email verification     |
| ✅     | **Tabs**       | `TABS.HOME`                | '/(tabs)'                   | Main dashboard         |
| ✅     |                | `TABS.ITEMS`               | '/(tabs)/items'             | Items management       |
| ✅     |                | `TABS.SETTINGS`            | '/(tabs)/settings'          | Settings screen        |
| ✅     | **Onboarding** | `ONBOARDING.INDEX`         | '/onboarding'               | App onboarding flow    |
| ✅     | **Profile**    | `PROFILE.EDIT`             | '/profile/edit'             | Edit profile           |
| ✅     |                | `PROFILE.UPDATE_EMAIL`     | '/profile/update-email'     | Change email           |
| ✅     | **Security**   | `SECURITY.CHANGE_PASSWORD` | '/security/change-password' | Change password        |
| ✅     |                | `SECURITY.TWO_FACTOR`      | '/security/2fa'             | Two-factor auth setup  |
| ✅     |                | `SECURITY.SESSIONS`        | '/security/sessions'        | Active sessions        |
| ✅     | **Settings**   | `SETTINGS.THEME`           | '/settings/theme'           | Theme selection        |
| ✅     |                | `SETTINGS.LANGUAGE`        | '/settings/language'        | Language selection     |
| ✅     |                | `SETTINGS.NOTIFICATIONS`   | '/settings/notifications'   | Notification settings  |
| ✅     |                | `SETTINGS.TEXT_SIZE`       | '/settings/text-size'       | Text size settings     |
| ✅     | **Legal**      | `LEGAL.TERMS`              | '/legal/terms'              | Terms of service       |
| ✅     |                | `LEGAL.PRIVACY`            | '/legal/privacy'            | Privacy policy         |
| ✅     |                | `LEGAL.LICENSE`            | '/legal/license'            | Software license       |
| ✅     | **About**      | `ABOUT.WHATS_NEW`          | '/about/whats-new'          | What's new screen      |
| ✅     | **Other**      | `HELP`                     | '/help'                     | Help center            |
| ✅     |                | `SUPPORT`                  | '/support'                  | Contact support        |
| ✅     |                | `FEEDBACK`                 | '/feedback'                 | Send feedback          |
| ✅     |                | `PRIVACY_STANDALONE`       | '/privacy'                  | Standalone privacy     |
| ✅     |                | `MODAL`                    | '/modal'                    | Modal dialog           |
| ✅     |                | `NOT_FOUND`                | '+not-found'                | 404 error screen       |

---

## Security Constants ✅

**File:** `constants/security.ts` ✅ **Implemented**

### SecurityConstants ✅

Security configuration for authentication and session management.

| Status | Category      | Constant                     | Value      | Purpose                        |
| ------ | ------------- | ---------------------------- | ---------- | ------------------------------ |
| ✅     | **Sessions**  | `SESSION_TIMEOUT`            | 1800000    | Session timeout (30min)        |
| ✅     |               | `REMEMBER_ME_DURATION`       | 2592000000 | Remember me duration (30 days) |
| ✅     |               | `AUTO_LOCK_TIMEOUT`          | 300000     | Auto-lock timeout (5min)       |
| ✅     | **Login**     | `MAX_LOGIN_ATTEMPTS`         | 5          | Max failed login attempts      |
| ✅     |               | `LOGIN_LOCKOUT_DURATION`     | 900000     | Lockout duration (15min)       |
| ✅     | **Password**  | `PASSWORD_HISTORY_COUNT`     | 5          | Password history limit         |
| ✅     | **2FA**       | `TWO_FA_CODE_LENGTH`         | 6          | 2FA code digit count           |
| ✅     |               | `TWO_FA_CODE_VALIDITY`       | 30000      | 2FA code validity (30s)        |
| ✅     |               | `BACKUP_CODES_COUNT`         | 10         | Number of backup codes         |
| ✅     | **Biometric** | `BIOMETRIC_RETRY_LIMIT`      | 3          | Max biometric attempts         |
| ✅     |               | `BIOMETRIC_LOCKOUT_DURATION` | 30000      | Biometric lockout (30s)        |

### BiometricTypes ✅

Supported biometric authentication types.

| Status | Constant      | Value         | Purpose                    |
| ------ | ------------- | ------------- | -------------------------- |
| ✅     | `FINGERPRINT` | 'fingerprint' | Fingerprint authentication |
| ✅     | `FACE_ID`     | 'faceId'      | Face ID authentication     |
| ✅     | `TOUCH_ID`    | 'touchId'     | Touch ID authentication    |
| ✅     | `VOICE`       | 'voice'       | Voice authentication       |
| ✅     | `IRIS`        | 'iris'        | Iris scanning              |

### SecurityMessages ✅

User-friendly security-related messages.

| Status | Constant                  | Value                                                              | Purpose                   |
| ------ | ------------------------- | ------------------------------------------------------------------ | ------------------------- |
| ✅     | `BIOMETRIC_NOT_AVAILABLE` | 'Biometric authentication is not available on this device'         | Device capability message |
| ✅     | `BIOMETRIC_NOT_ENROLLED`  | 'No biometric credentials are enrolled'                            | Setup required message    |
| ✅     | `BIOMETRIC_LOCKED_OUT`    | 'Too many failed attempts. Try again later.'                       | Lockout notification      |
| ✅     | `SESSION_EXPIRED`         | 'Your session has expired. Please log in again.'                   | Session timeout message   |
| ✅     | `ACCOUNT_LOCKED`          | 'Account temporarily locked due to multiple failed login attempts' | Account lockout message   |
| ✅     | `PASSWORD_REUSED`         | 'Please choose a password you haven\'t used recently'              | Password policy message   |
| ✅     | `TWO_FA_REQUIRED`         | 'Two-factor authentication is required'                            | 2FA requirement message   |
| ✅     | `TWO_FA_INVALID`          | 'Invalid two-factor authentication code'                           | 2FA error message         |

---

## Storage Constants ✅

**File:** `constants/storage.ts` ✅ **Implemented**

### StorageKeys ✅

Local storage keys for user preferences and app state.

| Status | Category          | Constant                  | Value                     | Purpose                        |
| ------ | ----------------- | ------------------------- | ------------------------- | ------------------------------ |
| ✅     | **Preferences**   | `THEME_PREFERENCE`        | 'theme_preference'        | User theme selection           |
| ✅     |                   | `LANGUAGE_PREFERENCE`     | 'language_preference'     | User language selection        |
| ✅     |                   | `TEXT_SIZE_PREFERENCE`    | 'text_size_preference'    | User text size setting         |
| ✅     | **App State**     | `ONBOARDING_COMPLETED`    | 'onboarding_completed'    | Onboarding completion flag     |
| ✅     |                   | `APP_VERSION`             | 'app_version'             | Last used app version          |
| ✅     |                   | `LAST_LOGIN`              | 'last_login'              | Last login timestamp           |
| ✅     | **Notifications** | `PUSH_NOTIFICATIONS`      | 'push_notifications'      | Push notification setting      |
| ✅     |                   | `EMAIL_NOTIFICATIONS`     | 'email_notifications'     | Email notification setting     |
| ✅     |                   | `MARKETING_NOTIFICATIONS` | 'marketing_notifications' | Marketing email setting        |
| ✅     | **Cache**         | `CACHE_VERSION`           | 'cache_version'           | Cache version for invalidation |
| ✅     |                   | `TEMP_USER_DATA`          | 'temp_user_data'          | Temporary user data            |

### SecureStorageKeys ✅

Secure storage keys for sensitive data encryption.

| Status | Category      | Constant                 | Value                    | Purpose                     |
| ------ | ------------- | ------------------------ | ------------------------ | --------------------------- |
| ✅     | **Biometric** | `BIOMETRIC_ENABLED`      | 'biometric_enabled'      | Biometric auth enabled flag |
| ✅     |               | `BIOMETRIC_TYPE`         | 'biometric_type'         | Type of biometric auth      |
| ✅     | **2FA**       | `TWO_FA_ENABLED`         | '2fa_enabled'            | 2FA enabled flag            |
| ✅     |               | `TWO_FA_BACKUP_CODES`    | '2fa_backup_codes'       | 2FA backup codes            |
| ✅     |               | `TWO_FA_SECRET`          | '2fa_secret'             | 2FA secret key              |
| ✅     | **Security**  | `AUTO_LOCK_ENABLED`      | 'auto_lock_enabled'      | Auto-lock enabled flag      |
| ✅     |               | `AUTO_LOCK_TIMEOUT`      | 'auto_lock_timeout'      | Auto-lock timeout value     |
| ✅     |               | `SECURITY_NOTIFICATIONS` | 'security_notifications' | Security alert settings     |
| ✅     |               | `LOGIN_ATTEMPTS`         | 'login_attempts'         | Failed login attempt count  |
| ✅     | **Session**   | `REFRESH_TOKEN`          | 'refresh_token'          | Auth refresh token          |
| ✅     |               | `DEVICE_ID`              | 'device_id'              | Unique device identifier    |

### FileConstants ✅

File handling and storage limitations.

| Status | Category        | Constant                   | Value                          | Purpose                    |
| ------ | --------------- | -------------------------- | ------------------------------ | -------------------------- |
| ✅     | **Size Limits** | `MAX_AVATAR_SIZE`          | 5242880                        | Max avatar file size (5MB) |
| ✅     |                 | `MAX_DOCUMENT_SIZE`        | 10485760                       | Max document size (10MB)   |
| ✅     |                 | `MAX_IMAGE_SIZE`           | 5242880                        | Max image file size (5MB)  |
| ✅     | **Dimensions**  | `AVATAR_SIZE`              | 200                            | Avatar image size (200px)  |
| ✅     |                 | `THUMBNAIL_SIZE`           | 100                            | Thumbnail size (100px)     |
| ✅     | **File Types**  | `SUPPORTED_IMAGE_TYPES`    | ['jpg', 'jpeg', 'png', 'webp'] | Allowed image formats      |
| ✅     |                 | `SUPPORTED_DOCUMENT_TYPES` | ['pdf', 'doc', 'docx', 'txt']  | Allowed document formats   |

### DeviceConstants ✅

Device capability and performance thresholds.

| Status | Category         | Constant                     | Value      | Purpose                        |
| ------ | ---------------- | ---------------------------- | ---------- | ------------------------------ |
| ✅     | **Screen Sizes** | `SMALL_SCREEN`               | 480        | Small screen breakpoint        |
| ✅     |                  | `MEDIUM_SCREEN`              | 768        | Medium screen breakpoint       |
| ✅     |                  | `LARGE_SCREEN`               | 1024       | Large screen breakpoint        |
| ✅     | **Performance**  | `LOW_MEMORY_THRESHOLD`       | 1073741824 | Low memory threshold (1GB)     |
| ✅     |                  | `SLOW_DEVICE_THRESHOLD`      | 2000       | Slow device threshold (2s)     |
| ✅     | **Battery**      | `LOW_BATTERY_THRESHOLD`      | 20         | Low battery warning (20%)      |
| ✅     |                  | `CRITICAL_BATTERY_THRESHOLD` | 10         | Critical battery warning (10%) |

---

## Theme Constants ✅

**File:** `constants/theme.ts` ✅ **Implemented**

### Colors

Application color palette supporting light and dark themes.

#### Light Theme ✅

| Status | Token             | Value   | Purpose                     |
| ------ | ----------------- | ------- | --------------------------- |
| ✅     | `bg`              | #FFFFFF | Main background             |
| ✅     | `bg-elevated`     | #FFFFFF | Elevated surface background |
| ✅     | `surface`         | #FFFFFF | Card/surface background     |
| ✅     | `surface-variant` | #F6F7FA | Alternative surface         |
| ✅     | `text`            | #111827 | Primary text                |
| ✅     | `text-muted`      | #6B7280 | Secondary text              |
| ✅     | `inverse-text`    | #F9FAFB | Inverse text (on dark)      |
| ✅     | `primary`         | #2563EB | Primary brand color         |
| ✅     | `on-primary`      | #FFFFFF | Text on primary             |
| ✅     | `border`          | #E5E7EB | Standard borders            |
| ✅     | `border-strong`   | #9CA3AF | Emphasized borders          |
| ✅     | `success`         | #16A34A | Success states              |
| ✅     | `warning`         | #D97706 | Warning states              |
| ✅     | `error`           | #DC2626 | Error states                |
| ✅     | `info`            | #2563EB | Information states          |

#### Dark Theme ✅

| Status | Token             | Value   | Purpose                     |
| ------ | ----------------- | ------- | --------------------------- |
| ✅     | `bg`              | #0B1220 | Main background             |
| ✅     | `bg-elevated`     | #111827 | Elevated surface background |
| ✅     | `surface`         | #111827 | Card/surface background     |
| ✅     | `surface-variant` | #0F172A | Alternative surface         |
| ✅     | `text`            | #F9FAFB | Primary text                |
| ✅     | `text-muted`      | #94A3B8 | Secondary text              |
| ✅     | `inverse-text`    | #111827 | Inverse text (on light)     |
| ✅     | `primary`         | #60A5FA | Primary brand color         |
| ✅     | `on-primary`      | #0B1220 | Text on primary             |
| ✅     | `border`          | #1F2937 | Standard borders            |
| ✅     | `border-strong`   | #4B5563 | Emphasized borders          |
| ✅     | `success`         | #34D399 | Success states              |
| ✅     | `warning`         | #FBBF24 | Warning states              |
| ✅     | `error`           | #F87171 | Error states                |
| ✅     | `info`            | #60A5FA | Information states          |

#### Legacy Aliases (for compatibility)

Both themes include legacy aliases for backward compatibility:

- `background`, `tint`, `icon`, `tabIconDefault`, `tabIconSelected`

---

## Validation Constants ✅

**File:** `constants/validation.ts` ✅ **Implemented**

### ValidationConstants ✅

Input validation rules and limits for forms.

| Status | Category     | Constant              | Value                     | Purpose                     |
| ------ | ------------ | --------------------- | ------------------------- | --------------------------- |
| ✅     | **Password** | `PASSWORD_MIN_LENGTH` | 8                         | Minimum password length     |
| ✅     |              | `PASSWORD_MAX_LENGTH` | 128                       | Maximum password length     |
| ✅     |              | `PASSWORD_REGEX`      | `/^[a-zA-Z0-9@$!%*?&]*$/` | Allowed password characters |
| ✅     | **Name**     | `NAME_MIN_LENGTH`     | 2                         | Minimum name length         |
| ✅     |              | `NAME_MAX_LENGTH`     | 50                        | Maximum name length         |
| ✅     | **Email**    | `EMAIL_MAX_LENGTH`    | 254                       | Maximum email length        |
| ✅     | **Age**      | `MIN_AGE`             | 13                        | Minimum user age            |
| ✅     |              | `MAX_AGE`             | 120                       | Maximum user age            |
| ✅     | **Phone**    | `PHONE_MIN_LENGTH`    | 10                        | Minimum phone length        |
| ✅     |              | `PHONE_MAX_LENGTH`    | 15                        | Maximum phone length        |
| ✅     | **Text**     | `TEXT_SHORT_MAX`      | 100                       | Short text limit            |
| ✅     |              | `TEXT_MEDIUM_MAX`     | 500                       | Medium text limit           |
| ✅     |              | `TEXT_LONG_MAX`       | 2000                      | Long text limit             |

### ValidationMessages ✅

User-friendly validation error messages.

| Status | Constant                 | Value                                                                             | Purpose                  |
| ------ | ------------------------ | --------------------------------------------------------------------------------- | ------------------------ |
| ✅     | `REQUIRED`               | 'This field is required'                                                          | Required field error     |
| ✅     | `INVALID_EMAIL`          | 'Please enter a valid email address'                                              | Email format error       |
| ✅     | `PASSWORD_TOO_SHORT`     | `Password must be at least ${ValidationConstants.PASSWORD_MIN_LENGTH} characters` | Password length error    |
| ✅     | `PASSWORD_TOO_LONG`      | `Password must not exceed ${ValidationConstants.PASSWORD_MAX_LENGTH} characters`  | Password length error    |
| ✅     | `PASSWORD_INVALID_CHARS` | 'Password contains invalid characters'                                            | Password character error |
| ✅     | `NAME_TOO_SHORT`         | `Name must be at least ${ValidationConstants.NAME_MIN_LENGTH} characters`         | Name length error        |
| ✅     | `NAME_TOO_LONG`          | `Name must not exceed ${ValidationConstants.NAME_MAX_LENGTH} characters`          | Name length error        |
| ✅     | `AGE_TOO_LOW`            | `You must be at least ${ValidationConstants.MIN_AGE} years old`                   | Age validation error     |
| ✅     | `AGE_TOO_HIGH`           | `Age must not exceed ${ValidationConstants.MAX_AGE} years`                        | Age validation error     |
| ✅     | `INVALID_PHONE`          | 'Please enter a valid phone number'                                               | Phone format error       |

---

## Usage Guidelines

### Best Practices

1. **Import from Index**: Always import constants from the main index file:

   ```typescript
   import { Routes, ValidationConstants, Colors } from "@/constants";
   ```

2. **Type Safety**: All constants use `as const` assertion for literal types.

3. **Naming Conventions**:
   - Constants: `UPPER_SNAKE_CASE`
   - Objects: `PascalCase`
   - Values: Descriptive and consistent

4. **Documentation**: Each constant file includes JSDoc comments explaining
   purpose.

5. **Organization**: Constants are grouped by feature and functionality.

### Adding New Constants

When adding new constants:

1. Choose the appropriate category file
2. Follow existing naming conventions
3. Add JSDoc documentation
4. Update this reference document
5. Export from the main index file

### Maintenance

- Review constants quarterly for unused items
- Consolidate similar constants across files
- Update documentation when constants change
- Ensure type safety with TypeScript

---

## Summary

✅ **All constants files have been implemented and are ready for use.**

- **Total constants files**: 10
- **Implemented**: 10
- **Not implemented**: 0
- **Implementation rate**: 100%

All constants have been organized following TypeScript best practices with
proper typing and documentation. They are exported from a centralized index file
for easy importing throughout the application.

---

## Hooks Reference 🆕

**Location:** `hooks/` directory (10 categories)

LoginX now includes a comprehensive custom hooks library with 40+ production-ready hooks organized into logical categories. For detailed documentation, see **[HOOKS_REFERENCE.md](./HOOKS_REFERENCE.md)**.

### Hook Categories

| Category           | Location           | Hooks Count | Purpose                                              |
| ------------------ | ------------------ | ----------- | ---------------------------------------------------- |
| **Authentication** | `hooks/auth/`      | 9           | User authentication, verification, 2FA, biometric    |
| **Async**          | `hooks/async/`     | 3           | Async operations, fetch, infinite scroll             |
| **UI**             | `hooks/ui/`        | 9           | UI interactions, modals, gestures, keyboard          |
| **Layout**         | `hooks/layout/`    | 1           | Responsive design utilities                          |
| **Device**         | `hooks/device/`    | 5           | App state, battery, location, network, accessibility |
| **Theme**          | `hooks/theme/`     | 6           | Theme management and styling                         |
| **Lifecycle**      | `hooks/lifecycle/` | 6           | Component lifecycle utilities                        |
| **Utility**        | `hooks/utility/`   | 8           | State management, error handling, notifications      |
| **Storage**        | `hooks/storage/`   | 3           | Local, secure, and async storage wrappers            |
| **Timing**         | `hooks/timing/`    | 4           | Debounce, throttle, interval, timeout                |

### Quick Import Examples

```typescript
// Category-based import (recommended)
import { useToggle, useCounter, useList } from "@/hooks/utility";
import { useTheme, useThemeProvider } from "@/hooks/theme";
import { useAppState, useBattery, useGeolocation } from "@/hooks/device";

// Individual hook import
import { useAsync } from "@/hooks/async/use-async";
import { useKeyboard } from "@/hooks/ui/use-keyboard";

// Barrel import (backward compatible)
import { useTheme, useAsync, useToggle } from "@/hooks";
```

### Featured Hooks

#### State Management

- `useToggle` - Boolean toggle with setValue
- `useCounter` - Counter with min/max bounds
- `useList` - Array manipulation utilities (16 methods)
- `useMap` - Map data structure management

#### UI Interactions

- `useClickOutside` - Detect taps outside component
- `useLongPress` - Long press with haptic feedback
- `useKeyboard` - Keyboard visibility tracking
- `useModal` - Modal state management

#### Device APIs

- `useAppState` - Foreground/background tracking
- `useBattery` - Battery level and charging state
- `useGeolocation` - Location tracking with permissions
- `useNetworkStatus` - Network connectivity monitoring

#### Storage

- `useLocalStorage` - AsyncStorage with React state
- `useSecureStorage` - Encrypted SecureStore wrapper
- `useAsyncStorage` - Enhanced storage with TTL caching

#### Timing

- `useDebouncedCallback` - Delay execution until idle
- `useThrottledCallback` - Limit execution frequency
- `useInterval` - Declarative setInterval
- `useTimeout` - Declarative setTimeout

### TypeScript Support

All hooks are fully typed with comprehensive interfaces:

```typescript
import { useCounter } from "@/hooks/utility";
import type { UseCounterOptions, UseCounterReturn } from "@/hooks/utility";

import { useGeolocation } from "@/hooks/device";
import type { LocationCoordinates, GeolocationState, UseGeolocationOptions } from "@/hooks/device";
```

### Documentation

For complete hook documentation including:

- Detailed API references
- Usage examples for each hook
- TypeScript type definitions
- Best practices and patterns
- Performance tips
- Troubleshooting guide
- Migration examples

**See:** [HOOKS_REFERENCE.md](./HOOKS_REFERENCE.md)

---

Last updated: October 19, 2025  
Implementation status verified: October 19, 2025  
Hooks library added: October 19, 2025
