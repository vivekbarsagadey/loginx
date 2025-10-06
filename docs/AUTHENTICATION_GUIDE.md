# LoginX Authentication Guide

**Last Updated:** October 7, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Quick Start](#-quick-start)
3. [Feature Flags Configuration](#%EF%B8%8F-feature-flags-configuration)
4. [Authentication Methods](#-authentication-methods)
5. [Login Flow](#-login-flow)
6. [Registration Flow](#-registration-flow)
7. [Security Features](#-security-features)
8. [Implementation Guide](#-implementation-guide)
9. [Troubleshooting](#-troubleshooting)
10. [Migration Guide](#-migration-guide)

---

## 📋 Overview

LoginX provides a comprehensive, secure, and user-friendly authentication system
with multiple authentication methods, robust error handling, and advanced
security features.

### Key Features

- ✅ **10 Authentication Methods** - Email/password, social OAuth, biometric,
  OTP, password reset
- ✅ **Environment-Based Configuration** - Enable/disable methods via feature
  flags
- ✅ **Multi-Step Registration** - 4-step guided registration with validation
- ✅ **Security-First** - 2FA, biometric, account lockout, session management
- ✅ **Password Recovery** - Email and SMS-based password reset functionality
- ✅ **Offline-First** - Local-first architecture with Firebase sync
- ✅ **Platform Native** - Follows iOS and Android design guidelines
- ✅ **Fully Accessible** - WCAG AA compliant with screen reader support

### Architecture Principles

- **Security First** - All sensitive data encrypted and stored securely
- **User Experience** - Smooth, intuitive flows with helpful feedback
- **Type Safety** - Full TypeScript implementation with strict types
- **Performance** - Optimized for fast load times and responsive interactions
- **Maintainability** - Clean code, well-documented, easy to extend

---

## 🚀 Quick Start

### 1. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 2. Configure Authentication Methods

Edit `.env.local` and enable desired authentication methods:

```bash
# Enable email/password authentication
ENABLE_LOGIN_EMAIL_PASSWORD="true"

# Enable social authentication
ENABLE_LOGIN_GOOGLE="true"
ENABLE_LOGIN_APPLE="true"
ENABLE_LOGIN_FACEBOOK="false"

# Enable biometric authentication
ENABLE_LOGIN_BIOMETRIC="true"

# Enable two-factor authentication
ENABLE_LOGIN_TWO_FACTOR="true"
```

### 3. Configure Firebase

Add your Firebase credentials to `.env.local`:

```bash
API_KEY="your-firebase-api-key"
AUTH_DOMAIN="your-project.firebaseapp.com"
PROJECT_ID="your-project-id"
# ... other Firebase config
```

### 4. Start Development Server

```bash
npx expo start -c
```

---

## 🎛️ Feature Flags Configuration

### Available Authentication Methods

All authentication methods can be controlled via environment variables:

```bash
# Email-Based Authentication
ENABLE_LOGIN_EMAIL_PASSWORD="true"      # Traditional email & password
ENABLE_LOGIN_EMAIL_MAGIC_LINK="true"    # Passwordless magic link
ENABLE_LOGIN_EMAIL_OTP="true"           # Email 6-digit code

# Phone Authentication
ENABLE_LOGIN_PHONE_OTP="true"           # SMS verification code

# Social Authentication
ENABLE_LOGIN_GOOGLE="true"              # Google Sign-In
ENABLE_LOGIN_APPLE="true"               # Apple Sign-In
ENABLE_LOGIN_FACEBOOK="false"           # Facebook Sign-In (default: disabled)

# Biometric & 2FA
ENABLE_LOGIN_BIOMETRIC="true"           # FaceID/TouchID/Fingerprint
ENABLE_LOGIN_TWO_FACTOR="true"          # TOTP or SMS 2FA

# Password Recovery
ENABLE_FORGOT_PASSWORD="true"           # Forgot password / password reset
```

### Configuration Flow

```
.env.local                    app.config.ts                   config.ts
──────────────────────────    ──────────────────────────────  ─────────────────────
ENABLE_LOGIN_GOOGLE="true" -> enableLoginGoogle: true     -> Config.authMethods.google
                              (camelCase transformation)      (application code)
```

### Usage in Code

```typescript
import { AuthMethod, isAuthMethodEnabled } from "@/utils/auth-methods";

// Check if method is enabled
if (isAuthMethodEnabled(AuthMethod.GOOGLE)) {
  // Show Google Sign-In button
}

// Get all enabled methods
const enabledMethods = getEnabledAuthMethods();
console.log("Available:", enabledMethods);
```

### Validation Rules

- ✅ **At least one method must be enabled**
- ✅ **Two-factor requires email/password**
- ⚠️ **Social providers require OAuth credentials**
- ⚠️ **Biometric requires device support**

---

## 🔐 Authentication Methods

### 1. Email/Password Authentication

**Status:** ✅ Production Ready

**Features:**

- Email and password sign-in
- Email validation (format, length, real-time)
- Password strength validation (8+ chars, uppercase, lowercase, number, special
  char)
- Account lockout after 5 failed attempts (15-minute cooldown)
- Email verification flow with auto-polling
- Password reset via email
- Email availability checking

**Configuration:**

```bash
ENABLE_LOGIN_EMAIL_PASSWORD="true"
```

**Files:**

- `app/(auth)/login.tsx` - Login screen
- `app/(auth)/register/step-2.tsx` - Email/password registration
- `app/(auth)/verify-email.tsx` - Email verification

---

### 2. Email Magic Link (Passwordless)

**Status:** ✅ Production Ready

**Features:**

- Passwordless authentication via email link
- Deep linking support
- Automatic sign-in on link click
- Email persistence for verification
- Resend functionality with countdown

**Configuration:**

```bash
ENABLE_LOGIN_EMAIL_MAGIC_LINK="true"
```

**Requirements:**

- Firebase Email/Password provider enabled
- Deep linking configured in app

**Files:**

- `app/(auth)/passwordless-login.tsx` - Request magic link
- `app/(auth)/verify-magic-link.tsx` - Handle link verification

---

### 3. Email OTP (One-Time Password)

**Status:** ✅ Production Ready

**Features:**

- 6-digit verification code via email
- Two-step authentication flow
- Auto-submit on code completion
- Countdown timer for resend
- Code expiration (5 minutes)

**Configuration:**

```bash
ENABLE_LOGIN_EMAIL_OTP="true"
```

**Note:** Custom implementation, requires email service setup

**Files:**

- `app/(auth)/otp-login.tsx` - Request and verify OTP

---

### 4. Phone OTP (SMS Verification)

**Status:** ⚠️ Demo Mode (Production requires SMS service)

**Features:**

- Phone number input with country code
- SMS verification code (6 digits)
- Skip option available
- Countdown timer for resend
- Demo code: `123456`

**Configuration:**

```bash
ENABLE_LOGIN_PHONE_OTP="true"
```

**Production Requirements:**

- Firebase Phone Authentication enabled
- SMS service (Twilio or Firebase SMS)
- Configure reCAPTCHA settings

**Files:**

- `app/(auth)/verify-phone.tsx` - Phone verification

---

### 5. Google Sign-In

**Status:** ✅ Production Ready

**Features:**

- Native Google account picker
- Automatic profile sync (name, email, photo)
- New user account creation
- Cross-platform support (iOS, Android, Web)
- Requires development build (not Expo Go)

**Configuration:**

```bash
ENABLE_LOGIN_GOOGLE="true"
GOOGLE_WEB_CLIENT_ID="your-web-client-id.apps.googleusercontent.com"
GOOGLE_IOS_CLIENT_ID="your-ios-client-id.apps.googleusercontent.com"
GOOGLE_ANDROID_CLIENT_ID="your-android-client-id.apps.googleusercontent.com"
```

**Setup:**

1. Enable Google provider in Firebase Console
2. Create OAuth credentials in Google Cloud Console
3. Add client IDs to `.env.local`
4. Build development version (not Expo Go)

**Files:**

- `hooks/use-social-auth.tsx` - Google Sign-In implementation

---

### 6. Apple Sign-In

**Status:** ✅ Production Ready

**Features:**

- Native iOS Sign in with Apple button
- Privacy-focused (hide email option)
- Full name and email collection
- Automatic account creation
- iOS native API (Android/Web fallback button)

**Configuration:**

```bash
ENABLE_LOGIN_APPLE="true"
```

**Requirements:**

- Apple Developer account
- Sign in with Apple capability enabled
- Required for iOS App Store if using any social auth

**Files:**

- `hooks/use-social-auth.tsx` - Apple Sign-In implementation

---

### 7. Facebook Sign-In

**Status:** ⚠️ Infrastructure Ready (Setup Required)

**Features:**

- Facebook OAuth authentication
- Profile data sync
- Automatic account creation
- Cross-platform support

**Configuration:**

```bash
ENABLE_LOGIN_FACEBOOK="true"
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_CLIENT_TOKEN="your-facebook-client-token"
```

**Setup Required:**

1. Create Facebook App in Facebook Developers Console
2. Enable Facebook provider in Firebase Console
3. Add App ID and Client Token to `.env.local`

**Files:**

- `hooks/use-social-auth.tsx` - Facebook Sign-In infrastructure

---

### 8. Biometric Authentication

**Status:** ✅ Production Ready

**Features:**

- FaceID, TouchID, Fingerprint support
- Secure credential storage
- Platform-native biometric prompts
- User opt-in required
- Fallback to password on failure

**Configuration:**

```bash
ENABLE_LOGIN_BIOMETRIC="true"
```

**User Flow:**

1. User logs in with password first
2. User enables biometric in Security Settings
3. Credentials stored securely
4. Biometric login available on login screen

**Files:**

- `hooks/use-biometric-auth.tsx` - Biometric authentication logic

---

### 9. Two-Factor Authentication (2FA)

**Status:** ✅ Production Ready

**Features:**

- Time-based OTP (TOTP)
- QR code generation for authenticator apps
- Backup codes (10 one-time use codes)
- SMS fallback option
- Remember device for 30 days

**Configuration:**

```bash
ENABLE_LOGIN_TWO_FACTOR="true"
ENABLE_LOGIN_EMAIL_PASSWORD="true"  # Required dependency
```

**Supported Authenticator Apps:**

- Google Authenticator
- Microsoft Authenticator
- Authy
- 1Password
- Any TOTP-compatible app

**Files:**

- `hooks/use-two-factor-auth.tsx` - 2FA logic
- `app/(auth)/verify-2fa.tsx` - OTP verification
- `app/security/2fa.tsx` - 2FA setup

---

### 10. Forgot Password / Password Reset

**Status:** ✅ Production Ready

**Features:**

- Email-based password recovery
- Secure Firebase reset link
- Rate limiting protection
- User-friendly error messages
- Option to disable via feature flag
- Works with SMS notification (requires Twilio)

**Configuration:**

```bash
ENABLE_FORGOT_PASSWORD="true"
ENABLE_LOGIN_EMAIL_PASSWORD="true"  # Required dependency
```

**How It Works:**

1. User clicks "Forgot Password?" on login screen
2. User enters their email address
3. Firebase sends password reset email
4. User clicks link in email
5. User sets new password
6. User redirected to login with new password

**Feature Flag Control:**

The forgot password feature can be enabled/disabled via environment variable:

- **`ENABLE_FORGOT_PASSWORD="true"`** - Shows "Forgot Password?" link on login
  screen
- **`ENABLE_FORGOT_PASSWORD="false"`** - Hides forgot password option, users
  must contact support

**Security Features:**

- Firebase secure password reset tokens
- Rate limiting prevents abuse
- Email verification required
- Token expiration (1 hour)
- Clear error handling for invalid/expired tokens

**Requirements:**

- Firebase Auth Email/Password provider enabled
- Email delivery configured in Firebase
- (Optional) Twilio for SMS notifications

**SMS Support:**

To enable SMS notifications for password resets:

```bash
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

**Error Handling:**

- User not found: Secure message (doesn't reveal if email exists)
- Invalid email format: Validation before submission
- Rate limit exceeded: Clear message with retry time
- Network errors: User-friendly error messages

**Internationalization:**

All text content supports i18n:

```json
{
  "forgotPassword": {
    "title": "Reset Password",
    "subtitle": "Enter your email to receive a reset link",
    "emailPlaceholder": "Email",
    "sendButton": "Send Reset Link",
    "sendingButton": "Sending...",
    "backToLogin": "Back to Login"
  },
  "success": {
    "passwordReset": {
      "title": "Password Reset Email Sent",
      "message": "Please check your inbox for a link to reset your password."
    }
  }
}
```

**Files:**

- `app/(auth)/forgot-password.tsx` - Password reset screen
- `app/(auth)/login.tsx` - Forgot password link (conditionally displayed)
- `utils/auth-methods.ts` - Feature flag checking

**Testing:**

1. Set `ENABLE_FORGOT_PASSWORD="true"` in `.env.local`
2. Restart development server
3. Navigate to login screen
4. Click "Forgot Password?" link
5. Enter registered email address
6. Check email for reset link
7. Click link and set new password

**Disabling the Feature:**

To disable forgot password:

1. Set `ENABLE_FORGOT_PASSWORD="false"` in `.env.local`
2. Restart development server
3. "Forgot Password?" link will not appear on login screen
4. Direct navigation to `/forgot-password` shows alert and redirects

**Support Contact:**

When forgot password is disabled, users see:

> "Password reset is currently unavailable. Please contact support for
> assistance."

---

## 🔄 Login Flow

### Basic Login Flow

```
┌─────────────────────────────────────────────────────────┐
│                    APP LAUNCH                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │ Check Auth     │
              │ State          │
              └────────┬───────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    ┌────────┐                  ┌─────────┐
    │ Logged │                  │ Not     │
    │ In     │                  │ Logged  │
    └────┬───┘                  │ In      │
         │                      └────┬────┘
         ▼                           │
    ┌────────────┐                  ▼
    │ Main App   │            ┌──────────────┐
    │ (Tabs)     │            │ Login Screen │
    └────────────┘            └──────┬───────┘
                                     │
         ┌───────────────────────────┴────────────────┐
         │                                            │
         ▼                                            ▼
    ┌─────────────────┐                      ┌──────────────┐
    │ Email/Password  │                      │ Social Sign  │
    │ Form            │                      │ In Buttons   │
    └────────┬────────┘                      └──────┬───────┘
             │                                      │
             ▼                                      ▼
    ┌─────────────────┐                   ┌────────────────┐
    │ Submit Login    │                   │ OAuth Flow     │
    └────────┬────────┘                   └────────┬───────┘
             │                                     │
             └────────────┬────────────────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │ 2FA Enabled?   │
                 └────────┬───────┘
                          │
              ┌───────────┴──────────┐
              │                      │
              ▼                      ▼
         ┌─────────┐           ┌──────────┐
         │ No      │           │ Yes      │
         └────┬────┘           └────┬─────┘
              │                     │
              ▼                     ▼
         ┌─────────┐         ┌──────────────┐
         │ Success │         │ Verify 2FA   │
         │ → Home  │         │ Code         │
         └─────────┘         └──────┬───────┘
                                    │
                                    ▼
                              ┌──────────┐
                              │ Success  │
                              │ → Home   │
                              └──────────┘
```

### Login Screen Features

1. **Email/Password Form** (if enabled)
   - Email input with validation
   - Password input with show/hide toggle
   - "Forgot Password" link
   - Submit button with loading state

2. **Alternative Methods** (if enabled)
   - Magic Link button
   - Email OTP button
   - Phone OTP button

3. **Social Sign-In** (if enabled)
   - Google button
   - Apple button
   - Facebook button

4. **Biometric Login** (if enabled and configured)
   - FaceID/TouchID/Fingerprint button
   - Only shown after user enables in settings

5. **Additional Links**
   - "Don't have an account? Sign up"
   - Terms & Privacy links

---

## 📝 Registration Flow

### 4-Step Registration Process

```
┌──────────────────────────────────────────────────────┐
│                 Registration Start                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Step 1: Personal Info │
         │ ✓ Full Name           │
         │ ✓ Profile Photo       │
         │ ✓ Terms Acceptance    │
         │ ✓ Referral Code       │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Step 2: Account Setup │
         │ ✓ Email               │
         │ ✓ Email Availability  │
         │ ✓ Password            │
         │ ✓ Password Strength   │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Step 3: Address Info  │
         │ ✓ Google Places       │
         │ ✓ Manual Entry        │
         │ ✓ Optional Skip       │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Step 4: Phone (Opt)   │
         │ ✓ Phone Number        │
         │ ✓ SMS Verification    │
         │ ✓ Optional Skip       │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Create Firebase User  │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Send Verification     │
         │ Email                 │
         └──────────┬────────────┘
                    │
                    ▼
         ┌───────────────────────┐
         │ Navigate to Email     │
         │ Verification Screen   │
         └───────────────────────┘
```

### Registration Features

#### Step 1: Personal Information

**Fields:**

- Full Name (required, 2-50 characters)
- Profile Photo (optional, camera or gallery)
- Terms & Privacy acceptance (required checkbox)
- Referral Code (optional, 6-20 alphanumeric)

**Validation:**

- Real-time validation on blur
- Name: Letters, spaces, hyphens, apostrophes only
- Photo: Max 5MB, JPG/PNG format
- Terms: Must be checked to proceed

**Files:**

- `app/(auth)/register/step-1.tsx`
- `components/ui/photo-upload.tsx`
- `components/ui/terms-checkbox.tsx`

---

#### Step 2: Account Security

**Fields:**

- Email (required, valid format)
- Password (required, 8+ chars with complexity)

**Features:**

- **Email Availability Check** - Real-time validation
- **Password Strength Meter** - Visual feedback (weak/fair/good/strong)
- **Show/Hide Password Toggle**
- **Requirements Checklist** - Shows met/unmet requirements

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Files:**

- `app/(auth)/register/step-2.tsx`
- `components/ui/password-strength-meter.tsx`
- `hooks/use-email-availability.tsx`

---

#### Step 3: Address Information

**Features:**

- **Google Places Autocomplete** - Smart address lookup
- **Manual Entry Fallback** - If API unavailable
- **Optional Step** - Can skip entirely

**Fields (Manual Entry):**

- Street Address
- City
- State/Province
- Postal Code
- Country

**Files:**

- `app/(auth)/register/step-3.tsx`
- `components/ui/address-autocomplete.tsx`

---

#### Step 4: Phone Verification

**Features:**

- Phone number with country code picker
- SMS verification (6-digit code)
- Countdown timer for resend (60 seconds)
- Optional skip

**Demo Mode:**

- Hardcoded verification code: `123456`
- No actual SMS sent in development

**Production Requirements:**

- Firebase Phone Authentication
- SMS service (Twilio or Firebase SMS)

**Files:**

- `app/(auth)/register/step-4.tsx`
- `app/(auth)/verify-phone.tsx`

---

### Registration Validation

**Form Validation:**

- Uses `react-hook-form` + `zod` schemas
- Validates on blur (onTouched mode)
- Per-step validation before proceeding
- Clear error messages

**Navigation:**

- Progress bar shows current step (1/4, 2/4, etc.)
- Back button available on all steps
- Data persists when going back
- Can resume if app closes

**Error Handling:**

- Network errors with retry
- Validation errors with inline feedback
- API errors with user-friendly messages
- Crash recovery with saved state

---

## 🔒 Security Features

### Account Protection

1. **Account Lockout**
   - 5 failed login attempts
   - 15-minute lockout duration
   - Reset on successful login
   - Persistent across app restarts

2. **Session Management**
   - Automatic session timeout (configurable)
   - Remember device option
   - Multi-device session tracking
   - Remote logout capability

3. **Password Security**
   - Minimum 8 characters
   - Complexity requirements enforced
   - Password strength indicator
   - Secure password reset flow

### Data Protection

1. **Secure Storage**
   - Credentials stored in Expo SecureStore
   - Biometric keys encrypted
   - Session tokens secured
   - No sensitive data in AsyncStorage

2. **Network Security**
   - HTTPS only communication
   - Certificate pinning (production)
   - Request/response validation
   - Rate limiting on sensitive endpoints

3. **Authentication Tokens**
   - JWT with expiration
   - Refresh token rotation
   - Token revocation support
   - Automatic token refresh

### Two-Factor Authentication

1. **Setup Process**
   - QR code generation
   - Secret key backup
   - 10 backup codes generated
   - Verification required

2. **Verification**
   - 6-digit TOTP code
   - 30-second validity window
   - Backup code fallback
   - SMS fallback option

3. **Recovery**
   - Backup codes (one-time use)
   - Email recovery option
   - Support contact for locked accounts

---

## 💻 Implementation Guide

### Adding a New Authentication Method

1. **Create Environment Variable**

```bash
# In env.d.ts
ENABLE_LOGIN_NEW_METHOD: string;
```

1. **Add to app.config.ts**

```typescript
extra: {
  enableLoginNewMethod: process.env.ENABLE_LOGIN_NEW_METHOD !== 'false',
}
```

1. **Update config.ts**

```typescript
authMethods: {
  newMethod: (extra.enableLoginNewMethod as boolean) ?? true,
}
```

1. **Add to AuthMethod Enum**

```typescript
// In utils/auth-methods.ts
export enum AuthMethod {
  NEW_METHOD = "NEW_METHOD"
  // ... existing methods
}
```

1. **Update isAuthMethodEnabled**

```typescript
case AuthMethod.NEW_METHOD:
  return Config.authMethods.newMethod;
```

1. **Add UI Component**

```typescript
// In app/(auth)/login.tsx
{isAuthMethodEnabled(AuthMethod.NEW_METHOD) && (
  <NewMethodButton onPress={handleNewMethod} />
)}
```

---

### Custom Authentication Hook

```typescript
// hooks/use-custom-auth.tsx
import { useState } from "react";
import { auth } from "@/firebase-config";

export function useCustomAuth() {
  const [loading, setLoading] = useState(false);

  const signInWithCustomMethod = async (credentials: any) => {
    setLoading(true);
    try {
      // Your authentication logic
      const userCredential = await customAuthProvider(credentials);

      // Create user profile if new
      if (userCredential.additionalUserInfo?.isNewUser) {
        await createUserProfile(userCredential.user);
      }

      return userCredential.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithCustomMethod, loading };
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### "At least one authentication method must be enabled"

**Cause:** All authentication methods are disabled in environment variables

**Solution:**

```bash
# Enable at least one method in .env.local
ENABLE_LOGIN_EMAIL_PASSWORD="true"
```

#### Google Sign-In not working

**Cause:** Missing OAuth credentials or using Expo Go

**Solution:**

1. Add credentials to `.env.local`:

   ```bash
   GOOGLE_WEB_CLIENT_ID="xxx.apps.googleusercontent.com"
   ```

1. Build development version:

   ```bash
   eas build --profile development --platform ios
   ```

#### Biometric login button not showing

**Checklist:**

- ✅ `ENABLE_LOGIN_BIOMETRIC="true"` in `.env.local`
- ✅ Device has biometric hardware
- ✅ User has enabled biometric in Security Settings
- ✅ User is not locked out

#### Changes to .env.local not taking effect

**Solution:**

```bash
# Clear cache and restart
npx expo start -c
```

---

## 🔄 Migration Guide

### From Old Variable Names

If you have existing `.env.local` with old variable names (`LOGIN_*`), update to
new convention (`ENABLE_LOGIN_*`):

**PowerShell Script:**

```powershell
# Backup your current .env.local
Copy-Item .env.local .env.local.backup

# Update variable names
(Get-Content '.env.local') `
  -replace 'LOGIN_EMAIL_PASSWORD', 'ENABLE_LOGIN_EMAIL_PASSWORD' `
  -replace 'LOGIN_EMAIL_MAGIC_LINK', 'ENABLE_LOGIN_EMAIL_MAGIC_LINK' `
  -replace 'LOGIN_EMAIL_OTP', 'ENABLE_LOGIN_EMAIL_OTP' `
  -replace 'LOGIN_PHONE_OTP', 'ENABLE_LOGIN_PHONE_OTP' `
  -replace 'LOGIN_GOOGLE', 'ENABLE_LOGIN_GOOGLE' `
  -replace 'LOGIN_APPLE', 'ENABLE_LOGIN_APPLE' `
  -replace 'LOGIN_FACEBOOK', 'ENABLE_LOGIN_FACEBOOK' `
  -replace 'LOGIN_BIOMETRIC', 'ENABLE_LOGIN_BIOMETRIC' `
  -replace 'LOGIN_TWO_FACTOR', 'ENABLE_LOGIN_TWO_FACTOR' |
  Set-Content '.env.local'
```

**Bash Script:**

```bash
# Backup
cp .env.local .env.local.backup

# Update
sed -i 's/LOGIN_EMAIL_PASSWORD/ENABLE_LOGIN_EMAIL_PASSWORD/g;
        s/LOGIN_EMAIL_MAGIC_LINK/ENABLE_LOGIN_EMAIL_MAGIC_LINK/g;
        s/LOGIN_EMAIL_OTP/ENABLE_LOGIN_EMAIL_OTP/g;
        s/LOGIN_PHONE_OTP/ENABLE_LOGIN_PHONE_OTP/g;
        s/LOGIN_GOOGLE/ENABLE_LOGIN_GOOGLE/g;
        s/LOGIN_APPLE/ENABLE_LOGIN_APPLE/g;
        s/LOGIN_FACEBOOK/ENABLE_LOGIN_FACEBOOK/g;
        s/LOGIN_BIOMETRIC/ENABLE_LOGIN_BIOMETRIC/g;
        s/LOGIN_TWO_FACTOR/ENABLE_LOGIN_TWO_FACTOR/g' .env.local
```

### Verification

After migration:

1. Clear cache: `npx expo start -c`
1. Check console logs for configuration summary
1. Verify authentication methods appear correctly in UI

---

## 📚 Related Files

### Core Authentication Files

- `app/(auth)/login.tsx` - Main login screen
- `app/(auth)/register/` - Multi-step registration
- `hooks/use-auth-provider.tsx` - Auth context provider
- `hooks/use-social-auth.tsx` - Social authentication
- `hooks/use-biometric-auth.tsx` - Biometric authentication
- `hooks/use-two-factor-auth.tsx` - 2FA implementation
- `utils/auth-methods.ts` - Authentication method utilities
- `utils/config.ts` - Configuration management

### Configuration Files

- `.env.example` - Environment template
- `app.config.ts` - Expo configuration
- `env.d.ts` - TypeScript environment definitions
- `firebase-config.ts` - Firebase initialization

### Documentation

- This file - Complete authentication guide
- `DESIGN_SYSTEM.md` - UI/UX guidelines
- `CONSTANTS_REFERENCE.md` - Constants documentation
- `SECURITY.md` - Security best practices

---

## 🎯 Best Practices

### Security

1. **Never commit** `.env.local` or credentials
2. **Use different credentials** for dev/staging/production
3. **Enable 2FA** for sensitive operations
4. **Implement rate limiting** on auth endpoints
5. **Monitor failed login attempts**
6. **Use secure password** requirements
7. **Validate on both** client and server

### User Experience

1. **Clear error messages** - No technical jargon
2. **Progressive disclosure** - Don't overwhelm users
3. **Helpful feedback** - Show what's happening
4. **Accessibility** - Support screen readers
5. **Performance** - Fast authentication flows
6. **Platform conventions** - Follow iOS/Android patterns

### Code Quality

1. **Type safety** - Use TypeScript strictly
2. **Error handling** - Try-catch everywhere
3. **Loading states** - Show feedback for async operations
4. **Validation** - Client and server-side
5. **Testing** - Unit, integration, e2e tests
6. **Documentation** - Keep docs updated

---

## ✅ Checklist for Production

### Firebase Setup

- [ ] Email/Password provider enabled
- [ ] Google provider configured (if using)
- [ ] Apple provider configured (if using)
- [ ] Phone provider configured (if using)
- [ ] Security rules deployed
- [ ] reCAPTCHA configured

### Environment Configuration

- [ ] Production `.env` file created
- [ ] All credentials configured
- [ ] Feature flags set correctly
- [ ] OAuth credentials for production
- [ ] SMS service configured (if using phone)

### Security

- [ ] 2FA implemented and tested
- [ ] Account lockout working
- [ ] Session timeout configured
- [ ] Secure storage verified
- [ ] Rate limiting enabled

### Testing

- [ ] All authentication methods tested
- [ ] Error scenarios covered
- [ ] Edge cases handled
- [ ] Accessibility tested
- [ ] Performance optimized

### Monitoring

- [ ] Error tracking (Sentry) configured
- [ ] Analytics events set up
- [ ] Failed login monitoring
- [ ] Security alerts configured

---

**Last Updated:** October 7, 2025  
**Maintained By:** LoginX Team  
**Version:** 2.0
